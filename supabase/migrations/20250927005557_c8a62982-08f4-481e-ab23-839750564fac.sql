-- إنشاء جدول المسوقين بالعمولة
CREATE TABLE public.affiliate_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id TEXT NOT NULL UNIQUE,
  discount_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  country_city TEXT,
  marketing_channel_url TEXT,
  terms_accepted BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX idx_affiliate_partners_email ON public.affiliate_partners(email);
CREATE INDEX idx_affiliate_partners_affiliate_id ON public.affiliate_partners(affiliate_id);
CREATE INDEX idx_affiliate_partners_discount_code ON public.affiliate_partners(discount_code);

-- تفعيل RLS
ALTER TABLE public.affiliate_partners ENABLE ROW LEVEL SECURITY;

-- سياسة للمديرين فقط
CREATE POLICY "Admins can manage all affiliate partners" 
ON public.affiliate_partners 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- سياسة للإدراج العام (للتسجيل)
CREATE POLICY "Anyone can register as affiliate partner" 
ON public.affiliate_partners 
FOR INSERT 
WITH CHECK (true);

-- إضافة trigger لتحديث updated_at
CREATE TRIGGER update_affiliate_partners_updated_at
BEFORE UPDATE ON public.affiliate_partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

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