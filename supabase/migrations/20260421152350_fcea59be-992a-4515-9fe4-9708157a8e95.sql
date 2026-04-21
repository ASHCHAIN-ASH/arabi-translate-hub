
-- Trigger function: mirror new research publication requests into the admin inbox
CREATE OR REPLACE FUNCTION public.research_publication_to_inbox()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.inbox_messages (
    sender_name, sender_email, sender_phone,
    subject, message, form_type, service_type, source_page,
    status, priority, metadata
  ) VALUES (
    COALESCE(NEW.client_name, 'عميل'),
    COALESCE(NEW.client_email, 'no-email@example.com'),
    NEW.client_phone,
    'طلب نشر بحث جديد: ' || COALESCE(NEW.title, NEW.request_number),
    COALESCE(NEW.abstract, NEW.notes, 'طلب نشر بحث - ' || NEW.request_number),
    'research_publication',
    COALESCE(NEW.service_type, 'research_publication'),
    '/client/research',
    'new',
    'high',
    jsonb_build_object(
      'publication_id', NEW.id,
      'request_number', NEW.request_number,
      'field', NEW.field,
      'language', NEW.language,
      'status', NEW.status
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'research_publication_to_inbox failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_research_publication_to_inbox ON public.research_publications;
CREATE TRIGGER trg_research_publication_to_inbox
AFTER INSERT ON public.research_publications
FOR EACH ROW
EXECUTE FUNCTION public.research_publication_to_inbox();

-- Backfill existing research publications that are not yet in inbox
INSERT INTO public.inbox_messages (
  sender_name, sender_email, sender_phone, subject, message,
  form_type, service_type, source_page, status, priority, metadata, created_at
)
SELECT
  COALESCE(rp.client_name, 'عميل'),
  COALESCE(rp.client_email, 'no-email@example.com'),
  rp.client_phone,
  'طلب نشر بحث: ' || COALESCE(rp.title, rp.request_number),
  COALESCE(rp.abstract, rp.notes, 'طلب نشر بحث - ' || rp.request_number),
  'research_publication',
  COALESCE(rp.service_type, 'research_publication'),
  '/client/research',
  CASE WHEN rp.status IN ('new','under_review') THEN 'new' ELSE 'replied' END,
  'high',
  jsonb_build_object(
    'publication_id', rp.id,
    'request_number', rp.request_number,
    'field', rp.field,
    'language', rp.language,
    'status', rp.status
  ),
  rp.created_at
FROM public.research_publications rp
WHERE NOT EXISTS (
  SELECT 1 FROM public.inbox_messages im
  WHERE im.metadata->>'publication_id' = rp.id::text
);
