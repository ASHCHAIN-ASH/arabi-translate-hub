CREATE OR REPLACE FUNCTION public.handle_receipt_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_app          public.financing_applications%ROWTYPE;
  v_wallet_id    uuid;
  v_balance_before numeric;
  v_balance_after  numeric;
  v_credit       numeric;
BEGIN
  -- Only act when transitioning to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT * INTO v_app FROM public.financing_applications WHERE id = NEW.application_id;
    IF NOT FOUND THEN RETURN NEW; END IF;

    -- Total financing amount goes into the wallet (full amount, including down payment paid)
    v_credit := COALESCE(v_app.total_amount, NEW.amount);

    -- Activate financing application
    UPDATE public.financing_applications
       SET status = 'active', updated_at = now()
     WHERE id = v_app.id;

    -- Ensure wallet exists, then credit it atomically
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
         'تمويل Master PayLater — تم إضافة مبلغ التمويل بعد اعتماد الدفعة الأولى',
         'financing_application', v_app.id, 'SAR',
         CASE WHEN NEW.payment_method = 'wallet' THEN 'wallet' ELSE 'bank_transfer' END);
    EXCEPTION WHEN OTHERS THEN
      -- log but don't block approval
      RAISE NOTICE 'Wallet credit failed for app %: %', v_app.id, SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_receipt_approval ON public.financing_payment_receipts;
CREATE TRIGGER trg_receipt_approval
BEFORE UPDATE ON public.financing_payment_receipts
FOR EACH ROW
EXECUTE FUNCTION public.handle_receipt_approval();