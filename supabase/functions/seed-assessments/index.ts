// One-shot seeder for the 12 specialization assessment question banks.
// Uses the bundled data.json (181 AI-generated MCQs across 12 specs).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2.95.0/cors';
import data from './data.json' with { type: 'json' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const summary: Record<string, { inserted: number; skipped?: string }> = {};

  for (const [slug, info] of Object.entries(data as Record<string, any>)) {
    const { data: a } = await supabase.from('assessments').select('id').eq('slug', slug).maybeSingle();
    if (!a?.id) { summary[slug] = { inserted: 0, skipped: 'assessment not found' }; continue; }

    // Wipe existing questions for this assessment (cascades to options/answers via FK? -> manually delete)
    const { data: oldQs } = await supabase.from('assessment_questions').select('id').eq('assessment_id', a.id);
    const oldIds = (oldQs || []).map((q: any) => q.id);
    if (oldIds.length) {
      await supabase.from('assessment_options').delete().in('question_id', oldIds);
      await supabase.from('assessment_questions').delete().in('id', oldIds);
    }

    let inserted = 0;
    const qs = info.questions || [];
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const { data: qRow, error: qErr } = await supabase.from('assessment_questions').insert({
        assessment_id: a.id,
        question_text: q.question_text,
        difficulty: q.difficulty || 'medium',
        skill_tag: q.skill_tag || 'general',
        explanation: q.explanation || null,
        order_index: i,
      }).select('id').single();
      if (qErr || !qRow) { console.error(slug, i, qErr); continue; }
      const opts = (q.options || []).map((o: any, j: number) => ({
        question_id: qRow.id,
        option_text: o.text,
        is_correct: !!o.is_correct,
        order_index: j,
      }));
      const { error: oErr } = await supabase.from('assessment_options').insert(opts);
      if (oErr) console.error('opts', slug, i, oErr);
      else inserted++;
    }
    summary[slug] = { inserted };
  }

  return new Response(JSON.stringify({ success: true, summary }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
