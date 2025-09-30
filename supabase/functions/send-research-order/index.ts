import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResearchOrderRequest {
  category: string;
  categoryTitle: string;
  specialization: string;
  researchType: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  researchTitle: string;
  deadline: string;
  details?: string;
  orderNumber?: string;
  attachments: Array<{
    url: string;
    name: string;
    type: string;
    size: number;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const orderData: ResearchOrderRequest = await req.json();

    // توليد معرف فريد للطلب
    const orderId = `RO${Date.now()}`;
    
    console.log("Processing research order:", orderId);

    // تجهيز قائمة المرفقات للإيميل
    const attachmentsList = orderData.attachments && orderData.attachments.length > 0
      ? `
        <h3 style="color: #2563eb; margin-top: 20px;">المرفقات (${orderData.attachments.length}):</h3>
        <ul style="list-style: none; padding: 0;">
          ${orderData.attachments.map(file => `
            <li style="padding: 8px; background: #f3f4f6; margin: 5px 0; border-radius: 5px;">
              <a href="${file.url}" style="color: #2563eb; text-decoration: none;">
                📎 ${file.name} (${(file.size / 1024).toFixed(2)} KB)
              </a>
            </li>
          `).join('')}
        </ul>
        <p style="color: #6b7280; font-size: 14px;">
          💡 يمكن تحميل المرفقات من خلال لوحة التحكم أو من الروابط أعلاه
        </p>
      `
      : '<p style="color: #6b7280;">لا توجد مرفقات</p>';

    // إرسال إيميل للإدارة مع رقم الطلب
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
              تم استلام طلب جديد
            </div>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-right: 4px solid #2563eb;">
              <h2 style="color: #1e40af; margin: 0;">نوع الخدمة: ${orderData.categoryTitle}</h2>
              <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">رقم الطلب: ${orderId}</p>
            </div>

            <h3 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">معلومات البحث</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f9fafb;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">التخصص:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${orderData.specialization}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">نوع البحث:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${orderData.researchType}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">عنوان البحث:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${orderData.researchTitle}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">الموعد النهائي:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${orderData.deadline}</td>
              </tr>
            </table>

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
              ${orderData.whatsapp ? `
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e5e7eb;">واتساب:</td>
                <td style="padding: 12px; border: 1px solid #e5e7eb;">${orderData.whatsapp}</td>
              </tr>
              ` : ''}
            </table>

            ${orderData.details ? `
            <h3 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">التفاصيل</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-right: 3px solid #2563eb;">
              <p style="margin: 0;">${orderData.details}</p>
            </div>
            ` : ''}

            ${attachmentsList}

            <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; border: 2px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">⚠️ يرجى المتابعة مع العميل في أقرب وقت ممكن</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // إرسال إيميل للعميل مع رقم الطلب
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
              شكراً لك على طلب خدمة <strong>${orderData.categoryTitle}</strong>. تم استلام طلبك بنجاح وسيتم مراجعته من قبل فريقنا المتخصص.
            </p>

            <div style="background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">ملخص طلبك:</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="padding: 8px 0; border-bottom: 1px solid #a7f3d0;">
                  <strong>التخصص:</strong> ${orderData.specialization}
                </li>
                <li style="padding: 8px 0; border-bottom: 1px solid #a7f3d0;">
                  <strong>نوع البحث:</strong> ${orderData.researchType}
                </li>
                <li style="padding: 8px 0; border-bottom: 1px solid #a7f3d0;">
                  <strong>عنوان البحث:</strong> ${orderData.researchTitle}
                </li>
                <li style="padding: 8px 0;">
                  <strong>الموعد النهائي:</strong> ${orderData.deadline}
                </li>
              </ul>
            </div>

            <h3 style="color: #059669; margin-top: 30px;">الخطوات القادمة:</h3>
            <ol style="line-height: 2;">
              <li>سنقوم بمراجعة طلبك خلال 24 ساعة</li>
              <li>سنتواصل معك عبر البريد الإلكتروني أو الواتساب</li>
              <li>سنقدم لك عرض سعر مفصل وجدول زمني</li>
            </ol>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;">
                <strong>💡 نصيحة:</strong> سنتواصل معك قريباً عبر البريد الإلكتروني أو الهاتف.
              </p>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px; text-align: center;">
              <h3 style="color: #1f2937; margin-top: 0;">للتواصل معنا</h3>
              <p style="margin: 5px 0;">📧 البريد الإلكتروني: info@masteredupath.com</p>
              <p style="margin: 5px 0;">📱 جوال: 0500776343</p>
              <p style="margin: 5px 0;">📱 واتساب: 0500776343</p>
              <p style="margin: 5px 0;">⏰ ساعات العمل: الأحد - الخميس (9 صباحاً - 6 مساءً)</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // إرسال إيميل للإدارة
    const adminEmail = await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      to: ["info@masteredupath.com"],
      subject: `🎓 طلب جديد: ${orderData.categoryTitle} - ${orderData.fullName}`,
      html: adminEmailHtml,
    });

    // إرسال إيميل للعميل
    const clientEmail = await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      to: [orderData.email],
      subject: `✅ تم استلام طلبك - ${orderData.categoryTitle}`,
      html: clientEmailHtml,
    });

    console.log("Emails sent successfully:", { adminEmail, clientEmail });

    // إرسال إشعار للعميل
    await supabaseClient
      .from('user_notifications')
      .insert({
        user_email: orderData.email,
        title: 'تم استلام طلبك البحثي',
        message: `شكراً لك على طلب خدمة ${orderData.categoryTitle}. سنتواصل معك قريباً.`,
        type: 'success',
        category: 'order',
        metadata: { orderId, category: orderData.category }
      });

    // إرسال إشعار للإدارة
    await supabaseClient
      .from('user_notifications')
      .insert({
        user_email: 'info@masteredupath.com',
        title: 'طلب بحثي جديد',
        message: `طلب جديد من ${orderData.fullName} - ${orderData.categoryTitle}`,
        type: 'info',
        category: 'general',
        metadata: { orderId, customerEmail: orderData.email, category: orderData.category, isAdmin: true }
      });

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
    console.error("Error in send-research-order function:", error);
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
