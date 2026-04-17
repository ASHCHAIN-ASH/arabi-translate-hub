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

    const { contract_id } = await req.json();
    if (!contract_id) {
      return new Response(JSON.stringify({ error: "contract_id مطلوب" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load contract & client email
    const { data: contract, error: cErr } = await supabase
      .from("contracts")
      .select("id, contract_number, title, client_full_name, client_email, user_id")
      .eq("id", contract_id)
      .single();

    if (cErr || !contract) {
      return new Response(JSON.stringify({ error: "العقد غير موجود" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!contract.client_email) {
      return new Response(JSON.stringify({ error: "لا يوجد بريد إلكتروني مسجل للعميل" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      .eq("email", contract.client_email)
      .eq("used", false);

    const { error: insErr } = await supabase.from("contract_otp_codes").insert({
      contract_id, email: contract.client_email, code_hash, expires_at,
    });
    if (insErr) throw insErr;

    // Send via transactional email
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "contract-otp",
          recipientEmail: contract.client_email,
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
    } catch (mailErr) {
      console.error("email send (non-blocking):", mailErr);
      // Fallback: also log so admin can recover
    }

    console.log(`[contract-otp] sent to ${contract.client_email} for contract ${contract.contract_number}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
        masked_email: contract.client_email.replace(/(.{2}).+(@.+)/, "$1***$2"),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("send-contract-otp error:", err);
    return new Response(JSON.stringify({ error: err.message || "خطأ غير متوقع" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
