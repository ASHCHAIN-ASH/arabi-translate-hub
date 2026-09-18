import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Row, Column,
 Img, } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as S from './_invoice-shared.ts'
import { HEAD_CSS, LOGO_URL } from './_head.ts'

interface Props {
  customerName?: string
  invoiceNumber?: string
  amountPaid?: string | number
  remainingAmount?: string | number
  totalAmount?: string | number
  paymentMethod?: string
  paymentDate?: string
  referenceNumber?: string
  currency?: string
  invoiceUrl?: string
}

const METHODS: Record<string, string> = {
  wallet: '💼 المحفظة الرقمية',
  bank_transfer: '🏦 تحويل بنكي',
  card: '💳 بطاقة ائتمانية',
  cash: '💵 نقداً',
}

const E = ({
  customerName, invoiceNumber, amountPaid, remainingAmount, totalAmount,
  paymentMethod, paymentDate, referenceNumber, currency, invoiceUrl,
}: Props) => {
  const cur = currency === 'USD' ? '$' : 'ر.س'
  const remaining = Number(remainingAmount ?? 0)
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{HEAD_CSS}</style>
      </Head>
      <Preview>{`تم استلام دفعة بمبلغ ${S.fmt(amountPaid)} ${cur} على الفاتورة ${invoiceNumber ?? ''}`}</Preview>
      <Body dir="rtl" style={S.main}>
        <Container dir="rtl" className="fk-shell" style={S.container}>
          <Section style={S.header}>
            <Row>
              <Column>
                <Img src={LOGO_URL} width="42" height="42" alt="FekrahEdu" style={{ borderRadius: '10px', backgroundColor: '#fff', marginBottom: '8px' }} />
                <Text style={S.brand}>{S.SITE_NAME}</Text>
                <Text style={S.tagline}>إشعار استلام دفعة</Text>
              </Column>
              <Column align="right">
                <Text style={S.badge}>✓ مستلمة</Text>
              </Column>
            </Row>
          </Section>

          <Section style={S.heroBox('#ecfdf5', '#10b981')}>
            <Text style={S.heroLabel('#065f46')}>المبلغ المستلم</Text>
            <Heading style={S.heroAmount('#059669')}>
              {S.fmt(amountPaid)} <span style={S.heroCurrency}>{cur}</span>
            </Heading>
            <Text style={S.heroNote('#065f46')}>
              {remaining > 0
                ? <>المتبقي على الفاتورة: <strong>{S.fmt(remaining)} {cur}</strong></>
                : <>تم سداد الفاتورة بالكامل ✅</>}
            </Text>
          </Section>

          <Text style={S.greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
          <Text style={S.text}>
            نؤكد استلام دفعتك على الفاتورة رقم <strong>{invoiceNumber || '—'}</strong>. تم تحديث
            سجل الفاتورة في حسابك مباشرة، ويمكنك مراجعة التفاصيل في أي وقت.
          </Text>

          <Section style={S.card}>
            <Text style={S.cardTitle}>📄 تفاصيل الدفعة</Text>
            <table style={S.tbl} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr style={S.trAlt}>
                  <td style={S.tdLabel}>رقم الفاتورة</td>
                  <td style={{ ...S.tdValue, fontFamily: 'monospace', color: '#1d4ed8' }}>{invoiceNumber || '—'}</td>
                </tr>
                <tr>
                  <td style={S.tdLabel}>طريقة الدفع</td>
                  <td style={S.tdValue}>{METHODS[paymentMethod || ''] || paymentMethod || '—'}</td>
                </tr>
                <tr style={S.trAlt}>
                  <td style={S.tdLabel}>تاريخ الدفع</td>
                  <td style={S.tdValue}>{paymentDate || '—'}</td>
                </tr>
                {referenceNumber && (
                  <tr>
                    <td style={S.tdLabel}>رقم المرجع</td>
                    <td style={{ ...S.tdValue, fontFamily: 'monospace' }}>{referenceNumber}</td>
                  </tr>
                )}
                <tr style={S.trAlt}>
                  <td style={S.tdLabel}>إجمالي الفاتورة</td>
                  <td style={S.tdValue}>{S.fmt(totalAmount)} {cur}</td>
                </tr>
                <tr style={S.trTotal}>
                  <td style={S.tdTotalLabel}>المتبقي</td>
                  <td style={S.tdTotalValue}>{S.fmt(remaining)} {cur}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section style={S.btnSection}>
            <Button className="fk-btn" style={S.btnPrimary} href={invoiceUrl || `${S.SITE_URL}/invoices`}>
              عرض الفاتورة
            </Button>
          </Section>

          <Hr style={S.divider} />
          <Section style={S.footerBox}>
            <Text style={S.footerSecure}>🔒 احتفظ بهذا الإشعار للرجوع إليه</Text>
            <Text style={S.footerText}>{S.SITE_NAME} — خدمات أكاديمية وبحثية موثوقة</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: E,
  subject: (d: Record<string, any>) => `✅ تم استلام دفعتك على الفاتورة ${d.invoiceNumber || ''}`,
  displayName: 'استلام دفعة على فاتورة',
  previewData: {
    customerName: 'محمد أحمد',
    invoiceNumber: 'INV-2026-0142',
    amountPaid: 800,
    remainingAmount: 925,
    totalAmount: 1725,
    paymentMethod: 'bank_transfer',
    paymentDate: '2026-09-17',
    referenceNumber: 'TRX-88213',
    currency: 'SAR',
    invoiceUrl: 'https://fekrahedu.com/invoices',
  },
} satisfies TemplateEntry
