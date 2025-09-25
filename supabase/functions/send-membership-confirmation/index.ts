import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface MembershipRequest {
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  membershipNameAr: string;
  membershipNameEn: string;
  price: string;
  discount: string;
  cashback: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const { name, email, phone, membershipType, membershipNameAr, membershipNameEn, price, discount, cashback }: MembershipRequest = await req.json();

    // Validate input
    if (!name || !email || !phone || !membershipType) {
      return new Response(JSON.stringify({ error: "المعلومات المطلوبة غير مكتملة" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "البريد الإلكتروني غير صحيح" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Send email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "عضوية ماستر <onboarding@resend.dev>", // مؤقت للاختبار
      to: ["info@fekrahtech.com"], // مؤقت - سيتم تغييره للعميل بعد التحقق من الدومين
      subject: `تأكيد طلب الاشتراك في ${membershipNameAr} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد طلب الاشتراك</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 40px 20px; }
            .membership-card { background: linear-gradient(135deg, ${membershipType === 'silver' ? '#64748b, #475569' : membershipType === 'gold' ? '#f59e0b, #d97706' : '#1f2937, #111827'}); color: white; padding: 20px; border-radius: 12px; margin: 20px 0; }
            .details { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
            .warning { background-color: #fee2e2; border: 1px solid #fecaca; color: #991b1b; padding: 15px; border-radius: 8px; margin: 20px 0; }
            h1 { margin: 0; font-size: 28px; }
            h2 { color: #1f2937; font-size: 24px; }
            h3 { margin: 0; font-size: 20px; }
            p { line-height: 1.6; color: #4b5563; }
            .highlight { color: #059669; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 شكراً لك ${name}</h1>
              <p>تم استلام طلب اشتراكك في عضوية ماستر بنجاح</p>
            </div>
            
            <div class="content">
              <div class="membership-card">
                <h3>${membershipNameAr}</h3>
                <p>${membershipNameEn}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                  <div>
                    <span style="font-size: 24px; font-weight: bold;">${price} ريال</span>
                    <span style="display: block; font-size: 14px; opacity: 0.8;">خصم ${discount}</span>
                  </div>
                  <div style="text-align: left;">
                    <span style="background: rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 20px; font-size: 14px;">
                      كاش باك: ${cashback} ريال
                    </span>
                  </div>
                </div>
              </div>

              <div class="details">
                <h2>تفاصيل الطلب:</h2>
                <p><strong>الاسم:</strong> ${name}</p>
                <p><strong>البريد الإلكتروني:</strong> ${email}</p>
                <p><strong>رقم الهاتف:</strong> ${phone}</p>
                <p><strong>نوع العضوية:</strong> ${membershipNameAr}</p>
                <p><strong>المبلغ الإجمالي:</strong> <span class="highlight">${price} ريال سعودي</span></p>
              </div>

              <div class="warning">
                <h3>⚠️ تنبيه مهم:</h3>
                <p><strong>الاشتراك غير قابل للاسترجاع نهائياً</strong> بعد تأ��يد الدفع وبدء الخدمة.</p>
              </div>

              <h2>الخطوات التالية:</h2>
              <p>سيقوم فريق خدمة العملاء بالتواصل معك خلال 24 ساعة لإرسال الفاتورة وتفاصيل الدفع.</p>
              <p>إذا كان لديك أي استفسارات، لا تتردد في التواصل معنا.</p>
            </div>

            <div class="footer">
              <h3>وكالة ماستر إيدو باث</h3>
              <p>شريكك الموثوق في رحلة التعلم والتطوير المهني</p>
              <p>MASTER EDU PATH AGENCY</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send notification to admin
    const adminEmailResponse = await resend.emails.send({
      from: "نظام العضويات <onboarding@resend.dev>", // مؤقت للاختبار
      to: ["info@fekrahtech.com"], // مؤقت - نفس الإيميل المسجل في Resend
      subject: `طلب اشتراك جديد - ${membershipNameAr} من ${name}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
            .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .details { background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .urgent { background-color: #fee2e2; border: 2px solid #ef4444; padding: 15px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔔 طلب اشتراك جديد</h2>
              <p>تم استلام طلب اشتراك جديد في عضوية ماستر</p>
            </div>
            
            <div class="details">
              <h3>تفاصيل العميل:</h3>
              <p><strong>الاسم:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${email}</p>
              <p><strong>رقم الهاتف:</strong> ${phone}</p>
            </div>

            <div class="details">
              <h3>تفاصيل العضوية:</h3>
              <p><strong>نوع العضوية:</strong> ${membershipNameAr} (${membershipNameEn})</p>
              <p><strong>المبلغ:</strong> ${price} ريال</p>
              <p><strong>الخصم:</strong> ${discount}</p>
              <p><strong>الكاش باك:</strong> ${cashback} ريال</p>
            </div>

            <div class="urgent">
              <h3>⏰ مطلوب اتخاذ إجراء:</h3>
              <p>يرجى التواصل مع العميل خلال 24 ساعة لإرسال الفاتورة وتأكيد تفاصيل الدفع.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Emails sent successfully:", { customerEmailResponse, adminEmailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "تم إرسال طلب الاشتراك بنجاح. سيتم التواصل معك قريباً." 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-membership-confirmation function:", error);
    return new Response(JSON.stringify({ 
      error: "حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى." 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);