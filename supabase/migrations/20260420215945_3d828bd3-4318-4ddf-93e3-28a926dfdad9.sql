-- Send instant WhatsApp notification to referrer when commission is rewarded
CREATE OR REPLACE FUNCTION public.notify_referrer_via_whatsapp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_phone text;
  v_referred_name text;
  v_supabase_url text;
  v_service_key text;
  v_message text;
BEGIN
  -- Only fire when status transitions to 'rewarded'
  IF NEW.status <> 'rewarded' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'rewarded' THEN
    RETURN NEW;
  END IF;

  -- Get referrer phone (try customers first, then auth metadata via profile)
  SELECT phone INTO v_phone
  FROM public.customers
  WHERE user_id = NEW.referrer_user_id
    AND phone IS NOT NULL AND phone <> ''
  LIMIT 1;

  IF v_phone IS NULL OR v_phone = '' THEN
    RAISE WARNING 'notify_referrer_via_whatsapp: no phone for referrer %', NEW.referrer_user_id;
    RETURN NEW;
  END IF;

  -- Get referred user name
  SELECT name INTO v_referred_name
  FROM public.customers
  WHERE user_id = NEW.referred_user_id
  LIMIT 1;

  v_referred_name := COALESCE(v_referred_name, 'عضو جديد');

  -- Build message
  v_message := '🎁 *عمولة إحالة جديدة!*' || E'\n\n' ||
               'تهانينا! تم إيداع *' || NEW.commission_amount || ' ر.س* في محفظتك.' || E'\n\n' ||
               '👤 العضو: ' || v_referred_name || E'\n' ||
               '💰 المبلغ: ' || NEW.commission_amount || ' ر.س' || E'\n\n' ||
               'يمكنك سحب رصيدك أو استخدامه في أي خدمة من المنصة.' || E'\n' ||
               'شكراً لثقتك بمنصة ماستر إيدو باث 🌟';

  -- Vault credentials
  SELECT decrypted_secret INTO v_supabase_url
  FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;
  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

  IF v_supabase_url IS NULL THEN
    v_supabase_url := 'https://kziujhdqogqeehtxgpax.supabase.co';
  END IF;

  IF v_service_key IS NULL THEN
    RAISE WARNING 'notify_referrer_via_whatsapp: service_role_key missing in vault';
    RETURN NEW;
  END IF;

  -- Async fire-and-forget WhatsApp dispatch
  PERFORM net.http_post(
    url := v_supabase_url || '/functions/v1/whatsapp-send',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_key,
      'apikey', v_service_key
    ),
    body := jsonb_build_object(
      'to', v_phone,
      'message', v_message,
      'event_key', 'referral_commission',
      'user_id', NEW.referrer_user_id,
      'related_entity_type', 'member_referral',
      'related_entity_id', NEW.id
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_referrer_via_whatsapp failed for referral %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_referrer_whatsapp ON public.member_referrals;
CREATE TRIGGER trg_notify_referrer_whatsapp
AFTER INSERT OR UPDATE OF status ON public.member_referrals
FOR EACH ROW
EXECUTE FUNCTION public.notify_referrer_via_whatsapp();