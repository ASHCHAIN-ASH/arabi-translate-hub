-- إنشاء دالة handle_new_user للجدول الموجود (استخدام عمود id بدلاً من user_id)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- إدراج المستخدم الجديد في جدول public.users عند التسجيل عبر Supabase Auth
  INSERT INTO public.users (id, email, name, phone, role, status, password_hash)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    'active',
    'auth_user' -- placeholder للمستخدمين من Auth
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'full_name', users.name),
    phone = COALESCE(NEW.raw_user_meta_data->>'phone', users.phone),
    role = COALESCE(NEW.raw_user_meta_data->>'role', users.role);
  
  RETURN NEW;
END; $$;

-- إزالة التريغر القديم إن وجد
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- إنشاء تريغر جديد
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();