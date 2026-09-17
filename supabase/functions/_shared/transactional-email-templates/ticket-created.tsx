import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, DataTable, S, card, cardTitle, noteBox, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props {
  customerName?: string
  ticketNumber?: string
  subject?: string
  priority?: string
  category?: string
  createdAt?: string
  message?: string
  ticketUrl?: string
}

const E = ({ customerName, ticketNumber, subject, priority, category, createdAt, message, ticketUrl }: Props) => (
  <BrandEmail
    preview={`تم فتح تذكرة الدعم ${ticketNumber ?? ''} — ${SITE_NAME}`}
    accent="blue"
    tagline="مركز الدعم الفني"
    badge={ticketNumber ? `تذكرة ${ticketNumber}` : 'تذكرة جديدة'}
    cta={{ label: 'عرض التذكرة', url: ticketUrl || `${SITE_URL}/dashboard` }}
    footerNote="فريق الدعم متاح لخدمتك ويرد عادةً خلال ساعات العمل."
  >
    <Heading style={S.title} className="fk-title">تم فتح تذكرتك 🎫</Heading>
    <Text style={S.greeting}>مرحبًا {customerName || 'بك'}،</Text>
    <Text style={S.text}>
      استلمنا طلب الدعم الخاص بك، وتم تسجيله لدى فريقنا. سنوافيك بالرد على هذه التذكرة
      في أقرب وقت ممكن.
    </Text>
    <Section style={card}>
      <Text style={cardTitle}>بيانات التذكرة</Text>
      <DataTable rows={[
        ['رقم التذكرة', ticketNumber],
        ['الموضوع', subject],
        ['التصنيف', category],
        ['الأولوية', priority],
        ['تاريخ الفتح', createdAt],
      ]} />
    </Section>
    {message ? <Text style={noteBox('blue')}>{message}</Text> : null}
  </BrandEmail>
)

export const template: TemplateEntry = {
  component: E,
  subject: (d) => `تذكرة دعم ${d.ticketNumber ?? ''} — ${SITE_NAME}`,
  displayName: 'فتح تذكرة دعم',
  previewData: { customerName: 'أحمد', ticketNumber: 'TK-204', subject: 'استفسار عن الطلب', priority: 'متوسطة' },
}
export default E
