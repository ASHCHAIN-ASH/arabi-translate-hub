-- إصلاح دالة توليد رقم الطلب لتجنب التكرار
DROP FUNCTION IF EXISTS generate_research_order_number();

CREATE OR REPLACE FUNCTION generate_research_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  order_num TEXT;
  max_attempts INTEGER := 10;
  attempt INTEGER := 0;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  LOOP
    -- الحصول على أعلى رقم موجود وزيادته
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 0) + 1
    INTO counter
    FROM public.research_orders
    WHERE order_number ~ '^RO[0-9]+$';
    
    -- إنشاء رقم الطلب
    order_num := 'RO' || LPAD(counter::TEXT, 8, '0');
    
    -- التحقق من عدم وجود الرقم مسبقاً
    IF NOT EXISTS (SELECT 1 FROM public.research_orders WHERE order_number = order_num) THEN
      RETURN order_num;
    END IF;
    
    -- زيادة المحاولات
    attempt := attempt + 1;
    IF attempt >= max_attempts THEN
      RAISE EXCEPTION 'Failed to generate unique order number after % attempts', max_attempts;
    END IF;
    
    -- انتظار قصير قبل المحاولة التالية
    PERFORM pg_sleep(0.1);
  END LOOP;
END;
$$;