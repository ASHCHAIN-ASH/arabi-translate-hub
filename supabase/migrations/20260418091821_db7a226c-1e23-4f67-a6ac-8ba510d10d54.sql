
-- =====================================================================
-- 1) AUDIT LOG TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.referral_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type text NOT NULL,
  referral_id uuid,
  referrer_user_id uuid,
  referred_user_id uuid,
  membership_id uuid,
  amount numeric DEFAULT 0,
  reason text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins view referral audit" ON public.referral_audit_logs;
CREATE POLICY "Admins view referral audit"
  ON public.referral_audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- block all client writes (no INSERT/UPDATE/DELETE policies = denied with RLS on)

CREATE INDEX IF NOT EXISTS idx_referral_audit_referral ON public.referral_audit_logs(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_audit_referrer ON public.referral_audit_logs(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_audit_created ON public.referral_audit_logs(created_at DESC);

-- =====================================================================
-- 2) HARDEN member_referrals RLS  (block client writes explicitly)
-- =====================================================================
ALTER TABLE public.member_referrals ENABLE ROW LEVEL SECURITY;

-- existing policies (Admins manage all + Users view own as referrer/referred) stay.
-- Add explicit DENY for any non-admin INSERT/UPDATE/DELETE by NOT creating any
-- such policy for clients. The "Admins manage all referrals" already covers admin.
-- To be extra safe, add restrictive policies that block client writes:

DROP POLICY IF EXISTS "Block client insert referrals" ON public.member_referrals;
CREATE POLICY "Block client insert referrals"
  ON public.member_referrals AS RESTRICTIVE FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Block client update referrals" ON public.member_referrals;
CREATE POLICY "Block client update referrals"
  ON public.member_referrals AS RESTRICTIVE FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Block client delete referrals" ON public.member_referrals;
CREATE POLICY "Block client delete referrals"
  ON public.member_referrals AS RESTRICTIVE FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- =====================================================================
-- 3) HARDEN wallet_transactions  (block ALL client writes)
-- =====================================================================
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Block client insert wallet tx" ON public.wallet_transactions;
CREATE POLICY "Block client insert wallet tx"
  ON public.wallet_transactions AS RESTRICTIVE FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Block client update wallet tx" ON public.wallet_transactions;
CREATE POLICY "Block client update wallet tx"
  ON public.wallet_transactions AS RESTRICTIVE FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Block client delete wallet tx" ON public.wallet_transactions;
CREATE POLICY "Block client delete wallet tx"
  ON public.wallet_transactions AS RESTRICTIVE FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role) OR auth.role() = 'service_role');

-- =====================================================================
-- 4) PREVENT SELF-REFERRAL at INSERT time on user_memberships
-- =====================================================================
CREATE OR REPLACE FUNCTION public.guard_membership_referral()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ref_email text;
  v_ref_phone text;
  v_self_email text;
  v_self_phone text;
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    -- Block self-referral
    IF NEW.referred_by = NEW.user_id THEN
      INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, reason)
      VALUES ('self_referral_blocked', NEW.referred_by, NEW.user_id, 'Self referral attempt blocked');
      NEW.referred_by := NULL;
      NEW.referral_code_used := NULL;
      RETURN NEW;
    END IF;

    -- Block multi-account abuse: same email/phone between referrer & referred
    SELECT email, phone INTO v_ref_email, v_ref_phone
      FROM public.customers WHERE user_id = NEW.referred_by LIMIT 1;
    SELECT email, phone INTO v_self_email, v_self_phone
      FROM public.customers WHERE user_id = NEW.user_id LIMIT 1;

    IF (v_ref_email IS NOT NULL AND v_ref_email = v_self_email)
       OR (v_ref_phone IS NOT NULL AND v_ref_phone IS DISTINCT FROM '' AND v_ref_phone = v_self_phone) THEN
      INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, reason, metadata)
      VALUES ('duplicate_identity_blocked', NEW.referred_by, NEW.user_id,
              'Same email or phone between referrer and referred',
              jsonb_build_object('email_match', v_ref_email = v_self_email,
                                 'phone_match', v_ref_phone = v_self_phone));
      NEW.referred_by := NULL;
      NEW.referral_code_used := NULL;
      RETURN NEW;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_membership_referral ON public.user_memberships;
CREATE TRIGGER trg_guard_membership_referral
  BEFORE INSERT OR UPDATE OF referred_by ON public.user_memberships
  FOR EACH ROW EXECUTE FUNCTION public.guard_membership_referral();

-- =====================================================================
-- 5) HARDEN handle_referral_on_membership_activation
--    - server-side commission calc
--    - check plan.is_active
--    - prevent double-reward via status check + advisory lock
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_referral_on_membership_activation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan          RECORD;
  v_commission    NUMERIC := 0;
  v_wallet_id     UUID;
  v_tx_id         UUID;
  v_referred_name TEXT;
  v_existing      RECORD;
BEGIN
  -- Only on transition INTO active with a valid referrer
  IF NEW.status <> 'active'
     OR OLD.status IS NOT DISTINCT FROM 'active'
     OR NEW.referred_by IS NULL
     OR NEW.referred_by = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Hard re-check self referral (defense in depth)
  IF NEW.referred_by = NEW.user_id THEN
    INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('self_referral_blocked', NEW.referred_by, NEW.user_id, NEW.id, 'Detected at activation');
    RETURN NEW;
  END IF;

  -- Advisory lock to serialize per (referred_user, membership)
  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.user_id::text || ':' || NEW.id::text, 0));

  -- Idempotency: refuse if a rewarded record already exists for this referred user (any membership)
  SELECT * INTO v_existing FROM public.member_referrals
   WHERE referred_user_id = NEW.user_id
     AND status = 'rewarded'
   LIMIT 1;

  IF FOUND THEN
    INSERT INTO public.referral_audit_logs(action_type, referral_id, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('double_reward_blocked', v_existing.id, NEW.referred_by, NEW.user_id, NEW.id,
            'Referred user already rewarded once');
    RETURN NEW;
  END IF;

  -- Refuse if this exact (referred, membership) is already rewarded
  SELECT * INTO v_existing FROM public.member_referrals
   WHERE referred_user_id = NEW.user_id AND membership_id = NEW.id
   LIMIT 1;
  IF FOUND AND v_existing.status = 'rewarded' THEN
    INSERT INTO public.referral_audit_logs(action_type, referral_id, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('double_reward_blocked', v_existing.id, NEW.referred_by, NEW.user_id, NEW.id,
            'Membership already rewarded');
    RETURN NEW;
  END IF;

  -- Server-side plan lookup; require active plan
  SELECT * INTO v_plan FROM public.membership_plans WHERE id = NEW.plan_id;
  IF NOT FOUND OR v_plan.is_active IS DISTINCT FROM TRUE THEN
    INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('inactive_plan_blocked', NEW.referred_by, NEW.user_id, NEW.id, 'Plan missing or inactive');
    RETURN NEW;
  END IF;

  -- Commission strictly from DB
  v_commission := COALESCE(v_plan.price, 0) * (COALESCE(v_plan.referral_commission_percentage, 0) / 100.0)
                  + COALESCE(v_plan.referral_commission_fixed, 0);

  IF v_commission <= 0 THEN
    INSERT INTO public.member_referrals
      (referrer_user_id, referred_user_id, referral_code, membership_id, plan_id, status, commission_amount)
    VALUES
      (NEW.referred_by, NEW.user_id, COALESCE(NEW.referral_code_used,'DIRECT'),
       NEW.id, NEW.plan_id, 'pending', 0)
    ON CONFLICT (referred_user_id, membership_id) DO NOTHING;

    INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, membership_id, amount, reason)
    VALUES ('referral_created_zero', NEW.referred_by, NEW.user_id, NEW.id, 0, 'No commission configured for plan');
    RETURN NEW;
  END IF;

  -- Ensure referrer wallet
  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = NEW.referred_by;
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.wallets (user_id) VALUES (NEW.referred_by) RETURNING id INTO v_wallet_id;
  END IF;

  SELECT name INTO v_referred_name FROM public.customers WHERE user_id = NEW.user_id LIMIT 1;

  -- Mark referral row as rewarded BEFORE crediting (atomic in same tx); UNIQUE prevents duplicates
  INSERT INTO public.member_referrals
    (referrer_user_id, referred_user_id, referral_code, membership_id, plan_id,
     status, commission_amount, commission_paid_at)
  VALUES
    (NEW.referred_by, NEW.user_id, COALESCE(NEW.referral_code_used,'DIRECT'),
     NEW.id, NEW.plan_id, 'rewarded', v_commission, now())
  ON CONFLICT (referred_user_id, membership_id) DO UPDATE
    SET status = 'rewarded',
        commission_amount = EXCLUDED.commission_amount,
        commission_paid_at = now(),
        updated_at = now()
    WHERE public.member_referrals.status <> 'rewarded'  -- key guard
  RETURNING id INTO v_tx_id;

  -- If no row returned, it means status was already 'rewarded' → abort (double reward attempt)
  IF v_tx_id IS NULL THEN
    INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('double_reward_blocked', NEW.referred_by, NEW.user_id, NEW.id, 'Race condition prevented');
    RETURN NEW;
  END IF;

  -- Credit wallet via the existing apply_wallet_transaction trigger
  INSERT INTO public.wallet_transactions
    (wallet_id, user_id, type, amount, description, reference_type, reference_id)
  VALUES
    (v_wallet_id, NEW.referred_by, 'deposit', v_commission,
     'عمولة إحالة - اشتراك ' || COALESCE(v_referred_name,'عضو جديد') || ' في عضوية ' || v_plan.name_ar,
     'referral_commission', NEW.id);

  -- Notify referrer
  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  VALUES (NEW.referred_by, '🎁 عمولة إحالة جديدة',
          'تم إيداع ' || v_commission || ' ر.س في محفظتك كعمولة إحالة',
          'wallet', '/membership');

  -- Audit
  INSERT INTO public.referral_audit_logs
    (action_type, referral_id, referrer_user_id, referred_user_id, membership_id, amount, reason, metadata)
  VALUES
    ('referral_rewarded', v_tx_id, NEW.referred_by, NEW.user_id, NEW.id, v_commission,
     'Commission credited',
     jsonb_build_object('plan_code', v_plan.code, 'plan_price', v_plan.price,
                        'pct', v_plan.referral_commission_percentage,
                        'fixed', v_plan.referral_commission_fixed));

  RETURN NEW;
END;
$$;

-- Make sure trigger exists
DROP TRIGGER IF EXISTS trg_referral_on_activation ON public.user_memberships;
CREATE TRIGGER trg_referral_on_activation
  AFTER UPDATE OF status ON public.user_memberships
  FOR EACH ROW EXECUTE FUNCTION public.handle_referral_on_membership_activation();

-- =====================================================================
-- 6) Audit on referral row INSERT (pending)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.log_referral_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.referral_audit_logs
    (action_type, referral_id, referrer_user_id, referred_user_id, membership_id, amount, reason)
  VALUES
    ('referral_created', NEW.id, NEW.referrer_user_id, NEW.referred_user_id, NEW.membership_id,
     NEW.commission_amount, 'Referral row created with status=' || NEW.status);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_referral_created ON public.member_referrals;
CREATE TRIGGER trg_log_referral_created
  AFTER INSERT ON public.member_referrals
  FOR EACH ROW EXECUTE FUNCTION public.log_referral_created();
