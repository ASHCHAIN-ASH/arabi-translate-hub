// Code Reviewer — تحليل ومراجعة الكود البرمجي
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `أنت مهندس برمجيات خبير ومراجع كود (Senior Code Reviewer). راجع الكود المُعطى وقدّم مراجعة احترافية بالعربية بصيغة Markdown وبالأقسام التالية:

## 🧾 ملخص الكود
وصف موجز لما يفعله الكود (3-5 أسطر).

## ✅ نقاط القوة
- نقاط واضحة لما هو جيد في الكود.

## ⚠️ المشاكل والأخطاء
- 🔴 **حرجة**: أخطاء منطقية، ثغرات أمنية، تسريب موارد.
- 🟡 **متوسطة**: أداء، قابلية صيانة، best practices.
- 🟢 **بسيطة**: تنسيق، تسميات، تعليقات.

## 🛠️ التحسينات المقترحة
لكل مشكلة، اذكر الحل مع مقطع كود محسّن داخل \`\`\`code blocks\`\`\` (الكود يبقى بالإنجليزية).

## 🔒 الأمان
أي اعتبارات أمنية (SQL injection، XSS، secrets، إلخ).

## ⚡ الأداء
ملاحظات حول التعقيد الزمني/المكاني.

## 📐 التقييم النهائي
درجة من 10 + خلاصة من سطرين.

التزم بالدقة التقنية. لو المُدخل ليس كوداً، أخبر المستخدم بلطف.`;

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

    const { code, language, mode } = await req.json();
    if (!code || typeof code !== "string" || code.trim().length < 10) {
      return json({ error: "الكود قصير جداً (10 أحرف على الأقل)" }, 400);
    }
    if (code.length > 20000) {
      return json({ error: "الكود طويل جداً (الحد 20000 حرف)" }, 400);
    }

    const isPro = mode === "pro";
    const model = isPro ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";
    const lang = (language && typeof language === "string") ? language : "auto-detect";

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `راجع الكود التالي (اللغة: ${lang}):\n\n\`\`\`${lang}\n${code}\n\`\`\`` },
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
    return json({ ok: true, review: content, mode: isPro ? "pro" : "standard" });
  } catch (e) {
    console.error("code-reviewer error:", e);
    return json({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
