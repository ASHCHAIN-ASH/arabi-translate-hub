import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PricingInquiry {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  details?: string;
  budget?: string;
  files?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Pricing inquiry function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiry: PricingInquiry = await req.json();
    console.log("Received inquiry:", inquiry);

    // Validate required fields
    if (!inquiry.name || !inquiry.email || !inquiry.service) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "الاسم والبريد الإلكتروني ونوع الخدمة مطلوبة" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email to customer (confirmation)
    const customerEmailResponse = await resend.emails.send({
      from: "MasterEduPath - الحلول التعليمية المتقدمة <info@masteredupath.com>",
      to: [inquiry.email],
      subject: "تم استلام طلبك - MasterEduPath 🌟",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد استلام الطلب</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif; 
              margin: 0; 
              padding: 15px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              direction: rtl !important; 
              text-align: right !important;
            }
            * { direction: rtl !important; text-align: right !important; }
            .text-center { text-align: center !important; }
            .container { 
              max-width: 650px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 25px; 
              overflow: hidden; 
              box-shadow: 0 25px 50px rgba(0,0,0,0.15); 
            }
            .header { 
              background: linear-gradient(135deg, #10b981, #059669); 
              color: white; 
              padding: 40px 30px; 
              text-align: center !important; 
              position: relative;
              direction: rtl !important;
            }
            .header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 6px;
              background: linear-gradient(90deg, #ffd89b 0%, #19547b 100%);
            }
            .header-icon { font-size: 48px; margin-bottom: 15px; display: block; }
            .logo { font-size: 32px; font-weight: 700; margin-bottom: 10px; }
            .subtitle { font-size: 18px; opacity: 0.95; font-weight: 400; }
            .content { padding: 40px 30px; }
            .welcome { 
              font-size: 24px; 
              font-weight: 600; 
              color: #1e293b; 
              margin-bottom: 25px; 
              text-align: center !important; 
              direction: rtl !important;
            }
            .success-message { 
              background: linear-gradient(145deg, #d1fae5, #a7f3d0); 
              border: 3px solid #10b981; 
              border-radius: 20px; 
              padding: 30px; 
              margin: 30px 0; 
              text-align: center !important;
              box-shadow: 0 8px 20px rgba(16, 185, 129, 0.2);
            }
            .success-message h3 { 
              color: #065f46; 
              margin: 0 0 15px 0; 
              font-size: 22px; 
              font-weight: 700;
              text-align: center !important;
              direction: rtl !important;
            }
            .success-message p { 
              color: #047857; 
              margin: 0; 
              font-size: 17px; 
              line-height: 1.8;
              text-align: center !important;
              direction: rtl !important;
            }
            .info-card { background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; padding: 30px; margin: 25px 0; border-right: 6px solid #3b82f6; }
            .info-card h3 { color: #1e293b; margin: 0 0 20px 0; font-size: 22px; display: flex; align-items: center; }
            .info-card h3::before { content: "📋"; margin-left: 10px; font-size: 24px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
            .info-item { background: white; padding: 15px 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .info-label { font-weight: bold; color: #475569; font-size: 14px; margin-bottom: 5px; display: block; }
            .info-value { color: #1e293b; font-size: 16px; }
            .files-section { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border-radius: 12px; padding: 25px; margin: 25px 0; border-right: 6px solid #10b981; }
            .files-section h3 { color: #065f46; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center; }
            .files-section h3::before { content: "📎"; margin-left: 10px; font-size: 22px; }
            .file-item { background: white; padding: 12px 16px; margin: 8px 0; border-radius: 8px; border: 1px solid #d1fae5; display: flex; align-items: center; justify-content: space-between; }
            .file-info { display: flex; align-items: center; }
            .file-info::before { content: "📄"; margin-left: 8px; font-size: 16px; }
            .file-size { background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .next-steps { background: linear-gradient(135deg, #dbeafe, #e0f2fe); border-radius: 12px; padding: 25px; margin: 25px 0; border-right: 6px solid #0ea5e9; }
            .next-steps h3 { color: #0c4a6e; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center; }
            .next-steps h3::before { content: "📍"; margin-left: 10px; font-size: 22px; }
            .next-steps ul { margin: 10px 0; padding-right: 20px; }
            .next-steps li { margin-bottom: 10px; color: #0c4a6e; line-height: 1.6; }
            .footer { background: #1e293b; color: white; padding: 30px; text-align: center; }
            .footer h4 { margin: 0 0 20px 0; color: #f1f5f9; font-size: 20px; }
            .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .contact-item { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; }
            .contact-item a { color: #60a5fa; text-decoration: none; font-weight: bold; }
            .company-info { margin-top: 25px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.2); }
            .disclaimer { margin-top: 20px; font-size: 12px; opacity: 0.8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌟 MasterEduPath</div>
              <div class="subtitle">الحلول التعليمية والأكاديمية المتقدمة</div>
            </div>
            
            <div class="content">
              <h2 class="welcome">مرحباً ${inquiry.name}!</h2>
              
              <div class="success-message">
                <h3>✅ تم استلام طلبك بنجاح</h3>
                <p>شكراً لك على اهتمامك بخدماتنا. سيتواصل معك فريق المبيعات المتخصص خلال <strong>٣ ساعات خلال أوقات الدوام</strong> لتقديم عرض سعر مخصص وتفصيلي يناسب احتياجاتك.</p>
              </div>
              
              <div class="info-card">
                <h3>ملخص طلبك</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">الاسم</span>
                    <span class="info-value">${inquiry.name}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">البريد الإلكتروني</span>
                    <span class="info-value">${inquiry.email}</span>
                  </div>
                  ${inquiry.phone ? `
                  <div class="info-item">
                    <span class="info-label">رقم الهاتف</span>
                    <span class="info-value">${inquiry.phone}</span>
                  </div>
                  ` : ''}
                  ${inquiry.company ? `
                  <div class="info-item">
                    <span class="info-label">الشركة/المؤسسة</span>
                    <span class="info-value">${inquiry.company}</span>
                  </div>
                  ` : ''}
                  <div class="info-item">
                    <span class="info-label">نوع الخدمة</span>
                    <span class="info-value">${getServiceName(inquiry.service)}</span>
                  </div>
                  ${inquiry.budget ? `
                  <div class="info-item">
                    <span class="info-label">الميزانية المتوقعة</span>
                    <span class="info-value">${getBudgetRange(inquiry.budget)}</span>
                  </div>
                  ` : ''}
                </div>
                ${inquiry.details ? `
                <div style="margin-top: 20px;">
                  <span class="info-label">تفاصيل المشروع:</span>
                  <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 10px; border: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #1e293b; line-height: 1.8;">${inquiry.details}</p>
                  </div>
                </div>
                ` : ''}
              </div>
              
              ${inquiry.files && inquiry.files.length > 0 ? `
              <div class="files-section">
                <h3>المرفقات المرسلة (${inquiry.files.length} ملف)</h3>
                ${inquiry.files.map(file => `
                <div class="file-item">
                  <div class="file-info">
                    <strong>${file.name}</strong>
                  </div>
                  <div class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                `).join('')}
                <p style="color: #065f46; font-size: 14px; margin-top: 15px; background: white; padding: 15px; border-radius: 8px;">
                  📌 ملاحظة: تم تسجيل معلومات الملفات، وسيطلب منك فريق المبيعات إرسالها عند التواصل للحصول على تقدير دقيق.
                </p>
              </div>
              ` : ''}
              
              <div class="next-steps">
                <h3>الخطوات التالية</h3>
                <ul>
                  <li><strong>المراجعة:</strong> سيقوم فريقنا بدراسة طلبك ومتطلباتك بعناية فائقة</li>
                  <li><strong>التواصل:</strong> سيتصل بك أحد خبراء المبيعات خلال ٣ ساعات خلال أوقات الدوام</li>
                  <li><strong>العرض المخصص:</strong> ستحصل على عرض سعر تفصيلي ومخصص لمشروعك</li>
                  <li><strong>الاستشارة:</strong> يمكنك طرح أي أسئلة أو طلب توضيحات إضافية</li>
                  <li><strong>البدء:</strong> بعد موافقتك، سنبدأ فوراً في تنفيذ مشروعك بأعلى معايير الجودة</li>
                </ul>
              </div>
              
              <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; border-right: 6px solid #f59e0b;">
                <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 20px;">🏆 لماذا نحن الخيار الأمثل؟</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                  <div style="color: #92400e;"><strong>✅ خبرة +15 سنة</strong></div>
                  <div style="color: #92400e;"><strong>✅ فريق متخصص</strong></div>
                  <div style="color: #92400e;"><strong>✅ ضمان الجودة 100%</strong></div>
                  <div style="color: #92400e;"><strong>✅ أسعار تنافسية</strong></div>
                </div>
              </div>
              
              <p style="margin-top: 40px; text-align: center; color: #64748b; font-size: 16px;">
                نحن متحمسون لمساعدتك في تحقيق أهدافك الأكاديمية والتعليمية!<br>
                <strong style="color: #1e293b;">فريق MasterEduPath</strong>
              </p>
            </div>
            
            <div class="footer">
              <h4>📞 للتواصل السريع والاستفسارات العاجلة</h4>
              
              <div class="contact-grid">
                <div class="contact-item">
                  <strong>📧 البريد الإلكتروني</strong><br>
                  <a href="mailto:info@masteredupath.com">info@masteredupath.com</a>
                </div>
                 <div class="contact-item">
                   <strong>📱 خدمة المبيعات</strong><br>
                   <a href="tel:+966500776343">0500776343</a>
                 </div>
                <div class="contact-item">
                  <strong>🌐 الموقع الإلكتروني</strong><br>
                  <a href="https://masteredupath.com">www.masteredupath.com</a>
                </div>
                 <div class="contact-item">
                   <strong>📍 الموقع</strong><br>
                   جدة، المملكة العربية السعودية
                 </div>
              </div>
              
              <div class="company-info">
                <h4>🌟 MasterEduPath - الحلول التعليمية المتقدمة</h4>
                <p style="margin: 10px 0; color: #cbd5e1; line-height: 1.6;">
                  نحن متخصصون في تقديم أفضل الحلول التعليمية والأكاديمية المتقدمة، 
                  بما في ذلك خدمات الترجمة الاحترافية، والبحث الأكاديمي، والاستشارات التعليمية.
                </p>
              </div>
              
              <p class="disclaimer">
                هذه رسالة آلية من نظام MasterEduPath - يرجى عدم الرد على هذا الإيميل مباشرة
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Email to admin (notification)
    const adminEmailResponse = await resend.emails.send({
      from: "طلبات عملاء MasterEduPath <orders@masteredupath.com>",
      to: ["admin@masteredupath.com", "info@masteredupath.com"],
      subject: `🔔 طلب عرض سعر عاجل من ${inquiry.name}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب عرض سعر جديد</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; direction: rtl; }
            .container { max-width: 700px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 40px 30px; text-align: center; }
            .alert-badge { background-color: rgba(255, 255, 255, 0.2); padding: 12px 20px; border-radius: 25px; display: inline-block; margin-bottom: 15px; font-weight: bold; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 30px; }
            .urgent { background: linear-gradient(135deg, #fef2f2, #fef7f7); border: 2px solid #fecaca; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; }
            .urgent h3 { color: #dc2626; margin: 0 0 15px 0; font-size: 20px; }
            .urgent p { color: #7f1d1d; margin: 0; font-size: 16px; }
            .client-card { background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; padding: 30px; margin: 25px 0; border-right: 6px solid #3b82f6; }
            .client-card h3 { color: #1e293b; margin: 0 0 20px 0; font-size: 22px; display: flex; align-items: center; }
            .client-card h3::before { content: "👤"; margin-left: 10px; font-size: 24px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
            .info-item { background: white; padding: 15px 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .info-label { font-weight: bold; color: #475569; font-size: 14px; margin-bottom: 5px; display: block; }
            .info-value { color: #1e293b; font-size: 16px; word-break: break-all; }
            .info-value a { color: #3b82f6; text-decoration: none; font-weight: bold; }
            .info-value a:hover { text-decoration: underline; }
            .project-details { background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 12px; padding: 25px; margin: 25px 0; border-right: 6px solid #0ea5e9; }
            .project-details h3 { color: #0c4a6e; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center; }
            .project-details h3::before { content: "📋"; margin-left: 10px; font-size: 22px; }
            .files-section { background: linear-gradient(135deg, #f0fdf4, #ecfdf5); border-radius: 12px; padding: 25px; margin: 25px 0; border-right: 6px solid #10b981; }
            .files-section h3 { color: #065f46; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center; }
            .files-section h3::before { content: "📎"; margin-left: 10px; font-size: 22px; }
            .file-item { background: white; padding: 12px 16px; margin: 8px 0; border-radius: 8px; border: 1px solid #d1fae5; display: flex; align-items: center; justify-content: space-between; }
            .file-info { display: flex; align-items: center; }
            .file-info::before { content: "📄"; margin-left: 8px; font-size: 16px; }
            .file-size { background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .action-buttons { text-align: center; margin: 35px 0; }
            .btn { display: inline-block; padding: 15px 30px; margin: 8px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; transition: all 0.3s; }
            .btn-primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
            .btn-success { background: linear-gradient(135deg, #10b981, #059669); color: white; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0,0,0,0.2); }
            .tips-section { background: #f0f9ff; padding: 25px; border-radius: 12px; margin-top: 30px; border-right: 4px solid #0ea5e9; }
            .tips-section h4 { color: #0369a1; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center; }
            .tips-section h4::before { content: "💡"; margin-left: 10px; font-size: 20px; }
            .tips-section ul { margin: 0; padding-right: 20px; color: #075985; }
            .tips-section li { margin-bottom: 8px; line-height: 1.5; }
            .footer { background: #1e293b; color: white; padding: 25px; text-align: center; }
            .footer h4 { margin: 0 0 15px 0; color: #f1f5f9; }
            .contact-item { margin: 8px 0; }
            .contact-item a { color: #60a5fa; text-decoration: none; font-weight: bold; }
            .timestamp { background: #374151; color: #d1d5db; padding: 15px; margin-top: 20px; border-radius: 8px; font-size: 14px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="alert-badge">🚨 طلب عاجل - يتطلب متابعة فورية</div>
              <h1>طلب عرض سعر جديد</h1>
              <p>تم استلام طلب جديد من عميل محتمل</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <h3>⏰ مطلوب الرد خلال ٣ ساعات خلال أوقات الدوام</h3>
                <p>تم إرسال رسالة تأكيد للعميل مع وعد بالرد السريع - يرجى المتابعة فوراً</p>
              </div>
              
              <div class="client-card">
                <h3>معلومات العميل الكاملة</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">الاسم الكامل</span>
                    <span class="info-value">${inquiry.name}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">البريد الإلكتروني</span>
                    <span class="info-value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></span>
                  </div>
                  ${inquiry.phone ? `
                  <div class="info-item">
                    <span class="info-label">رقم الهاتف</span>
                    <span class="info-value"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></span>
                  </div>
                  ` : ''}
                  ${inquiry.company ? `
                  <div class="info-item">
                    <span class="info-label">الشركة/المؤسسة</span>
                    <span class="info-value">${inquiry.company}</span>
                  </div>
                  ` : ''}
                  <div class="info-item">
                    <span class="info-label">نوع الخدمة المطلوبة</span>
                    <span class="info-value">${getServiceName(inquiry.service)}</span>
                  </div>
                  ${inquiry.budget ? `
                  <div class="info-item">
                    <span class="info-label">الميزانية المتوقعة</span>
                    <span class="info-value">${getBudgetRange(inquiry.budget)}</span>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              ${inquiry.details ? `
              <div class="project-details">
                <h3>تفاصيل المشروع الكاملة</h3>
                <p style="line-height: 1.8; margin: 0; color: #0c4a6e; font-size: 16px; background: white; padding: 20px; border-radius: 8px;">${inquiry.details}</p>
              </div>
              ` : ''}
              
              ${inquiry.files && inquiry.files.length > 0 ? `
              <div class="files-section">
                <h3>المرفقات المرسلة (${inquiry.files.length} ملف)</h3>
                ${inquiry.files.map(file => `
                <div class="file-item">
                  <div class="file-info">
                    <strong>${file.name}</strong>
                  </div>
                  <div class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                `).join('')}
                <p style="color: #065f46; font-weight: bold; margin-top: 15px; background: white; padding: 15px; border-radius: 8px;">
                  ⚠️ ملاحظة هامة: يرجى طلب إرسال الملفات من العميل عند التواصل معه
                </p>
              </div>
              ` : ''}
              
              <div class="action-buttons">
                <a href="mailto:${inquiry.email}?subject=رد على طلب عرض السعر - MasterEduPath&body=عزيزي ${inquiry.name},%0A%0Aشكراً لك على تواصلك معنا..." class="btn btn-primary">
                  📧 الرد على العميل فوراً
                </a>
                ${inquiry.phone ? `<a href="tel:${inquiry.phone}" class="btn btn-success">📱 الاتصال مباشرة</a>` : ''}
              </div>
              
              <div class="tips-section">
                <h4>نصائح لضمان إغلاق الصفقة</h4>
                <ul>
                  <li><strong>التواصل السريع:</strong> اتصل بالعميل خلال أول ساعة لزيادة فرص الإغلاق بنسبة 400%</li>
                  <li><strong>فهم المشروع:</strong> اطرح أسئلة تفصيلية لفهم المتطلبات الحقيقية</li>
                  <li><strong>إظهار الخبرة:</strong> شارك أمثلة من أعمال مشابهة نفذناها بنجاح</li>
                  <li><strong>المرونة في التسعير:</strong> اقترح باقات متنوعة تناسب ميزانية العميل</li>
                  <li><strong>بناء الثقة:</strong> اقترح مكالمة مرئية لمناقشة التفاصيل وبناء علاقة شخصية</li>
                </ul>
              </div>
              
              <div class="timestamp">
                <strong>وقت استلام الطلب:</strong> ${new Date().toLocaleString('ar-SA', { 
                  timeZone: 'Asia/Riyadh',
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} (توقيت الرياض)
              </div>
            </div>
            
            <div class="footer">
              <h4>🏢 معلومات الشركة</h4>
              <div class="contact-item">📧 <a href="mailto:info@masteredupath.com">info@masteredupath.com</a></div>
              <div class="contact-item">📱 <a href="tel:+966555123456">0555 123 456</a></div>
              <div class="contact-item">🌐 <a href="https://masteredupath.com">www.masteredupath.com</a></div>
              <div class="contact-item">📍 الرياض، المملكة العربية السعودية</div>
              <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                هذه رسالة آلية من نظام MasterEduPath لإدارة طلبات العملاء
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح وسيتم التواصل معك قريباً",
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-pricing-inquiry function:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ أثناء إرسال الطلب",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper functions
function getServiceName(service: string): string {
  const serviceNames: { [key: string]: string } = {
    'document': 'ترجمة الوثائق',
    'website': 'ترجمة المواقع الإلكترونية',
    'audio': 'ترجمة صوتية',
    'video': 'ترجمة الفيديو',
    'legal': 'ترجمة قانونية',
    'medical': 'ترجمة طبية',
    'technical': 'ترجمة تقنية',
    'academic': 'ترجمة أكاديمية',
    'business': 'ترجمة تجارية',
    'other': 'أخرى'
  };
  return serviceNames[service] || service;
}

function getBudgetRange(budget: string): string {
  const budgetRanges: { [key: string]: string } = {
    'under-1000': 'أقل من 1,000 ريال',
    '1000-5000': '1,000 - 5,000 ريال',
    '5000-10000': '5,000 - 10,000 ريال',
    '10000-25000': '10,000 - 25,000 ريال',
    '25000-50000': '25,000 - 50,000 ريال',
    'over-50000': 'أكثر من 50,000 ريال'
  };
  return budgetRanges[budget] || budget;
}

serve(handler);