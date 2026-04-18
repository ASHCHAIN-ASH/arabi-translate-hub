
-- 1) Restrict membership self-creation to safe values only
DROP POLICY IF EXISTS "Users create own memberships" ON public.user_memberships;
CREATE POLICY "Users create own memberships"
ON public.user_memberships
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND status = 'pending'
  AND COALESCE(amount_paid, 0) = 0
  AND COALESCE(cashback_credited, false) = false
);

-- 2) Restrict contract signatures to authenticated users with non-null signer
DROP POLICY IF EXISTS "Users sign own contracts" ON public.contract_signatures;
CREATE POLICY "Users sign own contracts"
ON public.contract_signatures
FOR INSERT
TO authenticated
WITH CHECK (
  signer_user_id IS NOT NULL
  AND auth.uid() = signer_user_id
  AND EXISTS (
    SELECT 1 FROM public.contracts c
    WHERE c.id = contract_signatures.contract_id
      AND c.user_id = auth.uid()
  )
);

-- 3) Restrict orders INSERT to authenticated only
DROP POLICY IF EXISTS "Users create orders" ON public.orders;
CREATE POLICY "Users create orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
