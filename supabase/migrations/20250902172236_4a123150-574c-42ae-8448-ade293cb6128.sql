-- حل المشكلة مع تصحيح أنواع البيانات

-- 1. حذف السياسات الموجودة
DROP POLICY IF EXISTS "users_view_own_data" ON public.users;
DROP POLICY IF EXISTS "users_update_own_data" ON public.users;

-- 2. إنشاء سياسة تسمح لجميع المستخدمين (anon و authenticated) بالتسجيل
CREATE POLICY "allow_registration_for_all" 
ON public.users 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 3. إنشاء سياسة للقراءة مع تصحيح أنواع البيانات
CREATE POLICY "users_can_read_own_data" 
ON public.users 
FOR SELECT 
TO authenticated
USING (email = auth.jwt()->>'email');

-- 4. إنشاء سياسة للتحديث مع تصحيح أنواع البيانات  
CREATE POLICY "users_can_update_own_data" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (email = auth.jwt()->>'email')
WITH CHECK (email = auth.jwt()->>'email');

-- 5. إضافة سياسة للمديرين
CREATE POLICY "admins_manage_all_users" 
ON public.users 
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'admin'
  )
);