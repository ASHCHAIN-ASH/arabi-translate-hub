CREATE OR REPLACE FUNCTION public.notify_whatsapp_event(
  _to text,
  _event_key text,
  _variables jsonb DEFAULT '{}'::jsonb,
  _related_entity_type text DEFAULT NULL::text,
  _related_entity_id text DEFAULT NULL::text,
  _user_id uuid DEFAULT NULL::uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions', 'net'
AS $function$
DECLARE
  v_url text;
  v_anon text;
  v_settings record;
BEGIN
  IF _to IS NULL OR length(trim(_to)) = 0 THEN RETURN; END IF;

  SELECT is_enabled, events_enabled INTO v_settings
  FROM public.whatsapp_settings WHERE id = 1;
  IF v_settings IS NULL OR v_settings.is_enabled IS NOT TRUE THEN RETURN; END IF;
  IF (v_settings.events_enabled ->> _event_key) = 'false' THEN RETURN; END IF;

  v_url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/whatsapp-send';
  v_anon := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';

  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_anon
    ),
    body := jsonb_build_object(
      'to', _to,
      'event_key', _event_key,
      'variables', _variables,
      'related_entity_type', _related_entity_type,
      'related_entity_id', _related_entity_id,
      'user_id', _user_id
    )
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_whatsapp_event failed: %', SQLERRM;
END $function$;