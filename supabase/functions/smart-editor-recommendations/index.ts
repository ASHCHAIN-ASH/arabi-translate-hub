import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1?target=deno";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RecommendationRequest {
  researchTitle: string;
  researchAbstract: string;
  fullName: string;
  email: string;
  phone?: string;
}

// Function to analyze research and generate recommendations using AI
async function generateRecommendations(title: string, abstract: string): Promise<string> {
  try {
    const prompt = `أنت خبير في النشر العلمي والبحث الأكاديمي. قم بتحليل العنوان والملخص التالي وقدم توصيات شاملة:

العنوان: "${title}"
الملخص: "${abstract}"

يرجى تقديم توصيات مفصلة تتضمن:

1. المجال العلمي والتخصص الدقيق
2. 3-5 مجلات علمية مناسبة مع:
   - اسم المجلة
   - معامل التأثير التقريبي
   - التصنيف (Q1, Q2, Q3, Q4)
   - موقع المجلة الإلكتروني
   - فترة المراجعة المتوقعة

3. 2-3 مؤتمرات دولية مناسبة مع:
   - اسم المؤتمر
   - الموقع والتاريخ المتوقع
   - رسوم المشاركة التقريبية
   - موعد إرسال الأوراق البحثية

4. 5-7 مراجع مهمة (كتب أو دراسات) في هذا المجال
5. الاتجاهات البحثية الحديثة في هذا التخصص
6. الكلمات المفتاحية المقترحة للبحث
7. نصائح لتحسين فرص القبول

تأكد من أن التوصيات دقيقة ومحدثة وعملية للباحث.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "أنت مستشار أكاديمي خبير في النشر العلمي وتقديم التوصيات للباحثين."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return `توصيات المحرر الذكي

العنوان: ${title}

نتائج التحليل:
تم تحليل بحثك بنجاح وسيتم إرسال التوصيات المفصلة من قبل فريق الخبراء خلال 24 ساعة.

المجال المحدد: سيتم تحديده من قبل الخبراء
المجلات المقترحة: سيتم اختيار أنسب المجلات العالمية
المؤتمرات الدولية: سيتم تحديد المؤتمرات المناسبة
المراجع المهمة: سيتم توفير قائمة شاملة بالمراجع

سيتضمن التقرير النهائي:
- تحليل مفصل للمجال العلمي
- قائمة بأفضل المجلات للنشر
- المؤتمرات الدولية المناسبة
- المراجع الأساسية والحديثة
- توجيهات لتحسين فرص القبول

شكراً لثقتكم في خدماتنا.`;
  }
}

// Function to generate PDF-like content (in text format for email)
function generateRecommendationReport(recommendations: string, clientInfo: any): string {
  const reportHeader = `
تقرير المحرر الذكي - توصيات النشر العلمي

معلومات الباحث:
الاسم: ${clientInfo.fullName}
البريد الإلكتروني: ${clientInfo.email}
رقم الجوال: ${clientInfo.phone || 'غير محدد'}
تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}

عنوان البحث: ${clientInfo.researchTitle}
${clientInfo.researchAbstract ? `الملخص: ${clientInfo.researchAbstract}` : ''}

==========================================

`;
  
  return reportHeader + recommendations;
}

// Generate a simple PDF summary for the admin attachment
async function generateResearchSummaryPdf(data: RecommendationRequest): Promise<string> {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const fontBytes = await Deno.readFile(new URL("./NotoNaskhArabic-Regular.ttf", import.meta.url));
    const font = await pdfDoc.embedFont(fontBytes);
    const fontSize = 12;
    const margin = 50;
    let y = 800;

    const drawLine = (text: string, size = fontSize) => {
      page.drawText(text, { x: margin, y, size, font });
      y -= size + 8;
    };

    drawLine('تقرير ملخص البحث - المحرر الذكي', 16);
    drawLine('');
    drawLine(`الاسم: ${data.fullName}`);
    drawLine(`البريد: ${data.email}`);
    if (data.phone) drawLine(`الجوال: ${data.phone}`);
    drawLine(`التاريخ: ${new Date().toLocaleDateString('ar-SA')}`);
    drawLine('');
    drawLine('عنوان البحث:');
    drawLine(data.researchTitle);
    drawLine('');
    if (data.researchAbstract) {
      drawLine('الملخص:');
      const text = data.researchAbstract;
      const maxWidth = 595.28 - margin * 2;
      const words = text.split(/\s+/);
      let line = '';
      for (const w of words) {
        const trial = line ? line + ' ' + w : w;
        const width = font.widthOfTextAtSize(trial, fontSize);
        if (width < maxWidth) {
          line = trial;
        } else {
          drawLine(line);
          line = w;
          if (y < 60) { y = 780; pdfDoc.addPage(); }
        }
      }
      if (line) drawLine(line);
    }

    const bytes = await pdfDoc.save();
    // Convert to base64
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      const sub = bytes.subarray(i, i + chunk);
      binary += String.fromCharCode.apply(null, Array.from(sub) as unknown as number[]);
    }
    const base64 = btoa(binary);
    return base64;
  } catch (e) {
    console.error('PDF generation failed:', e);
    return '';
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: RecommendationRequest = await req.json();
    
    console.log("Received recommendation request for:", requestData.researchTitle);

    // Validate required fields
    if (!requestData.researchTitle || !requestData.fullName || !requestData.email) {
      throw new Error("البيانات المطلوبة ناقصة");
    }

    // Generate AI recommendations
    console.log("Generating AI recommendations...");
    const recommendations = await generateRecommendations(
      requestData.researchTitle, 
      requestData.researchAbstract
    );
    
    // Generate detailed report
    console.log("Generating recommendation report...");
    const detailedReport = generateRecommendationReport(recommendations, requestData);

    // Generate PDF summary attachment
    console.log("Generating PDF summary attachment...");
    const summaryPdfBase64 = await generateResearchSummaryPdf(requestData);

    // Send confirmation email to client
    console.log("Sending confirmation email to client...");
    const clientEmailResponse = await resend.emails.send({
      from: "المحرر الذكي <no-reply@fekrahedu.com>",
      to: [requestData.email],
      subject: "تأكيد استلام طلب التوصيات - المحرر الذكي",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">🤖 المحرر الذكي</h1>
            <h2 style="color: #059669; margin: 0;">تم استلام طلبك بنجاح ✅</h2>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e40af; margin-top: 0;">مرحباً ${requestData.fullName}،</h3>
            <p style="line-height: 1.6; color: #475569;">
              شكراً لاستخدامك المحرر الذكي لتوصيات النشر العلمي. 
              تم استلام طلبك لتحليل البحث <strong>"${requestData.researchTitle}"</strong> بنجاح.
            </p>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-right: 4px solid #10b981; margin-bottom: 20px;">
            <h4 style="color: #065f46; margin-top: 0;">ما التالي؟</h4>
            <ul style="color: #047857; line-height: 1.6;">
              <li>تم إرسال طلبك إلى فريق الخبراء المختصين</li>
              <li>سيتم تحليل بحثك باستخدام المحرر الذكي المتقدم</li>
              <li>ستتلقى التوصيات المفصلة خلال 24-48 ساعة</li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #92400e; font-weight: 500;">
              📋 ستتضمن التوصيات: مجلات علمية مناسبة، مؤتمرات دولية، مراجع مهمة، وتحليل للاتجاهات البحثية الحديثة.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              تم إرسال هذه الرسالة تلقائياً من المحرر الذكي - FekrahEdu
            </p>
          </div>
        </div>
      `,
    });

    // Send immediate notification to admin
    console.log("Sending immediate admin notification...");
    const adminEmailResponse = await resend.emails.send({
      from: "المحرر الذكي - إشعار فوري <onboarding@resend.dev>",
      to: ["info@fekrahedu.com"],
      subject: `🔔 طلب توصيات جديد - ${requestData.researchTitle}`,
      replyTo: "info@fekrahedu.com",
      attachments: (summaryPdfBase64 && summaryPdfBase64.length > 0)
        ? [{ filename: "research-summary.pdf", content: summaryPdfBase64, contentType: "application/pdf" }]
        : [],
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 25px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; margin-bottom: 10px;">🤖 المحرر الذكي</h1>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; display: inline-block;">
              <p style="margin: 0; font-size: 18px; font-weight: bold;">طلب توصيات نشر جديد</p>
              <p style="margin: 5px 0 0 0; font-size: 14px;">يحتاج إلى مراجعة فورية</p>
            </div>
          </div>

          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <!-- معلومات الباحث -->
            <div style="background: #dbeafe; padding: 25px; border-right: 6px solid #3b82f6; margin-bottom: 20px;">
              <h2 style="color: #1e40af; margin-top: 0; margin-bottom: 20px; font-size: 22px;">👤 معلومات الباحث</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-weight: bold; width: 30%;">الاسم الكامل:</td>
                    <td style="padding: 12px 0; color: #1f2937;">${requestData.fullName}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-weight: bold;">البريد الإلكتروني:</td>
                    <td style="padding: 12px 0; color: #1f2937;">${requestData.email}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-weight: bold;">رقم الجوال:</td>
                    <td style="padding: 12px 0; color: #1f2937;">${requestData.phone || 'غير متوفر'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; color: #6b7280; font-weight: bold;">وقت الطلب:</td>
                    <td style="padding: 12px 0; color: #1f2937;">${new Date().toLocaleString('ar-SA')}</td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- تفاصيل البحث -->
            <div style="background: #f0f9ff; padding: 25px; border-right: 6px solid #0ea5e9; margin-bottom: 20px;">
              <h3 style="color: #0c4a6e; margin-top: 0; margin-bottom: 20px; font-size: 20px;">📚 تفاصيل البحث</h3>
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h4 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">العنوان:</h4>
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 15px; padding: 15px; background: #f9fafb; border-radius: 6px;">
                  ${requestData.researchTitle}
                </p>
                ${requestData.researchAbstract ? `
                  <h4 style="color: #1e40af; margin-bottom: 15px;">الملخص:</h4>
                  <p style="color: #374151; font-size: 14px; line-height: 1.6; padding: 15px; background: #f9fafb; border-radius: 6px;">
                    ${requestData.researchAbstract}
                  </p>
                ` : ''}
              </div>
            </div>

            <!-- التوصيات المبدئية -->
            <div style="background: #f0fdf4; padding: 25px; border-right: 6px solid #22c55e; margin-bottom: 20px;">
              <h3 style="color: #15803d; margin-top: 0; margin-bottom: 20px; font-size: 20px;">🤖 التوصيات المولدة بالذكاء الاصطناعي</h3>
              <div style="background: white; padding: 20px; border-radius: 8px; max-height: 400px; overflow-y: auto; border: 1px solid #e5e7eb;">
                <pre style="white-space: pre-line; font-family: Arial, sans-serif; color: #374151; line-height: 1.6; margin: 0;">${detailedReport}</pre>
              </div>
            </div>

            <!-- إشعار النجاح -->
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #22c55e;">
              <p style="margin: 0; color: #15803d; font-weight: 500;">
                ✅ تم إرسال رسالة تأكيد للباحث على: ${requestData.email}
              </p>
            </div>
          </div>
        </div>
      `,
    });
    console.log("Admin email response:", JSON.stringify(adminEmailResponse));

    console.log("Client email sent:", clientEmailResponse);
    console.log("Admin notification sent successfully");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح وسيتم التواصل معك قريباً",
        preview: recommendations.substring(0, 300) + "..."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error processing recommendation request:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "حدث خطأ في معالجة الطلب",
        success: false 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});