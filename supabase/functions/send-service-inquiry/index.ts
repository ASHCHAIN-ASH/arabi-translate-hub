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

interface ServiceInquiry {
  serviceType: string;
  serviceName?: string;
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
  attachmentCount?: number;
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
  'media-translation': 'ترجمة الإعلام',
  'plagiarism_check': 'فحص الانتحال',
  'thesis_titles': 'اقتراح عناوين الرسائل',
  'training_courses': 'الدورات التدريبية',
  'formatting': 'التنسيق الأكاديمي',
  'research_evaluation': 'تقييم البحوث',
  'academic_consultation': 'الاستشارات الأكاديمية',
  'references': 'إعداد المراجع',
  'publication': 'النشر العلمي',
  'research_tools': 'أدوات البحث العلمي'
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
  'media-translation': '📺',
  'plagiarism_check': '🔍',
  'thesis_titles': '💡',
  'training_courses': '📖',
  'formatting': '📋',
  'research_evaluation': '⚖️',
  'academic_consultation': '👨‍🏫',
  'references': '📚',
  'publication': '📄',
  'research_tools': '🔬'
};

const generateCustomerEmailTemplate = (inquiry: ServiceInquiry, serviceName: string, serviceIcon: string) => {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد استلام طلبكم - FekrahEdu</title>
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
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 50%, #2b77cb 100%);
          direction: rtl;
          text-align: right;
          margin: 0;
          padding: 20px 0;
          animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .email-container {
          max-width: 680px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.2);
          direction: rtl;
          animation: pulse 6s infinite ease-in-out;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          padding: 50px 40px;
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
          animation: rotate 20s linear infinite;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
        }
        
        .notification-badge {
          background: linear-gradient(45deg, #48bb78, #38a169);
          color: white;
          padding: 15px 30px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 30px;
          display: inline-block;
          box-shadow: 0 10px 25px rgba(72, 187, 120, 0.4);
          animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        .main-logo {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: white;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
          margin-bottom: 25px;
          animation: fadeInUp 1s ease-out 0.5s both;
        }
        
        .company-name {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          margin: 20px 0 10px;
          letter-spacing: 0.5px;
          animation: fadeInUp 1s ease-out 0.7s both;
        }
        
        .company-tagline {
          font-size: 18px;
          color: #e2e8f0;
          font-weight: 400;
          opacity: 0.95;
          margin-bottom: 25px;
          animation: fadeInUp 1s ease-out 0.9s both;
        }
        
        .service-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 15px 30px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 600;
          animation: fadeInUp 1s ease-out 1.1s both;
        }
        
        .service-badge .icon {
          font-size: 24px;
        }
        
        .main-content {
          padding: 50px 40px;
        }
        
        .greeting-section {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 20px;
          padding: 35px;
          margin-bottom: 40px;
          border-right: 8px solid #0ea5e9;
          position: relative;
          animation: slideInRight 0.8s ease-out;
        }
        
        .greeting-section::before {
          content: '👋';
          position: absolute;
          top: -15px;
          right: 25px;
          font-size: 30px;
          background: #0ea5e9;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .greeting-section h2 {
          font-size: 24px;
          color: #0c4a6e;
          margin-bottom: 20px;
          font-weight: 800;
        }
        
        .greeting-section p {
          font-size: 18px;
          color: #1e293b;
          line-height: 1.8;
          margin: 0;
        }
        
        .customer-name {
          color: #1e40af;
          font-weight: 800;
          font-size: 20px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .details-section {
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          border-radius: 24px;
          padding: 40px;
          margin: 40px 0;
          border: 3px solid #fbbf24;
          position: relative;
          animation: slideInRight 0.8s ease-out 0.2s both;
        }
        
        .details-section::before {
          content: '📋';
          position: absolute;
          top: -18px;
          right: 30px;
          font-size: 36px;
          background: #fbbf24;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .details-section h3 {
          font-size: 24px;
          color: #92400e;
          margin-bottom: 30px;
          font-weight: 800;
          text-align: center;
          margin-top: 10px;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .detail-card {
          background: #ffffff;
          padding: 25px;
          border-radius: 16px;
          border-right: 6px solid #f59e0b;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .detail-card:hover {
          transform: translateX(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }
        
        .detail-label {
          font-size: 14px;
          color: #92400e;
          font-weight: 700;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
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
          word-break: break-word;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .download-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
          text-align: center;
          border: 2px solid #22c55e;
        }
        
        .download-link {
          display: inline-block;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 25px;
          font-weight: 600;
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
          transition: transform 0.3s ease;
        }
        
        .download-link:hover {
          transform: translateY(-2px);
        }
        
        .steps-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 24px;
          padding: 40px;
          margin: 40px 0;
          border: 3px solid #22c55e;
          position: relative;
          animation: slideInRight 0.8s ease-out 0.4s both;
        }
        
        .steps-section::before {
          content: '🚀';
          position: absolute;
          top: -18px;
          right: 30px;
          font-size: 36px;
          background: #22c55e;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .steps-section h3 {
          font-size: 24px;
          color: #15803d;
          margin-bottom: 30px;
          font-weight: 800;
          text-align: center;
          margin-top: 10px;
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
          margin: 20px 0;
          padding: 25px 30px 25px 80px;
          border-radius: 16px;
          position: relative;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          font-size: 17px;
          font-weight: 600;
          color: #064e3b;
          border-right: 6px solid #10b981;
          transition: transform 0.3s ease;
          animation: slideInRight 0.6s ease-out calc(0.6s + var(--delay, 0s)) both;
        }
        
        .steps-list li:nth-child(1) { --delay: 0.1s; }
        .steps-list li:nth-child(2) { --delay: 0.2s; }
        .steps-list li:nth-child(3) { --delay: 0.3s; }
        .steps-list li:nth-child(4) { --delay: 0.4s; }
        
        .steps-list li:hover {
          transform: translateX(-8px);
        }
        
        .steps-list li::before {
          content: counter(step-counter);
          position: absolute;
          right: 25px;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
        
        .contact-section {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 24px;
          padding: 50px 40px;
          margin: 40px 0;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          animation: slideInRight 0.8s ease-out 0.6s both;
        }
        
        .contact-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b);
        }
        
        .contact-section h3 {
          font-size: 26px;
          margin-bottom: 30px;
          font-weight: 800;
          text-align: center;
          color: #ffffff;
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .contact-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          padding: 25px;
          border-radius: 16px;
          text-align: center;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        .contact-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.15);
        }
        
        .contact-card .icon {
          font-size: 28px;
          margin-bottom: 15px;
          display: block;
        }
        
        .contact-card .label {
          font-size: 14px;
          color: #cbd5e1;
          margin-bottom: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .contact-card .value {
          font-size: 16px;
          color: #ffffff;
          font-weight: 700;
        }
        
        .footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #94a3b8;
          padding: 50px 40px;
          text-align: center;
        }
        
        .footer::before {
          content: '';
          display: block;
          width: 100%;
          height: 6px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b, #22c55e);
          margin-bottom: 30px;
        }
        
        .footer h4 {
          font-size: 28px;
          color: #ffffff;
          margin-bottom: 10px;
          font-weight: 800;
        }
        
        .footer-tagline {
          font-size: 18px;
          color: #3b82f6;
          margin-bottom: 40px;
          font-weight: 600;
          font-style: italic;
        }
        
        .footer-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .info-block {
          background: rgba(255, 255, 255, 0.05);
          padding: 25px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .info-block h5 {
          color: #ffffff;
          font-size: 18px;
          margin-bottom: 15px;
          font-weight: 700;
        }
        
        .info-block p {
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .social-links a {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .social-links a:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }
        
        .copyright {
          font-size: 13px;
          line-height: 1.8;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 25px;
        }
        
        @media (max-width: 768px) {
          .email-container { margin: 10px; }
          .header { padding: 30px 20px; }
          .main-content { padding: 30px 20px; }
          .company-name { font-size: 26px; }
          .details-grid { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; }
          .footer-info { grid-template-columns: 1fr; }
          .social-links { flex-wrap: wrap; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="header-content">
            <div class="notification-badge">✅ تم استلام طلبكم بنجاح</div>
            <div class="main-logo">🎓</div>
            <h1 class="company-name">FekrahEdu</h1>
            <p class="company-tagline">للخدمات الأكاديمية والترجمة المتخصصة</p>
            <div class="service-badge">
              <span class="icon">${serviceIcon}</span>
              <span>${serviceName}</span>
            </div>
          </div>
        </div>
        
        <div class="main-content">
          <div class="greeting-section">
            <h2>أهلاً وسهلاً <span class="customer-name">${inquiry.name}</span></h2>
            <p>
              نشكركم على ثقتكم في خدماتنا. لقد تم استلام طلبكم بنجاح وسيتم مراجعته من قبل فريقنا المتخصص.
              سنتواصل معكم خلال الساعات القادمة لمناقشة جميع التفاصيل وتقديم عرض مفصل ومخصص لاحتياجاتكم.
            </p>
          </div>

          <div class="details-section">
            <h3>📋 تفاصيل طلبكم</h3>
            <div class="details-grid">
              <div class="detail-card">
                <div class="detail-label">👤 اسم العميل</div>
                <div class="detail-value">${inquiry.name}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-label">📧 البريد الإلكتروني</div>
                <div class="detail-value">${inquiry.email}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-label">📱 رقم الهاتف</div>
                <div class="detail-value">${inquiry.phone}</div>
              </div>
              
              <div class="detail-card">
                <div class="detail-label">${serviceIcon} نوع الخدمة</div>
                <div class="detail-value">${serviceName}</div>
              </div>
              
              ${inquiry.sourceLanguage ? `
              <div class="detail-card">
                <div class="detail-label">🌍 ترجمة من</div>
                <div class="detail-value">${inquiry.sourceLanguage}</div>
              </div>` : ''}
              
              ${inquiry.targetLanguage ? `
              <div class="detail-card">
                <div class="detail-label">🌍 ترجمة إلى</div>
                <div class="detail-value">${inquiry.targetLanguage}</div>
              </div>` : ''}
              
              ${inquiry.fileSize ? `
              <div class="detail-card">
                <div class="detail-label">📏 حجم المشروع</div>
                <div class="detail-value">${inquiry.fileSize}</div>
              </div>` : ''}
              
              ${inquiry.deadline ? `
              <div class="detail-card">
                <div class="detail-label">⏰ الموعد النهائي</div>
                <div class="detail-value">${inquiry.deadline}</div>
              </div>` : ''}
              
              ${inquiry.budget ? `
              <div class="detail-card">
                <div class="detail-label">💰 الميزانية المتوقعة</div>
                <div class="detail-value">${inquiry.budget}</div>
              </div>` : ''}
              
              ${inquiry.projectDetails ? `
              <div class="detail-card full-width">
                <div class="detail-label">📝 تفاصيل المشروع</div>
                <div class="detail-value">${inquiry.projectDetails}</div>
              </div>` : ''}
              
              ${inquiry.additionalNotes ? `
              <div class="detail-card full-width">
                <div class="detail-label">📌 ملاحظات إضافية</div>
                <div class="detail-value">${inquiry.additionalNotes}</div>
              </div>` : ''}
              
              ${inquiry.attachmentCount && inquiry.attachmentCount > 0 ? `
              <div class="detail-card">
                <div class="detail-label">📎 المرفقات</div>
                <div class="detail-value">${inquiry.attachmentCount} ملف مرفق</div>
              </div>` : ''}
            </div>
            
            <!-- رابط تحميل نموذج للعميل -->
            <div class="download-section">
              <h4 style="color: #15803d; margin-bottom: 15px; font-size: 20px;">📥 نماذج مرجعية للخدمة</h4>
              <p style="color: #22543d; margin-bottom: 20px;">يمكنكم تحميل النماذج المرجعية لفهم أفضل لجودة خدماتنا</p>
              <a href="https://drive.google.com/drive/folders/example" class="download-link">
                📥 تحميل النماذج المرجعية
              </a>
            </div>
          </div>

          <div class="steps-section">
            <h3>🚀 مراحل تنفيذ طلبكم</h3>
            <ul class="steps-list">
              <li>
                <strong>المراجعة والتقييم الأولي</strong><br>
                سيتم مراجعة طلبكم من قبل فريق متخصص خلال 2-4 ساعات للتقييم الأولي
              </li>
              <li>
                <strong>التواصل والاستشارة</strong><br>
                سنتواصل معكم خلال 6-12 ساعة لمناقشة جميع التفاصيل ومتطلبات المشروع
              </li>
              <li>
                <strong>عرض السعر والجدول الزمني</strong><br>
                إرسال عرض سعر شامل ومفصل مع الجدول الزمني للتسليم والمراحل
              </li>
              <li>
                <strong>بدء العمل والتنفيذ</strong><br>
                البدء الفوري في تنفيذ المشروع فور الموافقة والاتفاق على الشروط
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
          <p class="footer-tagline">"نحو التميز الأكاديمي والمهني"</p>
          
          <div class="footer-info">
            <div class="info-block">
              <h5>🏢 معلومات الشركة</h5>
              <p>FekrahEdu للخدمات الأكاديمية</p>
              <p>المملكة العربية السعودية</p>
              <p>مرخصة من وزارة التجارة والاستثمار</p>
            </div>
            
            <div class="info-block">
              <h5>🎯 خدماتنا</h5>
              <p>الترجمة الأكاديمية والمتخصصة</p>
              <p>الاستشارات البحثية والأكاديمية</p>
              <p>خدمات الكتابة والتحرير العلمي</p>
            </div>
            
            <div class="info-block">
              <h5>⏰ أوقات العمل</h5>
              <p>السبت - الخميس: 9:00 ص - 6:00 م</p>
              <p>الجمعة: مغلق</p>
              <p>دعم العملاء 24/7</p>
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

const generateAdminEmailTemplate = (inquiry: ServiceInquiry, serviceName: string, serviceIcon: string) => {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>طلب خدمة جديد - FekrahEdu</title>
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
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
          direction: rtl;
          text-align: right;
          margin: 0;
          padding: 20px 0;
          animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .email-container {
          max-width: 750px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.25);
          animation: pulse 8s infinite ease-in-out;
        }
        
        .alert-header {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%);
          padding: 50px 40px;
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
          animation: rotate 15s linear infinite;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .alert-content {
          position: relative;
          z-index: 2;
        }
        
        .alert-icon {
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.2);
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          margin-bottom: 25px;
          animation: pulse 2s infinite;
        }
        
        .alert-title {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 15px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .alert-subtitle {
          font-size: 20px;
          color: #fecaca;
          font-weight: 500;
          margin-bottom: 30px;
        }
        
        .timestamp-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          padding: 15px 25px;
          font-size: 16px;
          font-weight: 700;
          backdrop-filter: blur(10px);
        }
        
        .priority-section {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 4px solid #ef4444;
          border-radius: 24px;
          padding: 40px;
          margin: 40px;
          position: relative;
          animation: slideInRight 0.8s ease-out;
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .priority-section::before {
          content: '🚨';
          position: absolute;
          top: -25px;
          right: 35px;
          font-size: 48px;
          background: #ef4444;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4);
        }
        
        .priority-title {
          font-size: 28px;
          color: #dc2626;
          margin-bottom: 20px;
          font-weight: 800;
          text-align: center;
          margin-top: 20px;
        }
        
        .service-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .service-icon {
          font-size: 48px;
          padding: 20px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 50%;
          color: white;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
        }
        
        .service-name {
          font-size: 30px;
          color: #1e40af;
          font-weight: 800;
          text-align: center;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .customer-section {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-radius: 24px;
          padding: 40px;
          margin: 40px;
          border: 4px solid #3b82f6;
          animation: slideInRight 0.8s ease-out 0.2s both;
        }
        
        .customer-section h3 {
          font-size: 26px;
          color: #1e40af;
          margin-bottom: 30px;
          font-weight: 800;
          text-align: center;
        }
        
        .customer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }
        
        .customer-info-card {
          background: #ffffff;
          padding: 30px;
          border-radius: 16px;
          border-right: 6px solid #3b82f6;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .customer-info-card:hover {
          transform: translateX(-5px);
        }
        
        .info-label {
          font-size: 14px;
          color: #1e40af;
          font-weight: 700;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-value {
          font-size: 18px;
          color: #1f2937;
          font-weight: 600;
          background: #f8fafc;
          padding: 12px 15px;
          border-radius: 10px;
          word-break: break-word;
        }
        
        .customer-name {
          color: #dc2626;
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .order-details {
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          border-radius: 24px;
          padding: 40px;
          margin: 40px;
          border: 4px solid #f59e0b;
          animation: slideInRight 0.8s ease-out 0.4s both;
        }
        
        .order-details h3 {
          font-size: 26px;
          color: #92400e;
          margin-bottom: 30px;
          font-weight: 800;
          text-align: center;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .detail-card {
          background: #ffffff;
          padding: 25px;
          border-radius: 16px;
          border-right: 6px solid #f59e0b;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .detail-card:hover {
          transform: translateX(-5px);
        }
        
        .detail-label {
          font-size: 13px;
          color: #92400e;
          font-weight: 700;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 16px;
          color: #1f2937;
          font-weight: 600;
          background: #f9fafb;
          padding: 10px 12px;
          border-radius: 8px;
        }
        
        .full-width {
          grid-column: 1 / -1;
        }
        
        .action-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-radius: 24px;
          padding: 40px;
          margin: 40px;
          border: 4px solid #22c55e;
          text-align: center;
          animation: slideInRight 0.8s ease-out 0.6s both;
        }
        
        .action-section h3 {
          font-size: 26px;
          color: #15803d;
          margin-bottom: 25px;
          font-weight: 800;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .action-btn {
          padding: 15px 30px;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
        }
        
        .btn-secondary {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }
        
        .action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        }
        
        .footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #94a3b8;
          padding: 50px 40px;
          text-align: center;
        }
        
        .footer::before {
          content: '';
          display: block;
          width: 100%;
          height: 6px;
          background: linear-gradient(90deg, #ef4444, #f59e0b, #22c55e, #3b82f6);
          margin-bottom: 30px;
        }
        
        .footer h4 {
          font-size: 28px;
          color: #ffffff;
          margin-bottom: 20px;
          font-weight: 800;
        }
        
        .footer p {
          font-size: 16px;
          line-height: 1.8;
          margin-bottom: 10px;
        }
        
        @media (max-width: 768px) {
          .email-container { margin: 10px; }
          .alert-header { padding: 30px 20px; }
          .priority-section, .customer-section, .order-details, .action-section { margin: 20px; padding: 30px 20px; }
          .alert-title { font-size: 28px; }
          .customer-grid, .details-grid { grid-template-columns: 1fr; }
          .action-buttons { flex-direction: column; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="alert-header">
          <div class="alert-content">
            <div class="alert-icon">🚨</div>
            <h1 class="alert-title">تنبيه: طلب خدمة جديد</h1>
            <p class="alert-subtitle">يتطلب مراجعة عاجلة من فريق الإدارة</p>
            <div class="timestamp-badge">
              <span>⏰</span>
              <span>تم الاستلام: ${new Date().toLocaleString('ar-SA')}</span>
            </div>
          </div>
        </div>
        
        <div class="priority-section">
          <h2 class="priority-title">🚨 طلب عاجل يتطلب الانتباه</h2>
          
          <div class="service-header">
            <div class="service-icon">${serviceIcon}</div>
            <div class="service-name">📋 طلب جديد: ${serviceName}</div>
          </div>
        </div>

        <div class="customer-section">
          <h3>👥 معلومات العميل</h3>
          <div class="customer-grid">
            <div class="customer-info-card">
              <div class="info-label">👤 اسم العميل</div>
              <div class="info-value">
                <div class="customer-name">${inquiry.name}</div>
              </div>
            </div>
            
            <div class="customer-info-card">
              <div class="info-label">📧 البريد الإلكتروني</div>
              <div class="info-value">${inquiry.email}</div>
            </div>
            
            <div class="customer-info-card">
              <div class="info-label">📱 رقم الهاتف</div>
              <div class="info-value">${inquiry.phone}</div>
            </div>
            
            <div class="customer-info-card">
              <div class="info-label">${serviceIcon} نوع الخدمة المطلوبة</div>
              <div class="info-value">${serviceName}</div>
            </div>
          </div>
        </div>

        <div class="order-details">
          <h3>📋 تفاصيل الطلب الكامل</h3>
          <div class="details-grid">
            ${inquiry.sourceLanguage ? `
            <div class="detail-card">
              <div class="detail-label">🌍 ترجمة من</div>
              <div class="detail-value">${inquiry.sourceLanguage}</div>
            </div>` : ''}
            
            ${inquiry.targetLanguage ? `
            <div class="detail-card">
              <div class="detail-label">🌍 ترجمة إلى</div>
              <div class="detail-value">${inquiry.targetLanguage}</div>
            </div>` : ''}
            
            ${inquiry.fileSize ? `
            <div class="detail-card">
              <div class="detail-label">📏 حجم المشروع</div>
              <div class="detail-value">${inquiry.fileSize}</div>
            </div>` : ''}
            
            ${inquiry.deadline ? `
            <div class="detail-card">
              <div class="detail-label">⏰ الموعد النهائي</div>
              <div class="detail-value">${inquiry.deadline}</div>
            </div>` : ''}
            
            ${inquiry.budget ? `
            <div class="detail-card">
              <div class="detail-label">💰 الميزانية المتوقعة</div>
              <div class="detail-value">${inquiry.budget}</div>
            </div>` : ''}
            
            ${inquiry.projectDetails ? `
            <div class="detail-card full-width">
              <div class="detail-label">📝 تفاصيل المشروع</div>
              <div class="detail-value">${inquiry.projectDetails}</div>
            </div>` : ''}
            
            ${inquiry.additionalNotes ? `
            <div class="detail-card full-width">
              <div class="detail-label">📌 ملاحظات إضافية</div>
              <div class="detail-value">${inquiry.additionalNotes}</div>
            </div>` : ''}
            
            ${inquiry.attachmentCount && inquiry.attachmentCount > 0 ? `
            <div class="detail-card">
              <div class="detail-label">📎 المرفقات</div>
              <div class="detail-value">${inquiry.attachmentCount} ملف مرفق - يتطلب مراجعة عاجلة</div>
            </div>` : ''}
          </div>
        </div>

        <div class="action-section">
          <h3>⚡ إجراءات مطلوبة فورية</h3>
          <div class="action-buttons">
            <a href="mailto:${inquiry.email}" class="action-btn btn-primary">
              📧 الرد على العميل فوراً
            </a>
            <a href="tel:${inquiry.phone}" class="action-btn btn-secondary">
              📞 الاتصال بالعميل
            </a>
            <a href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}" class="action-btn btn-primary">
              💬 واتساب
            </a>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: rgba(239, 68, 68, 0.1); border-radius: 15px; border-right: 4px solid #ef4444;">
            <h4 style="color: #dc2626; margin-bottom: 10px;">⚠️ تنبيه هام</h4>
            <p style="color: #991b1b; font-weight: 600; margin: 0;">
              يرجى الرد على هذا الطلب خلال 4 ساعات كحد أقصى للحفاظ على سمعة الوكالة وضمان رضا العميل
            </p>
          </div>
        </div>
        
        <div class="footer">
          <h4>FekrahEdu - نظام إدارة الطلبات</h4>
          <p>تم إرسال هذا التنبيه تلقائياً من نظام إدارة الطلبات</p>
          <p>للاستفسارات التقنية، يرجى التواصل مع فريق تطوير النظام</p>
          <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
            © 2024 FekrahEdu - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: any = await req.json();
    const inquiry: ServiceInquiry =body;
    // 🆕 حفظ في صندوق الوارد الموحّد للوحة الإدارة
    try {
      const data: any = body;
      await supabaseAdmin.from("inbox_messages").insert({
        sender_name: (data.name || "زائر").toString().slice(0, 200),
        sender_email: (data.email || "unknown@fekrahedu.com").toString().slice(0, 200),
        sender_phone: (data.phone || null) ? data.phone.toString().slice(0, 50) : null,
        subject: (`استفسار خدمة: ${data.serviceName || data.serviceType || ''}`).toString().slice(0, 300),
        message: (data.projectDetails || data.additionalNotes || `استفسار عن خدمة ${data.serviceName || data.serviceType}` || "").toString().slice(0, 8000),
        form_type: "service_inquiry",
        service_type: data.serviceType ?? null,
        source_page: typeof data.sourcePage === "string" ? data.sourcePage : null,
        priority: "high",
        status: "new",
        metadata: { service_name: data.serviceName, source_language: data.sourceLanguage, target_language: data.targetLanguage, deadline: data.deadline, budget: data.budget, file_size: data.fileSize, attachment_count: data.attachmentCount },
      });
    } catch (inboxErr) {
      console.error("[inbox] failed to save:", inboxErr);
    }

    console.log("Received inquiry:", inquiry);

    // Get service name and icon
    const serviceName = inquiry.serviceName || serviceNames[inquiry.serviceType] || inquiry.serviceType;
    const serviceIcon = serviceIcons[inquiry.serviceType] || '📋';

    // Generate email templates
    const customerTemplate = generateCustomerEmailTemplate(inquiry, serviceName, serviceIcon);
    const adminTemplate = generateAdminEmailTemplate(inquiry, serviceName, serviceIcon);

    // Send email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "FekrahEdu <noreply@fekrahedu.com>",
      to: [inquiry.email],
      subject: `تأكيد استلام طلبكم - ${serviceName}`,
      html: customerTemplate,
    });

    console.log("Customer email sent successfully:", customerEmailResponse);

    // Send email to admin - الإيميل الرسمي للإدارة
    const adminEmailResponse = await resend.emails.send({
      from: "نظام الطلبات <system@fekrahedu.com>",
      to: ["info@fekrahedu.com"],
      subject: `🚨 طلب جديد عاجل: ${serviceName} - ${inquiry.name}`,
      html: adminTemplate,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse,
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
    console.error("Error in send-service-inquiry function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);