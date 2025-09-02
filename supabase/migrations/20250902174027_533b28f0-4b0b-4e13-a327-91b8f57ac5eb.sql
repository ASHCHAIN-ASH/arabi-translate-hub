-- 1) إصلاح التريغر ليكون آمنًا ولا يُسقط عملية التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
  -- أدخل صفًا مترابطًا مع auth.users.id (استخدام العمود الصحيح id)
  INSERT INTO public.users (id, name, phone, email, role, status, password_hash)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    'active',
    'auth_user'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'full_name', users.name),
    phone = COALESCE(NEW.raw_user_meta_data->>'phone', users.phone),
    role = COALESCE(NEW.raw_user_meta_data->>'role', users.role);
  
  RETURN NEW;

EXCEPTION WHEN OTHERS THEN
  -- لا تُفشل التسجيل لو حدث خطأ في الإدراج (RLS/قيود/الخ...)
  -- فقط سجل الخطأ ولكن اتركه يمر
  RAISE WARNING 'Failed to insert user profile: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- أعِد إنشاء التريغر بأمان
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2) سياسات RLS الموصى بها على جدول public.users
-- فعّل RLS إن لم يكن
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- اسمح للمالك فقط بالقراءة (استخدام العمود الصحيح id)
DROP POLICY IF EXISTS users_select_own_row ON public.users;
CREATE POLICY users_select_own_row
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- اسمح للمالك فقط بالتحديث
DROP POLICY IF EXISTS users_update_own_row ON public.users;
CREATE POLICY users_update_own_row
ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- اسمح بالإدخال عندما يطابق id هوية الجلسة
DROP POLICY IF EXISTS users_insert_self ON public.users;
CREATE POLICY users_insert_self
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- حذف السياسات القديمة المتضاربة
DROP POLICY IF EXISTS "users_insert_registration" ON public.users;