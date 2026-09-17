
-- إعدادات واتساب (سطر واحد)
CREATE TABLE IF NOT EXISTS public.whatsapp_settings (
  id INT PRIMARY KEY DEFAULT 1,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  events_enabled JSONB NOT NULL DEFAULT '{
    "order_created": true,
    "order_status_changed": true,
    "order_delivered": true,
    "invoice_new": true,
    "invoice_reminder": true,
    "invoice_paid": true,
    "contract_invite": true,
    "contract_signed": true,
    "otp_login": true
  }'::jsonb,
  default_country_code TEXT NOT NULL DEFAULT '966',
  test_phone TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO public.whatsapp_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage whatsapp settings"
ON public.whatsapp_settings FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- قوالب رسائل واتساب
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body_text TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage whatsapp templates"
ON public.whatsapp_templates FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- بذر القوالب الافتراضية
INSERT INTO public.whatsapp_templates (event_key, title, body_text, variables) VALUES
('order_created', 'طلب جديد', '🎉 مرحباً {{name}}، تم استلام طلبك رقم *{{order_no}}* بنجاح. سنبدأ العمل عليه فوراً. تابع طلبك: {{link}}', '["name","order_no","link"]'::jsonb),
('order_status_changed', 'تحديث حالة الطلب', 'مرحباً {{name}}، تم تحديث حالة طلبك *{{order_no}}* إلى: *{{status}}*. التفاصيل: {{link}}', '["name","order_no","status","link"]'::jsonb),
('order_delivered', 'تسليم الطلب', '✅ {{name}}، تم تسليم طلبك *{{order_no}}*. شكراً لثقتك بمنصة فكرة إيدو.', '["name","order_no"]'::jsonb),
('invoice_new', 'فاتورة جديدة', '🧾 {{name}}، صدرت فاتورتك رقم *{{invoice_no}}* بقيمة {{amount}} ريال. للدفع: {{link}}', '["name","invoice_no","amount","link"]'::jsonb),
('invoice_reminder', 'تذكير دفع', '⏰ {{name}}، تذكير لطيف بفاتورتك *{{invoice_no}}* بقيمة {{amount}} ريال. الدفع: {{link}}', '["name","invoice_no","amount","link"]'::jsonb),
('invoice_paid', 'تأكيد دفع', '✅ {{name}}، استلمنا دفعتك للفاتورة *{{invoice_no}}* بقيمة {{amount}} ريال. شكراً لك.', '["name","invoice_no","amount"]'::jsonb),
('contract_invite', 'دعوة توقيع عقد', '📄 {{name}}، لديك عقد جديد بانتظار توقيعك: *{{contract_no}}*. للاطلاع والتوقيع: {{link}}', '["name","contract_no","link"]'::jsonb),
('contract_signed', 'تأكيد توقيع عقد', '✅ {{name}}، تم توقيع العقد *{{contract_no}}* بنجاح. نسخة العقد: {{link}}', '["name","contract_no","link"]'::jsonb),
('otp_login', 'رمز التحقق', '🔐 رمز التحقق الخاص بك: *{{code}}*. صالح لمدة 10 دقائق. لا تشاركه مع أحد.', '["code"]'::jsonb)
ON CONFLICT (event_key) DO NOTHING;

-- سجل الإرسال
CREATE TABLE IF NOT EXISTS public.whatsapp_send_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_phone TEXT NOT NULL,
  event_key TEXT,
  message_body TEXT,
  variables JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'queued',
  provider_message_id TEXT,
  error_message TEXT,
  user_id UUID,
  related_entity_type TEXT,
  related_entity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wa_log_created ON public.whatsapp_send_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_log_status ON public.whatsapp_send_log(status);
CREATE INDEX IF NOT EXISTS idx_wa_log_phone ON public.whatsapp_send_log(to_phone);

ALTER TABLE public.whatsapp_send_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view whatsapp logs"
ON public.whatsapp_send_log FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role inserts whatsapp logs"
ON public.whatsapp_send_log FOR INSERT
WITH CHECK (true);

-- رموز OTP عبر واتساب
CREATE TABLE IF NOT EXISTS public.whatsapp_otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  purpose TEXT NOT NULL DEFAULT 'login',
  attempts INT NOT NULL DEFAULT 0,
  used BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address TEXT
);

CREATE INDEX IF NOT EXISTS idx_wa_otp_phone ON public.whatsapp_otp_codes(phone, used);
CREATE INDEX IF NOT EXISTS idx_wa_otp_expires ON public.whatsapp_otp_codes(expires_at);

ALTER TABLE public.whatsapp_otp_codes ENABLE ROW LEVEL SECURITY;

-- لا قراءة من العميل، الكل عبر edge functions
CREATE POLICY "Admins view otp codes"
ON public.whatsapp_otp_codes FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- trigger لتحديث updated_at
CREATE TRIGGER update_whatsapp_settings_updated_at
BEFORE UPDATE ON public.whatsapp_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_templates_updated_at
BEFORE UPDATE ON public.whatsapp_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
