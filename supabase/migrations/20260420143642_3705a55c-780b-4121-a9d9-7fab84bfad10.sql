CREATE OR REPLACE FUNCTION public.sign_wallet_transaction()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  payload TEXT;
BEGIN
  IF NEW.receipt_number IS NULL THEN
    NEW.receipt_number := public.generate_receipt_number();
  END IF;

  IF NEW.signed_at IS NULL THEN
    NEW.signed_at := now();
  END IF;

  payload := concat_ws('|',
    NEW.id::TEXT,
    NEW.user_id::TEXT,
    NEW.wallet_id::TEXT,
    NEW.type,
    NEW.amount::TEXT,
    COALESCE(NEW.balance_before::TEXT, ''),
    NEW.balance_after::TEXT,
    COALESCE(NEW.fee_amount::TEXT, '0'),
    COALESCE(NEW.vat_amount::TEXT, '0'),
    NEW.currency,
    COALESCE(NEW.gateway_ref, ''),
    COALESCE(NEW.payment_method, ''),
    NEW.signed_at::TEXT
  );

  NEW.signature_hash := encode(extensions.digest(payload, 'sha256'), 'hex');
  RETURN NEW;
END;
$function$;