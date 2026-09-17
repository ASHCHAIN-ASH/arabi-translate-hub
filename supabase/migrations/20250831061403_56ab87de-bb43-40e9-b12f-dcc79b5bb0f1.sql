-- إنشاء نظام مستخدمين كامل
-- إنشاء جدول المستخدمين الإداريين
CREATE TABLE IF NOT EXISTS public.admin_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- تفعيل RLS (سنضع سياسة مفتوحة لأول مرة)
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح بالوصول للإداريين (مؤقتة)
CREATE POLICY "Allow admin access" ON public.admin_credentials
    FOR ALL USING (true);

-- إدراج المستخدم الإداري
INSERT INTO public.admin_credentials (
    email,
    password_hash,
    full_name,
    role
) VALUES (
    'admin@fekrahedu.com',
    crypt('Ali@@#@@1409', gen_salt('bf')),
    'مدير النظام',
    'admin'
);

-- إنشاء function للتحقق من بيانات الإداري
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