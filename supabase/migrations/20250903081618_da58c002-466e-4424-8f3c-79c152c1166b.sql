-- إضافة قالب بريد إلكتروني لإشعار تغيير كلمة المرور
INSERT INTO public.email_templates (
    template_key,
    subject_template,
    html_template,
    variables,
    is_active
) VALUES (
    'password_changed_notification',
    'تم تحديث كلمة المرور الخاصة بك - شركة علي صالح الشهري',
    '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم تحديث كلمة المرور</title>
    <style>
        body { font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .alert-box { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .info-box { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .password-box { background: #f8f9fa; border: 2px solid #28a745; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .password-text { font-size: 18px; font-weight: bold; color: #28a745; font-family: monospace; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        .btn { display: inline-block; padding: 12px 25px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px; }
        .security-info { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table th, .details-table td { padding: 10px; text-align: right; border-bottom: 1px solid #dee2e6; }
        .details-table th { background-color: #f8f9fa; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔒 تم تحديث كلمة المرور</h1>
            <p>شركة علي صالح الشهري للترجمة والخدمات</p>
        </div>
        
        <div class="content">
            <div class="alert-box">
                <strong>⚠️ إشعار أمني مهم:</strong> تم تحديث كلمة المرور الخاصة بحسابك بنجاح.
            </div>
            
            <p>عزيزي/عزيزتي <strong>{{user_name}}</strong>,</p>
            
            <p>نود إعلامك بأنه تم تحديث كلمة المرور الخاصة بحسابك (<strong>{{user_email}}</strong>) بنجاح من قبل الإدارة.</p>
            
            <div class="password-box">
                <h3>🔑 كلمة المرور الجديدة:</h3>
                <div class="password-text">{{new_password}}</div>
                <p style="color: #6c757d; font-size: 14px; margin-top: 10px;">يرجى حفظ كلمة المرور في مكان آمن</p>
            </div>
            
            <div class="info-box">
                <h4>📋 تفاصيل العملية:</h4>
                <table class="details-table">
                    <tr>
                        <th>التاريخ والوقت:</th>
                        <td>{{change_date}}</td>
                    </tr>
                    <tr>
                        <th>تم التحديث بواسطة:</th>
                        <td>{{admin_name}} ({{admin_email}})</td>
                    </tr>
                    <tr>
                        <th>نوع المدير:</th>
                        <td>{{admin_role}}</td>
                    </tr>
                </table>
            </div>
            
            <div class="security-info">
                <h4>🛡️ تعليمات الأمان:</h4>
                <ul>
                    <li>يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة فوراً</li>
                    <li>ننصح بتغيير كلمة المرور بعد تسجيل الدخول الأول</li>
                    <li>لا تشارك كلمة المرور مع أي شخص آخر</li>
                    <li>إذا لم تطلب هذا التغيير، يرجى التواصل معنا فوراً</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://masteredupath.com/login" class="btn">تسجيل الدخول الآن</a>
                <a href="https://masteredupath.com/contact" class="btn" style="background-color: #dc3545;">التواصل مع الدعم</a>
            </div>
            
            <p style="color: #6c757d; font-size: 14px;">
                <strong>ملاحظة:</strong> هذا البريد الإلكتروني تم إرساله تلقائياً لأغراض الأمان. يرجى عدم الرد على هذا البريد.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>شركة علي صالح الشهري للترجمة والخدمات</strong></p>
            <p>المملكة العربية السعودية - الرياض</p>
            <p>📧 admin@masteredupath.com | 📞 +966501234567</p>
            <p style="margin-top: 15px; font-size: 12px;">
                جميع الحقوق محفوظة © 2025 شركة علي صالح الشهري
            </p>
        </div>
    </div>
</body>
</html>',
    '[
        {
            "key": "user_name", 
            "description": "اسم المستخدم",
            "required": true
        },
        {
            "key": "user_email", 
            "description": "بريد المستخدم الإلكتروني",
            "required": true
        },
        {
            "key": "new_password", 
            "description": "كلمة المرور الجديدة",
            "required": true
        },
        {
            "key": "change_date", 
            "description": "تاريخ ووقت التغيير",
            "required": true
        },
        {
            "key": "admin_name", 
            "description": "اسم المدير الذي قام بالتغيير",
            "required": true
        },
        {
            "key": "admin_email", 
            "description": "بريد المدير الإلكتروني",
            "required": true
        },
        {
            "key": "admin_role", 
            "description": "دور المدير في النظام",
            "required": true
        }
    ]'::jsonb,
    true
) ON CONFLICT (template_key) DO UPDATE SET
    subject_template = EXCLUDED.subject_template,
    html_template = EXCLUDED.html_template,
    variables = EXCLUDED.variables,
    is_active = EXCLUDED.is_active,
    updated_at = now();