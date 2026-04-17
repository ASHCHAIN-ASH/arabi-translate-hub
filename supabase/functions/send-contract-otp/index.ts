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
      .select("id, contract_number, title, client_full_name, client_email, customer_id, user_id")
      .eq("id", contract_id)
      .single();

    if (cErr || !contract) {
      return new Response(JSON.stringify({ error: "العقد غير موجود" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve recipient email — try multiple sources
    let recipient: string | null =
      (typeof override_email === "string" && override_email.trim()) ||
      contract.client_email ||
      null;

    if (!recipient && contract.customer_id) {
      const { data: cust } = await supabase
        .from("customers").select("email").eq("id", contract.customer_id).maybeSingle();
      if (cust?.email) recipient = cust.email;
    }

    if (!recipient && contract.user_id) {
      try {
        const { data: ures } = await supabase.auth.admin.getUserById(contract.user_id);
        if (ures?.user?.email) recipient = ures.user.email;
      } catch (_) { /* ignore */ }
    }

    if (!recipient) {
      return new Response(JSON.stringify({
        error: "لا يوجد بريد إلكتروني مسجل لهذا العقد. يرجى تحديث بيانات العميل من لوحة الإدارة.",
        code: "NO_EMAIL",
      }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Persist resolved email back onto contract for downstream use
    if (!contract.client_email) {
      await supabase.from("contracts")
        .update({ client_email: recipient })
        .eq("id", contract_id);
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const code_hash = await sha256(code);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate previous codes
    await supabase
      .from("contract_otp_codes")
      .update({ used: true })
      .eq("contract_id", contract_id)
      .eq("email", recipient)
      .eq("used", false);

    const { error: insErr } = await supabase.from("contract_otp_codes").insert({
      contract_id, email: recipient, code_hash, expires_at,
    });
    if (insErr) throw insErr;

    // Send via transactional email (do not fail if email gateway hiccups)
    let mailDelivered = true;
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
      if (mailErr) { mailDelivered = false; console.error("transactional email error:", mailErr); }
    } catch (mailErr) {
      mailDelivered = false;
      console.error("email send (non-blocking):", mailErr);
    }

    console.log(`[contract-otp] code generated for ${recipient} (contract ${contract.contract_number}) delivered=${mailDelivered}`);

    return new Response(
      JSON.stringify({
        success: true,
        delivered: mailDelivered,
        message: mailDelivered
          ? "تم إرسال رمز التحقق إلى بريدك الإلكتروني"
          : "تم توليد رمز التحقق — قد يتأخر وصوله بضع دقائق",
        masked_email: recipient.replace(/(.{2}).+(@.+)/, "$1***$2"),
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
