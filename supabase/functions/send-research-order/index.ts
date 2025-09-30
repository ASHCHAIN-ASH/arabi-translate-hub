import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  researchTitle: string;
  researchType: string;
  deadline: string;
  details: string;
  attachments?: Array<{ name: string; data: string; type: string }>;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: ResearchOrderRequest = await req.json();
    
    console.log("Processing research order:", {
      category: orderData.category,
      email: orderData.email,
      specialization: orderData.specialization
    });

    // إنشاء محتوى HTML للإيميل
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-row { margin: 15px 0; padding: 15px; background: white; border-radius: 8px; border-right: 4px solid #667eea; }
          .label { font-weight: bold; color: #667eea; display: inline-block; width: 150px; }
          .value { color: #333; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .contact-info { background: #667eea; color: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 طلب خدمة بحثية جديد</h1>
            <p>${orderData.categoryTitle}</p>
          </div>
          
          <div class="content">
            <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">معلومات العميل</h2>
            
            <div class="info-row">
              <span class="label">الاسم الكامل:</span>
              <span class="value">${orderData.fullName}</span>
            </div>
            
            <div class="info-row">
              <span class="label">البريد الإلكتروني:</span>
              <span class="value">${orderData.email}</span>
            </div>
            
            <div class="info-row">
              <span class="label">رقم الهاتف:</span>
              <span class="value">${orderData.phone}</span>
            </div>
            
            <div class="info-row">
              <span class="label">رقم الواتساب:</span>
              <span class="value">${orderData.whatsapp}</span>
            </div>
            
            <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">تفاصيل البحث</h2>
            
            <div class="info-row">
              <span class="label">القسم:</span>
              <span class="value">${orderData.categoryTitle}</span>
            </div>
            
            <div class="info-row">
              <span class="label">التخصص:</span>
              <span class="value">${orderData.specialization}</span>
            </div>
            
            <div class="info-row">
              <span class="label">عنوان البحث:</span>
              <span class="value">${orderData.researchTitle}</span>
            </div>
            
            <div class="info-row">
              <span class="label">نوع البحث:</span>
              <span class="value">${orderData.researchType}</span>
            </div>
            
            <div class="info-row">
              <span class="label">الموعد النهائي:</span>
              <span class="value">${orderData.deadline}</span>
            </div>
            
            <div class="info-row">
              <span class="label">التفاصيل:</span>
              <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${orderData.details}</div>
            </div>
            
            ${orderData.attachments && orderData.attachments.length > 0 ? `
              <div class="info-row">
                <span class="label">المرفقات:</span>
                <div class="value" style="margin-top: 10px;">
                  ${orderData.attachments.map(att => `<div>📎 ${att.name}</div>`).join('')}
                </div>
              </div>
            ` : ''}
            
            <div class="contact-info">
              <h3 style="margin-top: 0;">معلومات التواصل</h3>
              <p><strong>📧 البريد الإلكتروني:</strong> info@masteredupath.com</p>
              <p><strong>📱 الهاتف:</strong> +966 50 123 4567</p>
              <p><strong>💬 الواتساب:</strong> +966 50 123 4567</p>
              <p><strong>🌐 الموقع:</strong> www.masteredupath.com</p>
            </div>
          </div>
          
          <div class="footer">
            <p>هذا الإيميل تم إرساله تلقائياً من نظام مركز ماستر للأبحاث</p>
            <p>© 2024 MasterEduPath Research Center. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // إرسال إيميل للإدارة
    const adminEmailResponse = await resend.emails.send({
      from: "MasterEduPath <noreply@resend.dev>",
      to: ["info@masteredupath.com"],
      subject: `طلب خدمة بحثية جديد - ${orderData.categoryTitle} - ${orderData.fullName}`,
      html: htmlContent,
      // attachments: orderData.attachments || [],
    });

    console.log("Admin email sent:", adminEmailResponse);

    // إرسال إيميل تأكيد للعميل
    const clientConfirmation = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .success-icon { font-size: 48px; margin-bottom: 20px; }
          .contact-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="success-icon">✅</div>
            <h1>تم استلام طلبك بنجاح!</h1>
          </div>
          
          <div class="content">
            <p>عزيزي/عزيزتي <strong>${orderData.fullName}</strong>,</p>
            
            <p>نشكركم على تواصلكم مع <strong>مركز ماستر للأبحاث</strong>. تم استلام طلبكم للخدمة البحثية في تخصص <strong>${orderData.specialization}</strong> بنجاح.</p>
            
            <div class="contact-box">
              <h3 style="color: #667eea; margin-top: 0;">ماذا بعد؟</h3>
              <ul>
                <li>سيقوم فريقنا المتخصص بمراجعة طلبكم خلال 24 ساعة</li>
                <li>سنتواصل معكم عبر البريد الإلكتروني أو الواتساب</li>
                <li>سنقدم لكم عرض سعر مفصل وخطة عمل</li>
              </ul>
            </div>
            
            <div class="contact-box">
              <h3 style="color: #667eea; margin-top: 0;">للاستفسارات والتواصل:</h3>
              <p>📧 <strong>البريد الإلكتروني:</strong> info@masteredupath.com</p>
              <p>📱 <strong>الهاتف:</strong> +966 50 123 4567</p>
              <p>💬 <strong>الواتساب:</strong> +966 50 123 4567</p>
            </div>
            
            <p style="text-align: center; margin-top: 30px; color: #667eea; font-weight: bold;">
              نتطلع لخدمتكم وتحقيق تميزكم الأكاديمي 🎓
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const clientEmailResponse = await resend.emails.send({
      from: "MasterEduPath <noreply@resend.dev>",
      to: [orderData.email],
      subject: "تأكيد استلام طلب الخدمة البحثية - مركز ماستر",
      html: clientConfirmation,
    });

    console.log("Client confirmation email sent:", clientEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم إرسال الطلب بنجاح",
        adminEmailId: adminEmailResponse.id,
        clientEmailId: clientEmailResponse.id
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
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
