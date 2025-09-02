-- أولاً احذف RLS policies المعقدة التي تسبب infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "System can insert users" ON public.users;

-- إنشاء دالة آمنة للتحقق من الأدوار
CREATE OR REPLACE FUNCTION public.is_admin()
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

-- إنشاء RLS policies مبسطة
CREATE POLICY "Admins can view all users" ON public.users
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage all users" ON public.users
FOR ALL USING (public.is_admin())
WITH CHECK (public.is_admin());

-- السماح لأي شخص بإدخال مستخدمين جدد (للتسجيل)
CREATE POLICY "Anyone can create users" ON public.users
FOR INSERT WITH CHECK (true);

-- تفعيل realtime للجدول
ALTER TABLE public.users REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;