import * as React from 'npm:react@18.3.1'
import { Heading, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, S, noteBox, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props {
  customerName?: string
  subject?: string
  message?: string
  agentName?: string
  ctaLabel?: string
  ctaUrl?: string
}

const E = ({ customerName, subject, message, agentName, ctaLabel, ctaUrl }: Props) => (
  <BrandEmail
    preview={subject || `رسالة من فريق دعم ${SITE_NAME}`}
    accent="blue"
    tagline="خدمة العملاء"
    badge="رسالة دعم"
    cta={{ label: ctaLabel || 'تواصل معنا', url: ctaUrl || `${SITE_URL}/contact` }}
    footerNote="يسعدنا الرد على استفساراتك في أي وقت."
  >
    <Heading style={S.title} className="fk-title">{subject || 'رسالة من فريق الدعم'}</Heading>
    <Text style={S.greeting}>مرحبًا {customerName || 'بك'}،</Text>
    {message ? <Text style={noteBox('blue')}>{message}</Text> : null}
    <Text style={S.text}>مع تحيات {agentName || `فريق دعم ${SITE_NAME}`}.</Text>
  </BrandEmail>
)

export const template: TemplateEntry = {
  component: E,
  subject: (d) => d.subject || `رسالة من فريق دعم ${SITE_NAME}`,
  displayName: 'رسالة دعم عامة',
  previewData: { customerName: 'أحمد', subject: 'بخصوص استفسارك', message: 'تم تنفيذ طلبك.' },
}
export default E
