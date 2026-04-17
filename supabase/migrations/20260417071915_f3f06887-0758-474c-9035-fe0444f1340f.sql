
-- Extend tickets with linkage and customer
ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS customer_id uuid,
  ADD COLUMN IF NOT EXISTS related_invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS related_order_id uuid REFERENCES public.service_orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS last_message_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_tickets_user ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON public.tickets(category);
CREATE INDEX IF NOT EXISTS idx_tickets_invoice ON public.tickets(related_invoice_id);
CREATE INDEX IF NOT EXISTS idx_tickets_order ON public.tickets(related_order_id);

-- Messages
CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  sender_type text NOT NULL DEFAULT 'client',
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON public.ticket_messages(ticket_id);
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own ticket messages"
  ON public.ticket_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_messages.ticket_id AND t.user_id = auth.uid()));

CREATE POLICY "Users send messages on own tickets"
  ON public.ticket_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND sender_type = 'client'
    AND EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_messages.ticket_id AND t.user_id = auth.uid())
  );

CREATE POLICY "Admins manage ticket messages"
  ON public.ticket_messages FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Timeline
CREATE TABLE IF NOT EXISTS public.ticket_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  actor_id uuid,
  actor_type text NOT NULL DEFAULT 'system',
  action_type text NOT NULL,
  action_label text NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ticket_timeline_ticket ON public.ticket_timeline(ticket_id);
ALTER TABLE public.ticket_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own ticket timeline"
  ON public.ticket_timeline FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_timeline.ticket_id AND t.user_id = auth.uid()));

CREATE POLICY "Admins manage ticket timeline"
  ON public.ticket_timeline FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Attachments
CREATE TABLE IF NOT EXISTS public.ticket_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  uploaded_by_admin boolean NOT NULL DEFAULT false,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  file_type text,
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticket ON public.ticket_attachments(ticket_id);
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own ticket attachments"
  ON public.ticket_attachments FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_attachments.ticket_id AND t.user_id = auth.uid())
         OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users add attachments to own tickets"
  ON public.ticket_attachments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_attachments.ticket_id AND t.user_id = auth.uid())
  );

CREATE POLICY "Admins manage ticket attachments"
  ON public.ticket_attachments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger: update last_message_at when a message is added + add timeline entry
CREATE OR REPLACE FUNCTION public.handle_ticket_message_inserted()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.tickets
     SET last_message_at = NEW.created_at,
         updated_at = now(),
         status = CASE
           WHEN NEW.sender_type = 'admin' AND status = 'open' THEN 'in_progress'
           WHEN NEW.sender_type = 'client' AND status = 'resolved' THEN 'open'
           ELSE status
         END
   WHERE id = NEW.ticket_id;

  INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description)
  VALUES (
    NEW.ticket_id,
    NEW.sender_id,
    NEW.sender_type,
    'message',
    CASE WHEN NEW.sender_type = 'admin' THEN 'رد من الإدارة' ELSE 'رسالة من العميل' END,
    LEFT(NEW.content, 200)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ticket_message_inserted ON public.ticket_messages;
CREATE TRIGGER trg_ticket_message_inserted
AFTER INSERT ON public.ticket_messages
FOR EACH ROW EXECUTE FUNCTION public.handle_ticket_message_inserted();

-- Trigger: log status / assignment changes
CREATE OR REPLACE FUNCTION public.handle_ticket_changed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description)
    VALUES (NEW.id, NEW.user_id, 'client', 'created', 'إنشاء التذكرة', 'تم فتح التذكرة رقم ' || NEW.ticket_number);
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description, metadata)
    VALUES (NEW.id, auth.uid(), CASE WHEN has_role(auth.uid(),'admin'::app_role) THEN 'admin' ELSE 'client' END,
            'status_change', 'تغيير الحالة',
            'من ' || COALESCE(OLD.status,'-') || ' إلى ' || COALESCE(NEW.status,'-'),
            jsonb_build_object('from', OLD.status, 'to', NEW.status));
    IF NEW.status = 'resolved' AND OLD.status IS DISTINCT FROM 'resolved' THEN
      NEW.resolved_at := now();
    END IF;
  END IF;

  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
    INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description)
    VALUES (NEW.id, auth.uid(), 'admin', 'assignment', 'إسناد التذكرة',
            CASE WHEN NEW.assigned_to IS NULL THEN 'تم إلغاء الإسناد' ELSE 'تم إسناد التذكرة لمدير' END);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ticket_changed ON public.tickets;
CREATE TRIGGER trg_ticket_changed
BEFORE INSERT OR UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.handle_ticket_changed();

-- Realtime publication
ALTER TABLE public.tickets REPLICA IDENTITY FULL;
ALTER TABLE public.ticket_messages REPLICA IDENTITY FULL;
ALTER TABLE public.ticket_timeline REPLICA IDENTITY FULL;
ALTER TABLE public.ticket_attachments REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_timeline;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_attachments;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Storage bucket for attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('ticket-attachments', 'ticket-attachments', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own ticket files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ticket-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users view own ticket files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ticket-attachments' AND (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(),'admin'::app_role)));

CREATE POLICY "Admins manage ticket files"
  ON storage.objects FOR ALL
  USING (bucket_id = 'ticket-attachments' AND has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (bucket_id = 'ticket-attachments' AND has_role(auth.uid(),'admin'::app_role));
