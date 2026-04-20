-- Inbox messages from public forms
CREATE TABLE IF NOT EXISTS public.inbox_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  form_type TEXT NOT NULL DEFAULT 'contact', -- contact, service_inquiry, admission, careers, etc.
  service_type TEXT,
  source_page TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- new, open, replied, closed
  priority TEXT NOT NULL DEFAULT 'normal', -- low, normal, high
  assigned_to UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  reply_count INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inbox_messages_status ON public.inbox_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_email ON public.inbox_messages(sender_email);
CREATE INDEX IF NOT EXISTS idx_inbox_messages_form_type ON public.inbox_messages(form_type);

-- Replies sent by admins
CREATE TABLE IF NOT EXISTS public.inbox_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.inbox_messages(id) ON DELETE CASCADE,
  admin_id UUID,
  admin_name TEXT,
  admin_email TEXT,
  body TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  delivery_error TEXT,
  external_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inbox_replies_message ON public.inbox_replies(message_id, created_at);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_inbox_messages_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_inbox_messages_updated_at ON public.inbox_messages;
CREATE TRIGGER trg_inbox_messages_updated_at
BEFORE UPDATE ON public.inbox_messages
FOR EACH ROW EXECUTE FUNCTION public.set_inbox_messages_updated_at();

-- When a reply is inserted, bump the parent message
CREATE OR REPLACE FUNCTION public.bump_inbox_message_on_reply()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.inbox_messages
  SET reply_count = reply_count + 1,
      last_activity_at = now(),
      status = CASE WHEN status IN ('new','open') THEN 'replied' ELSE status END
  WHERE id = NEW.message_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bump_inbox_message ON public.inbox_replies;
CREATE TRIGGER trg_bump_inbox_message
AFTER INSERT ON public.inbox_replies
FOR EACH ROW EXECUTE FUNCTION public.bump_inbox_message_on_reply();

-- RLS
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_replies  ENABLE ROW LEVEL SECURITY;

-- Admins can fully manage inbox
DROP POLICY IF EXISTS "Admins manage inbox messages" ON public.inbox_messages;
CREATE POLICY "Admins manage inbox messages"
ON public.inbox_messages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage inbox replies" ON public.inbox_replies;
CREATE POLICY "Admins manage inbox replies"
ON public.inbox_replies
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Realtime
ALTER TABLE public.inbox_messages REPLICA IDENTITY FULL;
ALTER TABLE public.inbox_replies  REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inbox_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inbox_replies;