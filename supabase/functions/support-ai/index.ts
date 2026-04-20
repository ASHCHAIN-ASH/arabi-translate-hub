// Support AI: classify category/priority + suggest reply + summarize ticket
// Uses Lovable AI Gateway (no API key required)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const AI_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const MODEL = 'google/gemini-2.5-flash';

interface Body {
  action: 'classify' | 'suggest_reply' | 'summarize' | 'rewrite';
  subject?: string;
  description?: string;
  context?: string;
  messages?: { sender_type: string; content: string }[];
  draft?: string;
  tone?: 'professional' | 'friendly' | 'apologetic';
}

async function callAI(systemPrompt: string, userPrompt: string, jsonMode = false) {
  const body: any = {
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  };
  if (jsonMode) body.response_format = { type: 'json_object' };

  const r = await fetch(AI_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (r.status === 429) throw new Error('rate_limit');
  if (r.status === 402) throw new Error('credits_exhausted');
  if (!r.ok) throw new Error(`ai_error_${r.status}`);
  const data = await r.json();
  return data.choices?.[0]?.message?.content ?? '';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body: Body = await req.json();
    let result: any = {};

    if (body.action === 'classify') {
      const text = `العنوان: ${body.subject || ''}\nالوصف: ${body.description || ''}`;
      const out = await callAI(
        'أنت مصنّف تذاكر دعم فني عربية. أعد JSON فقط بالشكل: {"category":"general|technical|billing|complaint|suggestion","priority":"low|medium|high|critical","tags":["..."],"reasoning":"سبب موجز"}',
        text,
        true
      );
      try { result = JSON.parse(out); } catch { result = { category: 'general', priority: 'medium', tags: [] }; }
    }

    else if (body.action === 'suggest_reply') {
      const convo = (body.messages || []).map(m => `[${m.sender_type === 'admin' ? 'الدعم' : 'العميل'}]: ${m.content}`).join('\n');
      const sys = `أنت مساعد لموظف دعم فني عربي محترف. اقترح 3 ردود مختلفة (قصير، متوسط، تفصيلي) باللغة العربية الفصحى المهنية. أعد JSON فقط: {"replies":[{"label":"...","content":"..."}, ...]}`;
      const usr = `سياق التذكرة:\n${body.context || ''}\n\nالمحادثة:\n${convo}`;
      const out = await callAI(sys, usr, true);
      try { result = JSON.parse(out); } catch { result = { replies: [] }; }
    }

    else if (body.action === 'summarize') {
      const convo = (body.messages || []).map(m => `[${m.sender_type === 'admin' ? 'الدعم' : 'العميل'}]: ${m.content}`).join('\n');
      const out = await callAI(
        'لخّص التذكرة في فقرة قصيرة (أقل من 80 كلمة) بالعربية، مع تحديد المشكلة الرئيسية والإجراء المطلوب.',
        `${body.context || ''}\n\nالمحادثة:\n${convo}`
      );
      result = { summary: out };
    }

    else if (body.action === 'rewrite') {
      const tone = body.tone || 'professional';
      const toneAr = tone === 'friendly' ? 'ودّي' : tone === 'apologetic' ? 'اعتذاري' : 'احترافي رسمي';
      const out = await callAI(
        `أعد صياغة الرد التالي بأسلوب ${toneAr} بالعربية الفصحى، مع الحفاظ على المعنى. أعد النص فقط بدون شرح.`,
        body.draft || ''
      );
      result = { content: out };
    }

    else {
      return new Response(JSON.stringify({ error: 'unknown_action' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    const msg = e.message || 'error';
    const status = msg === 'rate_limit' ? 429 : msg === 'credits_exhausted' ? 402 : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
