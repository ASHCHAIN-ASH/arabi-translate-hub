CREATE OR REPLACE FUNCTION public.notify_ticket_whatsapp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_phone text;
  v_name text;
  v_ticket public.tickets%ROWTYPE;
  v_template text;
  v_vars jsonb;
  v_should_send boolean := false;
  v_supabase_url text := 'https://kziujhdqogqeehtxgpax.supabase.co';
  v_service_key text;
BEGIN
  IF TG_TABLE_NAME = 'tickets' THEN
    v_ticket := NEW;
  ELSIF TG_TABLE_NAME = 'ticket_messages' THEN
    SELECT * INTO v_ticket FROM public.tickets WHERE id = NEW.ticket_id;
    IF NOT FOUND THEN RETURN NEW; END IF;
  END IF;

  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.customers c
  WHERE c.user_id = v_ticket.user_id
  ORDER BY c.created_at DESC
  LIMIT 1;

  IF v_phone IS NULL OR length(v_phone) < 8 THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'tickets' AND TG_OP = 'INSERT' THEN
    v_template := 'ticket_created';
    v_vars := jsonb_build_object(
      'name', COALESCE(v_name, 'عميلنا الكريم'),
      'ticket_number', v_ticket.ticket_number,
      'subject', v_ticket.subject
    );
    v_should_send := true;
  ELSIF TG_TABLE_NAME = 'tickets' AND TG_OP = 'UPDATE'
        AND OLD.status IS DISTINCT FROM NEW.status
        AND NEW.status IN ('resolved', 'in_progress', 'waiting') THEN
    v_template := 'ticket_status_changed';
    v_vars := jsonb_build_object(
      'name', COALESCE(v_name, 'عميلنا الكريم'),
      'ticket_number', v_ticket.ticket_number,
      'subject', v_ticket.subject,
      'status', CASE NEW.status
        WHEN 'resolved' THEN 'تم الحل ✅'
        WHEN 'in_progress' THEN 'قيد المعالجة 🔧'
        WHEN 'waiting' THEN 'بانتظار ردك ⏳'
        ELSE NEW.status
      END
    );
    v_should_send := true;
  ELSIF TG_TABLE_NAME = 'ticket_messages' AND TG_OP = 'INSERT'
        AND NEW.sender_type = 'admin' THEN
    v_template := 'ticket_admin_reply';
    v_vars := jsonb_build_object(
      'name', COALESCE(v_name, 'عميلنا الكريم'),
      'ticket_number', v_ticket.ticket_number,
      'subject', v_ticket.subject,
      'message_preview', LEFT(NEW.content, 120)
    );
    v_should_send := true;
  END IF;

  IF v_should_send THEN
    BEGIN
      v_service_key := current_setting('app.settings.service_role_key', true);
      PERFORM net.http_post(
        url := v_supabase_url || '/functions/v1/send-whatsapp',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || COALESCE(v_service_key, '')
        ),
        body := jsonb_build_object(
          'to', v_phone,
          'template_name', v_template,
          'variables', v_vars,
          'language', 'ar'
        )
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_ticket_created ON public.tickets;
CREATE TRIGGER trg_notify_ticket_created
AFTER INSERT ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_whatsapp();

DROP TRIGGER IF EXISTS trg_notify_ticket_status ON public.tickets;
CREATE TRIGGER trg_notify_ticket_status
AFTER UPDATE OF status ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_whatsapp();

DROP TRIGGER IF EXISTS trg_notify_ticket_admin_reply ON public.ticket_messages;
CREATE TRIGGER trg_notify_ticket_admin_reply
AFTER INSERT ON public.ticket_messages
FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_whatsapp();

INSERT INTO public.whatsapp_templates (event_key, title, body_text, variables, is_active)
VALUES
  ('ticket_created', 'تذكرة دعم جديدة',
   E'مرحباً {{name}} 👋\n\nتم استلام تذكرتك بنجاح ✅\nرقم التذكرة: {{ticket_number}}\nالموضوع: {{subject}}\n\nسيتواصل معك فريق الدعم قريباً.\n— ماستر إدو باث',
   '["name","ticket_number","subject"]'::jsonb, true),
  ('ticket_admin_reply', 'رد جديد على تذكرتك',
   E'مرحباً {{name}} 💬\n\nلديك رد جديد على تذكرتك:\n🎫 {{ticket_number}} — {{subject}}\n\n"{{message_preview}}"\n\nافتح التذكرة من لوحة عميلك للرد.\n— ماستر إدو باث',
   '["name","ticket_number","subject","message_preview"]'::jsonb, true),
  ('ticket_status_changed', 'تحديث حالة التذكرة',
   E'مرحباً {{name}} 🔔\n\nتم تحديث حالة تذكرتك:\n🎫 {{ticket_number}} — {{subject}}\nالحالة الجديدة: {{status}}\n\n— ماستر إدو باث',
   '["name","ticket_number","subject","status"]'::jsonb, true)
ON CONFLICT (event_key) DO NOTHING;