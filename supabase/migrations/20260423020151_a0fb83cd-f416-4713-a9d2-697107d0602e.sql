
-- ENUMS
CREATE TYPE public.financing_status AS ENUM (
  'draft','submitted','documents_pending','under_review',
  'waiting_down_payment','contract_pending_signature','approved',
  'rejected','active','completed','overdue','cancelled'
);
CREATE TYPE public.financing_risk_level AS ENUM ('low','medium','high','unknown');
CREATE TYPE public.financing_doc_type AS ENUM ('id_front','id_back','bank_statement','proof_of_income','other');
CREATE TYPE public.financing_doc_status AS ENUM ('pending','approved','rejected');
CREATE TYPE public.financing_installment_status AS ENUM ('pending','paid','overdue','waived');
CREATE TYPE public.financing_contract_status AS ENUM ('draft','sent','signed','cancelled');
CREATE TYPE public.wallet_credit_event_type AS ENUM (
  'financing_credit_added','financing_credit_reversed','installment_paid'
);

-- TABLES
CREATE TABLE public.financing_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_id uuid REFERENCES public.service_orders(id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  total_amount numeric(12,2) NOT NULL CHECK (total_amount >= 2500),
  down_payment numeric(12,2) NOT NULL DEFAULT 0,
  remaining_amount numeric(12,2) NOT NULL DEFAULT 0,
  monthly_installment numeric(12,2) NOT NULL DEFAULT 0,
  duration_months integer NOT NULL DEFAULT 12 CHECK (duration_months > 0),
  funding_type text NOT NULL DEFAULT 'wallet_credit',
  status public.financing_status NOT NULL DEFAULT 'draft',
  score integer DEFAULT 0,
  risk_level public.financing_risk_level NOT NULL DEFAULT 'unknown',
  applicant_full_name text, applicant_id_number text, applicant_phone text, applicant_email text,
  employer_name text, monthly_income numeric(12,2), monthly_commitments numeric(12,2),
  city text, notes text,
  approved_at timestamptz, approved_by uuid,
  rejected_at timestamptz, rejection_reason text, activated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_financing_apps_user ON public.financing_applications(user_id);
CREATE INDEX idx_financing_apps_status ON public.financing_applications(status);
CREATE INDEX idx_financing_apps_order ON public.financing_applications(order_id);

CREATE TABLE public.financing_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.financing_applications(id) ON DELETE CASCADE,
  document_type public.financing_doc_type NOT NULL,
  file_url text NOT NULL, file_name text, mime_type text,
  status public.financing_doc_status NOT NULL DEFAULT 'pending',
  review_note text, reviewed_by uuid, reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_financing_docs_app ON public.financing_documents(application_id);

CREATE TABLE public.financing_installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.financing_applications(id) ON DELETE CASCADE,
  month_number integer NOT NULL,
  amount numeric(12,2) NOT NULL,
  due_date date NOT NULL,
  status public.financing_installment_status NOT NULL DEFAULT 'pending',
  paid_at timestamptz, paid_amount numeric(12,2), wallet_transaction_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(application_id, month_number)
);
CREATE INDEX idx_financing_inst_app ON public.financing_installments(application_id);
CREATE INDEX idx_financing_inst_due ON public.financing_installments(due_date) WHERE status='pending';

CREATE TABLE public.financing_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.financing_applications(id) ON DELETE CASCADE,
  contract_number text NOT NULL UNIQUE,
  contract_text text,
  signed_at timestamptz, signed_ip text, signed_user_agent text,
  status public.financing_contract_status NOT NULL DEFAULT 'draft',
  pdf_storage_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_financing_contracts_app ON public.financing_contracts(application_id);

CREATE TABLE public.financing_status_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.financing_applications(id) ON DELETE CASCADE,
  old_status public.financing_status,
  new_status public.financing_status NOT NULL,
  changed_by uuid, note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_financing_status_logs_app ON public.financing_status_logs(application_id);

CREATE TABLE public.financing_whatsapp_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.financing_applications(id) ON DELETE CASCADE,
  message_type text NOT NULL,
  recipient_phone text NOT NULL,
  message_body text,
  delivery_status text NOT NULL DEFAULT 'queued',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_financing_wa_logs_app ON public.financing_whatsapp_logs(application_id);

CREATE TABLE public.wallet_credit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES public.financing_applications(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  amount numeric(12,2) NOT NULL,
  event_type public.wallet_credit_event_type NOT NULL,
  wallet_transaction_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_wallet_credit_events_user ON public.wallet_credit_events(user_id);
CREATE INDEX idx_wallet_credit_events_app ON public.wallet_credit_events(application_id);

-- updated_at triggers
CREATE TRIGGER trg_financing_apps_updated_at
BEFORE UPDATE ON public.financing_applications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_financing_contracts_updated_at
BEFORE UPDATE ON public.financing_contracts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- status log trigger
CREATE OR REPLACE FUNCTION public.log_financing_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.financing_status_logs(application_id, old_status, new_status, changed_by)
    VALUES (NEW.id, NULL, NEW.status, auth.uid());
  ELSIF (NEW.status IS DISTINCT FROM OLD.status) THEN
    INSERT INTO public.financing_status_logs(application_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_log_financing_status_change
AFTER INSERT OR UPDATE OF status ON public.financing_applications
FOR EACH ROW EXECUTE FUNCTION public.log_financing_status_change();

-- amounts auto-calc
CREATE OR REPLACE FUNCTION public.calc_financing_amounts()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.down_payment IS NULL OR NEW.down_payment = 0 THEN
    NEW.down_payment := ROUND(NEW.total_amount * 0.20, 2);
  END IF;
  NEW.remaining_amount := NEW.total_amount - NEW.down_payment;
  IF NEW.duration_months > 0 THEN
    NEW.monthly_installment := ROUND(NEW.remaining_amount / NEW.duration_months, 2);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_calc_financing_amounts
BEFORE INSERT OR UPDATE OF total_amount, down_payment, duration_months ON public.financing_applications
FOR EACH ROW EXECUTE FUNCTION public.calc_financing_amounts();

-- admin helper (uses existing app_role enum: admin/moderator/user)
CREATE OR REPLACE FUNCTION public.is_financing_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin'::public.app_role,'moderator'::public.app_role)
  );
$$;

-- RLS
ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_installments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_contracts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_status_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_whatsapp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_credit_events    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own financing apps" ON public.financing_applications
  FOR SELECT USING (auth.uid() = user_id OR public.is_financing_admin(auth.uid()));
CREATE POLICY "Users create own financing apps" ON public.financing_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own draft apps" ON public.financing_applications
  FOR UPDATE USING (
    (auth.uid() = user_id AND status IN ('draft','documents_pending'))
    OR public.is_financing_admin(auth.uid())
  );
CREATE POLICY "Admins delete financing apps" ON public.financing_applications
  FOR DELETE USING (public.is_financing_admin(auth.uid()));

CREATE POLICY "View own financing docs" ON public.financing_documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.financing_applications a
            WHERE a.id = application_id AND (a.user_id = auth.uid() OR public.is_financing_admin(auth.uid())))
  );
CREATE POLICY "Insert own financing docs" ON public.financing_documents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.financing_applications a
            WHERE a.id = application_id AND a.user_id = auth.uid())
  );
CREATE POLICY "Admins or owners update docs" ON public.financing_documents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.financing_applications a
            WHERE a.id = application_id AND (a.user_id = auth.uid() OR public.is_financing_admin(auth.uid())))
  );
CREATE POLICY "Owner or admin delete docs" ON public.financing_documents
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.financing_applications a
            WHERE a.id = application_id
              AND ((a.user_id = auth.uid() AND a.status IN ('draft','documents_pending'))
                   OR public.is_financing_admin(auth.uid())))
  );

CREATE POLICY "View own installments" ON public.financing_installments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.financing_applications a
            WHERE a.id = application_id AND (a.user_id = auth.uid() OR public.is_financing_admin(auth.uid())))
  );
CREATE POLICY "Admins manage installments" ON public.financing_installments
  FOR ALL USING (public.is_financing_admin(auth.uid()))
  WITH CHECK (public.is_financing_admin(auth.uid()));

CREATE POLICY "View own financing contracts" ON public.financing_contracts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.financing_applications a
            WHERE a.id = application_id AND (a.user_id = auth.uid() OR public.is_financing_admin(auth.uid())))
  );
CREATE POLICY "Owner sign or admin manage contracts" ON public.financing_contracts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.financing_applications a
            WHERE a.id = application_id AND (a.user_id = auth.uid() OR public.is_financing_admin(auth.uid())))
  );
CREATE POLICY "Admins create contracts" ON public.financing_contracts
  FOR INSERT WITH CHECK (public.is_financing_admin(auth.uid()));
CREATE POLICY "Admins delete contracts" ON public.financing_contracts
  FOR DELETE USING (public.is_financing_admin(auth.uid()));

CREATE POLICY "View own status logs" ON public.financing_status_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.financing_applications a
            WHERE a.id = application_id AND (a.user_id = auth.uid() OR public.is_financing_admin(auth.uid())))
  );

CREATE POLICY "Admins view whatsapp logs" ON public.financing_whatsapp_logs
  FOR SELECT USING (public.is_financing_admin(auth.uid()));
CREATE POLICY "System inserts whatsapp logs" ON public.financing_whatsapp_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "View own credit events" ON public.wallet_credit_events
  FOR SELECT USING (auth.uid() = user_id OR public.is_financing_admin(auth.uid()));
CREATE POLICY "Admins insert credit events" ON public.wallet_credit_events
  FOR INSERT WITH CHECK (public.is_financing_admin(auth.uid()));

-- Storage bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('financing-documents','financing-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own financing docs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'financing-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users read own financing docs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'financing-documents'
  AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_financing_admin(auth.uid()))
);

CREATE POLICY "Users delete own financing docs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'financing-documents'
  AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_financing_admin(auth.uid()))
);
