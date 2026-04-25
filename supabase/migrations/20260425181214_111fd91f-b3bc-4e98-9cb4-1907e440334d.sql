-- Drop Marketplace (XP Store)
DROP TABLE IF EXISTS public.marketplace_funnel_events CASCADE;
DROP TABLE IF EXISTS public.marketplace_item_views CASCADE;
DROP TABLE IF EXISTS public.marketplace_price_experiments CASCADE;
DROP TABLE IF EXISTS public.marketplace_purchase_failures CASCADE;
DROP TABLE IF EXISTS public.marketplace_purchase_limits CASCADE;
DROP TABLE IF EXISTS public.marketplace_purchases CASCADE;
DROP TABLE IF EXISTS public.marketplace_items CASCADE;
DROP TABLE IF EXISTS public.user_discount_coupons CASCADE;
DROP TABLE IF EXISTS public.user_unlocked_features CASCADE;

-- Drop Challenge Academy
DROP TABLE IF EXISTS public.challenge_xp_transactions CASCADE;
DROP TABLE IF EXISTS public.challenge_user_achievements CASCADE;
DROP TABLE IF EXISTS public.challenge_user_xp CASCADE;
DROP TABLE IF EXISTS public.challenge_submissions CASCADE;
DROP TABLE IF EXISTS public.challenge_streaks CASCADE;
DROP TABLE IF EXISTS public.challenge_questions CASCADE;
DROP TABLE IF EXISTS public.challenge_attempts CASCADE;
DROP TABLE IF EXISTS public.challenge_daily_challenges CASCADE;
DROP TABLE IF EXISTS public.challenge_levels CASCADE;
DROP TABLE IF EXISTS public.challenge_achievements CASCADE;
DROP TABLE IF EXISTS public.daily_challenges CASCADE;

-- Drop Battle Quiz Arena
DROP TABLE IF EXISTS public.battle_quiz_user_missions CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_daily_missions CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_daily_limits CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_rewards CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_leaderboards CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_flags CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_answers CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_attempts CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_choices CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_questions CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_1v1_friend_invites CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_1v1_queue CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_1v1_matches CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_1v1_ratings CASCADE;
DROP TABLE IF EXISTS public.battle_quiz_rooms CASCADE;

-- Drop Question Bank
DROP TABLE IF EXISTS public.question_bank_attempts CASCADE;
DROP TABLE IF EXISTS public.question_bank_session_history CASCADE;
DROP TABLE IF EXISTS public.question_bank_sessions CASCADE;
DROP TABLE IF EXISTS public.question_bank_subscriptions CASCADE;
DROP TABLE IF EXISTS public.question_bank_plans CASCADE;

-- Drop related enums
DROP TYPE IF EXISTS public.battle_quiz_attempt_status CASCADE;
DROP TYPE IF EXISTS public.battle_quiz_room_status CASCADE;
DROP TYPE IF EXISTS public.battle_quiz_mode CASCADE;
DROP TYPE IF EXISTS public.battle_quiz_difficulty CASCADE;
DROP TYPE IF EXISTS public.battle_quiz_anti_cheat_type CASCADE;
DROP TYPE IF EXISTS public.battle_quiz_reward_type CASCADE;
DROP TYPE IF EXISTS public.battle_quiz_reward_status CASCADE;
DROP TYPE IF EXISTS public.bq_1v1_mode CASCADE;
DROP TYPE IF EXISTS public.bq_1v1_match_status CASCADE;
DROP TYPE IF EXISTS public.bq_1v1_queue_status CASCADE;