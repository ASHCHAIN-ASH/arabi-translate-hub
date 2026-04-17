
-- Add customer_code column
ALTER TABLE public.customers
ADD COLUMN IF NOT EXISTS customer_code TEXT UNIQUE;

-- Function to generate a unique random 8-digit code
CREATE OR REPLACE FUNCTION public.generate_customer_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  exists_count INT;
BEGIN
  LOOP
    new_code := lpad(floor(random() * 90000000 + 10000000)::text, 8, '0');
    SELECT count(*) INTO exists_count FROM public.customers WHERE customer_code = new_code;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Trigger to auto-fill on insert
CREATE OR REPLACE FUNCTION public.set_customer_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.customer_code IS NULL OR NEW.customer_code = '' THEN
    NEW.customer_code := public.generate_customer_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_customer_code ON public.customers;
CREATE TRIGGER trg_set_customer_code
BEFORE INSERT ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_customer_code();

-- Backfill existing customers
UPDATE public.customers
SET customer_code = public.generate_customer_code()
WHERE customer_code IS NULL;
