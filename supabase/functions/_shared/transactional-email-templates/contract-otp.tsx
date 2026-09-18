/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, S, heroLabel, otpBox, otpCode, SITE_NAME } from './_brand.tsx'

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
  <BrandEmail
    preview={`رمز التحقق لتوقيع العقد ${contractNumber}`}
    accent="violet"
    tagline="إدارة العقود الأكاديمية"
    badge={contractNumber ? `عقد ${contractNumber}` : 'تحقق آمن'}
    footerNote="إذا لم تطلب هذا الرمز فتجاهل الرسالة؛ لن يتم توقيع العقد دون إدخاله."
  >
        <Heading style={S.title}>رمز التحقق لتوقيع العقد</Heading>
        <Text style={S.greeting}>مرحباً {clientName}،</Text>
        <Text style={S.text}>
          لإتمام توقيع العقد رقم <strong>{contractNumber}</strong>
          {contractTitle ? <> — {contractTitle}</> : null}، استخدم رمز التحقق التالي:
        </Text>

        <Section style={heroBox('violet')}>
          <Text style={heroLabel('violet')}>رمز التحقق الخاص بك</Text>
          <Text style={otp}>{otpCode}</Text>
        </Section>

        <Text style={S.text}>
          الرمز صالح لمدة <strong>{expiresInMinutes} دقائق</strong> فقط ولا يجوز مشاركته مع أي شخص آخر.
        </Text>
  </BrandEmail>
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

const otp = { direction: 'ltr' as const, textAlign: 'center' as const, fontSize: '34px', fontWeight: 700, letterSpacing: '8px', color: '#4c1d95', margin: 0, fontFamily: 'monospace' }
