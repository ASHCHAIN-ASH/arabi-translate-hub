
INSERT INTO public.whatsapp_templates (event_key, title, body_text, variables, is_active) VALUES
('wallet_topup_requested','طلب شحن محفظة مستلم',
'💰 *تم استلام طلب شحن محفظتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

استلمنا طلب شحن محفظتك الأكاديمية وهو الآن قيد المراجعة المالية.

🔖 *رقم الطلب:* #{{request_no}}
💵 *المبلغ:* {{amount}} ر.س
💳 *طريقة الدفع:* {{method}}
⏱️ *مدة المراجعة:* خلال 24 ساعة عمل

سنشعرك فور اعتماد الرصيد وإضافته لمحفظتك.

— الإدارة المالية | FekrahEdu',
'["name","request_no","amount","method"]'::jsonb,true),

('wallet_topup_approved','اعتماد شحن المحفظة',
'✅ *تم اعتماد شحن محفظتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

تمت إضافة الرصيد إلى محفظتك الأكاديمية بنجاح.

🧾 *رقم الإيصال:* {{receipt_no}}
💵 *المبلغ المُودَع:* {{amount}} ر.س
🎁 *مكافأة إضافية:* {{bonus}} ر.س
🏦 *رصيدك الحالي:* {{balance}} ر.س
📅 *التاريخ:* {{date}}

يمكنك الآن استخدام رصيدك في سداد فواتير خدماتك الأكاديمية مباشرة.
🔗 {{link}}

— الإدارة المالية | FekrahEdu',
'["name","receipt_no","amount","bonus","balance","date","link"]'::jsonb,true),

('wallet_topup_rejected','رفض شحن المحفظة',
'❌ *تعذّر اعتماد طلب شحن محفظتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

راجعنا طلب الشحن ولم نتمكن من اعتماده حالياً.

🔖 *رقم الطلب:* #{{request_no}}
💵 *المبلغ:* {{amount}} ر.س
📝 *السبب:* {{reason}}

يسعد فريق الدعم المالي مساعدتك لإتمام العملية.

— الإدارة المالية | FekrahEdu',
'["name","request_no","amount","reason"]'::jsonb,true),

('wallet_credited','إيداع في المحفظة',
'💎 *إيداع جديد في محفظتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

تمت إضافة مبلغ إلى محفظتك الأكاديمية.

➕ *المبلغ المضاف:* {{amount}} ر.س
📌 *السبب:* {{reason}}
🏦 *الرصيد بعد العملية:* {{balance}} ر.س
📅 *التاريخ:* {{date}}

🔗 عرض المحفظة: {{link}}

— الإدارة المالية | FekrahEdu',
'["name","amount","reason","balance","date","link"]'::jsonb,true),

('wallet_debited','خصم من المحفظة',
'📉 *عملية خصم من محفظتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

تم خصم مبلغ من رصيد محفظتك الأكاديمية.

➖ *المبلغ المخصوم:* {{amount}} ر.س
📌 *البيان:* {{reason}}
🏦 *الرصيد المتبقي:* {{balance}} ر.س
📅 *التاريخ:* {{date}}

إذا لم تتعرّف على هذه العملية تواصل معنا فوراً.

— الإدارة المالية | FekrahEdu',
'["name","amount","reason","balance","date"]'::jsonb,true),

('wallet_payment_made','سداد فاتورة من المحفظة',
'🏦 *تم السداد من محفظتك بنجاح*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

استُخدم رصيد محفظتك لسداد فاتورتك الأكاديمية.

🔖 *رقم الفاتورة:* {{invoice_no}}
💵 *المبلغ المسدد:* {{amount}} ر.س
🏦 *رصيد المحفظة بعد السداد:* {{balance}} ر.س
📅 *التاريخ:* {{date}}

🔗 تحميل الإيصال: {{link}}

— الإدارة المالية | FekrahEdu',
'["name","invoice_no","amount","balance","date","link"]'::jsonb,true),

('wallet_refund','استرداد إلى المحفظة',
'↩️ *تم استرداد مبلغ إلى محفظتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

أعدنا المبلغ التالي إلى محفظتك الأكاديمية.

💵 *مبلغ الاسترداد:* {{amount}} ر.س
📌 *السبب:* {{reason}}
🏦 *رصيدك الحالي:* {{balance}} ر.س
📅 *التاريخ:* {{date}}

— الإدارة المالية | FekrahEdu',
'["name","amount","reason","balance","date"]'::jsonb,true),

('wallet_low_balance','تنبيه رصيد منخفض',
'⚠️ *تنبيه: رصيد محفظتك منخفض*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

رصيد محفظتك الحالي *{{balance}} ر.س* وقد لا يكفي لسداد خدماتك القادمة.

💡 اشحن محفظتك الآن لتستمر خدماتك الأكاديمية دون توقف.
🔗 {{link}}

— الإدارة المالية | FekrahEdu',
'["name","balance","link"]'::jsonb,true),

('membership_subscribed','استلام طلب عضوية',
'🎓 *تم استلام طلب عضويتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

استلمنا طلب انضمامك لبرنامج العضويات الأكاديمية.

🏅 *الباقة:* {{plan}}
💵 *القيمة:* {{price}} ر.س
🎯 *الخصم على الخدمات:* {{discount}}
💰 *الاسترداد النقدي:* {{cashback}}

سيتواصل معك فريق العضويات لاستكمال التفعيل.

— إدارة العضويات | FekrahEdu',
'["name","plan","price","discount","cashback"]'::jsonb,true),

('membership_activated','تفعيل العضوية',
'🏅 *تم تفعيل عضويتك الأكاديمية*
━━━━━━━━━━━━━━━
مبروك {{name}} 🎉

أصبحت عضويتك فعّالة وجاهزة للاستخدام.

🏅 *الباقة:* {{plan}}
📅 *تاريخ البدء:* {{start_date}}
⏳ *تاريخ الانتهاء:* {{end_date}}
🎯 *خصمك الدائم:* {{discount}}
💰 *الاسترداد لمحفظتك:* {{cashback}}

🔗 لوحة العضوية: {{link}}

— إدارة العضويات | FekrahEdu',
'["name","plan","start_date","end_date","discount","cashback","link"]'::jsonb,true),

('membership_renewed','تجديد العضوية',
'🔄 *تم تجديد عضويتك بنجاح*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

جُدّدت عضويتك الأكاديمية وتستمر مزاياك دون انقطاع.

🏅 *الباقة:* {{plan}}
⏳ *صالحة حتى:* {{end_date}}
💵 *قيمة التجديد:* {{price}} ر.س

— إدارة العضويات | FekrahEdu',
'["name","plan","end_date","price"]'::jsonb,true),

('membership_upgraded','ترقية العضوية',
'⬆️ *تمت ترقية عضويتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

انتقلت عضويتك إلى مستوى أعلى بمزايا أوسع.

🏅 *من:* {{old_plan}}
🏆 *إلى:* {{plan}}
🎯 *خصمك الجديد:* {{discount}}
⏳ *صالحة حتى:* {{end_date}}

— إدارة العضويات | FekrahEdu',
'["name","old_plan","plan","discount","end_date"]'::jsonb,true),

('membership_expiring','قرب انتهاء العضوية',
'⏳ *عضويتك تقترب من الانتهاء*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

تنتهي عضويتك *{{plan}}* بتاريخ *{{end_date}}* (خلال {{days_left}} يوم).

🔄 جدّد الآن للحفاظ على خصوماتك واستردادك النقدي.
🔗 {{link}}

— إدارة العضويات | FekrahEdu',
'["name","plan","end_date","days_left","link"]'::jsonb,true),

('membership_expired','انتهاء العضوية',
'📅 *انتهت صلاحية عضويتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

انتهت عضويتك *{{plan}}* بتاريخ *{{end_date}}*، ويمكنك استعادة كامل مزاياك بالتجديد في أي وقت.

🔗 تجديد العضوية: {{link}}

— إدارة العضويات | FekrahEdu',
'["name","plan","end_date","link"]'::jsonb,true),

('membership_cashback','استرداد نقدي للعضوية',
'💰 *استرداد نقدي أُضيف لمحفظتك*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

بفضل عضويتك *{{plan}}* أضفنا استرداداً نقدياً إلى محفظتك.

➕ *قيمة الاسترداد:* {{amount}} ر.س
🧾 *عن الطلب:* {{order_no}}
🏦 *رصيد المحفظة:* {{balance}} ر.س

— إدارة العضويات | FekrahEdu',
'["name","plan","amount","order_no","balance"]'::jsonb,true),

('account_verified','تأكيد الحساب',
'✅ *تم تفعيل حسابك الأكاديمي*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

تم تأكيد بريدك وتفعيل حسابك في منصة FekrahEdu.

🎓 يمكنك الآن طلب الخدمات الأكاديمية ومتابعة طلباتك وفواتيرك ومحفظتك من لوحة التحكم.
🔗 {{link}}

— فريق FekrahEdu 💙',
'["name","link"]'::jsonb,true),

('installment_due','تذكير قسط مستحق',
'📆 *تذكير بقسط مستحق*
━━━━━━━━━━━━━━━
مرحباً {{name}} 👋

يستحق القسط التالي من خطة السداد الخاصة بك.

🔢 *القسط رقم:* {{installment_no}}
💵 *المبلغ:* {{amount}} ر.س
⏳ *تاريخ الاستحقاق:* {{due_date}}

💳 يمكنك السداد من رصيد محفظتك مباشرة.
🔗 {{link}}

— الإدارة المالية | FekrahEdu',
'["name","installment_no","amount","due_date","link"]'::jsonb,true)

ON CONFLICT (event_key) DO UPDATE
SET title = EXCLUDED.title,
    body_text = EXCLUDED.body_text,
    variables = EXCLUDED.variables,
    is_active = true,
    updated_at = now();

UPDATE public.whatsapp_settings
SET events_enabled = COALESCE(events_enabled, '{}'::jsonb) || jsonb_build_object(
  'wallet_topup_requested', true,
  'wallet_topup_approved', true,
  'wallet_topup_rejected', true,
  'wallet_credited', true,
  'wallet_debited', true,
  'wallet_payment_made', true,
  'wallet_refund', true,
  'wallet_low_balance', true,
  'membership_subscribed', true,
  'membership_activated', true,
  'membership_renewed', true,
  'membership_upgraded', true,
  'membership_expiring', true,
  'membership_expired', true,
  'membership_cashback', true,
  'account_verified', true,
  'installment_due', true
),
updated_at = now()
WHERE id = 1;
