-- حل بسيط ونهائي لمشكلة المستخدمين

-- 1. حذف السياسات المتضاربة
DROP POLICY IF EXISTS "Admin users can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can manage their own data" ON public.users;
DROP POLICY IF EXISTS "Secure: Admins manage all users" ON public.users;
DROP POLICY IF EXISTS "Secure: Admins view all users" ON public.users;
DROP POLICY IF EXISTS "Secure: Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Secure: Users update own profile only" ON public.users;
DROP POLICY IF EXISTS "Secure: Users view own profile only" ON public.users;

-- 2. إنشاء دالة آمنة للتحقق من المدير
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
    AND email = 'admin@fekrahedu.com'
  );
$$;

-- 3. سياسة واحدة شاملة للمدير
CREATE POLICY "Complete admin access to users" 
ON public.users 
FOR ALL 
USING (public.check_admin_access());

-- 4. سياسة للمستخدمين العاديين
CREATE POLICY "Users manage own profile" 
ON public.users 
FOR ALL 
USING (auth.uid() = id);

-- 5. سياسة التسجيل العامة
CREATE POLICY "Public registration" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- 6. تفعيل المستخدم الإداري
UPDATE public.admin_credentials 
SET 
  is_active = true,
  role = 'admin',
  updated_at = now()
WHERE email = 'admin@fekrahedu.com';

-- 7. تسجيل النجاح
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'final_users_fix',
  (SELECT id FROM admin_credentials WHERE email = 'admin@fekrahedu.com' LIMIT 1),
  'clean_simple_rls_solution',
  'medium',
  jsonb_build_object(
    'description', 'Final clean solution for users table access',
    'policies_created', 3,
    'admin_verified', true,
    'timestamp', now()
  )
);