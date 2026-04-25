CREATE OR REPLACE FUNCTION public.notify_ticket_whatsapp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_phone text;
  v_name text;
  v_ticket public.tickets%ROWTYPE;
  v_template text;
  v_vars jsonb;
  v_should_send boolean := false;
  v_supabase_url text := 'https://kziujhdqogqeehtxgpax.supabase.co';
  v_service_key text;
  v_old_status text;
  v_new_status text;
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
  ELSIF TG_TABLE_NAME = 'tickets' AND TG_OP = 'UPDATE' THEN
    -- استخراج الحقول داخل بلوك آمن لتجنب أخطاء record OLD على سياقات أخرى
    BEGIN
      EXECUTE 'SELECT ($1).status, ($2).status' INTO v_old_status, v_new_status USING OLD, NEW;
    EXCEPTION WHEN OTHERS THEN
      v_old_status := NULL; v_new_status := NULL;
    END;
    IF v_old_status IS DISTINCT FROM v_new_status
       AND v_new_status IN ('resolved','in_progress','waiting') THEN
      v_template := 'ticket_status_changed';
      v_vars := jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا الكريم'),
        'ticket_number', v_ticket.ticket_number,
        'subject', v_ticket.subject,
        'status', CASE v_new_status
          WHEN 'resolved' THEN 'تم الحل ✅'
          WHEN 'in_progress' THEN 'قيد المعالجة 🔧'
          WHEN 'waiting' THEN 'بانتظار ردك ⏳'
          ELSE v_new_status
        END
      );
      v_should_send := true;
    END IF;
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
$function$;