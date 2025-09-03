-- Platform V2 Database Migration: Complete Restructure with Real-time Sync
-- Phase 1: Core Tables and Security (Handling Existing Types)

-- Create enums only if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'platform_user_role') THEN
    CREATE TYPE platform_user_role AS ENUM ('admin', 'staff', 'customer');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'platform_user_status') THEN
    CREATE TYPE platform_user_status AS ENUM ('pending', 'active', 'blocked');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'platform_order_status') THEN
    CREATE TYPE platform_order_status AS ENUM ('pending', 'paid', 'processing', 'completed', 'cancelled');
  END IF;
END $$;

-- Users & Authentication Table for Platform V2
CREATE TABLE IF NOT EXISTS platform_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  email_normalized TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT,
  role platform_user_role NOT NULL DEFAULT 'customer',
  status platform_user_status NOT NULL DEFAULT 'active',
  password_hash TEXT, -- Will use secure hashing
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  profile_data JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_users_email_norm ON platform_users(email_normalized);
CREATE INDEX IF NOT EXISTS idx_platform_users_role ON platform_users(role);
CREATE INDEX IF NOT EXISTS idx_platform_users_status ON platform_users(status);
CREATE INDEX IF NOT EXISTS idx_platform_users_created ON platform_users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_users_phone ON platform_users(phone) WHERE phone IS NOT NULL;

-- Service Categories for Platform V2
CREATE TABLE IF NOT EXISTS platform_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_categories_active ON platform_categories(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_platform_categories_slug ON platform_categories(slug);

-- Services Catalog for Platform V2
CREATE TABLE IF NOT EXISTS platform_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES platform_categories(id) ON DELETE SET NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  short_description_ar TEXT,
  short_description_en TEXT,
  features_ar TEXT[],
  features_en TEXT[],
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'SAR',
  unit_type TEXT DEFAULT 'service', -- 'service', 'page', 'hour', 'word'
  min_quantity INTEGER DEFAULT 1,
  max_quantity INTEGER,
  delivery_days INTEGER DEFAULT 7,
  is_active BOOLEAN DEFAULT TRUE,
  show_to_clients BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  image_url TEXT,
  gallery_urls TEXT[],
  tags TEXT[],
  meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_services_category ON platform_services(category_id);
CREATE INDEX IF NOT EXISTS idx_platform_services_active ON platform_services(is_active, show_to_clients);
CREATE INDEX IF NOT EXISTS idx_platform_services_slug ON platform_services(slug);
CREATE INDEX IF NOT EXISTS idx_platform_services_sort ON platform_services(sort_order);
CREATE INDEX IF NOT EXISTS idx_platform_services_featured ON platform_services(is_featured, sort_order);

-- Orders System for Platform V2
CREATE TABLE IF NOT EXISTS platform_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  status platform_order_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(12,2) DEFAULT 0,
  vat_percent NUMERIC(5,2) DEFAULT 15.00,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'SAR',
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  customer_notes TEXT,
  admin_notes TEXT,
  internal_notes TEXT,
  estimated_delivery DATE,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  billing_data JSONB DEFAULT '{}',
  meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_orders_customer ON platform_orders(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_orders_status ON platform_orders(status);
CREATE INDEX IF NOT EXISTS idx_platform_orders_number ON platform_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_platform_orders_created ON platform_orders(created_at DESC);

-- Order Items for Platform V2
CREATE TABLE IF NOT EXISTS platform_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES platform_orders(id) ON DELETE CASCADE,
  service_id UUID REFERENCES platform_services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL, -- Snapshot of service name
  service_description TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(12,2) NOT NULL,
  custom_requirements TEXT,
  attachments JSONB DEFAULT '[]',
  meta_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_order_items_order ON platform_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_platform_order_items_service ON platform_order_items(service_id);

-- Password Reset Tokens for Platform V2
CREATE TABLE IF NOT EXISTS platform_password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_password_resets_token ON platform_password_resets(token);
CREATE INDEX IF NOT EXISTS idx_platform_password_resets_user ON platform_password_resets(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_password_resets_expires ON platform_password_resets(expires_at);

-- Clean up expired password reset tokens
CREATE OR REPLACE FUNCTION cleanup_expired_platform_password_resets()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM platform_password_resets 
  WHERE expires_at < now() OR used = TRUE;
END;
$$;

-- Email Verification Tokens for Platform V2
CREATE TABLE IF NOT EXISTS platform_email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_email_verifications_token ON platform_email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_platform_email_verifications_user ON platform_email_verifications(user_id);

-- Notifications System for Platform V2
CREATE TABLE IF NOT EXISTS platform_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  body_ar TEXT NOT NULL,
  body_en TEXT,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  category TEXT DEFAULT 'general', -- 'order', 'service', 'account', 'general', 'system'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  action_url TEXT,
  action_label_ar TEXT,
  action_label_en TEXT,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_notifications_user ON platform_notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_notifications_unread ON platform_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_platform_notifications_type ON platform_notifications(type);
CREATE INDEX IF NOT EXISTS idx_platform_notifications_priority ON platform_notifications(priority, created_at DESC);

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_platform_order_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_suffix TEXT;
  counter INTEGER;
  order_num TEXT;
BEGIN
  year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4 FOR 6) AS INTEGER)), 0) + 1
  INTO counter
  FROM platform_orders
  WHERE order_number LIKE 'PO' || year_suffix || '%';
  
  order_num := 'PO' || year_suffix || LPAD(counter::TEXT, 6, '0');
  
  RETURN order_num;
END;
$$;

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_platform_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_platform_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_platform_order_number();
  END IF;
  RETURN NEW;
END;
$$;