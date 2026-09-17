// moyasar-create-intent
// ينشئ نية دفع داخلية للدفع الفوري بالبطاقة عبر مُيسّر، ويعيد المفتاح المنشور للنموذج
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

interface Body {
  purpose?: 'wallet_topup' | 'invoice_payment' | 'contract_payment' | 'research_publication_payment';
  amount?: number;
  invoice_id?: string;
  service_order_id?: string;
  contract_id?: string;
  research_publication_id?: string;
  return_url?: string;
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
    if (userErr || !userData?.user) return json({ error: 'unauthorized' }, 401);
    const user = userData.user;

    const body = (await req.json().catch(() => ({}))) as Body;
    const purpose = body.purpose;
    if (!purpose || !body.amount || Number(body.amount) <= 0) {
      return json({ error: 'invalid_request', message: 'بيانات الدفع غير مكتملة' }, 400);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // المبلغ يُحتسب من الخادم لا من المتصفح
    let serverAmount = Number(body.amount);

    if (purpose === 'invoice_payment') {
      if (!body.invoice_id) return json({ error: 'invoice_id_required' }, 400);
      const { data: inv } = await admin.from('invoices')
        .select('id, user_id, total_amount, paid_amount, status')
        .eq('id', body.invoice_id).maybeSingle();
      if (!inv || inv.user_id !== user.id) return json({ error: 'invoice_not_found' }, 404);
      const remaining = Number(inv.total_amount || 0) - Number(inv.paid_amount || 0);
      if (remaining <= 0) return json({ error: 'invoice_already_paid', message: 'الفاتورة مدفوعة بالكامل' }, 409);
      serverAmount = remaining;
    }

    if (purpose === 'research_publication_payment') {
      if (!body.research_publication_id) return json({ error: 'research_publication_id_required' }, 400);
      const { data: rp } = await admin.from('research_publications')
        .select('id, user_id, status, final_amount, estimated_amount')
        .eq('id', body.research_publication_id).maybeSingle();
      if (!rp || rp.user_id !== user.id) return json({ error: 'research_publication_not_found' }, 404);
      if (!['quoted', 'approved', 'in_progress'].includes(rp.status)) {
        return json({ error: 'research_publication_not_payable' }, 400);
      }
      const due = Number(rp.final_amount ?? rp.estimated_amount ?? 0);
      if (due > 0) serverAmount = due;
    }

    if (purpose === 'wallet_topup' && serverAmount < 1) {
      return json({ error: 'amount_too_small', message: 'أقل مبلغ للشحن ريال واحد' }, 400);
    }

    const { data: numData, error: numErr } = await admin.rpc('generate_internal_order_number');
    if (numErr || !numData) throw new Error('failed_to_generate_order_number');
    const internalOrderNumber = numData as string;

    const origin = req.headers.get('origin') || 'https://fekrahedu.com';
    const baseReturn = body.return_url || `${origin.replace(/\/$/, '')}/payment/return`;
    const callbackUrl = `${baseReturn}?order=${encodeURIComponent(internalOrderNumber)}&provider=moyasar`;

    const description = body.note || (
      purpose === 'wallet_topup' ? `شحن محفظة FekrahEdu - ${internalOrderNumber}`
      : purpose === 'invoice_payment' ? `سداد فاتورة - ${internalOrderNumber}`
      : purpose === 'research_publication_payment' ? `دفع طلب نشر بحث - ${internalOrderNumber}`
      : `دفع خدمة أكاديمية - ${internalOrderNumber}`
    );

    const { data: intent, error: insErr } = await admin.from('payment_intents').insert({
      user_id: user.id,
      service_order_id: body.service_order_id || null,
      invoice_id: body.invoice_id || null,
      contract_id: body.contract_id || null,
      provider: 'moyasar',
      provider_mode: 'embedded',
      internal_order_number: internalOrderNumber,
      amount: serverAmount,
      currency: 'SAR',
      status: 'pending',
      purpose,
      return_url: baseReturn,
      callback_url: callbackUrl,
      metadata: {
        client_origin: origin,
        note: body.note || null,
        research_publication_id: body.research_publication_id || null,
      },
    }).select().single();
    if (insErr) throw insErr;

    return json({
      ok: true,
      payment_intent_id: intent.id,
      internal_order_number: internalOrderNumber,
      amount: serverAmount,
      amount_halalas: toHalalas(serverAmount),
      currency: 'SAR',
      description,
      callback_url: callbackUrl,
      publishable_key: getMoyasarPublishableKey(),
    });
  } catch (e: any) {
    console.error('moyasar-create-intent failed', e?.message || e);
    return json({ error: 'internal_error', message: e?.message || String(e) }, 500);
  }
});
