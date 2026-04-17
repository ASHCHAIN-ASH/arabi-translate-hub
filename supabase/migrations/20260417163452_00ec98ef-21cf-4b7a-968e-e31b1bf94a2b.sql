-- Wallet receipts storage bucket for bank transfer proof uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('wallet-receipts', 'wallet-receipts', false)
ON CONFLICT (id) DO NOTHING;

-- RLS: users can upload to their own folder
CREATE POLICY "Users upload own wallet receipts"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'wallet-receipts'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users view own wallet receipts"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'wallet-receipts'
  AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin'::public.app_role))
);

CREATE POLICY "Admins manage wallet receipts"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'wallet-receipts' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'wallet-receipts' AND public.has_role(auth.uid(), 'admin'::public.app_role));