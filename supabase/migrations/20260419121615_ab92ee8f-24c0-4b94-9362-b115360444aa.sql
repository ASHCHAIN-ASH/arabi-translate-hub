
-- =========================================================
-- CV PURCHASE HARDENING — Phase 1
-- One purchase = one CV = one locked template
-- Free template swap allowed once within 24h of payment
-- =========================================================

-- 1) Extend academic_cvs with purchase-lock fields
ALTER TABLE public.academic_cvs
  ADD COLUMN IF NOT EXISTS locked_template_key TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS paid_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS template_swap_used BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS template_swap_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS purchase_id UUID;

-- Widen the status enum to support the full lifecycle
ALTER TABLE public.academic_cvs DROP CONSTRAINT IF EXISTS academic_cvs_status_check;
ALTER TABLE public.academic_cvs
  ADD CONSTRAINT academic_cvs_status_check
  CHECK (status IN ('draft','pending_payment','paid','archived'));

-- 2) cv_purchases — strict audit log: 1 purchase ↔ 1 cv ↔ 1 template
CREATE TABLE IF NOT EXISTS public.cv_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cv_id UUID NOT NULL REFERENCES public.academic_cvs(id) ON DELETE CASCADE,
  template_key TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  was_free BOOLEAN NOT NULL DEFAULT false,
  free_reason TEXT,                       -- 'membership' | 'manual' | NULL
  payment_method TEXT NOT NULL DEFAULT 'wallet'
    CHECK (payment_method IN ('wallet','gateway','manual')),
  wallet_transaction_id UUID REFERENCES public.wallet_transactions(id),
  payment_intent_id UUID REFERENCES public.payment_intents(id),
  status TEXT NOT NULL DEFAULT 'completed'
    CHECK (status IN ('pending','completed','refunded','failed')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- HARD RULE: a CV can have at most one completed purchase
  CONSTRAINT cv_purchases_one_per_cv UNIQUE (cv_id)
);

CREATE INDEX IF NOT EXISTS idx_cv_purchases_user ON public.cv_purchases(user_id, created_at DESC);

ALTER TABLE public.cv_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own cv purchases" ON public.cv_purchases
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all cv purchases" ON public.cv_purchases
  FOR SELECT USING (public.has_role(auth.uid(),'admin'::app_role));
-- INSERT/UPDATE only via SECURITY DEFINER functions; deny direct writes.

-- 3) Guard trigger: prevent client tampering with lock fields after payment
CREATE OR REPLACE FUNCTION public.guard_academic_cv_lock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins always pass
  IF auth.uid() IS NULL OR public.has_role(auth.uid(),'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- Lock fields are server-managed: client cannot modify them
  IF NEW.status              IS DISTINCT FROM OLD.status
     OR NEW.locked_template_key IS DISTINCT FROM OLD.locked_template_key
     OR NEW.paid_at             IS DISTINCT FROM OLD.paid_at
     OR NEW.paid_amount         IS DISTINCT FROM OLD.paid_amount
     OR NEW.template_swap_used  IS DISTINCT FROM OLD.template_swap_used
     OR NEW.template_swap_deadline IS DISTINCT FROM OLD.template_swap_deadline
     OR NEW.purchase_id         IS DISTINCT FROM OLD.purchase_id
     OR NEW.exports_count       IS DISTINCT FROM OLD.exports_count
     OR NEW.last_exported_at    IS DISTINCT FROM OLD.last_exported_at
  THEN
    RAISE EXCEPTION 'لا يمكن تعديل حقول الشراء/القفل مباشرة';
  END IF;

  -- After payment, template_key must equal locked_template_key
  IF OLD.status = 'paid' AND NEW.template_key IS DISTINCT FROM OLD.locked_template_key THEN
    RAISE EXCEPTION 'القالب مقفول بعد الدفع — استخدم زر تبديل القالب';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_academic_cv_lock ON public.academic_cvs;
CREATE TRIGGER trg_guard_academic_cv_lock
  BEFORE UPDATE ON public.academic_cvs
  FOR EACH ROW EXECUTE FUNCTION public.guard_academic_cv_lock();

-- 4) NEW purchase function — replaces purchase_cv_export
-- Locks the chosen template, creates cv_purchases row, sets 24h swap window
CREATE OR REPLACE FUNCTION public.purchase_cv(_cv_id UUID, _template_key TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_cv RECORD;
  v_wallet RECORD;
  v_membership RECORD;
  v_price NUMERIC := 15;
  v_was_free BOOLEAN := false;
  v_free_reason TEXT := NULL;
  v_tx_id UUID := NULL;
  v_purchase_id UUID;
  v_existing_purchase RECORD;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;
  IF _template_key IS NULL OR length(_template_key) = 0 THEN
    RAISE EXCEPTION 'يجب اختيار قالب';
  END IF;

  -- Lock the CV row
  SELECT * INTO v_cv FROM public.academic_cvs
   WHERE id = _cv_id AND user_id = v_uid FOR UPDATE;
  IF v_cv IS NULL THEN
    RAISE EXCEPTION 'السيرة غير موجودة';
  END IF;

  -- Idempotency: if already purchased, return success without re-charging
  SELECT * INTO v_existing_purchase FROM public.cv_purchases
   WHERE cv_id = _cv_id AND status = 'completed' LIMIT 1;
  IF v_existing_purchase.id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'ok', true,
      'already_purchased', true,
      'purchase_id', v_existing_purchase.id,
      'locked_template_key', v_cv.locked_template_key,
      'charged', 0
    );
  END IF;

  -- Member benefit
  SELECT * INTO v_membership FROM public.get_active_membership(v_uid) LIMIT 1;
  IF v_membership.membership_id IS NOT NULL THEN
    v_was_free := true;
    v_free_reason := 'membership';
  END IF;

  -- Charge wallet if not free
  IF NOT v_was_free THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets(user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions(wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'شراء سيرة ذاتية أكاديمية',
            'academic_cv', _cv_id)
    RETURNING id INTO v_tx_id;
  END IF;

  -- Create purchase record (UNIQUE on cv_id guarantees one-per-CV)
  INSERT INTO public.cv_purchases(
    user_id, cv_id, template_key, amount, was_free, free_reason,
    payment_method, wallet_transaction_id, status
  ) VALUES (
    v_uid, _cv_id, _template_key,
    CASE WHEN v_was_free THEN 0 ELSE v_price END,
    v_was_free, v_free_reason,
    'wallet', v_tx_id, 'completed'
  ) RETURNING id INTO v_purchase_id;

  -- Lock CV: set template, paid_at, swap window
  -- We bypass the guard trigger by being SECURITY DEFINER + direct UPDATE
  -- (the trigger checks auth.uid() role; we're running as definer but the
  -- trigger compares OLD vs NEW, so we must be careful — easier to disable
  -- it for this update via a session GUC).
  PERFORM set_config('app.bypass_cv_lock_guard', 'true', true);
  UPDATE public.academic_cvs
     SET status = 'paid',
         template_key = _template_key,
         locked_template_key = _template_key,
         paid_at = now(),
         paid_amount = CASE WHEN v_was_free THEN 0 ELSE v_price END,
         purchase_id = v_purchase_id,
         template_swap_used = false,
         template_swap_deadline = now() + interval '24 hours',
         updated_at = now()
   WHERE id = _cv_id;
  PERFORM set_config('app.bypass_cv_lock_guard', 'false', true);

  RETURN jsonb_build_object(
    'ok', true,
    'purchase_id', v_purchase_id,
    'was_free', v_was_free,
    'free_reason', v_free_reason,
    'charged', CASE WHEN v_was_free THEN 0 ELSE v_price END,
    'locked_template_key', _template_key,
    'swap_deadline', (now() + interval '24 hours')
  );
END;
$$;

-- 5) Update guard trigger to honor the bypass flag
CREATE OR REPLACE FUNCTION public.guard_academic_cv_lock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF current_setting('app.bypass_cv_lock_guard', true) = 'true' THEN
    RETURN NEW;
  END IF;
  IF auth.uid() IS NULL OR public.has_role(auth.uid(),'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.status              IS DISTINCT FROM OLD.status
     OR NEW.locked_template_key IS DISTINCT FROM OLD.locked_template_key
     OR NEW.paid_at             IS DISTINCT FROM OLD.paid_at
     OR NEW.paid_amount         IS DISTINCT FROM OLD.paid_amount
     OR NEW.template_swap_used  IS DISTINCT FROM OLD.template_swap_used
     OR NEW.template_swap_deadline IS DISTINCT FROM OLD.template_swap_deadline
     OR NEW.purchase_id         IS DISTINCT FROM OLD.purchase_id
     OR NEW.exports_count       IS DISTINCT FROM OLD.exports_count
     OR NEW.last_exported_at    IS DISTINCT FROM OLD.last_exported_at
  THEN
    RAISE EXCEPTION 'لا يمكن تعديل حقول الشراء/القفل مباشرة';
  END IF;

  IF OLD.status = 'paid' AND NEW.template_key IS DISTINCT FROM OLD.locked_template_key THEN
    RAISE EXCEPTION 'القالب مقفول بعد الدفع — استخدم زر تبديل القالب';
  END IF;

  RETURN NEW;
END;
$$;

-- 6) Free template swap (once within 24h of payment)
CREATE OR REPLACE FUNCTION public.swap_cv_template(_cv_id UUID, _new_template_key TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_cv RECORD;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  IF _new_template_key IS NULL OR length(_new_template_key) = 0 THEN
    RAISE EXCEPTION 'يجب اختيار قالب';
  END IF;

  SELECT * INTO v_cv FROM public.academic_cvs
   WHERE id = _cv_id AND user_id = v_uid FOR UPDATE;
  IF v_cv IS NULL THEN RAISE EXCEPTION 'السيرة غير موجودة'; END IF;

  IF v_cv.status <> 'paid' THEN
    RAISE EXCEPTION 'لا يمكن تبديل القالب قبل الدفع';
  END IF;
  IF v_cv.template_swap_used THEN
    RAISE EXCEPTION 'لقد استخدمت تبديل القالب المجاني سابقاً';
  END IF;
  IF v_cv.template_swap_deadline IS NULL OR now() > v_cv.template_swap_deadline THEN
    RAISE EXCEPTION 'انتهت نافذة تبديل القالب المجاني (24 ساعة)';
  END IF;
  IF _new_template_key = v_cv.locked_template_key THEN
    RAISE EXCEPTION 'القالب الجديد مطابق للحالي';
  END IF;

  PERFORM set_config('app.bypass_cv_lock_guard', 'true', true);
  UPDATE public.academic_cvs
     SET template_key = _new_template_key,
         locked_template_key = _new_template_key,
         template_swap_used = true,
         updated_at = now()
   WHERE id = _cv_id;
  PERFORM set_config('app.bypass_cv_lock_guard', 'false', true);

  -- Audit on the purchase
  UPDATE public.cv_purchases
     SET metadata = metadata || jsonb_build_object(
           'template_swapped_at', now(),
           'template_swapped_from', v_cv.locked_template_key,
           'template_swapped_to', _new_template_key
         )
   WHERE cv_id = _cv_id;

  RETURN jsonb_build_object(
    'ok', true,
    'new_template_key', _new_template_key,
    'swap_used', true
  );
END;
$$;

-- 7) Record export attempt (only allowed if paid or member)
CREATE OR REPLACE FUNCTION public.record_cv_export(_cv_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_cv RECORD;
  v_membership RECORD;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  SELECT * INTO v_cv FROM public.academic_cvs WHERE id = _cv_id AND user_id = v_uid;
  IF v_cv IS NULL THEN RAISE EXCEPTION 'السيرة غير موجودة'; END IF;

  SELECT * INTO v_membership FROM public.get_active_membership(v_uid) LIMIT 1;

  IF v_cv.status <> 'paid' AND v_membership.membership_id IS NULL THEN
    RAISE EXCEPTION 'هذه السيرة غير مدفوعة — لا يمكن التصدير';
  END IF;

  PERFORM set_config('app.bypass_cv_lock_guard', 'true', true);
  UPDATE public.academic_cvs
     SET exports_count = exports_count + 1,
         last_exported_at = now(),
         updated_at = now()
   WHERE id = _cv_id;
  PERFORM set_config('app.bypass_cv_lock_guard', 'false', true);

  RETURN jsonb_build_object('ok', true, 'exports_count', v_cv.exports_count + 1);
END;
$$;

-- 8) Backfill: existing 'paid' CVs get their template locked retroactively
UPDATE public.academic_cvs
   SET locked_template_key = template_key,
       paid_at = COALESCE(paid_at, last_exported_at, updated_at),
       template_swap_used = true,        -- past purchases don't get a swap window
       template_swap_deadline = NULL
 WHERE status = 'paid' AND locked_template_key IS NULL;

-- Backfill cv_purchases for already-paid CVs (no wallet tx — historical)
INSERT INTO public.cv_purchases(user_id, cv_id, template_key, amount, was_free, free_reason, payment_method, status, metadata)
SELECT user_id, id, COALESCE(locked_template_key, template_key), 0, true, 'backfill', 'manual', 'completed',
       jsonb_build_object('backfilled', true, 'original_paid_at', paid_at)
  FROM public.academic_cvs
 WHERE status = 'paid'
   AND id NOT IN (SELECT cv_id FROM public.cv_purchases)
ON CONFLICT (cv_id) DO NOTHING;

-- Link backfilled purchase_id
UPDATE public.academic_cvs cv
   SET purchase_id = p.id
  FROM public.cv_purchases p
 WHERE p.cv_id = cv.id AND cv.purchase_id IS NULL;

-- 9) Deprecate the old function (keep for backward compat — proxies to new one)
CREATE OR REPLACE FUNCTION public.purchase_cv_export(_cv_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_template TEXT;
BEGIN
  SELECT template_key INTO v_template FROM public.academic_cvs WHERE id = _cv_id;
  IF v_template IS NULL THEN RAISE EXCEPTION 'السيرة غير موجودة'; END IF;
  RETURN public.purchase_cv(_cv_id, v_template);
END;
$$;
