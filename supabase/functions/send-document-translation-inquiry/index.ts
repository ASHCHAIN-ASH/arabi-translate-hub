import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DocumentTranslationInquiry {
  name: string;
  email: string;
  phone: string;
  documentType: string;
  sourceLanguage: string;
  targetLanguage: string;
  documentSize: string;
  urgency: string;
  additionalNotes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const inquiry: DocumentTranslationInquiry = await req.json();
    
    console.log("Received document translation inquiry:", inquiry);

    // Validate required fields
    if (!inquiry.name || !inquiry.email || !inquiry.phone || !inquiry.documentType) {
      return new Response(
        JSON.stringify({ error: "الرجاء ملء جميع الحقول المطلوبة" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Master Edu Path <info@masteredupath.com>",
      to: [inquiry.email],
      subject: "تأكيد استلام طلب ترجمة المستندات - Master Edu Path",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد طلب ترجمة المستندات</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f8f9fa;
              margin: 0;
              padding: 20px;
              direction: rtl;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .info-box {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .footer {
              background: #343a40;
              color: white;
              padding: 20px;
              text-align: center;
            }
            .contact-info {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Master Edu Path</h1>
              <h2>تأكيد استلام طلب ترجمة المستندات</h2>
            </div>
            
            <div class="content">
              <h3>عزيزي/عزيزتي ${inquiry.name}،</h3>
              
              <p>شكراً لك على تواصلك معنا! تم استلام طلبك لخدمة ترجمة المستندات بنجاح.</p>
              
              <div class="info-box">
                <h4>تفاصيل طلبك:</h4>
                <ul>
                  <li><strong>الاسم:</strong> ${inquiry.name}</li>
                  <li><strong>البريد الإلكتروني:</strong> ${inquiry.email}</li>
                  <li><strong>رقم الهاتف:</strong> ${inquiry.phone}</li>
                  <li><strong>نوع المستند:</strong> ${inquiry.documentType}</li>
                  <li><strong>من اللغة:</strong> ${inquiry.sourceLanguage}</li>
                  <li><strong>إلى اللغة:</strong> ${inquiry.targetLanguage}</li>
                  <li><strong>حجم المستند:</strong> ${inquiry.documentSize}</li>
                  <li><strong>مستوى الاستعجال:</strong> ${inquiry.urgency}</li>
                  ${inquiry.additionalNotes ? `<li><strong>ملاحظات إضافية:</strong> ${inquiry.additionalNotes}</li>` : ''}
                </ul>
              </div>
              
              <p><strong>ماذا يحدث الآن؟</strong></p>
              <ul>
                <li>سيتواصل معك فريق الخبراء خلال 24 ساعة</li>
                <li>سنقوم بتقييم مستندك وإرسال عرض سعر مفصل</li>
                <li>بعد الموافقة، سنبدأ العمل فوراً</li>
                <li>ستحصل على ترجمة احترافية معتمدة</li>
              </ul>
              
              <div class="contact-info">
                <h4>معلومات التواصل:</h4>
                <p>📧 البريد الإلكتروني: info@masteredupath.com</p>
                <p>🌐 الموقع الإلكتروني: www.masteredupath.com</p>
              </div>
            </div>
            
            <div class="footer">
              <p>&copy; 2024 Master Edu Path - جميع الحقوق محفوظة</p>
              <p>نحن ملتزمون بتقديم أفضل خدمات الترجمة الاحترافية</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Master Edu Path System <info@masteredupath.com>",
      to: ["info@masteredupath.com"],
      subject: `🚨 طلب جديد: ترجمة المستندات من ${inquiry.name}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طلب ترجمة مستندات جديد</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f8f9fa;
              margin: 0;
              padding: 20px;
              direction: rtl;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .alert-box {
              background: #fff3cd;
              border: 1px solid #ffeeba;
              color: #856404;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .client-info {
              background: #e9ecef;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .priority {
              background: #d4edda;
              border: 1px solid #c3e6cb;
              color: #155724;
              padding: 10px;
              border-radius: 5px;
              text-align: center;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 طلب جديد - ترجمة المستندات</h1>
              <p>تاريخ الطلب: ${new Date().toLocaleString('ar-SA')}</p>
            </div>
            
            <div class="content">
              <div class="alert-box">
                <strong>⚡ تنبيه هام:</strong> تم استلام طلب ترجمة مستندات جديد يتطلب المتابعة السريعة
              </div>
              
              <div class="client-info">
                <h3>📋 معلومات العميل:</h3>
                <ul>
                  <li><strong>الاسم:</strong> ${inquiry.name}</li>
                  <li><strong>البريد الإلكتروني:</strong> ${inquiry.email}</li>
                  <li><strong>رقم الهاتف:</strong> ${inquiry.phone}</li>
                </ul>
              </div>
              
              <h3>📄 تفاصيل الطلب:</h3>
              <ul>
                <li><strong>نوع المستند:</strong> ${inquiry.documentType}</li>
                <li><strong>من اللغة:</strong> ${inquiry.sourceLanguage}</li>
                <li><strong>إلى اللغة:</strong> ${inquiry.targetLanguage}</li>
                <li><strong>حجم المستند:</strong> ${inquiry.documentSize}</li>
                <li><strong>مستوى الاستعجال:</strong> ${inquiry.urgency}</li>
                ${inquiry.additionalNotes ? `<li><strong>ملاحظات إضافية:</strong> ${inquiry.additionalNotes}</li>` : ''}
              </ul>
              
              <div class="priority">
                مطلوب التواصل مع العميل خلال 24 ساعة ⏰
              </div>
              
              <h3>⚡ الخطوات التالية:</h3>
              <ol>
                <li>مراجعة تفاصيل الطلب</li>
                <li>التواصل مع العميل لمناقشة التفاصيل</li>
                <li>تقييم المستند وتحديد السعر</li>
                <li>إرسال عرض السعر المفصل</li>
              </ol>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);
    console.log("Admin email sent:", adminEmailResponse);

    if (customerEmailResponse.error || adminEmailResponse.error) {
      console.error("Email sending error:", {
        customerError: customerEmailResponse.error,
        adminError: adminEmailResponse.error
      });
      
      return new Response(
        JSON.stringify({ error: "حدث خطأ في إرسال الإيميل، يرجى المحاولة مرة أخرى" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم إرسال طلبك بنجاح! سنتواصل معك قريباً."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in send-document-translation-inquiry function:", error);
    return new Response(
      JSON.stringify({ error: "حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);