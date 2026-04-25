import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const calcLevel = (xp: number) => Math.floor((xp || 0) / 500) + 1;

type Tier = 'common' | 'rare' | 'epic' | 'legendary';
const BASE: Record<Tier, { xp: number; points: number }> = {
  common:    { xp: 5,  points: 5  },
  rare:      { xp: 10, points: 10 },
  epic:      { xp: 25, points: 25 },
  legendary: { xp: 50, points: 50 },
};
const MAX_REWARD = 75;

function comboBonus(combo: number) {
  if (combo >= 5) return 10;
  if (combo >= 3) return 5;
  return 0;
}

async function tryAwardWalletPoints(
  admin: SupabaseClient,
  userId: string,
  taskId: string,
  points: number,
): Promise<number> {
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

    const { error: txErr } = await admin
      .from('student_wallet_transactions')
      .insert({
        user_id: userId,
        wallet_id: wallet.id,
        transaction_type: 'earn',
        source_type: 'task',
        source_id: taskId,
        points_amount: points,
        status: 'completed',
        description: 'مكافأة Loot بعد إكمال مهمة',
        metadata: { rule_code: 'TASK_LOOT_BONUS' },
      });
    if (txErr) return 0;

    await admin.from('student_wallets').update({
      points_balance: (wallet.points_balance || 0) + points,
      lifetime_earned_points: (wallet.lifetime_earned_points || 0) + points,
    }).eq('id', wallet.id);

    return points;
  } catch (e) {
    console.error('wallet loot award failed', e);
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

    const body = await req.json().catch(() => ({}));
    const taskId = body?.task_id;
    const comboCount = Number(body?.combo_count ?? 1);
    const tier = body?.loot_tier as Tier | undefined;

    if (!taskId || typeof taskId !== 'string') {
      return new Response(JSON.stringify({ error: 'task_id required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!tier || !(tier in BASE)) {
      return new Response(JSON.stringify({ error: 'invalid loot_tier' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!Number.isFinite(comboCount) || comboCount < 1 || comboCount > 20) {
      return new Response(JSON.stringify({ error: 'combo_count out of range' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify task ownership + completed
    const { data: task } = await supabase
      .from('student_tasks')
      .select('id, user_id, is_done')
      .eq('id', taskId).eq('user_id', userId).maybeSingle();
    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!task.is_done) {
      return new Response(JSON.stringify({ error: 'Task not completed' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Idempotency check (cheap pre-check; unique index is the source of truth)
    const { data: existing } = await admin
      .from('student_reward_events')
      .select('id, xp_amount, points_amount, reward_tier')
      .eq('user_id', userId).eq('source_type', 'task')
      .eq('source_id', taskId).eq('reward_type', 'loot').maybeSingle();
    if (existing) {
      return new Response(JSON.stringify({
        success: true, alreadyAwarded: true,
        xp_awarded: existing.xp_amount, points_awarded: existing.points_amount, tier: existing.reward_tier,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const base = BASE[tier];
    const bonus = comboBonus(comboCount);
    const xpAward = Math.min(MAX_REWARD, base.xp + bonus);
    const pointsAward = Math.min(MAX_REWARD, base.points + bonus);

    // Insert reward event first (unique index dedupes races)
    const { error: insErr } = await admin.from('student_reward_events').insert({
      user_id: userId,
      source_type: 'task',
      source_id: taskId,
      source_key: null,
      reward_type: 'loot',
      reward_tier: tier,
      xp_amount: xpAward,
      points_amount: pointsAward,
      status: 'completed',
      metadata: { combo_count: comboCount },
    });
    if (insErr) {
      // Likely race -> already awarded
      return new Response(JSON.stringify({ success: true, alreadyAwarded: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update XP/level
    const { data: profile } = await admin
      .from('student_profiles').select('xp').eq('user_id', userId).maybeSingle();
    const newXp = (profile?.xp || 0) + xpAward;
    const newLevel = calcLevel(newXp);
    await admin.from('student_profiles')
      .update({ xp: newXp, level_number: newLevel })
      .eq('user_id', userId);

    const pointsAwarded = await tryAwardWalletPoints(admin, userId, taskId, pointsAward);

    await admin.from('student_activity_logs').insert({
      user_id: userId,
      action: 'loot_bonus_awarded',
      metadata: { task_id: taskId, tier, combo_count: comboCount, xp: xpAward, points: pointsAwarded },
    });

    return new Response(JSON.stringify({
      success: true,
      xp_awarded: xpAward,
      points_awarded: pointsAwarded,
      tier,
      new_xp: newXp,
      level: newLevel,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('award_task_loot_bonus error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
