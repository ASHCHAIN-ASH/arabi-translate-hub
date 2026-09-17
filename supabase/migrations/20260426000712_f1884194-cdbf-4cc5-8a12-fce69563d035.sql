-- 1) Update notify_financing_status_change to ALSO call email function
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
    WHEN 'active' THEN 'active'
    WHEN 'rejected' THEN 'rejected'
    WHEN 'cancelled' THEN 'cancelled'
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

  -- WhatsApp (only if phone present)
  IF NEW.applicant_phone IS NOT NULL AND length(trim(NEW.applicant_phone)) > 0 THEN
    PERFORM net.http_post(
      url := v_url_wa,
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key),
      body := v_body
    );
  END IF;

  -- Email (only if email present)
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

-- 2) Update receipt approval to fire a "down_payment_received" event before status flips to active
CREATE OR REPLACE FUNCTION public.handle_receipt_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_app          public.financing_applications%ROWTYPE;
  v_wallet_id    uuid;
  v_balance_before numeric;
  v_balance_after  numeric;
  v_credit       numeric;
  v_url_wa  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-whatsapp-notify';
  v_url_em  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-email-notify';
  v_key     constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
  v_body    jsonb;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT * INTO v_app FROM public.financing_applications WHERE id = NEW.application_id;
    IF NOT FOUND THEN RETURN NEW; END IF;

    -- Notify "down payment received" BEFORE flipping to active (active fires its own message)
    v_body := jsonb_build_object(
      'application_id', v_app.id,
      'event', 'down_payment_received',
      'extra', jsonb_build_object(
        'receipt_id', NEW.id,
        'receipt_amount', NEW.amount,
        'payment_method', NEW.payment_method
      )
    );
    BEGIN
      PERFORM net.http_post(url := v_url_wa, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
      PERFORM net.http_post(url := v_url_em, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    EXCEPTION WHEN OTHERS THEN NULL; END;

    v_credit := COALESCE(v_app.total_amount, NEW.amount);

    UPDATE public.financing_applications
       SET status = 'active', updated_at = now()
     WHERE id = v_app.id;

    BEGIN
      INSERT INTO public.wallets (user_id, balance, total_deposited)
      VALUES (v_app.user_id, 0, 0)
      ON CONFLICT (user_id) DO NOTHING;

      SELECT id, balance INTO v_wallet_id, v_balance_before
        FROM public.wallets WHERE user_id = v_app.user_id FOR UPDATE;

      v_balance_after := COALESCE(v_balance_before, 0) + v_credit;

      UPDATE public.wallets
         SET balance = v_balance_after,
             total_deposited = COALESCE(total_deposited, 0) + v_credit,
             updated_at = now()
       WHERE id = v_wallet_id;

      INSERT INTO public.wallet_transactions
        (wallet_id, user_id, type, amount, balance_before, balance_after,
         description, reference_type, reference_id, currency, payment_method)
      VALUES
        (v_wallet_id, v_app.user_id, 'financing_credit', v_credit,
         COALESCE(v_balance_before, 0), v_balance_after,
         'تمويل Fekrah PayLater — تم إضافة مبلغ التمويل بعد اعتماد الدفعة الأولى',
         'financing_application', v_app.id, 'SAR',
         CASE WHEN NEW.payment_method = 'wallet' THEN 'wallet' ELSE 'bank_transfer' END);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Wallet credit failed for app %: %', v_app.id, SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$function$;

-- 3) Trigger for installment overdue notifications
CREATE OR REPLACE FUNCTION public.notify_installment_overdue()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_url_wa  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-whatsapp-notify';
  v_url_em  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-email-notify';
  v_key     constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
  v_app_phone text;
  v_app_email text;
  v_app_id    uuid;
  v_body      jsonb;
  v_days      int;
BEGIN
  IF NEW.status = 'overdue' AND (OLD.status IS DISTINCT FROM 'overdue') THEN
    SELECT applicant_phone, applicant_email, id INTO v_app_phone, v_app_email, v_app_id
      FROM public.financing_applications WHERE id = NEW.application_id;
    v_days := GREATEST(0, (CURRENT_DATE - NEW.due_date)::int);
    v_body := jsonb_build_object(
      'application_id', v_app_id,
      'event', 'installment_overdue',
      'extra', jsonb_build_object(
        'installment_id', NEW.id,
        'installment_number', NEW.month_number,
        'installment_amount', NEW.amount,
        'installment_due_date', NEW.due_date,
        'days_overdue', v_days
      )
    );
    IF v_app_phone IS NOT NULL AND length(trim(v_app_phone)) > 0 THEN
      PERFORM net.http_post(url := v_url_wa, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    END IF;
    IF v_app_email IS NOT NULL AND length(trim(v_app_email)) > 0 THEN
      PERFORM net.http_post(url := v_url_em, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_installment_overdue ON public.financing_installments;
CREATE TRIGGER trg_installment_overdue
AFTER UPDATE ON public.financing_installments
FOR EACH ROW EXECUTE FUNCTION public.notify_installment_overdue();

-- 4) Function to send pre-due reminders (called by cron — to be scheduled separately)
CREATE OR REPLACE FUNCTION public.send_due_installment_reminders()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_url_wa  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-whatsapp-notify';
  v_url_em  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-email-notify';
  v_key     constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
  r record;
  v_count int := 0;
  v_body  jsonb;
BEGIN
  FOR r IN
    SELECT i.id, i.month_number, i.amount, i.due_date, a.id AS app_id, a.applicant_phone, a.applicant_email
    FROM public.financing_installments i
    JOIN public.financing_applications a ON a.id = i.application_id
    WHERE i.status = 'pending'
      AND i.due_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '3 days')
  LOOP
    v_body := jsonb_build_object(
      'application_id', r.app_id,
      'event', 'installment_reminder',
      'extra', jsonb_build_object(
        'installment_id', r.id,
        'installment_number', r.month_number,
        'installment_amount', r.amount,
        'installment_due_date', r.due_date
      )
    );
    IF r.applicant_phone IS NOT NULL AND length(trim(r.applicant_phone)) > 0 THEN
      PERFORM net.http_post(url := v_url_wa, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    END IF;
    IF r.applicant_email IS NOT NULL AND length(trim(r.applicant_email)) > 0 THEN
      PERFORM net.http_post(url := v_url_em, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    END IF;
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$function$;