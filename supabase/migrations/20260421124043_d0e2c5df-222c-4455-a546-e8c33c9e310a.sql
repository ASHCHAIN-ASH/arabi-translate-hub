CREATE OR REPLACE FUNCTION public.purchase_marketplace_item(p_item_id UUID, p_promo_code TEXT DEFAULT NULL)
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
  v_promo JSONB;
  v_effective_cost INT;
  v_discount INT := 0;
  v_coupon_id UUID;
  v_notify_msg TEXT;
  v_err_label TEXT;
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
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (v_user, '❌ تعذّر الشراء', 'هذا المنتج غير متاح حالياً', 'marketplace_failed', '/marketplace');
    RETURN jsonb_build_object('success', false, 'error', 'item_unavailable');
  END IF;

  v_effective_cost := v_item.xp_cost;

  IF p_promo_code IS NOT NULL AND length(trim(p_promo_code)) > 0 THEN
    v_promo := public.validate_promo_code(trim(p_promo_code), p_item_id);
    IF NOT (v_promo->>'valid')::boolean THEN
      v_err := 'invalid_promo';
      INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code, error_detail)
      VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_item.xp_cost, v_err, v_promo);
      INSERT INTO public.user_notifications (user_id, title, message, type, link)
      VALUES (v_user, '❌ كوبون غير صالح',
              'تعذّر تطبيق الكوبون على ' || v_item.title_ar || ' — ' || COALESCE(v_promo->>'error', 'invalid'),
              'marketplace_failed', '/marketplace');
      RETURN jsonb_build_object('success', false, 'error', v_err, 'detail', v_promo);
    END IF;
    v_discount := (v_promo->>'xp_discount')::INT;
    v_effective_cost := (v_promo->>'final_xp')::INT;
    v_coupon_id := (v_promo->>'coupon_id')::UUID;
  END IF;

  IF v_item.stock IS NOT NULL AND v_item.total_purchased >= v_item.stock THEN
    v_err := 'out_of_stock';
    INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code)
    VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_effective_cost, v_err);
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (v_user, '❌ نفدت الكمية', 'لم يعد ' || v_item.title_ar || ' متوفراً', 'marketplace_failed', '/marketplace');
    RETURN jsonb_build_object('success', false, 'error', v_err);
  END IF;

  SELECT current_level INTO v_user_level FROM public.user_xp_wallet WHERE user_id = v_user;
  v_user_level := COALESCE(v_user_level, 1);
  IF v_user_level < v_item.min_level THEN
    v_err := 'level_too_low';
    INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code, error_detail)
    VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_effective_cost, v_err,
            jsonb_build_object('required_level', v_item.min_level, 'current_level', v_user_level));
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (v_user, '🔒 المستوى غير كافٍ',
            v_item.title_ar || ' يتطلب المستوى ' || v_item.min_level || ' (مستواك الحالي: ' || v_user_level || ')',
            'marketplace_failed', '/marketplace');
    RETURN jsonb_build_object('success', false, 'error', v_err, 'required_level', v_item.min_level, 'current_level', v_user_level);
  END IF;

  SELECT * INTO v_wallet FROM public.user_xp_wallet WHERE user_id = v_user;
  IF v_wallet.balance IS NULL OR v_wallet.balance < v_effective_cost THEN
    v_err := 'insufficient_xp';
    INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, xp_available, error_code)
    VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_effective_cost, COALESCE(v_wallet.balance, 0), v_err);
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (v_user, '⚠️ رصيد XP غير كافٍ',
            'تحتاج ' || v_effective_cost || ' XP لشراء ' || v_item.title_ar || ' (رصيدك: ' || COALESCE(v_wallet.balance,0) || ')',
            'marketplace_failed', '/marketplace');
    RETURN jsonb_build_object('success', false, 'error', v_err, 'required', v_effective_cost, 'available', COALESCE(v_wallet.balance, 0));
  END IF;

  IF v_item.max_per_user IS NOT NULL THEN
    SELECT COUNT(*) INTO v_count FROM public.marketplace_purchases
      WHERE user_id = v_user AND item_id = v_item.id AND status = 'completed';
    IF v_count >= v_item.max_per_user THEN
      v_err := 'max_per_user_reached';
      INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code, error_detail)
      VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_effective_cost, v_err, jsonb_build_object('limit', v_item.max_per_user));
      INSERT INTO public.user_notifications (user_id, title, message, type, link)
      VALUES (v_user, '🚫 الحد الأقصى', 'وصلت الحد الأقصى لشراء ' || v_item.title_ar, 'marketplace_failed', '/marketplace');
      RETURN jsonb_build_object('success', false, 'error', v_err);
    END IF;
  END IF;

  SELECT * INTO v_limit FROM public.marketplace_purchase_limits WHERE item_type = v_item.type;
  IF FOUND THEN
    SELECT COUNT(*), COALESCE(SUM(xp_spent),0) INTO v_count, v_today_xp
      FROM public.marketplace_purchases
      WHERE user_id = v_user AND item_type = v_item.type
        AND status = 'completed' AND created_at >= date_trunc('day', now());
    IF v_count >= v_limit.daily_count_limit OR (v_today_xp + v_effective_cost) > v_limit.daily_xp_limit THEN
      v_err := 'daily_limit_reached';
      v_detail := jsonb_build_object('limit_count', v_limit.daily_count_limit, 'limit_xp', v_limit.daily_xp_limit,
                                     'used_count', v_count, 'used_xp', v_today_xp);
      INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code, error_detail)
      VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_effective_cost, v_err, v_detail);
      INSERT INTO public.user_notifications (user_id, title, message, type, link)
      VALUES (v_user, '⏳ تجاوزت الحد اليومي',
              'وصلت الحد اليومي لنوع ' || v_item.type || '. حاول غداً.',
              'marketplace_failed', '/marketplace');
      RETURN jsonb_build_object('success', false, 'error', v_err) || v_detail;
    END IF;
  END IF;

  v_award := public.award_xp(v_user, -v_effective_cost, 'marketplace_spend', v_item.id::TEXT,
    'شراء من المتجر: ' || v_item.title_ar || CASE WHEN v_discount > 0 THEN ' (مع كوبون)' ELSE '' END,
    jsonb_build_object('item_slug', v_item.slug, 'item_type', v_item.type, 'promo_code', p_promo_code, 'xp_discount', v_discount));
  IF NOT (v_award->>'success')::boolean THEN
    v_err := 'xp_deduction_failed';
    INSERT INTO public.marketplace_purchase_failures (user_id, item_id, item_slug, item_type, xp_required, error_code, error_detail)
    VALUES (v_user, v_item.id, v_item.slug, v_item.type, v_effective_cost, v_err, v_award);
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (v_user, '❌ تعذّر خصم XP', 'حدث خطأ غير متوقع أثناء شراء ' || v_item.title_ar, 'marketplace_failed', '/marketplace');
    RETURN jsonb_build_object('success', false, 'error', v_err, 'detail', v_award);
  END IF;

  INSERT INTO public.marketplace_purchases
    (user_id, item_id, item_slug, item_type, xp_spent, reward_payload, status,
     promo_code, xp_discount, original_xp_cost)
  VALUES
    (v_user, p_item_id, v_item.slug, v_item.type, v_effective_cost, v_item.reward_payload, 'completed',
     CASE WHEN v_discount > 0 THEN trim(p_promo_code) ELSE NULL END, v_discount, v_item.xp_cost)
  RETURNING id INTO v_purchase_id;

  IF v_coupon_id IS NOT NULL THEN
    UPDATE public.user_discount_coupons
       SET status = 'used', used_at = now(), used_on_purchase_id = v_purchase_id
     WHERE id = v_coupon_id;
  END IF;

  IF v_item.type = 'feature_unlock' THEN
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload, expires_at)
    VALUES (v_user, v_item.reward_payload->>'feature_key', 'marketplace', v_purchase_id, v_item.reward_payload,
      CASE WHEN (v_item.reward_payload->>'duration_days') IS NOT NULL
           THEN now() + ((v_item.reward_payload->>'duration_days')::INTEGER || ' days')::INTERVAL
           ELSE NULL END);
    v_fulfill := jsonb_build_object('feature_unlocked', v_item.reward_payload->>'feature_key');
    v_notify_msg := 'تم تفعيل الميزة فوراً ✓';

  ELSIF v_item.type = 'discount' THEN
    v_code := upper(substr(md5(random()::text || v_user::text || now()::text), 1, 10));
    INSERT INTO public.user_discount_coupons (user_id, code, discount_type, discount_value, applies_to, source, source_id, expires_at)
    VALUES (v_user, v_code, v_item.reward_payload->>'discount_type', (v_item.reward_payload->>'discount_value')::NUMERIC,
      COALESCE(v_item.reward_payload->>'applies_to', 'all'), 'marketplace', v_purchase_id,
      now() + (COALESCE((v_item.reward_payload->>'valid_days')::INTEGER, 30) || ' days')::INTERVAL);
    v_fulfill := jsonb_build_object('coupon_code', v_code);
    v_notify_msg := 'كوبونك: ' || v_code;

  ELSIF v_item.type = 'wallet_credit' THEN
    v_sar := (v_item.reward_payload->>'sar_amount')::NUMERIC;
    INSERT INTO public.wallets (user_id, balance) VALUES (v_user, 0) ON CONFLICT (user_id) DO NOTHING;
    UPDATE public.wallets SET balance = balance + v_sar, updated_at = now() WHERE user_id = v_user;
    INSERT INTO public.wallet_transactions
      (user_id, amount, transaction_type, description, reference_type, reference_id, status)
    VALUES (v_user, v_sar, 'credit', 'تحويل XP إلى رصيد', 'xp_conversion', v_purchase_id, 'completed');
    v_fulfill := jsonb_build_object('sar_credited', v_sar);
    v_notify_msg := 'أُضيف ' || v_sar || ' ر.س إلى محفظتك';

  ELSIF v_item.type = 'badge' THEN
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload)
    VALUES (v_user, 'badge_' || (v_item.reward_payload->>'badge_key'), 'marketplace', v_purchase_id, v_item.reward_payload)
    ON CONFLICT DO NOTHING;
    v_fulfill := jsonb_build_object('badge_granted', v_item.reward_payload->>'badge_key');
    v_notify_msg := 'حصلت على شارة جديدة 🏅';

  ELSIF v_item.type = 'bundle' THEN
    v_fulfill := jsonb_build_object('bundle_items', v_item.reward_payload->'bundle_items');
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

  -- Success notification
  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  VALUES (
    v_user,
    '✨ شراء ناجح: ' || v_item.title_ar,
    'رقم الطلب #' || substr(v_purchase_id::text, 1, 8) ||
      ' • -' || v_effective_cost || ' XP' ||
      CASE WHEN v_discount > 0 THEN ' (خصم ' || v_discount || ')' ELSE '' END ||
      ' • ' || v_notify_msg,
    'marketplace_success',
    '/marketplace/rewards'
  );

  RETURN jsonb_build_object(
    'success', true,
    'purchase_id', v_purchase_id,
    'xp_spent', v_effective_cost,
    'xp_discount', v_discount,
    'original_xp', v_item.xp_cost,
    'promo_code', CASE WHEN v_discount > 0 THEN trim(p_promo_code) ELSE NULL END,
    'remaining_xp', (v_award->>'new_balance')::INT,
    'item_type', v_item.type,
    'fulfillment', v_fulfill
  );
END;
$$;