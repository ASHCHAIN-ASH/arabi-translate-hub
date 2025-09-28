-- إضافة العمود المفقود service_details
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS service_details JSONB DEFAULT '{}';

-- إضافة RLS policies للجدول contracts إذا لم تكن موجودة
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- السماح للجميع بإدراج العقود الجديدة
DROP POLICY IF EXISTS "Allow public contract creation" ON public.contracts;
CREATE POLICY "Allow public contract creation"
ON public.contracts
FOR INSERT
TO public
WITH CHECK (true);

-- السماح للمديرين بمشاهدة جميع العقود
DROP POLICY IF EXISTS "Admin can view all contracts" ON public.contracts;
CREATE POLICY "Admin can view all contracts"
ON public.contracts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- السماح لأصحاب العقود بمشاهدة عقودهم الخاصة
DROP POLICY IF EXISTS "Users can view their contracts" ON public.contracts;
CREATE POLICY "Users can view their contracts"
ON public.contracts
FOR SELECT
TO authenticated
USING (user_id = auth.uid());