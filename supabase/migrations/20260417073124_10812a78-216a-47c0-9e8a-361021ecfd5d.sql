-- =====================================================
-- Comprehensive Contracts System Upgrade
-- =====================================================

-- 1. Add legal/academic fields to contracts table
ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS service_order_id uuid REFERENCES public.service_orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS service_name text,
  ADD COLUMN IF NOT EXISTS service_type text,
  ADD COLUMN IF NOT EXISTS total_amount numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'SAR',
  ADD COLUMN IF NOT EXISTS payment_terms text,
  ADD COLUMN IF NOT EXISTS delivery_date date,
  ADD COLUMN IF NOT EXISTS client_full_name text,
  ADD COLUMN IF NOT EXISTS client_id_number text,
  ADD COLUMN IF NOT EXISTS client_email text,
  ADD COLUMN IF NOT EXISTS client_phone text,
  ADD COLUMN IF NOT EXISTS sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS variables jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_contracts_service_order ON public.contracts(service_order_id);
CREATE INDEX IF NOT EXISTS idx_contracts_customer ON public.contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);

-- 2. Contract signatures table (audit trail of every signing event)
CREATE TABLE IF NOT EXISTS public.contract_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  signer_user_id uuid,
  signer_name text NOT NULL,
  signer_email text,
  signer_id_number text,
  signature_text text NOT NULL,
  ip_address text,
  user_agent text,
  accepted_terms jsonb DEFAULT '[]'::jsonb,
  comments text,
  signed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contract_signatures_contract ON public.contract_signatures(contract_id);

ALTER TABLE public.contract_signatures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage signatures" ON public.contract_signatures;
CREATE POLICY "Admins manage signatures" ON public.contract_signatures
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users view own signatures" ON public.contract_signatures;
CREATE POLICY "Users view own signatures" ON public.contract_signatures
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_signatures.contract_id AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users sign own contracts" ON public.contract_signatures;
CREATE POLICY "Users sign own contracts" ON public.contract_signatures
  FOR INSERT WITH CHECK (
    auth.uid() = signer_user_id AND EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_signatures.contract_id AND c.user_id = auth.uid()
    )
  );

-- 3. Contract timeline (audit log)
CREATE TABLE IF NOT EXISTS public.contract_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  actor_id uuid,
  actor_type text NOT NULL DEFAULT 'system',
  action_type text NOT NULL,
  action_label text NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contract_timeline_contract ON public.contract_timeline(contract_id);

ALTER TABLE public.contract_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage contract timeline" ON public.contract_timeline;
CREATE POLICY "Admins manage contract timeline" ON public.contract_timeline
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users view own contract timeline" ON public.contract_timeline;
CREATE POLICY "Users view own contract timeline" ON public.contract_timeline
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.id = contract_timeline.contract_id AND c.user_id = auth.uid()
    )
  );

-- 4. Trigger to log timeline events on contract changes
CREATE OR REPLACE FUNCTION public.handle_contract_changed()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.contract_timeline (contract_id, actor_id, actor_type, action_type, action_label, description)
    VALUES (NEW.id, COALESCE(auth.uid(), NEW.user_id), 'system', 'created', 'إنشاء العقد',
            'تم إنشاء العقد رقم ' || NEW.contract_number);
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.contract_timeline (contract_id, actor_id, actor_type, action_type, action_label, description, metadata)
    VALUES (NEW.id, auth.uid(),
            CASE WHEN has_role(auth.uid(),'admin'::app_role) THEN 'admin' ELSE 'client' END,
            'status_change', 'تغيير الحالة',
            'من ' || COALESCE(OLD.status,'-') || ' إلى ' || COALESCE(NEW.status,'-'),
            jsonb_build_object('from', OLD.status, 'to', NEW.status));
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_contract_changed ON public.contracts;
CREATE TRIGGER trg_contract_changed
  AFTER INSERT OR UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.handle_contract_changed();

-- 5. Trigger: log signature event in timeline + update contract
CREATE OR REPLACE FUNCTION public.handle_signature_inserted()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.contracts
     SET status = 'signed',
         signed_at = NEW.signed_at,
         updated_at = now()
   WHERE id = NEW.contract_id;

  INSERT INTO public.contract_timeline (contract_id, actor_id, actor_type, action_type, action_label, description, metadata)
  VALUES (NEW.contract_id, NEW.signer_user_id, 'client', 'signed', 'توقيع العقد',
          'وقّع العميل ' || NEW.signer_name || ' على العقد إلكترونياً',
          jsonb_build_object('ip', NEW.ip_address, 'signed_at', NEW.signed_at));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_signature_inserted ON public.contract_signatures;
CREATE TRIGGER trg_signature_inserted
  AFTER INSERT ON public.contract_signatures
  FOR EACH ROW EXECUTE FUNCTION public.handle_signature_inserted();

-- 6. Auto-generate contract when service_order quote is accepted
CREATE OR REPLACE FUNCTION public.auto_generate_contract_on_quote_accept()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_customer record;
  v_contract_exists boolean;
BEGIN
  -- Trigger only when quote_status transitions to 'accepted'
  IF NEW.quote_status IS DISTINCT FROM OLD.quote_status AND NEW.quote_status = 'accepted' THEN
    SELECT EXISTS(SELECT 1 FROM public.contracts WHERE service_order_id = NEW.id) INTO v_contract_exists;

    IF NOT v_contract_exists THEN
      SELECT c.id, c.name, c.email, c.phone INTO v_customer
        FROM public.customers c WHERE c.id = NEW.customer_id;

      INSERT INTO public.contracts (
        user_id, service_order_id, customer_id, title,
        service_name, service_type, total_amount, currency,
        client_full_name, client_email, client_phone,
        status, content
      ) VALUES (
        NEW.user_id, NEW.id, NEW.customer_id,
        'عقد خدمة: ' || COALESCE(NEW.service_name, 'خدمة أكاديمية'),
        NEW.service_name, COALESCE(NEW.service_name, 'general'),
        COALESCE(NEW.total_amount, 0), 'SAR',
        v_customer.name, v_customer.email, v_customer.phone,
        'pending_signature', ''
      );

      -- notify client
      INSERT INTO public.user_notifications (user_id, title, message, type, link)
      VALUES (NEW.user_id, '📝 عقد جديد بانتظار توقيعك',
              'تم إصدار عقد للخدمة "' || COALESCE(NEW.service_name,'') || '" — يرجى مراجعته وتوقيعه',
              'contract', '/contracts');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_generate_contract ON public.service_orders;
CREATE TRIGGER trg_auto_generate_contract
  AFTER UPDATE ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.auto_generate_contract_on_quote_accept();

-- 7. Realtime
ALTER TABLE public.contracts REPLICA IDENTITY FULL;
ALTER TABLE public.contract_signatures REPLICA IDENTITY FULL;
ALTER TABLE public.contract_timeline REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.contracts;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.contract_signatures;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.contract_timeline;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;