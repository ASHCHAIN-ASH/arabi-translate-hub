
-- Fix function search_path warnings (set explicit search_path on all new functions)
ALTER FUNCTION public.bq_1v1_create_friend_invite(text, public.bq_1v1_mode) SET search_path = public;
ALTER FUNCTION public.bq_1v1_accept_friend_invite(text) SET search_path = public;
ALTER FUNCTION public.bq_1v1_request_rematch(uuid) SET search_path = public;
ALTER FUNCTION public.bq_get_daily_missions() SET search_path = public;
ALTER FUNCTION public.bq_claim_daily_mission(uuid) SET search_path = public;
ALTER FUNCTION public.bq_bump_missions_on_1v1_finalize() SET search_path = public;
ALTER FUNCTION public.bq_bump_missions_on_invite_accept() SET search_path = public;

-- Tighten the "anyone can read by code" policy: limit to pending invites only (so leaks are bounded).
-- The invite_code itself is the secret; pending+by-code lookup is what we need.
DROP POLICY IF EXISTS "anyone can read by code" ON public.battle_quiz_1v1_friend_invites;
CREATE POLICY "lookup pending invite by code"
  ON public.battle_quiz_1v1_friend_invites
  FOR SELECT
  USING (status = 'pending');
