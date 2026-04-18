// verify-payment
// يستدعى من الواجهة بعد رجوع المستخدم من Paylink — يتحقق من الحالة من الخادم ويُسوّي العملية
// لا يثق أبداً بأي data من العميل؛ يستعلم من Paylink مباشرة
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import {
  getPaylinkInvoiceStatus,
  getPaylinkOrderByOrderNumber,
  mapPaylinkStatus,
} from '../_shared/paylink-adapter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyBody {
  payment_intent_id?: string;
  internal_order_number?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;

    const authHeader = req.headers.get('Authorization') || '';
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    if (!userData?.user) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const user = userData.user;
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const body: VerifyBody = await req.json().catch(() => ({}));
    if (!body.payment_intent_id && !body.internal_order_number) {
      return new Response(JSON.stringify({ error: 'missing_identifier' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Load intent
    let q = admin.from('payment_intents').select('*');
    if (body.payment_intent_id) q = q.eq('id', body.payment_intent_id);
    else if (body.internal_order_number) q = q.eq('internal_order_number', body.internal_order_number);
    const { data: intent } = await q.maybeSingle();
    if (!intent) {
      return new Response(JSON.stringify({ error: 'intent_not_found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (intent.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Idempotent: if already finalized
    if (intent.status === 'succeeded') {
      return new Response(JSON.stringify({ ok: true, status: 'succeeded', already: true, payment_intent_id: intent.id }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Query Paylink
    let paylinkRes: any = null;
    let errorMsg: string | null = null;
    try {
      paylinkRes = intent.external_transaction_no
        ? await getPaylinkInvoiceStatus(intent.external_transaction_no)
        : await getPaylinkOrderByOrderNumber(intent.internal_order_number);
    } catch (e: any) {
      errorMsg = e?.message || String(e);
    }

    await admin.from('payment_attempts').insert({
      payment_intent_id: intent.id,
      attempt_no: 1,
      action: 'verify',
      response_payload: paylinkRes,
      status: errorMsg ? 'failed' : 'success',
      error_message: errorMsg,
    });

    if (!paylinkRes) {
      return new Response(JSON.stringify({ ok: false, status: intent.status, error: errorMsg || 'no_response' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const newStatus = mapPaylinkStatus(paylinkRes.orderStatus);
    const externalAmount = Number(paylinkRes.amount || 0);
    const expectedAmount = Number(intent.amount || 0);

    // Amount sanity check (allow tiny rounding)
    if (newStatus === 'succeeded' && Math.abs(externalAmount - expectedAmount) > 0.01) {
      await admin.from('payment_intents').update({
        status: 'failed',
        failure_reason: `amount_mismatch: expected=${expectedAmount} got=${externalAmount}`,
        failed_at: new Date().toISOString(),
      }).eq('id', intent.id);
      return new Response(JSON.stringify({ ok: false, status: 'failed', reason: 'amount_mismatch' }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Settle based on purpose
    if (newStatus === 'succeeded') {
      await settleIntent(admin, intent, paylinkRes);
    } else if (newStatus === 'failed' || newStatus === 'cancelled') {
      await admin.from('payment_intents').update({
        status: newStatus,
        failure_reason: paylinkRes?.orderStatus || newStatus,
        failed_at: new Date().toISOString(),
        external_transaction_no: paylinkRes?.transactionNo || intent.external_transaction_no,
      }).eq('id', intent.id);
    } else {
      await admin.from('payment_intents').update({
        status: 'processing',
        external_transaction_no: paylinkRes?.transactionNo || intent.external_transaction_no,
      }).eq('id', intent.id);
    }

    return new Response(JSON.stringify({
      ok: true,
      status: newStatus,
      payment_intent_id: intent.id,
      amount: expectedAmount,
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'internal_error', message: e?.message || String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ---------------- helpers ----------------

async function settleIntent(admin: any, intent: any, paylinkRes: any) {
  // Idempotency guard via DB row check before each side-effect
  const txNo = paylinkRes?.transactionNo || intent.external_transaction_no;

  // Mark intent as succeeded first (so triggers see the source-of-truth)
  await admin.from('payment_intents').update({
    status: 'succeeded',
    succeeded_at: new Date().toISOString(),
    external_transaction_no: txNo,
    payment_method_type: paylinkRes?.paymentMethod || null,
  }).eq('id', intent.id);

  if (intent.purpose === 'wallet_topup') {
    // Ensure wallet exists
    let { data: wallet } = await admin.from('wallets').select('id').eq('user_id', intent.user_id).maybeSingle();
    if (!wallet) {
      const { data: w } = await admin.from('wallets').insert({ user_id: intent.user_id }).select('id').single();
      wallet = w;
    }
    // Idempotency: skip if already credited for this intent
    const { data: existing } = await admin.from('wallet_transactions')
      .select('id').eq('payment_intent_id', intent.id).maybeSingle();
    if (!existing) {
      await admin.from('wallet_transactions').insert({
        wallet_id: wallet.id,
        user_id: intent.user_id,
        type: 'deposit',
        amount: intent.amount,
        description: `شحن المحفظة - عملية ${intent.internal_order_number}`,
        reference_type: 'payment_intent',
        reference_id: intent.id,
        payment_intent_id: intent.id,
      });
    }
  } else if (intent.purpose === 'invoice_payment' && intent.invoice_id) {
    // Idempotency: skip if invoice_payment row exists for this intent
    const { data: existing } = await admin.from('invoice_payments')
      .select('id').eq('payment_intent_id', intent.id).maybeSingle();
    if (!existing) {
      await admin.from('invoice_payments').insert({
        invoice_id: intent.invoice_id,
        amount: intent.amount,
        payment_method: 'card',
        status: 'completed',
        reference_number: txNo,
        notes: `دفع إلكتروني - عملية ${intent.internal_order_number}`,
        created_by: intent.user_id,
        payment_intent_id: intent.id,
      });
    }
  }
  // contract_payment: handled by future iteration (linked invoice flow)
}
