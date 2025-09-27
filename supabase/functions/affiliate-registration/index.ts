import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AffiliateRegistrationRequest {
  full_name: string;
  email: string;
  phone?: string;
  country_city?: string;
  marketing_channel_url?: string;
  terms_accepted: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const { 
      full_name, 
      email, 
      phone, 
      country_city, 
      marketing_channel_url, 
      terms_accepted 
    }: AffiliateRegistrationRequest = await req.json();

    // التحقق من البيانات المطلوبة
    if (!full_name || !email || !terms_accepted) {
      return new Response(
        JSON.stringify({ 
          error: "البيانات المطلوبة مفقودة", 
          required: ["full_name", "email", "terms_accepted"] 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // التحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "صيغة البريد الإلكتروني غير صحيحة" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // التحقق من عدم وجود بريد مكرر
    const { data: existingPartner } = await supabase
      .from("affiliate_partners")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();

    if (existingPartner) {
      return new Response(
        JSON.stringify({ error: "هذا البريد الإلكتروني مسجل مسبقاً في البرنامج" }),
        { 
          status: 409, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // توليد معرف المسوق وكود الخصم
    const { data: affiliateIdData } = await supabase.rpc("generate_affiliate_id");
    const { data: discountCodeData } = await supabase.rpc("generate_discount_code");

    const affiliate_id = affiliateIdData;
    const discount_code = discountCodeData;

    // إدراج البيانات في قاعدة البيانات
    const { data: newPartner, error: insertError } = await supabase
      .from("affiliate_partners")
      .insert({
        affiliate_id,
        discount_code,
        full_name,
        email: email.toLowerCase(),
        phone,
        country_city,
        marketing_channel_url,
        terms_accepted,
        status: "active"
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "خطأ في حفظ البيانات. يرجى المحاولة مرة أخرى." }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // إرسال بريد إلكتروني للعميل
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>مرحباً بك في برنامج التسويق بالعمولة</title>
        <style>
          body { font-family: 'Tahoma', 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .code-box { background-color: #f8fafc; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .code { font-size: 24px; font-weight: bold; color: #1d4ed8; font-family: monospace; }
          .info-box { background-color: #fef3c7; border-right: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 مرحباً بك في برنامج التسويق بالعمولة</h1>
            <p>وكالة ماستر إيدو باث</p>
          </div>
          
          <div class="content">
            <h2>عزيزي/عزيزتي ${full_name}</h2>
            <p>نرحب بك في برنامج التسويق بالعمولة الخاص بوكالة ماستر إيدو باث! تم تسجيلك بنجاح وإليك تفاصيل حسابك:</p>
            
            <div class="code-box">
              <h3>رقم العضوية الخاص بك</h3>
              <div class="code">${affiliate_id}</div>
            </div>
            
            <div class="code-box">
              <h3>كود الخصم الخاص بك (10%)</h3>
              <div class="code">${discount_code}</div>
            </div>
            
            <div class="info-box">
              <h4>ملاحظات مهمة:</h4>
              <ul>
                <li>استخدم كود الخصم عند التسويق لخدماتنا</li>
                <li>ستحصل على عمولة على كل عملية بيع تتم باستخدام كودك</li>
                <li>سيتم التواصل معك قريباً لتفاصيل البرنامج</li>
                <li>احتفظ بهذا البريد للمراجعة</li>
              </ul>
            </div>
            
            <p>شكراً لك على انضمامك إلى فريقنا!</p>
          </div>
          
          <div class="footer">
            <p>وكالة ماستر إيدو باث للحلول التعليمية المتقدمة</p>
            <p>📞 0500776343 | 📧 legal@masteredupath.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const clientEmailText = `
مرحباً ${full_name}،

نرحب بك في برنامج التسويق بالعمولة!

رقم العضوية: ${affiliate_id}
كود الخصم 10%: ${discount_code}

ملاحظات مهمة:
- استخدم كود الخصم عند التسويق لخدماتنا
- ستحصل على عمولة على كل عملية بيع
- سيتم التواصل معك قريباً

شكراً لانضمامك إلى فريقنا!

وكالة ماستر إيدو باث
📞 0500776343 | 📧 legal@masteredupath.com
    `;

    console.log("Sending emails...");

    // التحقق من وجود RESEND_API_KEY
    if (!Deno.env.get("RESEND_API_KEY")) {
      console.error("RESEND_API_KEY not found!");
      // لا نفشل العملية، فقط نسجل الخطأ
    } else {
      try {
        // إرسال البريد للعميل
        console.log("Sending client email to:", email);
        const clientEmailResult = await resend.emails.send({
          from: "وكالة ماستر إيدو باث <onboarding@resend.dev>",
          to: [email],
          subject: "🎉 مرحباً بك في برنامج التسويق بالعمولة - وكالة ماستر إيدو باث",
          html: clientEmailHtml,
          text: clientEmailText,
        });
        console.log("Client email sent successfully:", clientEmailResult);

      } catch (emailError) {
        console.error("Error sending client email:", emailError);
        // لا نفشل العملية، فقط نسجل الخطأ
      }
    }

    // إرسال تنبيه للإدارة
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Tahoma', 'Arial', sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1d4ed8; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 تسجيل جديد في برنامج التسويق بالعمولة</h2>
          </div>
          <div class="content">
            <h3>تفاصيل المسوق الجديد:</h3>
            <p><strong>الاسم:</strong> ${full_name}</p>
            <p><strong>البريد الإلكتروني:</strong> ${email}</p>
            <p><strong>الهاتف:</strong> ${phone || "غير محدد"}</p>
            <p><strong>الدولة/المدينة:</strong> ${country_city || "غير محدد"}</p>
            <p><strong>رابط قناة التسويق:</strong> ${marketing_channel_url || "غير محدد"}</p>
            <p><strong>رقم العضوية:</strong> ${affiliate_id}</p>
            <p><strong>كود الخصم:</strong> ${discount_code}</p>
            <p><strong>تاريخ التسجيل:</strong> ${new Date().toLocaleString('ar-SA')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    if (Deno.env.get("RESEND_API_KEY")) {
      try {
        console.log("Sending admin notification email...");
        const adminEmailResult = await resend.emails.send({
          from: "نظام التسويق بالعمولة <onboarding@resend.dev>",
          to: ["legal@masteredupath.com"],
          subject: `🔔 تسجيل جديد في برنامج التسويق بالعمولة - ${full_name}`,
          html: adminEmailHtml,
        });
        console.log("Admin email sent successfully:", adminEmailResult);
      } catch (adminEmailError) {
        console.error("Error sending admin email:", adminEmailError);
      }
    }

    console.log("Affiliate partner registered successfully:", {
      affiliate_id,
      email,
      full_name
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "تم التسجيل بنجاح",
        data: {
          affiliate_id,
          discount_code,
          full_name,
          email
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in affiliate-registration function:", error);
    return new Response(
      JSON.stringify({ 
        error: "حدث خطأ في النظام. يرجى المحاولة مرة أخرى.",
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