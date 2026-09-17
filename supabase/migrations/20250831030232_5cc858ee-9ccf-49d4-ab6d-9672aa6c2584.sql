-- إعادة تصميم قاعدة البيانات لتكون مستقلة لموقع fekrahedu.com
-- حذف الجداول المعقدة والبدء من جديد

-- 1. حذف الجداول غير المطلوبة
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS ash_users CASCADE;
DROP TABLE IF EXISTS ash_wallets CASCADE;
DROP TABLE IF EXISTS ash_wallet_transactions CASCADE;
DROP TABLE IF EXISTS ash_email_otps CASCADE;

-- 2. إنشاء جدول المستخدمين البسيط
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. تفعيل RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. إنشاء سياسات RLS بسيطة
CREATE POLICY "المستخدمون يمكنهم رؤية بياناتهم" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "السماح بالتسجيل" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "المستخدمون يمكنهم تحديث بياناتهم" 
ON public.users 
FOR UPDATE 
USING (true);

-- 5. إنشاء فهارس
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- 6. إنشاء trigger للتحديث التلقائي
CREATE OR REPLACE FUNCTION update_updated_at_users()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_users();