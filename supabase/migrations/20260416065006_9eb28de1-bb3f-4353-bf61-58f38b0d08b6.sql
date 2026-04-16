
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Service categories
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.service_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.service_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.service_categories(id),
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  price NUMERIC(12,2),
  unit TEXT DEFAULT 'page',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Customers
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own customer record" ON public.customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage customers" ON public.customers FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Service orders
CREATE TABLE public.service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || LPAD(FLOOR(RANDOM()*1000000)::TEXT, 6, '0'),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id),
  service_id UUID REFERENCES public.services(id),
  service_name TEXT,
  current_status TEXT DEFAULT 'pending' CHECK (current_status IN ('pending','confirmed','in_progress','review','completed','cancelled','refunded')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  total_amount NUMERIC(12,2) DEFAULT 0,
  paid_amount NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.service_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own orders" ON public.service_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON public.service_orders FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Order timeline
CREATE TABLE public.service_order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.service_orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_order_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own order timeline" ON public.service_order_timeline FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.service_orders WHERE id = order_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage timeline" ON public.service_order_timeline FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Invoices
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL DEFAULT 'INV-' || LPAD(FLOOR(RANDOM()*1000000)::TEXT, 6, '0'),
  order_id UUID REFERENCES public.service_orders(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id),
  subtotal NUMERIC(12,2) DEFAULT 0,
  tax_amount NUMERIC(12,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  total_amount NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own invoices" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage invoices" ON public.invoices FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Invoice items
CREATE TABLE public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  quantity INT DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(12,2) DEFAULT 0,
  total_price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own invoice items" ON public.invoice_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_id AND user_id = auth.uid()));
CREATE POLICY "Admins manage invoice items" ON public.invoice_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Payment transactions (wallet)
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES public.invoices(id),
  type TEXT NOT NULL CHECK (type IN ('credit','debit','refund')),
  amount NUMERIC(12,2) NOT NULL,
  balance_after NUMERIC(12,2),
  description TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending','completed','failed','reversed')),
  reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own transactions" ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage transactions" ON public.payment_transactions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Tickets
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL DEFAULT 'TKT-' || LPAD(FLOOR(RANDOM()*100000)::TEXT, 5, '0'),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general','technical','billing','complaint','suggestion')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','waiting','resolved','closed')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage tickets" ON public.tickets FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
  target_audience TEXT DEFAULT 'all',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Admins create notifications" ON public.notifications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- User notifications
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read_at TIMESTAMPTZ,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.user_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.user_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage user notifications" ON public.user_notifications FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Email templates
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage email templates" ON public.email_templates FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Spin attempts
CREATE TABLE public.spin_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  phone TEXT,
  prize TEXT,
  claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.spin_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own spins" ON public.spin_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert spin" ON public.spin_attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage spins" ON public.spin_attempts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Contracts
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT UNIQUE NOT NULL DEFAULT 'CTR-' || LPAD(FLOOR(RANDOM()*100000)::TEXT, 5, '0'),
  order_id UUID REFERENCES public.service_orders(id),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','signed','active','completed','cancelled')),
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own contracts" ON public.contracts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage contracts" ON public.contracts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.service_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;

-- Performance indexes
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_service_orders_user_id ON public.service_orders(user_id);
CREATE INDEX idx_service_orders_status ON public.service_orders(current_status);
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX idx_contracts_user_id ON public.contracts(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
