-- إدراج قوالب بريد إلكتروني جاهزة واحترافية
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
ARRAY['company_name', 'customer_name', 'customer_email', 'dashboard_url'], true),

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
        .invoice-number { font-size: 18px; opacity: 0.9; }
        .company-info { text-align: right; }
        .customer-section { padding: 30px; background: #f8f9ff; animation: fadeInUp 0.8s ease-out 0.2s both; }
        .invoice-details { padding: 30px; animation: fadeInUp 0.8s ease-out 0.4s both; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        .detail-box { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 15px; text-align: center; transition: transform 0.3s ease; }
        .detail-box:hover { transform: scale(1.05); }
        .detail-value { font-size: 28px; font-weight: 700; margin-bottom: 5px; }
        .detail-label { font-size: 14px; opacity: 0.9; }
        .total-section { background: linear-gradient(135deg, #11998e, #38ef7d); color: white; padding: 25px; border-radius: 15px; text-align: center; margin: 20px 0; }
        .total-amount { font-size: 42px; font-weight: 700; margin-bottom: 5px; }
        .footer { background: #2c3e50; color: white; padding: 25px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div class="invoice-title">فاتورة</div>
                    <div class="invoice-number">رقم: {{invoice_number}}</div>
                </div>
                <div class="company-info">
                    <h2>{{company_name}}</h2>
                    <p>{{company_address}}</p>
                </div>
            </div>
        </div>
        
        <div class="customer-section">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">فاتورة إلى:</h3>
            <div style="font-size: 16px; color: #666;">
                <strong>{{customer_name}}</strong><br>
                {{customer_email}}<br>
                {{customer_phone}}
            </div>
        </div>

        <div class="invoice-details">
            <div class="details-grid">
                <div class="detail-box">
                    <div class="detail-value">{{invoice_date}}</div>
                    <div class="detail-label">تاريخ الفاتورة</div>
                </div>
                <div class="detail-box">
                    <div class="detail-value">{{due_date}}</div>
                    <div class="detail-label">تاريخ الاستحقاق</div>
                </div>
            </div>

            <div style="background: white; border: 1px solid #eee; border-radius: 10px; overflow: hidden; margin: 20px 0;">
                <div style="background: #f8f9fa; padding: 15px; border-bottom: 1px solid #eee;">
                    <strong>تفاصيل الخدمة: {{service_name}}</strong>
                </div>
                <div style="padding: 20px;">
                    <p>{{service_description}}</p>
                </div>
            </div>

            <div class="total-section">
                <div class="total-amount">{{total_amount}} {{currency}}</div>
                <div>المبلغ الإجمالي</div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="{{payment_url}}" style="display: inline-block; background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);">
                    ادفع الآن
                </a>
            </div>
        </div>

        <div class="footer">
            <p>شكراً لثقتك في {{company_name}}</p>
            <p style="margin: 10px 0;">للاستفسارات: {{support_email}} | {{support_phone}}</p>
        </div>
    </div>
</body>
</html>', 
ARRAY['invoice_number', 'company_name', 'company_address', 'customer_name', 'customer_email', 'customer_phone', 'invoice_date', 'due_date', 'service_name', 'service_description', 'total_amount', 'currency', 'payment_url', 'support_email', 'support_phone'], true),

-- قالب تذكير تفاعلي
('reminder_interactive', 'تذكير مهم: {{reminder_title}}', 
'<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @keyframes bounce { 0%, 20%, 60%, 100% { transform: translateY(0); } 40% { transform: translateY(-20px); } 80% { transform: translateY(-10px); } }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.5); } 50% { box-shadow: 0 0 30px rgba(255, 193, 7, 0.8); } }
        .container { max-width: 600px; margin: 0 auto; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; }
        .reminder-header { background: linear-gradient(135deg, #ffc107, #ff8f00); color: white; padding: 40px 20px; text-align: center; position: relative; overflow: hidden; }
        .reminder-icon { font-size: 60px; animation: bounce 2s infinite; margin-bottom: 20px; }
        .reminder-title { font-size: 32px; font-weight: 700; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .urgency-badge { display: inline-block; background: #dc3545; color: white; padding: 8px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; animation: glow 2s infinite; margin-top: 10px; }
        .content { background: white; padding: 40px 30px; }
        .reminder-message { font-size: 18px; color: #333; line-height: 1.6; margin-bottom: 30px; text-align: center; }
        .countdown-section { background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 30px; border-radius: 20px; text-align: center; margin: 30px 0; }
        .countdown-title { font-size: 20px; margin-bottom: 20px; }
        .countdown-timer { display: flex; justify-content: center; gap: 20px; }
        .time-unit { background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; min-width: 60px; }
        .time-number { font-size: 28px; font-weight: 700; display: block; }
        .time-label { font-size: 12px; opacity: 0.8; }
        .action-buttons { display: flex; gap: 15px; justify-content: center; margin: 30px 0; }
        .btn-primary { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3); }
        .btn-secondary { background: linear-gradient(135deg, #6c757d, #495057); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: 600; transition: all 0.3s ease; }
        .btn-primary:hover, .btn-secondary:hover { transform: translateY(-3px); }
        .progress-bar { background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden; margin: 20px 0; }
        .progress-fill { background: linear-gradient(90deg, #ff6b6b, #feca57); height: 100%; width: {{progress_percentage}}%; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="container">
        <div class="reminder-header">
            <div class="reminder-icon">⏰</div>
            <div class="reminder-title">{{reminder_title}}</div>
            <div class="urgency-badge">{{urgency_level}}</div>
        </div>
        
        <div class="content">
            <div class="reminder-message">{{reminder_message}}</div>
            
            <div class="countdown-section">
                <div class="countdown-title">الوقت المتبقي</div>
                <div class="countdown-timer">
                    <div class="time-unit">
                        <span class="time-number">{{days_left}}</span>
                        <span class="time-label">يوم</span>
                    </div>
                    <div class="time-unit">
                        <span class="time-number">{{hours_left}}</span>
                        <span class="time-label">ساعة</span>
                    </div>
                    <div class="time-unit">
                        <span class="time-number">{{minutes_left}}</span>
                        <span class="time-label">دقيقة</span>
                    </div>
                </div>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 15px; margin: 20px 0;">
                <h4 style="color: #495057; margin-bottom: 15px;">تقدم المهمة</h4>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <p style="color: #6c757d; font-size: 14px; margin-top: 10px;">مكتمل {{progress_percentage}}%</p>
            </div>

            <div class="action-buttons">
                <a href="{{action_url}}" class="btn-primary">تنفيذ الآن</a>
                <a href="{{snooze_url}}" class="btn-secondary">تأجيل</a>
            </div>

            <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px; border-radius: 15px; text-align: center; margin-top: 30px;">
                <p style="margin: 0; font-size: 16px;">💡 <strong>نصيحة:</strong> {{helpful_tip}}</p>
            </div>
        </div>

        <div style="background: #2c3e50; color: white; padding: 25px; text-align: center;">
            <p>هذا تذكير من {{company_name}}</p>
            <p style="font-size: 14px; opacity: 0.8;">للمساعدة اتصل بنا: {{support_contact}}</p>
        </div>
    </div>
</body>
</html>', 
ARRAY['reminder_title', 'urgency_level', 'reminder_message', 'days_left', 'hours_left', 'minutes_left', 'progress_percentage', 'action_url', 'snooze_url', 'helpful_tip', 'company_name', 'support_contact'], true),

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
        @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes textGlow { 0%, 100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); } 50% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6); } }
        .container { max-width: 650px; margin: 0 auto; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; position: relative; overflow: hidden; }
        .confetti { position: absolute; width: 10px; height: 10px; background: #ff6b6b; animation: confetti 3s linear infinite; }
        .confetti:nth-child(2) { left: 20%; animation-delay: 0.2s; background: #4ecdc4; }
        .confetti:nth-child(3) { left: 40%; animation-delay: 0.4s; background: #45b7d1; }
        .confetti:nth-child(4) { left: 60%; animation-delay: 0.6s; background: #f9ca24; }
        .confetti:nth-child(5) { left: 80%; animation-delay: 0.8s; background: #6c5ce7; }
        .celebration-header { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); padding: 50px 20px; text-align: center; position: relative; }
        .trophy-icon { font-size: 80px; animation: celebration 2s ease-in-out infinite; margin-bottom: 20px; }
        .congratulations-title { font-size: 42px; font-weight: 700; color: #fff; margin-bottom: 15px; animation: textGlow 2s ease-in-out infinite; }
        .achievement-badge { display: inline-block; background: linear-gradient(135deg, #ffd700, #ffb347); color: #333; padding: 10px 25px; border-radius: 30px; font-weight: 600; font-size: 18px; margin: 10px 0; box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4); animation: celebration 3s ease-in-out infinite; }
        .sparkles { position: absolute; width: 100%; height: 100%; pointer-events: none; }
        .sparkle { position: absolute; width: 6px; height: 6px; background: #ffd700; animation: sparkle 1.5s ease-in-out infinite; }
        .sparkle:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
        .sparkle:nth-child(2) { top: 30%; right: 15%; animation-delay: 0.3s; }
        .sparkle:nth-child(3) { bottom: 40%; left: 20%; animation-delay: 0.6s; }
        .sparkle:nth-child(4) { bottom: 20%; right: 25%; animation-delay: 0.9s; }
        .content { background: white; padding: 40px 30px; position: relative; }
        .achievement-details { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 20px; text-align: center; margin: 30px 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: linear-gradient(135deg, #11998e, #38ef7d); color: white; padding: 25px; border-radius: 15px; text-align: center; transition: transform 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px) scale(1.05); }
        .stat-number { font-size: 36px; font-weight: 700; margin-bottom: 10px; animation: celebration 2s ease-in-out infinite; }
        .stat-label { font-size: 14px; opacity: 0.9; }
        .celebration-message { font-size: 18px; color: #333; line-height: 1.6; text-align: center; margin: 30px 0; }
        .reward-section { background: linear-gradient(135deg, #ff9a9e, #fecfef); color: white; padding: 25px; border-radius: 20px; text-align: center; margin: 30px 0; }
        .share-buttons { display: flex; justify-content: center; gap: 15px; margin: 30px 0; }
        .share-btn { display: inline-block; padding: 12px 25px; border-radius: 50px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; }
        .share-linkedin { background: #0077b5; color: white; }
        .share-twitter { background: #1da1f2; color: white; }
        .share-facebook { background: #4267b2; color: white; }
        .share-btn:hover { transform: translateY(-3px); }
    </style>
</head>
<body>
    <div class="container">
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        <div class="confetti"></div>
        
        <div class="celebration-header">
            <div class="sparkles">
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
                <div class="sparkle"></div>
            </div>
            <div class="trophy-icon">🏆</div>
            <div class="congratulations-title">مبروك!</div>
            <div class="achievement-badge">{{achievement_title}}</div>
        </div>
        
        <div class="content">
            <div class="celebration-message">
                عزيزي {{customer_name}}،<br><br>
                نهنئك بحرارة على هذا الإنجاز المميز! {{achievement_description}} 
                إنجازك هذا يعكس تفانيك والتزامك المثالي.
            </div>

            <div class="achievement-details">
                <h3 style="margin-bottom: 20px; font-size: 24px;">تفاصيل الإنجاز</h3>
                <p style="font-size: 16px; line-height: 1.6; margin: 0;">{{achievement_details}}</p>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">{{total_points}}</div>
                    <div class="stat-label">إجمالي النقاط</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{level_reached}}</div>
                    <div class="stat-label">المستوى المحقق</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{completion_rate}}%</div>
                    <div class="stat-label">نسبة الإنجاز</div>
                </div>
            </div>

            <div class="reward-section">
                <h3 style="margin-bottom: 15px;">🎁 مكافأتك الخاصة</h3>
                <p style="font-size: 18px; margin-bottom: 20px;">{{reward_description}}</p>
                <a href="{{claim_reward_url}}" style="display: inline-block; background: white; color: #ff9a9e; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease;">
                    احصل على مكافأتك
                </a>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <h4 style="color: #333; margin-bottom: 20px;">شارك إنجازك مع الأصدقاء</h4>
                <div class="share-buttons">
                    <a href="{{linkedin_share_url}}" class="share-btn share-linkedin">LinkedIn</a>
                    <a href="{{twitter_share_url}}" class="share-btn share-twitter">Twitter</a>
                    <a href="{{facebook_share_url}}" class="share-btn share-facebook">Facebook</a>
                </div>
            </div>
        </div>

        <div style="background: #2c3e50; color: white; padding: 30px; text-align: center;">
            <p style="font-size: 18px; margin-bottom: 10px;">نفتخر بك في {{company_name}} 🌟</p>
            <p style="font-size: 14px; opacity: 0.8;">استمر في التميز، المزيد من النجاحات في انتظارك!</p>
        </div>
    </div>
</body>
</html>', 
ARRAY['achievement_title', 'customer_name', 'achievement_description', 'achievement_details', 'total_points', 'level_reached', 'completion_rate', 'reward_description', 'claim_reward_url', 'linkedin_share_url', 'twitter_share_url', 'facebook_share_url', 'company_name'], true),

-- قالب إشعار حالة الطلب المتقدم
('order_status_premium', 'تحديث حالة طلبك رقم {{order_number}}', 
'<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @keyframes progressPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes statusBadgeGlow { 0%, 100% { box-shadow: 0 0 20px rgba(40, 167, 69, 0.5); } 50% { box-shadow: 0 0 30px rgba(40, 167, 69, 0.8); } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .container { max-width: 700px; margin: 0 auto; font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background: white; box-shadow: 0 0 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; position: relative; }
        .order-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .order-number { font-size: 28px; font-weight: 700; }
        .status-badge { background: #28a745; padding: 10px 20px; border-radius: 25px; font-weight: 600; animation: statusBadgeGlow 2s infinite; }
        .timeline-section { padding: 40px 30px; background: #f8f9ff; }
        .timeline { position: relative; }
        .timeline::before { content: ""; position: absolute; left: 30px; top: 0; bottom: 0; width: 2px; background: #dee2e6; }
        .timeline-item { position: relative; padding-left: 70px; margin-bottom: 30px; animation: slideInRight 0.6s ease-out; }
        .timeline-item:nth-child(2) { animation-delay: 0.2s; }
        .timeline-item:nth-child(3) { animation-delay: 0.4s; }
        .timeline-item:nth-child(4) { animation-delay: 0.6s; }
        .timeline-icon { position: absolute; left: 0; top: 0; width: 60px; height: 60px; background: linear-gradient(135deg, #11998e, #38ef7d); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; font-weight: 600; }
        .timeline-icon.completed { background: linear-gradient(135deg, #28a745, #20c997); }
        .timeline-icon.current { background: linear-gradient(135deg, #ffc107, #fd7e14); animation: progressPulse 2s infinite; }
        .timeline-icon.pending { background: #6c757d; }
        .timeline-content { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .timeline-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 10px; }
        .timeline-description { color: #666; font-size: 14px; line-height: 1.5; }
        .timeline-date { color: #28a745; font-weight: 600; font-size: 12px; margin-top: 8px; }
        .progress-section { padding: 30px; background: white; }
        .progress-header { text-align: center; margin-bottom: 30px; }
        .progress-title { font-size: 24px; color: #333; margin-bottom: 10px; }
        .progress-subtitle { color: #666; }
        .progress-bar-container { background: #e9ecef; height: 12px; border-radius: 6px; overflow: hidden; margin: 20px 0; }
        .progress-bar { background: linear-gradient(90deg, #28a745, #20c997); height: 100%; width: {{progress_percentage}}%; transition: width 1s ease-in-out; border-radius: 6px; position: relative; }
        .progress-bar::after { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: shine 2s infinite; }
        @keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .progress-percentage { text-align: center; font-size: 20px; font-weight: 700; color: #28a745; margin-top: 10px; }
        .estimated-delivery { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 25px; border-radius: 15px; text-align: center; margin: 20px 0; }
        .delivery-icon { font-size: 40px; margin-bottom: 15px; }
        .delivery-date { font-size: 24px; font-weight: 700; margin-bottom: 5px; }
        .delivery-label { font-size: 14px; opacity: 0.9; }
        .contact-section { background: #f8f9fa; padding: 25px; text-align: center; }
        .contact-buttons { display: flex; justify-content: center; gap: 15px; margin-top: 20px; }
        .contact-btn { display: inline-block; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; }
        .btn-primary { background: linear-gradient(135deg, #007bff, #0056b3); color: white; }
        .btn-success { background: linear-gradient(135deg, #28a745, #1e7e34); color: white; }
        .contact-btn:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="order-info">
                <div>
                    <div style="font-size: 16px; opacity: 0.9; margin-bottom: 5px;">طلب رقم</div>
                    <div class="order-number">{{order_number}}</div>
                </div>
                <div class="status-badge">{{current_status}}</div>
            </div>
            <div style="font-size: 16px; opacity: 0.9;">مرحباً {{customer_name}}، إليك آخر تحديثات طلبك</div>
        </div>

        <div class="timeline-section">
            <h3 style="text-align: center; color: #333; margin-bottom: 30px;">مراحل تنفيذ طلبك</h3>
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-icon completed">✓</div>
                    <div class="timeline-content">
                        <div class="timeline-title">تم استلام الطلب</div>
                        <div class="timeline-description">تم استلام طلبك بنجاح وبدء المراجعة الأولية</div>
                        <div class="timeline-date">{{order_date}}</div>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon completed">⚡</div>
                    <div class="timeline-content">
                        <div class="timeline-title">جاري التنفيذ</div>
                        <div class="timeline-description">فريق العمل يعمل على تنفيذ طلبك بعناية فائقة</div>
                        <div class="timeline-date">{{processing_date}}</div>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon current">🔄</div>
                    <div class="timeline-content">
                        <div class="timeline-title">المراجعة النهائية</div>
                        <div class="timeline-description">جاري المراجعة النهائية لضمان أعلى معايير الجودة</div>
                        <div class="timeline-date">قيد التنفيذ</div>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon pending">📦</div>
                    <div class="timeline-content">
                        <div class="timeline-title">التسليم</div>
                        <div class="timeline-description">سيتم تسليم طلبك في الموعد المحدد</div>
                        <div class="timeline-date">قريباً</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="progress-section">
            <div class="progress-header">
                <div class="progress-title">تقدم المشروع</div>
                <div class="progress-subtitle">{{progress_description}}</div>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar"></div>
            </div>
            <div class="progress-percentage">{{progress_percentage}}% مكتمل</div>

            <div class="estimated-delivery">
                <div class="delivery-icon">🚀</div>
                <div class="delivery-date">{{estimated_delivery_date}}</div>
                <div class="delivery-label">التاريخ المتوقع للتسليم</div>
            </div>
        </div>

        <div class="contact-section">
            <h4 style="color: #333; margin-bottom: 15px;">هل تحتاج للمساعدة؟</h4>
            <p style="color: #666; margin-bottom: 20px;">فريق الدعم متاح لمساعدتك في أي وقت</p>
            <div class="contact-buttons">
                <a href="{{support_chat_url}}" class="contact-btn btn-primary">💬 دردشة فورية</a>
                <a href="tel:{{support_phone}}" class="contact-btn btn-success">📞 اتصل بنا</a>
            </div>
        </div>

        <div style="background: #2c3e50; color: white; padding: 25px; text-align: center;">
            <p style="margin-bottom: 10px;">شكراً لثقتك في {{company_name}}</p>
            <p style="font-size: 14px; opacity: 0.8;">نعمل بجد لتقديم أفضل خدمة لك</p>
        </div>
    </div>
</body>
</html>', 
ARRAY['order_number', 'current_status', 'customer_name', 'order_date', 'processing_date', 'progress_percentage', 'progress_description', 'estimated_delivery_date', 'support_chat_url', 'support_phone', 'company_name'], true);