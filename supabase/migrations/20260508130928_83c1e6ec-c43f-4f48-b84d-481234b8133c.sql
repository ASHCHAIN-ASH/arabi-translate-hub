-- إزالة كل ما يتعلق بقسم الطالب من قاعدة البيانات (جداول/سياسات/دوال/Triggers)

-- 1) حذف Triggers على auth.users التي ينشئها مشروعنا
DROP TRIGGER IF EXISTS on_auth_user_created_student ON auth.users;
DROP TRIGGER IF EXISTS trg_create_student_profile ON auth.users;

-- 2) حذف الجداول (CASCADE يتكفل بالسياسات والـ triggers الخاصة بكل جدول)
DROP TABLE IF EXISTS public.student_wallet_transactions CASCADE;
DROP TABLE IF EXISTS public.student_wallets CASCADE;
DROP TABLE IF EXISTS public.student_activity_logs CASCADE;
DROP TABLE IF EXISTS public.student_notifications_log CASCADE;
DROP TABLE IF EXISTS public.student_day_state CASCADE;
DROP TABLE IF EXISTS public.student_tasks CASCADE;
DROP TABLE IF EXISTS public.student_events CASCADE;
DROP TABLE IF EXISTS public.student_profiles CASCADE;

-- 3) حذف الدوال (Functions) المرتبطة بالطالب
DROP FUNCTION IF EXISTS public.handle_new_student_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_student_profile() CASCADE;
DROP FUNCTION IF EXISTS public.trg_student_task_done() CASCADE;
DROP FUNCTION IF EXISTS public.on_student_task_done_viral_referral() CASCADE;
DROP FUNCTION IF EXISTS public.notify_student_whatsapp() CASCADE;