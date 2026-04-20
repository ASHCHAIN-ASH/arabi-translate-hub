// طلب رمز OTP عبر واتساب
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, renderTemplate, sendWhatsAppMessage } from "../_shared/whatsapp.ts";

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

    const { phone, purpose = "login" } = await req.json();
    if (!phone) {
      return new Response(JSON.stringify({ success: false, error: "رقم الجوال مطلوب" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: settings } = await supabase
      .from("whatsapp_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!settings?.is_enabled || settings.events_enabled?.otp_login === false) {
      return new Response(JSON.stringify({ success: false, error: "OTP عبر واتساب معطّل" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalized = normalizePhone(phone, settings.default_country_code || "966");

    // حد الإرسال: 3 طلبات / 10 دقائق
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("whatsapp_otp_codes")
      .select("id", { count: "exact", head: true })
      .eq("phone", normalized)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) {
      return new Response(JSON.stringify({ success: false, error: "محاولات كثيرة، حاول لاحقاً" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = await hashCode(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? null;

    await supabase.from("whatsapp_otp_codes").insert({
      phone: normalized,
      code_hash: codeHash,
      purpose,
      expires_at: expiresAt,
      ip_address: ip,
    });

    const { data: tpl } = await supabase
      .from("whatsapp_templates")
      .select("body_text")
      .eq("event_key", "otp_login")
      .single();

    const message = renderTemplate(
      tpl?.body_text || "🔐 رمز التحقق: *{{code}}*. صالح 10 دقائق.",
      { code },
    );

    const result = await sendWhatsAppMessage(normalized, message);

    await supabase.from("whatsapp_send_log").insert({
      to_phone: normalized,
      event_key: "otp_login",
      message_body: message.replace(code, "******"),
      status: result.success ? "sent" : "failed",
      provider_message_id: result.messageId ?? null,
      error_message: result.success ? null : result.error,
    });

    return new Response(
      JSON.stringify({
        success: result.success,
        error: result.success ? undefined : result.error,
        expires_in: 600,
      }),
      {
        status: result.success ? 200 : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e: any) {
    console.error("whatsapp-otp-request", e);
    return new Response(JSON.stringify({ success: false, error: e?.message || "خطأ" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
