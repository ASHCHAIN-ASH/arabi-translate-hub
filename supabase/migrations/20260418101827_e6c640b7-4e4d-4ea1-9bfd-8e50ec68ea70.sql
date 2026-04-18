
-- 1) Tighten notifications SELECT policy
DROP POLICY IF EXISTS "Authenticated users view notifications" ON public.notifications;

CREATE POLICY "Users view targeted notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  target_audience = 'all'
  OR target_audience = auth.uid()::text
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- 2) Allow users to view their own referral audit logs
CREATE POLICY "Users view own referral audit"
ON public.referral_audit_logs
FOR SELECT
TO authenticated
USING (
  auth.uid() = referrer_user_id
  OR auth.uid() = referred_user_id
);
