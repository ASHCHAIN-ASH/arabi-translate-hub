import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdmissionInquiryRequest {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  currentEducation: string;
  desiredField: string;
  desiredUniversity: string;
  gpa?: string;
  englishLevel: string;
  additionalInfo?: string;
  hasScholarship: boolean;
}

// HTML Email Template for Client (RTL Arabic)
const createClientEmailHtml = (
  studentName: string,
  applicationNumber: string,
  desiredField: string,
  desiredUniversity: string
) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تأكيد استلام طلب القبول الجامعي</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background-color: #f6f9fc; 
      direction: rtl; 
      text-align: right; 
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: white; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
    }
    .header { 
      background: linear-gradient(135deg, #1e40af, #3b82f6); 
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .logo { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
    .subtitle { font-size: 16px; opacity: 0.9; }
    .success-banner { 
      background: #f0fff4; 
      border: 2px solid #10b981; 
      margin: 24px 20px; 
      padding: 20px; 
      border-radius: 8px; 
      text-align: center; 
    }
    .success-icon { font-size: 48px; margin-bottom: 16px; }
    .success-title { color: #065f46; font-size: 24px; font-weight: bold; }
    .content { padding: 20px; }
    .greeting { font-size: 18px; color: #374151; margin-bottom: 20px; }
    .paragraph { font-size: 16px; color: #6b7280; line-height: 1.6; margin-bottom: 20px; }
    .details-box { 
      background: #f8fafc; 
      border: 1px solid #e2e8f0; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 20px 0; 
    }
    .details-title { color: #1e40af; font-size: 18px; font-weight: bold; margin-bottom: 16px; }
    .detail-row { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 12px; 
      padding-bottom: 8px; 
      border-bottom: 1px solid #f1f5f9; 
    }
    .detail-label { color: #6b7280; font-weight: 600; }
    .detail-value { color: #1f2937; font-weight: bold; }
    .steps-section { margin: 24px 0; }
    .steps-title { color: #1e40af; font-size: 18px; font-weight: bold; margin-bottom: 16px; }
    .step-item { 
      color: #6b7280; 
      font-size: 14px; 
      margin-bottom: 12px; 
      padding-right: 20px; 
      position: relative; 
    }
    .step-item::before { 
      content: '✓'; 
      position: absolute; 
      right: 0; 
      color: #10b981; 
      font-weight: bold; 
    }
    .contact-section { 
      background: #f0f9ff; 
      border: 1px solid #bae6fd; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 24px 0; 
    }
    .contact-title { color: #1e40af; font-size: 18px; font-weight: bold; margin-bottom: 16px; }
    .contact-item { color: #374151; font-size: 14px; margin-bottom: 8px; }
    .button-section { text-align: center; margin: 24px 0; }
    .action-button { 
      background: linear-gradient(135deg, #1e40af, #3b82f6); 
      color: white; 
      padding: 12px 30px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: bold; 
      display: inline-block; 
    }
    .footer-message { 
      background: #f8fafc; 
      border: 1px solid #e2e8f0; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 24px 0; 
      text-align: center; 
      color: #6b7280; 
      font-size: 14px; 
      line-height: 1.6; 
    }
    .footer { 
      background: #f8fafc; 
      padding: 20px; 
      text-align: center; 
      border-top: 1px solid #e2e8f0; 
    }
    .footer-text { color: #374151; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    .footer-subtext { color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">وكالة MasterEduPath</div>
      <div class="subtitle">للحلول التعليمية المتقدمة</div>
    </div>
    
    <div class="success-banner">
      <div class="success-icon">✅</div>
      <div class="success-title">تم استلام طلبك بنجاح!</div>
    </div>
    
    <div class="content">
      <div class="greeting">
        عزيزي/عزيزتي <strong>${studentName}</strong>،
      </div>
      
      <div class="paragraph">
        نشكركم لاختياركم وكالة MasterEduPath للحلول التعليمية المتقدمة. 
        لقد تم استلام طلب القبول الجامعي الخاص بكم بنجاح، وسيقوم فريقنا المتخصص 
        بمراجعة طلبكم والتواصل معكم خلال 24 ساعة القادمة.
      </div>
      
      <div class="details-box">
        <div class="details-title">تفاصيل طلب القبول</div>
        
        <div class="detail-row">
          <span class="detail-label">رقم الطلب:</span>
          <span class="detail-value">${applicationNumber}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">التخصص المطلوب:</span>
          <span class="detail-value">${desiredField}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">الجامعة المرغوبة:</span>
          <span class="detail-value">${desiredUniversity}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">تاريخ الطلب:</span>
          <span class="detail-value">${new Date().toLocaleDateString('ar-SA')}</span>
        </div>
      </div>
      
      <div class="steps-section">
        <div class="steps-title">الخطوات التالية</div>
        <div class="step-item">المراجعة الأولية: سيقوم فريقنا بمراجعة بياناتكم والتأكد من اكتمالها</div>
        <div class="step-item">التواصل المباشر: سنتصل بكم خلال 24 ساعة لمناقشة التفاصيل</div>
        <div class="step-item">خطة القبول: سنضع خطة شخصية مناسبة لأهدافكم التعليمية</div>
        <div class="step-item">متابعة الطلب: سنتابع معكم جميع مراحل القبول حتى النجاح</div>
      </div>
      
      <div class="contact-section">
        <div class="contact-title">معلومات التواصل</div>
        <div class="contact-item">📞 الهاتف: 0559600824</div>
        <div class="contact-item">📧 البريد الإلكتروني: info@masteredupath.com</div>
        <div class="contact-item">📍 العنوان: المملكة العربية السعودية</div>
        <div class="contact-item">🕐 ساعات العمل: الأحد - الخميس | 10:00 ص - 7:00 م</div>
      </div>
      
      <div class="button-section">
        <a href="https://masteredupath.com/admission-services" class="action-button">
          تتبع طلب القبول
        </a>
      </div>
      
      <div class="footer-message">
        نحن فخورون بثقتكم في خدماتنا ومتحمسون لمساعدتكم في تحقيق أهدافكم التعليمية. 
        فريق خبراء متخصص في خدمتكم لضمان حصولكم على أفضل الفرص الجامعية.
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">وكالة MasterEduPath للحلول التعليمية المتقدمة</div>
      <div class="footer-subtext">© 2024 وكالة ماستر إيدو باث. جميع الحقوق محفوظة.</div>
    </div>
  </div>
</body>
</html>
`;

// HTML Email Template for Admin (RTL Arabic)
const createAdminEmailHtml = (
  inquiryData: AdmissionInquiryRequest,
  applicationNumber: string
) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طلب قبول جامعي جديد</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      background-color: #f1f5f9; 
      direction: rtl; 
      text-align: right; 
    }
    .container { 
      max-width: 700px; 
      margin: 20px auto; 
      background: white; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
    }
    .header { 
      background: linear-gradient(135deg, #dc2626, #ef4444); 
      color: white; 
      padding: 24px 20px; 
      text-align: center; 
    }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
    .subtitle { font-size: 14px; opacity: 0.9; }
    .alert-banner { 
      background: #fef2f2; 
      border: 2px solid #f87171; 
      margin: 20px; 
      padding: 20px; 
      border-radius: 8px; 
      text-align: center; 
    }
    .alert-icon { font-size: 32px; margin-bottom: 12px; }
    .alert-title { color: #dc2626; font-size: 20px; font-weight: bold; margin-bottom: 8px; }
    .alert-subtitle { color: #991b1b; font-size: 14px; font-weight: 600; }
    .content { padding: 16px; }
    .intro-text { 
      color: #374151; 
      font-size: 16px; 
      line-height: 1.5; 
      margin-bottom: 20px; 
      background: #f8fafc; 
      padding: 16px; 
      border-radius: 6px; 
      border: 1px solid #e2e8f0; 
    }
    .info-box { 
      border: 1px solid #e2e8f0; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 20px 0; 
    }
    .summary-box { background: #dbeafe; border-color: #93c5fd; }
    .student-box { background: #f0fdf4; border-color: #bbf7d0; }
    .academic-box { background: #f5f3ff; border-color: #c4b5fd; }
    .action-box { background: #fef2f2; border-color: #f87171; }
    .system-box { background: #f8fafc; border-color: #cbd5e1; }
    
    .section-title { 
      color: #374151; 
      font-size: 16px; 
      font-weight: bold; 
      margin-bottom: 16px; 
    }
    .summary-title { color: #1e40af; }
    .action-title { color: #dc2626; }
    .system-title { color: #475569; font-size: 14px; }
    
    .info-row { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 12px; 
      padding-bottom: 8px; 
      border-bottom: 1px solid #f1f5f9; 
    }
    .info-label { color: #6b7280; font-size: 13px; font-weight: 600; width: 35%; }
    .info-value { color: #1f2937; font-size: 14px; font-weight: 500; width: 65%; }
    .priority-high { color: #dc2626; font-weight: bold; background: #fef2f2; padding: 4px 8px; border-radius: 4px; }
    .email-value { color: #2563eb; text-decoration: underline; }
    .phone-value { color: #059669; direction: rtl; }
    .field-value { color: #7c3aed; font-weight: 600; }
    .university-value { color: #dc2626; font-weight: 600; }
    
    .action-item { 
      color: #374151; 
      font-size: 14px; 
      line-height: 1.6; 
      margin-bottom: 12px; 
    }
    .system-info { 
      color: #64748b; 
      font-size: 12px; 
      line-height: 1.5; 
      margin-bottom: 8px; 
    }
    .buttons-section { text-align: center; margin: 24px 0; }
    .email-button, .call-button { 
      display: inline-block; 
      padding: 10px 20px; 
      margin: 0 8px; 
      text-decoration: none; 
      color: white; 
      border-radius: 6px; 
      font-size: 14px; 
      font-weight: 600; 
    }
    .email-button { background: #2563eb; }
    .call-button { background: #059669; }
    
    .footer { 
      background: #f8fafc; 
      padding: 20px; 
      text-align: center; 
      border-top: 1px solid #e2e8f0; 
    }
    .footer-text { color: #374151; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    .footer-subtext { color: #6b7280; font-size: 12px; margin-bottom: 8px; }
    .footer-contact { color: #9ca3af; font-size: 11px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">نظام إدارة القبول الجامعي</div>
      <div class="subtitle">وكالة MasterEduPath للحلول التعليمية</div>
    </div>
    
    <div class="alert-banner">
      <div class="alert-icon">🚨</div>
      <div class="alert-title">طلب قبول جامعي جديد!</div>
      <div class="alert-subtitle">يتطلب المراجعة والمتابعة الفورية</div>
    </div>
    
    <div class="content">
      <div class="intro-text">
        تم استلام طلب قبول جامعي جديد في النظام. يرجى مراجعة التفاصيل أدناه واتخاذ الإجراءات اللازمة.
      </div>
      
      <div class="info-box summary-box">
        <div class="section-title summary-title">ملخص الطلب</div>
        
        <div class="info-row">
          <span class="info-label">رقم الطلب:</span>
          <span class="info-value">${applicationNumber}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">تاريخ الطلب:</span>
          <span class="info-value">${new Date().toLocaleString('ar-SA')}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">الأولوية:</span>
          <span class="priority-high">عالية - يتطلب متابعة خلال 24 ساعة</span>
        </div>
      </div>
      
      <div class="info-box student-box">
        <div class="section-title">معلومات الطالب</div>
        
        <div class="info-row">
          <span class="info-label">الاسم الكامل:</span>
          <span class="info-value">${inquiryData.fullName}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">البريد الإلكتروني:</span>
          <span class="info-value email-value">${inquiryData.email}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">رقم الهاتف:</span>
          <span class="info-value phone-value">${inquiryData.phone}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">الجنسية:</span>
          <span class="info-value">${inquiryData.nationality}</span>
        </div>
      </div>
      
      <div class="info-box academic-box">
        <div class="section-title">المعلومات الأكاديمية</div>
        
        <div class="info-row">
          <span class="info-label">المستوى التعليمي الحالي:</span>
          <span class="info-value">${inquiryData.currentEducation}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">التخصص المرغوب:</span>
          <span class="info-value field-value">${inquiryData.desiredField}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">الجامعة المرغوبة:</span>
          <span class="info-value university-value">${inquiryData.desiredUniversity}</span>
        </div>
        
        ${inquiryData.gpa ? `
        <div class="info-row">
          <span class="info-label">المعدل التراكمي:</span>
          <span class="info-value">${inquiryData.gpa}</span>
        </div>
        ` : ''}
        
        <div class="info-row">
          <span class="info-label">مستوى اللغة الإنجليزية:</span>
          <span class="info-value">${inquiryData.englishLevel}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">يرغب في منحة دراسية:</span>
          <span class="info-value">${inquiryData.hasScholarship ? '✅ نعم' : '❌ لا'}</span>
        </div>
      </div>
      
      ${inquiryData.additionalInfo ? `
      <div class="info-box">
        <div class="section-title">معلومات إضافية</div>
        <div style="color: #374151; font-size: 14px; line-height: 1.6; background: white; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb;">
          ${inquiryData.additionalInfo}
        </div>
      </div>
      ` : ''}
      
      <div class="info-box action-box">
        <div class="section-title action-title">الإجراءات المطلوبة</div>
        
        <div class="action-item">
          <strong>1. المراجعة الفورية:</strong> مراجعة جميع البيانات والتأكد من اكتمالها
        </div>
        <div class="action-item">
          <strong>2. التواصل مع الطالب:</strong> الاتصال خلال 24 ساعة لمناقشة التفاصيل
        </div>
        <div class="action-item">
          <strong>3. تقييم الملف:</strong> تقييم إمكانية القبول وفقاً للمعايير المحددة
        </div>
        <div class="action-item">
          <strong>4. إعداد الخطة:</strong> وضع خطة شخصية للقبول والمتطلبات
        </div>
        <div class="action-item">
          <strong>5. إرسال العرض:</strong> إعداد وإرسال العرض المناسب للطالب
        </div>
      </div>
      
      <div class="buttons-section">
        <a href="mailto:${inquiryData.email}?subject=بخصوص طلب القبول الجامعي - ${applicationNumber}" class="email-button">
          📧 إرسال بريد إلكتروني
        </a>
        <a href="tel:${inquiryData.phone}" class="call-button">
          📞 اتصال مباشر
        </a>
      </div>
      
      <div class="info-box system-box">
        <div class="section-title system-title">معلومات النظام</div>
        <div class="system-info">
          <strong>وقت الاستلام:</strong> ${new Date().toLocaleString('ar-SA')}
        </div>
        <div class="system-info">
          <strong>مصدر الطلب:</strong> موقع وكالة MasterEduPath - صفحة خدمات القبول
        </div>
        <div class="system-info">
          <strong>حالة الطلب:</strong> جديد - في انتظار المراجعة
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">نظام إدارة القبول الجامعي - وكالة MasterEduPath</div>
      <div class="footer-subtext">هذا البريد تم إرساله تلقائياً من نظام إدارة طلبات القبول</div>
      <div class="footer-contact">للدعم التقني: info@masteredupath.com | 0559600824</div>
    </div>
  </div>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  console.log("Admission inquiry request received");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const body: any = await req.json();
    const inquiryData: AdmissionInquiryRequest =body;
    // 🆕 حفظ في صندوق الوارد الموحّد للوحة الإدارة
    try {
      const data: any = body;
      await supabaseAdmin.from("inbox_messages").insert({
        sender_name: (data.fullName || "زائر").toString().slice(0, 200),
        sender_email: (data.email || "unknown@masteredupath.com").toString().slice(0, 200),
        sender_phone: (data.phone || null) ? data.phone.toString().slice(0, 50) : null,
        subject: (`استفسار قبول جامعي - ${data.desiredField || ''}`).toString().slice(0, 300),
        message: (data.additionalInfo || `قبول في ${data.desiredUniversity || 'جامعة غير محددة'} - تخصص ${data.desiredField || 'غير محدد'}` || "").toString().slice(0, 8000),
        form_type: "admission_inquiry",
        service_type: 'admission',
        source_page: typeof data.sourcePage === "string" ? data.sourcePage : null,
        priority: "high",
        status: "new",
        metadata: { nationality: data.nationality, current_education: data.currentEducation, desired_field: data.desiredField, desired_university: data.desiredUniversity, gpa: data.gpa, english_level: data.englishLevel, has_scholarship: data.hasScholarship },
      });
    } catch (inboxErr) {
      console.error("[inbox] failed to save:", inboxErr);
    }

    console.log("Admission inquiry data:", inquiryData);

    // Validate required fields
    if (!inquiryData.fullName || !inquiryData.email || !inquiryData.phone) {
      return new Response(
        JSON.stringify({ error: "البيانات الأساسية مطلوبة" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Generate application number
    const applicationNumber = `ADM${Date.now().toString().slice(-8)}`;

    // Create HTML email templates
    const clientEmailHtml = createClientEmailHtml(
      inquiryData.fullName,
      applicationNumber,
      inquiryData.desiredField,
      inquiryData.desiredUniversity
    );

    const adminEmailHtml = createAdminEmailHtml(
      inquiryData,
      applicationNumber
    );

    // Send email to client
    const clientEmailResult = await resend.emails.send({
      from: "مسار الخبراء للتعليم <info@masteredupath.com>",
      to: [inquiryData.email],
      subject: `✅ تأكيد استلام طلب القبول الجامعي - رقم الطلب: ${applicationNumber}`,
      html: clientEmailHtml,
    });

    console.log("Client email result:", clientEmailResult);

    // Send email to admin
    const adminEmailResult = await resend.emails.send({
      from: "إشعار طلب قبول جديد <info@masteredupath.com>",
      to: ["info@masteredupath.com"],
      subject: `🚨 طلب قبول جامعي جديد من ${inquiryData.fullName} - ${applicationNumber}`,
      html: adminEmailHtml,
    });

    console.log("Admin email result:", adminEmailResult);

    if (clientEmailResult.error || adminEmailResult.error) {
      console.error("Email sending error:", clientEmailResult.error || adminEmailResult.error);
      throw new Error("خطأ في إرسال البريد الإلكتروني");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح وسيتم التواصل معك قريباً",
        applicationNumber: applicationNumber
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-admission-inquiry function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "حدث خطأ أثناء معالجة الطلب" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);