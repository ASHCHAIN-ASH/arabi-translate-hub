// مساعد استدعاء واتساب من جانب العميل
import { supabase } from "@/integrations/supabase/client";

export type WhatsAppEventKey =
  | "order_created"
  | "order_status_changed"
  | "order_delivered"
  | "invoice_new"
  | "invoice_reminder"
  | "invoice_paid"
  | "contract_invite"
  | "contract_signed"
  | "otp_login";

export async function sendWhatsApp(params: {
  to: string;
  event_key?: WhatsAppEventKey;
  variables?: Record<string, any>;
  message?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  user_id?: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke("whatsapp-send", {
      body: params,
    });
    if (error) return { success: false, error: error.message };
    return data as { success: boolean; messageId?: string; error?: string };
  } catch (e: any) {
    return { success: false, error: e?.message || "network" };
  }
}

export async function requestWhatsAppOtp(phone: string, purpose = "login") {
  const { data, error } = await supabase.functions.invoke("whatsapp-otp-request", {
    body: { phone, purpose },
  });
  if (error) return { success: false, error: error.message };
  return data as { success: boolean; error?: string; expires_in?: number };
}

export async function verifyWhatsAppOtp(phone: string, code: string, purpose = "login") {
  const { data, error } = await supabase.functions.invoke("whatsapp-otp-verify", {
    body: { phone, code, purpose },
  });
  if (error) return { success: false, error: error.message };
  return data as { success: boolean; error?: string; phone?: string };
}
