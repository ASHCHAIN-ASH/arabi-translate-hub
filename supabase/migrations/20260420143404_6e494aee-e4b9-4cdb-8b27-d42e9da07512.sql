-- Ensure receipt sequence exists (was being created lazily inside a function which fails in trigger chains)
CREATE SEQUENCE IF NOT EXISTS public.receipt_no_seq START 1;
GRANT USAGE ON SEQUENCE public.receipt_no_seq TO postgres, authenticated, service_role;

-- Also harden generate_receipt_number to not require runtime sequence creation
CREATE OR REPLACE FUNCTION public.generate_receipt_number()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  seq_val BIGINT;
BEGIN
  SELECT nextval('public.receipt_no_seq') INTO seq_val;
  RETURN 'RCP-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(seq_val::TEXT, 6, '0');
END;
$function$;