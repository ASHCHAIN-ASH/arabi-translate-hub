
-- 1) Add auto_debit + AI fields to financing_applications
ALTER TABLE public.financing_applications
  ADD COLUMN IF NOT EXISTS auto_debit_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS ai_risk_score integer,
  ADD COLUMN IF NOT EXISTS ai_risk_analysis jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_scored_at timestamptz;

-- 2) Add OCR-extracted data to financing_documents
ALTER TABLE public.financing_documents
  ADD COLUMN IF NOT EXISTS ai_extracted_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_extracted_at timestamptz;

-- 3) Atomic function to pay an installment from the user's wallet
CREATE OR REPLACE FUNCTION public.pay_installment_from_wallet(
  p_installment_id uuid,
  p_user_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inst record;
  v_app record;
  v_wallet record;
  v_tx_id uuid;
  v_remaining numeric;
BEGIN
  -- Lock installment row
  SELECT * INTO v_inst FROM public.financing_installments
  WHERE id = p_installment_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'installment_not_found');
  END IF;

  IF v_inst.status = 'paid' THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_paid');
  END IF;

  -- Verify ownership via application
  SELECT * INTO v_app FROM public.financing_applications
  WHERE id = v_inst.application_id;
  IF v_app.user_id <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  -- Lock wallet row
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'wallet_not_found');
  END IF;

  IF v_wallet.balance < v_inst.amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_balance',
      'required', v_inst.amount,
      'available', v_wallet.balance
    );
  END IF;

  -- Insert wallet transaction (withdrawal)
  INSERT INTO public.wallet_transactions (
    wallet_id, user_id, type, amount, description,
    reference_type, reference_id
  ) VALUES (
    v_wallet.id, p_user_id, 'withdrawal', v_inst.amount,
    'سداد قسط رقم ' || v_inst.month_number || ' من تمويل #' || substring(v_app.id::text, 1, 8),
    'financing_installment', v_inst.id
  ) RETURNING id INTO v_tx_id;

  -- Mark installment paid
  UPDATE public.financing_installments
  SET status = 'paid',
      paid_at = now(),
      paid_amount = v_inst.amount,
      wallet_transaction_id = v_tx_id
  WHERE id = v_inst.id;

  -- Update application remaining_amount
  UPDATE public.financing_applications
  SET remaining_amount = GREATEST(0, remaining_amount - v_inst.amount),
      updated_at = now()
  WHERE id = v_app.id
  RETURNING remaining_amount INTO v_remaining;

  -- If fully paid, mark application completed
  IF v_remaining <= 0 THEN
    UPDATE public.financing_applications
    SET status = 'completed'::financing_status
    WHERE id = v_app.id AND status = 'active'::financing_status;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_tx_id,
    'remaining_amount', v_remaining
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.pay_installment_from_wallet(uuid, uuid) TO authenticated;

-- 4) Function the cron will call: process due auto-debit installments
CREATE OR REPLACE FUNCTION public.process_auto_debit_installments()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inst record;
  v_result jsonb;
  v_processed int := 0;
  v_succeeded int := 0;
  v_failed int := 0;
BEGIN
  FOR v_inst IN
    SELECT i.id, i.application_id, a.user_id
    FROM public.financing_installments i
    JOIN public.financing_applications a ON a.id = i.application_id
    WHERE i.status = 'pending'
      AND i.due_date <= CURRENT_DATE
      AND a.auto_debit_enabled = true
      AND a.status = 'active'::financing_status
    LIMIT 200
  LOOP
    v_processed := v_processed + 1;
    BEGIN
      v_result := public.pay_installment_from_wallet(v_inst.id, v_inst.user_id);
      IF (v_result->>'success')::boolean THEN
        v_succeeded := v_succeeded + 1;
      ELSE
        v_failed := v_failed + 1;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_failed := v_failed + 1;
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'processed', v_processed,
    'succeeded', v_succeeded,
    'failed', v_failed,
    'run_at', now()
  );
END;
$$;

-- 5) Schedule daily auto-debit at 8:00 AM KSA (5:00 UTC)
DO $$
DECLARE
  v_jobid bigint;
BEGIN
  SELECT jobid INTO v_jobid FROM cron.job WHERE jobname = 'financing-auto-debit-daily';
  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;
  PERFORM cron.schedule(
    'financing-auto-debit-daily',
    '0 5 * * *',
    $cron$ SELECT public.process_auto_debit_installments(); $cron$
  );
END$$;
