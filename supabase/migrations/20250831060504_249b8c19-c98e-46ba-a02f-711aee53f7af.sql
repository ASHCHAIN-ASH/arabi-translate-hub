-- إنشاء جدول الطلبات
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL,
    user_id UUID NOT NULL,
    service_type TEXT NOT NULL,
    service_title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    priority TEXT NOT NULL DEFAULT 'medium',
    progress_percentage INTEGER DEFAULT 0,
    total_price NUMERIC(10,2) NOT NULL,
    paid_amount NUMERIC(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'SAR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    deadline_date DATE,
    assigned_to UUID,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    client_university TEXT,
    
    CONSTRAINT orders_status_check CHECK (status IN ('pending', 'in_progress', 'under_review', 'completed', 'cancelled')),
    CONSTRAINT orders_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    CONSTRAINT orders_progress_check CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

-- إنشاء جدول ملفات الطلبات
CREATE TABLE IF NOT EXISTS public.order_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT,
    file_type TEXT,
    uploaded_by UUID NOT NULL,
    uploaded_by_type TEXT NOT NULL DEFAULT 'client', -- 'client' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT order_files_uploaded_by_type_check CHECK (uploaded_by_type IN ('client', 'admin', 'specialist'))
);

-- إنشاء جدول الجدول الزمني للطلبات
CREATE TABLE IF NOT EXISTS public.order_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    actor_type TEXT NOT NULL DEFAULT 'system',
    actor_name TEXT,
    scheduled_date DATE,
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT order_timeline_status_check CHECK (status IN ('pending', 'current', 'completed', 'cancelled')),
    CONSTRAINT order_timeline_actor_type_check CHECK (actor_type IN ('client', 'admin', 'specialist', 'system'))
);

-- إنشاء جدول رسائل التواصل
CREATE TABLE IF NOT EXISTS public.order_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    sender_type TEXT NOT NULL DEFAULT 'client',
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    CONSTRAINT order_communications_sender_type_check CHECK (sender_type IN ('client', 'admin', 'specialist'))
);

-- إنشاء دالة لتوليد رقم الطلب
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  order_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.orders
  WHERE order_number LIKE 'ORD' || year_suffix || '%';
  
  order_num := 'ORD' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN order_num;
END;
$$;

-- إنشاء trigger لتوليد رقم الطلب تلقائياً
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_order_number
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- إنشاء trigger لتحديث updated_at
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- إنشاء الفهارس للأداء
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_assigned_to ON public.orders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_order_files_order_id ON public.order_files(order_id);
CREATE INDEX IF NOT EXISTS idx_order_timeline_order_id ON public.order_timeline(order_id);
CREATE INDEX IF NOT EXISTS idx_order_communications_order_id ON public.order_communications(order_id);

-- إعداد RLS policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_communications ENABLE ROW LEVEL SECURITY;

-- RLS policies للطلبات
CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
    ON public.orders FOR UPDATE
    USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all orders"
    ON public.orders FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies للملفات
CREATE POLICY "Users can view files of their orders"
    ON public.order_files FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_files.order_id 
        AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    ));

CREATE POLICY "Users can upload files to their orders"
    ON public.order_files FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_files.order_id 
        AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    ));

CREATE POLICY "Admins can manage all order files"
    ON public.order_files FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies للجدول الزمني
CREATE POLICY "Users can view timeline of their orders"
    ON public.order_timeline FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_timeline.order_id 
        AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    ));

CREATE POLICY "Admins can manage order timeline"
    ON public.order_timeline FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies للرسائل
CREATE POLICY "Users can view communications of their orders"
    ON public.order_communications FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_communications.order_id 
        AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    ));

CREATE POLICY "Users can send messages to their orders"
    ON public.order_communications FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_communications.order_id 
        AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    ));

CREATE POLICY "Admins can manage all order communications"
    ON public.order_communications FOR ALL
    USING (has_role(auth.uid(), 'admin'::app_role));

-- تفعيل Real-time updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_files REPLICA IDENTITY FULL;
ALTER TABLE public.order_timeline REPLICA IDENTITY FULL;
ALTER TABLE public.order_communications REPLICA IDENTITY FULL;

-- إضافة الجداول إلى supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_files;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_timeline;
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_communications;

-- إدراج بيانات تجريبية للطلب رقم 5
INSERT INTO public.orders (
    id,
    order_number,
    user_id,
    service_type,
    service_title,
    description,
    status,
    priority,
    progress_percentage,
    total_price,
    paid_amount,
    deadline_date,
    client_name,
    client_email,
    client_phone,
    client_university
) VALUES (
    '00000000-0000-0000-0000-000000000005',
    'ORD240005',
    '00000000-0000-0000-0000-000000000001',
    'academic',
    'ترجمة أكاديمية متقدمة',
    'تحليل إحصائي شامل للبيانات البحثية باستخدام SPSS وR مع ترجمة النتائج للغة العربية',
    'in_progress',
    'high',
    65,
    899.00,
    450.00,
    '2024-01-30',
    'أحمد محمد علي',
    'ahmed.ali@email.com',
    '+966501234567',
    'جامعة الملك سعود'
) ON CONFLICT (id) DO NOTHING;

-- إدراج ملفات تجريبية
INSERT INTO public.order_files (order_id, file_name, file_url, file_size, file_type, uploaded_by, uploaded_by_type) VALUES 
('00000000-0000-0000-0000-000000000005', 'البحث_الأصلي.pdf', '/files/research.pdf', '2.5 ميجا', 'pdf', '00000000-0000-0000-0000-000000000001', 'client'),
('00000000-0000-0000-0000-000000000005', 'الجداول_الإحصائية.xlsx', '/files/tables.xlsx', '1.2 ميجا', 'excel', '00000000-0000-0000-0000-000000000001', 'client'),
('00000000-0000-0000-0000-000000000005', 'المراجع_المترجمة.docx', '/files/references.docx', '800 كيلو', 'word', '00000000-0000-0000-0000-000000000002', 'admin');

-- إدراج الجدول الزمني
INSERT INTO public.order_timeline (order_id, title, description, status, actor_type, actor_name, completed_date) VALUES 
('00000000-0000-0000-0000-000000000005', 'تم إنشاء الطلب', 'تم استلام طلب الترجمة الأكاديمية', 'completed', 'client', 'أحمد محمد علي', '2024-01-15'),
('00000000-0000-0000-0000-000000000005', 'تم تأكيد الدفع', 'تم استلام المبلغ المقدم وتأكيد الطلب', 'completed', 'system', 'النظام', '2024-01-16'),
('00000000-0000-0000-0000-000000000005', 'بدء العمل على المشروع', 'تم تعيين مختص الترجمة وبدء العمل', 'completed', 'admin', 'المختص', '2024-01-18'),
('00000000-0000-0000-0000-000000000005', 'مراجعة أولية للترجمة', 'جاري مراجعة الترجمة الأولية وضمان الجودة', 'current', 'specialist', 'المختص', NULL),
('00000000-0000-0000-0000-000000000005', 'تسليم النسخة النهائية', 'تسليم العمل المكتمل مع شهادة الجودة', 'pending', 'specialist', 'المختص', NULL);

-- إدراج رسائل التواصل
INSERT INTO public.order_communications (order_id, sender_id, sender_type, sender_name, message) VALUES 
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'specialist', 'المختص', 'مرحباً أحمد، تم البدء في ترجمة المشروع وفقاً للمعايير الأكاديمية المطلوبة. سيتم تسليم المراجعة الأولية خلال 3 أيام عمل.'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'client', 'أحمد محمد علي', 'شكراً جزيلاً لكم على الاهتمام. أتطلع لرؤية النتائج والجودة المتوقعة منكم.'),
('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000002', 'specialist', 'المختص', 'تم الانتهاء من ترجمة 65% من المشروع. النتائج الأولية ممتازة وتتماشى مع المعايير المطلوبة.');