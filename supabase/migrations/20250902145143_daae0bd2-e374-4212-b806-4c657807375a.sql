-- Drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Allow authenticated users to view invoices" ON public.invoices;
DROP POLICY IF EXISTS "Allow authenticated users to create invoices" ON public.invoices;
DROP POLICY IF EXISTS "Allow authenticated users to update invoices" ON public.invoices;
DROP POLICY IF EXISTS "Allow authenticated users to delete invoices" ON public.invoices;
DROP POLICY IF EXISTS "Allow authenticated users to view invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Allow authenticated users to create invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Allow authenticated users to update invoice items" ON public.invoice_items;
DROP POLICY IF EXISTS "Allow authenticated users to delete invoice items" ON public.invoice_items;

-- Create proper RLS policies for invoices table
-- Users can create their invoices
CREATE POLICY "Users can create their invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (user_id = auth.uid() AND auth.uid() IS NOT NULL);

-- Users can view their own invoices
CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (user_id = auth.uid() AND auth.uid() IS NOT NULL);

-- Admin can view all invoices
CREATE POLICY "Admin can view all invoices" 
ON public.invoices 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() IS NOT NULL);

-- Admins can manage invoices
CREATE POLICY "Admins can manage invoices" 
ON public.invoices 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete invoices
CREATE POLICY "Admins can delete invoices" 
ON public.invoices 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create proper RLS policies for invoice_items table
-- invoice_items_admin_access
CREATE POLICY "invoice_items_admin_access" 
ON public.invoice_items 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- invoice_items_owner_access
CREATE POLICY "invoice_items_owner_access" 
ON public.invoice_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.invoices 
  WHERE invoices.id = invoice_items.invoice_id 
  AND invoices.user_id = auth.uid()
));