
CREATE OR REPLACE FUNCTION public.compute_ticket_sla(_priority text, _created timestamptz)
RETURNS timestamptz LANGUAGE sql IMMUTABLE SET search_path=public AS $fn$
  SELECT _created + CASE _priority
    WHEN 'critical' THEN interval '1 hour'
    WHEN 'high'     THEN interval '4 hours'
    WHEN 'medium'   THEN interval '24 hours'
    WHEN 'low'      THEN interval '72 hours'
    ELSE interval '24 hours'
  END
$fn$;

CREATE OR REPLACE FUNCTION public.on_ticket_before_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
BEGIN
  IF NEW.sla_due_at IS NULL THEN
    NEW.sla_due_at := public.compute_ticket_sla(NEW.priority, COALESCE(NEW.created_at, now()));
  END IF;
  IF NEW.last_message_at IS NULL THEN
    NEW.last_message_at := COALESCE(NEW.created_at, now());
  END IF;
  NEW.unread_for_admin := 1;
  RETURN NEW;
END $fn$;

DROP TRIGGER IF EXISTS trg_ticket_before_insert ON public.tickets;
CREATE TRIGGER trg_ticket_before_insert BEFORE INSERT ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.on_ticket_before_insert();

CREATE OR REPLACE FUNCTION public.on_ticket_after_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
BEGIN
  INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description, metadata)
  VALUES (NEW.id, NEW.user_id, CASE WHEN NEW.auto_created THEN 'system' ELSE 'client' END,
          'created', 'إنشاء التذكرة',
          CASE WHEN NEW.auto_created THEN 'تم إنشاء التذكرة تلقائياً (' || NEW.source || ')' ELSE 'تم إنشاء التذكرة بواسطة العميل' END,
          jsonb_build_object('priority', NEW.priority, 'category', NEW.category));

  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  SELECT ur.user_id, '🎫 تذكرة دعم جديدة',
         'تذكرة جديدة: ' || NEW.subject,
         'support', '/adminmaster/tickets/' || NEW.id::text
  FROM public.user_roles ur WHERE ur.role = 'admin';

  RETURN NEW;
END $fn$;

DROP TRIGGER IF EXISTS trg_ticket_after_insert ON public.tickets;
CREATE TRIGGER trg_ticket_after_insert AFTER INSERT ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.on_ticket_after_insert();

CREATE OR REPLACE FUNCTION public.on_ticket_message_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
DECLARE v_ticket record;
BEGIN
  SELECT * INTO v_ticket FROM public.tickets WHERE id = NEW.ticket_id FOR UPDATE;
  IF v_ticket IS NULL THEN RETURN NEW; END IF;

  IF NEW.sender_type = 'admin' THEN
    UPDATE public.tickets
       SET last_message_at = NEW.created_at,
           first_response_at = COALESCE(first_response_at, NEW.created_at),
           unread_for_client = unread_for_client + 1,
           unread_for_admin = 0,
           status = CASE WHEN status = 'open' THEN 'in_progress' ELSE status END,
           updated_at = now()
     WHERE id = NEW.ticket_id;

    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (v_ticket.user_id, '💬 رد جديد من فريق الدعم',
            'تذكرة #' || v_ticket.ticket_number,
            'support', '/support/tickets/' || v_ticket.id::text);
  ELSE
    UPDATE public.tickets
       SET last_message_at = NEW.created_at,
           unread_for_admin = unread_for_admin + 1,
           unread_for_client = 0,
           updated_at = now()
     WHERE id = NEW.ticket_id;

    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    SELECT ur.user_id, '💬 رد جديد من العميل',
           'تذكرة #' || v_ticket.ticket_number,
           'support', '/adminmaster/tickets/' || v_ticket.id::text
    FROM public.user_roles ur WHERE ur.role = 'admin';
  END IF;

  RETURN NEW;
END $fn$;

DROP TRIGGER IF EXISTS trg_ticket_message_insert ON public.ticket_messages;
CREATE TRIGGER trg_ticket_message_insert AFTER INSERT ON public.ticket_messages
FOR EACH ROW EXECUTE FUNCTION public.on_ticket_message_insert();

CREATE OR REPLACE FUNCTION public.on_ticket_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $fn$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status IN ('resolved','closed') AND NEW.closed_at IS NULL THEN
      NEW.closed_at := now();
      NEW.resolved_at := COALESCE(NEW.resolved_at, now());
    END IF;

    INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description, metadata)
    VALUES (NEW.id, auth.uid(),
            CASE WHEN has_role(auth.uid(),'admin'::app_role) THEN 'admin' ELSE 'client' END,
            'status_change', 'تغيير الحالة',
            'من "' || COALESCE(OLD.status,'-') || '" إلى "' || COALESCE(NEW.status,'-') || '"',
            jsonb_build_object('from', OLD.status, 'to', NEW.status));

    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id,
            CASE NEW.status
              WHEN 'in_progress' THEN '⏳ تذكرتك قيد المعالجة'
              WHEN 'waiting' THEN '⌛ بانتظار ردك'
              WHEN 'resolved' THEN '✅ تم حل تذكرتك'
              WHEN 'closed' THEN '🔒 تم إغلاق التذكرة'
              ELSE 'تحديث على تذكرتك'
            END,
            'تذكرة #' || NEW.ticket_number,
            'support', '/support/tickets/' || NEW.id::text);
  END IF;

  IF NEW.priority IS DISTINCT FROM OLD.priority THEN
    NEW.sla_due_at := public.compute_ticket_sla(NEW.priority, NEW.created_at);
    INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description)
    VALUES (NEW.id, auth.uid(), 'admin', 'priority_change', 'تغيير الأولوية',
            'من "' || COALESCE(OLD.priority,'-') || '" إلى "' || COALESCE(NEW.priority,'-') || '"');
  END IF;

  IF NEW.assigned_admin_id IS DISTINCT FROM OLD.assigned_admin_id THEN
    INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description)
    VALUES (NEW.id, auth.uid(), 'admin', 'assigned', 'تعيين موظف',
            'تم تعيين موظف الدعم على هذه التذكرة');
  END IF;

  RETURN NEW;
END $fn$;

DROP TRIGGER IF EXISTS trg_ticket_update ON public.tickets;
CREATE TRIGGER trg_ticket_update BEFORE UPDATE ON public.tickets
FOR EACH ROW EXECUTE FUNCTION public.on_ticket_update();

INSERT INTO public.ticket_quick_replies (title, content, category, sort_order) VALUES
  ('شكر وترحيب', 'شكراً لتواصلك معنا. سيتم الرد عليك خلال أقرب وقت ممكن.', 'general', 1),
  ('طلب تفاصيل', 'هل يمكنك تزويدنا بمزيد من التفاصيل حول المشكلة؟ مثل لقطة شاشة أو رسالة الخطأ التي تظهر لك.', 'general', 2),
  ('قيد المعالجة', 'تم استلام طلبك وهو الآن قيد المعالجة من قبل الفريق المختص.', 'general', 3),
  ('تأكيد الدفع', 'تم تأكيد دفعتك وتفعيل الخدمة بنجاح. شكراً لثقتك بنا.', 'billing', 4),
  ('استفسار فاتورة', 'يمكنك مراجعة تفاصيل الفاتورة من قسم الفواتير في حسابك. أي استفسار آخر نحن في الخدمة.', 'billing', 5),
  ('تم الحل', 'تم حل المشكلة بنجاح. يرجى تأكيد الاستلام أو إعلامنا في حال وجود أي استفسار آخر.', 'general', 6)
ON CONFLICT DO NOTHING;

INSERT INTO public.support_kb_articles (title, content, category, tags, sort_order) VALUES
  ('كيف أطلب خدمة جديدة؟', 'يمكنك طلب خدمة جديدة من قسم "خدماتنا" في القائمة الجانبية. اختر الخدمة المناسبة، املأ النموذج، وسيتواصل معك فريقنا لتقديم عرض السعر.', 'orders', ARRAY['طلب','خدمة','جديد'], 1),
  ('كيف أدفع فاتورتي؟', 'بعد قبول عرض السعر وتوقيع العقد، يتم إصدار فاتورة في قسم "فواتيري". يمكنك الدفع مباشرة عبر بوابة الدفع الإلكتروني أو من رصيد محفظتك.', 'billing', ARRAY['دفع','فاتورة','محفظة'], 2),
  ('متى يبدأ تنفيذ طلبي؟', 'يبدأ تنفيذ الطلب فور استلام الدفعة الأولى وتوقيع العقد. يمكنك متابعة مراحل التنفيذ من صفحة تفاصيل الطلب.', 'orders', ARRAY['تنفيذ','مراحل'], 3),
  ('كيف أتواصل مع فريق الدعم؟', 'افتح تذكرة دعم جديدة من قسم "خدمة العملاء" وحدد التصنيف والأولوية. سنرد خلال 4 ساعات للأولوية العالية و24 ساعة للمتوسطة.', 'general', ARRAY['دعم','تواصل'], 4),
  ('كيف أشحن محفظتي؟', 'من قسم "محفظتي" اضغط على "شحن الرصيد"، حدد المبلغ، واختر طريقة الدفع. يتم تفعيل الرصيد فوراً بعد إتمام الدفع.', 'billing', ARRAY['محفظة','شحن','رصيد'], 5)
ON CONFLICT DO NOTHING;
