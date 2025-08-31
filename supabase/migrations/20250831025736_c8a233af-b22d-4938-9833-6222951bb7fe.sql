-- إصلاح سياسات RLS لجدول ash_users للسماح بالتسجيل
-- إزالة السياسات الحالية
DROP POLICY IF EXISTS "ash_users_admin_full_access" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_allow_public_registration" ON public.ash_users;
DROP POLICY IF EXISTS "ash_users_own_access" ON public.ash_users;

-- إنشاء سياسات جديدة محدثة
-- السماح بالتسجيل العام (INSERT) - مهم جداً للتسجيل
CREATE POLICY "ash_users_public_registration" ON public.ash_users
FOR INSERT 
WITH CHECK (true);

-- المستخدمون يمكنهم رؤية وتعديل بياناتهم الخاصة
CREATE POLICY "ash_users_own_access" ON public.ash_users
FOR ALL 
USING (id = auth.uid() OR auth.uid() IS NULL)
WITH CHECK (id = auth.uid() OR auth.uid() IS NULL);

-- الإدارة يمكنها الوصول الكامل
CREATE POLICY "ash_users_admin_access" ON public.ash_users
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.ash_users admin_user
    WHERE admin_user.id = auth.uid() 
    AND admin_user.role IN ('superadmin', 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ash_users admin_user
    WHERE admin_user.id = auth.uid() 
    AND admin_user.role IN ('superadmin', 'admin')
  )
);

-- إضافة سياسة للقراءة العامة للتحقق من وجود المستخدم أثناء التسجيل
CREATE POLICY "ash_users_check_existence" ON public.ash_users
FOR SELECT 
USING (true);