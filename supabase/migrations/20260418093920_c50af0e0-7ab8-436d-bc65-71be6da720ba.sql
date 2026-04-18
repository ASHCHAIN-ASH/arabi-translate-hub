
-- ============================================
-- 1) CONTRACTS BUCKET — ownership via DB join
-- ============================================
DROP POLICY IF EXISTS "Clients view own contract files" ON storage.objects;

CREATE POLICY "Clients view own contract files (verified)"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'contracts'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.contracts c
      WHERE c.user_id = auth.uid()
        AND (
          c.signed_pdf_path = storage.objects.name
          OR storage.objects.name LIKE c.id::text || '/%'
          OR storage.objects.name LIKE '%/' || c.id::text || '/%'
        )
    )
  )
);

-- ============================================
-- 2) TICKET-ATTACHMENTS — allow user delete own
-- ============================================
CREATE POLICY "Users delete own ticket attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'ticket-attachments'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.ticket_attachments ta
      JOIN public.tickets t ON t.id = ta.ticket_id
      WHERE ta.storage_path = storage.objects.name
        AND t.user_id = auth.uid()
        AND ta.user_id = auth.uid()
        AND ta.uploaded_by_admin = false
    )
  )
);

-- ============================================
-- 3) WALLET-RECEIPTS — allow delete before review
-- ============================================
CREATE POLICY "Users delete own pending wallet receipts"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'wallet-receipts'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.wallet_topup_requests wtr
      WHERE wtr.receipt_path = storage.objects.name
        AND wtr.user_id = auth.uid()
        AND wtr.status = 'pending'
    )
  )
);
