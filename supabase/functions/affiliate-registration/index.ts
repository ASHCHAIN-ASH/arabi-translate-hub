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
  phone: string;
  country_city: string;
  marketing_channel_url?: string;
  marketing_experience: string;
  social_media_followers?: string;
  expected_monthly_sales: string;
  motivation: string;
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
      marketing_experience,
      social_media_followers,
      expected_monthly_sales,
      motivation,
      terms_accepted 
    }: AffiliateRegistrationRequest = await req.json();

    // التحقق من البيانات المطلوبة
    if (!full_name || !email || !phone || !country_city || !marketing_experience || !expected_monthly_sales || !motivation || !terms_accepted) {
      return new Response(
        JSON.stringify({ 
          error: "البيانات المطلوبة مفقودة", 
          required: ["full_name", "email", "phone", "country_city", "marketing_experience", "expected_monthly_sales", "motivation", "terms_accepted"] 
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

    // التحقق من عدم وجود بريد مكرر ثم تجهيز الأكواد
    const emailLower = email.toLowerCase();

    const { data: existingPartner } = await supabase
      .from("affiliate_partners")
      .select("affiliate_id, discount_code, full_name, email")
      .eq("email", emailLower)
      .maybeSingle();

    let affiliate_id: string;
    let discount_code: string;

    if (existingPartner) {
      // في حال كان البريد موجودًا مسبقًا: نُعيد إرسال التفاصيل ونُحدّث البيانات
      affiliate_id = existingPartner.affiliate_id;
      discount_code = existingPartner.discount_code;

      await supabase
        .from("affiliate_partners")
        .update({
          full_name,
          phone,
          country_city,
          marketing_channel_url,
          marketing_experience,
          social_media_followers,
          expected_monthly_sales,
          motivation,
          terms_accepted: true,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("email", emailLower);
    } else {
      // توليد معرف المسوق وكود الخصم
      const { data: affiliateIdData } = await supabase.rpc("generate_affiliate_id");
      const { data: discountCodeData } = await supabase.rpc("generate_discount_code");

      affiliate_id = affiliateIdData as string;
      discount_code = discountCodeData as string;

      // إدراج البيانات في قاعدة البيانات
      const { error: insertError } = await supabase
        .from("affiliate_partners")
        .insert({
          affiliate_id,
          discount_code,
          full_name,
          email: emailLower,
          phone,
          country_city,
          marketing_channel_url,
          marketing_experience,
          social_media_followers,
          expected_monthly_sales,
          motivation,
          terms_accepted,
          status: "active",
        });

      if (insertError) {
        console.error("Database insert error:", insertError);
        return new Response(
          JSON.stringify({ error: "خطأ في حفظ البيانات. يرجى المحاولة مرة أخرى." }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
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
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            direction: rtl !important;
            text-align: right !important;
          }
          body { 
            font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif; 
            line-height: 1.8;
            color: #2c3e50;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; 
            padding: 15px;
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
          }
          .header { 
            background: linear-gradient(135deg, #3b82f6, #1d4ed8); 
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
          .header p {
            font-size: 16px;
            opacity: 0.9;
          }
          .content { 
            padding: 40px 30px; 
          }
          .welcome-message {
            font-size: 20px;
            color: #2c3e50;
            margin-bottom: 25px;
            font-weight: 600;
          }
          .intro-text {
            font-size: 16px;
            color: #34495e;
            margin-bottom: 30px;
            line-height: 1.6;
          }
          .code-section {
            background: linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%);
            border: 2px solid #2196f3;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
          .code-section h3 {
            color: #1565c0;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 700;
          }
          .code { 
            font-size: 28px; 
            font-weight: bold; 
            color: #1d4ed8; 
            font-family: 'Courier New', monospace;
            background: white;
            padding: 15px 25px;
            border-radius: 10px;
            border: 2px solid #3b82f6;
            display: inline-block;
            letter-spacing: 2px;
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
          }
          .info-card {
            background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
            border: 2px solid #dee2e6;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
          }
          .info-card h4 {
            color: #495057;
            font-size: 14px;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .info-card .value {
            color: #212529;
            font-size: 16px;
            font-weight: bold;
          }
          .important-notes {
            background: linear-gradient(145deg, #fff3cd 0%, #ffeaa7 100%);
            border: 2px solid #ffc107;
            border-radius: 15px;
            padding: 25px;
            margin: 30px 0;
          }
          .important-notes h4 {
            color: #856404;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 700;
            text-align: center;
          }
          .important-notes ul {
            list-style: none;
            padding: 0;
          }
          .important-notes li {
            background: white;
            margin: 8px 0;
            padding: 12px 20px;
            border-radius: 8px;
            border-right: 4px solid #ffc107;
            color: #856404;
            font-weight: 500;
          }
          .important-notes li::before {
            content: '✅';
            margin-left: 10px;
          }
          .next-steps {
            background: linear-gradient(145deg, #d4edda 0%, #c3e6cb 100%);
            border: 2px solid #28a745;
            border-radius: 15px;
            padding: 25px;
            margin: 30px 0;
          }
          .next-steps h4 {
            color: #155724;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 700;
            text-align: center;
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
            color: #155724;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
          }
          .steps-list li::before {
            content: counter(step-counter);
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: #28a745;
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
          .footer { 
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .footer .company-name {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .footer p {
            margin: 5px 0;
            font-size: 14px;
            opacity: 0.9;
          }
          
          /* Mobile Responsive */
          @media only screen and (max-width: 600px) {
            body { padding: 5px; }
            .email-wrapper { border-radius: 15px; }
            .header { padding: 25px 20px; }
            .header h1 { font-size: 24px; }
            .content { padding: 25px 20px; }
            .info-grid { 
              grid-template-columns: 1fr;
              gap: 15px;
            }
            .code { 
              font-size: 22px;
              padding: 12px 20px;
            }
            .important-notes, .next-steps, .code-section {
              padding: 20px 15px;
              margin: 20px 0;
            }
            .steps-list li {
              padding: 12px 15px 12px 45px;
              font-size: 14px;
            }
            .footer { padding: 25px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="header">
            <h1>🎉 مرحباً بك في برنامج التسويق بالعمولة</h1>
            <p>وكالة ماستر إيدو باث للحلول التعليمية المتقدمة</p>
          </div>
          
          <div class="content">
            <div class="welcome-message">
              السلام عليكم ورحمة الله وبركاته<br>
              عزيزي/عزيزتي ${full_name}
            </div>
            
            <div class="intro-text">
              نرحب بك بحرارة في برنامج التسويق بالعمولة الخاص بوكالة ماستر إيدو باث! 
              تم قبول طلبك وتسجيلك بنجاح في البرنامج. نحن متحمسون للعمل معك وتحقيق النجاح المشترك.
            </div>
            
            <div class="code-section">
              <h3>🆔 رقم العضوية الخاص بك</h3>
              <div class="code">${affiliate_id}</div>
            </div>
            
            <div class="code-section">
              <h3>🎫 كود الخصم الخاص بك (10%)</h3>
              <div class="code">${discount_code}</div>
            </div>

            <div class="info-grid">
              <div class="info-card">
                <h4>مستوى الخبرة</h4>
                <div class="value">${marketing_experience}</div>
              </div>
              <div class="info-card">
                <h4>توقعات المبيعات</h4>
                <div class="value">${expected_monthly_sales}</div>
              </div>
              <div class="info-card">
                <h4>المتابعين</h4>
                <div class="value">${social_media_followers || 'غير محدد'}</div>
              </div>
              <div class="info-card">
                <h4>الموقع</h4>
                <div class="value">${country_city}</div>
              </div>
            </div>
            
            <div class="important-notes">
              <h4>📋 ملاحظات مهمة</h4>
              <ul>
                <li>استخدم رقم العضوية وكود الخصم عند التسويق لخدماتنا</li>
                <li>ستحصل على عمولة مجزية على كل عملية بيع تتم باستخدام كودك</li>
                <li>الأرباح تُحول أسبوعياً عند وصولها لـ 100 ريال سعودي</li>
                <li>احتفظ بهذا البريد للمراجعة المستقبلية</li>
                <li>سيتم التواصل معك خلال 24 ساعة لتفاصيل إضافية</li>
              </ul>
            </div>

            <div class="next-steps">
              <h4>⚡ الخطوات التالية</h4>
              <ul class="steps-list">
                <li>سيتواصل معك فريق الدعم خلال 24 ساعة كحد أقصى</li>
                <li>ستحصل على المواد التسويقية والأدوات اللازمة</li>
                <li>سنقوم بتدريبك على أفضل استراتيجيات التسويق</li>
                <li>ابدأ بمشاركة كود الخصم مع شبكتك والعملاء المحتملين</li>
                <li>تابع أرباحك ومبيعاتك من خلال لوحة التحكم</li>
              </ul>
            </div>
            
            <p style="text-align: center; font-size: 18px; color: #2c3e50; font-weight: 600; margin-top: 30px;">
              🙏 شكراً لك على انضمامك إلى فريقنا!<br>
              نتطلع إلى تحقيق النجاح والنمو معاً 🚀
            </p>
          </div>
          
          <div class="footer">
            <p class="company-name">🎯 وكالة ماستر إيدو باث</p>
            <p>للحلول التعليمية والأكاديمية المتقدمة</p>
            <p>📞 0500776343 | 📧 legal@masteredupath.com</p>
            <p>🌐 www.masteredupath.com</p>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
              &copy; 2024 جميع الحقوق محفوظة
            </p>
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تسجيل جديد في برنامج التسويق بالعمولة</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: 'Segoe UI', 'Cairo', 'Amiri', Tahoma, Arial, sans-serif; 
            line-height: 1.8;
            color: #2c3e50;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            margin: 0;
            padding: 10px;
            direction: rtl;
            text-align: right;
          }
          .email-wrapper {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 30px 60px rgba(0,0,0,0.2);
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
            50% { opacity: 0.8; }
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
          .header h2 {
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
          .alert-section {
            background: linear-gradient(145deg, #fff3cd 0%, #ffeaa7 100%);
            border: 3px solid #ffc107;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
            box-shadow: 0 8px 20px rgba(255,193,7,0.3);
          }
          .alert-section .icon {
            font-size: 48px;
            margin-bottom: 15px;
          }
          .alert-section h3 {
            color: #856404;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .affiliate-info {
            background: linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%);
            border: 2px solid #2196f3;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
          }
          .affiliate-info h3 {
            color: #1565c0;
            font-size: 20px;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 700;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          .info-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            border-right: 4px solid #2196f3;
            box-shadow: 0 3px 10px rgba(33, 150, 243, 0.1);
          }
          .info-item strong {
            color: #1565c0;
            display: block;
            font-size: 14px;
            margin-bottom: 5px;
            font-weight: 600;
          }
          .info-item span {
            color: #2c3e50;
            font-size: 15px;
            font-weight: 500;
          }
          .motivation-section {
            background: linear-gradient(145deg, #f3e5f5 0%, #e1bee7 100%);
            border: 2px solid #9c27b0;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
          }
          .motivation-section h3 {
            color: #6a1b9a;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
            font-weight: 700;
          }
          .motivation-text {
            background: white;
            padding: 20px;
            border-radius: 10px;
            border-right: 4px solid #9c27b0;
            color: #2c3e50;
            font-style: italic;
            line-height: 1.6;
            box-shadow: 0 3px 10px rgba(156, 39, 176, 0.1);
          }
          .action-required {
            background: linear-gradient(145deg, #ffebee 0%, #ffcdd2 100%);
            border: 3px solid #f44336;
            border-radius: 15px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
          .action-required .icon {
            font-size: 48px;
            margin-bottom: 15px;
          }
          .action-required h3 {
            color: #c62828;
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 15px;
          }
          .action-required p {
            color: #d32f2f;
            font-size: 16px;
            font-weight: 600;
          }
          .footer { 
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .footer p {
            margin: 5px 0;
            font-size: 14px;
          }
          
          /* Mobile Responsive */
          @media only screen and (max-width: 600px) {
            body { padding: 5px; }
            .email-wrapper { 
              border-radius: 15px;
              border-width: 2px;
            }
            .urgent-banner {
              padding: 12px;
              font-size: 14px;
            }
            .header { padding: 25px 20px; }
            .header h2 { font-size: 24px; }
            .content { padding: 25px 20px; }
            .info-grid { 
              grid-template-columns: 1fr;
              gap: 10px;
            }
            .alert-section, .affiliate-info, .motivation-section, .action-required {
              padding: 20px 15px;
              margin: 20px 0;
            }
            .alert-section .icon, .action-required .icon {
              font-size: 36px;
            }
            .info-item {
              padding: 12px 15px;
            }
            .footer { padding: 25px 20px; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="urgent-banner">
            🚨 تنبيه عاجل: تسجيل جديد يتطلب المتابعة الفورية
          </div>
          
          <div class="header">
            <h2>🔔 تسجيل جديد في برنامج التسويق بالعمولة</h2>
            <div class="timestamp">
              📅 ${new Date().toLocaleString('ar-SA', { 
                timeZone: 'Asia/Riyadh',
                year: 'numeric',
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          
          <div class="content">
            <div class="alert-section">
              <div class="icon">⚡</div>
              <h3>تنبيه هام</h3>
              <p>تم استلام طلب انضمام جديد لبرنامج التسويق بالعمولة يتطلب المراجعة والمتابعة السريعة</p>
            </div>
            
            <div class="affiliate-info">
              <h3>👤 معلومات المسوق الجديد</h3>
              <div class="info-grid">
                <div class="info-item">
                  <strong>الاسم الكامل</strong>
                  <span>${full_name}</span>
                </div>
                <div class="info-item">
                  <strong>البريد الإلكتروني</strong>
                  <span>${email}</span>
                </div>
                <div class="info-item">
                  <strong>رقم الهاتف</strong>
                  <span>${phone}</span>
                </div>
                <div class="info-item">
                  <strong>الموقع</strong>
                  <span>${country_city}</span>
                </div>
                <div class="info-item">
                  <strong>مستوى الخبرة</strong>
                  <span>${marketing_experience}</span>
                </div>
                <div class="info-item">
                  <strong>عدد المتابعين</strong>
                  <span>${social_media_followers || 'غير محدد'}</span>
                </div>
                <div class="info-item">
                  <strong>توقعات المبيعات</strong>
                  <span>${expected_monthly_sales}</span>
                </div>
                <div class="info-item">
                  <strong>رابط قناة التسويق</strong>
                  <span>${marketing_channel_url || 'غير محدد'}</span>
                </div>
              </div>
              
              <div class="info-grid">
                <div class="info-item">
                  <strong>رقم العضوية</strong>
                  <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #1565c0;">${affiliate_id}</span>
                </div>
                <div class="info-item">
                  <strong>كود الخصم</strong>
                  <span style="font-family: monospace; font-size: 16px; font-weight: bold; color: #1565c0;">${discount_code}</span>
                </div>
              </div>
            </div>

            <div class="motivation-section">
              <h3>💭 دوافع الانضمام للبرنامج</h3>
              <div class="motivation-text">
                "${motivation}"
              </div>
            </div>
            
            <div class="action-required">
              <div class="icon">⏰</div>
              <h3>مطلوب اتخاذ إجراء</h3>
              <p>يجب التواصل مع المسوق الجديد خلال 24 ساعة كحد أقصى لتأكيد التسجيل وتقديم الدعم اللازم</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>نظام إدارة التسويق بالعمولة</strong></p>
            <p>وكالة ماستر إيدو باث للحلول التعليمية المتقدمة</p>
            <p>📞 0500776343 | 📧 legal@masteredupath.com</p>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
              تم إرسال هذا التنبيه تلقائياً من نظام إدارة الشركاء
            </p>
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