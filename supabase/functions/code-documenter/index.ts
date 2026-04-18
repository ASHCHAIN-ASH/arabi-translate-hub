// Code Documenter — توليد توثيق احترافي للكود
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `أنت Technical Writer خبير. ولّد توثيقاً احترافياً للكود المُعطى بصيغة Markdown باللغة العربية مع الحفاظ على الكود والمُعرّفات بالإنجليزية. اتّبع الهيكل التالي:

## 📦 نظرة عامة
ملخص واضح لما تفعله هذه الوحدة/الدالة/الكلاس (3-5 أسطر).

## 🔧 الواجهة (API Reference)
لكل دالة/method/class:
### \`functionName(params)\`
- **الوصف**: ماذا تفعل.
- **المعاملات (Parameters)**:
  | الاسم | النوع | الوصف | افتراضي |
  |------|-------|-------|---------|
  | param1 | string | شرح | - |
- **القيمة المُرجعة (Returns)**: النوع + الوصف.
- **يُلقي (Throws)**: الاستثناءات الممكنة.

## 💻 أمثلة استخدام (Examples)
\`\`\`code
// مثال عملي قابل للنسخ والتشغيل
\`\`\`

## 📝 ملاحظات
- نقاط مهمة (thread-safety، side effects، performance، إلخ).

## 🏷️ JSDoc / Docstrings
أعد كتابة الكود نفسه مع تعليقات JSDoc / Docstrings مدمجة (بالإنجليزية) داخل \`\`\`code block\`\`\` كاملة وجاهزة للنسخ مباشرة.

## 🔗 التبعيات (Dependencies)
- اذكر أي مكتبات أو وحدات مستوردة.

التزم بالوضوح والاحترافية. لو المُدخل ليس كوداً، أخبر المستخدم بلطف.`;

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

    const { code, language } = await req.json();
    if (!code || typeof code !== "string" || code.trim().length < 10) {
      return json({ error: "الكود قصير جداً (10 أحرف على الأقل)" }, 400);
    }
    if (code.length > 20000) {
      return json({ error: "الكود طويل جداً (الحد 20000 حرف)" }, 400);
    }

    const lang = (language && typeof language === "string") ? language : "auto-detect";

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
          { role: "user", content: `ولّد توثيقاً احترافياً كاملاً للكود التالي (اللغة: ${lang}):\n\n\`\`\`${lang}\n${code}\n\`\`\`` },
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
    return json({ ok: true, documentation: content });
  } catch (e) {
    console.error("code-documenter error:", e);
    return json({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
