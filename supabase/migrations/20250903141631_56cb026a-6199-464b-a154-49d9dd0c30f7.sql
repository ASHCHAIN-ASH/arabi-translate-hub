-- Security Fix 1: Replace hardcoded admin credentials with secure random password
-- Generate new secure admin password and update admin_credentials

-- First, let's create a function to generate secure random passwords
CREATE OR REPLACE FUNCTION public.generate_secure_admin_password()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_password TEXT;
  salt TEXT;
  hash TEXT;
BEGIN
  -- Generate a cryptographically secure random password (20 chars with mixed case, numbers, symbols)
  new_password := encode(gen_random_bytes(15), 'base64');
  -- Ensure it meets complexity requirements by adding required character types
  new_password := 'Admin#' || new_password || '2024!';
  
  -- Generate salt and hash
  salt := encode(gen_random_bytes(32), 'hex');
  hash := crypt(new_password || salt, gen_salt('bf', 12));
  
  -- Update the admin credentials with new secure password
  UPDATE public.admin_credentials 
  SET 
    password_hash = hash,
    salt = encrypt_sensitive_admin_data(salt),
    updated_at = now(),
    is_active = true
  WHERE email = 'admin@masteredupath.com';
  
  -- Log the password change
  INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    risk_level,
    metadata
  ) VALUES (
    'admin_password_reset',
    (SELECT id FROM admin_credentials WHERE email = 'admin@masteredupath.com'),
    'secure_password_generated',
    'high',
    jsonb_build_object(
      'description', 'Generated new secure admin password',
      'password_strength', 'high',
      'timestamp', now()
    )
  );
  
  RETURN new_password;
END;
$$;

-- Update the verify_admin_login function to use the new secure password system
CREATE OR REPLACE FUNCTION public.verify_admin_login(email_input text, password_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    admin_record RECORD;
    decrypted_salt TEXT;
BEGIN
    -- Input validation
    IF email_input IS NULL OR password_input IS NULL OR 
       email_input = '' OR password_input = '' THEN
        RETURN json_build_object(
            'success', false,
            'message', 'البريد الإلكتروني وكلمة المرور مطلوبان'
        );
    END IF;
    
    -- Get admin record
    SELECT id, email, password_hash, salt, full_name, role, is_active
    INTO admin_record
    FROM public.admin_credentials
    WHERE email = trim(lower(email_input)) 
    AND is_active = true;
    
    -- Check if admin exists
    IF admin_record IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'بيانات تسجيل الدخول غير صحيحة'
        );
    END IF;
    
    -- Decrypt salt and verify password
    decrypted_salt := decrypt_sensitive_admin_data(admin_record.salt);
    
    IF decrypted_salt IS NOT NULL AND 
       admin_record.password_hash = crypt(password_input || decrypted_salt, admin_record.password_hash) THEN
        
        -- Update last login
        UPDATE public.admin_credentials
        SET updated_at = now()
        WHERE id = admin_record.id;
        
        -- Log successful login
        INSERT INTO public.security_audit_logs (
          event_type,
          user_id,
          action,
          risk_level,
          metadata
        ) VALUES (
          'admin_login_success',
          admin_record.id,
          'secure_login_verified',
          'medium',
          jsonb_build_object(
            'email', admin_record.email,
            'timestamp', now()
          )
        );
        
        RETURN json_build_object(
            'success', true,
            'user', json_build_object(
                'id', admin_record.id,
                'email', admin_record.email,
                'full_name', admin_record.full_name,
                'role', admin_record.role
            )
        );
    ELSE
        -- Log failed login attempt
        INSERT INTO public.security_audit_logs (
          event_type,
          user_id,
          action,
          risk_level,
          metadata
        ) VALUES (
          'admin_login_failed',
          admin_record.id,
          'invalid_password_attempt',
          'high',
          jsonb_build_object(
            'email', email_input,
            'timestamp', now()
          )
        );
        
        RETURN json_build_object(
            'success', false,
            'message', 'بيانات تسجيل الدخول غير صحيحة'
        );
    END IF;
END;
$$;

-- Security Fix 2: Add search_path to all functions flagged by linter
-- Update functions to prevent search path injection attacks

CREATE OR REPLACE FUNCTION public.mask_customer_email(email_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN email_input;
  END IF;
  
  IF email_input IS NOT NULL AND email_input != '' THEN
    RETURN LEFT(email_input, 2) || '***@' || SPLIT_PART(email_input, '@', 2);
  END IF;
  
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_customer_phone(phone_input text, user_requesting uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(user_requesting, 'admin'::app_role) THEN
    RETURN phone_input;
  END IF;
  
  IF phone_input IS NOT NULL AND LENGTH(phone_input) > 4 THEN
    RETURN '***-' || RIGHT(phone_input, 4);
  END IF;
  
  RETURN NULL;
END;
$$;

-- Security Fix 3: Create session management table for secure authentication
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id uuid NOT NULL,
  session_token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  ip_address inet,
  user_agent text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on sessions table
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin sessions
CREATE POLICY "Admins can manage their own sessions"
ON public.admin_sessions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admin_credentials 
    WHERE id = admin_user_id 
    AND id = auth.uid()
    AND is_active = true
  )
);

-- Create function to validate session tokens
CREATE OR REPLACE FUNCTION public.validate_admin_session(session_token_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_record RECORD;
  admin_record RECORD;
BEGIN
  -- Get session record
  SELECT * INTO session_record
  FROM public.admin_sessions
  WHERE session_token = session_token_input
  AND is_active = true
  AND expires_at > now();
  
  IF session_record IS NULL THEN
    RETURN json_build_object('valid', false, 'message', 'Invalid or expired session');
  END IF;
  
  -- Get admin details
  SELECT * INTO admin_record
  FROM public.admin_credentials
  WHERE id = session_record.admin_user_id
  AND is_active = true;
  
  IF admin_record IS NULL THEN
    RETURN json_build_object('valid', false, 'message', 'Admin account not found');
  END IF;
  
  -- Update session last activity
  UPDATE public.admin_sessions
  SET updated_at = now()
  WHERE id = session_record.id;
  
  RETURN json_build_object(
    'valid', true,
    'user', json_build_object(
      'id', admin_record.id,
      'email', admin_record.email,
      'full_name', admin_record.full_name,
      'role', admin_record.role
    )
  );
END;
$$;