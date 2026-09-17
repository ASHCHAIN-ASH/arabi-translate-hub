// FekrahEdu PayLater — AI Risk Scoring for financing applications
// Computes a risk score (0-100) + analysis using Lovable AI Gateway
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { application_id } = await req.json();
    if (!application_id) {
      return json(400, { error: "application_id is required" });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data: app, error } = await admin
      .from("financing_applications")
      .select("*")
      .eq("id", application_id)
      .maybeSingle();

    if (error || !app) return json(404, { error: "application_not_found" });

    const monthlyIncome = Number(app.monthly_income || 0);
    const commitments = Number(app.monthly_commitments || 0);
    const installment = Number(app.monthly_installment || 0);
    const dti = monthlyIncome > 0
      ? ((commitments + installment) / monthlyIncome) * 100
      : 100;

    const prompt = `أنت محلل ائتمان متخصص في التمويل الاستهلاكي السعودي. حلّل طلب التمويل التالي وأعطِ تقييماً موضوعياً.

البيانات:
- المبلغ الإجمالي: ${app.total_amount} ر.س
- الدفعة الأولى: ${app.down_payment} ر.س
- المبلغ المتبقي: ${app.remaining_amount} ر.س
- مدة التمويل: ${app.duration_months} شهر
- القسط الشهري: ${installment} ر.س
- الدخل الشهري: ${monthlyIncome} ر.س
- الالتزامات الشهرية: ${commitments} ر.س
- نسبة عبء الدين (DTI): ${dti.toFixed(1)}%
- جهة العمل: ${app.employer_name || 'غير محدد'}
- يوجد كفيل: ${app.has_guarantor ? 'نعم' : 'لا'}
- نوع التمويل: ${app.funding_type}

قواعد التقييم:
- DTI < 30%: ممتاز (80-100)
- DTI 30-45%: جيد (60-79)
- DTI 45-60%: متوسط (40-59)
- DTI > 60%: ضعيف (0-39)
- وجود كفيل يضيف 10 نقاط
- جهة عمل حكومية أو شركة كبرى يضيف 5 نقاط`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "أنت محلل ائتمان محترف. أعطِ تقييماً موضوعياً مع توصية واضحة." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_risk_assessment",
            description: "Submit credit risk assessment",
            parameters: {
              type: "object",
              properties: {
                score: { type: "integer", minimum: 0, maximum: 100, description: "Risk score 0-100, higher is better" },
                level: { type: "string", enum: ["excellent", "good", "moderate", "poor"] },
                recommendation: { type: "string", enum: ["approve", "conditional_approve", "review", "reject"] },
                summary_ar: { type: "string", description: "ملخص بالعربية في جملتين" },
                strengths: { type: "array", items: { type: "string" } },
                concerns: { type: "array", items: { type: "string" } },
                suggested_actions: { type: "array", items: { type: "string" } },
              },
              required: ["score", "level", "recommendation", "summary_ar", "strengths", "concerns"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_risk_assessment" } },
      }),
    });

    if (aiRes.status === 429) return json(429, { error: "rate_limited" });
    if (aiRes.status === 402) return json(402, { error: "ai_credits_exhausted" });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      return json(500, { error: "ai_failed" });
    }

    const aiData = await aiRes.json();
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) return json(500, { error: "no_assessment" });

    const assessment = JSON.parse(toolCall.function.arguments);

    // Persist
    await admin
      .from("financing_applications")
      .update({
        ai_risk_score: assessment.score,
        ai_risk_analysis: { ...assessment, dti_percentage: Number(dti.toFixed(2)) },
        ai_scored_at: new Date().toISOString(),
      })
      .eq("id", application_id);

    return json(200, { success: true, assessment, dti });
  } catch (e) {
    console.error("financing-ai-risk-score error:", e);
    return json(500, { error: e instanceof Error ? e.message : "unknown" });
  }
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
