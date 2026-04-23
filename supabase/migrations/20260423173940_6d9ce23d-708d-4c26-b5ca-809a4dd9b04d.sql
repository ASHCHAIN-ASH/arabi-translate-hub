CREATE OR REPLACE FUNCTION public.prevent_financing_ack_modify()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RAISE EXCEPTION 'financing_acknowledgments are immutable once signed';
END;
$$;