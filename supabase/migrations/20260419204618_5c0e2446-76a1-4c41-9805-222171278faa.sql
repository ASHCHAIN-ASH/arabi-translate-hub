DROP POLICY IF EXISTS "Users can pay own invoices via wallet" ON public.invoice_payments;

CREATE POLICY "Users can pay own invoices"
ON public.invoice_payments
FOR INSERT
TO authenticated
WITH CHECK (
  payment_method IN ('wallet', 'bank_transfer')
  AND created_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.invoices i
    WHERE i.id = invoice_payments.invoice_id
      AND i.user_id = auth.uid()
  )
);