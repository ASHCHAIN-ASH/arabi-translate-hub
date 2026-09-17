import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, DataTable, S, card, cardTitle, fmt, heroBox, heroLabel, heroValue, noteBox, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props {
  customerName?: string
  title?: string
  referenceNumber?: string
  amount?: string | number
  currency?: string
  dueDate?: string
  status?: string
  method?: string
  message?: string
  actionUrl?: string
  actionLabel?: string
}

const E = ({ customerName, title, referenceNumber, amount, currency, dueDate, status, method, message, actionUrl, actionLabel }: Props) => {
  const cur = currency === 'USD' ? '$' : 'ر.س'
  return (
    <BrandEmail
      preview={`${title || 'إشعار مالي'} — ${SITE_NAME}`}
      accent="green"
      tagline="الإدارة المالية"
      badge={status || 'إشعار مالي'}
      cta={{ label: actionLabel || 'عرض التفاصيل المالية', url: actionUrl || `${SITE_URL}/dashboard` }}
      footerNote="لأي استفسار مالي تواصل معنا عبر البريد الرسمي."
    >
      <Heading style={S.title} className="fk-title">{title || 'إشعار مالي'} 💳</Heading>
      <Text style={S.greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
      <Text style={S.text}>
        نرسل لك تفاصيل الحركة المالية المرتبطة بحسابك لدى {SITE_NAME}.
      </Text>
      {amount !== undefined && amount !== null && String(amount) !== '' && (
        <Section style={heroBox('green')}>
          <Text style={heroLabel('green')}>المبلغ</Text>
          <Text style={heroValue('green')} className="fk-hero">{fmt(amount)} {cur}</Text>
        </Section>
      )}
      <Section style={card}>
        <Text style={cardTitle}>تفاصيل العملية</Text>
        <DataTable rows={[
          ['الرقم المرجعي', referenceNumber],
          ['الحالة', status],
          ['طريقة الدفع', method],
          ['تاريخ الاستحقاق', dueDate],
        ]} />
      </Section>
      {message ? <Text style={noteBox('green')}>{message}</Text> : null}
    </BrandEmail>
  )
}

export const template: TemplateEntry = {
  component: E,
  subject: (d) => `${d.title || 'إشعار مالي'} — ${SITE_NAME}`,
  displayName: 'إشعار مالي',
  previewData: { customerName: 'أحمد', title: 'تأكيد سداد', amount: 950, status: 'مدفوعة' },
}
export default E
