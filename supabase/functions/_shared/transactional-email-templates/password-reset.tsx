import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, S, heroBox, heroLabel, heroValue, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props { name?: string; confirmationUrl?: string; expiresInMinutes?: number }

const E = ({ name, confirmationUrl, expiresInMinutes = 60 }: Props) => (
  <BrandEmail
    preview={`إعادة تعيين كلمة المرور — ${SITE_NAME}`}
    accent="violet"
    tagline="أمان الحساب"
    badge="إعادة التعيين"
    cta={{ label: 'تعيين كلمة مرور جديدة', url: confirmationUrl || SITE_URL }}
    footerNote="لم تطلب ذلك؟ تجاهل الرسالة — كلمة مرورك الحالية تبقى فعّالة."
  >
    <Heading style={S.title} className="fk-title">طلب إعادة تعيين كلمة المرور 🔐</Heading>
    <Text style={S.greeting}>مرحبًا {name || 'بك'}،</Text>
    <Text style={S.text}>
      وصلنا طلب لإعادة تعيين كلمة مرور حسابك. اضغط الزر أدناه لاختيار كلمة مرور جديدة.
      لا تشارك هذا الرابط مع أي شخص.
    </Text>
    <Section style={heroBox('violet')}>
      <Text style={heroLabel('violet')}>صلاحية الرابط</Text>
      <Text style={heroValue('violet')} className="fk-hero">{expiresInMinutes} دقيقة</Text>
    </Section>
    <Text style={S.small}>
      إذا لم يعمل الزر، انسخ الرابط التالي والصقه في المتصفح:<br />
      {confirmationUrl || SITE_URL}
    </Text>
  </BrandEmail>
)

export const template: TemplateEntry = {
  component: E,
  subject: `إعادة تعيين كلمة المرور — ${SITE_NAME}`,
  displayName: 'إعادة تعيين كلمة المرور',
  previewData: { name: 'أحمد', confirmationUrl: `${SITE_URL}/auth/reset-password` },
}
export default E
