-- إصلاح مشكلة الـ infinite recursion في admin_credentials وإضافة RLS للجداول المفقودة

-- إزالة جميع السياسات من admin_credentials التي تسبب infinite recursion
DROP POLICY IF EXISTS "Admin credentials: No public delete" ON public.admin_credentials;
DROP POLICY IF EXISTS "Admin credentials: No public insert" ON public.admin_credentials;
DROP POLICY IF EXISTS "Admin credentials: Only admins can update" ON public.admin_credentials;
DROP POLICY IF EXISTS "Admin credentials: Only admins can view" ON public.admin_credentials;
DROP POLICY IF EXISTS "Simple admin credentials access" ON public.admin_credentials;

-- إنشاء سياسات آمنة للـ admin_credentials بدون infinite recursion
-- السماح فقط للمستخدمين المصادق عليهم بالوصول إلى بياناتهم الخاصة
CREATE POLICY "Admin can access own credentials"
ON public.admin_credentials
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- منع الوصول العام للإدراج والحذف
CREATE POLICY "No public access to admin credentials"
ON public.admin_credentials
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- تفعيل RLS على جدول email_templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات لـ email_templates
CREATE POLICY "Authenticated users can read email templates"
ON public.email_templates
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only service role can manage email templates"
ON public.email_templates
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- منع الوصول العام لـ email_templates
CREATE POLICY "No public access to email templates"
ON public.email_templates
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- تأكد من أن جدول profiles له RLS مناسب
CREATE POLICY "Users can manage own profile" 
ON public.profiles
FOR ALL 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- سياسة عامة آمنة للملفات الشخصية
CREATE POLICY "No anon access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false)
WITH CHECK (false);