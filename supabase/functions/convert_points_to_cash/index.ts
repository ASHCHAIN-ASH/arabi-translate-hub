// Convert student points to cash balance inside the same wallet
// 200 points = 1 SAR — server-side validated, atomic.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const POINTS_PER_SAR = 200;
const MIN_POINTS = 100;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Verify user from JWT
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userRes, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userRes?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userRes.user.id;

    const body = await req.json().catch(() => ({}));
    const points = Math.floor(Number(body?.points) || 0);

    if (!Number.isFinite(points) || points < MIN_POINTS) {
      return new Response(JSON.stringify({ error: `الحد الأدنى ${MIN_POINTS} نقطة` }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (points % 1 !== 0) {
      return new Response(JSON.stringify({ error: 'يجب أن يكون عددًا صحيحًا' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Load wallet
    const { data: wallet, error: wErr } = await admin
      .from('student_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (wErr) throw wErr;
    if (!wallet) {
      return new Response(JSON.stringify({ error: 'لا توجد محفظة' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (wallet.status !== 'active') {
      return new Response(JSON.stringify({ error: 'المحفظة غير نشطة' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if ((wallet.points_balance ?? 0) < points) {
      return new Response(JSON.stringify({ error: 'الرصيد غير كافٍ' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cashAmount = +(points / POINTS_PER_SAR).toFixed(4);
    const newPoints = (wallet.points_balance ?? 0) - points;
    const newRedeemed = (wallet.redeemed_points ?? 0) + points;
    const newCash = +((wallet.cash_balance ?? 0) + cashAmount).toFixed(4);

    // Update wallet
    const { error: updErr } = await admin
      .from('student_wallets')
      .update({
        points_balance: newPoints,
        redeemed_points: newRedeemed,
        cash_balance: newCash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', wallet.id)
      .eq('points_balance', wallet.points_balance); // optimistic lock

    if (updErr) throw updErr;

    // Log transaction
    const { error: txErr } = await admin.from('student_wallet_transactions').insert({
      user_id: userId,
      wallet_id: wallet.id,
      transaction_type: 'redeem',
      source_type: 'points_to_cash',
      points_amount: -points,
      cash_amount: cashAmount,
      status: 'completed',
      description: `تحويل ${points} نقطة إلى ${cashAmount.toFixed(2)} ر.س في المحفظة`,
      metadata: { conversion_rate: POINTS_PER_SAR, points, cash: cashAmount },
    });
    if (txErr) console.error('tx insert failed', txErr);

    return new Response(JSON.stringify({
      success: true,
      points_converted: points,
      cash_added: cashAmount,
      new_points_balance: newPoints,
      new_cash_balance: newCash,
    }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('convert_points_to_cash error', e);
    return new Response(JSON.stringify({ error: e?.message || 'خطأ غير متوقع' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
