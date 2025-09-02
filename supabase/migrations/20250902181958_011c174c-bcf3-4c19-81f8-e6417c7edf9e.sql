-- Fix infinite recursion by completely rebuilding RLS policies

-- Drop ALL existing policies from users table
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Admin view users" ON public.users;
DROP POLICY IF EXISTS "Admin manage users" ON public.users;
DROP POLICY IF EXISTS "Public can register" ON public.users;
DROP POLICY IF EXISTS "is_user_admin_policy" ON public.users;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.is_user_admin();
DROP FUNCTION IF EXISTS public.is_admin_user();

-- Create a security definer function that avoids recursion
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

-- Recreate simple policies
CREATE POLICY "admin_can_view_users" 
ON public.users 
FOR SELECT 
USING (public.check_admin_access());

CREATE POLICY "admin_can_manage_users" 
ON public.users 
FOR ALL 
USING (public.check_admin_access())
WITH CHECK (public.check_admin_access());

CREATE POLICY "public_user_registration" 
ON public.users 
FOR INSERT 
WITH CHECK (true);