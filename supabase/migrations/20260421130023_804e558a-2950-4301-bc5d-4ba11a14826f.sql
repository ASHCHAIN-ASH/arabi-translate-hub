
-- 1) قوالب رسائل التحدي
INSERT INTO public.whatsapp_templates (event_key, title, body_text, variables, is_active) VALUES
('challenge_attempt_started', 'بدء محاولة تحدٍ', 
'🎯 بدأت محاولة جديدة في تحدي اليوم: {{challenge_title}}
⏱️ المدة: {{duration_minutes}} دقيقة
📝 عدد الأسئلة: {{total_questions}}
بالتوفيق! 💪', 
'["challenge_title","duration_minutes","total_questions"]'::jsonb, true),

('challenge_attempt_completed', 'إكمال محاولة تحدٍ',
'✅ أكملت تحدي: {{challenge_title}}
🎯 نتيجتك: {{score}}/100
✔️ الإجابات الصحيحة: {{correct_count}}/{{total_questions}}
⭐ XP المكتسبة: {{xp_awarded}}
📈 إجمالي XP: {{total_xp}}
🔥 سلسلة الأيام: {{current_streak}}', 
'["challenge_title","score","correct_count","total_questions","xp_awarded","total_xp","current_streak"]'::jsonb, true),

('challenge_perfect_score', 'علامة كاملة',
'🏆 رائع! حصلت على علامة كاملة في تحدي: {{challenge_title}}
🎉 جميع الإجابات صحيحة ({{total_questions}}/{{total_questions}})
⭐ XP المكافأة: {{xp_awarded}}
استمر في التميّز! 🌟', 
'["challenge_title","total_questions","xp_awarded"]'::jsonb, true),

('challenge_achievement_unlocked', 'فتح إنجاز جديد',
'🎖️ مبروك! فتحت إنجازاً جديداً
🏅 {{achievement_name}}
{{achievement_description}}
⭐ مكافأة XP: {{xp_bonus}}
احتفل بإنجازك! 🎊', 
'["achievement_name","achievement_description","xp_bonus"]'::jsonb, true),

('challenge_level_up', 'ترقية مستوى',
'🚀 ترقية! وصلت إلى مستوى جديد
🎖️ {{level_name}}
📊 إجمالي XP: {{total_xp}}
✨ مزايا جديدة في انتظارك!', 
'["level_name","total_xp"]'::jsonb, true),

('challenge_streak_milestone', 'سلسلة أيام متتالية',
'🔥 سلسلتك المذهلة: {{current_streak}} أيام متتالية!
استمر في التحدي اليومي للحفاظ على السلسلة 💪
🏆 أطول سلسلة: {{longest_streak}} يوم', 
'["current_streak","longest_streak"]'::jsonb, true),

('challenge_daily_available', 'تحدٍ يومي جديد',
'🆕 تحدي اليوم متاح الآن!
🎯 {{challenge_title}}
{{challenge_description}}
⏱️ المدة: {{duration_minutes}} دقيقة
⭐ XP لكل إجابة صحيحة: {{xp_per_correct}}
ابدأ التحدي الآن!', 
'["challenge_title","challenge_description","duration_minutes","xp_per_correct"]'::jsonb, true),

('challenge_xp_reset_weekly', 'تجديد XP الأسبوعي',
'📅 بدأ أسبوع جديد!
تم تجديد XP الأسبوعي. ابدأ من جديد للوصول للقمة 🏆
🎯 إجمالي XP: {{total_xp}}', 
'["total_xp"]'::jsonb, true)
ON CONFLICT (event_key) DO UPDATE SET 
  body_text = EXCLUDED.body_text,
  variables = EXCLUDED.variables,
  updated_at = now();

-- 2) تفعيل الأحداث
UPDATE public.whatsapp_settings
SET events_enabled = COALESCE(events_enabled, '{}'::jsonb) || jsonb_build_object(
  'challenge_attempt_started', true,
  'challenge_attempt_completed', true,
  'challenge_perfect_score', true,
  'challenge_achievement_unlocked', true,
  'challenge_level_up', true,
  'challenge_streak_milestone', true,
  'challenge_daily_available', true,
  'challenge_xp_reset_weekly', true
)
WHERE id = 1;

-- 3) دالة جلب الهاتف
CREATE OR REPLACE FUNCTION public.get_user_whatsapp_phone(_user_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT phone FROM public.profiles WHERE id = _user_id AND phone IS NOT NULL AND length(trim(phone)) > 0 $$;

-- 4) Trigger: بدء محاولة
CREATE OR REPLACE FUNCTION public.tg_notify_challenge_attempt_started()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_phone text; v_challenge record; v_total_q int;
BEGIN
  v_phone := public.get_user_whatsapp_phone(NEW.user_id);
  IF v_phone IS NULL THEN RETURN NEW; END IF;
  SELECT title, duration_minutes INTO v_challenge FROM public.daily_challenges WHERE id = NEW.challenge_id;
  SELECT count(*) INTO v_total_q FROM public.challenge_questions WHERE challenge_id = NEW.challenge_id;
  PERFORM public.notify_whatsapp_event(v_phone, 'challenge_attempt_started',
    jsonb_build_object('challenge_title', COALESCE(v_challenge.title,''), 'duration_minutes', COALESCE(v_challenge.duration_minutes,0), 'total_questions', v_total_q),
    'challenge_attempt', NEW.id::text, NEW.user_id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_challenge_attempt_started ON public.challenge_attempts;
CREATE TRIGGER trg_challenge_attempt_started AFTER INSERT ON public.challenge_attempts
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_challenge_attempt_started();

-- 5) Trigger: إكمال + علامة كاملة
CREATE OR REPLACE FUNCTION public.tg_notify_challenge_attempt_completed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_phone text; v_title text; v_total_xp bigint; v_streak int;
BEGIN
  IF NEW.status <> 'completed' OR (TG_OP = 'UPDATE' AND OLD.status = 'completed') THEN RETURN NEW; END IF;
  v_phone := public.get_user_whatsapp_phone(NEW.user_id);
  IF v_phone IS NULL THEN RETURN NEW; END IF;
  SELECT title INTO v_title FROM public.daily_challenges WHERE id = NEW.challenge_id;
  SELECT total_xp INTO v_total_xp FROM public.challenge_user_xp WHERE user_id = NEW.user_id;
  SELECT current_streak INTO v_streak FROM public.challenge_streaks WHERE user_id = NEW.user_id;
  PERFORM public.notify_whatsapp_event(v_phone, 'challenge_attempt_completed',
    jsonb_build_object('challenge_title',COALESCE(v_title,''),'score',NEW.score,'correct_count',NEW.correct_count,'total_questions',NEW.total_questions,'xp_awarded',NEW.xp_awarded,'total_xp',COALESCE(v_total_xp,0),'current_streak',COALESCE(v_streak,0)),
    'challenge_attempt', NEW.id::text, NEW.user_id);
  IF NEW.is_perfect THEN
    PERFORM public.notify_whatsapp_event(v_phone, 'challenge_perfect_score',
      jsonb_build_object('challenge_title',COALESCE(v_title,''),'total_questions',NEW.total_questions,'xp_awarded',NEW.xp_awarded),
      'challenge_attempt', NEW.id::text, NEW.user_id);
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_challenge_attempt_completed ON public.challenge_attempts;
CREATE TRIGGER trg_challenge_attempt_completed AFTER UPDATE ON public.challenge_attempts
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_challenge_attempt_completed();

-- 6) Trigger: إنجاز
CREATE OR REPLACE FUNCTION public.tg_notify_challenge_achievement()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_phone text; v_ach record;
BEGIN
  v_phone := public.get_user_whatsapp_phone(NEW.user_id);
  IF v_phone IS NULL THEN RETURN NEW; END IF;
  SELECT name_ar, description_ar, xp_bonus INTO v_ach FROM public.challenge_achievements WHERE id = NEW.achievement_id;
  PERFORM public.notify_whatsapp_event(v_phone, 'challenge_achievement_unlocked',
    jsonb_build_object('achievement_name',COALESCE(v_ach.name_ar,''),'achievement_description',COALESCE(v_ach.description_ar,''),'xp_bonus',COALESCE(v_ach.xp_bonus,0)),
    'challenge_achievement', NEW.id::text, NEW.user_id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_challenge_achievement_unlocked ON public.challenge_user_achievements;
CREATE TRIGGER trg_challenge_achievement_unlocked AFTER INSERT ON public.challenge_user_achievements
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_challenge_achievement();

-- 7) Trigger: ترقية مستوى
CREATE OR REPLACE FUNCTION public.tg_notify_challenge_level_up()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_phone text; v_level_name text;
BEGIN
  IF NEW.current_level_id IS NULL OR NEW.current_level_id IS NOT DISTINCT FROM OLD.current_level_id THEN RETURN NEW; END IF;
  v_phone := public.get_user_whatsapp_phone(NEW.user_id);
  IF v_phone IS NULL THEN RETURN NEW; END IF;
  SELECT name_ar INTO v_level_name FROM public.challenge_levels WHERE id = NEW.current_level_id;
  PERFORM public.notify_whatsapp_event(v_phone, 'challenge_level_up',
    jsonb_build_object('level_name',COALESCE(v_level_name,''),'total_xp',NEW.total_xp),
    'challenge_level', NEW.current_level_id::text, NEW.user_id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_challenge_level_up ON public.challenge_user_xp;
CREATE TRIGGER trg_challenge_level_up AFTER UPDATE ON public.challenge_user_xp
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_challenge_level_up();

-- 8) Trigger: معالم السلسلة
CREATE OR REPLACE FUNCTION public.tg_notify_challenge_streak_milestone()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_phone text;
BEGIN
  IF NEW.current_streak IS NULL OR NEW.current_streak <= COALESCE(OLD.current_streak,0) THEN RETURN NEW; END IF;
  IF NEW.current_streak NOT IN (3,7,14,30,60,100,200,365) THEN RETURN NEW; END IF;
  v_phone := public.get_user_whatsapp_phone(NEW.user_id);
  IF v_phone IS NULL THEN RETURN NEW; END IF;
  PERFORM public.notify_whatsapp_event(v_phone, 'challenge_streak_milestone',
    jsonb_build_object('current_streak',NEW.current_streak,'longest_streak',NEW.longest_streak),
    'challenge_streak', NEW.user_id::text, NEW.user_id);
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_challenge_streak_milestone ON public.challenge_streaks;
CREATE TRIGGER trg_challenge_streak_milestone AFTER UPDATE ON public.challenge_streaks
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_challenge_streak_milestone();

-- 9) Trigger: تحدٍ يومي جديد
CREATE OR REPLACE FUNCTION public.tg_notify_new_daily_challenge()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r record;
BEGIN
  IF NEW.is_active IS NOT TRUE OR NEW.challenge_date <> CURRENT_DATE THEN RETURN NEW; END IF;
  FOR r IN
    SELECT DISTINCT p.id AS user_id, p.phone
    FROM public.profiles p
    INNER JOIN public.challenge_user_xp x ON x.user_id = p.id
    WHERE p.phone IS NOT NULL AND length(trim(p.phone)) > 0
      AND x.updated_at > now() - interval '30 days'
    LIMIT 5000
  LOOP
    PERFORM public.notify_whatsapp_event(r.phone, 'challenge_daily_available',
      jsonb_build_object('challenge_title',NEW.title,'challenge_description',COALESCE(NEW.description,''),'duration_minutes',NEW.duration_minutes,'xp_per_correct',NEW.xp_per_correct),
      'daily_challenge', NEW.id::text, r.user_id);
  END LOOP;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_new_daily_challenge ON public.daily_challenges;
CREATE TRIGGER trg_new_daily_challenge AFTER INSERT ON public.daily_challenges
FOR EACH ROW EXECUTE FUNCTION public.tg_notify_new_daily_challenge();
