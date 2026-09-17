// moyasar-webhook
// يستقبل إشعارات مُيسّر ويُسوّي العملية على الخادم حتى لو أغلق العميل المتصفح
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { fetchMoyasarPayment, MOYASAR_PAID_STATUSES, toHalalas } from '../_shared/moyasar-adapter.ts';
import { settlePaymentIntent } from '../_shared/settle-intent.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

function orderFromCallback(url?: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).searchParams.get('order');
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const payload = await req.json().catch(() => ({} as any));
    const secretToken = Deno.env.get('MOYASAR_WEBHOOK_SECRET');
    if (secretToken && payload?.secret_token && payload.secret_token !== secretToken) {
      return json({ error: 'invalid_secret_token' }, 401);
    }

    const paymentId = payload?.data?.id || payload?.id;
    if (!paymentId) return json({ ok: true, ignored: 'no_payment_id' });

    // نعيد جلب العملية من مُيسّر بدل الوثوق بجسم الطلب
    const payment = await fetchMoyasarPayment(String(paymentId));

    const order = orderFromCallback(payment.callback_url) ||
      orderFromCallback(payload?.data?.callback_url);
    if (!order) return json({ ok: true, ignored: 'no_order_reference' });

    const { data: intent } = await admin.from('payment_intents')
      .select('*').eq('internal_order_number', order).maybeSingle();
    if (!intent) return json({ ok: true, ignored: 'intent_not_found' });
    if (intent.status === 'succeeded') return json({ ok: true, already: true });

    if (!MOYASAR_PAID_STATUSES.includes(payment.status)) {
      await admin.from('payment_intents').update({
        status: 'failed',
        failure_reason: String((payment.source as any)?.message || payment.status),
        failed_at: new Date().toISOString(),
      }).eq('id', intent.id);
      return json({ ok: true, status: payment.status });
    }

    if (Number(payment.amount) !== toHalalas(Number(intent.amount || 0))) {
      await admin.from('payment_intents').update({
        status: 'failed',
        failure_reason: 'amount_mismatch',
        failed_at: new Date().toISOString(),
      }).eq('id', intent.id);
      return json({ ok: true, status: 'amount_mismatch' });
    }

    await settlePaymentIntent(admin, { ...intent, external_transaction_no: payment.id }, {
      transactionNo: payment.id,
      providerLabel: 'دفع فوري بالبطاقة',
      paymentMethod: 'card',
    });

    return json({ ok: true, status: 'succeeded' });
  } catch (e: any) {
    console.error('moyasar-webhook failed', e?.message || e);
    return json({ error: 'internal_error', message: e?.message || String(e) }, 500);
  }
});
