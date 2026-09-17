// paylink-webhook
// يستقبل إشعارات Paylink — يحفظ payload خام، يربط بـ payment_intent، ويُسوّي العملية بشكل idempotent
// مهم: هذا webhook لا يحتاج JWT — تحقق الهوية من خلال الاستعلام عن Paylink مباشرة بعد الاستلام
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import {
  getPaylinkInvoiceStatus,
  mapPaylinkStatus,
} from '../_shared/paylink-adapter.ts';
import { getUserPhone, notifyWhatsApp } from '../_shared/whatsapp-notify.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Capture raw payload + headers
  const headersObj: Record<string, string> = {};
  req.headers.forEach((v, k) => { headersObj[k] = v; });
  const rawText = await req.text();
  let payload: any = {};
  try { payload = rawText ? JSON.parse(rawText) : {}; } catch { payload = { raw: rawText }; }

  const externalTxNo = payload?.transactionNo || payload?.transaction_no || null;
  const internalOrderNo = payload?.orderNumber || payload?.order_number || null;
  const eventType = payload?.event || payload?.orderStatus || 'notification';
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || null;

  // Insert webhook log (deduplicated via unique index)
  let webhookId: string | null = null;
  try {
    const { data: wh } = await admin.from('gateway_webhooks').insert({
      provider: 'paylink',
      event_type: eventType,
      external_transaction_no: externalTxNo,
      internal_order_number: internalOrderNo,
      payload,
      headers: headersObj,
      signature_status: 'unverified',
      ip_address: ip,
    }).select('id').single();
    webhookId = wh?.id || null;
  } catch (_e) {
    // Duplicate (replay) — return 200 OK so Paylink stops retrying
    return new Response(JSON.stringify({ ok: true, duplicate: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Locate payment_intent (by external tx first, then by internal order)
  let intent: any = null;
  if (externalTxNo) {
    const { data } = await admin.from('payment_intents').select('*')
      .eq('external_transaction_no', externalTxNo).maybeSingle();
    intent = data;
  }
  if (!intent && internalOrderNo) {
    const { data } = await admin.from('payment_intents').select('*')
      .eq('internal_order_number', internalOrderNo).maybeSingle();
    intent = data;
  }

  if (!intent) {
    await admin.from('gateway_webhooks').update({
      processed: true, processed_at: new Date().toISOString(),
      error_message: 'payment_intent_not_found',
    }).eq('id', webhookId!);
    // Always 200 to prevent retries (we logged it)
    return new Response(JSON.stringify({ ok: true, intent: 'not_found' }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Link webhook to intent
  await admin.from('gateway_webhooks').update({
    payment_intent_id: intent.id,
  }).eq('id', webhookId!);

  // Idempotent: stop if already succeeded
  if (intent.status === 'succeeded') {
    await admin.from('gateway_webhooks').update({
      processed: true, processed_at: new Date().toISOString(),
    }).eq('id', webhookId!);
    return new Response(JSON.stringify({ ok: true, status: 'succeeded', already: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // CRITICAL: Re-verify with Paylink (don't trust webhook payload alone)
  let verified: any = null;
  let errorMsg: string | null = null;
  try {
    if (externalTxNo || intent.external_transaction_no) {
      verified = await getPaylinkInvoiceStatus(externalTxNo || intent.external_transaction_no);
    }
  } catch (e: any) {
    errorMsg = e?.message || String(e);
  }

  await admin.from('payment_attempts').insert({
    payment_intent_id: intent.id,
    attempt_no: 1,
    action: 'webhook_process',
    request_payload: payload,
    response_payload: verified,
    status: errorMsg ? 'failed' : 'success',
    error_message: errorMsg,
  });

  if (!verified) {
    await admin.from('gateway_webhooks').update({
      processed: false, error_message: errorMsg || 'verification_failed',
    }).eq('id', webhookId!);
    return new Response(JSON.stringify({ ok: false, error: errorMsg || 'verification_failed' }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const newStatus = mapPaylinkStatus(verified.orderStatus);
  const externalAmount = Number(verified.amount || 0);
  const expectedAmount = Number(intent.amount || 0);

  if (newStatus === 'succeeded' && Math.abs(externalAmount - expectedAmount) > 0.01) {
    await admin.from('payment_intents').update({
      status: 'failed',
      failure_reason: `webhook_amount_mismatch: expected=${expectedAmount} got=${externalAmount}`,
      failed_at: new Date().toISOString(),
    }).eq('id', intent.id);
    await admin.from('gateway_webhooks').update({
      processed: true, processed_at: new Date().toISOString(),
      error_message: 'amount_mismatch',
    }).eq('id', webhookId!);
    return new Response(JSON.stringify({ ok: false, reason: 'amount_mismatch' }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (newStatus === 'succeeded') {
    await settleIntent(admin, intent, verified);
  } else if (newStatus === 'failed' || newStatus === 'cancelled') {
    await admin.from('payment_intents').update({
      status: newStatus,
      failure_reason: verified?.orderStatus || newStatus,
      failed_at: new Date().toISOString(),
    }).eq('id', intent.id);
  } else {
    await admin.from('payment_intents').update({ status: 'processing' }).eq('id', intent.id);
  }

  await admin.from('gateway_webhooks').update({
    processed: true,
    processed_at: new Date().toISOString(),
    signature_status: 'verified', // verified via re-query to Paylink
  }).eq('id', webhookId!);

  return new Response(JSON.stringify({ ok: true, status: newStatus }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

async function settleIntent(admin: any, intent: any, paylinkRes: any) {
  const txNo = paylinkRes?.transactionNo || intent.external_transaction_no;

  await admin.from('payment_intents').update({
    status: 'succeeded',
    succeeded_at: new Date().toISOString(),
    external_transaction_no: txNo,
    payment_method_type: paylinkRes?.paymentMethod || null,
  }).eq('id', intent.id);

  if (intent.purpose === 'wallet_topup') {
    let { data: wallet } = await admin.from('wallets').select('id').eq('user_id', intent.user_id).maybeSingle();
    if (!wallet) {
      const { data: w } = await admin.from('wallets').insert({ user_id: intent.user_id }).select('id').single();
      wallet = w;
    }
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

      // إشعار واتساب بإيداع الرصيد في المحفظة
      try {
        const { data: fresh } = await admin.from('wallets').select('balance').eq('id', wallet.id).maybeSingle();
        const phone = await getUserPhone(admin, intent.user_id);
        const { data: prof } = await admin.from('profiles').select('full_name').eq('id', intent.user_id).maybeSingle();
        if (phone) {
          await notifyWhatsApp(admin, {
            to: phone,
            event_key: 'wallet_credited',
            variables: {
              name: prof?.full_name || 'عميلنا العزيز',
              amount: Number(intent.amount || 0).toLocaleString('ar-SA'),
              reason: `شحن المحفظة - عملية ${intent.internal_order_number}`,
              balance: Number(fresh?.balance || 0).toLocaleString('ar-SA'),
              date: new Date().toISOString().slice(0, 10),
              link: 'https://fekrahedu.com/wallet',
            },
            user_id: intent.user_id,
            related_entity_type: 'wallet_topup',
            related_entity_id: intent.id,
          });
        }
      } catch (waError) {
        console.warn('wallet credit whatsapp skipped', waError);
      }
    }
  } else if (intent.purpose === 'invoice_payment' && intent.invoice_id) {
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
}
