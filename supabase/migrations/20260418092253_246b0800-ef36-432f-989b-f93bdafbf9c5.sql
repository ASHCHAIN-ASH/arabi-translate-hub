
-- =====================================================================
-- 1) REALTIME CHANNEL AUTHORIZATION
-- =====================================================================
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users subscribe to own channels only" ON realtime.messages;
CREATE POLICY "Users subscribe to own channels only"
  ON realtime.messages FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR realtime.topic() = ('user:' || auth.uid()::text)
    OR realtime.topic() LIKE ('user:' || auth.uid()::text || ':%')
  );

DROP POLICY IF EXISTS "Users broadcast to own channels only" ON realtime.messages;
CREATE POLICY "Users broadcast to own channels only"
  ON realtime.messages FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR realtime.topic() = ('user:' || auth.uid()::text)
    OR realtime.topic() LIKE ('user:' || auth.uid()::text || ':%')
  );

-- Remove sensitive admin-only table from realtime publication
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE public.service_order_admin_notes;
EXCEPTION WHEN undefined_object THEN NULL; WHEN OTHERS THEN NULL; END $$;

-- =====================================================================
-- 2) HARDEN contract_otp_codes  (block ALL non-admin writes)
-- =====================================================================
ALTER TABLE public.contract_otp_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Block client insert otp" ON public.contract_otp_codes;
CREATE POLICY "Block client insert otp"
  ON public.contract_otp_codes AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Block client update otp" ON public.contract_otp_codes;
CREATE POLICY "Block client update otp"
  ON public.contract_otp_codes AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Block client delete otp" ON public.contract_otp_codes;
CREATE POLICY "Block client delete otp"
  ON public.contract_otp_codes AS RESTRICTIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

-- =====================================================================
-- 3) STORAGE: ticket-attachments — verify real ownership via DB
-- =====================================================================
DROP POLICY IF EXISTS "Users view own ticket files" ON storage.objects;
CREATE POLICY "Users view own ticket files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'ticket-attachments'
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.ticket_attachments ta
        JOIN public.tickets t ON t.id = ta.ticket_id
        WHERE ta.storage_path = storage.objects.name
          AND t.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users upload own ticket files" ON storage.objects;
CREATE POLICY "Users upload own ticket files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'ticket-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.user_id = auth.uid()
        AND t.id::text = (storage.foldername(name))[2]
    )
  );

-- =====================================================================
-- 4) STORAGE: order-attachments — verify real ownership via DB
-- =====================================================================
DROP POLICY IF EXISTS "Users view own order files" ON storage.objects;
CREATE POLICY "Users view own order files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'order-attachments'
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.order_attachments oa
        WHERE oa.storage_path = storage.objects.name
          AND oa.user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Users upload own order files" ON storage.objects;
CREATE POLICY "Users upload own order files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'order-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users delete own order files" ON storage.objects;
CREATE POLICY "Users delete own order files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'order-attachments'
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.order_attachments oa
        WHERE oa.storage_path = storage.objects.name
          AND oa.user_id = auth.uid()
      )
    )
  );

-- =====================================================================
-- 5) FIX search_path on pgmq wrapper functions
-- =====================================================================
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;
