// Medical Terms Dictionary — explains medical terms via Lovable AI
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `أنت قاموس طبي تعليمي للطلاب. عند إعطائك مصطلحاً طبياً (عربي أو إنجليزي):
أعد الإجابة بصيغة Markdown بالأقسام التالية وبالترتيب:

## 📘 المصطلح
- **عربي:** ...
- **إنجليزي:** ...
- **النطق:** ... (إن أمكن)

## 🧬 التعريف العلمي
شرح علمي دقيق ومختصر (2-4 أسطر).

## 🩺 السياق الطبي
أين يُستخدم؟ في أي تخصص أو حالة؟

## 🔗 مصطلحات مرتبطة
- مصطلح 1
- مصطلح 2
- مصطلح 3

## 💡 مثال سريري بسيط
مثال موجز يوضح استخدام المصطلح.

التزم بالدقة العلمية. إذا كان المصطلح غير طبي، أخبر المستخدم بلطف.`;

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

    const { term } = await req.json();
    if (!term || typeof term !== "string" || term.trim().length < 2) {
      return json({ error: "أدخل مصطلحاً صحيحاً" }, 400);
    }
    if (term.length > 200) return json({ error: "المصطلح طويل جداً" }, 400);

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
          { role: "user", content: `اشرح المصطلح الطبي التالي: ${term}` },
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
    return json({ ok: true, explanation: content });
  } catch (e) {
    console.error("medical-terms error:", e);
    return json({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
