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
      'premium-templates': '+966559600824'
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
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Segoe UI', 'Cairo', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              margin: 0; 
              padding: 40px 20px; 
              direction: rtl;
            }
            .email-wrapper { max-width: 650px; margin: 0 auto; }
            .container { 
              background: white; 
              border-radius: 24px; 
              overflow: hidden; 
              box-shadow: 0 25px 80px rgba(0,0,0,0.25); 
            }
            
            /* Header Styles */
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 50px 30px;
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
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            }
            .logo-section {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 15px;
              margin-bottom: 20px;
              position: relative;
            }
            .logo-icon {
              width: 60px;
              height: 60px;
              background: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
              box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            }
            .header h1 { 
              color: white; 
              margin: 0; 
              font-size: 32px; 
              text-shadow: 2px 4px 8px rgba(0,0,0,0.3);
              position: relative;
            }
            .header-subtitle {
              color: rgba(255,255,255,0.9);
              font-size: 16px;
              margin-top: 10px;
              position: relative;
            }
            
            /* Content Styles */
            .content { padding: 45px 35px; background: #fafbfc; }
            
            .greeting {
              display: flex;
              align-items: center;
              gap: 12px;
              background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
              padding: 20px;
              border-radius: 16px;
              margin-bottom: 25px;
              border-right: 5px solid #667eea;
            }
            .greeting-icon {
              font-size: 32px;
              animation: wave 1.5s ease-in-out infinite;
            }
            @keyframes wave {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(20deg); }
              75% { transform: rotate(-20deg); }
            }
            .greeting-text {
              flex: 1;
            }
            .greeting-text h2 {
              color: #333;
              font-size: 22px;
              margin-bottom: 5px;
            }
            .greeting-text p {
              color: #666;
              font-size: 15px;
              line-height: 1.6;
            }
            
            /* Info Box */
            .info-box { 
              background: white;
              border-radius: 18px; 
              padding: 30px; 
              margin: 25px 0; 
              border: 2px solid #e8ecf1;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            }
            .info-box-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #e8ecf1;
            }
            .info-box-header-icon {
              font-size: 28px;
            }
            .info-box-header h3 { 
              color: #667eea; 
              font-size: 20px;
              margin: 0;
            }
            .info-row { 
              display: flex; 
              align-items: center;
              justify-content: space-between; 
              margin: 18px 0; 
              padding: 15px; 
              background: #f8f9fb;
              border-radius: 10px;
              transition: all 0.3s ease;
            }
            .info-row:hover {
              background: #f0f2f5;
              transform: translateX(-5px);
            }
            .info-label { 
              font-weight: 600; 
              color: #667eea;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 15px;
              text-align: right;
            }
            .info-label-icon {
              font-size: 18px;
            }
            .info-value { 
              color: #333;
              font-weight: 500;
              font-size: 15px;
              text-align: left;
            }

            /* WhatsApp Section */
            .whatsapp-section { 
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
              color: white; 
              padding: 35px; 
              border-radius: 18px; 
              margin: 30px 0; 
              text-align: center;
              box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
              position: relative;
              overflow: hidden;
            }
            .whatsapp-section::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            }
            .whatsapp-icon {
              font-size: 48px;
              margin-bottom: 15px;
              animation: pulse 2s ease-in-out infinite;
              position: relative;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
            .whatsapp-section h3 { 
              margin: 0 0 20px 0; 
              font-size: 24px;
              position: relative;
            }
            .whatsapp-numbers {
              display: flex;
              justify-content: center;
              gap: 20px;
              flex-wrap: wrap;
              position: relative;
            }
            .whatsapp-number { 
              background: rgba(255,255,255,0.2);
              padding: 15px 30px;
              border-radius: 50px;
              font-size: 22px; 
              font-weight: bold; 
              letter-spacing: 1px;
              backdrop-filter: blur(10px);
              border: 2px solid rgba(255,255,255,0.3);
            }
            .whatsapp-note {
              margin: 20px 0 0 0; 
              font-size: 15px;
              opacity: 0.95;
              position: relative;
            }

            /* Alert Box */
            .alert-box {
              background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%);
              border-right: 5px solid #ffc107;
              border-radius: 12px;
              padding: 20px;
              margin: 25px 0;
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .alert-icon {
              font-size: 32px;
            }
            .alert-text {
              flex: 1;
              color: #856404;
              line-height: 1.6;
            }
            .alert-text strong {
              color: #533f03;
            }
            
            /* Footer Styles */
            .footer { 
              background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
              padding: 40px 30px;
              text-align: center;
              color: #ecf0f1;
            }
            .footer-content {
              max-width: 500px;
              margin: 0 auto;
            }
            .footer-logo {
              font-size: 42px;
              margin-bottom: 15px;
            }
            .footer-title {
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 10px;
              color: white;
            }
            .footer-subtitle {
              font-size: 15px;
              color: #bdc3c7;
              margin-bottom: 25px;
            }
            .footer-divider {
              height: 2px;
              background: linear-gradient(90deg, transparent, #667eea, transparent);
              margin: 25px 0;
            }
            .footer-links {
              display: flex;
              justify-content: center;
              gap: 20px;
              margin: 20px 0;
              flex-wrap: wrap;
            }
            .footer-link {
              color: #ecf0f1;
              text-decoration: none;
              font-size: 14px;
              padding: 8px 15px;
              background: rgba(255,255,255,0.1);
              border-radius: 20px;
              transition: all 0.3s ease;
            }
            .footer-link:hover {
              background: rgba(255,255,255,0.2);
              transform: translateY(-2px);
            }
            .footer-social {
              display: flex;
              justify-content: center;
              gap: 15px;
              margin: 20px 0;
            }
            .social-icon {
              width: 40px;
              height: 40px;
              background: rgba(255,255,255,0.1);
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
              transition: all 0.3s ease;
            }
            .social-icon:hover {
              background: #667eea;
              transform: scale(1.1);
            }
            .footer-copyright {
              margin-top: 25px;
              padding-top: 20px;
              border-top: 1px solid rgba(255,255,255,0.1);
              font-size: 13px;
              color: #95a5a6;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <!-- Header -->
              <div class="header">
                <div class="logo-section">
                  <div class="logo-icon">📚</div>
                  <div>
                    <h1>تم استلام طلبك بنجاح</h1>
                    <div class="header-subtitle">Master Edu Path - الطريق للتميز الأكاديمي</div>
                  </div>
                </div>
              </div>
              
              <!-- Content -->
              <div class="content">
                <div class="greeting">
                  <div class="greeting-icon">👋</div>
                  <div class="greeting-text">
                    <h2>مرحباً ${orderData.fullName}</h2>
                    <p>نشكرك على اختيار خدماتنا الأكاديمية. تم استلام طلبك بنجاح وسيتم التواصل معك قريباً.</p>
                  </div>
                </div>
                
                <div class="info-box">
                  <div class="info-box-header">
                    <span class="info-box-header-icon">📋</span>
                    <h3>تفاصيل طلبك</h3>
                  </div>
                  <div class="info-row">
                    <span class="info-label">
                      <span class="info-label-icon">🎯</span>
                      الخدمة المطلوبة
                    </span>
                    <span class="info-value">${orderData.serviceTitle}</span>
                  </div>
                  ${orderData.specialization ? `
                  <div class="info-row">
                    <span class="info-label">
                      <span class="info-label-icon">📖</span>
                      التخصص
                    </span>
                    <span class="info-value">${orderData.specialization}</span>
                  </div>
                  ` : ''}
                  <div class="info-row">
                    <span class="info-label">
                      <span class="info-label-icon">📧</span>
                      البريد الإلكتروني
                    </span>
                    <span class="info-value">${orderData.email}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">
                      <span class="info-label-icon">📱</span>
                      رقم الجوال
                    </span>
                    <span class="info-value">${orderData.phone}</span>
                  </div>
                </div>

                <div class="whatsapp-section">
                  <div class="whatsapp-icon">💬</div>
                  <h3>للتواصل الفوري عبر واتساب</h3>
                  <div class="whatsapp-numbers">
                    <div class="whatsapp-number">${whatsappNumber}</div>
                  </div>
                  <p class="whatsapp-note">نحن متواجدون لخدمتك على مدار الساعة</p>
                </div>

                <div class="alert-box">
                  <div class="alert-icon">⏰</div>
                  <div class="alert-text">
                    <strong>تنبيه مهم:</strong> سيقوم فريقنا المتخصص بمراجعة طلبك والتواصل معك خلال <strong>24 ساعة</strong> لمناقشة تفاصيل الخدمة والبدء في التنفيذ.
                  </div>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <div class="footer-content">
                  <div class="footer-logo">🎓</div>
                  <div class="footer-title">Master Edu Path</div>
                  <div class="footer-subtitle">رحلتك نحو التميز الأكاديمي تبدأ هنا</div>
                  
                  <div class="footer-divider"></div>
                  
                  <div class="footer-links">
                    <a href="#" class="footer-link">الرئيسية</a>
                    <a href="#" class="footer-link">خدماتنا</a>
                    <a href="#" class="footer-link">تواصل معنا</a>
                  </div>
                  
                  <div class="footer-social">
                    <span class="social-icon">📱</span>
                    <span class="social-icon">📧</span>
                    <span class="social-icon">🌐</span>
                  </div>
                  
                  <div class="footer-copyright">
                    © 2025 Master Edu Path. جميع الحقوق محفوظة<br>
                    info@masteredupath.com
                  </div>
                </div>
              </div>
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
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Segoe UI', 'Cairo', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%);
              margin: 0; 
              padding: 40px 20px;
              direction: rtl;
            }
            .email-wrapper { max-width: 700px; margin: 0 auto; }
            .container { 
              background: white; 
              border-radius: 24px; 
              overflow: hidden; 
              box-shadow: 0 30px 90px rgba(0,0,0,0.3); 
            }
            
            /* Admin Header */
            .header { 
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
              padding: 50px 30px;
              text-align: center;
              position: relative;
              overflow: hidden;
            }
            .header::before {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
            }
            .admin-badge {
              display: inline-block;
              background: rgba(255,255,255,0.2);
              padding: 8px 20px;
              border-radius: 25px;
              font-size: 14px;
              color: white;
              margin-bottom: 15px;
              backdrop-filter: blur(10px);
              border: 2px solid rgba(255,255,255,0.3);
              position: relative;
            }
            .header-icon {
              font-size: 52px;
              margin-bottom: 15px;
              animation: ring 2s ease-in-out infinite;
              position: relative;
            }
            @keyframes ring {
              0%, 100% { transform: rotate(0deg); }
              10%, 30% { transform: rotate(-15deg); }
              20%, 40% { transform: rotate(15deg); }
            }
            .header h1 { 
              color: white; 
              margin: 0; 
              font-size: 34px; 
              text-shadow: 2px 4px 8px rgba(0,0,0,0.3);
              position: relative;
            }
            
            /* Urgent Banner */
            .urgent-banner { 
              background: linear-gradient(135deg, #ffd93d 0%, #ffb829 100%);
              color: #854d0e; 
              padding: 20px 25px; 
              text-align: center; 
              font-weight: bold;
              font-size: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              border-bottom: 3px solid #f59e0b;
            }
            .urgent-icon {
              font-size: 28px;
              animation: flash 1.5s ease-in-out infinite;
            }
            @keyframes flash {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            
            /* Content */
            .content { padding: 45px 35px; background: #fafbfc; }
            
            .client-card {
              background: white;
              border-radius: 18px;
              padding: 30px;
              margin-bottom: 30px;
              border: 2px solid #e8ecf1;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            }
            .client-card-header {
              display: flex;
              align-items: center;
              gap: 15px;
              margin-bottom: 25px;
              padding-bottom: 20px;
              border-bottom: 3px solid #ff6b6b;
            }
            .client-avatar {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 30px;
              color: white;
              box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
            }
            .client-info h2 {
              color: #333;
              font-size: 24px;
              margin-bottom: 5px;
            }
            .client-subtitle {
              color: #666;
              font-size: 15px;
            }
            
            /* Info Grid */
            .info-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 20px; 
              margin: 25px 0; 
            }
            .info-card { 
              background: white;
              padding: 25px; 
              border-radius: 16px; 
              border-right: 5px solid #ff6b6b;
              box-shadow: 0 3px 12px rgba(0,0,0,0.08);
              transition: all 0.3s ease;
            }
            .info-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            .info-card-header {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 12px;
            }
            .info-card-icon {
              font-size: 24px;
            }
            .info-card h4 { 
              margin: 0; 
              color: #ff6b6b; 
              font-size: 14px;
              font-weight: 600;
            }
            .info-card p { 
              margin: 0; 
              color: #333; 
              font-size: 17px; 
              font-weight: 600;
              word-break: break-word;
            }
            
            /* Details Box */
            .details-box { 
              background: white;
              padding: 30px; 
              border-radius: 16px; 
              margin: 25px 0;
              border: 2px solid #e8ecf1;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            }
            .details-box-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #e8ecf1;
            }
            .details-box-icon {
              font-size: 28px;
            }
            .details-box h3 { 
              margin: 0; 
              color: #333;
              font-size: 20px;
            }
            .details-content {
              background: #f8f9fb;
              padding: 20px;
              border-radius: 12px;
              color: #555;
              line-height: 1.8;
              font-size: 15px;
            }
            
            /* Action Buttons */
            .action-buttons { 
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin: 30px 0;
            }
            .action-btn { 
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              background: white;
              color: #333;
              padding: 18px 25px; 
              text-decoration: none; 
              border-radius: 14px; 
              font-weight: 600;
              font-size: 15px;
              border: 2px solid #e8ecf1;
              transition: all 0.3s ease;
            }
            .action-btn:hover {
              transform: translateY(-3px);
              box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            }
            .action-btn.phone { border-color: #10b981; color: #10b981; }
            .action-btn.phone:hover { background: #10b981; color: white; }
            .action-btn.email { border-color: #3b82f6; color: #3b82f6; }
            .action-btn.email:hover { background: #3b82f6; color: white; }
            .action-btn.whatsapp { border-color: #25D366; color: #25D366; }
            .action-btn.whatsapp:hover { background: #25D366; color: white; }
            .action-icon {
              font-size: 20px;
            }
            
            /* Footer */
            .footer { 
              background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
              padding: 40px 30px;
              text-align: center;
              color: #ecf0f1;
            }
            .footer-content {
              max-width: 500px;
              margin: 0 auto;
            }
            .footer-logo {
              font-size: 42px;
              margin-bottom: 15px;
            }
            .footer-title {
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 10px;
              color: white;
            }
            .footer-subtitle {
              font-size: 15px;
              color: #bdc3c7;
              margin-bottom: 25px;
            }
            .footer-divider {
              height: 2px;
              background: linear-gradient(90deg, transparent, #ff6b6b, transparent);
              margin: 25px 0;
            }
            .footer-info {
              background: rgba(255,255,255,0.1);
              padding: 20px;
              border-radius: 12px;
              margin: 20px 0;
            }
            .footer-info p {
              margin: 8px 0;
              font-size: 14px;
            }
            .footer-copyright {
              margin-top: 25px;
              padding-top: 20px;
              border-top: 1px solid rgba(255,255,255,0.1);
              font-size: 13px;
              color: #95a5a6;
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="container">
              <!-- Header -->
              <div class="header">
                <div class="admin-badge">🔐 لوحة التحكم الإدارية</div>
                <div class="header-icon">🔔</div>
                <h1>طلب خدمة جديد</h1>
              </div>
              
              <!-- Urgent Banner -->
              <div class="urgent-banner">
                <span class="urgent-icon">⚡</span>
                <span>يتطلب الرد خلال 24 ساعة</span>
              </div>
              
              <!-- Content -->
              <div class="content">
                <div class="client-card">
                  <div class="client-card-header">
                    <div class="client-avatar">👤</div>
                    <div class="client-info">
                      <h2>${orderData.fullName}</h2>
                      <div class="client-subtitle">طلب خدمة: ${orderData.serviceTitle}</div>
                    </div>
                  </div>
                  
                  <div class="info-grid">
                    <div class="info-card">
                      <div class="info-card-header">
                        <span class="info-card-icon">📧</span>
                        <h4>البريد الإلكتروني</h4>
                      </div>
                      <p>${orderData.email}</p>
                    </div>
                    <div class="info-card">
                      <div class="info-card-header">
                        <span class="info-card-icon">📱</span>
                        <h4>رقم الجوال</h4>
                      </div>
                      <p>${orderData.phone}</p>
                    </div>
                    ${orderData.specialization ? `
                    <div class="info-card">
                      <div class="info-card-header">
                        <span class="info-card-icon">📖</span>
                        <h4>التخصص</h4>
                      </div>
                      <p>${orderData.specialization}</p>
                    </div>
                    ` : ''}
                    <div class="info-card">
                      <div class="info-card-header">
                        <span class="info-card-icon">💬</span>
                        <h4>واتساب الخدمة</h4>
                      </div>
                      <p>${whatsappNumber}</p>
                    </div>
                  </div>
                </div>

                <div class="details-box">
                  <div class="details-box-header">
                    <span class="details-box-icon">📝</span>
                    <h3>تفاصيل الطلب من العميل</h3>
                  </div>
                  <div class="details-content">
                    ${orderData.details}
                  </div>
                </div>

                <div class="action-buttons">
                  <a href="tel:${orderData.phone}" class="action-btn phone">
                    <span class="action-icon">📞</span>
                    اتصال مباشر
                  </a>
                  <a href="mailto:${orderData.email}" class="action-btn email">
                    <span class="action-icon">✉️</span>
                    إرسال بريد
                  </a>
                  <a href="https://wa.me/${orderData.phone.replace(/[^0-9]/g, '')}" class="action-btn whatsapp">
                    <span class="action-icon">💬</span>
                    فتح واتساب
                  </a>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <div class="footer-content">
                  <div class="footer-logo">🎓</div>
                  <div class="footer-title">Master Edu Path</div>
                  <div class="footer-subtitle">نظام إدارة الطلبات</div>
                  
                  <div class="footer-divider"></div>
                  
                  <div class="footer-info">
                    <p><strong>📧 البريد الإلكتروني:</strong> info@masteredupath.com</p>
                    <p><strong>📱 واتساب:</strong> ${whatsappNumber}</p>
                  </div>
                  
                  <div class="footer-copyright">
                    © 2025 Master Edu Path. جميع الحقوق محفوظة<br>
                    هذا البريد مرسل تلقائياً من نظام إدارة الطلبات
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Emails sent successfully:", { clientEmail, adminEmail });

    return new Response(
      JSON.stringify({ 
        success: true, 
        clientEmail, 
        adminEmail,
        whatsappNumber 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
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
