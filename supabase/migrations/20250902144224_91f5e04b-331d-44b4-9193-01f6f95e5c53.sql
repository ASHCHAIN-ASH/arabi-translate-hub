-- Enable RLS on invoices table if not already enabled
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Enable RLS on invoice_items table if not already enabled  
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for invoices table
-- Allow authenticated users to view all invoices (for admin)
CREATE POLICY "Allow authenticated users to view invoices" 
ON public.invoices 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to create invoices
CREATE POLICY "Allow authenticated users to create invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update invoices
CREATE POLICY "Allow authenticated users to update invoices" 
ON public.invoices 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete invoices
CREATE POLICY "Allow authenticated users to delete invoices" 
ON public.invoices 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create RLS policies for invoice_items table
-- Allow authenticated users to view all invoice items
CREATE POLICY "Allow authenticated users to view invoice items" 
ON public.invoice_items 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to create invoice items
CREATE POLICY "Allow authenticated users to create invoice items" 
ON public.invoice_items 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update invoice items
CREATE POLICY "Allow authenticated users to update invoice items" 
ON public.invoice_items 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete invoice items
CREATE POLICY "Allow authenticated users to delete invoice items" 
ON public.invoice_items 
FOR DELETE 
USING (auth.role() = 'authenticated');