-- دالة لتوليد معرف المسوق
CREATE OR REPLACE FUNCTION public.generate_affiliate_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  year_full TEXT;
  random_part TEXT;
  affiliate_id_result TEXT;
BEGIN
  year_full := TO_CHAR(CURRENT_DATE, 'YYYY');
  random_part := LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
  affiliate_id_result := 'AFF-' || year_full || random_part;
  
  -- التأكد من عدم وجود تكرار
  WHILE EXISTS (SELECT 1 FROM public.affiliate_partners WHERE affiliate_id = affiliate_id_result) LOOP
    random_part := LPAD(FLOOR(RANDOM() * 99999)::TEXT, 5, '0');
    affiliate_id_result := 'AFF-' || year_full || random_part;
  END LOOP;
  
  RETURN affiliate_id_result;
END;
$$;

-- دالة لتوليد كود الخصم
CREATE OR REPLACE FUNCTION public.generate_discount_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  random_part TEXT;
  discount_code_result TEXT;
BEGIN
  random_part := LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
  discount_code_result := 'MUP10-' || random_part;
  
  -- التأكد من عدم وجود تكرار
  WHILE EXISTS (SELECT 1 FROM public.affiliate_partners WHERE discount_code = discount_code_result) LOOP
    random_part := LPAD(FLOOR(RANDOM() * 9999)::TEXT, 4, '0');
    discount_code_result := 'MUP10-' || random_part;
  END LOOP;
  
  RETURN discount_code_result;
END;
$$;