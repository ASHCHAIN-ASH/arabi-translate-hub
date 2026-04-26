-- جدول الإشعارات الشخصية
CREATE TABLE IF NOT EXISTS public.user_inbox_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inbox_user_unread ON public.user_inbox_notifications(user_id, is_read, created_at DESC);

ALTER TABLE public.user_inbox_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_inbox" ON public.user_inbox_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_update_own_inbox" ON public.user_inbox_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "admins_manage_all_inbox" ON public.user_inbox_notifications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "service_role_insert_inbox" ON public.user_inbox_notifications
  FOR INSERT WITH CHECK (true);

-- توقيع العميل على عقد التمويل
ALTER TABLE public.financing_applications
  ADD COLUMN IF NOT EXISTS client_signature_data TEXT,
  ADD COLUMN IF NOT EXISTS client_signed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS client_signed_ip TEXT;

-- Realtime
ALTER TABLE public.user_inbox_notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_inbox_notifications;