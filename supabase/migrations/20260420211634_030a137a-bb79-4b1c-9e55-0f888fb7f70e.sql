
-- ==================== Campaigns ====================
CREATE TABLE IF NOT EXISTS public.whatsapp_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  message_body TEXT NOT NULL,
  variables_map JSONB NOT NULL DEFAULT '{}'::jsonb,
  audience_filter JSONB NOT NULL DEFAULT '{"type":"all"}'::jsonb,
  -- audience_filter examples:
  -- {"type":"all"}
  -- {"type":"customers","membership":"active"}
  -- {"type":"phones","phones":["966...","966..."]}
  -- {"type":"service_orders","status":"pending"}
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','running','completed','failed','cancelled')),
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_recipients INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  read_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_campaigns_status ON public.whatsapp_campaigns(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_wa_campaigns_created ON public.whatsapp_campaigns(created_at DESC);

ALTER TABLE public.whatsapp_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage campaigns"
ON public.whatsapp_campaigns
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_wa_campaigns_updated
BEFORE UPDATE ON public.whatsapp_campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== Campaign Recipients ====================
CREATE TABLE IF NOT EXISTS public.whatsapp_campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.whatsapp_campaigns(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  name TEXT,
  user_id UUID,
  customer_id UUID,
  variables JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed','read','replied')),
  send_log_id UUID,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_camp_rec_campaign ON public.whatsapp_campaign_recipients(campaign_id, status);
CREATE INDEX IF NOT EXISTS idx_wa_camp_rec_phone ON public.whatsapp_campaign_recipients(phone);

ALTER TABLE public.whatsapp_campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage campaign recipients"
ON public.whatsapp_campaign_recipients
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ==================== Conversations ====================
CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  user_id UUID,
  customer_id UUID,
  assigned_to UUID,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending','closed','archived')),
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_starred BOOLEAN NOT NULL DEFAULT false,
  human_takeover BOOLEAN NOT NULL DEFAULT false,
  unread_count INTEGER NOT NULL DEFAULT 0,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  last_inbound_at TIMESTAMPTZ,
  last_admin_read_at TIMESTAMPTZ,
  tags TEXT[] NOT NULL DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_conv_status ON public.whatsapp_conversations(status, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_conv_unread ON public.whatsapp_conversations(unread_count) WHERE unread_count > 0;
CREATE INDEX IF NOT EXISTS idx_wa_conv_assigned ON public.whatsapp_conversations(assigned_to);

ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage conversations"
ON public.whatsapp_conversations
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_wa_conv_updated
BEFORE UPDATE ON public.whatsapp_conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== Messages ====================
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer','admin','bot','system')),
  sender_id UUID,
  sender_name TEXT,
  body TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text','image','document','audio','video','template')),
  media_url TEXT,
  media_filename TEXT,
  provider_message_id TEXT,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending','sent','delivered','read','failed')),
  error_message TEXT,
  read_by_customer_at TIMESTAMPTZ,
  read_by_admin_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_msg_conv ON public.whatsapp_messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_msg_phone ON public.whatsapp_messages(phone, created_at DESC);

ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage whatsapp messages"
ON public.whatsapp_messages
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ==================== Quick Replies ====================
CREATE TABLE IF NOT EXISTS public.whatsapp_quick_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shortcut TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT,
  use_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_quick_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage quick replies"
ON public.whatsapp_quick_replies
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_wa_quick_replies_updated
BEFORE UPDATE ON public.whatsapp_quick_replies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==================== Conversation Notes ====================
CREATE TABLE IF NOT EXISTS public.whatsapp_conversation_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  admin_id UUID,
  admin_name TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_conv_notes ON public.whatsapp_conversation_notes(conversation_id, created_at DESC);

ALTER TABLE public.whatsapp_conversation_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage conversation notes"
ON public.whatsapp_conversation_notes
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ==================== Realtime ====================
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.whatsapp_campaign_recipients;

-- ==================== Seed quick replies ====================
INSERT INTO public.whatsapp_quick_replies (shortcut, title, body, category) VALUES
('/welcome', 'ترحيب', 'مرحباً بك في فكرة إيدو 👋
كيف يمكنني مساعدتك اليوم؟', 'ترحيب'),
('/wait', 'يرجى الانتظار', '⏳ شكراً لتواصلك. لحظات من فضلك أتحقق من المعلومة وأعود إليك فوراً.', 'انتظار'),
('/order', 'طلب رقم الطلب', '🔖 من فضلك زوّدنا برقم الطلب لنتمكن من خدمتك بشكل أسرع.', 'استفسار'),
('/payment', 'تأكيد الدفع', '💳 لإتمام طلبك، يرجى الدفع من خلال الرابط:
{{link}}', 'دفع'),
('/thanks', 'شكر وختام', '🌹 شكراً لتواصلك مع فكرة إيدو. نتمنى لك يوماً موفقاً.', 'ختام'),
('/contract', 'عقد جاهز', '📄 عقدك جاهز للتوقيع الإلكتروني. يرجى مراجعة الرابط:
{{link}}', 'عقود')
ON CONFLICT DO NOTHING;
