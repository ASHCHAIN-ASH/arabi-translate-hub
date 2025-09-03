-- حل جذري مبسط لمشكلة إدارة المستخدمين

-- 1. حذف جميع السياسات المتضاربة
DROP POLICY IF EXISTS "Admin users can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can manage their own data" ON public.users;
DROP POLICY IF EXISTS "Secure: Admins manage all users" ON public.users;
DROP POLICY IF EXISTS "Secure: Admins view all users" ON public.users;
DROP POLICY IF EXISTS "Secure: Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Secure: Users update own profile only" ON public.users;
DROP POLICY IF EXISTS "Secure: Users view own profile only" ON public.users;

-- 2. إنشاء دالة بسيطة للتحقق من الإدارة
CREATE OR REPLACE FUNCTION public.is_admin_user()
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

-- 3. سياسات بسيطة ومباشرة
CREATE POLICY "Admin full access" 
ON public.users 
FOR ALL 
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "User own access" 
ON public.users 
FOR ALL 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Registration allowed" 
ON public.users 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 4. تحديث المستخدم الإداري الموجود ليكون متوافق
UPDATE public.admin_credentials 
SET 
  is_active = true,
  role = 'admin',
  updated_at = now()
WHERE email = 'admin@masteredupath.com';

-- 5. التأكد من وجود المستخدم في auth.users
DO $$
DECLARE
    admin_id uuid;
BEGIN
    -- الحصول على ID المستخدم الإداري
    SELECT id INTO admin_id FROM public.admin_credentials 
    WHERE email = 'admin@masteredupath.com' AND is_active = true LIMIT 1;
    
    IF admin_id IS NOT NULL THEN
        -- التأكد من وجوده في auth.users
        INSERT INTO auth.users (
            id, instance_id, aud, role, email, encrypted_password,
            email_confirmed_at, created_at, updated_at, confirmed_at,
            raw_app_meta_data, raw_user_meta_data
        ) VALUES (
            admin_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'admin@masteredupath.com',
            '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2',
            now(), now(), now(), now(),
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "مدير النظام", "is_admin": true}'
        ) ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            updated_at = now(),
            deleted_at = NULL;
    END IF;
END $$;

-- 6. تسجيل الإصلاح
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'users_access_fixed',
  (SELECT id FROM admin_credentials WHERE email = 'admin@masteredupath.com' LIMIT 1),
  'simplified_rls_policies_for_users_table',
  'high',
  jsonb_build_object(
    'description', 'Fixed users table access with simplified RLS policies',
    'solution', 'Created clean admin check function and basic policies',
    'timestamp', now()
  )
);