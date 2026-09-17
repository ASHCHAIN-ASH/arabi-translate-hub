// إشعار واتساب موحّد من داخل الدوال (قوالب من قاعدة البيانات + سجل إرسال)
import { normalizePhone, renderTemplate, sendWhatsAppMessage } from "./whatsapp.ts";

export interface NotifyParams {
  to?: string | null;
  event_key: string;
  variables?: Record<string, unknown>;
  user_id?: string | null;
  related_entity_type?: string | null;
  related_entity_id?: string | null;
}

/**
 * يرسل رسالة واتساب اعتماداً على قالب مخزّن، ويحترم إعدادات التفعيل،
 * ولا يرمي استثناءات أبداً حتى لا يعطّل المسار الأساسي (بريد/طلب/فاتورة).
 */
export async function notifyWhatsApp(
  admin: any,
  { to, event_key, variables = {}, user_id, related_entity_type, related_entity_id }: NotifyParams,
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    if (!to || String(to).replace(/\D/g, "").length < 8) {
      return { success: false, error: "no_phone" };
    }

    const { data: settings } = await admin
      .from("whatsapp_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (settings && settings.is_enabled === false) {
      return { success: false, error: "disabled" };
    }
    if (settings?.events_enabled && settings.events_enabled[event_key] === false) {
      return { success: false, error: "event_disabled" };
    }

    const { data: tpl } = await admin
      .from("whatsapp_templates")
      .select("body_text, is_active")
      .eq("event_key", event_key)
      .maybeSingle();

    if (!tpl?.body_text || tpl.is_active === false) {
      return { success: false, error: "template_inactive" };
    }

    const message = renderTemplate(tpl.body_text, variables as Record<string, any>);
    const phone = normalizePhone(String(to), settings?.default_country_code || "966");
    const result = await sendWhatsAppMessage(phone, message);

    await admin.from("whatsapp_send_log").insert({
      to_phone: phone,
      event_key,
      message_body: message,
      variables,
      status: result.success ? "sent" : "failed",
      provider_message_id: result.messageId ?? null,
      error_message: result.success ? null : result.error,
      user_id: user_id ?? null,
      related_entity_type: related_entity_type ?? null,
      related_entity_id: related_entity_id ?? null,
    }).then(() => {}, () => {});

    return result;
  } catch (e: any) {
    console.warn("notifyWhatsApp skipped:", e?.message || e);
    return { success: false, error: e?.message || "error" };
  }
}

/** جلب رقم جوال المستخدم من ملفه الشخصي */
export async function getUserPhone(admin: any, userId?: string | null): Promise<string | null> {
  if (!userId) return null;
  const { data } = await admin
    .from("profiles")
    .select("phone")
    .eq("id", userId)
    .maybeSingle();
  return (data?.phone as string) || null;
}
