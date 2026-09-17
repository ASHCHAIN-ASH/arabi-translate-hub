// اقتراح رد ذكي للأدمن بناءً على سياق المحادثة عبر Lovable AI
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.some((r: any) => r.role === "admin")) return json({ error: "Admin only" }, 403);

    const { conversation_id, tone = "professional" } = await req.json();
    if (!conversation_id) return json({ error: "conversation_id مطلوب" }, 400);

    const { data: conv } = await supabase
      .from("whatsapp_conversations").select("*").eq("id", conversation_id).single();
    if (!conv) return json({ error: "محادثة غير موجودة" }, 404);

    const { data: msgs } = await supabase
      .from("whatsapp_messages")
      .select("direction, sender_type, body, created_at")
      .eq("conversation_id", conversation_id)
      .order("created_at", { ascending: false })
      .limit(15);
    const ordered = (msgs || []).reverse();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) return json({ error: "AI غير مفعّل" }, 500);

    const toneAr =
      tone === "friendly" ? "ودّي قريب من القلب" :
      tone === "formal" ? "رسمي جداً ومهني" :
      "مهني ومتعاطف";

    const systemPrompt = `أنت مساعد لفريق دعم منصة "FekrahEdu" الأكاديمية على واتساب.
اقترح رداً واحداً مناسباً للأدمن ليرسله للعميل.
- النبرة: ${toneAr}.
- بالعربية الفصحى المبسّطة.
- استخدم الإيموجي باعتدال.
- 2-5 أسطر فقط.
- لا تخترع أرقام طلبات أو فواتير.
- إذا كان السؤال يحتاج معلومة من النظام، اقترح صياغة عامة تطلب المعلومة من العميل أو تعد بالمراجعة.

اسم العميل: ${conv.customer_name || "العميل"}
رقم العميل: ${conv.phone}

أعطني الرد المقترح فقط بدون مقدمات ولا علامات اقتباس.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...ordered.map((m: any) => ({
        role: m.direction === "inbound" ? "user" : "assistant",
        content: m.body,
      })),
      { role: "user", content: "اقترح رداً قصيراً مناسباً." },
    ];

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages }),
    });

    if (!resp.ok) {
      if (resp.status === 429) return json({ error: "النظام مزدحم — حاول بعد قليل" }, 429);
      if (resp.status === 402) return json({ error: "رصيد AI نفد" }, 402);
      const t = await resp.text();
      return json({ error: "AI: " + t.slice(0, 200) }, 500);
    }
    const data = await resp.json();
    const suggestion = (data?.choices?.[0]?.message?.content || "").trim();
    return json({ suggestion });
  } catch (e: any) {
    return json({ error: e?.message || "خطأ" }, 500);
  }
});

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
