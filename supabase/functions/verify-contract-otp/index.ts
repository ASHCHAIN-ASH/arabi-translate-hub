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

function respond(payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { contract_id, code } = await req.json();
    if (!contract_id || !code) {
      return respond({ success: false, verified: false, error: "contract_id و code مطلوبان" });
    }

    const { data: contract } = await supabase
      .from("contracts").select("client_email").eq("id", contract_id).maybeSingle();

    if (!contract?.client_email) {
      return respond({ success: false, verified: false, error: "العقد غير موجود" });
    }

    const code_hash = await sha256(String(code).trim());

    const { data: rec } = await supabase
      .from("contract_otp_codes")
      .select("*")
      .eq("contract_id", contract_id)
      .eq("email", contract.client_email)
      .eq("used", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!rec) {
      return respond({ success: false, verified: false, error: "الرمز منتهي الصلاحية أو غير موجود — يرجى طلب رمز جديد" });
    }

    if (rec.attempts >= 5) {
      await supabase.from("contract_otp_codes").update({ used: true }).eq("id", rec.id);
      return respond({ success: false, verified: false, error: "تم تجاوز عدد المحاولات — يرجى طلب رمز جديد" });
    }

    if (rec.code_hash !== code_hash) {
      await supabase.from("contract_otp_codes")
        .update({ attempts: rec.attempts + 1 }).eq("id", rec.id);
      const remaining = Math.max(0, 5 - (rec.attempts + 1));
      return respond({
        success: false,
        verified: false,
        error: `رمز التحقق غير صحيح — تبقّى ${remaining} محاولة. تأكد من استخدام آخر رمز مُرسل إلى بريدك.`,
      });
    }

    await supabase.from("contract_otp_codes").update({ used: true }).eq("id", rec.id);

    return respond({ success: true, verified: true });
  } catch (err: any) {
    console.error("verify-contract-otp error:", err);
    return respond({ success: false, verified: false, error: err?.message || "خطأ غير متوقع" });
  }
});
