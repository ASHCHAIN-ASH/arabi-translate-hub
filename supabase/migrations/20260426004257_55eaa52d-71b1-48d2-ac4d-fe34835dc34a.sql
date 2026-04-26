DROP POLICY IF EXISTS "service_role_insert_inbox" ON public.user_inbox_notifications;

CREATE POLICY "admins_can_insert_inbox" ON public.user_inbox_notifications
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));