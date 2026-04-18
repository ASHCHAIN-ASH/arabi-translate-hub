
ALTER FUNCTION public.get_active_membership(uuid) SET search_path = public;
ALTER FUNCTION public.handle_membership_activated() SET search_path = public;
ALTER FUNCTION public.handle_membership_created() SET search_path = public;
