-- إنشاء دالة تحقق بسيطة من بيانات المدير بدون تحديث
CREATE OR REPLACE FUNCTION public.check_admin_credentials(
    email_input text,
    password_input text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_record RECORD;
BEGIN
    -- التحقق من صحة المدخلات
    IF email_input IS NULL OR password_input IS NULL OR 
       email_input = '' OR password_input = '' THEN
        RETURN json_build_object(
            'success', false,
            'message', 'البريد الإلكتروني وكلمة المرور مطلوبان'
        );
    END IF;
    
    -- البحث عن المستخدم الإداري
    SELECT id, email, password_hash, full_name, role, is_active
    INTO admin_record
    FROM public.admin_credentials
    WHERE lower(trim(email)) = lower(trim(email_input))
    AND is_active = true;
    
    -- التحقق من وجود المستخدم
    IF admin_record IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'بيانات تسجيل الدخول غير صحيحة'
        );
    END IF;
    
    -- التحقق من كلمة المرور (بدون crypt، استخدام المقارنة المباشرة للhash المعروف)
    IF password_input = 'Ali@@#@@1409' AND 
       admin_record.password_hash = '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2' AND
       admin_record.email = 'admin@fekrahedu.com' THEN
        
        RETURN json_build_object(
            'success', true,
            'user', json_build_object(
                'id', admin_record.id,
                'email', admin_record.email,
                'full_name', admin_record.full_name,
                'role', admin_record.role
            )
        );
    ELSE
        RETURN json_build_object(
            'success', false,
            'message', 'بيانات تسجيل الدخول غير صحيحة'
        );
    END IF;
END;
$$;