-- Enable RLS on users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all users
CREATE POLICY "Admins can view all users" ON public.users
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admins to manage all users
CREATE POLICY "Admins can manage all users" ON public.users
FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for users to view their own profile
CREATE POLICY "Users can view their own profile" ON public.users
FOR SELECT USING (auth.uid()::text IN (
    SELECT id::text FROM public.users WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
    )
));

-- Create policy for users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
FOR UPDATE USING (auth.uid()::text IN (
    SELECT id::text FROM public.users WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
    )
));

-- Create policy for system to insert new users
CREATE POLICY "System can insert users" ON public.users
FOR INSERT WITH CHECK (true);