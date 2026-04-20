// مساعدات SmartWats المشتركة
export const SMARTWATS_BASE = "https://app.smartwats.com/api";

export function normalizePhone(phone: string, defaultCC = "966"): string {
  let p = (phone || "").replace(/[^\d+]/g, "");
  if (p.startsWith("+")) p = p.slice(1);
  if (p.startsWith("00")) p = p.slice(2);
  if (p.startsWith("0")) p = defaultCC + p.slice(1);
  if (!p.startsWith(defaultCC) && p.length <= 10) p = defaultCC + p;
  return p;
}

export function renderTemplate(body: string, vars: Record<string, any>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars?.[k] ?? ""));
}

export interface SmartWatsSendResult {
  success: boolean;
  messageId?: string;
  raw?: any;
  error?: string;
}

export async function sendWhatsAppMessage(
  to: string,
  message: string,
): Promise<SmartWatsSendResult> {
  const instanceId = Deno.env.get("SMARTWATS_INSTANCE_ID");
  const accessToken = Deno.env.get("SMARTWATS_ACCESS_TOKEN");
  if (!instanceId || !accessToken) {
    return { success: false, error: "SmartWats credentials not configured" };
  }

  try {
    const url = `${SMARTWATS_BASE}/send`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: to,
        type: "text",
        message,
        instance_id: instanceId,
        access_token: accessToken,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.status === "error") {
      return {
        success: false,
        error: data?.message || `HTTP ${res.status}`,
        raw: data,
      };
    }
    return {
      success: true,
      messageId: data?.data?.id || data?.id || undefined,
      raw: data,
    };
  } catch (e: any) {
    return { success: false, error: e?.message || "network error" };
  }
}
