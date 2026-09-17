import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

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

    // 🆕 1) حفظ الطلب فوراً في صندوق الوارد الموحّد (يظهر بلوحة الإدارة لحظياً)
    let inboxMessageId: string | null = null;
    try {
      const { data: inserted, error: inboxError } = await supabaseAdmin
        .from("inbox_messages")
        .insert({
          sender_name: orderData.fullName?.slice(0, 200) ?? "زائر",
          sender_email: orderData.email?.slice(0, 200) ?? "unknown@fekrahedu.com",
          sender_phone: orderData.phone?.slice(0, 50) ?? null,
          subject: `طلب خدمة: ${orderData.serviceTitle}`,
          message: orderData.details?.slice(0, 8000) ||
            `طلب خدمة «${orderData.serviceTitle}» — التخصص: ${orderData.specialization || "غير محدد"}.`,
          form_type: "service_inquiry",
          service_type: orderData.serviceType ?? null,
          source_page: orderData.serviceType ? `service:${orderData.serviceType}` : null,
          priority: "high",
          status: "new",
          metadata: {
            order_id: orderId,
            service_title: orderData.serviceTitle,
            specialization: orderData.specialization,
          },
        })
        .select("id")
        .single();
      if (inboxError) throw inboxError;
      inboxMessageId = inserted.id;
      console.log("[inbox] saved message:", inboxMessageId);
    } catch (e) {
      console.error("[inbox] failed to save (continuing with email):", e);
    }

    // إيميل الإدارة (Admin RTL Template)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب خدمة بحثية جديد</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            direction: rtl !important;
            text-align: right !important;
          }
          body {
            font-family: 'Segoe UI', 'IBM Plex Sans Arabic', 'Amiri', Tahoma, Arial, sans-serif;
            line-height: 1.8;
            color: #2c3e50;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            margin: 0;
            padding: 10px;
            direction: rtl !important;
            text-align: right !important;
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
          .alert-card h3 {
            color: #856404;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
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
          .info-table {
            width: 100%;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0,0,0,0.05);
          }
          .info-table tr {
            border-bottom: 1px solid #e3f2fd;
          }
          .info-table tr:last-child {
            border-bottom: none;
          }
          .info-table td {
            padding: 15px;
          }
          .info-table td:first-child {
            font-weight: 700;
            color: #1565c0;
            width: 140px;
            background: #f5f5f5;
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
          @media only screen and (max-width: 600px) {
            body { padding: 5px; }
            .email-wrapper { border-radius: 15px; }
            .header { padding: 25px 20px; }
            .header h1 { font-size: 24px; }
            .content { padding: 25px 20px; }
            .info-table td { padding: 12px 10px; font-size: 14px; }
            .info-table td:first-child { width: 120px; }
            .footer { padding: 25px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="urgent-banner">
            🚨 طلب جديد يحتاج إلى متابعة فورية
          </div>
          
          <div class="header">
            <h1>🎓 فكرة إيدو - طلب خدمة بحثية</h1>
            <div class="timestamp">
              📅 ${new Date().toLocaleString('ar-SA', { 
                weekday: 'long', 
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
              <h3>⚡ طلب جديد: ${orderData.serviceTitle}</h3>
              <p style="color: #856404; font-size: 16px; margin-top: 10px;">رقم الطلب: <strong>${orderId}</strong></p>
            </div>
            
            <div class="client-section">
              <h3>👤 معلومات العميل</h3>
              <table class="info-table">
                <tr>
                  <td>الاسم الكامل</td>
                  <td>${orderData.fullName}</td>
                </tr>
                <tr>
                  <td>البريد الإلكتروني</td>
                  <td><a href="mailto:${orderData.email}" style="color: #2196f3; text-decoration: none;">${orderData.email}</a></td>
                </tr>
                <tr>
                  <td>رقم الهاتف</td>
                  <td><a href="tel:${orderData.phone}" style="color: #2196f3; text-decoration: none;">${orderData.phone}</a></td>
                </tr>
                <tr>
                  <td>التخصص</td>
                  <td>${orderData.specialization}</td>
                </tr>
                ${orderData.details ? `
                <tr>
                  <td>تفاصيل الطلب</td>
                  <td style="white-space: pre-wrap;">${orderData.details}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: linear-gradient(145deg, #ffebee 0%, #ffcdd2 100%); border: 2px solid #ef5350; border-radius: 15px; padding: 20px; margin: 25px 0; text-align: center;">
              <p style="color: #c62828; font-weight: 700; font-size: 16px; margin: 0;">
                📞 يُرجى التواصل مع العميل في أقرب وقت ممكن
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p class="company-name">فكرة إيدو - نظام الإشعارات</p>
            <p>&copy; 2025 جميع الحقوق محفوظة</p>
            <p>هذه رسالة تلقائية من نظام إدارة الطلبات</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // إيميل العميل (Client RTL Template)
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأكيد استلام طلبك</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            direction: rtl !important;
            text-align: right !important;
          }
          body {
            font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif;
            line-height: 1.8;
            color: #2c3e50;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            margin: 0;
            padding: 15px;
            direction: rtl !important;
            text-align: right !important;
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
          
          @media only screen and (max-width: 600px) {
            body { padding: 5px; }
            .email-wrapper { border-radius: 15px; }
            .header { padding: 25px 20px; }
            .header h1 { font-size: 24px; }
            .header h2 { font-size: 16px; }
            .content { padding: 25px 20px; }
            .greeting { font-size: 18px; }
            .message { font-size: 14px; }
            .info-card, .steps-section, .contact-section { padding: 20px 15px; margin: 20px 0; }
            .info-list li, .contact-item { padding: 10px 15px; font-size: 13px; }
            .steps-list li { padding: 12px 15px 12px 45px; font-size: 14px; }
            .footer { padding: 25px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>🎯 فكرة إيدو</h1>
            <h2>تأكيد استلام طلبك</h2>
          </div>
          
          <div class="content">
            <div class="greeting">
              السلام عليكم ورحمة الله وبركاته<br>
              عزيزي/عزيزتي ${orderData.fullName}
            </div>
            
            <div class="message">
              نشكرك على ثقتك في خدماتنا! يسعدنا إعلامك بأنه تم استلام طلبك لخدمة <strong>${orderData.serviceTitle}</strong> بنجاح، وسيتم التعامل معه بأقصى سرعة ودقة.
            </div>
            
            <div class="info-card">
              <h3>📋 تفاصيل طلبك المُستلم</h3>
              <ul class="info-list">
                <li><strong>رقم الطلب:</strong> ${orderId}</li>
                <li><strong>الخدمة:</strong> ${orderData.serviceTitle}</li>
                <li><strong>الاسم الكامل:</strong> ${orderData.fullName}</li>
                <li><strong>البريد الإلكتروني:</strong> ${orderData.email}</li>
                <li><strong>رقم الهاتف:</strong> ${orderData.phone}</li>
                <li><strong>التخصص:</strong> ${orderData.specialization}</li>
                ${orderData.details ? `<li><strong>تفاصيل الطلب:</strong> ${orderData.details}</li>` : ''}
              </ul>
            </div>
            
            <div class="steps-section">
              <h3>⚡ الخطوات التالية</h3>
              <ul class="steps-list">
                <li>سيتواصل معك فريق الخبراء المتخصص خلال 24 ساعة كحد أقصى</li>
                <li>سنقوم بمراجعة وتقييم طلبك بدقة عالية</li>
                <li>سيتم إرسال عرض سعر مفصل وشامل لك</li>
                <li>بعد موافقتك، سنبدأ العمل فوراً على تنفيذ الخدمة</li>
                <li>ستحصل على خدمة احترافية معتمدة وعالية الجودة</li>
              </ul>
            </div>
            
            <div class="contact-section">
              <h3>📞 طرق التواصل معنا</h3>
              <div class="contact-item">
                📧 البريد الإلكتروني: info@fekrahedu.com
              </div>
              <div class="contact-item">
                📱 جوال/واتساب: 0559600824
              </div>
              <div class="contact-item">
                🌐 الموقع الإلكتروني: www.fekrahedu.com
              </div>
              <div class="contact-item">
                ⏰ أوقات العمل: من الأحد إلى الخميس (9 صباحاً - 6 مساءً)
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p class="company-name">فكرة إيدو</p>
            <p>&copy; 2025 جميع الحقوق محفوظة</p>
            <p>نحن ملتزمون بتقديم أفضل خدمات البحث العلمي الاحترافية والمعتمدة</p>
            <p>شكراً لثقتكم بنا ونتطلع لخدمتكم</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // إرسال الإيميلات
    const adminRes = await resend.emails.send({
      from: "FekrahEdu System <info@fekrahedu.com>",
      to: ["info@fekrahedu.com"],
      replyTo: orderData.email,
      subject: `🚨 [طلب جديد ${orderId}] ${orderData.serviceTitle} - ${orderData.fullName}`,
      html: adminEmailHtml,
    });
    
    console.log("Admin email sent:", adminRes);

    const clientRes = await resend.emails.send({
      from: "FekrahEdu <info@fekrahedu.com>",
      replyTo: "info@fekrahedu.com",
      to: [orderData.email],
      subject: `[FekrahEdu] تأكيد استلام طلبك – ${orderData.serviceTitle}`,
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
