-- حل جذري نهائي لمشكلة إدارة المستخدمين

-- 1. حذف جميع السياسات الموجودة
DROP POLICY IF EXISTS "Admin users can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can manage their own data" ON public.users;
DROP POLICY IF EXISTS "Secure: Admins manage all users" ON public.users;
DROP POLICY IF EXISTS "Secure: Admins view all users" ON public.users;
DROP POLICY IF EXISTS "Secure: Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Secure: Users update own profile only" ON public.users;
DROP POLICY IF EXISTS "Secure: Users view own profile only" ON public.users;

-- 2. إنشاء دالة آمنة للتحقق من صلاحية الإدارة
CREATE OR REPLACE FUNCTION public.is_system_admin()
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

-- 3. إنشاء سياسات بسيطة وفعالة
CREATE POLICY "System admin full access" 
ON public.users 
FOR ALL 
USING (public.is_system_admin())
WITH CHECK (public.is_system_admin());

CREATE POLICY "Users own data access" 
ON public.users 
FOR ALL 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow public registration" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- 4. التأكد من وجود المستخدم الإداري
INSERT INTO public.admin_credentials (
  id, 
  email, 
  password_hash, 
  full_name, 
  role, 
  is_active
) VALUES (
  '4863727d-86ae-4a66-b52a-af3ee8001e48'::uuid,
  'admin@fekrahedu.com',
  '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2',
  'مدير النظام الرئيسي',
  'admin',
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  is_active = true,
  role = 'admin',
  updated_at = now();

-- 5. تحديث auth.users إذا لم يكن موجود
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  auth_provider,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  last_sign_in_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  confirmed_at,
  email_change_sent_at,
  recovery_sent_at,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '4863727d-86ae-4a66-b52a-af3ee8001e48'::uuid,
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@fekrahedu.com',
  '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2',
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  '',
  0,
  NULL,
  'email',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "مدير النظام الرئيسي", "is_admin": true}',
  false,
  now(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  now(),
  NULL,
  NULL,
  '',
  NULL,
  false,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now(),
  is_sso_user = false,
  deleted_at = NULL;

-- 6. تسجيل الحل الجذري
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'system_fix_complete',
  '4863727d-86ae-4a66-b52a-af3ee8001e48'::uuid,
  'comprehensive_users_system_repair',
  'critical',
  jsonb_build_object(
    'description', 'Complete overhaul of users management system',
    'changes_applied', array[
      'Removed all conflicting RLS policies',
      'Created secure admin check function',
      'Established clear access policies',
      'Ensured admin user exists in all tables',
      'Verified auth.users entry exists'
    ],
    'expected_result', 'Full admin access to users management',
    'timestamp', now()
  )
);