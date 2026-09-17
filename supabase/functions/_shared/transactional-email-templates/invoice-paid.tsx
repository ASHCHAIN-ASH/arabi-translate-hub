import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as S from './_invoice-shared.ts'

interface Props {
  customerName?: string
  invoiceNumber?: string
  totalAmount?: string | number
  paidAt?: string
  currency?: string
  invoiceUrl?: string
}

const E = ({ customerName, invoiceNumber, totalAmount, paidAt, currency, invoiceUrl }: Props) => {
  const cur = currency === 'USD' ? '$' : 'ر.س'
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>{`إيصال سداد الفاتورة ${invoiceNumber ?? ''} — ${S.SITE_NAME}`}</Preview>
      <Body dir="rtl" style={S.main}>
        <Container dir="rtl" style={S.container}>
          <Section style={S.header}>
            <Row>
              <Column>
                <Text style={S.brand}>🏦 {S.SITE_NAME}</Text>
                <Text style={S.tagline}>إيصال سداد نهائي</Text>
              </Column>
              <Column align="right">
                <Text style={S.badge}>✓ مدفوعة بالكامل</Text>
              </Column>
            </Row>
          </Section>

          <Section style={S.heroBox('#ecfdf5', '#10b981')}>
            <Text style={{ fontSize: '44px', margin: 0, lineHeight: 1 }}>🎉</Text>
            <Text style={S.heroLabel('#065f46')}>إجمالي المبلغ المدفوع</Text>
            <Heading style={S.heroAmount('#059669')}>
              {S.fmt(totalAmount)} <span style={S.heroCurrency}>{cur}</span>
            </Heading>
            <Text style={S.heroNote('#065f46')}>لا يوجد أي مبلغ متبقٍ على هذه الفاتورة</Text>
          </Section>

          <Text style={S.greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
          <Text style={S.text}>
            شكراً لك. تم سداد الفاتورة رقم <strong>{invoiceNumber || '—'}</strong> بالكامل، وأصبحت
            حالتها «مدفوعة». هذه الرسالة تُعد إيصالاً رسمياً يمكنك الاحتفاظ به.
          </Text>

          <Section style={S.card}>
            <Text style={S.cardTitle}>📄 بيانات الإيصال</Text>
            <table style={S.tbl} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr style={S.trAlt}>
                  <td style={S.tdLabel}>رقم الفاتورة</td>
                  <td style={{ ...S.tdValue, fontFamily: 'monospace', color: '#1d4ed8' }}>{invoiceNumber || '—'}</td>
                </tr>
                <tr>
                  <td style={S.tdLabel}>تاريخ اكتمال السداد</td>
                  <td style={S.tdValue}>{paidAt || '—'}</td>
                </tr>
                <tr style={S.trAlt}>
                  <td style={S.tdLabel}>الحالة</td>
                  <td style={{ ...S.tdValue, color: '#059669' }}>✓ مدفوعة بالكامل</td>
                </tr>
                <tr style={S.trTotal}>
                  <td style={S.tdTotalLabel}>الإجمالي المدفوع</td>
                  <td style={S.tdTotalValue}>{S.fmt(totalAmount)} {cur}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section style={S.btnSection}>
            <Button style={S.btnPrimary} href={invoiceUrl || `${S.SITE_URL}/invoices`}>
              تحميل الفاتورة المدفوعة
            </Button>
          </Section>

          <Hr style={S.divider} />
          <Section style={S.footerBox}>
            <Text style={S.footerSecure}>🔒 سعداء بخدمتك — نتطلع للتعاون معك مجدداً</Text>
            <Text style={S.footerText}>{S.SITE_NAME} — خدمات أكاديمية وبحثية موثوقة</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: E,
  subject: (d: Record<string, any>) => `🎉 إيصال سداد الفاتورة ${d.invoiceNumber || ''}`,
  displayName: 'اكتمال سداد فاتورة',
  previewData: {
    customerName: 'محمد أحمد',
    invoiceNumber: 'INV-2026-0142',
    totalAmount: 1725,
    paidAt: '2026-09-17',
    currency: 'SAR',
    invoiceUrl: 'https://fekrahedu.com/invoices',
  },
} satisfies TemplateEntry
