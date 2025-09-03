-- Platform V2 Database Migration: Security Fixes and RLS Policies (Handle Existing)
-- Phase 2: Row Level Security and Real-time Setup

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "platform_users_admin_full_access" ON platform_users;
    DROP POLICY IF EXISTS "platform_users_own_profile_access" ON platform_users;
    DROP POLICY IF EXISTS "platform_users_public_profile_read" ON platform_users;
EXCEPTION
    WHEN undefined_table THEN NULL; -- Ignore if table doesn't exist
END $$;

-- Enable RLS on all Platform V2 tables (if not already enabled)
ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_notifications ENABLE ROW LEVEL SECURITY;

-- Create audit logs and legacy mappings tables if they don't exist
CREATE TABLE IF NOT EXISTS platform_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES platform_users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS platform_legacy_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  legacy_id TEXT NOT NULL,
  new_id UUID NOT NULL,
  migrated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE platform_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_legacy_mappings ENABLE ROW LEVEL SECURITY;

-- Helper functions for role checking
CREATE OR REPLACE FUNCTION platform_has_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM platform_users 
    WHERE id = user_id 
    AND role::text = required_role 
    AND status = 'active'
  );
END;
$$;

CREATE OR REPLACE FUNCTION platform_is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN platform_has_role(user_id, 'admin');
END;
$$;

CREATE OR REPLACE FUNCTION platform_is_staff_or_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN platform_has_role(user_id, 'admin') OR platform_has_role(user_id, 'staff');
END;
$$;

-- RLS Policies for platform_users
CREATE POLICY "platform_users_admin_full_access" ON platform_users
  FOR ALL TO authenticated
  USING (platform_is_admin(auth.uid()))
  WITH CHECK (platform_is_admin(auth.uid()));

CREATE POLICY "platform_users_own_profile_access" ON platform_users
  FOR ALL TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "platform_users_public_profile_read" ON platform_users
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for platform_categories
CREATE POLICY "platform_categories_admin_manage" ON platform_categories
  FOR ALL TO authenticated
  USING (platform_is_admin(auth.uid()))
  WITH CHECK (platform_is_admin(auth.uid()));

CREATE POLICY "platform_categories_public_read" ON platform_categories
  FOR SELECT TO authenticated
  USING (is_active = true);

-- RLS Policies for platform_services
CREATE POLICY "platform_services_admin_manage" ON platform_services
  FOR ALL TO authenticated
  USING (platform_is_staff_or_admin(auth.uid()))
  WITH CHECK (platform_is_staff_or_admin(auth.uid()));

CREATE POLICY "platform_services_public_read" ON platform_services
  FOR SELECT TO authenticated
  USING (is_active = true AND show_to_clients = true);

-- RLS Policies for platform_orders
CREATE POLICY "platform_orders_admin_access" ON platform_orders
  FOR ALL TO authenticated
  USING (platform_is_staff_or_admin(auth.uid()))
  WITH CHECK (platform_is_staff_or_admin(auth.uid()));

CREATE POLICY "platform_orders_customer_own_orders" ON platform_orders
  FOR ALL TO authenticated
  USING (customer_id = auth.uid())
  WITH CHECK (customer_id = auth.uid());

-- RLS Policies for platform_order_items
CREATE POLICY "platform_order_items_admin_access" ON platform_order_items
  FOR ALL TO authenticated
  USING (platform_is_staff_or_admin(auth.uid()));

CREATE POLICY "platform_order_items_customer_own_items" ON platform_order_items
  FOR SELECT TO authenticated
  USING (EXISTS(
    SELECT 1 FROM platform_orders 
    WHERE id = order_id AND customer_id = auth.uid()
  ));

-- RLS Policies for platform_notifications
CREATE POLICY "platform_notifications_admin_manage" ON platform_notifications
  FOR ALL TO authenticated
  USING (platform_is_admin(auth.uid()))
  WITH CHECK (platform_is_admin(auth.uid()));

CREATE POLICY "platform_notifications_user_own_notifications" ON platform_notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "platform_notifications_user_mark_read" ON platform_notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Enable Realtime for key tables
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE platform_users;
EXCEPTION
    WHEN duplicate_object THEN NULL; -- Table already added
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE platform_services;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE platform_orders;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE platform_notifications;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Set REPLICA IDENTITY FULL for real-time updates
ALTER TABLE platform_users REPLICA IDENTITY FULL;
ALTER TABLE platform_services REPLICA IDENTITY FULL;
ALTER TABLE platform_orders REPLICA IDENTITY FULL;
ALTER TABLE platform_notifications REPLICA IDENTITY FULL;