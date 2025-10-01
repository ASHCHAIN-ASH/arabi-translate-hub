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

    // إيميل الإدارة
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; direction: rtl;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">🎓 طلب خدمة بحثية جديد</h1>
            <div style="background: white; color: #2563eb; font-size: 16px; font-weight: bold; padding: 15px; border-radius: 8px; margin-top: 15px;">
              ${orderData.serviceTitle}
            </div>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #2563eb;">
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">رقم الطلب: ${orderId}</p>
            </div>

            <h3 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">معلومات العميل</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f9fafb;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">الاسم:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${orderData.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">البريد الإلكتروني:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${orderData.email}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">رقم الهاتف:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${orderData.phone}</td>
              </tr>
            </table>

            ${orderData.details ? `
            <h3 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">تفاصيل الطلب</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-right: 3px solid #2563eb;">
              <p style="margin: 0;">${orderData.details}</p>
            </div>
            ` : ''}

            <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; border: 2px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">⚠️ يرجى المتابعة مع العميل في أقرب وقت ممكن</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // إيميل العميل
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; direction: rtl;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ تم استلام طلبك بنجاح</h1>
            <div style="background: white; color: #10b981; font-size: 18px; font-weight: bold; padding: 12px; border-radius: 8px; margin-top: 15px;">
              شكراً لطلبك
            </div>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #059669; font-weight: bold;">عزيزي ${orderData.fullName}،</p>
            
            <p style="font-size: 15px; line-height: 1.8;">
              شكراً لك على طلب خدمة <strong>${orderData.serviceTitle}</strong>. تم استلام طلبك بنجاح وسيتم مراجعته من قبل فريقنا المتخصص.
            </p>

            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">الخطوات القادمة:</h3>
              <ol style="line-height: 2; margin: 0; padding-right: 20px;">
                <li>سنقوم بمراجعة طلبك خلال 24 ساعة</li>
                <li>سنتواصل معك عبر البريد الإلكتروني أو الهاتف</li>
                <li>سنقدم لك عرض سعر مفصل وجدول زمني</li>
              </ol>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
              <h3 style="color: #1f2937; margin-top: 0;">للتواصل معنا</h3>
              <p style="margin: 5px 0;">📧 البريد الإلكتروني: info@masteredupath.com</p>
              <p style="margin: 5px 0;">📱 جوال: 0500776343</p>
              <p style="margin: 5px 0;">📱 واتساب: 0500776343</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // إرسال الإيميلات
    await resend.emails.send({
      from: "MasterEduPath <noreply@masteredupath.com>",
      to: ["info@masteredupath.com"],
      replyTo: orderData.email,
      subject: `🎓 طلب خدمة: ${orderData.serviceTitle} - ${orderData.fullName}`,
      html: adminEmailHtml,
    });

    await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      to: [orderData.email],
      subject: `✅ تم استلام طلبك - ${orderData.serviceTitle}`,
      html: clientEmailHtml,
    });

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
