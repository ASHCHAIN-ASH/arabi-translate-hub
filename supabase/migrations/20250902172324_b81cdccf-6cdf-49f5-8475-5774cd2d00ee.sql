-- حذف جميع السياسات الموجودة أولاً
DROP POLICY IF EXISTS "allow_registration_for_all" ON public.users;
DROP POLICY IF EXISTS "allow_email_check_for_registration" ON public.users;
DROP POLICY IF EXISTS "users_can_read_own_data" ON public.users;
DROP POLICY IF EXISTS "users_can_update_own_data" ON public.users;
DROP POLICY IF EXISTS "admins_manage_all_users" ON public.users;
DROP POLICY IF EXISTS "admins_full_access" ON public.users;

-- إنشاء السياسات الصحيحة من جديد
-- 1. السماح بالتسجيل للجميع
CREATE POLICY "registration_allowed" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- 2. المستخدمون يمكنهم قراءة بياناتهم فقط
CREATE POLICY "read_own_user_data" 
ON public.users 
FOR SELECT 
TO authenticated
USING (email = auth.jwt()->>'email');

-- 3. المستخدمون يمكنهم تحديث بياناتهم فقط
CREATE POLICY "update_own_user_data" 
ON public.users 
FOR UPDATE 
TO authenticated
USING (email = auth.jwt()->>'email')
WITH CHECK (email = auth.jwt()->>'email');