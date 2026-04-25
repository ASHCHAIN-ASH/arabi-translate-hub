import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const calcLevel = (xp: number) => Math.floor((xp || 0) / 500) + 1;

// Awards wallet points using a reward_rule. Idempotent per (user_id, source_type, source_id).
// Returns points actually awarded (0 if duplicate, daily-limit reached, rule inactive, or wallet inactive).
async function awardPoints(
  admin: SupabaseClient,
  args: { userId: string; ruleCode: string; sourceType: string; sourceId: string; description?: string },
): Promise<number> {
  const { userId, ruleCode, sourceType, sourceId, description } = args;

  // 1) Load rule
  const { data: rule } = await admin
    .from('reward_rules')
    .select('*')
    .eq('code', ruleCode)
    .eq('is_active', true)
    .maybeSingle();
  if (!rule || (rule.points_reward || 0) <= 0) return 0;

  // 2) Ensure wallet
  let { data: wallet } = await admin
    .from('student_wallets')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (!wallet) {
    const { data: created } = await admin
      .from('student_wallets')
      .insert({ user_id: userId })
      .select('*')
      .single();
    wallet = created;
  }
  if (!wallet || wallet.status !== 'active') return 0;

  // 3) Daily limit check
  if ((rule.daily_limit || 0) > 0) {
    const today = new Date().toISOString().slice(0, 10);
    const { data: todayTx } = await admin
      .from('student_wallet_transactions')
      .select('points_amount')
      .eq('user_id', userId)
      .eq('source_type', sourceType)
      .eq('transaction_type', 'earn')
      .gte('created_at', `${today}T00:00:00.000Z`);
    const earnedToday = (todayTx || []).reduce((s: number, r: any) => s + (r.points_amount || 0), 0);
    if (earnedToday >= rule.daily_limit) return 0;
  }

  // 4) Insert tx — unique index on (user_id, source_type, source_id) WHERE earn handles dedupe
  const points = rule.points_reward;
  const { error: txErr } = await admin
    .from('student_wallet_transactions')
    .insert({
      user_id: userId,
      wallet_id: wallet.id,
      transaction_type: 'earn',
      source_type: sourceType,
      source_id: sourceId,
      points_amount: points,
      status: 'completed',
      description: description || rule.name_ar,
      metadata: { rule_code: ruleCode },
    });
  if (txErr) {
    // Likely duplicate — silently ignore
    return 0;
  }

  // 5) Update wallet balances
  await admin
    .from('student_wallets')
    .update({
      points_balance: (wallet.points_balance || 0) + points,
      lifetime_earned_points: (wallet.lifetime_earned_points || 0) + points,
    })
    .eq('id', wallet.id);

  // 6) Activity log
  await admin.from('student_activity_logs').insert({
    user_id: userId,
    action: 'wallet_points_earned',
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

    const body = await req.json().catch(() => ({}));
    const taskId = body?.task_id;
    if (!taskId || typeof taskId !== 'string') {
      return new Response(JSON.stringify({ error: 'task_id is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify task ownership
    const { data: task, error: taskErr } = await supabase
      .from('student_tasks')
      .select('id, user_id, xp_reward, is_done, title')
      .eq('id', taskId)
      .eq('user_id', userId)
      .maybeSingle();
    if (taskErr) throw taskErr;
    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (task.is_done) {
      return new Response(JSON.stringify({ success: true, alreadyDone: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const now = new Date().toISOString();
    const reward = Number(task.xp_reward) || 0;

    // Mark task done
    const { error: updErr } = await supabase
      .from('student_tasks')
      .update({ is_done: true, completed_at: now, done_at: now })
      .eq('id', taskId)
      .eq('user_id', userId);
    if (updErr) throw updErr;

    // Update profile XP + level
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('xp')
      .eq('user_id', userId)
      .maybeSingle();
    const newXp = (profile?.xp || 0) + reward;
    const newLevel = calcLevel(newXp);

    await supabase
      .from('student_profiles')
      .update({ xp: newXp, level_number: newLevel })
      .eq('user_id', userId);

    // Increment day completed_tasks_count for today
    const today = now.slice(0, 10);
    const { data: day } = await supabase
      .from('student_day_state')
      .select('id, completed_tasks_count')
      .eq('user_id', userId)
      .eq('day_date', today)
      .maybeSingle();

    if (day) {
      await supabase
        .from('student_day_state')
        .update({ completed_tasks_count: (day.completed_tasks_count || 0) + 1 })
        .eq('id', day.id)
        .eq('user_id', userId);
    } else {
      await supabase.from('student_day_state').insert({
        user_id: userId, day_date: today, status: 'active',
        started_at: now, completed_tasks_count: 1,
      });
    }

    await supabase.from('student_activity_logs').insert({
      user_id: userId,
      action: 'task_completed',
      metadata: { task_id: taskId, title: task.title, xp_awarded: reward, new_xp: newXp, level: newLevel },
    });

    // === Study-to-Earn: award wallet points ===
    let pointsAwarded = 0;
    try {
      const admin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      pointsAwarded = await awardPoints(admin, {
        userId,
        ruleCode: 'TASK_COMPLETED',
        sourceType: 'task',
        sourceId: taskId,
        description: `إكمال مهمة: ${task.title}`,
      });
    } catch (we) {
      console.error('wallet award failed', we);
    }

    return new Response(JSON.stringify({
      success: true, xp_awarded: reward, new_xp: newXp, level: newLevel, points_awarded: pointsAwarded,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('complete_student_task error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
