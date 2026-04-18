-- ============================================
-- إعدادات الخدمات للطلبات الجماعية
-- ============================================
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS is_group_eligible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS group_min_members integer NOT NULL DEFAULT 2,
  ADD COLUMN IF NOT EXISTS group_max_members integer NOT NULL DEFAULT 10,
  ADD COLUMN IF NOT EXISTS group_seat_price numeric(12,2);

-- ============================================
-- جدول الطلبات الجماعية
-- ============================================
CREATE TYPE public.group_order_status AS ENUM (
  'open',            -- فُتح للانضمام
  'partially_paid',  -- بعض الأعضاء دفعوا
  'full',            -- اكتمل العدد ومدفوع كاملاً
  'in_progress',     -- بدأ التنفيذ (مرتبط بـ service_order)
  'completed',
  'cancelled',
  'expired'
);

CREATE TABLE public.group_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  service_name text,
  title text NOT NULL,
  description text,
  seat_price numeric(12,2) NOT NULL CHECK (seat_price > 0),
  currency text NOT NULL DEFAULT 'SAR',
  max_members integer NOT NULL CHECK (max_members BETWEEN 2 AND 50),
  min_members integer NOT NULL DEFAULT 2 CHECK (min_members >= 2),
  invite_code text NOT NULL UNIQUE,
  status group_order_status NOT NULL DEFAULT 'open',
  deadline timestamptz,
  service_order_id uuid REFERENCES public.service_orders(id) ON DELETE SET NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  cancelled_at timestamptz
);

CREATE INDEX idx_group_orders_creator ON public.group_orders(creator_id);
CREATE INDEX idx_group_orders_status ON public.group_orders(status);
CREATE INDEX idx_group_orders_invite ON public.group_orders(invite_code);

-- ============================================
-- أعضاء الطلب
-- ============================================
CREATE TYPE public.group_member_status AS ENUM (
  'joined',     -- انضم لكنه لم يدفع
  'paid',       -- دفع
  'refunded',   -- تم استرداده
  'left'        -- خرج قبل الدفع
);

CREATE TABLE public.group_order_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_order_id uuid NOT NULL REFERENCES public.group_orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  status group_member_status NOT NULL DEFAULT 'joined',
  amount_due numeric(12,2) NOT NULL,
  amount_paid numeric(12,2) NOT NULL DEFAULT 0,
  paid_via text,                          -- 'wallet' | 'gateway'
  wallet_transaction_id uuid,
  payment_intent_id uuid REFERENCES public.payment_intents(id) ON DELETE SET NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  refunded_at timestamptz,
  is_creator boolean NOT NULL DEFAULT false,
  UNIQUE (group_order_id, user_id)
);

CREATE INDEX idx_group_members_user ON public.group_order_members(user_id);
CREATE INDEX idx_group_members_group ON public.group_order_members(group_order_id);

-- ============================================
-- سجل تدقيق
-- ============================================
CREATE TABLE public.group_order_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_order_id uuid NOT NULL REFERENCES public.group_orders(id) ON DELETE CASCADE,
  actor_id uuid,
  action_type text NOT NULL,        -- created/joined/paid/refunded/started/cancelled/expired
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_group_audit_group ON public.group_order_audit(group_order_id);

-- ============================================
-- مولّد رمز دعوة فريد
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_group_invite_code()
RETURNS text LANGUAGE plpgsql SET search_path = public AS $$
DECLARE c text; n int;
BEGIN
  LOOP
    c := upper(substring(md5(random()::text || clock_timestamp()::text) FROM 1 FOR 8));
    SELECT count(*) INTO n FROM public.group_orders WHERE invite_code = c;
    EXIT WHEN n = 0;
  END LOOP;
  RETURN c;
END$$;

-- ============================================
-- تريغر: تعيين رمز الدعوة + سعر/اسم من services
-- ============================================
CREATE OR REPLACE FUNCTION public.set_group_order_defaults()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_svc record;
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := public.generate_group_invite_code();
  END IF;

  SELECT name_ar, name, is_group_eligible, group_max_members, group_min_members, group_seat_price, price
    INTO v_svc FROM public.services WHERE id = NEW.service_id;

  IF v_svc IS NULL THEN RAISE EXCEPTION 'الخدمة غير موجودة'; END IF;
  IF v_svc.is_group_eligible IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'هذه الخدمة لا تدعم الطلبات الجماعية';
  END IF;

  IF NEW.service_name IS NULL THEN
    NEW.service_name := COALESCE(v_svc.name_ar, v_svc.name);
  END IF;

  -- فرض الحدود من الخدمة
  IF NEW.max_members > v_svc.group_max_members THEN
    NEW.max_members := v_svc.group_max_members;
  END IF;
  IF NEW.min_members < v_svc.group_min_members THEN
    NEW.min_members := v_svc.group_min_members;
  END IF;

  -- استخدام سعر المقعد من الخدمة (أو السعر العام إن لم يُحدّد)
  IF NEW.seat_price IS NULL OR NEW.seat_price <= 0 THEN
    NEW.seat_price := COALESCE(v_svc.group_seat_price, v_svc.price);
  END IF;

  RETURN NEW;
END$$;

CREATE TRIGGER trg_group_order_defaults
BEFORE INSERT ON public.group_orders
FOR EACH ROW EXECUTE FUNCTION public.set_group_order_defaults();

-- ============================================
-- تريغر: منع تعديل السعر / الخدمة بعد الإنشاء
-- ============================================
CREATE OR REPLACE FUNCTION public.guard_group_order_edits()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.seat_price IS DISTINCT FROM OLD.seat_price THEN
    RAISE EXCEPTION 'لا يمكن تعديل سعر المقعد بعد إنشاء الطلب';
  END IF;
  IF NEW.service_id IS DISTINCT FROM OLD.service_id THEN
    RAISE EXCEPTION 'لا يمكن تغيير الخدمة';
  END IF;
  IF NEW.max_members IS DISTINCT FROM OLD.max_members
     AND OLD.status IN ('partially_paid','full','in_progress','completed') THEN
    RAISE EXCEPTION 'لا يمكن تعديل عدد المقاعد بعد بدء الانضمام/الدفع';
  END IF;
  RETURN NEW;
END$$;

CREATE TRIGGER trg_group_order_guard
BEFORE UPDATE ON public.group_orders
FOR EACH ROW EXECUTE FUNCTION public.guard_group_order_edits();

-- ============================================
-- تريغر: عند انضمام عضو
-- ============================================
CREATE OR REPLACE FUNCTION public.before_group_member_insert()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_go record; v_count int;
BEGIN
  SELECT * INTO v_go FROM public.group_orders WHERE id = NEW.group_order_id FOR UPDATE;
  IF v_go IS NULL THEN RAISE EXCEPTION 'الطلب الجماعي غير موجود'; END IF;
  IF v_go.status NOT IN ('open','partially_paid') THEN
    RAISE EXCEPTION 'الطلب لا يقبل أعضاء جدد';
  END IF;

  SELECT count(*) INTO v_count FROM public.group_order_members
   WHERE group_order_id = NEW.group_order_id AND status <> 'left';
  IF v_count >= v_go.max_members THEN
    RAISE EXCEPTION 'اكتمل عدد الأعضاء (%)', v_go.max_members;
  END IF;

  IF NEW.amount_due IS NULL OR NEW.amount_due <= 0 THEN
    NEW.amount_due := v_go.seat_price;
  END IF;

  RETURN NEW;
END$$;

CREATE TRIGGER trg_group_member_before_insert
BEFORE INSERT ON public.group_order_members
FOR EACH ROW EXECUTE FUNCTION public.before_group_member_insert();

-- ============================================
-- تريغر: بعد دفع/تحديث عضو → تحديث حالة الطلب وبدء التنفيذ
-- ============================================
CREATE OR REPLACE FUNCTION public.after_group_member_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_go record;
  v_paid_count int;
  v_active_count int;
  v_so_id uuid;
BEGIN
  SELECT * INTO v_go FROM public.group_orders WHERE id = COALESCE(NEW.group_order_id, OLD.group_order_id) FOR UPDATE;
  IF v_go IS NULL THEN RETURN NEW; END IF;

  SELECT
    count(*) FILTER (WHERE status = 'paid'),
    count(*) FILTER (WHERE status IN ('joined','paid'))
   INTO v_paid_count, v_active_count
  FROM public.group_order_members WHERE group_order_id = v_go.id;

  -- اكتمل الدفع 100% والعدد ≥ الحد الأدنى ولم يبدأ بعد
  IF v_paid_count = v_active_count
     AND v_paid_count >= v_go.min_members
     AND v_paid_count = v_go.max_members
     AND v_go.status NOT IN ('in_progress','completed','cancelled','expired') THEN

    -- إنشاء service_order مرتبط
    INSERT INTO public.service_orders (
      user_id, service_id, service_name, total_amount, paid_amount,
      lifecycle_status, current_status, notes
    ) VALUES (
      v_go.creator_id, v_go.service_id, v_go.service_name,
      v_go.seat_price * v_paid_count, v_go.seat_price * v_paid_count,
      'in_progress', 'in_progress',
      'طلب جماعي #' || substr(v_go.id::text,1,8) || ' — ' || v_paid_count || ' أعضاء'
    ) RETURNING id INTO v_so_id;

    UPDATE public.group_orders
       SET status = 'in_progress', service_order_id = v_so_id,
           started_at = now(), updated_at = now()
     WHERE id = v_go.id;

    INSERT INTO public.group_order_audit (group_order_id, action_type, description, metadata)
    VALUES (v_go.id, 'started', 'بدأ تنفيذ الطلب الجماعي بعد اكتمال الدفع',
            jsonb_build_object('service_order_id', v_so_id, 'members', v_paid_count));

    -- إشعار كل الأعضاء
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    SELECT user_id, '🚀 بدأ تنفيذ الطلب الجماعي',
           'تم اكتمال الدفع وبدأ تنفيذ "' || v_go.title || '"',
           'order', '/group-orders/' || v_go.id::text
    FROM public.group_order_members WHERE group_order_id = v_go.id AND status = 'paid';

  ELSIF v_paid_count > 0 AND v_go.status = 'open' THEN
    UPDATE public.group_orders SET status = 'partially_paid', updated_at = now() WHERE id = v_go.id;
  END IF;

  RETURN NEW;
END$$;

CREATE TRIGGER trg_group_member_after_change
AFTER INSERT OR UPDATE OF status ON public.group_order_members
FOR EACH ROW EXECUTE FUNCTION public.after_group_member_change();

-- ============================================
-- updated_at trigger
-- ============================================
CREATE TRIGGER trg_group_orders_updated_at
BEFORE UPDATE ON public.group_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- RPC: إنشاء طلب جماعي
-- ============================================
CREATE OR REPLACE FUNCTION public.create_group_order(
  _service_id uuid, _title text, _description text,
  _max_members int, _deadline timestamptz DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid; v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;

  INSERT INTO public.group_orders (creator_id, service_id, title, description, max_members, seat_price, deadline)
  VALUES (v_uid, _service_id, _title, _description, _max_members, 0, _deadline)
  RETURNING id INTO v_id;

  -- المنشئ ينضم تلقائياً
  INSERT INTO public.group_order_members (group_order_id, user_id, is_creator, amount_due)
  VALUES (v_id, v_uid, true, (SELECT seat_price FROM public.group_orders WHERE id = v_id));

  INSERT INTO public.group_order_audit (group_order_id, actor_id, action_type, description)
  VALUES (v_id, v_uid, 'created', 'تم إنشاء الطلب الجماعي');

  RETURN v_id;
END$$;

-- ============================================
-- RPC: الانضمام عبر رمز
-- ============================================
CREATE OR REPLACE FUNCTION public.join_group_order(_invite_code text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_go record; v_uid uuid := auth.uid(); v_existing uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;

  SELECT * INTO v_go FROM public.group_orders WHERE invite_code = upper(_invite_code);
  IF v_go IS NULL THEN RAISE EXCEPTION 'رمز الدعوة غير صحيح'; END IF;

  SELECT id INTO v_existing FROM public.group_order_members
   WHERE group_order_id = v_go.id AND user_id = v_uid;
  IF v_existing IS NOT NULL THEN RETURN v_go.id; END IF;

  INSERT INTO public.group_order_members (group_order_id, user_id, amount_due)
  VALUES (v_go.id, v_uid, v_go.seat_price);

  INSERT INTO public.group_order_audit (group_order_id, actor_id, action_type, description)
  VALUES (v_go.id, v_uid, 'joined', 'انضم عضو جديد');

  RETURN v_go.id;
END$$;

-- ============================================
-- RPC: الدفع عبر المحفظة
-- ============================================
CREATE OR REPLACE FUNCTION public.pay_group_seat_with_wallet(_group_order_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_member record; v_go record; v_wallet record; v_tx uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;

  SELECT * INTO v_member FROM public.group_order_members
   WHERE group_order_id = _group_order_id AND user_id = v_uid FOR UPDATE;
  IF v_member IS NULL THEN RAISE EXCEPTION 'لست عضواً في هذا الطلب'; END IF;
  IF v_member.status = 'paid' THEN RAISE EXCEPTION 'تم الدفع مسبقاً'; END IF;

  SELECT * INTO v_go FROM public.group_orders WHERE id = _group_order_id;
  IF v_go.status NOT IN ('open','partially_paid') THEN
    RAISE EXCEPTION 'الطلب لا يقبل دفعات جديدة';
  END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
  IF v_wallet IS NULL THEN RAISE EXCEPTION 'المحفظة غير موجودة'; END IF;
  IF v_wallet.balance < v_member.amount_due THEN RAISE EXCEPTION 'الرصيد غير كافٍ'; END IF;

  INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
  VALUES (v_wallet.id, v_uid, 'payment', v_member.amount_due,
          'دفع مقعد طلب جماعي — ' || v_go.title,
          'group_order', _group_order_id)
  RETURNING id INTO v_tx;

  UPDATE public.group_order_members
     SET status = 'paid', amount_paid = amount_due, paid_via = 'wallet',
         wallet_transaction_id = v_tx, paid_at = now()
   WHERE id = v_member.id;

  INSERT INTO public.group_order_audit (group_order_id, actor_id, action_type, description, metadata)
  VALUES (_group_order_id, v_uid, 'paid', 'دفع عبر المحفظة',
          jsonb_build_object('amount', v_member.amount_due, 'tx', v_tx));

  RETURN jsonb_build_object('ok', true);
END$$;

-- ============================================
-- RPC: إلغاء الطلب الجماعي + استرداد الجميع
-- ============================================
CREATE OR REPLACE FUNCTION public.cancel_group_order(_group_order_id uuid, _reason text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_go record; v_m record; v_wallet_id uuid;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  SELECT * INTO v_go FROM public.group_orders WHERE id = _group_order_id FOR UPDATE;
  IF v_go IS NULL THEN RAISE EXCEPTION 'الطلب غير موجود'; END IF;
  IF v_go.creator_id <> v_uid AND NOT has_role(v_uid, 'admin'::app_role) THEN
    RAISE EXCEPTION 'غير مصرح';
  END IF;
  IF v_go.status IN ('in_progress','completed','cancelled') THEN
    RAISE EXCEPTION 'لا يمكن إلغاء الطلب في حالته الحالية';
  END IF;

  -- استرداد جميع المدفوعات للمحفظة
  FOR v_m IN SELECT * FROM public.group_order_members
              WHERE group_order_id = _group_order_id AND status = 'paid' LOOP
    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_m.user_id;
    IF v_wallet_id IS NULL THEN
      INSERT INTO public.wallets(user_id) VALUES (v_m.user_id) RETURNING id INTO v_wallet_id;
    END IF;
    INSERT INTO public.wallet_transactions(wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet_id, v_m.user_id, 'refund', v_m.amount_paid,
            'استرداد طلب جماعي ملغى — ' || v_go.title,
            'group_order', _group_order_id);

    UPDATE public.group_order_members
       SET status = 'refunded', refunded_at = now()
     WHERE id = v_m.id;

    INSERT INTO public.user_notifications(user_id, title, message, type, link)
    VALUES (v_m.user_id, '↩️ تم استرداد مبلغ طلب جماعي',
            'أُلغي الطلب "' || v_go.title || '" وأُعيد المبلغ إلى محفظتك',
            'wallet', '/wallet');
  END LOOP;

  UPDATE public.group_orders
     SET status = 'cancelled', cancelled_at = now(), updated_at = now(),
         metadata = metadata || jsonb_build_object('cancel_reason', _reason)
   WHERE id = _group_order_id;

  INSERT INTO public.group_order_audit (group_order_id, actor_id, action_type, description)
  VALUES (_group_order_id, v_uid, 'cancelled', COALESCE(_reason, 'تم الإلغاء'));

  RETURN jsonb_build_object('ok', true);
END$$;

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.group_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_order_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_order_audit ENABLE ROW LEVEL SECURITY;

-- group_orders
CREATE POLICY "go_select_member_or_creator_or_admin" ON public.group_orders
FOR SELECT USING (
  creator_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.group_order_members m
              WHERE m.group_order_id = group_orders.id AND m.user_id = auth.uid())
);

CREATE POLICY "go_insert_self_creator" ON public.group_orders
FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "go_update_creator_or_admin" ON public.group_orders
FOR UPDATE USING (creator_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "go_delete_admin" ON public.group_orders
FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- group_order_members
CREATE POLICY "gom_select_self_or_member_or_admin" ON public.group_order_members
FOR SELECT USING (
  user_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.group_order_members m2
              WHERE m2.group_order_id = group_order_members.group_order_id
                AND m2.user_id = auth.uid())
);

CREATE POLICY "gom_insert_self" ON public.group_order_members
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "gom_update_self_or_admin" ON public.group_order_members
FOR UPDATE USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- audit (read for involved + admin)
CREATE POLICY "goa_select_involved_or_admin" ON public.group_order_audit
FOR SELECT USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.group_orders g
              WHERE g.id = group_order_audit.group_order_id AND g.creator_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.group_order_members m
              WHERE m.group_order_id = group_order_audit.group_order_id AND m.user_id = auth.uid())
);

-- realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_order_members;