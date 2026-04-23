-- السماح للعميل بإنشاء عقد تمويل خاص بطلبه فقط
CREATE POLICY "contracts_user_insert_financing"
ON public.contracts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND template_type = 'financing'
  AND locked_at IS NULL
  AND status IN ('draft', 'sent', 'pending_signature')
  AND EXISTS (
    SELECT 1 FROM public.financing_applications fa
    WHERE fa.id = ((metadata->>'application_id')::uuid)
      AND fa.user_id = auth.uid()
  )
);