import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, DataTable, S, card, cardTitle, noteBox, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props {
  customerName?: string
  ticketNumber?: string
  subject?: string
  status?: string
  agentName?: string
  reply?: string
  ticketUrl?: string
}

const E = ({ customerName, ticketNumber, subject, status, agentName, reply, ticketUrl }: Props) => (
  <BrandEmail
    preview={`رد جديد على تذكرتك ${ticketNumber ?? ''} — ${SITE_NAME}`}
    accent="teal"
    tagline="مركز الدعم الفني"
    badge={status || 'رد جديد'}
    cta={{ label: 'الرد على التذكرة', url: ticketUrl || `${SITE_URL}/dashboard` }}
  >
    <Heading style={S.title} className="fk-title">لديك رد جديد من فريق الدعم 💬</Heading>
    <Text style={S.greeting}>مرحبًا {customerName || 'بك'}،</Text>
    <Text style={S.text}>
      قام {agentName || 'فريق الدعم'} بالرد على تذكرتك {ticketNumber ? `رقم ${ticketNumber}` : ''}.
    </Text>
    {reply ? <Text style={noteBox('teal')}>{reply}</Text> : null}
    <Section style={card}>
      <Text style={cardTitle}>حالة التذكرة</Text>
      <DataTable rows={[
        ['رقم التذكرة', ticketNumber],
        ['الموضوع', subject],
        ['الحالة', status],
        ['المسؤول', agentName],
      ]} />
    </Section>
  </BrandEmail>
)

export const template: TemplateEntry = {
  component: E,
  subject: (d) => `رد جديد على تذكرتك ${d.ticketNumber ?? ''} — ${SITE_NAME}`,
  displayName: 'رد على تذكرة دعم',
  previewData: { customerName: 'أحمد', ticketNumber: 'TK-204', status: 'قيد المعالجة', reply: 'تم تحديث طلبك.' },
}
export default E
