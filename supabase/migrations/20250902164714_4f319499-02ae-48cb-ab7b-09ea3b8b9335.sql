-- تفعيل الاشتراكات اللحظية لجدول المستخدمين
ALTER TABLE public.users REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;