import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DocumentTranslationInquiry {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  sourceLanguage: string;
  targetLanguage: string;
  documentSize: string;
  urgency: string;
  additionalNotes?: string;
}

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
    const inquiry: DocumentTranslationInquiry = await req.json();
    
    console.log("Received document translation inquiry:", inquiry);

    // Validate required fields
    if (!inquiry.name || !inquiry.email || !inquiry.phone || !inquiry.documentType) {
      return new Response(
        JSON.stringify({ error: "الرجاء ملء جميع الحقول المطلوبة" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      to: [inquiry.email],
      subject: "✅ تأكيد استلام طلبك - ماستر إيدو باث",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد طلب ترجمة المستندات</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', 'Cairo', 'Amiri', Tahoma, Arial, sans-serif;
              line-height: 1.8;
              color: #2c3e50;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              margin: 0;
              padding: 10px;
              direction: rtl;
              text-align: right;
            }
            .email-wrapper {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #ffd89b 0%, #19547b 100%);
            }
            .header h1 {
              font-size: 28px;
              margin-bottom: 10px;
              font-weight: 700;
            }
            .header h2 {
              font-size: 18px;
              font-weight: 400;
              opacity: 0.9;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 20px;
              color: #2c3e50;
              margin-bottom: 25px;
              font-weight: 600;
            }
            .message {
              font-size: 16px;
              color: #34495e;
              margin-bottom: 30px;
              line-height: 1.8;
            }
            .info-card {
              background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
              border: 2px solid #e3f2fd;
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
              box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            }
            .info-card h3 {
              color: #1565c0;
              font-size: 18px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 700;
            }
            .info-list {
              list-style: none;
              padding: 0;
            }
            .info-list li {
              background: white;
              margin: 8px 0;
              padding: 12px 20px;
              border-radius: 10px;
              border-right: 4px solid #667eea;
              font-size: 14px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            .info-list li strong {
              color: #2c3e50;
              display: inline-block;
              min-width: 120px;
            }
            .steps-section {
              background: linear-gradient(145deg, #e8f5e8 0%, #f1f8e9 100%);
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
              border: 2px solid #c8e6c9;
            }
            .steps-section h3 {
              color: #2e7d32;
              font-size: 18px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 700;
            }
            .steps-list {
              list-style: none;
              counter-reset: step-counter;
            }
            .steps-list li {
              counter-increment: step-counter;
              background: white;
              margin: 10px 0;
              padding: 15px 20px;
              border-radius: 10px;
              position: relative;
              padding-right: 50px;
              box-shadow: 0 3px 10px rgba(0,0,0,0.05);
              font-size: 15px;
            }
            .steps-list li::before {
              content: counter(step-counter);
              position: absolute;
              right: 15px;
              top: 50%;
              transform: translateY(-50%);
              background: #4caf50;
              color: white;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
            }
            .contact-section {
              background: linear-gradient(145deg, #fff3e0 0%, #ffe0b2 100%);
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
              border: 2px solid #ffcc02;
              text-align: center;
            }
            .contact-section h3 {
              color: #e65100;
              font-size: 18px;
              margin-bottom: 20px;
              font-weight: 700;
            }
            .contact-item {
              background: white;
              margin: 10px 0;
              padding: 12px 20px;
              border-radius: 10px;
              font-size: 15px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            .footer {
              background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .footer p {
              margin: 8px 0;
              font-size: 14px;
            }
            .footer .company-name {
              font-size: 18px;
              font-weight: 700;
              color: #ecf0f1;
            }
            
            /* Mobile Responsive Styles */
            @media only screen and (max-width: 600px) {
              body {
                padding: 5px;
              }
              .email-wrapper {
                border-radius: 15px;
              }
              .header {
                padding: 25px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .header h2 {
                font-size: 16px;
              }
              .content {
                padding: 25px 20px;
              }
              .greeting {
                font-size: 18px;
              }
              .message {
                font-size: 14px;
              }
              .info-card, .steps-section, .contact-section {
                padding: 20px 15px;
                margin: 20px 0;
              }
              .info-list li, .contact-item {
                padding: 10px 15px;
                font-size: 13px;
              }
              .steps-list li {
                padding: 12px 15px 12px 45px;
                font-size: 14px;
              }
              .footer {
                padding: 25px 20px;
              }
            }
            
            @media only screen and (max-width: 480px) {
              .header h1 {
                font-size: 20px;
              }
              .header h2 {
                font-size: 14px;
              }
              .greeting {
                font-size: 16px;
              }
              .info-list li strong {
                min-width: 100px;
                font-size: 13px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <h1>🎯 ماستر إيدو باث</h1>
              <h2>تأكيد استلام طلب ترجمة المستندات</h2>
            </div>
            
            <div class="content">
              <div class="greeting">
                السلام عليكم ورحمة الله وبركاته<br>
                عزيزي/عزيزتي ${inquiry.name}
              </div>
              
              <div class="message">
                نشكرك على ثقتك في خدماتنا! يسعدنا إعلامك بأنه تم استلام طلبك لخدمة ترجمة المستندات بنجاح، وسيتم التعامل معه بأقصى سرعة ودقة.
              </div>
              
              <div class="info-card">
                <h3>📋 تفاصيل طلبك المُستلم</h3>
                <ul class="info-list">
                  <li><strong>الاسم الكامل:</strong> ${inquiry.name}</li>
                  <li><strong>البريد الإلكتروني:</strong> ${inquiry.email}</li>
                  <li><strong>رقم الهاتف:</strong> ${inquiry.phone}</li>
                  <li><strong>نوع المستند:</strong> ${inquiry.documentType}</li>
                  <li><strong>من اللغة:</strong> ${inquiry.sourceLanguage}</li>
                  <li><strong>إلى اللغة:</strong> ${inquiry.targetLanguage}</li>
                  <li><strong>حجم المستند:</strong> ${inquiry.documentSize} صفحة</li>
                  <li><strong>مستوى الاستعجال:</strong> ${inquiry.urgency}</li>
                  ${inquiry.additionalNotes ? `<li><strong>ملاحظات إضافية:</strong> ${inquiry.additionalNotes}</li>` : ''}
                </ul>
              </div>
              
              <div class="steps-section">
                <h3>⚡ الخطوات التالية</h3>
                <ul class="steps-list">
                  <li>سيتواصل معك فريق الخبراء المتخصص خلال 24 ساعة كحد أقصى</li>
                  <li>سنقوم بمراجعة وتقييم مستندك بدقة عالية</li>
                  <li>سيتم إرسال عرض سعر مفصل وشامل لك</li>
                  <li>بعد موافقتك، سنبدأ العمل فوراً على ترجمة مستندك</li>
                  <li>ستحصل على ترجمة احترافية معتمدة وعالية الجودة</li>
                </ul>
              </div>
              
              <div class="contact-section">
                <h3>📞 طرق التواصل معنا</h3>
                <div class="contact-item">
                  📧 البريد الإلكتروني: info@masteredupath.com
                </div>
                <div class="contact-item">
                  🌐 الموقع الإلكتروني: www.masteredupath.com
                </div>
                <div class="contact-item">
                  ⏰ أوقات العمل: من الأحد إلى الخميس (9 صباحاً - 6 مساءً)
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p class="company-name">ماستر إيدو باث</p>
              <p>&copy; 2024 جميع الحقوق محفوظة</p>
              <p>نحن ملتزمون بتقديم أفضل خدمات الترجمة الاحترافية والمعتمدة</p>
              <p>شكراً لثقتكم بنا ونتطلع لخدمتكم</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Master Edu Path System <info@masteredupath.com>",
      to: ["info@masteredupath.com"],
      subject: `🚨 طلب جديد عاجل: ترجمة المستندات من ${inquiry.name}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب ترجمة مستندات جديد</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', 'Cairo', 'Amiri', Tahoma, Arial, sans-serif;
              line-height: 1.8;
              color: #2c3e50;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
              margin: 0;
              padding: 10px;
              direction: rtl;
              text-align: right;
            }
            .email-wrapper {
              width: 100%;
              max-width: 650px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 20px;
              box-shadow: 0 25px 50px rgba(0,0,0,0.15);
              overflow: hidden;
              border: 3px solid #ff4757;
            }
            .urgent-banner {
              background: linear-gradient(45deg, #ff4757 0%, #ff3838 100%);
              color: white;
              padding: 15px;
              text-align: center;
              font-weight: bold;
              font-size: 16px;
              animation: pulse 2s infinite;
            }
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.7; }
              100% { opacity: 1; }
            }
            .header {
              background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
              position: relative;
            }
            .header::after {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 4px;
              background: linear-gradient(90deg, #ffd89b 0%, #19547b 100%);
            }
            .header h1 {
              font-size: 28px;
              margin-bottom: 10px;
              font-weight: 700;
            }
            .header .timestamp {
              background: rgba(255,255,255,0.2);
              padding: 8px 15px;
              border-radius: 20px;
              font-size: 14px;
              margin-top: 15px;
              display: inline-block;
            }
            .content {
              padding: 40px 30px;
            }
            .alert-card {
              background: linear-gradient(145deg, #fff3cd 0%, #ffeaa7 100%);
              border: 3px solid #ffc107;
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
              text-align: center;
              box-shadow: 0 8px 20px rgba(255,193,7,0.3);
            }
            .alert-card .icon {
              font-size: 48px;
              margin-bottom: 15px;
            }
            .alert-card h3 {
              color: #856404;
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 10px;
            }
            .alert-card p {
              color: #856404;
              font-size: 16px;
              font-weight: 600;
            }
            .client-section {
              background: linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%);
              border: 2px solid #2196f3;
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
            }
            .client-section h3 {
              color: #1565c0;
              font-size: 20px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 700;
            }
            .client-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            .client-info-item {
              background: white;
              padding: 15px;
              border-radius: 10px;
              border-right: 4px solid #2196f3;
              box-shadow: 0 3px 10px rgba(0,0,0,0.05);
            }
            .client-info-item strong {
              color: #1565c0;
              display: block;
              margin-bottom: 5px;
              font-size: 14px;
            }
            .client-info-item span {
              color: #2c3e50;
              font-size: 16px;
              font-weight: 600;
            }
            .request-details {
              background: linear-gradient(145deg, #f3e5f5 0%, #e1bee7 100%);
              border: 2px solid #9c27b0;
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
            }
            .request-details h3 {
              color: #6a1b9a;
              font-size: 20px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 700;
            }
            .detail-item {
              background: white;
              margin: 10px 0;
              padding: 15px 20px;
              border-radius: 10px;
              border-right: 4px solid #9c27b0;
              box-shadow: 0 3px 10px rgba(0,0,0,0.05);
            }
            .detail-item strong {
              color: #6a1b9a;
              display: inline-block;
              min-width: 130px;
              font-size: 14px;
            }
            .detail-item span {
              color: #2c3e50;
              font-size: 15px;
              font-weight: 600;
            }
            .priority-section {
              background: linear-gradient(145deg, #c8e6c9 0%, #a5d6a7 100%);
              border: 3px solid #4caf50;
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
              text-align: center;
            }
            .priority-section .icon {
              font-size: 40px;
              margin-bottom: 15px;
            }
            .priority-section h3 {
              color: #2e7d32;
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 10px;
            }
            .action-steps {
              background: linear-gradient(145deg, #ffebee 0%, #ffcdd2 100%);
              border: 2px solid #f44336;
              border-radius: 15px;
              padding: 25px;
              margin: 25px 0;
            }
            .action-steps h3 {
              color: #c62828;
              font-size: 20px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: 700;
            }
            .steps-list {
              list-style: none;
              counter-reset: step-counter;
            }
            .steps-list li {
              counter-increment: step-counter;
              background: white;
              margin: 12px 0;
              padding: 15px 20px 15px 50px;
              border-radius: 10px;
              position: relative;
              box-shadow: 0 3px 10px rgba(0,0,0,0.05);
              font-size: 15px;
              font-weight: 600;
              color: #2c3e50;
            }
            .steps-list li::before {
              content: counter(step-counter);
              position: absolute;
              right: 15px;
              top: 50%;
              transform: translateY(-50%);
              background: #f44336;
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
            }
            .footer {
              background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .footer p {
              margin: 8px 0;
              font-size: 14px;
            }
            
            /* Mobile Responsive Styles */
            @media only screen and (max-width: 600px) {
              body {
                padding: 5px;
              }
              .email-wrapper {
                border-radius: 15px;
                border-width: 2px;
              }
              .urgent-banner {
                padding: 12px;
                font-size: 14px;
              }
              .header {
                padding: 25px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .content {
                padding: 25px 20px;
              }
              .client-info-grid {
                grid-template-columns: 1fr;
                gap: 10px;
              }
              .alert-card, .client-section, .request-details, .priority-section, .action-steps {
                padding: 20px 15px;
                margin: 20px 0;
              }
              .alert-card .icon {
                font-size: 36px;
              }
              .alert-card h3 {
                font-size: 18px;
              }
              .detail-item strong {
                min-width: 100px;
                font-size: 13px;
              }
              .steps-list li {
                padding: 12px 15px 12px 45px;
                font-size: 14px;
              }
              .steps-list li::before {
                width: 25px;
                height: 25px;
                font-size: 12px;
              }
              .footer {
                padding: 25px 20px;
              }
            }
            
            @media only screen and (max-width: 480px) {
              .header h1 {
                font-size: 20px;
              }
              .client-section h3, .request-details h3, .action-steps h3 {
                font-size: 18px;
              }
              .alert-card h3 {
                font-size: 16px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="urgent-banner">
              🚨 تنبيه عاجل - طلب جديد يتطلب المتابعة الفورية 🚨
            </div>
            
            <div class="header">
              <h1>🚨 طلب ترجمة مستندات جديد</h1>
              <div class="timestamp">
                📅 تاريخ الطلب: ${new Date().toLocaleString('ar-SA', { 
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
                <p>تم استلام طلب ترجمة مستندات جديد يتطلب المتابعة السريعة والاهتمام الفوري</p>
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
                </div>
                <div class="client-info-item">
                  <strong>البريد الإلكتروني</strong>
                  <span>${inquiry.email}</span>
                </div>
              </div>
              
              <div class="request-details">
                <h3>📄 تفاصيل الطلب المُستلم</h3>
                <div class="detail-item">
                  <strong>نوع المستند:</strong>
                  <span>${inquiry.documentType}</span>
                </div>
                <div class="detail-item">
                  <strong>اللغة المصدر:</strong>
                  <span>${inquiry.sourceLanguage}</span>
                </div>
                <div class="detail-item">
                  <strong>اللغة المطلوبة:</strong>
                  <span>${inquiry.targetLanguage}</span>
                </div>
                <div class="detail-item">
                  <strong>حجم المستند:</strong>
                  <span>${inquiry.documentSize} صفحة</span>
                </div>
                <div class="detail-item">
                  <strong>مستوى الاستعجال:</strong>
                  <span>${inquiry.urgency}</span>
                </div>
                ${inquiry.additionalNotes ? `
                <div class="detail-item">
                  <strong>ملاحظات إضافية:</strong>
                  <span>${inquiry.additionalNotes}</span>
                </div>
                ` : ''}
              </div>
              
              <div class="priority-section">
                <div class="icon">⏰</div>
                <h3>مطلوب التواصل مع العميل خلال 24 ساعة كحد أقصى</h3>
              </div>
              
              <div class="action-steps">
                <h3>⚡ خطة العمل المطلوبة</h3>
                <ul class="steps-list">
                  <li>مراجعة تفاصيل الطلب والتأكد من جميع المعلومات</li>
                  <li>التواصل مع العميل عبر الهاتف أو البريد لمناقشة التفاصيل</li>
                  <li>طلب المستند الأصلي من العميل لتقييمه بدقة</li>
                  <li>تحديد السعر النهائي وإعداد عرض السعر المفصل</li>
                  <li>إرسال عرض السعر والخطة الزمنية للعميل</li>
                  <li>بدء العمل فور الموافقة وإجراءات الدفع</li>
                </ul>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>ماستر إيدو باث - نظام إدارة الطلبات</strong></p>
              <p>هذا تنبيه تلقائي من نظام إدارة طلبات الترجمة</p>
              <p>&copy; 2024 جميع الحقوق محفوظة</p>
            </div>
          </div>
        </body>
        </html>
      `,
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
        message: "تم إرسال طلبك بنجاح! سنتواصل معك قريباً."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in send-document-translation-inquiry function:", error);
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