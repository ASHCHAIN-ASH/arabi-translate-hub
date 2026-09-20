CREATE OR REPLACE FUNCTION public.get_active_membership(_user_id uuid)
 RETURNS TABLE(membership_id uuid, plan_id uuid, plan_code text, plan_name_ar text, discount_percentage numeric, cashback_amount numeric, priority_level integer, badge_color text, expires_at timestamp with time zone)
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT um.id, mp.id, mp.code, mp.name_ar, mp.discount_percentage,
         mp.cashback_amount, mp.priority_level, mp.badge_color, um.expires_at
  FROM public.user_memberships um
  JOIN public.membership_plans mp ON mp.id = um.plan_id
  WHERE um.user_id = _user_id
    AND (auth.uid() IS NULL OR _user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    AND um.status = 'active'
    AND (um.expires_at IS NULL OR um.expires_at > now())
  ORDER BY mp.priority_level DESC
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.get_referral_commission_balance(_user_id uuid)
 RETURNS numeric
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT CASE WHEN (auth.uid() IS NULL OR _user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')) THEN
  COALESCE(
    (
      SELECT COALESCE(SUM(amount), 0) FROM public.wallet_transactions
      WHERE user_id = _user_id AND reference_type = 'referral_commission' AND type = 'deposit'
    )
    -
    (
      SELECT COALESCE(SUM(amount), 0) FROM public.wallet_transactions
      WHERE user_id = _user_id AND reference_type IN ('referral_withdrawal_request','referral_withdrawal') AND type = 'withdrawal'
    )
    +
    (
      SELECT COALESCE(SUM(amount), 0) FROM public.wallet_transactions
      WHERE user_id = _user_id AND reference_type = 'referral_withdrawal_refund' AND type IN ('refund','deposit')
    ),
    0
  ) ELSE 0 END;
$function$;

CREATE OR REPLACE FUNCTION public.pay_installment_from_wallet(p_installment_id uuid, p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_inst record;
  v_app record;
  v_wallet record;
  v_tx_id uuid;
  v_remaining numeric;
BEGIN
  IF auth.uid() IS NOT NULL AND p_user_id <> auth.uid() AND NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT * INTO v_inst FROM public.financing_installments
  WHERE id = p_installment_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'installment_not_found');
  END IF;

  IF v_inst.status = 'paid' THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_paid');
  END IF;

  SELECT * INTO v_app FROM public.financing_applications
  WHERE id = v_inst.application_id;
  IF v_app.user_id <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'wallet_not_found');
  END IF;

  IF v_wallet.balance < v_inst.amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_balance',
      'required', v_inst.amount, 'available', v_wallet.balance);
  END IF;

  INSERT INTO public.wallet_transactions (
    wallet_id, user_id, type, amount, description, reference_type, reference_id
  ) VALUES (
    v_wallet.id, p_user_id, 'withdrawal', v_inst.amount,
    'سداد قسط رقم ' || v_inst.month_number || ' من تمويل #' || substring(v_app.id::text, 1, 8),
    'financing_installment', v_inst.id
  ) RETURNING id INTO v_tx_id;

  UPDATE public.financing_installments
  SET status = 'paid', paid_at = now(), paid_amount = v_inst.amount, wallet_transaction_id = v_tx_id
  WHERE id = v_inst.id;

  UPDATE public.financing_applications
  SET remaining_amount = GREATEST(0, remaining_amount - v_inst.amount), updated_at = now()
  WHERE id = v_app.id
  RETURNING remaining_amount INTO v_remaining;

  IF v_remaining <= 0 THEN
    UPDATE public.financing_applications
    SET status = 'completed'::financing_status
    WHERE id = v_app.id AND status = 'active'::financing_status;
  END IF;

  RETURN jsonb_build_object('success', true, 'transaction_id', v_tx_id, 'remaining_amount', v_remaining);
END;
$function$;

CREATE OR REPLACE FUNCTION public.compute_order_countdown(_order_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  v_order public.service_orders;
  v_label text;
  v_deadline timestamptz;
  v_seconds bigint;
BEGIN
  SELECT * INTO v_order FROM public.service_orders WHERE id = _order_id;
  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('active', false);
  END IF;

  IF auth.uid() IS NOT NULL
     AND v_order.user_id IS DISTINCT FROM auth.uid()
     AND NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('active', false);
  END IF;

  IF v_order.lifecycle_status = 'quote_sent' THEN
    v_label := 'انتهاء صلاحية عرض السعر';
    v_deadline := COALESCE(v_order.quote_response_deadline, v_order.quote_sent_at + interval '7 days');
  ELSIF v_order.lifecycle_status = 'contract_pending' THEN
    v_label := 'الموعد النهائي لتوقيع العقد';
    v_deadline := COALESCE(v_order.contract_signature_deadline, v_order.contract_pending_at + interval '5 days');
  ELSIF v_order.lifecycle_status IN ('contract_signed','payment_pending') THEN
    v_label := 'الموعد النهائي للدفع';
    v_deadline := COALESCE(v_order.payment_deadline, v_order.contract_signed_at + interval '3 days');
  ELSIF v_order.lifecycle_status IN ('in_progress','paid') THEN
    v_label := 'موعد التسليم المتوقع';
    v_deadline := v_order.deadline;
  ELSE
    RETURN jsonb_build_object('active', false);
  END IF;

  IF v_deadline IS NULL THEN
    RETURN jsonb_build_object('active', false);
  END IF;

  v_seconds := EXTRACT(EPOCH FROM (v_deadline - now()))::bigint;

  RETURN jsonb_build_object(
    'active', true, 'label', v_label, 'deadline', v_deadline,
    'seconds_remaining', v_seconds, 'expired', v_seconds <= 0,
    'stage', v_order.lifecycle_status::text
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.get_active_membership(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_referral_commission_balance(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.pay_installment_from_wallet(uuid, uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.compute_order_countdown(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_active_membership(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_referral_commission_balance(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.pay_installment_from_wallet(uuid, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.compute_order_countdown(uuid) TO authenticated, service_role;