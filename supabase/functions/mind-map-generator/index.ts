// Mind Map Generator — turns text into structured mind map JSON via Lovable AI
// Enforces daily quotas (free: 3, premium: 50). Logs every usage.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FREE_DAILY = 3;
const PREMIUM_DAILY = 50;

const SYS_AR = `أنت خبير في تحويل النصوص إلى خرائط ذهنية منظمة.
حلّل النص وأخرج خريطة ذهنية بالعربية الفصحى. اجعل العناوين قصيرة (3-7 كلمات).
- central_topic: الفكرة الرئيسية في 2-5 كلمات
- branches: 4-7 فروع رئيسية
- كل فرع: 2-5 children
- يمكن إضافة مستوى ثالث (children داخل children) عند الحاجة
لا تكرر المعلومات. لا تضف معلومات خارجية.`;

const SYS_EN = `You are an expert at transforming text into structured mind maps.
Analyze the text and output a clean mind map in English. Keep titles short (3-7 words).
- central_topic: 2-5 words
- branches: 4-7 main branches
- Each branch: 2-5 children
- Optional third level (children within children)
Do not repeat. Do not add outside info.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "غير مصرح" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI key missing" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "غير مصرح" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const text = String(body?.text || "").trim();
    const language = (body?.language === "en" ? "en" : "ar") as "ar" | "en";

    if (!text || text.length < 30) {
      return new Response(JSON.stringify({
        error: language === "ar"
          ? "الرجاء إدخال نص لا يقل عن 30 حرفاً"
          : "Please enter at least 30 characters",
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (text.length > 8000) {
      return new Response(JSON.stringify({
        error: language === "ar" ? "النص طويل جداً (8000 حرف كحد أقصى)" : "Text too long (max 8000 chars)",
      }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Premium check
    const { data: membership } = await supabase
      .from("user_memberships")
      .select("id, status, expires_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const isPremium = !!membership && (!membership.expires_at || new Date(membership.expires_at) > new Date());
    const limit = isPremium ? PREMIUM_DAILY : FREE_DAILY;

    // Quota
    const today = new Date().toISOString().slice(0, 10);
    const { count } = await supabase
      .from("mind_map_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("usage_date", today);

    if ((count ?? 0) >= limit) {
      return new Response(JSON.stringify({
        error: isPremium
          ? `تجاوزت الحد اليومي (${limit})`
          : `تجاوزت الحد المجاني اليومي (${limit}). فعّل العضوية للحصول على ${PREMIUM_DAILY} خريطة يومياً`,
        code: "quota_exceeded",
      }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Tool-call schema for clean structured output
    const tool = {
      type: "function",
      function: {
        name: "build_mind_map",
        description: "Output a structured mind map",
        parameters: {
          type: "object",
          properties: {
            title: { type: "string" },
            central_topic: { type: "string" },
            language: { type: "string", enum: ["ar", "en"] },
            branches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  children: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        children: {
                          type: "array",
                          items: { type: "object", properties: { title: { type: "string" } }, required: ["title"] },
                        },
                      },
                      required: ["title"],
                    },
                  },
                },
                required: ["title"],
              },
            },
          },
          required: ["title", "central_topic", "language", "branches"],
          additionalProperties: false,
        },
      },
    };

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: language === "ar" ? SYS_AR : SYS_EN },
          { role: "user", content: text },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: "build_mind_map" } },
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "الخدمة مزدحمة، حاول بعد قليل" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "نفدت رصيد الذكاء الاصطناعي، تواصل مع الإدارة" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiRes.text();
      console.error("AI error", aiRes.status, t);
      return new Response(JSON.stringify({ error: "تعذر توليد الخريطة" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "استجابة AI غير صالحة" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let mapData: any;
    try {
      mapData = JSON.parse(toolCall.function.arguments);
    } catch {
      return new Response(JSON.stringify({ error: "فشل تحليل بيانات الخريطة" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log usage
    await supabase.from("mind_map_usage").insert({
      user_id: user.id,
      language,
      input_length: text.length,
      is_premium_user: isPremium,
    });

    // Trigger daily task (best-effort)
    await supabase.rpc("complete_daily_task", { _task_code: "create_mind_map", _metadata: { language } });

    return new Response(JSON.stringify({
      map: mapData,
      remaining: Math.max(0, limit - ((count ?? 0) + 1)),
      limit,
      is_premium: isPremium,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("mind-map-generator error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
