-- حذف الدالة الموجودة أولاً
DROP FUNCTION IF EXISTS public.is_admin();

-- إنشاء دالة جديدة للتحقق من صلاحيات الإدارة
CREATE OR REPLACE FUNCTION public.check_admin_access()
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

-- إنشاء RLS policies جديدة مبسطة
CREATE POLICY "Admins can view all users" ON public.users
FOR SELECT USING (public.check_admin_access());

CREATE POLICY "Admins can manage all users" ON public.users
FOR ALL USING (public.check_admin_access())
WITH CHECK (public.check_admin_access());

-- السماح بالتسجيل الجديد
CREATE POLICY "Anyone can create users" ON public.users
FOR INSERT WITH CHECK (true);

-- تفعيل realtime
ALTER TABLE public.users REPLICA IDENTITY FULL;