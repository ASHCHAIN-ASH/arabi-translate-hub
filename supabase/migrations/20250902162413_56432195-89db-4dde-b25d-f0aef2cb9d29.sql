-- حذف الجدول الموجود والذي يحتوي على حقول مختلفة
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.order_timeline CASCADE;

-- إنشاء جدول الطلبات مع الحقول المطلوبة
CREATE TABLE public.orders (
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
CREATE INDEX idx_orders_tracking_id ON public.orders(tracking_id);
CREATE INDEX idx_orders_phone_tracking ON public.orders(tracking_id, phone_last_four);
CREATE INDEX idx_orders_status ON public.orders(current_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);

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
CREATE TABLE public.order_timeline (
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
CREATE INDEX idx_order_timeline_order_id ON public.order_timeline(order_id);
CREATE INDEX idx_order_timeline_status ON public.order_timeline(status);

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