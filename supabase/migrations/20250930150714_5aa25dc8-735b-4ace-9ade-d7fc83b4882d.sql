-- إنشاء جدول طلبات الخدمات البحثية
CREATE TABLE IF NOT EXISTS public.research_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  category_title TEXT NOT NULL,
  specialization TEXT NOT NULL,
  research_type TEXT NOT NULL,
  research_title TEXT NOT NULL,
  deadline DATE NOT NULL,
  details TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- دالة لتوليد رقم طلب تلقائي
CREATE OR REPLACE FUNCTION generate_research_order_number()
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  order_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.research_orders
  WHERE order_number LIKE 'RO' || year_suffix || '%';
  
  order_num := 'RO' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger لتوليد رقم الطلب تلقائياً
CREATE OR REPLACE FUNCTION set_research_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_research_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER research_orders_set_number
BEFORE INSERT ON public.research_orders
FOR EACH ROW
EXECUTE FUNCTION set_research_order_number();

-- Trigger لتحديث updated_at
CREATE TRIGGER research_orders_updated_at
BEFORE UPDATE ON public.research_orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- إنشاء bucket للمرفقات
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'research-attachments',
  'research-attachments',
  false,
  10485760,
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies للطلبات
ALTER TABLE public.research_orders ENABLE ROW LEVEL SECURITY;

-- الإدارة يمكنها رؤية وإدارة جميع الطلبات
CREATE POLICY "Admins can manage all research orders"
ON public.research_orders
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- السماح للنظام بإدراج الطلبات
CREATE POLICY "Allow system to insert research orders"
ON public.research_orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policies للمرفقات
CREATE POLICY "Admins can view research attachments"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'research-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Authenticated users can upload research attachments"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'research-attachments');

CREATE POLICY "Admins can delete research attachments"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'research-attachments' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_research_orders_order_number ON public.research_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_research_orders_category ON public.research_orders(category);
CREATE INDEX IF NOT EXISTS idx_research_orders_status ON public.research_orders(status);
CREATE INDEX IF NOT EXISTS idx_research_orders_created_at ON public.research_orders(created_at DESC);