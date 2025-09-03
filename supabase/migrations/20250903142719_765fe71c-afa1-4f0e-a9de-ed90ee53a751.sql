-- Platform V2 Database Migration: Security Fixes and RLS Policies
-- Phase 2: Row Level Security and Real-time Setup

-- Enable RLS on all Platform V2 tables
ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_notifications ENABLE ROW LEVEL SECURITY;

-- Audit logs table (admin only access)
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

ALTER TABLE platform_audit_logs ENABLE ROW LEVEL SECURITY;

-- Legacy ID Mapping Table for Migration
CREATE TABLE IF NOT EXISTS platform_legacy_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'user', 'service', 'order', 'category'
  legacy_id TEXT NOT NULL,
  new_id UUID NOT NULL,
  migrated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE platform_legacy_mappings ENABLE ROW LEVEL SECURITY;

-- Add indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_actor ON platform_audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_entity ON platform_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_action ON platform_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_created ON platform_audit_logs(created_at DESC);

-- Add unique constraint for legacy mappings
CREATE UNIQUE INDEX IF NOT EXISTS idx_platform_legacy_mappings_unique ON platform_legacy_mappings(entity_type, legacy_id);
CREATE INDEX IF NOT EXISTS idx_platform_legacy_mappings_new_id ON platform_legacy_mappings(new_id);

-- Helper function to check if user has specific role
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

-- Helper function to check if user is admin
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

-- Helper function to check if user is staff or admin
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
  USING (true); -- Allow reading basic profile info

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

-- RLS Policies for platform_password_resets
CREATE POLICY "platform_password_resets_own_tokens" ON platform_password_resets
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "platform_password_resets_service_access" ON platform_password_resets
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for platform_email_verifications
CREATE POLICY "platform_email_verifications_own_tokens" ON platform_email_verifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "platform_email_verifications_service_access" ON platform_email_verifications
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

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

-- RLS Policies for platform_audit_logs (admin only)
CREATE POLICY "platform_audit_logs_admin_only" ON platform_audit_logs
  FOR ALL TO authenticated
  USING (platform_is_admin(auth.uid()))
  WITH CHECK (platform_is_admin(auth.uid()));

CREATE POLICY "platform_audit_logs_service_role" ON platform_audit_logs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for platform_legacy_mappings (admin only)
CREATE POLICY "platform_legacy_mappings_admin_only" ON platform_legacy_mappings
  FOR ALL TO authenticated
  USING (platform_is_admin(auth.uid()))
  WITH CHECK (platform_is_admin(auth.uid()));

-- Add triggers for updated_at timestamps
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

-- Add trigger for order number generation
CREATE TRIGGER trigger_set_platform_order_number
  BEFORE INSERT ON platform_orders
  FOR EACH ROW
  EXECUTE FUNCTION set_platform_order_number();

-- Enable Realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE platform_users;
ALTER PUBLICATION supabase_realtime ADD TABLE platform_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE platform_services;
ALTER PUBLICATION supabase_realtime ADD TABLE platform_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE platform_order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE platform_notifications;

-- Set REPLICA IDENTITY FULL for real-time updates
ALTER TABLE platform_users REPLICA IDENTITY FULL;
ALTER TABLE platform_categories REPLICA IDENTITY FULL;
ALTER TABLE platform_services REPLICA IDENTITY FULL;
ALTER TABLE platform_orders REPLICA IDENTITY FULL;
ALTER TABLE platform_order_items REPLICA IDENTITY FULL;
ALTER TABLE platform_notifications REPLICA IDENTITY FULL;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_platform_notification(
  p_user_id UUID,
  p_title_ar TEXT,
  p_body_ar TEXT,
  p_title_en TEXT DEFAULT NULL,
  p_body_en TEXT DEFAULT NULL,
  p_type TEXT DEFAULT 'info',
  p_category TEXT DEFAULT 'general',
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO platform_notifications (
    user_id, title_ar, title_en, body_ar, body_en, type, category, data
  ) VALUES (
    p_user_id, p_title_ar, p_title_en, p_body_ar, p_body_en, p_type, p_category, p_data
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;