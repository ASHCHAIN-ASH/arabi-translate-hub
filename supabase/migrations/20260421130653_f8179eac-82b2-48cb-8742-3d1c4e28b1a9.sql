
-- 1) أعمدة جديدة في marketplace_items
ALTER TABLE public.marketplace_items
  ADD COLUMN IF NOT EXISTS price_sar numeric,
  ADD COLUMN IF NOT EXISTS xp_to_sar_rate numeric NOT NULL DEFAULT 100,
  ADD COLUMN IF NOT EXISTS allow_payment_methods text[] NOT NULL DEFAULT ARRAY['xp','wallet','gateway']::text[];

-- 2) أعمدة في marketplace_purchases (إذا الجدول موجود)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='marketplace_purchases') THEN
    ALTER TABLE public.marketplace_purchases
      ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'xp',
      ADD COLUMN IF NOT EXISTS paid_amount_sar numeric,
      ADD COLUMN IF NOT EXISTS payment_intent_id uuid;
  END IF;
END $$;

-- 3) دالة لجلب السعر الفعلي بالريال
CREATE OR REPLACE FUNCTION public.get_marketplace_item_pricing(p_item_id uuid)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'item_id', id,
    'xp_cost', xp_cost,
    'price_sar', COALESCE(price_sar, ROUND((xp_cost::numeric / NULLIF(xp_to_sar_rate,0))::numeric, 2)),
    'price_sar_explicit', price_sar IS NOT NULL,
    'xp_to_sar_rate', xp_to_sar_rate,
    'allow_payment_methods', allow_payment_methods
  )
  FROM public.marketplace_items WHERE id = p_item_id;
$$;

-- 4) دالة الشراء بالمحفظة (ريال)
CREATE OR REPLACE FUNCTION public.purchase_marketplace_with_wallet(p_item_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user uuid := auth.uid();
  v_item record;
  v_price numeric;
  v_wallet record;
  v_purchase_id uuid;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  SELECT * INTO v_item FROM public.marketplace_items WHERE id = p_item_id AND is_active = true FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'item_unavailable');
  END IF;

  IF NOT ('wallet' = ANY(v_item.allow_payment_methods)) THEN
    RETURN jsonb_build_object('success', false, 'error', 'wallet_not_allowed');
  END IF;

  IF v_item.stock IS NOT NULL AND v_item.total_purchased >= v_item.stock THEN
    RETURN jsonb_build_object('success', false, 'error', 'out_of_stock');
  END IF;

  v_price := COALESCE(v_item.price_sar, ROUND((v_item.xp_cost::numeric / NULLIF(v_item.xp_to_sar_rate,0))::numeric, 2));
  IF v_price IS NULL OR v_price <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_price');
  END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user FOR UPDATE;
  IF NOT FOUND OR v_wallet.balance < v_price THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_balance',
      'required', v_price, 'available', COALESCE(v_wallet.balance, 0));
  END IF;

  -- خصم من المحفظة
  UPDATE public.wallets SET balance = balance - v_price, total_spent = total_spent + v_price, updated_at = now()
  WHERE id = v_wallet.id;

  INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, balance_after, description, related_entity_type, related_entity_id)
  VALUES (v_wallet.id, v_user, 'debit', v_price, v_wallet.balance - v_price,
          'شراء من متجر XP: ' || v_item.title_ar, 'marketplace_item', v_item.id::text);

  -- تسجيل الشراء
  INSERT INTO public.marketplace_purchases (user_id, item_id, item_slug, item_type, xp_spent, payment_method, paid_amount_sar, status, reward_payload)
  VALUES (v_user, v_item.id, v_item.slug, v_item.type, 0, 'wallet', v_price, 'completed', v_item.reward_payload)
  RETURNING id INTO v_purchase_id;

  UPDATE public.marketplace_items SET total_purchased = total_purchased + 1 WHERE id = v_item.id;

  RETURN jsonb_build_object('success', true, 'purchase_id', v_purchase_id, 'paid_sar', v_price, 'method', 'wallet');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END $$;

-- 5) دالة تأكيد شراء عبر بوابة الدفع (تُستدعى من webhook بعد نجاح الدفع)
CREATE OR REPLACE FUNCTION public.confirm_marketplace_gateway_purchase(
  p_user_id uuid, p_item_id uuid, p_payment_intent_id uuid, p_paid_sar numeric
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_item record;
  v_purchase_id uuid;
BEGIN
  -- منع الازدواج
  IF EXISTS (SELECT 1 FROM public.marketplace_purchases WHERE payment_intent_id = p_payment_intent_id) THEN
    RETURN jsonb_build_object('success', true, 'duplicate', true);
  END IF;

  SELECT * INTO v_item FROM public.marketplace_items WHERE id = p_item_id FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'item_not_found'); END IF;

  INSERT INTO public.marketplace_purchases (user_id, item_id, item_slug, item_type, xp_spent, payment_method, paid_amount_sar, payment_intent_id, status, reward_payload)
  VALUES (p_user_id, v_item.id, v_item.slug, v_item.type, 0, 'gateway', p_paid_sar, p_payment_intent_id, 'completed', v_item.reward_payload)
  RETURNING id INTO v_purchase_id;

  UPDATE public.marketplace_items SET total_purchased = total_purchased + 1 WHERE id = v_item.id;

  RETURN jsonb_build_object('success', true, 'purchase_id', v_purchase_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END $$;
