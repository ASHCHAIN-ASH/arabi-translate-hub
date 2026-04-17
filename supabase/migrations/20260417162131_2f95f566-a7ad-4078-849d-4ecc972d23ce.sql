ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_topup_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_transactions;
ALTER TABLE public.wallets REPLICA IDENTITY FULL;
ALTER TABLE public.wallet_topup_requests REPLICA IDENTITY FULL;
ALTER TABLE public.wallet_transactions REPLICA IDENTITY FULL;