// Moyasar Payment Provider Adapter (server-only)
// مرجع API: https://docs.moyasar.com/api/api-introduction
// المفاتيح: MOYASAR_SECRET_KEY (سري — للخادم فقط) و MOYASAR_PUBLISHABLE_KEY (منشور — يُستخدم في نموذج البطاقة)

const MOYASAR_BASE_URL = Deno.env.get('MOYASAR_BASE_URL') || 'https://api.moyasar.com/v1';

export function getMoyasarSecretKey(): string {
  const key = Deno.env.get('MOYASAR_SECRET_KEY') || '';
  if (!key) throw new Error('MOYASAR_SECRET_KEY غير مضبوط');
  return key;
}

export function getMoyasarPublishableKey(): string {
  const key = Deno.env.get('MOYASAR_PUBLISHABLE_KEY') || '';
  if (!key) throw new Error('MOYASAR_PUBLISHABLE_KEY غير مضبوط');
  return key;
}

export interface MoyasarPayment {
  id: string;
  status: string; // initiated | paid | failed | authorized | captured | refunded | voided
  amount: number; // halalas
  fee?: number;
  currency?: string;
  refunded?: number;
  description?: string;
  invoice_id?: string | null;
  ip?: string | null;
  callback_url?: string | null;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown> | null;
  source?: Record<string, unknown> | null;
  [k: string]: unknown;
}

function authHeader(): string {
  // Basic auth: secret key as username, empty password
  return `Basic ${btoa(`${getMoyasarSecretKey()}:`)}`;
}

async function moyasarRequest(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${MOYASAR_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body: any = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const msg = body?.message || body?.errors || text || `HTTP ${res.status}`;
    throw new Error(`Moyasar [${res.status}]: ${typeof msg === 'string' ? msg : JSON.stringify(msg)}`);
  }
  return body;
}

/** ريال → هللة (Moyasar يتعامل بالهللات فقط) */
export const toHalalas = (sar: number) => Math.round(Number(sar) * 100);
/** هللة → ريال */
export const toSar = (halalas: number) => Number(halalas || 0) / 100;

/** جلب عملية دفع للتحقق منها من جانب الخادم */
export async function fetchMoyasarPayment(paymentId: string): Promise<MoyasarPayment> {
  return await moyasarRequest(`/payments/${encodeURIComponent(paymentId)}`, { method: 'GET' });
}

/** التقاط مبلغ عملية مُصرّح بها (عند استخدام manual capture) */
export async function captureMoyasarPayment(paymentId: string, amountHalalas?: number) {
  return await moyasarRequest(`/payments/${encodeURIComponent(paymentId)}/capture`, {
    method: 'POST',
    body: JSON.stringify(amountHalalas ? { amount: amountHalalas } : {}),
  });
}

/** استرداد كلي أو جزئي */
export async function refundMoyasarPayment(paymentId: string, amountHalalas?: number) {
  return await moyasarRequest(`/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: 'POST',
    body: JSON.stringify(amountHalalas ? { amount: amountHalalas } : {}),
  });
}

/** حالات تُعتبر دفعاً ناجحاً */
export const MOYASAR_PAID_STATUSES = ['paid', 'captured', 'authorized'];
