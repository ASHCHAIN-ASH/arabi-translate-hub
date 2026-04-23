-- Remove all old marketing assets
DELETE FROM public.marketing_assets;

-- Insert new premium ad banners (each banner is a real ad with text + icons baked in)
INSERT INTO public.marketing_assets (title, image_url, platform, service_type, caption_template, is_active) VALUES

-- Instagram
('إعلان: ترجمة أكاديمية احترافية',
 'https://kziujhdqogqeehtxgpax.supabase.co/storage/v1/object/public/marketing-assets/ad-translation-instagram.jpg',
 'instagram', 'translation',
 E'🔥 ترجمة أكاديمية احترافية بأيدي خبراء\n💯 جودة مضمونة وتسليم خلال 24 ساعة\n🎁 خصم 20% لفترة محدودة\n\n👉 اطلب الآن: {ref_link}\n\n#ترجمة #ترجمة_أكاديمية #طلاب #أبحاث #ماجستير #دكتوراه',
 true),

('إعلان: خدمات بحثية متكاملة',
 'https://kziujhdqogqeehtxgpax.supabase.co/storage/v1/object/public/marketing-assets/ad-research-instagram.jpg',
 'instagram', 'research',
 E'📚 خدمات بحثية متكاملة لطلاب الدراسات العليا\n✨ ماجستير • دكتوراه • نشر علمي\n🎁 أول استشارة مجانية\n\n👉 ابدأ بحثك الآن: {ref_link}\n\n#بحث_علمي #دراسات_عليا #ماجستير #دكتوراه',
 true),

-- Story
('قصة: تدقيق لغوي احترافي',
 'https://kziujhdqogqeehtxgpax.supabase.co/storage/v1/object/public/marketing-assets/ad-proofreading-story.jpg',
 'story', 'proofreading',
 E'✍️ تدقيق لغوي احترافي\n📝 اجعل بحثك خالياً من الأخطاء\n🎁 خصم 30% لفترة محدودة\n\n👉 اطلب الخدمة: {ref_link}',
 true),

('قصة: رسائل الماجستير والدكتوراه',
 'https://kziujhdqogqeehtxgpax.supabase.co/storage/v1/object/public/marketing-assets/ad-thesis-story.jpg',
 'story', 'thesis',
 E'🎓 رسائل الماجستير والدكتوراه\n👨‍🏫 بإشراف خبراء أكاديميين\n📚 كتابة • تحليل • مناقشة\n\n👉 احجز استشارتك: {ref_link}',
 true),

-- Twitter / X
('إعلان X: سيرة ذاتية أكاديمية',
 'https://kziujhdqogqeehtxgpax.supabase.co/storage/v1/object/public/marketing-assets/ad-cv-twitter.jpg',
 'twitter', 'cv',
 E'📄 سيرة ذاتية أكاديمية تفتح أبواب القبول والوظائف\n✅ قوالب معتمدة • تنسيق احترافي • مراجعة مجانية\n⏰ عرض محدود\n\n👉 احصل عليها الآن: {ref_link}',
 true),

('تغريدة: ترجمة سريعة',
 'https://kziujhdqogqeehtxgpax.supabase.co/storage/v1/object/public/marketing-assets/ad-translation-instagram.jpg',
 'twitter', 'translation',
 E'🔥 ترجمة احترافية خلال 24 ساعة\n💯 جودة مضمونة\n🎁 خصم 20%\n\n👉 {ref_link}\n\n#ترجمة #طلاب',
 true),

-- Brochure
('بروشور: كل خدماتك الأكاديمية',
 'https://kziujhdqogqeehtxgpax.supabase.co/storage/v1/object/public/marketing-assets/ad-all-services-brochure.jpg',
 'brochure', 'all',
 E'🎓 كل خدماتك الأكاديمية في منصة واحدة:\n\n📚 ترجمة • ✍️ تحرير • 📄 سيرة ذاتية • 🔍 بحث علمي\n\n💎 خبراء معتمدون | ⚡ تسليم سريع | 🛡️ ضمان الجودة\n🎁 خصم 25% للطلاب الجدد\n\n👉 ابدأ الآن مجاناً: {ref_link}',
 true);