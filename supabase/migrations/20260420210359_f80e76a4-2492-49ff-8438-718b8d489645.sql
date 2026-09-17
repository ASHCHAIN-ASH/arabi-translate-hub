-- =========================================
-- INBOX MESSAGES: new columns
-- =========================================
ALTER TABLE public.inbox_messages
  ADD COLUMN IF NOT EXISTS is_pinned     boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_starred    boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_archived   boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_at       timestamptz,
  ADD COLUMN IF NOT EXISTS tags          text[] NOT NULL DEFAULT '{}'::text[];

CREATE INDEX IF NOT EXISTS idx_inbox_messages_pinned   ON public.inbox_messages (is_pinned)   WHERE is_pinned;
CREATE INDEX IF NOT EXISTS idx_inbox_messages_starred  ON public.inbox_messages (is_starred)  WHERE is_starred;
CREATE INDEX IF NOT EXISTS idx_inbox_messages_archived ON public.inbox_messages (is_archived);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_assigned ON public.inbox_messages (assigned_to);

-- =========================================
-- INTERNAL NOTES (admin-only, not visible to client)
-- =========================================
CREATE TABLE IF NOT EXISTS public.inbox_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id  uuid NOT NULL REFERENCES public.inbox_messages(id) ON DELETE CASCADE,
  admin_id    uuid,
  admin_name  text,
  body        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inbox_notes_message ON public.inbox_notes (message_id, created_at DESC);

ALTER TABLE public.inbox_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage inbox notes" ON public.inbox_notes;
CREATE POLICY "Admins manage inbox notes"
  ON public.inbox_notes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- REPLY TEMPLATES (canned responses)
-- =========================================
CREATE TABLE IF NOT EXISTS public.inbox_reply_templates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  body       text NOT NULL,
  category   text,
  shortcut   text,
  use_count  integer NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inbox_reply_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage reply templates" ON public.inbox_reply_templates;
CREATE POLICY "Admins manage reply templates"
  ON public.inbox_reply_templates FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed a few default templates (idempotent)
INSERT INTO public.inbox_reply_templates (title, body, category, shortcut)
SELECT * FROM (VALUES
  ('شكر واستلام',  E'مرحباً،\n\nشكراً لتواصلك مع FekrahEdu. وصلتنا رسالتك وسنعود إليك في أقرب وقت ممكن خلال ساعات العمل.\n\nمع تحياتنا,\nفريق FekrahEdu', 'عام',     'ack'),
  ('طلب تفاصيل',  E'مرحباً،\n\nنشكرك على اهتمامك بخدماتنا. لنتمكن من خدمتك بدقة، نرجو تزويدنا بالتفاصيل التالية:\n• المرحلة الأكاديمية والتخصص\n• الموعد المستهدف للتسليم\n• أي ملفات أو متطلبات إضافية\n\nمع التحية,\nفريق FekrahEdu', 'استفسار', 'info'),
  ('عرض سعر',     E'مرحباً،\n\nبناءً على تفاصيل طلبك، يسعدنا تقديم العرض التالي. فريقنا متاح للإجابة عن أي استفسار وتعديل الخطة بما يناسب احتياجك.\n\nمع التحية,\nفريق FekrahEdu', 'مبيعات', 'quote'),
  ('إغلاق وشكر', E'مرحباً،\n\nشكراً لتعاملك معنا. نأمل أن تكون تجربتك مع FekrahEdu قد لبّت توقعاتك. لا تتردد في التواصل معنا في أي وقت.\n\nمع التحية,\nفريق FekrahEdu', 'إغلاق',  'close')
) AS t(title, body, category, shortcut)
WHERE NOT EXISTS (SELECT 1 FROM public.inbox_reply_templates LIMIT 1);

-- updated_at trigger
DROP TRIGGER IF EXISTS trg_inbox_templates_updated_at ON public.inbox_reply_templates;
CREATE TRIGGER trg_inbox_templates_updated_at
  BEFORE UPDATE ON public.inbox_reply_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- REALTIME for inbox tables (admin-only via RLS)
-- =========================================
ALTER TABLE public.inbox_messages       REPLICA IDENTITY FULL;
ALTER TABLE public.inbox_replies        REPLICA IDENTITY FULL;
ALTER TABLE public.inbox_notes          REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inbox_messages;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inbox_replies;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.inbox_notes;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;