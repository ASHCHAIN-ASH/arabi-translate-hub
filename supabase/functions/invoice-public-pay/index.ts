// invoice-public-pay
// يتيح فتح الفاتورة والدفع عبر رابط عام بدون تسجيل دخول (رمز سري لكل فاتورة)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { getMoyasarPublishableKey, toHalalas } from '../_shared/moyasar-adapter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = (await req.json().catch(() => ({}))) as {
      action?: 'get' | 'intent';
      token?: string;
    };

    const token = (body.token || '').trim();
    if (!token || token.length < 16 || !/^[a-f0-9]+$/i.test(token)) {
      return json({ error: 'invalid_token', message: 'رابط الدفع غير صالح' }, 400);
    }

    const { data: inv } = await admin
      .from('invoices')
      .select('id, user_id, invoice_number, customer_name, currency, status, due_date, issue_date, subtotal, tax_amount, discount_amount, total_amount, paid_amount, remaining_amount, tax_enabled, tax_rate, tax_inclusive')
      .eq('public_pay_token', token)
      .maybeSingle();

    if (!inv) return json({ error: 'not_found', message: 'لم يتم العثور على الفاتورة' }, 404);

    const total = Number(inv.total_amount || 0);
    const paid = Number(inv.paid_amount || 0);
    const remaining = Number(inv.remaining_amount ?? (total - paid));

    const publicInvoice = {
      id: inv.id,
      invoice_number: inv.invoice_number,
      customer_name: inv.customer_name,
      currency: inv.currency || 'SAR',
      status: inv.status,
      due_date: inv.due_date,
      issue_date: inv.issue_date,
      subtotal: Number(inv.subtotal || 0),
      tax_amount: Number(inv.tax_amount || 0),
      discount_amount: Number(inv.discount_amount || 0),
      tax_enabled: inv.tax_enabled !== false,
      tax_rate: Number(inv.tax_rate ?? 15),
      tax_inclusive: inv.tax_inclusive === true,
      total_amount: total,
      paid_amount: paid,
      remaining_amount: remaining,
    };

    if (body.action !== 'intent') {
      return json({ ok: true, invoice: publicInvoice });
    }

    if (remaining <= 0) {
      return json({ error: 'invoice_already_paid', message: 'الفاتورة مدفوعة بالكامل' }, 409);
    }
    if (inv.status === 'cancelled') {
      return json({ error: 'invoice_cancelled', message: 'هذه الفاتورة ملغاة' }, 409);
    }

    const { data: numData, error: numErr } = await admin.rpc('generate_internal_order_number');
    if (numErr || !numData) throw new Error('failed_to_generate_order_number');
    const internalOrderNumber = numData as string;

    const origin = req.headers.get('origin') || 'https://fekrahedu.com';
    const baseReturn = `${origin.replace(/\/$/, '')}/payment/return`;
    const callbackUrl = `${baseReturn}?order=${encodeURIComponent(internalOrderNumber)}&provider=moyasar`;
    const description = `سداد فاتورة ${inv.invoice_number} - ${internalOrderNumber}`;

    const { error: insErr } = await admin.from('payment_intents').insert({
      user_id: inv.user_id || null,
      invoice_id: inv.id,
      provider: 'moyasar',
      provider_mode: 'embedded',
      internal_order_number: internalOrderNumber,
      amount: remaining,
      currency: 'SAR',
      status: 'pending',
      purpose: 'invoice_payment',
      return_url: baseReturn,
      callback_url: callbackUrl,
      metadata: { client_origin: origin, public_link: true, invoice_number: inv.invoice_number },
    });
    if (insErr) throw insErr;

    return json({
      ok: true,
      invoice: publicInvoice,
      internal_order_number: internalOrderNumber,
      amount: remaining,
      amount_halalas: toHalalas(remaining),
      currency: 'SAR',
      description,
      callback_url: callbackUrl,
      publishable_key: getMoyasarPublishableKey(),
    });
  } catch (e: any) {
    console.error('invoice-public-pay failed', e?.message || e);
    return json({ error: 'internal_error', message: e?.message || String(e) }, 500);
  }
});
