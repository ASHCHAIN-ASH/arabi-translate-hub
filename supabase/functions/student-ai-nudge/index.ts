// Student AI Nudge — short contextual guidance for the student
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { profile, events, tasks, dayState, streak } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const now = new Date();
    const hour = now.getHours();
    const openTasks = (tasks || []).filter((t: any) => !t.is_done);
    const doneTasks = (tasks || []).filter((t: any) => t.is_done);
    const upcoming = (events || [])
      .map((e: any) => ({ ...e, _t: new Date(e.starts_at).getTime() }))
      .filter((e: any) => e._t >= now.getTime())
      .sort((a: any, b: any) => a._t - b._t)
      .slice(0, 3);
    const past = (events || [])
      .map((e: any) => ({ ...e, _t: new Date(e.starts_at).getTime() }))
      .filter((e: any) => e._t < now.getTime())
      .sort((a: any, b: any) => b._t - a._t)
      .slice(0, 3);

    const ctx = {
      currentHour: hour,
      streakDays: streak ?? 0,
      dayStarted: !!dayState?.started_at,
      openTasksCount: openTasks.length,
      doneTasksCount: doneTasks.length,
      sampleOpenTasks: openTasks.slice(0, 5).map((t: any) => t.title),
      upcomingEvents: upcoming.map((e: any) => ({
        title: e.title, type: e.event_type,
        time: new Date(e.starts_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      })),
      missedEvents: past.map((e: any) => ({
        title: e.title, type: e.event_type,
        time: new Date(e.starts_at).toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" }),
      })),
      major: profile?.major ?? null,
      level: profile?.level ?? null,
    };

    const systemPrompt = `أنت مدرب دراسي ذكي. أعطِ توجيهًا واحدًا قصيرًا جدًا للطالب الآن (10 كلمات كحد أقصى) باللغة العربية، يحفّزه أو ينبّهه بناءً على سياقه الحالي.
- اختر "tone" مناسبًا:
  • "start" إذا لم يبدأ يومه أو لا يوجد تقدم
  • "behind" إذا فاتته مهام/أحداث أو متراكم عليه عمل
  • "focus" إذا لديه حدث قادم قريبًا
  • "almost" إذا أنجز معظم مهامه
  • "celebrate" إذا أكمل كل شيء أو سلسلته طويلة
- اختر إيموجي واحد مناسب.
- اقترح "actionLabel" قصير (كلمتين) لزر اتخاذ إجراء، مثل: "ابدأ الآن"، "افتح الجدول"، "أنهِ المهمة".`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `سياق الطالب الآن:\n${JSON.stringify(ctx, null, 2)}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "emit_nudge",
            description: "إرجاع توجيه قصير للطالب",
            parameters: {
              type: "object",
              properties: {
                message: { type: "string", description: "الرسالة القصيرة جدًا" },
                tone: { type: "string", enum: ["start", "behind", "focus", "almost", "celebrate"] },
                emoji: { type: "string" },
                actionLabel: { type: "string" },
                actionTarget: { type: "string", enum: ["tasks", "schedule", "focus", "challenge", "none"] },
              },
              required: ["message", "tone", "emoji", "actionLabel", "actionTarget"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "emit_nudge" } },
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
    const args = toolCall ? JSON.parse(toolCall.function.arguments) : null;

    return new Response(JSON.stringify(args ?? { error: "no_nudge" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("student-ai-nudge error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
