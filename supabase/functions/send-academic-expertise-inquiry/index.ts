import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultationRequest {
  fullName: string;
  email: string;
  phone: string;
  university: string;
  academicLevel: string;
  specialization: string;
  serviceType: string;
  projectTitle: string;
  projectDescription: string;
  deadline: string;
  additionalNotes: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Academic expertise inquiry function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const consultationData: ConsultationRequest = await req.json();
    console.log("Received consultation data:", { ...consultationData, phone: "[REDACTED]" });

    // Map service types to Arabic
    const serviceTypeMap: { [key: string]: string } = {
      "thesis-writing": "كتابة الرسائل العلمية",
      "research-paper": "إعداد البحوث العلمية", 
      "data-analysis": "تحليل البيانات الإحصائية",
      "literature-review": "مراجعة الأدبيات",
      "academic-consultation": "استشارة أكاديمية عامة",
      "proofreading": "مراجعة وتدقيق",
      "translation": "ترجمة أكاديمية",
      "other": "خدمة أخرى"
    };

    const academicLevelMap: { [key: string]: string } = {
      "bachelor": "بكالوريوس",
      "master": "ماجستير", 
      "phd": "دكتوراه",
      "researcher": "باحث",
      "other": "أخرى"
    };

    const serviceTypeArabic = serviceTypeMap[consultationData.serviceType] || consultationData.serviceType;
    const academicLevelArabic = academicLevelMap[consultationData.academicLevel] || consultationData.academicLevel;

    // Client confirmation email template with RTL design
    const clientEmailTemplate = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>تأكيد طلب الاستشارة الأكاديمية</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Tajawal', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.7;
            color: #0f172a;
            background: linear-gradient(135deg, #4834d4 0%, #686de0 100%);
            direction: rtl;
            text-align: right;
            margin: 0;
            padding: 20px 0;
            animation: academicFadeIn 1.2s ease-out;
          }
          
          @keyframes academicFadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes rtlSlide {
            from { opacity: 0; transform: translateX(40px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .email-container {
            max-width: 680px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 16px 40px rgba(0,0,0,0.08);
          }
          .header {
            background: linear-gradient(135deg,#4f46e5,#7c3aed);
            color: #ffffff;
            padding: 28px 24px;
            text-align: center;
          }
          .logo { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
          .tagline { font-size: 13px; opacity: 0.9; }
          .main-content { padding: 24px; }
          .greeting {
            font-size: 16px;
            color: #111827;
            border-right: 5px solid #4f46e5;
            border-radius: 12px;
            padding: 16px 18px;
            background-color: #f8fafc;
            margin-bottom: 18px;
          }
          .customer-name {
            background: linear-gradient(135deg,#4f46e5,#7c3aed);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 700;
          }
          .message {
            font-size: 15px;
            line-height: 1.9;
            color: #334155;
            margin: 18px 0;
          }
          .details-card {
            background: linear-gradient(135deg,#f0f9ff,#e0f2fe);
            border-right: 5px solid #0ea5e9;
            border-radius: 14px;
            padding: 18px;
            margin: 20px 0;
          }
          .details-title {
            font-size: 16px;
            font-weight: 800;
            color: #0369a1;
            margin-bottom: 12px;
          }
          .detail-item {
            padding: 12px 14px;
            background: #fff;
            border-right: 4px solid #0ea5e9;
            border-radius: 10px;
            margin-bottom: 10px;
          }
          .detail-label {
            font-size: 13px;
            color: #1e40af;
            font-weight: 700;
            margin-bottom: 4px;
          }
          .detail-value {
            font-size: 14px;
            color: #334155;
            font-weight: 600;
          }
          .steps-section {
            background: linear-gradient(135deg,#f0fdf4,#dcfce7);
            border-right: 5px solid #22c55e;
            border-radius: 14px;
            padding: 16px;
            margin: 8px 0;
          }
          .steps-title {
            font-size: 16px;
            font-weight: 800;
            color: #15803d;
            margin-bottom: 10px;
          }
          .steps-list {
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .steps-list li {
            margin-bottom: 8px;
            padding: 10px;
            background: #fff;
            border-right: 4px solid #22c55e;
            border-radius: 10px;
            color: #166534;
            font-weight: 600;
          }
          .contact-section {
            background: linear-gradient(135deg,#fefce8,#fef3c7);
            border-right: 5px solid #f59e0b;
            border-radius: 14px;
            padding: 16px;
            margin: 16px 0;
          }
          .contact-title {
            font-size: 16px;
            font-weight: 800;
            color: #d97706;
            margin-bottom: 10px;
          }
          .contact-item {
            padding: 10px;
            background: #fff;
            border-right: 4px solid #f59e0b;
            border-radius: 10px;
            color: #92400e;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .footer {
            background: linear-gradient(135deg,#1e293b,#0f172a);
            color: #f1f5f9;
            padding: 20px;
            text-align: center;
          }
          .footer-title {
            font-size: 16px;
            font-weight: 800;
          }
          .footer-subtitle {
            font-size: 13px;
            color: #cbd5e1;
            margin-top: 6px;
          }
          .footer-copyright {
            font-size: 12px;
            color: #94a3b8;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">🎓 وكالة ماستر إيدو باث</div>
            <div class="tagline">للخدمات الأكاديمية والبحثية المتخصصة</div>
          </div>

          <div class="main-content">
            <div class="greeting">
              السلام عليكم ورحمة الله وبركاته،<br/>
              الأستاذ/ة <span class="customer-name">${consultationData.fullName}</span> المحترم/ة
            </div>

            <div class="message">
              نشكركم لثقتكم في <strong>وكالة ماستر إيدو باث</strong> ولاختياركم خدماتنا الأكاديمية المتخصصة.<br/><br/>
              تم استلام طلب الاستشارة الأكاديمية الخاص بكم بنجاح، وسيقوم فريقنا المختص بمراجعته والتواصل معكم في أقرب وقت ممكن.
            </div>

            <div class="details-card">
              <div class="details-title">📋 تفاصيل طلبكم</div>
              <div class="detail-item">
                <div class="detail-label">نوع الخدمة</div>
                <div class="detail-value">${serviceTypeArabic}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">المستوى الأكاديمي</div>
                <div class="detail-value">${academicLevelArabic}</div>
              </div>
              ${consultationData.specialization ? `
              <div class="detail-item">
                <div class="detail-label">التخصص</div>
                <div class="detail-value">${consultationData.specialization}</div>
              </div>` : ''}
              ${consultationData.university ? `
              <div class="detail-item">
                <div class="detail-label">الجامعة</div>
                <div class="detail-value">${consultationData.university}</div>
              </div>` : ''}
              ${consultationData.projectTitle ? `
              <div class="detail-item">
                <div class="detail-label">عنوان المشروع</div>
                <div class="detail-value">${consultationData.projectTitle}</div>
              </div>` : ''}
              ${consultationData.deadline ? `
              <div class="detail-item">
                <div class="detail-label">الموعد النهائي</div>
                <div class="detail-value">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</div>
              </div>` : ''}
            </div>

            <div class="steps-section">
              <div class="steps-title">⏰ الخطوات التالية</div>
              <ul class="steps-list">
                <li>مراجعة الطلب من قبل فريق الخبراء</li>
                <li>التواصل خلال 24 ساعة لمناقشة التفاصيل</li>
                <li>تقديم عرض سعر وخطة عمل</li>
              </ul>
            </div>

            <div class="contact-section">
              <div class="contact-title">📞 للتواصل</div>
              <div class="contact-item">البريد الإلكتروني: info@masteredupath.com</div>
              <div class="contact-item">رقم الهاتف: 0500776343</div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-title">وكالة ماستر إيدو باث</div>
            <div class="footer-subtitle">للخدمات الأكاديمية والبحثية المتخصصة</div>
            <div class="footer-copyright">جميع الحقوق محفوظة © 2024</div>
          </div>
        </div>
      </body>
    </html>
    `;

    // Admin notification email template with RTL design
    const adminEmailTemplate = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>طلب استشارة أكاديمية جديد</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #991b1b 100%);
            direction: rtl;
            text-align: right;
            margin: 0;
            padding: 20px 0;
          }
          .email-container {
            max-width: 750px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          }
          .alert-header {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
            padding: 40px;
            text-align: center;
            color: white;
          }
          .alert-icon {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            margin-bottom: 20px;
          }
          .alert-title {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 12px;
          }
          .alert-subtitle {
            font-size: 18px;
            color: #fecaca;
            font-weight: 500;
            margin-bottom: 25px;
          }
          .timestamp-badge {
            display: inline-flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50px;
            padding: 12px 20px;
            font-size: 15px;
            font-weight: 600;
          }
          .priority-section {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            border: 3px solid #ef4444;
            border-radius: 20px;
            padding: 30px;
            margin: 30px 40px;
            position: relative;
          }
          .priority-section::before {
            content: '🚨';
            position: absolute;
            top: -18px;
            right: 25px;
            font-size: 32px;
            background: #ef4444;
            width: 55px;
            height: 55px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .priority-title {
            font-size: 24px;
            color: #dc2626;
            margin-bottom: 15px;
            font-weight: 800;
            text-align: center;
          }
          .service-header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 15px;
          }
          .service-icon {
            font-size: 40px;
            padding: 15px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border-radius: 50%;
            color: white;
          }
          .service-name {
            font-size: 26px;
            color: #1e40af;
            font-weight: 700;
            text-align: center;
          }
          .customer-section {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 20px;
            padding: 35px 40px;
            margin: 30px 40px;
            border: 2px solid #3b82f6;
          }
          .customer-section h3 {
            font-size: 22px;
            color: #1e40af;
            margin-bottom: 25px;
            font-weight: 700;
            text-align: center;
          }
          .customer-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }
          .customer-info-item {
            background: #ffffff;
            padding: 25px;
            border-radius: 16px;
            border-right: 5px solid #3b82f6;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          }
          .info-label {
            font-size: 14px;
            color: #1e40af;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .info-value {
            font-size: 17px;
            color: #1f2937;
            font-weight: 600;
            word-break: break-all;
          }
          .customer-name {
            color: #dc2626;
            font-size: 20px;
            font-weight: 800;
          }
          .order-details {
            background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
            border-radius: 20px;
            padding: 35px 40px;
            margin: 30px 40px;
            border: 2px solid #f59e0b;
          }
          .order-details h3 {
            font-size: 22px;
            color: #92400e;
            margin-bottom: 25px;
            font-weight: 700;
            text-align: center;
          }
          .details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }
          .detail-card {
            background: #ffffff;
            padding: 20px;
            border-radius: 14px;
            border-right: 4px solid #f59e0b;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          }
          .detail-label {
            font-size: 13px;
            color: #92400e;
            font-weight: 700;
            margin-bottom: 8px;
            text-transform: uppercase;
          }
          .detail-value {
            font-size: 16px;
            color: #1f2937;
            font-weight: 600;
          }
          .actions-section {
            padding: 40px;
            text-align: center;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-top: 3px solid #cbd5e1;
          }
          .actions-title {
            font-size: 24px;
            color: #1e293b;
            margin-bottom: 25px;
            font-weight: 700;
          }
          .action-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
          }
          .action-btn {
            display: inline-flex;
            align-items: center;
            padding: 16px 32px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 700;
            font-size: 16px;
            min-width: 180px;
            justify-content: center;
          }
          .action-btn.primary {
            background: linear-gradient(135deg, #dc2626, #ef4444);
            color: white;
          }
          .action-btn.secondary {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
          }
          .admin-footer {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #94a3b8;
            padding: 40px;
            text-align: center;
          }
          .footer-title {
            font-size: 22px;
            color: #ffffff;
            margin-bottom: 10px;
            font-weight: 700;
          }
          .system-info {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px;
            margin: 25px 0;
          }
          .system-info h5 {
            color: #e2e8f0;
            font-size: 16px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          .system-info p {
            font-size: 13px;
            color: #94a3b8;
            margin: 5px 0;
          }
          @media only screen and (max-width: 768px) {
            body { padding: 10px 0; }
            .email-container { margin: 0 10px; border-radius: 16px; }
            .alert-header, .priority-section, .customer-section, .order-details, .actions-section, .admin-footer {
              padding: 25px; margin: 20px 15px;
            }
            .alert-title { font-size: 26px; }
            .customer-grid, .details-grid { grid-template-columns: 1fr; }
            .action-buttons { flex-direction: column; align-items: center; }
            .action-btn { width: 100%; max-width: 300px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="alert-header">
            <div class="alert-icon">🚨</div>
            <h1 class="alert-title">تنبيه إداري عاجل</h1>
            <p class="alert-subtitle">طلب استشارة أكاديمية جديد</p>
            <div class="timestamp-badge">
              <span>تم الاستلام: ${new Date().toLocaleString('ar-SA')}</span>
            </div>
          </div>

          <div class="priority-section">
            <h2 class="priority-title">مستوى الأولوية: عاجل جداً</h2>
            <div class="service-header">
              <div class="service-icon">🎓</div>
              <div class="service-name">${serviceTypeArabic}</div>
            </div>
          </div>

          <div class="customer-section">
            <h3>معلومات العميل الكاملة</h3>
            <div class="customer-grid">
              <div class="customer-info-item">
                <div class="info-label">اسم العميل</div>
                <div class="info-value customer-name">${consultationData.fullName}</div>
              </div>
              
              <div class="customer-info-item">
                <div class="info-label">البريد الإلكتروني</div>
                <div class="info-value">${consultationData.email}</div>
              </div>
              
              ${consultationData.phone ? `
              <div class="customer-info-item">
                <div class="info-label">رقم الهاتف</div>
                <div class="info-value">${consultationData.phone}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="order-details">
            <h3>تفاصيل الطلب المُستلم</h3>
            <div class="details-grid">
              <div class="detail-card">
                <div class="detail-label">نوع الخدمة</div>
                <div class="detail-value">${serviceTypeArabic}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-label">المستوى الأكاديمي</div>
                <div class="detail-value">${academicLevelArabic}</div>
              </div>
              
              ${consultationData.specialization ? `
              <div class="detail-card">
                <div class="detail-label">التخصص</div>
                <div class="detail-value">${consultationData.specialization}</div>
              </div>
              ` : ''}
              
              ${consultationData.deadline ? `
              <div class="detail-card">
                <div class="detail-label">الموعد النهائي</div>
                <div class="detail-value">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="actions-section">
            <h3 class="actions-title">الإجراءات المطلوبة</h3>
            <div class="action-buttons">
              <a href="mailto:${consultationData.email}" class="action-btn primary">
                <span>📧 الرد على العميل</span>
              </a>
              
              <a href="https://www.masteredupath.com/admin/orders" class="action-btn secondary">
                <span>👁 مراجعة في النظام</span>
              </a>
            </div>
          </div>

          <div class="admin-footer">
            <h4 class="footer-title">نظام الإشعارات الإدارية</h4>
            
            <div class="system-info">
              <h5>معلومات النظام</h5>
              <p>خادم الإشعارات: info@masteredupath.com</p>
              <p>وقت الإرسال: ${new Date().toLocaleString('ar-SA')}</p>
              <p>نوع التنبيه: طلب استشارة أكاديمية جديد</p>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="font-size: 12px; color: #64748b;">
                &copy; ${new Date().getFullYear()} نظام إدارة وكالة ماستر إيدو باث. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "وكالة ماستر إيدو باث <info@masteredupath.com>",
      to: [consultationData.email],
      subject: "✅ تأكيد استلام طلب الاستشارة الأكاديمية - وكالة ماستر إيدو باث",
      html: clientEmailTemplate,
    });

    console.log("Client confirmation email sent:", clientEmailResponse);

    // If client email blocked or failed, return informative error
    if (clientEmailResponse.error) {
      console.error("Client email error:", clientEmailResponse.error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "تعذر إرسال تأكيد للعميل. يرجى التحقق من إعدادات البريد (Resend Domain)",
          error: clientEmailResponse.error
        }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "نظام الإشعارات <info@masteredupath.com>",
      to: ["admin@masteredupath.com"],
      cc: ["info@masteredupath.com"],
      replyTo: [consultationData.email],
      subject: `🚨 طلب استشارة أكاديمية جديد من ${consultationData.fullName} - ${serviceTypeArabic}`,
      html: adminEmailTemplate,
    });

    console.log("Admin notification email sent:", adminEmailResponse);

    if (adminEmailResponse.error) {
      console.error("Admin email error:", adminEmailResponse.error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "تعذر إشعار الإدارة. يرجى التحقق من إعدادات البريد (Resend Domain)",
          error: adminEmailResponse.error
        }),
        { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلب الاستشارة بنجاح",
        clientEmailId: clientEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id
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
    console.error("Error in send-academic-expertise-inquiry function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: "حدث خطأ في إرسال طلب الاستشارة"
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);