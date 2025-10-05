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
      'book-summarization': '+966500647447',
      'assignment-execution': '+966500647447',
      'ebook-creation': '+966500647447',
      'research-proposal': '+966500647447',
      'references-provision': '+966500647447',
      'homework-assistance': '+966500647447',
      'premium-templates': '+966500647447'
    };

    const whatsappNumber = whatsappNumbers[orderData.serviceType] || '+966500647447';

    // Email to client
    const clientEmail = await resend.emails.send({
      from: "خدمات الطلاب <onboarding@resend.dev>",
      to: [orderData.email],
      subject: `تأكيد طلب خدمة: ${orderData.serviceTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
            .content { padding: 40px 30px; }
            .info-box { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 15px; padding: 25px; margin: 20px 0; border-right: 5px solid #667eea; }
            .info-row { display: flex; justify-content: space-between; margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
            .info-label { font-weight: bold; color: #667eea; }
            .info-value { color: #333; }
            .whatsapp-section { background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 25px; border-radius: 15px; margin: 25px 0; text-align: center; }
            .whatsapp-section h3 { margin: 0 0 15px 0; font-size: 22px; }
            .whatsapp-section .number { font-size: 24px; font-weight: bold; letter-spacing: 1px; }
            .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6c757d; border-top: 3px solid #667eea; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; margin: 20px 0; font-weight: bold; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✨ تم استلام طلبك بنجاح</h1>
            </div>
            <div class="content">
              <p style="font-size: 18px; color: #333; line-height: 1.8;">
                عزيزنا/عزيزتنا <strong>${orderData.fullName}</strong>،
              </p>
              <p style="font-size: 16px; color: #555; line-height: 1.8;">
                نشكرك على اختيارك خدماتنا. تم استلام طلبك للخدمة التالية وسيتم التواصل معك في أقرب وقت.
              </p>
              
              <div class="info-box">
                <h3 style="color: #667eea; margin-top: 0;">تفاصيل الطلب</h3>
                <div class="info-row">
                  <span class="info-label">الخدمة:</span>
                  <span class="info-value">${orderData.serviceTitle}</span>
                </div>
                ${orderData.specialization ? `
                <div class="info-row">
                  <span class="info-label">التخصص:</span>
                  <span class="info-value">${orderData.specialization}</span>
                </div>
                ` : ''}
                <div class="info-row">
                  <span class="info-label">البريد الإلكتروني:</span>
                  <span class="info-value">${orderData.email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">رقم الجوال:</span>
                  <span class="info-value">${orderData.phone}</span>
                </div>
              </div>

              <div class="whatsapp-section">
                <h3>📱 للتواصل الفوري عبر واتساب</h3>
                <div class="number">${whatsappNumber}</div>
                <p style="margin: 15px 0 0 0; font-size: 14px;">يمكنك التواصل معنا مباشرة للاستفسارات</p>
              </div>

              <p style="font-size: 16px; color: #555; line-height: 1.8; margin-top: 30px;">
                سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال <strong>24 ساعة</strong> لمناقشة التفاصيل والبدء في تنفيذ الخدمة.
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0; font-size: 14px;">نشكرك على ثقتك بخدماتنا</p>
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #999;">© 2024 خدمات الطلاب الأكاديمية</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Email to admin
    const adminEmail = await resend.emails.send({
      from: "طلب خدمة جديد <onboarding@resend.dev>",
      to: ["admin@masteredupath.com"],
      subject: `طلب خدمة جديد: ${orderData.serviceTitle}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 650px; margin: 0 auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); padding: 30px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 26px; }
            .urgent { background: #ffd93d; color: #333; padding: 15px; text-align: center; font-weight: bold; }
            .content { padding: 30px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
            .info-card { background: #f8f9fa; padding: 20px; border-radius: 10px; border-right: 4px solid #ff6b6b; }
            .info-card h4 { margin: 0 0 10px 0; color: #ff6b6b; font-size: 14px; }
            .info-card p { margin: 0; color: #333; font-size: 16px; font-weight: bold; }
            .details-box { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 20px; border-radius: 10px; margin: 20px 0; }
            .details-box h3 { margin: 0 0 15px 0; color: #333; }
            .details-box p { color: #555; line-height: 1.6; }
            .action-btn { display: inline-block; background: #ff6b6b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; margin: 20px 10px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 طلب خدمة جديد</h1>
            </div>
            <div class="urgent">
              ⚡ يتطلب الرد خلال 24 ساعة
            </div>
            <div class="content">
              <h2 style="color: #ff6b6b; margin-top: 0;">تفاصيل الطلب</h2>
              
              <div class="info-grid">
                <div class="info-card">
                  <h4>اسم العميل</h4>
                  <p>${orderData.fullName}</p>
                </div>
                <div class="info-card">
                  <h4>الخدمة المطلوبة</h4>
                  <p>${orderData.serviceTitle}</p>
                </div>
                <div class="info-card">
                  <h4>البريد الإلكتروني</h4>
                  <p>${orderData.email}</p>
                </div>
                <div class="info-card">
                  <h4>رقم الجوال</h4>
                  <p>${orderData.phone}</p>
                </div>
                ${orderData.specialization ? `
                <div class="info-card">
                  <h4>التخصص</h4>
                  <p>${orderData.specialization}</p>
                </div>
                ` : ''}
                <div class="info-card">
                  <h4>رقم واتساب الخدمة</h4>
                  <p>${whatsappNumber}</p>
                </div>
              </div>

              <div class="details-box">
                <h3>تفاصيل إضافية من العميل:</h3>
                <p>${orderData.details}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="tel:${orderData.phone}" class="action-btn">📞 اتصال مباشر</a>
                <a href="mailto:${orderData.email}" class="action-btn">✉️ إرسال بريد</a>
                <a href="https://wa.me/${orderData.phone.replace(/[^0-9]/g, '')}" class="action-btn">💬 واتساب</a>
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
