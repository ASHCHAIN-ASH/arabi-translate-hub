import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const calcLevel = (xp: number) => Math.floor((xp || 0) / 500) + 1;

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

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = claims.claims.sub;

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

    return new Response(JSON.stringify({
      success: true, xp_awarded: reward, new_xp: newXp, level: newLevel,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('complete_student_task error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
