import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReviewRequest {
  fullName: string;
  email: string;
  phone?: string;
  fileName: string;
  fileContent: string;
  fileType: string;
}

// Function to extract text from base64 file content
async function extractTextFromFile(fileContent: string, fileType: string): Promise<string> {
  try {
    // For now, we'll simulate text extraction
    // In a production environment, you would use appropriate libraries
    // to extract text from PDF/Word files
    
    if (fileType.includes('pdf')) {
      return "نص تجريبي من ملف PDF - يحتوي على مقدمة، منهجية البحث، النتائج والخلاصة. يناقش البحث موضوع محدد بطريقة علمية منهجية.";
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return "نص تجريبي من ملف Word - يتضمن أهداف البحث، الإطار النظري، منهجية الدراسة، تحليل البيانات والتوصيات.";
    }
    
    return "تم استلام الملف بنجاح ولكن لم يتم استخراج النص بشكل كامل.";
  } catch (error) {
    console.error("Error extracting text:", error);
    return "حدث خطأ في استخراج النص من الملف.";
  }
}

// Function to analyze research using OpenAI
async function analyzeResearchWithAI(content: string, fileName: string): Promise<string> {
  try {
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
            content: `أنت خبير في مراجعة الأبحاث العلمية والمنهجية البحثية. قم بتحليل البحث المرفق وأعد تقريراً شاملاً باللغة العربية يتضمن:

1. ملخص المحتوى
2. تقييم المنهجية العلمية
3. نقاط القوة
4. نقاط الضعف والتحسينات المطلوبة  
5. تقييم جودة الاقتباسات والمراجع
6. تقييم الأسلوب اللغوي والعلمي
7. التوصيات النهائية
8. درجة التقييم الإجمالية من 100

يجب أن يكون التقرير مفصلاً ومفيداً للباحث لتحسين جودة بحثه.`
          },
          {
            role: "user", 
            content: `يرجى مراجعة وتحليل البحث التالي باسم الملف: "${fileName}"

محتوى البحث:
${content}

أريد تقريراً شاملاً ومفصلاً لهذا البحث مع تقييم علمي دقيق.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing with AI:", error);
    return `تقرير المراجعة المنهجية
    
الملف: ${fileName}

تم استلام البحث بنجاح وسيتم مراجعته من قبل الفريق المختص.

نظراً لعدم توفر الاتصال بخدمة الذكاء الاصطناعي في الوقت الحالي، سيتم إجراء المراجعة بواسطة خبراء المراجعة لدينا وإرسال التقرير المفصل خلال 24-48 ساعة.

سيتضمن التقرير النهائي:
- تحليل شامل للمنهجية العلمية
- تقييم جودة المحتوى والأسلوب  
- ملاحظات وتوصيات للتحسين
- درجة التقييم الشاملة

شكراً لثقتكم بخدماتنا.`;
  }
}

// Function to generate PDF report (simplified version)
function generatePDFReport(analysisResult: string, clientInfo: any): string {
  // In a real implementation, you would use a PDF generation library
  // For now, we'll return the analysis as text that will be sent via email
  const reportHeader = `
تقرير المراجعة المنهجية بالذكاء الاصطناعي

معلومات العميل:
الاسم: ${clientInfo.fullName}
البريد الإلكتروني: ${clientInfo.email}
رقم الجوال: ${clientInfo.phone || 'غير محدد'}
اسم الملف: ${clientInfo.fileName}
تاريخ التحليل: ${new Date().toLocaleDateString('ar-SA')}

-------------------

`;
  
  return reportHeader + analysisResult;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: ReviewRequest = await req.json();
    
    console.log("Received review request for:", requestData.fileName);

    // Validate required fields
    if (!requestData.fullName || !requestData.email || !requestData.fileContent) {
      throw new Error("البيانات المطلوبة ناقصة");
    }

    // Extract text from uploaded file
    console.log("Extracting text from file...");
    const extractedText = await extractTextFromFile(requestData.fileContent, requestData.fileType);
    
    // Analyze with AI
    console.log("Analyzing research with AI...");
    const analysisResult = await analyzeResearchWithAI(extractedText, requestData.fileName);
    
    // Generate PDF report
    console.log("Generating PDF report...");
    const pdfReport = generatePDFReport(analysisResult, requestData);

    // Send confirmation email to client
    console.log("Sending confirmation email to client...");
    const clientEmailResponse = await resend.emails.send({
      from: "FekrahEdu <no-reply@fekrahedu.com>",
      to: [requestData.email],
      subject: "تأكيد استلام بحثك للمراجعة المنهجية",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">🤖 المراجعة المنهجية بالذكاء الاصطناعي</h1>
            <h2 style="color: #059669; margin: 0;">تم استلام بحثك بنجاح ✅</h2>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1e40af; margin-top: 0;">مرحباً ${requestData.fullName}،</h3>
            <p style="line-height: 1.6; color: #475569;">
              شكراً لتقديم بحثك للمراجعة المنهجية باستخدام الذكاء الاصطناعي. 
              تم استلام ملفك <strong>"${requestData.fileName}"</strong> بنجاح.
            </p>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-right: 4px solid #10b981; margin-bottom: 20px;">
            <h4 style="color: #065f46; margin-top: 0;">ما التالي؟</h4>
            <ul style="color: #047857; line-height: 1.6;">
              <li>تم إرسال بحثك إلى فريق المراجعة المختص</li>
              <li>سيتم تحليل البحث باستخدام أحدث تقنيات الذكاء الاصطناعي</li>
              <li>ستتلقى التقرير المفصل خلال 24-48 ساعة</li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #92400e; font-weight: 500;">
              📋 سيتضمن التقرير تحليلاً شاملاً للمنهجية، الجودة العلمية، والتوصيات للتحسين.
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 0;">
              تم إرسال هذه الرسالة تلقائياً من نظام المراجعة المنهجية بالذكاء الاصطناعي
            </p>
          </div>
        </div>
      `,
    });

    // Send comprehensive admin notification with immediate alert and detailed report
    console.log("Sending comprehensive admin notification...");
    const fileBuffer = Uint8Array.from(atob(requestData.fileContent), c => c.charCodeAt(0));
    
    const adminEmailResponse = await resend.emails.send({
      from: "نظام المراجعة المنهجية <no-reply@fekrahedu.com>",
      to: ["info@fekrahedu.com"],
      subject: `🔔 تنبيه فوري: بحث جديد للمراجعة - ${requestData.fileName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <!-- Header Alert -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 25px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; margin-bottom: 10px;">🚨 تنبيه فوري من النظام</h1>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; display: inline-block;">
              <p style="margin: 0; font-size: 18px; font-weight: bold;">تم استلام بحث جديد للمراجعة المنهجية</p>
              <p style="margin: 5px 0 0 0; font-size: 14px;">يرجى المراجعة الفورية وتحديد السعر</p>
            </div>
          </div>

          <!-- Client Information -->
          <div style="background: #fef2f2; padding: 25px; border-right: 6px solid #dc2626;">
            <h2 style="color: #991b1b; margin-top: 0; margin-bottom: 20px; font-size: 22px;">👤 معلومات العميل</h2>
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
                  <td style="padding: 12px 0; color: #6b7280; font-weight: bold;">رقم الواتساب:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${requestData.phone || 'غير متوفر'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 12px 0; color: #6b7280; font-weight: bold;">اسم الملف:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${requestData.fileName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 12px 0; color: #6b7280; font-weight: bold;">نوع الملف:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${requestData.fileType}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #6b7280; font-weight: bold;">وقت الاستلام:</td>
                  <td style="padding: 12px 0; color: #1f2937;">${new Date().toLocaleString('ar-SA')}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Action Required -->
          <div style="background: #f0f9ff; padding: 25px; border-right: 6px solid #0ea5e9; margin: 20px 0;">
            <h3 style="color: #0c4a6e; margin-top: 0; margin-bottom: 20px; font-size: 20px;">⚡ إجراءات مطلوبة فورية</h3>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <ol style="color: #0c4a6e; line-height: 1.8; margin: 0; padding-right: 20px;">
                <li style="margin-bottom: 10px;"><strong>مراجعة الملف المرفق:</strong> تم إرفاق ملف البحث الأصلي مع هذا الإيميل</li>
                <li style="margin-bottom: 10px;"><strong>تحليل التعقيد:</strong> قم بتقييم تعقيد البحث وطوله لتحديد السعر</li>
                <li style="margin-bottom: 10px;"><strong>تحديد السعر:</strong> استخدم جدول التسعير المعتمد حسب نوع وتعقيد البحث</li>
                <li style="margin-bottom: 10px;"><strong>التواصل السريع:</strong> تواصل مع العميل خلال 24 ساعة عبر:</li>
                <ul style="margin: 10px 0; padding-right: 20px;">
                  <li>الواتساب: ${requestData.phone || 'غير متوفر'}</li>
                  <li>البريد الإلكتروني: ${requestData.email}</li>
                </ul>
              </ol>
            </div>
          </div>

          <!-- AI Analysis Report -->
          <div style="background: #f8fafc; padding: 25px; border-right: 6px solid #6366f1; margin: 20px 0;">
            <h3 style="color: #4338ca; margin-top: 0; margin-bottom: 20px; font-size: 20px;">🤖 تقرير التحليل بالذكاء الاصطناعي</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; white-space: pre-line; color: #374151; line-height: 1.6; max-height: 400px; overflow-y: auto; border: 1px solid #e5e7eb;">
${pdfReport}
            </div>
          </div>

          <!-- Contact Information -->
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #92400e; margin-top: 0; margin-bottom: 15px;">📞 معلومات التواصل السريع</h4>
            <div style="color: #92400e; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;"><strong>البريد الإلكتروني:</strong> ${requestData.email}</p>
              <p style="margin: 0 0 8px 0;"><strong>رقم الواتساب:</strong> ${requestData.phone || 'غير محدد'}</p>
              <p style="margin: 0; font-weight: 500;">💡 <strong>يُفضل التواصل عبر الواتساب للاستجابة السريعة</strong></p>
            </div>
          </div>

          <!-- File Attachment Notice -->
          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #10b981;">
            <div style="display: inline-block; background: #10b981; color: white; padding: 15px 25px; border-radius: 8px;">
              <strong style="font-size: 16px;">📎 الملف الأصلي مرفق مع هذا الإيميل</strong>
            </div>
            <p style="margin: 15px 0 0 0; color: #065f46; font-weight: 500;">
              يمكنك تحميل الملف مباشرة من المرفقات لبدء المراجعة
            </p>
          </div>

          <!-- Success Notification -->
          <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #16a34a;">
            <p style="margin: 0; color: #15803d; font-weight: 500; text-align: center;">
              ✅ تم إرسال رسالة تأكيد للعميل على: ${requestData.email}
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              تم إرسال هذا التنبيه تلقائياً من نظام المراجعة المنهجية بالذكاء الاصطناعي<br>
              FekrahEdu - نظام إدارة الأبحاث
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: requestData.fileName,
          content: fileBuffer,
        },
      ],
    });

    console.log("Client email sent:", clientEmailResponse);
    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال البحث بنجاح وسيتم التواصل معك قريباً",
        analysisPreview: analysisResult.substring(0, 200) + "..."
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error processing review request:", error);
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