// Master PayLater — OCR for financing documents (national ID, salary certificate)
// Uses Lovable AI Gateway with vision-capable models to extract structured data
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

    const { document_id } = await req.json();
    if (!document_id) return json(400, { error: "document_id is required" });

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data: doc } = await admin
      .from("financing_documents")
      .select("id, file_url, document_type, application_id")
      .eq("id", document_id)
      .maybeSingle();

    if (!doc) return json(404, { error: "document_not_found" });

    // Build a prompt specific to document type
    const isId = doc.document_type === 'national_id';
    const isSalary = doc.document_type === 'salary_certificate';

    const sysPrompt = isId
      ? "أنت مساعد ذكي متخصص في استخراج البيانات من الهوية الوطنية السعودية. استخرج البيانات بدقة."
      : isSalary
      ? "أنت مساعد متخصص في قراءة شهادات التعريف بالراتب. استخرج البيانات الرئيسية."
      : "استخرج البيانات الرئيسية من المستند.";

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sysPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "استخرج البيانات من هذا المستند:" },
              { type: "image_url", image_url: { url: doc.file_url } },
            ],
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "submit_extracted_data",
            description: "Submit extracted document data",
            parameters: {
              type: "object",
              properties: {
                full_name: { type: "string", description: "الاسم الكامل" },
                id_number: { type: "string", description: "رقم الهوية الوطنية (10 أرقام)" },
                date_of_birth: { type: "string", description: "تاريخ الميلاد إن وُجد" },
                expiry_date: { type: "string", description: "تاريخ انتهاء الهوية إن وُجد" },
                employer_name: { type: "string", description: "جهة العمل (لشهادة الراتب)" },
                monthly_salary: { type: "number", description: "الراتب الشهري بالريال (لشهادة الراتب)" },
                issue_date: { type: "string", description: "تاريخ إصدار المستند" },
                document_valid: { type: "boolean", description: "هل المستند صالح وواضح" },
                confidence: { type: "string", enum: ["high", "medium", "low"] },
                notes_ar: { type: "string", description: "ملاحظات بالعربية" },
              },
              required: ["document_valid", "confidence"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "submit_extracted_data" } },
      }),
    });

    if (aiRes.status === 429) return json(429, { error: "rate_limited" });
    if (aiRes.status === 402) return json(402, { error: "ai_credits_exhausted" });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      return json(500, { error: "ocr_failed" });
    }

    const aiData = await aiRes.json();
    const toolCall = aiData?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) return json(500, { error: "no_extraction" });

    const extracted = JSON.parse(toolCall.function.arguments);

    await admin
      .from("financing_documents")
      .update({
        ai_extracted_data: extracted,
        ai_extracted_at: new Date().toISOString(),
      })
      .eq("id", document_id);

    return json(200, { success: true, extracted });
  } catch (e) {
    console.error("financing-ocr-document error:", e);
    return json(500, { error: e instanceof Error ? e.message : "unknown" });
  }
});

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
