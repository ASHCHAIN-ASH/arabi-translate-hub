import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "مسار الماستر"

interface QuoteNotificationProps {
  serviceName?: string
  trackingId?: string
  amount?: string
  ordersUrl?: string
}

const QuoteNotificationEmail = ({ serviceName, trackingId, amount, ordersUrl }: QuoteNotificationProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>تم إرسال عرض سعر جديد لطلبك - {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={logo}>{SITE_NAME}</Heading>
        </Section>
        
        <Hr style={divider} />

        <Heading style={h1}>عرض سعر جديد 💰</Heading>
        
        <Text style={text}>
          مرحباً، تم إرسال عرض سعر جديد لطلبك. يرجى مراجعة التفاصيل والرد على العرض.
        </Text>

        <Section style={detailsBox}>
          {trackingId && (
            <Text style={detailRow}>
              <strong>رقم الطلب:</strong> {trackingId}
            </Text>
          )}
          {serviceName && (
            <Text style={detailRow}>
              <strong>الخدمة:</strong> {serviceName}
            </Text>
          )}
          {amount && (
            <Text style={amountText}>
              السعر المقترح: <strong>{amount} ر.س</strong>
            </Text>
          )}
        </Section>

        <Section style={buttonSection}>
          <Button style={button} href={ordersUrl || '#'}>
            مراجعة عرض السعر
          </Button>
        </Section>

        <Text style={text}>
          يمكنك قبول أو رفض العرض من خلال لوحة التحكم الخاصة بك. في حال وجود أي استفسار، لا تتردد في التواصل معنا.
        </Text>

        <Hr style={divider} />

        <Text style={footer}>
          {SITE_NAME} — خدمات أكاديمية متميزة
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: QuoteNotificationEmail,
  subject: 'عرض سعر جديد لطلبك',
  displayName: 'إشعار عرض سعر',
  previewData: {
    serviceName: 'ترجمة أكاديمية',
    trackingId: 'ORD-123456',
    amount: '1,500',
    ordersUrl: 'https://masteredupath.com/orders',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Cairo', 'Almarai', Arial, sans-serif" }
const container = { padding: '30px 25px', maxWidth: '580px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, padding: '10px 0' }
const logo = { fontSize: '20px', fontWeight: '700' as const, color: '#3b4ede', margin: '0' }
const divider = { borderColor: '#e5e7eb', margin: '20px 0' }
const h1 = { fontSize: '24px', fontWeight: '700' as const, color: '#1e293b', margin: '0 0 16px', textAlign: 'center' as const }
const text = { fontSize: '15px', color: '#475569', lineHeight: '1.7', margin: '0 0 16px', textAlign: 'right' as const }
const detailsBox = { backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', margin: '0 0 24px', border: '1px solid #e2e8f0' }
const detailRow = { fontSize: '14px', color: '#334155', margin: '0 0 8px', textAlign: 'right' as const }
const amountText = { fontSize: '18px', color: '#3b4ede', margin: '12px 0 0', textAlign: 'center' as const }
const buttonSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = { backgroundColor: '#3b4ede', color: '#ffffff', padding: '14px 32px', borderRadius: '10px', fontSize: '16px', fontWeight: '600' as const, textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, margin: '16px 0 0' }
