-- 1) Events table
CREATE TABLE IF NOT EXISTS public.marketplace_funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'item_view','dialog_open','promo_apply','promo_invalid',
    'purchase_confirm','purchase_success','purchase_failed','redeem'
  )),
  item_id UUID REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  session_id TEXT,
  variant_key TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mkt_funnel_event_time ON public.marketplace_funnel_events (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mkt_funnel_item ON public.marketplace_funnel_events (item_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mkt_funnel_user ON public.marketplace_funnel_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mkt_funnel_session ON public.marketplace_funnel_events (session_id);

ALTER TABLE public.marketplace_funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone insert funnel events"
  ON public.marketplace_funnel_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins view funnel events"
  ON public.marketplace_funnel_events FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users view own funnel events"
  ON public.marketplace_funnel_events FOR SELECT
  USING (auth.uid() = user_id);

-- 2) Track RPC (callable from client)
CREATE OR REPLACE FUNCTION public.track_marketplace_event(
  p_event_type TEXT,
  p_item_id UUID DEFAULT NULL,
  p_anonymous_id TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL,
  p_variant_key TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id UUID;
BEGIN
  INSERT INTO public.marketplace_funnel_events
    (event_type, item_id, user_id, anonymous_id, session_id, variant_key, metadata)
  VALUES
    (p_event_type, p_item_id, auth.uid(), p_anonymous_id, p_session_id, p_variant_key, COALESCE(p_metadata, '{}'::jsonb))
  RETURNING id INTO v_id;
  RETURN v_id;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_marketplace_event(TEXT, UUID, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;

-- 3) Funnel report RPC for admin
CREATE OR REPLACE FUNCTION public.get_marketplace_funnel_report(p_days INTEGER DEFAULT 7)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := now() - (p_days || ' days')::INTERVAL;
  v_summary JSONB;
  v_daily JSONB;
  v_top_items JSONB;
  v_failure_breakdown JSONB;
  v_views INT;
  v_dialogs INT;
  v_confirms INT;
  v_success INT;
  v_failed INT;
  v_promo INT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN jsonb_build_object('error', 'forbidden');
  END IF;

  SELECT
    COUNT(*) FILTER (WHERE event_type = 'item_view'),
    COUNT(*) FILTER (WHERE event_type = 'dialog_open'),
    COUNT(*) FILTER (WHERE event_type = 'purchase_confirm'),
    COUNT(*) FILTER (WHERE event_type = 'purchase_success'),
    COUNT(*) FILTER (WHERE event_type = 'purchase_failed'),
    COUNT(*) FILTER (WHERE event_type = 'promo_apply')
  INTO v_views, v_dialogs, v_confirms, v_success, v_failed, v_promo
  FROM public.marketplace_funnel_events
  WHERE created_at >= v_since;

  v_summary := jsonb_build_object(
    'views', v_views,
    'dialog_opens', v_dialogs,
    'confirms', v_confirms,
    'successes', v_success,
    'failures', v_failed,
    'promo_applies', v_promo,
    'view_to_dialog_rate', CASE WHEN v_views>0 THEN round((v_dialogs::numeric/v_views)*100,2) ELSE 0 END,
    'dialog_to_confirm_rate', CASE WHEN v_dialogs>0 THEN round((v_confirms::numeric/v_dialogs)*100,2) ELSE 0 END,
    'confirm_to_success_rate', CASE WHEN v_confirms>0 THEN round((v_success::numeric/v_confirms)*100,2) ELSE 0 END,
    'overall_conversion', CASE WHEN v_views>0 THEN round((v_success::numeric/v_views)*100,2) ELSE 0 END
  );

  SELECT jsonb_agg(row_to_json(d) ORDER BY d.day) INTO v_daily FROM (
    SELECT
      date_trunc('day', created_at)::date AS day,
      COUNT(*) FILTER (WHERE event_type='item_view') AS views,
      COUNT(*) FILTER (WHERE event_type='dialog_open') AS dialogs,
      COUNT(*) FILTER (WHERE event_type='purchase_success') AS successes,
      COUNT(*) FILTER (WHERE event_type='purchase_failed') AS failures
    FROM public.marketplace_funnel_events
    WHERE created_at >= v_since
    GROUP BY 1
  ) d;

  SELECT jsonb_agg(row_to_json(t)) INTO v_top_items FROM (
    SELECT
      mi.id, mi.title_ar, mi.icon, mi.type,
      COUNT(*) FILTER (WHERE ev.event_type='item_view') AS views,
      COUNT(*) FILTER (WHERE ev.event_type='dialog_open') AS dialogs,
      COUNT(*) FILTER (WHERE ev.event_type='purchase_success') AS successes,
      COUNT(*) FILTER (WHERE ev.event_type='purchase_failed') AS failures,
      CASE WHEN COUNT(*) FILTER (WHERE ev.event_type='item_view')>0
           THEN round((COUNT(*) FILTER (WHERE ev.event_type='purchase_success')::numeric
                       / COUNT(*) FILTER (WHERE ev.event_type='item_view'))*100, 2)
           ELSE 0 END AS conversion_rate
    FROM public.marketplace_funnel_events ev
    JOIN public.marketplace_items mi ON mi.id = ev.item_id
    WHERE ev.created_at >= v_since
    GROUP BY mi.id, mi.title_ar, mi.icon, mi.type
    ORDER BY successes DESC, views DESC
    LIMIT 10
  ) t;

  SELECT jsonb_agg(row_to_json(f)) INTO v_failure_breakdown FROM (
    SELECT
      COALESCE(metadata->>'error', 'unknown') AS reason,
      COUNT(*) AS count
    FROM public.marketplace_funnel_events
    WHERE event_type='purchase_failed' AND created_at >= v_since
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 15
  ) f;

  RETURN jsonb_build_object(
    'period_days', p_days,
    'since', v_since,
    'summary', v_summary,
    'daily', COALESCE(v_daily, '[]'::jsonb),
    'top_items', COALESCE(v_top_items, '[]'::jsonb),
    'failure_breakdown', COALESCE(v_failure_breakdown, '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_marketplace_funnel_report(INTEGER) TO authenticated;