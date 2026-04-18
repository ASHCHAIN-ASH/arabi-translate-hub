
-- 1) Add referral_code to customers
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- Generate referral codes function
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  exists_count INT;
BEGIN
  LOOP
    new_code := 'REF' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT count(*) INTO exists_count FROM public.customers WHERE referral_code = new_code;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Trigger to auto-set referral_code on customers
CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_referral_code ON public.customers;
CREATE TRIGGER trg_set_referral_code
BEFORE INSERT ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_referral_code();

-- Backfill existing customers
UPDATE public.customers SET referral_code = public.generate_referral_code() WHERE referral_code IS NULL;

-- 2) Add commission settings to membership_plans
ALTER TABLE public.membership_plans
  ADD COLUMN IF NOT EXISTS referral_commission_percentage NUMERIC NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS referral_commission_fixed NUMERIC NOT NULL DEFAULT 0;

-- 3) Add referred_by to user_memberships
ALTER TABLE public.user_memberships
  ADD COLUMN IF NOT EXISTS referred_by UUID,
  ADD COLUMN IF NOT EXISTS referral_code_used TEXT;

-- 4) Create member_referrals tracking table
CREATE TABLE IF NOT EXISTS public.member_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL,
  referred_user_id UUID NOT NULL,
  referral_code TEXT NOT NULL,
  membership_id UUID,
  plan_id UUID,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | rewarded | cancelled
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  commission_paid_at TIMESTAMPTZ,
  wallet_transaction_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referred_user_id, membership_id)
);

CREATE INDEX IF NOT EXISTS idx_member_referrals_referrer ON public.member_referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_member_referrals_referred ON public.member_referrals(referred_user_id);

ALTER TABLE public.member_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own referrals (as referrer)"
ON public.member_referrals FOR SELECT
USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users view own referrals (as referred)"
ON public.member_referrals FOR SELECT
USING (auth.uid() = referred_user_id);

CREATE POLICY "Admins manage all referrals"
ON public.member_referrals FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_member_referrals_updated_at
BEFORE UPDATE ON public.member_referrals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5) Lookup helper
CREATE OR REPLACE FUNCTION public.get_referrer_by_code(_code TEXT)
RETURNS TABLE(user_id UUID, customer_id UUID, name TEXT)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.user_id, c.id, c.name
  FROM public.customers c
  WHERE c.referral_code = upper(_code)
  LIMIT 1;
$$;

-- 6) Trigger: pay referral commission when membership is activated
CREATE OR REPLACE FUNCTION public.handle_referral_on_membership_activation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan RECORD;
  v_commission NUMERIC;
  v_wallet_id UUID;
  v_tx_id UUID;
  v_referrer_name TEXT;
  v_referred_name TEXT;
BEGIN
  -- Only when activating and a referrer exists
  IF NEW.status = 'active'
     AND (OLD.status IS DISTINCT FROM 'active')
     AND NEW.referred_by IS NOT NULL
     AND NEW.referred_by <> NEW.user_id THEN

    SELECT * INTO v_plan FROM public.membership_plans WHERE id = NEW.plan_id;

    -- Calculate commission: percentage of plan price + fixed amount
    v_commission := COALESCE(v_plan.price, 0) * (COALESCE(v_plan.referral_commission_percentage, 0) / 100.0)
                    + COALESCE(v_plan.referral_commission_fixed, 0);

    IF v_commission > 0 THEN
      -- Ensure referrer wallet
      SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = NEW.referred_by;
      IF v_wallet_id IS NULL THEN
        INSERT INTO public.wallets (user_id) VALUES (NEW.referred_by) RETURNING id INTO v_wallet_id;
      END IF;

      SELECT name INTO v_referred_name FROM public.customers WHERE user_id = NEW.user_id LIMIT 1;

      -- Credit commission to referrer wallet
      INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
      VALUES (v_wallet_id, NEW.referred_by, 'deposit', v_commission,
              'عمولة إحالة - اشتراك ' || COALESCE(v_referred_name, 'عضو جديد') || ' في عضوية ' || v_plan.name_ar,
              'referral_commission', NEW.id)
      RETURNING id INTO v_tx_id;

      -- Upsert referral record
      INSERT INTO public.member_referrals
        (referrer_user_id, referred_user_id, referral_code, membership_id, plan_id,
         status, commission_amount, commission_paid_at, wallet_transaction_id)
      VALUES
        (NEW.referred_by, NEW.user_id, COALESCE(NEW.referral_code_used, 'DIRECT'),
         NEW.id, NEW.plan_id, 'rewarded', v_commission, now(), v_tx_id)
      ON CONFLICT (referred_user_id, membership_id) DO UPDATE
        SET status = 'rewarded',
            commission_amount = EXCLUDED.commission_amount,
            commission_paid_at = now(),
            wallet_transaction_id = EXCLUDED.wallet_transaction_id,
            updated_at = now();

      -- Notify referrer
      INSERT INTO public.user_notifications (user_id, title, message, type, link)
      VALUES (NEW.referred_by, '🎁 عمولة إحالة جديدة',
              'تم إيداع ' || v_commission || ' ر.س في محفظتك كعمولة إحالة',
              'wallet', '/membership');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_referral_commission ON public.user_memberships;
CREATE TRIGGER trg_referral_commission
AFTER UPDATE ON public.user_memberships
FOR EACH ROW
EXECUTE FUNCTION public.handle_referral_on_membership_activation();

-- 7) Track pending referrals when membership is first created with referrer
CREATE OR REPLACE FUNCTION public.handle_referral_on_membership_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL AND NEW.referred_by <> NEW.user_id THEN
    INSERT INTO public.member_referrals
      (referrer_user_id, referred_user_id, referral_code, membership_id, plan_id, status, commission_amount)
    VALUES
      (NEW.referred_by, NEW.user_id, COALESCE(NEW.referral_code_used, 'DIRECT'),
       NEW.id, NEW.plan_id, 'pending', 0)
    ON CONFLICT (referred_user_id, membership_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_referral_pending ON public.user_memberships;
CREATE TRIGGER trg_referral_pending
AFTER INSERT ON public.user_memberships
FOR EACH ROW
EXECUTE FUNCTION public.handle_referral_on_membership_created();
