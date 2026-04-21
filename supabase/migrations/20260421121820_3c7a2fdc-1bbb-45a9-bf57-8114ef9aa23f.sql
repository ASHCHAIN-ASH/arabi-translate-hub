-- ============================================
-- XP MARKETPLACE
-- ============================================

-- 1) ITEMS
CREATE TABLE IF NOT EXISTS public.marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_ar TEXT NOT NULL,
  description_ar TEXT,
  type TEXT NOT NULL CHECK (type IN ('feature_unlock','discount','wallet_credit','badge','bundle')),
  category TEXT NOT NULL DEFAULT 'general',
  xp_cost INTEGER NOT NULL CHECK (xp_cost > 0),
  reward_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  icon TEXT,
  badge_color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  stock INTEGER, -- NULL = unlimited
  total_purchased INTEGER NOT NULL DEFAULT 0,
  min_level INTEGER NOT NULL DEFAULT 1,
  max_per_user INTEGER, -- NULL = unlimited per user
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_items_active ON public.marketplace_items(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_mkt_items_type ON public.marketplace_items(type);

ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view active items" ON public.marketplace_items
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage items" ON public.marketplace_items FOR ALL
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 2) PURCHASES
CREATE TABLE IF NOT EXISTS public.marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE RESTRICT,
  item_slug TEXT NOT NULL,
  item_type TEXT NOT NULL,
  xp_spent INTEGER NOT NULL,
  reward_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed','pending','failed','refunded')),
  fulfillment_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_purch_user ON public.marketplace_purchases(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mkt_purch_item ON public.marketplace_purchases(item_id);

ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own purchases" ON public.marketplace_purchases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all purchases" ON public.marketplace_purchases
  FOR SELECT USING (public.has_role(auth.uid(),'admin'));

-- 3) DAILY LIMITS PER TYPE
CREATE TABLE IF NOT EXISTS public.marketplace_purchase_limits (
  type TEXT PRIMARY KEY,
  max_per_day INTEGER NOT NULL,
  max_xp_per_day INTEGER NOT NULL,
  description TEXT
);

ALTER TABLE public.marketplace_purchase_limits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view limits" ON public.marketplace_purchase_limits FOR SELECT USING (true);
CREATE POLICY "Admins manage limits" ON public.marketplace_purchase_limits FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 4) VIEWS (for conversion metrics)
CREATE TABLE IF NOT EXISTS public.marketplace_item_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  variant_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_views_item ON public.marketplace_item_views(item_id, created_at DESC);

ALTER TABLE public.marketplace_item_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert views" ON public.marketplace_item_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view tracking" ON public.marketplace_item_views FOR SELECT
  USING (public.has_role(auth.uid(),'admin'));

-- 5) UNLOCKED FEATURES
CREATE TABLE IF NOT EXISTS public.user_unlocked_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'marketplace',
  source_id UUID,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, feature_key)
);

CREATE INDEX IF NOT EXISTS idx_unlocked_user ON public.user_unlocked_features(user_id);

ALTER TABLE public.user_unlocked_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own unlocks" ON public.user_unlocked_features
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage unlocks" ON public.user_unlocked_features FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 6) DISCOUNT COUPONS
CREATE TABLE IF NOT EXISTS public.user_discount_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage','fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  applies_to TEXT NOT NULL DEFAULT 'all',
  max_uses INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0,
  source_purchase_id UUID REFERENCES public.marketplace_purchases(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','used','expired','revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupons_user ON public.user_discount_coupons(user_id, status);

ALTER TABLE public.user_discount_coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own coupons" ON public.user_discount_coupons
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage coupons" ON public.user_discount_coupons FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 7) PRICE EXPERIMENTS (A/B)
CREATE TABLE IF NOT EXISTS public.marketplace_price_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  variant_key TEXT NOT NULL,
  xp_cost INTEGER NOT NULL,
  allocation_percent INTEGER NOT NULL DEFAULT 50 CHECK (allocation_percent BETWEEN 0 AND 100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (item_id, variant_key)
);

ALTER TABLE public.marketplace_price_experiments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone view active experiments" ON public.marketplace_price_experiments
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage experiments" ON public.marketplace_price_experiments FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO public.marketplace_purchase_limits (type, max_per_day, max_xp_per_day, description) VALUES
  ('feature_unlock', 5, 5000, 'فتح ميزات يومياً'),
  ('discount', 3, 3000, 'كوبونات يومية'),
  ('wallet_credit', 1, 5000, 'تحويل XP لرصيد محفظة (مرة يومياً)'),
  ('badge', 5, 2000, 'شارات بروفايل'),
  ('bundle', 2, 10000, 'باقات مجمعة')
ON CONFLICT (type) DO NOTHING;

INSERT INTO public.marketplace_items (slug, title_ar, description_ar, type, category, xp_cost, reward_payload, icon, badge_color, is_featured, sort_order, max_per_user, min_level) VALUES
  -- FEATURE UNLOCKS
  ('unlock-advanced-assessment', 'فتح اختبار متقدم', 'افتح وصولاً غير محدود لاختبارات المستوى المتقدم', 'feature_unlock', 'academy', 300, '{"feature_key":"advanced_assessment"}', '🔓', 'bg-blue-500', true, 10, 1, 1),
  ('unlock-premium-challenges', 'تحديات مميزة', 'افتح تحديات أكاديمية حصرية بمكافآت XP مضاعفة', 'feature_unlock', 'academy', 500, '{"feature_key":"premium_challenges","multiplier":2}', '⚡', 'bg-purple-500', true, 20, 1, 2),
  ('unlock-cv-templates', 'قوالب CV احترافية', 'افتح جميع قوالب السيرة الذاتية المدفوعة', 'feature_unlock', 'tools', 800, '{"feature_key":"premium_cv_templates"}', '📄', 'bg-emerald-500', false, 30, 1, 3),
  ('unlock-priority-support', 'دعم فوري ٧ أيام', 'دعم بالأولوية لمدة أسبوع كامل', 'feature_unlock', 'support', 400, '{"feature_key":"priority_support","duration_days":7}', '⚡', 'bg-amber-500', false, 40, NULL, 1),
  -- DISCOUNTS
  ('discount-10-percent', 'كوبون خصم 10%', 'كوبون خصم 10% على أي خدمة (صالح 30 يوماً)', 'discount', 'coupon', 250, '{"discount_type":"percentage","discount_value":10,"valid_days":30}', '🎟️', 'bg-pink-500', true, 50, 5, 1),
  ('discount-25-sar', 'خصم 25 ريال', 'خصم ثابت 25 ريال على طلبك القادم', 'discount', 'coupon', 600, '{"discount_type":"fixed","discount_value":25,"valid_days":30}', '💸', 'bg-rose-500', false, 60, 3, 2),
  ('discount-20-percent', 'كوبون خصم 20%', 'خصم كبير 20% على خدمات الترجمة الأكاديمية', 'discount', 'coupon', 700, '{"discount_type":"percentage","discount_value":20,"valid_days":30,"applies_to":"translation"}', '🎯', 'bg-fuchsia-500', false, 70, 2, 3),
  -- WALLET CREDIT
  ('wallet-5-sar', 'تحويل: 5 ريال محفظة', 'حوّل 1000 XP إلى 5 ريال في محفظتك (حد يومي: مرة)', 'wallet_credit', 'wallet', 1000, '{"sar_amount":5}', '💰', 'bg-emerald-600', true, 80, NULL, 3),
  ('wallet-15-sar', 'تحويل: 15 ريال محفظة', 'حوّل 2800 XP إلى 15 ريال (سعر أفضل!)', 'wallet_credit', 'wallet', 2800, '{"sar_amount":15}', '💎', 'bg-emerald-700', false, 90, NULL, 4),
  -- BADGES
  ('badge-early-supporter', 'شارة الداعم المبكر', 'شارة فاخرة تظهر بجانب اسمك', 'badge', 'profile', 200, '{"badge_key":"early_supporter","color":"amber"}', '🏅', 'bg-amber-500', false, 100, 1, 1),
  ('badge-vip-status', 'شارة VIP', 'مستوى VIP مرئي للجميع + لون مميز', 'badge', 'profile', 1500, '{"badge_key":"vip","color":"purple"}', '👑', 'bg-purple-600', true, 110, 1, 5),
  -- BUNDLE
  ('bundle-power-user', 'باقة المحترف', 'فتح اختبار متقدم + تحديات مميزة + خصم 20% — وفر 20%!', 'bundle', 'bundle', 1200, '{"bundle_items":["advanced_assessment","premium_challenges","discount_20"]}', '🎁', 'bg-gradient-to-r from-amber-500 to-pink-500', true, 5, 1, 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CORE FUNCTION: purchase_marketplace_item
-- ============================================
CREATE OR REPLACE FUNCTION public.purchase_marketplace_item(p_item_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_item RECORD;
  v_wallet_xp INTEGER;
  v_user_level INTEGER;
  v_today_count INTEGER;
  v_today_xp INTEGER;
  v_lim_count INTEGER;
  v_lim_xp INTEGER;
  v_user_total INTEGER;
  v_award_result JSONB;
  v_purchase_id UUID;
  v_coupon_code TEXT;
  v_wallet_id UUID;
  v_wallet_balance NUMERIC;
  v_sar NUMERIC;
  v_fulfill JSONB := '{}'::jsonb;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  -- Lock item row
  SELECT * INTO v_item FROM public.marketplace_items WHERE id = p_item_id FOR UPDATE;
  IF NOT FOUND OR NOT v_item.is_active THEN
    RETURN jsonb_build_object('success', false, 'error', 'item_unavailable');
  END IF;

  -- Stock
  IF v_item.stock IS NOT NULL AND v_item.total_purchased >= v_item.stock THEN
    RETURN jsonb_build_object('success', false, 'error', 'out_of_stock');
  END IF;

  -- User wallet
  SELECT total_xp, current_level INTO v_wallet_xp, v_user_level
    FROM public.user_xp_wallet WHERE user_id = v_user;
  v_wallet_xp := COALESCE(v_wallet_xp, 0);
  v_user_level := COALESCE(v_user_level, 1);

  IF v_user_level < v_item.min_level THEN
    RETURN jsonb_build_object('success', false, 'error', 'level_too_low',
      'required_level', v_item.min_level, 'current_level', v_user_level);
  END IF;

  IF v_wallet_xp < v_item.xp_cost THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_xp',
      'required', v_item.xp_cost, 'available', v_wallet_xp);
  END IF;

  -- Per-user max
  IF v_item.max_per_user IS NOT NULL THEN
    SELECT COUNT(*) INTO v_user_total FROM public.marketplace_purchases
     WHERE user_id = v_user AND item_id = p_item_id AND status = 'completed';
    IF v_user_total >= v_item.max_per_user THEN
      RETURN jsonb_build_object('success', false, 'error', 'max_per_user_reached');
    END IF;
  END IF;

  -- Daily limits per type
  SELECT max_per_day, max_xp_per_day INTO v_lim_count, v_lim_xp
    FROM public.marketplace_purchase_limits WHERE type = v_item.type;
  IF v_lim_count IS NOT NULL THEN
    SELECT COUNT(*), COALESCE(SUM(xp_spent),0) INTO v_today_count, v_today_xp
      FROM public.marketplace_purchases
     WHERE user_id = v_user AND item_type = v_item.type
       AND status = 'completed'
       AND created_at >= date_trunc('day', now());
    IF v_today_count >= v_lim_count OR (v_today_xp + v_item.xp_cost) > v_lim_xp THEN
      RETURN jsonb_build_object('success', false, 'error', 'daily_limit_reached',
        'limit_count', v_lim_count, 'limit_xp', v_lim_xp);
    END IF;
  END IF;

  -- Deduct XP via unified ledger
  v_award_result := public.award_xp(
    v_user,
    -v_item.xp_cost,
    'marketplace_purchase',
    p_item_id::TEXT,
    'شراء: ' || v_item.title_ar,
    jsonb_build_object('item_slug', v_item.slug, 'item_type', v_item.type)
  );

  IF NOT (v_award_result->>'success')::BOOLEAN THEN
    RETURN jsonb_build_object('success', false, 'error', 'xp_deduction_failed',
      'detail', v_award_result);
  END IF;

  -- Create purchase row
  INSERT INTO public.marketplace_purchases
    (user_id, item_id, item_slug, item_type, xp_spent, reward_payload, status)
  VALUES
    (v_user, p_item_id, v_item.slug, v_item.type, v_item.xp_cost, v_item.reward_payload, 'completed')
  RETURNING id INTO v_purchase_id;

  UPDATE public.marketplace_items
     SET total_purchased = total_purchased + 1, updated_at = now()
   WHERE id = p_item_id;

  -- Fulfillment by type
  IF v_item.type = 'feature_unlock' THEN
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload, expires_at)
    VALUES (
      v_user,
      v_item.reward_payload->>'feature_key',
      'marketplace',
      v_purchase_id,
      v_item.reward_payload,
      CASE WHEN (v_item.reward_payload->>'duration_days') IS NOT NULL
           THEN now() + ((v_item.reward_payload->>'duration_days')::INTEGER || ' days')::INTERVAL
           ELSE NULL END
    )
    ON CONFLICT (user_id, feature_key) DO UPDATE
      SET expires_at = EXCLUDED.expires_at, payload = EXCLUDED.payload;
    v_fulfill := jsonb_build_object('feature_unlocked', v_item.reward_payload->>'feature_key');

  ELSIF v_item.type = 'discount' THEN
    v_coupon_code := 'XP-' || UPPER(SUBSTR(REPLACE(gen_random_uuid()::TEXT,'-',''), 1, 10));
    INSERT INTO public.user_discount_coupons
      (user_id, code, discount_type, discount_value, applies_to, source_purchase_id, expires_at)
    VALUES (
      v_user, v_coupon_code,
      v_item.reward_payload->>'discount_type',
      (v_item.reward_payload->>'discount_value')::NUMERIC,
      COALESCE(v_item.reward_payload->>'applies_to', 'all'),
      v_purchase_id,
      now() + (COALESCE((v_item.reward_payload->>'valid_days')::INTEGER, 30) || ' days')::INTERVAL
    );
    v_fulfill := jsonb_build_object('coupon_code', v_coupon_code);

  ELSIF v_item.type = 'wallet_credit' THEN
    v_sar := (v_item.reward_payload->>'sar_amount')::NUMERIC;
    SELECT id, balance INTO v_wallet_id, v_wallet_balance FROM public.wallets WHERE user_id = v_user;
    IF v_wallet_id IS NULL THEN
      INSERT INTO public.wallets (user_id, balance, currency, status)
      VALUES (v_user, 0, 'SAR', 'active') RETURNING id, balance INTO v_wallet_id, v_wallet_balance;
    END IF;

    UPDATE public.wallets
       SET balance = balance + v_sar,
           total_deposited = total_deposited + v_sar,
           updated_at = now()
     WHERE id = v_wallet_id
     RETURNING balance INTO v_wallet_balance;

    INSERT INTO public.wallet_transactions
      (wallet_id, user_id, type, amount, balance_before, balance_after, currency,
       description, reference_type, reference_id, metadata)
    VALUES (
      v_wallet_id, v_user, 'credit', v_sar, v_wallet_balance - v_sar, v_wallet_balance, 'SAR',
      'تحويل XP إلى رصيد', 'xp_conversion', v_purchase_id,
      jsonb_build_object('xp_spent', v_item.xp_cost, 'rate', v_item.xp_cost::FLOAT / v_sar)
    );
    v_fulfill := jsonb_build_object('sar_credited', v_sar, 'new_balance', v_wallet_balance);

  ELSIF v_item.type = 'badge' THEN
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload)
    VALUES (v_user, 'badge_' || (v_item.reward_payload->>'badge_key'), 'marketplace', v_purchase_id, v_item.reward_payload)
    ON CONFLICT (user_id, feature_key) DO NOTHING;
    v_fulfill := jsonb_build_object('badge_granted', v_item.reward_payload->>'badge_key');

  ELSIF v_item.type = 'bundle' THEN
    -- Recursive-ish: unlock each feature in bundle
    v_fulfill := jsonb_build_object('bundle_items', v_item.reward_payload->'bundle_items');
    -- Items in bundle are activated as feature flags
    INSERT INTO public.user_unlocked_features (user_id, feature_key, source, source_id, payload)
    SELECT v_user, x.value::TEXT, 'marketplace_bundle', v_purchase_id, v_item.reward_payload
      FROM jsonb_array_elements_text(COALESCE(v_item.reward_payload->'bundle_items','[]'::jsonb)) AS x
    ON CONFLICT (user_id, feature_key) DO NOTHING;
  END IF;

  UPDATE public.marketplace_purchases SET fulfillment_data = v_fulfill WHERE id = v_purchase_id;

  RETURN jsonb_build_object(
    'success', true,
    'purchase_id', v_purchase_id,
    'xp_spent', v_item.xp_cost,
    'remaining_xp', (v_award_result->>'total_xp')::INTEGER,
    'item_type', v_item.type,
    'fulfillment', v_fulfill
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.purchase_marketplace_item(UUID) TO authenticated;

-- Track view (anonymous-friendly)
CREATE OR REPLACE FUNCTION public.track_marketplace_view(
  p_item_id UUID,
  p_anonymous_id TEXT DEFAULT NULL,
  p_variant_key TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.marketplace_item_views (item_id, user_id, anonymous_id, variant_key)
  VALUES (p_item_id, auth.uid(), p_anonymous_id, p_variant_key);
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_marketplace_view(UUID, TEXT, TEXT) TO authenticated, anon;

-- Admin metrics
CREATE OR REPLACE FUNCTION public.get_marketplace_metrics(p_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN
    RETURN jsonb_build_object('error', 'forbidden');
  END IF;

  SELECT jsonb_build_object(
    'total_purchases', (SELECT COUNT(*) FROM public.marketplace_purchases
      WHERE created_at >= now() - (p_days || ' days')::INTERVAL AND status = 'completed'),
    'total_xp_spent', (SELECT COALESCE(SUM(xp_spent),0) FROM public.marketplace_purchases
      WHERE created_at >= now() - (p_days || ' days')::INTERVAL AND status = 'completed'),
    'unique_buyers', (SELECT COUNT(DISTINCT user_id) FROM public.marketplace_purchases
      WHERE created_at >= now() - (p_days || ' days')::INTERVAL AND status = 'completed'),
    'top_items', (
      SELECT jsonb_agg(jsonb_build_object(
        'item_id', i.id, 'slug', i.slug, 'title', i.title_ar,
        'purchases', cnt, 'xp_revenue', xp_sum
      ) ORDER BY cnt DESC)
      FROM (
        SELECT item_id, COUNT(*) cnt, SUM(xp_spent) xp_sum
        FROM public.marketplace_purchases
        WHERE created_at >= now() - (p_days || ' days')::INTERVAL AND status = 'completed'
        GROUP BY item_id ORDER BY cnt DESC LIMIT 10
      ) p
      JOIN public.marketplace_items i ON i.id = p.item_id
    ),
    'top_buyers', (
      SELECT jsonb_agg(jsonb_build_object(
        'user_id', user_id, 'purchases', cnt, 'xp_spent', xp_sum
      ) ORDER BY xp_sum DESC)
      FROM (
        SELECT user_id, COUNT(*) cnt, SUM(xp_spent) xp_sum
        FROM public.marketplace_purchases
        WHERE created_at >= now() - (p_days || ' days')::INTERVAL AND status = 'completed'
        GROUP BY user_id ORDER BY xp_sum DESC LIMIT 10
      ) p
    ),
    'conversion_rate', (
      SELECT CASE WHEN v.cnt = 0 THEN 0
        ELSE ROUND((p.cnt::NUMERIC / v.cnt) * 100, 2) END
      FROM (SELECT COUNT(*)::INTEGER cnt FROM public.marketplace_item_views
            WHERE created_at >= now() - (p_days || ' days')::INTERVAL) v,
           (SELECT COUNT(*)::INTEGER cnt FROM public.marketplace_purchases
            WHERE created_at >= now() - (p_days || ' days')::INTERVAL AND status='completed') p
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_marketplace_metrics(INTEGER) TO authenticated;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_purchases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_unlocked_features;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_discount_coupons;