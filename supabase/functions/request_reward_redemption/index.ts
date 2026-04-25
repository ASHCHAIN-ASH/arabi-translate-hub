import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ALLOWED_TYPES = new Set(['coupon', 'cash', 'gift', 'service_credit']);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const redemptionType = String(body?.redemption_type || '');
    const pointsSpent = Math.floor(Number(body?.points_spent) || 0);
    const notes = body?.notes ? String(body.notes).slice(0, 500) : null;

    if (!ALLOWED_TYPES.has(redemptionType)) {
      return new Response(JSON.stringify({ error: 'Invalid redemption_type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (pointsSpent < 100) {
      return new Response(JSON.stringify({ error: 'Minimum 100 points' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Get or create wallet
    let { data: wallet } = await admin
      .from('student_wallets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (!wallet) {
      const { data: created, error: cErr } = await admin
        .from('student_wallets')
        .insert({ user_id: userId })
        .select('*')
        .single();
      if (cErr) throw cErr;
      wallet = created;
    }

    if (wallet.status !== 'active') {
      return new Response(JSON.stringify({ error: 'Wallet is not active' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if ((wallet.points_balance || 0) < pointsSpent) {
      return new Response(JSON.stringify({ error: 'Insufficient points' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Conversion rate: 200 points = 1 SAR
    const cashValue = Number((pointsSpent / 200).toFixed(2));

    // Move points from balance to pending
    const { error: updErr } = await admin
      .from('student_wallets')
      .update({
        points_balance: (wallet.points_balance || 0) - pointsSpent,
        pending_points: (wallet.pending_points || 0) + pointsSpent,
      })
      .eq('id', wallet.id)
      .eq('user_id', userId);
    if (updErr) throw updErr;

    // Create redemption request
    const { data: redemption, error: redErr } = await admin
      .from('reward_redemptions')
      .insert({
        user_id: userId,
        wallet_id: wallet.id,
        redemption_type: redemptionType,
        points_spent: pointsSpent,
        cash_value: cashValue,
        status: 'pending',
        notes,
      })
      .select('*')
      .single();
    if (redErr) throw redErr;

    // Pending transaction
    await admin.from('student_wallet_transactions').insert({
      user_id: userId,
      wallet_id: wallet.id,
      transaction_type: 'redeem',
      source_type: 'admin_adjustment',
      source_id: redemption.id,
      points_amount: -pointsSpent,
      cash_amount: 0,
      status: 'pending',
      description: `طلب استبدال (${redemptionType})`,
      metadata: { redemption_id: redemption.id, redemption_type: redemptionType },
    });

    await admin.from('student_activity_logs').insert({
      user_id: userId,
      action: 'redemption_requested',
      metadata: { redemption_id: redemption.id, points_spent: pointsSpent, cash_value: cashValue, type: redemptionType },
    });

    return new Response(JSON.stringify({ success: true, redemption }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('request_reward_redemption error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
