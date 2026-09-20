ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

DO $$
DECLARE
  r record;
  keep text[] := ARRAY[
    'add_competition_vote','analyze_growth_insights','archive_experiment','assign_experiment_variant',
    'award_assessment_share_xp','cancel_group_order','claim_referral','complete_experiment',
    'compute_experiment_results','compute_order_countdown','create_group_order','create_platform_notification',
    'dismiss_automation_insight','generate_affiliate_id','generate_discount_code','generate_internal_order_number',
    'get_active_bonus_drop','get_active_membership','get_competition_stats','get_daily_assessment_questions',
    'get_growth_daily_series','get_growth_funnel','get_growth_overview','get_growth_sources',
    'get_referral_commission_balance','get_referral_leaderboard','get_referrer_by_code','get_retention_cohort',
    'get_today_any_assessment_attempt','get_today_assessment_attempt','get_top_challenges','get_trial_balance',
    'get_voting_stats','has_role','join_group_order','launch_experiment','link_anonymous_assessment_attempts',
    'log_smart_editor_usage','mark_bonus_drop_seen','pause_experiment','pay_group_seat_with_wallet',
    'pay_installment_from_wallet','register_competition_participation','request_withdrawal','resolve_automation_insight',
    'sign_contract_with_otp','submit_assessment_attempt','track_experiment_event','track_order',
    'validate_competition_participation','accept_service_quote','client_confirm_delivery',
    'bq_is_admin','bq_get_daily_missions','bq_claim_daily_mission','bq_1v1_enqueue','bq_1v1_cancel_queue',
    'bq_1v1_submit_score','bq_1v1_finalize','bq_1v1_heartbeat','bq_1v1_request_rematch',
    'bq_1v1_accept_friend_invite','bq_1v1_get_leaderboard','challenge_submit','challenge_update_streak',
    'check_in_study_challenge'
  ];
BEGIN
  FOR r IN
    SELECT p.oid, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND NOT (p.proname = ANY(keep))
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION public.%I(%s) FROM PUBLIC, anon, authenticated;', r.proname, r.args);
    EXECUTE format('GRANT EXECUTE ON FUNCTION public.%I(%s) TO service_role;', r.proname, r.args);
  END LOOP;
END $$;