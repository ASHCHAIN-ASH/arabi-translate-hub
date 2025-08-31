-- إنشاء حساب إداري مؤقت في user_profiles فقط
-- سنستخدم هذا للتوثيق عبر النظام الخاص

-- إنشاء جدول للمستخدمين الإداريين المؤقت
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

-- تفعيل RLS
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- سياسة للإداريين فقط
CREATE POLICY "Admins can manage admin credentials" ON public.admin_credentials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- إدراج المستخدم الإداري
INSERT INTO public.admin_credentials (
    email,
    password_hash,
    full_name,
    role
) VALUES (
    'admin@masteredupath.com',
    crypt('Ali@@#@@1409', gen_salt('bf')),
    'مدير النظام',
    'admin'
);