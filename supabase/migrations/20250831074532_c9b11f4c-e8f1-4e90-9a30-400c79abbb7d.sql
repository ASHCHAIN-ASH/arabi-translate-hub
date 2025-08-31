-- إنشاء جدول أقسام الخدمات
CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول الخدمات
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  features_ar TEXT[],
  features_en TEXT[],
  base_price NUMERIC(10,2),
  price_per_unit NUMERIC(10,2),
  unit_type TEXT DEFAULT 'page', -- page, word, hour, project
  min_units INTEGER DEFAULT 1,
  max_units INTEGER,
  delivery_time_days INTEGER DEFAULT 7,
  rush_delivery_available BOOLEAN DEFAULT false,
  rush_delivery_multiplier NUMERIC(3,2) DEFAULT 1.5,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  show_to_clients BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- إدراج بيانات أقسام الخدمات المستخرجة من الموقع
INSERT INTO public.service_categories (name_ar, name_en, description_ar, description_en, icon, color, sort_order) VALUES
('خدمات الترجمة', 'Translation Services', 'ترجمة احترافية لجميع أنواع المستندات والمحتوى الأكاديمي والمهني بدقة عالية', 'Professional translation for all types of documents and academic content with high accuracy', 'Languages', '#3B82F6', 1),
('الخدمات الأكاديمية', 'Academic Services', 'خدمات أكاديمية متخصصة للطلاب والباحثين والمؤسسات التعليمية', 'Specialized academic services for students, researchers and educational institutions', 'GraduationCap', '#10B981', 2),
('الاستشارات التعليمية', 'Educational Consulting', 'استشارات أكاديمية متخصصة لطلاب الدراسات العليا والباحثين', 'Specialized academic consulting for graduate students and researchers', 'Users', '#F59E0B', 3),
('خدمات البحث', 'Research Services', 'خدمات البحث العلمي والنشر والتحليل الإحصائي', 'Scientific research, publishing and statistical analysis services', 'Search', '#8B5CF6', 4);

-- إدراج بيانات الخدمات المستخرجة من الموقع
INSERT INTO public.services (category_id, name_ar, name_en, description_ar, description_en, features_ar, features_en, image_url, sort_order) VALUES
-- خدمات الترجمة
((SELECT id FROM public.service_categories WHERE name_en = 'Translation Services'), 
 'ترجمة النصوص', 'Text Translation', 
 'ترجمة فورية وسريعة لجميع أنواع النصوص بدقة عالية ومراجعة احترافية', 
 'Fast and accurate translation for all types of texts with professional review',
 ARRAY['ترجمة فورية', 'مراجعة احترافية', 'أكثر من 100 لغة', 'دقة 99%'],
 ARRAY['Instant translation', 'Professional review', 'More than 100 languages', '99% accuracy'],
 '/assets/real-text-translation.jpg', 1),

((SELECT id FROM public.service_categories WHERE name_en = 'Translation Services'), 
 'ترجمة المستندات', 'Document Translation', 
 'ترجمة ملفات Word, PDF, PowerPoint مع الحفاظ على التنسيق الأصلي', 
 'Translation of Word, PDF, PowerPoint files while preserving original formatting',
 ARRAY['حفظ التنسيق', 'ملفات متعددة', 'تسليم سريع', 'سرية تامة'],
 ARRAY['Format preservation', 'Multiple files', 'Fast delivery', 'Complete confidentiality'],
 '/assets/real-document-translation.jpg', 2),

((SELECT id FROM public.service_categories WHERE name_en = 'Translation Services'), 
 'الترجمة الصوتية', 'Audio Translation', 
 'تحويل الكلام إلى نص وترجمته مباشرة مع دعم جميع اللهجات', 
 'Speech-to-text conversion and direct translation with support for all dialects',
 ARRAY['تحويل صوتي', 'ترجمة فورية', 'دعم اللهجات', 'جودة عالية'],
 ARRAY['Audio conversion', 'Instant translation', 'Dialect support', 'High quality'],
 '/assets/real-audio-translation.jpg', 3),

((SELECT id FROM public.service_categories WHERE name_en = 'Translation Services'), 
 'ترجمة المواقع', 'Website Translation', 
 'ترجمة مواقع الويب والصفحات الإلكترونية بالكامل مع الحفاظ على التصميم', 
 'Complete translation of websites and web pages while preserving design',
 ARRAY['ترجمة كاملة', 'حفظ التصميم', 'SEO محسن', 'تحديث مستمر'],
 ARRAY['Complete translation', 'Design preservation', 'SEO optimized', 'Continuous updates'],
 '/assets/real-website-translation.jpg', 4),

((SELECT id FROM public.service_categories WHERE name_en = 'Translation Services'), 
 'ترجمة الفيديو', 'Video Translation', 
 'إضافة ترجمة للفيديوهات والأفلام مع خدمات الدبلجة الاحترافية', 
 'Adding subtitles to videos and movies with professional dubbing services',
 ARRAY['ترجمة مرئية', 'دبلجة صوتية', 'توقيت دقيق', 'جودة HD'],
 ARRAY['Visual subtitles', 'Audio dubbing', 'Precise timing', 'HD quality'],
 '/assets/real-video-translation.jpg', 5),

((SELECT id FROM public.service_categories WHERE name_en = 'Translation Services'), 
 'خدمات مخصصة', 'Custom Services', 
 'حلول ترجمة مخصصة للشركات والمؤسسات بأسعار تنافسية', 
 'Custom translation solutions for companies and institutions at competitive prices',
 ARRAY['حلول مخصصة', 'دعم 24/7', 'فريق مختص', 'أسعار مرنة'],
 ARRAY['Custom solutions', '24/7 support', 'Specialized team', 'Flexible pricing'],
 '/assets/real-business-services.jpg', 6),

-- الخدمات الأكاديمية
((SELECT id FROM public.service_categories WHERE name_en = 'Academic Services'), 
 'الكتابة الأكاديمية', 'Academic Writing', 
 'كتابة الأبحاث والرسائل والمقالات الأكاديمية بمعايير عالمية', 
 'Writing research papers, theses and academic articles with international standards',
 ARRAY['معايير عالمية', 'مراجعة أكاديمية', 'أصالة 100%', 'دعم مستمر'],
 ARRAY['International standards', 'Academic review', '100% originality', 'Continuous support'],
 NULL, 1),

((SELECT id FROM public.service_categories WHERE name_en = 'Academic Services'), 
 'التحرير والمراجعة', 'Editing and Proofreading', 
 'تحرير ومراجعة النصوص الأكاديمية والمهنية لضمان الجودة والوضوح', 
 'Editing and proofreading academic and professional texts to ensure quality and clarity',
 ARRAY['مراجعة شاملة', 'تحسين الوضوح', 'ضمان الجودة', 'تسليم سريع'],
 ARRAY['Comprehensive review', 'Clarity improvement', 'Quality assurance', 'Fast delivery'],
 NULL, 2),

-- خدمات البحث
((SELECT id FROM public.service_categories WHERE name_en = 'Research Services'), 
 'التحليل الإحصائي', 'Statistical Analysis', 
 'تحليل البيانات الإحصائية وإعداد التقارير العلمية والبحثية', 
 'Statistical data analysis and preparation of scientific and research reports',
 ARRAY['تحليل متقدم', 'تقارير مفصلة', 'برامج احترافية', 'استشارة مجانية'],
 ARRAY['Advanced analysis', 'Detailed reports', 'Professional software', 'Free consultation'],
 NULL, 1),

((SELECT id FROM public.service_categories WHERE name_en = 'Research Services'), 
 'خدمات النشر', 'Publishing Services', 
 'مساعدة في نشر الأبحاث في المجلات العلمية المحكمة', 
 'Assistance in publishing research in peer-reviewed scientific journals',
 ARRAY['مجلات محكمة', 'اختيار المجلة', 'مراجعة الأقران', 'متابعة النشر'],
 ARRAY['Peer-reviewed journals', 'Journal selection', 'Peer review', 'Publication follow-up'],
 NULL, 2);

-- إنشاء RLS policies
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- سياسات أقسام الخدمات
CREATE POLICY "الجميع يمكنهم مشاهدة أقسام الخدمات النشطة" ON public.service_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "المديرون يمكنهم إدارة أقسام الخدمات" ON public.service_categories
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- سياسات الخدمات
CREATE POLICY "الجميع يمكنهم مشاهدة الخدمات النشطة" ON public.services
  FOR SELECT USING (is_active = true AND show_to_clients = true);

CREATE POLICY "المديرون يمكنهم إدارة جميع الخدمات" ON public.services
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));