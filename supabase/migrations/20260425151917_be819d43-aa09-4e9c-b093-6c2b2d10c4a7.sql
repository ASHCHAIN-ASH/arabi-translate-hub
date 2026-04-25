UPDATE public.reward_rules
SET points_reward = 10, daily_limit = 10, updated_at = now()
WHERE code = 'DAILY_START';