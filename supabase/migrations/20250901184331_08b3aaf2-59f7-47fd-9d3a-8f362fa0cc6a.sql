-- إنشاء جدول قوالب البريد الإلكتروني
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_type TEXT NOT NULL DEFAULT 'notification', -- notification, welcome, invoice, contract, etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  variables TEXT[] DEFAULT ARRAY[]::TEXT[], -- متغيرات القالب مثل {name}, {email}, {amount}
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول سجل البريد الإلكتروني المرسل
CREATE TABLE public.email_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  sender_email TEXT NOT NULL DEFAULT 'info@fekrahedu.com',
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_id UUID REFERENCES email_templates(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed, delivered
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول الردود التلقائية
CREATE TABLE public.auto_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_type TEXT NOT NULL, -- contact_form, service_request, newsletter_signup, etc.
  template_id UUID REFERENCES email_templates(id) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  delay_minutes INTEGER DEFAULT 0, -- تأخير الرد بالدقائق
  conditions JSONB DEFAULT '{}', -- شروط إضافية للرد التلقائي
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تمكين RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_replies ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان لقوالب البريد الإلكتروني
CREATE POLICY "المديرون يمكنهم إدارة قوالب البريد الإلكتروني"
ON public.email_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "الجميع يمكنهم قراءة القوالب النشطة"
ON public.email_templates
FOR SELECT
USING (is_active = true);

-- سياسات الأمان لسجل البريد الإلكتروني
CREATE POLICY "المديرون يمكنهم مشاهدة جميع سجلات البريد"
ON public.email_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "النظام يمكنه إدراج سجلات البريد"
ON public.email_logs
FOR INSERT
WITH CHECK (true);

-- سياسات الأمان للردود التلقائية
CREATE POLICY "المديرون يمكنهم إدارة الردود التلقائية"
ON public.auto_replies
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- إنشاء فهارس للأداء
CREATE INDEX idx_email_templates_type ON email_templates(template_type);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX idx_auto_replies_trigger ON auto_replies(trigger_type);
CREATE INDEX idx_auto_replies_active ON auto_replies(is_active);

-- دالة لتحديث updated_at
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_auto_replies_updated_at
BEFORE UPDATE ON public.auto_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- إدراج قوالب افتراضية
INSERT INTO public.email_templates (name, subject, content, template_type, variables) VALUES
(
  'رسالة ترحيب',
  'مرحباً بك في موقع ماستر التعليمي',
  '<h1>أهلاً وسهلاً {name}</h1>
  <p>نشكرك لانضمامك إلى موقع ماستر التعليمي. نحن سعداء لوجودك معنا!</p>
  <p>يمكنك الآن الاستفادة من جميع خدماتنا التعليمية والترجمة.</p>
  <p>مع أطيب التحيات،<br>فريق ماستر التعليمي</p>',
  'welcome',
  ARRAY['name']
),
(
  'تأكيد طلب الخدمة',
  'تم استلام طلبك - رقم {order_number}',
  '<h1>تم استلام طلبك بنجاح</h1>
  <p>عزيزي/عزيزتي {name}،</p>
  <p>تم استلام طلبك رقم <strong>{order_number}</strong> بنجاح.</p>
  <p><strong>تفاصيل الطلب:</strong></p>
  <ul>
    <li>نوع الخدمة: {service_type}</li>
    <li>المبلغ: {amount} ريال سعودي</li>
    <li>تاريخ التسليم المتوقع: {delivery_date}</li>
  </ul>
  <p>سيتم التواصل معك قريباً لتأكيد التفاصيل.</p>
  <p>مع أطيب التحيات،<br>فريق ماستر التعليمي</p>',
  'order_confirmation',
  ARRAY['name', 'order_number', 'service_type', 'amount', 'delivery_date']
),
(
  'رد تلقائي للتواصل',
  'شكراً لتواصلك معنا',
  '<h1>شكراً لك على رسالتك</h1>
  <p>عزيزي/عزيزتي {name}،</p>
  <p>تم استلام رسالتك بنجاح. سيقوم فريقنا بالرد عليك خلال 24 ساعة.</p>
  <p>إذا كان الأمر عاجلاً، يمكنك التواصل معنا على:</p>
  <ul>
    <li>الهاتف: +966 50 123 4567</li>
    <li>البريد الإلكتروني: info@fekrahedu.com</li>
  </ul>
  <p>مع أطيب التحيات،<br>فريق ماستر التعليمي</p>',
  'contact_auto_reply',
  ARRAY['name']
);

-- إدراج ردود تلقائية افتراضية
INSERT INTO public.auto_replies (trigger_type, template_id, is_active) VALUES
('contact_form', (SELECT id FROM email_templates WHERE template_type = 'contact_auto_reply' LIMIT 1), true),
('newsletter_signup', (SELECT id FROM email_templates WHERE template_type = 'welcome' LIMIT 1), true);