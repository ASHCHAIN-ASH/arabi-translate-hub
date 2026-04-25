-- Withdrawal requests table for referral earnings (and wallet balance generally)
CREATE TYPE public.withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'paid');

CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount >= 100),
  bank_name TEXT NOT NULL,
  account_holder_name TEXT NOT NULL,
  iban TEXT NOT NULL,
  notes TEXT,
  status public.withdrawal_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  hold_transaction_id UUID,
  refund_transaction_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_withdrawal_requests_user ON public.withdrawal_requests(user_id, created_at DESC);
CREATE INDEX idx_withdrawal_requests_status ON public.withdrawal_requests(status, created_at DESC);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Users: see own
CREATE POLICY "Users view own withdrawals"
ON public.withdrawal_requests FOR SELECT
USING (auth.uid() = user_id);

-- Admins: full access
CREATE POLICY "Admins view all withdrawals"
ON public.withdrawal_requests FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update withdrawals"
ON public.withdrawal_requests FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- No direct INSERT — must go through RPC `request_withdrawal`
CREATE POLICY "Block direct insert"
ON public.withdrawal_requests FOR INSERT
WITH CHECK (false);

-- Updated_at trigger
CREATE TRIGGER trg_withdrawal_requests_updated_at
BEFORE UPDATE ON public.withdrawal_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== RPC: request_withdrawal =====
-- Creates a withdrawal request and immediately debits the wallet (hold).
CREATE OR REPLACE FUNCTION public.request_withdrawal(
  _amount NUMERIC,
  _bank_name TEXT,
  _account_holder_name TEXT,
  _iban TEXT,
  _notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_wallet_id UUID;
  v_balance NUMERIC;
  v_tx_id UUID;
  v_req_id UUID;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  IF _amount IS NULL OR _amount < 100 THEN
    RETURN jsonb_build_object('success', false, 'error', 'الحد الأدنى للسحب 100 ر.س');
  END IF;

  IF coalesce(trim(_bank_name),'')='' OR coalesce(trim(_account_holder_name),'')=''
     OR coalesce(trim(_iban),'')='' THEN
    RETURN jsonb_build_object('success', false, 'error', 'بيانات بنكية ناقصة');
  END IF;

  -- Lock wallet row
  SELECT id, balance INTO v_wallet_id, v_balance
  FROM public.wallets WHERE user_id = v_user FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'لا توجد محفظة');
  END IF;

  IF v_balance < _amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'الرصيد غير كافٍ');
  END IF;

  -- Create request (bypass RLS via SECURITY DEFINER)
  INSERT INTO public.withdrawal_requests
    (user_id, amount, bank_name, account_holder_name, iban, notes)
  VALUES
    (v_user, _amount, trim(_bank_name), trim(_account_holder_name), trim(_iban), _notes)
  RETURNING id INTO v_req_id;

  -- Debit wallet (hold)
  INSERT INTO public.wallet_transactions
    (wallet_id, user_id, type, amount, description, reference_type, reference_id)
  VALUES
    (v_wallet_id, v_user, 'withdrawal', _amount,
     'طلب سحب أرباح إلى ' || trim(_bank_name),
     'withdrawal_request', v_req_id)
  RETURNING id INTO v_tx_id;

  UPDATE public.withdrawal_requests
     SET hold_transaction_id = v_tx_id
   WHERE id = v_req_id;

  RETURN jsonb_build_object('success', true, 'request_id', v_req_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.request_withdrawal(NUMERIC, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- ===== RPC: refund on rejection (called by trigger) =====
CREATE OR REPLACE FUNCTION public.handle_withdrawal_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet_id UUID;
  v_tx_id UUID;
BEGIN
  -- On rejection: refund hold to wallet (only once)
  IF NEW.status = 'rejected' AND OLD.status <> 'rejected' AND NEW.refund_transaction_id IS NULL THEN
    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = NEW.user_id;
    IF v_wallet_id IS NOT NULL THEN
      INSERT INTO public.wallet_transactions
        (wallet_id, user_id, type, amount, description, reference_type, reference_id)
      VALUES
        (v_wallet_id, NEW.user_id, 'deposit', NEW.amount,
         'استرجاع طلب سحب مرفوض',
         'withdrawal_refund', NEW.id)
      RETURNING id INTO v_tx_id;
      NEW.refund_transaction_id := v_tx_id;
    END IF;
    NEW.reviewed_at := COALESCE(NEW.reviewed_at, now());
  END IF;

  IF NEW.status = 'approved' AND OLD.status <> 'approved' THEN
    NEW.reviewed_at := COALESCE(NEW.reviewed_at, now());
  END IF;

  IF NEW.status = 'paid' AND OLD.status <> 'paid' THEN
    NEW.paid_at := COALESCE(NEW.paid_at, now());
  END IF;

  -- Notify user
  IF NEW.status <> OLD.status THEN
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (
      NEW.user_id,
      CASE NEW.status
        WHEN 'approved' THEN '✅ تمت الموافقة على طلب السحب'
        WHEN 'rejected' THEN '❌ رُفض طلب السحب'
        WHEN 'paid'     THEN '💸 تم تحويل أرباحك'
        ELSE 'تحديث طلب سحب'
      END,
      'مبلغ ' || NEW.amount || ' ر.س — ' ||
      CASE NEW.status
        WHEN 'rejected' THEN COALESCE('سبب: ' || NEW.admin_notes, 'تم إعادة المبلغ إلى محفظتك')
        WHEN 'paid' THEN 'تم التحويل إلى ' || NEW.bank_name
        ELSE 'حالة جديدة: ' || NEW.status
      END,
      'wallet', '/referrals'
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_withdrawal_status_change
BEFORE UPDATE ON public.withdrawal_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_withdrawal_status_change();