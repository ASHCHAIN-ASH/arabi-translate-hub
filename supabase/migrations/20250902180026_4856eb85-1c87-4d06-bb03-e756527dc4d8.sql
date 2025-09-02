-- تصحيح دور المستخدم ali6c201@gmail.com من admin إلى client
UPDATE public.users 
SET role = 'client', updated_at = NOW()
WHERE email = 'ali6c201@gmail.com';