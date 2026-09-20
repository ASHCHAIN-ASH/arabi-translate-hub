CREATE OR REPLACE FUNCTION public.admin_wa_generic()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
DECLARE
  v_title text := TG_ARGV[0];
  v_path  text := TG_ARGV[1];
  v_status_col text := NULLIF(TG_ARGV[2], '');
  v_rec jsonb := to_jsonb(NEW);
  v_old jsonb := CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END;
  v_msg text := '';
  v_pair text;
  v_col text;
  v_label text;
  v_val text;
  i int;
  v_event text;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF v_status_col IS NULL THEN RETURN NEW; END IF;
    IF v_rec->>v_status_col IS NOT DISTINCT FROM v_old->>v_status_col THEN RETURN NEW; END IF;
  END IF;

  FOR i IN 3 .. (array_length(TG_ARGV,1) - 1) LOOP
    v_pair := TG_ARGV[i];
    v_col := split_part(v_pair, ':', 1);
    v_label := split_part(v_pair, ':', 2);
    v_val := COALESCE(NULLIF(v_rec->>v_col, ''), '-');
    v_msg := v_msg || v_label || ': ' || v_val || E'\n';
  END LOOP;

  IF TG_OP = 'UPDATE' THEN
    v_msg := v_msg || 'الحالة: ' || COALESCE(v_old->>v_status_col,'-') || ' ← ' || COALESCE(v_rec->>v_status_col,'-') || E'\n';
    v_event := TG_TABLE_NAME || '_status';
  ELSE
    v_event := TG_TABLE_NAME || '_created';
  END IF;

  PERFORM public.notify_admin_wa(
    v_event,
    CASE WHEN TG_OP = 'UPDATE' THEN '🔄 ' || v_title || ' — تحديث' ELSE v_title END,
    v_msg,
    'https://fekrahedu.com' || v_path,
    TG_TABLE_NAME,
    (v_rec->>'id')::uuid
  );
  RETURN NEW;
END;$function$;

REVOKE ALL ON FUNCTION public.admin_wa_generic() FROM PUBLIC, anon, authenticated;

-- عملاء جدد
DROP TRIGGER IF EXISTS trg_admin_wa_customers_ins ON public.customers;
CREATE TRIGGER trg_admin_wa_customers_ins AFTER INSERT ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('👤 عميل جديد', '/adminfekrah/customers', '', 'name:الاسم', 'email:البريد', 'phone:الجوال');

-- رسائل التواصل
DROP TRIGGER IF EXISTS trg_admin_wa_inbox_ins ON public.inbox_messages;
DROP TRIGGER IF EXISTS trg_admin_wa_inbox_upd ON public.inbox_messages;
CREATE TRIGGER trg_admin_wa_inbox_ins AFTER INSERT ON public.inbox_messages
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('📨 رسالة تواصل جديدة', '/adminfekrah/inbox', 'status', 'sender_name:المرسل', 'sender_phone:الجوال', 'subject:الموضوع', 'form_type:النوع');
CREATE TRIGGER trg_admin_wa_inbox_upd AFTER UPDATE OF status ON public.inbox_messages
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('📨 رسالة تواصل', '/adminfekrah/inbox', 'status', 'sender_name:المرسل', 'subject:الموضوع');

-- طلبات النشر العلمي
DROP TRIGGER IF EXISTS trg_admin_wa_pub_ins ON public.research_publications;
DROP TRIGGER IF EXISTS trg_admin_wa_pub_upd ON public.research_publications;
CREATE TRIGGER trg_admin_wa_pub_ins AFTER INSERT ON public.research_publications
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('📚 طلب نشر علمي جديد', '/adminfekrah/publications', 'status', 'request_number:رقم الطلب', 'client_name:العميل', 'client_phone:الجوال', 'target_journal:المجلة', 'service_type:الخدمة');
CREATE TRIGGER trg_admin_wa_pub_upd AFTER UPDATE OF status ON public.research_publications
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('📚 طلب نشر علمي', '/adminfekrah/publications', 'status', 'request_number:رقم الطلب', 'client_name:العميل');

-- العقود
DROP TRIGGER IF EXISTS trg_admin_wa_contracts_ins ON public.contracts;
DROP TRIGGER IF EXISTS trg_admin_wa_contracts_upd ON public.contracts;
CREATE TRIGGER trg_admin_wa_contracts_ins AFTER INSERT ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('📄 عقد جديد', '/adminfekrah/contracts', 'status', 'contract_number:رقم العقد', 'client_full_name:العميل', 'service_name:الخدمة', 'total_amount:المبلغ');
CREATE TRIGGER trg_admin_wa_contracts_upd AFTER UPDATE OF status ON public.contracts
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('📄 عقد', '/adminfekrah/contracts', 'status', 'contract_number:رقم العقد', 'client_full_name:العميل');

-- توقيع العقود
DROP TRIGGER IF EXISTS trg_admin_wa_signatures_ins ON public.contract_signatures;
CREATE TRIGGER trg_admin_wa_signatures_ins AFTER INSERT ON public.contract_signatures
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('✍️ تم توقيع عقد', '/adminfekrah/contracts', '', 'signer_name:الموقّع', 'signer_email:البريد');

-- الطلبات الجماعية
DROP TRIGGER IF EXISTS trg_admin_wa_group_ins ON public.group_orders;
DROP TRIGGER IF EXISTS trg_admin_wa_group_upd ON public.group_orders;
CREATE TRIGGER trg_admin_wa_group_ins AFTER INSERT ON public.group_orders
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('👥 طلب جماعي جديد', '/adminfekrah/service-orders', 'status', 'title:العنوان', 'service_name:الخدمة', 'seat_price:سعر المقعد', 'max_members:عدد المقاعد');
CREATE TRIGGER trg_admin_wa_group_upd AFTER UPDATE OF status ON public.group_orders
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('👥 طلب جماعي', '/adminfekrah/service-orders', 'status', 'title:العنوان', 'service_name:الخدمة');

-- العضويات
DROP TRIGGER IF EXISTS trg_admin_wa_memberships_ins ON public.user_memberships;
DROP TRIGGER IF EXISTS trg_admin_wa_memberships_upd ON public.user_memberships;
CREATE TRIGGER trg_admin_wa_memberships_ins AFTER INSERT ON public.user_memberships
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('🏅 اشتراك عضوية جديد', '/adminfekrah/memberships', 'status', 'amount_paid:المبلغ', 'payment_method:طريقة الدفع');
CREATE TRIGGER trg_admin_wa_memberships_upd AFTER UPDATE OF status ON public.user_memberships
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('🏅 عضوية', '/adminfekrah/memberships', 'status', 'amount_paid:المبلغ');

-- مشتريات السيرة الذاتية
DROP TRIGGER IF EXISTS trg_admin_wa_cv_ins ON public.cv_purchases;
CREATE TRIGGER trg_admin_wa_cv_ins AFTER INSERT ON public.cv_purchases
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('📑 شراء سيرة ذاتية', '/adminfekrah/payments', '', 'amount:المبلغ', 'payment_method:طريقة الدفع', 'template_key:القالب');

-- إيصالات التمويل
DROP TRIGGER IF EXISTS trg_admin_wa_receipts_ins ON public.financing_payment_receipts;
DROP TRIGGER IF EXISTS trg_admin_wa_receipts_upd ON public.financing_payment_receipts;
CREATE TRIGGER trg_admin_wa_receipts_ins AFTER INSERT ON public.financing_payment_receipts
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('🧾 إيصال سداد تمويل جديد', '/adminfekrah/financing', 'status', 'amount:المبلغ', 'bank_name:البنك', 'reference_number:المرجع');
CREATE TRIGGER trg_admin_wa_receipts_upd AFTER UPDATE OF status ON public.financing_payment_receipts
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('🧾 إيصال سداد تمويل', '/adminfekrah/financing', 'status', 'amount:المبلغ');

-- مستندات التمويل
DROP TRIGGER IF EXISTS trg_admin_wa_fdocs_ins ON public.financing_documents;
CREATE TRIGGER trg_admin_wa_fdocs_ins AFTER INSERT ON public.financing_documents
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('📎 مستند تمويل جديد', '/adminfekrah/financing', '', 'document_type:نوع المستند', 'file_name:الملف');

-- اهتمامات التمويل
DROP TRIGGER IF EXISTS trg_admin_wa_finterest_ins ON public.financing_interests;
CREATE TRIGGER trg_admin_wa_finterest_ins AFTER INSERT ON public.financing_interests
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('🏦 اهتمام بالتمويل', '/adminfekrah/financing', '', 'customer_name:الاسم', 'email:البريد', 'source:المصدر');

-- تحليلات الترجمة
DROP TRIGGER IF EXISTS trg_admin_wa_tfa_ins ON public.translation_file_analyses;
DROP TRIGGER IF EXISTS trg_admin_wa_tfa_upd ON public.translation_file_analyses;
CREATE TRIGGER trg_admin_wa_tfa_ins AFTER INSERT ON public.translation_file_analyses
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('🌐 ملف ترجمة جديد للتسعير', '/adminfekrah/service-orders', 'approval_status', 'file_name:الملف', 'word_count:عدد الكلمات', 'estimated_price_sar:السعر التقديري');
CREATE TRIGGER trg_admin_wa_tfa_upd AFTER UPDATE OF approval_status ON public.translation_file_analyses
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('🌐 تسعير ترجمة', '/adminfekrah/service-orders', 'approval_status', 'file_name:الملف', 'approved_price_sar:السعر المعتمد');

-- جوائز عجلة الحظ
DROP TRIGGER IF EXISTS trg_admin_wa_spin_ins ON public.spin_attempts;
CREATE TRIGGER trg_admin_wa_spin_ins AFTER INSERT ON public.spin_attempts
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('🎡 فوز بعجلة الجوائز', '/adminfekrah/spin', '', 'name:الاسم', 'phone:الجوال', 'email:البريد', 'prize:الجائزة');

-- محادثات الدعم المباشر
DROP TRIGGER IF EXISTS trg_admin_wa_chat_ins ON public.chat_conversations;
CREATE TRIGGER trg_admin_wa_chat_ins AFTER INSERT ON public.chat_conversations
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('💬 محادثة دعم جديدة', '/adminfekrah/chat', '', 'subject:الموضوع');

-- التحليل الإحصائي
DROP TRIGGER IF EXISTS trg_admin_wa_stats_ins ON public.statistical_analyses;
CREATE TRIGGER trg_admin_wa_stats_ins AFTER INSERT ON public.statistical_analyses
FOR EACH ROW EXECUTE FUNCTION public.admin_wa_generic('📊 تحليل إحصائي جديد', '/adminfekrah/service-orders', '', 'title:العنوان', 'analysis_type:نوع التحليل', 'file_name:الملف');