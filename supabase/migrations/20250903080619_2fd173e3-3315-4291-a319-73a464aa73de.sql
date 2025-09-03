-- CRITICAL SECURITY FIX: Secure the users table with proper RLS policies
-- Remove any existing public access policies that allow unrestricted access

-- First, ensure RLS is enabled on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies
DROP POLICY IF EXISTS "allow_select" ON public.users;
DROP POLICY IF EXISTS "Public access to users" ON public.users;
DROP POLICY IF EXISTS "Anyone can read users" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;

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

-- Policy 3: Admins can view all users (with enhanced security)
CREATE POLICY "Admins can view all users securely" 
ON public.users 
FOR SELECT 
USING (
    has_role(auth.uid(), 'admin'::app_role) 
    AND auth.uid() IS NOT NULL
);

-- Policy 4: Admins can manage all users
CREATE POLICY "Admins can manage all users securely" 
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
CREATE POLICY "Allow secure user registration" 
ON public.users 
FOR INSERT 
WITH CHECK (
    auth.uid() = id 
    AND email IS NOT NULL 
    AND length(email) > 0
    AND password_hash IS NOT NULL
);

-- Add audit triggers for INSERT, UPDATE, DELETE operations only
CREATE TRIGGER log_user_data_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

-- Create rate limiting function to prevent abuse
CREATE OR REPLACE FUNCTION public.check_sensitive_operation_limit(
    user_id_param uuid,
    operation_type text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    operation_count integer;
BEGIN
    -- Check operations in the last hour
    SELECT COUNT(*)
    FROM public.security_audit_logs
    WHERE user_id = user_id_param
    AND action = operation_type
    AND created_at > NOW() - INTERVAL '1 hour'
    INTO operation_count;
    
    -- Allow max 50 operations per hour for admins
    RETURN operation_count < 50;
END;
$$;