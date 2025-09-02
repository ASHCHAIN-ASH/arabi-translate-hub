-- Clean up all policies and start fresh

-- Disable RLS temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies from users table
DROP POLICY IF EXISTS "System can insert users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "admin_can_see_all_users" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_self" ON public.users;
DROP POLICY IF EXISTS "users_select_own_row" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_own_row" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create ONE simple policy for each operation
CREATE POLICY "allow_insert" 
ON public.users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "allow_select" 
ON public.users 
FOR SELECT 
USING (true);

CREATE POLICY "allow_update" 
ON public.users 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_delete" 
ON public.users 
FOR DELETE 
USING (true);