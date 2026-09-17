UPDATE public.whatsapp_templates
SET body_text = E'🔐 *رمز الدخول الخاص بك*\n━━━━━━━━━━━━━━━\nأهلاً بك في *فكرة إيدو* — منصتك الأكاديمية الموثوقة.\n\nاستخدم الرمز التالي لإتمام تسجيل الدخول:\n\n✨ *{{code}}* ✨\n\n⏱️ صالح لمدة *10 دقائق* فقط.\n🛡️ لا تُشارك هذا الرمز مع أي شخص — حتى موظفي الدعم لن يطلبوه منك.\n\nإن لم تكن صاحب الطلب، تجاهل هذه الرسالة فوراً وأبلغنا عبر الدعم.\n\n— فريق الأمان | FekrahEdu',
    updated_at = now()
WHERE event_key = 'otp_login';

INSERT INTO public.whatsapp_templates (event_key, title, body_text, variables, is_active)
VALUES (
  'welcome_new_user',
  'ترحيب بمستخدم جديد',
  E'🎉 *مرحباً بك في فكرة إيدو*\n━━━━━━━━━━━━━━━\nأهلاً {{name}} 👋\n\nيسعدنا انضمامك إلى منصتنا الأكاديمية الأولى للترجمة والنشر العلمي والخدمات البحثية.\n\n✨ *ما يميّزنا لك:*\n• 🎓 خدمات ترجمة وتدقيق أكاديمي احترافية\n• 📚 نشر علمي في مجلات محكّمة\n• 📝 إعداد السيرة الذاتية الأكاديمية\n• 🏆 برنامج إحالات ومكافآت يكافئ ولاءك\n\n🎁 *هدية الترحيب:* استكشف لوحة التحكم لتفعيل مزاياك.\n\nأي استفسار؟ فريق الدعم بانتظارك في أي وقت.\n\n— مع تحيات فريق *FekrahEdu* 💙',
  '["name"]'::jsonb,
  true
)
ON CONFLICT (event_key) DO UPDATE SET body_text = EXCLUDED.body_text, title = EXCLUDED.title, variables = EXCLUDED.variables, updated_at = now();

INSERT INTO public.whatsapp_templates (event_key, title, body_text, variables, is_active)
VALUES (
  'welcome_returning_user',
  'ترحيب بعودة المستخدم',
  E'👋 *مرحباً بعودتك*\n━━━━━━━━━━━━━━━\nأهلاً مجدداً {{name}} 🌟\n\nسعداء برؤيتك من جديد في *فكرة إيدو*.\n\n📊 لوحتك جاهزة بآخر تحديثات طلباتك ونقاطك ومكافآتك.\n💡 *تلميح:* تابع تحدي اليوم لكسب نقاط XP إضافية.\n\nنتمنى لك تجربة أكاديمية موفّقة. 💙\n\n— فريق *FekrahEdu*',
  '["name"]'::jsonb,
  true
)
ON CONFLICT (event_key) DO UPDATE SET body_text = EXCLUDED.body_text, title = EXCLUDED.title, variables = EXCLUDED.variables, updated_at = now();