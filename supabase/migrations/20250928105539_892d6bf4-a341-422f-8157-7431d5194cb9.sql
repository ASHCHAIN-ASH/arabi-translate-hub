-- First drop all existing policies on contracts table
DROP POLICY IF EXISTS "Allow public contract creation" ON public.contracts;
DROP POLICY IF EXISTS "Users can view own contracts" ON public.contracts;  
DROP POLICY IF EXISTS "Admins can view all contracts" ON public.contracts;
DROP POLICY IF EXISTS "Public can create contract requests" ON public.contracts;
DROP POLICY IF EXISTS "Users can view their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Admins can update contracts" ON public.contracts;

-- Create new policies that allow public contract submission
CREATE POLICY "contracts_public_insert" ON public.contracts
FOR INSERT
WITH CHECK (true);

-- Allow reading contracts based on user ownership or admin role  
CREATE POLICY "contracts_select_policy" ON public.contracts
FOR SELECT
USING (
  auth.uid() IS NULL OR 
  auth.uid() = user_id OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can update contracts
CREATE POLICY "contracts_admin_update" ON public.contracts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));