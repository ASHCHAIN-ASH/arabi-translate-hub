import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ServiceInquiry {
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  projectDetails?: string;
  deadline?: string;
  budget?: string;
  fileSize?: string;
  additionalNotes?: string;
}

const serviceNames: { [key: string]: string } = {
  'text-translation': 'ترجمة النصوص الفورية',
  'audio-translation': 'الترجمة الصوتية الذكية',
  'video-translation': 'ترجمة الفيديو الاحترافية',
  'website-translation': 'ترجمة المواقع الإلكترونية',
  'custom-services': 'الخدمات المخصصة',
  'academic-translation': 'الترجمة الأكاديمية',
  'business-translation': 'ترجمة الأعمال التجارية',
  'legal-translation': 'الترجمة القانونية',
  'medical-translation': 'الترجمة الطبية',
  'technical-translation': 'الترجمة التقنية',
  'literary-translation': 'الترجمة الأدبية',
  'media-translation': 'ترجمة الإعلام'
};

const serviceIcons: { [key: string]: string } = {
  'text-translation': '📝',
  'audio-translation': '🎧',
  'video-translation': '🎬',
  'website-translation': '🌐',
  'custom-services': '⚙️',
  'academic-translation': '🎓',
  'business-translation': '💼',
  'legal-translation': '⚖️',
  'medical-translation': '🏥',
  'technical-translation': '🔧',
  'literary-translation': '📚',
  'media-translation': '📺'
};

const generateCustomerEmailTemplate = (inquiry: ServiceInquiry, serviceName: string, serviceIcon: string) => {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد استلام طلبكم - وكالة ماستر إيدو باث</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.7;
          color: #1a365d;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          direction: rtl;
          text-align: right;
          margin: 0;
          padding: 20px 0;
        }
        
        .email-container {
          max-width: 700px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          direction: rtl;
        }
        
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #581c87 100%);
          position: relative;
          padding: 45px 40px 35px;
          text-align: center;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
          opacity: 0.3;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
        }
        
        .main-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          color: white;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          margin-bottom: 25px;
        }
        
        .company-name {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          margin: 20px 0 8px;
          letter-spacing: 0.5px;
        }
        
        .company-tagline {
          font-size: 16px;
          color: #e2e8f0;
          font-weight: 400;
          opacity: 0.95;
          margin-bottom: 25px;
        }
        
        .service-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          padding: 12px 24px;
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
        }
        
        .service-badge .icon {
          font-size: 20px;
          margin-left: 12px;
        }
        
        .main-content {
          padding: 50px 40px;
        }
        
        .greeting {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 35px;
          border-right: 6px solid #0ea5e9;
          position: relative;
        }
        
        .greeting h2 {
          font-size: 22px;
          color: #0c4a6e;
          margin-bottom: 15px;
          font-weight: 700;
        }
        
        .greeting p {
          font-size: 17px;
          color: #0f172a;
          line-height: 1.8;
          margin: 0;
        }
        
        .customer-name {
          color: #1e40af;
          font-weight: 700;
          font-size: 19px;
        }
        
        .details-card {
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          border-radius: 20px;
          padding: 35px;
          margin: 35px 0;
          border: 2px solid #fbbf24;
          position: relative;
        }
        
        .details-card h3 {
          font-size: 20px;
          color: #92400e;
          margin-bottom: 25px;
          font-weight: 700;
          text-align: center;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        
        .detail-item {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          border-right: 4px solid #f59e0b;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        
        .detail-label {
          font-size: 14px;
          color: #92400e;
          font-weight: 600;
          margin-bottom: 8px;
          display: block;
        }
        
        .detail-value {
          font-size: 16px;
          color: #1f2937;
          font-weight: 700;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .steps-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 20px;
          padding: 35px;
          margin: 35px 0;
          border: 2px solid #22c55e;
        }
        
        .steps-section h3 {
          font-size: 20px;
          color: #15803d;
          margin-bottom: 25px;
          font-weight: 700;
          text-align: center;
        }
        
        .steps-list {
          list-style: none;
          padding: 0;
          margin: 0;
          counter-reset: step-counter;
        }
        
        .steps-list li {
          counter-increment: step-counter;
          background: #ffffff;
          margin: 16px 0;
          padding: 20px 25px 20px 70px;
          border-radius: 14px;
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          font-size: 16px;
          font-weight: 600;
          color: #064e3b;
          border-right: 4px solid #10b981;
        }
        
        .steps-list li::before {
          content: counter(step-counter);
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
        }
        
        .contact-section {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 20px;
          padding: 40px;
          margin: 35px 0;
          color: #ffffff;
          position: relative;
          overflow: hidden;
        }
        
        .contact-section h3 {
          font-size: 22px;
          margin-bottom: 25px;
          font-weight: 700;
          text-align: center;
          color: #ffffff;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .contact-item {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 20px;
          border-radius: 14px;
          text-align: center;
        }
        
        .contact-item .icon {
          font-size: 24px;
          margin-bottom: 10px;
          display: block;
        }
        
        .contact-item .label {
          font-size: 14px;
          color: #cbd5e1;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .contact-item .value {
          font-size: 15px;
          color: #ffffff;
          font-weight: 700;
        }
        
        .footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #94a3b8;
          padding: 50px 40px;
          text-align: center;
          position: relative;
        }
        
        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b);
        }
        
        .footer h4 {
          font-size: 24px;
          color: #ffffff;
          margin-bottom: 10px;
          font-weight: 700;
        }
        
        .footer-tagline {
          font-size: 16px;
          color: #cbd5e1;
          margin-bottom: 30px;
          font-style: italic;
        }
        
        .footer-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        
        .info-block {
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .info-block h5 {
          color: #e2e8f0;
          font-size: 16px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        
        .info-block p {
          font-size: 14px;
          color: #94a3b8;
          margin: 6px 0;
          line-height: 1.6;
        }
        
        .info-block a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
        }
        
        .social-links {
          margin: 30px 0 20px;
        }
        
        .social-links a {
          display: inline-flex;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          margin: 0 8px;
          font-size: 18px;
          color: #cbd5e1;
          text-decoration: none;
        }
        
        .copyright {
          font-size: 13px;
          color: #64748b;
          margin-top: 25px;
          padding-top: 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        @media only screen and (max-width: 768px) {
          body { padding: 10px 0; }
          .email-container { margin: 0 10px; border-radius: 16px; }
          .header, .main-content, .footer { padding: 30px 25px; }
          .company-name { font-size: 24px; }
          .details-grid, .contact-grid { grid-template-columns: 1fr; }
          .steps-list li { padding: 16px 20px 16px 60px; font-size: 15px; }
          .footer-info { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-content">
            <div class="main-logo">🎓</div>
            <h1 class="company-name">وكالة ماستر إيدو باث</h1>
            <p class="company-tagline">Master Edu Path Agency</p>
            <div class="service-badge">
              <span class="icon">${serviceIcon}</span>
              <span>تأكيد استلام طلب ${serviceName}</span>
            </div>
          </div>
        </div>

        <div class="main-content">
          <div class="greeting">
            <h2>السلام عليكم ورحمة الله وبركاته</h2>
            <p>
              المحترم/ة <span class="customer-name">${inquiry.name}</span><br>
              نشكركم لثقتكم الغالية في خدماتنا المتميزة، ويسعدنا إعلامكم بأنه تم استلام طلبكم بنجاح وسيتم التعامل معه بأقصى درجات الاحترافية والسرعة.
            </p>
          </div>

          <div class="details-card">
            <h3>تفاصيل طلبكم المُستلم</h3>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">الاسم الكامل</span>
                <div class="detail-value">${inquiry.name}</div>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">البريد الإلكتروني</span>
                <div class="detail-value">${inquiry.email}</div>
              </div>
              
              ${inquiry.phone ? `
              <div class="detail-item">
                <span class="detail-label">رقم الهاتف</span>
                <div class="detail-value">${inquiry.phone}</div>
              </div>
              ` : ''}
              
              <div class="detail-item">
                <span class="detail-label">نوع الخدمة</span>
                <div class="detail-value">${serviceName}</div>
              </div>
              
              ${inquiry.sourceLanguage ? `
              <div class="detail-item">
                <span class="detail-label">من اللغة</span>
                <div class="detail-value">${inquiry.sourceLanguage}</div>
              </div>
              ` : ''}
              
              ${inquiry.targetLanguage ? `
              <div class="detail-item">
                <span class="detail-label">إلى اللغة</span>
                <div class="detail-value">${inquiry.targetLanguage}</div>
              </div>
              ` : ''}
              
              ${inquiry.deadline ? `
              <div class="detail-item">
                <span class="detail-label">الموعد المطلوب</span>
                <div class="detail-value">${inquiry.deadline}</div>
              </div>
              ` : ''}
              
              ${inquiry.budget ? `
              <div class="detail-item">
                <span class="detail-label">الميزانية المتوقعة</span>
                <div class="detail-value">${inquiry.budget}</div>
              </div>
              ` : ''}
            </div>
          </div>

          <div class="steps-section">
            <h3>الخطوات التالية في رحلة خدمتكم</h3>
            <ul class="steps-list">
              <li>مراجعة شاملة ودقيقة لتفاصيل طلبكم من قبل فريق الخبراء المتخصصين</li>
              <li>التواصل المباشر معكم خلال 4 ساعات كحد أقصى لمناقشة التفاصيل</li>
              <li>إعداد عرض سعر مفصل وخطة زمنية واضحة ومدروسة</li>
              <li>بدء العمل فور موافقتكم وفق أعلى معايير الجودة العالمية</li>
              <li>تسليم النتائج النهائية بجودة استثنائية في الموعد المحدد</li>
            </ul>
          </div>

          <div class="contact-section">
            <h3>🌟 طرق التواصل المباشر معنا</h3>
            <div class="contact-grid">
              <div class="contact-item">
                <span class="icon">📧</span>
                <div class="label">البريد الإلكتروني</div>
                <div class="value">info@masteredupath.com</div>
              </div>
              
              <div class="contact-item">
                <span class="icon">📱</span>
                <div class="label">الواتساب</div>
                <div class="value">+966 50 505 0505</div>
              </div>
              
              <div class="contact-item">
                <span class="icon">🌐</span>
                <div class="label">الموقع الإلكتروني</div>
                <div class="value">www.masteredupath.com</div>
              </div>
              
              <div class="contact-item">
                <span class="icon">⏰</span>
                <div class="label">خدمة العملاء</div>
                <div class="value">متاحة 24/7</div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          <h4>وكالة ماستر إيدو باث</h4>
          <p class="footer-tagline">شريكك الموثوق في التميز الأكاديمي والمهني</p>
          
          <div class="footer-info">
            <div class="info-block">
              <h5>معلومات التواصل</h5>
              <p>📧 <a href="mailto:info@masteredupath.com">info@masteredupath.com</a></p>
              <p>📧 <a href="mailto:support@masteredupath.com">support@masteredupath.com</a></p>
              <p>📱 <a href="https://wa.me/966505050505">+966 50 505 0505</a></p>
            </div>
            
            <div class="info-block">
              <h5>العنوان الرسمي</h5>
              <p>المملكة العربية السعودية</p>
              <p>الرياض - حي الملقا</p>
              <p>طريق الملك فهد - مجمع الأعمال</p>
              <p>الدور الثالث - مكتب 301</p>
            </div>
          </div>
          
          <div class="social-links">
            <a href="https://twitter.com/masteredupath">🐦</a>
            <a href="https://linkedin.com/company/masteredupath">💼</a>
            <a href="https://instagram.com/masteredupath">📷</a>
            <a href="https://www.masteredupath.com">🌐</a>
          </div>
          
          <div class="copyright">
            <p>&copy; ${new Date().getFullYear()} وكالة ماستر إيدو باث. جميع الحقوق محفوظة.</p>
            <p>ترخيص وزارة التجارة رقم: 1010123456 | ISO 27001 Certified</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAdminEmailTemplate = (inquiry: ServiceInquiry, serviceName: string, serviceIcon: string) => {
  const priority = 'normal'; // Default priority
  const priorityConfig = {
    urgent: { color: '#dc2626', bgColor: '#fef2f2', icon: '🚨', label: 'عاجل جداً', borderColor: '#ef4444' },
    high: { color: '#ea580c', bgColor: '#fff7ed', icon: '⚡', label: 'أولوية عالية', borderColor: '#f97316' },
    normal: { color: '#059669', bgColor: '#f0fdf4', icon: '📋', label: 'أولوية عادية', borderColor: '#10b981' }
  };
  const prioritySettings = priorityConfig[priority] || priorityConfig.normal;
  
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تنبيه إداري: طلب جديد - وكالة ماستر إيدو باث</title>
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
          direction: rtl;
        }
        
        .alert-header {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
          position: relative;
          padding: 40px;
          text-align: center;
          overflow: hidden;
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
          color: #ffffff;
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
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
        }
        
        .priority-section {
          background: ${prioritySettings.bgColor};
          border: 3px solid ${prioritySettings.borderColor};
          border-radius: 20px;
          padding: 30px;
          margin: 30px 40px;
          position: relative;
        }
        
        .priority-section::before {
          content: '${prioritySettings.icon}';
          position: absolute;
          top: -18px;
          right: 25px;
          font-size: 32px;
          background: ${prioritySettings.borderColor};
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .priority-title {
          font-size: 24px;
          color: ${prioritySettings.color};
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
          display: flex;
          align-items: center;
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
          .alert-header, .priority-section, .customer-section, .order-details, .actions-section, .admin-footer { padding: 25px; margin: 20px 15px; }
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
          <p class="alert-subtitle">طلب جديد يتطلب المراجعة الفورية</p>
          <div class="timestamp-badge">
            <span>تم الاستلام: ${new Date().toLocaleString('ar-SA')}</span>
          </div>
        </div>

        <div class="priority-section">
          <h2 class="priority-title">مستوى الأولوية: ${prioritySettings.label}</h2>
          <div class="service-header">
            <div class="service-icon">${serviceIcon}</div>
            <div class="service-name">${serviceName}</div>
          </div>
        </div>

        <div class="customer-section">
          <h3>معلومات العميل الكاملة</h3>
          <div class="customer-grid">
            <div class="customer-info-item">
              <div class="info-label">اسم العميل</div>
              <div class="info-value customer-name">${inquiry.name}</div>
            </div>
            
            <div class="customer-info-item">
              <div class="info-label">البريد الإلكتروني</div>
              <div class="info-value">${inquiry.email}</div>
            </div>
            
            ${inquiry.phone ? `
            <div class="customer-info-item">
              <div class="info-label">رقم الهاتف</div>
              <div class="info-value">${inquiry.phone}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="order-details">
          <h3>تفاصيل الطلب المُستلم</h3>
          <div class="details-grid">
            <div class="detail-card">
              <div class="detail-label">نوع الخدمة</div>
              <div class="detail-value">${serviceName}</div>
            </div>
            
            <div class="detail-card">
              <div class="detail-label">مستوى الأولوية</div>
              <div class="detail-value">${prioritySettings.label}</div>
            </div>
            
            ${inquiry.budget ? `
            <div class="detail-card">
              <div class="detail-label">الميزانية المتوقعة</div>
              <div class="detail-value">${inquiry.budget}</div>
            </div>
            ` : ''}
            
            ${inquiry.deadline ? `
            <div class="detail-card">
              <div class="detail-label">الموعد النهائي</div>
              <div class="detail-value">${inquiry.deadline}</div>
            </div>
            ` : ''}
          </div>
        </div>

        <div class="actions-section">
          <h3 class="actions-title">الإجراءات المطلوبة</h3>
          <div class="action-buttons">
            <a href="mailto:${inquiry.email}" class="action-btn primary">
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
            <p>نوع التنبيه: طلب خدمة جديد - ${prioritySettings.label}</p>
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
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const inquiry: ServiceInquiry = await req.json();
    
    console.log("Received service inquiry:", inquiry);

    // Validate required fields
    if (!inquiry.serviceType || !inquiry.name || !inquiry.email || !inquiry.phone) {
      return new Response(
        JSON.stringify({ error: "الرجاء ملء جميع الحقول المطلوبة" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const serviceName = serviceNames[inquiry.serviceType] || inquiry.serviceType;
    const serviceIcon = serviceIcons[inquiry.serviceType] || '⚙️';

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      to: [inquiry.email],
      subject: `✅ تأكيد استلام طلبك - ${serviceName}`,
      html: generateCustomerEmailTemplate(inquiry, serviceName, serviceIcon),
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Master Edu Path System <info@masteredupath.com>",
      to: ["info@masteredupath.com"],
      subject: `🚨 طلب جديد عاجل: ${serviceName} من ${inquiry.name}`,
      html: generateAdminEmailTemplate(inquiry, serviceName, serviceIcon),
    });

    console.log("Customer email sent:", customerEmailResponse);
    console.log("Admin email sent:", adminEmailResponse);

    if (customerEmailResponse.error || adminEmailResponse.error) {
      console.error("Email sending error:", {
        customerError: customerEmailResponse.error,
        adminError: adminEmailResponse.error
      });
      
      return new Response(
        JSON.stringify({ error: "حدث خطأ في إرسال الإيميل، يرجى المحاولة مرة أخرى" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح! سنتواصل معك خلال 4 ساعات.",
        serviceName: serviceName
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in send-service-inquiry function:", error);
    return new Response(
      JSON.stringify({ error: "حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);