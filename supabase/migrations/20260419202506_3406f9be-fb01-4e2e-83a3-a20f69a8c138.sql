CREATE OR REPLACE FUNCTION public.guard_client_lifecycle_edits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- اسمح بالتحديثات الداخلية القادمة من triggers متداخلة
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  IF auth.uid() IS NULL OR has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.lifecycle_status IS DISTINCT FROM OLD.lifecycle_status THEN
    RAISE EXCEPTION 'لا يمكن تعديل مرحلة الطلب مباشرة';
  END IF;

  IF NEW.total_amount IS DISTINCT FROM OLD.total_amount
     OR NEW.signed_contract_id IS DISTINCT FROM OLD.signed_contract_id
     OR NEW.active_invoice_id IS DISTINCT FROM OLD.active_invoice_id
     OR NEW.paid_amount IS DISTINCT FROM OLD.paid_amount THEN
    RAISE EXCEPTION 'لا يمكن تعديل بيانات الدفع/العقد';
  END IF;

  RETURN NEW;
END;
$$;