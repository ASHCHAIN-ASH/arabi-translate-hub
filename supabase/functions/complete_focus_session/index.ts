import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FOCUS_XP = 30;
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

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    const body = await req.json().catch(() => ({}));
    const rawDuration = Number(body?.duration);
    if (!Number.isFinite(rawDuration) || rawDuration <= 0 || rawDuration > 600) {
      return new Response(JSON.stringify({ error: 'duration must be 1..600 minutes' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const duration = Math.floor(rawDuration);
    const now = new Date().toISOString();
    const startedAt = new Date(Date.now() - duration * 60_000).toISOString();

    // Insert completed study session
    const { data: session, error: sessErr } = await supabase
      .from('study_sessions')
      .insert({
        user_id: userId,
        duration_minutes: duration,
        status: 'completed',
        started_at: startedAt,
        completed_at: now,
        earned_xp: FOCUS_XP,
      })
      .select('*')
      .single();
    if (sessErr) throw sessErr;

    // Update profile XP + level
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('xp')
      .eq('user_id', userId)
      .maybeSingle();
    const newXp = (profile?.xp || 0) + FOCUS_XP;
    const newLevel = calcLevel(newXp);

    await supabase
      .from('student_profiles')
      .update({ xp: newXp, level_number: newLevel })
      .eq('user_id', userId);

    // Update day focus_minutes
    const today = now.slice(0, 10);
    const { data: day } = await supabase
      .from('student_day_state')
      .select('id, focus_minutes')
      .eq('user_id', userId)
      .eq('day_date', today)
      .maybeSingle();

    if (day) {
      await supabase
        .from('student_day_state')
        .update({ focus_minutes: (day.focus_minutes || 0) + duration })
        .eq('id', day.id)
        .eq('user_id', userId);
    } else {
      await supabase.from('student_day_state').insert({
        user_id: userId, day_date: today, status: 'active',
        started_at: now, focus_minutes: duration,
      });
    }

    await supabase.from('student_activity_logs').insert({
      user_id: userId,
      action: 'focus_completed',
      metadata: { session_id: session.id, duration_minutes: duration, xp_awarded: FOCUS_XP, new_xp: newXp, level: newLevel },
    });

    return new Response(JSON.stringify({
      success: true, session, xp_awarded: FOCUS_XP, new_xp: newXp, level: newLevel,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('complete_focus_session error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
