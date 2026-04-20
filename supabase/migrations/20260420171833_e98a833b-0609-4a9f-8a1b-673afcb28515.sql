
-- جدول جلسات محادثات بوت واتساب
CREATE TABLE IF NOT EXISTS public.whatsapp_bot_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  user_id uuid,
  customer_id uuid,
  is_registered boolean NOT NULL DEFAULT false,
  state text NOT NULL DEFAULT 'idle',
  state_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  human_takeover boolean NOT NULL DEFAULT false,
  human_takeover_at timestamptz,
  human_takeover_reason text,
  failed_attempts int NOT NULL DEFAULT 0,
  last_message text,
  last_message_at timestamptz,
  last_bot_reply_at timestamptz,
  inbox_message_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_bot_sessions_phone ON public.whatsapp_bot_sessions(phone);
CREATE INDEX IF NOT EXISTS idx_wa_bot_sessions_takeover ON public.whatsapp_bot_sessions(human_takeover) WHERE human_takeover = true;

ALTER TABLE public.whatsapp_bot_sessions ENABLE ROW LEVEL SECURITY;

-- المسؤول فقط (admin) يقرأ/يعدل
CREATE POLICY "Admins can manage bot sessions"
ON public.whatsapp_bot_sessions FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- جدول لسجل رسائل الواتساب الواردة
CREATE TABLE IF NOT EXISTS public.whatsapp_inbound_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  message_body text,
  message_type text DEFAULT 'text',
  raw_payload jsonb,
  bot_handled boolean NOT NULL DEFAULT false,
  bot_reply text,
  forwarded_to_human boolean NOT NULL DEFAULT false,
  inbox_message_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_inbound_phone ON public.whatsapp_inbound_messages(phone, created_at DESC);

ALTER TABLE public.whatsapp_inbound_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read inbound messages"
ON public.whatsapp_inbound_messages FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- trigger لتحديث updated_at
CREATE TRIGGER trg_wa_bot_sessions_updated_at
BEFORE UPDATE ON public.whatsapp_bot_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
