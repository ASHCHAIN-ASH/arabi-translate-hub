-- إضافة الأعمدة المفقودة في جدول contracts
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS client_company TEXT,
ADD COLUMN IF NOT EXISTS client_address TEXT,
ADD COLUMN IF NOT EXISTS client_type TEXT DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS contract_content TEXT,
ADD COLUMN IF NOT EXISTS delivery_date DATE,
ADD COLUMN IF NOT EXISTS payment_terms TEXT DEFAULT 'الدفع خلال 30 يوم من تاريخ الفاتورة';

-- تحديث وظيفة إنشاء رقم العقد إذا لم تكن موجودة
CREATE OR REPLACE FUNCTION public.generate_contract_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  contract_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.contracts
  WHERE contract_number LIKE 'CTR' || year_suffix || '%';
  
  contract_num := 'CTR' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN contract_num;
END;
$$;