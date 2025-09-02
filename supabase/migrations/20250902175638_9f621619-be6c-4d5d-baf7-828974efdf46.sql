-- 1. إدراج المستخدمين الموجودين في auth.users إلى public.users
INSERT INTO public.users (id, email, name, phone, role, status, password_hash)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  COALESCE(au.raw_user_meta_data->>'phone', ''),
  CASE WHEN au.raw_user_meta_data->>'is_admin' = 'true' THEN 'admin' ELSE 'client' END,
  'active',
  'auth_user'
FROM auth.users au
WHERE au.deleted_at IS NULL
  AND NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role;

-- 2. إعادة إنشاء التريغر بشكل صحيح
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. دالة تريغر محدثة وآمنة
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- تحديد الدور بناء على metadata
  user_role := CASE 
    WHEN NEW.raw_user_meta_data->>'is_admin' = 'true' THEN 'admin'
    ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  END;

  -- إدراج البيانات
  INSERT INTO public.users (id, email, name, phone, role, status, password_hash)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    user_role,
    'active',
    'auth_user'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- في حالة أي خطأ، لا تفشل عملية التسجيل
  RETURN NEW;
END;
$$;

-- 4. إنشاء التريغر
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 5. تحديث RLS للمديرين
DROP POLICY IF EXISTS "admin_can_see_all_users" ON public.users;
CREATE POLICY "admin_can_see_all_users"
ON public.users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users admin_user 
    WHERE admin_user.id = auth.uid() 
    AND admin_user.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users admin_user 
    WHERE admin_user.id = auth.uid() 
    AND admin_user.role = 'admin'
  )
);