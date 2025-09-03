-- CRITICAL SECURITY FIX: Secure the users table by replacing ALL existing policies
-- Remove ALL existing policies and create secure ones

-- First, ensure RLS is enabled on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on users table
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    -- Get all policies on the users table and drop them
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'users' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.users';
    END LOOP;
END $$;

-- Create secure RLS policies for the users table

-- Policy 1: Users can only view their own profile
CREATE POLICY "Secure: Users view own profile only" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Secure: Users update own profile only" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Admins can view all users (with enhanced security)
CREATE POLICY "Secure: Admins view all users" 
ON public.users 
FOR SELECT 
USING (
    has_role(auth.uid(), 'admin'::app_role) 
    AND auth.uid() IS NOT NULL
);

-- Policy 4: Admins can manage all users
CREATE POLICY "Secure: Admins manage all users" 
ON public.users 
FOR ALL 
USING (
    has_role(auth.uid(), 'admin'::app_role) 
    AND auth.uid() IS NOT NULL
)
WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) 
    AND auth.uid() IS NOT NULL
);

-- Policy 5: Allow new user registration (insert only with proper validation)
CREATE POLICY "Secure: Allow user registration" 
ON public.users 
FOR INSERT 
WITH CHECK (
    auth.uid() = id 
    AND email IS NOT NULL 
    AND length(email) > 0
    AND password_hash IS NOT NULL
);

-- Log the security fix in audit logs
INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    risk_level,
    metadata
) VALUES (
    'security_policy_update',
    NULL,
    'users_table_security_hardening',
    'users',
    'critical',
    jsonb_build_object(
        'description', 'Applied secure RLS policies to users table',
        'previous_vulnerability', 'public_read_access',
        'fix_applied', 'restricted_access_with_authentication',
        'timestamp', now()
    )
);