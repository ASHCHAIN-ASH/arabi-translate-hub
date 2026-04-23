
-- Fix search_path on the two functions we just created
CREATE OR REPLACE FUNCTION public.log_financing_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.financing_status_logs(application_id, old_status, new_status, changed_by)
    VALUES (NEW.id, NULL, NEW.status, auth.uid());
  ELSIF (NEW.status IS DISTINCT FROM OLD.status) THEN
    INSERT INTO public.financing_status_logs(application_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calc_financing_amounts()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.down_payment IS NULL OR NEW.down_payment = 0 THEN
    NEW.down_payment := ROUND(NEW.total_amount * 0.20, 2);
  END IF;
  NEW.remaining_amount := NEW.total_amount - NEW.down_payment;
  IF NEW.duration_months > 0 THEN
    NEW.monthly_installment := ROUND(NEW.remaining_amount / NEW.duration_months, 2);
  END IF;
  RETURN NEW;
END;
$$;

-- Tighten whatsapp logs insert policy: only admins can insert via client
DROP POLICY IF EXISTS "System inserts whatsapp logs" ON public.financing_whatsapp_logs;
CREATE POLICY "Admins insert whatsapp logs" ON public.financing_whatsapp_logs
  FOR INSERT WITH CHECK (public.is_financing_admin(auth.uid()));
