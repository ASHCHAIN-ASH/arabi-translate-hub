-- 1. WALLETS TABLE
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  total_deposited NUMERIC NOT NULL DEFAULT 0,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage wallets" ON public.wallets FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_wallets_updated_at BEFORE UPDATE ON public.wallets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. WALLET TRANSACTIONS
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- deposit, withdrawal, payment, refund, adjustment
  amount NUMERIC NOT NULL,
  balance_after NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  reference_type TEXT, -- invoice, order, manual, topup_request
  reference_id UUID,
  created_by UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own wallet transactions" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage wallet transactions" ON public.wallet_transactions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_wallet_tx_wallet ON public.wallet_transactions(wallet_id, created_at DESC);
CREATE INDEX idx_wallet_tx_user ON public.wallet_transactions(user_id, created_at DESC);

-- 3. TOP-UP REQUESTS
CREATE TABLE public.wallet_topup_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  reference_number TEXT,
  notes TEXT,
  receipt_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallet_topup_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own topup requests" ON public.wallet_topup_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own topup requests" ON public.wallet_topup_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage topup requests" ON public.wallet_topup_requests FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_topup_updated_at BEFORE UPDATE ON public.wallet_topup_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. AUTO-CREATE WALLET ON PROFILE CREATION
CREATE OR REPLACE FUNCTION public.create_wallet_for_new_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.wallets (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_create_wallet_on_profile
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.create_wallet_for_new_profile();

-- 5. APPLY TRANSACTION → UPDATE WALLET BALANCE
CREATE OR REPLACE FUNCTION public.apply_wallet_transaction()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_balance NUMERIC;
BEGIN
  SELECT balance INTO v_balance FROM public.wallets WHERE id = NEW.wallet_id FOR UPDATE;
  IF v_balance IS NULL THEN RAISE EXCEPTION 'Wallet not found'; END IF;

  IF NEW.type IN ('deposit', 'refund') THEN
    v_balance := v_balance + NEW.amount;
    UPDATE public.wallets SET balance = v_balance, total_deposited = total_deposited + NEW.amount, updated_at = now() WHERE id = NEW.wallet_id;
  ELSIF NEW.type IN ('withdrawal', 'payment') THEN
    IF v_balance < NEW.amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
    v_balance := v_balance - NEW.amount;
    UPDATE public.wallets SET balance = v_balance, total_spent = total_spent + NEW.amount, updated_at = now() WHERE id = NEW.wallet_id;
  ELSIF NEW.type = 'adjustment' THEN
    v_balance := v_balance + NEW.amount;
    UPDATE public.wallets SET balance = v_balance, updated_at = now() WHERE id = NEW.wallet_id;
  END IF;

  NEW.balance_after := v_balance;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_apply_wallet_tx BEFORE INSERT ON public.wallet_transactions
FOR EACH ROW EXECUTE FUNCTION public.apply_wallet_transaction();

-- 6. APPROVE TOPUP → CREATE DEPOSIT TRANSACTION
CREATE OR REPLACE FUNCTION public.handle_topup_approved()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  IF NEW.status = 'approved' AND OLD.status IS DISTINCT FROM 'approved' THEN
    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = NEW.user_id;
    IF v_wallet_id IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (NEW.user_id) RETURNING id INTO v_wallet_id;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id, created_by)
    VALUES (v_wallet_id, NEW.user_id, 'deposit', NEW.amount,
            'شحن رصيد - طلب رقم #' || substring(NEW.id::text from 1 for 8),
            'topup_request', NEW.id, NEW.reviewed_by);

    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, '✅ تم شحن محفظتك',
            'تمت إضافة ' || NEW.amount || ' ر.س إلى محفظتك بنجاح',
            'wallet', '/wallet');
  END IF;

  IF NEW.status = 'rejected' AND OLD.status IS DISTINCT FROM 'rejected' THEN
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, '❌ تم رفض طلب شحن المحفظة',
            COALESCE(NEW.admin_notes, 'يرجى التواصل مع الإدارة'),
            'wallet', '/wallet');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_handle_topup_status AFTER UPDATE ON public.wallet_topup_requests
FOR EACH ROW EXECUTE FUNCTION public.handle_topup_approved();

-- 7. NOTIFY ADMINS OF NEW TOPUP REQUEST
CREATE OR REPLACE FUNCTION public.notify_admins_topup_request()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  SELECT ur.user_id,
         '💰 طلب شحن محفظة جديد',
         'طلب شحن بمبلغ ' || NEW.amount || ' ر.س بانتظار المراجعة',
         'wallet',
         '/adminmaster/wallets'
  FROM public.user_roles ur WHERE ur.role = 'admin';
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_admins_topup AFTER INSERT ON public.wallet_topup_requests
FOR EACH ROW EXECUTE FUNCTION public.notify_admins_topup_request();

-- 8. AUTO-DEDUCT WALLET ON INVOICE PAYMENT (when payment_method = 'wallet')
CREATE OR REPLACE FUNCTION public.deduct_wallet_on_invoice_payment()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id UUID;
  v_wallet_id UUID;
BEGIN
  IF NEW.payment_method = 'wallet' AND NEW.status = 'completed' THEN
    SELECT user_id INTO v_user_id FROM public.invoices WHERE id = NEW.invoice_id;
    IF v_user_id IS NULL THEN RETURN NEW; END IF;

    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_user_id;
    IF v_wallet_id IS NULL THEN RETURN NEW; END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id, created_by)
    VALUES (v_wallet_id, v_user_id, 'payment', NEW.amount,
            'دفع فاتورة عبر المحفظة',
            'invoice', NEW.invoice_id, NEW.created_by);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_deduct_wallet_on_payment AFTER INSERT ON public.invoice_payments
FOR EACH ROW EXECUTE FUNCTION public.deduct_wallet_on_invoice_payment();

-- 9. BACKFILL WALLETS FOR EXISTING USERS
INSERT INTO public.wallets (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;