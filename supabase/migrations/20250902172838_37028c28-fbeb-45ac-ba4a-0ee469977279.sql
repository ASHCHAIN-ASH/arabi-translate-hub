-- حل نهائي وجذري - إعادة ضبط RLS بالكامل

-- تعطيل RLS مؤقتاً
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- حذف جميع السياسات الموجودة
DROP POLICY IF EXISTS "allow_anon_registration" ON public.users;
DROP POLICY IF EXISTS "public_insert_users" ON public.users;
DROP POLICY IF EXISTS "read_own_user_data" ON public.users;
DROP POLICY IF EXISTS "update_own_user_data" ON public.users;

-- تفعيل RLS مرة أخرى
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات البسيطة والواضحة
-- 1. السماح بالتسجيل للجميع (بما في ذلك anon)
CREATE POLICY "enable_insert_for_all" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- 2. السماح للمستخدمين المصادق عليهم برؤية بياناتهم
CREATE POLICY "enable_read_for_users" 
ON public.users 
FOR SELECT 
TO authenticated
USING (email = auth.jwt()->>'email');

-- 3. السماح للمستخدمين بتحديث بياناتهم
CREATE POLICY "enable_update_for_users" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (email = auth.jwt()->>'email')
WITH CHECK (email = auth.jwt()->>'email');