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

const generateCustomerEmailTemplate = (consultationData: ConsultationRequest, serviceTypeArabic: string, academicLevelArabic: string) => {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد طلب الاستشارة الأكاديمية - FekrahEdu</title>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'IBM Plex Sans Arabic', 'IBM Plex Sans Arabic', 'Amiri', system-ui, -apple-system, sans-serif;
          line-height: 1.6;
          color: #1a202c;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          direction: rtl;
          text-align: right;
          margin: 0;
          padding: 20px 0;
          animation: slideIn 1s ease-out;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .email-container {
          max-width: 700px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 35px 80px rgba(0, 0, 0, 0.2);
          direction: rtl;
          animation: pulse 8s infinite ease-in-out;
        }
        
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
          position: relative;
          padding: 60px 40px;
          text-align: center;
          overflow: hidden;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
          animation: rotate 25s linear infinite;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
        }
        
        .notification-badge {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          padding: 18px 35px;
          border-radius: 50px;
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 35px;
          display: inline-block;
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
          animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        .main-logo {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 56px;
          color: white;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          margin-bottom: 30px;
          animation: fadeInUp 1s ease-out 0.5s both;
        }
        
        .company-name {
          font-size: 36px;
          font-weight: 800;
          color: #ffffff;
          margin: 25px 0 12px;
          letter-spacing: 0.5px;
          text-shadow: 0 3px 6px rgba(0,0,0,0.3);
          animation: fadeInUp 1s ease-out 0.7s both;
        }
        
        .company-tagline {
          font-size: 20px;
          color: #e2e8f0;
          font-weight: 400;
          opacity: 0.95;
          margin-bottom: 30px;
          animation: fadeInUp 1s ease-out 0.9s both;
        }
        
        .service-badge {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 18px 35px;
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          animation: fadeInUp 1s ease-out 1.1s both;
        }
        
        .service-badge .icon {
          font-size: 28px;
        }
        
        .main-content {
          padding: 60px 40px;
        }
        
        .greeting-section {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 24px;
          padding: 40px;
          margin-bottom: 45px;
          border-right: 10px solid #0ea5e9;
          position: relative;
          animation: slideInRight 0.9s ease-out;
        }
        
        .greeting-section::before {
          content: '🎓';
          position: absolute;
          top: -20px;
          right: 30px;
          font-size: 40px;
          background: #0ea5e9;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .greeting-section h2 {
          font-size: 26px;
          color: #0c4a6e;
          margin-bottom: 25px;
          font-weight: 800;
          margin-top: 15px;
        }
        
        .greeting-section p {
          font-size: 19px;
          color: #1e293b;
          line-height: 1.8;
          margin: 0;
        }
        
        .customer-name {
          color: #1e40af;
          font-weight: 800;
          font-size: 22px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .details-section {
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          border-radius: 28px;
          padding: 45px;
          margin: 45px 0;
          border: 4px solid #fbbf24;
          position: relative;
          animation: slideInRight 0.9s ease-out 0.2s both;
        }
        
        .details-section::before {
          content: '📋';
          position: absolute;
          top: -25px;
          right: 35px;
          font-size: 48px;
          background: #fbbf24;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .details-section h3 {
          font-size: 28px;
          color: #92400e;
          margin-bottom: 35px;
          font-weight: 800;
          text-align: center;
          margin-top: 20px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
        }
        
        .detail-card {
          background: #ffffff;
          padding: 30px;
          border-radius: 20px;
          border-right: 8px solid #f59e0b;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .detail-card:hover {
          transform: translateX(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .detail-label {
          font-size: 15px;
          color: #92400e;
          font-weight: 800;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 18px;
          color: #1f2937;
          font-weight: 600;
          background: #f9fafb;
          padding: 15px 18px;
          border-radius: 12px;
          word-break: break-word;
          line-height: 1.6;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .steps-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 28px;
          padding: 45px;
          margin: 45px 0;
          border: 4px solid #22c55e;
          position: relative;
          animation: slideInRight 0.9s ease-out 0.4s both;
        }
        
        .steps-section::before {
          content: '⚡';
          position: absolute;
          top: -25px;
          right: 35px;
          font-size: 48px;
          background: #22c55e;
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .steps-section h3 {
          font-size: 28px;
          color: #15803d;
          margin-bottom: 35px;
          font-weight: 800;
          text-align: center;
          margin-top: 20px;
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
          margin: 25px 0;
          padding: 30px 35px 30px 90px;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          font-size: 18px;
          font-weight: 600;
          color: #064e3b;
          border-right: 8px solid #10b981;
          transition: transform 0.3s ease;
          animation: slideInRight 0.7s ease-out calc(0.7s + var(--delay, 0s)) both;
        }
        
        .steps-list li:nth-child(1) { --delay: 0.1s; }
        .steps-list li:nth-child(2) { --delay: 0.2s; }
        .steps-list li:nth-child(3) { --delay: 0.3s; }
        
        .steps-list li:hover {
          transform: translateX(-10px);
        }
        
        .steps-list li::before {
          content: counter(step-counter);
          position: absolute;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 20px;
          box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4);
        }
        
        .contact-section {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 28px;
          padding: 50px 40px;
          margin: 45px 0;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          animation: slideInRight 0.9s ease-out 0.6s both;
        }
        
        .contact-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b, #ef4444);
        }
        
        .contact-section h3 {
          font-size: 30px;
          margin-bottom: 35px;
          font-weight: 800;
          text-align: center;
          color: #ffffff;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }
        
        .contact-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 3px solid rgba(255, 255, 255, 0.2);
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        .contact-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.15);
        }
        
        .contact-card .icon {
          font-size: 32px;
          margin-bottom: 20px;
          display: block;
        }
        
        .contact-card .label {
          font-size: 15px;
          color: #cbd5e1;
          margin-bottom: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .contact-card .value {
          font-size: 18px;
          color: #ffffff;
          font-weight: 700;
        }
        
        .footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #94a3b8;
          padding: 70px 40px;
          text-align: center;
          position: relative;
        }
        
        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b, #ef4444, #22c55e);
        }
        
        .footer h4 {
          font-size: 32px;
          color: #ffffff;
          margin-bottom: 18px;
          font-weight: 800;
        }
        
        .footer-tagline {
          font-size: 20px;
          color: #cbd5e1;
          margin-bottom: 45px;
          font-style: italic;
        }
        
        .footer-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin: 45px 0;
        }
        
        .info-block {
          background: rgba(255, 255, 255, 0.05);
          padding: 30px;
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease;
        }
        
        .info-block:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.08);
        }
        
        .info-block h5 {
          color: #e2e8f0;
          font-size: 20px;
          margin-bottom: 18px;
          font-weight: 700;
        }
        
        .info-block p {
          font-size: 16px;
          color: #94a3b8;
          margin: 10px 0;
          line-height: 1.6;
        }
        
        .info-block a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        
        .info-block a:hover {
          color: #93c5fd;
        }
        
        .social-links {
          margin: 45px 0 35px;
        }
        
        .social-links a {
          display: inline-flex;
          width: 55px;
          height: 55px;
          background: rgba(255, 255, 255, 0.1);
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          margin: 0 12px;
          font-size: 22px;
          color: #cbd5e1;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .social-links a:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
          color: #ffffff;
        }
        
        .copyright {
          font-size: 15px;
          color: #64748b;
          margin-top: 35px;
          padding-top: 35px;
          border-top: 2px solid rgba(255, 255, 255, 0.1);
          line-height: 1.6;
        }
        
        @media only screen and (max-width: 768px) {
          body { padding: 10px 0; }
          .email-container { 
            margin: 0 10px; 
            border-radius: 24px; 
          }
          .header, .main-content, .footer { 
            padding: 40px 30px; 
          }
          .company-name { 
            font-size: 30px; 
          }
          .details-grid, .contact-grid { 
            grid-template-columns: 1fr; 
          }
          .steps-list li { 
            padding: 25px 30px 25px 80px; 
            font-size: 17px; 
          }
          .footer-info { 
            grid-template-columns: 1fr; 
          }
          .details-section, .steps-section, .contact-section {
            padding: 35px 30px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-content">
            <div class="notification-badge">
              ✅ تم استلام طلبكم بنجاح
            </div>
            <div class="main-logo">🎓</div>
            <h1 class="company-name">FekrahEdu</h1>
            <p class="company-tagline">FekrahEdu Agency - للخدمات الأكاديمية والبحثية المتخصصة</p>
            <div class="service-badge">
              <span class="icon">🎯</span>
              <span>استشارة أكاديمية متخصصة</span>
            </div>
          </div>
        </div>

        <div class="main-content">
          <div class="greeting-section">
            <h2>السلام عليكم ورحمة الله وبركاته</h2>
            <p>
              المحترم/ة <span class="customer-name">${consultationData.fullName}</span><br><br>
              نتقدم بجزيل الشكر لثقتكم الغالية في <strong>FekrahEdu</strong> ولاختياركم خدماتنا الأكاديمية والبحثية المتخصصة. يسعدنا إعلامكم بأنه تم استلام طلب الاستشارة الأكاديمية بنجاح، وسيقوم فريقنا المختص من الأكاديميين والخبراء بمراجعته والتواصل معكم في أقرب وقت ممكن.
            </p>
          </div>

          <div class="details-section">
            <h3>📋 ملخص تفاصيل طلبكم</h3>
            <div class="details-grid">
              <div class="detail-card">
                <div class="detail-label">🎯 نوع الخدمة المطلوبة</div>
                <div class="detail-value">${serviceTypeArabic}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-label">🎓 المستوى الأكاديمي</div>
                <div class="detail-value">${academicLevelArabic}</div>
              </div>
              
              ${consultationData.specialization ? `
              <div class="detail-card">
                <div class="detail-label">📚 التخصص الأكاديمي</div>
                <div class="detail-value">${consultationData.specialization}</div>
              </div>` : ''}
              
              ${consultationData.university ? `
              <div class="detail-card">
                <div class="detail-label">🏛️ الجامعة</div>
                <div class="detail-value">${consultationData.university}</div>
              </div>` : ''}
              
              ${consultationData.projectTitle ? `
              <div class="detail-card full-width">
                <div class="detail-label">📝 عنوان المشروع</div>
                <div class="detail-value">${consultationData.projectTitle}</div>
              </div>` : ''}
              
              ${consultationData.deadline ? `
              <div class="detail-card">
                <div class="detail-label">⏰ الموعد النهائي</div>
                <div class="detail-value">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</div>
              </div>` : ''}
              
              ${consultationData.projectDescription ? `
              <div class="detail-card full-width">
                <div class="detail-label">📄 وصف المشروع</div>
                <div class="detail-value">${consultationData.projectDescription}</div>
              </div>` : ''}
              
              ${consultationData.additionalNotes ? `
              <div class="detail-card full-width">
                <div class="detail-label">📌 ملاحظات إضافية</div>
                <div class="detail-value">${consultationData.additionalNotes}</div>
              </div>` : ''}
            </div>
          </div>

          <div class="steps-section">
            <h3>⚡ مراحل تنفيذ طلبكم</h3>
            <ul class="steps-list">
              <li>
                <strong>المراجعة والتقييم الأكاديمي</strong><br>
                مراجعة طلبكم من قبل فريق الخبراء الأكاديميين خلال 2-6 ساعات للتقييم الشامل
              </li>
              <li>
                <strong>التواصل والاستشارة المتخصصة</strong><br>
                التواصل معكم خلال 6-24 ساعة لمناقشة جميع جوانب المشروع الأكاديمي ومتطلباته
              </li>
              <li>
                <strong>عرض الخطة والسعر</strong><br>
                تقديم خطة عمل مفصلة وعرض سعر شامل مع الجدول الزمني للتسليم
              </li>
            </ul>
          </div>

          <div class="contact-section">
            <h3>📞 طرق التواصل معنا</h3>
            <div class="contact-grid">
              <div class="contact-card">
                <span class="icon">📧</span>
                <div class="label">البريد الإلكتروني</div>
                <div class="value">info@fekrahedu.com</div>
              </div>
              
              <div class="contact-card">
                <span class="icon">📱</span>
                <div class="label">الهاتف والواتساب</div>
                <div class="value">+966559600824</div>
              </div>
              
              <div class="contact-card">
                <span class="icon">🌐</span>
                <div class="label">الموقع الإلكتروني</div>
                <div class="value">www.fekrahedu.com</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <h4>FekrahEdu</h4>
          <p class="footer-tagline">"نحو التميز الأكاديمي والبحثي"</p>
          
          <div class="footer-info">
            <div class="info-block">
              <h5>🏢 معلومات الشركة</h5>
              <p>FekrahEdu للخدمات الأكاديمية</p>
              <p>المملكة العربية السعودية</p>
              <p>مرخصة من وزارة التجارة والاستثمار</p>
            </div>
            
            <div class="info-block">
              <h5>🎯 خدماتنا الأكاديمية</h5>
              <p>الاستشارات الأكاديمية والبحثية</p>
              <p>كتابة وتحرير الرسائل العلمية</p>
              <p>التحليل الإحصائي والبحثي</p>
            </div>
            
            <div class="info-block">
              <h5>⏰ أوقات العمل</h5>
              <p>السبت - الخميس: 9:00 ص - 7:00 م</p>
              <p>الجمعة: مغلق</p>
              <p>الدعم الأكاديمي متاح 24/7</p>
            </div>
            
            <div class="info-block">
              <h5>⚖️ الملكية الفكرية وحقوق النشر</h5>
              <p>جميع المحتويات والخدمات محمية بموجب قوانين الملكية الفكرية</p>
              <p>يُمنع منعاً باتاً نسخ أو استخدام المحتوى دون إذن مكتوب</p>
              <p>التصاميم والنماذج مملوكة حصرياً للوكالة</p>
              <p>حقوق الطبع والنشر محفوظة وفقاً للقوانين السعودية والدولية</p>
            </div>
          </div>
          
          <div class="social-links">
            <a href="#">📘</a>
            <a href="#">🐦</a>
            <a href="#">📸</a>
            <a href="#">💼</a>
            <a href="#">📺</a>
          </div>
          
          <div class="copyright">
            © 2024 FekrahEdu للخدمات الأكاديمية - جميع الحقوق محفوظة<br>
            <small>FekrahEdu Agency - All Rights Reserved</small><br>
            <small>ترخيص رقم: 1234567890 - وزارة التجارة والاستثمار - المملكة العربية السعودية</small><br><br>
            <strong style="color: #94a3b8;">⚖️ إشعار الملكية الفكرية:</strong><br>
            <small style="font-size: 12px; line-height: 1.5;">
              هذا المحتوى محمي بموجب قوانين حقوق الطبع والنشر والملكية الفكرية المحلية والدولية. 
              أي استخدام غير مصرح به يعرض المخالف للمساءلة القانونية.
              للاستفسار عن الحقوق والتراخيص، يرجى التواصل معنا.
            </small>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAdminEmailTemplate = (consultationData: ConsultationRequest, serviceTypeArabic: string, academicLevelArabic: string) => {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>طلب استشارة أكاديمية جديد - FekrahEdu</title>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'IBM Plex Sans Arabic', 'IBM Plex Sans Arabic', system-ui, -apple-system, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
          direction: rtl;
          text-align: right;
          margin: 0;
          padding: 20px 0;
          animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .email-container {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 35px 80px rgba(0, 0, 0, 0.25);
          animation: pulse 10s infinite ease-in-out;
        }
        
        .alert-header {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
          padding: 60px 40px;
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
        }
        
        .alert-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
          animation: rotate 20s linear infinite;
        }
        
        .alert-content {
          position: relative;
          z-index: 2;
        }
        
        .alert-icon {
          width: 120px;
          height: 120px;
          background: rgba(255, 255, 255, 0.2);
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 56px;
          margin-bottom: 30px;
          animation: pulse 2s infinite;
        }
        
        .alert-title {
          font-size: 40px;
          font-weight: 800;
          margin-bottom: 18px;
          text-shadow: 0 3px 6px rgba(0,0,0,0.3);
        }
        
        .alert-subtitle {
          font-size: 22px;
          color: #fecaca;
          font-weight: 500;
          margin-bottom: 35px;
        }
        
        .timestamp-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.2);
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 18px 30px;
          font-size: 18px;
          font-weight: 800;
          backdrop-filter: blur(15px);
        }
        
        .priority-section {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 5px solid #ef4444;
          border-radius: 28px;
          padding: 50px;
          margin: 50px;
          position: relative;
          animation: slideInRight 0.9s ease-out;
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .priority-section::before {
          content: '🎓';
          position: absolute;
          top: -30px;
          right: 40px;
          font-size: 60px;
          background: #ef4444;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 35px rgba(239, 68, 68, 0.4);
        }
        
        .priority-title {
          font-size: 32px;
          color: #dc2626;
          margin-bottom: 25px;
          font-weight: 800;
          text-align: center;
          margin-top: 25px;
        }
        
        .service-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 25px;
        }
        
        .service-icon {
          font-size: 56px;
          padding: 25px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          color: white;
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
        }
        
        .service-name {
          font-size: 34px;
          color: #1e40af;
          font-weight: 800;
          text-align: center;
        }
        
        .customer-section {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 28px;
          padding: 50px;
          margin: 50px;
          border: 5px solid #3b82f6;
          animation: slideInRight 0.9s ease-out 0.2s both;
        }
        
        .customer-section h3 {
          font-size: 30px;
          color: #1e40af;
          margin-bottom: 35px;
          font-weight: 800;
          text-align: center;
        }
        
        .customer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
        }
        
        .customer-info-card {
          background: #ffffff;
          padding: 35px;
          border-radius: 20px;
          border-right: 8px solid #3b82f6;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .customer-info-card:hover {
          transform: translateX(-8px);
        }
        
        .info-label {
          font-size: 15px;
          color: #1e40af;
          font-weight: 800;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .info-value {
          font-size: 19px;
          color: #1f2937;
          font-weight: 600;
          background: #f8fafc;
          padding: 15px 18px;
          border-radius: 12px;
          word-break: break-word;
        }
        
        .customer-name {
          color: #dc2626;
          font-size: 24px;
          font-weight: 800;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .order-details {
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          border-radius: 28px;
          padding: 50px;
          margin: 50px;
          border: 5px solid #f59e0b;
          animation: slideInRight 0.9s ease-out 0.4s both;
        }
        
        .order-details h3 {
          font-size: 30px;
          color: #92400e;
          margin-bottom: 35px;
          font-weight: 800;
          text-align: center;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }
        
        .detail-card {
          background: #ffffff;
          padding: 30px;
          border-radius: 18px;
          border-right: 8px solid #f59e0b;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .detail-card:hover {
          transform: translateX(-8px);
        }
        
        .detail-label {
          font-size: 14px;
          color: #92400e;
          font-weight: 800;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 17px;
          color: #1f2937;
          font-weight: 600;
          background: #f9fafb;
          padding: 12px 15px;
          border-radius: 10px;
          line-height: 1.6;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .action-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 28px;
          padding: 50px;
          margin: 50px;
          border: 5px solid #22c55e;
          text-align: center;
          animation: slideInRight 0.9s ease-out 0.6s both;
        }
        
        .action-section h3 {
          font-size: 30px;
          color: #15803d;
          margin-bottom: 30px;
          font-weight: 800;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 25px;
          flex-wrap: wrap;
        }
        
        .action-btn {
          padding: 18px 35px;
          border: none;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
        }
        
        .btn-secondary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }
        
        .action-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        
        .footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #94a3b8;
          padding: 60px 40px;
          text-align: center;
        }
        
        .footer::before {
          content: '';
          display: block;
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6);
          margin-bottom: 35px;
        }
        
        .footer h4 {
          font-size: 32px;
          color: #ffffff;
          margin-bottom: 18px;
          font-weight: 800;
        }
        
        .footer p {
          font-size: 18px;
          margin: 12px 0;
          line-height: 1.6;
        }
        
        .copyright {
          font-size: 15px;
          color: #64748b;
          margin-top: 35px;
          padding-top: 25px;
          border-top: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        @media only screen and (max-width: 768px) {
          body { padding: 10px 0; }
          .email-container { margin: 0 10px; border-radius: 24px; }
          .alert-header, .priority-section, .customer-section, .order-details, .action-section, .footer { 
            padding: 35px 30px; margin: 25px; 
          }
          .alert-title { font-size: 32px; }
          .customer-grid, .details-grid { grid-template-columns: 1fr; }
          .action-buttons { flex-direction: column; align-items: center; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="alert-header">
          <div class="alert-content">
            <div class="alert-icon">🚨</div>
            <h1 class="alert-title">تنبيه طلب أكاديمي جديد</h1>
            <p class="alert-subtitle">تم استلام طلب استشارة أكاديمية جديد يتطلب اتخاذ إجراء فوري</p>
            <div class="timestamp-badge">
              <span>⏰</span>
              <span>تاريخ الاستلام: ${new Date().toLocaleDateString('ar-SA')} - ${new Date().toLocaleTimeString('ar-SA')}</span>
            </div>
          </div>
        </div>

        <div class="priority-section">
          <h2 class="priority-title">طلب استشارة أكاديمية عالي الأولوية</h2>
          <div class="service-header">
            <div class="service-icon">🎯</div>
            <div class="service-name">${serviceTypeArabic}</div>
          </div>
        </div>

        <div class="customer-section">
          <h3>👤 معلومات الطالب/الباحث</h3>
          <div class="customer-grid">
            <div class="customer-info-card">
              <div class="info-label">👤 الاسم الكامل</div>
              <div class="info-value customer-name">${consultationData.fullName}</div>
            </div>
            
            <div class="customer-info-card">
              <div class="info-label">📧 البريد الإلكتروني</div>
              <div class="info-value">${consultationData.email}</div>
            </div>
            
            <div class="customer-info-card">
              <div class="info-label">📱 رقم الهاتف</div>
              <div class="info-value">${consultationData.phone}</div>
            </div>
            
            <div class="customer-info-card">
              <div class="info-label">🎓 المستوى الأكاديمي</div>
              <div class="info-value">${academicLevelArabic}</div>
            </div>
            
            ${consultationData.university ? `
            <div class="customer-info-card">
              <div class="info-label">🏛️ الجامعة</div>
              <div class="info-value">${consultationData.university}</div>
            </div>` : ''}
            
            ${consultationData.specialization ? `
            <div class="customer-info-card">
              <div class="info-label">📚 التخصص</div>
              <div class="info-value">${consultationData.specialization}</div>
            </div>` : ''}
          </div>
        </div>

        <div class="order-details">
          <h3>📋 تفاصيل الطلب الأكاديمي</h3>
          <div class="details-grid">
            <div class="detail-card">
              <div class="detail-label">🎯 نوع الخدمة</div>
              <div class="detail-value">${serviceTypeArabic}</div>
            </div>
            
            ${consultationData.projectTitle ? `
            <div class="detail-card full-width">
              <div class="detail-label">📝 عنوان المشروع</div>
              <div class="detail-value">${consultationData.projectTitle}</div>
            </div>` : ''}
            
            ${consultationData.deadline ? `
            <div class="detail-card">
              <div class="detail-label">⏰ الموعد النهائي</div>
              <div class="detail-value">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</div>
            </div>` : ''}
            
            ${consultationData.projectDescription ? `
            <div class="detail-card full-width">
              <div class="detail-label">📄 وصف المشروع</div>
              <div class="detail-value">${consultationData.projectDescription}</div>
            </div>` : ''}
            
            ${consultationData.additionalNotes ? `
            <div class="detail-card full-width">
              <div class="detail-label">📌 ملاحظات إضافية</div>
              <div class="detail-value">${consultationData.additionalNotes}</div>
            </div>` : ''}
          </div>
        </div>

        <div class="action-section">
          <h3>⚡ الإجراءات المطلوبة</h3>
          <p style="font-size: 20px; color: #15803d; margin-bottom: 30px; font-weight: 600;">
            يرجى اتخاذ الإجراء المناسب في أسرع وقت ممكن لضمان تقديم أفضل خدمة أكاديمية
          </p>
          <div class="action-buttons">
            <a href="tel:${consultationData.phone}" class="action-btn btn-primary">
              <span>📞</span>
              <span>اتصال فوري</span>
            </a>
            <a href="mailto:${consultationData.email}" class="action-btn btn-secondary">
              <span>📧</span>
              <span>إرسال رد أكاديمي</span>
            </a>
          </div>
        </div>

        <div class="footer">
          <h4>🏢 FekrahEdu</h4>
          <p>نظام إدارة الطلبات الأكاديمية والإشعارات</p>
          <p>للخدمات الأكاديمية والبحثية المتخصصة</p>
          <div class="copyright">
            © 2024 FekrahEdu - جميع الحقوق محفوظة<br>
            <small>هذه رسالة تلقائية من نظام إدارة الطلبات الأكاديمية</small>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Academic expertise inquiry function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: any = await req.json();
    const consultationData: ConsultationRequest =body;
    // 🆕 حفظ في صندوق الوارد الموحّد للوحة الإدارة
    try {
      const data: any = body;
      await supabaseAdmin.from("inbox_messages").insert({
        sender_name: (data.fullName || "زائر").toString().slice(0, 200),
        sender_email: (data.email || "unknown@fekrahedu.com").toString().slice(0, 200),
        sender_phone: (data.phone || null) ? data.phone.toString().slice(0, 50) : null,
        subject: (`استشارة خبرة أكاديمية - ${data.serviceType || data.specialization || ''}`).toString().slice(0, 300),
        message: (data.projectDescription || data.additionalNotes || data.projectTitle || 'استشارة خبرة أكاديمية' || "").toString().slice(0, 8000),
        form_type: "service_inquiry",
        service_type: data.serviceType ?? 'academic-expertise',
        source_page: typeof data.sourcePage === "string" ? data.sourcePage : null,
        priority: "high",
        status: "new",
        metadata: { project_title: data.projectTitle, university: data.university, academic_level: data.academicLevel, specialization: data.specialization, deadline: data.deadline },
      });
    } catch (inboxErr) {
      console.error("[inbox] failed to save:", inboxErr);
    }

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

    // Send customer confirmation email
    const customerEmailHtml = generateCustomerEmailTemplate(consultationData, serviceTypeArabic, academicLevelArabic);
    
    const customerEmailResponse = await resend.emails.send({
      from: "FekrahEdu <info@fekrahedu.com>",
      to: [consultationData.email],
      subject: `تأكيد طلب الاستشارة الأكاديمية - ${serviceTypeArabic}`,
      html: customerEmailHtml,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Send admin notification email
    const adminEmailHtml = generateAdminEmailTemplate(consultationData, serviceTypeArabic, academicLevelArabic);
    
    const adminEmailResponse = await resend.emails.send({
      from: "نظام الإشعارات الأكاديمية <info@fekrahedu.com>",
      to: ["info@fekrahedu.com"],
      subject: `🚨 طلب ${serviceTypeArabic} جديد من ${consultationData.fullName}`,
      html: adminEmailHtml,
    });

    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in academic expertise inquiry:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);