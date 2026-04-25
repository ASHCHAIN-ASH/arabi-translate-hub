-- =========================================================
-- Study-to-Earn Wallet Phase 2
-- Note: uses student_wallet_transactions to avoid clashing with
-- existing payments table public.wallet_transactions
-- =========================================================

-- 1) student_wallets
CREATE TABLE IF NOT EXISTS public.student_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  points_balance integer NOT NULL DEFAULT 0,
  pending_points integer NOT NULL DEFAULT 0,
  redeemed_points integer NOT NULL DEFAULT 0,
  cash_balance numeric(10,2) NOT NULL DEFAULT 0,
  lifetime_earned_points integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','locked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_student_wallets_user ON public.student_wallets(user_id);

-- 2) student_wallet_transactions
CREATE TABLE IF NOT EXISTS public.student_wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id uuid NOT NULL REFERENCES public.student_wallets(id) ON DELETE CASCADE,
  transaction_type text NOT NULL CHECK (transaction_type IN ('earn','redeem','adjust','reverse')),
  source_type text NOT NULL CHECK (source_type IN ('task','focus_session','daily_bonus','challenge','admin_adjustment','redemption')),
  source_id uuid,
  points_amount integer NOT NULL DEFAULT 0,
  cash_amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','rejected','reversed')),
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_swt_user_created ON public.student_wallet_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_swt_wallet ON public.student_wallet_transactions(wallet_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_swt_earn_source
  ON public.student_wallet_transactions(user_id, source_type, source_id)
  WHERE transaction_type = 'earn' AND source_id IS NOT NULL;

-- 3) reward_rules
CREATE TABLE IF NOT EXISTS public.reward_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_ar text NOT NULL,
  description_ar text,
  source_type text NOT NULL,
  points_reward integer NOT NULL DEFAULT 0,
  cash_reward numeric(10,2) NOT NULL DEFAULT 0,
  daily_limit integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4) reward_redemptions
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id uuid NOT NULL REFERENCES public.student_wallets(id) ON DELETE CASCADE,
  redemption_type text NOT NULL CHECK (redemption_type IN ('coupon','cash','gift','service_credit')),
  points_spent integer NOT NULL DEFAULT 0 CHECK (points_spent >= 0),
  cash_value numeric(10,2) NOT NULL DEFAULT 0 CHECK (cash_value >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','paid')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_redemptions_user ON public.reward_redemptions(user_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_redemptions_status ON public.reward_redemptions(status, requested_at DESC);

-- updated_at triggers (function set_updated_at exists in DB)
DO $$ BEGIN
  CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS trigger LANGUAGE plpgsql AS $f$
  BEGIN NEW.updated_at = now(); RETURN NEW; END;
  $f$;
END $$;

DROP TRIGGER IF EXISTS trg_student_wallets_updated ON public.student_wallets;
CREATE TRIGGER trg_student_wallets_updated
  BEFORE UPDATE ON public.student_wallets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_reward_rules_updated ON public.reward_rules;
CREATE TRIGGER trg_reward_rules_updated
  BEFORE UPDATE ON public.reward_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- RLS
-- =========================================================
ALTER TABLE public.student_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- student_wallets
CREATE POLICY sw_select_own ON public.student_wallets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY sw_admin_select ON public.student_wallets
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY sw_admin_update ON public.student_wallets
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- student_wallet_transactions: read only from client; writes via edge functions (service role)
CREATE POLICY swt_select_own ON public.student_wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY swt_admin_select ON public.student_wallet_transactions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- reward_rules
CREATE POLICY rr_select_active ON public.reward_rules
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY rr_admin_all ON public.reward_rules
  FOR ALL USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- reward_redemptions
CREATE POLICY rd_select_own ON public.reward_redemptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY rd_admin_select ON public.reward_redemptions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY rd_insert_own ON public.reward_redemptions
  FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY rd_admin_update ON public.reward_redemptions
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Realtime
ALTER TABLE public.student_wallets REPLICA IDENTITY FULL;
ALTER TABLE public.student_wallet_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.reward_redemptions REPLICA IDENTITY FULL;

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.student_wallets;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.student_wallet_transactions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.reward_redemptions;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed
INSERT INTO public.reward_rules (code, name_ar, description_ar, source_type, points_reward, daily_limit, is_active) VALUES
  ('TASK_COMPLETED',  'إكمال مهمة',         'نقاط مقابل إكمال مهمة دراسية',          'task',           10, 300, true),
  ('FOCUS_COMPLETED', 'إنهاء جلسة تركيز',   'نقاط مقابل إنهاء جلسة تركيز كاملة',     'focus_session',  30, 300, true),
  ('DAILY_START',     'بدء اليوم الدراسي',  'مكافأة يومية لبدء اليوم الدراسي',       'daily_bonus',     5,   5, true),
  ('PERFECT_DAY',     'يوم مثالي',           'مكافأة عند إكمال جميع مهام اليوم',     'daily_bonus',   100, 100, true)
ON CONFLICT (code) DO NOTHING;