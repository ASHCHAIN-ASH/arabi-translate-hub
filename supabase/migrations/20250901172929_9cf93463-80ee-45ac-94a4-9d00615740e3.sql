-- CRITICAL SECURITY FIX: Secure admin credentials and sensitive data
-- This fixes the "Admin Login Credentials Exposed to Hackers" vulnerability

-- =====================================
-- 1. FIX ADMIN CREDENTIALS TABLE (CRITICAL)
-- =====================================

-- Drop the dangerous "Allow admin access" policy that allows public access
DROP POLICY IF EXISTS "Allow admin access" ON public.admin_credentials;

-- Create secure policies for admin_credentials table
-- Only authenticated admin users can access admin credentials
CREATE POLICY "Admin credentials: Only admins can view"
  ON public.admin_credentials
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM public.admin_credentials ac 
      WHERE ac.id = auth.uid() 
      AND ac.is_active = true 
      AND ac.role = 'admin'
    )
  );

CREATE POLICY "Admin credentials: Only admins can update"
  ON public.admin_credentials
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM public.admin_credentials ac 
      WHERE ac.id = auth.uid() 
      AND ac.is_active = true 
      AND ac.role = 'admin'
    )
  );

CREATE POLICY "Admin credentials: No public insert"
  ON public.admin_credentials
  FOR INSERT
  WITH CHECK (false); -- No public inserts allowed

CREATE POLICY "Admin credentials: No public delete"
  ON public.admin_credentials
  FOR DELETE
  USING (false); -- No deletes allowed

-- =====================================
-- 2. FIX PROJECT NOTIFICATIONS TABLE
-- =====================================

-- Drop the dangerous public access policy
DROP POLICY IF EXISTS "الجميع يمكنهم رؤية إشعارات المشار" ON public.project_notifications;

-- Create secure policy - only authenticated users can see their own notifications
CREATE POLICY "Users can view their own project notifications"
  ON public.project_notifications
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND (
      -- User can see notifications sent to their email
      recipient_email IN (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
      OR
      -- Admins can see all notifications
      EXISTS (
        SELECT 1 FROM public.admin_credentials ac 
        WHERE ac.id = auth.uid() 
        AND ac.is_active = true 
        AND ac.role = 'admin'
      )
    )
  );

-- =====================================
-- 3. FIX PROJECT TIMELINE TABLE  
-- =====================================

-- Drop the dangerous public access policy
DROP POLICY IF EXISTS "الجميع يمكنهم رؤية تحديثات المشار" ON public.project_timeline;

-- Create secure policy - only project owners and admins can see timeline
CREATE POLICY "Users can view timeline of their projects"
  ON public.project_timeline
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND (
      -- User owns the project
      EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_timeline.project_id 
        AND p.user_id = auth.uid()
      )
      OR
      -- User is an admin
      EXISTS (
        SELECT 1 FROM public.admin_credentials ac 
        WHERE ac.id = auth.uid() 
        AND ac.is_active = true 
        AND ac.role = 'admin'
      )
    )
  );

-- =====================================
-- 4. SECURE USERS TABLE POLICIES
-- =====================================

-- Check and fix users table policies
DROP POLICY IF EXISTS "المستخدمون يمكنهم رؤية بياناتهم" ON public.users;
DROP POLICY IF EXISTS "المستخدمون يمكنهم تحديث بياناتهم" ON public.users;

-- Create proper user policies
CREATE POLICY "Users can view their own data only"
  ON public.users
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND (
      -- User can see their own data
      id = auth.uid()
      OR
      -- Admins can see all user data
      EXISTS (
        SELECT 1 FROM public.admin_credentials ac 
        WHERE ac.id = auth.uid() 
        AND ac.is_active = true 
        AND ac.role = 'admin'
      )
    )
  );

CREATE POLICY "Users can update their own data only"
  ON public.users
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL 
    AND id = auth.uid()
  );

-- Keep the registration policy as is (public registration allowed)
-- "السماح بالتسجيل" policy remains unchanged

-- =====================================
-- 5. CREATE AUDIT LOG FOR SECURITY MONITORING
-- =====================================

-- Log this security fix
INSERT INTO public.security_audit_logs (
  event_type,
  user_id,
  action,
  risk_level,
  metadata
) VALUES (
  'security_fix_applied',
  auth.uid(),
  'fix_admin_credentials_exposure',
  'critical',
  jsonb_build_object(
    'description', 'Fixed critical security vulnerability - admin credentials exposure',
    'tables_secured', ARRAY['admin_credentials', 'project_notifications', 'project_timeline', 'users'],
    'vulnerability_id', 'supabase_lov_PUBLIC_ADMIN_CREDENTIALS',
    'timestamp', now()
  )
);