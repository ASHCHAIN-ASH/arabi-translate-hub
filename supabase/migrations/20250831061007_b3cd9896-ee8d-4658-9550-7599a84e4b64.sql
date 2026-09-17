-- إنشاء مستخدم إداري جديد
-- أولاً: إنشاء المستخدم في نظام Supabase Auth
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
) VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'admin@fekrahedu.com',
    crypt('Ali@@#@@1409', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin User", "is_admin": true, "role": "admin"}',
    false,
    'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- ثانياً: إنشاء ملف تعريفي للمستخدم
INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
) 
SELECT 
    id,
    'admin@fekrahedu.com',
    'مدير النظام',
    'admin',
    now(),
    now()
FROM auth.users 
WHERE email = 'admin@fekrahedu.com'
ON CONFLICT (id) DO UPDATE SET
    full_name = 'مدير النظام',
    role = 'admin',
    updated_at = now();

-- ثالثاً: إعطاء دور المدير للمستخدم
INSERT INTO public.user_roles (
    user_id,
    role
)
SELECT 
    id,
    'admin'::app_role
FROM auth.users 
WHERE email = 'admin@fekrahedu.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- رابعاً: إنشاء سجل في جدول admin_users إذا كان موجوداً
INSERT INTO public.admin_users (
    id,
    name,
    email,
    password_hash,
    role,
    is_active,
    created_at,
    updated_at
)
SELECT 
    id,
    'مدير النظام',
    'admin@fekrahedu.com',
    crypt('Ali@@#@@1409', gen_salt('bf')),
    'admin'::user_role,
    true,
    now(),
    now()
FROM auth.users 
WHERE email = 'admin@fekrahedu.com'
ON CONFLICT (email) DO UPDATE SET
    password_hash = crypt('Ali@@#@@1409', gen_salt('bf')),
    role = 'admin'::user_role,
    is_active = true,
    updated_at = now();