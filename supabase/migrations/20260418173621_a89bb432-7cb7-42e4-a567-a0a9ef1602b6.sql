INSERT INTO public.track_tools
  (track_id, slug, name_ar, name_en, description_ar, icon, price, free_daily_quota, is_premium, is_active, sort_order, action_link)
SELECT t.id, x.slug, x.name_ar, x.name_en, x.desc_ar, x.icon, x.price, x.quota, x.premium, true, x.sort,
  '/student/tracks/' || t.slug || '/tools/' || x.slug
FROM public.tracks t
JOIN (VALUES
  ('business','swot-analysis','تحليل SWOT','SWOT Analysis','تحليل استراتيجي شامل لنقاط القوة والضعف والفرص والتهديدات','Target',2.00,2,false,1),
  ('business','business-plan','خطة عمل','Business Plan','إنشاء خطة عمل احترافية كاملة لأي مشروع أو فكرة','Briefcase',5.00,1,true,2),
  ('business','financial-analysis','تحليل مالي','Financial Analysis','تحليل البيانات والمؤشرات المالية وتقديم توصيات','TrendingUp',4.00,1,false,3),
  ('business','marketing-strategy','استراتيجية تسويق','Marketing Strategy','بناء استراتيجية تسويقية متكاملة لمشروعك','Megaphone',3.00,1,false,4),
  ('law','contract-analyzer','تحليل العقود','Contract Analyzer','مراجعة العقود واكتشاف البنود الخطرة والإجحاف','FileSearch',5.00,1,true,1),
  ('law','legal-drafting','صياغة قانونية','Legal Drafting','صياغة الوثائق والمسودات القانونية باحترافية','PenLine',3.00,1,false,2),
  ('law','legal-research','بحث قانوني','Legal Research','بحث متعمّق في المسائل القانونية والسوابق','Scale',4.00,1,false,3),
  ('law','law-explainer','شرح القوانين','Law Explainer','شرح القوانين والمواد بأسلوب مبسّط ومفهوم','BookOpen',1.00,3,false,4),
  ('languages','pro-translator','مترجم احترافي','Pro Translator','ترجمة دقيقة عالية الجودة بين أي لغات','Languages',2.00,3,false,1),
  ('languages','grammar-checker','مدقق لغوي','Grammar Checker','تدقيق نحوي وإملائي وأسلوبي شامل','SpellCheck',1.00,5,false,2),
  ('languages','essay-writer','كاتب المقالات','Essay Writer','كتابة مقالات احترافية بأي أسلوب وموضوع','PenTool',3.00,2,false,3),
  ('languages','vocab-builder','بناء المفردات','Vocab Builder','بطاقات تعلم احترافية لإتقان كلمات جديدة','BookMarked',1.00,5,false,4),
  ('design','color-palette','لوحة الألوان','Color Palette','اقتراح لوحات ألوان احترافية لأي مشروع','Palette',1.00,3,false,1),
  ('design','design-brief','ملخّص تصميمي','Design Brief','كتابة Design Brief احترافي لأي مشروع','ClipboardList',2.00,2,false,2),
  ('design','ux-feedback','مراجعة UX/UI','UX/UI Feedback','تحليل وتقييم تجربة المستخدم والواجهات','Smartphone',3.00,2,false,3),
  ('design','logo-concepts','مفاهيم شعارات','Logo Concepts','اقتراح مفاهيم إبداعية للشعارات والهويات','Shapes',2.00,2,false,4),
  ('marketing','ad-copy','نسخ إعلانية','Ad Copy','كتابة نسخ إعلانية جذابة لكل المنصات','Megaphone',2.00,3,false,1),
  ('marketing','social-media-plan','خطة سوشيال ميديا','Social Media Plan','خطة محتوى أسبوعية كاملة للسوشيال ميديا','CalendarDays',3.00,2,false,2),
  ('marketing','seo-optimizer','محسّن SEO','SEO Optimizer','تحليل وتحسين المحتوى لمحركات البحث','Search',3.00,1,false,3),
  ('marketing','email-campaign','حملة بريدية','Email Campaign','تصميم حملة بريد إلكتروني متكاملة (3 رسائل)','Mail',3.00,2,false,4),
  ('general','smart-summarizer','مُلخّص ذكي','Smart Summarizer','تلخيص أي نص مهما كان طويلاً بذكاء','FileText',1.00,5,false,1),
  ('general','idea-generator','مولّد الأفكار','Idea Generator','عصف ذهني وتوليد 10 أفكار مبتكرة لأي موضوع','Lightbulb',1.00,5,false,2),
  ('general','study-planner','مخطط الدراسة','Study Planner','خطة دراسية مُخصّصة وذكية لأي هدف','GraduationCap',1.00,3,false,3),
  ('general','presentation-outliner','هيكل العروض','Presentation Outliner','تصميم هيكل عرض تقديمي احترافي شريحة بشريحة','Presentation',2.00,2,false,4)
) AS x(track_slug, slug, name_ar, name_en, desc_ar, icon, price, quota, premium, sort)
  ON x.track_slug = t.slug
ON CONFLICT (track_id, slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  description_ar = EXCLUDED.description_ar,
  icon = EXCLUDED.icon,
  price = EXCLUDED.price,
  free_daily_quota = EXCLUDED.free_daily_quota,
  is_premium = EXCLUDED.is_premium,
  sort_order = EXCLUDED.sort_order,
  action_link = EXCLUDED.action_link,
  is_active = true;