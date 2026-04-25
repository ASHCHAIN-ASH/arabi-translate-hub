import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Button, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Master Edu Path'
const SITE_URL = 'https://masteredupath.com'

interface OrderUpdateProps {
  clientName?: string
  trackingId?: string
  serviceName?: string
  newStatusLabel?: string
  statusEmoji?: string
  note?: string
  eventType?: 'status' | 'quote' | 'attachment' | 'completed'
  amount?: number | string
}

const labelByEvent: Record<string, string> = {
  status: 'تحديث على حالة طلبك',
  quote: 'وصلك عرض سعر جديد',
  attachment: 'ملف جديد متاح للتحميل',
  completed: 'تم إكمال طلبك بنجاح 🎉',
}

const OrderUpdateEmail = ({
  clientName,
  trackingId,
  serviceName,
  newStatusLabel,
  statusEmoji,
  note,
  eventType = 'status',
  amount,
}: OrderUpdateProps) => {
  const headline = labelByEvent[eventType] || 'تحديث على طلبك'
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>{`${headline} — ${trackingId ?? ''}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandBar}>
            <Text style={brandText}>{SITE_NAME}</Text>
          </Section>

          <Heading style={h1}>
            {statusEmoji ? `${statusEmoji} ` : ''}{headline}
          </Heading>

          <Text style={text}>
            {clientName ? `مرحباً ${clientName}،` : 'مرحباً،'}
          </Text>

          <Text style={text}>
            {eventType === 'completed'
              ? `يسعدنا إخبارك بأنه تم إنجاز طلبك بنجاح. شكراً لثقتك بنا.`
              : eventType === 'quote'
              ? `قمنا بإرسال عرض السعر الخاص بطلبك${amount ? ` بقيمة ${amount} ر.س` : ''}. يرجى مراجعته والرد عليه من حسابك.`
              : eventType === 'attachment'
              ? `قام فريقنا برفع ملف جديد على طلبك. يمكنك تحميله من صفحة الطلب.`
              : `تم تحديث حالة طلبك إلى: ${newStatusLabel || ''}.`}
          </Text>

          <Section style={card}>
            <Text style={cardLabel}>رقم الطلب</Text>
            <Text style={cardValue}>{trackingId}</Text>
            {serviceName && (
              <>
                <Hr style={hr} />
                <Text style={cardLabel}>الخدمة</Text>
                <Text style={cardValue}>{serviceName}</Text>
              </>
            )}
            {newStatusLabel && eventType === 'status' && (
              <>
                <Hr style={hr} />
                <Text style={cardLabel}>الحالة الجديدة</Text>
                <Text style={cardValue}>{newStatusLabel}</Text>
              </>
            )}
          </Section>

          {note && (
            <Section style={noteBox}>
              <Text style={noteText}>{note}</Text>
            </Section>
          )}

          <Section style={{ textAlign: 'center' as const, margin: '32px 0 16px' }}>
            <Button href={`${SITE_URL}/orders`} style={btn}>
              فتح الطلب
            </Button>
          </Section>

          <Text style={footer}>
            مع تحيات فريق {SITE_NAME}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderUpdateEmail,
  subject: (data: Record<string, any>) => {
    const t = data?.trackingId || ''
    const evt = data?.eventType || 'status'
    const map: Record<string, string> = {
      status: `تحديث على طلبك ${t}`,
      quote: `عرض سعر جديد لطلبك ${t}`,
      attachment: `ملف جديد متاح على طلبك ${t}`,
      completed: `🎉 تم إنجاز طلبك ${t}`,
    }
    return map[evt] || `تحديث على طلبك ${t}`
  },
  displayName: 'تحديث طلب الخدمة',
  previewData: {
    clientName: 'أحمد',
    trackingId: 'ORD-123456',
    serviceName: 'ترجمة أكاديمية',
    newStatusLabel: 'قيد التنفيذ',
    statusEmoji: '⚡',
    eventType: 'status',
    note: 'سيتم التواصل معك خلال 24 ساعة.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'IBM Plex Sans Arabic, Tahoma, Arial, sans-serif', margin: '0', padding: '0' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '24px', direction: 'rtl' as const }
const brandBar = { background: 'linear-gradient(135deg,#0f3a5f,#1c6aa8)', padding: '14px 18px', borderRadius: '10px', textAlign: 'center' as const }
const brandText = { color: '#ffffff', fontSize: '16px', fontWeight: 700, margin: 0 }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#0f3a5f', margin: '24px 0 12px', textAlign: 'right' as const }
const text = { fontSize: '15px', color: '#3a3f48', lineHeight: '1.7', margin: '0 0 14px', textAlign: 'right' as const }
const card = { border: '1px solid #e3e8ef', borderRadius: '12px', padding: '16px 18px', margin: '16px 0', background: '#fafbfd' }
const cardLabel = { fontSize: '12px', color: '#7a8290', margin: '0 0 4px', textAlign: 'right' as const }
const cardValue = { fontSize: '15px', color: '#0f3a5f', fontWeight: 600, margin: '0 0 6px', textAlign: 'right' as const }
const hr = { borderColor: '#e3e8ef', margin: '12px 0' }
const noteBox = { background: '#fffbea', border: '1px solid #f5e7a3', borderRadius: '10px', padding: '12px 16px', margin: '12px 0' }
const noteText = { fontSize: '14px', color: '#6b5400', margin: 0, textAlign: 'right' as const, lineHeight: '1.6' }
const btn = { background: '#1c6aa8', color: '#ffffff', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' as const }
const footer = { fontSize: '12px', color: '#9aa3b2', margin: '28px 0 0', textAlign: 'center' as const }
