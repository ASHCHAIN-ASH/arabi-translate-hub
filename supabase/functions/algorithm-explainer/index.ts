// Algorithm Explainer — شرح الخوارزميات والكود خطوة بخطوة
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `أنت أستاذ علوم حاسب جامعي. اشرح الخوارزمية أو الكود بأسلوب أكاديمي واضح بالعربية بصيغة Markdown وبالأقسام التالية:

## 🧾 الفكرة العامة
شرح موجز (3-5 أسطر) لما تفعله الخوارزمية.

## 🎯 المُدخلات والمُخرجات
- **المُدخلات**: ...
- **المُخرجات**: ...

## 🔁 الشرح خطوة بخطوة
1. الخطوة الأولى — ماذا يحدث ولماذا.
2. الخطوة الثانية — ...
3. ...

## 🧠 منطق العمل (Walkthrough)
مثال عملي بقيم محددة، يوضح كيف تتغير المتغيرات سطراً بسطر.

## ⏱️ التعقيد
- **Time Complexity**: O(?) مع الشرح.
- **Space Complexity**: O(?) مع الشرح.

## 💡 الحالات الحدية (Edge Cases)
- نقاط واجب الانتباه لها.

## 🔄 بدائل أو تحسينات
خوارزميات بديلة أفضل/أبسط إن وُجدت (الكود في الأمثلة يبقى بالإنجليزية داخل \`\`\`code blocks\`\`\`).

التزم بالدقة الأكاديمية. لو المُدخل غير مفهوم أو ليس خوارزمية/كود، أخبر المستخدم بلطف.`;

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
    if (!code || typeof code !== "string" || code.trim().length < 5) {
      return json({ error: "أدخل خوارزمية أو كود (5 أحرف على الأقل)" }, 400);
    }
    if (code.length > 15000) {
      return json({ error: "النص طويل جداً (الحد 15000 حرف)" }, 400);
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
          { role: "user", content: `اشرح الكود/الخوارزمية التالية (اللغة: ${lang}):\n\n\`\`\`${lang}\n${code}\n\`\`\`` },
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
    console.error("algorithm-explainer error:", e);
    return json({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
