import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // جمع بيانات شاملة عن المنصة
    const [
      { data: orders },
      { data: invoices },
      { data: customers },
      { count: usersCount },
      { data: tickets },
      { data: payments },
      { data: services },
    ] = await Promise.all([
      supabase.from("service_orders").select("id, status, total_amount, created_at, service_name").order("created_at", { ascending: false }).limit(50),
      supabase.from("invoices").select("id, status, total_amount, paid_amount, due_date, customer_name").order("created_at", { ascending: false }).limit(50),
      supabase.from("customers").select("id, name, status, created_at").order("created_at", { ascending: false }).limit(30),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("inbox_messages").select("id, status, priority, subject, sender_name, created_at").order("created_at", { ascending: false }).limit(20),
      supabase.from("payment_intents").select("status, amount, created_at").gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
      supabase.from("services").select("name, price, is_active").limit(20),
    ]);

    // حساب إحصائيات
    const totalRevenue = (payments || []).filter(p => p.status === "succeeded").reduce((s, p) => s + Number(p.amount || 0), 0);
    const pendingOrders = (orders || []).filter(o => o.status === "pending" || o.status === "in_progress").length;
    const overdueInvoices = (invoices || []).filter(i => i.status !== "paid" && i.due_date && new Date(i.due_date) < new Date()).length;
    const openTickets = (tickets || []).filter(t => t.status === "open").length;
    const highPriorityTickets = (tickets || []).filter(t => t.priority === "high" || t.priority === "urgent").length;

    const platformContext = `
بيانات المنصة الحية (الآن):
- إجمالي المستخدمين: ${usersCount || 0}
- إجمالي العملاء: ${customers?.length || 0}
- الإيرادات (آخر 30 يوم): ${totalRevenue.toFixed(2)} ر.س
- الطلبات قيد التنفيذ: ${pendingOrders}
- آخر 10 طلبات: ${(orders || []).slice(0, 10).map(o => `${o.service_name || "طلب"} - ${o.status} - ${o.total_amount || 0} ر.س`).join(" | ")}
- الفواتير المتأخرة: ${overdueInvoices}
- الفواتير غير المسددة: ${(invoices || []).filter(i => i.status !== "paid").slice(0, 5).map(i => `${i.customer_name} - ${i.total_amount} ر.س`).join(" | ")}
- التذاكر المفتوحة: ${openTickets} (${highPriorityTickets} عاجلة)
- الخدمات النشطة: ${(services || []).filter(s => s.is_active).map(s => `${s.name} (${s.price} ر.س)`).join(" | ")}
`.trim();

    let systemPrompt = "";
    if (mode === "insights") {
      systemPrompt = `أنت محلل بيانات ذكي لمنصة "FekrahEdu" للخدمات الأكاديمية.
${platformContext}

مهمتك: أعطِ 3-5 رؤى ذكية قصيرة جداً عن حالة المنصة الآن. كل رؤية:
- جملة واحدة قصيرة (15 كلمة كحد أقصى)
- تبدأ بإيموجي مناسب (📈 📉 ⚠️ 💡 🎯 🔥)
- محددة وقابلة للتنفيذ
- بالعربية الفصحى الواضحة

أرجع فقط القائمة بدون مقدمة أو خاتمة.`;
    } else {
      systemPrompt = `أنت مساعد ذكي للأدمن في منصة "FekrahEdu" للخدمات الأكاديمية.
لديك وصول كامل لبيانات المنصة الحية:
${platformContext}

أجب على أسئلة الأدمن بدقة من البيانات أعلاه. كن:
- موجزاً ومباشراً
- استخدم أرقاماً محددة من البيانات
- اقترح إجراءات عملية عند الحاجة
- استخدم Markdown للتنسيق (قوائم، **عريض**)
- بالعربية الفصحى`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("AI gateway error:", response.status, errText);

      let userMsg = "خطأ في الذكاء الاصطناعي";
      if (response.status === 429) userMsg = "تم تجاوز الحد المسموح، حاول لاحقاً";
      else if (response.status === 402) userMsg = "الرصيد غير كافٍ، يرجى إضافة رصيد الذكاء الاصطناعي";

      // إرجاع stream متوافق SSE حتى يستهلكه العميل دون كسر، مع رسالة واضحة
      const sseBody =
        `data: ${JSON.stringify({ choices: [{ delta: { content: `⚠️ ${userMsg}` } }] })}\n\n` +
        `data: [DONE]\n\n`;

      return new Response(sseBody, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("admin-ai-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "خطأ غير معروف" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
