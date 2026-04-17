/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'منصة ماستر إيدو باث'
const PARENT = 'شركة علي صالح الشهري القابضة'

interface Props {
  clientName?: string
  contractNumber?: string
  contractTitle?: string
  signedAt?: string
  pdfUrl?: string
}

const ContractSignedEmail = ({ clientName, contractNumber, contractTitle, signedAt, pdfUrl }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>تم توقيع عقدك بنجاح — نسخة PDF مرفقة</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>{SITE_NAME}</Heading>
          <Text style={parent}>تابعة لـ {PARENT}</Text>
        </Section>

        <Heading style={h1}>تم توقيع العقد بنجاح ✅</Heading>
        <Text style={text}>
          {clientName ? `مرحباً ${clientName}،` : 'مرحباً،'}
        </Text>
        <Text style={text}>
          نشكرك على توقيع العقد {contractTitle ? `"${contractTitle}"` : ''} {contractNumber ? `رقم ${contractNumber}` : ''}.
          تم تسجيل توقيعك إلكترونياً{signedAt ? ` بتاريخ ${signedAt}` : ''} مع الطابع الزمني وعنوان IP.
        </Text>

        {pdfUrl && (
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button href={pdfUrl} style={btn}>تنزيل نسخة PDF من العقد</Button>
            <Text style={hint}>الرابط صالح لمدة 7 أيام</Text>
          </Section>
        )}

        <Text style={text}>
          نسخة من العقد محفوظة بشكل آمن في حسابك ويمكنك الرجوع إليها في أي وقت من لوحة التحكم.
        </Text>

        <Text style={footer}>
          مع أطيب التحيات،<br />
          فريق {SITE_NAME}<br />
          <span style={{ color: '#9ca3af', fontSize: 11 }}>{PARENT}</span>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContractSignedEmail,
  subject: (d: Record<string, any>) =>
    `تم توقيع العقد ${d.contractNumber ? `#${d.contractNumber}` : ''} بنجاح`,
  displayName: 'إشعار توقيع العقد',
  previewData: {
    clientName: 'أحمد محمد',
    contractNumber: 'CT-1024',
    contractTitle: 'عقد خدمة ترجمة أكاديمية',
    signedAt: '2025-01-15 14:30',
    pdfUrl: 'https://example.com/contract.pdf',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'IBM Plex Sans Arabic, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: 600, margin: '0 auto' }
const header = { borderBottom: '2px solid #0f172a', paddingBottom: 12, marginBottom: 24, textAlign: 'right' as const }
const brand = { fontSize: 20, color: '#0f172a', margin: 0, fontWeight: 700 }
const parent = { fontSize: 12, color: '#64748b', margin: '4px 0 0' }
const h1 = { fontSize: 22, color: '#0f172a', textAlign: 'right' as const, margin: '0 0 16px' }
const text = { fontSize: 14, color: '#334155', lineHeight: 1.7, textAlign: 'right' as const, margin: '0 0 14px' }
const btn = { backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }
const hint = { fontSize: 11, color: '#94a3b8', margin: '8px 0 0' }
const footer = { fontSize: 12, color: '#64748b', textAlign: 'right' as const, margin: '28px 0 0', borderTop: '1px solid #e5e7eb', paddingTop: 16 }
