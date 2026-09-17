-- إنشاء مستخدم إداري جديد بطريقة مبسطة
-- إدراج المستخدم مباشرة في user_profiles مع دور admin
INSERT INTO public.user_profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'admin@fekrahedu.com',
    'مدير النظام',
    'admin',
    now(),
    now()
);

-- إنشاء سجل المستخدم في جدول admin_users
INSERT INTO public.admin_users (
    id,
    name,
    email,
    password_hash,
    role,
    is_active,
    created_at,
    updated_at,
    password_salt
) VALUES (
    gen_random_uuid(),
    'مدير النظام',
    'admin@fekrahedu.com',
    crypt('Ali@@#@@1409', gen_salt('bf')),
    'admin'::user_role,
    true,
    now(),
    now(),
    gen_salt('bf')
);