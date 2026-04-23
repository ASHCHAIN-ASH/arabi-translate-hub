ALTER TABLE public.contracts DROP CONSTRAINT IF EXISTS contracts_template_type_check;

ALTER TABLE public.contracts
ADD CONSTRAINT contracts_template_type_check
CHECK (
  template_type IN ('academic', 'translation', 'consulting', 'corporate', 'financing')
);

DROP POLICY IF EXISTS contracts_user_insert_financing ON public.contracts;

CREATE POLICY contracts_user_insert_financing
ON public.contracts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND template_type = 'financing'
  AND locked_at IS NULL
  AND status IN ('draft', 'pending_signature')
  AND EXISTS (
    SELECT 1
    FROM public.financing_applications fa
    WHERE fa.id = ((metadata->>'application_id')::uuid)
      AND fa.user_id = auth.uid()
  )
);