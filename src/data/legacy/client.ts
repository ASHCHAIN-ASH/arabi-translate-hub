/**
 * نقطة عبور مؤقتة (Legacy seam).
 *
 * الكود القديم الذي ما زال يكتب استعلامات بصياغة المزوّد الحالي يستورد من هنا
 * بدل الاستيراد المباشر من `@/integrations/supabase/client`. هذا يضمن أن
 * الارتباط بالمزوّد الحالي محصور في مجلد `src/data` فقط، ويمكن تتبّع ما تبقّى
 * من ملفات تحتاج نقلًا إلى المستودعات (Repositories) بأمر واحد:
 *
 *   rg -l "@/data/legacy/client" src
 *
 * ❗ لا تستخدم هذا الملف في كود جديد — استخدم `db` أو المستودعات من `@/data`.
 */

export { supabase as legacyDbClient, supabase } from '@/integrations/supabase/client';
export type { Database } from '@/integrations/supabase/types';
