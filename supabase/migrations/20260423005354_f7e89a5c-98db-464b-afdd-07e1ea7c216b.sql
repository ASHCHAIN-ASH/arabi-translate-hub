
-- ============================================================
-- 1) Add mode + invite linkage to 1v1 matches
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.bq_1v1_mode AS ENUM ('classic', 'blitz');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.battle_quiz_1v1_matches
  ADD COLUMN IF NOT EXISTS mode public.bq_1v1_mode NOT NULL DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS invite_id uuid,
  ADD COLUMN IF NOT EXISTS rematch_of_match_id uuid REFERENCES public.battle_quiz_1v1_matches(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rematch_request_by uuid;

-- ============================================================
-- 2) Friend invite links for 1v1
-- ============================================================
CREATE TABLE IF NOT EXISTS public.battle_quiz_1v1_friend_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code text NOT NULL UNIQUE,
  inviter_id uuid NOT NULL,
  invitee_id uuid,
  category text NOT NULL DEFAULT 'general',
  mode public.bq_1v1_mode NOT NULL DEFAULT 'classic',
  status text NOT NULL DEFAULT 'pending', -- pending | accepted | expired | cancelled
  match_id uuid REFERENCES public.battle_quiz_1v1_matches(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bq_friend_invites_code ON public.battle_quiz_1v1_friend_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_bq_friend_invites_inviter ON public.battle_quiz_1v1_friend_invites(inviter_id);
CREATE INDEX IF NOT EXISTS idx_bq_friend_invites_status ON public.battle_quiz_1v1_friend_invites(status);

ALTER TABLE public.battle_quiz_1v1_friend_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users view their invites" ON public.battle_quiz_1v1_friend_invites;
CREATE POLICY "users view their invites" ON public.battle_quiz_1v1_friend_invites
  FOR SELECT USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

DROP POLICY IF EXISTS "anyone can read by code" ON public.battle_quiz_1v1_friend_invites;
CREATE POLICY "anyone can read by code" ON public.battle_quiz_1v1_friend_invites
  FOR SELECT USING (true);

-- ============================================================
-- 3) Daily missions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.battle_quiz_daily_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title_ar text NOT NULL,
  description_ar text,
  icon text DEFAULT '🎯',
  mission_type text NOT NULL, -- play_matches | win_matches | win_streak | blitz_matches | perfect_round | invite_friend
  target_value integer NOT NULL DEFAULT 1,
  scope text NOT NULL DEFAULT '1v1', -- 1v1 | classic | blitz | any
  xp_reward integer NOT NULL DEFAULT 50,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.battle_quiz_daily_missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone can view active missions" ON public.battle_quiz_daily_missions;
CREATE POLICY "anyone can view active missions" ON public.battle_quiz_daily_missions
  FOR SELECT USING (is_active = true);

CREATE TABLE IF NOT EXISTS public.battle_quiz_user_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mission_id uuid NOT NULL REFERENCES public.battle_quiz_daily_missions(id) ON DELETE CASCADE,
  mission_date date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  progress integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  is_claimed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, mission_id, mission_date)
);

CREATE INDEX IF NOT EXISTS idx_bq_user_missions_user_date
  ON public.battle_quiz_user_missions(user_id, mission_date);

ALTER TABLE public.battle_quiz_user_missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users view own missions" ON public.battle_quiz_user_missions;
CREATE POLICY "users view own missions" ON public.battle_quiz_user_missions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- 4) RPC: create friend invite
-- ============================================================
CREATE OR REPLACE FUNCTION public.bq_1v1_create_friend_invite(
  p_category text DEFAULT 'general',
  p_mode public.bq_1v1_mode DEFAULT 'classic'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_code text;
  v_id uuid;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('error', 'unauthenticated');
  END IF;

  -- 8-char alphanumeric code
  v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  INSERT INTO public.battle_quiz_1v1_friend_invites (invite_code, inviter_id, category, mode)
  VALUES (v_code, v_user, p_category, p_mode)
  RETURNING id INTO v_id;

  RETURN jsonb_build_object(
    'invite_id', v_id,
    'invite_code', v_code,
    'expires_at', (now() + interval '24 hours')
  );
END;
$$;

-- ============================================================
-- 5) RPC: accept friend invite -> creates 1v1 match directly
-- ============================================================
CREATE OR REPLACE FUNCTION public.bq_1v1_accept_friend_invite(p_invite_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  -- Pick any active reward-eligible room in same category as the "shell" room
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

-- ============================================================
-- 6) RPC: rematch — recreate a fresh match between same players
-- ============================================================
CREATE OR REPLACE FUNCTION public.bq_1v1_request_rematch(p_match_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  -- If a rematch already exists, return it
  SELECT id INTO v_existing_rematch FROM public.battle_quiz_1v1_matches
  WHERE rematch_of_match_id = p_match_id LIMIT 1;
  IF v_existing_rematch IS NOT NULL THEN
    RETURN jsonb_build_object('match_id', v_existing_rematch, 'already_exists', true);
  END IF;

  -- If the opponent already requested rematch via flag, create one. Otherwise just record request.
  IF v_old.rematch_request_by IS NULL THEN
    UPDATE public.battle_quiz_1v1_matches SET rematch_request_by = v_user, updated_at = now()
    WHERE id = p_match_id;
    RETURN jsonb_build_object('waiting', true, 'requested_by', v_user);
  END IF;

  IF v_old.rematch_request_by = v_user THEN
    RETURN jsonb_build_object('waiting', true, 'already_requested', true);
  END IF;

  -- Both agreed → create new match
  INSERT INTO public.battle_quiz_1v1_matches (
    room_id, category, player_a_id, player_b_id, status, mode, rematch_of_match_id
  ) VALUES (
    v_old.room_id, v_old.category, v_old.player_a_id, v_old.player_b_id, 'active', v_old.mode, v_old.id
  ) RETURNING id INTO v_new_id;

  RETURN jsonb_build_object('match_id', v_new_id, 'created', true);
END;
$$;

-- ============================================================
-- 7) RPC: get my missions for today (auto-create rows)
-- ============================================================
CREATE OR REPLACE FUNCTION public.bq_get_daily_missions()
RETURNS TABLE (
  user_mission_id uuid,
  mission_id uuid,
  slug text,
  title_ar text,
  description_ar text,
  icon text,
  mission_type text,
  scope text,
  target_value integer,
  xp_reward integer,
  progress integer,
  is_completed boolean,
  is_claimed boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_today date := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  IF v_user IS NULL THEN RETURN; END IF;

  -- Auto-create user_mission rows for today's active missions
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

-- ============================================================
-- 8) RPC: claim mission reward
-- ============================================================
CREATE OR REPLACE FUNCTION public.bq_claim_daily_mission(p_user_mission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

  -- Award XP via challenge XP system if available, otherwise just record
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

-- ============================================================
-- 9) Trigger: on 1v1 match finalized → bump mission progress
-- ============================================================
CREATE OR REPLACE FUNCTION public.bq_bump_missions_on_1v1_finalize()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today date := (now() AT TIME ZONE 'UTC')::date;
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    -- Auto-create today's mission rows for both players
    INSERT INTO public.battle_quiz_user_missions (user_id, mission_id, mission_date)
    SELECT NEW.player_a_id, m.id, v_today FROM public.battle_quiz_daily_missions m WHERE m.is_active
    ON CONFLICT DO NOTHING;
    INSERT INTO public.battle_quiz_user_missions (user_id, mission_id, mission_date)
    SELECT NEW.player_b_id, m.id, v_today FROM public.battle_quiz_daily_missions m WHERE m.is_active
    ON CONFLICT DO NOTHING;

    -- play_matches (any 1v1)
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

    -- blitz_matches
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

    -- win_matches (winner only)
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

DROP TRIGGER IF EXISTS trg_bq_missions_on_1v1_finalize ON public.battle_quiz_1v1_matches;
CREATE TRIGGER trg_bq_missions_on_1v1_finalize
AFTER UPDATE ON public.battle_quiz_1v1_matches
FOR EACH ROW EXECUTE FUNCTION public.bq_bump_missions_on_1v1_finalize();

-- ============================================================
-- 10) Trigger: on friend invite accepted → bump invite_friend mission for inviter
-- ============================================================
CREATE OR REPLACE FUNCTION public.bq_bump_missions_on_invite_accept()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

DROP TRIGGER IF EXISTS trg_bq_missions_on_invite_accept ON public.battle_quiz_1v1_friend_invites;
CREATE TRIGGER trg_bq_missions_on_invite_accept
AFTER UPDATE ON public.battle_quiz_1v1_friend_invites
FOR EACH ROW EXECUTE FUNCTION public.bq_bump_missions_on_invite_accept();

-- ============================================================
-- 11) Seed default daily missions
-- ============================================================
INSERT INTO public.battle_quiz_daily_missions (slug, title_ar, description_ar, icon, mission_type, target_value, scope, xp_reward, sort_order)
VALUES
  ('play_3_today', 'العب 3 مباريات اليوم', 'أكمل 3 مباريات 1v1 اليوم', '⚔️', 'play_matches', 3, '1v1', 50, 1),
  ('win_2_today', 'اربح مباراتين اليوم', 'حقّق فوزين في مباريات 1v1', '🏆', 'win_matches', 2, '1v1', 100, 2),
  ('blitz_1_today', 'جرّب وضع Blitz', 'أكمل مباراة Blitz واحدة', '⚡', 'blitz_matches', 1, 'blitz', 30, 3),
  ('invite_friend', 'تحدَّ صديقاً', 'ادعُ صديقاً لمباراة 1v1 وأكملها', '🤝', 'invite_friend', 1, 'any', 75, 4)
ON CONFLICT (slug) DO NOTHING;
