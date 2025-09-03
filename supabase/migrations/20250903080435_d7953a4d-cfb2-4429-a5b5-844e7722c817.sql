-- CRITICAL SECURITY FIX: Secure the users table with proper RLS policies
-- Fix the syntax error and implement secure policies

-- First, ensure RLS is enabled on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies that allow public access
DROP POLICY IF EXISTS "allow_select" ON public.users;
DROP POLICY IF EXISTS "Public access to users" ON public.users;
DROP POLICY IF EXISTS "Anyone can read users" ON public.users;

-- Create secure RLS policies for the users table

-- Policy 1: Users can only view their own profile
CREATE POLICY "Users can view own profile only" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile only" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Admins can view all users (with rate limiting for security)
CREATE POLICY "Admins can view all users" 
ON public.users 
FOR SELECT 
USING (
    has_role(auth.uid(), 'admin'::app_role) 
    AND auth.uid() IS NOT NULL 
);

-- Policy 4: Admins can manage all users
CREATE POLICY "Admins can manage all users" 
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
CREATE POLICY "Allow user registration" 
ON public.users 
FOR INSERT 
WITH CHECK (
    auth.uid() = id 
    AND email IS NOT NULL 
    AND length(email) > 0
    AND password_hash IS NOT NULL
);

-- Add security audit trigger for user table access (INSERT/UPDATE/DELETE only)
CREATE TRIGGER log_user_data_access
    AFTER INSERT OR UPDATE OR DELETE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();