-- Fix search_path
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Replace FOR ALL on reward_rules with explicit per-command admin policies
DROP POLICY IF EXISTS rr_admin_all ON public.reward_rules;

CREATE POLICY rr_admin_insert ON public.reward_rules
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY rr_admin_update ON public.reward_rules
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY rr_admin_delete ON public.reward_rules
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));