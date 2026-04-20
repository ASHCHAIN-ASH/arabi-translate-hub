// التحقق من رمز OTP الواتساب — يُرجع نجاح/فشل (التكامل مع تسجيل الدخول من جانب التطبيق)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hashCode(code: string): Promise<string> {
  const data = new TextEncoder().encode(code);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { phone, code, purpose = "login" } = await req.json();

    if (!phone || !code) {
      return resp({ success: false, error: "البيانات ناقصة" }, 400);
    }

    const normalized = normalizePhone(phone);
    const codeHash = await hashCode(String(code));

    const { data: rows } = await supabase
      .from("whatsapp_otp_codes")
      .select("*")
      .eq("phone", normalized)
      .eq("purpose", purpose)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    const otp = rows?.[0];
    if (!otp) return resp({ success: false, error: "الرمز منتهٍ أو غير موجود" }, 400);

    if (otp.attempts >= 5) {
      return resp({ success: false, error: "محاولات كثيرة" }, 429);
    }

    if (otp.code_hash !== codeHash) {
      await supabase
        .from("whatsapp_otp_codes")
        .update({ attempts: otp.attempts + 1 })
        .eq("id", otp.id);
      return resp({ success: false, error: "الرمز غير صحيح" }, 400);
    }

    await supabase
      .from("whatsapp_otp_codes")
      .update({ used: true })
      .eq("id", otp.id);

    return resp({ success: true, phone: normalized });
  } catch (e: any) {
    console.error("whatsapp-otp-verify", e);
    return resp({ success: false, error: e?.message || "خطأ" }, 500);
  }

  function resp(d: any, s = 200) {
    return new Response(JSON.stringify(d), {
      status: s,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
