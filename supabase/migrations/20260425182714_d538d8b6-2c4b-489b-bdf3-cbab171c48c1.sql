DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT n.nspname AS schema, p.proname AS name,
           pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND (
        p.proname ILIKE '%marketplace%'
        OR p.proname ILIKE '%battle_quiz%'
        OR p.proname ILIKE '%question_bank%'
        OR p.proname ILIKE '%daily_challenge%'
        OR p.proname ILIKE '%xp_store%'
      )
  LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE',
                   r.schema, r.name, r.args);
  END LOOP;
END $$;