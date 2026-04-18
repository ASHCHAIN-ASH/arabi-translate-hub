-- جدول سجلات استخدام المحرر الذكي
CREATE TABLE IF NOT EXISTS public.smart_editor_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('correct','rephrase','academic','shorten','expand')),
  mode TEXT NOT NULL DEFAULT 'standard' CHECK (mode IN ('standard','pro')),
  input_length INT NOT NULL DEFAULT 0,
  output_length INT NOT NULL DEFAULT 0,
  cost NUMERIC NOT NULL DEFAULT 0,
  was_free BOOLEAN NOT NULL DEFAULT false,
  wallet_transaction_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_smart_editor_usage_user_date ON public.smart_editor_usage(user_id, created_at DESC);

ALTER TABLE public.smart_editor_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON public.smart_editor_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage"
  ON public.smart_editor_usage FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RPC للتحقق من الرصيد والحصة قبل الاستخدام (يستدعى من Edge Function)
CREATE OR REPLACE FUNCTION public.use_smart_editor(_operation TEXT, _mode TEXT, _input_length INT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_used_today INT;
  v_wallet RECORD;
  v_was_free BOOLEAN := false;
  v_tx_id UUID;
  v_price NUMERIC;
  v_free_quota INT := 3;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  IF _operation NOT IN ('correct','rephrase','academic','shorten','expand') THEN
    RAISE EXCEPTION 'عملية غير صالحة';
  END IF;

  IF _mode NOT IN ('standard','pro') THEN
    RAISE EXCEPTION 'نمط غير صالح';
  END IF;

  -- أسعار: Standard 2 ر.س | Pro 7 ر.س
  IF _mode = 'pro' THEN
    v_price := 7;
  ELSE
    v_price := 2;
    -- حصة مجانية يومية للنمط القياسي فقط
    SELECT COUNT(*) INTO v_used_today
      FROM public.smart_editor_usage
     WHERE user_id = v_uid
       AND created_at::date = CURRENT_DATE
       AND was_free = true;
    IF v_used_today < v_free_quota THEN
      v_was_free := true;
    END IF;
  END IF;

  -- خصم من المحفظة إن لم يكن مجانياً
  IF NOT v_was_free THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'المحرر الذكي - ' ||
            CASE _operation
              WHEN 'correct' THEN 'تصحيح'
              WHEN 'rephrase' THEN 'إعادة صياغة'
              WHEN 'academic' THEN 'رفع أكاديمي'
              WHEN 'shorten' THEN 'اختصار'
              WHEN 'expand' THEN 'توسيع'
            END ||
            CASE WHEN _mode = 'pro' THEN ' (متقدم)' ELSE '' END,
            'smart_editor')
    RETURNING id INTO v_tx_id;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'was_free', v_was_free,
    'charged', CASE WHEN v_was_free THEN 0 ELSE v_price END,
    'mode', _mode,
    'wallet_transaction_id', v_tx_id,
    'free_quota_remaining', GREATEST(0, v_free_quota - v_used_today - CASE WHEN v_was_free THEN 1 ELSE 0 END)
  );
END;
$$;

-- RPC لتسجيل النتيجة بعد نجاح المعالجة
CREATE OR REPLACE FUNCTION public.log_smart_editor_usage(
  _operation TEXT,
  _mode TEXT,
  _input_length INT,
  _output_length INT,
  _cost NUMERIC,
  _was_free BOOLEAN,
  _wallet_transaction_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  INSERT INTO public.smart_editor_usage
    (user_id, operation, mode, input_length, output_length, cost, was_free, wallet_transaction_id)
  VALUES
    (v_uid, _operation, _mode, _input_length, _output_length, _cost, _was_free, _wallet_transaction_id)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;