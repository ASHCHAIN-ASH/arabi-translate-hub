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
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', 'Cairo', Tahoma, sans-serif;
              background: #f5f7fa;
              direction: rtl;
              text-align: right;
            }
            
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 30px;
              text-align: center;
            }
            
            .header-icon {
              font-size: 48px;
              margin-bottom: 15px;
            }
            
            .header h1 {
              color: white;
              font-size: 28px;
              margin-bottom: 10px;
            }
            
            .header p {
              color: rgba(255,255,255,0.9);
              font-size: 16px;
            }
            
            .success-badge {
              background: #d4edda;
              border: 2px solid #28a745;
              padding: 20px;
              text-align: center;
            }
            
            .success-badge h2 {
              color: #155724;
              font-size: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              flex-direction: row-reverse;
            }
            
            .content {
              padding: 30px;
            }
            
            .greeting {
              background: #f8f9fb;
              padding: 20px;
              border-radius: 12px;
              border-right: 4px solid #667eea;
              margin-bottom: 25px;
            }
            
            .greeting h3 {
              color: #333;
              font-size: 20px;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              gap: 10px;
              flex-direction: row-reverse;
            }
            
            .greeting p {
              color: #666;
              font-size: 15px;
              line-height: 1.6;
            }
            
            .info-box {
              background: white;
              border: 2px solid #e8ecf1;
              border-radius: 12px;
              padding: 25px;
              margin-bottom: 25px;
            }
            
            .info-box h3 {
              color: #667eea;
              font-size: 18px;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              gap: 10px;
              flex-direction: row-reverse;
              padding-bottom: 15px;
              border-bottom: 2px solid #e8ecf1;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #f0f2f5;
              flex-direction: row-reverse;
            }
            
            .info-row:last-child {
              border-bottom: none;
            }
            
            .info-label {
              color: #667eea;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 8px;
              flex-direction: row-reverse;
            }
            
            .info-value {
              color: #333;
              font-weight: 500;
            }
            
            .whatsapp-box {
              background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
              color: white;
              padding: 30px;
              border-radius: 12px;
              text-align: center;
              margin: 25px 0;
            }
            
            .whatsapp-box h3 {
              font-size: 22px;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              flex-direction: row-reverse;
            }
            
            .whatsapp-number {
              background: rgba(255,255,255,0.2);
              padding: 12px 25px;
              border-radius: 50px;
              font-size: 20px;
              font-weight: bold;
              display: inline-block;
              margin: 10px 0;
            }
            
            .alert-box {
              background: #fff3cd;
              border: 2px solid #ffc107;
              border-radius: 12px;
              padding: 20px;
              margin: 25px 0;
            }
            
            .alert-box p {
              color: #856404;
              line-height: 1.6;
              display: flex;
              align-items: start;
              gap: 10px;
              flex-direction: row-reverse;
            }
            
            .footer {
              background: #2c3e50;
              padding: 30px;
              text-align: center;
              color: white;
            }
            
            .footer h4 {
              font-size: 20px;
              margin-bottom: 10px;
            }
            
            .footer p {
              color: rgba(255,255,255,0.8);
              font-size: 14px;
              margin: 5px 0;
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
              <h2><span>✅</span> تم استلام طلبك بنجاح</h2>
            </div>
            
            <div class="content">
              <div class="greeting">
                <h3><span>👋</span> مرحباً ${orderData.fullName}</h3>
                <p>نشكرك على اختيار خدماتنا الأكاديمية. تم استلام طلبك بنجاح وسيتم التواصل معك قريباً.</p>
              </div>
              
              <div class="info-box">
                <h3><span>📋</span> تفاصيل طلبك</h3>
                <div class="info-row">
                  <div class="info-label"><span>🎯</span> الخدمة المطلوبة</div>
                  <div class="info-value">${orderData.serviceTitle}</div>
                </div>
                ${orderData.specialization ? `
                <div class="info-row">
                  <div class="info-label"><span>📖</span> التخصص</div>
                  <div class="info-value">${orderData.specialization}</div>
                </div>
                ` : ''}
                <div class="info-row">
                  <div class="info-label"><span>📧</span> البريد الإلكتروني</div>
                  <div class="info-value">${orderData.email}</div>
                </div>
                <div class="info-row">
                  <div class="info-label"><span>📱</span> رقم الجوال</div>
                  <div class="info-value">${orderData.phone}</div>
                </div>
              </div>
              
              <div class="whatsapp-box">
                <h3><span>💬</span> للتواصل الفوري عبر واتساب</h3>
                <div class="whatsapp-number">${whatsappNumber}</div>
                <p>نحن متواجدون لخدمتك على مدار الساعة</p>
              </div>
              
              <div class="alert-box">
                <p><span>⏰</span> <strong>تنبيه مهم:</strong> سيقوم فريقنا المتخصص بمراجعة طلبك والتواصل معك خلال 24 ساعة لمناقشة تفاصيل الخدمة والبدء في التنفيذ.</p>
              </div>
            </div>
            
            <div class="footer">
              <h4>🎓 Master Edu Path</h4>
              <p>رحلتك نحو التميز الأكاديمي تبدأ هنا</p>
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
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', 'Cairo', Tahoma, sans-serif;
              background: #f5f7fa;
              direction: rtl;
              text-align: right;
            }
            
            .container {
              max-width: 700px;
              margin: 40px auto;
              background: white;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            
            .header {
              background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
              padding: 40px 30px;
              text-align: center;
            }
            
            .admin-badge {
              background: rgba(255,255,255,0.2);
              padding: 8px 20px;
              border-radius: 25px;
              font-size: 14px;
              color: white;
              display: inline-block;
              margin-bottom: 15px;
            }
            
            .header-icon {
              font-size: 52px;
              margin-bottom: 15px;
            }
            
            .header h1 {
              color: white;
              font-size: 32px;
            }
            
            .urgent-banner {
              background: linear-gradient(135deg, #ffd93d 0%, #ffb829 100%);
              color: #854d0e;
              padding: 20px;
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              flex-direction: row-reverse;
            }
            
            .content {
              padding: 40px 30px;
            }
            
            .client-card {
              background: #f8f9fb;
              border: 2px solid #e8ecf1;
              border-radius: 12px;
              padding: 25px;
              margin-bottom: 25px;
            }
            
            .client-header {
              display: flex;
              align-items: center;
              gap: 15px;
              margin-bottom: 20px;
              padding-bottom: 20px;
              border-bottom: 3px solid #ff6b6b;
              flex-direction: row-reverse;
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
            }
            
            .client-info h2 {
              color: #333;
              font-size: 24px;
              margin-bottom: 5px;
            }
            
            .client-info p {
              color: #666;
              font-size: 15px;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 15px;
              margin: 20px 0;
            }
            
            .info-card {
              background: white;
              padding: 20px;
              border-radius: 12px;
              border-right: 4px solid #ff6b6b;
            }
            
            .info-card h4 {
              color: #ff6b6b;
              font-size: 14px;
              margin-bottom: 8px;
              display: flex;
              align-items: center;
              gap: 8px;
              flex-direction: row-reverse;
            }
            
            .info-card p {
              color: #333;
              font-size: 16px;
              font-weight: 600;
              word-break: break-word;
            }
            
            .details-box {
              background: white;
              border: 2px solid #e8ecf1;
              border-radius: 12px;
              padding: 25px;
              margin: 25px 0;
            }
            
            .details-box h3 {
              color: #333;
              font-size: 20px;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 10px;
              flex-direction: row-reverse;
              padding-bottom: 15px;
              border-bottom: 2px solid #e8ecf1;
            }
            
            .details-content {
              background: #f8f9fb;
              padding: 20px;
              border-radius: 8px;
              color: #555;
              line-height: 1.8;
            }
            
            .action-buttons {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin: 25px 0;
            }
            
            .action-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              padding: 15px 20px;
              border-radius: 12px;
              font-weight: 600;
              text-decoration: none;
              flex-direction: row-reverse;
            }
            
            .btn-phone {
              background: #10b981;
              color: white;
            }
            
            .btn-email {
              background: #3b82f6;
              color: white;
            }
            
            .btn-whatsapp {
              background: #25D366;
              color: white;
            }
            
            .footer {
              background: #2c3e50;
              padding: 30px;
              text-align: center;
              color: white;
            }
            
            .footer h4 {
              font-size: 20px;
              margin-bottom: 10px;
            }
            
            .footer p {
              color: rgba(255,255,255,0.8);
              font-size: 14px;
              margin: 5px 0;
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
              <span>⚡</span> يتطلب الرد خلال 24 ساعة
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
                    <h4><span>📧</span> البريد الإلكتروني</h4>
                    <p>${orderData.email}</p>
                  </div>
                  <div class="info-card">
                    <h4><span>📱</span> رقم الجوال</h4>
                    <p>${orderData.phone}</p>
                  </div>
                  ${orderData.specialization ? `
                  <div class="info-card">
                    <h4><span>📖</span> التخصص</h4>
                    <p>${orderData.specialization}</p>
                  </div>
                  ` : ''}
                  <div class="info-card">
                    <h4><span>💬</span> واتساب الخدمة</h4>
                    <p>${whatsappNumber}</p>
                  </div>
                </div>
              </div>
              
              <div class="details-box">
                <h3><span>📝</span> تفاصيل الطلب</h3>
                <div class="details-content">
                  ${orderData.details}
                </div>
              </div>
              
              <div class="action-buttons">
                <a href="tel:${orderData.phone}" class="action-btn btn-phone">
                  <span>📞</span> اتصال مباشر
                </a>
                <a href="mailto:${orderData.email}" class="action-btn btn-email">
                  <span>📧</span> رد عبر البريد
                </a>
                <a href="https://wa.me/${orderData.phone.replace(/\D/g, '')}" class="action-btn btn-whatsapp">
                  <span>💬</span> واتساب
                </a>
              </div>
            </div>
            
            <div class="footer">
              <h4>🎓 Master Edu Path</h4>
              <p>نظام إدارة الطلبات</p>
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
