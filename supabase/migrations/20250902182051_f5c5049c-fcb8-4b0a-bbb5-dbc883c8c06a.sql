-- Fix infinite recursion completely by simplifying RLS

-- Disable RLS temporarily on users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies and functions
DROP POLICY IF EXISTS "admin_can_view_users" ON public.users;
DROP POLICY IF EXISTS "admin_can_manage_users" ON public.users;
DROP POLICY IF EXISTS "public_user_registration" ON public.users;
DROP FUNCTION IF EXISTS public.check_admin_access();

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create very simple policies that don't cause recursion
-- Allow all authenticated users to read
CREATE POLICY "users_select_policy" 
ON public.users 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow all users to insert (for registration)
CREATE POLICY "users_insert_policy" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

-- Allow updates only for the user's own record
CREATE POLICY "users_update_policy" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow delete only for the user's own record
CREATE POLICY "users_delete_policy" 
ON public.users 
FOR DELETE 
USING (auth.uid() = id);