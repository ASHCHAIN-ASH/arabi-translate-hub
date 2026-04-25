import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
