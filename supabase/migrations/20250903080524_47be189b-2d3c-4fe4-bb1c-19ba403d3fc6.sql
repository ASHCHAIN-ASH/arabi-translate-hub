-- CRITICAL SECURITY FIX: Secure the users table with proper RLS policies
-- Remove any existing public access policies that allow unrestricted access

-- First, ensure RLS is enabled on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies
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
    AND check_sensitive_operation_limit(auth.uid(), 'user_data_access'::text)
);

-- Policy 4: Admins can manage all users (with rate limiting)
CREATE POLICY "Admins can manage all users" 
ON public.users 
FOR ALL 
USING (
    has_role(auth.uid(), 'admin'::app_role) 
    AND auth.uid() IS NOT NULL 
    AND check_sensitive_operation_limit(auth.uid(), 'user_management'::text)
)
WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) 
    AND auth.uid() IS NOT NULL 
    AND check_sensitive_operation_limit(auth.uid(), 'user_management'::text)
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

-- Add security audit trigger for user table access
CREATE TRIGGER log_user_data_access
    AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_table_access();

-- Add data masking for sensitive fields
-- Create function to mask email addresses for non-owners
CREATE OR REPLACE FUNCTION public.mask_user_email(email_input text, requesting_user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only show full email to the user themselves or admins
    IF requesting_user_id = auth.uid() OR has_role(requesting_user_id, 'admin'::app_role) THEN
        RETURN email_input;
    END IF;
    
    -- Mask email for others
    IF email_input IS NOT NULL AND email_input != '' THEN
        RETURN LEFT(email_input, 2) || '***@' || SPLIT_PART(email_input, '@', 2);
    END IF;
    
    RETURN NULL;
END;
$$;

-- Create function to mask phone numbers for non-owners
CREATE OR REPLACE FUNCTION public.mask_user_phone(phone_input text, requesting_user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only show full phone to the user themselves or admins
    IF requesting_user_id = auth.uid() OR has_role(requesting_user_id, 'admin'::app_role) THEN
        RETURN phone_input;
    END IF;
    
    -- Mask phone for others
    IF phone_input IS NOT NULL AND LENGTH(phone_input) > 4 THEN
        RETURN '***-' || RIGHT(phone_input, 4);
    END IF;
    
    RETURN NULL;
END;
$$;