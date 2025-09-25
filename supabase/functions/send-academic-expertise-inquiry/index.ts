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

    // Client confirmation email template
    const clientEmailTemplate = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد طلب الاستشارة الأكاديمية</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
          text-align: right;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          margin: 0;
          padding: 20px;
          line-height: 1.8;
          color: #2d3748;
        }
        .email-wrapper {
          max-width: 680px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        .header {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
          color: white;
          padding: 50px 40px;
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
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          );
          animation: move 20s linear infinite;
        }
        @keyframes move {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .header-content {
          position: relative;
          z-index: 2;
        }
        .logo {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 15px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .tagline {
          font-size: 1.1rem;
          opacity: 0.95;
          font-weight: 300;
        }
        .content {
          padding: 50px 40px;
          background: #ffffff;
        }
        .greeting {
          font-size: 1.3rem;
          color: #2d3748;
          margin-bottom: 30px;
          padding: 25px;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 15px;
          border-right: 6px solid #4f46e5;
        }
        .highlight-name {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 1.1em;
        }
        .main-text {
          font-size: 1.1rem;
          line-height: 1.8;
          margin-bottom: 35px;
          color: #4a5568;
        }
        .info-section {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 35px;
          border-radius: 18px;
          margin: 35px 0;
          border-right: 6px solid #0ea5e9;
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.1);
        }
        .section-title {
          color: #0369a1;
          margin-bottom: 25px;
          font-size: 1.4rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .info-grid {
          display: grid;
          gap: 20px;
        }
        .info-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border-right: 4px solid #0ea5e9;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.2s ease;
        }
        .info-item:hover {
          transform: translateY(-2px);
        }
        .info-label {
          font-weight: 700;
          color: #1e40af;
          font-size: 0.95rem;
          margin-bottom: 8px;
          display: block;
        }
        .info-value {
          color: #4b5563;
          font-size: 1.05rem;
          font-weight: 500;
        }
        .next-steps {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 2px solid #22c55e;
          border-radius: 18px;
          padding: 35px;
          margin: 35px 0;
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.1);
        }
        .next-steps h3 {
          color: #15803d;
          margin-bottom: 25px;
          font-size: 1.4rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .steps-list {
          list-style: none;
          padding: 0;
        }
        .steps-list li {
          color: #166534;
          margin-bottom: 15px;
          padding: 15px 20px;
          background: white;
          border-radius: 10px;
          border-right: 4px solid #22c55e;
          font-weight: 500;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: relative;
          padding-right: 50px;
        }
        .steps-list li::before {
          content: '✓';
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          background: #22c55e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
        .contact-section {
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          padding: 35px;
          border-radius: 18px;
          margin: 35px 0;
          border-right: 6px solid #f59e0b;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.1);
        }
        .contact-title {
          color: #d97706;
          margin-bottom: 25px;
          font-size: 1.4rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .contact-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 15px;
          border-right: 4px solid #f59e0b;
          font-weight: 500;
          color: #92400e;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .closing-message {
          font-size: 1.1rem;
          line-height: 1.8;
          margin: 40px 0;
          padding: 30px;
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          border-radius: 15px;
          border-right: 6px solid #7c3aed;
          color: #5b21b6;
          font-weight: 500;
        }
        .signature {
          text-align: center;
          padding: 30px;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 15px;
          margin-top: 30px;
        }
        .signature-name {
          font-weight: 700;
          color: #1e293b;
          font-size: 1.2rem;
          margin-bottom: 10px;
        }
        .signature-team {
          color: #64748b;
          font-size: 1.05rem;
          margin-bottom: 5px;
        }
        .signature-tagline {
          color: #7c3aed;
          font-weight: 600;
          font-style: italic;
        }
        .footer {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #f1f5f9;
          padding: 40px;
          text-align: center;
          font-size: 0.95rem;
        }
        .footer-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: white;
        }
        .footer-subtitle {
          margin-bottom: 20px;
          color: #cbd5e1;
        }
        .footer-copyright {
          color: #94a3b8;
          font-size: 0.9rem;
        }
        @media (max-width: 600px) {
          body { padding: 10px; }
          .content, .header { padding: 30px 25px; }
          .info-section, .next-steps, .contact-section { padding: 25px; }
          .logo { font-size: 2rem; }
          .greeting { font-size: 1.1rem; padding: 20px; }
          .section-title, .next-steps h3, .contact-title { font-size: 1.2rem; }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <div class="header-content">
            <div class="logo">🎓 وكالة ماستر إيدو باث</div>
            <div class="tagline">للخدمات الأكاديمية والبحثية المتخصصة</div>
          </div>
        </div>
        
        <div class="content">
          <div class="greeting">
            السلام عليكم ورحمة الله وبركاته،<br>
            الأستاذ / الأستاذة <span class="highlight-name">${consultationData.fullName}</span> المحترم/ة
          </div>
          
          <div class="main-text">
            نشكركم لثقتكم في <strong>وكالة ماستر إيدو باث</strong> ولاختياركم خدماتنا الأكاديمية المتخصصة.
            <br><br>
            تم استلام طلب الاستشارة الأكاديمية الخاص بكم بنجاح، وسيقوم فريقنا المختص بمراجعته والتواصل معكم في أقرب وقت ممكن.
          </div>
          
          <div class="info-section">
            <h3 class="section-title">📋 تفاصيل طلبكم</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">نوع الخدمة</span>
                <span class="info-value">${serviceTypeArabic}</span>
              </div>
              <div class="info-item">
                <span class="info-label">المستوى الأكاديمي</span>
                <span class="info-value">${academicLevelArabic}</span>
              </div>
              ${consultationData.specialization ? `
              <div class="info-item">
                <span class="info-label">التخصص</span>
                <span class="info-value">${consultationData.specialization}</span>
              </div>
              ` : ''}
              ${consultationData.university ? `
              <div class="info-item">
                <span class="info-label">الجامعة</span>
                <span class="info-value">${consultationData.university}</span>
              </div>
              ` : ''}
              ${consultationData.projectTitle ? `
              <div class="info-item">
                <span class="info-label">عنوان المشروع</span>
                <span class="info-value">${consultationData.projectTitle}</span>
              </div>
              ` : ''}
              ${consultationData.deadline ? `
              <div class="info-item">
                <span class="info-label">الموعد النهائي</span>
                <span class="info-value">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</span>
              </div>
              ` : ''}
            </div>
          </div>
          
          <div class="next-steps">
            <h3>⏰ الخطوات التالية</h3>
            <ul class="steps-list">
              <li>سيتم مراجعة طلبكم من قبل فريق الخبراء المختصين</li>
              <li>سنتواصل معكم خلال <strong>24 ساعة كحد أقصى</strong> لمناقشة التفاصيل</li>
              <li>سيتم تقديم عرض سعر مفصل وخطة عمل شاملة</li>
              <li>بإمكانكم التواصل معنا في أي وقت للاستفسار عن حالة طلبكم</li>
            </ul>
          </div>
          
          <div class="contact-section">
            <h3 class="contact-title">📞 للتواصل المباشر</h3>
            <div class="contact-item">
              <strong>البريد الإلكتروني:</strong> admin@masteredupath.com
            </div>
            <div class="contact-item">
              <strong>رقم الهاتف:</strong> ${consultationData.phone}
            </div>
          </div>
          
          <div class="closing-message">
            نتطلع لخدمتكم وتقديم أفضل الحلول الأكاديمية التي تلبي احتياجاتكم وتحقق أهدافكم العلمية بأعلى معايير الجودة والاحترافية.
          </div>
          
          <div class="signature">
            <div class="signature-name">مع أطيب التحيات</div>
            <div class="signature-team">فريق وكالة ماستر إيدو باث</div>
            <div class="signature-tagline">شريككم في التميز الأكاديمي</div>
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

    // Admin notification email template
    const adminEmailTemplate = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>طلب استشارة أكاديمية جديد</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          direction: rtl;
          text-align: right;
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%);
          margin: 0;
          padding: 20px;
          line-height: 1.8;
          color: #1f2937;
        }
        .email-wrapper {
          max-width: 800px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
        }
        .header {
          background: linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%);
          color: white;
          padding: 50px 40px;
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
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 15px,
            rgba(255,255,255,0.1) 15px,
            rgba(255,255,255,0.1) 30px
          );
          animation: alertMove 15s linear infinite;
        }
        @keyframes alertMove {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .header-content {
          position: relative;
          z-index: 2;
        }
        .urgent-badge {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: #92400e;
          padding: 12px 25px;
          border-radius: 50px;
          font-size: 0.9rem;
          font-weight: 800;
          display: inline-block;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 8px 20px rgba(251, 191, 36, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .header-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 15px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header-subtitle {
          font-size: 1.1rem;
          opacity: 0.95;
          font-weight: 300;
        }
        .content {
          padding: 50px 40px;
          background: #ffffff;
        }
        .alert-message {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 3px solid #ef4444;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .alert-message::before {
          content: '⚠️';
          font-size: 3rem;
          position: absolute;
          top: -10px;
          right: 20px;
          opacity: 0.1;
        }
        .alert-text {
          color: #dc2626;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 15px;
        }
        .alert-subtext {
          color: #991b1b;
          font-size: 1.05rem;
          font-weight: 500;
        }
        .client-section {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 3px solid #3b82f6;
          border-radius: 20px;
          padding: 40px;
          margin: 40px 0;
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.1);
        }
        .section-title {
          color: #1e40af;
          margin-bottom: 30px;
          font-size: 1.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .client-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          margin: 30px 0;
        }
        .client-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          border-right: 5px solid #3b82f6;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          position: relative;
        }
        .client-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        .card-label {
          font-weight: 700;
          color: #1e40af;
          font-size: 0.95rem;
          margin-bottom: 10px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .card-value {
          color: #374151;
          font-size: 1.1rem;
          font-weight: 600;
          line-height: 1.6;
        }
        .project-section {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 3px solid #22c55e;
          border-radius: 20px;
          padding: 40px;
          margin: 40px 0;
          box-shadow: 0 15px 35px rgba(34, 197, 94, 0.1);
        }
        .project-details {
          display: grid;
          gap: 25px;
        }
        .project-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          border-right: 5px solid #22c55e;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }
        .highlight-value {
          background: linear-gradient(135deg, #dc2626, #ea580c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
          font-size: 1.2em;
        }
        .action-section {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border: 3px solid #ef4444;
          border-radius: 20px;
          padding: 40px;
          margin: 40px 0;
          box-shadow: 0 15px 35px rgba(239, 68, 68, 0.1);
        }
        .action-list {
          list-style: none;
          padding: 0;
        }
        .action-item {
          color: #7f1d1d;
          margin-bottom: 20px;
          padding: 20px 25px;
          background: white;
          border-radius: 12px;
          border-right: 5px solid #ef4444;
          font-weight: 600;
          font-size: 1.05rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          position: relative;
          padding-right: 60px;
        }
        .action-item::before {
          content: '🚀';
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
        }
        .urgent-info {
          background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
          border: 3px solid #f59e0b;
          border-radius: 20px;
          padding: 35px;
          margin: 40px 0;
          text-align: center;
          box-shadow: 0 15px 35px rgba(245, 158, 11, 0.1);
        }
        .timestamp {
          font-size: 1.2rem;
          font-weight: 700;
          color: #92400e;
          background: white;
          padding: 20px;
          border-radius: 15px;
          border: 2px solid #f59e0b;
          display: inline-block;
        }
        .footer {
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          color: #f9fafb;
          padding: 40px;
          text-align: center;
          font-size: 0.95rem;
        }
        .footer-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 15px;
          color: white;
        }
        .footer-subtitle {
          margin-bottom: 20px;
          color: #d1d5db;
          font-size: 1.05rem;
        }
        @media (max-width: 600px) {
          body { padding: 10px; }
          .content, .header { padding: 30px 25px; }
          .client-section, .project-section, .action-section { padding: 25px; }
          .client-grid { grid-template-columns: 1fr; }
          .header-title { font-size: 1.8rem; }
          .section-title { font-size: 1.3rem; }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <div class="header-content">
            <div class="urgent-badge">🚨 طلب جديد - يتطلب متابعة فورية</div>
            <div class="header-title">📧 طلب استشارة أكاديمية جديد</div>
            <div class="header-subtitle">تم استلام طلب استشارة من عميل محتمل</div>
          </div>
        </div>
        
        <div class="content">
          <div class="alert-message">
            <div class="alert-text">تنبيه هام: طلب استشارة جديد!</div>
            <div class="alert-subtext">يتطلب الرد خلال 24 ساعة كحد أقصى</div>
          </div>
          
          <div class="client-section">
            <h3 class="section-title">👤 معلومات العميل</h3>
            <div class="client-grid">
              <div class="client-card">
                <span class="card-label">الاسم الكامل</span>
                <div class="card-value">${consultationData.fullName}</div>
              </div>
              <div class="client-card">
                <span class="card-label">البريد الإلكتروني</span>
                <div class="card-value">${consultationData.email}</div>
              </div>
              <div class="client-card">
                <span class="card-label">رقم الهاتف</span>
                <div class="card-value">${consultationData.phone}</div>
              </div>
              <div class="client-card">
                <span class="card-label">الجامعة / المؤسسة</span>
                <div class="card-value">${consultationData.university || 'غير محدد'}</div>
              </div>
              <div class="client-card">
                <span class="card-label">المستوى الأكاديمي</span>
                <div class="card-value">${academicLevelArabic}</div>
              </div>
              <div class="client-card">
                <span class="card-label">التخصص</span>
                <div class="card-value">${consultationData.specialization || 'غير محدد'}</div>
              </div>
            </div>
          </div>
          
          <div class="project-section">
            <h3 class="section-title">📚 تفاصيل المشروع</h3>
            <div class="project-details">
              <div class="project-card">
                <span class="card-label">نوع الخدمة المطلوبة</span>
                <div class="card-value highlight-value">${serviceTypeArabic}</div>
              </div>
              ${consultationData.projectTitle ? `
              <div class="project-card">
                <span class="card-label">عنوان المشروع</span>
                <div class="card-value">${consultationData.projectTitle}</div>
              </div>
              ` : ''}
              ${consultationData.projectDescription ? `
              <div class="project-card">
                <span class="card-label">وصف المشروع</span>
                <div class="card-value">${consultationData.projectDescription}</div>
              </div>
              ` : ''}
              ${consultationData.deadline ? `
              <div class="project-card">
                <span class="card-label">الموعد النهائي المطلوب</span>
                <div class="card-value highlight-value">${new Date(consultationData.deadline).toLocaleDateString('ar-SA')}</div>
              </div>
              ` : ''}
              ${consultationData.additionalNotes ? `
              <div class="project-card">
                <span class="card-label">ملاحظات إضافية</span>
                <div class="card-value">${consultationData.additionalNotes}</div>
              </div>
              ` : ''}
            </div>
          </div>
          
          <div class="action-section">
            <h3 class="section-title">⚡ إجراءات مطلوبة</h3>
            <ul class="action-list">
              <li class="action-item">التواصل الفوري: يجب التواصل مع العميل خلال 24 ساعة كحد أقصى</li>
              <li class="action-item">تقييم المشروع: مراجعة المتطلبات وتحديد الخبراء المناسبين</li>
              <li class="action-item">إعداد العرض: تحضير عرض سعر مفصل وجدول زمني</li>
              <li class="action-item">المتابعة: تسجيل الطلب في نظام إدارة العملاء</li>
            </ul>
          </div>
          
          <div class="urgent-info">
            <div class="timestamp">
              ⏰ تم إرسال هذا الطلب في: ${new Date().toLocaleString('ar-SA', { 
                timeZone: 'Asia/Riyadh',
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-title">نظام إدارة الطلبات - وكالة ماستر إيدو باث</div>
          <div class="footer-subtitle">هذا إشعار آلي من نظام إدارة طلبات الاستشارات الأكاديمية</div>
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