-- إضافة بعض البيانات التجريبية للاختبار
INSERT INTO public.orders (
  tracking_id, 
  phone_last_four, 
  title, 
  degree, 
  service_type, 
  description, 
  current_status, 
  estimated_delivery, 
  client_name, 
  client_phone, 
  client_email
) VALUES 
(
  'TR20250001',
  '4567',
  'تأثير التكنولوجيا على التعليم في المملكة العربية السعودية',
  'ماجستير إدارة الأعمال',
  'research-thesis',
  'دراسة تحليلية شاملة لتأثير التكنولوجيا على منظومة التعليم الحديث',
  'data_collection',
  CURRENT_DATE + INTERVAL '45 days',
  'أحمد محمد العلي',
  '0501234567',
  'ahmed@example.com'
),
(
  'TR20250002',
  '6543',
  'الذكاء الاصطناعي في الرعاية الصحية',
  'دكتوراه علوم الحاسوب',
  'research-plan',
  'خطة بحثية مفصلة لدراسة تطبيقات الذكاء الاصطناعي في المجال الطبي',
  'research_plan',
  CURRENT_DATE + INTERVAL '60 days',
  'د. فاطمة علي',
  '0509876543',
  'fatima@example.com'
),
(
  'TR20250003',
  '1234',
  'استراتيجيات التسويق الرقمي للشركات الناشئة',
  'ماجستير التسويق',
  'research-thesis',
  'دراسة تحليلية لاستراتيجيات التسويق الرقمي وتأثيرها على نمو الشركات الناشئة',
  'received',
  CURRENT_DATE + INTERVAL '30 days',
  'سارة أحمد',
  '0551234567',
  'sara@example.com'
)
ON CONFLICT (tracking_id) DO NOTHING;

-- إضافة timeline للطلبات التجريبية
INSERT INTO public.order_timeline (
  order_id,
  title,
  description,
  status,
  completed_date,
  actor_type,
  actor_name
) VALUES 
(
  (SELECT id FROM public.orders WHERE tracking_id = 'TR20250001'),
  'استلام الطلب',
  'تم استلام طلبكم بنجاح وسيتم البدء في المراجعة',
  'received',
  CURRENT_DATE - INTERVAL '10 days',
  'system',
  'النظام الآلي'
),
(
  (SELECT id FROM public.orders WHERE tracking_id = 'TR20250001'),
  'بدء جمع البيانات',
  'بدأ فريق البحث في جمع وتحليل البيانات المطلوبة',
  'data_collection',
  CURRENT_DATE - INTERVAL '5 days',
  'specialist',
  'د. سارة أحمد'
),
(
  (SELECT id FROM public.orders WHERE tracking_id = 'TR20250002'),
  'استلام الطلب',
  'تم استلام طلبكم بنجاح',
  'received',
  CURRENT_DATE - INTERVAL '7 days',
  'system',
  'النظام الآلي'
),
(
  (SELECT id FROM public.orders WHERE tracking_id = 'TR20250002'),
  'إعداد خطة البحث',
  'جاري إعداد خطة البحث التفصيلية للمشروع',
  'research_plan',
  CURRENT_DATE - INTERVAL '2 days',
  'specialist',
  'د. محمد حسن'
);