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
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InterestRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: any = await req.json();
    const { name, email }: InterestRequest =body;
    // 🆕 حفظ في صندوق الوارد الموحّد للوحة الإدارة
    try {
      const data: any = body;
      await supabaseAdmin.from("inbox_messages").insert({
        sender_name: (data.name || "زائر").toString().slice(0, 200),
        sender_email: (data.email || "unknown@masteredupath.com").toString().slice(0, 200),
        sender_phone: (data.'' || null) ? data.''.toString().slice(0, 50) : null,
        subject: ('تسجيل اهتمام بمراجعة الأقران').toString().slice(0, 300),
        message: ('سجّل المستخدم اهتمامه بخدمة مراجعة الأقران Peer Review.' || "").toString().slice(0, 8000),
        form_type: "interest",
        service_type: 'peer-review',
        source_page: typeof data.sourcePage === "string" ? data.sourcePage : null,
        priority: "high",
        status: "new",
        metadata: {},
      });
    } catch (inboxErr) {
      console.error("[inbox] failed to save:", inboxErr);
    }


    // Validation
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "الاسم والبريد الإلكتروني مطلوبان" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "البريد الإلكتروني غير صحيح" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Processing interest registration for:", { name, email });

    // Send confirmation email to user
    const userEmailResponse = await resend.emails.send({
      from: "MasterEduPath <noreply@masteredupath.com>",
      to: [email],
      subject: "تأكيد تسجيل الاهتمام - خدمة المراجعة التعاونية العالمية",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تأكيد تسجيل الاهتمام</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; }
            .footer { background: #1e293b; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
            .highlight { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌐 مرحباً ${name}</h1>
              <p>شكراً لتسجيل اهتمامك بخدمة المراجعة التعاونية العالمية</p>
            </div>
            
            <div class="content">
              <h2>تم تسجيل اهتمامك بنجاح! ✅</h2>
              
              <p>عزيزي/عزيزتي <strong>${name}</strong>،</p>
              
              <p>نشكرك على اهتمامك بخدمة <strong>المراجعة التعاونية العالمية</strong> التي نعمل على تطويرها حالياً.</p>
              
              <div class="highlight">
                <h3>🚧 الخدمة قيد التطوير</h3>
                <p>نعمل بجد على إنشاء منصة متطورة للمراجعة العلمية العالمية. سنقوم بإشعارك فور اكتمال التطوير وإطلاق الخدمة رسمياً.</p>
              </div>
              
              <h3>ماذا نقدم؟</h3>
              <ul>
                <li>⏱️ سرعة في المراجعة</li>
                <li>🌐 شفافية كاملة</li>
                <li>👥 اختيار المراجعين</li>
                <li>🎓 شهادات للمراجعين</li>
              </ul>
              
              <p>في حالة وجود أي استفسارات، لا تتردد في التواصل معنا.</p>
            </div>
            
            <div class="footer">
              <p><strong>MasterEduPath</strong></p>
              <p>البريد الإلكتروني: info@masteredupath.com</p>
              <p>نحن نقدر ثقتك بنا ونتطلع لخدمتك قريباً</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("User email sent successfully:", userEmailResponse);

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "MasterEduPath <noreply@masteredupath.com>",
      to: ["info@masteredupath.com"],
      subject: "تسجيل اهتمام جديد - خدمة المراجعة التعاونية العالمية",
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>تسجيل اهتمام جديد</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 25px; border: 1px solid #e2e8f0; }
            .info-box { background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 تسجيل اهتمام جديد</h1>
              <p>خدمة المراجعة التعاونية العالمية</p>
            </div>
            
            <div class="content">
              <h2>تفاصيل المهتم:</h2>
              
              <div class="info-box">
                <p><strong>الاسم:</strong> ${name}</p>
                <p><strong>البريد الإلكتروني:</strong> ${email}</p>
                <p><strong>تاريخ التسجيل:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
                <p><strong>وقت التسجيل:</strong> ${new Date().toLocaleTimeString('ar-SA')}</p>
              </div>
              
              <div class="info-box">
                <h3>📊 إحصائيات:</h3>
                <p>تم تسجيل اهتمام جديد لخدمة المراجعة التعاونية العالمية.</p>
                <p>يُنصح بمتابعة قاعدة بيانات المهتمين وإرسال إشعارات دورية بالتحديثات.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "تم تسجيل اهتمامك بنجاح! ستصلك رسالة تأكيد على بريدك الإلكتروني." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in send-peer-review-interest function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.",
        details: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);