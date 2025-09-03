-- CRITICAL SECURITY FIX: Remove dangerous public access policies from users table
-- These policies allow unrestricted access and must be removed immediately

-- Drop the dangerous policies that allow unrestricted access
DROP POLICY IF EXISTS "allow_delete" ON public.users;
DROP POLICY IF EXISTS "allow_insert" ON public.users;  
DROP POLICY IF EXISTS "allow_update" ON public.users;
DROP POLICY IF EXISTS "allow_select" ON public.users;

-- Verify RLS is enabled (should already be enabled from previous migration)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create missing DELETE policy for admins only
CREATE POLICY "Admins can delete users securely" 
ON public.users 
FOR DELETE 
USING (
    has_role(auth.uid(), 'admin'::app_role) 
    AND auth.uid() IS NOT NULL
);

-- Log this critical security fix
INSERT INTO public.security_audit_logs (
    event_type,
    user_id,
    action,
    resource_type,
    risk_level,
    metadata
) VALUES (
    'security_fix_applied',
    auth.uid(),
    'removed_dangerous_policies',
    'users_table',
    'critical',
    jsonb_build_object(
        'description', 'Removed public access policies from users table',
        'policies_removed', ARRAY['allow_delete', 'allow_insert', 'allow_update', 'allow_select'],
        'timestamp', now(),
        'security_level', 'enhanced'
    )
);