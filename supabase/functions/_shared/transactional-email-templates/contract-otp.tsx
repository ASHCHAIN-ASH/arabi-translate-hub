/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  clientName?: string
  contractNumber?: string
  contractTitle?: string
  otpCode?: string
  expiresInMinutes?: number
}

const ContractOtpEmail = ({
  clientName = 'عميلنا الكريم',
  contractNumber = '',
  contractTitle = '',
  otpCode = '------',
  expiresInMinutes = 10,
}: Props) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>رمز التحقق لتوقيع العقد {contractNumber}</Preview>
    <Body dir="rtl" style={main}>
      <Container dir="rtl" style={container}>
        <Heading style={h1}>رمز التحقق لتوقيع العقد</Heading>
        <Text style={text}>مرحباً {clientName}،</Text>
        <Text style={text}>
          لإتمام توقيع العقد رقم <strong>{contractNumber}</strong>
          {contractTitle ? <> — {contractTitle}</> : null}، استخدم رمز التحقق التالي:
        </Text>

        <Section style={otpBox}>
          <Text style={otp}>{otpCode}</Text>
        </Section>

        <Text style={text}>
          الرمز صالح لمدة <strong>{expiresInMinutes} دقائق</strong> فقط ولا يجوز مشاركته مع أي شخص آخر.
        </Text>

        <Hr style={hr} />
        <Text style={muted}>
          إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة. لن يتم توقيع العقد دون إدخال الرمز.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContractOtpEmail,
  subject: (d: Record<string, any>) => `رمز التحقق لتوقيع العقد ${d?.contractNumber || ''}`.trim(),
  displayName: 'رمز التحقق لتوقيع العقد',
  previewData: {
    clientName: 'محمد أحمد',
    contractNumber: 'CN-2025-0001',
    contractTitle: 'عقد خدمة ترجمة أكاديمية',
    otpCode: '482915',
    expiresInMinutes: 10,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Arabic','Tajawal',Arial,sans-serif", direction: 'rtl' as const, textAlign: 'right' as const }
const container = { direction: 'rtl' as const, textAlign: 'right' as const, padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 18px', textAlign: 'right' as const }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.9', margin: '0 0 14px', textAlign: 'right' as const }
const otpBox = { background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', margin: '20px 0', textAlign: 'center' as const }
const otp = { fontSize: '34px', fontWeight: 700, letterSpacing: '10px', color: '#0f172a', margin: 0, fontFamily: 'monospace' }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const muted = { fontSize: '12px', color: '#94a3b8', textAlign: 'right' as const, margin: 0 }
