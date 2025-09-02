-- Insert admin role for current authenticated user
-- This will help resolve the immediate permission issue
INSERT INTO public.user_roles (user_id, role) 
VALUES (
  -- Use a hardcoded UUID for admin user - replace with actual admin user ID
  'b8f4d1c7-4b2a-4c3d-8e9f-1a2b3c4d5e6f', 
  'admin'::app_role
)
ON CONFLICT (user_id, role) DO NOTHING;

-- Also allow service role to insert roles (for system operations)
CREATE POLICY "Service role can manage roles" 
ON public.user_roles 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');