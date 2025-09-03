-- Platform V2 Database Migration: Complete Restructure with Real-time Sync
-- Phase 1: Core Tables and Security

-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'blocked');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'completed', 'cancelled');

-- Users & Authentication Table
CREATE TABLE IF NOT EXISTS platform_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  email_normalized TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  status user_status NOT NULL DEFAULT 'active',
  password_hash TEXT, -- Will use Argon2
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_users_email_norm ON platform_users(email_normalized);
CREATE INDEX IF NOT EXISTS idx_platform_users_role ON platform_users(role);
CREATE INDEX IF NOT EXISTS idx_platform_users_status ON platform_users(status);
CREATE INDEX IF NOT EXISTS idx_platform_users_created ON platform_users(created_at DESC);

-- Service Categories
CREATE TABLE IF NOT EXISTS platform_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_categories_active ON platform_categories(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_platform_categories_slug ON platform_categories(slug);

-- Services Catalog
CREATE TABLE IF NOT EXISTS platform_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES platform_categories(id) ON DELETE SET NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  slug TEXT UNIQUE NOT NULL,
  description_ar TEXT,
  description_en TEXT,
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
  sort_order INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_services_category ON platform_services(category_id);
CREATE INDEX IF NOT EXISTS idx_platform_services_active ON platform_services(is_active, show_to_clients);
CREATE INDEX IF NOT EXISTS idx_platform_services_slug ON platform_services(slug);
CREATE INDEX IF NOT EXISTS idx_platform_services_sort ON platform_services(sort_order);

-- Orders System
CREATE TABLE IF NOT EXISTS platform_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(12,2) DEFAULT 0,
  vat_percent NUMERIC(5,2) DEFAULT 15.00,
  vat_amount NUMERIC(12,2) DEFAULT 0,
  total NUMERIC(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'SAR',
  notes TEXT,
  customer_notes TEXT,
  admin_notes TEXT,
  estimated_delivery DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_orders_customer ON platform_orders(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_orders_status ON platform_orders(status);
CREATE INDEX IF NOT EXISTS idx_platform_orders_number ON platform_orders(order_number);

-- Order Items
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
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_order_items_order ON platform_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_platform_order_items_service ON platform_order_items(service_id);

-- Password Reset Tokens
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
CREATE INDEX IF NOT EXISTS idx_platform_password_resets_user ON platform_password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_password_resets_expires ON platform_password_resets(expires_at);

-- Email Verification Tokens
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

-- Notifications System
CREATE TABLE IF NOT EXISTS platform_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  title_ar TEXT NOT NULL,
  title_en TEXT,
  body_ar TEXT NOT NULL,
  body_en TEXT,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  category TEXT DEFAULT 'general', -- 'order', 'service', 'account', 'general'
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_notifications_user ON platform_notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_notifications_unread ON platform_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_platform_notifications_type ON platform_notifications(type);

-- Audit Logs for Security and Compliance
CREATE TABLE IF NOT EXISTS platform_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES platform_users(id),
  action TEXT NOT NULL, -- e.g. SERVICE_CREATE, USER_REGISTER, ORDER_UPDATE
  entity_type TEXT NOT NULL, -- 'service', 'order', 'user', 'category'
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_actor ON platform_audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_entity ON platform_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_action ON platform_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_created ON platform_audit_logs(created_at DESC);

-- Legacy ID Mapping Table for Migration
CREATE TABLE IF NOT EXISTS platform_legacy_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'user', 'service', 'order', 'category'
  legacy_id TEXT NOT NULL,
  new_id UUID NOT NULL,
  migrated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_legacy_mappings_unique ON platform_legacy_mappings(entity_type, legacy_id);
CREATE INDEX IF NOT EXISTS idx_platform_legacy_mappings_new_id ON platform_legacy_mappings(new_id);

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

CREATE TRIGGER trigger_set_platform_order_number
  BEFORE INSERT ON platform_orders
  FOR EACH ROW
  EXECUTE FUNCTION set_platform_order_number();

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

-- Add updated_at triggers to relevant tables
CREATE TRIGGER trigger_platform_users_updated_at
  BEFORE UPDATE ON platform_users
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_updated_at();

CREATE TRIGGER trigger_platform_categories_updated_at
  BEFORE UPDATE ON platform_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_updated_at();

CREATE TRIGGER trigger_platform_services_updated_at
  BEFORE UPDATE ON platform_services
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_updated_at();

CREATE TRIGGER trigger_platform_orders_updated_at
  BEFORE UPDATE ON platform_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_platform_updated_at();