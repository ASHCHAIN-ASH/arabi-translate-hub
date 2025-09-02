-- حل نهائي: إزالة التريغر المشكل وإنشاء واحد بسيط وآمن
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- إنشاء دالة بسيطة جداً بدون مراجع معقدة
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- محاولة إدراج البيانات الأساسية فقط
  BEGIN
    INSERT INTO public.users (id, email, name, phone, role, status, password_hash)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
      'active',
      'auth_user'
    )
    ON CONFLICT (id) DO UPDATE SET
      name = COALESCE(NEW.raw_user_meta_data->>'full_name', users.name),
      phone = COALESCE(NEW.raw_user_meta_data->>'phone', users.phone);
    
  EXCEPTION WHEN OTHERS THEN
    -- إذا فشل أي شيء، لا تفشل عملية التسجيل
    NULL;
  END;
  
  RETURN NEW;
END;
$$;

-- إنشاء تريغر جديد بسيط
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();