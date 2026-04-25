import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function awardPoints(
  admin: SupabaseClient,
  args: { userId: string; ruleCode: string; sourceType: string; sourceId: string; description?: string },
): Promise<number> {
  const { userId, ruleCode, sourceType, sourceId, description } = args;
  const { data: rule } = await admin
    .from('reward_rules').select('*').eq('code', ruleCode).eq('is_active', true).maybeSingle();
  if (!rule || (rule.points_reward || 0) <= 0) return 0;

  let { data: wallet } = await admin
    .from('student_wallets').select('*').eq('user_id', userId).maybeSingle();
  if (!wallet) {
    const { data: created } = await admin
      .from('student_wallets').insert({ user_id: userId }).select('*').single();
    wallet = created;
  }
  if (!wallet || wallet.status !== 'active') return 0;

  if ((rule.daily_limit || 0) > 0) {
    const today = new Date().toISOString().slice(0, 10);
    const { data: todayTx } = await admin
      .from('student_wallet_transactions')
      .select('points_amount')
      .eq('user_id', userId).eq('source_type', sourceType).eq('transaction_type', 'earn')
      .gte('created_at', `${today}T00:00:00.000Z`);
    const earnedToday = (todayTx || []).reduce((s: number, r: any) => s + (r.points_amount || 0), 0);
    if (earnedToday >= rule.daily_limit) return 0;
  }

  const points = rule.points_reward;
  const { error: txErr } = await admin.from('student_wallet_transactions').insert({
    user_id: userId, wallet_id: wallet.id, transaction_type: 'earn',
    source_type: sourceType, source_id: sourceId, points_amount: points,
    status: 'completed', description: description || rule.name_ar,
    metadata: { rule_code: ruleCode },
  });
  if (txErr) return 0;

  await admin.from('student_wallets').update({
    points_balance: (wallet.points_balance || 0) + points,
    lifetime_earned_points: (wallet.lifetime_earned_points || 0) + points,
  }).eq('id', wallet.id);

  await admin.from('student_activity_logs').insert({
    user_id: userId, action: 'wallet_points_earned',
    metadata: { rule_code: ruleCode, points, source_type: sourceType, source_id: sourceId },
  });
  return points;
}


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date().toISOString();

    // Upsert day state — keyed by (user_id, day_date)
    const { data: existing } = await supabase
      .from('student_day_state')
      .select('id, status, started_at')
      .eq('user_id', userId)
      .eq('day_date', today)
      .maybeSingle();

    let dayRow;
    if (existing) {
      const { data, error } = await supabase
        .from('student_day_state')
        .update({
          status: 'active',
          started_at: existing.started_at ?? now,
        })
        .eq('id', existing.id)
        .eq('user_id', userId)
        .select('*')
        .single();
      if (error) throw error;
      dayRow = data;
    } else {
      const { data, error } = await supabase
        .from('student_day_state')
        .insert({
          user_id: userId,
          day_date: today,
          status: 'active',
          started_at: now,
        })
        .select('*')
        .single();
      if (error) throw error;
      dayRow = data;
    }

    await supabase.from('student_activity_logs').insert({
      user_id: userId,
      action: 'day_started',
      metadata: { day_date: today },
    });

    return new Response(JSON.stringify({ success: true, day: dayRow }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('start_student_day error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
