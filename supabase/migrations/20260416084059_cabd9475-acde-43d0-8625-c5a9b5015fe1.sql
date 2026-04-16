
-- =============================================
-- 1. FIX ORDERS TABLE: Remove public access
-- =============================================

-- Drop the overly permissive public tracking policy
DROP POLICY IF EXISTS "Public order tracking" ON public.orders;
DROP POLICY IF EXISTS "Enable read access for order tracking" ON public.orders;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.orders;

-- Add a safe public tracking policy: only by tracking_id + phone_last_four
CREATE POLICY "Public can track orders by tracking info"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (false); 
-- We disable open SELECT. Tracking will use a secure function instead.

-- Create a secure function for order tracking (no direct table access needed)
CREATE OR REPLACE FUNCTION public.track_order(_tracking_id text, _phone_last_four text)
RETURNS SETOF orders
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.orders
  WHERE tracking_id = upper(_tracking_id)
    AND phone_last_four = _phone_last_four
  LIMIT 1;
$$;

-- =============================================
-- 2. FIX ORDER_TIMELINE: Remove public access
-- =============================================

DROP POLICY IF EXISTS "Public order timeline tracking" ON public.order_timeline;

-- =============================================
-- 3. FIX AUDIT_LOGS: Prevent forgery
-- =============================================

-- Drop the permissive insert policy
DROP POLICY IF EXISTS "Authenticated users insert audit logs" ON public.audit_logs;

-- Create secure audit log function
CREATE OR REPLACE FUNCTION public.insert_audit_log(
  _table_name text,
  _action text,
  _record_id uuid DEFAULT NULL,
  _old_data jsonb DEFAULT NULL,
  _new_data jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (table_name, action, user_id, record_id, old_data, new_data, created_at)
  VALUES (_table_name, _action, auth.uid(), _record_id, _old_data, _new_data, now());
END;
$$;

-- =============================================
-- 4. FIX SPIN_ATTEMPTS: Require authentication
-- =============================================

DROP POLICY IF EXISTS "Anyone can insert spin" ON public.spin_attempts;

-- Only authenticated users can insert, and must use their own user_id
CREATE POLICY "Authenticated users insert own spin"
ON public.spin_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 5. FIX SERVICES: Only show active services publicly
-- =============================================

DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

CREATE POLICY "Anyone can view active services"
ON public.services
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- =============================================
-- 6. FIX update_updated_at_column function search_path
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
