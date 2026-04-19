import { corsHeaders } from '@supabase/supabase-js/cors';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.95.0';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const auth = req.headers.get('Authorization');
    if (!auth) return json({ error: 'unauthorized' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: 'unauthorized' }, 401);

    const { text, mode = 'flashcards', count = 8 } = await req.json();
    if (!text || typeof text !== 'string' || text.trim().length < 80) {
      return json({ error: 'النص قصير جداً (80 حرف على الأقل)' }, 400);
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) return json({ error: 'AI not configured' }, 500);

    const systemPrompt = mode === 'mcq'
      ? `أنت مساعد تعليمي. ولّد ${count} أسئلة اختيار من متعدد (MCQ) من النص بصيغة JSON فقط:
{"items":[{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]}
الإجابة الصحيحة index من 0-3. اللغة بنفس لغة النص.`
      : `أنت مساعد تعليمي. ولّد ${count} بطاقات تعليمية (flashcards) من النص بصيغة JSON فقط:
{"items":[{"q":"السؤال","a":"الإجابة المركزة"}]}
اجعل الأسئلة دقيقة والإجابات قصيرة ومفيدة. اللغة بنفس لغة النص.`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text.slice(0, 8000) },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (aiRes.status === 429) return json({ error: 'تم تجاوز الحد، حاول لاحقاً' }, 429);
    if (aiRes.status === 402) return json({ error: 'الرصيد منتهٍ' }, 402);
    if (!aiRes.ok) {
      const t = await aiRes.text();
      return json({ error: 'AI failed', detail: t.slice(0, 200) }, 500);
    }

    const data = await aiRes.json();
    const content = data?.choices?.[0]?.message?.content || '{}';
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch { parsed = { items: [] }; }

    return json({ ok: true, mode, items: parsed.items || [] });
  } catch (e) {
    return json({ error: String(e?.message || e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
