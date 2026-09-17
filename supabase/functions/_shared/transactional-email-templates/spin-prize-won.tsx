import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, DataTable, S, card, cardTitle, heroBox, heroLabel, heroValue, noteBox, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props {
  customerName?: string
  prize?: string
  claimCode?: string
  wonAt?: string
  nextEligibleAt?: string
  validUntil?: string
}

const E = ({ customerName, prize, claimCode, wonAt, nextEligibleAt, validUntil }: Props) => (
  <BrandEmail
    preview={`مبروك! ربحت ${prize ?? 'جائزة'} من عجلة جوائز ${SITE_NAME}`}
    accent="amber"
    tagline="عجلة الجوائز الأكاديمية"
    badge="🎉 فوز مؤكّد"
    cta={{ label: 'المطالبة بالجائزة الآن', url: `${SITE_URL}/order-now` }}
    footerNote="أرفق رمز المطالبة عند تواصلك معنا لتفعيل جائزتك."
  >
    <Heading style={S.title} className="fk-title">مبروك {customerName || ''} — لقد فزت! 🎁</Heading>
    <Text style={S.greeting}>عزيزي/عزيزتي {customerName || 'المشارك'}،</Text>
    <Text style={S.text}>
      سعداء بإبلاغك أن دورتك في عجلة جوائز {SITE_NAME} انتهت بالفوز بإحدى خدماتنا الأكاديمية المجانية.
      احتفظ بهذه الرسالة، فهي إثبات فوزك ورمز المطالبة بالجائزة.
    </Text>

    <Section style={heroBox('amber')}>
      <Text style={heroLabel('amber')}>جائزتك</Text>
      <Text style={heroValue('amber')} className="fk-hero">{prize || '—'}</Text>
    </Section>

    <Section style={card}>
      <Text style={cardTitle}>تفاصيل الفوز</Text>
      <DataTable rows={[
        ['رمز المطالبة', claimCode],
        ['تاريخ الفوز', wonAt],
        ['صالحة حتى', validUntil],
        ['محاولتك القادمة', nextEligibleAt],
      ]} />
    </Section>

    <Text style={noteBox('amber')}>
      {'كيف تستلم جائزتك؟\n'}
      {'1) تواصل معنا عبر الموقع أو واتساب.\n'}
      {'2) أرسل رمز المطالبة الموضّح أعلاه.\n'}
      {'3) يبدأ فريقنا بتنفيذ الخدمة المجانية مباشرة.'}
    </Text>

    <Text style={S.small}>
      تنبيه موثّق: المشاركة في العجلة متاحة مرة واحدة كل 30 يومًا لكل مشارك، ويُحتسب موعد محاولتك القادمة تلقائيًا من تاريخ هذا الفوز.
    </Text>
  </BrandEmail>
)

export const template: TemplateEntry = {
  component: E,
  subject: (d) => `🎉 مبروك! ربحت ${d.prize ?? 'جائزة'} — ${SITE_NAME}`,
  displayName: 'فوز بجائزة العجلة (العميل)',
  previewData: {
    customerName: 'أحمد',
    prize: 'سيرة ذاتية ATS مجانًا',
    claimCode: 'SPIN-4F2A9C',
    wonAt: '2026-09-17',
    validUntil: '2026-10-17',
    nextEligibleAt: '2026-10-17',
  },
}
export default E
