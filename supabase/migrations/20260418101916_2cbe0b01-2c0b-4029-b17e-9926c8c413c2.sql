
-- 1) Block privilege escalation on user_roles
CREATE POLICY "Block non-admin role writes"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO authenticated, anon
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2) Block anon access to contract_otp_codes
CREATE POLICY "Block anon access to otp"
ON public.contract_otp_codes
AS RESTRICTIVE
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- 3) Restrict spin_attempts SELECT to authenticated
DROP POLICY IF EXISTS "Users view own spins" ON public.spin_attempts;
CREATE POLICY "Users view own spins"
ON public.spin_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4) Block anon on email tokens & suppressed emails
CREATE POLICY "Block non-service access to unsub tokens"
ON public.email_unsubscribe_tokens
AS RESTRICTIVE
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

CREATE POLICY "Block non-service access to suppressed"
ON public.suppressed_emails
AS RESTRICTIVE
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);

-- 5) Admin oversight on email_send_state
CREATE POLICY "Admins view email send state"
ON public.email_send_state
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6) Restrict notifications INSERT to authenticated admins explicitly
DROP POLICY IF EXISTS "Admins create notifications" ON public.notifications;
CREATE POLICY "Admins create notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
