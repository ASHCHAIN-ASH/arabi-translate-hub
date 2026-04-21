-- Seed question_categories, subjects, and starter questions for the Question Bank
DO $$
DECLARE
  med_id uuid;
  uni_id uuid;
  prof_id uuid;
  s_anatomy uuid;
  s_physio uuid;
  s_pharma uuid;
  s_math uuid;
  s_cs uuid;
  s_eng uuid;
  s_business uuid;
  s_research uuid;
  q_id uuid;
BEGIN
  -- Categories
  INSERT INTO public.question_categories (name_ar, name_en, icon, sort_order, is_active)
  VALUES ('الطب والعلوم الصحية', 'Medicine & Health', '🩺', 1, true)
  ON CONFLICT DO NOTHING RETURNING id INTO med_id;
  IF med_id IS NULL THEN SELECT id INTO med_id FROM public.question_categories WHERE name_ar='الطب والعلوم الصحية' LIMIT 1; END IF;

  INSERT INTO public.question_categories (name_ar, name_en, icon, sort_order, is_active)
  VALUES ('الجامعات والعلوم', 'Universities & Sciences', '🎓', 2, true)
  ON CONFLICT DO NOTHING RETURNING id INTO uni_id;
  IF uni_id IS NULL THEN SELECT id INTO uni_id FROM public.question_categories WHERE name_ar='الجامعات والعلوم' LIMIT 1; END IF;

  INSERT INTO public.question_categories (name_ar, name_en, icon, sort_order, is_active)
  VALUES ('المهارات المهنية', 'Professional Skills', '💼', 3, true)
  ON CONFLICT DO NOTHING RETURNING id INTO prof_id;
  IF prof_id IS NULL THEN SELECT id INTO prof_id FROM public.question_categories WHERE name_ar='المهارات المهنية' LIMIT 1; END IF;

  -- Subjects: Medicine
  INSERT INTO public.subjects (category_id, name_ar, name_en, icon, is_active) VALUES (med_id, 'التشريح', 'Anatomy', '🦴', true) ON CONFLICT DO NOTHING RETURNING id INTO s_anatomy;
  IF s_anatomy IS NULL THEN SELECT id INTO s_anatomy FROM public.subjects WHERE category_id=med_id AND name_ar='التشريح' LIMIT 1; END IF;
  INSERT INTO public.subjects (category_id, name_ar, name_en, icon, is_active) VALUES (med_id, 'وظائف الأعضاء', 'Physiology', '❤️', true) ON CONFLICT DO NOTHING RETURNING id INTO s_physio;
  IF s_physio IS NULL THEN SELECT id INTO s_physio FROM public.subjects WHERE category_id=med_id AND name_ar='وظائف الأعضاء' LIMIT 1; END IF;
  INSERT INTO public.subjects (category_id, name_ar, name_en, icon, is_active) VALUES (med_id, 'علم الأدوية', 'Pharmacology', '💊', true) ON CONFLICT DO NOTHING RETURNING id INTO s_pharma;
  IF s_pharma IS NULL THEN SELECT id INTO s_pharma FROM public.subjects WHERE category_id=med_id AND name_ar='علم الأدوية' LIMIT 1; END IF;

  -- Subjects: Universities
  INSERT INTO public.subjects (category_id, name_ar, name_en, icon, is_active) VALUES (uni_id, 'الرياضيات', 'Mathematics', '📐', true) ON CONFLICT DO NOTHING RETURNING id INTO s_math;
  IF s_math IS NULL THEN SELECT id INTO s_math FROM public.subjects WHERE category_id=uni_id AND name_ar='الرياضيات' LIMIT 1; END IF;
  INSERT INTO public.subjects (category_id, name_ar, name_en, icon, is_active) VALUES (uni_id, 'علوم الحاسب', 'Computer Science', '💻', true) ON CONFLICT DO NOTHING RETURNING id INTO s_cs;
  IF s_cs IS NULL THEN SELECT id INTO s_cs FROM public.subjects WHERE category_id=uni_id AND name_ar='علوم الحاسب' LIMIT 1; END IF;
  INSERT INTO public.subjects (category_id, name_ar, name_en, icon, is_active) VALUES (uni_id, 'اللغة الإنجليزية', 'English', '🌍', true) ON CONFLICT DO NOTHING RETURNING id INTO s_eng;
  IF s_eng IS NULL THEN SELECT id INTO s_eng FROM public.subjects WHERE category_id=uni_id AND name_ar='اللغة الإنجليزية' LIMIT 1; END IF;

  -- Subjects: Professional
  INSERT INTO public.subjects (category_id, name_ar, name_en, icon, is_active) VALUES (prof_id, 'إدارة الأعمال', 'Business', '📊', true) ON CONFLICT DO NOTHING RETURNING id INTO s_business;
  IF s_business IS NULL THEN SELECT id INTO s_business FROM public.subjects WHERE category_id=prof_id AND name_ar='إدارة الأعمال' LIMIT 1; END IF;
  INSERT INTO public.subjects (category_id, name_ar, name_en, icon, is_active) VALUES (prof_id, 'منهجية البحث العلمي', 'Research Methods', '🔬', true) ON CONFLICT DO NOTHING RETURNING id INTO s_research;
  IF s_research IS NULL THEN SELECT id INTO s_research FROM public.subjects WHERE category_id=prof_id AND name_ar='منهجية البحث العلمي' LIMIT 1; END IF;

  -- Helper to insert question + 4 choices
  -- Anatomy Q1
  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_anatomy, 'كم عدد العظام في جسم الإنسان البالغ؟', 'يتكون جسم الإنسان البالغ من 206 عظمة.', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, '206', true, 0), (q_id, '201', false, 1), (q_id, '210', false, 2), (q_id, '198', false, 3);

  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_anatomy, 'ما أكبر عضلة في جسم الإنسان؟', 'العضلة الألوية الكبرى هي أكبر عضلة في الجسم.', 'mcq', 'medium') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'العضلة الألوية الكبرى', true, 0), (q_id, 'عضلة الفخذ الأمامية', false, 1), (q_id, 'عضلة القلب', false, 2), (q_id, 'العضلة الصدرية', false, 3);

  -- Physiology
  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_physio, 'ما العضو المسؤول عن إنتاج الإنسولين؟', 'البنكرياس ينتج الإنسولين من خلايا بيتا في جزر لانجرهانز.', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'البنكرياس', true, 0), (q_id, 'الكبد', false, 1), (q_id, 'الكلى', false, 2), (q_id, 'الطحال', false, 3);

  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_physio, 'كم عدد ضربات القلب الطبيعية في الدقيقة لشخص بالغ؟', 'تتراوح ضربات القلب الطبيعية بين 60-100 نبضة/دقيقة.', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, '60-100', true, 0), (q_id, '40-60', false, 1), (q_id, '100-120', false, 2), (q_id, '120-140', false, 3);

  -- Pharmacology
  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_pharma, 'ما المضاد الحيوي الأشهر من فئة البنسلين؟', 'الأموكسيسيلين من أكثر مضادات البنسلين استخداماً.', 'mcq', 'medium') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'الأموكسيسيلين', true, 0), (q_id, 'السيبروفلوكساسين', false, 1), (q_id, 'الأزيثروميسين', false, 2), (q_id, 'الفانكومايسين', false, 3);

  -- Math
  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_math, 'ما ناتج 12 × 8؟', '12 × 8 = 96', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, '96', true, 0), (q_id, '86', false, 1), (q_id, '108', false, 2), (q_id, '92', false, 3);

  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_math, 'ما قيمة الجذر التربيعي للعدد 144؟', '√144 = 12', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, '12', true, 0), (q_id, '14', false, 1), (q_id, '10', false, 2), (q_id, '16', false, 3);

  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_math, 'مشتقة الدالة f(x) = x³ هي؟', 'باستخدام قاعدة القوة: d/dx(x³) = 3x²', 'mcq', 'medium') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, '3x²', true, 0), (q_id, 'x²', false, 1), (q_id, '3x', false, 2), (q_id, 'x³/3', false, 3);

  -- CS
  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_cs, 'ما تعقيد البحث الثنائي (Binary Search) من حيث الزمن؟', 'البحث الثنائي يقسم المصفوفة بالنصف في كل خطوة، فيكون التعقيد O(log n).', 'mcq', 'medium') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'O(log n)', true, 0), (q_id, 'O(n)', false, 1), (q_id, 'O(n²)', false, 2), (q_id, 'O(1)', false, 3);

  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_cs, 'أي من التالي ليس لغة برمجة؟', 'HTML هي لغة ترميز (Markup) وليست لغة برمجة.', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'HTML', true, 0), (q_id, 'Python', false, 1), (q_id, 'Java', false, 2), (q_id, 'C++', false, 3);

  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_cs, 'ماذا يعني اختصار SQL؟', 'SQL = Structured Query Language', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'Structured Query Language', true, 0), (q_id, 'Simple Query Language', false, 1), (q_id, 'System Query Logic', false, 2), (q_id, 'Standard Question Language', false, 3);

  -- English
  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_eng, 'Choose the correct sentence:', 'الفعل المساعد "has" يستخدم مع المفرد الغائب.', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'She has a book.', true, 0), (q_id, 'She have a book.', false, 1), (q_id, 'She having book.', false, 2), (q_id, 'She is have a book.', false, 3);

  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_eng, 'What is the past tense of "go"?', 'الماضي البسيط للفعل go هو went.', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'went', true, 0), (q_id, 'goed', false, 1), (q_id, 'gone', false, 2), (q_id, 'going', false, 3);

  -- Business
  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_business, 'ما الذي يقيسه مؤشر ROI؟', 'ROI (Return on Investment) يقيس العائد على الاستثمار.', 'mcq', 'medium') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'العائد على الاستثمار', true, 0), (q_id, 'إجمالي المبيعات', false, 1), (q_id, 'صافي الربح', false, 2), (q_id, 'تكلفة الإنتاج', false, 3);

  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_business, 'تحليل SWOT يدرس:', 'يدرس نقاط القوة والضعف والفرص والتهديدات.', 'mcq', 'medium') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'القوة، الضعف، الفرص، التهديدات', true, 0), (q_id, 'المبيعات والتسويق', false, 1), (q_id, 'الموردين والعملاء', false, 2), (q_id, 'الأرباح والخسائر', false, 3);

  -- Research
  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_research, 'ما الفرق بين البحث الكمي والكيفي؟', 'الكمي يعتمد على الأرقام والإحصاء، والكيفي على الوصف والتفسير.', 'mcq', 'medium') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'الكمي بالأرقام والكيفي بالوصف', true, 0), (q_id, 'لا يوجد فرق', false, 1), (q_id, 'الكمي أحدث من الكيفي', false, 2), (q_id, 'الكيفي أدق دائماً', false, 3);

  INSERT INTO public.questions (subject_id, question_text, explanation, question_type, difficulty)
  VALUES (s_research, 'أسلوب APA يستخدم بشكل رئيسي في:', 'يستخدم APA في علم النفس والعلوم الاجتماعية والتربية.', 'mcq', 'easy') RETURNING id INTO q_id;
  INSERT INTO public.question_choices (question_id, choice_text, is_correct, order_index) VALUES
    (q_id, 'العلوم الاجتماعية وعلم النفس', true, 0), (q_id, 'الهندسة فقط', false, 1), (q_id, 'الأدب فقط', false, 2), (q_id, 'الطب فقط', false, 3);
END $$;