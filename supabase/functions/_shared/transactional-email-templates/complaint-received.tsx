import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, DataTable, S, card, cardTitle, heroBox, heroLabel, heroValue, noteBox, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props {
  customerName?: string
  complaintNumber?: string
  subject?: string
  createdAt?: string
  details?: string
  expectedResponseHours?: number
  trackUrl?: string
}

const E = ({ customerName, complaintNumber, subject, createdAt, details, expectedResponseHours = 24, trackUrl }: Props) => (
  <BrandEmail
    preview={`استلمنا شكواك ${complaintNumber ?? ''} — ${SITE_NAME}`}
    accent="amber"
    tagline="إدارة الجودة والشكاوى"
    badge={complaintNumber ? `شكوى ${complaintNumber}` : 'شكوى مسجّلة'}
    cta={{ label: 'متابعة الشكوى', url: trackUrl || `${SITE_URL}/dashboard` }}
    footerNote="رضاك أولويتنا — نتعامل مع كل ملاحظة بجدية وسرّية تامة."
  >
    <Heading style={S.title} className="fk-title">تم تسجيل شكواك 📝</Heading>
    <Text style={S.greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
    <Text style={S.text}>
      نعتذر عن أي إزعاج، وقد تم تحويل شكواك إلى إدارة الجودة للمراجعة الفورية
      واتخاذ الإجراء المناسب.
    </Text>
    <Section style={heroBox('amber')}>
      <Text style={heroLabel('amber')}>مدة الرد المتوقعة</Text>
      <Text style={heroValue('amber')} className="fk-hero">{expectedResponseHours} ساعة</Text>
    </Section>
    <Section style={card}>
      <Text style={cardTitle}>بيانات الشكوى</Text>
      <DataTable rows={[
        ['رقم الشكوى', complaintNumber],
        ['الموضوع', subject],
        ['تاريخ التسجيل', createdAt],
      ]} />
    </Section>
    {details ? <Text style={noteBox('amber')}>{details}</Text> : null}
  </BrandEmail>
)

export const template: TemplateEntry = {
  component: E,
  subject: (d) => `تم استلام شكواك ${d.complaintNumber ?? ''} — ${SITE_NAME}`,
  displayName: 'استلام شكوى',
  previewData: { customerName: 'أحمد', complaintNumber: 'CMP-11', subject: 'تأخر التسليم' },
}
export default E
