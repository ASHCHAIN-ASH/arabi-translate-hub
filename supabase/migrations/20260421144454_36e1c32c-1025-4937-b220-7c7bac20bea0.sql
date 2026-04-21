
CREATE TABLE public.research_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  request_number TEXT NOT NULL UNIQUE DEFAULT ('RP-' || to_char(now(), 'YYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
  title TEXT NOT NULL,
  field TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'ar',
  service_type TEXT NOT NULL DEFAULT 'publication',
  target_journal TEXT,
  journal_rank TEXT,
  abstract TEXT NOT NULL,
  keywords TEXT,
  authors TEXT,
  page_count INTEGER,
  file_url TEXT,
  notes TEXT,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT NOT NULL DEFAULT 'normal',
  estimated_amount NUMERIC(12,2),
  final_amount NUMERIC(12,2),
  expected_delivery_date DATE,
  admin_notes TEXT,
  assigned_to UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_research_pub_user ON public.research_publications(user_id);
CREATE INDEX idx_research_pub_status ON public.research_publications(status);

ALTER TABLE public.research_publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own research" ON public.research_publications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own research" ON public.research_publications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own pending research" ON public.research_publications
  FOR UPDATE USING (auth.uid() = user_id AND status IN ('new','draft'));
CREATE POLICY "Admins manage all research" ON public.research_publications
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.research_publication_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES public.research_publications(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL DEFAULT 'client',
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_research_msg_pub ON public.research_publication_messages(publication_id);
ALTER TABLE public.research_publication_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own publication messages" ON public.research_publication_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.research_publications p WHERE p.id = publication_id AND p.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );
CREATE POLICY "Users send messages on own publications" ON public.research_publication_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND (
      EXISTS (SELECT 1 FROM public.research_publications p WHERE p.id = publication_id AND p.user_id = auth.uid())
      OR public.has_role(auth.uid(), 'admin')
    )
  );

CREATE TRIGGER update_research_publications_updated_at
  BEFORE UPDATE ON public.research_publications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.notify_research_publication_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pub RECORD;
  v_event TEXT;
  v_supabase_url TEXT := 'https://kziujhdqogqeehtxgpax.supabase.co';
BEGIN
  IF TG_TABLE_NAME = 'research_publications' THEN
    IF TG_OP = 'INSERT' THEN
      v_event := 'research_publication_created';
      v_pub := NEW;
    ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
      v_event := 'research_publication_status_' || NEW.status;
      v_pub := NEW;
    ELSE
      RETURN NEW;
    END IF;
  ELSIF TG_TABLE_NAME = 'research_publication_messages' AND NEW.sender_type = 'admin' THEN
    SELECT * INTO v_pub FROM public.research_publications WHERE id = NEW.publication_id;
    v_event := 'research_publication_admin_reply';
  ELSE
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := v_supabase_url || '/functions/v1/research-publication-notify',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'event', v_event,
      'publication_id', v_pub.id,
      'phone', v_pub.client_phone,
      'client_name', v_pub.client_name,
      'request_number', v_pub.request_number,
      'title', v_pub.title,
      'status', v_pub.status,
      'message', CASE WHEN TG_TABLE_NAME = 'research_publication_messages' THEN NEW.message ELSE NULL END
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_research_pub_notify
  AFTER INSERT OR UPDATE ON public.research_publications
  FOR EACH ROW EXECUTE FUNCTION public.notify_research_publication_event();

CREATE TRIGGER trg_research_pub_msg_notify
  AFTER INSERT ON public.research_publication_messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_research_publication_event();

INSERT INTO public.whatsapp_templates (event_key, title, body_text, is_active) VALUES
  ('research_publication_created', 'إنشاء طلب نشر بحث', '🎓 مرحباً {{client_name}}،

تم استلام طلب نشر بحثك بنجاح ✅
📄 رقم الطلب: {{request_number}}
📚 عنوان البحث: {{title}}

سيتواصل معك فريقنا المتخصص خلال 24 ساعة لمناقشة التفاصيل وعرض السعر.

شكراً لثقتك بنا 🌟', true),
  ('research_publication_status_under_review', 'مراجعة طلب نشر', '📋 {{client_name}}،
طلب نشر بحثك ({{request_number}}) قيد المراجعة الآن من فريق الخبراء.
سنوافيك بالنتائج قريباً.', true),
  ('research_publication_status_quoted', 'عرض سعر النشر', '💼 {{client_name}}،
تم إعداد عرض السعر لطلبك ({{request_number}}).
يرجى الدخول للوحة التحكم لمراجعة العرض والموافقة عليه.', true),
  ('research_publication_status_approved', 'اعتماد طلب النشر', '✅ {{client_name}}،
تم اعتماد طلب نشر بحثك ({{request_number}}) وبدأ العمل عليه.
سنزودك بالتحديثات أولاً بأول.', true),
  ('research_publication_status_in_progress', 'تنفيذ نشر البحث', '⚙️ {{client_name}}،
العمل جارٍ على نشر بحثك ({{request_number}}).
سنرسل لك التحديثات في كل مرحلة.', true),
  ('research_publication_status_published', 'تم نشر البحث', '🎉 مبروك {{client_name}}!
تم نشر بحثك بنجاح ({{request_number}}) ✨
يمكنك تحميل شهادة النشر من لوحة التحكم.', true),
  ('research_publication_status_rejected', 'رفض طلب النشر', 'عذراً {{client_name}}،
نأسف لإبلاغك بأن طلبك ({{request_number}}) لم يُقبل حالياً.
يرجى التواصل معنا لمعرفة الأسباب وإمكانية التعديل.', true),
  ('research_publication_admin_reply', 'رد على طلب نشر', '💬 {{client_name}}،
لديك رسالة جديدة بخصوص طلب نشر بحثك ({{request_number}}):

"{{message}}"

للرد، يرجى الدخول إلى لوحة التحكم.', true)
ON CONFLICT (event_key) DO UPDATE SET body_text = EXCLUDED.body_text, title = EXCLUDED.title, is_active = true;

UPDATE public.whatsapp_settings
SET events_enabled = COALESCE(events_enabled, '{}'::jsonb) ||
  jsonb_build_object(
    'research_publication_created', true,
    'research_publication_status_under_review', true,
    'research_publication_status_quoted', true,
    'research_publication_status_approved', true,
    'research_publication_status_in_progress', true,
    'research_publication_status_published', true,
    'research_publication_status_rejected', true,
    'research_publication_admin_reply', true
  )
WHERE id = 1;
