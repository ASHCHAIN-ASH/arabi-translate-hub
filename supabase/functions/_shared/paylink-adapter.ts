// Paylink Payment Provider Adapter (server-only)
// يدعم وضعين: hosted (افتراضي) و embedded — قابل للتبديل عبر provider_mode
// مرجع API: https://paylinksa.readme.io

const PAYLINK_API_ID = Deno.env.get('PAYLINK_API_ID') || '';
const PAYLINK_SECRET_KEY = Deno.env.get('PAYLINK_SECRET_KEY') || '';
// Production base URL (Paylink REST API). للاختبار استخدم: https://restpilot.paylink.sa
const PAYLINK_BASE_URL = Deno.env.get('PAYLINK_BASE_URL') || 'https://restapi.paylink.sa';

export interface PaylinkAuthResult {
  id_token: string;
  expires_in?: number;
}

export interface CreateInvoiceArgs {
  amount: number;
  clientName: string;
  clientMobile: string;
  clientEmail?: string;
  orderNumber: string; // internal_order_number
  callBackUrl: string;
  cancelUrl?: string;
  currency?: string;
  note?: string;
  products?: Array<{ title: string; price: number; qty: number; description?: string }>;
}

export interface PaylinkInvoiceResponse {
  transactionNo?: string;
  orderNumber?: string;
  url?: string; // checkout URL
  invoiceId?: string;
  amount?: number;
  orderStatus?: string;
  paymentErrors?: any[];
  [k: string]: any;
}

let _cachedToken: { token: string; exp: number } | null = null;

/**
 * Authenticate with Paylink and obtain id_token.
 * Token is cached in-memory per function invocation lifecycle.
 */
export async function paylinkAuth(): Promise<string> {
  if (!PAYLINK_API_ID || !PAYLINK_SECRET_KEY) {
    throw new Error('PAYLINK credentials are not configured');
  }
  // Reuse if still valid (>30s remaining)
  if (_cachedToken && _cachedToken.exp > Date.now() + 30_000) {
    return _cachedToken.token;
  }

  const res = await fetch(`${PAYLINK_BASE_URL}/api/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
    body: JSON.stringify({
      apiId: PAYLINK_API_ID,
      secretKey: PAYLINK_SECRET_KEY,
      persistToken: false,
    }),
  });

  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { /* ignore */ }

  if (!res.ok || !data?.id_token) {
    throw new Error(`Paylink auth failed: ${res.status} ${text.slice(0, 200)}`);
  }

  _cachedToken = {
    token: data.id_token,
    exp: Date.now() + (Number(data.expires_in || 1800) * 1000),
  };
  return data.id_token;
}

/**
 * Create a Paylink invoice / payment intent on the gateway.
 * Returns checkout URL + transactionNo.
 */
export async function createPaylinkInvoice(args: CreateInvoiceArgs): Promise<PaylinkInvoiceResponse> {
  const token = await paylinkAuth();

  const products = args.products && args.products.length > 0
    ? args.products
    : [{ title: args.note || 'Service Payment', price: args.amount, qty: 1 }];

  const body = {
    amount: args.amount,
    callBackUrl: args.callBackUrl,
    cancelUrl: args.cancelUrl || args.callBackUrl,
    clientEmail: args.clientEmail || '',
    clientMobile: args.clientMobile || '',
    clientName: args.clientName || 'Customer',
    currency: args.currency || 'SAR',
    note: args.note || '',
    orderNumber: args.orderNumber,
    products,
  };

  const res = await fetch(`${PAYLINK_BASE_URL}/api/addInvoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { /* ignore */ }

  if (!res.ok) {
    throw new Error(`Paylink addInvoice failed: ${res.status} ${text.slice(0, 300)}`);
  }
  return data as PaylinkInvoiceResponse;
}

/**
 * Get invoice status by Paylink transactionNo (server-side verification).
 */
export async function getPaylinkInvoiceStatus(transactionNo: string): Promise<PaylinkInvoiceResponse> {
  const token = await paylinkAuth();
  const res = await fetch(`${PAYLINK_BASE_URL}/api/getInvoice/${encodeURIComponent(transactionNo)}`, {
    method: 'GET',
    headers: { 'Accept': '*/*', 'Authorization': `Bearer ${token}` },
  });
  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { /* ignore */ }
  if (!res.ok) {
    throw new Error(`Paylink getInvoice failed: ${res.status} ${text.slice(0, 300)}`);
  }
  return data as PaylinkInvoiceResponse;
}

/**
 * Lookup invoice by our internal orderNumber (used during reconciliation).
 */
export async function getPaylinkOrderByOrderNumber(orderNumber: string): Promise<PaylinkInvoiceResponse | null> {
  const token = await paylinkAuth();
  const res = await fetch(`${PAYLINK_BASE_URL}/api/getInvoiceByClientOrderNumber/${encodeURIComponent(orderNumber)}`, {
    method: 'GET',
    headers: { 'Accept': '*/*', 'Authorization': `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  const text = await res.text();
  let data: any = {};
  try { data = JSON.parse(text); } catch { /* ignore */ }
  if (!res.ok) return null;
  return data as PaylinkInvoiceResponse;
}

/**
 * Map Paylink orderStatus -> our internal status.
 */
export function mapPaylinkStatus(orderStatus?: string): 'succeeded' | 'failed' | 'pending' | 'cancelled' {
  const s = (orderStatus || '').toLowerCase();
  if (s === 'paid' || s === 'completed' || s === 'success') return 'succeeded';
  if (s === 'cancelled' || s === 'canceled' || s === 'expired') return 'cancelled';
  if (s === 'failed' || s === 'declined') return 'failed';
  return 'pending';
}
