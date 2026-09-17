-- إنشاء المستخدم الإداري بطريقة مبسطة
-- التحقق من عدم وجود المستخدم مسبقاً
DO $$
DECLARE 
    admin_user_id UUID;
BEGIN
    -- البحث عن المستخدم الموجود
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@fekrahedu.com';
    
    -- إذا لم يكن موجوداً، إنشاؤه
    IF admin_user_id IS NULL THEN
        admin_user_id := gen_random_uuid();
        
        -- إدراج في auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            admin_user_id,
            'authenticated',
            'authenticated',
            'admin@fekrahedu.com',
            crypt('Ali@@#@@1409', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"مدير النظام"}',
            now(),
            now()
        );
        
        -- إدراج في user_profiles
        INSERT INTO public.user_profiles (
            id,
            email,
            full_name,
            role
        ) VALUES (
            admin_user_id,
            'admin@fekrahedu.com',
            'مدير النظام',
            'admin'
        );
        
        RAISE NOTICE 'تم إنشاء المستخدم الإداري بنجاح';
    ELSE
        -- تحديث البيانات إذا كان موجوداً
        UPDATE auth.users 
        SET encrypted_password = crypt('Ali@@#@@1409', gen_salt('bf')),
            updated_at = now()
        WHERE id = admin_user_id;
        
        -- التأكد من وجود الملف التعريفي
        INSERT INTO public.user_profiles (
            id,
            email,
            full_name,
            role
        ) VALUES (
            admin_user_id,
            'admin@fekrahedu.com',
            'مدير النظام',
            'admin'
        );
        
        RAISE NOTICE 'تم تحديث بيانات المستخدم الإداري';
    END IF;
END $$;