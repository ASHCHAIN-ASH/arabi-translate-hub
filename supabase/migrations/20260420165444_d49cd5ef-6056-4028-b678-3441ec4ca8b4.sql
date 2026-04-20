-- Enable pg_net for async HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Helper function: dispatch a document send via auto-dispatch-document edge function
CREATE OR REPLACE FUNCTION public.dispatch_document_send(
  _kind text,
  _id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _url text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/auto-dispatch-document';
  _anon text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
  _body jsonb;
BEGIN
  IF _kind = 'contract' THEN
    _body := jsonb_build_object('kind', 'contract', 'contract_id', _id);
  ELSIF _kind = 'invoice' THEN
    _body := jsonb_build_object('kind', 'invoice', 'invoice_id', _id);
  ELSE
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := _url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || _anon
    ),
    body := _body
  );
EXCEPTION WHEN OTHERS THEN
  -- Never fail the parent transaction
  RAISE WARNING 'dispatch_document_send failed: %', SQLERRM;
END;
$$;

-- Trigger function for contracts: fire when status becomes 'signed'
CREATE OR REPLACE FUNCTION public.trg_auto_send_signed_contract()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'signed'
     AND (TG_OP = 'INSERT' OR COALESCE(OLD.status, '') <> 'signed')
     AND COALESCE(NEW.client_phone, '') <> '' THEN
    PERFORM public.dispatch_document_send('contract', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS contracts_auto_send_pdf ON public.contracts;
CREATE TRIGGER contracts_auto_send_pdf
AFTER INSERT OR UPDATE OF status ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.trg_auto_send_signed_contract();

-- Trigger function for invoices: fire when status becomes 'paid'
CREATE OR REPLACE FUNCTION public.trg_auto_send_paid_invoice()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid'
     AND (TG_OP = 'INSERT' OR COALESCE(OLD.status, '') <> 'paid')
     AND COALESCE(NEW.customer_phone, '') <> '' THEN
    PERFORM public.dispatch_document_send('invoice', NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS invoices_auto_send_pdf ON public.invoices;
CREATE TRIGGER invoices_auto_send_pdf
AFTER INSERT OR UPDATE OF status ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.trg_auto_send_paid_invoice();