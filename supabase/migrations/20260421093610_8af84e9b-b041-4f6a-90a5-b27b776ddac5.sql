-- Seed 12 specialization assessments + their questions/options
-- Generated via Lovable AI (Gemini 2.5 Flash)

DO $$
DECLARE v_aid uuid;
BEGIN
  INSERT INTO public.assessments (slug, title, description, category, cover_emoji, time_limit_seconds, xp_completion, xp_share, is_active, sort_order)
  VALUES ('medicine', 'اختبار تخصص الطب', 'تشريح، فسيولوجيا، أمراض، صيدلة سريرية أساسية.', 'medicine', '🩺', 600, 50, 20, true, 10)
  ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, category=EXCLUDED.category, cover_emoji=EXCLUDED.cover_emoji, is_active=true
  RETURNING id INTO v_aid;
  DELETE FROM public.assessment_questions WHERE assessment_id = v_aid;
END $$;

-- Note: Full question seeding will be done via separate insert tool calls per specialization
-- to keep migration size manageable. Placeholder slugs created here.

DO $$
DECLARE v_aid uuid; v_specs text[] := ARRAY['pharmacy','nursing','engineering','computer-science','business','law','sharia','arabic-lit','media','education','natural-sci'];
DECLARE v_titles text[] := ARRAY['اختبار تخصص الصيدلة','اختبار تخصص التمريض','اختبار تخصص الهندسة','اختبار تخصص علوم الحاسب','اختبار تخصص إدارة الأعمال','اختبار تخصص القانون','اختبار تخصص الشريعة','اختبار تخصص الأدب العربي','اختبار تخصص الإعلام','اختبار تخصص التربية','اختبار تخصص العلوم الطبيعية'];
DECLARE v_cats text[] := ARRAY['pharmacy','nursing','engineering','computer_science','business','law','sharia','arabic_lit','media','education','natural_sci'];
DECLARE v_emojis text[] := ARRAY['💊','🏥','⚙️','💻','📊','⚖️','🕌','📜','📰','🎓','🔬'];
DECLARE v_descs text[] := ARRAY['علم الأدوية، الكيمياء الصيدلية، التداخلات الدوائية.','العلامات الحيوية، الإسعافات، رعاية المرضى.','ميكانيكا، كهرباء، مدنية ومفاهيم هندسية عامة.','خوارزميات، هياكل بيانات، شبكات، قواعد بيانات.','تسويق، مالية، إدارة موارد بشرية، ريادة أعمال.','قانون عام، قانون خاص، مفاهيم قانونية أساسية.','فقه، أصول فقه، حديث، عقيدة.','نحو، بلاغة، أدب جاهلي وحديث، شعر.','صحافة، إنتاج إعلامي، علاقات عامة، إعلام رقمي.','علم النفس التربوي، طرق التدريس، مناهج.','فيزياء، كيمياء، أحياء عامة.'];
DECLARE i int;
BEGIN
  FOR i IN 1..array_length(v_specs,1) LOOP
    INSERT INTO public.assessments (slug, title, description, category, cover_emoji, time_limit_seconds, xp_completion, xp_share, is_active, sort_order)
    VALUES (v_specs[i], v_titles[i], v_descs[i], v_cats[i], v_emojis[i], 600, 50, 20, true, 10 + i)
    ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, description=EXCLUDED.description, category=EXCLUDED.category, cover_emoji=EXCLUDED.cover_emoji, is_active=true
    RETURNING id INTO v_aid;
    DELETE FROM public.assessment_questions WHERE assessment_id = v_aid;
  END LOOP;
END $$;