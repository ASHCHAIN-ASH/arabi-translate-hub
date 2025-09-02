-- إنشاء جدول الطلبات مع الحقول المطلوبة
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_id TEXT UNIQUE NOT NULL,
  phone_last_four TEXT NOT NULL,
  title TEXT NOT NULL,
  degree TEXT NOT NULL,
  service_type TEXT NOT NULL,
  description TEXT,
  current_status TEXT DEFAULT 'received' NOT NULL,
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- إنشاء فهارس للأداء الأفضل
CREATE INDEX IF NOT EXISTS idx_orders_tracking_id ON public.orders(tracking_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone_tracking ON public.orders(tracking_id, phone_last_four);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(current_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- تفعيل Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات الأمان
CREATE POLICY "المديرون يمكنهم إدارة جميع الطلبات" ON public.orders
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "المستخدمون يمكنهم مشاهدة طلباتهم فقط" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "المستخدمون يمكنهم إنشاء طلباتهم" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "البحث العام بالتتبع والهاتف" ON public.orders
  FOR SELECT USING (true);

-- إنشاء trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_orders_updated_at();

-- إنشاء جدول timeline للطلبات
CREATE TABLE IF NOT EXISTS public.order_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  actor_type TEXT DEFAULT 'system' NOT NULL,
  actor_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- فهارس للـ timeline
CREATE INDEX IF NOT EXISTS idx_order_timeline_order_id ON public.order_timeline(order_id);
CREATE INDEX IF NOT EXISTS idx_order_timeline_status ON public.order_timeline(status);

-- تفعيل RLS للتايم لاين
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "المديرون يمكنهم إدارة التايم لاين" ON public.order_timeline
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "المستخدمون يمكنهم مشاهدة تايم لاين طلباتهم" ON public.order_timeline
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_timeline.order_id 
      AND (orders.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
    )
  );

-- حذف البيانات التجريبية إن وجدت
DELETE FROM public.orders WHERE tracking_id IN ('TR001234', 'TR001235');

-- إضافة بعض البيانات التجريبية للاختبار (اختيارية)
-- يمكن حذف هذا القسم إذا كنت لا تريد بيانات تجريبية
INSERT INTO public.orders (
  tracking_id, 
  phone_last_four, 
  title, 
  degree, 
  service_type, 
  description, 
  current_status, 
  estimated_delivery, 
  client_name, 
  client_phone, 
  client_email
) VALUES 
(
  'TR' || EXTRACT(YEAR FROM NOW()) || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  '1234',
  'نموذج طلب تجريبي للاختبار',
  'ماجستير إدارة الأعمال',
  'research-thesis',
  'هذا طلب تجريبي لاختبار النظام',
  'received',
  CURRENT_DATE + INTERVAL '30 days',
  'عميل تجريبي',
  '05012341234',
  'test@example.com'
)
ON CONFLICT (tracking_id) DO NOTHING;