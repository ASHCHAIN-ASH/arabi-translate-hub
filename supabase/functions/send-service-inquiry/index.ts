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
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد استلام طلب ${serviceName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          direction: rtl !important;
          text-align: right !important;
        }
        body {
          font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
          line-height: 1.8;
          color: #2c3e50;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          margin: 0;
          padding: 15px;
          direction: rtl !important;
          text-align: right !important;
        }
        
        .text-center {
          text-align: center !important;
        }
        .email-wrapper {
          width: 100%;
          max-width: 650px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 25px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .service-icon {
          font-size: 48px;
          margin-bottom: 15px;
          display: block;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        .header h2 {
          font-size: 20px;
          font-weight: 400;
          opacity: 0.95;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 22px;
          color: #2c3e50;
          margin-bottom: 25px;
          font-weight: 600;
          text-align: center !important;
          direction: rtl !important;
        }
        .message {
          font-size: 17px;
          color: #34495e;
          margin-bottom: 30px;
          line-height: 1.8;
          text-align: center !important;
          direction: rtl !important;
        }
        .info-card {
          background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px solid #e3f2fd;
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }
        .info-card h3 {
          color: #1565c0;
          font-size: 20px;
          margin-bottom: 20px;
          text-align: center !important;
          font-weight: 700;
          direction: rtl !important;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }
        .info-item {
          background: white;
          padding: 15px 20px;
          border-radius: 12px;
          border-right: 4px solid #667eea;
          box-shadow: 0 3px 10px rgba(0,0,0,0.05);
        }
        .info-item strong {
          color: #2c3e50;
          display: block;
          margin-bottom: 5px;
          font-size: 14px;
          text-align: right !important;
          direction: rtl !important;
        }
        .info-item span {
          color: #667eea;
          font-size: 16px;
          font-weight: 600;
          text-align: right !important;
          direction: rtl !important;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .steps-section {
          background: linear-gradient(145deg, #e8f5e8 0%, #f1f8e9 100%);
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
          border: 3px solid #c8e6c9;
        }
        .steps-section h3 {
          color: #2e7d32;
          font-size: 20px;
          margin-bottom: 25px;
          text-align: center !important;
          font-weight: 700;
          direction: rtl !important;
        }
        .steps-list {
          list-style: none;
          counter-reset: step-counter;
        }
        .steps-list li {
          counter-increment: step-counter;
          background: white;
          margin: 12px 0;
          padding: 18px 55px 18px 25px;
          border-radius: 12px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          font-size: 16px;
          font-weight: 500;
          text-align: right !important;
          direction: rtl !important;
        }
        .steps-list li::before {
          content: counter(step-counter);
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          background: #4caf50;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
        .contact-section {
          background: linear-gradient(145deg, #fff3e0 0%, #ffe0b2 100%);
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
          border: 3px solid #ffcc02;
          text-align: center !important;
          direction: rtl !important;
        }
        .contact-section h3 {
          color: #e65100;
          font-size: 20px;
          margin-bottom: 25px;
          font-weight: 700;
          text-align: center !important;
          direction: rtl !important;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .contact-item {
          background: white;
          padding: 15px 20px;
          border-radius: 12px;
          font-size: 15px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.05);
          border-right: 4px solid #ff9800;
          text-align: center !important;
          direction: rtl !important;
        }
        .footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 35px 30px;
          text-align: center !important;
          direction: rtl !important;
        }
        .footer p {
          margin: 10px 0;
          font-size: 15px;
          text-align: center !important;
          direction: rtl !important;
        }
        .footer .company-name {
          font-size: 22px;
          font-weight: 700;
          color: #ecf0f1;
          margin-bottom: 15px;
          text-align: center !important;
          direction: rtl !important;
        }
        
        /* Mobile Responsive */
        @media only screen and (max-width: 600px) {
          body { padding: 8px; }
          .email-wrapper { border-radius: 20px; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 26px; }
          .header h2 { font-size: 18px; }
          .service-icon { font-size: 40px; }
          .content { padding: 30px 20px; }
          .greeting { font-size: 20px; }
          .message { font-size: 15px; }
          .info-grid, .contact-grid { grid-template-columns: 1fr; gap: 10px; }
          .info-card, .steps-section, .contact-section { padding: 25px 20px; margin: 25px 0; }
          .steps-list li { padding: 15px 50px 15px 20px; font-size: 15px; }
          .steps-list li::before { width: 28px; height: 28px; right: 15px; }
          .footer { padding: 30px 20px; }
          .info-item, .contact-item { padding: 12px 16px; }
        }
        
        @media only screen and (max-width: 480px) {
          .header h1 { font-size: 22px; }
          .header h2 { font-size: 16px; }
          .service-icon { font-size: 36px; }
          .greeting { font-size: 18px; }
          .info-card h3, .steps-section h3, .contact-section h3 { font-size: 18px; }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <span class="service-icon">${serviceIcon}</span>
          <h1>ماستر إيدو باث</h1>
          <h2>تأكيد استلام طلب ${serviceName}</h2>
        </div>
        
        <div class="content">
          <div class="greeting">
            السلام عليكم ورحمة الله وبركاته<br>
            عزيزي/عزيزتي ${inquiry.name}
          </div>
          
          <div class="message">
            نشكرك على ثقتك في خدماتنا! يسعدنا إعلامك بأنه تم استلام طلبك لخدمة <strong>${serviceName}</strong> بنجاح، وسيتم التعامل معه بأقصى سرعة ودقة ممكنة.
          </div>
          
          <div class="info-card">
            <h3>📋 تفاصيل طلبك المُستلم</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>الاسم الكامل:</strong>
                <span>${inquiry.name}</span>
              </div>
              <div class="info-item">
                <strong>رقم الهاتف:</strong>
                <span>${inquiry.phone}</span>
              </div>
              <div class="info-item full-width">
                <strong>البريد الإلكتروني:</strong>
                <span>${inquiry.email}</span>
              </div>
              <div class="info-item full-width">
                <strong>نوع الخدمة:</strong>
                <span>${serviceName}</span>
              </div>
              ${inquiry.sourceLanguage ? `
              <div class="info-item">
                <strong>من اللغة:</strong>
                <span>${inquiry.sourceLanguage}</span>
              </div>
              ` : ''}
              ${inquiry.targetLanguage ? `
              <div class="info-item">
                <strong>إلى اللغة:</strong>
                <span>${inquiry.targetLanguage}</span>
              </div>
              ` : ''}
              ${inquiry.deadline ? `
              <div class="info-item">
                <strong>الموعد المطلوب:</strong>
                <span>${inquiry.deadline}</span>
              </div>
              ` : ''}
              ${inquiry.budget ? `
              <div class="info-item">
                <strong>الميزانية المتوقعة:</strong>
                <span>${inquiry.budget}</span>
              </div>
              ` : ''}
              ${inquiry.fileSize ? `
              <div class="info-item">
                <strong>حجم المشروع:</strong>
                <span>${inquiry.fileSize}</span>
              </div>
              ` : ''}
              ${inquiry.projectDetails ? `
              <div class="info-item full-width">
                <strong>تفاصيل المشروع:</strong>
                <span>${inquiry.projectDetails}</span>
              </div>
              ` : ''}
              ${inquiry.additionalNotes ? `
              <div class="info-item full-width">
                <strong>ملاحظات إضافية:</strong>
                <span>${inquiry.additionalNotes}</span>
              </div>
              ` : ''}
            </div>
          </div>
          
          <div class="steps-section">
            <h3>⚡ الخطوات التالية</h3>
            <ul class="steps-list">
              <li>سيتواصل معك فريق المتخصصين خلال 4 ساعات كحد أقصى</li>
              <li>سنقوم بمراجعة وتحليل تفاصيل مشروعك بعناية فائقة</li>
              <li>سيتم إعداد عرض سعر مفصل وخطة زمنية واضحة</li>
              <li>بعد موافقتك، سنبدأ العمل فوراً وفق أعلى معايير الجودة</li>
              <li>ستحصل على النتائج النهائية بجودة احترافية استثنائية</li>
            </ul>
          </div>
          
          <div class="contact-section">
            <h3>📞 طرق التواصل السريع</h3>
            <div class="contact-grid">
              <div class="contact-item">
                📧 info@masteredupath.com
              </div>
              <div class="contact-item">
                🌐 www.masteredupath.com
              </div>
              <div class="contact-item">
                💬 دردشة مباشرة متاحة
              </div>
              <div class="contact-item">
                ⏰ متاحون 24/7 لخدمتك
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p class="company-name">ماستر إيدو باث</p>
          <p>&copy; 2024 جميع الحقوق محفوظة</p>
          <p>شريكك المثالي في الترجمة الاحترافية والخدمات التعليمية المتميزة</p>
          <p>نلتزم بتقديم أعلى مستويات الجودة والاحترافية في كل مشروع</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateAdminEmailTemplate = (inquiry: ServiceInquiry, serviceName: string, serviceIcon: string) => {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>طلب جديد: ${serviceName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Cairo', 'Amiri', 'Segoe UI', Tahoma, Arial, sans-serif;
          line-height: 1.8;
          color: #2c3e50;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          margin: 0;
          padding: 15px;
          direction: rtl !important;
          text-align: right !important;
        }
        
        * {
          direction: rtl !important;
          text-align: right !important;
        }
        
        .text-center {
          text-align: center !important;
        }
        .email-wrapper {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 25px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
          overflow: hidden;
          border: 4px solid #ff4757;
        }
        .urgent-banner {
          background: linear-gradient(45deg, #ff4757 0%, #ff3838 100%);
          color: white;
          padding: 18px;
          text-align: center !important;
          font-weight: bold;
          font-size: 18px;
          animation: pulse 2s infinite;
          direction: rtl !important;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        .header {
          background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
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
        .service-icon {
          font-size: 56px;
          margin-bottom: 15px;
          display: block;
        }
        .header h1 {
          font-size: 32px;
          margin-bottom: 15px;
          font-weight: 700;
        }
        .header .timestamp {
          background: rgba(255,255,255,0.25);
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 16px;
          margin-top: 15px;
          display: inline-block;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .alert-card {
          background: linear-gradient(145deg, #fff3cd 0%, #ffeaa7 100%);
          border: 4px solid #ffc107;
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
          text-align: center !important;
          box-shadow: 0 10px 25px rgba(255,193,7,0.3);
          direction: rtl !important;
        }
        .alert-card .icon {
          font-size: 54px;
          margin-bottom: 18px;
        }
        .alert-card h3 {
          color: #856404;
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .alert-card p {
          color: #856404;
          font-size: 17px;
          font-weight: 600;
        }
        .client-section {
          background: linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%);
          border: 3px solid #2196f3;
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
        }
        .client-section h3 {
          color: #1565c0;
          font-size: 22px;
          margin-bottom: 25px;
          text-align: center !important;
          font-weight: 700;
          direction: rtl !important;
        }
        .client-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 25px;
        }
        .client-info-item {
          background: white;
          padding: 18px 22px;
          border-radius: 12px;
          border-right: 5px solid #2196f3;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .client-info-item strong {
          color: #1565c0;
          display: block;
          margin-bottom: 8px;
          font-size: 15px;
          font-weight: 600;
          text-align: right !important;
          direction: rtl !important;
        }
        .client-info-item span {
          color: #2c3e50;
          font-size: 17px;
          font-weight: 600;
          text-align: right !important;
          direction: rtl !important;
        }
        .full-width {
          grid-column: 1 / -1;
        }
        .service-details {
          background: linear-gradient(145deg, #f3e5f5 0%, #e1bee7 100%);
          border: 3px solid #9c27b0;
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
        }
        .service-details h3 {
          color: #6a1b9a;
          font-size: 22px;
          margin-bottom: 25px;
          text-align: center !important;
          font-weight: 700;
          direction: rtl !important;
        }
        .detail-item {
          background: white;
          margin: 12px 0;
          padding: 18px 22px;
          border-radius: 12px;
          border-right: 5px solid #9c27b0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .detail-item strong {
          color: #6a1b9a;
          display: inline-block;
          min-width: 140px;
          font-size: 15px;
          font-weight: 600;
          text-align: right !important;
          direction: rtl !important;
        }
        .detail-item span {
          color: #2c3e50;
          font-size: 16px;
          font-weight: 600;
          text-align: right !important;
          direction: rtl !important;
        }
        .priority-section {
          background: linear-gradient(145deg, #c8e6c9 0%, #a5d6a7 100%);
          border: 4px solid #4caf50;
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
          text-align: center !important;
          direction: rtl !important;
        }
        .priority-section .icon {
          font-size: 48px;
          margin-bottom: 18px;
        }
        .priority-section h3 {
          color: #2e7d32;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .action-steps {
          background: linear-gradient(145deg, #ffebee 0%, #ffcdd2 100%);
          border: 3px solid #f44336;
          border-radius: 20px;
          padding: 30px;
          margin: 30px 0;
        }
        .action-steps h3 {
          color: #c62828;
          font-size: 22px;
          margin-bottom: 25px;
          text-align: center !important;
          font-weight: 700;
          direction: rtl !important;
        }
        .steps-list {
          list-style: none;
          counter-reset: step-counter;
        }
        .steps-list li {
          counter-increment: step-counter;
          background: white;
          margin: 15px 0;
          padding: 18px 55px 18px 25px;
          border-radius: 12px;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          font-size: 16px;
          font-weight: 600;
          color: #2c3e50;
          text-align: right !important;
          direction: rtl !important;
        }
        .steps-list li::before {
          content: counter(step-counter);
          position: absolute;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          background: #f44336;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 15px;
        }
        .footer {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 35px 30px;
          text-align: center !important;
          direction: rtl !important;
        }
        .footer p {
          margin: 10px 0;
          font-size: 15px;
          text-align: center !important;
          direction: rtl !important;
        }
        
        /* Mobile Responsive */
        @media only screen and (max-width: 600px) {
          body { padding: 8px; }
          .email-wrapper { border-radius: 20px; border-width: 3px; }
          .urgent-banner { padding: 15px; font-size: 16px; }
          .header { padding: 30px 20px; }
          .header h1 { font-size: 26px; }
          .service-icon { font-size: 48px; }
          .content { padding: 30px 20px; }
          .client-info-grid { grid-template-columns: 1fr; gap: 12px; }
          .alert-card, .client-section, .service-details, .priority-section, .action-steps { 
            padding: 25px 20px; margin: 25px 0; 
          }
          .alert-card .icon { font-size: 46px; }
          .alert-card h3, .client-section h3, .service-details h3, .action-steps h3 { font-size: 20px; }
          .detail-item strong { min-width: 110px; font-size: 14px; }
          .steps-list li { padding: 15px 50px 15px 20px; font-size: 15px; }
          .steps-list li::before { width: 30px; height: 30px; font-size: 14px; right: 15px; }
          .footer { padding: 30px 20px; }
        }
        
        @media only screen and (max-width: 480px) {
          .header h1 { font-size: 22px; }
          .service-icon { font-size: 42px; }
          .alert-card h3 { font-size: 18px; }
          .client-section h3, .service-details h3, .action-steps h3 { font-size: 18px; }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="urgent-banner">
          🚨 طلب جديد عاجل - يتطلب المتابعة الفورية 🚨
        </div>
        
        <div class="header">
          <span class="service-icon">${serviceIcon}</span>
          <h1>طلب جديد: ${serviceName}</h1>
          <div class="timestamp">
            📅 ${new Date().toLocaleString('ar-SA', { 
              timeZone: 'Asia/Riyadh',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        
        <div class="content">
          <div class="alert-card">
            <div class="icon">⚡</div>
            <h3>تنبيه هام</h3>
            <p>تم استلام طلب خدمة جديد يتطلب المتابعة السريعة والاهتمام الفوري من الفريق المختص</p>
          </div>
          
          <div class="client-section">
            <h3>👤 معلومات العميل</h3>
            <div class="client-info-grid">
              <div class="client-info-item">
                <strong>الاسم الكامل</strong>
                <span>${inquiry.name}</span>
              </div>
              <div class="client-info-item">
                <strong>رقم الهاتف</strong>
                <span>${inquiry.phone}</span>
              </div>
              <div class="client-info-item full-width">
                <strong>البريد الإلكتروني</strong>
                <span>${inquiry.email}</span>
              </div>
            </div>
          </div>
          
          <div class="service-details">
            <h3>📋 تفاصيل الطلب المُستلم</h3>
            <div class="detail-item">
              <strong>نوع الخدمة:</strong>
              <span>${serviceName}</span>
            </div>
            ${inquiry.sourceLanguage ? `
            <div class="detail-item">
              <strong>اللغة المصدر:</strong>
              <span>${inquiry.sourceLanguage}</span>
            </div>
            ` : ''}
            ${inquiry.targetLanguage ? `
            <div class="detail-item">
              <strong>اللغة المطلوبة:</strong>
              <span>${inquiry.targetLanguage}</span>
            </div>
            ` : ''}
            ${inquiry.deadline ? `
            <div class="detail-item">
              <strong>الموعد النهائي:</strong>
              <span>${inquiry.deadline}</span>
            </div>
            ` : ''}
            ${inquiry.budget ? `
            <div class="detail-item">
              <strong>الميزانية المتوقعة:</strong>
              <span>${inquiry.budget}</span>
            </div>
            ` : ''}
            ${inquiry.fileSize ? `
            <div class="detail-item">
              <strong>حجم المشروع:</strong>
              <span>${inquiry.fileSize}</span>
            </div>
            ` : ''}
            ${inquiry.projectDetails ? `
            <div class="detail-item">
              <strong>تفاصيل المشروع:</strong>
              <span>${inquiry.projectDetails}</span>
            </div>
            ` : ''}
            ${inquiry.additionalNotes ? `
            <div class="detail-item">
              <strong>ملاحظات إضافية:</strong>
              <span>${inquiry.additionalNotes}</span>
            </div>
            ` : ''}
          </div>
          
          <div class="priority-section">
            <div class="icon">⏰</div>
            <h3>مطلوب التواصل مع العميل خلال 4 ساعات كحد أقصى</h3>
          </div>
          
          <div class="action-steps">
            <h3>⚡ خطة العمل المطلوبة</h3>
            <ul class="steps-list">
              <li>مراجعة شاملة لتفاصيل الطلب والتأكد من جميع المعلومات</li>
              <li>التواصل الفوري مع العميل عبر الهاتف أو البريد الإلكتروني</li>
              <li>تحليل متطلبات المشروع وتحديد الفريق المختص</li>
              <li>إعداد عرض سعر مفصل مع الخطة الزمنية للتنفيذ</li>
              <li>إرسال العرض والمتابعة مع العميل للحصول على الموافقة</li>
              <li>بدء تنفيذ المشروع فور استلام الموافقة والدفعة المقدمة</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>ماستر إيدو باث - نظام إدارة الطلبات</strong></p>
          <p>هذا تنبيه تلقائي من نظام إدارة طلبات الخدمات</p>
          <p>&copy; 2024 جميع الحقوق محفوظة</p>
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