-- إصلاح سياسات RLS لتعمل مع النظام المخصص بدون auth.uid()
-- حذف السياسات الحالية
DROP POLICY IF EXISTS "ash_users_public_registration" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_own_access" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_admin_access" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_check_existence" ON public.ash_users;

-- سياسة بسيطة للسماح بجميع العمليات مؤقتاً للاختبار
-- في الإنتاج، يجب تطبيق نظام أمان مخصص
CREATE POLICY "ash_users_allow_all" ON public.ash_users
FOR ALL 
USING (true)
WITH CHECK (true);

-- إضافة سياسة أساسية للقراءة والكتابة
CREATE POLICY "ash_users_basic_access" ON public.ash_users
FOR ALL 
USING (true)
WITH CHECK (true);