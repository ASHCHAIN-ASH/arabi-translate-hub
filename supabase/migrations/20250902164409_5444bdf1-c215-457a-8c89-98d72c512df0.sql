-- إنشاء جدول المستخدمين مع RLS
CREATE TABLE IF NOT EXISTS public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- سياسات الوصول
CREATE POLICY "المستخدمون يمكنهم مشاهدة بياناتهم فقط" 
ON public.users 
FOR SELECT 
USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = auth.uid() AND is_active = true
));

CREATE POLICY "يمكن للجميع إنشاء حساب جديد" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "المستخدمون يمكنهم تحديث بياناتهم فقط" 
ON public.users 
FOR UPDATE 
USING (auth.uid()::text = id::text OR EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = auth.uid() AND is_active = true
));

-- إنشاء فهرس للبريد الإلكتروني
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- إنشاء trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();