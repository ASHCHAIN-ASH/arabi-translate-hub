-- حذف جميع policies الموجودة للجدول users
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Anyone can create users" ON public.users;

-- إنشاء دالة بسيطة للتحقق من الإدارة
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = auth.uid() 
    AND is_active = true 
    AND role = 'admin'
  );
$$;

-- إنشاء policies جديدة
CREATE POLICY "Admin view users" ON public.users
FOR SELECT USING (public.is_user_admin());

CREATE POLICY "Admin manage users" ON public.users
FOR ALL USING (public.is_user_admin())
WITH CHECK (public.is_user_admin());

CREATE POLICY "Public can register" ON public.users
FOR INSERT WITH CHECK (true);