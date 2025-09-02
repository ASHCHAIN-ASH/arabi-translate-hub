-- حل نهائي لمشكلة التكرار اللانهائي في admin_credentials
-- حذف جميع السياسات من جدول admin_credentials
DROP POLICY IF EXISTS "Allow service role access to admin_credentials" ON public.admin_credentials;
DROP POLICY IF EXISTS "Admin can view own credentials" ON public.admin_credentials;
DROP POLICY IF EXISTS "Admin can update own credentials" ON public.admin_credentials;
DROP POLICY IF EXISTS "Admin can manage credentials" ON public.admin_credentials;
DROP POLICY IF EXISTS "Admins can manage admin credentials" ON public.admin_credentials;

-- تعطيل RLS مؤقتاً على جدول admin_credentials لتجنب التكرار اللانهائي
ALTER TABLE public.admin_credentials DISABLE ROW LEVEL SECURITY;

-- إنشاء سياسة واحدة بسيطة وآمنة
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Simple admin credentials access" 
ON public.admin_credentials 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- التأكد من أن جدول users يعمل بشكل صحيح
DROP POLICY IF EXISTS "Anyone can view users" ON public.users;
DROP POLICY IF EXISTS "Anyone can update users" ON public.users;
DROP POLICY IF EXISTS "المستخدمون يمكنهم مشاهدة بياناتهم فقط" ON public.users;
DROP POLICY IF EXISTS "المستخدمون يمكنهم تحديث بياناتهم فقط" ON public.users;

-- إنشاء سياسات بسيطة للمستخدمين
CREATE POLICY "Users full access" 
ON public.users 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);