-- Drop all existing policies for invoices
DROP POLICY IF EXISTS "Users can create their invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admin can view all invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can manage invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can delete invoices" ON public.invoices;

-- Drop all existing policies for invoice_items
DROP POLICY IF EXISTS "invoice_items_admin_access" ON public.invoice_items;
DROP POLICY IF EXISTS "invoice_items_owner_access" ON public.invoice_items;

-- Create new policies for invoices with correct user_id handling
CREATE POLICY "Users can create their invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (user_id = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (user_id = auth.uid() AND auth.uid() IS NOT NULL);

CREATE POLICY "Admin can view all invoices" 
ON public.invoices 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage invoices" 
ON public.invoices 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create new policies for invoice_items
CREATE POLICY "invoice_items_admin_access" 
ON public.invoice_items 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "invoice_items_owner_access" 
ON public.invoice_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_items.invoice_id 
  AND invoices.user_id = auth.uid()
));