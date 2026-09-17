CREATE FUNCTION public.accept_service_quote(_order_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_order record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  SELECT * INTO v_order FROM public.service_orders WHERE id = _order_id;
  IF v_order.id IS NULL THEN RAISE EXCEPTION 'الطلب غير موجود'; END IF;
  IF v_order.user_id <> auth.uid() THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF COALESCE(v_order.quote_status,'') NOT IN ('sent','pending') AND v_order.lifecycle_status <> 'quote_sent' THEN
    RAISE EXCEPTION 'لا يوجد عرض سعر فعّال للقبول';
  END IF;
  UPDATE public.service_orders
     SET quote_status = 'accepted', updated_at = now()
   WHERE id = _order_id;
  RETURN jsonb_build_object('ok', true, 'order_id', _order_id);
END;
$$;

CREATE FUNCTION public.after_group_member_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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

  IF v_paid_count = v_active_count
     AND v_paid_count >= v_go.min_members
     AND v_paid_count = v_go.max_members
     AND v_go.status NOT IN ('in_progress','completed','cancelled','expired') THEN

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

CREATE FUNCTION public.aggregate_daily_growth_metrics(p_date date DEFAULT ((CURRENT_DATE - '1 day'::interval))::date) RETURNS public.daily_growth_metrics
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_start TIMESTAMPTZ := p_date::timestamptz;
  v_end   TIMESTAMPTZ := (p_date + 1)::timestamptz;
  v_new INT; v_active INT; v_challenges INT; v_shares INT;
  v_refs INT; v_refs_completed INT; v_conv INT; v_retention NUMERIC(5,2);
  v_row public.daily_growth_metrics;
BEGIN
  SELECT COUNT(DISTINCT user_id) INTO v_new
  FROM public.growth_events
  WHERE event_type = 'user_signed_up'
    AND created_at >= v_start AND created_at < v_end;

  SELECT COUNT(DISTINCT user_id) INTO v_active
  FROM public.growth_events
  WHERE user_id IS NOT NULL
    AND created_at >= v_start AND created_at < v_end;

  SELECT COUNT(*) INTO v_challenges
  FROM public.challenge_attempts
  WHERE status = 'completed'
    AND completed_at >= v_start AND completed_at < v_end;

  SELECT COUNT(*) INTO v_shares
  FROM public.growth_events
  WHERE event_type = 'result_shared'
    AND created_at >= v_start AND created_at < v_end;

  SELECT COUNT(*) INTO v_refs
  FROM public.referrals
  WHERE created_at >= v_start AND created_at < v_end;

  SELECT COUNT(*) INTO v_refs_completed
  FROM public.referrals
  WHERE completed_at IS NOT NULL
    AND completed_at >= v_start AND completed_at < v_end;

  v_conv := v_refs_completed;

  SELECT CASE WHEN COUNT(DISTINCT u.user_id) = 0 THEN 0
              ELSE ROUND(100.0 * COUNT(DISTINCT a.user_id)::numeric / COUNT(DISTINCT u.user_id), 2)
         END INTO v_retention
  FROM public.growth_events u
  LEFT JOIN public.growth_events a
    ON a.user_id = u.user_id
   AND a.created_at >= v_start
   AND a.created_at < v_end
  WHERE u.event_type = 'user_signed_up'
    AND u.created_at >= (v_start - INTERVAL '7 days')
    AND u.created_at <  (v_start - INTERVAL '6 days');

  INSERT INTO public.daily_growth_metrics
    (date, new_users, active_users, challenges_completed, shares_count,
     referrals_count, referrals_completed, conversions, retention_rate, computed_at)
  VALUES
    (p_date, COALESCE(v_new,0), COALESCE(v_active,0), COALESCE(v_challenges,0), COALESCE(v_shares,0),
     COALESCE(v_refs,0), COALESCE(v_refs_completed,0), COALESCE(v_conv,0), COALESCE(v_retention,0), now())
  ON CONFLICT (date) DO UPDATE SET
    new_users = EXCLUDED.new_users,
    active_users = EXCLUDED.active_users,
    challenges_completed = EXCLUDED.challenges_completed,
    shares_count = EXCLUDED.shares_count,
    referrals_count = EXCLUDED.referrals_count,
    referrals_completed = EXCLUDED.referrals_completed,
    conversions = EXCLUDED.conversions,
    retention_rate = EXCLUDED.retention_rate,
    computed_at = now()
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

CREATE FUNCTION public.analyze_growth_insights() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  r record;
  v_signups int; v_activated int; v_activation_rate numeric;
  v_completed int; v_shares int; v_share_rate numeric;
  v_invites int; v_completed_invites int; v_referral_rate numeric;
  v_cohort int; v_d3_returned int; v_d3_rate numeric;
  v_threshold numeric; v_delta numeric; v_severity text;
  v_created int := 0; v_resolved int := 0;
  active_keys text[] := '{}';
BEGIN
  SELECT * INTO r FROM automation_rules WHERE rule_key='activation_rate_low' AND is_active LIMIT 1;
  IF FOUND THEN
    SELECT count(DISTINCT user_id) INTO v_signups FROM growth_events
     WHERE event_type='user_signed_up' AND created_at >= now() - (r.lookback_days || ' days')::interval;

    SELECT count(DISTINCT ge.user_id) INTO v_activated FROM growth_events ge
     WHERE ge.event_type='first_challenge_completed'
       AND ge.created_at >= now() - (r.lookback_days || ' days')::interval
       AND EXISTS (SELECT 1 FROM growth_events s
         WHERE s.user_id=ge.user_id AND s.event_type='user_signed_up'
           AND s.created_at >= now() - (r.lookback_days || ' days')::interval);

    v_activation_rate := CASE WHEN v_signups > 0 THEN (v_activated::numeric / v_signups)*100 ELSE NULL END;
    v_threshold := r.threshold_value;
    IF v_activation_rate IS NOT NULL AND v_activation_rate < v_threshold THEN
      v_delta := v_activation_rate - v_threshold;
      v_severity := classify_severity((v_threshold - v_activation_rate));
      PERFORM upsert_insight('activation', v_severity,
        'انخفاض معدل التفعيل إلى ' || round(v_activation_rate,1) || '%',
        'المستخدمون الجدد لا يصلون للقيمة الأساسية بسرعة. ' || v_activated || ' من ' || v_signups || ' مستخدم فعّلوا حسابهم خلال آخر ' || r.lookback_days || ' أيام.',
        r.recommendation_template, 'activation_rate',
        v_activation_rate, v_threshold, v_delta,
        jsonb_build_object('signups', v_signups, 'activated', v_activated, 'window_days', r.lookback_days),
        'activation_rate_low');
      v_created := v_created + 1;
      active_keys := array_append(active_keys, 'activation_rate_low');
    END IF;
  END IF;

  SELECT * INTO r FROM automation_rules WHERE rule_key='share_rate_low' AND is_active LIMIT 1;
  IF FOUND THEN
    SELECT count(*) INTO v_completed FROM growth_events
     WHERE event_type IN ('challenge_completed','first_challenge_completed')
       AND created_at >= now() - (r.lookback_days || ' days')::interval;
    SELECT count(*) INTO v_shares FROM growth_events
     WHERE event_type='result_shared' AND created_at >= now() - (r.lookback_days || ' days')::interval;
    v_share_rate := CASE WHEN v_completed > 0 THEN (v_shares::numeric / v_completed)*100 ELSE NULL END;
    v_threshold := r.threshold_value;
    IF v_share_rate IS NOT NULL AND v_share_rate < v_threshold THEN
      v_delta := v_share_rate - v_threshold;
      v_severity := classify_severity((v_threshold - v_share_rate));
      PERFORM upsert_insight('share', v_severity,
        'ضعف مشاركة النتائج: ' || round(v_share_rate,1) || '%',
        'فقط ' || v_shares || ' مشاركة من أصل ' || v_completed || ' تحدي مكتمل في آخر ' || r.lookback_days || ' أيام. الفرصة الفيرالية مهدورة.',
        r.recommendation_template, 'share_rate',
        v_share_rate, v_threshold, v_delta,
        jsonb_build_object('shares', v_shares, 'completed', v_completed, 'window_days', r.lookback_days),
        'share_rate_low');
      v_created := v_created + 1;
      active_keys := array_append(active_keys, 'share_rate_low');
    END IF;
  END IF;

  SELECT * INTO r FROM automation_rules WHERE rule_key='referral_conversion_low' AND is_active LIMIT 1;
  IF FOUND THEN
    SELECT count(*), count(*) FILTER (WHERE status='completed')
      INTO v_invites, v_completed_invites FROM referrals
     WHERE created_at >= now() - (r.lookback_days || ' days')::interval;
    v_referral_rate := CASE WHEN v_invites > 0 THEN (v_completed_invites::numeric / v_invites)*100 ELSE NULL END;
    v_threshold := r.threshold_value;
    IF v_referral_rate IS NOT NULL AND v_referral_rate < v_threshold THEN
      v_delta := v_referral_rate - v_threshold;
      v_severity := classify_severity((v_threshold - v_referral_rate));
      PERFORM upsert_insight('referral', v_severity,
        'ضعف تحويل الإحالات: ' || round(v_referral_rate,1) || '%',
        v_completed_invites || ' دعوة مكتملة من ' || v_invites || ' دعوة في آخر ' || r.lookback_days || ' يوم. الفيرال لوب يحتاج تحسين.',
        r.recommendation_template, 'referral_conversion',
        v_referral_rate, v_threshold, v_delta,
        jsonb_build_object('invites', v_invites, 'completed', v_completed_invites, 'window_days', r.lookback_days),
        'referral_conversion_low');
      v_created := v_created + 1;
      active_keys := array_append(active_keys, 'referral_conversion_low');
    END IF;
  END IF;

  SELECT * INTO r FROM automation_rules WHERE rule_key='retention_d3_low' AND is_active LIMIT 1;
  IF FOUND THEN
    SELECT count(DISTINCT user_id) INTO v_cohort FROM growth_events
     WHERE event_type='user_signed_up'
       AND created_at >= now() - ((r.lookback_days + 3) || ' days')::interval
       AND created_at <  now() - '3 days'::interval;
    SELECT count(DISTINCT s.user_id) INTO v_d3_returned FROM growth_events s
     WHERE s.event_type='user_signed_up'
       AND s.created_at >= now() - ((r.lookback_days + 3) || ' days')::interval
       AND s.created_at <  now() - '3 days'::interval
       AND EXISTS (SELECT 1 FROM growth_events a
         WHERE a.user_id=s.user_id
           AND a.event_type IN ('challenge_completed','first_challenge_completed','result_shared')
           AND a.created_at >= s.created_at + '2 days'::interval
           AND a.created_at <  s.created_at + '4 days'::interval);
    v_d3_rate := CASE WHEN v_cohort > 0 THEN (v_d3_returned::numeric / v_cohort)*100 ELSE NULL END;
    v_threshold := r.threshold_value;
    IF v_d3_rate IS NOT NULL AND v_d3_rate < v_threshold THEN
      v_delta := v_d3_rate - v_threshold;
      v_severity := classify_severity((v_threshold - v_d3_rate));
      PERFORM upsert_insight('retention', v_severity,
        'ضعف الاحتفاظ في اليوم الثالث: ' || round(v_d3_rate,1) || '%',
        v_d3_returned || ' من ' || v_cohort || ' مستخدم عادوا في اليوم الثالث. الكوهورت لا يبقى نشطاً.',
        r.recommendation_template, 'retention_d3',
        v_d3_rate, v_threshold, v_delta,
        jsonb_build_object('cohort', v_cohort, 'returned', v_d3_returned, 'window_days', r.lookback_days),
        'retention_d3_low');
      v_created := v_created + 1;
      active_keys := array_append(active_keys, 'retention_d3_low');
    END IF;
  END IF;

  WITH resolved AS (
    UPDATE automation_insights SET status='resolved', resolved_at=now()
     WHERE status='active'
       AND dedupe_key NOT IN (SELECT unnest(active_keys))
       AND insight_type IN ('activation','share','referral','retention')
    RETURNING id
  ) SELECT count(*) INTO v_resolved FROM resolved;

  INSERT INTO automation_actions_log (action_type, action_payload, note)
  VALUES ('analysis_run',
    jsonb_build_object('created_or_updated', v_created, 'auto_resolved', v_resolved, 'active_keys', active_keys),
    'analyze_growth_insights run');

  RETURN jsonb_build_object('success', true, 'created_or_updated', v_created,
    'auto_resolved', v_resolved, 'active_keys', active_keys, 'ran_at', now());
END $$;

CREATE FUNCTION public.apply_wallet_transaction() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_balance NUMERIC;
BEGIN
  SELECT balance INTO v_balance FROM public.wallets WHERE id = NEW.wallet_id FOR UPDATE;
  IF v_balance IS NULL THEN RAISE EXCEPTION 'Wallet not found'; END IF;

  IF NEW.type IN ('deposit', 'refund') THEN
    v_balance := v_balance + NEW.amount;
    UPDATE public.wallets SET balance = v_balance, total_deposited = total_deposited + NEW.amount, updated_at = now() WHERE id = NEW.wallet_id;
  ELSIF NEW.type IN ('withdrawal', 'payment') THEN
    IF v_balance < NEW.amount THEN RAISE EXCEPTION 'Insufficient balance'; END IF;
    v_balance := v_balance - NEW.amount;
    UPDATE public.wallets SET balance = v_balance, total_spent = total_spent + NEW.amount, updated_at = now() WHERE id = NEW.wallet_id;
  ELSIF NEW.type = 'adjustment' THEN
    v_balance := v_balance + NEW.amount;
    UPDATE public.wallets SET balance = v_balance, updated_at = now() WHERE id = NEW.wallet_id;
  END IF;

  NEW.balance_after := v_balance;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.archive_experiment(p_experiment_id uuid) RETURNS public.experiments
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_exp public.experiments%ROWTYPE; v_before JSONB; BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT * INTO v_exp FROM public.experiments WHERE id = p_experiment_id FOR UPDATE;
  v_before := to_jsonb(v_exp);
  UPDATE public.experiments SET status='archived' WHERE id=p_experiment_id RETURNING * INTO v_exp;
  INSERT INTO public.experiment_audit_logs(experiment_id, action_type, actor_user_id, before_state, after_state)
    VALUES (p_experiment_id, 'archive_experiment', auth.uid(), v_before, to_jsonb(v_exp));
  RETURN v_exp;
END; $$;

CREATE FUNCTION public.assign_experiment_variant(p_experiment_key text, p_user_id uuid DEFAULT NULL::uuid, p_anonymous_id text DEFAULT NULL::text, p_context jsonb DEFAULT '{}'::jsonb) RETURNS TABLE(variant_id uuid, variant_key text, config_payload jsonb, is_control boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_exp public.experiments%ROWTYPE;
  v_existing UUID;
  v_bucket NUMERIC;
  v_cum NUMERIC := 0;
  v_chosen UUID;
  v_seed TEXT;
  v_hash NUMERIC;
  r RECORD;
BEGIN
  SELECT * INTO v_exp FROM public.experiments WHERE experiment_key = p_experiment_key;
  IF NOT FOUND OR v_exp.status NOT IN ('running','completed') THEN
    RETURN;
  END IF;

  IF v_exp.status = 'completed' AND v_exp.winner_variant_id IS NOT NULL THEN
    RETURN QUERY
      SELECT v.id, v.variant_key, v.config_payload, v.is_control
      FROM public.experiment_variants v WHERE v.id = v_exp.winner_variant_id;
    RETURN;
  END IF;

  IF p_user_id IS NOT NULL THEN
    SELECT a.variant_id INTO v_existing FROM public.experiment_assignments a
      WHERE a.experiment_id = v_exp.id AND a.user_id = p_user_id LIMIT 1;
  ELSIF p_anonymous_id IS NOT NULL THEN
    SELECT a.variant_id INTO v_existing FROM public.experiment_assignments a
      WHERE a.experiment_id = v_exp.id AND a.anonymous_id = p_anonymous_id AND a.user_id IS NULL LIMIT 1;
  END IF;

  IF v_existing IS NOT NULL THEN
    RETURN QUERY
      SELECT v.id, v.variant_key, v.config_payload, v.is_control
      FROM public.experiment_variants v WHERE v.id = v_existing;
    RETURN;
  END IF;

  v_seed := v_exp.id::text || ':' || COALESCE(p_user_id::text, p_anonymous_id, gen_random_uuid()::text);
  v_hash := ('x' || substr(md5(v_seed), 1, 8))::bit(32)::bigint;
  v_bucket := (v_hash % 10000)::numeric / 100.0; -- 0..99.99

  IF v_bucket >= v_exp.traffic_allocation_percentage THEN
    RETURN; -- excluded from experiment
  END IF;

  FOR r IN SELECT id, allocation_percentage FROM public.experiment_variants
           WHERE experiment_id = v_exp.id ORDER BY is_control DESC, created_at ASC LOOP
    v_cum := v_cum + r.allocation_percentage;
    IF (v_bucket / NULLIF(v_exp.traffic_allocation_percentage,0)) * 100 < v_cum THEN
      v_chosen := r.id;
      EXIT;
    END IF;
  END LOOP;

  IF v_chosen IS NULL THEN
    SELECT id INTO v_chosen FROM public.experiment_variants
      WHERE experiment_id = v_exp.id ORDER BY is_control DESC LIMIT 1;
  END IF;

  INSERT INTO public.experiment_assignments(experiment_id, variant_id, user_id, anonymous_id, source_context)
    VALUES (v_exp.id, v_chosen, p_user_id, CASE WHEN p_user_id IS NULL THEN p_anonymous_id END, COALESCE(p_context,'{}'::jsonb))
    ON CONFLICT DO NOTHING;

  RETURN QUERY
    SELECT v.id, v.variant_key, v.config_payload, v.is_control
    FROM public.experiment_variants v WHERE v.id = v_chosen;
END;
$$;

CREATE FUNCTION public.auto_ticket_for_overdue_invoice() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  existing_ticket_id uuid;
BEGIN
  IF NEW.status IN ('overdue', 'unpaid', 'sent') 
     AND NEW.due_date IS NOT NULL 
     AND NEW.due_date < CURRENT_DATE 
     AND NEW.user_id IS NOT NULL
     AND COALESCE(NEW.paid_amount, 0) < COALESCE(NEW.total_amount, 0) THEN
    
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
$$;

CREATE FUNCTION public.auto_ticket_for_unsigned_contract() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
$$;

CREATE FUNCTION public.before_group_member_insert() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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

CREATE FUNCTION public.bq_1v1_accept_friend_invite(p_invite_code text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user uuid := auth.uid();
  v_invite public.battle_quiz_1v1_friend_invites%ROWTYPE;
  v_room_id uuid;
  v_match_id uuid;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthenticated');
  END IF;

  SELECT * INTO v_invite FROM public.battle_quiz_1v1_friend_invites
  WHERE invite_code = upper(p_invite_code) FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'invite_not_found');
  END IF;

  IF v_invite.status <> 'pending' THEN
    RETURN jsonb_build_object('error', 'invite_already_used', 'status', v_invite.status,
      'match_id', v_invite.match_id);
  END IF;

  IF v_invite.expires_at < now() THEN
    UPDATE public.battle_quiz_1v1_friend_invites SET status = 'expired', updated_at = now()
    WHERE id = v_invite.id;
    RETURN jsonb_build_object('error', 'invite_expired');
  END IF;

  IF v_invite.inviter_id = v_user THEN
    RETURN jsonb_build_object('error', 'cannot_accept_own_invite');
  END IF;

  SELECT id INTO v_room_id FROM public.battle_quiz_rooms
  WHERE status = 'active'
  ORDER BY created_at DESC LIMIT 1;

  IF v_room_id IS NULL THEN
    RETURN jsonb_build_object('error', 'no_room_available');
  END IF;

  INSERT INTO public.battle_quiz_1v1_matches (
    room_id, category, player_a_id, player_b_id, status, mode, invite_id
  ) VALUES (
    v_room_id, v_invite.category, v_invite.inviter_id, v_user, 'active', v_invite.mode, v_invite.id
  ) RETURNING id INTO v_match_id;

  UPDATE public.battle_quiz_1v1_friend_invites
  SET status = 'accepted', invitee_id = v_user, match_id = v_match_id, accepted_at = now(), updated_at = now()
  WHERE id = v_invite.id;

  RETURN jsonb_build_object(
    'match_id', v_match_id,
    'room_id', v_room_id,
    'opponent_id', v_invite.inviter_id,
    'mode', v_invite.mode
  );
END;
$$;

CREATE FUNCTION public.bq_1v1_cancel_queue() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('error','not_authenticated'); END IF;
  UPDATE public.battle_quiz_1v1_queue SET status='cancelled' WHERE user_id=v_uid AND status='waiting';
  RETURN jsonb_build_object('ok',true);
END; $$;

CREATE FUNCTION public.bq_1v1_enqueue(p_category text DEFAULT 'general'::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_uid uuid := auth.uid(); v_opponent record; v_room_id uuid; v_match_id uuid;
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('error','not_authenticated'); END IF;
  UPDATE public.battle_quiz_1v1_queue SET status='cancelled' WHERE user_id=v_uid AND status='waiting';
  SELECT * INTO v_opponent FROM public.battle_quiz_1v1_queue
    WHERE status='waiting' AND category=p_category AND user_id<>v_uid
      AND created_at > now() - interval '2 minutes'
    ORDER BY created_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED;
  IF v_opponent.id IS NOT NULL THEN
    SELECT id INTO v_room_id FROM public.battle_quiz_rooms
      WHERE status='active' AND category=p_category ORDER BY created_at DESC LIMIT 1;
    IF v_room_id IS NULL THEN
      SELECT id INTO v_room_id FROM public.battle_quiz_rooms WHERE status='active' ORDER BY created_at DESC LIMIT 1;
    END IF;
    IF v_room_id IS NULL THEN RETURN jsonb_build_object('error','no_active_room'); END IF;
    INSERT INTO public.battle_quiz_1v1_matches(room_id,category,player_a_id,player_b_id)
    VALUES (v_room_id,p_category,v_opponent.user_id,v_uid) RETURNING id INTO v_match_id;
    UPDATE public.battle_quiz_1v1_queue
      SET status='matched', matched_with_user_id=v_uid, match_id=v_match_id WHERE id=v_opponent.id;
    RETURN jsonb_build_object('matched',true,'match_id',v_match_id,'room_id',v_room_id,'opponent_id',v_opponent.user_id);
  END IF;
  INSERT INTO public.battle_quiz_1v1_queue(user_id,category) VALUES (v_uid,p_category);
  RETURN jsonb_build_object('matched',false,'waiting',true);
END; $$;

CREATE FUNCTION public.bq_1v1_finalize(p_match_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_match record; v_winner uuid; v_status public.bq_1v1_match_status;
  v_a_done boolean; v_b_done boolean; v_a_idle boolean; v_b_idle boolean;
  v_ra integer; v_rb integer; v_ea numeric; v_sa numeric; v_sb numeric;
  v_k integer := 24; v_delta integer;
BEGIN
  SELECT * INTO v_match FROM public.battle_quiz_1v1_matches WHERE id=p_match_id FOR UPDATE;
  IF v_match.id IS NULL THEN RETURN jsonb_build_object('error','match_not_found'); END IF;
  IF v_match.status<>'active' THEN RETURN jsonb_build_object('already_finalized',true,'status',v_match.status); END IF;
  v_a_done := v_match.player_a_finished_at IS NOT NULL;
  v_b_done := v_match.player_b_finished_at IS NOT NULL;
  v_a_idle := v_match.player_a_last_seen < now() - interval '30 seconds';
  v_b_idle := v_match.player_b_last_seen < now() - interval '30 seconds';
  IF v_a_done AND v_b_done THEN v_status:='completed';
  ELSIF v_a_done AND v_b_idle THEN v_status:='abandoned'; v_winner:=v_match.player_a_id;
  ELSIF v_b_done AND v_a_idle THEN v_status:='abandoned'; v_winner:=v_match.player_b_id;
  ELSIF v_a_idle AND v_b_idle THEN v_status:='expired';
  ELSE RETURN jsonb_build_object('pending',true); END IF;
  IF v_status='completed' THEN
    IF v_match.player_a_score > v_match.player_b_score THEN v_winner:=v_match.player_a_id;
    ELSIF v_match.player_b_score > v_match.player_a_score THEN v_winner:=v_match.player_b_id;
    ELSIF v_match.player_a_time_ms < v_match.player_b_time_ms THEN v_winner:=v_match.player_a_id;
    ELSIF v_match.player_b_time_ms < v_match.player_a_time_ms THEN v_winner:=v_match.player_b_id;
    ELSE v_winner:=NULL; END IF;
  END IF;
  IF v_status IN ('completed','abandoned') THEN
    INSERT INTO public.battle_quiz_1v1_ratings(user_id) VALUES (v_match.player_a_id) ON CONFLICT DO NOTHING;
    INSERT INTO public.battle_quiz_1v1_ratings(user_id) VALUES (v_match.player_b_id) ON CONFLICT DO NOTHING;
    SELECT rating INTO v_ra FROM public.battle_quiz_1v1_ratings WHERE user_id=v_match.player_a_id;
    SELECT rating INTO v_rb FROM public.battle_quiz_1v1_ratings WHERE user_id=v_match.player_b_id;
    v_ea := 1.0/(1.0+power(10,(v_rb-v_ra)/400.0));
    IF v_winner IS NULL THEN v_sa:=0.5; v_sb:=0.5;
    ELSIF v_winner=v_match.player_a_id THEN v_sa:=1; v_sb:=0;
    ELSE v_sa:=0; v_sb:=1; END IF;
    v_delta := round(v_k*(v_sa-v_ea));
    UPDATE public.battle_quiz_1v1_ratings SET
      rating=rating+v_delta,
      wins=wins+(CASE WHEN v_winner=v_match.player_a_id THEN 1 ELSE 0 END),
      losses=losses+(CASE WHEN v_winner=v_match.player_b_id THEN 1 ELSE 0 END),
      draws=draws+(CASE WHEN v_winner IS NULL THEN 1 ELSE 0 END),
      current_streak=CASE WHEN v_winner=v_match.player_a_id THEN current_streak+1 ELSE 0 END,
      best_streak=GREATEST(best_streak, CASE WHEN v_winner=v_match.player_a_id THEN current_streak+1 ELSE best_streak END),
      matches_played=matches_played+1, last_match_at=now()
    WHERE user_id=v_match.player_a_id;
    UPDATE public.battle_quiz_1v1_ratings SET
      rating=rating-v_delta,
      wins=wins+(CASE WHEN v_winner=v_match.player_b_id THEN 1 ELSE 0 END),
      losses=losses+(CASE WHEN v_winner=v_match.player_a_id THEN 1 ELSE 0 END),
      draws=draws+(CASE WHEN v_winner IS NULL THEN 1 ELSE 0 END),
      current_streak=CASE WHEN v_winner=v_match.player_b_id THEN current_streak+1 ELSE 0 END,
      best_streak=GREATEST(best_streak, CASE WHEN v_winner=v_match.player_b_id THEN current_streak+1 ELSE best_streak END),
      matches_played=matches_played+1, last_match_at=now()
    WHERE user_id=v_match.player_b_id;
  END IF;
  UPDATE public.battle_quiz_1v1_matches SET
    status=v_status, winner_id=v_winner, rating_delta=COALESCE(v_delta,0), finalized_at=now()
  WHERE id=p_match_id;
  RETURN jsonb_build_object('finalized',true,'status',v_status,'winner_id',v_winner,'rating_delta',COALESCE(v_delta,0));
END; $$;

CREATE FUNCTION public.bq_1v1_get_leaderboard(p_limit integer DEFAULT 50) RETURNS TABLE(rank integer, user_id uuid, rating integer, wins integer, losses integer, draws integer, matches_played integer, current_streak integer, best_streak integer, display_name text, avatar_url text)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT
    (ROW_NUMBER() OVER (ORDER BY r.rating DESC, r.wins DESC))::int AS rank,
    r.user_id, r.rating, r.wins, r.losses, r.draws,
    r.matches_played, r.current_streak, r.best_streak,
    COALESCE(p.full_name, 'لاعب') AS display_name,
    p.avatar_url
  FROM public.battle_quiz_1v1_ratings r
  LEFT JOIN public.profiles p ON p.id = r.user_id
  WHERE r.matches_played > 0
  ORDER BY r.rating DESC, r.wins DESC
  LIMIT p_limit;
$$;

CREATE FUNCTION public.bq_1v1_heartbeat(p_match_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_uid uuid := auth.uid(); v_match record;
BEGIN
  SELECT * INTO v_match FROM public.battle_quiz_1v1_matches WHERE id=p_match_id;
  IF v_match.id IS NULL OR v_uid IS NULL THEN RETURN; END IF;
  IF v_uid=v_match.player_a_id THEN
    UPDATE public.battle_quiz_1v1_matches SET player_a_last_seen=now() WHERE id=p_match_id;
  ELSIF v_uid=v_match.player_b_id THEN
    UPDATE public.battle_quiz_1v1_matches SET player_b_last_seen=now() WHERE id=p_match_id;
  END IF;
END; $$;

CREATE FUNCTION public.bq_1v1_request_rematch(p_match_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user uuid := auth.uid();
  v_old public.battle_quiz_1v1_matches%ROWTYPE;
  v_new_id uuid;
  v_existing_rematch uuid;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthenticated');
  END IF;

  SELECT * INTO v_old FROM public.battle_quiz_1v1_matches WHERE id = p_match_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'match_not_found');
  END IF;

  IF v_user NOT IN (v_old.player_a_id, v_old.player_b_id) THEN
    RETURN jsonb_build_object('error', 'not_a_participant');
  END IF;

  IF v_old.status <> 'completed' THEN
    RETURN jsonb_build_object('error', 'match_not_completed');
  END IF;

  SELECT id INTO v_existing_rematch FROM public.battle_quiz_1v1_matches
  WHERE rematch_of_match_id = p_match_id LIMIT 1;
  IF v_existing_rematch IS NOT NULL THEN
    RETURN jsonb_build_object('match_id', v_existing_rematch, 'already_exists', true);
  END IF;

  IF v_old.rematch_request_by IS NULL THEN
    UPDATE public.battle_quiz_1v1_matches SET rematch_request_by = v_user, updated_at = now()
    WHERE id = p_match_id;
    RETURN jsonb_build_object('waiting', true, 'requested_by', v_user);
  END IF;

  IF v_old.rematch_request_by = v_user THEN
    RETURN jsonb_build_object('waiting', true, 'already_requested', true);
  END IF;

  INSERT INTO public.battle_quiz_1v1_matches (
    room_id, category, player_a_id, player_b_id, status, mode, rematch_of_match_id
  ) VALUES (
    v_old.room_id, v_old.category, v_old.player_a_id, v_old.player_b_id, 'active', v_old.mode, v_old.id
  ) RETURNING id INTO v_new_id;

  RETURN jsonb_build_object('match_id', v_new_id, 'created', true);
END;
$$;

CREATE FUNCTION public.bq_1v1_submit_score(p_match_id uuid, p_attempt_id uuid, p_score integer, p_correct integer, p_total_time_ms integer) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_uid uuid := auth.uid(); v_match record;
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('error','not_authenticated'); END IF;
  SELECT * INTO v_match FROM public.battle_quiz_1v1_matches WHERE id=p_match_id FOR UPDATE;
  IF v_match.id IS NULL THEN RETURN jsonb_build_object('error','match_not_found'); END IF;
  IF v_uid NOT IN (v_match.player_a_id, v_match.player_b_id) THEN RETURN jsonb_build_object('error','not_a_player'); END IF;
  IF v_uid=v_match.player_a_id THEN
    UPDATE public.battle_quiz_1v1_matches SET
      player_a_score=p_score, player_a_correct=p_correct, player_a_time_ms=p_total_time_ms,
      player_a_attempt_id=p_attempt_id, player_a_finished_at=now(), player_a_last_seen=now()
    WHERE id=p_match_id;
  ELSE
    UPDATE public.battle_quiz_1v1_matches SET
      player_b_score=p_score, player_b_correct=p_correct, player_b_time_ms=p_total_time_ms,
      player_b_attempt_id=p_attempt_id, player_b_finished_at=now(), player_b_last_seen=now()
    WHERE id=p_match_id;
  END IF;
  PERFORM public.bq_1v1_finalize(p_match_id);
  RETURN jsonb_build_object('ok',true);
END; $$;

CREATE FUNCTION public.bq_bump_missions_on_1v1_finalize() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    INSERT INTO public.battle_quiz_user_missions (user_id, mission_id, mission_date)
    SELECT NEW.player_a_id, m.id, v_today FROM public.battle_quiz_daily_missions m WHERE m.is_active
    ON CONFLICT DO NOTHING;
    INSERT INTO public.battle_quiz_user_missions (user_id, mission_id, mission_date)
    SELECT NEW.player_b_id, m.id, v_today FROM public.battle_quiz_daily_missions m WHERE m.is_active
    ON CONFLICT DO NOTHING;

    UPDATE public.battle_quiz_user_missions um
    SET progress = LEAST(um.progress + 1, m.target_value),
        is_completed = CASE WHEN um.progress + 1 >= m.target_value THEN true ELSE um.is_completed END,
        completed_at = CASE WHEN um.progress + 1 >= m.target_value AND um.completed_at IS NULL THEN now() ELSE um.completed_at END,
        updated_at = now()
    FROM public.battle_quiz_daily_missions m
    WHERE um.mission_id = m.id
      AND um.mission_date = v_today
      AND um.is_completed = false
      AND um.user_id IN (NEW.player_a_id, NEW.player_b_id)
      AND m.mission_type = 'play_matches'
      AND (m.scope IN ('1v1','any') OR m.scope = NEW.mode::text);

    IF NEW.mode = 'blitz' THEN
      UPDATE public.battle_quiz_user_missions um
      SET progress = LEAST(um.progress + 1, m.target_value),
          is_completed = CASE WHEN um.progress + 1 >= m.target_value THEN true ELSE um.is_completed END,
          completed_at = CASE WHEN um.progress + 1 >= m.target_value AND um.completed_at IS NULL THEN now() ELSE um.completed_at END,
          updated_at = now()
      FROM public.battle_quiz_daily_missions m
      WHERE um.mission_id = m.id
        AND um.mission_date = v_today
        AND um.is_completed = false
        AND um.user_id IN (NEW.player_a_id, NEW.player_b_id)
        AND m.mission_type = 'blitz_matches';
    END IF;

    IF NEW.winner_id IS NOT NULL THEN
      UPDATE public.battle_quiz_user_missions um
      SET progress = LEAST(um.progress + 1, m.target_value),
          is_completed = CASE WHEN um.progress + 1 >= m.target_value THEN true ELSE um.is_completed END,
          completed_at = CASE WHEN um.progress + 1 >= m.target_value AND um.completed_at IS NULL THEN now() ELSE um.completed_at END,
          updated_at = now()
      FROM public.battle_quiz_daily_missions m
      WHERE um.mission_id = m.id
        AND um.mission_date = v_today
        AND um.is_completed = false
        AND um.user_id = NEW.winner_id
        AND m.mission_type = 'win_matches';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.bq_bump_missions_on_invite_accept() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS DISTINCT FROM 'accepted') THEN
    INSERT INTO public.battle_quiz_user_missions (user_id, mission_id, mission_date)
    SELECT NEW.inviter_id, m.id, v_today FROM public.battle_quiz_daily_missions m WHERE m.is_active
    ON CONFLICT DO NOTHING;

    UPDATE public.battle_quiz_user_missions um
    SET progress = LEAST(um.progress + 1, m.target_value),
        is_completed = CASE WHEN um.progress + 1 >= m.target_value THEN true ELSE um.is_completed END,
        completed_at = CASE WHEN um.progress + 1 >= m.target_value AND um.completed_at IS NULL THEN now() ELSE um.completed_at END,
        updated_at = now()
    FROM public.battle_quiz_daily_missions m
    WHERE um.mission_id = m.id
      AND um.mission_date = v_today
      AND um.is_completed = false
      AND um.user_id = NEW.inviter_id
      AND m.mission_type = 'invite_friend';
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.bq_claim_daily_mission(p_user_mission_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user uuid := auth.uid();
  v_um public.battle_quiz_user_missions%ROWTYPE;
  v_xp integer;
BEGIN
  IF v_user IS NULL THEN RETURN jsonb_build_object('error','unauthenticated'); END IF;

  SELECT * INTO v_um FROM public.battle_quiz_user_missions
  WHERE id = p_user_mission_id AND user_id = v_user FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','mission_not_found'); END IF;

  IF NOT v_um.is_completed THEN RETURN jsonb_build_object('error','not_completed'); END IF;
  IF v_um.is_claimed THEN RETURN jsonb_build_object('error','already_claimed'); END IF;

  SELECT xp_reward INTO v_xp FROM public.battle_quiz_daily_missions WHERE id = v_um.mission_id;

  UPDATE public.battle_quiz_user_missions
  SET is_claimed = true, claimed_at = now(), updated_at = now()
  WHERE id = p_user_mission_id;

  BEGIN
    INSERT INTO public.challenge_xp_transactions (user_id, source_type, source_id, xp_amount, description)
    VALUES (v_user, 'battle_quiz_mission', v_um.mission_id, COALESCE(v_xp,0),
            'Daily Battle Quiz mission reward');
  EXCEPTION WHEN OTHERS THEN
    NULL; -- non-fatal if XP table missing
  END;

  RETURN jsonb_build_object('success', true, 'xp_awarded', COALESCE(v_xp,0));
END;
$$;

CREATE FUNCTION public.bq_get_daily_missions() RETURNS TABLE(user_mission_id uuid, mission_id uuid, slug text, title_ar text, description_ar text, icon text, mission_type text, scope text, target_value integer, xp_reward integer, progress integer, is_completed boolean, is_claimed boolean)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user uuid := auth.uid();
  v_today date := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  IF v_user IS NULL THEN RETURN; END IF;

  INSERT INTO public.battle_quiz_user_missions (user_id, mission_id, mission_date)
  SELECT v_user, m.id, v_today
  FROM public.battle_quiz_daily_missions m
  WHERE m.is_active = true
  ON CONFLICT (user_id, mission_id, mission_date) DO NOTHING;

  RETURN QUERY
  SELECT
    um.id, m.id, m.slug, m.title_ar, m.description_ar, m.icon,
    m.mission_type, m.scope, m.target_value, m.xp_reward,
    um.progress, um.is_completed, um.is_claimed
  FROM public.battle_quiz_user_missions um
  JOIN public.battle_quiz_daily_missions m ON m.id = um.mission_id
  WHERE um.user_id = v_user
    AND um.mission_date = v_today
    AND m.is_active = true
  ORDER BY m.sort_order, m.created_at;
END;
$$;

CREATE FUNCTION public.bq_is_admin() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin');
$$;

CREATE FUNCTION public.bq_touch_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE FUNCTION public.build_growth_snapshot() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE _payload jsonb; _today date := current_date;
BEGIN
  SELECT jsonb_build_object(
    'date', _today,
    'signups_7d', (SELECT count(*) FROM growth_events WHERE event_type='user_signed_up' AND created_at >= now() - '7 days'::interval),
    'completed_7d', (SELECT count(*) FROM growth_events WHERE event_type IN ('challenge_completed','first_challenge_completed') AND created_at >= now() - '7 days'::interval),
    'shares_7d', (SELECT count(*) FROM growth_events WHERE event_type='result_shared' AND created_at >= now() - '7 days'::interval),
    'invites_14d', (SELECT count(*) FROM referrals WHERE created_at >= now() - '14 days'::interval),
    'referrals_completed_14d', (SELECT count(*) FROM referrals WHERE status='completed' AND created_at >= now() - '14 days'::interval)
  ) INTO _payload;
  INSERT INTO automation_snapshots (snapshot_date, metrics_payload)
  VALUES (_today, _payload)
  ON CONFLICT (snapshot_date) DO UPDATE SET metrics_payload = EXCLUDED.metrics_payload;
  RETURN jsonb_build_object('success', true, 'snapshot_date', _today);
END $$;

CREATE FUNCTION public.bump_inbox_message_on_reply() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.inbox_messages
  SET reply_count = reply_count + 1,
      last_activity_at = now(),
      status = CASE WHEN status IN ('new','open') THEN 'replied' ELSE status END
  WHERE id = NEW.message_id;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.bump_referral_clicks() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.user_referrals
     SET total_clicks = total_clicks + 1,
         updated_at = now()
   WHERE ref_code = NEW.ref_code;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.bump_referral_conversions() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.type = 'signup' THEN
    UPDATE public.user_referrals
       SET total_signups = total_signups + 1,
           updated_at = now()
     WHERE ref_code = NEW.ref_code;
  ELSIF NEW.type = 'order' THEN
    UPDATE public.user_referrals
       SET total_orders = total_orders + 1,
           updated_at = now()
     WHERE ref_code = NEW.ref_code;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.calc_financing_amounts() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
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

CREATE FUNCTION public.cancel_group_order(_group_order_id uuid, _reason text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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

CREATE FUNCTION public.challenge_submit(p_user_id uuid, p_challenge_id uuid, p_answer text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_challenge RECORD;
  v_correct BOOLEAN := false;
  v_xp INTEGER := 0;
  v_existing UUID;
  v_streak RECORD;
  v_total INT;
BEGIN
  SELECT * INTO v_challenge FROM public.challenge_daily_challenges WHERE id = p_challenge_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'التحدي غير موجود');
  END IF;

  SELECT id INTO v_existing FROM public.challenge_submissions WHERE user_id = p_user_id AND challenge_id = p_challenge_id;
  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'تم إرسال إجابتك مسبقاً');
  END IF;

  IF v_challenge.type = 'quiz' THEN
    v_correct := (LOWER(TRIM(COALESCE(p_answer, ''))) = LOWER(TRIM(COALESCE(v_challenge.correct_answer, ''))));
    v_xp := CASE WHEN v_correct THEN v_challenge.xp_reward ELSE FLOOR(v_challenge.xp_reward * 0.2) END;
  ELSE
    v_correct := true;
    v_xp := v_challenge.xp_reward;
  END IF;

  INSERT INTO public.challenge_submissions (user_id, challenge_id, answer, is_correct, xp_awarded)
  VALUES (p_user_id, p_challenge_id, p_answer, v_correct, v_xp);

  v_total := public.challenge_award_xp(p_user_id, v_xp, 'daily_challenge', p_challenge_id, v_challenge.title_ar);
  SELECT * INTO v_streak FROM public.challenge_update_streak(p_user_id);

  RETURN jsonb_build_object(
    'success', true,
    'is_correct', v_correct,
    'xp_awarded', v_xp,
    'total_xp', v_total,
    'current_streak', v_streak.current_streak,
    'explanation', v_challenge.explanation_ar,
    'correct_answer', v_challenge.correct_answer
  );
END;
$$;

CREATE FUNCTION public.challenge_update_streak(p_user_id uuid) RETURNS TABLE(current_streak integer, longest_streak integer)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_last DATE;
  v_current INT;
  v_longest INT;
BEGIN
  SELECT s.last_activity_date, s.current_streak, s.longest_streak
    INTO v_last, v_current, v_longest
  FROM public.challenge_streaks s WHERE s.user_id = p_user_id;

  IF v_last IS NULL THEN
    INSERT INTO public.challenge_streaks (user_id, current_streak, longest_streak, last_activity_date, total_active_days)
    VALUES (p_user_id, 1, 1, v_today, 1);
    RETURN QUERY SELECT 1, 1;
    RETURN;
  END IF;

  IF v_last = v_today THEN
    RETURN QUERY SELECT v_current, v_longest;
    RETURN;
  END IF;

  IF v_last = v_today - INTERVAL '1 day' THEN
    v_current := v_current + 1;
  ELSE
    v_current := 1;
  END IF;

  v_longest := GREATEST(v_longest, v_current);

  UPDATE public.challenge_streaks
    SET current_streak = v_current,
        longest_streak = v_longest,
        last_activity_date = v_today,
        total_active_days = total_active_days + 1,
        updated_at = now()
  WHERE user_id = p_user_id;

  RETURN QUERY SELECT v_current, v_longest;
END;
$$;

CREATE FUNCTION public.check_in_study_challenge(p_minutes integer DEFAULT 30) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user UUID := auth.uid();
  v_attempt RECORD;
  v_today DATE := (now() AT TIME ZONE 'Asia/Riyadh')::date;
  v_new_day INTEGER;
  v_xp INTEGER := 0;
  v_points INTEGER := 0;
  v_completed BOOLEAN := false;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success',false,'error','not_authenticated');
  END IF;

  IF p_minutes < 30 THEN
    RETURN jsonb_build_object('success',false,'error','min_30_minutes_required');
  END IF;

  SELECT * INTO v_attempt FROM public.study_challenge_attempts
   WHERE user_id = v_user AND status = 'in_progress'
   ORDER BY created_at DESC LIMIT 1 FOR UPDATE;

  IF v_attempt.id IS NULL THEN
    RETURN jsonb_build_object('success',false,'error','no_active_attempt');
  END IF;

  IF v_attempt.last_check_in_on = v_today THEN
    RETURN jsonb_build_object('success',false,'error','already_checked_in_today');
  END IF;

  IF v_attempt.last_check_in_on IS NOT NULL
     AND v_attempt.last_check_in_on < v_today - INTERVAL '1 day' THEN
    UPDATE public.study_challenge_attempts
       SET status='failed', failed_at=now(), streak=0
     WHERE id = v_attempt.id;
    RETURN jsonb_build_object('success',false,'error','challenge_failed');
  END IF;

  v_new_day := v_attempt.current_day + 1;
  v_completed := (v_new_day >= v_attempt.required_days);

  INSERT INTO public.study_challenge_check_ins (attempt_id, user_id, day_number, check_in_date, minutes_studied)
  VALUES (v_attempt.id, v_user, v_new_day, v_today, p_minutes);

  IF v_completed THEN
    v_xp := 700; v_points := 350;
    UPDATE public.study_challenge_attempts
       SET current_day = v_new_day, streak = v_new_day,
           last_check_in_on = v_today, status = 'completed',
           completed_at = now(), xp_awarded = v_xp, points_awarded = v_points,
           badge_awarded = 'elite_student'
     WHERE id = v_attempt.id;
  ELSE
    UPDATE public.study_challenge_attempts
       SET current_day = v_new_day, streak = v_new_day, last_check_in_on = v_today
     WHERE id = v_attempt.id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'current_day', v_new_day,
    'streak', v_new_day,
    'completed', v_completed,
    'xp_awarded', v_xp,
    'points_awarded', v_points,
    'badge', CASE WHEN v_completed THEN 'elite_student' ELSE NULL END
  );
END; $$;

CREATE FUNCTION public.claim_referral(_ref_code text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  current_uid       UUID := auth.uid();
  referrer_uid      UUID;
  new_referral_id   UUID;
  existing_id       UUID;
BEGIN
  IF current_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_authenticated');
  END IF;

  IF _ref_code IS NULL OR length(trim(_ref_code)) = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_code');
  END IF;

  PERFORM public.ensure_referral_code(current_uid);

  SELECT id INTO existing_id FROM public.referrals WHERE referred_user_id = current_uid;
  IF existing_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_claimed', true, 'referral_id', existing_id);
  END IF;

  SELECT user_id INTO referrer_uid
  FROM public.user_referral_codes
  WHERE code = upper(trim(_ref_code));

  IF referrer_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'code_not_found');
  END IF;

  IF referrer_uid = current_uid THEN
    RETURN jsonb_build_object('success', false, 'error', 'self_referral');
  END IF;

  INSERT INTO public.referrals (referrer_user_id, referred_user_id, referral_code, status)
  VALUES (referrer_uid, current_uid, upper(trim(_ref_code)), 'pending')
  RETURNING id INTO new_referral_id;

  PERFORM public.grant_referral_xp(referrer_uid, 100, 'signup_bonus_referrer', new_referral_id, 'مكافأة تسجيل صديق جديد');
  PERFORM public.grant_referral_xp(current_uid,  50,  'signup_bonus_referred', new_referral_id, 'مكافأة تسجيلك عبر دعوة');

  RETURN jsonb_build_object(
    'success', true,
    'referral_id', new_referral_id,
    'referrer_xp', 100,
    'referred_xp', 50
  );
END;
$$;

CREATE FUNCTION public.classify_severity(_delta_pct numeric) RETURNS text
    LANGUAGE sql IMMUTABLE
    SET search_path TO 'public'
    AS $$
  SELECT CASE
    WHEN _delta_pct IS NULL THEN 'low'
    WHEN abs(_delta_pct) >= 50 THEN 'critical'
    WHEN abs(_delta_pct) >= 30 THEN 'high'
    WHEN abs(_delta_pct) >= 15 THEN 'medium'
    ELSE 'low'
  END
$$;

CREATE FUNCTION public.client_confirm_delivery(_order_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_order record;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  SELECT * INTO v_order FROM public.service_orders WHERE id = _order_id;
  IF v_order.id IS NULL THEN RAISE EXCEPTION 'الطلب غير موجود'; END IF;
  IF v_order.user_id <> auth.uid() THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF v_order.lifecycle_status <> 'delivered' THEN RAISE EXCEPTION 'الطلب لم يُسلّم بعد'; END IF;
  UPDATE public.service_orders
     SET lifecycle_status = 'completed', client_confirmed_at = now(), updated_at = now()
   WHERE id = _order_id;
  RETURN jsonb_build_object('ok', true, 'order_id', _order_id);
END;
$$;

CREATE FUNCTION public.complete_experiment(p_experiment_id uuid, p_winner_variant_id uuid DEFAULT NULL::uuid, p_note text DEFAULT NULL::text) RETURNS public.experiments
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_exp public.experiments%ROWTYPE; v_before JSONB; BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT * INTO v_exp FROM public.experiments WHERE id = p_experiment_id FOR UPDATE;
  IF v_exp.status NOT IN ('running','paused') THEN RAISE EXCEPTION 'invalid status'; END IF;
  IF p_winner_variant_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.experiment_variants WHERE id=p_winner_variant_id AND experiment_id=p_experiment_id) THEN
    RAISE EXCEPTION 'winner variant does not belong to experiment';
  END IF;
  v_before := to_jsonb(v_exp);
  UPDATE public.experiments SET status='completed', end_at=now(), winner_variant_id=p_winner_variant_id WHERE id=p_experiment_id RETURNING * INTO v_exp;
  INSERT INTO public.experiment_audit_logs(experiment_id, action_type, actor_user_id, before_state, after_state, note)
    VALUES (p_experiment_id, CASE WHEN p_winner_variant_id IS NULL THEN 'complete_experiment' ELSE 'select_winner' END, auth.uid(), v_before, to_jsonb(v_exp), p_note);
  RETURN v_exp;
END; $$;

CREATE FUNCTION public.complete_referral_on_first_challenge() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  ref_row     public.referrals%ROWTYPE;
  prior_count INTEGER;
BEGIN
  IF NEW.status <> 'completed' THEN
    RETURN NEW;
  END IF;

  SELECT * INTO ref_row FROM public.referrals
  WHERE referred_user_id = NEW.user_id AND status = 'pending';

  IF ref_row.id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO prior_count FROM public.challenge_attempts
  WHERE user_id = NEW.user_id AND status = 'completed' AND id <> NEW.id;

  IF prior_count > 0 THEN
    RETURN NEW;
  END IF;

  UPDATE public.referrals
  SET status = 'completed', completed_at = now()
  WHERE id = ref_row.id;

  PERFORM public.grant_referral_xp(
    ref_row.referrer_user_id, 200, 'challenge_bonus', ref_row.id,
    'مكافأة إكمال أول تحدي للصديق المُحال'
  );

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.compute_experiment_results(p_experiment_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_exp public.experiments%ROWTYPE;
  v_primary TEXT;
  v_control_id UUID;
  v_control_rate NUMERIC := 0;
  v_results JSONB := '[]'::jsonb;
  v_leader UUID;
  v_leader_rate NUMERIC := 0;
  r RECORD;
BEGIN
  SELECT * INTO v_exp FROM public.experiments WHERE id = p_experiment_id;
  IF NOT FOUND THEN RETURN NULL; END IF;
  v_primary := v_exp.primary_metric;

  SELECT id INTO v_control_id FROM public.experiment_variants
    WHERE experiment_id = p_experiment_id AND is_control = true LIMIT 1;

  IF v_control_id IS NOT NULL THEN
    SELECT
      CASE WHEN COUNT(DISTINCT a.id) = 0 THEN 0
           ELSE COUNT(DISTINCT e.id)::numeric / COUNT(DISTINCT a.id)::numeric END
    INTO v_control_rate
    FROM public.experiment_assignments a
    LEFT JOIN public.experiment_events e
      ON e.variant_id = a.variant_id
     AND COALESCE(e.user_id::text, e.anonymous_id) = COALESCE(a.user_id::text, a.anonymous_id)
     AND e.event_type = v_primary
    WHERE a.variant_id = v_control_id;
  END IF;

  FOR r IN
    SELECT v.id, v.variant_key, v.name, v.is_control,
      COUNT(DISTINCT a.id) AS assigned,
      COUNT(DISTINCT CASE WHEN ev.event_type = 'experiment_viewed' THEN ev.id END) AS views,
      COUNT(DISTINCT CASE WHEN ev.event_type = v_primary THEN COALESCE(ev.user_id::text, ev.anonymous_id) END) AS conversions_unique
    FROM public.experiment_variants v
    LEFT JOIN public.experiment_assignments a ON a.variant_id = v.id
    LEFT JOIN public.experiment_events ev ON ev.variant_id = v.id
    WHERE v.experiment_id = p_experiment_id
    GROUP BY v.id, v.variant_key, v.name, v.is_control
  LOOP
    DECLARE
      v_rate NUMERIC := CASE WHEN r.assigned = 0 THEN 0 ELSE r.conversions_unique::numeric / r.assigned::numeric END;
      v_lift NUMERIC := CASE WHEN v_control_rate = 0 THEN NULL ELSE ((v_rate - v_control_rate) / v_control_rate) * 100 END;
      v_z NUMERIC := NULL;
      v_confidence NUMERIC := NULL;
      v_se NUMERIC;
      v_p_pool NUMERIC;
      v_n_c NUMERIC;
      v_c_c NUMERIC;
    BEGIN
      IF NOT r.is_control AND v_control_id IS NOT NULL AND r.assigned > 0 THEN
        SELECT COUNT(DISTINCT a.id), COUNT(DISTINCT CASE WHEN ev.event_type = v_primary THEN COALESCE(ev.user_id::text, ev.anonymous_id) END)
          INTO v_n_c, v_c_c
        FROM public.experiment_assignments a
        LEFT JOIN public.experiment_events ev ON ev.variant_id = a.variant_id
        WHERE a.variant_id = v_control_id;

        IF v_n_c > 0 AND r.assigned > 0 THEN
          v_p_pool := (v_c_c + r.conversions_unique)::numeric / (v_n_c + r.assigned)::numeric;
          v_se := sqrt(v_p_pool * (1 - v_p_pool) * (1.0 / v_n_c + 1.0 / r.assigned));
          IF v_se > 0 THEN
            v_z := (v_rate - (v_c_c::numeric / NULLIF(v_n_c,0))) / v_se;
            v_confidence := (1 - 0.5 * (1 + sign(v_z) * (1 - exp(-0.717 * abs(v_z) - 0.416 * v_z * v_z)))) ;
            v_confidence := (1 - v_confidence) * 100;
          END IF;
        END IF;
      END IF;

      v_results := v_results || jsonb_build_object(
        'variant_id', r.id,
        'variant_key', r.variant_key,
        'name', r.name,
        'is_control', r.is_control,
        'assigned', r.assigned,
        'views', r.views,
        'conversions', r.conversions_unique,
        'conversion_rate', v_rate,
        'lift_pct', v_lift,
        'z_score', v_z,
        'confidence_pct', v_confidence
      );

      IF v_rate > v_leader_rate THEN
        v_leader_rate := v_rate;
        v_leader := r.id;
      END IF;
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'experiment_id', p_experiment_id,
    'primary_metric', v_primary,
    'leader_variant_id', v_leader,
    'control_variant_id', v_control_id,
    'computed_at', now(),
    'min_sample_size', v_exp.min_sample_size,
    'variants', v_results
  );
END;
$$;

CREATE FUNCTION public.compute_order_countdown(_order_id uuid) RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_order public.service_orders;
  v_label text;
  v_deadline timestamptz;
  v_seconds bigint;
BEGIN
  SELECT * INTO v_order FROM public.service_orders WHERE id = _order_id;
  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('active', false);
  END IF;

  IF v_order.lifecycle_status = 'quote_sent' THEN
    v_label := 'انتهاء صلاحية عرض السعر';
    v_deadline := COALESCE(v_order.quote_response_deadline, v_order.quote_sent_at + interval '7 days');
  ELSIF v_order.lifecycle_status = 'contract_pending' THEN
    v_label := 'الموعد النهائي لتوقيع العقد';
    v_deadline := COALESCE(v_order.contract_signature_deadline, v_order.contract_pending_at + interval '5 days');
  ELSIF v_order.lifecycle_status IN ('contract_signed','payment_pending') THEN
    v_label := 'الموعد النهائي للدفع';
    v_deadline := COALESCE(v_order.payment_deadline, v_order.contract_signed_at + interval '3 days');
  ELSIF v_order.lifecycle_status IN ('in_progress','paid') THEN
    v_label := 'موعد التسليم المتوقع';
    v_deadline := v_order.deadline;
  ELSE
    RETURN jsonb_build_object('active', false);
  END IF;

  IF v_deadline IS NULL THEN
    RETURN jsonb_build_object('active', false);
  END IF;

  v_seconds := EXTRACT(EPOCH FROM (v_deadline - now()))::bigint;

  RETURN jsonb_build_object(
    'active', true,
    'label', v_label,
    'deadline', v_deadline,
    'seconds_remaining', v_seconds,
    'expired', v_seconds <= 0,
    'stage', v_order.lifecycle_status::text
  );
END;
$$;

CREATE FUNCTION public.compute_ticket_sla(_priority text, _created timestamp with time zone) RETURNS timestamp with time zone
    LANGUAGE sql IMMUTABLE
    SET search_path TO 'public'
    AS $$
  SELECT _created + CASE _priority
    WHEN 'critical' THEN interval '1 hour'
    WHEN 'high'     THEN interval '4 hours'
    WHEN 'medium'   THEN interval '24 hours'
    WHEN 'low'      THEN interval '72 hours'
    ELSE interval '24 hours'
  END
$$;

CREATE FUNCTION public.create_customer_for_new_profile() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_email text;
  v_phone text;
BEGIN
  SELECT email, raw_user_meta_data->>'phone'
    INTO v_email, v_phone
  FROM auth.users WHERE id = NEW.id;

  INSERT INTO public.customers (user_id, name, email, phone, status)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.full_name, ''), split_part(COALESCE(v_email,''), '@', 1), 'عميل'),
    v_email,
    COALESCE(NEW.phone, v_phone),
    'active'
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.create_deadline_reminders() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.deadline IS NULL OR NEW.user_id IS NULL THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.deadline IS NOT DISTINCT FROM NEW.deadline THEN RETURN NEW; END IF;

  DELETE FROM public.deadline_reminders
   WHERE service_order_id = NEW.id AND sent = false;

  INSERT INTO public.deadline_reminders (user_id, service_order_id, deadline_at, reminder_type, due_at, channel)
  VALUES
    (NEW.user_id, NEW.id, NEW.deadline, '3_days',  NEW.deadline - interval '3 days',  'both'),
    (NEW.user_id, NEW.id, NEW.deadline, '1_day',   NEW.deadline - interval '1 day',   'both'),
    (NEW.user_id, NEW.id, NEW.deadline, '3_hours', NEW.deadline - interval '3 hours', 'both'),
    (NEW.user_id, NEW.id, NEW.deadline, 'overdue', NEW.deadline + interval '1 hour',  'both')
  ON CONFLICT (service_order_id, reminder_type) DO NOTHING;

  RETURN NEW;
END; $$;

CREATE FUNCTION public.create_group_order(_service_id uuid, _title text, _description text, _max_members integer, _deadline timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_id uuid; v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;

  INSERT INTO public.group_orders (creator_id, service_id, title, description, max_members, seat_price, deadline)
  VALUES (v_uid, _service_id, _title, _description, _max_members, 0, _deadline)
  RETURNING id INTO v_id;

  INSERT INTO public.group_order_members (group_order_id, user_id, is_creator, amount_due)
  VALUES (v_id, v_uid, true, (SELECT seat_price FROM public.group_orders WHERE id = v_id));

  INSERT INTO public.group_order_audit (group_order_id, actor_id, action_type, description)
  VALUES (v_id, v_uid, 'created', 'تم إنشاء الطلب الجماعي');

  RETURN v_id;
END$$;

CREATE FUNCTION public.create_wallet_for_new_profile() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.wallets (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.deduct_wallet_on_invoice_payment() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id UUID;
  v_wallet_id UUID;
BEGIN
  IF NEW.payment_method = 'wallet' AND NEW.status = 'completed' THEN
    SELECT user_id INTO v_user_id FROM public.invoices WHERE id = NEW.invoice_id;
    IF v_user_id IS NULL THEN RETURN NEW; END IF;

    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = v_user_id;
    IF v_wallet_id IS NULL THEN RETURN NEW; END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id, created_by)
    VALUES (v_wallet_id, v_user_id, 'payment', NEW.amount,
            'دفع فاتورة عبر المحفظة',
            'invoice', NEW.invoice_id, NEW.created_by);
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.delete_email(queue_name text, message_id bigint) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN pgmq.delete(queue_name, message_id);
EXCEPTION WHEN undefined_table THEN
  RETURN FALSE;
END;
$$;

CREATE FUNCTION public.dismiss_automation_insight(_id uuid, _note text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE _sev text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN jsonb_build_object('success', false, 'error', 'forbidden');
  END IF;
  SELECT severity INTO _sev FROM automation_insights WHERE id=_id;
  IF _sev IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'not_found'); END IF;
  IF _sev IN ('high','critical') AND (_note IS NULL OR length(trim(_note))=0) THEN
    RETURN jsonb_build_object('success', false, 'error', 'note_required_for_high_severity');
  END IF;
  UPDATE automation_insights SET status='dismissed', dismissed_at=now() WHERE id=_id;
  INSERT INTO automation_actions_log (insight_id, action_type, note, created_by, action_payload)
  VALUES (_id, 'dismiss', _note, auth.uid(), jsonb_build_object('severity', _sev));
  RETURN jsonb_build_object('success', true);
END $$;

CREATE FUNCTION public.dispatch_document_send(_kind text, _id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions'
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
  RAISE WARNING 'dispatch_document_send failed: %', SQLERRM;
END;
$$;

CREATE FUNCTION public.dispatch_lifecycle_email() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_supabase_url TEXT;
  v_service_key TEXT;
  v_recipient TEXT;
  v_client_name TEXT;
  v_service_name TEXT;
  v_status_label TEXT;
  v_status_emoji TEXT;
  v_event_type TEXT := 'status';
  v_idempotency TEXT;
  v_payload JSONB;
BEGIN
  IF TG_OP = 'UPDATE' AND (OLD.lifecycle_status IS NOT DISTINCT FROM NEW.lifecycle_status) THEN
    RETURN NEW;
  END IF;

  SELECT c.email, c.name
    INTO v_recipient, v_client_name
  FROM public.customers c
  WHERE c.id = NEW.customer_id;

  IF v_recipient IS NULL OR v_recipient = '' THEN
    RETURN NEW;
  END IF;

  SELECT s.name INTO v_service_name
  FROM public.services s
  WHERE s.id = NEW.service_id;

  CASE NEW.lifecycle_status::text
    WHEN 'received' THEN v_status_label := 'مستلم'; v_status_emoji := '📥';
    WHEN 'reviewing' THEN v_status_label := 'قيد المراجعة'; v_status_emoji := '🔍';
    WHEN 'quote_sent' THEN v_status_label := 'تم إرسال عرض السعر'; v_status_emoji := '💰'; v_event_type := 'quote';
    WHEN 'quote_accepted' THEN v_status_label := 'تم قبول العرض'; v_status_emoji := '✅';
    WHEN 'contract_pending' THEN v_status_label := 'بانتظار توقيع العقد'; v_status_emoji := '📝';
    WHEN 'contract_signed' THEN v_status_label := 'تم توقيع العقد'; v_status_emoji := '✍️';
    WHEN 'payment_pending' THEN v_status_label := 'بانتظار الدفع'; v_status_emoji := '💳';
    WHEN 'payment_received' THEN v_status_label := 'تم استلام الدفعة'; v_status_emoji := '💵';
    WHEN 'in_progress' THEN v_status_label := 'قيد التنفيذ'; v_status_emoji := '⚡';
    WHEN 'delivered' THEN v_status_label := 'تم التسليم'; v_status_emoji := '📦'; v_event_type := 'completed';
    WHEN 'completed' THEN v_status_label := 'مكتمل'; v_status_emoji := '🎉'; v_event_type := 'completed';
    WHEN 'cancelled' THEN v_status_label := 'ملغي'; v_status_emoji := '❌';
    ELSE v_status_label := NEW.lifecycle_status::text; v_status_emoji := '📌';
  END CASE;

  v_idempotency := 'lifecycle-' || NEW.id::text || '-' || NEW.lifecycle_status::text;

  v_payload := jsonb_build_object(
    'templateName', 'order-update',
    'recipientEmail', v_recipient,
    'idempotencyKey', v_idempotency,
    'templateData', jsonb_build_object(
      'clientName', v_client_name,
      'trackingId', COALESCE(NEW.order_number, NEW.id::text),
      'serviceName', v_service_name,
      'newStatusLabel', v_status_label,
      'statusEmoji', v_status_emoji,
      'eventType', v_event_type
    )
  );

  SELECT decrypted_secret INTO v_supabase_url
  FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;
  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

  IF v_supabase_url IS NULL THEN
    v_supabase_url := 'https://kziujhdqogqeehtxgpax.supabase.co';
  END IF;

  IF v_service_key IS NULL THEN
    RAISE WARNING 'dispatch_lifecycle_email: service_role_key not in vault, skipping email for order %', NEW.id;
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := v_supabase_url || '/functions/v1/send-transactional-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_key,
      'apikey', v_service_key
    ),
    body := v_payload
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'dispatch_lifecycle_email failed for order %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.email_queue_dispatch() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pgmq.q_auth_emails)
     AND NOT EXISTS (SELECT 1 FROM pgmq.q_transactional_emails) THEN
    BEGIN
      PERFORM pg_catalog.pg_advisory_xact_lock(7700000000000001);
      IF EXISTS (SELECT 1 FROM pgmq.q_auth_emails)
         OR EXISTS (SELECT 1 FROM pgmq.q_transactional_emails) THEN
        RETURN;
      END IF;
      PERFORM cron.unschedule('process-email-queue');
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'email_queue_dispatch: cron unschedule failed: %', SQLERRM;
    END;
    RETURN;
  END IF;

  IF (SELECT retry_after_until FROM public.email_send_state WHERE id = 1) > now() THEN
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/process-email-queue',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Lovable-Context', 'cron',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
      )
    ),
    body := '{}'::jsonb
  );
END;
$$;

CREATE FUNCTION public.email_queue_wake() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(7700000000000001);
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'process-email-queue') THEN
    BEGIN
      PERFORM cron.schedule('process-email-queue', '5 seconds', $cron$ SELECT public.email_queue_dispatch(); $cron$);
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'email_queue_wake: cron schedule failed: %', SQLERRM;
    END;
  END IF;

  BEGIN
    PERFORM net.http_post(
      url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/process-email-queue',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Lovable-Context', 'cron',
        'Authorization', 'Bearer ' || (
          SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
        )
      ),
      body := '{}'::jsonb
    );
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  RETURN NULL;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'email_queue_wake failed (enqueue preserved): %', SQLERRM;
  RETURN NULL;
END;
$_$;

CREATE FUNCTION public.enqueue_email(queue_name text, payload jsonb) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN pgmq.send(queue_name, payload);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload);
END;
$$;

CREATE FUNCTION public.ensure_referral_code(_user_id uuid) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  existing TEXT;
  new_code TEXT;
BEGIN
  SELECT code INTO existing FROM public.user_referral_codes WHERE user_id = _user_id;
  IF existing IS NOT NULL THEN
    RETURN existing;
  END IF;
  new_code := public.generate_referral_code();
  INSERT INTO public.user_referral_codes (user_id, code) VALUES (_user_id, new_code);
  RETURN new_code;
END;
$$;

CREATE FUNCTION public.generate_customer_code() RETURNS text
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
DECLARE
  new_code TEXT;
  exists_count INT;
BEGIN
  LOOP
    new_code := lpad(floor(random() * 90000000 + 10000000)::text, 8, '0');
    SELECT count(*) INTO exists_count FROM public.customers WHERE customer_code = new_code;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN new_code;
END;
$$;

CREATE FUNCTION public.generate_financing_installments(_application_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  _app RECORD;
  _existing_count int;
  _i int;
  _due_date date;
  _amount numeric;
  _last_amount numeric;
  _start_date date;
BEGIN
  SELECT * INTO _app FROM financing_applications WHERE id = _application_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT COUNT(*) INTO _existing_count FROM financing_installments WHERE application_id = _application_id;
  IF _existing_count > 0 THEN RETURN; END IF;

  IF _app.duration_months IS NULL OR _app.duration_months <= 0 THEN RETURN; END IF;
  IF _app.remaining_amount IS NULL OR _app.remaining_amount <= 0 THEN RETURN; END IF;

  _start_date := COALESCE(_app.activated_at::date, CURRENT_DATE);
  _amount := ROUND((_app.remaining_amount / _app.duration_months)::numeric, 2);
  _last_amount := ROUND((_app.remaining_amount - (_amount * (_app.duration_months - 1)))::numeric, 2);

  FOR _i IN 1.._app.duration_months LOOP
    _due_date := (_start_date + (_i || ' months')::interval)::date;
    INSERT INTO financing_installments (application_id, month_number, amount, due_date, status)
    VALUES (
      _application_id,
      _i,
      CASE WHEN _i = _app.duration_months THEN _last_amount ELSE _amount END,
      _due_date,
      'pending'
    );
  END LOOP;
END;
$$;

CREATE FUNCTION public.generate_group_invite_code() RETURNS text
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
DECLARE c text; n int;
BEGIN
  LOOP
    c := upper(substring(md5(random()::text || clock_timestamp()::text) FROM 1 FOR 8));
    SELECT count(*) INTO n FROM public.group_orders WHERE invite_code = c;
    EXIT WHEN n = 0;
  END LOOP;
  RETURN c;
END$$;

CREATE FUNCTION public.generate_internal_order_number() RETURNS text
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
DECLARE
  new_num TEXT;
  exists_count INT;
BEGIN
  LOOP
    new_num := 'PI-' || to_char(now(), 'YYYYMMDD') || '-' ||
               upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 10));
    SELECT count(*) INTO exists_count FROM public.payment_intents WHERE internal_order_number = new_num;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN new_num;
END;
$$;

CREATE FUNCTION public.generate_receipt_number() RETURNS text
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
DECLARE
  seq_val BIGINT;
BEGIN
  SELECT nextval('public.receipt_no_seq') INTO seq_val;
  RETURN 'RCP-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(seq_val::TEXT, 6, '0');
END;
$$;

CREATE FUNCTION public.generate_referral_code() RETURNS text
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
DECLARE
  alphabet TEXT := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  candidate TEXT;
  i INT;
  exists_already BOOLEAN;
BEGIN
  LOOP
    candidate := '';
    FOR i IN 1..8 LOOP
      candidate := candidate || substr(alphabet, (floor(random() * length(alphabet))::int) + 1, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.user_referral_codes WHERE code = candidate) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN candidate;
END;
$$;

CREATE FUNCTION public.generate_short_ref_code() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- no confusing chars
  code text;
  i int;
  exists_already boolean;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..8 LOOP
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    SELECT EXISTS(SELECT 1 FROM public.user_referrals WHERE ref_code = code) INTO exists_already;
    EXIT WHEN NOT exists_already;
  END LOOP;
  RETURN code;
END;
$$;

CREATE FUNCTION public.get_active_bonus_drop(p_user_id uuid DEFAULT auth.uid()) RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_drop RECORD;
  v_seen BOOLEAN := false;
BEGIN
  SELECT * INTO v_drop
    FROM public.bonus_drops
   WHERE is_active = true
     AND now() BETWEEN starts_at AND ends_at
   ORDER BY starts_at DESC
   LIMIT 1;
  IF v_drop.id IS NULL THEN RETURN NULL; END IF;

  IF p_user_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.bonus_drop_views
       WHERE bonus_drop_id = v_drop.id AND user_id = p_user_id
    ) INTO v_seen;
  END IF;

  RETURN jsonb_build_object(
    'id', v_drop.id,
    'title', v_drop.title,
    'subtitle', v_drop.subtitle,
    'notification_message', v_drop.notification_message,
    'multiplier_type', v_drop.multiplier_type,
    'multiplier_value', v_drop.multiplier_value,
    'starts_at', v_drop.starts_at,
    'ends_at', v_drop.ends_at,
    'banner_color', v_drop.banner_color,
    'emoji', v_drop.emoji,
    'seen', v_seen
  );
END; $$;

CREATE FUNCTION public.get_active_membership(_user_id uuid) RETURNS TABLE(membership_id uuid, plan_id uuid, plan_code text, plan_name_ar text, discount_percentage numeric, cashback_amount numeric, priority_level integer, badge_color text, expires_at timestamp with time zone)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
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

CREATE FUNCTION public.get_active_multipliers() RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_xp NUMERIC := 1;
  v_pts NUMERIC := 1;
  v_drop RECORD;
BEGIN
  SELECT * INTO v_drop
    FROM public.bonus_drops
   WHERE is_active = true AND now() BETWEEN starts_at AND ends_at
   ORDER BY multiplier_value DESC LIMIT 1;
  IF v_drop.id IS NOT NULL THEN
    IF v_drop.multiplier_type IN ('xp','both')    THEN v_xp  := v_drop.multiplier_value; END IF;
    IF v_drop.multiplier_type IN ('points','both') THEN v_pts := v_drop.multiplier_value; END IF;
  END IF;
  RETURN jsonb_build_object('xp', v_xp, 'points', v_pts, 'drop_id', COALESCE(v_drop.id::text, null));
END; $$;

CREATE FUNCTION public.get_ai_usage_today(_tool_type text) RETURNS integer
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT COUNT(*)::INTEGER FROM public.student_ai_usage
  WHERE user_id = auth.uid() AND tool_type = _tool_type AND usage_date = CURRENT_DATE;
$$;

CREATE FUNCTION public.get_challenge_leaderboard(p_period text DEFAULT 'weekly'::text, p_limit integer DEFAULT 50) RETURNS TABLE(user_id uuid, full_name text, avatar_url text, total_xp integer, weekly_xp integer, monthly_xp integer, level_name text, level_color text, level_icon text, rank integer)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    x.user_id,
    COALESCE(p.full_name, 'طالب') AS full_name,
    p.avatar_url,
    x.total_xp,
    x.weekly_xp,
    x.monthly_xp,
    l.name_ar AS level_name,
    l.badge_color AS level_color,
    l.icon AS level_icon,
    (ROW_NUMBER() OVER (ORDER BY
      CASE p_period
        WHEN 'weekly' THEN x.weekly_xp
        WHEN 'monthly' THEN x.monthly_xp
        ELSE x.total_xp
      END DESC
    ))::INTEGER AS rank
  FROM public.challenge_user_xp x
  LEFT JOIN public.profiles p ON p.id = x.user_id
  LEFT JOIN public.challenge_levels l ON l.id = x.current_level_id
  WHERE CASE p_period
    WHEN 'weekly' THEN x.weekly_xp
    WHEN 'monthly' THEN x.monthly_xp
    ELSE x.total_xp
  END > 0
  ORDER BY rank
  LIMIT p_limit;
END;
$$;

CREATE FUNCTION public.get_daily_assessment_questions(p_assessment_id uuid, p_limit integer DEFAULT 10) RETURNS TABLE(id uuid, assessment_id uuid, question_text text, difficulty text, skill_tag text, explanation text, order_index integer)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_seed text;
BEGIN
  v_seed := to_char((now() AT TIME ZONE 'UTC')::date, 'YYYY-MM-DD') || ':' || p_assessment_id::text;

  RETURN QUERY
  SELECT q.id, q.assessment_id, q.question_text, q.difficulty, q.skill_tag, q.explanation, q.order_index
  FROM public.assessment_questions q
  WHERE q.assessment_id = p_assessment_id
  ORDER BY md5(v_seed || q.id::text)
  LIMIT GREATEST(p_limit, 1);
END;
$$;

CREATE FUNCTION public.get_growth_daily_series(p_days integer DEFAULT 30) RETURNS TABLE(date date, new_users integer, active_users integer, challenges_completed integer, shares_count integer, referrals_count integer, referrals_completed integer, retention_rate numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_today_row public.daily_growth_metrics;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  v_today_row := public.aggregate_daily_growth_metrics(v_today);

  RETURN QUERY
  SELECT m.date, m.new_users, m.active_users, m.challenges_completed,
         m.shares_count, m.referrals_count, m.referrals_completed, m.retention_rate
  FROM public.daily_growth_metrics m
  WHERE m.date >= (v_today - (p_days - 1))
  ORDER BY m.date ASC;
END;
$$;

CREATE FUNCTION public.get_growth_funnel(p_days integer DEFAULT 30) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
  v_signup INT; v_first_challenge INT; v_share INT; v_referral INT; v_completed INT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT COUNT(DISTINCT user_id) INTO v_signup
  FROM public.growth_events
  WHERE event_type = 'user_signed_up' AND created_at >= v_since;

  SELECT COUNT(DISTINCT user_id) INTO v_first_challenge
  FROM public.challenge_attempts
  WHERE status = 'completed' AND completed_at >= v_since;

  SELECT COUNT(DISTINCT user_id) INTO v_share
  FROM public.growth_events
  WHERE event_type = 'result_shared' AND created_at >= v_since;

  SELECT COUNT(DISTINCT referrer_user_id) INTO v_referral
  FROM public.referrals WHERE created_at >= v_since;

  SELECT COUNT(*) INTO v_completed
  FROM public.referrals WHERE status = 'completed' AND completed_at >= v_since;

  RETURN jsonb_build_array(
    jsonb_build_object('stage', 'signup', 'label', 'تسجيل', 'value', v_signup),
    jsonb_build_object('stage', 'first_challenge', 'label', 'أول تحدي', 'value', v_first_challenge),
    jsonb_build_object('stage', 'share', 'label', 'مشاركة', 'value', v_share),
    jsonb_build_object('stage', 'referral', 'label', 'إحالة', 'value', v_referral),
    jsonb_build_object('stage', 'completed', 'label', 'إحالة مكتملة', 'value', v_completed)
  );
END;
$$;

CREATE FUNCTION public.get_growth_overview(p_days integer DEFAULT 30) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
  v_today DATE := CURRENT_DATE;
  v_new INT; v_active INT; v_challenges INT; v_shares INT;
  v_refs INT; v_refs_done INT; v_conv NUMERIC(5,2);
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT COUNT(DISTINCT user_id) INTO v_new
  FROM public.growth_events
  WHERE event_type = 'user_signed_up' AND created_at >= v_since;

  SELECT COUNT(DISTINCT user_id) INTO v_active
  FROM public.growth_events
  WHERE user_id IS NOT NULL AND created_at >= v_since;

  SELECT COUNT(*) INTO v_challenges
  FROM public.challenge_attempts
  WHERE status = 'completed' AND completed_at >= v_since;

  SELECT COUNT(*) INTO v_shares
  FROM public.growth_events
  WHERE event_type = 'result_shared' AND created_at >= v_since;

  SELECT COUNT(*) INTO v_refs
  FROM public.referrals WHERE created_at >= v_since;

  SELECT COUNT(*) INTO v_refs_done
  FROM public.referrals WHERE completed_at >= v_since;

  v_conv := CASE WHEN v_refs > 0 THEN ROUND(100.0 * v_refs_done / v_refs, 2) ELSE 0 END;

  RETURN jsonb_build_object(
    'period_days', p_days,
    'new_users', v_new,
    'active_users', v_active,
    'challenges_completed', v_challenges,
    'shares_count', v_shares,
    'referrals_count', v_refs,
    'referrals_completed', v_refs_done,
    'conversion_rate', v_conv
  );
END;
$$;

CREATE FUNCTION public.get_growth_sources(p_days integer DEFAULT 30) RETURNS TABLE(source text, users integer, percentage numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
  v_total INT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT COUNT(DISTINCT user_id) INTO v_total
  FROM public.growth_events
  WHERE event_type = 'user_signed_up' AND created_at >= v_since;

  RETURN QUERY
  SELECT COALESCE(e.source, 'direct') AS source,
         COUNT(DISTINCT e.user_id)::int AS users,
         CASE WHEN v_total > 0
              THEN ROUND(100.0 * COUNT(DISTINCT e.user_id)::numeric / v_total, 2)
              ELSE 0 END AS percentage
  FROM public.growth_events e
  WHERE e.event_type = 'user_signed_up' AND e.created_at >= v_since
  GROUP BY COALESCE(e.source, 'direct')
  ORDER BY users DESC;
END;
$$;

CREATE FUNCTION public.get_mind_map_usage_today() RETURNS integer
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT COUNT(*)::INTEGER FROM public.mind_map_usage
  WHERE user_id = auth.uid() AND usage_date = CURRENT_DATE;
$$;

CREATE FUNCTION public.get_referral_commission_balance(_user_id uuid) RETURNS numeric
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT COALESCE(
    (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.wallet_transactions
      WHERE user_id = _user_id
        AND reference_type = 'referral_commission'
        AND type = 'deposit'
    )
    -
    (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.wallet_transactions
      WHERE user_id = _user_id
        AND reference_type IN ('referral_withdrawal_request','referral_withdrawal')
        AND type = 'withdrawal'
    )
    +
    (
      SELECT COALESCE(SUM(amount), 0)
      FROM public.wallet_transactions
      WHERE user_id = _user_id
        AND reference_type = 'referral_withdrawal_refund'
        AND type IN ('refund','deposit')
    ),
    0
  );
$$;

CREATE FUNCTION public.get_referral_leaderboard(p_limit integer DEFAULT 10) RETURNS TABLE(referrer_user_id uuid, referrer_name text, total_invites integer, completed_invites integer, conversion_rate numeric)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT r.referrer_user_id,
         COALESCE(p.full_name, 'مستخدم'),
         COUNT(*)::int AS total_invites,
         COUNT(*) FILTER (WHERE r.status = 'completed')::int AS completed_invites,
         CASE WHEN COUNT(*) > 0
              THEN ROUND(100.0 * COUNT(*) FILTER (WHERE r.status = 'completed')::numeric / COUNT(*), 2)
              ELSE 0 END AS conversion_rate
  FROM public.referrals r
  LEFT JOIN public.profiles p ON p.user_id = r.referrer_user_id
  GROUP BY r.referrer_user_id, p.full_name
  ORDER BY completed_invites DESC, total_invites DESC
  LIMIT p_limit;
END;
$$;

CREATE FUNCTION public.get_referrer_by_code(_code text) RETURNS TABLE(user_id uuid, customer_id uuid, name text)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT c.user_id, c.id, c.name
  FROM public.customers c
  WHERE c.referral_code = upper(_code)
  LIMIT 1;
$$;

CREATE FUNCTION public.get_retention_cohort(p_days integer DEFAULT 30) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
  v_total INT; v_d1 INT; v_d3 INT; v_d7 INT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  WITH cohort AS (
    SELECT user_id, MIN(created_at) AS signup_at
    FROM public.growth_events
    WHERE event_type = 'user_signed_up'
      AND created_at >= v_since
      AND user_id IS NOT NULL
    GROUP BY user_id
  ), activity AS (
    SELECT c.user_id, c.signup_at,
      EXISTS(SELECT 1 FROM public.growth_events e
             WHERE e.user_id = c.user_id
               AND e.event_type <> 'user_signed_up'
               AND e.created_at >= c.signup_at + INTERVAL '1 day'
               AND e.created_at <  c.signup_at + INTERVAL '2 days') AS d1,
      EXISTS(SELECT 1 FROM public.growth_events e
             WHERE e.user_id = c.user_id
               AND e.event_type <> 'user_signed_up'
               AND e.created_at >= c.signup_at + INTERVAL '3 days'
               AND e.created_at <  c.signup_at + INTERVAL '4 days') AS d3,
      EXISTS(SELECT 1 FROM public.growth_events e
             WHERE e.user_id = c.user_id
               AND e.event_type <> 'user_signed_up'
               AND e.created_at >= c.signup_at + INTERVAL '7 days'
               AND e.created_at <  c.signup_at + INTERVAL '8 days') AS d7
    FROM cohort c
  )
  SELECT COUNT(*),
         COUNT(*) FILTER (WHERE d1),
         COUNT(*) FILTER (WHERE d3),
         COUNT(*) FILTER (WHERE d7)
    INTO v_total, v_d1, v_d3, v_d7
  FROM activity;

  RETURN jsonb_build_object(
    'cohort_size', COALESCE(v_total,0),
    'day1', CASE WHEN v_total>0 THEN ROUND(100.0*v_d1/v_total,2) ELSE 0 END,
    'day3', CASE WHEN v_total>0 THEN ROUND(100.0*v_d3/v_total,2) ELSE 0 END,
    'day7', CASE WHEN v_total>0 THEN ROUND(100.0*v_d7/v_total,2) ELSE 0 END
  );
END;
$$;

CREATE FUNCTION public.get_study_challenge_state(p_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_attempt RECORD;
  v_today DATE := (now() AT TIME ZONE 'Asia/Riyadh')::date;
  v_can_check_in BOOLEAN := false;
  v_days_left INTEGER;
BEGIN
  SELECT * INTO v_attempt
  FROM public.study_challenge_attempts
  WHERE user_id = p_user_id AND status = 'in_progress'
  ORDER BY created_at DESC LIMIT 1;

  IF v_attempt.id IS NULL THEN
    RETURN jsonb_build_object('status','none');
  END IF;

  IF v_attempt.last_check_in_on IS NOT NULL
     AND v_attempt.last_check_in_on < v_today - INTERVAL '1 day' THEN
    UPDATE public.study_challenge_attempts
       SET status='failed', failed_at=now(), streak=0
     WHERE id = v_attempt.id;
    RETURN jsonb_build_object(
      'status','failed','attempt_id',v_attempt.id,
      'message','انتهى التحدي… حاول مجددًا',
      'current_day', v_attempt.current_day,
      'required_days', v_attempt.required_days
    );
  END IF;

  v_can_check_in := (v_attempt.last_check_in_on IS NULL OR v_attempt.last_check_in_on < v_today);
  v_days_left := GREATEST(0, v_attempt.required_days - v_attempt.current_day);

  RETURN jsonb_build_object(
    'status', v_attempt.status,
    'attempt_id', v_attempt.id,
    'current_day', v_attempt.current_day,
    'streak', v_attempt.streak,
    'days_left', v_days_left,
    'required_days', v_attempt.required_days,
    'required_minutes', v_attempt.required_minutes,
    'last_check_in_on', v_attempt.last_check_in_on,
    'started_on', v_attempt.started_on,
    'today', v_today,
    'can_check_in', v_can_check_in
  );
END; $$;

CREATE FUNCTION public.get_today_any_assessment_attempt(p_user_id uuid DEFAULT NULL::uuid, p_anonymous_id text DEFAULT NULL::text) RETURNS TABLE(attempt_id uuid, assessment_id uuid, assessment_slug text, assessment_title text, completed_at timestamp with time zone, next_available_at timestamp with time zone)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    aa.id,
    aa.assessment_id,
    a.slug,
    a.title,
    aa.completed_at,
    aa.completed_at + INTERVAL '24 hours' AS next_available_at
  FROM public.assessment_attempts aa
  JOIN public.assessments a ON a.id = aa.assessment_id
  WHERE aa.status = 'completed'
    AND aa.completed_at IS NOT NULL
    AND aa.completed_at > now() - INTERVAL '24 hours'
    AND (
      (p_user_id IS NOT NULL AND aa.user_id = p_user_id)
      OR (p_user_id IS NULL AND p_anonymous_id IS NOT NULL AND aa.anonymous_id = p_anonymous_id)
    )
  ORDER BY aa.completed_at DESC
  LIMIT 1;
$$;

CREATE FUNCTION public.get_today_assessment_attempt(p_assessment_id uuid, p_user_id uuid DEFAULT NULL::uuid, p_anonymous_id text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_attempt_id uuid;
BEGIN
  SELECT id INTO v_attempt_id
  FROM public.assessment_attempts
  WHERE assessment_id = p_assessment_id
    AND status = 'completed'
    AND (completed_at AT TIME ZONE 'UTC')::date = (now() AT TIME ZONE 'UTC')::date
    AND (
      (p_user_id IS NOT NULL AND user_id = p_user_id)
      OR (p_user_id IS NULL AND p_anonymous_id IS NOT NULL AND anonymous_id = p_anonymous_id)
    )
  ORDER BY completed_at DESC
  LIMIT 1;

  RETURN v_attempt_id;
END;
$$;

CREATE FUNCTION public.get_top_challenges(p_days integer DEFAULT 30, p_limit integer DEFAULT 5) RETURNS TABLE(challenge_id uuid, title text, attempts integer, perfect integer, shares integer)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::interval;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  RETURN QUERY
  SELECT a.challenge_id,
         COALESCE(c.title, 'تحدي'),
         COUNT(*)::int AS attempts,
         COUNT(*) FILTER (WHERE a.is_perfect)::int AS perfect,
         (SELECT COUNT(*)::int FROM public.growth_events e
           WHERE e.event_type = 'result_shared'
             AND e.metadata->>'challenge_id' = a.challenge_id::text
             AND e.created_at >= v_since) AS shares
  FROM public.challenge_attempts a
  LEFT JOIN public.daily_challenges c ON c.id = a.challenge_id
  WHERE a.status = 'completed' AND a.completed_at >= v_since
  GROUP BY a.challenge_id, c.title
  ORDER BY attempts DESC
  LIMIT p_limit;
END;
$$;

CREATE FUNCTION public.get_user_whatsapp_phone(_user_id uuid) RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$ SELECT phone FROM public.profiles WHERE id = _user_id AND phone IS NOT NULL AND length(trim(phone)) > 0 $$;

CREATE FUNCTION public.get_viral_referral_summary(p_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_total_referrals INTEGER := 0;
  v_total_points INTEGER := 0;
  v_total_xp INTEGER := 0;
  v_secret_unlocked BOOLEAN := false;
  v_to_secret INTEGER;
  v_referral_code TEXT;
BEGIN
  SELECT COUNT(*) INTO v_total_referrals FROM public.referrals WHERE referrer_user_id = p_user_id;

  SELECT COALESCE(SUM(points_awarded),0), COALESCE(SUM(xp_awarded),0)
    INTO v_total_points, v_total_xp
    FROM public.referral_viral_rewards WHERE referrer_user_id = p_user_id;

  SELECT EXISTS(
    SELECT 1 FROM public.user_secret_features
     WHERE user_id = p_user_id AND feature_key = 'secret_referral_3'
  ) INTO v_secret_unlocked;

  v_to_secret := GREATEST(0, 3 - v_total_referrals);

  SELECT ref_code INTO v_referral_code FROM public.user_referrals WHERE user_id = p_user_id LIMIT 1;

  RETURN jsonb_build_object(
    'referral_code', v_referral_code,
    'total_referrals', v_total_referrals,
    'total_points', v_total_points,
    'total_xp', v_total_xp,
    'secret_unlocked', v_secret_unlocked,
    'referrals_to_secret', v_to_secret
  );
END; $$;

CREATE FUNCTION public.grant_referral_viral_reward(p_referral_id uuid, p_referrer uuid, p_referred uuid, p_reward_type text, p_points integer, p_xp integer, p_description text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_existing UUID;
BEGIN
  SELECT id INTO v_existing FROM public.referral_viral_rewards
   WHERE referral_id = p_referral_id AND reward_type = p_reward_type LIMIT 1;
  IF v_existing IS NOT NULL THEN RETURN false; END IF;

  INSERT INTO public.referral_viral_rewards
    (referral_id, referrer_user_id, referred_user_id, reward_type, points_awarded, xp_awarded)
  VALUES (p_referral_id, p_referrer, p_referred, p_reward_type, p_points, p_xp);

  IF p_xp > 0 THEN
    INSERT INTO public.xp_transactions (user_id, amount, source_type, source_id, description, metadata)
    VALUES (p_referrer, p_xp, 'referral_' || p_reward_type, p_referral_id, p_description,
            jsonb_build_object('referred_user_id', p_referred));
  END IF;

  IF p_points > 0 THEN
    INSERT INTO public.point_transactions
      (user_id, points, type, source_type, source_id, description, base_points, metadata)
    VALUES (p_referrer, p_points, 'earn', 'referral_' || p_reward_type, p_referral_id, p_description, p_points,
            jsonb_build_object('referred_user_id', p_referred));
  END IF;

  RETURN true;
END; $$;

CREATE FUNCTION public.guard_academic_cv_lock() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF current_setting('app.bypass_cv_lock_guard', true) = 'true' THEN
    RETURN NEW;
  END IF;
  IF auth.uid() IS NULL OR public.has_role(auth.uid(),'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.status              IS DISTINCT FROM OLD.status
     OR NEW.locked_template_key IS DISTINCT FROM OLD.locked_template_key
     OR NEW.paid_at             IS DISTINCT FROM OLD.paid_at
     OR NEW.paid_amount         IS DISTINCT FROM OLD.paid_amount
     OR NEW.template_swap_used  IS DISTINCT FROM OLD.template_swap_used
     OR NEW.template_swap_deadline IS DISTINCT FROM OLD.template_swap_deadline
     OR NEW.purchase_id         IS DISTINCT FROM OLD.purchase_id
     OR NEW.exports_count       IS DISTINCT FROM OLD.exports_count
     OR NEW.last_exported_at    IS DISTINCT FROM OLD.last_exported_at
  THEN
    RAISE EXCEPTION 'لا يمكن تعديل حقول الشراء/القفل مباشرة';
  END IF;

  IF OLD.status = 'paid' AND NEW.template_key IS DISTINCT FROM OLD.locked_template_key THEN
    RAISE EXCEPTION 'القالب مقفول بعد الدفع — استخدم زر تبديل القالب';
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.guard_client_lifecycle_edits() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
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

CREATE FUNCTION public.guard_evidence_immutable() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'contract_evidence is immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'contract_evidence cannot be deleted';
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE FUNCTION public.guard_group_order_edits() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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

CREATE FUNCTION public.guard_membership_referral() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_ref_email text;
  v_ref_phone text;
  v_self_email text;
  v_self_phone text;
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    IF NEW.referred_by = NEW.user_id THEN
      INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, reason)
      VALUES ('self_referral_blocked', NEW.referred_by, NEW.user_id, 'Self referral attempt blocked');
      NEW.referred_by := NULL;
      NEW.referral_code_used := NULL;
      RETURN NEW;
    END IF;

    SELECT email, phone INTO v_ref_email, v_ref_phone
      FROM public.customers WHERE user_id = NEW.referred_by LIMIT 1;
    SELECT email, phone INTO v_self_email, v_self_phone
      FROM public.customers WHERE user_id = NEW.user_id LIMIT 1;

    IF (v_ref_email IS NOT NULL AND v_ref_email = v_self_email)
       OR (v_ref_phone IS NOT NULL AND v_ref_phone IS DISTINCT FROM '' AND v_ref_phone = v_self_phone) THEN
      INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, reason, metadata)
      VALUES ('duplicate_identity_blocked', NEW.referred_by, NEW.user_id,
              'Same email or phone between referrer and referred',
              jsonb_build_object('email_match', v_ref_email = v_self_email,
                                 'phone_match', v_ref_phone = v_self_phone));
      NEW.referred_by := NULL;
      NEW.referral_code_used := NULL;
      RETURN NEW;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.guard_signatures_immutable() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RAISE EXCEPTION 'سجلات التوقيع غير قابلة للتعديل أو الحذف';
END;
$$;

CREATE FUNCTION public.guard_signed_contract_delete() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF OLD.locked_at IS NOT NULL OR OLD.status = 'signed' THEN
    RAISE EXCEPTION 'لا يمكن حذف عقد موقّع';
  END IF;
  RETURN OLD;
END;
$$;

CREATE FUNCTION public.guard_signed_contract_immutability() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF OLD.locked_at IS NOT NULL THEN
    IF NEW.content IS DISTINCT FROM OLD.content
       OR NEW.content_sha256 IS DISTINCT FROM OLD.content_sha256
       OR NEW.total_amount IS DISTINCT FROM OLD.total_amount
       OR NEW.client_full_name IS DISTINCT FROM OLD.client_full_name
       OR NEW.client_id_number IS DISTINCT FROM OLD.client_id_number
       OR NEW.client_email IS DISTINCT FROM OLD.client_email
       OR NEW.service_name IS DISTINCT FROM OLD.service_name
       OR NEW.service_type IS DISTINCT FROM OLD.service_type
       OR NEW.locked_at IS DISTINCT FROM OLD.locked_at
       OR NEW.signed_at IS DISTINCT FROM OLD.signed_at THEN
      RAISE EXCEPTION 'العقد موقّع وغير قابل للتعديل (immutable after lock)';
    END IF;
    IF NEW.status IS DISTINCT FROM OLD.status
       AND NEW.status NOT IN ('signed','active','completed','expired','cancelled') THEN
      RAISE EXCEPTION 'انتقال حالة غير مسموح بعد التوقيع';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.guard_signed_version_immutable() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.output_type = 'signed_final' THEN
    IF NEW.content_sha256 IS DISTINCT FROM OLD.content_sha256
       OR NEW.pdf_storage_path IS DISTINCT FROM OLD.pdf_storage_path
       OR NEW.content_snapshot IS DISTINCT FROM OLD.content_snapshot
       OR NEW.version_no IS DISTINCT FROM OLD.version_no
       OR NEW.output_type IS DISTINCT FROM OLD.output_type
       OR NEW.contract_id IS DISTINCT FROM OLD.contract_id THEN
      RAISE EXCEPTION 'signed_final contract version is immutable';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' AND OLD.output_type = 'signed_final' THEN
    RAISE EXCEPTION 'signed_final contract version cannot be deleted';
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE FUNCTION public.guard_timeline_append_only() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RAISE EXCEPTION 'سجل العقد append-only — لا تعديل ولا حذف';
END;
$$;

CREATE FUNCTION public.handle_contract_changed() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.contract_timeline (contract_id, actor_id, actor_type, action_type, action_label, description)
    VALUES (NEW.id, COALESCE(auth.uid(), NEW.user_id), 'system', 'created', 'إنشاء العقد',
            'تم إنشاء العقد رقم ' || NEW.contract_number);
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.contract_timeline (contract_id, actor_id, actor_type, action_type, action_label, description, metadata)
    VALUES (NEW.id, auth.uid(),
            CASE WHEN has_role(auth.uid(),'admin'::app_role) THEN 'admin' ELSE 'client' END,
            'status_change', 'تغيير الحالة',
            'من ' || COALESCE(OLD.status,'-') || ' إلى ' || COALESCE(NEW.status,'-'),
            jsonb_build_object('from', OLD.status, 'to', NEW.status));
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_lifecycle_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.lifecycle_status IS DISTINCT FROM OLD.lifecycle_status THEN
    NEW.progress_percentage := public.lifecycle_progress(NEW.lifecycle_status);

    IF NEW.lifecycle_status = 'contract_pending' AND NEW.contract_pending_at IS NULL THEN
      NEW.contract_pending_at := now();
    ELSIF NEW.lifecycle_status = 'contract_signed' AND NEW.contract_signed_at IS NULL THEN
      NEW.contract_signed_at := now();
    ELSIF NEW.lifecycle_status = 'paid' AND NEW.payment_completed_at IS NULL THEN
      NEW.payment_completed_at := now();
    ELSIF NEW.lifecycle_status = 'in_progress' AND NEW.execution_started_at IS NULL THEN
      NEW.execution_started_at := now();
    ELSIF NEW.lifecycle_status = 'delivered' AND NEW.delivered_at IS NULL THEN
      NEW.delivered_at := now();
    ELSIF NEW.lifecycle_status = 'completed' AND NEW.completed_at IS NULL THEN
      NEW.completed_at := now();
    ELSIF NEW.lifecycle_status = 'cancelled' AND NEW.cancelled_at IS NULL THEN
      NEW.cancelled_at := now();
    END IF;

    NEW.current_status := NEW.lifecycle_status::text;

    IF TG_OP = 'UPDATE' THEN
      INSERT INTO public.service_order_timeline (order_id, status, note, created_by)
      VALUES (NEW.id, NEW.lifecycle_status::text,
              'تغيير المرحلة من ' || OLD.lifecycle_status::text || ' إلى ' || NEW.lifecycle_status::text,
              auth.uid());

      IF NEW.user_id IS NOT NULL THEN
        INSERT INTO public.user_notifications (user_id, title, message, type, link)
        VALUES (
          NEW.user_id,
          CASE NEW.lifecycle_status
            WHEN 'quote_sent'       THEN '📨 وصلك عرض سعر جديد'
            WHEN 'contract_pending' THEN '📝 العقد جاهز للتوقيع'
            WHEN 'contract_signed'  THEN '✅ تم توقيع عقدك'
            WHEN 'payment_pending'  THEN '💳 بانتظار الدفع'
            WHEN 'paid'             THEN '💰 تم استلام دفعتك'
            WHEN 'in_progress'      THEN '⚙️ بدأ تنفيذ طلبك'
            WHEN 'delivered'        THEN '📦 تم تسليم طلبك'
            WHEN 'completed'        THEN '🎉 طلبك مكتمل'
            WHEN 'cancelled'        THEN '⚠️ تم إلغاء طلبك'
            ELSE 'تحديث على طلبك'
          END,
          'الطلب رقم ' || NEW.tracking_id || ' — المرحلة الحالية: ' || NEW.lifecycle_status::text,
          'order',
          '/orders/' || NEW.id::text
        );
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_membership_activated() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_plan record;
  v_wallet_id UUID;
BEGIN
  IF NEW.status = 'active' AND (OLD.status IS DISTINCT FROM 'active') THEN
    SELECT * INTO v_plan FROM public.membership_plans WHERE id = NEW.plan_id;

    IF NEW.starts_at IS NULL THEN
      NEW.starts_at := now();
    END IF;
    IF NEW.expires_at IS NULL THEN
      NEW.expires_at := NEW.starts_at + (v_plan.duration_months || ' months')::interval;
    END IF;

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

    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, '🎉 تم تفعيل عضويتك',
            'مرحباً بك في عضوية ' || v_plan.name_ar || '. استمتع بمزاياك الحصرية!',
            'membership', '/membership');

    INSERT INTO public.membership_history (membership_id, user_id, action, actor_id, actor_type, description)
    VALUES (NEW.id, NEW.user_id, 'activated', auth.uid(),
            CASE WHEN auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role) THEN 'admin' ELSE 'system' END,
            'تم تفعيل العضوية');
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_membership_created() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.membership_history (membership_id, user_id, action, actor_id, actor_type, description)
  VALUES (NEW.id, NEW.user_id, 'subscribed', NEW.user_id, 'client',
          'تم إنشاء طلب اشتراك');

  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  SELECT ur.user_id, '👑 طلب اشتراك عضوية جديد',
         'يوجد طلب اشتراك عضوية جديد بانتظار المراجعة',
         'membership', '/adminmaster/memberships'
  FROM public.user_roles ur WHERE ur.role = 'admin';

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_receipt_approval() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_app          public.financing_applications%ROWTYPE;
  v_wallet_id    uuid;
  v_balance_before numeric;
  v_balance_after  numeric;
  v_credit       numeric;
  v_url_wa  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-whatsapp-notify';
  v_url_em  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-email-notify';
  v_key     constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
  v_body    jsonb;
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    SELECT * INTO v_app FROM public.financing_applications WHERE id = NEW.application_id;
    IF NOT FOUND THEN RETURN NEW; END IF;

    v_body := jsonb_build_object(
      'application_id', v_app.id,
      'event', 'down_payment_received',
      'extra', jsonb_build_object(
        'receipt_id', NEW.id,
        'receipt_amount', NEW.amount,
        'payment_method', NEW.payment_method
      )
    );
    BEGIN
      PERFORM net.http_post(url := v_url_wa, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
      PERFORM net.http_post(url := v_url_em, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    EXCEPTION WHEN OTHERS THEN NULL; END;

    v_credit := COALESCE(v_app.total_amount, NEW.amount);

    UPDATE public.financing_applications
       SET status = 'active', updated_at = now()
     WHERE id = v_app.id;

    BEGIN
      INSERT INTO public.wallets (user_id, balance, total_deposited)
      VALUES (v_app.user_id, 0, 0)
      ON CONFLICT (user_id) DO NOTHING;

      SELECT id, balance INTO v_wallet_id, v_balance_before
        FROM public.wallets WHERE user_id = v_app.user_id FOR UPDATE;

      v_balance_after := COALESCE(v_balance_before, 0) + v_credit;

      UPDATE public.wallets
         SET balance = v_balance_after,
             total_deposited = COALESCE(total_deposited, 0) + v_credit,
             updated_at = now()
       WHERE id = v_wallet_id;

      INSERT INTO public.wallet_transactions
        (wallet_id, user_id, type, amount, balance_before, balance_after,
         description, reference_type, reference_id, currency, payment_method)
      VALUES
        (v_wallet_id, v_app.user_id, 'financing_credit', v_credit,
         COALESCE(v_balance_before, 0), v_balance_after,
         'تمويل Master PayLater — تم إضافة مبلغ التمويل بعد اعتماد الدفعة الأولى',
         'financing_application', v_app.id, 'SAR',
         CASE WHEN NEW.payment_method = 'wallet' THEN 'wallet' ELSE 'bank_transfer' END);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Wallet credit failed for app %: %', v_app.id, SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_referral_on_membership_activation() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_plan          RECORD;
  v_commission    NUMERIC := 0;
  v_wallet_id     UUID;
  v_tx_id         UUID;
  v_referred_name TEXT;
  v_existing      RECORD;
BEGIN
  IF NEW.status <> 'active'
     OR OLD.status IS NOT DISTINCT FROM 'active'
     OR NEW.referred_by IS NULL
     OR NEW.referred_by = NEW.user_id THEN
    RETURN NEW;
  END IF;

  IF NEW.referred_by = NEW.user_id THEN
    INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('self_referral_blocked', NEW.referred_by, NEW.user_id, NEW.id, 'Detected at activation');
    RETURN NEW;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.user_id::text || ':' || NEW.id::text, 0));

  SELECT * INTO v_existing FROM public.member_referrals
   WHERE referred_user_id = NEW.user_id
     AND status = 'rewarded'
   LIMIT 1;

  IF FOUND THEN
    INSERT INTO public.referral_audit_logs(action_type, referral_id, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('double_reward_blocked', v_existing.id, NEW.referred_by, NEW.user_id, NEW.id,
            'Referred user already rewarded once');
    RETURN NEW;
  END IF;

  SELECT * INTO v_existing FROM public.member_referrals
   WHERE referred_user_id = NEW.user_id AND membership_id = NEW.id
   LIMIT 1;
  IF FOUND AND v_existing.status = 'rewarded' THEN
    INSERT INTO public.referral_audit_logs(action_type, referral_id, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('double_reward_blocked', v_existing.id, NEW.referred_by, NEW.user_id, NEW.id,
            'Membership already rewarded');
    RETURN NEW;
  END IF;

  SELECT * INTO v_plan FROM public.membership_plans WHERE id = NEW.plan_id;
  IF NOT FOUND OR v_plan.is_active IS DISTINCT FROM TRUE THEN
    INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('inactive_plan_blocked', NEW.referred_by, NEW.user_id, NEW.id, 'Plan missing or inactive');
    RETURN NEW;
  END IF;

  v_commission := COALESCE(v_plan.price, 0) * (COALESCE(v_plan.referral_commission_percentage, 0) / 100.0)
                  + COALESCE(v_plan.referral_commission_fixed, 0);

  IF v_commission <= 0 THEN
    INSERT INTO public.member_referrals
      (referrer_user_id, referred_user_id, referral_code, membership_id, plan_id, status, commission_amount)
    VALUES
      (NEW.referred_by, NEW.user_id, COALESCE(NEW.referral_code_used,'DIRECT'),
       NEW.id, NEW.plan_id, 'pending', 0)
    ON CONFLICT (referred_user_id, membership_id) DO NOTHING;

    INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, membership_id, amount, reason)
    VALUES ('referral_created_zero', NEW.referred_by, NEW.user_id, NEW.id, 0, 'No commission configured for plan');
    RETURN NEW;
  END IF;

  SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = NEW.referred_by;
  IF v_wallet_id IS NULL THEN
    INSERT INTO public.wallets (user_id) VALUES (NEW.referred_by) RETURNING id INTO v_wallet_id;
  END IF;

  SELECT name INTO v_referred_name FROM public.customers WHERE user_id = NEW.user_id LIMIT 1;

  INSERT INTO public.member_referrals
    (referrer_user_id, referred_user_id, referral_code, membership_id, plan_id,
     status, commission_amount, commission_paid_at)
  VALUES
    (NEW.referred_by, NEW.user_id, COALESCE(NEW.referral_code_used,'DIRECT'),
     NEW.id, NEW.plan_id, 'rewarded', v_commission, now())
  ON CONFLICT (referred_user_id, membership_id) DO UPDATE
    SET status = 'rewarded',
        commission_amount = EXCLUDED.commission_amount,
        commission_paid_at = now(),
        updated_at = now()
    WHERE public.member_referrals.status <> 'rewarded'  -- key guard
  RETURNING id INTO v_tx_id;

  IF v_tx_id IS NULL THEN
    INSERT INTO public.referral_audit_logs(action_type, referrer_user_id, referred_user_id, membership_id, reason)
    VALUES ('double_reward_blocked', NEW.referred_by, NEW.user_id, NEW.id, 'Race condition prevented');
    RETURN NEW;
  END IF;

  INSERT INTO public.wallet_transactions
    (wallet_id, user_id, type, amount, description, reference_type, reference_id)
  VALUES
    (v_wallet_id, NEW.referred_by, 'deposit', v_commission,
     'عمولة إحالة - اشتراك ' || COALESCE(v_referred_name,'عضو جديد') || ' في عضوية ' || v_plan.name_ar,
     'referral_commission', NEW.id);

  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  VALUES (NEW.referred_by, '🎁 عمولة إحالة جديدة',
          'تم إيداع ' || v_commission || ' ر.س في محفظتك كعمولة إحالة',
          'wallet', '/membership');

  INSERT INTO public.referral_audit_logs
    (action_type, referral_id, referrer_user_id, referred_user_id, membership_id, amount, reason, metadata)
  VALUES
    ('referral_rewarded', v_tx_id, NEW.referred_by, NEW.user_id, NEW.id, v_commission,
     'Commission credited',
     jsonb_build_object('plan_code', v_plan.code, 'plan_price', v_plan.price,
                        'pct', v_plan.referral_commission_percentage,
                        'fixed', v_plan.referral_commission_fixed));

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_referral_on_membership_created() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL AND NEW.referred_by <> NEW.user_id THEN
    INSERT INTO public.member_referrals
      (referrer_user_id, referred_user_id, referral_code, membership_id, plan_id, status, commission_amount)
    VALUES
      (NEW.referred_by, NEW.user_id, COALESCE(NEW.referral_code_used, 'DIRECT'),
       NEW.id, NEW.plan_id, 'pending', 0)
    ON CONFLICT (referred_user_id, membership_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_signature_inserted() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.contracts
     SET status = 'signed',
         signed_at = NEW.signed_at,
         updated_at = now()
   WHERE id = NEW.contract_id;

  INSERT INTO public.contract_timeline (contract_id, actor_id, actor_type, action_type, action_label, description, metadata)
  VALUES (NEW.contract_id, NEW.signer_user_id, 'client', 'signed', 'توقيع العقد',
          'وقّع العميل ' || NEW.signer_name || ' على العقد إلكترونياً',
          jsonb_build_object('ip', NEW.ip_address, 'signed_at', NEW.signed_at));
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_ticket_changed() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description)
    VALUES (NEW.id, NEW.user_id, 'client', 'created', 'إنشاء التذكرة', 'تم فتح التذكرة رقم ' || NEW.ticket_number);
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description, metadata)
    VALUES (NEW.id, auth.uid(), CASE WHEN has_role(auth.uid(),'admin'::app_role) THEN 'admin' ELSE 'client' END,
            'status_change', 'تغيير الحالة',
            'من ' || COALESCE(OLD.status,'-') || ' إلى ' || COALESCE(NEW.status,'-'),
            jsonb_build_object('from', OLD.status, 'to', NEW.status));
    IF NEW.status = 'resolved' AND OLD.status IS DISTINCT FROM 'resolved' THEN
      NEW.resolved_at := now();
    END IF;
  END IF;

  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
    INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description)
    VALUES (NEW.id, auth.uid(), 'admin', 'assignment', 'إسناد التذكرة',
            CASE WHEN NEW.assigned_to IS NULL THEN 'تم إلغاء الإسناد' ELSE 'تم إسناد التذكرة لمدير' END);
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_ticket_message_inserted() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.tickets
     SET last_message_at = NEW.created_at,
         updated_at = now(),
         status = CASE
           WHEN NEW.sender_type = 'admin' AND status = 'open' THEN 'in_progress'
           WHEN NEW.sender_type = 'client' AND status = 'resolved' THEN 'open'
           ELSE status
         END
   WHERE id = NEW.ticket_id;

  INSERT INTO public.ticket_timeline (ticket_id, actor_id, actor_type, action_type, action_label, description)
  VALUES (
    NEW.ticket_id,
    NEW.sender_id,
    NEW.sender_type,
    'message',
    CASE WHEN NEW.sender_type = 'admin' THEN 'رد من الإدارة' ELSE 'رسالة من العميل' END,
    LEFT(NEW.content, 200)
  );
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_topup_approved() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_wallet_id UUID;
  v_bonus_pct NUMERIC := 0;
  v_bonus_amount NUMERIC := 0;
BEGIN
  IF NEW.status = 'approved' AND OLD.status IS DISTINCT FROM 'approved' THEN
    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = NEW.user_id;
    IF v_wallet_id IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (NEW.user_id) RETURNING id INTO v_wallet_id;
    END IF;

    IF NEW.amount >= 5000 THEN v_bonus_pct := 15;
    ELSIF NEW.amount >= 2500 THEN v_bonus_pct := 10;
    ELSIF NEW.amount >= 1000 THEN v_bonus_pct := 5;
    ELSIF NEW.amount >= 500 THEN v_bonus_pct := 2;
    END IF;
    v_bonus_amount := round(NEW.amount * v_bonus_pct / 100, 2);

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id, created_by)
    VALUES (v_wallet_id, NEW.user_id, 'deposit', NEW.amount,
            'شحن رصيد - طلب رقم #' || substring(NEW.id::text from 1 for 8),
            'topup_request', NEW.id, NEW.reviewed_by);

    IF v_bonus_amount > 0 THEN
      INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id, created_by, metadata)
      VALUES (v_wallet_id, NEW.user_id, 'deposit', v_bonus_amount,
              '🎁 مكافأة بونص ' || v_bonus_pct || '% على شحن طلب #' || substring(NEW.id::text from 1 for 8),
              'topup_bonus', NEW.id, NEW.reviewed_by,
              jsonb_build_object('bonus_pct', v_bonus_pct, 'base_amount', NEW.amount));
    END IF;

    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, '✅ تم شحن محفظتك',
            CASE WHEN v_bonus_amount > 0
              THEN 'تمت إضافة ' || NEW.amount || ' ر.س + مكافأة بونص ' || v_bonus_amount || ' ر.س (' || v_bonus_pct || '%) إلى محفظتك بنجاح'
              ELSE 'تمت إضافة ' || NEW.amount || ' ر.س إلى محفظتك بنجاح'
            END,
            'wallet', '/wallet');
  END IF;

  IF NEW.status = 'rejected' AND OLD.status IS DISTINCT FROM 'rejected' THEN
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (NEW.user_id, '❌ تم رفض طلب شحن المحفظة',
            COALESCE(NEW.admin_notes, 'يرجى التواصل مع الإدارة'),
            'wallet', '/wallet');
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_withdrawal_status_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_wallet_id UUID;
  v_tx_id UUID;
BEGIN
  IF NEW.status = 'rejected' AND OLD.status <> 'rejected' AND NEW.refund_transaction_id IS NULL THEN
    SELECT id INTO v_wallet_id FROM public.wallets WHERE user_id = NEW.user_id;
    IF v_wallet_id IS NOT NULL THEN
      INSERT INTO public.wallet_transactions
        (wallet_id, user_id, type, amount, description, reference_type, reference_id)
      VALUES
        (v_wallet_id, NEW.user_id, 'deposit', NEW.amount,
         'استرجاع طلب سحب مرفوض',
         'withdrawal_refund', NEW.id)
      RETURNING id INTO v_tx_id;
      NEW.refund_transaction_id := v_tx_id;
    END IF;
    NEW.reviewed_at := COALESCE(NEW.reviewed_at, now());
  END IF;

  IF NEW.status = 'approved' AND OLD.status <> 'approved' THEN
    NEW.reviewed_at := COALESCE(NEW.reviewed_at, now());
  END IF;

  IF NEW.status = 'paid' AND OLD.status <> 'paid' THEN
    NEW.paid_at := COALESCE(NEW.paid_at, now());
  END IF;

  IF NEW.status <> OLD.status THEN
    INSERT INTO public.user_notifications (user_id, title, message, type, link)
    VALUES (
      NEW.user_id,
      CASE NEW.status
        WHEN 'approved' THEN '✅ تمت الموافقة على طلب السحب'
        WHEN 'rejected' THEN '❌ رُفض طلب السحب'
        WHEN 'paid'     THEN '💸 تم تحويل أرباحك'
        ELSE 'تحديث طلب سحب'
      END,
      'مبلغ ' || NEW.amount || ' ر.س — ' ||
      CASE NEW.status
        WHEN 'rejected' THEN COALESCE('سبب: ' || NEW.admin_notes, 'تم إعادة المبلغ إلى محفظتك')
        WHEN 'paid' THEN 'تم التحويل إلى ' || NEW.bank_name
        ELSE 'حالة جديدة: ' || NEW.status
      END,
      'wallet', '/referrals'
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE FUNCTION public.insert_audit_log(_table_name text, _action text, _record_id uuid DEFAULT NULL::uuid, _old_data jsonb DEFAULT NULL::jsonb, _new_data jsonb DEFAULT NULL::jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.audit_logs (table_name, action, user_id, record_id, old_data, new_data, created_at)
  VALUES (_table_name, _action, auth.uid(), _record_id, _old_data, _new_data, now());
END;
$$;

CREATE FUNCTION public.is_financing_admin(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin'::public.app_role,'moderator'::public.app_role)
  );
$$;

CREATE FUNCTION public.is_valid_lifecycle_transition(_from public.order_lifecycle_status, _to public.order_lifecycle_status) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    SET search_path TO 'public'
    AS $$
  SELECT CASE
    WHEN _to = 'cancelled' AND _from NOT IN ('completed','cancelled') THEN true
    WHEN _from = 'received'         AND _to IN ('under_review','quote_sent') THEN true
    WHEN _from = 'under_review'     AND _to IN ('quote_sent') THEN true
    WHEN _from = 'quote_sent'       AND _to IN ('quote_accepted','under_review') THEN true
    WHEN _from = 'quote_accepted'   AND _to IN ('contract_pending') THEN true
    WHEN _from = 'contract_pending' AND _to IN ('contract_signed') THEN true
    WHEN _from = 'contract_signed'  AND _to IN ('payment_pending','paid','in_progress') THEN true
    WHEN _from = 'payment_pending'  AND _to IN ('paid','in_progress') THEN true
    WHEN _from = 'paid'             AND _to IN ('in_progress') THEN true
    WHEN _from = 'in_progress'      AND _to IN ('delivered') THEN true
    WHEN _from = 'delivered'        AND _to IN ('completed','in_progress') THEN true
    WHEN _from = _to THEN true
    ELSE false
  END;
$$;

CREATE FUNCTION public.join_group_order(_invite_code text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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

CREATE FUNCTION public.launch_experiment(p_experiment_id uuid) RETURNS public.experiments
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_exp public.experiments%ROWTYPE; v_total NUMERIC; v_count INT; v_before JSONB; BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT * INTO v_exp FROM public.experiments WHERE id = p_experiment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'experiment not found'; END IF;
  IF v_exp.status NOT IN ('draft','paused') THEN RAISE EXCEPTION 'invalid status transition'; END IF;
  IF v_exp.primary_metric IS NULL OR v_exp.primary_metric = '' THEN RAISE EXCEPTION 'primary_metric required'; END IF;

  SELECT COUNT(*), COALESCE(SUM(allocation_percentage),0) INTO v_count, v_total
    FROM public.experiment_variants WHERE experiment_id = p_experiment_id;
  IF v_count < 2 THEN RAISE EXCEPTION 'at least 2 variants required'; END IF;
  IF ROUND(v_total,2) <> 100 THEN RAISE EXCEPTION 'allocation_percentages must total 100, got %', v_total; END IF;

  v_before := to_jsonb(v_exp);
  UPDATE public.experiments SET status='running', start_at=COALESCE(start_at, now()) WHERE id=p_experiment_id RETURNING * INTO v_exp;
  INSERT INTO public.experiment_audit_logs(experiment_id, action_type, actor_user_id, before_state, after_state)
    VALUES (p_experiment_id, 'launch_experiment', auth.uid(), v_before, to_jsonb(v_exp));
  RETURN v_exp;
END; $$;

CREATE FUNCTION public.lifecycle_progress(_status public.order_lifecycle_status) RETURNS integer
    LANGUAGE sql IMMUTABLE
    SET search_path TO 'public'
    AS $$
  SELECT CASE _status
    WHEN 'received'          THEN 5
    WHEN 'under_review'      THEN 12
    WHEN 'quote_sent'        THEN 20
    WHEN 'quote_accepted'    THEN 28
    WHEN 'contract_pending'  THEN 36
    WHEN 'contract_signed'   THEN 45
    WHEN 'payment_pending'   THEN 52
    WHEN 'paid'              THEN 62
    WHEN 'in_progress'       THEN 75
    WHEN 'delivered'         THEN 92
    WHEN 'completed'         THEN 100
    WHEN 'cancelled'         THEN 0
  END
$$;

CREATE FUNCTION public.lifecycle_status_ar(p_status text) RETURNS text
    LANGUAGE sql IMMUTABLE
    SET search_path TO 'public'
    AS $$
  SELECT CASE p_status
    WHEN 'received'         THEN 'تم استلام الطلب'
    WHEN 'under_review'     THEN 'قيد المراجعة الأكاديمية'
    WHEN 'quote_sent'       THEN 'تم إرسال عرض السعر — بانتظار موافقتك'
    WHEN 'quote_accepted'   THEN 'تمت الموافقة على عرض السعر'
    WHEN 'contract_pending' THEN 'بانتظار توقيع العقد'
    WHEN 'contract_signed'  THEN 'تم توقيع العقد رسمياً'
    WHEN 'payment_pending'  THEN 'بانتظار سداد المستحقات المالية'
    WHEN 'paid'             THEN 'تم استلام الدفعة بنجاح'
    WHEN 'in_progress'      THEN 'قيد التنفيذ بواسطة الفريق الأكاديمي'
    WHEN 'delivered'        THEN 'تم التسليم بنجاح'
    WHEN 'completed'        THEN 'الطلب مكتمل ومُسلَّم'
    WHEN 'cancelled'        THEN 'تم إلغاء الطلب'
    WHEN 'new'              THEN 'طلب جديد قيد المراجعة'
    WHEN 'pending_review'   THEN 'قيد المراجعة الأكاديمية'
    WHEN 'awaiting_payment' THEN 'بانتظار سداد المستحقات'
    WHEN 'execution'        THEN 'مرحلة التنفيذ الأكاديمي'
    WHEN 'review'           THEN 'مرحلة المراجعة والتدقيق'
    WHEN 'ready_for_delivery' THEN 'جاهز للتسليم'
    WHEN 'on_hold'          THEN 'موقوف مؤقتاً'
    ELSE p_status
  END;
$$;

CREATE FUNCTION public.link_anonymous_assessment_attempts(p_anonymous_id text) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_count INT;
BEGIN
  IF auth.uid() IS NULL OR p_anonymous_id IS NULL THEN RETURN 0; END IF;
  UPDATE public.assessment_attempts
    SET user_id = auth.uid()
    WHERE anonymous_id = p_anonymous_id AND user_id IS NULL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

CREATE FUNCTION public.log_financing_status_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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

CREATE FUNCTION public.log_invoice_created() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.invoice_timeline (invoice_id, action_type, action_label, action_description, actor_user_id)
  VALUES (NEW.id, 'created', 'إنشاء الفاتورة',
          'تم إنشاء الفاتورة رقم ' || NEW.invoice_number, auth.uid());
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.log_referral_created() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.referral_audit_logs
    (action_type, referral_id, referrer_user_id, referred_user_id, membership_id, amount, reason)
  VALUES
    ('referral_created', NEW.id, NEW.referrer_user_id, NEW.referred_user_id, NEW.membership_id,
     NEW.commission_amount, 'Referral row created with status=' || NEW.status);
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.log_smart_editor_usage(_operation text, _mode text, _input_length integer, _output_length integer, _cost numeric, _was_free boolean, _wallet_transaction_id uuid DEFAULT NULL::uuid) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_id UUID;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  INSERT INTO public.smart_editor_usage
    (user_id, operation, mode, input_length, output_length, cost, was_free, wallet_transaction_id)
  VALUES
    (v_uid, _operation, _mode, _input_length, _output_length, _cost, _was_free, _wallet_transaction_id)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE FUNCTION public.mark_bonus_drop_seen(p_drop_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  INSERT INTO public.bonus_drop_views (bonus_drop_id, user_id)
  VALUES (p_drop_id, auth.uid())
  ON CONFLICT (bonus_drop_id, user_id) DO NOTHING;
END; $$;

CREATE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb) RETURNS bigint
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
EXCEPTION WHEN undefined_table THEN
  BEGIN
    PERFORM pgmq.create(dlq_name);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  BEGIN
    PERFORM pgmq.delete(source_queue, message_id);
  EXCEPTION WHEN undefined_table THEN
    NULL;
  END;
  RETURN new_id;
END;
$$;

CREATE FUNCTION public.notify_admins_new_order() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  admin_record RECORD;
  order_title TEXT;
BEGIN
  order_title := COALESCE(NEW.service_name, 'طلب جديد');

  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  SELECT
    ur.user_id,
    '📦 طلب جديد: ' || order_title,
    'تم استلام طلب جديد برقم ' || NEW.tracking_id || ' ويحتاج مراجعة',
    'order',
    '/adminmaster/orders'
  FROM public.user_roles ur
  WHERE ur.role = 'admin';

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.notify_admins_topup_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  SELECT ur.user_id,
         '💰 طلب شحن محفظة جديد',
         'طلب شحن بمبلغ ' || NEW.amount || ' ر.س بانتظار المراجعة',
         'wallet',
         '/adminmaster/wallets'
  FROM public.user_roles ur WHERE ur.role = 'admin';
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.notify_financing_status_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions'
    AS $$
DECLARE
  v_event text;
  v_url_wa  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-whatsapp-notify';
  v_url_em  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-email-notify';
  v_key     constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
  v_body    jsonb;
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status) THEN
    RETURN NEW;
  END IF;
  v_event := CASE NEW.status::text
    WHEN 'submitted' THEN 'submitted'
    WHEN 'documents_pending' THEN 'documents_pending'
    WHEN 'under_review' THEN 'under_review'
    WHEN 'contract_pending_signature' THEN 'contract_pending_signature'
    WHEN 'waiting_down_payment' THEN 'waiting_down_payment'
    WHEN 'approved' THEN 'approved'
    WHEN 'execution_deed' THEN 'execution_deed'
    WHEN 'active' THEN 'active'
    WHEN 'completed' THEN 'completed'
    WHEN 'rejected' THEN 'rejected'
    WHEN 'cancelled' THEN 'cancelled'
    WHEN 'overdue' THEN 'installment_overdue'
    ELSE 'status_update'
  END;
  IF NEW.status::text = 'draft' THEN RETURN NEW; END IF;

  v_body := jsonb_build_object(
    'application_id', NEW.id,
    'event', v_event,
    'extra', jsonb_build_object(
      'new_status', NEW.status,
      'old_status', CASE WHEN TG_OP='UPDATE' THEN OLD.status ELSE NULL END
    )
  );

  IF NEW.applicant_phone IS NOT NULL AND length(trim(NEW.applicant_phone)) > 0 THEN
    PERFORM net.http_post(
      url := v_url_wa,
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key),
      body := v_body
    );
  END IF;

  IF NEW.applicant_email IS NOT NULL AND length(trim(NEW.applicant_email)) > 0 THEN
    PERFORM net.http_post(
      url := v_url_em,
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key),
      body := v_body
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.notify_installment_overdue() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions'
    AS $$
DECLARE
  v_url_wa  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-whatsapp-notify';
  v_url_em  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-email-notify';
  v_key     constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
  v_app_phone text;
  v_app_email text;
  v_app_id    uuid;
  v_body      jsonb;
  v_days      int;
BEGIN
  IF NEW.status = 'overdue' AND (OLD.status IS DISTINCT FROM 'overdue') THEN
    SELECT applicant_phone, applicant_email, id INTO v_app_phone, v_app_email, v_app_id
      FROM public.financing_applications WHERE id = NEW.application_id;
    v_days := GREATEST(0, (CURRENT_DATE - NEW.due_date)::int);
    v_body := jsonb_build_object(
      'application_id', v_app_id,
      'event', 'installment_overdue',
      'extra', jsonb_build_object(
        'installment_id', NEW.id,
        'installment_number', NEW.month_number,
        'installment_amount', NEW.amount,
        'installment_due_date', NEW.due_date,
        'days_overdue', v_days
      )
    );
    IF v_app_phone IS NOT NULL AND length(trim(v_app_phone)) > 0 THEN
      PERFORM net.http_post(url := v_url_wa, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    END IF;
    IF v_app_email IS NOT NULL AND length(trim(v_app_email)) > 0 THEN
      PERFORM net.http_post(url := v_url_em, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.notify_referrer_via_whatsapp() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_phone text;
  v_referred_name text;
  v_supabase_url text;
  v_service_key text;
  v_message text;
BEGIN
  IF NEW.status <> 'rewarded' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'rewarded' THEN
    RETURN NEW;
  END IF;

  SELECT phone INTO v_phone
  FROM public.customers
  WHERE user_id = NEW.referrer_user_id
    AND phone IS NOT NULL AND phone <> ''
  LIMIT 1;

  IF v_phone IS NULL OR v_phone = '' THEN
    RAISE WARNING 'notify_referrer_via_whatsapp: no phone for referrer %', NEW.referrer_user_id;
    RETURN NEW;
  END IF;

  SELECT name INTO v_referred_name
  FROM public.customers
  WHERE user_id = NEW.referred_user_id
  LIMIT 1;

  v_referred_name := COALESCE(v_referred_name, 'عضو جديد');

  v_message := '🎁 *عمولة إحالة جديدة!*' || E'\n\n' ||
               'تهانينا! تم إيداع *' || NEW.commission_amount || ' ر.س* في محفظتك.' || E'\n\n' ||
               '👤 العضو: ' || v_referred_name || E'\n' ||
               '💰 المبلغ: ' || NEW.commission_amount || ' ر.س' || E'\n\n' ||
               'يمكنك سحب رصيدك أو استخدامه في أي خدمة من المنصة.' || E'\n' ||
               'شكراً لثقتك بمنصة ماستر إيدو باث 🌟';

  SELECT decrypted_secret INTO v_supabase_url
  FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;
  SELECT decrypted_secret INTO v_service_key
  FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

  IF v_supabase_url IS NULL THEN
    v_supabase_url := 'https://kziujhdqogqeehtxgpax.supabase.co';
  END IF;

  IF v_service_key IS NULL THEN
    RAISE WARNING 'notify_referrer_via_whatsapp: service_role_key missing in vault';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := v_supabase_url || '/functions/v1/whatsapp-send',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_key,
      'apikey', v_service_key
    ),
    body := jsonb_build_object(
      'to', v_phone,
      'message', v_message,
      'event_key', 'referral_commission',
      'user_id', NEW.referrer_user_id,
      'related_entity_type', 'member_referral',
      'related_entity_id', NEW.id
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_referrer_via_whatsapp failed for referral %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.notify_research_publication_event() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'net'
    AS $$
DECLARE
  v_pub RECORD;
  v_event TEXT;
  v_message TEXT := NULL;
  v_supabase_url TEXT := 'https://kziujhdqogqeehtxgpax.supabase.co';
  v_anon TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
BEGIN
  IF TG_TABLE_NAME = 'research_publications' THEN
    IF TG_OP = 'INSERT' THEN
      v_event := 'research_publication_created';
      v_pub := NEW;
    ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
      v_event := 'research_publication_status_' || NEW.status;
      v_pub := NEW;
    ELSE
      RETURN NEW;
    END IF;
  ELSIF TG_TABLE_NAME = 'research_publication_messages' AND NEW.sender_type = 'admin' THEN
    SELECT * INTO v_pub FROM public.research_publications WHERE id = NEW.publication_id;
    v_event := 'research_publication_admin_reply';
    v_message := NEW.message;
  ELSE
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := v_supabase_url || '/functions/v1/research-publication-notify',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_anon
    ),
    body := jsonb_build_object(
      'event', v_event,
      'publication_id', v_pub.id,
      'phone', v_pub.client_phone,
      'client_name', v_pub.client_name,
      'request_number', v_pub.request_number,
      'title', v_pub.title,
      'status', v_pub.status,
      'message', v_message
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_research_publication_event failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.notify_student_whatsapp(_user_id uuid, _type text, _message text, _reference_id uuid DEFAULT NULL::uuid, _reference_kind text DEFAULT NULL::text, _dedupe_key text DEFAULT NULL::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_dedupe TEXT;
  v_log_id UUID;
BEGIN
  v_dedupe := COALESCE(_dedupe_key, _type || ':' || _user_id::text || ':' || COALESCE(_reference_id::text, '') || ':' || to_char(now() AT TIME ZONE 'Asia/Riyadh', 'YYYY-MM-DD-HH24-MI'));

  INSERT INTO public.student_notifications_log (user_id, notification_type, reference_id, reference_kind, message, dedupe_key, status, scheduled_for)
  VALUES (_user_id, _type, _reference_id, _reference_kind, _message, v_dedupe, 'pending', now())
  ON CONFLICT (dedupe_key) DO NOTHING
  RETURNING id INTO v_log_id;

  IF v_log_id IS NULL THEN
    RETURN; -- already queued/sent
  END IF;

  PERFORM net.http_post(
    url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/student-whatsapp-notifier',
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := jsonb_build_object('log_id', v_log_id)
  );
END;
$$;

CREATE FUNCTION public.notify_ticket_whatsapp() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $_$
DECLARE
  v_phone text;
  v_name text;
  v_ticket public.tickets%ROWTYPE;
  v_template text;
  v_vars jsonb;
  v_should_send boolean := false;
  v_supabase_url text := 'https://kziujhdqogqeehtxgpax.supabase.co';
  v_service_key text;
  v_old_status text;
  v_new_status text;
BEGIN
  IF TG_TABLE_NAME = 'tickets' THEN
    v_ticket := NEW;
  ELSIF TG_TABLE_NAME = 'ticket_messages' THEN
    SELECT * INTO v_ticket FROM public.tickets WHERE id = NEW.ticket_id;
    IF NOT FOUND THEN RETURN NEW; END IF;
  END IF;

  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.customers c
  WHERE c.user_id = v_ticket.user_id
  ORDER BY c.created_at DESC
  LIMIT 1;

  IF v_phone IS NULL OR length(v_phone) < 8 THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'tickets' AND TG_OP = 'INSERT' THEN
    v_template := 'ticket_created';
    v_vars := jsonb_build_object(
      'name', COALESCE(v_name, 'عميلنا الكريم'),
      'ticket_number', v_ticket.ticket_number,
      'subject', v_ticket.subject
    );
    v_should_send := true;
  ELSIF TG_TABLE_NAME = 'tickets' AND TG_OP = 'UPDATE' THEN
    BEGIN
      EXECUTE 'SELECT ($1).status, ($2).status' INTO v_old_status, v_new_status USING OLD, NEW;
    EXCEPTION WHEN OTHERS THEN
      v_old_status := NULL; v_new_status := NULL;
    END;
    IF v_old_status IS DISTINCT FROM v_new_status
       AND v_new_status IN ('resolved','in_progress','waiting') THEN
      v_template := 'ticket_status_changed';
      v_vars := jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا الكريم'),
        'ticket_number', v_ticket.ticket_number,
        'subject', v_ticket.subject,
        'status', CASE v_new_status
          WHEN 'resolved' THEN 'تم الحل ✅'
          WHEN 'in_progress' THEN 'قيد المعالجة 🔧'
          WHEN 'waiting' THEN 'بانتظار ردك ⏳'
          ELSE v_new_status
        END
      );
      v_should_send := true;
    END IF;
  ELSIF TG_TABLE_NAME = 'ticket_messages' AND TG_OP = 'INSERT'
        AND NEW.sender_type = 'admin' THEN
    v_template := 'ticket_admin_reply';
    v_vars := jsonb_build_object(
      'name', COALESCE(v_name, 'عميلنا الكريم'),
      'ticket_number', v_ticket.ticket_number,
      'subject', v_ticket.subject,
      'message_preview', LEFT(NEW.content, 120)
    );
    v_should_send := true;
  END IF;

  IF v_should_send THEN
    BEGIN
      v_service_key := current_setting('app.settings.service_role_key', true);
      PERFORM net.http_post(
        url := v_supabase_url || '/functions/v1/send-whatsapp',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || COALESCE(v_service_key, '')
        ),
        body := jsonb_build_object(
          'to', v_phone,
          'template_name', v_template,
          'variables', v_vars,
          'language', 'ar'
        )
      );
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  RETURN NEW;
END;
$_$;

CREATE FUNCTION public.notify_whatsapp_event(_to text, _event_key text, _variables jsonb DEFAULT '{}'::jsonb, _related_entity_type text DEFAULT NULL::text, _related_entity_id text DEFAULT NULL::text, _user_id uuid DEFAULT NULL::uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions', 'net'
    AS $$
DECLARE
  v_url text;
  v_anon text;
  v_settings record;
BEGIN
  IF _to IS NULL OR length(trim(_to)) = 0 THEN RETURN; END IF;

  SELECT is_enabled, events_enabled INTO v_settings
  FROM public.whatsapp_settings WHERE id = 1;
  IF v_settings IS NULL OR v_settings.is_enabled IS NOT TRUE THEN RETURN; END IF;
  IF (v_settings.events_enabled ->> _event_key) = 'false' THEN RETURN; END IF;

  v_url := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/whatsapp-send';
  v_anon := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';

  PERFORM net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_anon
    ),
    body := jsonb_build_object(
      'to', _to,
      'event_key', _event_key,
      'variables', _variables,
      'related_entity_type', _related_entity_type,
      'related_entity_id', _related_entity_id,
      'user_id', _user_id
    )
  );
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_whatsapp_event failed: %', SQLERRM;
END $$;

CREATE FUNCTION public.on_contract_signed_create_invoice() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_order record;
  v_invoice_id uuid;
  v_existing uuid;
BEGIN
  IF NEW.status = 'signed' AND OLD.status IS DISTINCT FROM 'signed' AND NEW.service_order_id IS NOT NULL THEN
    SELECT * INTO v_order FROM public.service_orders WHERE id = NEW.service_order_id;
    IF v_order.id IS NULL THEN RETURN NEW; END IF;

    SELECT id INTO v_existing FROM public.invoices WHERE order_id = v_order.id LIMIT 1;
    IF v_existing IS NULL THEN
      INSERT INTO public.invoices (
        user_id, customer_id, order_id,
        customer_name, customer_email, customer_phone,
        subtotal, total_amount, currency, status, due_date, issue_date
      ) VALUES (
        v_order.user_id, v_order.customer_id, v_order.id,
        NEW.client_full_name, NEW.client_email, NEW.client_phone,
        COALESCE(v_order.total_amount, NEW.total_amount, 0),
        COALESCE(v_order.total_amount, NEW.total_amount, 0),
        COALESCE(NEW.currency, 'SAR'),
        'pending', (CURRENT_DATE + INTERVAL '7 days'), CURRENT_DATE
      ) RETURNING id INTO v_invoice_id;
    ELSE
      v_invoice_id := v_existing;
    END IF;

    UPDATE public.service_orders
       SET lifecycle_status = 'payment_pending',
           signed_contract_id = NEW.id,
           active_invoice_id = v_invoice_id,
           updated_at = now()
     WHERE id = v_order.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.on_delivery_file_uploaded() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_order_id uuid;
BEGIN
  IF NEW.is_delivery = true AND NEW.uploaded_by_admin = true THEN
    v_order_id := COALESCE(NEW.service_order_id, NEW.order_id);
    UPDATE public.service_orders
       SET lifecycle_status = 'delivered', updated_at = now()
     WHERE id = v_order_id
       AND lifecycle_status IN ('in_progress','paid');
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.on_invoice_paid_start_execution() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.order_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM 'paid') THEN
    UPDATE public.service_orders
       SET lifecycle_status = 'in_progress', updated_at = now()
     WHERE id = NEW.order_id
       AND lifecycle_status IN ('payment_pending','contract_signed','paid');
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.on_quote_accepted_create_contract() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_customer record;
  v_contract_id uuid;
BEGIN
  IF NEW.quote_status IS DISTINCT FROM OLD.quote_status AND NEW.quote_status = 'accepted' THEN
    SELECT id INTO v_contract_id FROM public.contracts WHERE service_order_id = NEW.id LIMIT 1;

    IF v_contract_id IS NULL THEN
      SELECT c.id, c.name, c.email, c.phone INTO v_customer
        FROM public.customers c WHERE c.id = NEW.customer_id;

      INSERT INTO public.contracts (
        user_id, service_order_id, customer_id, title,
        service_name, service_type, total_amount, currency,
        client_full_name, client_email, client_phone,
        status, content
      ) VALUES (
        NEW.user_id, NEW.id, NEW.customer_id,
        'عقد خدمة: ' || COALESCE(NEW.service_name, 'خدمة أكاديمية'),
        NEW.service_name, COALESCE(NEW.service_name, 'general'),
        COALESCE(NEW.total_amount, 0), 'SAR',
        v_customer.name, v_customer.email, v_customer.phone,
        'pending_signature',
        'عقد آلي للخدمة "' || COALESCE(NEW.service_name, 'خدمة أكاديمية') ||
        '" بمبلغ إجمالي ' || COALESCE(NEW.total_amount, 0)::text || ' ر.س.'
      ) RETURNING id INTO v_contract_id;
    END IF;

    NEW.lifecycle_status := 'contract_pending';
    NEW.signed_contract_id := v_contract_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.on_referral_inserted_viral() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_count INTEGER;
BEGIN
  PERFORM public.grant_referral_viral_reward(
    NEW.id, NEW.referrer_user_id, NEW.referred_user_id,
    'signup', 200, 100,
    'مكافأة دعوة صديق جديد +200 نقطة'
  );

  SELECT COUNT(*) INTO v_count
    FROM public.referrals
   WHERE referrer_user_id = NEW.referrer_user_id;

  IF v_count >= 3 THEN
    INSERT INTO public.user_secret_features (user_id, feature_key, metadata)
    VALUES (NEW.referrer_user_id, 'secret_referral_3', jsonb_build_object('unlocked_via', 'referral_count'))
    ON CONFLICT (user_id, feature_key) DO NOTHING;

    PERFORM public.grant_referral_viral_reward(
      NEW.id, NEW.referrer_user_id, NEW.referred_user_id,
      'three_referrals_secret', 500, 250,
      '🎁 فتحت ميزة سرية بعد 3 إحالات!'
    );
  END IF;

  RETURN NEW;
END; $$;

CREATE FUNCTION public.on_ticket_after_insert() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
END $$;

CREATE FUNCTION public.on_ticket_before_insert() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.sla_due_at IS NULL THEN
    NEW.sla_due_at := public.compute_ticket_sla(NEW.priority, COALESCE(NEW.created_at, now()));
  END IF;
  IF NEW.last_message_at IS NULL THEN
    NEW.last_message_at := COALESCE(NEW.created_at, now());
  END IF;
  NEW.unread_for_admin := 1;
  RETURN NEW;
END $$;

CREATE FUNCTION public.on_ticket_message_insert() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
END $$;

CREATE FUNCTION public.on_ticket_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
END $$;

CREATE FUNCTION public.pause_experiment(p_experiment_id uuid, p_note text DEFAULT NULL::text) RETURNS public.experiments
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_exp public.experiments%ROWTYPE; v_before JSONB; BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT * INTO v_exp FROM public.experiments WHERE id = p_experiment_id FOR UPDATE;
  IF v_exp.status <> 'running' THEN RAISE EXCEPTION 'experiment not running'; END IF;
  v_before := to_jsonb(v_exp);
  UPDATE public.experiments SET status='paused' WHERE id=p_experiment_id RETURNING * INTO v_exp;
  INSERT INTO public.experiment_audit_logs(experiment_id, action_type, actor_user_id, before_state, after_state, note)
    VALUES (p_experiment_id, 'pause_experiment', auth.uid(), v_before, to_jsonb(v_exp), p_note);
  RETURN v_exp;
END; $$;

CREATE FUNCTION public.pay_group_seat_with_wallet(_group_order_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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

CREATE FUNCTION public.pay_installment_from_wallet(p_installment_id uuid, p_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_inst record;
  v_app record;
  v_wallet record;
  v_tx_id uuid;
  v_remaining numeric;
BEGIN
  SELECT * INTO v_inst FROM public.financing_installments
  WHERE id = p_installment_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'installment_not_found');
  END IF;

  IF v_inst.status = 'paid' THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_paid');
  END IF;

  SELECT * INTO v_app FROM public.financing_applications
  WHERE id = v_inst.application_id;
  IF v_app.user_id <> p_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'wallet_not_found');
  END IF;

  IF v_wallet.balance < v_inst.amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'insufficient_balance',
      'required', v_inst.amount,
      'available', v_wallet.balance
    );
  END IF;

  INSERT INTO public.wallet_transactions (
    wallet_id, user_id, type, amount, description,
    reference_type, reference_id
  ) VALUES (
    v_wallet.id, p_user_id, 'withdrawal', v_inst.amount,
    'سداد قسط رقم ' || v_inst.month_number || ' من تمويل #' || substring(v_app.id::text, 1, 8),
    'financing_installment', v_inst.id
  ) RETURNING id INTO v_tx_id;

  UPDATE public.financing_installments
  SET status = 'paid',
      paid_at = now(),
      paid_amount = v_inst.amount,
      wallet_transaction_id = v_tx_id
  WHERE id = v_inst.id;

  UPDATE public.financing_applications
  SET remaining_amount = GREATEST(0, remaining_amount - v_inst.amount),
      updated_at = now()
  WHERE id = v_app.id
  RETURNING remaining_amount INTO v_remaining;

  IF v_remaining <= 0 THEN
    UPDATE public.financing_applications
    SET status = 'completed'::financing_status
    WHERE id = v_app.id AND status = 'active'::financing_status;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_tx_id,
    'remaining_amount', v_remaining
  );
END;
$$;

CREATE FUNCTION public.prevent_financing_ack_modify() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  RAISE EXCEPTION 'financing_acknowledgments are immutable once signed';
END;
$$;

CREATE FUNCTION public.process_auto_debit_installments() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_inst record;
  v_result jsonb;
  v_processed int := 0;
  v_succeeded int := 0;
  v_failed int := 0;
BEGIN
  FOR v_inst IN
    SELECT i.id, i.application_id, a.user_id
    FROM public.financing_installments i
    JOIN public.financing_applications a ON a.id = i.application_id
    WHERE i.status = 'pending'
      AND i.due_date <= CURRENT_DATE
      AND a.auto_debit_enabled = true
      AND a.status = 'active'::financing_status
    LIMIT 200
  LOOP
    v_processed := v_processed + 1;
    BEGIN
      v_result := public.pay_installment_from_wallet(v_inst.id, v_inst.user_id);
      IF (v_result->>'success')::boolean THEN
        v_succeeded := v_succeeded + 1;
      ELSE
        v_failed := v_failed + 1;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      v_failed := v_failed + 1;
    END;
  END LOOP;

  RETURN jsonb_build_object(
    'processed', v_processed,
    'succeeded', v_succeeded,
    'failed', v_failed,
    'run_at', now()
  );
END;
$$;

CREATE FUNCTION public.purchase_cv(_cv_id uuid, _template_key text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_cv RECORD;
  v_wallet RECORD;
  v_membership RECORD;
  v_price NUMERIC := 15;
  v_was_free BOOLEAN := false;
  v_free_reason TEXT := NULL;
  v_tx_id UUID := NULL;
  v_purchase_id UUID;
  v_existing_purchase RECORD;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;
  IF _template_key IS NULL OR length(_template_key) = 0 THEN
    RAISE EXCEPTION 'يجب اختيار قالب';
  END IF;

  SELECT * INTO v_cv FROM public.academic_cvs
   WHERE id = _cv_id AND user_id = v_uid FOR UPDATE;
  IF v_cv IS NULL THEN
    RAISE EXCEPTION 'السيرة غير موجودة';
  END IF;

  SELECT * INTO v_existing_purchase FROM public.cv_purchases
   WHERE cv_id = _cv_id AND status = 'completed' LIMIT 1;
  IF v_existing_purchase.id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'ok', true,
      'already_purchased', true,
      'purchase_id', v_existing_purchase.id,
      'locked_template_key', v_cv.locked_template_key,
      'charged', 0
    );
  END IF;

  SELECT * INTO v_membership FROM public.get_active_membership(v_uid) LIMIT 1;
  IF v_membership.membership_id IS NOT NULL THEN
    v_was_free := true;
    v_free_reason := 'membership';
  END IF;

  IF NOT v_was_free THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets(user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions(wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'شراء سيرة ذاتية أكاديمية',
            'academic_cv', _cv_id)
    RETURNING id INTO v_tx_id;
  END IF;

  INSERT INTO public.cv_purchases(
    user_id, cv_id, template_key, amount, was_free, free_reason,
    payment_method, wallet_transaction_id, status
  ) VALUES (
    v_uid, _cv_id, _template_key,
    CASE WHEN v_was_free THEN 0 ELSE v_price END,
    v_was_free, v_free_reason,
    'wallet', v_tx_id, 'completed'
  ) RETURNING id INTO v_purchase_id;

  PERFORM set_config('app.bypass_cv_lock_guard', 'true', true);
  UPDATE public.academic_cvs
     SET status = 'paid',
         template_key = _template_key,
         locked_template_key = _template_key,
         paid_at = now(),
         paid_amount = CASE WHEN v_was_free THEN 0 ELSE v_price END,
         purchase_id = v_purchase_id,
         template_swap_used = false,
         template_swap_deadline = now() + interval '24 hours',
         updated_at = now()
   WHERE id = _cv_id;
  PERFORM set_config('app.bypass_cv_lock_guard', 'false', true);

  RETURN jsonb_build_object(
    'ok', true,
    'purchase_id', v_purchase_id,
    'was_free', v_was_free,
    'free_reason', v_free_reason,
    'charged', CASE WHEN v_was_free THEN 0 ELSE v_price END,
    'locked_template_key', _template_key,
    'swap_deadline', (now() + interval '24 hours')
  );
END;
$$;

CREATE FUNCTION public.purchase_cv_export(_cv_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_template TEXT;
BEGIN
  SELECT template_key INTO v_template FROM public.academic_cvs WHERE id = _cv_id;
  IF v_template IS NULL THEN RAISE EXCEPTION 'السيرة غير موجودة'; END IF;
  RETURN public.purchase_cv(_cv_id, v_template);
END;
$$;

CREATE FUNCTION public.purchase_stat_analysis(_analysis_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_analysis RECORD;
  v_wallet RECORD;
  v_membership RECORD;
  v_price NUMERIC := 10;
  v_is_member BOOLEAN := false;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  SELECT * INTO v_analysis FROM public.statistical_analyses
   WHERE id = _analysis_id AND user_id = v_uid FOR UPDATE;
  IF v_analysis IS NULL THEN
    RAISE EXCEPTION 'التحليل غير موجود';
  END IF;

  IF v_analysis.is_paid THEN
    RETURN jsonb_build_object('ok', true, 'already_paid', true, 'charged', 0);
  END IF;

  SELECT * INTO v_membership FROM public.get_active_membership(v_uid);
  IF v_membership.membership_id IS NOT NULL THEN
    v_is_member := true;
    v_price := 0;
  END IF;

  IF v_price > 0 THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'تحليل إحصائي: ' || COALESCE(v_analysis.analysis_type, 'تحليل'),
            'statistical_analysis', _analysis_id);
  END IF;

  UPDATE public.statistical_analyses
     SET is_paid = true, status = 'paid', updated_at = now()
   WHERE id = _analysis_id;

  RETURN jsonb_build_object('ok', true, 'charged', v_price, 'is_member', v_is_member);
END;
$$;

CREATE FUNCTION public.purchase_stat_pdf(_analysis_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_analysis RECORD;
  v_wallet RECORD;
  v_membership RECORD;
  v_price NUMERIC := 5;
  v_is_member BOOLEAN := false;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  SELECT * INTO v_analysis FROM public.statistical_analyses
   WHERE id = _analysis_id AND user_id = v_uid FOR UPDATE;
  IF v_analysis IS NULL THEN
    RAISE EXCEPTION 'التحليل غير موجود';
  END IF;
  IF NOT v_analysis.is_paid THEN
    RAISE EXCEPTION 'يجب تنفيذ التحليل أولاً';
  END IF;

  IF v_analysis.pdf_purchased THEN
    UPDATE public.statistical_analyses
       SET pdf_exports_count = pdf_exports_count + 1, updated_at = now()
     WHERE id = _analysis_id;
    RETURN jsonb_build_object('ok', true, 'already_purchased', true, 'charged', 0);
  END IF;

  SELECT * INTO v_membership FROM public.get_active_membership(v_uid);
  IF v_membership.membership_id IS NOT NULL THEN
    v_is_member := true;
    v_price := 0;
  END IF;

  IF v_price > 0 THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'تقرير PDF لتحليل إحصائي',
            'statistical_analysis_pdf', _analysis_id);
  END IF;

  UPDATE public.statistical_analyses
     SET pdf_purchased = true, pdf_exports_count = pdf_exports_count + 1, updated_at = now()
   WHERE id = _analysis_id;

  RETURN jsonb_build_object('ok', true, 'charged', v_price, 'is_member', v_is_member);
END;
$$;

CREATE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer) RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY SELECT r.msg_id, r.read_ct, r.message FROM pgmq.read(queue_name, vt, batch_size) r;
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN;
END;
$$;

CREATE FUNCTION public.recompute_invoice_paid_status() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_invoice_id uuid;
  v_total numeric;
  v_paid numeric;
  v_new_status text;
  v_paid_at timestamptz;
BEGIN
  v_invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);

  SELECT COALESCE(SUM(amount), 0)
    INTO v_paid
    FROM public.invoice_payments
   WHERE invoice_id = v_invoice_id
     AND status = 'completed';

  SELECT COALESCE(total_amount, 0) INTO v_total
    FROM public.invoices WHERE id = v_invoice_id;

  IF v_paid >= v_total AND v_total > 0 THEN
    v_new_status := 'paid';
    v_paid_at := now();
  ELSIF v_paid > 0 THEN
    v_new_status := 'partially_paid';
    v_paid_at := NULL;
  ELSE
    v_new_status := 'sent';
    v_paid_at := NULL;
  END IF;

  UPDATE public.invoices
     SET paid_amount = v_paid,
         status = CASE WHEN status = 'cancelled' THEN status ELSE v_new_status END,
         paid_at = COALESCE(v_paid_at, paid_at),
         updated_at = now()
   WHERE id = v_invoice_id;

  RETURN NULL;
END;
$$;

CREATE FUNCTION public.record_cv_export(_cv_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_cv RECORD;
  v_membership RECORD;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  SELECT * INTO v_cv FROM public.academic_cvs WHERE id = _cv_id AND user_id = v_uid;
  IF v_cv IS NULL THEN RAISE EXCEPTION 'السيرة غير موجودة'; END IF;

  SELECT * INTO v_membership FROM public.get_active_membership(v_uid) LIMIT 1;

  IF v_cv.status <> 'paid' AND v_membership.membership_id IS NULL THEN
    RAISE EXCEPTION 'هذه السيرة غير مدفوعة — لا يمكن التصدير';
  END IF;

  PERFORM set_config('app.bypass_cv_lock_guard', 'true', true);
  UPDATE public.academic_cvs
     SET exports_count = exports_count + 1,
         last_exported_at = now(),
         updated_at = now()
   WHERE id = _cv_id;
  PERFORM set_config('app.bypass_cv_lock_guard', 'false', true);

  RETURN jsonb_build_object('ok', true, 'exports_count', v_cv.exports_count + 1);
END;
$$;

CREATE FUNCTION public.record_growth_event(p_event_type text, p_source text DEFAULT 'direct'::text, p_metadata jsonb DEFAULT '{}'::jsonb, p_dedupe_key text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_id UUID;
  v_user UUID := auth.uid();
BEGIN
  INSERT INTO public.growth_events(user_id, event_type, source, metadata, dedupe_key)
  VALUES (v_user, p_event_type, COALESCE(p_source, 'direct'), COALESCE(p_metadata, '{}'::jsonb), p_dedupe_key)
  ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE FUNCTION public.request_withdrawal(_amount numeric, _bank_name text, _account_holder_name text, _iban text, _notes text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user UUID := auth.uid();
  v_wallet_id UUID;
  v_wallet_balance NUMERIC;
  v_commission_balance NUMERIC;
  v_tx_id UUID;
  v_req_id UUID;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  IF _amount IS NULL OR _amount < 100 THEN
    RETURN jsonb_build_object('success', false, 'error', 'الحد الأدنى للسحب 100 ر.س');
  END IF;

  IF coalesce(trim(_bank_name),'')='' OR coalesce(trim(_account_holder_name),'')=''
     OR coalesce(trim(_iban),'')='' THEN
    RETURN jsonb_build_object('success', false, 'error', 'بيانات بنكية ناقصة');
  END IF;

  SELECT id, balance INTO v_wallet_id, v_wallet_balance
  FROM public.wallets WHERE user_id = v_user FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'لا توجد محفظة');
  END IF;

  v_commission_balance := public.get_referral_commission_balance(v_user);

  IF v_commission_balance < _amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'يمكن سحب أرباح العمولات فقط — رصيد العمولات المتاح: ' || v_commission_balance::text || ' ر.س'
    );
  END IF;

  IF v_wallet_balance < _amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'الرصيد غير كافٍ');
  END IF;

  INSERT INTO public.withdrawal_requests
    (user_id, amount, bank_name, account_holder_name, iban, notes)
  VALUES
    (v_user, _amount, trim(_bank_name), trim(_account_holder_name), trim(_iban), _notes)
  RETURNING id INTO v_req_id;

  INSERT INTO public.wallet_transactions
    (wallet_id, user_id, type, amount, description, reference_type, reference_id)
  VALUES
    (v_wallet_id, v_user, 'withdrawal', _amount,
     'طلب سحب أرباح العمولات إلى ' || trim(_bank_name),
     'referral_withdrawal_request', v_req_id)
  RETURNING id INTO v_tx_id;

  UPDATE public.withdrawal_requests
     SET hold_transaction_id = v_tx_id
   WHERE id = v_req_id;

  RETURN jsonb_build_object('success', true, 'request_id', v_req_id);
END;
$$;

CREATE FUNCTION public.research_publication_to_inbox() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.inbox_messages (
    sender_name, sender_email, sender_phone,
    subject, message, form_type, service_type, source_page,
    status, priority, metadata
  ) VALUES (
    COALESCE(NEW.client_name, 'عميل'),
    COALESCE(NEW.client_email, 'no-email@example.com'),
    NEW.client_phone,
    'طلب نشر بحث جديد: ' || COALESCE(NEW.title, NEW.request_number),
    COALESCE(NEW.abstract, NEW.notes, 'طلب نشر بحث - ' || NEW.request_number),
    'research_publication',
    COALESCE(NEW.service_type, 'research_publication'),
    '/client/research',
    'new',
    'high',
    jsonb_build_object(
      'publication_id', NEW.id,
      'request_number', NEW.request_number,
      'field', NEW.field,
      'language', NEW.language,
      'status', NEW.status
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'research_publication_to_inbox failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.resolve_automation_insight(_id uuid, _note text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE _sev text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN jsonb_build_object('success', false, 'error', 'forbidden');
  END IF;
  SELECT severity INTO _sev FROM automation_insights WHERE id=_id;
  IF _sev IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'not_found'); END IF;
  IF _sev IN ('high','critical') AND (_note IS NULL OR length(trim(_note))=0) THEN
    RETURN jsonb_build_object('success', false, 'error', 'note_required_for_high_severity');
  END IF;
  UPDATE automation_insights SET status='resolved', resolved_at=now() WHERE id=_id;
  INSERT INTO automation_actions_log (insight_id, action_type, note, created_by, action_payload)
  VALUES (_id, 'resolve', _note, auth.uid(), jsonb_build_object('severity', _sev));
  RETURN jsonb_build_object('success', true);
END $$;

CREATE FUNCTION public.scal_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE FUNCTION public.send_due_installment_reminders() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'extensions'
    AS $$
DECLARE
  v_url_wa  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-whatsapp-notify';
  v_url_em  constant text := 'https://kziujhdqogqeehtxgpax.supabase.co/functions/v1/financing-email-notify';
  v_key     constant text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6aXVqaGRxb2dxZWVodHhncGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyOTIzMzcsImV4cCI6MjA5MTg2ODMzN30.Kibgs32xPjQRq5oBBla2AvBRN9exB0ZXbNJm8EbeSak';
  r record;
  v_count int := 0;
  v_body  jsonb;
BEGIN
  FOR r IN
    SELECT i.id, i.month_number, i.amount, i.due_date, a.id AS app_id, a.applicant_phone, a.applicant_email
    FROM public.financing_installments i
    JOIN public.financing_applications a ON a.id = i.application_id
    WHERE i.status = 'pending'
      AND i.due_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '3 days')
  LOOP
    v_body := jsonb_build_object(
      'application_id', r.app_id,
      'event', 'installment_reminder',
      'extra', jsonb_build_object(
        'installment_id', r.id,
        'installment_number', r.month_number,
        'installment_amount', r.amount,
        'installment_due_date', r.due_date
      )
    );
    IF r.applicant_phone IS NOT NULL AND length(trim(r.applicant_phone)) > 0 THEN
      PERFORM net.http_post(url := v_url_wa, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    END IF;
    IF r.applicant_email IS NOT NULL AND length(trim(r.applicant_email)) > 0 THEN
      PERFORM net.http_post(url := v_url_em, headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer '||v_key), body := v_body);
    END IF;
    v_count := v_count + 1;
  END LOOP;
  RETURN v_count;
END;
$$;

CREATE FUNCTION public.set_customer_code() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.customer_code IS NULL OR NEW.customer_code = '' THEN
    NEW.customer_code := public.generate_customer_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.set_group_order_defaults() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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

  IF NEW.max_members > v_svc.group_max_members THEN
    NEW.max_members := v_svc.group_max_members;
  END IF;
  IF NEW.min_members < v_svc.group_min_members THEN
    NEW.min_members := v_svc.group_min_members;
  END IF;

  IF NEW.seat_price IS NULL OR NEW.seat_price <= 0 THEN
    NEW.seat_price := COALESCE(v_svc.group_seat_price, v_svc.price);
  END IF;

  RETURN NEW;
END$$;

CREATE FUNCTION public.set_inbox_messages_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.set_referral_code() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.set_stage_deadlines() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.lifecycle_status = 'quote_sent'
     AND (OLD.lifecycle_status IS DISTINCT FROM 'quote_sent' OR NEW.quote_response_deadline IS NULL) THEN
    NEW.quote_response_deadline := COALESCE(NEW.quote_response_deadline, now() + interval '7 days');
  END IF;

  IF NEW.lifecycle_status = 'contract_pending'
     AND (OLD.lifecycle_status IS DISTINCT FROM 'contract_pending' OR NEW.contract_signature_deadline IS NULL) THEN
    NEW.contract_signature_deadline := COALESCE(NEW.contract_signature_deadline, now() + interval '5 days');
  END IF;

  IF NEW.lifecycle_status IN ('contract_signed','payment_pending')
     AND NEW.payment_deadline IS NULL THEN
    NEW.payment_deadline := now() + interval '3 days';
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE FUNCTION public.set_user_referral_code() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.ref_code IS NULL OR length(NEW.ref_code) = 0 THEN
    NEW.ref_code := public.generate_short_ref_code();
  ELSE
    NEW.ref_code := upper(NEW.ref_code);
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.sign_contract_with_otp(_contract_id uuid, _otp_code text, _signature_text text, _signer_name text DEFAULT NULL::text, _ip text DEFAULT NULL::text, _ua text DEFAULT NULL::text, _signature_image text DEFAULT NULL::text, _signer_id_number text DEFAULT NULL::text, _accepted_terms jsonb DEFAULT NULL::jsonb, _comments text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_contract record;
  v_otp record;
  v_hash text;
  v_id_number text;
  v_content_hash text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;

  SELECT * INTO v_contract FROM public.contracts WHERE id = _contract_id FOR UPDATE;
  IF v_contract.id IS NULL THEN RAISE EXCEPTION 'العقد غير موجود'; END IF;
  IF v_contract.user_id <> auth.uid() THEN RAISE EXCEPTION 'غير مصرح'; END IF;
  IF v_contract.status = 'signed' OR v_contract.locked_at IS NOT NULL THEN
    RAISE EXCEPTION 'العقد موقّع مسبقاً';
  END IF;
  IF v_contract.status NOT IN ('draft','pending_signature') THEN
    RAISE EXCEPTION 'حالة العقد لا تسمح بالتوقيع';
  END IF;

  v_id_number := COALESCE(NULLIF(trim(_signer_id_number),''), v_contract.client_id_number);
  IF v_id_number IS NULL OR length(v_id_number) < 5 THEN
    RAISE EXCEPTION 'رقم الهوية مطلوب للتوقيع';
  END IF;

  IF _accepted_terms IS NULL THEN
    RAISE EXCEPTION 'يجب الموافقة على الشروط قبل التوقيع';
  END IF;

  IF _signature_text IS NULL OR length(trim(_signature_text)) < 2 THEN
    RAISE EXCEPTION 'التوقيع النصي مطلوب';
  END IF;

  v_hash := encode(sha256(convert_to(_otp_code, 'UTF8')), 'hex');
  SELECT * INTO v_otp FROM public.contract_otp_codes
   WHERE contract_id = _contract_id AND code_hash = v_hash
     AND used = false AND expires_at > now()
   ORDER BY created_at DESC LIMIT 1;

  IF v_otp.id IS NULL THEN
    UPDATE public.contract_otp_codes SET attempts = attempts + 1
     WHERE contract_id = _contract_id AND used = false;
    RAISE EXCEPTION 'رمز التحقق غير صحيح أو منتهي';
  END IF;

  UPDATE public.contract_otp_codes SET used = true WHERE id = v_otp.id;

  v_content_hash := encode(sha256(convert_to(COALESCE(v_contract.content,''), 'UTF8')), 'hex');

  INSERT INTO public.contract_signatures (
    contract_id, signer_user_id, signer_name, signer_email,
    signer_id_number, signature_text, signature_image,
    ip_address, user_agent, accepted_terms, comments
  ) VALUES (
    _contract_id, auth.uid(),
    COALESCE(_signer_name, v_contract.client_full_name, 'العميل'),
    v_contract.client_email,
    v_id_number,
    _signature_text,
    _signature_image,
    _ip, _ua,
    _accepted_terms,
    _comments
  );

  UPDATE public.contracts
     SET content_sha256   = v_content_hash,
         locked_at        = now(),
         client_id_number = COALESCE(client_id_number, v_id_number),
         updated_at       = now()
   WHERE id = _contract_id;

  RETURN jsonb_build_object('ok', true, 'contract_id', _contract_id, 'content_sha256', v_content_hash);
END;
$$;

CREATE FUNCTION public.sign_wallet_transaction() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
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
$$;

CREATE FUNCTION public.start_study_challenge() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user UUID := auth.uid();
  v_existing UUID;
  v_id UUID;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success',false,'error','not_authenticated');
  END IF;

  SELECT id INTO v_existing FROM public.study_challenge_attempts
   WHERE user_id = v_user AND status = 'in_progress' LIMIT 1;
  IF v_existing IS NOT NULL THEN
    RETURN jsonb_build_object('success',false,'error','already_active','attempt_id',v_existing);
  END IF;

  INSERT INTO public.study_challenge_attempts (user_id) VALUES (v_user) RETURNING id INTO v_id;
  RETURN jsonb_build_object('success',true,'attempt_id',v_id);
END; $$;

CREATE FUNCTION public.submit_assessment_attempt(p_attempt_id uuid, p_answers jsonb, p_time_spent integer DEFAULT 0) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_attempt public.assessment_attempts;
  v_assess public.assessments;
  v_total INT := 0;
  v_correct INT := 0;
  v_score INT := 0;
  v_level TEXT;
  v_skills JSONB := '{}'::jsonb;
  v_skill_rec RECORD;
  v_xp INT := 0;
  v_ans JSONB;
  v_q UUID;
  v_o UUID;
  v_is_correct BOOLEAN;
BEGIN
  SELECT * INTO v_attempt FROM public.assessment_attempts WHERE id = p_attempt_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('success', false, 'error', 'attempt_not_found'); END IF;
  IF v_attempt.status = 'completed' THEN
    RETURN jsonb_build_object('success', true, 'already_completed', true,
      'score', v_attempt.total_score, 'level', v_attempt.level_result,
      'skill_breakdown', v_attempt.skill_breakdown, 'xp_awarded', v_attempt.xp_awarded);
  END IF;

  SELECT * INTO v_assess FROM public.assessments WHERE id = v_attempt.assessment_id;

  FOR v_ans IN SELECT * FROM jsonb_array_elements(p_answers) LOOP
    v_q := (v_ans->>'question_id')::UUID;
    v_o := NULLIF(v_ans->>'selected_option_id','')::UUID;
    v_is_correct := COALESCE(
      (SELECT is_correct FROM public.assessment_options WHERE id = v_o AND question_id = v_q),
      false
    );
    INSERT INTO public.assessment_answers(attempt_id, question_id, selected_option_id, is_correct)
    VALUES (p_attempt_id, v_q, v_o, v_is_correct)
    ON CONFLICT (attempt_id, question_id) DO UPDATE
      SET selected_option_id = EXCLUDED.selected_option_id, is_correct = EXCLUDED.is_correct;
  END LOOP;

  SELECT COUNT(*) INTO v_total FROM public.assessment_questions WHERE assessment_id = v_assess.id;
  SELECT COUNT(*) INTO v_correct FROM public.assessment_answers WHERE attempt_id = p_attempt_id AND is_correct = true;

  IF v_total > 0 THEN v_score := ROUND((v_correct::numeric / v_total) * 100); ELSE v_score := 0; END IF;
  v_level := CASE WHEN v_score <= 40 THEN 'beginner' WHEN v_score <= 75 THEN 'intermediate' ELSE 'advanced' END;

  FOR v_skill_rec IN
    SELECT q.skill_tag,
           COUNT(*) FILTER (WHERE a.is_correct) AS correct,
           COUNT(*) AS total
    FROM public.assessment_answers a
    JOIN public.assessment_questions q ON q.id = a.question_id
    WHERE a.attempt_id = p_attempt_id
    GROUP BY q.skill_tag
  LOOP
    v_skills := v_skills || jsonb_build_object(
      v_skill_rec.skill_tag,
      jsonb_build_object(
        'correct', v_skill_rec.correct,
        'total', v_skill_rec.total,
        'percent', CASE WHEN v_skill_rec.total > 0 THEN ROUND((v_skill_rec.correct::numeric / v_skill_rec.total) * 100) ELSE 0 END
      )
    );
  END LOOP;

  v_xp := COALESCE(v_assess.xp_completion, 50);

  UPDATE public.assessment_attempts
  SET status = 'completed',
      total_questions = v_total,
      correct_count = v_correct,
      total_score = v_score,
      level_result = v_level,
      skill_breakdown = v_skills,
      time_spent_seconds = GREATEST(p_time_spent, 0),
      xp_awarded = v_xp,
      completed_at = now()
  WHERE id = p_attempt_id;

  IF v_attempt.user_id IS NOT NULL THEN
    BEGIN
      PERFORM public.challenge_award_xp(
        p_user_id => v_attempt.user_id,
        p_xp => v_xp,
        p_source => 'assessment',
        p_source_id => p_attempt_id,
        p_description => 'إكمال اختبار: ' || v_assess.title
      );
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'score', v_score, 'level', v_level,
    'correct', v_correct, 'total', v_total,
    'skill_breakdown', v_skills,
    'xp_awarded', v_xp
  );
END;
$$;

CREATE FUNCTION public.submit_question_answer(p_question_id uuid, p_choice_id uuid, p_time_spent integer DEFAULT NULL::integer) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user uuid := auth.uid();
  v_choice record;
  v_is_correct boolean;
  v_explanation text;
  v_correct_choice_id uuid;
  v_xp_awarded int := 0;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthenticated');
  END IF;

  SELECT id, is_correct INTO v_choice
  FROM public.question_choices
  WHERE id = p_choice_id AND question_id = p_question_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_choice');
  END IF;

  v_is_correct := v_choice.is_correct;
  SELECT explanation INTO v_explanation FROM public.questions WHERE id = p_question_id;
  SELECT id INTO v_correct_choice_id FROM public.question_choices
    WHERE question_id = p_question_id AND is_correct = true LIMIT 1;

  INSERT INTO public.user_answers (user_id, question_id, selected_choice_id, is_correct, time_spent_seconds)
  VALUES (v_user, p_question_id, p_choice_id, v_is_correct, p_time_spent);

  IF v_is_correct THEN
    v_xp_awarded := 5;
    BEGIN
      PERFORM public.award_xp(v_user, v_xp_awarded, 'question_bank_correct', p_question_id::text, 'إجابة صحيحة من بنك الأسئلة');
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'is_correct', v_is_correct,
    'correct_choice_id', v_correct_choice_id,
    'explanation', v_explanation,
    'xp_awarded', v_xp_awarded
  );
END $$;

CREATE FUNCTION public.swap_cv_template(_cv_id uuid, _new_template_key text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_cv RECORD;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'يجب تسجيل الدخول'; END IF;
  IF _new_template_key IS NULL OR length(_new_template_key) = 0 THEN
    RAISE EXCEPTION 'يجب اختيار قالب';
  END IF;

  SELECT * INTO v_cv FROM public.academic_cvs
   WHERE id = _cv_id AND user_id = v_uid FOR UPDATE;
  IF v_cv IS NULL THEN RAISE EXCEPTION 'السيرة غير موجودة'; END IF;

  IF v_cv.status <> 'paid' THEN
    RAISE EXCEPTION 'لا يمكن تبديل القالب قبل الدفع';
  END IF;
  IF v_cv.template_swap_used THEN
    RAISE EXCEPTION 'لقد استخدمت تبديل القالب المجاني سابقاً';
  END IF;
  IF v_cv.template_swap_deadline IS NULL OR now() > v_cv.template_swap_deadline THEN
    RAISE EXCEPTION 'انتهت نافذة تبديل القالب المجاني (24 ساعة)';
  END IF;
  IF _new_template_key = v_cv.locked_template_key THEN
    RAISE EXCEPTION 'القالب الجديد مطابق للحالي';
  END IF;

  PERFORM set_config('app.bypass_cv_lock_guard', 'true', true);
  UPDATE public.academic_cvs
     SET template_key = _new_template_key,
         locked_template_key = _new_template_key,
         template_swap_used = true,
         updated_at = now()
   WHERE id = _cv_id;
  PERFORM set_config('app.bypass_cv_lock_guard', 'false', true);

  UPDATE public.cv_purchases
     SET metadata = metadata || jsonb_build_object(
           'template_swapped_at', now(),
           'template_swapped_from', v_cv.locked_template_key,
           'template_swapped_to', _new_template_key
         )
   WHERE cv_id = _cv_id;

  RETURN jsonb_build_object(
    'ok', true,
    'new_template_key', _new_template_key,
    'swap_used', true
  );
END;
$$;

CREATE FUNCTION public.sync_current_contract_version() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.is_current = true THEN
    UPDATE public.contract_versions
       SET is_current = false
     WHERE contract_id = NEW.contract_id
       AND id <> NEW.id
       AND is_current = true;

    UPDATE public.contracts
       SET current_version_id = NEW.id,
           updated_at = now()
     WHERE id = NEW.contract_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.sync_order_status_from_invoice() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_order_status text;
  v_total_paid numeric;
BEGIN
  IF NEW.order_id IS NULL THEN RETURN NEW; END IF;

  IF NEW.status = 'paid' THEN
    v_order_status := 'paid';
  ELSIF NEW.status = 'partially_paid' THEN
    v_order_status := 'partially_paid';
  ELSIF NEW.status IN ('pending','sent') THEN
    v_order_status := 'awaiting_payment';
  ELSE
    v_order_status := NULL;
  END IF;

  SELECT COALESCE(SUM(paid_amount), 0) INTO v_total_paid
  FROM public.invoices
  WHERE order_id = NEW.order_id;

  IF v_order_status IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN
    UPDATE public.service_orders
       SET current_status = v_order_status,
           paid_amount = v_total_paid,
           updated_at = now()
     WHERE id = NEW.order_id;
  ELSE
    UPDATE public.service_orders
       SET paid_amount = v_total_paid,
           updated_at = now()
     WHERE id = NEW.order_id
       AND COALESCE(paid_amount, 0) <> v_total_paid;
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.tg_automation_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE FUNCTION public.tg_notify_challenge_achievement() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_phone text; v_ach record;
BEGIN
  v_phone := public.get_user_whatsapp_phone(NEW.user_id);
  IF v_phone IS NULL THEN RETURN NEW; END IF;
  SELECT name_ar, description_ar, xp_bonus INTO v_ach FROM public.challenge_achievements WHERE id = NEW.achievement_id;
  PERFORM public.notify_whatsapp_event(v_phone, 'challenge_achievement_unlocked',
    jsonb_build_object('achievement_name',COALESCE(v_ach.name_ar,''),'achievement_description',COALESCE(v_ach.description_ar,''),'xp_bonus',COALESCE(v_ach.xp_bonus,0)),
    'challenge_achievement', NEW.id::text, NEW.user_id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;

CREATE FUNCTION public.tg_notify_challenge_attempt_completed() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_phone text; v_title text; v_total_xp bigint; v_streak int;
BEGIN
  IF NEW.status <> 'completed' OR (TG_OP = 'UPDATE' AND OLD.status = 'completed') THEN RETURN NEW; END IF;
  v_phone := public.get_user_whatsapp_phone(NEW.user_id);
  IF v_phone IS NULL THEN RETURN NEW; END IF;
  SELECT title INTO v_title FROM public.daily_challenges WHERE id = NEW.challenge_id;
  SELECT total_xp INTO v_total_xp FROM public.challenge_user_xp WHERE user_id = NEW.user_id;
  SELECT current_streak INTO v_streak FROM public.challenge_streaks WHERE user_id = NEW.user_id;
  PERFORM public.notify_whatsapp_event(v_phone, 'challenge_attempt_completed',
    jsonb_build_object('challenge_title',COALESCE(v_title,''),'score',NEW.score,'correct_count',NEW.correct_count,'total_questions',NEW.total_questions,'xp_awarded',NEW.xp_awarded,'total_xp',COALESCE(v_total_xp,0),'current_streak',COALESCE(v_streak,0)),
    'challenge_attempt', NEW.id::text, NEW.user_id);
  IF NEW.is_perfect THEN
    PERFORM public.notify_whatsapp_event(v_phone, 'challenge_perfect_score',
      jsonb_build_object('challenge_title',COALESCE(v_title,''),'total_questions',NEW.total_questions,'xp_awarded',NEW.xp_awarded),
      'challenge_attempt', NEW.id::text, NEW.user_id);
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;

CREATE FUNCTION public.tg_notify_challenge_attempt_started() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_phone text; v_challenge record; v_total_q int;
BEGIN
  v_phone := public.get_user_whatsapp_phone(NEW.user_id);
  IF v_phone IS NULL THEN RETURN NEW; END IF;
  SELECT title, duration_minutes INTO v_challenge FROM public.daily_challenges WHERE id = NEW.challenge_id;
  SELECT count(*) INTO v_total_q FROM public.challenge_questions WHERE challenge_id = NEW.challenge_id;
  PERFORM public.notify_whatsapp_event(v_phone, 'challenge_attempt_started',
    jsonb_build_object('challenge_title', COALESCE(v_challenge.title,''), 'duration_minutes', COALESCE(v_challenge.duration_minutes,0), 'total_questions', v_total_q),
    'challenge_attempt', NEW.id::text, NEW.user_id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;

CREATE FUNCTION public.tg_notify_challenge_streak_milestone() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_phone text;
BEGIN
  IF NEW.current_streak IS NULL OR NEW.current_streak <= COALESCE(OLD.current_streak,0) THEN RETURN NEW; END IF;
  IF NEW.current_streak NOT IN (3,7,14,30,60,100,200,365) THEN RETURN NEW; END IF;
  v_phone := public.get_user_whatsapp_phone(NEW.user_id);
  IF v_phone IS NULL THEN RETURN NEW; END IF;
  PERFORM public.notify_whatsapp_event(v_phone, 'challenge_streak_milestone',
    jsonb_build_object('current_streak',NEW.current_streak,'longest_streak',NEW.longest_streak),
    'challenge_streak', NEW.user_id::text, NEW.user_id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;

CREATE FUNCTION public.tg_set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.touch_deadline_reminder_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE FUNCTION public.touch_library_categories() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE FUNCTION public.touch_qbank_session() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.track_experiment_event(p_experiment_key text, p_event_type text, p_user_id uuid DEFAULT NULL::uuid, p_anonymous_id text DEFAULT NULL::text, p_metric_value numeric DEFAULT NULL::numeric, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_exp_id UUID;
  v_variant_id UUID;
BEGIN
  SELECT id INTO v_exp_id FROM public.experiments
    WHERE experiment_key = p_experiment_key AND status IN ('running','completed');
  IF v_exp_id IS NULL THEN RETURN; END IF;

  IF p_user_id IS NOT NULL THEN
    SELECT variant_id INTO v_variant_id FROM public.experiment_assignments
      WHERE experiment_id = v_exp_id AND user_id = p_user_id LIMIT 1;
  ELSIF p_anonymous_id IS NOT NULL THEN
    SELECT variant_id INTO v_variant_id FROM public.experiment_assignments
      WHERE experiment_id = v_exp_id AND anonymous_id = p_anonymous_id AND user_id IS NULL LIMIT 1;
  END IF;

  IF v_variant_id IS NULL THEN RETURN; END IF;

  INSERT INTO public.experiment_events(experiment_id, variant_id, user_id, anonymous_id, event_type, metric_value, metadata)
    VALUES (v_exp_id, v_variant_id, p_user_id, CASE WHEN p_user_id IS NULL THEN p_anonymous_id END, p_event_type, p_metric_value, COALESCE(p_metadata,'{}'::jsonb));
END;
$$;

CREATE FUNCTION public.track_order(_tracking_id text, _phone_last_four text) RETURNS SETOF public.orders
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT * FROM public.orders
  WHERE tracking_id = upper(_tracking_id)
    AND phone_last_four = _phone_last_four
  LIMIT 1;
$$;

CREATE FUNCTION public.transition_order_lifecycle(_order_id uuid, _to_status public.order_lifecycle_status, _note text DEFAULT NULL::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_order public.service_orders;
  v_is_admin boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  v_is_admin := has_role(auth.uid(), 'admin'::app_role);

  SELECT * INTO v_order FROM public.service_orders WHERE id = _order_id FOR UPDATE;
  IF v_order.id IS NULL THEN
    RAISE EXCEPTION 'الطلب غير موجود';
  END IF;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'غير مصرح بتغيير المرحلة';
  END IF;

  IF NOT public.is_valid_lifecycle_transition(v_order.lifecycle_status, _to_status) THEN
    RAISE EXCEPTION 'انتقال غير صالح من % إلى %', v_order.lifecycle_status, _to_status;
  END IF;

  UPDATE public.service_orders
     SET lifecycle_status = _to_status,
         updated_at = now()
   WHERE id = _order_id;

  IF _note IS NOT NULL THEN
    INSERT INTO public.service_order_timeline (order_id, status, note, created_by)
    VALUES (_order_id, _to_status::text, _note, auth.uid());
  END IF;

  RETURN jsonb_build_object('ok', true, 'order_id', _order_id, 'new_status', _to_status);
END;
$$;

CREATE FUNCTION public.trg_auto_generate_installments() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'active') THEN
    IF NEW.activated_at IS NULL THEN
      NEW.activated_at := NOW();
    END IF;
    PERFORM pg_notify('financing_activated', NEW.id::text);
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.trg_auto_send_paid_invoice() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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

CREATE FUNCTION public.trg_auto_send_signed_contract() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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

CREATE FUNCTION public.trg_generate_installments_after() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'active') THEN
    PERFORM public.generate_financing_installments(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.trg_growth_on_attempt_complete() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    INSERT INTO public.growth_events(user_id, event_type, source, metadata, dedupe_key)
    VALUES (NEW.user_id, 'challenge_completed', 'direct',
            jsonb_build_object('challenge_id', NEW.challenge_id, 'score', NEW.score, 'is_perfect', NEW.is_perfect),
            'attempt:' || NEW.id::text)
    ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.trg_growth_on_referral() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.growth_events(user_id, event_type, source, metadata, dedupe_key)
    VALUES (NEW.referrer_user_id, 'referral_used', 'referral',
            jsonb_build_object('referred_user_id', NEW.referred_user_id, 'code', NEW.referral_code),
            'ref_create:' || NEW.id::text)
    ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed' THEN
    INSERT INTO public.growth_events(user_id, event_type, source, metadata, dedupe_key)
    VALUES (NEW.referrer_user_id, 'referral_completed', 'referral',
            jsonb_build_object('referred_user_id', NEW.referred_user_id),
            'ref_done:' || NEW.id::text)
    ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.trg_study_session_done() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    PERFORM public.notify_student_whatsapp(
      NEW.user_id,
      'session_completed',
      '✅ انتهت جلسة المذاكرة (' || NEW.duration_minutes || ' دقيقة). جاهز للجلسة القادمة؟',
      NEW.id, 'session',
      'session_done:' || NEW.id::text
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE FUNCTION public.trg_whatsapp_contract_invite() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF NEW.client_phone IS NULL THEN RETURN NEW; END IF;
  IF (TG_OP = 'UPDATE' AND OLD.status = NEW.status) THEN RETURN NEW; END IF;
  IF NEW.status NOT IN ('sent','pending_signature') THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    NEW.client_phone, 'contract_invite',
    jsonb_build_object(
      'name', COALESCE(NEW.client_full_name, 'عميلنا الكريم'),
      'contract_no', NEW.contract_number,
      'contract_number', NEW.contract_number,
      'title', COALESCE(NEW.title, 'عقد خدمة أكاديمية'),
      'sent_at', to_char(timezone('Asia/Riyadh', COALESCE(NEW.sent_at, now())), 'YYYY-MM-DD HH24:MI'),
      'link', 'https://masteredupath.com/contracts/sign/' || NEW.verification_token,
      'verification_code', substring(NEW.verification_token from 1 for 8)
    ),
    'contract', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $$;

CREATE FUNCTION public.trg_whatsapp_contract_signed() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_contract record;
BEGIN
  SELECT id, contract_number, title, client_phone, user_id
  INTO v_contract FROM public.contracts WHERE id = NEW.contract_id;
  IF v_contract.client_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_contract.client_phone, 'contract_signed',
    jsonb_build_object(
      'name', NEW.signer_name,
      'contract_no', v_contract.contract_number,
      'contract_number', v_contract.contract_number,
      'title', COALESCE(v_contract.title, 'العقد'),
      'signed_at', to_char(timezone('Asia/Riyadh', NEW.signed_at), 'YYYY-MM-DD HH24:MI'),
      'link', 'https://masteredupath.com/contracts/view/' || v_contract.id::text
    ),
    'contract', v_contract.id::text, v_contract.user_id
  );
  RETURN NEW;
END $$;

CREATE FUNCTION public.trg_whatsapp_invoice_new() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_phone text;
BEGIN
  v_phone := COALESCE(NEW.customer_phone, (SELECT phone FROM public.customers WHERE id = NEW.customer_id LIMIT 1));
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_phone, 'invoice_new',
    jsonb_build_object(
      'name', COALESCE(NEW.customer_name, 'عميلنا'),
      'invoice_number', NEW.invoice_number,
      'amount', COALESCE(NEW.total_amount, 0)::text,
      'currency', COALESCE(NEW.currency, 'SAR')
    ),
    'invoice', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $$;

CREATE FUNCTION public.trg_whatsapp_invoice_paid() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_phone text;
BEGIN
  IF NEW.status <> 'paid' OR OLD.status IS NOT DISTINCT FROM 'paid' THEN RETURN NEW; END IF;

  v_phone := COALESCE(NEW.customer_phone, (SELECT phone FROM public.customers WHERE id = NEW.customer_id LIMIT 1));
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_phone, 'invoice_paid',
    jsonb_build_object(
      'name', COALESCE(NEW.customer_name, 'عميلنا'),
      'invoice_number', NEW.invoice_number,
      'amount', COALESCE(NEW.paid_amount, NEW.total_amount, 0)::text
    ),
    'invoice', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $$;

CREATE FUNCTION public.trg_whatsapp_order_created() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_phone text; v_name text;
BEGIN
  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.customers c WHERE c.user_id = NEW.user_id LIMIT 1;
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  PERFORM public.notify_whatsapp_event(
    v_phone, 'order_created',
    jsonb_build_object(
      'name', COALESCE(v_name, 'عميلنا الكريم'),
      'order_no', COALESCE(NEW.tracking_id, NEW.id::text),
      'order_number', COALESCE(NEW.tracking_id, NEW.id::text),
      'service', COALESCE(NEW.service_name, 'خدمة أكاديمية'),
      'created_at', to_char(timezone('Asia/Riyadh', NEW.created_at), 'YYYY-MM-DD HH24:MI'),
      'link', 'https://masteredupath.com/orders/' || NEW.id::text
    ),
    'service_order', NEW.id::text, NEW.user_id
  );
  RETURN NEW;
END $$;

CREATE FUNCTION public.trg_whatsapp_order_status_changed() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE v_phone text; v_name text;
BEGIN
  IF NEW.lifecycle_status IS NOT DISTINCT FROM OLD.lifecycle_status THEN RETURN NEW; END IF;

  SELECT c.phone, c.name INTO v_phone, v_name
  FROM public.customers c WHERE c.user_id = NEW.user_id LIMIT 1;
  IF v_phone IS NULL THEN RETURN NEW; END IF;

  IF NEW.lifecycle_status = 'delivered' THEN
    PERFORM public.notify_whatsapp_event(
      v_phone, 'order_delivered',
      jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا الكريم'),
        'order_no', COALESCE(NEW.tracking_id, NEW.id::text),
        'order_number', COALESCE(NEW.tracking_id, NEW.id::text),
        'service', COALESCE(NEW.service_name, 'خدمة أكاديمية'),
        'delivered_at', to_char(timezone('Asia/Riyadh', now()), 'YYYY-MM-DD HH24:MI'),
        'link', 'https://masteredupath.com/orders/' || NEW.id::text
      ),
      'service_order', NEW.id::text, NEW.user_id
    );
  ELSIF NEW.lifecycle_status = 'quote_sent' THEN
    PERFORM public.notify_whatsapp_event(
      v_phone, 'quote_sent',
      jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا الكريم'),
        'order_no', COALESCE(NEW.tracking_id, NEW.id::text),
        'service', COALESCE(NEW.service_name, 'خدمة أكاديمية'),
        'amount', to_char(COALESCE(NEW.total_amount, 0), 'FM999,999,990.00'),
        'deadline', COALESCE(to_char(NEW.deadline, 'YYYY-MM-DD'), 'يُحدَّد لاحقاً'),
        'sent_at', to_char(timezone('Asia/Riyadh', now()), 'YYYY-MM-DD HH24:MI'),
        'notes', COALESCE(NULLIF(NEW.quote_notes, ''), 'لا توجد ملاحظات إضافية'),
        'link', 'https://masteredupath.com/orders/' || NEW.id::text
      ),
      'service_order', NEW.id::text, NEW.user_id
    );
  ELSE
    PERFORM public.notify_whatsapp_event(
      v_phone, 'order_status_changed',
      jsonb_build_object(
        'name', COALESCE(v_name, 'عميلنا الكريم'),
        'order_no', COALESCE(NEW.tracking_id, NEW.id::text),
        'order_number', COALESCE(NEW.tracking_id, NEW.id::text),
        'service', COALESCE(NEW.service_name, 'خدمة أكاديمية'),
        'status', public.lifecycle_status_ar(NEW.lifecycle_status::text),
        'updated_at', to_char(timezone('Asia/Riyadh', now()), 'YYYY-MM-DD HH24:MI'),
        'link', 'https://masteredupath.com/orders/' || NEW.id::text
      ),
      'service_order', NEW.id::text, NEW.user_id
    );
  END IF;
  RETURN NEW;
END $$;

CREATE FUNCTION public.update_invoice_after_payment() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_total numeric;
  v_paid numeric;
  v_new_status text;
  v_invoice_id uuid;
BEGIN
  v_invoice_id := COALESCE(NEW.invoice_id, OLD.invoice_id);

  SELECT COALESCE(total_amount,0) INTO v_total FROM public.invoices WHERE id = v_invoice_id;

  SELECT COALESCE(SUM(amount),0) INTO v_paid
  FROM public.invoice_payments
  WHERE invoice_id = v_invoice_id AND status = 'completed';

  IF v_paid >= v_total AND v_total > 0 THEN
    v_new_status := 'paid';
  ELSIF v_paid > 0 THEN
    v_new_status := 'partially_paid';
  ELSE
    v_new_status := 'pending';
  END IF;

  UPDATE public.invoices
     SET paid_amount = v_paid,
         status = v_new_status,
         paid_at = CASE WHEN v_new_status = 'paid' THEN now() ELSE NULL END,
         updated_at = now()
   WHERE id = v_invoice_id;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.invoice_timeline (invoice_id, action_type, action_label, action_description, actor_user_id, metadata)
    VALUES (NEW.invoice_id, 'payment_recorded', 'تسجيل دفعة',
            'تم تسجيل دفعة بمبلغ ' || NEW.amount::text || ' عبر ' || NEW.payment_method,
            NEW.created_by, jsonb_build_object('amount', NEW.amount, 'method', NEW.payment_method));
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE FUNCTION public.upsert_insight(_type text, _severity text, _title text, _description text, _recommendation text, _metric_key text, _metric_value numeric, _comparison_value numeric, _delta_pct numeric, _context jsonb, _dedupe_key text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE _id uuid;
BEGIN
  SELECT id INTO _id FROM automation_insights
   WHERE dedupe_key = _dedupe_key AND status = 'active' LIMIT 1;
  IF _id IS NOT NULL THEN
    UPDATE automation_insights SET
      severity=_severity, title=_title, description=_description,
      recommendation=_recommendation, metric_value=_metric_value,
      comparison_value=_comparison_value, delta_percentage=_delta_pct,
      context_data=_context, last_seen_at=now()
    WHERE id=_id;
    RETURN _id;
  END IF;
  INSERT INTO automation_insights
    (insight_type, severity, title, description, recommendation, metric_key,
     metric_value, comparison_value, delta_percentage, context_data, dedupe_key)
  VALUES
    (_type, _severity, _title, _description, _recommendation, _metric_key,
     _metric_value, _comparison_value, _delta_pct, _context, _dedupe_key)
  RETURNING id INTO _id;
  RETURN _id;
END $$;

CREATE FUNCTION public.use_smart_editor(_operation text, _mode text, _input_length integer) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_used_today INT;
  v_wallet RECORD;
  v_was_free BOOLEAN := false;
  v_tx_id UUID;
  v_price NUMERIC;
  v_free_quota INT := 3;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  IF _operation NOT IN ('correct','rephrase','academic','shorten','expand') THEN
    RAISE EXCEPTION 'عملية غير صالحة';
  END IF;

  IF _mode NOT IN ('standard','pro') THEN
    RAISE EXCEPTION 'نمط غير صالح';
  END IF;

  IF _mode = 'pro' THEN
    v_price := 7;
  ELSE
    v_price := 2;
    SELECT COUNT(*) INTO v_used_today
      FROM public.smart_editor_usage
     WHERE user_id = v_uid
       AND created_at::date = CURRENT_DATE
       AND was_free = true;
    IF v_used_today < v_free_quota THEN
      v_was_free := true;
    END IF;
  END IF;

  IF NOT v_was_free THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'المحرر الذكي - ' ||
            CASE _operation
              WHEN 'correct' THEN 'تصحيح'
              WHEN 'rephrase' THEN 'إعادة صياغة'
              WHEN 'academic' THEN 'رفع أكاديمي'
              WHEN 'shorten' THEN 'اختصار'
              WHEN 'expand' THEN 'توسيع'
            END ||
            CASE WHEN _mode = 'pro' THEN ' (متقدم)' ELSE '' END,
            'smart_editor')
    RETURNING id INTO v_tx_id;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'was_free', v_was_free,
    'charged', CASE WHEN v_was_free THEN 0 ELSE v_price END,
    'mode', _mode,
    'wallet_transaction_id', v_tx_id,
    'free_quota_remaining', GREATEST(0, v_free_quota - v_used_today - CASE WHEN v_was_free THEN 1 ELSE 0 END)
  );
END;
$$;

CREATE FUNCTION public.use_track_tool(_tool_id uuid, _mode text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_tool RECORD;
  v_used_today INT;
  v_wallet RECORD;
  v_was_free BOOLEAN := false;
  v_tx_id UUID;
  v_log_id UUID;
  v_is_pro BOOLEAN := (_mode = 'pro');
  v_price NUMERIC;
  v_pro_price NUMERIC;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'يجب تسجيل الدخول';
  END IF;

  SELECT * INTO v_tool FROM public.track_tools WHERE id = _tool_id AND is_active = true;
  IF v_tool IS NULL THEN
    RAISE EXCEPTION 'الأداة غير موجودة أو معطلة';
  END IF;

  v_pro_price := COALESCE((v_tool.metadata->>'pro_price')::NUMERIC, NULL);

  IF v_is_pro THEN
    IF v_pro_price IS NULL THEN
      RAISE EXCEPTION 'هذه الأداة لا تدعم الوضع المتقدم';
    END IF;
    v_price := v_pro_price;
  ELSE
    v_price := v_tool.price;
    IF v_tool.free_daily_quota > 0 THEN
      SELECT COUNT(*) INTO v_used_today
        FROM public.track_tool_usage_logs
       WHERE user_id = v_uid AND tool_id = _tool_id
         AND created_at::date = CURRENT_DATE
         AND was_free = true;
      IF v_used_today < v_tool.free_daily_quota THEN
        v_was_free := true;
      END IF;
    END IF;
  END IF;

  IF NOT v_was_free AND v_price > 0 THEN
    SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_uid FOR UPDATE;
    IF v_wallet IS NULL THEN
      INSERT INTO public.wallets (user_id) VALUES (v_uid) RETURNING * INTO v_wallet;
    END IF;
    IF v_wallet.balance < v_price THEN
      RAISE EXCEPTION 'الرصيد غير كافٍ. السعر: % ر.س، رصيدك: % ر.س', v_price, v_wallet.balance;
    END IF;

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, description, reference_type, reference_id)
    VALUES (v_wallet.id, v_uid, 'payment', v_price,
            'استخدام أداة: ' || v_tool.name_ar || CASE WHEN v_is_pro THEN ' (متقدم)' ELSE '' END,
            'track_tool', _tool_id)
    RETURNING id INTO v_tx_id;
  END IF;

  INSERT INTO public.track_tool_usage_logs (user_id, tool_id, track_id, cost, was_free, wallet_transaction_id)
  VALUES (v_uid, _tool_id, v_tool.track_id,
          CASE WHEN v_was_free THEN 0 ELSE v_price END,
          v_was_free, v_tx_id)
  RETURNING id INTO v_log_id;

  RETURN jsonb_build_object(
    'ok', true,
    'log_id', v_log_id,
    'was_free', v_was_free,
    'charged', CASE WHEN v_was_free THEN 0 ELSE v_price END,
    'mode', CASE WHEN v_is_pro THEN 'pro' ELSE 'standard' END,
    'action_link', v_tool.action_link
  );
END;
$$;

CREATE FUNCTION public.validate_promo_code(p_code text, p_item_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user UUID := auth.uid();
  v_coupon RECORD;
  v_item RECORD;
  v_discount_xp INT := 0;
  v_final_xp INT;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'unauthenticated');
  END IF;

  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RETURN jsonb_build_object('valid', false, 'error', 'empty_code');
  END IF;

  SELECT * INTO v_item FROM public.marketplace_items WHERE id = p_item_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'item_unavailable');
  END IF;

  SELECT * INTO v_coupon
    FROM public.user_discount_coupons
    WHERE upper(code) = upper(trim(p_code))
      AND user_id = v_user
    LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_found');
  END IF;

  IF v_coupon.status <> 'active' OR v_coupon.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'already_used');
  END IF;

  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'expired');
  END IF;

  IF v_coupon.applies_to NOT IN ('all', 'marketplace', v_item.type, v_item.slug) THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_applicable');
  END IF;

  IF v_coupon.discount_type = 'percentage' THEN
    v_discount_xp := floor(v_item.xp_cost * least(v_coupon.discount_value, 100) / 100.0);
  ELSE
    v_discount_xp := least(v_coupon.discount_value::INT * 200, v_item.xp_cost);
  END IF;

  v_discount_xp := least(v_discount_xp, v_item.xp_cost - greatest(floor(v_item.xp_cost * 0.10)::INT, 1));
  v_discount_xp := greatest(v_discount_xp, 0);
  v_final_xp := v_item.xp_cost - v_discount_xp;

  RETURN jsonb_build_object(
    'valid', true,
    'code', v_coupon.code,
    'coupon_id', v_coupon.id,
    'discount_type', v_coupon.discount_type,
    'discount_value', v_coupon.discount_value,
    'original_xp', v_item.xp_cost,
    'xp_discount', v_discount_xp,
    'final_xp', v_final_xp,
    'expires_at', v_coupon.expires_at
  );
END;
$$;

CREATE FUNCTION public.validate_promo_code_on_base(p_code text, p_item_id uuid, p_base_xp integer) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user UUID := auth.uid();
  v_coupon RECORD;
  v_item RECORD;
  v_discount_xp INT := 0;
  v_final_xp INT;
  v_floor INT;
  v_base INT;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'unauthenticated');
  END IF;
  IF p_code IS NULL OR length(trim(p_code)) = 0 THEN
    RETURN jsonb_build_object('valid', false, 'error', 'empty_code');
  END IF;
  SELECT * INTO v_item FROM public.marketplace_items WHERE id = p_item_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'item_unavailable');
  END IF;

  v_base := COALESCE(NULLIF(p_base_xp, 0), v_item.xp_cost);
  IF v_base <= 0 THEN v_base := v_item.xp_cost; END IF;

  SELECT * INTO v_coupon
    FROM public.user_discount_coupons
    WHERE upper(code) = upper(trim(p_code)) AND user_id = v_user
    LIMIT 1;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_found');
  END IF;
  IF v_coupon.status <> 'active' OR v_coupon.used_at IS NOT NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'already_used');
  END IF;
  IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < now() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'expired');
  END IF;
  IF v_coupon.applies_to NOT IN ('all', 'marketplace', v_item.type, v_item.slug) THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_applicable');
  END IF;

  IF v_coupon.discount_type = 'percentage' THEN
    v_discount_xp := floor(v_base * least(v_coupon.discount_value, 100) / 100.0);
  ELSE
    v_discount_xp := least(v_coupon.discount_value::INT * 200, v_base);
  END IF;

  v_floor := greatest(floor(v_item.xp_cost * 0.10)::INT, 1);
  v_discount_xp := least(v_discount_xp, greatest(v_base - v_floor, 0));
  v_discount_xp := greatest(v_discount_xp, 0);
  v_final_xp := v_base - v_discount_xp;

  RETURN jsonb_build_object(
    'valid', true, 'code', v_coupon.code, 'coupon_id', v_coupon.id,
    'discount_type', v_coupon.discount_type, 'discount_value', v_coupon.discount_value,
    'original_xp', v_base, 'xp_discount', v_discount_xp, 'final_xp', v_final_xp,
    'expires_at', v_coupon.expires_at
  );
END;
$$;
