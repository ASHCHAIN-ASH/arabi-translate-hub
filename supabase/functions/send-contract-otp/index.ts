import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { contract_id, override_email } = await req.json();
    if (!contract_id) {
      return new Response(JSON.stringify({ error: "contract_id مطلوب" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load contract
    const { data: contract, error: cErr } = await supabase
      .from("contracts")
      .select("id, contract_number, title, client_full_name, client_email, client_phone, customer_id, user_id")
      .eq("id", contract_id)
      .single();

    if (cErr || !contract) {
      return new Response(JSON.stringify({ error: "العقد غير موجود" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve recipient — email and/or phone
    let recipient: string | null =
      (typeof override_email === "string" && override_email.trim()) ||
      contract.client_email ||
      null;
    let recipientPhone: string | null = contract.client_phone || null;

    // Detect WhatsApp-only users (email is synthetic placeholder)
    const isWhatsappEmail = (e: string | null) =>
      !!e && /@whatsapp\.local$/i.test(e);

    if (!recipient && contract.customer_id) {
      const { data: cust } = await supabase
        .from("customers").select("email, phone").eq("id", contract.customer_id).maybeSingle();
      if (cust?.email) recipient = cust.email;
      if (!recipientPhone && cust?.phone) recipientPhone = cust.phone;
    }

    if (!recipientPhone && contract.user_id) {
      // Try profiles for phone
      const { data: prof } = await supabase
        .from("profiles").select("phone").eq("user_id", contract.user_id).maybeSingle();
      if (prof?.phone) recipientPhone = prof.phone;
    }

    if (!recipient && contract.user_id) {
      try {
        const { data: ures } = await supabase.auth.admin.getUserById(contract.user_id);
        if (ures?.user?.email) recipient = ures.user.email;
        const phoneFromMeta = (ures?.user?.user_metadata as any)?.phone;
        if (!recipientPhone && phoneFromMeta) recipientPhone = phoneFromMeta;
      } catch (_) { /* ignore */ }
    }

    // If email is the synthetic whatsapp.local placeholder, derive phone from it
    if (isWhatsappEmail(recipient) && !recipientPhone) {
      const m = recipient!.match(/^wa_(\d+)@/i);
      if (m) recipientPhone = m[1];
    }

    const useWhatsapp = !!recipientPhone && (!recipient || isWhatsappEmail(recipient));

    if (!recipient && !recipientPhone) {
      return new Response(JSON.stringify({
        error: "لا يوجد بريد إلكتروني أو رقم جوال مسجل لهذا العقد. يرجى تحديث بيانات العميل.",
        code: "NO_CONTACT",
      }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use phone as the OTP key if we're sending via WhatsApp (so email column stays consistent)
    const otpKey = useWhatsapp ? `wa:${recipientPhone}` : recipient!;

    // Persist resolved email back onto contract for downstream use (only real emails)
    if (!contract.client_email && recipient && !isWhatsappEmail(recipient)) {
      await supabase.from("contracts")
        .update({ client_email: recipient })
        .eq("id", contract_id);
    }
    if (!contract.client_phone && recipientPhone) {
      await supabase.from("contracts")
        .update({ client_phone: recipientPhone })
        .eq("id", contract_id);
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code_hash = await sha256(code);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate previous codes for this contact
    await supabase
      .from("contract_otp_codes")
      .update({ used: true })
      .eq("contract_id", contract_id)
      .eq("email", otpKey)
      .eq("used", false);

    const { error: insErr } = await supabase.from("contract_otp_codes").insert({
      contract_id, email: otpKey, code_hash, expires_at,
    });
    if (insErr) throw insErr;

    let delivered = false;
    let channel: "whatsapp" | "email" = useWhatsapp ? "whatsapp" : "email";
    let masked = "";

    if (useWhatsapp) {
      // Send via WhatsApp
      try {
        const { error: waErr } = await supabase.functions.invoke("whatsapp-send", {
          body: {
            to: recipientPhone,
            event_key: "contract_otp",
            variables: {
              client_name: contract.client_full_name || "عميلنا الكريم",
              contract_number: contract.contract_number,
              otp_code: code,
              expires_in: "10",
            },
            related_entity_type: "contract",
            related_entity_id: contract_id,
            user_id: contract.user_id,
          },
        });
        if (waErr) { console.error("whatsapp-send error:", waErr); }
        else { delivered = true; }
      } catch (waErr) {
        console.error("whatsapp send (non-blocking):", waErr);
      }
      masked = recipientPhone!.replace(/(\d{3})\d+(\d{2})/, "$1****$2");
    } else {
      // Send via email
      try {
        const { error: mailErr } = await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "contract-otp",
            recipientEmail: recipient,
            idempotencyKey: `contract-otp-${contract_id}-${Date.now()}`,
            templateData: {
              clientName: contract.client_full_name || "عميلنا الكريم",
              contractNumber: contract.contract_number,
              contractTitle: contract.title,
              otpCode: code,
              expiresInMinutes: 10,
            },
          },
        });
        if (mailErr) { console.error("transactional email error:", mailErr); }
        else { delivered = true; }
      } catch (mailErr) {
        console.error("email send (non-blocking):", mailErr);
      }
      masked = recipient!.replace(/(.{2}).+(@.+)/, "$1***$2");
    }

    console.log(`[contract-otp] code generated via ${channel} for contract ${contract.contract_number} delivered=${delivered}`);

    return new Response(
      JSON.stringify({
        success: true,
        delivered,
        channel,
        message: channel === "whatsapp"
          ? (delivered ? "تم إرسال رمز التحقق إلى واتساب" : "تم توليد الرمز — قد يتأخر وصوله بضع دقائق")
          : (delivered ? "تم إرسال رمز التحقق إلى بريدك الإلكتروني" : "تم توليد رمز التحقق — قد يتأخر وصوله بضع دقائق"),
        masked_recipient: masked,
        masked_email: masked,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err: any) {
    console.error("send-contract-otp error:", err);
    return new Response(JSON.stringify({ error: err.message || "خطأ غير متوقع" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
