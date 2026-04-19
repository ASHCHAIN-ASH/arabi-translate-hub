// AI assistant for Academic CV sections
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Section =
  | 'summary'
  | 'experience_desc'
  | 'project_desc'
  | 'education_desc'
  | 'activity_desc'
  | 'skills_tech'
  | 'skills_soft'
  | 'skills_langs'
  | 'course_suggest';

interface Body {
  section: Section;
  lang: 'ar' | 'en';
  context?: Record<string, any>;
  current?: string;
  mode?: 'generate' | 'improve';
}

const PROMPTS: Record<Section, (lang: 'ar' | 'en') => string> = {
  summary: (l) => l === 'ar'
    ? 'أنت كاتب سير ذاتية أكاديمية محترف. اكتب نبذة شخصية احترافية (3-5 أسطر) باللغة العربية الفصحى، تبرز الخبرات والأهداف الأكاديمية والمهنية. تجنب المبالغة والكليشيهات.'
    : 'You are a professional academic CV writer. Write a concise professional summary (3-5 lines) in clear English, highlighting academic and career strengths. Avoid clichés and exaggeration.',
  experience_desc: (l) => l === 'ar'
    ? 'اكتب وصفاً وظيفياً احترافياً (3-5 نقاط مختصرة) باستخدام أفعال إنجاز، ركّز على النتائج القابلة للقياس. أرجع النص فقط بدون عناوين.'
    : 'Write a professional job description (3-5 short bullet points) using strong action verbs and measurable outcomes. Return plain text only.',
  project_desc: (l) => l === 'ar'
    ? 'صف المشروع/البحث بأسلوب أكاديمي مختصر (3-4 أسطر): الهدف، المنهجية، النتيجة. أرجع النص فقط.'
    : 'Describe the project/research academically in 3-4 lines: goal, method, outcome. Return plain text only.',
  education_desc: (l) => l === 'ar'
    ? 'اكتب وصفاً مختصراً للمؤهل الدراسي (1-2 سطر): التخصص الفرعي، المشاريع البارزة، الجوائز إن وُجدت.'
    : 'Write a brief education description (1-2 lines): specialization, notable projects/awards.',
  activity_desc: (l) => l === 'ar'
    ? 'صف النشاط/التطوع بأسلوب احترافي مختصر (1-2 سطر) يبرز الأثر والمهارات المكتسبة.'
    : 'Describe the activity/volunteering professionally in 1-2 lines, highlighting impact and skills.',
  skills_tech: (l) => l === 'ar'
    ? 'اقترح 8-12 مهارة تقنية ذات صلة بالملف، مفصولة بفواصل. أرجع قائمة فقط.'
    : 'Suggest 8-12 relevant technical skills, comma-separated. Return list only.',
  skills_soft: (l) => l === 'ar'
    ? 'اقترح 6-8 مهارات شخصية احترافية مفصولة بفواصل. أرجع قائمة فقط.'
    : 'Suggest 6-8 professional soft skills, comma-separated. Return list only.',
  skills_langs: (l) => l === 'ar'
    ? 'اقترح اللغات بصيغة "اللغة (المستوى)" مفصولة بفواصل، مثل: العربية (لغة أم)، الإنجليزية (متقدم).'
    : 'Suggest languages as "Language (Level)" comma-separated, e.g. Arabic (Native), English (Advanced).',
  course_suggest: (l) => l === 'ar'
    ? 'اقترح 4-6 دورات/شهادات ذات صلة بصيغة "اسم الدورة - الجهة المانحة"، سطر لكل واحدة.'
    : 'Suggest 4-6 relevant courses/certifications as "Course Name - Issuer", one per line.',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body: Body = await req.json();
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) throw new Error('LOVABLE_API_KEY missing');

    const sysPrompt = PROMPTS[body.section]?.(body.lang) ?? PROMPTS.summary(body.lang);
    const ctx = body.context ? `\n\nالسياق:\n${JSON.stringify(body.context, null, 2)}` : '';
    const cur = body.current ? `\n\nالنص الحالي (حسّنه إن لزم):\n${body.current}` : '';
    const userMsg = `${ctx}${cur}\n\nأرجع النص النهائي فقط بدون شرح إضافي.`;

    const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: sysPrompt },
          { role: 'user', content: userMsg },
        ],
      }),
    });

    if (r.status === 429) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (r.status === 402) {
      return new Response(JSON.stringify({ error: 'payment_required' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (!r.ok) {
      const t = await r.text();
      console.error('AI error', r.status, t);
      return new Response(JSON.stringify({ error: 'ai_error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const json = await r.json();
    const text = json?.choices?.[0]?.message?.content?.trim() ?? '';
    return new Response(JSON.stringify({ text }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'unknown' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
