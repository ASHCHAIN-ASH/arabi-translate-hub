
-- Fix privilege escalation: restrict user_roles writes to admins only
-- The ALL policy already covers admin, but we need explicit denial for non-admins
-- Drop and recreate to be explicit
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix notifications: restrict to authenticated users
DROP POLICY IF EXISTS "Anyone can view notifications" ON public.notifications;

CREATE POLICY "Authenticated users view notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (true);
