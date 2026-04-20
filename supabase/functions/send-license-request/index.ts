import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { EmailTemplates, formatArabicDate, generateRequestNumber } from "../_shared/email-templates.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LicenseRequestData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  licenseType: string;
  usagePurpose: string;
  contentType: string;
  duration: string;
  additionalInfo?: string;
  agreeToTerms: boolean;
}

// Map license types to Arabic
const licenseTypeMap: Record<string, string> = {
  "educational": "تعليمي",
  "commercial": "تجاري", 
  "research": "بحثي",
  "non-profit": "غير ربحي",
  "government": "حكومي",
  "personal": "شخصي"
};

const contentTypeMap: Record<string, string> = {
  "texts": "النصوص والمحتوى",
  "designs": "التصاميم البصرية", 
  "software": "الأنظمة والبرمجيات",
  "educational-materials": "المحتوى التعليمي",
  "trademarks": "العلامات التجارية",
  "mixed-content": "محتوى مختلط"
};

const durationMap: Record<string, string> = {
  "3-months": "3 أشهر",
  "6-months": "6 أشهر",
  "1-year": "سنة واحدة", 
  "2-years": "سنتان",
  "permanent": "دائم"
};

// Professional email template for client confirmation - Enhanced RTL
const getClientEmailTemplate = (data: LicenseRequestData, requestNumber: string) => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد طلب ترخيص الاستخدام</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.8;
            color: #1a202c;
            background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%);
            direction: rtl;
            text-align: right;
            padding: 20px;
        }
        
        .email-container {
            max-width: 700px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #db2777 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1.5" fill="white" opacity="0.08"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            animation: float 20s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateX(0px) rotate(0deg); }
            50% { transform: translateX(-10px) rotate(1deg); }
        }
        
        .logo-container {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            width: 120px;
            height: 120px;
            border-radius: 50%;
            margin: 0 auto 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
        }
        
        .logo-icon {
            font-size: 48px;
        }
        
        .company-name {
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            position: relative;
            z-index: 2;
        }
        
        .company-tagline {
            font-size: 18px;
            opacity: 0.95;
            font-weight: 300;
            position: relative;
            z-index: 2;
        }
        
        .content {
            padding: 50px 40px;
        }
        
        .greeting {
            font-size: 24px;
            color: #1e40af;
            margin-bottom: 25px;
            font-weight: 600;
            text-align: center;
            background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%);
            padding: 20px;
            border-radius: 15px;
            border: 2px solid #e0e7ff;
        }
        
        .intro-text {
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 35px;
            line-height: 1.9;
            text-align: center;
        }
        
        .request-number {
            background: linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);
            color: white;
            padding: 25px 30px;
            border-radius: 15px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
        }
        
        .request-number-label {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        
        .request-number-value {
            font-size: 32px;
            font-weight: 800;
            font-family: 'IBM Plex Sans Arabic', monospace;
            letter-spacing: 3px;
        }
        
        .details-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 18px;
            padding: 35px;
            margin: 30px 0;
            border-right: 6px solid #1e40af;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .details-header {
            color: #1e40af;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            margin-bottom: 15px;
            background: white;
            border-radius: 12px;
            border-right: 4px solid #7c3aed;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: transform 0.2s ease;
        }
        
        .detail-row:hover {
            transform: translateX(-5px);
        }
        
        .detail-label {
            font-weight: 600;
            color: #1e40af;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .detail-value {
            color: #1a202c;
            font-weight: 500;
            font-size: 16px;
        }
        
        .next-steps {
            background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
            border-radius: 18px;
            padding: 35px;
            margin: 30px 0;
            border-right: 6px solid #22c55e;
        }
        
        .next-steps-header {
            color: #16a34a;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .step-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            margin-bottom: 20px;
            font-size: 16px;
            color: #374151;
            background: white;
            padding: 15px;
            border-radius: 10px;
            border-right: 3px solid #22c55e;
        }
        
        .step-icon {
            background: #22c55e;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .timeline-notice {
            font-size: 20px;
            color: #7c3aed;
            text-align: center;
            margin: 35px 0;
            padding: 25px;
            background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
            border-radius: 15px;
            border: 2px solid #e9d5ff;
            font-weight: 600;
        }
        
        .contact-section {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            border-radius: 18px;
            padding: 40px;
            margin: 30px 0;
            text-align: center;
        }
        
        .contact-header {
            color: #fbbf24;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 25px;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        
        .contact-item {
            text-align: center;
            padding: 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
            transition: background 0.3s ease;
        }
        
        .contact-item:hover {
            background: rgba(255,255,255,0.15);
        }
        
        .contact-item .icon {
            font-size: 32px;
            color: #fbbf24;
            margin-bottom: 10px;
            display: block;
        }
        
        .contact-item .text {
            font-size: 16px;
            font-weight: 500;
        }
        
        .footer {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .footer-copyright {
            font-size: 14px;
            opacity: 0.8;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 20px;
            margin-top: 20px;
        }
        
        @media (max-width: 600px) {
            body { padding: 10px; }
            .email-container { border-radius: 15px; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 25px; }
            .details-card, .next-steps, .contact-section { padding: 25px 20px; }
            .detail-row { flex-direction: column; gap: 10px; text-align: right; }
            .contact-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-container">
                <div class="logo-icon">⚖️</div>
            </div>
            <h1 class="company-name">وكالة ماستر إيدو باث</h1>
            <p class="company-tagline">للحلول التعليمية والملكية الفكرية المتقدمة</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                السلام عليكم ${data.contactPerson} الكريم 🌟
            </div>
            
            <p class="intro-text">
                شكراً لكم على ثقتكم في خدماتنا المتخصصة. تم استلام طلب ترخيص الاستخدام بنجاح 
                وسنقوم بمراجعته وفقاً لأعلى معايير الجودة والأمان القانوني.
            </p>
            
            <!-- Request Number -->
            <div class="request-number">
                <div class="request-number-label">🎯 رقم الطلب الخاص بكم</div>
                <div class="request-number-value">${requestNumber}</div>
            </div>
            
            <!-- Details Card -->
            <div class="details-card">
                <h3 class="details-header">
                    📋 تفاصيل طلب الترخيص المُقدم
                </h3>
                
                <div class="detail-row">
                    <span class="detail-label">🏢 الشركة/المؤسسة</span>
                    <span class="detail-value">${data.companyName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">👨‍💼 الشخص المسؤول</span>
                    <span class="detail-value">${data.contactPerson}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📧 البريد الإلكتروني</span>
                    <span class="detail-value">${data.email}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📱 رقم الهاتف</span>
                    <span class="detail-value">${data.phone}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">⚖️ نوع الترخيص المطلوب</span>
                    <span class="detail-value">${licenseTypeMap[data.licenseType] || data.licenseType}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📄 نوع المحتوى</span>
                    <span class="detail-value">${contentTypeMap[data.contentType] || data.contentType}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📅 مدة الترخيص</span>
                    <span class="detail-value">${durationMap[data.duration] || data.duration}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">📅 تاريخ تقديم الطلب</span>
                    <span class="detail-value">${new Date().toLocaleDateString('ar-SA', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                </div>
            </div>
            
            <!-- Next Steps -->
            <div class="next-steps">
                <h3 class="next-steps-header">
                    ⏰ مراحل معالجة طلبكم
                </h3>
                
                <div class="step-item">
                    <div class="step-icon">1</div>
                    <div><strong>المرحلة الأولى:</strong> مراجعة شاملة للطلب من قبل فريق الشؤون القانونية (24-48 ساعة)</div>
                </div>
                
                <div class="step-item">
                    <div class="step-icon">2</div>
                    <div><strong>المرحلة الثانية:</strong> إجراء تقييم قانوني وتقني لنوع الاستخدام المطلوب</div>
                </div>
                
                <div class="step-item">
                    <div class="step-icon">3</div>
                    <div><strong>المرحلة الثالثة:</strong> التواصل معكم لاستكمال المتطلبات الإضافية إن وجدت</div>
                </div>
                
                <div class="step-item">
                    <div class="step-icon">4</div>
                    <div><strong>المرحلة الأخيرة:</strong> إصدار الترخيص النهائي وإرساله إليكم رسمياً</div>
                </div>
            </div>
            
            <div class="timeline-notice">
                ⚡ سيتم التواصل معكم خلال <strong>48 ساعة عمل</strong> لمتابعة طلبكم
            </div>
        </div>
        
        <!-- Contact Section -->
        <div class="contact-section">
            <h3 class="contact-header">📞 قنوات التواصل والاستفسارات</h3>
            
            <div class="contact-grid">
                <div class="contact-item">
                    <span class="icon">📧</span>
                    <div class="text">legal@masteredupath.com</div>
                </div>
                <div class="contact-item">
                    <span class="icon">📱</span>
                    <div class="text">0559600824</div>
                </div>
                <div class="contact-item">
                    <span class="icon">🌐</span>
                    <div class="text">www.masteredupath.com</div>
                </div>
                <div class="contact-item">
                    <span class="icon">📍</span>
                    <div class="text">جدة، المملكة العربية السعودية</div>
                </div>
            </div>
            
            <div class="footer-copyright">
                هذا الإيميل تم إرساله تلقائياً من نظام إدارة التراخيص.<br>
                للاستفسارات والمتابعة، يرجى التواصل عبر القنوات الرسمية المذكورة أعلاه.<br><br>
                © 2024 وكالة ماستر إيدو باث للحلول التعليمية المتقدمة<br>
                جميع الحقوق محفوظة | المملكة العربية السعودية
            </div>
        </div>
    </div>
</body>
</html>
`;
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: any = await req.json();
    const requestData: LicenseRequestData =body;
    // 🆕 حفظ في صندوق الوارد الموحّد للوحة الإدارة
    try {
      const data: any = body;
      await supabaseAdmin.from("inbox_messages").insert({
        sender_name: (data.contactPerson || "زائر").toString().slice(0, 200),
        sender_email: (data.email || "unknown@masteredupath.com").toString().slice(0, 200),
        sender_phone: (data.phone || null) ? data.phone.toString().slice(0, 50) : null,
        subject: (`طلب ترخيص - ${data.licenseType || ''} - ${data.companyName || ''}`).toString().slice(0, 300),
        message: (data.additionalInfo || `طلب ترخيص ${data.licenseType} لـ ${data.usagePurpose}` || "").toString().slice(0, 8000),
        form_type: "license_request",
        service_type: 'license',
        source_page: typeof data.sourcePage === "string" ? data.sourcePage : null,
        priority: "high",
        status: "new",
        metadata: { company_name: data.companyName, license_type: data.licenseType, usage_purpose: data.usagePurpose, content_type: data.contentType, duration: data.duration },
      });
    } catch (inboxErr) {
      console.error("[inbox] failed to save:", inboxErr);
    }

    
    console.log("License request received:", {
      companyName: requestData.companyName,
      email: requestData.email,
      licenseType: requestData.licenseType,
      timestamp: new Date().toISOString()
    });
    
    // Validate required fields
    if (!requestData.companyName || !requestData.email || !requestData.contactPerson) {
      throw new Error("البيانات المطلوبة ناقصة");
    }

    if (!requestData.agreeToTerms) {
      throw new Error("يجب الموافقة على الشروط والأحكام");
    }
    
    // Generate unique license request number
    const requestNumber = generateRequestNumber('LIC');
    
    // Create client email using new template system
    const clientEmail = EmailTemplates.client({
      recipientName: requestData.contactPerson,
      companyName: requestData.companyName,
      email: requestData.email,
      phone: requestData.phone,
      requestNumber,
      date: formatArabicDate(),
      title: "تأكيد استلام طلب ترخيص الاستخدام",
      message: "شكراً لكم على ثقتكم في خدماتنا المتخصصة. تم استلام طلب ترخيص الاستخدام بنجاح وسنقوم بمراجعته وفقاً لأعلى معايير الجودة والأمان القانوني.",
      highlightInfo: {
        label: "🎯 رقم الطلب الخاص بكم",
        value: requestNumber
      },
      details: [
        { label: "الشركة/المؤسسة", value: requestData.companyName, icon: "🏢" },
        { label: "الشخص المسؤول", value: requestData.contactPerson, icon: "👨‍💼" },
        { label: "البريد الإلكتروني", value: requestData.email, icon: "📧" },
        { label: "رقم الهاتف", value: requestData.phone, icon: "📱" },
        { label: "نوع الترخيص المطلوب", value: licenseTypeMap[requestData.licenseType] || requestData.licenseType, icon: "⚖️" },
        { label: "نوع المحتوى", value: contentTypeMap[requestData.contentType] || requestData.contentType, icon: "📄" },
        { label: "مدة الترخيص", value: durationMap[requestData.duration] || requestData.duration, icon: "📅" },
        { label: "تاريخ تقديم الطلب", value: formatArabicDate(), icon: "📅" }
      ],
      steps: [
        { title: "المرحلة الأولى", description: "مراجعة شاملة للطلب من قبل فريق الشؤون القانونية (24-48 ساعة)" },
        { title: "المرحلة الثانية", description: "إجراء تقييم قانوني وتقني لنوع الاستخدام المطلوب" },
        { title: "المرحلة الثالثة", description: "التواصل معكم لاستكمال المتطلبات الإضافية إن وجدت" },
        { title: "المرحلة الأخيرة", description: "إصدار الترخيص النهائي وإرساله إليكم رسمياً" }
      ],
      timelineNotice: "⚡ سيتم التواصل معكم خلال 48 ساعة عمل لمتابعة طلبكم"
    });

    // Create admin email using new template system
    const adminEmail = EmailTemplates.admin({
      companyName: requestData.companyName,
      email: requestData.email,
      requestNumber,
      date: formatArabicDate(),
      title: "طلب ترخيص جديد يتطلب المراجعة الفورية",
      message: `تم استلام طلب ترخيص جديد من شركة ${requestData.companyName} في التاريخ: ${formatArabicDate()}`,
      urgencyLevel: "high",
      details: [
        { label: "اسم الشركة", value: requestData.companyName, icon: "🏢" },
        { label: "الشخص المسؤول", value: requestData.contactPerson, icon: "👨‍💼" },
        { label: "البريد الإلكتروني", value: requestData.email, icon: "📧" },
        { label: "رقم الهاتف", value: requestData.phone, icon: "📱" },
        { label: "نوع الترخيص", value: licenseTypeMap[requestData.licenseType] || requestData.licenseType, icon: "⚖️" },
        { label: "نوع المحتوى", value: contentTypeMap[requestData.contentType] || requestData.contentType, icon: "📄" },
        { label: "مدة الترخيص", value: durationMap[requestData.duration] || requestData.duration, icon: "📅" },
        { label: "الغرض من الاستخدام", value: requestData.usagePurpose, icon: "🎯" },
        { label: "حالة الموافقة", value: requestData.agreeToTerms ? "وافق على جميع الشروط" : "لم يوافق على الشروط", icon: "✅" }
      ],
      actionButtons: [
        { 
          label: "📧 الرد على العميل", 
          url: `mailto:${requestData.email}?subject=بخصوص طلب الترخيص رقم ${requestNumber}&body=عزيزي ${requestData.contactPerson}،%0A%0Aتحية طيبة وبعد،%0A%0Aبخصوص طلب الترخيص رقم ${requestNumber} المقدم من شركة ${requestData.companyName}...`,
          type: "primary"
        },
        { 
          label: "📞 الاتصال المباشر", 
          url: `tel:${requestData.phone}`,
          type: "secondary"
        }
      ],
      checklist: [
        "التحقق من صحة وتكامل البيانات المقدمة",
        "تقييم نوع الاستخدام ومدى توافقه مع سياسات الملكية الفكرية",
        "مراجعة الشروط والأحكام والتأكد من الموافقة الكاملة",
        "إعداد اتفاقية الترخيص المخصصة في حالة الموافقة",
        "توثيق وأرشفة جميع البيانات في نظام إدارة التراخيص",
        "تحديث إحصائيات وتقارير قسم الشؤون القانونية"
      ],
      additionalInfo: requestData.additionalInfo ? `معلومات إضافية من العميل: ${requestData.additionalInfo}` : undefined
    });
    
    // Send confirmation email to client
    const clientResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "وكالة ماستر إيدو باث <noreply@masteredupath.com>",
        to: [requestData.email],
        subject: clientEmail.subject,
        html: clientEmail.html,
        text: clientEmail.text,
      }),
    });

    // Send notification email to admin team
    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "نظام التراخيص <noreply@masteredupath.com>",
        to: ["legal@masteredupath.com", "admin@masteredupath.com", "info@masteredupath.com"],
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
      }),
    });

    console.log("Emails sent successfully:", {
      client: clientResponse.status,
      admin: adminResponse.status,
      requestNumber
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        requestNumber,
        message: "تم إرسال طلب الترخيص بنجاح مع إشعار الإدارة الفوري"
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
    
  } catch (error: any) {
    console.error("License request error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "حدث خطأ أثناء إرسال طلب الترخيص",
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});