-- تحديث دالة الإشعار لتشمل execution_deed
CREATE OR REPLACE FUNCTION public.notify_financing_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_event text;
  v_url_wa  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-whatsapp-notify';
  v_url_em  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-email-notify';
  v_key     constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
  v_body    jsonb;
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status) THEN
    RETURN NEW;
  END IF;
  v_event := CASE NEW.status::text
    WHEN 'submitted' THEN 'submitted'
    WHEN 'documents_pending' THEN 'documents_pending'
    WHEN 'under_review' THEN 'under_review'
    WHEN 'contract_pending_signature' THEN 'contract_pending_signature'
    WHEN 'waiting_down_payment' THEN 'waiting_down_payment'
    WHEN 'approved' THEN 'approved'
    WHEN 'execution_deed' THEN 'execution_deed'
    WHEN 'active' THEN 'active'
    WHEN 'completed' THEN 'completed'
    WHEN 'rejected' THEN 'rejected'
    WHEN 'cancelled' THEN 'cancelled'
    WHEN 'overdue' THEN 'installment_overdue'
    ELSE 'status_update'
  END;
  IF NEW.status::text = 'draft' THEN RETURN NEW; END IF;

  v_body := jsonb_build_object(
    'application_id', NEW.id,
    'event', v_event,
    'extra', jsonb_build_object(
      'new_status', NEW.status,
      'old_status', CASE WHEN TG_OP='UPDATE' THEN OLD.status ELSE NULL END
    )
  );

  IF NEW.applicant_phone IS NOT NULL AND length(trim(NEW.applicant_phone)) > 0 THEN
    PERFORM net.http_post(
      url := v_url_wa,
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key),
      body := v_body
    );
  END IF;

  IF NEW.applicant_email IS NOT NULL AND length(trim(NEW.applicant_email)) > 0 THEN
    PERFORM net.http_post(
      url := v_url_em,
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key),
      body := v_body
    );
  END IF;

  RETURN NEW;
END;
$function$;