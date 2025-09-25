import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MethodologyInquiryRequest {
  serviceType: string;
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  position?: string;
  researchField: string;
  methodologyType: string;
  researchTitle: string;
  researchObjectives: string;
  expectedDuration?: string;
  targetPopulation?: string;
  dataCollectionMethods?: string;
  analysisApproach?: string;
  ethicalConsiderations?: string;
  budgetRange?: string;
  additionalNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiryData: MethodologyInquiryRequest = await req.json();
    console.log("Received methodology inquiry:", inquiryData);

    // Validation
    if (!inquiryData.fullName || !inquiryData.email || !inquiryData.phone || 
        !inquiryData.organization || !inquiryData.researchField || 
        !inquiryData.methodologyType || !inquiryData.researchTitle || 
        !inquiryData.researchObjectives) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inquiryData.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    const currentDate = new Date().toLocaleString('ar-SA', {
      timeZone: 'Asia/Riyadh',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Map field values to Arabic labels
    const getFieldLabel = (field: string, value: string) => {
      const fieldMappings: Record<string, Record<string, string>> = {
        researchField: {
          'medical': 'الطب وعلوم الصحة',
          'engineering': 'الهندسة والتكنولوجيا',
          'social-sciences': 'العلوم الاجتماعية',
          'education': 'التربية وعلم النفس',
          'business': 'إدارة الأعمال والاقتصاد',
          'literature': 'الأدب واللغات',
          'law': 'القانون والشريعة',
          'natural-sciences': 'العلوم الطبيعية',
          'computer-science': 'علوم الحاسب وتقنية المعلومات',
          'agriculture': 'الزراعة والبيئة',
          'other': 'مجال آخر'
        },
        methodologyType: {
          'quantitative': 'منهجية كمية (Quantitative)',
          'qualitative': 'منهجية نوعية (Qualitative)',
          'mixed-methods': 'منهجية مختلطة (Mixed Methods)',
          'experimental': 'منهجية تجريبية (Experimental)',
          'case-study': 'دراسة حالة (Case Study)',
          'survey': 'منهجية مسحية (Survey)',
          'ethnographic': 'منهجية إثنوغرافية',
          'action-research': 'بحث إجرائي (Action Research)',
          'systematic-review': 'مراجعة منهجية',
          'meta-analysis': 'التحليل البعدي (Meta-Analysis)'
        },
        budgetRange: {
          'under-5000': 'أقل من 5,000 ريال',
          '5000-15000': '5,000 - 15,000 ريال',
          '15000-30000': '15,000 - 30,000 ريال',
          '30000-50000': '30,000 - 50,000 ريال',
          '50000-100000': '50,000 - 100,000 ريال',
          'above-100000': 'أكثر من 100,000 ريال',
          'flexible': 'مرن حسب الخدمة المطلوبة'
        },
        expectedDuration: {
          '1-3months': '1-3 أشهر',
          '3-6months': '3-6 أشهر',
          '6-12months': '6-12 شهر',
          '1-2years': '1-2 سنة',
          'above-2years': 'أكثر من سنتين',
          'flexible': 'مرن'
        }
      };
      
      return fieldMappings[field]?.[value] || value;
    };

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "نظام المنهجية العلمية <notifications@masteredupath.com>",
      to: ["admin@masteredupath.com"],
      subject: `🔬 طلب جديد لتصميم منهجية علمية - ${inquiryData.researchTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; direction: rtl; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #0d9488); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; }
            .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; border-right: 4px solid #10b981; }
            .field { margin: 10px 0; }
            .label { font-weight: bold; color: #0d9488; display: inline-block; min-width: 150px; }
            .value { color: #374151; }
            .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
            .urgent { background: #fef3c7; border-right: 4px solid #f59e0b; padding: 15px; margin: 15px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔬 طلب تصميم منهجية علمية جديد</h1>
              <p>تم استلام طلب جديد لتصميم منهجية علمية موثوقة ومتطورة</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <strong>⚠️ مطلوب رد سريع:</strong> يجب التواصل مع العميل خلال 4 ساعات كحد أقصى
              </div>

              <div class="section">
                <h3>👤 معلومات الباحث</h3>
                <div class="field"><span class="label">الاسم الكامل:</span> <span class="value">${inquiryData.fullName}</span></div>
                <div class="field"><span class="label">البريد الإلكتروني:</span> <span class="value">${inquiryData.email}</span></div>
                <div class="field"><span class="label">رقم الهاتف:</span> <span class="value">${inquiryData.phone}</span></div>
                <div class="field"><span class="label">المؤسسة/الجامعة:</span> <span class="value">${inquiryData.organization}</span></div>
                ${inquiryData.position ? `<div class="field"><span class="label">المنصب/الدرجة:</span> <span class="value">${inquiryData.position}</span></div>` : ''}
              </div>

              <div class="section">
                <h3>🎯 معلومات البحث</h3>
                <div class="field"><span class="label">مجال البحث:</span> <span class="value">${getFieldLabel('researchField', inquiryData.researchField)}</span></div>
                <div class="field"><span class="label">نوع المنهجية:</span> <span class="value">${getFieldLabel('methodologyType', inquiryData.methodologyType)}</span></div>
                <div class="field"><span class="label">عنوان البحث:</span> <span class="value">${inquiryData.researchTitle}</span></div>
                <div class="field"><span class="label">أهداف البحث:</span> <span class="value">${inquiryData.researchObjectives}</span></div>
              </div>

              <div class="section">
                <h3>🔬 تفاصيل المنهجية</h3>
                ${inquiryData.expectedDuration ? `<div class="field"><span class="label">المدة المتوقعة:</span> <span class="value">${getFieldLabel('expectedDuration', inquiryData.expectedDuration)}</span></div>` : ''}
                ${inquiryData.budgetRange ? `<div class="field"><span class="label">الميزانية المتوقعة:</span> <span class="value">${getFieldLabel('budgetRange', inquiryData.budgetRange)}</span></div>` : ''}
                ${inquiryData.targetPopulation ? `<div class="field"><span class="label">العينة المستهدفة:</span> <span class="value">${inquiryData.targetPopulation}</span></div>` : ''}
                ${inquiryData.dataCollectionMethods ? `<div class="field"><span class="label">طرق جمع البيانات:</span> <span class="value">${inquiryData.dataCollectionMethods}</span></div>` : ''}
                ${inquiryData.analysisApproach ? `<div class="field"><span class="label">منهج التحليل:</span> <span class="value">${inquiryData.analysisApproach}</span></div>` : ''}
                ${inquiryData.ethicalConsiderations ? `<div class="field"><span class="label">الاعتبارات الأخلاقية:</span> <span class="value">${inquiryData.ethicalConsiderations}</span></div>` : ''}
              </div>

              ${inquiryData.additionalNotes ? `
              <div class="section">
                <h3>📝 ملاحظات إضافية</h3>
                <div class="field"><span class="value">${inquiryData.additionalNotes}</span></div>
              </div>
              ` : ''}

              <div class="section">
                <h3>🕒 معلومات الطلب</h3>
                <div class="field"><span class="label">تاريخ الطلب:</span> <span class="value">${currentDate}</span></div>
                <div class="field"><span class="label">نوع الخدمة:</span> <span class="value">تصميم منهجية علمية</span></div>
              </div>
            </div>
            
            <div class="footer">
              <p>هذا إشعار تلقائي من نظام إدارة طلبات المنهجية العلمية</p>
              <p>يرجى التواصل مع العميل في أسرع وقت ممكن</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "فريق المنهجية العلمية <no-reply@masteredupath.com>",
      to: [inquiryData.email],
      subject: `تأكيد استلام طلب المنهجية العلمية - ${inquiryData.researchTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #0d9488); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; }
            .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; border-right: 4px solid #10b981; }
            .highlight { background: #ecfdf5; border: 2px solid #10b981; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
            .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
            .contact-info { background: #0f172a; color: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔬 تم استلام طلبك بنجاح!</h1>
              <p>شكراً لاختيارك خدمة المنهجية العلمية</p>
            </div>
            
            <div class="content">
              <div class="highlight">
                <h2>🎯 أهلاً بك ${inquiryData.fullName}</h2>
                <p>تم استلام طلبك لتصميم منهجية علمية لبحث: <strong>"${inquiryData.researchTitle}"</strong></p>
              </div>

              <div class="section">
                <h3>📋 ملخص طلبك:</h3>
                <ul style="text-align: right;">
                  <li><strong>مجال البحث:</strong> ${getFieldLabel('researchField', inquiryData.researchField)}</li>
                  <li><strong>نوع المنهجية:</strong> ${getFieldLabel('methodologyType', inquiryData.methodologyType)}</li>
                  <li><strong>المؤسسة:</strong> ${inquiryData.organization}</li>
                  ${inquiryData.expectedDuration ? `<li><strong>المدة المتوقعة:</strong> ${getFieldLabel('expectedDuration', inquiryData.expectedDuration)}</li>` : ''}
                </ul>
              </div>

              <div class="section">
                <h3>⏰ الخطوات التالية:</h3>
                <ol style="text-align: right;">
                  <li><strong>المراجعة الأولية:</strong> سيقوم فريق الخبراء بمراجعة طلبك خلال ساعة واحدة</li>
                  <li><strong>التواصل المبدئي:</strong> سنتصل بك خلال 4 ساعات لمناقشة التفاصيل</li>
                  <li><strong>الاستشارة المتخصصة:</strong> سنحدد موعداً لاستشارة مفصلة مع خبير المنهجية</li>
                  <li><strong>التصميم المخصص:</strong> سنبدأ في تصميم المنهجية وفقاً لاحتياجاتك</li>
                </ol>
              </div>

              <div class="section">
                <h3>🎓 ما يمكنك توقعه:</h3>
                <ul style="text-align: right;">
                  <li>منهجية علمية شاملة ومتطورة</li>
                  <li>تصميم مخصص لمجال بحثك</li>
                  <li>إرشادات واضحة لتطبيق المنهجية</li>
                  <li>دعم مستمر من فريق الخبراء</li>
                  <li>ضمان الجودة والموثوقية العلمية</li>
                </ul>
              </div>

              <div class="contact-info">
                <h3 style="color: #10b981;">📞 معلومات التواصل:</h3>
                <p><strong>البريد الإلكتروني:</strong> support@masteredupath.com</p>
                <p><strong>الهاتف:</strong> +966 XX XXX XXXX</p>
                <p><strong>أوقات العمل:</strong> الأحد - الخميس، 8 صباحاً - 8 مساءً</p>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>شكراً لثقتك في خدماتنا</strong></p>
              <p>نتطلع للعمل معك في تطوير بحثك العلمي</p>
              <p style="font-size: 0.9em; margin-top: 15px;">
                تاريخ الطلب: ${currentDate}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Client email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Methodology inquiry submitted successfully",
        adminEmailId: adminEmailResponse.data?.id,
        clientEmailId: clientEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-methodology-inquiry function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        details: "Failed to process methodology inquiry"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);