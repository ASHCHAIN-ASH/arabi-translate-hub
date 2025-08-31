-- تفعيل extension التشفير
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- إعادة إنشاء وظيفة التحقق من بيانات الإداري
CREATE OR REPLACE FUNCTION public.verify_admin_login(
    email_input TEXT,
    password_input TEXT
)
RETURNS JSON AS $$
DECLARE
    admin_record RECORD;
BEGIN
    -- البحث عن المستخدم
    SELECT * INTO admin_record
    FROM public.admin_credentials
    WHERE email = email_input AND is_active = true;
    
    -- التحقق من وجود المستخدم
    IF admin_record IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'المستخدم غير موجود'
        );
    END IF;
    
    -- التحقق من كلمة المرور
    IF admin_record.password_hash = crypt(password_input, admin_record.password_hash) THEN
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
            'message', 'كلمة المرور غير صحيحة'
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;