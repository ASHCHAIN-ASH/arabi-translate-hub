import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Body {
  service_type?: string;
  platform?: string;
  ref_link?: string;
  tone?: string;
  language?: string;
  variants?: number;
}

const PLATFORM_GUIDE: Record<string, string> = {
  instagram:
    "إنستغرام: 3-5 أسطر قصيرة، إيموجي معبّر في كل سطر، CTA واضح، 5-8 هاشتاقات في النهاية.",
  story:
    "ستوري إنستغرام: سطر أو سطرين فقط، كلمات قوية ومباشرة، إيموجي واحد بارز، CTA قصير جداً، بدون هاشتاقات.",
  twitter:
    "تويتر/X: أقل من 240 حرفاً، جملة افتتاحية صادمة، CTA مع الرابط، 2-3 هاشتاقات فقط.",
  brochure:
    "بروشور: نص أطول وفقرات منظمة، عناوين فرعية، تعداد بالنقاط للمميزات، CTA في النهاية، بدون هاشتاقات.",
  whatsapp:
    "واتساب: نص ودّي ومباشر، إيموجي خفيف، CTA يحتوي الرابط، بدون هاشتاقات.",
};

function buildSystemPrompt() {
  return `أنت كاتب محتوى تسويقي عربي محترف لمنصة خدمات أكاديمية وترجمة.
- اكتب باللهجة العربية الفصحى السلسة (يمكن إضافة لمسة خليجية خفيفة).
- عبارات قصيرة، إيقاع سريع، يبدأ بخطّاف (Hook) قوي.
- استخدم إيموجي بشكل احترافي وليس مبالغاً فيه.
- اجعل CTA واضح ومحفز (مثل: "اطلب الآن"، "اكتشف الخدمة").
- ضع رابط الإحالة بشكل بارز بجانب CTA.
- لا تخترع أسعاراً أو مدداً غير مذكورة.
- لا تستخدم رموز Markdown مثل ** أو # داخل النص النهائي.`;
}

function buildUserPrompt(b: Body) {
  const guide = PLATFORM_GUIDE[b.platform || "instagram"] || PLATFORM_GUIDE.instagram;
  const tone = b.tone || "حماسي ومحفّز";
  const variants = Math.min(Math.max(b.variants || 1, 1), 3);
  return `اكتب ${variants} نص تسويقي للخدمة التالية:

- الخدمة: ${b.service_type || "خدمة عامة"}
- المنصة: ${b.platform || "instagram"}
- النبرة: ${tone}
- رابط الإحالة (يجب وضعه حرفياً في النص بجانب CTA): ${b.ref_link || ""}

دليل المنصة: ${guide}

أعد ${variants > 1 ? "النصوص مفصولة بسطر يحتوي على ---" : "النص"} مباشرة بدون مقدمات أو شرح.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY غير مهيأ" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Body;

    if (!body.service_type || !body.platform) {
      return new Response(
        JSON.stringify({ error: "service_type و platform مطلوبان" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(body) },
        ],
      }),
    });

    if (resp.status === 429) {
      return new Response(
        JSON.stringify({ error: "تم تجاوز حد الطلبات، حاول لاحقاً." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (resp.status === 402) {
      return new Response(
        JSON.stringify({ error: "نفد الرصيد، يرجى تعبئة محفظة AI." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      return new Response(JSON.stringify({ error: "فشل الاتصال بـ AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const text: string = data.choices?.[0]?.message?.content?.trim() || "";

    const variants = text
      .split(/^\s*-{3,}\s*$/m)
      .map((s) => s.trim())
      .filter(Boolean);

    return new Response(
      JSON.stringify({ text, variants: variants.length > 1 ? variants : [text] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-marketing-copy error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "خطأ غير معروف" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
