CREATE POLICY "Users update own orders for quotes"
ON public.service_orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);