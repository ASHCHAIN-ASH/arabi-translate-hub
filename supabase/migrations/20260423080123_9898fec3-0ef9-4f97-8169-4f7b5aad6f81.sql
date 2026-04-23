
-- 1) REPLICA IDENTITY FULL
ALTER TABLE public.financing_applications REPLICA IDENTITY FULL;
ALTER TABLE public.financing_documents REPLICA IDENTITY FULL;
ALTER TABLE public.financing_installments REPLICA IDENTITY FULL;
ALTER TABLE public.financing_status_logs REPLICA IDENTITY FULL;

-- 2) Realtime publication
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.financing_applications; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.financing_documents; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.financing_installments; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.financing_status_logs; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- 3) Notification function (re-create with hardcoded URL)
CREATE OR REPLACE FUNCTION public.notify_financing_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $function$
DECLARE
  v_event text;
  v_url constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-whatsapp-notify';
  v_key  constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status) THEN
    RETURN NEW;
  END IF;
  v_event := CASE NEW.status::text
    WHEN 'submitted' THEN 'submitted'
    WHEN 'documents_pending' THEN 'documents_pending'
    WHEN 'under_review' THEN 'under_review'
    WHEN 'contract_pending_signature' THEN 'contract_pending_signature'
    WHEN 'waiting_down_payment' THEN 'waiting_down_payment'
    WHEN 'approved' THEN 'approved'
    WHEN 'active' THEN 'active'
    WHEN 'rejected' THEN 'rejected'
    WHEN 'cancelled' THEN 'cancelled'
    ELSE 'status_update'
  END;
  IF NEW.status::text = 'draft' THEN RETURN NEW; END IF;
  IF NEW.applicant_phone IS NULL OR length(trim(NEW.applicant_phone)) = 0 THEN RETURN NEW; END IF;

  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key),
    body := jsonb_build_object(
      'application_id', NEW.id,
      'event', v_event,
      'extra', jsonb_build_object(
        'new_status', NEW.status,
        'old_status', CASE WHEN TG_OP='UPDATE' THEN OLD.status ELSE NULL END
      )
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'financing notify failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- 4) Trigger
DROP TRIGGER IF EXISTS trg_financing_notify_whatsapp ON public.financing_applications;
CREATE TRIGGER trg_financing_notify_whatsapp
  AFTER INSERT OR UPDATE OF status ON public.financing_applications
  FOR EACH ROW EXECUTE FUNCTION public.notify_financing_status_change();

-- 5) Payment receipts table
CREATE TABLE IF NOT EXISTS public.financing_payment_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.financing_applications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('wallet','bank_transfer')),
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  bank_name text,
  reference_number text,
  transfer_date date,
  receipt_file_url text,
  receipt_file_name text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewer_note text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fpr_app ON public.financing_payment_receipts(application_id);
CREATE INDEX IF NOT EXISTS idx_fpr_user ON public.financing_payment_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_fpr_status ON public.financing_payment_receipts(status);

ALTER TABLE public.financing_payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financing_payment_receipts REPLICA IDENTITY FULL;

DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.financing_payment_receipts; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

DROP POLICY IF EXISTS "fpr_users_view_own" ON public.financing_payment_receipts;
CREATE POLICY "fpr_users_view_own" ON public.financing_payment_receipts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "fpr_users_insert_own" ON public.financing_payment_receipts;
CREATE POLICY "fpr_users_insert_own" ON public.financing_payment_receipts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "fpr_admins_view_all" ON public.financing_payment_receipts;
CREATE POLICY "fpr_admins_view_all" ON public.financing_payment_receipts
  FOR SELECT TO authenticated USING (public.is_financing_admin(auth.uid()));

DROP POLICY IF EXISTS "fpr_admins_update" ON public.financing_payment_receipts;
CREATE POLICY "fpr_admins_update" ON public.financing_payment_receipts
  FOR UPDATE TO authenticated USING (public.is_financing_admin(auth.uid()));

DROP TRIGGER IF EXISTS trg_fpr_updated_at ON public.financing_payment_receipts;
CREATE TRIGGER trg_fpr_updated_at
  BEFORE UPDATE ON public.financing_payment_receipts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Storage bucket + policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts','payment-receipts', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "fpr_storage_users_upload" ON storage.objects;
CREATE POLICY "fpr_storage_users_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "fpr_storage_users_select_own" ON storage.objects;
CREATE POLICY "fpr_storage_users_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'payment-receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "fpr_storage_admins_select_all" ON storage.objects;
CREATE POLICY "fpr_storage_admins_select_all" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'payment-receipts' AND public.is_financing_admin(auth.uid()));
