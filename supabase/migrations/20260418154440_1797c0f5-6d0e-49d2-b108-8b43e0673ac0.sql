CREATE OR REPLACE FUNCTION public.use_track_tool(_tool_id uuid, _mode text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid UUID := auth.uid();
  v_tool RECORD;
  v_used_today INT;
  v_wallet RECORD;
  v_was_free BOOLEAN := false;
  v_tx_id UUID;
  v_log_id UUID;
  v_is_pro BOOLEAN := (_mode = 'pro');
  v_price NUMERIC;
  v_pro_price NUMERIC;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  SELECT * INTO v_tool FROM public.track_tools WHERE id = _tool_id AND is_active = true;
  IF v_tool IS NULL THEN
    RAISE EXCEPTION 'الأداة غير موجودة أو معطلة';
  END IF;

  v_pro_price := COALESCE((v_tool.metadata->>'pro_price')::NUMERIC, NULL);

  IF v_is_pro THEN
    IF v_pro_price IS NULL THEN
      RAISE EXCEPTION 'هذه الأداة لا تدعم الوضع المتقدم';
    END IF;
    v_price := v_pro_price;
  ELSE
    v_price := v_tool.price;
    -- Free quota only for standard mode
    IF v_tool.free_daily_quota > 0 THEN
      SELECT COUNT(*) INTO v_used_today
        FROM public.track_tool_usage_logs
       WHERE user_id = v_uid AND tool_id = _tool_id
         AND created_at::date = CURRENT_DATE
         AND was_free = true;
      IF v_used_today < v_tool.free_daily_quota THEN
        v_was_free := true;
      END IF;
    END IF;
  END IF;

  -- Charge wallet if not free
  IF NOT v_was_free AND v_price > 0 THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'استخدام أداة: ' || v_tool.name_ar || CASE WHEN v_is_pro THEN ' (متقدم)' ELSE '' END,
            'track_tool', _tool_id)
    RETURNING id INTO v_tx_id;
  END IF;

  INSERT INTO public.track_tool_usage_logs (user_id, tool_id, track_id, cost, was_free, wallet_transaction_id)
  VALUES (v_uid, _tool_id, v_tool.track_id,
          CASE WHEN v_was_free THEN 0 ELSE v_price END,
          v_was_free, v_tx_id)
  RETURNING id INTO v_log_id;

  RETURN jsonb_build_object(
    'ok', true,
    'log_id', v_log_id,
    'was_free', v_was_free,
    'charged', CASE WHEN v_was_free THEN 0 ELSE v_price END,
    'mode', CASE WHEN v_is_pro THEN 'pro' ELSE 'standard' END,
    'action_link', v_tool.action_link
  );
END;
$function$;