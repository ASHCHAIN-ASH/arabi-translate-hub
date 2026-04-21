// إرسال رسالة واتساب عبر SmartWats مع قوالب من قاعدة البيانات
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone, renderTemplate, sendWhatsAppMessage, sendWhatsAppMedia } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json();
    const {
      to,
      event_key,
      variables = {},
      message,
      test = false,
      related_entity_type,
      related_entity_id,
      user_id,
    } = body;

    // اختبار الاتصال
    if (test) {
      const instanceId = Deno.env.get("SMARTWATS_INSTANCE_ID");
      const accessToken = Deno.env.get("SMARTWATS_ACCESS_TOKEN");
      if (!instanceId || !accessToken) {
        return json({ success: false, error: "لم يتم إعداد مفاتيح SmartWats" }, 400);
      }
      if (!to) return json({ success: true, message: "المفاتيح متوفرة" });
      const r = await sendWhatsAppMessage(normalizePhone(to), message || "اختبار اتصال SmartWats ✅");
      return json(r);
    }

    if (!to) return json({ success: false, error: "رقم الهاتف مطلوب" }, 400);

    // الإعدادات
    const { data: settings } = await supabase
      .from("whatsapp_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!settings?.is_enabled) {
      return json({ success: false, error: "خدمة واتساب معطّلة" }, 200);
    }

    if (event_key && settings.events_enabled?.[event_key] === false) {
      return json({ success: false, error: "هذا الحدث معطّل" }, 200);
    }

    // بناء النص
    let finalMessage = message || "";
    if (event_key && !message) {
      const { data: tpl } = await supabase
        .from("whatsapp_templates")
        .select("body_text, is_active")
        .eq("event_key", event_key)
        .single();
      if (!tpl?.is_active) {
        return json({ success: false, error: "القالب غير مفعّل" }, 200);
      }
      finalMessage = renderTemplate(tpl.body_text, variables);
    }

    if (!finalMessage) return json({ success: false, error: "نص الرسالة فارغ" }, 400);

    const phone = normalizePhone(to, settings.default_country_code || "966");
    const result = await sendWhatsAppMessage(phone, finalMessage);

    // سجل
    await supabase.from("whatsapp_send_log").insert({
      to_phone: phone,
      event_key: event_key ?? null,
      message_body: finalMessage,
      variables,
      status: result.success ? "sent" : "failed",
      provider_message_id: result.messageId ?? null,
      error_message: result.success ? null : result.error,
      user_id: user_id ?? null,
      related_entity_type: related_entity_type ?? null,
      related_entity_id: related_entity_id ?? null,
    });

    return json(result, result.success ? 200 : 502);
  } catch (e: any) {
    console.error("whatsapp-send error", e);
    return json({ success: false, error: e?.message || "خطأ غير متوقع" }, 500);
  }

  function json(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
