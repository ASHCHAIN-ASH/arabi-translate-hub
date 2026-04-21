-- ========== ENUMS ==========
DO $$ BEGIN
  CREATE TYPE public.experiment_status AS ENUM ('draft','running','paused','completed','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.experiment_target_area AS ENUM ('challenge_result_screen','referral_page','onboarding_flow','share_cta');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ========== TABLES ==========
CREATE TABLE IF NOT EXISTS public.experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  hypothesis TEXT,
  status public.experiment_status NOT NULL DEFAULT 'draft',
  target_area public.experiment_target_area NOT NULL,
  traffic_allocation_percentage NUMERIC(5,2) NOT NULL DEFAULT 100 CHECK (traffic_allocation_percentage > 0 AND traffic_allocation_percentage <= 100),
  primary_metric TEXT NOT NULL,
  secondary_metrics JSONB NOT NULL DEFAULT '[]'::jsonb,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  winner_variant_id UUID,
  min_sample_size INTEGER NOT NULL DEFAULT 100,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.experiment_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
  variant_key TEXT NOT NULL,
  name TEXT NOT NULL,
  is_control BOOLEAN NOT NULL DEFAULT false,
  allocation_percentage NUMERIC(5,2) NOT NULL CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
  config_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(experiment_id, variant_key)
);

ALTER TABLE public.experiments
  ADD CONSTRAINT experiments_winner_variant_fk
  FOREIGN KEY (winner_variant_id) REFERENCES public.experiment_variants(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.experiment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.experiment_variants(id) ON DELETE CASCADE,
  user_id UUID,
  anonymous_id TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  CHECK (user_id IS NOT NULL OR anonymous_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_assignments_user
  ON public.experiment_assignments(experiment_id, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_assignments_anon
  ON public.experiment_assignments(experiment_id, anonymous_id) WHERE anonymous_id IS NOT NULL AND user_id IS NULL;
CREATE INDEX IF NOT EXISTS idx_assignments_experiment ON public.experiment_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_assignments_variant ON public.experiment_assignments(variant_id);

CREATE TABLE IF NOT EXISTS public.experiment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.experiment_variants(id) ON DELETE CASCADE,
  user_id UUID,
  anonymous_id TEXT,
  event_type TEXT NOT NULL,
  metric_value NUMERIC,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_events_experiment ON public.experiment_events(experiment_id, event_type);
CREATE INDEX IF NOT EXISTS idx_events_variant ON public.experiment_events(variant_id, event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON public.experiment_events(created_at DESC);

CREATE TABLE IF NOT EXISTS public.experiment_results_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES public.experiments(id) ON DELETE CASCADE,
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  results_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.experiment_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID REFERENCES public.experiments(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  actor_user_id UUID,
  before_state JSONB,
  after_state JSONB,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_experiment ON public.experiment_audit_logs(experiment_id, created_at DESC);

-- ========== updated_at trigger ==========
CREATE TRIGGER trg_experiments_updated_at
  BEFORE UPDATE ON public.experiments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_experiment_variants_updated_at
  BEFORE UPDATE ON public.experiment_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========== RLS ==========
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_results_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiment_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin manages everything
CREATE POLICY "Admins manage experiments" ON public.experiments
  FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins manage variants" ON public.experiment_variants
  FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins read assignments" ON public.experiment_assignments
  FOR SELECT USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins read events" ON public.experiment_events
  FOR SELECT USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins manage snapshots" ON public.experiment_results_snapshots
  FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins read audit" ON public.experiment_audit_logs
  FOR SELECT USING (public.has_role(auth.uid(),'admin'));

-- Public read for active experiments + their variants (needed by clients to apply config)
CREATE POLICY "Anyone reads running experiments" ON public.experiments
  FOR SELECT USING (status IN ('running','completed'));

CREATE POLICY "Anyone reads variants of visible experiments" ON public.experiment_variants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.experiments e WHERE e.id = experiment_id AND e.status IN ('running','completed'))
  );

-- Authenticated users insert their own assignment/events; anon allowed via anonymous_id
CREATE POLICY "Users insert their assignment" ON public.experiment_assignments
  FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND anonymous_id IS NOT NULL AND user_id IS NULL)
  );

CREATE POLICY "Users read their own assignment" ON public.experiment_assignments
  FOR SELECT USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR public.has_role(auth.uid(),'admin')
  );

CREATE POLICY "Users insert their events" ON public.experiment_events
  FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR (auth.uid() IS NULL AND anonymous_id IS NOT NULL AND user_id IS NULL)
  );

-- ========== ASSIGNMENT FUNCTION (deterministic) ==========
CREATE OR REPLACE FUNCTION public.assign_experiment_variant(
  p_experiment_key TEXT,
  p_user_id UUID DEFAULT NULL,
  p_anonymous_id TEXT DEFAULT NULL,
  p_context JSONB DEFAULT '{}'::jsonb
) RETURNS TABLE(variant_id UUID, variant_key TEXT, config_payload JSONB, is_control BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

  -- If completed and winner exists → always return winner
  IF v_exp.status = 'completed' AND v_exp.winner_variant_id IS NOT NULL THEN
    RETURN QUERY
      SELECT v.id, v.variant_key, v.config_payload, v.is_control
      FROM public.experiment_variants v WHERE v.id = v_exp.winner_variant_id;
    RETURN;
  END IF;

  -- Existing assignment?
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

  -- Deterministic bucket via md5 hash → 0..100
  v_seed := v_exp.id::text || ':' || COALESCE(p_user_id::text, p_anonymous_id, gen_random_uuid()::text);
  v_hash := ('x' || substr(md5(v_seed), 1, 8))::bit(32)::bigint;
  v_bucket := (v_hash % 10000)::numeric / 100.0; -- 0..99.99

  -- Traffic allocation gate
  IF v_bucket >= v_exp.traffic_allocation_percentage THEN
    RETURN; -- excluded from experiment
  END IF;

  -- Pick variant by allocation
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

  -- Persist
  INSERT INTO public.experiment_assignments(experiment_id, variant_id, user_id, anonymous_id, source_context)
    VALUES (v_exp.id, v_chosen, p_user_id, CASE WHEN p_user_id IS NULL THEN p_anonymous_id END, COALESCE(p_context,'{}'::jsonb))
    ON CONFLICT DO NOTHING;

  RETURN QUERY
    SELECT v.id, v.variant_key, v.config_payload, v.is_control
    FROM public.experiment_variants v WHERE v.id = v_chosen;
END;
$$;

GRANT EXECUTE ON FUNCTION public.assign_experiment_variant(TEXT,UUID,TEXT,JSONB) TO anon, authenticated;

-- ========== EVENT TRACKING FUNCTION ==========
CREATE OR REPLACE FUNCTION public.track_experiment_event(
  p_experiment_key TEXT,
  p_event_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_anonymous_id TEXT DEFAULT NULL,
  p_metric_value NUMERIC DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

GRANT EXECUTE ON FUNCTION public.track_experiment_event(TEXT,TEXT,UUID,TEXT,NUMERIC,JSONB) TO anon, authenticated;

-- ========== RESULTS COMPUTATION ==========
CREATE OR REPLACE FUNCTION public.compute_experiment_results(p_experiment_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

  -- Control rate first
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
            -- Approx normal CDF using erf approximation
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

GRANT EXECUTE ON FUNCTION public.compute_experiment_results(UUID) TO authenticated;

-- ========== LIFECYCLE FUNCTIONS ==========
CREATE OR REPLACE FUNCTION public.launch_experiment(p_experiment_id UUID)
RETURNS public.experiments LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.pause_experiment(p_experiment_id UUID, p_note TEXT DEFAULT NULL)
RETURNS public.experiments LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.complete_experiment(p_experiment_id UUID, p_winner_variant_id UUID DEFAULT NULL, p_note TEXT DEFAULT NULL)
RETURNS public.experiments LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.archive_experiment(p_experiment_id UUID)
RETURNS public.experiments LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_exp public.experiments%ROWTYPE; v_before JSONB; BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT * INTO v_exp FROM public.experiments WHERE id = p_experiment_id FOR UPDATE;
  v_before := to_jsonb(v_exp);
  UPDATE public.experiments SET status='archived' WHERE id=p_experiment_id RETURNING * INTO v_exp;
  INSERT INTO public.experiment_audit_logs(experiment_id, action_type, actor_user_id, before_state, after_state)
    VALUES (p_experiment_id, 'archive_experiment', auth.uid(), v_before, to_jsonb(v_exp));
  RETURN v_exp;
END; $$;

GRANT EXECUTE ON FUNCTION public.launch_experiment(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.pause_experiment(UUID,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_experiment(UUID,UUID,TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.archive_experiment(UUID) TO authenticated;