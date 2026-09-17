import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, DataTable, S, card, cardTitle, heroBox, heroLabel, heroValue, noteBox, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props {
  customerName?: string
  orderNumber?: string
  serviceName?: string
  createdAt?: string
  deliveryDate?: string
  amount?: string | number
  currency?: string
  notes?: string
  orderUrl?: string
}

const E = ({ customerName, orderNumber, serviceName, createdAt, deliveryDate, amount, currency, notes, orderUrl }: Props) => {
  const cur = currency === 'USD' ? '$' : 'ر.س'
  return (
    <BrandEmail
      preview={`استلمنا طلبك ${orderNumber ?? ''} — ${SITE_NAME}`}
      accent="teal"
      tagline="إدارة الطلبات"
      badge={orderNumber ? `طلب ${orderNumber}` : 'طلب جديد'}
      cta={{ label: 'متابعة الطلب', url: orderUrl || `${SITE_URL}/dashboard` }}
      footerNote="يمكنك متابعة حالة طلبك في أي وقت من لوحة حسابك."
    >
      <Heading style={S.title} className="fk-title">تم استلام طلبك بنجاح ✅</Heading>
      <Text style={S.greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
      <Text style={S.text}>
        شكرًا لثقتك بـ{SITE_NAME}. استلمنا طلبك وهو الآن قيد المراجعة من فريقنا المختص،
        وسنوافيك بأي تحديث فور بدء التنفيذ.
      </Text>
      {amount !== undefined && amount !== null && String(amount) !== '' && (
        <Section style={heroBox('teal')}>
          <Text style={heroLabel('teal')}>قيمة الطلب</Text>
          <Text style={heroValue('teal')} className="fk-hero">{amount} {cur}</Text>
        </Section>
      )}
      <Section style={card}>
        <Text style={cardTitle}>تفاصيل الطلب</Text>
        <DataTable rows={[
          ['رقم الطلب', orderNumber],
          ['الخدمة', serviceName],
          ['تاريخ الطلب', createdAt],
          ['التسليم المتوقع', deliveryDate],
        ]} />
      </Section>
      {notes ? <Text style={noteBox('teal')}>{notes}</Text> : null}
    </BrandEmail>
  )
}

export const template: TemplateEntry = {
  component: E,
  subject: (d) => `تأكيد استلام الطلب ${d.orderNumber ?? ''} — ${SITE_NAME}`,
  displayName: 'استلام طلب جديد',
  previewData: { customerName: 'أحمد', orderNumber: 'ORD-1024', serviceName: 'ترجمة أكاديمية', amount: '450' },
}
export default E
