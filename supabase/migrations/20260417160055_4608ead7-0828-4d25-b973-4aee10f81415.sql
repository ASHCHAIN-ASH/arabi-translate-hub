ALTER FUNCTION public.create_wallet_for_new_profile() SET search_path = public;
ALTER FUNCTION public.apply_wallet_transaction() SET search_path = public;
ALTER FUNCTION public.handle_topup_approved() SET search_path = public;
ALTER FUNCTION public.notify_admins_topup_request() SET search_path = public;
ALTER FUNCTION public.deduct_wallet_on_invoice_payment() SET search_path = public;