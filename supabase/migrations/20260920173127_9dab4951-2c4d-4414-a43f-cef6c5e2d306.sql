CREATE TABLE IF NOT EXISTS public.internal_tokens (
  name text PRIMARY KEY,
  token text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.internal_tokens ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.internal_tokens FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.internal_tokens TO service_role;

INSERT INTO public.internal_tokens(name, token)
VALUES ('ticket_notify', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (name) DO NOTHING;
INSERT INTO public.internal_tokens(name, token)
VALUES ('admin_whatsapp', '966593799355')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.whatsapp_templates (event_key, title, body_text, variables, is_active) VALUES
 ('ticket_created', 'فتح تذكرة دعم', '🎫 *مركز دعم FekrahEdu*', '["name","ticket_number","subject"]'::jsonb, true),
 ('ticket_status_changed', 'تغيير حالة التذكرة', '🎫 *مركز دعم FekrahEdu*', '["name","ticket_number","status"]'::jsonb, true),
 ('ticket_admin_reply', 'رد الإدارة على التذكرة', '🎫 *مركز دعم FekrahEdu*', '["name","ticket_number","message_preview"]'::jsonb, true),
 ('ticket_client_reply', 'رد العميل على التذكرة', '🎫 *مركز دعم FekrahEdu*', '["name","ticket_number","message_preview"]'::jsonb, true)
ON CONFLICT (event_key) DO NOTHING;

UPDATE public.whatsapp_settings
SET events_enabled = COALESCE(events_enabled, '{}'::jsonb)
  || jsonb_build_object('ticket_created', true, 'ticket_status_changed', true,
                        'ticket_admin_reply', true, 'ticket_client_reply', true)
WHERE id = 1;

CREATE OR REPLACE FUNCTION public.notify_ticket_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_event text;
  v_ticket_id uuid;
  v_message_id uuid;
  v_token text;
  v_old_status text;
  v_new_status text;
BEGIN
  IF TG_TABLE_NAME = 'tickets' AND TG_OP = 'INSERT' THEN
    v_event := 'ticket_created';
    v_ticket_id := NEW.id;
  ELSIF TG_TABLE_NAME = 'tickets' AND TG_OP = 'UPDATE' THEN
    BEGIN
      EXECUTE 'SELECT ($1).status, ($2).status' INTO v_old_status, v_new_status USING OLD, NEW;
    EXCEPTION WHEN OTHERS THEN
      v_old_status := NULL; v_new_status := NULL;
    END;
    IF v_old_status IS NOT DISTINCT FROM v_new_status THEN
      RETURN NEW;
    END IF;
    v_event := 'ticket_status_changed';
    v_ticket_id := NEW.id;
  ELSIF TG_TABLE_NAME = 'ticket_messages' AND TG_OP = 'INSERT' THEN
    v_event := CASE WHEN NEW.sender_type = 'admin' THEN 'ticket_admin_reply' ELSE 'ticket_client_reply' END;
    v_ticket_id := NEW.ticket_id;
    v_message_id := NEW.id;
  ELSE
    RETURN NEW;
  END IF;

  SELECT t.token INTO v_token FROM public.internal_tokens t WHERE t.name = 'ticket_notify';

  BEGIN
    PERFORM net.http_post(
      url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/ticket-notify',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-internal-token', COALESCE(v_token, '')
      ),
      body := jsonb_build_object(
        'event', v_event,
        'ticket_id', v_ticket_id,
        'message_id', v_message_id
      )
    );
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.notify_ticket_event() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_notify_ticket_created ON public.tickets;
DROP TRIGGER IF EXISTS trg_notify_ticket_status ON public.tickets;
DROP TRIGGER IF EXISTS trg_notify_ticket_admin_reply ON public.ticket_messages;

CREATE TRIGGER trg_ticket_notify_created
AFTER INSERT ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_event();

CREATE TRIGGER trg_ticket_notify_status
AFTER UPDATE OF status ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_event();

CREATE TRIGGER trg_ticket_notify_message
AFTER INSERT ON public.ticket_messages
FOR EACH ROW EXECUTE FUNCTION public.notify_ticket_event();