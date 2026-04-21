CREATE OR REPLACE FUNCTION public.notify_research_publication_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'net'
AS $function$
DECLARE
  v_pub RECORD;
  v_event TEXT;
  v_supabase_url TEXT := 'https://kziujhdqogqeehtxgpax.supabase.co';
  v_anon TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
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
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_anon
    ),
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
  RAISE WARNING 'notify_research_publication_event failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;