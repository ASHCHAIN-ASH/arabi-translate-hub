// create-payment-intent
// ينشئ نية دفع داخلية ثم يستدعي Paylink لإنشاء فاتورة دفع ويعيد URL الـ checkout
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import {
  createPaylinkInvoice,
  type CreateInvoiceArgs,
} from '../_shared/paylink-adapter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateIntentBody {
  purpose: 'wallet_topup' | 'invoice_payment' | 'contract_payment';
  amount: number;
  invoice_id?: string;
  service_order_id?: string;
  contract_id?: string;
  return_url?: string;
  provider_mode?: 'hosted' | 'embedded';
  note?: string;
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
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const user = userData.user;

    const body: CreateIntentBody = await req.json();
    if (!body?.purpose || !body?.amount || body.amount <= 0) {
      return new Response(JSON.stringify({ error: 'invalid_request' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Validate target ownership for invoice/contract payments
    let serverAmount = Number(body.amount);
    if (body.purpose === 'invoice_payment') {
      if (!body.invoice_id) {
        return new Response(JSON.stringify({ error: 'invoice_id_required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { data: inv } = await admin.from('invoices')
        .select('id, user_id, total_amount, paid_amount, status')
        .eq('id', body.invoice_id).maybeSingle();
      if (!inv || inv.user_id !== user.id) {
        return new Response(JSON.stringify({ error: 'invoice_not_found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const remaining = Number(inv.total_amount || 0) - Number(inv.paid_amount || 0);
      // Trust server amount over client amount
      serverAmount = remaining > 0 ? remaining : Number(body.amount);
    }

    // Generate internal order number
    const { data: numData, error: numErr } = await admin
      .rpc('generate_internal_order_number');
    if (numErr || !numData) throw new Error('failed_to_generate_order_number');
    const internalOrderNumber: string = numData as string;

    // Build callback URL (our verify endpoint will be called by browser on return)
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';
    const baseReturn = body.return_url
      || (origin ? `${origin.replace(/\/$/, '')}/payment/return` : 'https://masteredupath.com/payment/return');
    const callBackUrl = `${baseReturn}?order=${encodeURIComponent(internalOrderNumber)}`;

    // Fetch customer info for Paylink
    const { data: customer } = await admin.from('customers')
      .select('name, email, phone').eq('user_id', user.id).maybeSingle();
    const clientName = customer?.name || user.email?.split('@')[0] || 'Customer';
    const clientEmail = customer?.email || user.email || '';
    const clientMobile = (customer?.phone || '').replace(/[^0-9]/g, '') || '0500000000';

    // Insert payment_intent FIRST (so we have a record even if Paylink call fails)
    const { data: intent, error: insErr } = await admin.from('payment_intents').insert({
      user_id: user.id,
      service_order_id: body.service_order_id || null,
      invoice_id: body.invoice_id || null,
      contract_id: body.contract_id || null,
      provider: 'paylink',
      provider_mode: body.provider_mode || 'hosted',
      internal_order_number: internalOrderNumber,
      amount: serverAmount,
      currency: 'SAR',
      status: 'created',
      purpose: body.purpose,
      return_url: baseReturn,
      callback_url: callBackUrl,
      metadata: { client_origin: origin, note: body.note || null },
    }).select().single();
    if (insErr) throw insErr;

    // Call Paylink
    const args: CreateInvoiceArgs = {
      amount: serverAmount,
      clientName,
      clientEmail,
      clientMobile,
      orderNumber: internalOrderNumber,
      callBackUrl,
      currency: 'SAR',
      note: body.note || (
        body.purpose === 'wallet_topup' ? 'شحن المحفظة'
        : body.purpose === 'invoice_payment' ? 'دفع فاتورة'
        : 'دفع طلب خدمة'
      ),
    };

    let paylinkRes: any = null;
    let attemptStatus: 'success' | 'failed' = 'success';
    let errorMsg: string | null = null;
    try {
      paylinkRes = await createPaylinkInvoice(args);
    } catch (e: any) {
      attemptStatus = 'failed';
      errorMsg = e?.message || String(e);
    }

    await admin.from('payment_attempts').insert({
      payment_intent_id: intent.id,
      attempt_no: 1,
      action: 'create_invoice',
      request_payload: args,
      response_payload: paylinkRes,
      status: attemptStatus,
      error_message: errorMsg,
    });

    if (attemptStatus === 'failed') {
      await admin.from('payment_intents').update({
        status: 'failed', failure_reason: errorMsg, failed_at: new Date().toISOString(),
      }).eq('id', intent.id);
      return new Response(JSON.stringify({ error: 'gateway_error', message: errorMsg }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update intent with external IDs and checkout URL
    await admin.from('payment_intents').update({
      status: 'pending',
      external_transaction_no: paylinkRes?.transactionNo || null,
      checkout_url: paylinkRes?.url || null,
    }).eq('id', intent.id);

    return new Response(JSON.stringify({
      ok: true,
      payment_intent_id: intent.id,
      internal_order_number: internalOrderNumber,
      external_transaction_no: paylinkRes?.transactionNo,
      checkout_url: paylinkRes?.url,
      amount: serverAmount,
      currency: 'SAR',
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'internal_error', message: e?.message || String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
