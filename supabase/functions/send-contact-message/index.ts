import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
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

interface ContactMessageRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  serviceType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: any = await req.json();
    const { name, email, phone, subject, message, serviceType }: ContactMessageRequest =body;
    // 🆕 حفظ في صندوق الوارد الموحّد للوحة الإدارة
    try {
      const data: any = body;
      await supabaseAdmin.from("inbox_messages").insert({
        sender_name: (data.name || "زائر").toString().slice(0, 200),
        sender_email: (data.email || "unknown@fekrahedu.com").toString().slice(0, 200),
        sender_phone: (data.phone || null) ? data.phone.toString().slice(0, 50) : null,
        subject: (data.subject || 'رسالة تواصل').toString().slice(0, 300),
        message: (data.message || "").toString().slice(0, 8000),
        form_type: "contact",
        service_type: data.serviceType ?? null,
        source_page: typeof data.sourcePage === "string" ? data.sourcePage : null,
        priority: "high",
        status: "new",
        metadata: {},
      });
    } catch (inboxErr) {
      console.error("[inbox] failed to save:", inboxErr);
    }


    console.log(`Sending contact message from: ${name} (${email})`);

    // Send notification email to company
    const companyEmailResponse = await resend.emails.send({
      from: "نظام التواصل <info@fekrahedu.com>",
      to: ["info@fekrahedu.com", "admin@fekrahedu.com"],
      subject: `رسالة جديدة من العميل: ${name} - ${subject}`,
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
              direction: rtl !important;
              text-align: right !important;
            }
            body {
              font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              margin: 0;
              padding: 15px;
              direction: rtl !important;
              text-align: right !important;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #dc2626, #ef4444, #f87171);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 30px;
              line-height: 1.8;
              color: #374151;
            }
            .info-row {
              display: flex;
              margin-bottom: 15px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
            }
            .label {
              font-weight: bold;
              color: #1f2937;
              width: 120px;
              margin-left: 10px;
            }
            .value {
              flex: 1;
              color: #6b7280;
            }
            .message-box {
              background-color: #f9fafb;
              border-right: 4px solid #dc2626;
              padding: 20px;
              margin: 20px 0;
              border-radius: 8px;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px 30px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 رسالة جديدة من العميل</h1>
              <p>تم استلام رسالة تواصل جديدة عبر الموقع</p>
            </div>
            
            <div class="content">
              <div class="info-row">
                <span class="label">الاسم:</span>
                <span class="value">${name}</span>
              </div>
              
              <div class="info-row">
                <span class="label">البريد الإلكتروني:</span>
                <span class="value">${email}</span>
              </div>
              
              <div className="info-row">
                <span class="label">رقم الهاتف:</span>
                <span class="value">0559600824</span>
              </div>
              
              <div class="info-row">
                <span class="label">نوع الخدمة:</span>
                <span class="value">${serviceType}</span>
              </div>
              
              <div class="info-row">
                <span class="label">الموضوع:</span>
                <span class="value">${subject}</span>
              </div>
              
              <div class="message-box">
                <h3 style="color: #1f2937; margin-bottom: 10px;">محتوى الرسالة:</h3>
                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
              
              <p style="background-color: #fef2f2; color: #dc2626; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <strong>تنبيه:</strong> يرجى الرد على العميل خلال 4 ساعات كحد أقصى لضمان جودة الخدمة.
              </p>
            </div>
            
            <div class="footer">
              <p>تم إرسال هذه الرسالة تلقائياً من نظام إدارة التواصل</p>
              <p>© 2024 FekrahEdu. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "FekrahEdu <info@fekrahedu.com>",
      to: [email],
      subject: "تأكيد استلام رسالتك - FekrahEdu",
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
              direction: rtl !important;
              text-align: right !important;
            }
            body {
              font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              margin: 0;
              padding: 15px;
              direction: rtl !important;
              text-align: right !important;
            }
            .text-center { text-align: center !important; }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 40px 30px;
              line-height: 1.8;
              color: #374151;
            }
            .message-summary {
              background-color: #f0f9ff;
              border: 2px solid #3b82f6;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6, #6366f1);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .contact-info {
              background-color: #f8fafc;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px 30px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ شكراً لك ${name}</h1>
              <p>تم استلام رسالتك بنجاح</p>
            </div>
            
            <div class="content">
              <p><strong>عزيزي ${name}،</strong></p>
              
              <p>
                شكراً لك على التواصل معنا. لقد تم استلام رسالتك بنجاح وسيقوم فريق خدمة العملاء المختص بالرد عليك خلال 4 ساعات كحد أقصى.
              </p>
              
              <div class="message-summary">
                <h3 style="color: #1f2937; margin-bottom: 10px;">ملخص رسالتك:</h3>
                <p><strong>الموضوع:</strong> ${subject}</p>
                <p><strong>نوع الخدمة:</strong> ${serviceType}</p>
                <p><strong>تاريخ الإرسال:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              
              <div class="contact-info">
                <h3 style="color: #1f2937; margin-bottom: 15px;">معلومات التواصل السريع:</h3>
                <p>📧 البريد الإلكتروني: info@fekrahedu.com</p>
                <p>📞 الهاتف: 0559600824</p>
                <p>💬 الواتساب: 0559600824</p>
                <p>⏰ ساعات العمل: السبت - الخميس، 10 صباحاً - 6 مساءً</p>
                <p>📍 العنوان: المملكة العربية السعودية</p>
              </div>
              
              <div style="text-align: center;">
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.netlify.app') || 'https://fekrahedu.com'}" class="cta-button">
                  زيارة موقعنا
                </a>
              </div>
              
              <p>
                نقدر اهتمامك بخدماتنا ونتطلع للعمل معك قريباً.
              </p>
              
              <p style="margin-bottom: 0;">
                مع أطيب التحيات،<br>
                <strong>فريق FekrahEdu</strong>
              </p>
            </div>
            
            <div class="footer">
              <p>
                هذا البريد الإلكتروني تم إرساله تلقائياً لتأكيد استلام رسالتك.
              </p>
              <p>
                © 2024 FekrahEdu. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Contact message emails sent successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 4 ساعات",
      company_email_id: companyEmailResponse.data?.id,
      customer_email_id: customerEmailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-message function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);