// Medical Research Summarizer — uses Lovable AI Gateway
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `أنت مساعد طبي خبير في تلخيص الأبحاث والمقالات الطبية للطلاب.
- لخّص النص الطبي بأسلوب واضح ومنظم بالعربية الفصحى
- استخدم تنسيق Markdown
- قسّم الملخّص إلى الأقسام التالية بالترتيب:
  ## 🎯 الفكرة الرئيسية
  ## 🔑 النقاط الجوهرية (نقاط مرقّمة)
  ## 🧪 المنهجية المستخدمة
  ## 📊 النتائج الأهم
  ## 💡 الخلاصة والتطبيق السريري
- التزم بدقة المعلومات الطبية، ولا تضف ما ليس في النص
- إذا لم يكن النص طبياً، أخبر المستخدم بلطف`;

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

    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return json({ error: "النص قصير جداً (50 حرفاً على الأقل)" }, 400);
    }
    if (text.length > 15000) {
      return json({ error: "النص طويل جداً (الحد 15000 حرف)" }, 400);
    }

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
          { role: "user", content: `لخّص النص الطبي التالي:\n\n${text}` },
        ],
      }),
    });

    if (r.status === 429) return json({ error: "تم تجاوز الحد المسموح، حاول بعد قليل" }, 429);
    if (r.status === 402) return json({ error: "نفدت أرصدة الذكاء الاصطناعي، تواصل مع الدعم" }, 402);
    if (!r.ok) {
      const t = await r.text();
      console.error("AI error:", r.status, t);
      return json({ error: "فشل الاتصال بالذكاء الاصطناعي" }, 500);
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content || "";
    return json({ ok: true, summary: content });
  } catch (e) {
    console.error("medical-summarizer error:", e);
    return json({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
