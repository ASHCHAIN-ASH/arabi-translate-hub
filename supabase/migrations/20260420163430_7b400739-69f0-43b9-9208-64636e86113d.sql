INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "Admins read invoice pdfs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'invoices' AND public.has_role(auth.uid(), 'admin'::app_role));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Service role manages invoice pdfs"
  ON storage.objects FOR ALL
  USING (bucket_id = 'invoices' AND auth.role() = 'service_role')
  WITH CHECK (bucket_id = 'invoices' AND auth.role() = 'service_role');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS pdf_storage_path TEXT,
  ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMPTZ;