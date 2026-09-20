DROP POLICY IF EXISTS timeline_insert_admin_or_system ON public.contract_timeline;
CREATE POLICY timeline_insert_admin_or_owner ON public.contract_timeline
FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.contracts c
    WHERE c.id = contract_timeline.contract_id
      AND c.user_id = auth.uid()
  )
);