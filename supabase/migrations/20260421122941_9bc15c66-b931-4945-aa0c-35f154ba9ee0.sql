-- 1) Failure log table for wallet_credit conversions
CREATE TABLE IF NOT EXISTS public.marketplace_purchase_failures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE SET NULL,
  item_slug TEXT,
  item_type TEXT,
  xp_required INTEGER,
  xp_available INTEGER,
  error_code TEXT NOT NULL,
  error_detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mpf_created_at ON public.marketplace_purchase_failures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mpf_item_type ON public.marketplace_purchase_failures(item_type);
CREATE INDEX IF NOT EXISTS idx_mpf_error_code ON public.marketplace_purchase_failures(error_code);

ALTER TABLE public.marketplace_purchase_failures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_view_failures" ON public.marketplace_purchase_failures
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "users_view_own_failures" ON public.marketplace_purchase_failures
  FOR SELECT USING (auth.uid() = user_id);

-- 2) Patch purchase_marketplace_item to log failures (wraps existing logic)
CREATE OR REPLACE FUNCTION public.purchase_marketplace_item(p_item_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_item RECORD;
  v_wallet RECORD;
  v_count INT;
  v_today_xp INT;
  v_limit RECORD;
  v_purchase_id UUID;
  v_award JSONB;
  v_fulfill JSONB := '{}'::jsonb;
  v_sar NUMERIC;
  v_code TEXT;
  v_user_level INT := 1;
  v_err TEXT;
  v_detail JSONB;
BEGIN
  IF v_user IS NULL THEN
    INSERT INTO public.marketplace_purchase_failures (item_id, error_code)
    VALUES (p_item_id, 'unauthenticated');
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  SELECT * INTO v_item FROM public.marketplace_items WHERE id = p_item_id AND is_active = true FOR UPDATE;
  IF NOT FOUND THEN
    INSERT INTO public.marketplace_purchase_failures (user_id, item_id, error_code)
    VALUES (v_user, p_item_id, 'item_unavailable');
    RETURN jsonb_build_object('success', false, 'error', 'item_unavailable');
  END IF;

  IF v_item.stock IS NOT NULL AND v_item.total_purchased >= v_item.stock THEN
    v_err := 'out_of_stock';
    INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code)
    VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_item.xp_cost, v_err);
    RETURN jsonb_build_object('success', false, 'error', v_err);
  END IF;

  SELECT current_level INTO v_user_level FROM public.user_xp_wallet WHERE user_id = v_user;
  v_user_level := COALESCE(v_user_level, 1);
  IF v_user_level < v_item.min_level THEN
    v_err := 'level_too_low';
    INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code, error_detail)
    VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_item.xp_cost, v_err,
            jsonb_build_object('required_level', v_item.min_level, 'current_level', v_user_level));
    RETURN jsonb_build_object('success', false, 'error', v_err, 'required_level', v_item.min_level, 'current_level', v_user_level);
  END IF;

  SELECT * INTO v_wallet FROM public.user_xp_wallet WHERE user_id = v_user;
  IF v_wallet.balance IS NULL OR v_wallet.balance < v_item.xp_cost THEN
    v_err := 'insufficient_xp';
    INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, xp_available, error_code)
    VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_item.xp_cost, COALESCE(v_wallet.balance, 0), v_err);
    RETURN jsonb_build_object('success', false, 'error', v_err, 'required', v_item.xp_cost, 'available', COALESCE(v_wallet.balance, 0));
  END IF;

  IF v_item.max_per_user IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM public.marketplace_purchases
      WHERE user_id = v_user AND item_id = v_item.id AND status = 'completed';
    IF v_count >= v_item.max_per_user THEN
      v_err := 'max_per_user_reached';
      INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code, error_detail)
      VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_item.xp_cost, v_err, jsonb_build_object('limit', v_item.max_per_user));
      RETURN jsonb_build_object('success', false, 'error', v_err);
    END IF;
  END IF;

  SELECT * INTO v_limit FROM public.marketplace_purchase_limits WHERE item_type = v_item.type;
  IF FOUND THEN
    SELECT COUNT(*), COALESCE(SUM(xp_spent),0) INTO v_count, v_today_xp
      FROM public.marketplace_purchases
      WHERE user_id = v_user AND item_type = v_item.type
        AND status = 'completed' AND created_at >= date_trunc('day', now());
    IF v_count >= v_limit.daily_count_limit OR (v_today_xp + v_item.xp_cost) > v_limit.daily_xp_limit THEN
      v_err := 'daily_limit_reached';
      v_detail := jsonb_build_object('limit_count', v_limit.daily_count_limit, 'limit_xp', v_limit.daily_xp_limit,
                                     'used_count', v_count, 'used_xp', v_today_xp);
      INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code, error_detail)
      VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_item.xp_cost, v_err, v_detail);
      RETURN jsonb_build_object('success', false, 'error', v_err) || v_detail;
    END IF;
  END IF;

  v_award := public.award_xp(v_user, -v_item.xp_cost, 'marketplace_spend', v_item.id::TEXT,
    'شراء من المتجر: ' || v_item.title_ar,
    jsonb_build_object('item_slug', v_item.slug, 'item_type', v_item.type));
  IF NOT (v_award->>'success')::boolean THEN
    v_err := 'xp_deduction_failed';
    INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code, error_detail)
    VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_item.xp_cost, v_err, v_award);
    RETURN jsonb_build_object('success', false, 'error', v_err, 'detail', v_award);
  END IF;

  INSERT INTO public.marketplace_purchases
    (user_id, item_id, item_slug, item_type, xp_spent, reward_payload, status)
  VALUES
    (v_user, p_item_id, v_item.slug, v_item.type, v_item.xp_cost, v_item.reward_payload, 'completed')
  RETURNING id INTO v_purchase_id;

  IF v_item.type = 'feature_unlock' THEN
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload, expires_at)
    VALUES (v_user, v_item.reward_payload->>'feature_key', 'marketplace', v_purchase_id, v_item.reward_payload,
      CASE WHEN (v_item.reward_payload->>'duration_days') IS NOT NULL
           THEN now() + ((v_item.reward_payload->>'duration_days')::INTEGER || ' days')::INTERVAL
           ELSE NULL END);
    v_fulfill := jsonb_build_object('feature_unlocked', v_item.reward_payload->>'feature_key');

  ELSIF v_item.type = 'discount' THEN
    v_code := upper(substr(md5(random()::text || v_user::text || now()::text), 1, 10));
    INSERT INTO public.user_discount_coupons (user_id, code, discount_type, discount_value, applies_to, source, source_id, expires_at)
    VALUES (v_user, v_code, v_item.reward_payload->>'discount_type', (v_item.reward_payload->>'discount_value')::NUMERIC,
      COALESCE(v_item.reward_payload->>'applies_to', 'all'), 'marketplace', v_purchase_id,
      now() + (COALESCE((v_item.reward_payload->>'valid_days')::INTEGER, 30) || ' days')::INTERVAL);
    v_fulfill := jsonb_build_object('coupon_code', v_code);

  ELSIF v_item.type = 'wallet_credit' THEN
    v_sar := (v_item.reward_payload->>'sar_amount')::NUMERIC;
    INSERT INTO public.wallets (user_id, balance) VALUES (v_user, 0) ON CONFLICT (user_id) DO NOTHING;
    UPDATE public.wallets SET balance = balance + v_sar, updated_at = now() WHERE user_id = v_user;
    INSERT INTO public.wallet_transactions
      (user_id, amount, transaction_type, description, reference_type, reference_id, status)
    VALUES (v_user, v_sar, 'credit', 'تحويل XP إلى رصيد', 'xp_conversion', v_purchase_id, 'completed');
    v_fulfill := jsonb_build_object('sar_credited', v_sar);

  ELSIF v_item.type = 'badge' THEN
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload)
    VALUES (v_user, 'badge_' || (v_item.reward_payload->>'badge_key'), 'marketplace', v_purchase_id, v_item.reward_payload)
    ON CONFLICT DO NOTHING;
    v_fulfill := jsonb_build_object('badge_granted', v_item.reward_payload->>'badge_key');

  ELSIF v_item.type = 'bundle' THEN
    v_fulfill := jsonb_build_object('bundle_items', v_item.reward_payload->'bundle_items');
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload)
    SELECT v_user, x.value::TEXT, 'marketplace_bundle', v_purchase_id, v_item.reward_payload
      FROM jsonb_array_elements_text(COALESCE(v_item.reward_payload->'bundle_items','[]'::jsonb)) AS x
    ON CONFLICT DO NOTHING;
  END IF;

  UPDATE public.marketplace_purchases SET fulfillment_data = v_fulfill WHERE id = v_purchase_id;
  UPDATE public.marketplace_items SET total_purchased = total_purchased + 1 WHERE id = p_item_id;

  RETURN jsonb_build_object(
    'success', true,
    'purchase_id', v_purchase_id,
    'xp_spent', v_item.xp_cost,
    'remaining_xp', (v_award->>'new_balance')::INT,
    'item_type', v_item.type,
    'fulfillment', v_fulfill
  );
END;
$$;

-- 3) Reports RPC (admin only): wallet_credit conversion report for last N days
CREATE OR REPLACE FUNCTION public.get_xp_conversion_report(p_days INT DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::INTERVAL;
  v_summary JSONB;
  v_daily JSONB;
  v_top_days JSONB;
  v_failures JSONB;
  v_top_users JSONB;
  v_items JSONB;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  -- Summary of successful conversions
  SELECT jsonb_build_object(
    'total_conversions', COUNT(*),
    'unique_users', COUNT(DISTINCT user_id),
    'total_xp_spent', COALESCE(SUM(xp_spent), 0),
    'total_sar_credited', COALESCE(SUM((fulfillment_data->>'sar_credited')::NUMERIC), 0),
    'avg_xp_per_conversion', COALESCE(ROUND(AVG(xp_spent)::NUMERIC, 1), 0)
  ) INTO v_summary
  FROM public.marketplace_purchases
  WHERE item_type = 'wallet_credit' AND status = 'completed' AND created_at >= v_since;

  -- Daily breakdown
  SELECT COALESCE(jsonb_agg(row_to_json(d) ORDER BY day), '[]'::jsonb) INTO v_daily
  FROM (
    SELECT date_trunc('day', created_at)::DATE AS day,
           COUNT(*) AS conversions,
           COALESCE(SUM(xp_spent), 0) AS xp_spent,
           COALESCE(SUM((fulfillment_data->>'sar_credited')::NUMERIC), 0) AS sar_credited
    FROM public.marketplace_purchases
    WHERE item_type = 'wallet_credit' AND status = 'completed' AND created_at >= v_since
    GROUP BY 1 ORDER BY 1
  ) d;

  -- Top active days
  SELECT COALESCE(jsonb_agg(row_to_json(t)), '[]'::jsonb) INTO v_top_days
  FROM (
    SELECT date_trunc('day', created_at)::DATE AS day,
           COUNT(*) AS conversions,
           COALESCE(SUM((fulfillment_data->>'sar_credited')::NUMERIC), 0) AS sar_credited
    FROM public.marketplace_purchases
    WHERE item_type = 'wallet_credit' AND status = 'completed' AND created_at >= v_since
    GROUP BY 1 ORDER BY conversions DESC, sar_credited DESC LIMIT 5
  ) t;

  -- Failures breakdown by error_code
  SELECT COALESCE(jsonb_agg(row_to_json(f) ORDER BY count DESC), '[]'::jsonb) INTO v_failures
  FROM (
    SELECT error_code, COUNT(*) AS count, MAX(created_at) AS last_seen
    FROM public.marketplace_purchase_failures
    WHERE item_type = 'wallet_credit' AND created_at >= v_since
    GROUP BY error_code
  ) f;

  -- Top converting users
  SELECT COALESCE(jsonb_agg(row_to_json(u)), '[]'::jsonb) INTO v_top_users
  FROM (
    SELECT mp.user_id,
           p.full_name,
           COUNT(*) AS conversions,
           COALESCE(SUM(mp.xp_spent), 0) AS xp_spent,
           COALESCE(SUM((mp.fulfillment_data->>'sar_credited')::NUMERIC), 0) AS sar_credited
    FROM public.marketplace_purchases mp
    LEFT JOIN public.profiles p ON p.id = mp.user_id
    WHERE mp.item_type = 'wallet_credit' AND mp.status = 'completed' AND mp.created_at >= v_since
    GROUP BY mp.user_id, p.full_name
    ORDER BY sar_credited DESC NULLS LAST LIMIT 10
  ) u;

  -- Per-item breakdown
  SELECT COALESCE(jsonb_agg(row_to_json(i) ORDER BY conversions DESC), '[]'::jsonb) INTO v_items
  FROM (
    SELECT mp.item_slug,
           mi.title_ar,
           mp.item_id,
           COUNT(*) AS conversions,
           COALESCE(SUM(mp.xp_spent), 0) AS xp_spent,
           COALESCE(SUM((mp.fulfillment_data->>'sar_credited')::NUMERIC), 0) AS sar_credited
    FROM public.marketplace_purchases mp
    LEFT JOIN public.marketplace_items mi ON mi.id = mp.item_id
    WHERE mp.item_type = 'wallet_credit' AND mp.status = 'completed' AND mp.created_at >= v_since
    GROUP BY mp.item_slug, mi.title_ar, mp.item_id
  ) i;

  RETURN jsonb_build_object(
    'period_days', p_days,
    'since', v_since,
    'summary', v_summary,
    'daily', v_daily,
    'top_days', v_top_days,
    'failures', v_failures,
    'top_users', v_top_users,
    'items', v_items
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_xp_conversion_report(INT) TO authenticated;