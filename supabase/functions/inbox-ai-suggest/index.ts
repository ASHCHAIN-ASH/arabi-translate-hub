// AI reply suggestion for the admin inbox.
// Uses Lovable AI Gateway (Gemini Flash) to draft a polite Arabic reply.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messageId, tone = "professional" } = await req.json();
    if (!messageId) {
      return new Response(JSON.stringify({ error: "messageId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify admin
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "unauthenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: claims } = await admin.auth.getClaims(token);
    const userId = claims?.claims?.sub as string | undefined;
    if (!userId) {
      return new Response(JSON.stringify({ error: "unauthenticated" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await admin.from("user_roles")
      .select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load message
    const { data: msg, error: msgErr } = await admin
      .from("inbox_messages")
      .select("sender_name, subject, message, form_type, service_type, metadata")
      .eq("id", messageId)
      .single();
    if (msgErr || !msg) throw msgErr ?? new Error("not found");

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const toneAr =
      tone === "friendly" ? "ودّي ومحبّب" :
      tone === "formal"   ? "رسمي جداً" :
      "احترافي ومتوازن";

    const systemPrompt = `أنت مساعد لخدمة عملاء وكالة "FekrahEdu" الأكاديمية.
اكتب ردّاً عربياً (RTL) ${toneAr} على رسالة العميل التالية.
- ابدأ بتحية باسم العميل.
- ردّ مباشرة على سؤاله/طلبه بإيجاز ووضوح.
- اعرض الخطوة التالية بشكل عملي.
- اختم بتوقيع: "مع التحية، فريق FekrahEdu".
- لا تستخدم emojis ولا markdown ولا HTML — نص عادي فقط.
- لا تخترع أسعاراً أو تواريخ غير موجودة.`;

    const userPrompt = `اسم العميل: ${msg.sender_name}
نوع الفورم: ${msg.form_type}${msg.service_type ? ` | الخدمة: ${msg.service_type}` : ""}
الموضوع: ${msg.subject ?? "—"}
الرسالة:
"""
${msg.message}
"""`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "تم تجاوز الحد. حاول بعد قليل." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "نفذت أرصدة Lovable AI. يرجى الإضافة من إعدادات Workspace." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      throw new Error(`AI gateway: ${aiRes.status} ${t}`);
    }

    const aiData = await aiRes.json();
    const suggestion = aiData?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ suggestion }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[inbox-ai-suggest]", err);
    return new Response(JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
