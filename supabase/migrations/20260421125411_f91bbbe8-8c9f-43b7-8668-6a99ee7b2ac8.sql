-- Drop the old single-code overload to redefine cleanly with array delegation
DROP FUNCTION IF EXISTS public.purchase_marketplace_item(uuid, text);

-- Validate a coupon against an arbitrary base XP (used for the 2nd code on already-discounted price)
CREATE OR REPLACE FUNCTION public.validate_promo_code_on_base(
  p_code text,
  p_item_id uuid,
  p_base_xp integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_coupon RECORD;
  v_item RECORD;
  v_discount_xp INT := 0;
  v_final_xp INT;
  v_floor INT;
  v_base INT;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'unauthenticated');
  END IF;
  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RETURN jsonb_build_object('valid', false, 'error', 'empty_code');
  END IF;
  SELECT * INTO v_item FROM public.marketplace_items WHERE id = p_item_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'item_unavailable');
  END IF;

  v_base := COALESCE(NULLIF(p_base_xp, 0), v_item.xp_cost);
  IF v_base <= 0 THEN v_base := v_item.xp_cost; END IF;

  SELECT * INTO v_coupon
    FROM public.user_discount_coupons
    WHERE upper(code) = upper(trim(p_code)) AND user_id = v_user
    LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_found');
  END IF;
  IF v_coupon.status <> 'active' OR v_coupon.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'already_used');
  END IF;
  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'expired');
  END IF;
  IF v_coupon.applies_to NOT IN ('all', 'marketplace', v_item.type, v_item.slug) THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_applicable');
  END IF;

  IF v_coupon.discount_type = 'percentage' THEN
    v_discount_xp := floor(v_base * least(v_coupon.discount_value, 100) / 100.0);
  ELSE
    v_discount_xp := least(v_coupon.discount_value::INT * 200, v_base);
  END IF;

  v_floor := greatest(floor(v_item.xp_cost * 0.10)::INT, 1);
  v_discount_xp := least(v_discount_xp, greatest(v_base - v_floor, 0));
  v_discount_xp := greatest(v_discount_xp, 0);
  v_final_xp := v_base - v_discount_xp;

  RETURN jsonb_build_object(
    'valid', true, 'code', v_coupon.code, 'coupon_id', v_coupon.id,
    'discount_type', v_coupon.discount_type, 'discount_value', v_coupon.discount_value,
    'original_xp', v_base, 'xp_discount', v_discount_xp, 'final_xp', v_final_xp,
    'expires_at', v_coupon.expires_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_promo_code_on_base(text, uuid, integer) TO authenticated;

-- Stacked-codes purchase
CREATE OR REPLACE FUNCTION public.purchase_marketplace_item(
  p_item_id uuid,
  p_promo_codes text[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
  v_notify_msg TEXT := '';
  v_codes TEXT[] := COALESCE(p_promo_codes, ARRAY[]::TEXT[]);
  v_clean TEXT[] := ARRAY[]::TEXT[];
  v_coupon RECORD;
  v_used_coupon_ids UUID[] := ARRAY[]::UUID[];
  v_discount_total INT := 0;
  v_discount_step INT;
  v_floor INT;
  v_running INT;
  v_breakdown JSONB := '[]'::jsonb;
  v_effective_cost INT;
  i INT;
  v_label TEXT;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  FOR i IN 1..COALESCE(array_length(v_codes,1),0) LOOP
    v_code := upper(trim(v_codes[i]));
    IF v_code IS NULL OR length(v_code) = 0 THEN CONTINUE; END IF;
    IF v_code = ANY(v_clean) THEN CONTINUE; END IF;
    v_clean := array_append(v_clean, v_code);
    IF array_length(v_clean,1) >= 2 THEN EXIT; END IF;
  END LOOP;

  SELECT * INTO v_item FROM public.marketplace_items WHERE id = p_item_id AND is_active = true FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'item_unavailable');
  END IF;

  IF v_item.stock IS NOT NULL AND v_item.total_purchased >= v_item.stock THEN
    RETURN jsonb_build_object('success', false, 'error', 'out_of_stock');
  END IF;

  SELECT current_level INTO v_user_level FROM public.user_xp_wallet WHERE user_id = v_user;
  v_user_level := COALESCE(v_user_level, 1);
  IF v_user_level < v_item.min_level THEN
    RETURN jsonb_build_object('success', false, 'error', 'level_too_low',
      'required_level', v_item.min_level, 'current_level', v_user_level);
  END IF;

  v_running := v_item.xp_cost;
  v_floor := greatest(floor(v_item.xp_cost * 0.10)::INT, 1);

  FOR i IN 1..COALESCE(array_length(v_clean,1),0) LOOP
    v_code := v_clean[i];
    SELECT * INTO v_coupon
      FROM public.user_discount_coupons
      WHERE upper(code) = v_code AND user_id = v_user
      LIMIT 1;
    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'not_found',
        'detail', jsonb_build_object('code', v_code, 'slot', i));
    END IF;
    IF v_coupon.status <> 'active' OR v_coupon.used_at IS NOT NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'already_used',
        'detail', jsonb_build_object('code', v_code, 'slot', i));
    END IF;
    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
      RETURN jsonb_build_object('success', false, 'error', 'expired',
        'detail', jsonb_build_object('code', v_code, 'slot', i));
    END IF;
    IF v_coupon.applies_to NOT IN ('all', 'marketplace', v_item.type, v_item.slug) THEN
      RETURN jsonb_build_object('success', false, 'error', 'not_applicable',
        'detail', jsonb_build_object('code', v_code, 'slot', i));
    END IF;
    IF v_coupon.id = ANY(v_used_coupon_ids) THEN
      RETURN jsonb_build_object('success', false, 'error', 'duplicate',
        'detail', jsonb_build_object('code', v_code, 'slot', i));
    END IF;

    IF v_coupon.discount_type = 'percentage' THEN
      v_discount_step := floor(v_running * least(v_coupon.discount_value, 100) / 100.0);
    ELSE
      v_discount_step := least(v_coupon.discount_value::INT * 200, v_running);
    END IF;
    v_discount_step := least(v_discount_step, greatest(v_running - v_floor, 0));
    v_discount_step := greatest(v_discount_step, 0);

    v_breakdown := v_breakdown || jsonb_build_array(jsonb_build_object(
      'slot', i, 'code', v_coupon.code,
      'discount_type', v_coupon.discount_type, 'discount_value', v_coupon.discount_value,
      'base_xp', v_running, 'xp_discount', v_discount_step, 'after_xp', v_running - v_discount_step
    ));

    v_running := v_running - v_discount_step;
    v_discount_total := v_discount_total + v_discount_step;
    v_used_coupon_ids := array_append(v_used_coupon_ids, v_coupon.id);
  END LOOP;

  v_effective_cost := v_running;

  SELECT * INTO v_wallet FROM public.user_xp_wallet WHERE user_id = v_user;
  IF v_wallet.balance IS NULL OR v_wallet.balance < v_effective_cost THEN
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (v_user, '⚠️ رصيد XP غير كافٍ',
            'تحتاج ' || v_effective_cost || ' XP لشراء ' || v_item.title_ar,
            'marketplace_failed', '/marketplace');
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_xp',
      'required', v_effective_cost, 'available', COALESCE(v_wallet.balance, 0));
  END IF;

  IF v_item.max_per_user IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM public.marketplace_purchases
      WHERE user_id = v_user AND item_id = v_item.id AND status = 'completed';
    IF v_count >= v_item.max_per_user THEN
      RETURN jsonb_build_object('success', false, 'error', 'max_per_user_reached');
    END IF;
  END IF;

  SELECT * INTO v_limit FROM public.marketplace_purchase_limits WHERE item_type = v_item.type;
  IF FOUND THEN
    SELECT COUNT(*), COALESCE(SUM(xp_spent),0) INTO v_count, v_today_xp
      FROM public.marketplace_purchases
      WHERE user_id = v_user AND item_type = v_item.type
        AND status = 'completed' AND created_at >= date_trunc('day', now());
    IF v_count >= v_limit.daily_count_limit OR (v_today_xp + v_effective_cost) > v_limit.daily_xp_limit THEN
      RETURN jsonb_build_object('success', false, 'error', 'daily_limit_reached',
        'limit_count', v_limit.daily_count_limit, 'limit_xp', v_limit.daily_xp_limit);
    END IF;
  END IF;

  v_label := array_to_string(v_clean, '+');

  v_award := public.award_xp(v_user, -v_effective_cost, 'marketplace_spend', v_item.id::TEXT,
    'شراء من المتجر: ' || v_item.title_ar ||
      CASE WHEN v_discount_total > 0 THEN ' (مع ' || array_length(v_clean,1) || ' كوبون)' ELSE '' END,
    jsonb_build_object('item_slug', v_item.slug, 'item_type', v_item.type,
                       'promo_codes', v_clean, 'xp_discount', v_discount_total,
                       'breakdown', v_breakdown));
  IF NOT (v_award->>'success')::boolean THEN
    RETURN jsonb_build_object('success', false, 'error', 'xp_deduction_failed', 'detail', v_award);
  END IF;

  INSERT INTO public.marketplace_purchases
    (user_id, item_id, item_slug, item_type, xp_spent, reward_payload, status,
     promo_code, xp_discount, original_xp_cost, fulfillment_data)
  VALUES
    (v_user, p_item_id, v_item.slug, v_item.type, v_effective_cost, v_item.reward_payload, 'completed',
     CASE WHEN v_discount_total > 0 THEN NULLIF(v_label,'') ELSE NULL END,
     v_discount_total, v_item.xp_cost,
     jsonb_build_object('promo_breakdown', v_breakdown))
  RETURNING id INTO v_purchase_id;

  IF array_length(v_used_coupon_ids,1) > 0 THEN
    UPDATE public.user_discount_coupons
       SET status = 'used', used_at = now(), used_on_purchase_id = v_purchase_id
     WHERE id = ANY(v_used_coupon_ids);
  END IF;

  IF v_item.type = 'feature_unlock' THEN
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload, expires_at)
    VALUES (v_user, v_item.reward_payload->>'feature_key', 'marketplace', v_purchase_id, v_item.reward_payload,
      CASE WHEN (v_item.reward_payload->>'duration_days') IS NOT NULL
           THEN now() + ((v_item.reward_payload->>'duration_days')::INTEGER || ' days')::INTERVAL
           ELSE NULL END);
    v_fulfill := jsonb_build_object('feature_unlocked', v_item.reward_payload->>'feature_key',
                                    'promo_breakdown', v_breakdown);
    v_notify_msg := 'تم تفعيل الميزة فوراً ✓';
  ELSIF v_item.type = 'discount' THEN
    v_code := upper(substr(md5(random()::text || v_user::text || now()::text), 1, 10));
    INSERT INTO public.user_discount_coupons (user_id, code, discount_type, discount_value, applies_to, source, source_id, expires_at)
    VALUES (v_user, v_code, v_item.reward_payload->>'discount_type', (v_item.reward_payload->>'discount_value')::NUMERIC,
      COALESCE(v_item.reward_payload->>'applies_to', 'all'), 'marketplace', v_purchase_id,
      now() + (COALESCE((v_item.reward_payload->>'valid_days')::INTEGER, 30) || ' days')::INTERVAL);
    v_fulfill := jsonb_build_object('coupon_code', v_code, 'promo_breakdown', v_breakdown);
    v_notify_msg := 'كوبونك: ' || v_code;
  ELSIF v_item.type = 'wallet_credit' THEN
    v_sar := (v_item.reward_payload->>'sar_amount')::NUMERIC;
    INSERT INTO public.wallets (user_id, balance) VALUES (v_user, 0) ON CONFLICT (user_id) DO NOTHING;
    UPDATE public.wallets SET balance = balance + v_sar, updated_at = now() WHERE user_id = v_user;
    INSERT INTO public.wallet_transactions
      (user_id, amount, transaction_type, description, reference_type, reference_id, status)
    VALUES (v_user, v_sar, 'credit', 'تحويل XP إلى رصيد', 'xp_conversion', v_purchase_id, 'completed');
    v_fulfill := jsonb_build_object('sar_credited', v_sar, 'promo_breakdown', v_breakdown);
    v_notify_msg := 'أُضيف ' || v_sar || ' ر.س إلى محفظتك';
  ELSIF v_item.type = 'badge' THEN
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload)
    VALUES (v_user, 'badge_' || (v_item.reward_payload->>'badge_key'), 'marketplace', v_purchase_id, v_item.reward_payload)
    ON CONFLICT DO NOTHING;
    v_fulfill := jsonb_build_object('badge_granted', v_item.reward_payload->>'badge_key',
                                    'promo_breakdown', v_breakdown);
    v_notify_msg := 'حصلت على شارة جديدة 🏅';
  ELSIF v_item.type = 'bundle' THEN
    v_fulfill := jsonb_build_object('bundle_items', v_item.reward_payload->'bundle_items',
                                    'promo_breakdown', v_breakdown);
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload)
    SELECT v_user, x.value::TEXT, 'marketplace_bundle', v_purchase_id, v_item.reward_payload
      FROM jsonb_array_elements_text(COALESCE(v_item.reward_payload->'bundle_items','[]'::jsonb)) AS x
    ON CONFLICT DO NOTHING;
    v_notify_msg := 'تم تفعيل عناصر الباقة';
  ELSE
    v_notify_msg := 'تم التسليم';
  END IF;

  UPDATE public.marketplace_purchases SET fulfillment_data = v_fulfill WHERE id = v_purchase_id;
  UPDATE public.marketplace_items SET total_purchased = total_purchased + 1 WHERE id = p_item_id;

  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  VALUES (
    v_user,
    '✨ شراء ناجح: ' || v_item.title_ar,
    'رقم الطلب #' || substr(v_purchase_id::text, 1, 8) ||
      ' • -' || v_effective_cost || ' XP' ||
      CASE WHEN v_discount_total > 0
           THEN ' (خصم تراكمي ' || v_discount_total || ' XP عبر ' || array_length(v_clean,1) || ' كوبون)'
           ELSE '' END ||
      ' • ' || v_notify_msg,
    'marketplace_success', '/marketplace/rewards'
  );

  RETURN jsonb_build_object(
    'success', true, 'purchase_id', v_purchase_id,
    'xp_spent', v_effective_cost, 'xp_discount', v_discount_total,
    'original_xp', v_item.xp_cost, 'promo_codes', v_clean,
    'breakdown', v_breakdown,
    'remaining_xp', (v_award->>'new_balance')::INT,
    'item_type', v_item.type, 'fulfillment', v_fulfill
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.purchase_marketplace_item(uuid, text[]) TO authenticated;

-- Backward-compatible single-code wrapper (delegates to array variant)
CREATE OR REPLACE FUNCTION public.purchase_marketplace_item(
  p_item_id uuid,
  p_promo_code text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN public.purchase_marketplace_item(
    p_item_id,
    CASE WHEN p_promo_code IS NULL OR length(trim(p_promo_code)) = 0
         THEN ARRAY[]::TEXT[]
         ELSE ARRAY[p_promo_code] END
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.purchase_marketplace_item(uuid, text) TO authenticated;