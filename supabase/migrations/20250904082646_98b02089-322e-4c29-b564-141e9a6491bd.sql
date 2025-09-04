-- Complete fix for customers table RLS policies
-- First, drop all existing policies
DROP POLICY IF EXISTS "enable_read_for_authenticated_users" ON customers;
DROP POLICY IF EXISTS "enable_all_for_admin_users" ON customers;
DROP POLICY IF EXISTS "customers_admin_access" ON customers;
DROP POLICY IF EXISTS "customers_read_authenticated" ON customers;

-- Disable RLS temporarily to ensure clean state
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create simple and effective policies
-- Allow all authenticated users to read customers
CREATE POLICY "allow_authenticated_read" ON customers
FOR SELECT TO authenticated
USING (true);

-- Allow authenticated users to manage customers (for admin functionality)
CREATE POLICY "allow_authenticated_all" ON customers
FOR ALL TO authenticated
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON customers TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;