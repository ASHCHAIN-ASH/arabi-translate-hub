
-- Auto-create support ticket for overdue invoices
CREATE OR REPLACE FUNCTION public.auto_ticket_for_overdue_invoice()
RETURNS TRIGGER AS $$
DECLARE
  existing_ticket_id uuid;
BEGIN
  -- Trigger only when invoice transitions to overdue or stays unpaid past due date
  IF NEW.status IN ('overdue', 'unpaid', 'sent') 
     AND NEW.due_date IS NOT NULL 
     AND NEW.due_date < CURRENT_DATE 
     AND NEW.user_id IS NOT NULL
     AND COALESCE(NEW.paid_amount, 0) < COALESCE(NEW.total_amount, 0) THEN
    
    -- Avoid duplicate: check if there's already an open ticket for this invoice
    SELECT id INTO existing_ticket_id
    FROM public.tickets
    WHERE related_invoice_id = NEW.id
      AND status NOT IN ('resolved', 'closed')
    LIMIT 1;
    
    IF existing_ticket_id IS NULL THEN
      INSERT INTO public.tickets (
        user_id, customer_id, subject, description,
        category, priority, status, related_invoice_id,
        auto_created, source
      ) VALUES (
        NEW.user_id, NEW.customer_id,
        'تأخر دفع الفاتورة ' || NEW.invoice_number,
        'تم رصد تأخر في دفع الفاتورة رقم ' || NEW.invoice_number || ' بقيمة ' || COALESCE(NEW.total_amount, 0)::text || ' ' || COALESCE(NEW.currency, 'SAR') || '. يرجى المتابعة.',
        'billing', 'high', 'open', NEW.id,
        true, 'system_auto'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_auto_ticket_overdue_invoice ON public.invoices;
CREATE TRIGGER trg_auto_ticket_overdue_invoice
AFTER INSERT OR UPDATE OF status, due_date, paid_amount ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.auto_ticket_for_overdue_invoice();

-- Auto-create support ticket for unsigned contracts (>3 days after sent)
CREATE OR REPLACE FUNCTION public.auto_ticket_for_unsigned_contract()
RETURNS TRIGGER AS $$
DECLARE
  existing_ticket_id uuid;
BEGIN
  IF NEW.status IN ('sent', 'pending_signature')
     AND NEW.sent_at IS NOT NULL
     AND NEW.sent_at < (now() - interval '3 days')
     AND NEW.signed_at IS NULL
     AND NEW.user_id IS NOT NULL THEN
    
    SELECT id INTO existing_ticket_id
    FROM public.tickets
    WHERE metadata->>'contract_id' = NEW.id::text
      AND status NOT IN ('resolved', 'closed')
    LIMIT 1;
    
    IF existing_ticket_id IS NULL THEN
      INSERT INTO public.tickets (
        user_id, customer_id, subject, description,
        category, priority, status,
        auto_created, source, metadata
      ) VALUES (
        NEW.user_id, NEW.customer_id,
        'تذكير بتوقيع العقد ' || NEW.contract_number,
        'العقد رقم ' || NEW.contract_number || ' (' || NEW.title || ') لم يتم توقيعه منذ أكثر من 3 أيام من الإرسال. هل تحتاج مساعدة؟',
        'general', 'medium', 'open',
        true, 'system_auto',
        jsonb_build_object('contract_id', NEW.id, 'contract_number', NEW.contract_number)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_auto_ticket_unsigned_contract ON public.contracts;
CREATE TRIGGER trg_auto_ticket_unsigned_contract
AFTER UPDATE OF status, sent_at ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.auto_ticket_for_unsigned_contract();
