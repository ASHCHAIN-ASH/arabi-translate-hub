/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'FekrahEdu'
const PARENT = 'شركة علي صالح الشهري القابضة'

interface Props {
  clientName?: string
  clientEmail?: string
  contractNumber?: string
  contractTitle?: string
  signedAt?: string
  ipAddress?: string
  pdfUrl?: string
  totalAmount?: string
}

const ContractSignedAdminEmail = ({
  clientName, clientEmail, contractNumber, contractTitle, signedAt, ipAddress, pdfUrl, totalAmount,
}: Props) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>تم توقيع عقد جديد — نسخة PDF مرفقة</Preview>
    <Body dir="rtl" style={main}>
      <Container dir="rtl" style={container}>
        <Section style={header}>
          <Heading style={brand}>{SITE_NAME}</Heading>
          <Text style={parent}>تابعة لـ {PARENT}</Text>
        </Section>

        <Heading style={h1}>✅ تم توقيع عقد جديد</Heading>
        <Text style={text}>
          قام العميل بتوقيع العقد إلكترونياً. التفاصيل أدناه:
        </Text>

        <Section style={infoBox}>
          <Text style={row}><strong>رقم العقد:</strong> {contractNumber || '—'}</Text>
          <Text style={row}><strong>عنوان العقد:</strong> {contractTitle || '—'}</Text>
          <Text style={row}><strong>اسم العميل:</strong> {clientName || '—'}</Text>
          <Text style={row}><strong>بريد العميل:</strong> {clientEmail || '—'}</Text>
          {totalAmount && <Text style={row}><strong>قيمة العقد:</strong> {totalAmount}</Text>}
          <Text style={row}><strong>تاريخ التوقيع:</strong> {signedAt || '—'}</Text>
          <Text style={row}><strong>IP العميل:</strong> {ipAddress || '—'}</Text>
        </Section>

        {pdfUrl && (
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button href={pdfUrl} style={btn}>تنزيل نسخة PDF من العقد</Button>
            <Text style={hint}>الرابط صالح لمدة 7 أيام</Text>
          </Section>
        )}

        <Text style={footer}>
          إشعار آلي من نظام {SITE_NAME}<br />
          <span style={{ color: '#9ca3af', fontSize: 11 }}>{PARENT}</span>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContractSignedAdminEmail,
  subject: (d: Record<string, any>) =>
    `✅ توقيع عقد جديد ${d.contractNumber ? `#${d.contractNumber}` : ''} — ${d.clientName || ''}`,
  displayName: 'إشعار الإدارة بتوقيع عقد',
  previewData: {
    clientName: 'أحمد محمد',
    clientEmail: 'client@example.com',
    contractNumber: 'CT-1024',
    contractTitle: 'عقد خدمة ترجمة أكاديمية',
    signedAt: '2025-01-15 14:30',
    ipAddress: '192.168.1.1',
    totalAmount: '1,500.00 SAR',
    pdfUrl: 'https://example.com/contract.pdf',
  },
} satisfies TemplateEntry

const main = { direction: 'rtl' as const, textAlign: 'right' as const, backgroundColor: '#ffffff', fontFamily: 'IBM Plex Sans Arabic, Arial, sans-serif' }
const container = { direction: 'rtl' as const, textAlign: 'right' as const, padding: '24px 28px', maxWidth: 600, margin: '0 auto' }
const header = { borderBottom: '2px solid #0f172a', paddingBottom: 12, marginBottom: 24, textAlign: 'right' as const }
const brand = { fontSize: 20, color: '#0f172a', margin: 0, fontWeight: 700 }
const parent = { fontSize: 12, color: '#64748b', margin: '4px 0 0' }
const h1 = { fontSize: 22, color: '#059669', textAlign: 'right' as const, margin: '0 0 16px' }
const text = { fontSize: 14, color: '#334155', lineHeight: 1.7, textAlign: 'right' as const, margin: '0 0 14px' }
const infoBox = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, margin: '16px 0' }
const row = { fontSize: 13, color: '#1e293b', textAlign: 'right' as const, margin: '6px 0', lineHeight: 1.6 }
const btn = { backgroundColor: '#059669', color: '#ffffff', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }
const hint = { fontSize: 11, color: '#94a3b8', margin: '8px 0 0' }
const footer = { fontSize: 12, color: '#64748b', textAlign: 'right' as const, margin: '28px 0 0', borderTop: '1px solid #e5e7eb', paddingTop: 16 }
