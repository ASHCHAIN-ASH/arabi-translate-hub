-- تفعيل الـ realtime للجدول customers
ALTER TABLE public.customers REPLICA IDENTITY FULL;

-- إضافة الجدول إلى publication للـ realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;

-- ترحيل المستخدمين الموجودين من auth.users إلى customers
INSERT INTO public.customers (
    user_id,
    full_name,
    email,
    phone,
    email_verified,
    created_at,
    updated_at
)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email) as full_name,
    u.email,
    u.raw_user_meta_data->>'phone' as phone,
    u.email_confirmed_at IS NOT NULL as email_verified,
    u.created_at,
    u.updated_at
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.customers c WHERE c.user_id = u.id
);

-- تحديث الـ hook للتأكد من وجود الاشتراك اللحظي الصحيح
-- تأكيد أن الـ trigger يعمل بشكل صحيح