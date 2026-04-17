
-- 1) تمييز مرفقات التسليم
ALTER TABLE public.order_attachments
  ADD COLUMN IF NOT EXISTS is_delivery boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS uploaded_by_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS service_order_id uuid;

CREATE INDEX IF NOT EXISTS idx_order_attachments_service_order ON public.order_attachments(service_order_id);

-- 2) محادثات داخل الطلب
CREATE TABLE IF NOT EXISTS public.service_order_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  sender_type text NOT NULL DEFAULT 'client', -- 'client' | 'admin'
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_som_order ON public.service_order_messages(order_id, created_at);

ALTER TABLE public.service_order_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage order messages" ON public.service_order_messages;
CREATE POLICY "Admins manage order messages"
ON public.service_order_messages FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users view own order messages" ON public.service_order_messages;
CREATE POLICY "Users view own order messages"
ON public.service_order_messages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.service_orders so
  WHERE so.id = service_order_messages.order_id AND so.user_id = auth.uid()
));

DROP POLICY IF EXISTS "Users send messages on own orders" ON public.service_order_messages;
CREATE POLICY "Users send messages on own orders"
ON public.service_order_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND sender_type = 'client'
  AND EXISTS (
    SELECT 1 FROM public.service_orders so
    WHERE so.id = service_order_messages.order_id AND so.user_id = auth.uid()
  )
);

-- 3) ملاحظات داخلية للأدمن
CREATE TABLE IF NOT EXISTS public.service_order_admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  author_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_soan_order ON public.service_order_admin_notes(order_id, created_at);

ALTER TABLE public.service_order_admin_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins only manage internal notes" ON public.service_order_admin_notes;
CREATE POLICY "Admins only manage internal notes"
ON public.service_order_admin_notes FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4) Realtime
ALTER TABLE public.service_order_messages REPLICA IDENTITY FULL;
ALTER TABLE public.service_order_admin_notes REPLICA IDENTITY FULL;
ALTER TABLE public.order_attachments REPLICA IDENTITY FULL;

DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.service_order_messages; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.service_order_admin_notes; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.order_attachments; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
