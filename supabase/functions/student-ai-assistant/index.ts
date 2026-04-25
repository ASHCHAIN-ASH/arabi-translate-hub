// Student AI Assistant — suggests tasks based on schedule + profile
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { profile, events, tasks } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const ctx = {
      major: profile?.major ?? "غير محدد",
      level: profile?.level ?? "غير محدد",
      gpa: profile?.gpa ?? null,
      todayEvents: (events || []).map((e: any) => ({
        title: e.title, type: e.event_type,
        time: new Date(e.starts_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      })),
      openTasks: (tasks || []).filter((t: any) => !t.is_done).map((t: any) => t.title),
    };

    const systemPrompt = `أنت مساعد دراسي ذكي لطالب جامعي عربي. اقترح 3-5 مهام يومية واقعية وقصيرة (كل مهمة جملة واحدة) بناءً على تخصصه ومستواه وجدوله. استخدم اللغة العربية. لا تكرر مهام موجودة.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `سياق الطالب:\n${JSON.stringify(ctx, null, 2)}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "suggest_tasks",
            description: "إرجاع قائمة باقتراحات المهام",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "عنوان المهمة بالعربية" },
                      xp: { type: "number", description: "نقاط الخبرة 5-30" },
                    },
                    required: ["title", "xp"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["suggestions"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "suggest_tasks" } },
      }),
    });

    if (resp.status === 429) {
      return new Response(JSON.stringify({ error: "تم تجاوز حد الاستخدام، حاول لاحقًا." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (resp.status === 402) {
      return new Response(JSON.stringify({ error: "نفدت الرصيد، يرجى الإضافة من إعدادات Lovable AI." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!resp.ok) {
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall ? JSON.parse(toolCall.function.arguments) : { suggestions: [] };

    return new Response(JSON.stringify(args), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("student-ai-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
