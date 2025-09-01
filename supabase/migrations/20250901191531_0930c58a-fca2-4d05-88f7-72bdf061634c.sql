-- إزالة جدول email_templates المؤقت وإعادة إنشاؤه بدون RLS
DROP TABLE IF EXISTS public.email_templates;

-- إنشاء جدول قوالب البريد الإلكتروني بدون RLS للاختبار
CREATE TABLE public.email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    template_key TEXT NOT NULL UNIQUE,
    subject_template TEXT NOT NULL,
    html_template TEXT NOT NULL,
    variables JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إدراج القوالب مرة أخرى
INSERT INTO public.email_templates (template_key, subject_template, html_template, variables, is_active) VALUES

-- قالب ترحيب عصري
('welcome_modern', 'مرحباً بك في {{company_name}} - رحلتك تبدأ الآن!', 
'<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        .container { max-width: 600px; margin: 0 auto; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; animation: fadeIn 1s ease-out; }
        .logo { font-size: 32px; font-weight: 700; margin-bottom: 10px; animation: pulse 2s infinite; }
        .welcome-text { font-size: 18px; margin-bottom: 0; opacity: 0.9; animation: slideIn 0.8s ease-out 0.3s both; }
        .content { background: white; padding: 40px 30px; animation: fadeIn 1s ease-out 0.5s both; }
        .main-title { color: #333; font-size: 28px; font-weight: 600; margin-bottom: 20px; text-align: center; }
        .description { color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; margin: 20px 0; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3); }
        .cta-button:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
        .features { display: flex; flex-wrap: wrap; gap: 20px; margin: 30px 0; }
        .feature { flex: 1; min-width: 150px; text-align: center; padding: 20px; background: #f8f9ff; border-radius: 15px; transition: transform 0.3s ease; }
        .feature:hover { transform: translateY(-5px); }
        .feature-icon { font-size: 40px; margin-bottom: 15px; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">{{company_name}}</div>
            <div class="welcome-text">مرحباً بك في عائلتنا المتميزة</div>
        </div>
        <div class="content">
            <h1 class="main-title">مرحباً {{customer_name}}! 🎉</h1>
            <p class="description">نحن متحمسون جداً لانضمامك إلينا. رحلتك المميزة تبدأ الآن مع {{company_name}}، حيث نقدم لك أفضل الخدمات وأعلى معايير الجودة.</p>
            
            <div style="text-align: center;">
                <a href="{{dashboard_url}}" class="cta-button">ابدأ رحلتك الآن</a>
            </div>

            <div class="features">
                <div class="feature">
                    <div class="feature-icon">⚡</div>
                    <h3>سرعة فائقة</h3>
                    <p>خدمات سريعة ومتطورة</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🛡️</div>
                    <h3>أمان عالي</h3>
                    <p>حماية متقدمة لبياناتك</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">💎</div>
                    <h3>جودة مميزة</h3>
                    <p>أعلى معايير الجودة</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <p>شكراً لاختيارك {{company_name}} | جميع الحقوق محفوظة © 2024</p>
            <p>هذا البريد تم إرساله إلى {{customer_email}}</p>
        </div>
    </div>
</body>
</html>', 
'["company_name", "customer_name", "customer_email", "dashboard_url"]'::jsonb, true),

-- قالب فاتورة احترافي
('invoice_premium', 'فاتورة رقم {{invoice_number}} - {{company_name}}', 
'<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @keyframes slideDown { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeInUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .container { max-width: 700px; margin: 0 auto; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background: white; box-shadow: 0 0 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 40px 30px; position: relative; overflow: hidden; animation: slideDown 0.8s ease-out; }
        .header::before { content: ""; position: absolute; top: 0; right: -50%; width: 100%; height: 100%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent); transform: skewX(-25deg); animation: shine 3s infinite; }
        @keyframes shine { 0%, 100% { transform: translateX(-100%) skewX(-25deg); } 50% { transform: translateX(200%) skewX(-25deg); } }
        .invoice-title { font-size: 36px; font-weight: 700; margin-bottom: 10px; }
        .company-info { text-align: right; }
        .customer-section { padding: 30px; background: #f8f9ff; animation: fadeInUp 0.8s ease-out 0.2s both; }
        .invoice-details { padding: 30px; animation: fadeInUp 0.8s ease-out 0.4s both; }
        .total-section { background: linear-gradient(135deg, #11998e, #38ef7d); color: white; padding: 25px; border-radius: 15px; text-align: center; margin: 20px 0; }
        .total-amount { font-size: 42px; font-weight: 700; margin-bottom: 5px; }
        .footer { background: #2c3e50; color: white; padding: 25px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="invoice-title">فاتورة رقم: {{invoice_number}}</div>
            <div class="company-info">
                <h2>{{company_name}}</h2>
            </div>
        </div>
        
        <div class="customer-section">
            <h3>فاتورة إلى: {{customer_name}}</h3>
            <p>{{customer_email}}</p>
        </div>

        <div class="invoice-details">
            <div class="total-section">
                <div class="total-amount">{{total_amount}} {{currency}}</div>
                <div>المبلغ الإجمالي</div>
            </div>
        </div>

        <div class="footer">
            <p>شكراً لثقتك في {{company_name}}</p>
        </div>
    </div>
</body>
</html>', 
'["invoice_number", "company_name", "customer_name", "customer_email", "total_amount", "currency"]'::jsonb, true),

-- قالب تهنئة متحرك
('congratulations_animated', 'مبروك {{achievement_title}}! 🎉', 
'<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @keyframes confetti { 0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
        @keyframes celebration { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .container { max-width: 650px; margin: 0 auto; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; position: relative; overflow: hidden; }
        .confetti { position: absolute; width: 10px; height: 10px; background: #ff6b6b; animation: confetti 3s linear infinite; }
        .celebration-header { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); padding: 50px 20px; text-align: center; position: relative; }
        .trophy-icon { font-size: 80px; animation: celebration 2s ease-in-out infinite; margin-bottom: 20px; }
        .congratulations-title { font-size: 42px; font-weight: 700; color: #fff; margin-bottom: 15px; }
        .content { background: white; padding: 40px 30px; position: relative; }
    </style>
</head>
<body>
    <div class="container">
        <div class="confetti"></div>
        <div class="celebration-header">
            <div class="trophy-icon">🏆</div>
            <div class="congratulations-title">مبروك {{customer_name}}!</div>
            <div>{{achievement_title}}</div>
        </div>
        
        <div class="content">
            <p>{{achievement_description}}</p>
            <p>نفتخر بك في {{company_name}} 🌟</p>
        </div>
    </div>
</body>
</html>', 
'["achievement_title", "customer_name", "achievement_description", "company_name"]'::jsonb, true);