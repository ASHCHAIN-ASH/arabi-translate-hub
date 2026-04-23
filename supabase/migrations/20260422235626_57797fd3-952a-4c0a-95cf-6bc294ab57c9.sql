
DO $$ BEGIN
  CREATE TYPE public.bq_1v1_queue_status AS ENUM ('waiting','matched','cancelled','expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.bq_1v1_match_status AS ENUM ('active','completed','abandoned','expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.battle_quiz_1v1_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL DEFAULT 'general',
  status public.bq_1v1_queue_status NOT NULL DEFAULT 'waiting',
  matched_with_user_id uuid,
  match_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_bq_1v1_queue_active_user
  ON public.battle_quiz_1v1_queue(user_id) WHERE status = 'waiting';
CREATE INDEX IF NOT EXISTS idx_bq_1v1_queue_cat_status
  ON public.battle_quiz_1v1_queue(category, status, created_at);
ALTER TABLE public.battle_quiz_1v1_queue ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bq_1v1_queue_select_own ON public.battle_quiz_1v1_queue;
CREATE POLICY bq_1v1_queue_select_own ON public.battle_quiz_1v1_queue
  FOR SELECT USING (auth.uid() = user_id OR public.bq_is_admin());
DROP POLICY IF EXISTS bq_1v1_queue_admin_all ON public.battle_quiz_1v1_queue;
CREATE POLICY bq_1v1_queue_admin_all ON public.battle_quiz_1v1_queue
  FOR ALL USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());

CREATE TABLE IF NOT EXISTS public.battle_quiz_1v1_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.battle_quiz_rooms(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'general',
  player_a_id uuid NOT NULL,
  player_b_id uuid NOT NULL,
  player_a_attempt_id uuid,
  player_b_attempt_id uuid,
  player_a_score integer NOT NULL DEFAULT 0,
  player_b_score integer NOT NULL DEFAULT 0,
  player_a_correct integer NOT NULL DEFAULT 0,
  player_b_correct integer NOT NULL DEFAULT 0,
  player_a_time_ms integer NOT NULL DEFAULT 0,
  player_b_time_ms integer NOT NULL DEFAULT 0,
  player_a_finished_at timestamptz,
  player_b_finished_at timestamptz,
  player_a_last_seen timestamptz NOT NULL DEFAULT now(),
  player_b_last_seen timestamptz NOT NULL DEFAULT now(),
  winner_id uuid,
  status public.bq_1v1_match_status NOT NULL DEFAULT 'active',
  rating_delta integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  finalized_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bq_1v1_distinct_players CHECK (player_a_id <> player_b_id)
);
CREATE INDEX IF NOT EXISTS idx_bq_1v1_matches_player_a ON public.battle_quiz_1v1_matches(player_a_id);
CREATE INDEX IF NOT EXISTS idx_bq_1v1_matches_player_b ON public.battle_quiz_1v1_matches(player_b_id);
CREATE INDEX IF NOT EXISTS idx_bq_1v1_matches_status ON public.battle_quiz_1v1_matches(status);
ALTER TABLE public.battle_quiz_1v1_matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bq_1v1_matches_select_own ON public.battle_quiz_1v1_matches;
CREATE POLICY bq_1v1_matches_select_own ON public.battle_quiz_1v1_matches
  FOR SELECT USING (auth.uid() IN (player_a_id, player_b_id) OR public.bq_is_admin());
DROP POLICY IF EXISTS bq_1v1_matches_admin_all ON public.battle_quiz_1v1_matches;
CREATE POLICY bq_1v1_matches_admin_all ON public.battle_quiz_1v1_matches
  FOR ALL USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());

DROP TRIGGER IF EXISTS trg_bq_1v1_matches_touch ON public.battle_quiz_1v1_matches;
CREATE TRIGGER trg_bq_1v1_matches_touch BEFORE UPDATE ON public.battle_quiz_1v1_matches
  FOR EACH ROW EXECUTE FUNCTION public.bq_touch_updated_at();
DROP TRIGGER IF EXISTS trg_bq_1v1_queue_touch ON public.battle_quiz_1v1_queue;
CREATE TRIGGER trg_bq_1v1_queue_touch BEFORE UPDATE ON public.battle_quiz_1v1_queue
  FOR EACH ROW EXECUTE FUNCTION public.bq_touch_updated_at();

CREATE TABLE IF NOT EXISTS public.battle_quiz_1v1_ratings (
  user_id uuid PRIMARY KEY,
  rating integer NOT NULL DEFAULT 1000,
  wins integer NOT NULL DEFAULT 0,
  losses integer NOT NULL DEFAULT 0,
  draws integer NOT NULL DEFAULT 0,
  current_streak integer NOT NULL DEFAULT 0,
  best_streak integer NOT NULL DEFAULT 0,
  matches_played integer NOT NULL DEFAULT 0,
  last_match_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_bq_1v1_ratings_rating ON public.battle_quiz_1v1_ratings(rating DESC);
ALTER TABLE public.battle_quiz_1v1_ratings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bq_1v1_ratings_public_read ON public.battle_quiz_1v1_ratings;
CREATE POLICY bq_1v1_ratings_public_read ON public.battle_quiz_1v1_ratings
  FOR SELECT USING (true);
DROP POLICY IF EXISTS bq_1v1_ratings_admin_all ON public.battle_quiz_1v1_ratings;
CREATE POLICY bq_1v1_ratings_admin_all ON public.battle_quiz_1v1_ratings
  FOR ALL USING (public.bq_is_admin()) WITH CHECK (public.bq_is_admin());
DROP TRIGGER IF EXISTS trg_bq_1v1_ratings_touch ON public.battle_quiz_1v1_ratings;
CREATE TRIGGER trg_bq_1v1_ratings_touch BEFORE UPDATE ON public.battle_quiz_1v1_ratings
  FOR EACH ROW EXECUTE FUNCTION public.bq_touch_updated_at();

CREATE OR REPLACE FUNCTION public.bq_1v1_enqueue(p_category text DEFAULT 'general')
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.bq_1v1_cancel_queue() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('error','not_authenticated'); END IF;
  UPDATE public.battle_quiz_1v1_queue SET status='cancelled' WHERE user_id=v_uid AND status='waiting';
  RETURN jsonb_build_object('ok',true);
END; $$;

CREATE OR REPLACE FUNCTION public.bq_1v1_finalize(p_match_id uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.bq_1v1_submit_score(
  p_match_id uuid, p_attempt_id uuid, p_score integer, p_correct integer, p_total_time_ms integer
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.bq_1v1_heartbeat(p_match_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.bq_1v1_get_leaderboard(p_limit integer DEFAULT 50)
RETURNS TABLE (
  rank integer, user_id uuid, rating integer, wins integer, losses integer, draws integer,
  matches_played integer, current_streak integer, best_streak integer,
  display_name text, avatar_url text
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
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

GRANT EXECUTE ON FUNCTION public.bq_1v1_enqueue(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bq_1v1_cancel_queue() TO authenticated;
GRANT EXECUTE ON FUNCTION public.bq_1v1_submit_score(uuid, uuid, integer, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bq_1v1_heartbeat(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bq_1v1_finalize(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.bq_1v1_get_leaderboard(integer) TO anon, authenticated;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.battle_quiz_1v1_queue;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.battle_quiz_1v1_matches;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
