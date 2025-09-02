-- Simplify the policies to allow authenticated users to work with invoices
-- Drop all existing policies for invoices
DROP POLICY IF EXISTS "Users can create their invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admin can view all invoices" ON public.invoices;
DROP POLICY IF EXISTS "Admins can manage invoices" ON public.invoices;

-- Drop existing policies for invoice_items
DROP POLICY IF EXISTS "invoice_items_admin_access" ON public.invoice_items;
DROP POLICY IF EXISTS "invoice_items_owner_access" ON public.invoice_items;

-- Create simplified policies for invoices that work for authenticated users
CREATE POLICY "Allow authenticated users to view invoices" 
ON public.invoices 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to create invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update invoices" 
ON public.invoices 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete invoices" 
ON public.invoices 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create simplified policies for invoice_items
CREATE POLICY "Allow authenticated users to view invoice items" 
ON public.invoice_items 
FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to create invoice items" 
ON public.invoice_items 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update invoice items" 
ON public.invoice_items 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete invoice items" 
ON public.invoice_items 
FOR DELETE 
USING (auth.role() = 'authenticated');