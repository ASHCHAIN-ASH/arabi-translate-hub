-- إنشاء جدول طلبات محدث للخدمات الجديدة
CREATE TABLE IF NOT EXISTS public.service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_id TEXT NOT NULL UNIQUE,
    service_id UUID REFERENCES public.services(id),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    title TEXT NOT NULL,
    description TEXT,
    requirements TEXT,
    quantity INTEGER DEFAULT 1,
    unit_type TEXT DEFAULT 'page',
    estimated_price DECIMAL(10,2),
    rush_delivery BOOLEAN DEFAULT false,
    expected_delivery DATE,
    additional_notes TEXT,
    current_status TEXT DEFAULT 'received' CHECK (current_status IN (
        'received', 'under_review', 'in_progress', 'completed', 'delivered', 'cancelled'
    )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
);

-- إضافة فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_service_orders_tracking_id ON public.service_orders(tracking_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_client_email ON public.service_orders(client_email);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON public.service_orders(current_status);

-- تفعيل RLS
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

-- إنشاء policies
CREATE POLICY "Users can view their own service orders" 
ON public.service_orders 
FOR SELECT 
USING (
    client_email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
    OR user_id = auth.uid()
);

CREATE POLICY "Anyone can create service orders" 
ON public.service_orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all service orders" 
ON public.service_orders 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_credentials 
        WHERE id = auth.uid() 
        AND is_active = true 
        AND role = 'admin'
    )
);

CREATE POLICY "Admins can update service orders" 
ON public.service_orders 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_credentials 
        WHERE id = auth.uid() 
        AND is_active = true 
        AND role = 'admin'
    )
);

-- إنشاء جدول timeline للطلبات الجديدة
CREATE TABLE IF NOT EXISTS public.service_order_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    actor_type TEXT DEFAULT 'system' CHECK (actor_type IN ('system', 'admin', 'client')),
    actor_name TEXT,
    scheduled_date DATE,
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إضافة فهرس
CREATE INDEX IF NOT EXISTS idx_service_order_timeline_order_id ON public.service_order_timeline(order_id);

-- تفعيل RLS
ALTER TABLE public.service_order_timeline ENABLE ROW LEVEL SECURITY;

-- policies للtimeline
CREATE POLICY "Users can view timeline of their orders" 
ON public.service_order_timeline 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.service_orders so
        WHERE so.id = service_order_timeline.order_id
        AND (so.client_email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR so.user_id = auth.uid())
    )
);

CREATE POLICY "Admins can manage all timelines" 
ON public.service_order_timeline 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.admin_credentials 
        WHERE id = auth.uid() 
        AND is_active = true 
        AND role = 'admin'
    )
);

-- تفعيل real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_order_timeline;

-- إنشاء trigger للـ updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_orders_updated_at
    BEFORE UPDATE ON public.service_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();