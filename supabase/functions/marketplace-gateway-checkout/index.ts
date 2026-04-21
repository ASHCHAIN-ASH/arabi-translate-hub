// إنشاء جلسة دفع لشراء منتج من متجر XP عبر بوابة الدفع (Paylink)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { createPaylinkInvoice } from '../_shared/paylink-adapter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
      return new Response(JSON.stringify({ success: false, error: 'unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const user = userData.user;

    const body = await req.json().catch(() => ({}));
    const itemId = String(body?.item_id || '').trim();
    const amountSar = Number(body?.amount_sar || 0);

    if (!itemId || !amountSar || amountSar <= 0) {
      return new Response(JSON.stringify({ success: false, error: 'invalid_request' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // جلب المنتج للتحقق من السعر
    const { data: item, error: itemErr } = await admin
      .from('marketplace_items')
      .select('id, slug, title_ar, price_sar, xp_to_sar_rate, xp_cost, allow_payment_methods, is_active, stock, total_purchased')
      .eq('id', itemId)
      .maybeSingle();

    if (itemErr || !item || !item.is_active) {
      return new Response(JSON.stringify({ success: false, error: 'item_unavailable' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (item.stock != null && item.total_purchased >= item.stock) {
      return new Response(JSON.stringify({ success: false, error: 'out_of_stock' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allow = (item.allow_payment_methods || ['xp', 'wallet', 'gateway']) as string[];
    if (!allow.includes('gateway')) {
      return new Response(JSON.stringify({ success: false, error: 'gateway_not_allowed' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // تحقق من السعر الفعلي (لمنع التلاعب)
    const computed = item.price_sar != null
      ? Number(item.price_sar)
      : Math.round((Number(item.xp_cost) / (Number(item.xp_to_sar_rate) || 100)) * 100) / 100;
    if (Math.abs(computed - amountSar) > 0.01) {
      return new Response(JSON.stringify({ success: false, error: 'price_mismatch', expected: computed }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // إنشاء payment_intent
    const { data: intent, error: intentErr } = await admin
      .from('payment_intents')
      .insert({
        user_id: user.id,
        purpose: 'marketplace_purchase',
        amount: amountSar,
        currency: 'SAR',
        status: 'pending',
        metadata: { item_id: item.id, item_slug: item.slug, item_title: item.title_ar },
      })
      .select('id')
      .single();

    if (intentErr || !intent) {
      console.error('intent error', intentErr);
      return new Response(JSON.stringify({ success: false, error: 'intent_failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // إنشاء فاتورة Paylink
    try {
      const origin = req.headers.get('origin') || req.headers.get('referer') || '';
      const returnUrl = `${origin.replace(/\/$/, '')}/marketplace?purchase=success&intent=${intent.id}`;

      const inv = await createPaylinkInvoice({
        amount: amountSar,
        clientName: user.email?.split('@')[0] || 'Customer',
        clientEmail: user.email || '',
        clientMobile: user.phone || '',
        orderNumber: `MKT-${intent.id.slice(0, 8)}`,
        note: `شراء من متجر XP: ${item.title_ar}`,
        callBackUrl: returnUrl,
      });

      // حدّث payment_intent بمعرّف الفاتورة
      await admin
        .from('payment_intents')
        .update({
          provider: 'paylink',
          provider_transaction_no: inv.transactionNo || null,
          checkout_url: inv.url,
          metadata: {
            item_id: item.id, item_slug: item.slug, item_title: item.title_ar,
            paylink_transaction_no: inv.transactionNo,
          },
        })
        .eq('id', intent.id);

      return new Response(JSON.stringify({ success: true, checkout_url: inv.url, intent_id: intent.id }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (e: any) {
      console.error('paylink error', e);
      await admin.from('payment_intents').update({ status: 'failed', error_message: e?.message || 'paylink_error' }).eq('id', intent.id);
      return new Response(JSON.stringify({ success: false, error: 'gateway_error', detail: e?.message }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (err: any) {
    console.error('checkout error', err);
    return new Response(JSON.stringify({ success: false, error: 'unexpected', detail: err?.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
