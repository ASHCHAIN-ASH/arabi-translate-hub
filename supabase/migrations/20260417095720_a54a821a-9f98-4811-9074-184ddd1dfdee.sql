-- Private bucket for signed contract PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

-- Admins manage all contract files
CREATE POLICY "Admins manage all contract files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'contracts' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'contracts' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Clients can view only their own contract files (path: <user_id>/<contract_id>.pdf)
CREATE POLICY "Clients view own contract files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'contracts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add columns to contracts to track generated PDF
ALTER TABLE public.contracts
  ADD COLUMN IF NOT EXISTS signed_pdf_path text,
  ADD COLUMN IF NOT EXISTS signed_pdf_generated_at timestamptz;