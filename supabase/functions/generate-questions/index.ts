// توليد 10 أسئلة لمادة معيّنة عبر Lovable AI (للأدمن فقط)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'lovable_ai_not_configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const auth = req.headers.get('Authorization') || '';
    const userClient = createClient(SUPABASE_URL, ANON, { global: { headers: { Authorization: auth } } });
    const { data: u, error: ue } = await userClient.auth.getUser();
    if (ue || !u?.user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleRow } = await admin.from('user_roles').select('role').eq('user_id', u.user.id).eq('role', 'admin').maybeSingle();
    if (!roleRow) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const body = await req.json().catch(() => ({}));
    const subjectId = String(body?.subject_id || '');
    const count = Math.min(Math.max(Number(body?.count || 10), 1), 20);
    const difficulty = ['easy', 'medium', 'hard'].includes(body?.difficulty) ? body.difficulty : 'medium';

    if (!subjectId) return new Response(JSON.stringify({ error: 'subject_required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { data: subject } = await admin.from('subjects').select('name_ar, name_en, description, question_categories(name_ar)').eq('id', subjectId).maybeSingle();
    if (!subject) return new Response(JSON.stringify({ error: 'subject_not_found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const catName = (subject as any)?.question_categories?.name_ar || '';
    const prompt = `أنت أستاذ متخصص. ولّد ${count} أسئلة اختيار من متعدد (MCQ) باللغة العربية لمادة "${subject.name_ar}" ضمن تصنيف "${catName}". مستوى الصعوبة: ${difficulty}. كل سؤال يحتاج 4 خيارات بالضبط، إجابة واحدة صحيحة، وشرح موجز.`;

    const aiResp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'أنت معلم متخصص تنتج أسئلة تعليمية احترافية. أرجع فقط استدعاء الأداة بالأسئلة.' },
          { role: 'user', content: prompt },
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'create_questions',
            description: 'إرجاع مجموعة من الأسئلة',
            parameters: {
              type: 'object',
              properties: {
                questions: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      question_text: { type: 'string' },
                      explanation: { type: 'string' },
                      choices: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            choice_text: { type: 'string' },
                            is_correct: { type: 'boolean' },
                          },
                          required: ['choice_text', 'is_correct'],
                        },
                      },
                    },
                    required: ['question_text', 'choices'],
                  },
                },
              },
              required: ['questions'],
            },
          },
        }],
        tool_choice: { type: 'function', function: { name: 'create_questions' } },
      }),
    });

    if (aiResp.status === 429) return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (aiResp.status === 402) return new Response(JSON.stringify({ error: 'payment_required' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error('AI error', aiResp.status, t);
      return new Response(JSON.stringify({ error: 'ai_error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const ai = await aiResp.json();
    const args = ai?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    let parsed: any = {};
    try { parsed = JSON.parse(args || '{}'); } catch { parsed = {}; }
    const items: any[] = parsed?.questions || [];
    if (!items.length) return new Response(JSON.stringify({ error: 'no_questions' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    let inserted = 0;
    for (const q of items) {
      if (!q?.question_text || !Array.isArray(q?.choices) || q.choices.length < 2) continue;
      if (!q.choices.some((c: any) => c?.is_correct)) continue;

      const { data: qRow, error: qErr } = await admin.from('questions').insert({
        subject_id: subjectId,
        question_text: String(q.question_text),
        explanation: q.explanation ? String(q.explanation) : null,
        question_type: 'mcq',
        difficulty,
        created_by: u.user.id,
      }).select('id').single();

      if (qErr || !qRow) { console.error('q insert', qErr); continue; }

      const choicesPayload = q.choices.slice(0, 6).map((c: any, i: number) => ({
        question_id: qRow.id,
        choice_text: String(c.choice_text || '').slice(0, 1000),
        is_correct: !!c.is_correct,
        order_index: i,
      }));
      const { error: cErr } = await admin.from('question_choices').insert(choicesPayload);
      if (cErr) { console.error('choices', cErr); continue; }
      inserted++;
    }

    return new Response(JSON.stringify({ success: true, inserted, requested: items.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('generate-questions error', e);
    return new Response(JSON.stringify({ error: 'unexpected', detail: e?.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
