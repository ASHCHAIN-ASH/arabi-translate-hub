-- Update admin email to admin@fekrahedu.com
UPDATE public.admin_credentials 
SET email = 'admin@fekrahedu.com'
WHERE role = 'admin' AND is_active = true;

-- Ensure we have the correct admin user
INSERT INTO public.admin_credentials (
    id,
    email, 
    password_hash, 
    full_name, 
    role, 
    is_active
) VALUES (
    gen_random_uuid(),
    'admin@fekrahedu.com',
    '$2a$06$Ymdta.TsNIzaoB2c6/WFLeSxLaWOaWhWnCnGDKJxGoKmQ0v54vHE2',
    'مدير النظام',
    'admin',
    true
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active;