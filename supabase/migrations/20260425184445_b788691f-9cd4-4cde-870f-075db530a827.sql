-- Drop tables (CASCADE removes all dependent triggers/functions/policies/FKs)
DROP TABLE IF EXISTS public.gamification_rewards CASCADE;
DROP TABLE IF EXISTS public.gamification_levels CASCADE;
DROP TABLE IF EXISTS public.reward_redemptions CASCADE;
DROP TABLE IF EXISTS public.reward_rules CASCADE;
DROP TABLE IF EXISTS public.user_rewards CASCADE;
DROP TABLE IF EXISTS public.user_points CASCADE;
DROP TABLE IF EXISTS public.user_xp_wallet CASCADE;
DROP TABLE IF EXISTS public.student_reward_events CASCADE;
DROP TABLE IF EXISTS public.xp_rewards_claims CASCADE;
DROP TABLE IF EXISTS public.referral_rewards CASCADE;

-- Drop remaining functions explicitly (in case any survived without CASCADE link)
DO $$
DECLARE
  fn TEXT;
BEGIN
  FOR fn IN
    SELECT format('%I.%I(%s)', n.nspname, p.proname, pg_get_function_identity_arguments(p.oid))
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = ANY(ARRAY[
        'apply_point_transaction',
        'award_assessment_share_xp',
        'award_points',
        'award_xp',
        'challenge_award_xp',
        'claim_xp_reward',
        'compute_level_for_points',
        'gamification_on_invoice_paid',
        'gamification_on_membership_active',
        'gamification_on_order_completed',
        'gamification_on_profile_created',
        'gamification_on_referral_rewarded',
        'get_membership_points_multiplier',
        'get_user_xp_summary',
        'get_xp_conversion_report',
        'grant_referral_xp',
        'reward_viral_share',
        'tg_notify_challenge_level_up',
        'trg_student_level_up'
      ])
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || fn || ' CASCADE';
  END LOOP;
END$$;