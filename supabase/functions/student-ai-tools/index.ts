// Student AI Tools — summarize, rephrase, analyze
// Validates auth, enforces daily quotas (free vs premium), logs usage.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FREE_DAILY = 3;
const PREMIUM_DAILY = 50;

const PROMPTS: Record<string, string> = {
  summarize:
    "أنت مساعد أكاديمي. لخّص النص التالي بالعربية بأسلوب واضح ومنظّم في نقاط مرتبة، مع الحفاظ على المعلومات الجوهرية. لا تضف معلومات خارجية.",
  rephrase:
    "أنت مساعد لغوي أكاديمي. أعد صياغة النص التالي بالعربية بأسلوب احترافي وسليم نحوياً مع المحافظة على المعنى الكامل. قدّم النص المعاد صياغته فقط.",
  analyze:
    "أنت محلل أكاديمي. حلّل النص التالي وقدّم: (1) الفكرة الرئيسية، (2) النقاط الفرعية، (3) نقاط القوة، (4) نقاط الضعف، (5) توصيات للتحسين. استخدم العربية وعناوين فرعية واضحة.",
};

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
    const tool = String(body?.tool || "");
    const text = String(body?.text || "").trim();

    if (!PROMPTS[tool]) {
      return new Response(JSON.stringify({ error: "أداة غير صالحة" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!text || text.length < 20) {
      return new Response(JSON.stringify({ error: "الرجاء إدخال نص لا يقل عن 20 حرفاً" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (text.length > 8000) {
      return new Response(JSON.stringify({ error: "النص طويل جداً (الحد الأقصى 8000 حرف)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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

    // Premium-only tool: analyze
    if (tool === "analyze" && !isPremium) {
      return new Response(JSON.stringify({
        error: "هذه الأداة متاحة لأعضاء العضوية فقط",
        code: "premium_required",
      }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Quota check
    const today = new Date().toISOString().slice(0, 10);
    const { count } = await supabase
      .from("student_ai_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("tool_type", tool)
      .eq("usage_date", today);

    if ((count ?? 0) >= limit) {
      return new Response(JSON.stringify({
        error: isPremium
          ? `تجاوزت الحد اليومي (${limit}) لهذه الأداة`
          : `تجاوزت الحد المجاني اليومي (${limit}). فعّل العضوية للحصول على ${PREMIUM_DAILY} يومياً`,
        code: "quota_exceeded",
      }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Call Lovable AI
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: PROMPTS[tool] },
          { role: "user", content: text },
        ],
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
      return new Response(JSON.stringify({ error: "تعذر تنفيذ الطلب" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const output = aiJson?.choices?.[0]?.message?.content || "";

    // Log usage
    await supabase.from("student_ai_usage").insert({
      user_id: user.id,
      tool_type: tool,
      input_length: text.length,
      output_length: output.length,
      is_premium_user: isPremium,
    });

    // Trigger daily task: use_ai_tool (best-effort, ignore errors)
    await supabase.rpc("complete_daily_task", { _task_code: "use_ai_tool", _metadata: { tool } });

    return new Response(JSON.stringify({
      output,
      remaining: Math.max(0, limit - ((count ?? 0) + 1)),
      limit,
      is_premium: isPremium,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("student-ai-tools error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "خطأ غير متوقع" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
