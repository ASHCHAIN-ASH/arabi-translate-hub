-- 1) Bucket للمرفقات
INSERT INTO storage.buckets (id, name, public)
VALUES ('whatsapp-attachments', 'whatsapp-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- صلاحيات: المشرفون يقرؤون ويرفعون
DO $$ BEGIN
  CREATE POLICY "Admins read whatsapp attachments"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'whatsapp-attachments' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins upload whatsapp attachments"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'whatsapp-attachments' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Admins delete whatsapp attachments"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'whatsapp-attachments' AND public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) فهارس
CREATE INDEX IF NOT EXISTS idx_wa_conv_assigned ON public.whatsapp_conversations(assigned_to);
CREATE INDEX IF NOT EXISTS idx_wa_conv_pinned_lastmsg ON public.whatsapp_conversations(is_pinned DESC, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_msg_conv_created ON public.whatsapp_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_wa_camp_recipients_status ON public.whatsapp_campaign_recipients(campaign_id, status);

-- 3) امتدادات الجدولة
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;