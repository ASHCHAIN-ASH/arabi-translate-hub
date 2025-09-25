-- إنشاء دالة security definer لفحص دور المستخدم الحالي
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- محاولة البحث في admin_credentials أولاً
  SELECT 'admin' INTO user_role
  FROM public.admin_credentials
  WHERE id = auth.uid() AND is_active = true AND role = 'admin'
  LIMIT 1;
  
  -- إذا لم يجد في admin_credentials، البحث في profiles
  IF user_role IS NULL THEN
    SELECT role INTO user_role 
    FROM public.profiles 
    WHERE user_id = auth.uid()
    LIMIT 1;
  END IF;
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- حذف السياسات المتضاربة
DROP POLICY IF EXISTS "prof_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "prof_update_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

-- إنشاء سياسات جديدة آمنة
CREATE POLICY "profiles_admin_access" ON public.profiles
FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager')
);

CREATE POLICY "profiles_own_access" ON public.profiles
FOR ALL USING (
  auth.uid() = user_id
);

-- سياسة للإدراج
CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT WITH CHECK (
  auth.uid() = user_id OR public.get_current_user_role() IN ('admin', 'manager')
);