import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PricingInquiry {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  details?: string;
  budget?: string;
  files?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Pricing inquiry function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const inquiry: PricingInquiry = await req.json();
    console.log("Received inquiry:", inquiry);

    // Validate required fields
    if (!inquiry.name || !inquiry.email || !inquiry.service) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "الاسم والبريد الإلكتروني ونوع الخدمة مطلوبة" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email to customer (confirmation)
    const customerEmailResponse = await resend.emails.send({
      from: "MasterEduPath <sales@masteredupath.com>",
      to: [inquiry.email],
      subject: "تم استلام طلبك - MasterEduPath",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد استلام الطلب</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { font-size: 16px; opacity: 0.9; }
            .content { padding: 30px; }
            .welcome { font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 20px; }
            .info-box { background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .info-label { font-weight: bold; color: #475569; }
            .info-value { color: #1e293b; }
            .next-steps { background-color: #dbeafe; padding: 20px; border-radius: 8px; border-right: 4px solid #3b82f6; margin: 20px 0; }
            .footer { background-color: #1e293b; color: white; padding: 20px; text-align: center; }
            .contact-info { margin: 10px 0; }
            .contact-info a { color: #60a5fa; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌟 MasterEduPath</div>
              <div class="subtitle">وكالة الحلول التعليمية المتقدمة</div>
            </div>
            
            <div class="content">
              <h2 class="welcome">مرحباً ${inquiry.name}! 👋</h2>
              
              <p>شكراً لك على اهتمامك بخدماتنا. تم استلام طلبك بنجاح وسيتواصل معك فريق المبيعات خلال <strong>٣ ساعات خلال أوقات الدوام</strong> للرد على استفساراتك وتقديم عرض سعر مخصص.</p>
              
              <div class="info-box">
                <h3>تفاصيل طلبك:</h3>
                <div class="info-row">
                  <span class="info-label">الاسم:</span>
                  <span class="info-value">${inquiry.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">البريد الإلكتروني:</span>
                  <span class="info-value">${inquiry.email}</span>
                </div>
                ${inquiry.phone ? `
                <div class="info-row">
                  <span class="info-label">رقم الهاتف:</span>
                  <span class="info-value">${inquiry.phone}</span>
                </div>
                ` : ''}
                ${inquiry.company ? `
                <div class="info-row">
                  <span class="info-label">الشركة:</span>
                  <span class="info-value">${inquiry.company}</span>
                </div>
                ` : ''}
                <div class="info-row">
                  <span class="info-label">نوع الخدمة:</span>
                  <span class="info-value">${getServiceName(inquiry.service)}</span>
                </div>
                ${inquiry.budget ? `
                <div class="info-row">
                  <span class="info-label">الميزانية المتوقعة:</span>
                  <span class="info-value">${getBudgetRange(inquiry.budget)}</span>
                </div>
                ` : ''}
                ${inquiry.details ? `
                <div style="margin-top: 15px;">
                  <span class="info-label">تفاصيل المشروع:</span>
                  <p style="margin-top: 5px; color: #1e293b; line-height: 1.6;">${inquiry.details}</p>
                </div>
                ` : ''}
                ${inquiry.files && inquiry.files.length > 0 ? `
                <div style="margin-top: 15px;">
                  <span class="info-label">المرفقات:</span>
                  <ul style="margin-top: 5px; color: #1e293b; padding-right: 20px;">
                    ${inquiry.files.map(file => `<li>📎 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
                  </ul>
                </div>
                ` : ''}
              </div>
              
              <div class="next-steps">
                <h3>الخطوات التالية:</h3>
                <ul style="margin: 10px 0; padding-right: 20px;">
                  <li>سيتواصل معك أحد خبراء المبيعات خلال ٣ ساعات خلال أوقات الدوام</li>
                  <li>سنقوم بدراسة متطلباتك بعناية</li>
                  <li>سنقدم لك عرض سعر مخصص ومفصل</li>
                  <li>يمكنك الاتصال بنا مباشرة إذا كان لديك أي استفسار عاجل</li>
                </ul>
              </div>
              
              <p>نحن متحمسون لمساعدتك في تحقيق أهدافك من خلال خدماتنا المتميزة!</p>
              
              <p style="margin-top: 30px;">
                مع أطيب التحيات،<br>
                <strong>فريق MasterEduPath</strong>
              </p>
            </div>
            
            <div class="footer">
              <div class="contact-info">
                <strong>للتواصل السريع:</strong><br>
                📧 <a href="mailto:sales@masteredupath.com">sales@masteredupath.com</a><br>
                📱 <a href="tel:+966500000000">+966 50 000 0000</a><br>
                🌐 <a href="https://masteredupath.com">www.masteredupath.com</a>
              </div>
              <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
                هذه رسالة آلية، يرجى عدم الرد عليها مباشرة
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Email to admin (notification)
    const adminEmailResponse = await resend.emails.send({
      from: "MasterEduPath System <system@masteredupath.com>",
      to: ["sales@masteredupath.com", "admin@masteredupath.com"],
      subject: `🔔 طلب عرض سعر جديد من ${inquiry.name}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب عرض سعر جديد</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 30px; text-align: center; }
            .alert-badge { background-color: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 10px; }
            .content { padding: 30px; }
            .urgent { background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .urgent h3 { color: #dc2626; margin: 0 0 10px 0; }
            .client-info { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
            .info-label { font-weight: bold; color: #475569; }
            .info-value { color: #1e293b; }
            .priority-high { background-color: #fef2f2; border-right: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
            .action-buttons { text-align: center; margin: 30px 0; }
            .btn { display: inline-block; padding: 12px 24px; margin: 5px; border-radius: 6px; text-decoration: none; font-weight: bold; }
            .btn-primary { background-color: #3b82f6; color: white; }
            .btn-success { background-color: #10b981; color: white; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="alert-badge">🚨 تنبيه فوري</div>
              <h1>طلب عرض سعر جديد</h1>
              <p>تم استلام طلب جديد يحتاج للمتابعة الفورية</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <h3>⏰ يتطلب رد سريع خلال ٣ ساعات خلال أوقات الدوام</h3>
                <p>تم إرسال رسالة تأكيد للعميل تتضمن وعد بالرد خلال ٣ ساعات خلال أوقات الدوام.</p>
              </div>
              
              <div class="client-info">
                <h3>معلومات العميل:</h3>
                <div class="info-row">
                  <span class="info-label">📝 الاسم:</span>
                  <span class="info-value">${inquiry.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">📧 البريد الإلكتروني:</span>
                  <span class="info-value"><a href="mailto:${inquiry.email}">${inquiry.email}</a></span>
                </div>
                ${inquiry.phone ? `
                <div class="info-row">
                  <span class="info-label">📱 رقم الهاتف:</span>
                  <span class="info-value"><a href="tel:${inquiry.phone}">${inquiry.phone}</a></span>
                </div>
                ` : ''}
                ${inquiry.company ? `
                <div class="info-row">
                  <span class="info-label">🏢 الشركة:</span>
                  <span class="info-value">${inquiry.company}</span>
                </div>
                ` : ''}
                <div class="info-row">
                  <span class="info-label">🔧 نوع الخدمة:</span>
                  <span class="info-value">${getServiceName(inquiry.service)}</span>
                </div>
                ${inquiry.budget ? `
                <div class="info-row">
                  <span class="info-label">💰 الميزانية المتوقعة:</span>
                  <span class="info-value">${getBudgetRange(inquiry.budget)}</span>
                </div>
                ` : ''}
                <div class="info-row">
                  <span class="info-label">📅 وقت الطلب:</span>
                  <span class="info-value">${new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' })}</span>
                </div>
              </div>
              
              ${inquiry.details ? `
              <div class="priority-high">
                <h3>تفاصيل المشروع:</h3>
                <p style="line-height: 1.6; margin: 10px 0;">${inquiry.details}</p>
              </div>
              ` : ''}
              
              ${inquiry.files && inquiry.files.length > 0 ? `
              <div class="priority-high">
                <h3>📎 المرفقات (${inquiry.files.length} ملف):</h3>
                <ul style="margin: 10px 0; padding-right: 20px;">
                  ${inquiry.files.map(file => `<li><strong>${file.name}</strong> - ${(file.size / 1024 / 1024).toFixed(2)} MB</li>`).join('')}
                </ul>
                <p style="color: #dc2626; font-weight: bold;">⚠️ يرجى طلب الملفات من العميل عند التواصل</p>
              </div>
              ` : ''}
              
              <div class="action-buttons">
                <a href="mailto:${inquiry.email}" class="btn btn-primary">الرد على العميل 📧</a>
                ${inquiry.phone ? `<a href="tel:${inquiry.phone}" class="btn btn-success">الاتصال مباشرة 📱</a>` : ''}
              </div>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                <h4 style="color: #0369a1; margin: 0 0 10px 0;">💡 نصائح للمتابعة:</h4>
                <ul style="margin: 0; padding-right: 20px; color: #075985;">
                  <li>تواصل مع العميل خلال الساعة الأولى لزيادة فرص الإغلاق</li>
                  <li>احرص على فهم المتطلبات بدقة قبل تقديم العرض</li>
                  <li>قدم أمثلة من الأعمال السابقة في نفس المجال</li>
                  <li>اقترح مكالمة مرئية لمناقشة التفاصيل</li>
                </ul>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح وسيتم التواصل معك قريباً",
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-pricing-inquiry function:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ أثناء إرسال الطلب",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper functions
function getServiceName(service: string): string {
  const serviceNames: { [key: string]: string } = {
    'document': 'ترجمة الوثائق',
    'website': 'ترجمة المواقع الإلكترونية',
    'audio': 'ترجمة صوتية',
    'video': 'ترجمة الفيديو',
    'legal': 'ترجمة قانونية',
    'medical': 'ترجمة طبية',
    'technical': 'ترجمة تقنية',
    'academic': 'ترجمة أكاديمية',
    'business': 'ترجمة تجارية',
    'other': 'أخرى'
  };
  return serviceNames[service] || service;
}

function getBudgetRange(budget: string): string {
  const budgetRanges: { [key: string]: string } = {
    'under-1000': 'أقل من 1,000 ريال',
    '1000-5000': '1,000 - 5,000 ريال',
    '5000-10000': '5,000 - 10,000 ريال',
    '10000-25000': '10,000 - 25,000 ريال',
    '25000-50000': '25,000 - 50,000 ريال',
    'over-50000': 'أكثر من 50,000 ريال'
  };
  return budgetRanges[budget] || budget;
}

serve(handler);