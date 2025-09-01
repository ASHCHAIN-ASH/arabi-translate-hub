-- إصلاح دالة verify_admin_login لتكون آمنة
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
        -- تسجيل محاولة دخول فاشلة
        INSERT INTO public.security_audit_logs (
            event_type, action, risk_level, metadata
        ) VALUES (
            'failed_admin_login',
            'invalid_user_attempt',
            'high',
            jsonb_build_object(
                'email', email_input,
                'ip_address', inet_client_addr(),
                'timestamp', now()
            )
        );
        
        RETURN json_build_object(
            'success', false,
            'message', 'بيانات تسجيل الدخول غير صحيحة'
        );
    END IF;
    
    -- التحقق من كلمة المرور باستخدام crypt
    is_password_valid := (admin_record.password_hash = crypt(password_input, admin_record.password_hash));
    
    IF is_password_valid THEN
        -- تسجيل نجح
        INSERT INTO public.security_audit_logs (
            event_type, user_id, action, risk_level, metadata
        ) VALUES (
            'successful_admin_login',
            admin_record.id,
            'admin_login_success',
            'medium',
            jsonb_build_object(
                'email', admin_record.email,
                'ip_address', inet_client_addr(),
                'timestamp', now()
            )
        );
        
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
        -- تسجيل محاولة دخول فاشلة
        INSERT INTO public.security_audit_logs (
            event_type, user_id, action, risk_level, metadata
        ) VALUES (
            'failed_admin_login',
            admin_record.id,
            'wrong_password_attempt',
            'high',
            jsonb_build_object(
                'email', admin_record.email,
                'ip_address', inet_client_addr(),
                'timestamp', now()
            )
        );
        
        RETURN json_build_object(
            'success', false,
            'message', 'بيانات تسجيل الدخول غير صحيحة'
        );
    END IF;
END;
$$;