import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const calcLevel = (xp: number) => Math.floor((xp || 0) / 500) + 1;

const TASKS_GOAL = 10;
const SESSIONS_GOAL = 5;
const XP_REWARD = 500;
const POINTS_REWARD = 500;

// ISO week key YYYY-WW
function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${date.getUTCFullYear()}-${String(week).padStart(2, '0')}`;
}

// Sunday-start week (matches the UI)
function startOfWeekSun(d = new Date()) {
  const x = new Date(d);
  const day = x.getUTCDay();
  x.setUTCHours(0, 0, 0, 0);
  x.setUTCDate(x.getUTCDate() - day);
  return x;
}

async function tryAwardWalletPoints(admin: SupabaseClient, userId: string, weekKey: string, points: number): Promise<number> {
  if (points <= 0) return 0;
  try {
    let { data: wallet } = await admin
      .from('student_wallets').select('*').eq('user_id', userId).maybeSingle();
    if (!wallet) {
      const { data: created } = await admin
        .from('student_wallets').insert({ user_id: userId }).select('*').single();
      wallet = created;
    }
    if (!wallet || wallet.status !== 'active') return 0;

    // Use a synthetic uuid based on week for uniqueness in wallet tx (optional)
    const { error: txErr } = await admin
      .from('student_wallet_transactions')
      .insert({
        user_id: userId,
        wallet_id: wallet.id,
        transaction_type: 'earn',
        source_type: 'challenge',
        source_id: null,
        points_amount: points,
        status: 'completed',
        description: 'مكافأة Boss Challenge الأسبوعي',
        metadata: { rule_code: 'BOSS_WEEKLY', week_key: weekKey },
      });
    if (txErr) {
      console.error('boss wallet tx insert failed', txErr);
      return 0;
    }

    await admin.from('student_wallets').update({
      points_balance: (wallet.points_balance || 0) + points,
      lifetime_earned_points: (wallet.lifetime_earned_points || 0) + points,
    }).eq('id', wallet.id);

    return points;
  } catch (e) {
    console.error('boss wallet award failed', e);
    return 0;
  }
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
    const { data: u, error: uErr } = await supabase.auth.getUser();
    if (uErr || !u?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = u.user.id;

    // Always compute week server-side
    const weekKey = isoWeekKey();
    const sow = startOfWeekSun();
    const eow = new Date(sow); eow.setUTCDate(eow.getUTCDate() + 7);

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Already claimed?
    const { data: existing } = await admin
      .from('student_reward_events')
      .select('id, xp_amount, points_amount')
      .eq('user_id', userId).eq('source_type', 'boss_challenge')
      .eq('source_key', weekKey).eq('reward_type', 'weekly_boss').maybeSingle();
    if (existing) {
      return new Response(JSON.stringify({
        success: true, alreadyClaimed: true, week_key: weekKey,
        xp_awarded: existing.xp_amount, points_awarded: existing.points_amount,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Verify thresholds
    const sowIso = sow.toISOString();
    const eowIso = eow.toISOString();

    const { count: tasksCount } = await admin
      .from('student_tasks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('is_done', true)
      .gte('completed_at', sowIso).lt('completed_at', eowIso);

    const { count: sessionsCount } = await admin
      .from('study_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'completed')
      .gte('completed_at', sowIso).lt('completed_at', eowIso);

    const tasksDone = tasksCount || 0;
    const sessionsDone = sessionsCount || 0;

    if (tasksDone < TASKS_GOAL || sessionsDone < SESSIONS_GOAL) {
      return new Response(JSON.stringify({
        error: 'Boss challenge requirements not met',
        tasks_done: tasksDone, tasks_goal: TASKS_GOAL,
        sessions_done: sessionsDone, sessions_goal: SESSIONS_GOAL,
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Insert reward event (unique index handles races)
    const { error: insErr } = await admin.from('student_reward_events').insert({
      user_id: userId,
      source_type: 'boss_challenge',
      source_id: null,
      source_key: weekKey,
      reward_type: 'weekly_boss',
      reward_tier: 'boss',
      xp_amount: XP_REWARD,
      points_amount: POINTS_REWARD,
      status: 'completed',
      metadata: { week_key: weekKey, tasks_done: tasksDone, sessions_done: sessionsDone },
    });
    if (insErr) {
      return new Response(JSON.stringify({ success: true, alreadyClaimed: true, week_key: weekKey }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update XP/level
    const { data: profile } = await admin
      .from('student_profiles').select('xp').eq('user_id', userId).maybeSingle();
    const newXp = (profile?.xp || 0) + XP_REWARD;
    const newLevel = calcLevel(newXp);
    await admin.from('student_profiles')
      .update({ xp: newXp, level_number: newLevel })
      .eq('user_id', userId);

    const pointsAwarded = await tryAwardWalletPoints(admin, userId, weekKey, POINTS_REWARD);

    await admin.from('student_activity_logs').insert({
      user_id: userId,
      action: 'boss_reward_claimed',
      metadata: { week_key: weekKey, xp: XP_REWARD, points: pointsAwarded, tasks_done: tasksDone, sessions_done: sessionsDone },
    });

    return new Response(JSON.stringify({
      success: true,
      week_key: weekKey,
      xp_awarded: XP_REWARD,
      points_awarded: pointsAwarded,
      new_xp: newXp,
      level: newLevel,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('claim_boss_challenge_reward error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
