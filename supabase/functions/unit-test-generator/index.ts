// Unit Test Generator — توليد اختبارات وحدة للكود
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `أنت مهندس QA و Test Automation خبير. ولّد اختبارات وحدة (Unit Tests) عالية الجودة للكود المُعطى. الإطار المفضل حسب اللغة:
- JavaScript/TypeScript → Jest أو Vitest
- Python → pytest
- Java → JUnit 5
- C# → xUnit
- Go → testing standard
- Rust → cargo test

أرجع النتيجة بصيغة Markdown بالعربية وبالأقسام التالية:

## 🧾 ملخص الدالة/الكلاس
شرح موجز لما يتم اختباره.

## 🎯 الحالات المُغطّاة
- ✅ Happy paths
- ⚠️ Edge cases
- 🔴 Error/exception cases
- 🔁 Boundary values

## 🧪 الاختبارات
مقطع كود واحد كامل قابل للتشغيل داخل \`\`\`code block\`\`\` بالإطار المناسب، مع تعليقات إنجليزية للوضوح. الاختبارات يجب أن تكون:
- مستقلة (independent)
- قابلة للتكرار (deterministic)
- واضحة الأسماء (descriptive names)
- تستخدم mocking عند الحاجة

## 📊 تقدير التغطية
نسبة تقديرية لما يُغطى من فروع الكود (مثلاً ~85%) مع ذكر ما لا يُغطّى.

## 💡 ملاحظات للتحسين
أي اقتراحات لجعل الكود نفسه أكثر قابلية للاختبار.

التزم بالاحترافية. الكود في المخرجات يبقى بالإنجليزية. لو المُدخل ليس كوداً قابلاً للاختبار، أخبر المستخدم بلطف.`;

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

    const { code, language, framework } = await req.json();
    if (!code || typeof code !== "string" || code.trim().length < 10) {
      return json({ error: "الكود قصير جداً (10 أحرف على الأقل)" }, 400);
    }
    if (code.length > 15000) {
      return json({ error: "الكود طويل جداً (الحد 15000 حرف)" }, 400);
    }

    const lang = (language && typeof language === "string") ? language : "auto-detect";
    const fw = (framework && typeof framework === "string") ? framework : "auto";

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `ولّد اختبارات وحدة شاملة للكود التالي (اللغة: ${lang}، الإطار المفضل: ${fw}):\n\n\`\`\`${lang}\n${code}\n\`\`\`` },
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
    return json({ ok: true, tests: content });
  } catch (e) {
    console.error("unit-test-generator error:", e);
    return json({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
