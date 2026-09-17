-- تبسيط دالة verify_admin_login بدون تسجيل الأحداث
CREATE OR REPLACE FUNCTION public.verify_admin_login(
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
    is_password_valid BOOLEAN := false;
    expected_hash TEXT := '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2';
    expected_password TEXT := 'Ali@@#@@1409';
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
    WHERE email = trim(lower(email_input)) 
    AND is_active = true;
    
    -- التحقق من وجود المستخدم
    IF admin_record IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'بيانات تسجيل الدخول غير صحيحة'
        );
    END IF;
    
    -- التحقق من كلمة المرور والبريد الإلكتروني بدقة
    is_password_valid := (
        admin_record.password_hash = expected_hash 
        AND password_input = expected_password
        AND admin_record.email = 'admin@fekrahedu.com'
    );
    
    IF is_password_valid THEN
        -- تحديث آخر تسجيل دخول
        UPDATE public.admin_credentials
        SET updated_at = now()
        WHERE id = admin_record.id;
        
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