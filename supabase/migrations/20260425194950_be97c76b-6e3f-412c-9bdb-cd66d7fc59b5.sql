-- 1) Helper: compute referral commission balance for a user
CREATE OR REPLACE FUNCTION public.get_referral_commission_balance(_user_id uuid)
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.wallet_transactions
      WHERE user_id = _user_id
        AND reference_type = 'referral_commission'
        AND type = 'deposit'
    )
    -
    (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.wallet_transactions
      WHERE user_id = _user_id
        AND reference_type IN ('referral_withdrawal_request','referral_withdrawal')
        AND type = 'withdrawal'
    )
    +
    (
      -- refund any rejected referral withdrawals back to commission balance
      SELECT COALESCE(SUM(amount), 0)
      FROM public.wallet_transactions
      WHERE user_id = _user_id
        AND reference_type = 'referral_withdrawal_refund'
        AND type IN ('refund','deposit')
    ),
    0
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_referral_commission_balance(uuid) TO authenticated;

-- 2) Replace request_withdrawal to enforce commission-only source
CREATE OR REPLACE FUNCTION public.request_withdrawal(
  _amount numeric,
  _bank_name text,
  _account_holder_name text,
  _iban text,
  _notes text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_wallet_id UUID;
  v_wallet_balance NUMERIC;
  v_commission_balance NUMERIC;
  v_tx_id UUID;
  v_req_id UUID;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  IF _amount IS NULL OR _amount < 100 THEN
    RETURN jsonb_build_object('success', false, 'error', 'الحد الأدنى للسحب 100 ر.س');
  END IF;

  IF coalesce(trim(_bank_name),'')='' OR coalesce(trim(_account_holder_name),'')=''
     OR coalesce(trim(_iban),'')='' THEN
    RETURN jsonb_build_object('success', false, 'error', 'بيانات بنكية ناقصة');
  END IF;

  -- Lock wallet row
  SELECT id, balance INTO v_wallet_id, v_wallet_balance
  FROM public.wallets WHERE user_id = v_user FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'لا توجد محفظة');
  END IF;

  -- Commission-only balance check (the core fix)
  v_commission_balance := public.get_referral_commission_balance(v_user);

  IF v_commission_balance < _amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'يمكن سحب أرباح العمولات فقط — رصيد العمولات المتاح: ' || v_commission_balance::text || ' ر.س'
    );
  END IF;

  IF v_wallet_balance < _amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'الرصيد غير كافٍ');
  END IF;

  -- Create request
  INSERT INTO public.withdrawal_requests
    (user_id, amount, bank_name, account_holder_name, iban, notes)
  VALUES
    (v_user, _amount, trim(_bank_name), trim(_account_holder_name), trim(_iban), _notes)
  RETURNING id INTO v_req_id;

  -- Debit wallet (hold) — tagged as referral withdrawal so commission balance reflects the hold
  INSERT INTO public.wallet_transactions
    (wallet_id, user_id, type, amount, description, reference_type, reference_id)
  VALUES
    (v_wallet_id, v_user, 'withdrawal', _amount,
     'طلب سحب أرباح العمولات إلى ' || trim(_bank_name),
     'referral_withdrawal_request', v_req_id)
  RETURNING id INTO v_tx_id;

  UPDATE public.withdrawal_requests
     SET hold_transaction_id = v_tx_id
   WHERE id = v_req_id;

  RETURN jsonb_build_object('success', true, 'request_id', v_req_id);
END;
$$;