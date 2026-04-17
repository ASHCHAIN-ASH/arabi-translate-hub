
-- Trigger function to auto-create customer record when profile is created
CREATE OR REPLACE FUNCTION public.create_customer_for_new_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
  v_phone text;
BEGIN
  SELECT email, raw_user_meta_data->>'phone'
    INTO v_email, v_phone
  FROM auth.users WHERE id = NEW.id;

  INSERT INTO public.customers (user_id, name, email, phone, status)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.full_name, ''), split_part(COALESCE(v_email,''), '@', 1), 'عميل'),
    v_email,
    COALESCE(NEW.phone, v_phone),
    'active'
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_create_customer_for_new_profile ON public.profiles;
CREATE TRIGGER trg_create_customer_for_new_profile
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.create_customer_for_new_profile();

-- Backfill existing profiles into customers
INSERT INTO public.customers (user_id, name, email, phone, status)
SELECT
  p.id,
  COALESCE(NULLIF(p.full_name, ''), split_part(COALESCE(u.email,''), '@', 1), 'عميل'),
  u.email,
  COALESCE(p.phone, u.raw_user_meta_data->>'phone'),
  'active'
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE NOT EXISTS (SELECT 1 FROM public.customers c WHERE c.user_id = p.id);
