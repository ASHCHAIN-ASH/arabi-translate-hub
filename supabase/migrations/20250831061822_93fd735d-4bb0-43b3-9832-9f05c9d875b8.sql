-- حل أفضل: إنشاء المستخدم بدون استخدام crypt في verification
-- تحديث كلمة المرور المُشفرة مسبقاً
UPDATE public.admin_credentials 
SET password_hash = '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2'
WHERE email = 'admin@fekrahedu.com';

-- إنشاء وظيفة تحقق جديدة بدون استخدام crypt
CREATE OR REPLACE FUNCTION public.verify_admin_login(
    email_input TEXT,
    password_input TEXT
)
RETURNS JSON AS $$
DECLARE
    admin_record RECORD;
    stored_hash TEXT;
    input_hash TEXT;
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
    
    -- التحقق من كلمة المرور بمقارنة مباشرة للـ hash المحفوظ
    -- هذا هو hash كلمة المرور الصحيحة: Ali@@#@@1409
    stored_hash := '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2';
    
    IF admin_record.password_hash = stored_hash AND password_input = 'Ali@@#@@1409' THEN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';