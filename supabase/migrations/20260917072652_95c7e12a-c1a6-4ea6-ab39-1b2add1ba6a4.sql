GRANT SELECT ON public.email_send_log TO authenticated;

CREATE POLICY "Admins can read email send log"
ON public.email_send_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can read their own email log"
ON public.email_send_log
FOR SELECT
TO authenticated
USING (lower(recipient_email) = lower(coalesce((auth.jwt() ->> 'email'), '')));

CREATE INDEX IF NOT EXISTS idx_email_send_log_metadata_invoice
ON public.email_send_log ((metadata ->> 'invoice_id'));

CREATE INDEX IF NOT EXISTS idx_email_send_log_recipient_created
ON public.email_send_log (lower(recipient_email), created_at DESC);