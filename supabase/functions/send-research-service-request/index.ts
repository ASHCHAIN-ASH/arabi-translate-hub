import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ServiceRequest {
  serviceTitle: string;
  serviceType: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  details?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: ServiceRequest = await req.json();
    const orderId = `SRV${Date.now()}`;
    
    console.log("Processing service request:", orderId);

    // إيميل الإدارة (Admin RTL Template)
    const adminEmailHtml = `
      <!doctype html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب جديد</title>
        <style>
          body{margin:0;background:#f8fafc;font-family:'Tahoma','Segoe UI','Cairo',sans-serif;direction:rtl}
          .wrap{max-width:760px;margin:0 auto;padding:24px}
          .head{background:#0a225d;color:#fff;border-radius:12px 12px 0 0;padding:18px}
          .body{background:#fff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 12px 12px;padding:20px}
          h1{margin:0 0 6px;font-size:20px}
          table{width:100%;border-collapse:collapse}
          td{padding:10px;border-bottom:1px solid #f0f2f5;vertical-align:top}
          .label{color:#6b7280;width:180px}
          .badge{display:inline-block;background:#eaf2ff;color:#0a225d;padding:4px 8px;border-radius:8px}
          .foot{margin-top:16px;color:#6b7280;font-size:12px}
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="head">
            <h1>طلب جديد – <span class="badge">${orderData.serviceTitle}</span></h1>
            <div>الطابع الزمني: ${new Date().toLocaleString('ar-SA')}</div>
          </div>
          <div class="body">
            <table>
              <tr><td class="label">رقم الطلب</td><td>${orderId}</td></tr>
              <tr><td class="label">الاسم الكامل</td><td>${orderData.fullName}</td></tr>
              <tr><td class="label">البريد</td><td>${orderData.email}</td></tr>
              <tr><td class="label">الجوال</td><td>${orderData.phone}</td></tr>
              <tr><td class="label">التخصص</td><td>${orderData.specialization}</td></tr>
              <tr><td class="label">تفاصيل الطلب</td><td>${orderData.details || 'لا توجد تفاصيل إضافية'}</td></tr>
            </table>
            <div class="foot">
              هذه رسالة تنبيه داخلية. للرد على العميل استخدم "Reply-To".
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // إيميل العميل (Client RTL Template)
    const clientEmailHtml = `
      <!doctype html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8">
        <meta name="x-apple-disable-message-reformatting">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد استلام طلبك</title>
        <style>
          body{margin:0;background:#f5f7fb;font-family:'Tahoma','Segoe UI','Cairo',sans-serif;direction:rtl}
          .container{max-width:640px;margin:0 auto;padding:24px}
          .card{background:#ffffff;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,.06);overflow:hidden}
          .header{background:linear-gradient(135deg,#0a225d,#0087ff);color:#fff;padding:28px;text-align:center}
          h1{margin:0 0 6px;font-size:22px}
          p{margin:0;color:#e9eef7;font-size:14px}
          .content{padding:22px 24px;color:#222}
          .row{margin-bottom:12px}
          .label{color:#4a5568;font-size:13px}
          .val{font-weight:700}
          .cta{display:inline-block;margin-top:16px;padding:12px 18px;background:#0a225d;color:#fff;text-decoration:none;border-radius:10px}
          .note{margin-top:18px;font-size:12px;color:#6b7280}
          .footer{padding:16px;text-align:center;font-size:12px;color:#6b7280}
          @keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          .card{animation:fadeInUp .5s ease}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1>تم استلام طلبك 🎓</h1>
              <p>شكرًا لتواصلك مع MasterEduPath</p>
            </div>
            <div class="content">
              <div class="row"><span class="label">الخدمة:</span> <span class="val">${orderData.serviceTitle}</span></div>
              <div class="row"><span class="label">الاسم:</span> <span class="val">${orderData.fullName}</span></div>
              <div class="row"><span class="label">البريد:</span> <span class="val">${orderData.email}</span></div>
              <div class="row"><span class="label">الجوال:</span> <span class="val">${orderData.phone}</span></div>
              <div class="row"><span class="label">التخصص:</span> <span class="val">${orderData.specialization}</span></div>
              <div class="row"><span class="label">تفاصيل الطلب:</span><div>${orderData.details || 'لا توجد تفاصيل إضافية'}</div></div>
              <div class="note">
                سنراجع التفاصيل ونتواصل معك خلال وقت قصير عبر البريد أو الواتساب.
              </div>
            </div>
            <div class="footer">
              © 2025 MasterEduPath — للاستفسار السريع: 0500776343 / 0559600824
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // إرسال الإيميلات
    const adminRes = await resend.emails.send({
      from: "Master Edu Path System <info@masteredupath.com>",
      to: ["info@masteredupath.com"],
      replyTo: orderData.email,
      subject: `[MasterEduPath] طلب جديد – ${orderData.serviceTitle} – ${orderData.fullName}`,
      html: adminEmailHtml,
    });

    const clientRes = await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      replyTo: "info@masteredupath.com",
      to: [orderData.email],
      subject: `[MasterEduPath] تأكيد استلام طلبك – ${orderData.serviceTitle}`,
      html: clientEmailHtml,
    });

    console.log("Resend send-research-service-request responses:", { adminRes, clientRes });

    console.log("Emails sent successfully for order:", orderId);

    return new Response(
      JSON.stringify({ 
        success: true,
        orderId,
        message: "تم إرسال الطلب بنجاح"
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
    console.error("Error in send-research-service-request function:", error);
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
