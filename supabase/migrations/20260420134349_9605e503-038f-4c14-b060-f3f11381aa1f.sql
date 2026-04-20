-- Security fix: remove sensitive PII tables from realtime publication
-- to prevent any authenticated user from subscribing and receiving PII
ALTER PUBLICATION supabase_realtime DROP TABLE public.inbox_messages;
ALTER PUBLICATION supabase_realtime DROP TABLE public.inbox_replies;