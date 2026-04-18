// Medical Quiz Generator — generates MCQ quizzes via Lovable AI tool calling
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `أنت مولّد اختبارات طبية للطلاب. ولّد أسئلة اختيار من متعدد (MCQ) عالية الجودة بالعربية الفصحى،
علمياً دقيقة ومناسبة للمستوى الجامعي. لكل سؤال 4 خيارات وإجابة واحدة صحيحة وشرح علمي.`;

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

    const { topic, count = 5, difficulty = "medium" } = await req.json();
    if (!topic || typeof topic !== "string" || topic.trim().length < 2) {
      return json({ error: "أدخل موضوعاً للاختبار" }, 400);
    }
    const n = Math.min(Math.max(Number(count) || 5, 3), 15);
    const diff = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium";
    const diffAr = diff === "easy" ? "سهل" : diff === "hard" ? "صعب" : "متوسط";

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
          {
            role: "user",
            content: `ولّد ${n} سؤالاً MCQ عن: "${topic}" بمستوى ${diffAr}.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_quiz",
              description: "Create a structured medical MCQ quiz",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string", description: "نص السؤال بالعربية" },
                        options: {
                          type: "array",
                          items: { type: "string" },
                          minItems: 4,
                          maxItems: 4,
                          description: "4 خيارات بالعربية",
                        },
                        correct_index: {
                          type: "integer",
                          minimum: 0,
                          maximum: 3,
                          description: "فهرس الإجابة الصحيحة (0-3)",
                        },
                        explanation: { type: "string", description: "شرح علمي للإجابة" },
                      },
                      required: ["question", "options", "correct_index", "explanation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["questions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "create_quiz" } },
      }),
    });

    if (r.status === 429) return json({ error: "تم تجاوز الحد، حاول لاحقاً" }, 429);
    if (r.status === 402) return json({ error: "نفدت الأرصدة" }, 402);
    if (!r.ok) {
      console.error("AI error", r.status, await r.text());
      return json({ error: "فشل الاتصال بالذكاء الاصطناعي" }, 500);
    }

    const data = await r.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) return json({ error: "تعذّر توليد الأسئلة" }, 500);

    let parsed: any;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      return json({ error: "صيغة الأسئلة غير صالحة" }, 500);
    }

    return json({ ok: true, quiz: parsed.questions || [] });
  } catch (e) {
    console.error("medical-quiz-generator error:", e);
    return json({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
