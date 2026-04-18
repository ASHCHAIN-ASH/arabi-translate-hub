// Clinical Case Analyzer — structured analysis of clinical cases via Lovable AI
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `أنت طبيب استشاري ومحاضر سريري. حلّل الحالة السريرية المعطاة بأسلوب أكاديمي واضح بالعربية،
بصيغة Markdown وبالأقسام التالية بالترتيب:

## 🧾 ملخص الحالة
3-5 أسطر تلخّص العمر والجنس والشكوى الأساسية والمعطيات.

## 🔍 الأعراض والعلامات السريرية
نقاط واضحة.

## 🤔 التشخيصات التفريقية المحتملة
1. التشخيص (مع سبب الترجيح/الاستبعاد)
2. ...
3. ...

## 🎯 التشخيص الأرجح
مع تبرير علمي مختصر.

## 🧪 الفحوصات المقترحة
- فحوصات مخبرية
- فحوصات تصويرية
- فحوصات أخرى

## 💊 الخطة العلاجية المقترحة
خطوات منظمة (مع التنويه أنها لأغراض تعليمية فقط).

## ⚠️ تنبيه
"هذا التحليل لأغراض تعليمية فقط ولا يُعدّ بديلاً عن الاستشارة الطبية الفعلية."

التزم بالأخلاقيات والدقة العلمية. إذا لم يكن المُدخل حالة سريرية، أخبر المستخدم بلطف.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "غير مصرح" }, 401);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI key missing" }, 500);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } }
    );
    const { data: u } = await supabase.auth.getUser();
    if (!u?.user) return json({ error: "غير مصرح" }, 401);

    const { caseText } = await req.json();
    if (!caseText || typeof caseText !== "string" || caseText.trim().length < 50) {
      return json({ error: "وصف الحالة قصير جداً (50 حرفاً على الأقل)" }, 400);
    }
    if (caseText.length > 15000) {
      return json({ error: "النص طويل جداً (الحد 15000 حرف)" }, 400);
    }

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `حلّل الحالة السريرية التالية:\n\n${caseText}` },
        ],
      }),
    });

    if (r.status === 429) return json({ error: "تم تجاوز الحد، حاول لاحقاً" }, 429);
    if (r.status === 402) return json({ error: "نفدت الأرصدة" }, 402);
    if (!r.ok) {
      console.error("AI error", r.status, await r.text());
      return json({ error: "فشل الاتصال بالذكاء الاصطناعي" }, 500);
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return json({ ok: true, analysis: content });
  } catch (e) {
    console.error("clinical-case-analyzer error:", e);
    return json({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
