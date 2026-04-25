-- Drop RPC functions related to student section
DROP FUNCTION IF EXISTS public.get_today_student_tasks() CASCADE;
DROP FUNCTION IF EXISTS public.complete_daily_task(text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.complete_daily_task(_task_code text, _metadata jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.use_track_tool(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.use_track_tool(_tool_id uuid) CASCADE;

-- Drop tables (CASCADE removes RLS policies, triggers, FKs, indexes)
DROP TABLE IF EXISTS public.track_tool_usage_logs CASCADE;
DROP TABLE IF EXISTS public.track_tools CASCADE;
DROP TABLE IF EXISTS public.tracks CASCADE;

DROP TABLE IF EXISTS public.mind_map_usage CASCADE;
DROP TABLE IF EXISTS public.mind_maps CASCADE;

DROP TABLE IF EXISTS public.academic_cvs CASCADE;

DROP TABLE IF EXISTS public.student_ai_usage CASCADE;

DROP TABLE IF EXISTS public.student_task_completions CASCADE;
DROP TABLE IF EXISTS public.student_daily_tasks CASCADE;

DROP TABLE IF EXISTS public.student_resources CASCADE;
DROP TABLE IF EXISTS public.library_categories CASCADE;