-- Academic CVs table
CREATE TABLE IF NOT EXISTS public.academic_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'سيرتي الذاتية',
  language TEXT NOT NULL DEFAULT 'ar' CHECK (language IN ('ar','en')),
  template_key TEXT NOT NULL DEFAULT 'minimal',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','paid')),
  exports_count INTEGER NOT NULL DEFAULT 0,
  last_exported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_academic_cvs_user ON public.academic_cvs(user_id, updated_at DESC);

ALTER TABLE public.academic_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own CVs" ON public.academic_cvs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own CVs" ON public.academic_cvs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own CVs" ON public.academic_cvs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own CVs" ON public.academic_cvs
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all CVs" ON public.academic_cvs
  FOR SELECT USING (public.has_role(auth.uid(),'admin'::app_role));

CREATE TRIGGER trg_academic_cvs_updated
  BEFORE UPDATE ON public.academic_cvs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Purchase CV export (charges wallet, free for active members)
CREATE OR REPLACE FUNCTION public.purchase_cv_export(_cv_id UUID)
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
  v_price NUMERIC := 15;  -- 15 SAR per export
  v_was_free BOOLEAN := false;
  v_tx_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  SELECT * INTO v_cv FROM public.academic_cvs WHERE id = _cv_id AND user_id = v_uid;
  IF v_cv IS NULL THEN
    RAISE EXCEPTION 'السيرة غير موجودة';
  END IF;

  -- Free for active members
  SELECT * INTO v_membership FROM public.get_active_membership(v_uid) LIMIT 1;
  IF v_membership.membership_id IS NOT NULL THEN
    v_was_free := true;
  END IF;

  -- Free if already paid before (allow re-download)
  IF v_cv.status = 'paid' THEN
    v_was_free := true;
  END IF;

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
            'تصدير سيرة ذاتية أكاديمية',
            'academic_cv', _cv_id)
    RETURNING id INTO v_tx_id;
  END IF;

  UPDATE public.academic_cvs
     SET status = 'paid',
         exports_count = exports_count + 1,
         last_exported_at = now(),
         updated_at = now()
   WHERE id = _cv_id;

  RETURN jsonb_build_object(
    'ok', true,
    'was_free', v_was_free,
    'charged', CASE WHEN v_was_free THEN 0 ELSE v_price END,
    'wallet_transaction_id', v_tx_id
  );
END;
$$;