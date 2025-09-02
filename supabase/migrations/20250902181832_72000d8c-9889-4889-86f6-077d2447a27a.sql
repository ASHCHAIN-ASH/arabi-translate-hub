-- Fix infinite recursion in users table RLS policies

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin view users" ON public.users;
DROP POLICY IF EXISTS "Admin manage users" ON public.users;
DROP POLICY IF EXISTS "Public can register" ON public.users;

-- Drop the problematic function
DROP FUNCTION IF EXISTS public.is_user_admin();

-- Create a simple function that doesn't cause recursion
-- Check admin status using admin_credentials table
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

-- Create safe RLS policies
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
USING (public.is_admin_user());

CREATE POLICY "Admins can manage all users" 
ON public.users 
FOR ALL 
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE POLICY "Allow user registration" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;