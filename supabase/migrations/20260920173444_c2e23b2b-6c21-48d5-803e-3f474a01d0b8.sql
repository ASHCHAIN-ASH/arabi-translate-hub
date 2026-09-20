INSERT INTO public.internal_tokens(name, token)
VALUES ('admin_whatsapp_numbers', '966555812567,966593799355')
ON CONFLICT (name) DO UPDATE SET token = EXCLUDED.token;

CREATE OR REPLACE FUNCTION public.notify_admin_wa(_event text, _title text, _message text, _url text, _entity_type text DEFAULT NULL, _entity_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_token text;
BEGIN
  SELECT token INTO v_token FROM public.internal_tokens WHERE name = 'ticket_notify';
  BEGIN
    PERFORM net.http_post(
      url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/admin-notify',
      headers := jsonb_build_object('Content-Type','application/json','x-internal-token', COALESCE(v_token,'')),
      body := jsonb_build_object('event',_event,'title',_title,'message',_message,'url',_url,
                                 'entity_type',_entity_type,'entity_id',_entity_id)
    );
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END;
$function$;

REVOKE ALL ON FUNCTION public.notify_admin_wa(text,text,text,text,text,uuid) FROM PUBLIC, anon, authenticated;

-- الطلبات
CREATE OR REPLACE FUNCTION public.admin_wa_orders()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_admin_wa('order_created','📦 طلب جديد',
      'رقم التتبع: ' || COALESCE(NEW.tracking_id,'-') || E'\n' ||
      'العميل: ' || COALESCE(NEW.client_name,'-') || E'\n' ||
      'الجوال: ' || COALESCE(NEW.client_phone,'-') || E'\n' ||
      'الخدمة: ' || COALESCE(NEW.service_type,'-') || E'\n' ||
      'العنوان: ' || COALESCE(NEW.title,'-'),
      'https://fekrahedu.com/adminfekrah/orders','order',NEW.id);
  ELSIF NEW.current_status IS DISTINCT FROM OLD.current_status THEN
    PERFORM public.notify_admin_wa('order_status','🔄 تحديث حالة طلب',
      'رقم التتبع: ' || COALESCE(NEW.tracking_id,'-') || E'\n' ||
      'الحالة: ' || COALESCE(OLD.current_status,'-') || ' ← ' || COALESCE(NEW.current_status,'-'),
      'https://fekrahedu.com/adminfekrah/orders','order',NEW.id);
  END IF;
  RETURN NEW;
END;$function$;

DROP TRIGGER IF EXISTS trg_admin_wa_orders_ins ON public.orders;
DROP TRIGGER IF EXISTS trg_admin_wa_orders_upd ON public.orders;
CREATE TRIGGER trg_admin_wa_orders_ins AFTER INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.admin_wa_orders();
CREATE TRIGGER trg_admin_wa_orders_upd AFTER UPDATE OF current_status ON public.orders FOR EACH ROW EXECUTE FUNCTION public.admin_wa_orders();

-- طلبات الخدمات
CREATE OR REPLACE FUNCTION public.admin_wa_service_orders()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_admin_wa('service_order_created','🧾 طلب خدمة جديد',
      'رقم التتبع: ' || COALESCE(NEW.tracking_id,'-') || E'\n' ||
      'الخدمة: ' || COALESCE(NEW.service_name,'-') || E'\n' ||
      'المبلغ: ' || COALESCE(NEW.total_amount,0)::text || ' ر.س' || E'\n' ||
      'الأولوية: ' || COALESCE(NEW.priority,'-'),
      'https://fekrahedu.com/adminfekrah/service-orders','service_order',NEW.id);
  ELSIF NEW.current_status IS DISTINCT FROM OLD.current_status
     OR NEW.lifecycle_status IS DISTINCT FROM OLD.lifecycle_status THEN
    PERFORM public.notify_admin_wa('service_order_status','🔄 تحديث حالة طلب خدمة',
      'رقم التتبع: ' || COALESCE(NEW.tracking_id,'-') || E'\n' ||
      'الخدمة: ' || COALESCE(NEW.service_name,'-') || E'\n' ||
      'الحالة: ' || COALESCE(OLD.current_status,'-') || ' ← ' || COALESCE(NEW.current_status,'-') || E'\n' ||
      'المرحلة: ' || COALESCE(OLD.lifecycle_status::text,'-') || ' ← ' || COALESCE(NEW.lifecycle_status::text,'-'),
      'https://fekrahedu.com/adminfekrah/service-orders','service_order',NEW.id);
  END IF;
  RETURN NEW;
END;$function$;

DROP TRIGGER IF EXISTS trg_admin_wa_sorders_ins ON public.service_orders;
DROP TRIGGER IF EXISTS trg_admin_wa_sorders_upd ON public.service_orders;
CREATE TRIGGER trg_admin_wa_sorders_ins AFTER INSERT ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.admin_wa_service_orders();
CREATE TRIGGER trg_admin_wa_sorders_upd AFTER UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION public.admin_wa_service_orders();

-- التذاكر
CREATE OR REPLACE FUNCTION public.admin_wa_tickets()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_admin_wa('ticket_created','🎫 تذكرة دعم جديدة',
      'رقم التذكرة: ' || COALESCE(NEW.ticket_number,'-') || E'\n' ||
      'الموضوع: ' || COALESCE(NEW.subject,'-') || E'\n' ||
      'الأولوية: ' || COALESCE(NEW.priority,'-'),
      'https://fekrahedu.com/adminfekrah/tickets/' || NEW.id,'ticket',NEW.id);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.notify_admin_wa('ticket_status','🔄 تحديث حالة تذكرة',
      'رقم التذكرة: ' || COALESCE(NEW.ticket_number,'-') || E'\n' ||
      'الحالة: ' || COALESCE(OLD.status,'-') || ' ← ' || COALESCE(NEW.status,'-'),
      'https://fekrahedu.com/adminfekrah/tickets/' || NEW.id,'ticket',NEW.id);
  END IF;
  RETURN NEW;
END;$function$;

DROP TRIGGER IF EXISTS trg_admin_wa_tickets_ins ON public.tickets;
DROP TRIGGER IF EXISTS trg_admin_wa_tickets_upd ON public.tickets;
CREATE TRIGGER trg_admin_wa_tickets_ins AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.admin_wa_tickets();
CREATE TRIGGER trg_admin_wa_tickets_upd AFTER UPDATE OF status ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.admin_wa_tickets();

-- شحن المحفظة
CREATE OR REPLACE FUNCTION public.admin_wa_topups()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_admin_wa('topup_created','💰 طلب إضافة مبلغ جديد',
      'المبلغ: ' || COALESCE(NEW.amount,0)::text || ' ر.س' || E'\n' ||
      'طريقة الدفع: ' || COALESCE(NEW.payment_method,'-') || E'\n' ||
      'المرجع: ' || COALESCE(NEW.reference_number,'-') || E'\n' ||
      'الحالة: ' || COALESCE(NEW.status,'-'),
      'https://fekrahedu.com/adminfekrah/wallet','wallet_topup',NEW.id);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.notify_admin_wa('topup_status','🔄 تحديث طلب إضافة مبلغ',
      'المبلغ: ' || COALESCE(NEW.amount,0)::text || ' ر.س' || E'\n' ||
      'الحالة: ' || COALESCE(OLD.status,'-') || ' ← ' || COALESCE(NEW.status,'-'),
      'https://fekrahedu.com/adminfekrah/wallet','wallet_topup',NEW.id);
  END IF;
  RETURN NEW;
END;$function$;

DROP TRIGGER IF EXISTS trg_admin_wa_topups_ins ON public.wallet_topup_requests;
DROP TRIGGER IF EXISTS trg_admin_wa_topups_upd ON public.wallet_topup_requests;
CREATE TRIGGER trg_admin_wa_topups_ins AFTER INSERT ON public.wallet_topup_requests FOR EACH ROW EXECUTE FUNCTION public.admin_wa_topups();
CREATE TRIGGER trg_admin_wa_topups_upd AFTER UPDATE OF status ON public.wallet_topup_requests FOR EACH ROW EXECUTE FUNCTION public.admin_wa_topups();

-- الدفع الإلكتروني
CREATE OR REPLACE FUNCTION public.admin_wa_payments()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status IN ('succeeded','paid','failed') THEN
    PERFORM public.notify_admin_wa('payment_' || NEW.status,
      CASE WHEN NEW.status = 'failed' THEN '⚠️ عملية دفع فاشلة' ELSE '✅ عملية دفع ناجحة' END,
      'المبلغ: ' || COALESCE(NEW.amount,0)::text || ' ' || COALESCE(NEW.currency,'SAR') || E'\n' ||
      'الغرض: ' || COALESCE(NEW.purpose,'-') || E'\n' ||
      'رقم العملية: ' || COALESCE(NEW.internal_order_number, NEW.external_transaction_no, '-'),
      'https://fekrahedu.com/adminfekrah/payments','payment_intent',NEW.id);
  END IF;
  RETURN NEW;
END;$function$;

DROP TRIGGER IF EXISTS trg_admin_wa_payments ON public.payment_intents;
CREATE TRIGGER trg_admin_wa_payments AFTER UPDATE OF status ON public.payment_intents FOR EACH ROW EXECUTE FUNCTION public.admin_wa_payments();

-- الفواتير
CREATE OR REPLACE FUNCTION public.admin_wa_invoices()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_admin_wa('invoice_created','🧾 فاتورة جديدة',
      'رقم الفاتورة: ' || COALESCE(NEW.invoice_number,'-') || E'\n' ||
      'العميل: ' || COALESCE(NEW.customer_name,'-') || E'\n' ||
      'الإجمالي: ' || COALESCE(NEW.total_amount,0)::text || ' ر.س',
      'https://fekrahedu.com/adminfekrah/invoices','invoice',NEW.id);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.notify_admin_wa('invoice_status','🔄 تحديث حالة فاتورة',
      'رقم الفاتورة: ' || COALESCE(NEW.invoice_number,'-') || E'\n' ||
      'الحالة: ' || COALESCE(OLD.status,'-') || ' ← ' || COALESCE(NEW.status,'-') || E'\n' ||
      'المدفوع: ' || COALESCE(NEW.paid_amount,0)::text || ' من ' || COALESCE(NEW.total_amount,0)::text || ' ر.س',
      'https://fekrahedu.com/adminfekrah/invoices','invoice',NEW.id);
  END IF;
  RETURN NEW;
END;$function$;

DROP TRIGGER IF EXISTS trg_admin_wa_invoices_ins ON public.invoices;
DROP TRIGGER IF EXISTS trg_admin_wa_invoices_upd ON public.invoices;
CREATE TRIGGER trg_admin_wa_invoices_ins AFTER INSERT ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.admin_wa_invoices();
CREATE TRIGGER trg_admin_wa_invoices_upd AFTER UPDATE OF status ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.admin_wa_invoices();

-- التمويل
CREATE OR REPLACE FUNCTION public.admin_wa_financing()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_admin_wa('financing_created','🏦 طلب تمويل جديد',
      'مقدم الطلب: ' || COALESCE(NEW.applicant_full_name,'-') || E'\n' ||
      'الجوال: ' || COALESCE(NEW.applicant_phone,'-') || E'\n' ||
      'المبلغ: ' || COALESCE(NEW.total_amount,0)::text || ' ر.س' || E'\n' ||
      'المدة: ' || COALESCE(NEW.duration_months,0)::text || ' شهر',
      'https://fekrahedu.com/adminfekrah/financing','financing',NEW.id);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.notify_admin_wa('financing_status','🔄 تحديث حالة طلب تمويل',
      'مقدم الطلب: ' || COALESCE(NEW.applicant_full_name,'-') || E'\n' ||
      'الحالة: ' || COALESCE(OLD.status::text,'-') || ' ← ' || COALESCE(NEW.status::text,'-'),
      'https://fekrahedu.com/adminfekrah/financing','financing',NEW.id);
  END IF;
  RETURN NEW;
END;$function$;

DROP TRIGGER IF EXISTS trg_admin_wa_financing_ins ON public.financing_applications;
DROP TRIGGER IF EXISTS trg_admin_wa_financing_upd ON public.financing_applications;
CREATE TRIGGER trg_admin_wa_financing_ins AFTER INSERT ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION public.admin_wa_financing();
CREATE TRIGGER trg_admin_wa_financing_upd AFTER UPDATE OF status ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION public.admin_wa_financing();

-- طلبات السحب
CREATE OR REPLACE FUNCTION public.admin_wa_withdrawals()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.notify_admin_wa('withdrawal_created','💸 طلب سحب رصيد جديد',
      'المبلغ: ' || COALESCE(NEW.amount,0)::text || ' ر.س' || E'\n' ||
      'الحالة: ' || COALESCE(NEW.status::text,'-'),
      'https://fekrahedu.com/adminfekrah/referrals','withdrawal',NEW.id);
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    PERFORM public.notify_admin_wa('withdrawal_status','🔄 تحديث طلب سحب رصيد',
      'المبلغ: ' || COALESCE(NEW.amount,0)::text || ' ر.س' || E'\n' ||
      'الحالة: ' || COALESCE(OLD.status::text,'-') || ' ← ' || COALESCE(NEW.status::text,'-'),
      'https://fekrahedu.com/adminfekrah/referrals','withdrawal',NEW.id);
  END IF;
  RETURN NEW;
END;$function$;

DROP TRIGGER IF EXISTS trg_admin_wa_withdrawals_ins ON public.withdrawal_requests;
DROP TRIGGER IF EXISTS trg_admin_wa_withdrawals_upd ON public.withdrawal_requests;
CREATE TRIGGER trg_admin_wa_withdrawals_ins AFTER INSERT ON public.withdrawal_requests FOR EACH ROW EXECUTE FUNCTION public.admin_wa_withdrawals();
CREATE TRIGGER trg_admin_wa_withdrawals_upd AFTER UPDATE OF status ON public.withdrawal_requests FOR EACH ROW EXECUTE FUNCTION public.admin_wa_withdrawals();

REVOKE ALL ON FUNCTION public.admin_wa_orders() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_wa_service_orders() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_wa_tickets() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_wa_topups() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_wa_payments() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_wa_invoices() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_wa_financing() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.admin_wa_withdrawals() FROM PUBLIC, anon, authenticated;