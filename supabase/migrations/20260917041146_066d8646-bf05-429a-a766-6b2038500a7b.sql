CREATE OR REPLACE FUNCTION public.notify_referrer_via_whatsapp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  referrer_phone text;
  referrer_name text;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT phone, name INTO referrer_phone, referrer_name
    FROM public.customers WHERE user_id = NEW.referrer_id;
    IF referrer_phone IS NOT NULL THEN
      PERFORM net.http_post(
        url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/send-whatsapp',
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body := jsonb_build_object(
          'to', referrer_phone,
          'message', '🎉 مبروك ' || COALESCE(referrer_name, '') || '! تمت الموافقة على إحالتك وحصلت على ' || NEW.reward_amount || ' نقطة. شكراً لثقتك بمنصة FekrahEdu 🌟'
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trg_whatsapp_contract_invite()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.client_phone IS NOT NULL AND NEW.verification_token IS NOT NULL THEN
    PERFORM public.enqueue_whatsapp_notification(
      'contract_invite', NEW.client_phone, NEW.client_name,
      jsonb_build_object('contract_number', NEW.contract_number, 'link', 'https://fekrahedu.com/contracts/sign/' || NEW.verification_token),
      NEW.id, NEW.client_id
    );
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trg_whatsapp_contract_signed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_contract public.contracts;
BEGIN
  IF NEW.signed_by_client = true AND COALESCE(OLD.signed_by_client, false) = false THEN
    SELECT * INTO v_contract FROM public.contracts WHERE id = NEW.contract_id;
    IF v_contract.client_phone IS NOT NULL THEN
      PERFORM public.enqueue_whatsapp_notification(
        'contract_signed', v_contract.client_phone, v_contract.client_name,
        jsonb_build_object('contract_number', v_contract.contract_number, 'link', 'https://fekrahedu.com/contracts/view/' || v_contract.id::text),
        v_contract.id, v_contract.client_id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trg_whatsapp_order_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.client_phone IS NOT NULL THEN
    PERFORM public.enqueue_whatsapp_notification(
      'order_created', NEW.client_phone, NEW.client_name,
      jsonb_build_object('order_number', COALESCE(NEW.order_number, NEW.id::text), 'link', 'https://fekrahedu.com/orders/' || NEW.id::text),
      NEW.id, NEW.client_id
    );
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.trg_whatsapp_order_status_changed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_event text;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.client_phone IS NOT NULL THEN
    v_event := CASE NEW.status
      WHEN 'in_progress' THEN 'order_in_progress'
      WHEN 'completed' THEN 'order_completed'
      WHEN 'cancelled' THEN 'order_cancelled'
      ELSE NULL
    END;
    IF v_event IS NOT NULL THEN
      PERFORM public.enqueue_whatsapp_notification(
        v_event, NEW.client_phone, NEW.client_name,
        jsonb_build_object('order_number', COALESCE(NEW.order_number, NEW.id::text), 'link', 'https://fekrahedu.com/orders/' || NEW.id::text),
        NEW.id, NEW.client_id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;