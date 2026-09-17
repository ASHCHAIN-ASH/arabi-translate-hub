// moyasar-verify-payment
// يتحقق من عملية دفع مُيسّر من جانب الخادم (لا يُوثق بحالة المتصفح) ثم يُسوّي نية الدفع
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import {
  fetchMoyasarPayment,
  MOYASAR_PAID_STATUSES,
  toHalalas,
  toSar,
} from '../_shared/moyasar-adapter.ts';
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = (await req.json().catch(() => ({}))) as {
      payment_id?: string;
      internal_order_number?: string;
    };
    if (!body.payment_id || !body.internal_order_number) {
      return json({ error: 'invalid_request', message: 'بيانات التحقق غير مكتملة' }, 400);
    }

    const { data: intent } = await admin.from('payment_intents')
      .select('*')
      .eq('internal_order_number', body.internal_order_number)
      .maybeSingle();
    if (!intent) return json({ error: 'intent_not_found', message: 'لم يتم العثور على عملية الدفع' }, 404);

    if (intent.status === 'succeeded') {
      return json({ ok: true, status: 'succeeded', amount: intent.amount, already: true });
    }

    const payment = await fetchMoyasarPayment(body.payment_id);

    await admin.from('payment_attempts').insert({
      payment_intent_id: intent.id,
      attempt_no: 1,
      action: 'verify_payment',
      request_payload: { payment_id: body.payment_id },
      response_payload: payment,
      status: MOYASAR_PAID_STATUSES.includes(payment.status) ? 'success' : 'failed',
      error_message: MOYASAR_PAID_STATUSES.includes(payment.status) ? null : payment.status,
    }).then(() => {}, () => {});

    // تحقق من تطابق المبلغ لمنع التلاعب
    const expected = toHalalas(Number(intent.amount || 0));
    if (Number(payment.amount) !== expected) {
      await admin.from('payment_intents').update({
        status: 'failed',
        failure_reason: `amount_mismatch: ${payment.amount} != ${expected}`,
        failed_at: new Date().toISOString(),
      }).eq('id', intent.id);
      return json({ ok: false, status: 'failed', message: 'المبلغ المدفوع لا يطابق المبلغ المطلوب' }, 409);
    }

    if (!MOYASAR_PAID_STATUSES.includes(payment.status)) {
      const failureMsg = (payment.source as any)?.message || payment.status;
      await admin.from('payment_intents').update({
        status: payment.status === 'initiated' ? 'pending' : 'failed',
        failure_reason: String(failureMsg),
        failed_at: payment.status === 'initiated' ? null : new Date().toISOString(),
      }).eq('id', intent.id);
      return json({
        ok: false,
        status: payment.status === 'initiated' ? 'pending' : 'failed',
        message: payment.status === 'initiated' ? 'الدفعة قيد المعالجة' : 'لم تكتمل عملية الدفع',
        provider_message: failureMsg,
      });
    }

    await admin.from('payment_intents').update({
      external_transaction_no: payment.id,
      payment_method_type: (payment.source as any)?.type || 'creditcard',
    }).eq('id', intent.id);

    await settlePaymentIntent(admin, { ...intent, external_transaction_no: payment.id }, {
      transactionNo: payment.id,
      providerLabel: 'دفع فوري بالبطاقة',
      paymentMethod: 'card',
    });

    return json({
      ok: true,
      status: 'succeeded',
      amount: toSar(Number(payment.amount)),
      payment_id: payment.id,
      purpose: intent.purpose,
    });
  } catch (e: any) {
    console.error('moyasar-verify-payment failed', e?.message || e);
    return json({ error: 'internal_error', message: e?.message || String(e) }, 500);
  }
});
