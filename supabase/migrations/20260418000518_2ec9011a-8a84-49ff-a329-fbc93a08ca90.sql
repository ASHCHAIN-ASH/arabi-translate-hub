
-- Membership plans (tiers)
CREATE TABLE public.membership_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'SAR',
  duration_months INTEGER NOT NULL DEFAULT 12,
  discount_percentage NUMERIC NOT NULL DEFAULT 0,
  cashback_amount NUMERIC NOT NULL DEFAULT 0,
  priority_level INTEGER NOT NULL DEFAULT 0,
  badge_color TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans" ON public.membership_plans
  FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage plans" ON public.membership_plans
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_membership_plans_updated
  BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- User memberships (active subscriptions)
CREATE TABLE public.user_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.membership_plans(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, expired, cancelled
  payment_method TEXT, -- 'wallet' or 'invoice'
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  cashback_credited BOOLEAN NOT NULL DEFAULT false,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  activated_by UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_memberships_user ON public.user_memberships(user_id);
CREATE INDEX idx_user_memberships_status ON public.user_memberships(status);

ALTER TABLE public.user_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own memberships" ON public.user_memberships
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own memberships" ON public.user_memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage memberships" ON public.user_memberships
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_user_memberships_updated
  BEFORE UPDATE ON public.user_memberships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Membership history audit log
CREATE TABLE public.membership_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  membership_id UUID NOT NULL REFERENCES public.user_memberships(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- subscribed, activated, renewed, extended, cancelled, expired
  actor_id UUID,
  actor_type TEXT NOT NULL DEFAULT 'system',
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.membership_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own history" ON public.membership_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins manage history" ON public.membership_history
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Function: get current active membership for a user
CREATE OR REPLACE FUNCTION public.get_active_membership(_user_id UUID)
RETURNS TABLE (
  membership_id UUID,
  plan_id UUID,
  plan_code TEXT,
  plan_name_ar TEXT,
  discount_percentage NUMERIC,
  cashback_amount NUMERIC,
  priority_level INTEGER,
  badge_color TEXT,
  expires_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT um.id, mp.id, mp.code, mp.name_ar, mp.discount_percentage,
         mp.cashback_amount, mp.priority_level, mp.badge_color, um.expires_at
  FROM public.user_memberships um
  JOIN public.membership_plans mp ON mp.id = um.plan_id
  WHERE um.user_id = _user_id
    AND um.status = 'active'
    AND (um.expires_at IS NULL OR um.expires_at > now())
  ORDER BY mp.priority_level DESC
  LIMIT 1;
$$;

-- Trigger: handle membership activation (credit cashback + notify)
CREATE OR REPLACE FUNCTION public.handle_membership_activated()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan record;
  v_wallet_id UUID;
BEGIN
  IF NEW.status = 'active' AND (OLD.status IS DISTINCT FROM 'active') THEN
    SELECT * INTO v_plan FROM public.membership_plans WHERE id = NEW.plan_id;

    -- Set start/expiry if not set
    IF NEW.starts_at IS NULL THEN
      NEW.starts_at := now();
    END IF;
    IF NEW.expires_at IS NULL THEN
      NEW.expires_at := NEW.starts_at + (v_plan.duration_months || ' months')::interval;
    END IF;

    -- Credit cashback if not already done
    IF NOT NEW.cashback_credited AND v_plan.cashback_amount > 0 THEN
      SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = NEW.user_id;
      IF v_wallet_id IS NULL THEN
        INSERT INTO public.wallets (user_id) VALUES (NEW.user_id) RETURNING id INTO v_wallet_id;
      END IF;

      INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
      VALUES (v_wallet_id, NEW.user_id, 'deposit', v_plan.cashback_amount,
              'كاش باك عضوية ' || v_plan.name_ar, 'membership', NEW.id);

      NEW.cashback_credited := true;
    END IF;

    -- Notify user
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, '🎉 تم تفعيل عضويتك',
            'مرحباً بك في عضوية ' || v_plan.name_ar || '. استمتع بمزاياك الحصرية!',
            'membership', '/membership');

    -- Log history
    INSERT INTO public.membership_history (membership_id, user_id, action, actor_id, actor_type, description)
    VALUES (NEW.id, NEW.user_id, 'activated', auth.uid(),
            CASE WHEN auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role) THEN 'admin' ELSE 'system' END,
            'تم تفعيل العضوية');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_membership_activated
  BEFORE UPDATE ON public.user_memberships
  FOR EACH ROW EXECUTE FUNCTION public.handle_membership_activated();

-- Trigger: log membership creation
CREATE OR REPLACE FUNCTION public.handle_membership_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.membership_history (membership_id, user_id, action, actor_id, actor_type, description)
  VALUES (NEW.id, NEW.user_id, 'subscribed', NEW.user_id, 'client',
          'تم إنشاء طلب اشتراك');

  -- Notify admins
  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  SELECT ur.user_id, '👑 طلب اشتراك عضوية جديد',
         'يوجد طلب اشتراك عضوية جديد بانتظار المراجعة',
         'membership', '/adminmaster/memberships'
  FROM public.user_roles ur WHERE ur.role = 'admin';

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_membership_created
  AFTER INSERT ON public.user_memberships
  FOR EACH ROW EXECUTE FUNCTION public.handle_membership_created();

-- Seed default plans (Silver, Gold, Platinum)
INSERT INTO public.membership_plans (code, name_ar, name_en, description, price, discount_percentage, cashback_amount, priority_level, badge_color, sort_order, benefits)
VALUES
  ('silver', 'العضوية الفضية', 'Silver Membership', 'العضوية الأساسية بمزايا ممتازة', 999, 15, 200, 1, '#94a3b8', 1,
   '["خصم 15% على جميع الطلبات","كاش باك 200 ريال","شارة فضية","دعم فني عادي"]'::jsonb),
  ('gold', 'العضوية الذهبية', 'Gold Membership', 'العضوية المتميزة بمزايا أوسع', 2499, 25, 600, 2, '#f59e0b', 2,
   '["خصم 25% على جميع الطلبات","كاش باك 600 ريال","أولوية تنفيذ الطلبات","شارة ذهبية","دعم فني مميز"]'::jsonb),
  ('platinum', 'العضوية البلاتينية', 'Platinum Membership', 'أعلى مستوى من المزايا الحصرية', 4999, 40, 1500, 3, '#1f2937', 3,
   '["خصم 40% على جميع الطلبات","كاش باك 1500 ريال","أولوية تنفيذ قصوى","شارة بلاتينية مميزة","مدير حساب مخصص","دعم فني VIP على مدار الساعة"]'::jsonb);
