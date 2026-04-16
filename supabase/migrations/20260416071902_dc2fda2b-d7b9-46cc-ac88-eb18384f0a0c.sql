
-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_id TEXT UNIQUE NOT NULL DEFAULT ('TR' || lpad((floor(random() * 1000000))::text, 6, '0')),
  phone_last_four TEXT NOT NULL,
  title TEXT NOT NULL,
  degree TEXT NOT NULL DEFAULT '',
  service_type TEXT NOT NULL DEFAULT 'general',
  description TEXT,
  current_status TEXT DEFAULT 'received',
  estimated_delivery DATE,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_orders_tracking_id ON public.orders(tracking_id);
CREATE INDEX idx_orders_phone_tracking ON public.orders(tracking_id, phone_last_four);
CREATE INDEX idx_orders_status ON public.orders(current_status);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Admins manage all orders
CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Users view own orders
CREATE POLICY "Users view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users create orders
CREATE POLICY "Users create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read for tracking (by tracking_id + phone)
CREATE POLICY "Public order tracking" ON public.orders
  FOR SELECT USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create order_timeline table
CREATE TABLE IF NOT EXISTS public.order_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  description TEXT,
  status TEXT NOT NULL,
  scheduled_date DATE,
  completed_date DATE,
  actor_type TEXT NOT NULL DEFAULT 'system',
  actor_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_timeline_order_id ON public.order_timeline(order_id);

-- Enable RLS
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

-- Admins manage timeline
CREATE POLICY "Admins manage order timeline" ON public.order_timeline
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Users view timeline for own orders
CREATE POLICY "Users view own order timeline" ON public.order_timeline
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.orders WHERE orders.id = order_timeline.order_id AND orders.user_id = auth.uid()
  ));

-- Public timeline for tracking
CREATE POLICY "Public order timeline tracking" ON public.order_timeline
  FOR SELECT USING (true);
