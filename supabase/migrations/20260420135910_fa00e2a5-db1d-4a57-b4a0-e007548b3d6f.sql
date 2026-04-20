
DROP POLICY IF EXISTS "Service role inserts whatsapp logs" ON public.whatsapp_send_log;

CREATE POLICY "Admins insert whatsapp logs"
ON public.whatsapp_send_log FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));
