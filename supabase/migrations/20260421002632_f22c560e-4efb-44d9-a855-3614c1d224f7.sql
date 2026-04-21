-- ============================================================
-- Smart Growth Automation System
-- ============================================================

CREATE TABLE IF NOT EXISTS public.automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_key text NOT NULL UNIQUE,
  rule_name text NOT NULL,
  rule_group text NOT NULL,
  threshold_value numeric NOT NULL,
  comparison_operator text NOT NULL DEFAULT '<' CHECK (comparison_operator IN ('<','<=','>','>=','=')),
  lookback_days integer NOT NULL DEFAULT 7 CHECK (lookback_days BETWEEN 1 AND 90),
  is_active boolean NOT NULL DEFAULT true,
  recommendation_template text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.automation_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  title text NOT NULL,
  description text NOT NULL,
  recommendation text NOT NULL,
  metric_key text NOT NULL,
  metric_value numeric,
  comparison_value numeric,
  delta_percentage numeric,
  context_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','dismissed','resolved')),
  dedupe_key text NOT NULL,
  detected_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  dismissed_at timestamptz,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_insight_per_key
  ON public.automation_insights (dedupe_key) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_insights_status_severity
  ON public.automation_insights (status, severity, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_insights_metric_key
  ON public.automation_insights (metric_key);

CREATE TABLE IF NOT EXISTS public.automation_actions_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id uuid REFERENCES public.automation_insights(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  action_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  note text,
  status text NOT NULL DEFAULT 'success',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_actions_log_insight
  ON public.automation_actions_log (insight_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.automation_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL UNIQUE,
  metrics_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_actions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_snapshots ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='automation_rules' AND policyname='admins_all_rules') THEN
    CREATE POLICY admins_all_rules ON public.automation_rules
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='automation_insights' AND policyname='admins_all_insights') THEN
    CREATE POLICY admins_all_insights ON public.automation_insights
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='automation_actions_log' AND policyname='admins_all_actions_log') THEN
    CREATE POLICY admins_all_actions_log ON public.automation_actions_log
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='automation_snapshots' AND policyname='admins_all_snapshots') THEN
    CREATE POLICY admins_all_snapshots ON public.automation_snapshots
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'::public.app_role))
      WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.tg_automation_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_automation_rules_updated ON public.automation_rules;
CREATE TRIGGER trg_automation_rules_updated BEFORE UPDATE ON public.automation_rules
  FOR EACH ROW EXECUTE FUNCTION public.tg_automation_set_updated_at();

DROP TRIGGER IF EXISTS trg_automation_insights_updated ON public.automation_insights;
CREATE TRIGGER trg_automation_insights_updated BEFORE UPDATE ON public.automation_insights
  FOR EACH ROW EXECUTE FUNCTION public.tg_automation_set_updated_at();

-- Seed rules
INSERT INTO public.automation_rules
  (rule_key, rule_name, rule_group, threshold_value, comparison_operator, lookback_days, recommendation_template, description)
VALUES
  ('activation_rate_low', 'انخفاض معدل التفعيل', 'activation', 40, '<', 7,
   'اجعل أول تحدي يظهر مباشرة بعد التسجيل، قلّل عدد الخطوات، وأضف CTA واضح في صفحة الترحيب.',
   'نسبة المستخدمين الجدد الذين أكملوا أول تحدي خلال 7 أيام من التسجيل'),
  ('share_rate_low', 'ضعف مشاركة النتائج', 'engagement', 25, '<', 7,
   'حسّن صورة المشاركة، أبرز CTA المشاركة بعد انتهاء التحدي، وزد مكافأة XP للمشاركة.',
   'نسبة التحديات المكتملة التي تمت مشاركتها'),
  ('referral_conversion_low', 'ضعف تحويل الإحالات', 'referral', 30, '<', 14,
   'حسّن صفحة الإحالات، اجعل المكافأة أوضح، وأضف قالب رسالة جاهزة للمشاركة السريعة.',
   'نسبة الدعوات المكتملة من إجمالي الدعوات المرسلة'),
  ('retention_d3_low', 'ضعف العودة لليوم الثالث', 'retention', 35, '<', 14,
   'فعّل streak reminder، أضف مكافأة اليوم الثاني، وأبرز الإنجازات في الواجهة الرئيسية.',
   'نسبة المستخدمين الذين عادوا في اليوم الثالث بعد التسجيل')
ON CONFLICT (rule_key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.classify_severity(_delta_pct numeric)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN _delta_pct IS NULL THEN 'low'
    WHEN abs(_delta_pct) >= 50 THEN 'critical'
    WHEN abs(_delta_pct) >= 30 THEN 'high'
    WHEN abs(_delta_pct) >= 15 THEN 'medium'
    ELSE 'low'
  END
$$;

CREATE OR REPLACE FUNCTION public.upsert_insight(
  _type text, _severity text, _title text, _description text,
  _recommendation text, _metric_key text, _metric_value numeric,
  _comparison_value numeric, _delta_pct numeric, _context jsonb, _dedupe_key text
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.analyze_growth_insights()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  -- 1) Activation
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

  -- 2) Share rate
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

  -- 3) Referral conversion
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

  -- 4) Retention D3
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

  -- Auto-resolve insights that no longer trigger
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

GRANT EXECUTE ON FUNCTION public.analyze_growth_insights() TO authenticated;

CREATE OR REPLACE FUNCTION public.dismiss_automation_insight(_id uuid, _note text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
GRANT EXECUTE ON FUNCTION public.dismiss_automation_insight(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.resolve_automation_insight(_id uuid, _note text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
GRANT EXECUTE ON FUNCTION public.resolve_automation_insight(uuid, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.build_growth_snapshot()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
GRANT EXECUTE ON FUNCTION public.build_growth_snapshot() TO authenticated;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname='pg_cron') THEN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname='analyze-growth-insights-daily') THEN
      PERFORM cron.unschedule('analyze-growth-insights-daily');
    END IF;
    PERFORM cron.schedule(
      'analyze-growth-insights-daily',
      '30 2 * * *',
      $cron$ SELECT public.analyze_growth_insights(); SELECT public.build_growth_snapshot(); $cron$
    );
  END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;