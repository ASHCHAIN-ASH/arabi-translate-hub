-- Create lifecycle email dispatcher: enqueues a transactional email
-- whenever lifecycle_status changes on service_orders
CREATE OR REPLACE FUNCTION public.dispatch_lifecycle_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_supabase_url TEXT;
  v_service_key TEXT;
  v_recipient TEXT;
  v_client_name TEXT;
  v_service_name TEXT;
  v_status_label TEXT;
  v_status_emoji TEXT;
  v_event_type TEXT := 'status';
  v_idempotency TEXT;
  v_payload JSONB;
BEGIN
  -- Only dispatch on lifecycle_status changes
  IF TG_OP = 'UPDATE' AND (OLD.lifecycle_status IS NOT DISTINCT FROM NEW.lifecycle_status) THEN
    RETURN NEW;
  END IF;

  -- Resolve recipient from customers table
  SELECT c.email, c.name
    INTO v_recipient, v_client_name
  FROM public.customers c
  WHERE c.id = NEW.customer_id;

  IF v_recipient IS NULL OR v_recipient = '' THEN
    RETURN NEW;
  END IF;

  -- Service name
  SELECT s.name INTO v_service_name
  FROM public.services s
  WHERE s.id = NEW.service_id;

  -- Map status -> arabic label + emoji + event type
  CASE NEW.lifecycle_status::text
    WHEN 'received' THEN v_status_label := 'مستلم'; v_status_emoji := '📥';
    WHEN 'reviewing' THEN v_status_label := 'قيد المراجعة'; v_status_emoji := '🔍';
    WHEN 'quote_sent' THEN v_status_label := 'تم إرسال عرض السعر'; v_status_emoji := '💰'; v_event_type := 'quote';
    WHEN 'quote_accepted' THEN v_status_label := 'تم قبول العرض'; v_status_emoji := '✅';
    WHEN 'contract_pending' THEN v_status_label := 'بانتظار توقيع العقد'; v_status_emoji := '📝';
    WHEN 'contract_signed' THEN v_status_label := 'تم توقيع العقد'; v_status_emoji := '✍️';
    WHEN 'payment_pending' THEN v_status_label := 'بانتظار الدفع'; v_status_emoji := '💳';
    WHEN 'payment_received' THEN v_status_label := 'تم استلام الدفعة'; v_status_emoji := '💵';
    WHEN 'in_progress' THEN v_status_label := 'قيد التنفيذ'; v_status_emoji := '⚡';
    WHEN 'delivered' THEN v_status_label := 'تم التسليم'; v_status_emoji := '📦'; v_event_type := 'completed';
    WHEN 'completed' THEN v_status_label := 'مكتمل'; v_status_emoji := '🎉'; v_event_type := 'completed';
    WHEN 'cancelled' THEN v_status_label := 'ملغي'; v_status_emoji := '❌';
    ELSE v_status_label := NEW.lifecycle_status::text; v_status_emoji := '📌';
  END CASE;

  v_idempotency := 'lifecycle-' || NEW.id::text || '-' || NEW.lifecycle_status::text;

  v_payload := jsonb_build_object(
    'templateName', 'order-update',
    'recipientEmail', v_recipient,
    'idempotencyKey', v_idempotency,
    'templateData', jsonb_build_object(
      'clientName', v_client_name,
      'trackingId', COALESCE(NEW.order_number, NEW.id::text),
      'serviceName', v_service_name,
      'newStatusLabel', v_status_label,
      'statusEmoji', v_status_emoji,
      'eventType', v_event_type
    )
  );

  -- Fetch URL + key from vault
  SELECT decrypted_secret INTO v_supabase_url
  FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;
  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

  -- Fallback to hardcoded URL if vault missing
  IF v_supabase_url IS NULL THEN
    v_supabase_url := 'https://kziujhdqogqeehtxgpax.supabase.co';
  END IF;

  IF v_service_key IS NULL THEN
    -- Cannot dispatch without service key; log and skip
    RAISE WARNING 'dispatch_lifecycle_email: service_role_key not in vault, skipping email for order %', NEW.id;
    RETURN NEW;
  END IF;

  -- Async HTTP call via pg_net
  PERFORM net.http_post(
    url := v_supabase_url || '/functions/v1/send-transactional-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_key,
      'apikey', v_service_key
    ),
    body := v_payload
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'dispatch_lifecycle_email failed for order %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_dispatch_lifecycle_email ON public.service_orders;
CREATE TRIGGER trg_dispatch_lifecycle_email
AFTER INSERT OR UPDATE OF lifecycle_status ON public.service_orders
FOR EACH ROW
EXECUTE FUNCTION public.dispatch_lifecycle_email();