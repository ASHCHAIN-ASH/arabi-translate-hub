
-- ============================================================================
-- GAMIFICATION SYSTEM — Phase A: Database Foundation
-- ============================================================================

-- 1) LEVELS table
CREATE TABLE public.gamification_levels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  required_points INTEGER NOT NULL DEFAULT 0,
  badge_label TEXT,
  badge_color TEXT DEFAULT '#6366f1',
  icon TEXT,
  perks_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT required_points_nonneg CHECK (required_points >= 0)
);
CREATE INDEX idx_levels_required_points ON public.gamification_levels(required_points);

-- 2) USER_POINTS table (one row per user, balance + current level)
CREATE TABLE public.user_points (
  user_id UUID NOT NULL PRIMARY KEY,
  total_points INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  current_level_id UUID REFERENCES public.gamification_levels(id),
  level_reached_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT total_points_nonneg CHECK (total_points >= 0)
);

-- 3) POINT_TRANSACTIONS — every earn/spend event (idempotent)
CREATE TABLE public.point_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  points INTEGER NOT NULL, -- positive = earn, negative = spend
  type TEXT NOT NULL CHECK (type IN ('earn','spend','bonus','penalty','adjustment','refund')),
  source_type TEXT NOT NULL, -- e.g. 'order_completed','referral','signup','wallet_topup','membership','manual','reward_redeem'
  source_id TEXT, -- order id / referral id / etc (text to allow any FK)
  description TEXT,
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  base_points INTEGER, -- before multiplier (for transparency)
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  balance_after INTEGER,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Idempotency: same source can only credit once
CREATE UNIQUE INDEX uniq_point_tx_source
  ON public.point_transactions(user_id, source_type, source_id)
  WHERE source_id IS NOT NULL AND type IN ('earn','bonus');
CREATE INDEX idx_point_tx_user_created ON public.point_transactions(user_id, created_at DESC);

-- 4) REWARDS catalog
CREATE TABLE public.gamification_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  description_ar TEXT,
  type TEXT NOT NULL CHECK (type IN ('discount_percent','discount_fixed','wallet_credit','points_bonus','free_service','badge','perk')),
  value NUMERIC NOT NULL DEFAULT 0,
  cost_points INTEGER NOT NULL DEFAULT 0, -- 0 = automatically granted at level
  level_required_id UUID REFERENCES public.gamification_levels(id),
  expires_in_days INTEGER, -- null = never
  max_redemptions_per_user INTEGER DEFAULT 1,
  total_stock INTEGER, -- null = unlimited
  total_redeemed INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  badge_color TEXT DEFAULT '#10b981',
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5) USER_REWARDS — granted/redeemed rewards
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL REFERENCES public.gamification_rewards(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','used','expired','revoked')),
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  redemption_code TEXT UNIQUE,
  source TEXT NOT NULL DEFAULT 'auto' CHECK (source IN ('auto','redeem','manual','level_up')),
  point_transaction_id UUID REFERENCES public.point_transactions(id),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_user_rewards_user_status ON public.user_rewards(user_id, status);

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Helper: get membership multiplier
CREATE OR REPLACE FUNCTION public.get_membership_points_multiplier(_user_id UUID)
RETURNS NUMERIC
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_code TEXT;
BEGIN
  SELECT mp.code INTO v_code
  FROM public.user_memberships um
  JOIN public.membership_plans mp ON mp.id = um.plan_id
  WHERE um.user_id = _user_id
    AND um.status = 'active'
    AND (um.expires_at IS NULL OR um.expires_at > now())
  ORDER BY mp.priority_level DESC LIMIT 1;

  RETURN CASE v_code
    WHEN 'platinum' THEN 2.0
    WHEN 'gold'     THEN 1.5
    WHEN 'silver'   THEN 1.2
    ELSE 1.0
  END;
END $$;

-- Helper: compute level for a given points balance
CREATE OR REPLACE FUNCTION public.compute_level_for_points(_points INTEGER)
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.gamification_levels
   WHERE is_active = true AND required_points <= COALESCE(_points,0)
   ORDER BY required_points DESC LIMIT 1
$$;

-- Public RPC: award points (server-side only, idempotent)
CREATE OR REPLACE FUNCTION public.award_points(
  _user_id UUID,
  _base_points INTEGER,
  _source_type TEXT,
  _source_id TEXT DEFAULT NULL,
  _description TEXT DEFAULT NULL,
  _apply_multiplier BOOLEAN DEFAULT true,
  _metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_mult NUMERIC := 1.0;
  v_final INTEGER;
  v_tx_id UUID;
BEGIN
  IF _user_id IS NULL OR _base_points IS NULL OR _base_points = 0 THEN RETURN NULL; END IF;

  IF _apply_multiplier AND _base_points > 0 THEN
    v_mult := public.get_membership_points_multiplier(_user_id);
  END IF;
  v_final := FLOOR(_base_points * v_mult)::INTEGER;

  -- Insert; UNIQUE index on (user, source_type, source_id) prevents duplicate earn/bonus
  BEGIN
    INSERT INTO public.point_transactions
      (user_id, points, type, source_type, source_id, description, multiplier, base_points, metadata)
    VALUES
      (_user_id, v_final,
       CASE WHEN v_final > 0 THEN 'earn' ELSE 'spend' END,
       _source_type, _source_id, _description, v_mult, _base_points, COALESCE(_metadata,'{}'::jsonb))
    RETURNING id INTO v_tx_id;
  EXCEPTION WHEN unique_violation THEN
    RETURN NULL; -- already credited; idempotent
  END;

  RETURN v_tx_id;
END $$;

-- Trigger fn: after a point_transaction is inserted, update user_points + check level-up
CREATE OR REPLACE FUNCTION public.apply_point_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_old_level UUID;
  v_new_level UUID;
  v_new_balance INTEGER;
  v_level_name TEXT;
  v_old_required INTEGER;
  v_new_required INTEGER;
BEGIN
  -- ensure user_points row exists
  INSERT INTO public.user_points(user_id) VALUES (NEW.user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT current_level_id INTO v_old_level FROM public.user_points WHERE user_id = NEW.user_id FOR UPDATE;

  UPDATE public.user_points
     SET total_points     = GREATEST(0, total_points + NEW.points),
         lifetime_earned  = lifetime_earned + GREATEST(NEW.points, 0),
         lifetime_spent   = lifetime_spent  + GREATEST(-NEW.points, 0),
         updated_at       = now()
   WHERE user_id = NEW.user_id
   RETURNING total_points INTO v_new_balance;

  v_new_level := public.compute_level_for_points(v_new_balance);

  IF v_new_level IS DISTINCT FROM v_old_level THEN
    UPDATE public.user_points
       SET current_level_id = v_new_level,
           level_reached_at = now()
     WHERE user_id = NEW.user_id;

    -- Level up notification (only on upgrade, not downgrade)
    SELECT required_points INTO v_old_required FROM public.gamification_levels WHERE id = v_old_level;
    SELECT required_points, name_ar INTO v_new_required, v_level_name FROM public.gamification_levels WHERE id = v_new_level;

    IF COALESCE(v_new_required,0) > COALESCE(v_old_required,0) THEN
      INSERT INTO public.user_notifications (user_id, title, message, type, link)
      VALUES (NEW.user_id, '🎉 ترقية مستوى!',
              'تهانينا! وصلت إلى مستوى "' || v_level_name || '"',
              'gamification', '/rewards');
    END IF;
  END IF;

  -- write balance_after for the transaction itself
  UPDATE public.point_transactions SET balance_after = v_new_balance WHERE id = NEW.id;

  RETURN NEW;
END $$;

CREATE TRIGGER trg_apply_point_transaction
AFTER INSERT ON public.point_transactions
FOR EACH ROW EXECUTE FUNCTION public.apply_point_transaction();

-- ============================================================================
-- EVENT HOOKS — auto-award points from existing systems
-- ============================================================================

-- Welcome bonus on profile creation
CREATE OR REPLACE FUNCTION public.gamification_on_profile_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM public.award_points(NEW.id, 50, 'signup', NEW.id::text, 'مكافأة التسجيل', false);
  RETURN NEW;
END $$;
CREATE TRIGGER trg_gamification_signup
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.gamification_on_profile_created();

-- Order completed → 50 + 1pt per 5 SAR; first-order bonus +100
CREATE OR REPLACE FUNCTION public.gamification_on_order_completed()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_base INTEGER;
  v_amount NUMERIC;
  v_completed_count INTEGER;
BEGIN
  IF NEW.lifecycle_status = 'completed' AND OLD.lifecycle_status IS DISTINCT FROM 'completed' AND NEW.user_id IS NOT NULL THEN
    v_amount := COALESCE(NEW.total_amount, 0);
    v_base := 50 + FLOOR(v_amount / 5)::INTEGER;
    PERFORM public.award_points(NEW.user_id, v_base, 'order_completed', NEW.id::text,
            'إكمال طلب #' || NEW.tracking_id, true,
            jsonb_build_object('order_amount', v_amount));

    SELECT COUNT(*) INTO v_completed_count FROM public.service_orders
     WHERE user_id = NEW.user_id AND lifecycle_status = 'completed';
    IF v_completed_count = 1 THEN
      PERFORM public.award_points(NEW.user_id, 100, 'first_order', NEW.user_id::text, 'مكافأة أول طلب', true);
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_gamification_order_completed
AFTER UPDATE OF lifecycle_status ON public.service_orders
FOR EACH ROW EXECUTE FUNCTION public.gamification_on_order_completed();

-- Invoice payment → +20 per 100 SAR
CREATE OR REPLACE FUNCTION public.gamification_on_invoice_paid()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_user UUID; v_pts INTEGER;
BEGIN
  IF NEW.status = 'completed' AND NEW.amount > 0 THEN
    SELECT user_id INTO v_user FROM public.invoices WHERE id = NEW.invoice_id;
    IF v_user IS NULL THEN RETURN NEW; END IF;
    v_pts := FLOOR(NEW.amount / 100)::INTEGER * 20;
    IF v_pts > 0 THEN
      PERFORM public.award_points(v_user, v_pts, 'invoice_payment', NEW.id::text,
              'دفع فاتورة بمبلغ ' || NEW.amount || ' ر.س', true,
              jsonb_build_object('invoice_id', NEW.invoice_id, 'amount', NEW.amount));
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_gamification_invoice_paid
AFTER INSERT ON public.invoice_payments
FOR EACH ROW EXECUTE FUNCTION public.gamification_on_invoice_paid();

-- Successful referral → +200 to referrer (alongside existing wallet cash)
CREATE OR REPLACE FUNCTION public.gamification_on_referral_rewarded()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'rewarded' AND OLD.status IS DISTINCT FROM 'rewarded' THEN
    PERFORM public.award_points(NEW.referrer_user_id, 200, 'referral', NEW.id::text,
            'إحالة ناجحة لعضو جديد', true);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_gamification_referral
AFTER UPDATE OF status ON public.member_referrals
FOR EACH ROW EXECUTE FUNCTION public.gamification_on_referral_rewarded();

-- Membership activation → +150 bonus
CREATE OR REPLACE FUNCTION public.gamification_on_membership_active()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status IS DISTINCT FROM 'active' THEN
    PERFORM public.award_points(NEW.user_id, 150, 'membership_activated', NEW.id::text,
            'تفعيل عضوية', false);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_gamification_membership
AFTER UPDATE OF status ON public.user_memberships
FOR EACH ROW EXECUTE FUNCTION public.gamification_on_membership_active();

-- updated_at triggers
CREATE TRIGGER trg_levels_updated BEFORE UPDATE ON public.gamification_levels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_user_points_updated BEFORE UPDATE ON public.user_points
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_rewards_updated BEFORE UPDATE ON public.gamification_rewards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_user_rewards_updated BEFORE UPDATE ON public.user_rewards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE public.gamification_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

-- Levels: public read (active), admin manages
CREATE POLICY "Anyone views active levels" ON public.gamification_levels
FOR SELECT USING (is_active = true OR has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins manage levels" ON public.gamification_levels
FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- user_points: user reads own, admin all; NO client writes
CREATE POLICY "Users view own points" ON public.user_points
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage user points" ON public.user_points
FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- point_transactions: user reads own, admin all; NO client writes (server-side only via SECURITY DEFINER)
CREATE POLICY "Users view own point tx" ON public.point_transactions
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage point tx" ON public.point_transactions
FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
-- explicit block on client INSERT/UPDATE/DELETE
CREATE POLICY "Block client insert tx" ON public.point_transactions AS RESTRICTIVE
FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR auth.role() = 'service_role');
CREATE POLICY "Block client update tx" ON public.point_transactions AS RESTRICTIVE
FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR auth.role() = 'service_role');
CREATE POLICY "Block client delete tx" ON public.point_transactions AS RESTRICTIVE
FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR auth.role() = 'service_role');

-- Rewards catalog: public read (active), admin manages
CREATE POLICY "Anyone views active rewards" ON public.gamification_rewards
FOR SELECT USING (is_active = true OR has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins manage rewards" ON public.gamification_rewards
FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- user_rewards: user reads own, admin all; redeem will go through RPC
CREATE POLICY "Users view own rewards" ON public.user_rewards
FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage user rewards" ON public.user_rewards
FOR ALL USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Block client insert user_rewards" ON public.user_rewards AS RESTRICTIVE
FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR auth.role() = 'service_role');
CREATE POLICY "Block client update user_rewards" ON public.user_rewards AS RESTRICTIVE
FOR UPDATE TO authenticated USING (has_role(auth.uid(),'admin'::app_role) OR auth.role() = 'service_role');

-- ============================================================================
-- SEED DATA
-- ============================================================================
INSERT INTO public.gamification_levels (slug, name_ar, name_en, required_points, badge_label, badge_color, icon, sort_order, perks_json) VALUES
('beginner',  'مبتدئ',         'Beginner',  0,     'مبتدئ',         '#94a3b8', 'Sprout',     1, '["وصول إلى المنصة"]'::jsonb),
('active',    'طالب نشط',      'Active',    500,   'طالب نشط',      '#22c55e', 'Activity',   2, '["خصم 5% على أول طلب","أولوية الدعم"]'::jsonb),
('researcher','باحث محترف',    'Researcher',2000,  'باحث محترف',    '#3b82f6', 'BookOpen',   3, '["خصم 10%","شارة باحث","استشارة مجانية"]'::jsonb),
('expert',    'خبير أكاديمي',  'Expert',    5000,  'خبير',          '#a855f7', 'Award',      4, '["خصم 15%","تنفيذ سريع","مكافأة 100 ر.س"]'::jsonb),
('vip',       'VIP',           'VIP',       12000, 'VIP',           '#f59e0b', 'Crown',      5, '["خصم 25%","تنفيذ فوري","مدير حساب مخصص"]'::jsonb);

INSERT INTO public.gamification_rewards (title_ar, description_ar, type, value, cost_points, level_required_id, expires_in_days, max_redemptions_per_user, icon, sort_order) VALUES
('خصم 10% على طلب',      'استبدل نقاطك بخصم 10% على طلبك القادم',                  'discount_percent', 10,  500,  NULL, 30, 3, 'Tag',        1),
('خصم 25 ر.س',           'احصل على خصم 25 ر.س على طلبك القادم',                    'discount_fixed',   25,  300,  NULL, 30, 5, 'Tag',        2),
('شحن محفظة 50 ر.س',     'استبدل 1500 نقطة بـ 50 ر.س مضافة لمحفظتك',              'wallet_credit',    50,  1500, NULL, NULL, 2, 'Wallet',   3),
('شحن محفظة 100 ر.س',    'استبدل 2800 نقطة بـ 100 ر.س مضافة لمحفظتك',             'wallet_credit',    100, 2800, NULL, NULL, 1, 'Wallet',   4),
('استشارة مجانية',       'جلسة استشارة أكاديمية مجانية لمدة 30 دقيقة',             'free_service',     0,   1000, NULL, 60, 1, 'MessageSquare', 5),
('شارة "خبير"',          'شارة تظهر بجانب اسمك في المنصة',                          'badge',            0,   2500, NULL, NULL, 1, 'Award',    6);

-- Backfill: create user_points row for existing users (without crediting points)
INSERT INTO public.user_points (user_id, current_level_id)
SELECT p.id, public.compute_level_for_points(0)
FROM public.profiles p
ON CONFLICT (user_id) DO NOTHING;
