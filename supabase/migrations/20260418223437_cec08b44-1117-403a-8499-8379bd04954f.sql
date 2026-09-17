-- توسيع نوع المورد ليشمل article
ALTER TABLE public.student_resources DROP CONSTRAINT IF EXISTS student_resources_resource_type_check;
ALTER TABLE public.student_resources ADD CONSTRAINT student_resources_resource_type_check
  CHECK (resource_type = ANY (ARRAY['pdf'::text, 'link'::text, 'template'::text, 'video'::text, 'document'::text, 'article'::text]));

-- 1) جدول التصنيفات الهرمية
CREATE TABLE IF NOT EXISTS public.library_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.library_categories(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  name_ar text NOT NULL,
  name_en text,
  description_ar text,
  icon text,
  color text DEFAULT 'primary',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_library_categories_parent ON public.library_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_library_categories_active ON public.library_categories(is_active);

ALTER TABLE public.library_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone views active categories" ON public.library_categories;
CREATE POLICY "Anyone views active categories"
  ON public.library_categories FOR SELECT
  USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins manage categories" ON public.library_categories;
CREATE POLICY "Admins manage categories"
  ON public.library_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.touch_library_categories()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_touch_library_categories ON public.library_categories;
CREATE TRIGGER trg_touch_library_categories
  BEFORE UPDATE ON public.library_categories
  FOR EACH ROW EXECUTE FUNCTION public.touch_library_categories();

-- 2) أعمدة جديدة لـ student_resources
ALTER TABLE public.student_resources
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.library_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subcategory_id uuid REFERENCES public.library_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS long_description text,
  ADD COLUMN IF NOT EXISTS author text,
  ADD COLUMN IF NOT EXISTS duration_minutes integer,
  ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'beginner',
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_student_resources_subcategory ON public.student_resources(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_student_resources_category ON public.student_resources(category_id);

-- 3) الأقسام الرئيسية
INSERT INTO public.library_categories (slug, name_ar, name_en, description_ar, icon, color, sort_order)
VALUES
  ('templates', 'القوالب الأكاديمية', 'Academic Templates', 'قوالب جاهزة للرسائل والخطط البحثية والعروض التقديمية', 'LayoutTemplate', 'primary', 1),
  ('methodology', 'الأدلة المنهجية', 'Methodology Guides', 'أدلة شاملة في مناهج البحث وكتابة الإطار النظري والتحليل', 'BookOpen', 'accent', 2),
  ('videos', 'فيديوهات تعليمية', 'Educational Videos', 'شروحات مرئية للأدوات والإحصاء والمنهجية', 'Video', 'secondary', 3),
  ('tools', 'أدوات وروابط مفيدة', 'Useful Tools', 'أفضل الأدوات الرقمية لخدمة الباحث الأكاديمي', 'Wrench', 'warning', 4)
ON CONFLICT (slug) DO NOTHING;

-- الفرعية: قوالب
INSERT INTO public.library_categories (parent_id, slug, name_ar, description_ar, icon, sort_order) VALUES
  ((SELECT id FROM public.library_categories WHERE slug='templates'), 'templates-thesis', 'رسائل ماجستير ودكتوراه', 'قوالب Word كاملة لتنسيق الرسائل', 'GraduationCap', 1),
  ((SELECT id FROM public.library_categories WHERE slug='templates'), 'templates-proposal', 'خطط بحثية (Proposals)', 'قوالب جاهزة لكتابة المقترح البحثي', 'FileText', 2),
  ((SELECT id FROM public.library_categories WHERE slug='templates'), 'templates-presentation', 'عروض المناقشة', 'PowerPoint احترافية لمناقشة الرسائل', 'Presentation', 3),
  ((SELECT id FROM public.library_categories WHERE slug='templates'), 'templates-cv', 'سيرة ذاتية أكاديمية', 'قوالب CV للمتقدمين للأكاديميا والمنح', 'User', 4)
ON CONFLICT (slug) DO NOTHING;

-- الفرعية: منهجية
INSERT INTO public.library_categories (parent_id, slug, name_ar, description_ar, icon, sort_order) VALUES
  ((SELECT id FROM public.library_categories WHERE slug='methodology'), 'method-quantitative', 'المنهج الكمي', 'أدلة SPSS والاختبارات الإحصائية', 'BarChart3', 1),
  ((SELECT id FROM public.library_categories WHERE slug='methodology'), 'method-qualitative', 'المنهج النوعي', 'NVivo، تحليل المحتوى، المقابلات', 'MessageSquare', 2),
  ((SELECT id FROM public.library_categories WHERE slug='methodology'), 'method-citation', 'التوثيق والاقتباس', 'APA 7، Mendeley، Zotero', 'Quote', 3),
  ((SELECT id FROM public.library_categories WHERE slug='methodology'), 'method-framework', 'الإطار النظري', 'كيفية بناء وكتابة الإطار النظري', 'Layers', 4)
ON CONFLICT (slug) DO NOTHING;

-- الفرعية: فيديوهات
INSERT INTO public.library_categories (parent_id, slug, name_ar, description_ar, icon, sort_order) VALUES
  ((SELECT id FROM public.library_categories WHERE slug='videos'), 'videos-spss', 'شروح SPSS', 'سلاسل عملية لتحليل البيانات', 'PlayCircle', 1),
  ((SELECT id FROM public.library_categories WHERE slug='videos'), 'videos-writing', 'كتابة الرسائل', 'دروس في الصياغة الأكاديمية', 'PenTool', 2),
  ((SELECT id FROM public.library_categories WHERE slug='videos'), 'videos-tools', 'شروح أدوات', 'NVivo، Mendeley، Endnote', 'Monitor', 3)
ON CONFLICT (slug) DO NOTHING;

-- الفرعية: أدوات
INSERT INTO public.library_categories (parent_id, slug, name_ar, description_ar, icon, sort_order) VALUES
  ((SELECT id FROM public.library_categories WHERE slug='tools'), 'tools-search', 'محركات بحث علمية', 'Google Scholar، Connected Papers، Semantic Scholar', 'Search', 1),
  ((SELECT id FROM public.library_categories WHERE slug='tools'), 'tools-citation', 'مدراء المراجع', 'Mendeley، Zotero، EndNote', 'Bookmark', 2),
  ((SELECT id FROM public.library_categories WHERE slug='tools'), 'tools-writing', 'مساعدات كتابة', 'Grammarly، QuillBot، DeepL', 'Sparkles', 3),
  ((SELECT id FROM public.library_categories WHERE slug='tools'), 'tools-ai', 'أدوات ذكاء اصطناعي', 'ChatGPT، Elicit، Scite', 'Brain', 4)
ON CONFLICT (slug) DO NOTHING;

-- 4) الموارد الأولية
INSERT INTO public.student_resources (title, description, long_description, resource_type, url, category, tags, is_premium, is_published, is_featured, sort_order, author, difficulty, subcategory_id, category_id)
SELECT v.title, v.description, v.long_description, v.resource_type, v.url, v.category, v.tags, v.is_premium, v.is_published, v.is_featured, v.sort_order, v.author, v.difficulty, v.subcategory_id,
  (SELECT parent_id FROM public.library_categories WHERE id = v.subcategory_id)
FROM (VALUES
  -- قوالب
  ('قالب رسالة ماجستير - النموذج الشامل', 'قالب Word متكامل بفهرسة آلية وأسلوب APA', 'قالب احترافي متوافق مع متطلبات أغلب الجامعات العربية: غلاف، إهداء، فهرس آلي، ترقيم تلقائي، أنماط جاهزة للعناوين الرئيسية والفرعية، جدول مراجع APA 7 جاهز.', 'template', 'https://docs.google.com/document/create', 'قوالب', ARRAY['ماجستير','word','APA'], false, true, true, 1, 'فريق FekrahEdu', 'beginner', (SELECT id FROM public.library_categories WHERE slug='templates-thesis')),
  ('قالب خطة بحث (Research Proposal)', 'خطة بحثية بـ 10 صفحات جاهزة للتعبئة', 'يشمل: المقدمة، مشكلة البحث، الأهداف، الأسئلة، الفرضيات، الحدود، المنهجية، الدراسات السابقة، خطة زمنية، المراجع.', 'template', 'https://docs.google.com/document/create', 'قوالب', ARRAY['proposal','خطة','منهجية'], false, true, true, 2, 'فريق FekrahEdu', 'beginner', (SELECT id FROM public.library_categories WHERE slug='templates-proposal')),
  ('عرض مناقشة احترافي (PowerPoint)', '20 شريحة بتصميم أكاديمي عصري', 'عرض جاهز يغطي: تقديم الباحث، المشكلة، الأهداف، المنهجية، النتائج، التوصيات. متضمن أنيميشن مدروس وأيقونات.', 'template', 'https://docs.google.com/presentation/create', 'قوالب', ARRAY['powerpoint','مناقشة','عرض'], true, true, true, 3, 'فريق التصميم', 'intermediate', (SELECT id FROM public.library_categories WHERE slug='templates-presentation')),
  ('قالب CV أكاديمي بالإنجليزية', 'سيرة ذاتية للمتقدمين للمنح والتوظيف الأكاديمي', 'قالب نظيف بالإنجليزية يبرز: المؤهلات، النشر، المؤتمرات، الجوائز، خبرات التدريس.', 'template', 'https://docs.google.com/document/create', 'قوالب', ARRAY['cv','english','منح'], false, true, false, 4, 'فريق FekrahEdu', 'beginner', (SELECT id FROM public.library_categories WHERE slug='templates-cv')),
  -- منهجية
  ('دليل SPSS الشامل للباحثين', 'من إدخال البيانات حتى تفسير النتائج', 'دليل مرجعي مكوّن من 12 فصلاً: الإحصاء الوصفي، t-test، ANOVA، Correlation، Regression، Chi-Square، تحليل العاملي، الموثوقية. مع لقطات شاشة وأمثلة محلولة.', 'pdf', 'https://www.ibm.com/products/spss-statistics', 'منهجية', ARRAY['spss','إحصاء','دليل'], true, true, true, 1, 'د. سعد العتيبي', 'intermediate', (SELECT id FROM public.library_categories WHERE slug='method-quantitative')),
  ('التحليل النوعي باستخدام NVivo', 'الترميز، التصنيف، استخراج الأنماط', 'دليل عملي يشرح: استيراد المقابلات، الترميز المفتوح والمحوري، استخراج Themes، تصدير التقارير.', 'pdf', 'https://lumivero.com/products/nvivo/', 'منهجية', ARRAY['nvivo','نوعي','مقابلات'], true, true, true, 2, 'د. منى الزهراني', 'advanced', (SELECT id FROM public.library_categories WHERE slug='method-qualitative')),
  ('دليل التوثيق بأسلوب APA 7', 'القواعد الكاملة مع 50 مثالاً تطبيقياً', 'يغطي توثيق: الكتب، المقالات، المواقع، الفصول، الرسائل، المؤتمرات، المقابلات، الـ AI. محدّث 2024.', 'pdf', 'https://apastyle.apa.org/', 'منهجية', ARRAY['APA','توثيق','مراجع'], false, true, true, 3, 'فريق FekrahEdu', 'beginner', (SELECT id FROM public.library_categories WHERE slug='method-citation')),
  ('بناء الإطار النظري — دليل الباحث', 'كيف تكتب إطاراً متماسكاً ومتطوراً', 'مقال شامل يجيب: ما الفرق بين الإطار النظري والمفاهيمي؟ كيف ترتب المصادر؟ كيف تربط النظرية بالمشكلة؟ مع نموذجين مكتملين.', 'article', 'https://writingcenter.unc.edu/tips-and-tools/literature-reviews/', 'منهجية', ARRAY['إطار نظري','أدبيات','مراجعة'], false, true, false, 4, 'د. أحمد الشمري', 'intermediate', (SELECT id FROM public.library_categories WHERE slug='method-framework')),
  -- أدوات
  ('Google Scholar', 'محرك البحث العلمي الأشهر عالمياً', 'بوابتك الأولى للوصول للمقالات المحكمة، الكتب، والاقتباسات. يدعم تنبيهات بحثية واقتباس مباشر.', 'link', 'https://scholar.google.com', 'أدوات', ARRAY['بحث','مقالات'], false, true, true, 1, NULL, 'beginner', (SELECT id FROM public.library_categories WHERE slug='tools-search')),
  ('Connected Papers', 'استكشف الأبحاث المترابطة بصرياً', 'أدخل ورقة بحثية وستحصل على خريطة بصرية لأهم الأوراق المرتبطة بها — مثالي للمراجعة الأدبية.', 'link', 'https://www.connectedpapers.com', 'أدوات', ARRAY['visualization','بحث'], false, true, true, 2, NULL, 'intermediate', (SELECT id FROM public.library_categories WHERE slug='tools-search')),
  ('Zotero', 'مدير مراجع مجاني ومفتوح المصدر', 'يجمع بين سهولة الاستخدام ودعم آلاف الأنماط الاستشهادية. مزامنة سحابية مجانية.', 'link', 'https://www.zotero.org', 'أدوات', ARRAY['مراجع','zotero'], false, true, true, 3, NULL, 'beginner', (SELECT id FROM public.library_categories WHERE slug='tools-citation')),
  ('Grammarly', 'مدقق لغوي ذكي للإنجليزية', 'يكتشف الأخطاء النحوية والإملائية ويقترح تحسينات أسلوبية لكتاباتك الأكاديمية الإنجليزية.', 'link', 'https://www.grammarly.com', 'أدوات', ARRAY['english','تدقيق'], false, true, false, 4, NULL, 'beginner', (SELECT id FROM public.library_categories WHERE slug='tools-writing')),
  ('Elicit — باحث الذكاء الاصطناعي', 'اطرح سؤالاً بحثياً وستحصل على ملخصات موثقة', 'أداة AI تعرض لك أهم الدراسات حول سؤالك مع ملخصات وروابط للأوراق الأصلية. توفر ساعات من البحث.', 'link', 'https://elicit.com', 'أدوات', ARRAY['ai','بحث','elicit'], true, true, true, 5, NULL, 'intermediate', (SELECT id FROM public.library_categories WHERE slug='tools-ai'))
) AS v(title, description, long_description, resource_type, url, category, tags, is_premium, is_published, is_featured, sort_order, author, difficulty, subcategory_id)
WHERE NOT EXISTS (SELECT 1 FROM public.student_resources sr WHERE sr.title = v.title);

-- الفيديوهات
INSERT INTO public.student_resources (title, description, long_description, resource_type, url, category, tags, is_premium, is_published, is_featured, sort_order, author, difficulty, duration_minutes, subcategory_id, category_id)
SELECT v.title, v.description, v.long_description, v.resource_type, v.url, v.category, v.tags, v.is_premium, v.is_published, v.is_featured, v.sort_order, v.author, v.difficulty, v.duration_minutes, v.subcategory_id,
  (SELECT parent_id FROM public.library_categories WHERE id = v.subcategory_id)
FROM (VALUES
  ('سلسلة SPSS من الصفر للاحتراف', '15 درساً عملياً بالعربية', 'سلسلة شاملة تبدأ من تثبيت البرنامج وحتى التحليل المتقدم. كل درس يحتوي على ملف بيانات للتطبيق.', 'video', 'https://www.youtube.com/results?search_query=spss+arabic+tutorial', 'فيديوهات', ARRAY['spss','يوتيوب','شرح'], false, true, true, 1, 'قناة الإحصائي العربي', 'beginner', 320, (SELECT id FROM public.library_categories WHERE slug='videos-spss')),
  ('كتابة الرسائل العلمية بأسلوب احترافي', 'دورة مكثفة في 8 ساعات', 'كل ما تحتاجه عن: الصياغة الأكاديمية، تجنب الأخطاء الشائعة، صياغة الفرضيات، كتابة الملخص.', 'video', 'https://www.youtube.com/results?search_query=academic+writing+arabic', 'فيديوهات', ARRAY['كتابة','أكاديمي','رسائل'], true, true, true, 2, 'د. عمر الفهد', 'intermediate', 480, (SELECT id FROM public.library_categories WHERE slug='videos-writing')),
  ('شرح Mendeley لإدارة المراجع', 'من التحميل إلى الاستشهاد التلقائي في Word', 'فيديو عملي 25 دقيقة: تثبيت، استيراد المراجع، تنظيمها بالمجلدات، الاستشهاد المباشر في Word.', 'video', 'https://www.mendeley.com/', 'فيديوهات', ARRAY['mendeley','مراجع'], false, true, false, 3, 'قناة FekrahEdu', 'beginner', 25, (SELECT id FROM public.library_categories WHERE slug='videos-tools'))
) AS v(title, description, long_description, resource_type, url, category, tags, is_premium, is_published, is_featured, sort_order, author, difficulty, duration_minutes, subcategory_id)
WHERE NOT EXISTS (SELECT 1 FROM public.student_resources sr WHERE sr.title = v.title);
