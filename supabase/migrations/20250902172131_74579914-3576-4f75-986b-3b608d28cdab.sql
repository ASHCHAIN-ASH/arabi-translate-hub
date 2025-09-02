-- حل جذري لمشكلة التسجيل - إصلاح السياسات والأدوار

-- 1. حذف السياسة الحالية وإنشاء سياسة شاملة
DROP POLICY IF EXISTS "public_can_register" ON public.users;

-- 2. إنشاء سياسة تسمح لجميع المستخدمين (anon و authenticated) بالتسجيل
CREATE POLICY "allow_registration_for_all" 
ON public.users 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 3. إضافة سياسة للقراءة للمستخدمين غير المصادق عليهم إذا لزم الأمر للتحقق من البريد الإلكتروني
CREATE POLICY "allow_email_check_for_registration" 
ON public.users 
FOR SELECT 
TO anon, authenticated
USING (true);

-- 4. تحديث سياسة التحديث لتكون أكثر مرونة
DROP POLICY IF EXISTS "users_update_own_data" ON public.users;
CREATE POLICY "users_update_own_data" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (email = auth.jwt()->>'email' OR id = auth.uid()::text)
WITH CHECK (email = auth.jwt()->>'email' OR id = auth.uid()::text);

-- 5. إضافة سياسة للمديرين للوصول الكامل
CREATE POLICY "admins_full_access" 
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