import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ServiceOrderRequest {
  fullName: string;
  email: string;
  phone: string;
  serviceTitle: string;
  serviceType: string;
  specialization?: string;
  details: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: ServiceOrderRequest = await req.json();
    console.log("Received service order:", orderData);

    // WhatsApp numbers for different services
    const whatsappNumbers: Record<string, string> = {
      'book-summarization': '+966500776343',
      'assignment-execution': '+966500776343',
      'ebook-creation': '+966500776343',
      'research-proposal': '+966559600824',
      'references-provision': '+966559600824',
      'homework-assistance': '+966559600824',
    };

    const whatsappNumber = whatsappNumbers[orderData.serviceType] || '+966500776343';

    // Email to client
    const clientEmail = await resend.emails.send({
      from: "خدمات الطلاب <info@masteredupath.com>",
      to: [orderData.email],
      subject: `تأكيد طلب خدمة: ${orderData.serviceTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              direction: rtl;
              text-align: right;
              padding: 40px 20px;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            
            @keyframes shimmer {
              0% { background-position: -1000px 0; }
              100% { background-position: 1000px 0; }
            }
            
            .container {
              max-width: 650px;
              margin: 0 auto;
              background: white;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              animation: fadeIn 0.6s ease-out;
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 50px 40px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
              animation: shimmer 3s infinite;
            }
            
            .header-icon {
              width: 80px;
              height: 80px;
              background: white;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
              margin-bottom: 20px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              animation: pulse 2s ease-in-out infinite;
              position: relative;
            }
            
            .header h1 {
              color: white;
              font-size: 32px;
              font-weight: 800;
              margin-bottom: 12px;
              text-shadow: 0 2px 10px rgba(0,0,0,0.2);
              position: relative;
            }
            
            .header p {
              color: rgba(255,255,255,0.95);
              font-size: 17px;
              font-weight: 500;
              position: relative;
            }
            
            .success-badge {
              background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
              border-top: 4px solid #28a745;
              border-bottom: 4px solid #28a745;
              padding: 25px;
              text-align: center;
              animation: slideUp 0.5s ease-out 0.2s both;
            }
            
            .success-badge h2 {
              color: #155724;
              font-size: 24px;
              font-weight: 700;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              direction: rtl;
            }
            
            .success-icon {
              width: 36px;
              height: 36px;
              background: #28a745;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 20px;
              order: -1;
            }
            
            .content {
              padding: 40px;
              animation: slideUp 0.5s ease-out 0.3s both;
            }
            
            .greeting {
              background: linear-gradient(135deg, #f8f9fb 0%, #e8ecf1 100%);
              padding: 25px;
              border-radius: 16px;
              border-right: 5px solid #667eea;
              margin-bottom: 30px;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.1);
            }
            
            .greeting h3 {
              color: #333;
              font-size: 22px;
              font-weight: 700;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 12px;
              direction: rtl;
            }
            
            .greeting-icon {
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 20px;
              order: -1;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            
            .greeting p {
              color: #666;
              font-size: 16px;
              line-height: 1.8;
              font-weight: 500;
            }
            
            .info-box {
              background: white;
              border: 2px solid #e8ecf1;
              border-radius: 16px;
              padding: 30px;
              margin-bottom: 30px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.08);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .info-box:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 35px rgba(0,0,0,0.12);
            }
            
            .info-box h3 {
              color: #667eea;
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 25px;
              display: flex;
              align-items: center;
              gap: 12px;
              direction: rtl;
              padding-bottom: 20px;
              border-bottom: 3px solid #e8ecf1;
            }
            
            .info-icon {
              width: 38px;
              height: 38px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 18px;
              order: -1;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px 18px;
              border-bottom: 1px solid #f0f2f5;
              direction: rtl;
              transition: background 0.2s ease;
              border-radius: 10px;
            }
            
            .info-row:hover {
              background: #f8f9fb;
            }
            
            .info-row:last-child {
              border-bottom: none;
            }
            
            .info-label {
              color: #667eea;
              font-weight: 600;
              font-size: 15px;
              display: flex;
              align-items: center;
              gap: 10px;
              direction: rtl;
            }
            
            .info-label-icon {
              width: 28px;
              height: 28px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 8px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 14px;
              order: -1;
            }
            
            .info-value {
              color: #333;
              font-weight: 600;
              font-size: 15px;
            }
            
            .whatsapp-box {
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
              color: white;
              padding: 35px;
              border-radius: 20px;
              text-align: center;
              margin: 30px 0;
              box-shadow: 0 12px 35px rgba(37, 211, 102, 0.4);
              position: relative;
              overflow: hidden;
            }
            
            .whatsapp-box::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
              animation: shimmer 3s infinite;
            }
            
            .whatsapp-box h3 {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              direction: rtl;
              position: relative;
            }
            
            .whatsapp-icon {
              width: 48px;
              height: 48px;
              background: white;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 28px;
              order: -1;
              animation: pulse 2s ease-in-out infinite;
            }
            
            .whatsapp-number {
              background: rgba(255,255,255,0.25);
              backdrop-filter: blur(10px);
              padding: 16px 35px;
              border-radius: 50px;
              font-size: 22px;
              font-weight: 800;
              display: inline-block;
              margin: 15px 0;
              border: 2px solid rgba(255,255,255,0.3);
              position: relative;
            }
            
            .whatsapp-note {
              font-size: 15px;
              opacity: 0.95;
              font-weight: 500;
              position: relative;
            }
            
            .alert-box {
              background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
              border: 2px solid #ffc107;
              border-radius: 16px;
              padding: 25px;
              margin: 30px 0;
              box-shadow: 0 6px 20px rgba(255, 193, 7, 0.2);
            }
            
            .alert-box p {
              color: #856404;
              line-height: 1.8;
              font-size: 15px;
              font-weight: 500;
              display: flex;
              align-items: start;
              gap: 12px;
              direction: rtl;
            }
            
            .alert-icon {
              width: 32px;
              height: 32px;
              background: #ffc107;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              order: -1;
              flex-shrink: 0;
            }
            
            .footer {
              background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
              padding: 40px;
              text-align: center;
              color: white;
            }
            
            .footer-icon {
              font-size: 48px;
              margin-bottom: 15px;
              animation: pulse 2s ease-in-out infinite;
            }
            
            .footer h4 {
              font-size: 24px;
              font-weight: 800;
              margin-bottom: 12px;
            }
            
            .footer p {
              color: rgba(255,255,255,0.85);
              font-size: 15px;
              margin: 8px 0;
              font-weight: 500;
            }
            
            .footer-divider {
              height: 2px;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
              margin: 25px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="header-icon">📚</div>
              <h1>تم استلام طلبك بنجاح</h1>
              <p>Master Edu Path - الطريق للتميز الأكاديمي</p>
            </div>
            
            <div class="success-badge">
              <h2>
                <span class="success-icon">✓</span>
                تم استلام طلبك بنجاح
              </h2>
            </div>
            
            <div class="content">
              <div class="greeting">
                <h3>
                  <span class="greeting-icon">👋</span>
                  مرحباً ${orderData.fullName}
                </h3>
                <p>نشكرك على اختيار خدماتنا الأكاديمية. تم استلام طلبك بنجاح وسيتم التواصل معك قريباً لمناقشة التفاصيل والبدء في تقديم الخدمة بأعلى جودة.</p>
              </div>
              
              <div class="info-box">
                <h3>
                  <span class="info-icon">📋</span>
                  تفاصيل طلبك
                </h3>
                <div class="info-row">
                  <div class="info-label">
                    <span class="info-label-icon">🎯</span>
                    الخدمة المطلوبة
                  </div>
                  <div class="info-value">${orderData.serviceTitle}</div>
                </div>
                ${orderData.specialization ? `
                <div class="info-row">
                  <div class="info-label">
                    <span class="info-label-icon">📖</span>
                    التخصص
                  </div>
                  <div class="info-value">${orderData.specialization}</div>
                </div>
                ` : ''}
                <div class="info-row">
                  <div class="info-label">
                    <span class="info-label-icon">📧</span>
                    البريد الإلكتروني
                  </div>
                  <div class="info-value">${orderData.email}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">
                    <span class="info-label-icon">📱</span>
                    رقم الجوال
                  </div>
                  <div class="info-value">${orderData.phone}</div>
                </div>
              </div>
              
              <div class="whatsapp-box">
                <h3>
                  <span class="whatsapp-icon">💬</span>
                  للتواصل الفوري عبر واتساب
                </h3>
                <div class="whatsapp-number">${whatsappNumber}</div>
                <p class="whatsapp-note">نحن متواجدون لخدمتك على مدار الساعة</p>
              </div>
              
              <div class="alert-box">
                <p>
                  <span class="alert-icon">⏰</span>
                  <strong>تنبيه مهم:</strong> سيقوم فريقنا المتخصص بمراجعة طلبك والتواصل معك خلال 24 ساعة لمناقشة تفاصيل الخدمة والبدء في التنفيذ.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-icon">🎓</div>
              <h4>Master Edu Path</h4>
              <p>رحلتك نحو التميز الأكاديمي تبدأ هنا</p>
              <div class="footer-divider"></div>
              <p>info@masteredupath.com</p>
              <p>© 2025 Master Edu Path. جميع الحقوق محفوظة</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Email to admin
    const adminEmail = await resend.emails.send({
      from: "طلب خدمة جديد <info@masteredupath.com>",
      to: ["info@masteredupath.com"],
      subject: `طلب خدمة جديد: ${orderData.serviceTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
              background: linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%);
              direction: rtl;
              text-align: right;
              padding: 40px 20px;
            }
            
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            
            @keyframes shimmer {
              0% { background-position: -1000px 0; }
              100% { background-position: 1000px 0; }
            }
            
            @keyframes ring {
              0%, 100% { transform: rotate(0deg); }
              10%, 30% { transform: rotate(-10deg); }
              20%, 40% { transform: rotate(10deg); }
            }
            
            .container {
              max-width: 750px;
              margin: 0 auto;
              background: white;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              animation: fadeIn 0.6s ease-out;
            }
            
            .header {
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
              padding: 50px 40px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
              animation: shimmer 3s infinite;
            }
            
            .admin-badge {
              background: rgba(255,255,255,0.25);
              backdrop-filter: blur(10px);
              padding: 10px 24px;
              border-radius: 50px;
              font-size: 15px;
              color: white;
              display: inline-block;
              margin-bottom: 20px;
              border: 2px solid rgba(255,255,255,0.3);
              font-weight: 600;
              position: relative;
            }
            
            .header-icon {
              width: 80px;
              height: 80px;
              background: white;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 42px;
              margin-bottom: 20px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              animation: ring 2s ease-in-out infinite;
              position: relative;
            }
            
            .header h1 {
              color: white;
              font-size: 36px;
              font-weight: 800;
              text-shadow: 0 2px 10px rgba(0,0,0,0.2);
              position: relative;
            }
            
            .urgent-banner {
              background: linear-gradient(135deg, #ffd93d 0%, #ffb829 100%);
              color: #854d0e;
              padding: 25px;
              text-align: center;
              font-weight: 700;
              font-size: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 15px;
              direction: rtl;
              border-top: 4px solid #f59e0b;
              border-bottom: 4px solid #f59e0b;
            }
            
            .urgent-icon {
              width: 40px;
              height: 40px;
              background: #f59e0b;
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              order: -1;
              animation: pulse 1.5s ease-in-out infinite;
            }
            
            .content {
              padding: 45px 40px;
              animation: slideUp 0.5s ease-out 0.3s both;
            }
            
            .client-card {
              background: linear-gradient(135deg, #f8f9fb 0%, #e8ecf1 100%);
              border: 2px solid #e8ecf1;
              border-radius: 20px;
              padding: 30px;
              margin-bottom: 30px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            }
            
            .client-header {
              display: flex;
              align-items: center;
              gap: 20px;
              margin-bottom: 25px;
              padding-bottom: 25px;
              border-bottom: 4px solid #ff6b6b;
              direction: rtl;
            }
            
            .client-avatar {
              width: 70px;
              height: 70px;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 34px;
              color: white;
              order: -1;
              box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
            }
            
            .client-info h2 {
              color: #333;
              font-size: 26px;
              font-weight: 800;
              margin-bottom: 8px;
            }
            
            .client-info p {
              color: #666;
              font-size: 16px;
              font-weight: 600;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 18px;
              margin: 25px 0;
            }
            
            .info-card {
              background: white;
              padding: 25px;
              border-radius: 16px;
              border-right: 5px solid #ff6b6b;
              box-shadow: 0 6px 20px rgba(0,0,0,0.08);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .info-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 10px 30px rgba(0,0,0,0.12);
            }
            
            .info-card h4 {
              color: #ff6b6b;
              font-size: 15px;
              font-weight: 700;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              direction: rtl;
            }
            
            .info-card-icon {
              width: 32px;
              height: 32px;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
              border-radius: 8px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 16px;
              order: -1;
            }
            
            .info-card p {
              color: #333;
              font-size: 17px;
              font-weight: 700;
              word-break: break-word;
            }
            
            .details-box {
              background: white;
              border: 2px solid #e8ecf1;
              border-radius: 20px;
              padding: 30px;
              margin: 30px 0;
              box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            }
            
            .details-box h3 {
              color: #333;
              font-size: 22px;
              font-weight: 700;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 12px;
              direction: rtl;
              padding-bottom: 20px;
              border-bottom: 3px solid #e8ecf1;
            }
            
            .details-icon {
              width: 38px;
              height: 38px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 18px;
              order: -1;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
            
            .details-content {
              background: #f8f9fb;
              padding: 25px;
              border-radius: 12px;
              color: #555;
              line-height: 2;
              font-size: 16px;
              font-weight: 500;
            }
            
            .action-buttons {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
              gap: 18px;
              margin: 30px 0;
            }
            
            .action-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              padding: 18px 25px;
              border-radius: 14px;
              font-weight: 700;
              font-size: 16px;
              text-decoration: none;
              direction: rtl;
              transition: all 0.3s ease;
              box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            }
            
            .action-btn:hover {
              transform: translateY(-3px);
              box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            }
            
            .action-icon {
              width: 32px;
              height: 32px;
              background: rgba(255,255,255,0.2);
              border-radius: 8px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              order: -1;
            }
            
            .btn-phone {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
            }
            
            .btn-email {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
            }
            
            .btn-whatsapp {
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
              color: white;
            }
            
            .footer {
              background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
              padding: 45px 40px;
              text-align: center;
              color: white;
            }
            
            .footer-icon {
              font-size: 52px;
              margin-bottom: 18px;
              animation: pulse 2s ease-in-out infinite;
            }
            
            .footer h4 {
              font-size: 26px;
              font-weight: 800;
              margin-bottom: 12px;
            }
            
            .footer p {
              color: rgba(255,255,255,0.85);
              font-size: 15px;
              margin: 8px 0;
              font-weight: 500;
            }
            
            .footer-divider {
              height: 2px;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
              margin: 25px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="admin-badge">🔐 لوحة التحكم الإدارية</div>
              <div class="header-icon">🔔</div>
              <h1>طلب خدمة جديد</h1>
            </div>
            
            <div class="urgent-banner">
              <span class="urgent-icon">⚡</span>
              يتطلب الرد خلال 24 ساعة
            </div>
            
            <div class="content">
              <div class="client-card">
                <div class="client-header">
                  <div class="client-avatar">👤</div>
                  <div class="client-info">
                    <h2>${orderData.fullName}</h2>
                    <p>طلب خدمة: ${orderData.serviceTitle}</p>
                  </div>
                </div>
                
                <div class="info-grid">
                  <div class="info-card">
                    <h4>
                      <span class="info-card-icon">📧</span>
                      البريد الإلكتروني
                    </h4>
                    <p>${orderData.email}</p>
                  </div>
                  <div class="info-card">
                    <h4>
                      <span class="info-card-icon">📱</span>
                      رقم الجوال
                    </h4>
                    <p>${orderData.phone}</p>
                  </div>
                  ${orderData.specialization ? `
                  <div class="info-card">
                    <h4>
                      <span class="info-card-icon">📖</span>
                      التخصص
                    </h4>
                    <p>${orderData.specialization}</p>
                  </div>
                  ` : ''}
                  <div class="info-card">
                    <h4>
                      <span class="info-card-icon">💬</span>
                      واتساب الخدمة
                    </h4>
                    <p>${whatsappNumber}</p>
                  </div>
                </div>
              </div>
              
              <div class="details-box">
                <h3>
                  <span class="details-icon">📝</span>
                  تفاصيل الطلب
                </h3>
                <div class="details-content">
                  ${orderData.details}
                </div>
              </div>
              
              <div class="action-buttons">
                <a href="tel:${orderData.phone}" class="action-btn btn-phone">
                  <span class="action-icon">📞</span>
                  اتصال مباشر
                </a>
                <a href="mailto:${orderData.email}" class="action-btn btn-email">
                  <span class="action-icon">📧</span>
                  رد عبر البريد
                </a>
                <a href="https://wa.me/${orderData.phone.replace(/\D/g, '')}" class="action-btn btn-whatsapp">
                  <span class="action-icon">💬</span>
                  واتساب
                </a>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-icon">🎓</div>
              <h4>Master Edu Path</h4>
              <p>نظام إدارة الطلبات</p>
              <div class="footer-divider"></div>
              <p>info@masteredupath.com</p>
              <p>© 2025 Master Edu Path. جميع الحقوق محفوظة</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Client email sent:", clientEmail);
    console.log("Admin email sent:", adminEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        clientEmailId: clientEmail.data?.id,
        adminEmailId: adminEmail.data?.id 
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
    console.error("Error in send-student-service-order function:", error);
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
