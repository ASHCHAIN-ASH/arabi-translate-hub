-- Fix customers RLS policies to allow access for both authenticated and unauthenticated users
-- This is needed for admin dashboard functionality

-- Drop existing policies
DROP POLICY IF EXISTS "allow_authenticated_read" ON customers;
DROP POLICY IF EXISTS "allow_authenticated_all" ON customers;

-- Create policies that work for both authenticated and unauthenticated users
-- Allow anyone to read customer data (for admin dashboard)
CREATE POLICY "allow_public_read" ON customers
FOR SELECT 
USING (true);

-- Allow anyone to manage customer data (for admin functionality)
CREATE POLICY "allow_public_all" ON customers
FOR ALL 
USING (true)
WITH CHECK (true);

-- Grant permissions to anonymous role as well
GRANT SELECT, INSERT, UPDATE, DELETE ON customers TO anon;
GRANT USAGE ON SCHEMA public TO anon;