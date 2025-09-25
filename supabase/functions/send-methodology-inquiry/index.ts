import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

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
      from: "نظام المنهجية العلمية <noreply@masteredupath.com>",
      to: ["info@masteredupath.com", "support@masteredupath.com"],
      subject: `🔬 طلب جديد لتصميم منهجية علمية - ${inquiryData.researchTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #2d3748; 
              direction: rtl; 
              background-color: #f7fafc;
            }
            .container { 
              max-width: 800px; 
              margin: 20px auto; 
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            }
            .header h1 {
              font-size: 28px;
              font-weight: 700;
              margin-bottom: 10px;
              position: relative;
              z-index: 1;
            }
            .header p {
              font-size: 16px;
              opacity: 0.9;
              position: relative;
              z-index: 1;
            }
            .content { 
              padding: 40px 30px; 
              background: #ffffff;
            }
            .urgent { 
              background: linear-gradient(135deg, #fed7d7, #feb2b2);
              border: none;
              border-radius: 12px;
              padding: 20px; 
              margin: 20px 0; 
              text-align: center;
              color: #742a2a;
              font-weight: 600;
            }
            .section { 
              background: #f8fafc; 
              margin: 25px 0; 
              padding: 25px; 
              border-radius: 12px; 
              border-right: 4px solid #667eea;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .section h3 {
              color: #4c51bf;
              margin-bottom: 18px;
              font-size: 20px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 0;
              border-bottom: 2px solid #e2e8f0;
            }
            .icon {
              width: 28px;
              height: 28px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              font-size: 16px;
            }
            .icon-user { background: linear-gradient(135deg, #4299e1, #3182ce); }
            .icon-research { background: linear-gradient(135deg, #38a169, #2f855a); }
            .icon-methodology { background: linear-gradient(135deg, #d69e2e, #b7791f); }
            .icon-notes { background: linear-gradient(135deg, #e53e3e, #c53030); }
            .icon-time { background: linear-gradient(135deg, #805ad5, #6b46c1); }
            .field { 
              margin: 12px 0; 
              display: flex;
              align-items: start;
              gap: 10px;
            }
            .label { 
              font-weight: 600; 
              color: #4a5568; 
              min-width: 150px;
              font-size: 14px;
            }
            .value { 
              color: #2d3748; 
              flex: 1;
              background: white;
              padding: 8px 12px;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            }
            .contact-info { 
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white; 
              padding: 25px; 
              border-radius: 12px; 
              margin: 25px 0;
              text-align: center;
            }
            .contact-info h3 {
              margin-bottom: 15px;
              font-size: 20px;
            }
            .contact-info p {
              margin: 8px 0;
              font-size: 16px;
            }
            .footer { 
              background: #2d3748; 
              color: white; 
              padding: 30px; 
              text-align: center;
            }
            .footer p {
              margin: 8px 0;
            }
            .company-logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-logo">🎓 Master Edu Path</div>
              <h1>🔬 طلب تصميم منهجية علمية جديد</h1>
              <p>تم استلام طلب جديد لتصميم منهجية علمية موثوقة ومتطورة</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <strong>⚠️ مطلوب رد سريع:</strong> يجب التواصل مع العميل خلال 4 ساعات كحد أقصى
              </div>

              <div class="section">
                <h3><span class="icon icon-user">👤</span> معلومات الباحث</h3>
                <div class="field"><span class="label">الاسم الكامل:</span> <span class="value">${inquiryData.fullName}</span></div>
                <div class="field"><span class="label">البريد الإلكتروني:</span> <span class="value">${inquiryData.email}</span></div>
                <div class="field"><span class="label">رقم الهاتف:</span> <span class="value">${inquiryData.phone}</span></div>
                <div class="field"><span class="label">المؤسسة/الجامعة:</span> <span class="value">${inquiryData.organization}</span></div>
                ${inquiryData.position ? `<div class="field"><span class="label">المنصب/الدرجة:</span> <span class="value">${inquiryData.position}</span></div>` : ''}
              </div>

              <div class="section">
                <h3><span class="icon icon-research">🎯</span> معلومات البحث</h3>
                <div class="field"><span class="label">مجال البحث:</span> <span class="value">${getFieldLabel('researchField', inquiryData.researchField)}</span></div>
                <div class="field"><span class="label">نوع المنهجية:</span> <span class="value">${getFieldLabel('methodologyType', inquiryData.methodologyType)}</span></div>
                <div class="field"><span class="label">عنوان البحث:</span> <span class="value">${inquiryData.researchTitle}</span></div>
                <div class="field"><span class="label">أهداف البحث:</span> <span class="value">${inquiryData.researchObjectives}</span></div>
              </div>

              <div class="section">
                <h3><span class="icon icon-methodology">🔬</span> تفاصيل المنهجية</h3>
                ${inquiryData.expectedDuration ? `<div class="field"><span class="label">المدة المتوقعة:</span> <span class="value">${getFieldLabel('expectedDuration', inquiryData.expectedDuration)}</span></div>` : ''}
                ${inquiryData.budgetRange ? `<div class="field"><span class="label">الميزانية المتوقعة:</span> <span class="value">${getFieldLabel('budgetRange', inquiryData.budgetRange)}</span></div>` : ''}
                ${inquiryData.targetPopulation ? `<div class="field"><span class="label">العينة المستهدفة:</span> <span class="value">${inquiryData.targetPopulation}</span></div>` : ''}
                ${inquiryData.dataCollectionMethods ? `<div class="field"><span class="label">طرق جمع البيانات:</span> <span class="value">${inquiryData.dataCollectionMethods}</span></div>` : ''}
                ${inquiryData.analysisApproach ? `<div class="field"><span class="label">منهج التحليل:</span> <span class="value">${inquiryData.analysisApproach}</span></div>` : ''}
                ${inquiryData.ethicalConsiderations ? `<div class="field"><span class="label">الاعتبارات الأخلاقية:</span> <span class="value">${inquiryData.ethicalConsiderations}</span></div>` : ''}
              </div>

              ${inquiryData.additionalNotes ? `
              <div class="section">
                <h3><span class="icon icon-notes">📝</span> ملاحظات إضافية</h3>
                <div class="field"><span class="value">${inquiryData.additionalNotes}</span></div>
              </div>
              ` : ''}

              <div class="section">
                <h3><span class="icon icon-time">🕒</span> معلومات الطلب</h3>
                <div class="field"><span class="label">تاريخ الطلب:</span> <span class="value">${currentDate}</span></div>
                <div class="field"><span class="label">نوع الخدمة:</span> <span class="value">تصميم منهجية علمية</span></div>
              </div>

              <div class="contact-info">
                <h3>📞 معلومات التواصل العاجل</h3>
                <p><strong>البريد الإلكتروني:</strong> info@masteredupath.com</p>
                <p><strong>الهاتف:</strong> 0500776343</p>
                <p><strong>واتساب:</strong> 0500776343</p>
                <p><strong>أوقات العمل:</strong> الأحد - الخميس، 10:00 ص - 7:00 م</p>
              </div>
            </div>
            
            <div class="footer">
              <div class="company-logo">Master Edu Path</div>
              <p><strong>شكراً لاختيارك خدماتنا المتخصصة</strong></p>
              <p>نحن ملتزمون بتقديم أفضل الخدمات الأكاديمية والبحثية</p>
              <p style="font-size: 14px; opacity: 0.8; margin-top: 15px;">
                هذا إشعار تلقائي من نظام إدارة طلبات المنهجية العلمية
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "فريق المنهجية العلمية <noreply@masteredupath.com>",
      to: [inquiryData.email],
      subject: `تأكيد استلام طلب المنهجية العلمية - ${inquiryData.researchTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #2d3748; 
              direction: rtl; 
              background-color: #f7fafc;
            }
            .container { 
              max-width: 600px; 
              margin: 20px auto; 
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white; 
              padding: 40px 30px; 
              text-align: center;
              position: relative;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            }
            .header h1 {
              font-size: 26px;
              font-weight: 700;
              margin-bottom: 10px;
              position: relative;
              z-index: 1;
            }
            .header p {
              font-size: 16px;
              opacity: 0.9;
              position: relative;
              z-index: 1;
            }
            .content { 
              padding: 40px 30px; 
              background: #ffffff;
            }
            .highlight { 
              background: linear-gradient(135deg, #e6fffa, #b2f5ea);
              border: none;
              border-radius: 12px;
              padding: 25px; 
              text-align: center; 
              margin: 25px 0;
              color: #234e52;
            }
            .highlight h2 {
              color: #285e61;
              margin-bottom: 10px;
              font-size: 22px;
            }
            .section { 
              background: #f8fafc; 
              margin: 25px 0; 
              padding: 25px; 
              border-radius: 12px; 
              border-right: 4px solid #667eea;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .section h3 {
              color: #4c51bf;
              margin-bottom: 18px;
              font-size: 20px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 0;
              border-bottom: 2px solid #e2e8f0;
            }
            .icon {
              width: 28px;
              height: 28px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
              font-size: 16px;
            }
            .icon-summary { background: linear-gradient(135deg, #38a169, #2f855a); }
            .icon-timeline { background: linear-gradient(135deg, #805ad5, #6b46c1); }
            .icon-benefits { background: linear-gradient(135deg, #d69e2e, #b7791f); }
            .section ul, .section ol {
              text-align: right;
              padding-right: 20px;
            }
            .section li {
              margin: 8px 0;
              color: #4a5568;
            }
            .section li strong {
              color: #2d3748;
            }
            .contact-info { 
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white; 
              padding: 25px; 
              border-radius: 12px; 
              margin: 25px 0;
              text-align: center;
            }
            .contact-info h3 {
              margin-bottom: 15px;
              font-size: 20px;
              color: white;
            }
            .contact-info p {
              margin: 8px 0;
              font-size: 16px;
            }
            .footer { 
              background: #2d3748; 
              color: white; 
              padding: 30px; 
              text-align: center;
            }
            .footer p {
              margin: 8px 0;
            }
            .company-logo {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .timeline-item {
              background: white;
              margin: 10px 0;
              padding: 15px;
              border-radius: 8px;
              border-right: 3px solid #667eea;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="company-logo">🎓 Master Edu Path</div>
              <h1>🔬 تم استلام طلبك بنجاح!</h1>
              <p>شكراً لاختيارك خدمة المنهجية العلمية المتخصصة</p>
            </div>
            
            <div class="content">
              <div class="highlight">
                <h2>🎯 أهلاً بك ${inquiryData.fullName}</h2>
                <p>تم استلام طلبك لتصميم منهجية علمية لبحث: <strong>"${inquiryData.researchTitle}"</strong></p>
              </div>

              <div class="section">
                <h3><span class="icon icon-summary">📋</span> ملخص طلبك:</h3>
                <ul style="text-align: right;">
                  <li><strong>مجال البحث:</strong> ${getFieldLabel('researchField', inquiryData.researchField)}</li>
                  <li><strong>نوع المنهجية:</strong> ${getFieldLabel('methodologyType', inquiryData.methodologyType)}</li>
                  <li><strong>المؤسسة:</strong> ${inquiryData.organization}</li>
                  ${inquiryData.expectedDuration ? `<li><strong>المدة المتوقعة:</strong> ${getFieldLabel('expectedDuration', inquiryData.expectedDuration)}</li>` : ''}
                </ul>
              </div>

              <div class="section">
                <h3><span class="icon icon-timeline">⏰</span> الخطوات التالية:</h3>
                <div class="timeline-item">
                  <strong>1. المراجعة الأولية:</strong> سيقوم فريق الخبراء بمراجعة طلبك خلال ساعة واحدة
                </div>
                <div class="timeline-item">
                  <strong>2. التواصل المبدئي:</strong> سنتصل بك خلال 4 ساعات لمناقشة التفاصيل
                </div>
                <div class="timeline-item">
                  <strong>3. الاستشارة المتخصصة:</strong> سنحدد موعداً لاستشارة مفصلة مع خبير المنهجية
                </div>
                <div class="timeline-item">
                  <strong>4. التصميم المخصص:</strong> سنبدأ في تصميم المنهجية وفقاً لاحتياجاتك
                </div>
              </div>

              <div class="section">
                <h3><span class="icon icon-benefits">🎓</span> ما يمكنك توقعه:</h3>
                <ul style="text-align: right;">
                  <li>منهجية علمية شاملة ومتطورة</li>
                  <li>تصميم مخصص لمجال بحثك</li>
                  <li>إرشادات واضحة لتطبيق المنهجية</li>
                  <li>دعم مستمر من فريق الخبراء</li>
                  <li>ضمان الجودة والموثوقية العلمية</li>
                  <li>مراجعات مجانية حتى الوصول للنتيجة المطلوبة</li>
                </ul>
              </div>

              <div class="contact-info">
                <h3>📞 معلومات التواصل:</h3>
                <p><strong>البريد الإلكتروني:</strong> info@masteredupath.com</p>
                <p><strong>الهاتف:</strong> 0500776343</p>
                <p><strong>واتساب:</strong> 0500776343</p>
                <p><strong>أوقات العمل:</strong> الأحد - الخميس، 10:00 ص - 7:00 م</p>
              </div>
            </div>
            
            <div class="footer">
              <div class="company-logo">Master Edu Path</div>
              <p><strong>شكراً لثقتك في خدماتنا المتخصصة</strong></p>
              <p>نتطلع للعمل معك في تطوير بحثك العلمي وضمان نجاحه</p>
              <p style="font-size: 14px; margin-top: 15px; opacity: 0.8;">
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