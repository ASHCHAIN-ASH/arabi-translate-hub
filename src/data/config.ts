/**
 * إعدادات طبقة البيانات — تُقرأ من متغيرات البيئة فقط.
 *
 * لا تضع أي عناوين أو مفاتيح مباشرة في الكود. عند نقل قاعدة البيانات إلى
 * سيرفر PostgreSQL خاص، يكفي تغيير هذه المتغيرات دون تعديل أي مكوّن واجهة:
 *
 *   VITE_DATA_DRIVER   = lovable-cloud | self-hosted
 *   VITE_AUTH_DRIVER   = lovable-cloud | self-hosted
 *   VITE_API_BASE_URL  = https://api.fekrahedu.com   (مطلوب مع self-hosted)
 */

export type DataDriverName = 'lovable-cloud' | 'self-hosted';

function readEnv(key: string): string | undefined {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value && value.length > 0 ? value : undefined;
}

const driver = (readEnv('VITE_DATA_DRIVER') ?? 'lovable-cloud') as DataDriverName;
const authDriver = (readEnv('VITE_AUTH_DRIVER') ?? driver) as DataDriverName;

export const dataConfig = {
  /** مزوّد البيانات الحالي */
  driver,
  /** مزوّد المصادقة الحالي */
  authDriver,
  /** عنوان الـ API المستقل (يُستخدم فقط مع self-hosted) */
  apiBaseUrl: readEnv('VITE_API_BASE_URL') ?? '',
  /** مفتاح تخزين التوكن في المتصفح عند استخدام مصادقة مستقلة */
  authStorageKey: readEnv('VITE_AUTH_STORAGE_KEY') ?? 'fekrahedu.auth.token',
  /** هل نحن على المزوّد الحالي (Lovable Cloud) */
  get isCloud() {
    return driver === 'lovable-cloud';
  },
  get isSelfHosted() {
    return driver === 'self-hosted';
  },
} as const;

export function assertSelfHostedConfig(): void {
  if (dataConfig.isSelfHosted && !dataConfig.apiBaseUrl) {
    throw new Error(
      'VITE_API_BASE_URL غير معرّف. مطلوب عند تشغيل VITE_DATA_DRIVER=self-hosted.',
    );
  }
}
