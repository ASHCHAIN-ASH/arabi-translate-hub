-- إنشاء المستخدم الإداري في نظام Supabase Auth
-- أولاً: إنشاء المستخدم في auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@fekrahedu.com',
    crypt('Ali@@#@@1409', gen_salt('bf')),
    now(),
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"مدير النظام"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- ثانياً: إنشاء ملف تعريفي في user_profiles
INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role
)
SELECT 
    id,
    email,
    'مدير النظام',
    'admin'
FROM auth.users 
WHERE email = 'admin@fekrahedu.com'
ON CONFLICT (id) DO UPDATE SET
    full_name = 'مدير النظام',
    role = 'admin',
    updated_at = now();