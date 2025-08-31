-- إنشاء مستخدم إداري بطريقة أبسط
-- استخدام معرف ثابت للمستخدم الإداري
DO $$
DECLARE
    admin_user_id UUID := '550e8400-e29b-41d4-a716-446655440000';
BEGIN
    -- إدراج المستخدم في auth.users
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
        admin_user_id,
        '00000000-0000-0000-0000-000000000000',
        'admin@masteredupath.com',
        crypt('Ali@@#@@1409', gen_salt('bf')),
        now(),
        now(),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Admin User", "is_admin": true, "role": "admin"}',
        false,
        'authenticated'
    );

    -- إنشاء ملف تعريفي للمستخدم
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        role,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'admin@masteredupath.com',
        'مدير النظام',
        'admin',
        now(),
        now()
    );

    -- إعطاء دور المدير للمستخدم
    INSERT INTO public.user_roles (
        user_id,
        role
    ) VALUES (
        admin_user_id,
        'admin'::app_role
    );

    -- إنشاء سجل في جدول admin_users
    INSERT INTO public.admin_users (
        id,
        name,
        email,
        password_hash,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'مدير النظام',
        'admin@masteredupath.com',
        crypt('Ali@@#@@1409', gen_salt('bf')),
        'admin'::user_role,
        true,
        now(),
        now()
    );

EXCEPTION 
    WHEN unique_violation THEN
        -- إذا كان المستخدم موجود، نقوم بتحديث كلمة المرور فقط
        UPDATE auth.users 
        SET encrypted_password = crypt('Ali@@#@@1409', gen_salt('bf')),
            updated_at = now()
        WHERE email = 'admin@masteredupath.com';
        
        UPDATE public.admin_users 
        SET password_hash = crypt('Ali@@#@@1409', gen_salt('bf')),
            updated_at = now()
        WHERE email = 'admin@masteredupath.com';
END $$;