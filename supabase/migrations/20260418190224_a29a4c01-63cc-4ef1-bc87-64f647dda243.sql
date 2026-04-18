-- Statistical analyses table
CREATE TABLE public.statistical_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'تحليل إحصائي',
  file_name TEXT,
  file_size INTEGER,
  row_count INTEGER DEFAULT 0,
  column_count INTEGER DEFAULT 0,
  columns_meta JSONB NOT NULL DEFAULT '[]'::jsonb,
  data_sample JSONB DEFAULT '[]'::jsonb,
  analysis_type TEXT,
  analysis_params JSONB DEFAULT '{}'::jsonb,
  results JSONB DEFAULT '{}'::jsonb,
  assumptions JSONB DEFAULT '{}'::jsonb,
  interpretation_ar TEXT,
  interpretation_en TEXT,
  language TEXT NOT NULL DEFAULT 'ar',
  status TEXT NOT NULL DEFAULT 'draft',
  is_paid BOOLEAN NOT NULL DEFAULT false,
  pdf_purchased BOOLEAN NOT NULL DEFAULT false,
  pdf_exports_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_stat_analyses_user ON public.statistical_analyses(user_id, created_at DESC);

ALTER TABLE public.statistical_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own analyses" ON public.statistical_analyses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own analyses" ON public.statistical_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own analyses" ON public.statistical_analyses
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own analyses" ON public.statistical_analyses
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins view all analyses" ON public.statistical_analyses
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_stat_analyses_updated_at
  BEFORE UPDATE ON public.statistical_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Purchase analysis execution (10 SAR, free for members)
CREATE OR REPLACE FUNCTION public.purchase_stat_analysis(_analysis_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_analysis RECORD;
  v_wallet RECORD;
  v_membership RECORD;
  v_price NUMERIC := 10;
  v_is_member BOOLEAN := false;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  SELECT * INTO v_analysis FROM public.statistical_analyses
   WHERE id = _analysis_id AND user_id = v_uid FOR UPDATE;
  IF v_analysis IS NULL THEN
    RAISE EXCEPTION 'التحليل غير موجود';
  END IF;

  IF v_analysis.is_paid THEN
    RETURN jsonb_build_object('ok', true, 'already_paid', true, 'charged', 0);
  END IF;

  SELECT * INTO v_membership FROM public.get_active_membership(v_uid);
  IF v_membership.membership_id IS NOT NULL THEN
    v_is_member := true;
    v_price := 0;
  END IF;

  IF v_price > 0 THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'تحليل إحصائي: ' || COALESCE(v_analysis.analysis_type, 'تحليل'),
            'statistical_analysis', _analysis_id);
  END IF;

  UPDATE public.statistical_analyses
     SET is_paid = true, status = 'paid', updated_at = now()
   WHERE id = _analysis_id;

  RETURN jsonb_build_object('ok', true, 'charged', v_price, 'is_member', v_is_member);
END;
$$;

-- Purchase PDF export (5 SAR, free for members, free for re-download)
CREATE OR REPLACE FUNCTION public.purchase_stat_pdf(_analysis_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_analysis RECORD;
  v_wallet RECORD;
  v_membership RECORD;
  v_price NUMERIC := 5;
  v_is_member BOOLEAN := false;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  SELECT * INTO v_analysis FROM public.statistical_analyses
   WHERE id = _analysis_id AND user_id = v_uid FOR UPDATE;
  IF v_analysis IS NULL THEN
    RAISE EXCEPTION 'التحليل غير موجود';
  END IF;
  IF NOT v_analysis.is_paid THEN
    RAISE EXCEPTION 'يجب تنفيذ التحليل أولاً';
  END IF;

  -- Re-download is free
  IF v_analysis.pdf_purchased THEN
    UPDATE public.statistical_analyses
       SET pdf_exports_count = pdf_exports_count + 1, updated_at = now()
     WHERE id = _analysis_id;
    RETURN jsonb_build_object('ok', true, 'already_purchased', true, 'charged', 0);
  END IF;

  SELECT * INTO v_membership FROM public.get_active_membership(v_uid);
  IF v_membership.membership_id IS NOT NULL THEN
    v_is_member := true;
    v_price := 0;
  END IF;

  IF v_price > 0 THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'تقرير PDF لتحليل إحصائي',
            'statistical_analysis_pdf', _analysis_id);
  END IF;

  UPDATE public.statistical_analyses
     SET pdf_purchased = true, pdf_exports_count = pdf_exports_count + 1, updated_at = now()
   WHERE id = _analysis_id;

  RETURN jsonb_build_object('ok', true, 'charged', v_price, 'is_member', v_is_member);
END;
$$;