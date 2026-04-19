
ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS assigned_admin_id uuid REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS first_response_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ADD COLUMN IF NOT EXISTS csat_rating int CHECK (csat_rating BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS csat_comment text,
  ADD COLUMN IF NOT EXISTS csat_submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS sla_due_at timestamptz,
  ADD COLUMN IF NOT EXISTS auto_created boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS unread_for_client int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unread_for_admin int NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_tickets_assigned_admin ON public.tickets(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_tickets_sla_due ON public.tickets(sla_due_at) WHERE status NOT IN ('resolved','closed');
CREATE INDEX IF NOT EXISTS idx_tickets_last_message ON public.tickets(last_message_at DESC);

CREATE TABLE IF NOT EXISTS public.ticket_presence (
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('client','admin')),
  display_name text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ticket_id, user_id)
);
ALTER TABLE public.ticket_presence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "presence_select" ON public.ticket_presence;
CREATE POLICY "presence_select" ON public.ticket_presence FOR SELECT
  USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid()));
DROP POLICY IF EXISTS "presence_ins" ON public.ticket_presence;
CREATE POLICY "presence_ins" ON public.ticket_presence FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "presence_upd" ON public.ticket_presence;
CREATE POLICY "presence_upd" ON public.ticket_presence FOR UPDATE USING (user_id = auth.uid());
DROP POLICY IF EXISTS "presence_del" ON public.ticket_presence;
CREATE POLICY "presence_del" ON public.ticket_presence FOR DELETE USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.ticket_typing (
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('client','admin')),
  is_typing boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ticket_id, user_id)
);
ALTER TABLE public.ticket_typing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "typing_select" ON public.ticket_typing;
CREATE POLICY "typing_select" ON public.ticket_typing FOR SELECT
  USING (has_role(auth.uid(),'admin'::app_role) OR EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.user_id = auth.uid()));
DROP POLICY IF EXISTS "typing_ins" ON public.ticket_typing;
CREATE POLICY "typing_ins" ON public.ticket_typing FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "typing_upd" ON public.ticket_typing;
CREATE POLICY "typing_upd" ON public.ticket_typing FOR UPDATE USING (user_id = auth.uid());
DROP POLICY IF EXISTS "typing_del" ON public.ticket_typing;
CREATE POLICY "typing_del" ON public.ticket_typing FOR DELETE USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.ticket_quick_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);
ALTER TABLE public.ticket_quick_replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "qr_admin_all" ON public.ticket_quick_replies;
CREATE POLICY "qr_admin_all" ON public.ticket_quick_replies FOR ALL
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.support_kb_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  tags text[] DEFAULT '{}'::text[],
  views int NOT NULL DEFAULT 0,
  helpful_count int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_kb_articles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "kb_read" ON public.support_kb_articles;
CREATE POLICY "kb_read" ON public.support_kb_articles FOR SELECT
  USING (is_published = true OR has_role(auth.uid(),'admin'::app_role));
DROP POLICY IF EXISTS "kb_write" ON public.support_kb_articles;
CREATE POLICY "kb_write" ON public.support_kb_articles FOR ALL
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_typing;
