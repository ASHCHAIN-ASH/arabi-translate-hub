import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, S, heroBox, heroLabel, heroValue, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props { name?: string; confirmationUrl?: string; expiresInMinutes?: number }

const E = ({ name, confirmationUrl, expiresInMinutes = 60 }: Props) => (
  <BrandEmail
    preview={`فعّل بريدك الإلكتروني وابدأ رحلتك مع ${SITE_NAME}`}
    accent="blue"
    tagline="تفعيل الحساب"
    badge="تحقّق من البريد"
    cta={{ label: 'تفعيل الحساب الآن', url: confirmationUrl || SITE_URL }}
    fallbackUrl={confirmationUrl || SITE_URL}
    footerNote="إذا لم تقم بإنشاء هذا الحساب، تجاهل هذه الرسالة بأمان."
  >
    <Heading style={S.title} className="fk-title">مرحبًا بك في {SITE_NAME} 🎓</Heading>
    <Text style={S.greeting}>أهلاً {name || 'بك'}،</Text>
    <Text style={S.text}>
      يفصلك خطوة واحدة عن تفعيل حسابك. اضغط الزر أدناه لتأكيد بريدك الإلكتروني
      والوصول إلى جميع خدماتنا الأكاديمية: الترجمة، البحث العلمي، التدقيق، والنشر.
    </Text>
    <Section style={heroBox('blue')}>
      <Text style={heroLabel('blue')}>صلاحية رابط التفعيل</Text>
      <Text style={heroValue('blue')} className="fk-hero">{expiresInMinutes} دقيقة</Text>
    </Section>
  </BrandEmail>
)

export const template: TemplateEntry = {
  component: E,
  subject: `تفعيل حسابك في ${SITE_NAME}`,
  displayName: 'تأكيد البريد الإلكتروني',
  previewData: { name: 'أحمد', confirmationUrl: `${SITE_URL}/auth/confirm` },
}
export default E
