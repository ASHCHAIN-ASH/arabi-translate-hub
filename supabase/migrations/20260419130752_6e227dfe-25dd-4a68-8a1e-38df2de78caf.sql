-- Cascade delete all dependent data, then services + categories
DELETE FROM public.order_attachments WHERE service_order_id IN (SELECT id FROM public.service_orders);
DELETE FROM public.deadline_reminders;
DELETE FROM public.contract_signatures;
DELETE FROM public.contract_otp_codes;
DELETE FROM public.contract_timeline;
DELETE FROM public.contracts;
DELETE FROM public.invoice_items;
DELETE FROM public.invoice_payments;
DELETE FROM public.invoice_timeline;
DELETE FROM public.invoices;
DELETE FROM public.group_order_members;
DELETE FROM public.group_order_audit;
DELETE FROM public.group_orders;
DELETE FROM public.service_order_messages;
DELETE FROM public.service_order_admin_notes;
DELETE FROM public.service_order_timeline;
DELETE FROM public.service_orders;
DELETE FROM public.services;
DELETE FROM public.service_categories;

-- Insert 4 main categories matching homepage
INSERT INTO public.service_categories (id, name, name_ar, slug, icon, color, is_active, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Academic Translation', 'الترجمة الأكاديمية', 'translation', 'Languages', '#2563eb', true, 1),
  ('11111111-1111-1111-1111-111111111102', 'Research Services', 'خدمات البحث العلمي', 'research', 'Brain', '#9333ea', true, 2),
  ('11111111-1111-1111-1111-111111111103', 'Editing & Proofreading', 'المراجعة والتدقيق', 'editing', 'CheckCircle', '#059669', true, 3),
  ('11111111-1111-1111-1111-111111111104', 'Academic Publishing', 'النشر الأكاديمي', 'publishing', 'Target', '#d97706', true, 4);

-- Insert services under each category
-- 1) Translation (9)
INSERT INTO public.services (name, name_ar, slug, description_ar, category_id, price, is_active, is_featured, sort_order) VALUES
  ('Document Translation', 'ترجمة المستندات', 'document-translation', 'ترجمة احترافية لجميع أنواع المستندات الرسمية والتجارية', '11111111-1111-1111-1111-111111111101', 50, true, true, 1),
  ('Text Translation', 'ترجمة النصوص', 'text-translation', 'ترجمة نصوص عامة ومتخصصة بدقة عالية', '11111111-1111-1111-1111-111111111101', 30, true, false, 2),
  ('Website Translation', 'ترجمة المواقع الإلكترونية', 'website-translation', 'حلول ترجمة شاملة للمواقع الإلكترونية والمحتوى الرقمي', '11111111-1111-1111-1111-111111111101', 200, true, false, 3),
  ('Video Translation', 'ترجمة الفيديوهات', 'video-translation', 'ترجمة وتعليق صوتي للفيديوهات والمحتوى المرئي', '11111111-1111-1111-1111-111111111101', 150, true, false, 4),
  ('Audio Translation', 'الترجمة الصوتية', 'audio-translation', 'ترجمة المحتوى الصوتي والبودكاست والمقابلات', '11111111-1111-1111-1111-111111111101', 120, true, false, 5),
  ('Legal Translation', 'الترجمة القانونية', 'legal-translation', 'ترجمة متخصصة للوثائق القانونية والعقود', '11111111-1111-1111-1111-111111111101', 100, true, true, 6),
  ('Medical Translation', 'الترجمة الطبية', 'medical-translation', 'ترجمة التقارير الطبية والأبحاث العلمية', '11111111-1111-1111-1111-111111111101', 100, true, false, 7),
  ('Technical Translation', 'الترجمة التقنية', 'technical-translation', 'ترجمة المحتوى التقني والدليل الفني', '11111111-1111-1111-1111-111111111101', 90, true, false, 8),
  ('Academic Translation', 'الترجمة الأكاديمية', 'academic-translation', 'ترجمة الأبحاث الأكاديمية والرسائل العلمية', '11111111-1111-1111-1111-111111111101', 80, true, true, 9);

-- 2) Research (8)
INSERT INTO public.services (name, name_ar, slug, description_ar, category_id, price, is_active, is_featured, sort_order) VALUES
  ('Academic Research Assistance', 'المساعدة الأكاديمية في إعداد الأبحاث', 'research-assistance', 'دعم بحثي شامل وإرشاد علمي للماجستير والدكتوراه', '11111111-1111-1111-1111-111111111102', 500, true, true, 1),
  ('Linguistic Review', 'التدقيق اللغوي والمراجعة', 'linguistic-review', 'تدقيق لغوي ومراجعة أكاديمية احترافية لأبحاثك', '11111111-1111-1111-1111-111111111102', 100, true, false, 2),
  ('SPSS Statistical Analysis', 'التحليل الإحصائي و SPSS', 'spss-analysis', 'تحليل إحصائي متقدم باستخدام SPSS والبرامج الإحصائية', '11111111-1111-1111-1111-111111111102', 300, true, true, 3),
  ('Research Proposal', 'إعداد خطط البحث (Proposal)', 'research-proposal', 'إعداد احترافي لخطط البحث والمقترحات البحثية', '11111111-1111-1111-1111-111111111102', 400, true, false, 4),
  ('Academic PowerPoint', 'إعداد عروض PowerPoint أكاديمية', 'academic-powerpoint', 'تصميم عروض تقديمية احترافية للأبحاث والمناقشات', '11111111-1111-1111-1111-111111111102', 150, true, false, 5),
  ('Pre-Publication Review', 'مراجعات أكاديمية للأوراق قبل النشر', 'pre-publication-review', 'مراجعة شاملة لأوراقك البحثية قبل تقديمها للنشر', '11111111-1111-1111-1111-111111111102', 250, true, false, 6),
  ('Academic Consultation', 'الاستشارات الأكاديمية', 'academic-consultation', 'استشارات أكاديمية متخصصة في جميع مراحل البحث', '11111111-1111-1111-1111-111111111102', 200, true, false, 7),
  ('Other Student Services', 'خدمات الطلاب الأخرى', 'other-student-services', 'مجموعة متنوعة من الخدمات الأكاديمية الداعمة للطلاب', '11111111-1111-1111-1111-111111111102', 100, true, false, 8);

-- 3) Editing (6)
INSERT INTO public.services (name, name_ar, slug, description_ar, category_id, price, is_active, is_featured, sort_order) VALUES
  ('Language Proofreading', 'التدقيق اللغوي', 'language-proofreading', 'تدقيق لغوي احترافي شامل', '11111111-1111-1111-1111-111111111103', 80, true, true, 1),
  ('Academic Review', 'المراجعة الأكاديمية', 'academic-review', 'مراجعة أكاديمية متخصصة للأبحاث', '11111111-1111-1111-1111-111111111103', 120, true, false, 2),
  ('Developmental Editing', 'التحرير التنموي', 'developmental-editing', 'تحرير تطويري شامل للنصوص والأبحاث', '11111111-1111-1111-1111-111111111103', 150, true, false, 3),
  ('Technical Editing', 'التحرير التقني', 'technical-editing', 'تحرير تقني متخصص للمحتوى الفني', '11111111-1111-1111-1111-111111111103', 130, true, false, 4),
  ('Style Review', 'مراجعة الأسلوب', 'style-review', 'مراجعة وتحسين الأسلوب الكتابي', '11111111-1111-1111-1111-111111111103', 100, true, false, 5),
  ('Final Proofreading', 'التدقيق النهائي', 'final-proofreading', 'تدقيق نهائي قبل التسليم النهائي', '11111111-1111-1111-1111-111111111103', 90, true, false, 6);

-- 4) Publishing (3)
INSERT INTO public.services (name, name_ar, slug, description_ar, category_id, price, is_active, is_featured, sort_order) VALUES
  ('Journal Publication', 'النشر في المجلات المحكمة', 'journal-publication', 'مساعدة في نشر الأبحاث في المجلات العلمية المحكمة', '11111111-1111-1111-1111-111111111104', 800, true, true, 1),
  ('Annotated Publishing', 'النشر مع المراجعة المشروحة', 'annotated-publishing', 'نشر علمي مع تعليقات ومراجعات تفصيلية', '11111111-1111-1111-1111-111111111104', 600, true, false, 2),
  ('Global Peer Review', 'مراجعة الأقران العالمية', 'global-peer-review', 'مراجعة دولية من قبل خبراء عالميين', '11111111-1111-1111-1111-111111111104', 500, true, false, 3);