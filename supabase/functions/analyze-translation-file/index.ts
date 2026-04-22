// Edge Function: analyze-translation-file
// Server-side fallback for translation file analysis. Accepts a raw text sample
// (already extracted browser-side) and uses Lovable AI to suggest a domain
// classification. Returns suggested domain + confidence.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ReqBody {
  textSample?: string;
  fileName?: string;
  fileType?: string;
}

const SYSTEM_PROMPT = `أنت مصنف وثائق ترجمة محترف. صنّف نص المستند المُعطى ضمن واحدة من الفئات التالية فقط:
- general (عام)
- academic (أكاديمي / بحوث / أطروحات)
- legal (قانوني / عقود)
- medical (طبي / سريري)
- technical (تقني / برمجة / هندسة)

أرجع تصنيفك عبر استدعاء الدالة classify_document فقط.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { textSample = "", fileName = "", fileType = "" } = (await req.json()) as ReqBody;

    if (!textSample || textSample.trim().length < 30) {
      return new Response(
        JSON.stringify({
          domain: "general",
          confidence: 30,
          source: "ai",
          reason: "نص قصير جداً للتصنيف الذكي",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const sample = textSample.slice(0, 4000);

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `اسم الملف: ${fileName}\nالنوع: ${fileType}\n\nعينة من النص:\n"""${sample}"""`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_document",
              description: "Return the document domain classification.",
              parameters: {
                type: "object",
                properties: {
                  domain: {
                    type: "string",
                    enum: ["general", "academic", "legal", "medical", "technical"],
                  },
                  confidence: { type: "number", description: "0-100" },
                  reason: { type: "string" },
                },
                required: ["domain", "confidence"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_document" } },
      }),
    });

    if (aiResp.status === 429) {
      return new Response(
        JSON.stringify({ error: "rate_limited", message: "تم تجاوز الحد المسموح، حاول لاحقاً." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (aiResp.status === 402) {
      return new Response(
        JSON.stringify({ error: "payment_required", message: "رصيد Lovable AI نفد." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(
        JSON.stringify({ domain: "general", confidence: 30, source: "ai", error: "ai_failed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await aiResp.json();
    const tc = data?.choices?.[0]?.message?.tool_calls?.[0];
    let parsed: any = { domain: "general", confidence: 40 };
    try {
      if (tc?.function?.arguments) parsed = JSON.parse(tc.function.arguments);
    } catch (_) {
      /* ignore */
    }

    return new Response(
      JSON.stringify({
        domain: parsed.domain ?? "general",
        confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 50)),
        reason: parsed.reason ?? "",
        source: "ai",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("analyze-translation-file error:", e);
    return new Response(
      JSON.stringify({ domain: "general", confidence: 30, source: "ai", error: "exception" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
