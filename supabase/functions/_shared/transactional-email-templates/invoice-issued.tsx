import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import * as S from './_invoice-shared.ts'
import { HEAD_CSS } from './_head.ts'

interface Item {
  item_name?: string
  quantity?: number
  unit_price?: number | string
  total_price?: number | string
}

interface Props {
  customerName?: string
  invoiceNumber?: string
  issueDate?: string
  dueDate?: string
  subtotal?: string | number
  taxAmount?: string | number
  discountAmount?: string | number
  totalAmount?: string | number
  remainingAmount?: string | number
  currency?: string
  items?: Item[]
  customMessage?: string
  invoiceUrl?: string
}

const E = ({
  customerName, invoiceNumber, issueDate, dueDate, subtotal, taxAmount, discountAmount,
  totalAmount, remainingAmount, currency, items, customMessage, invoiceUrl,
}: Props) => {
  const cur = currency === 'USD' ? '$' : 'ر.س'
  const list = Array.isArray(items) ? items : []
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{HEAD_CSS}</style>
      </Head>
      <Preview>{`فاتورة ${invoiceNumber ?? ''} بمبلغ ${S.fmt(totalAmount)} ${cur} — ${S.SITE_NAME}`}</Preview>
      <Body dir="rtl" style={S.main}>
        <Container dir="rtl" style={S.container}>
          <Section style={S.header}>
            <Row>
              <Column>
                <Text style={S.brand}>🏦 {S.SITE_NAME}</Text>
                <Text style={S.tagline}>فاتورة جديدة صادرة باسمك</Text>
              </Column>
              <Column align="right">
                <Text style={S.badge}>فاتورة {invoiceNumber || ''}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={S.heroBox('#eff6ff', '#3b82f6')}>
            <Text style={S.heroLabel('#1e3a8a')}>المبلغ الإجمالي المستحق</Text>
            <Heading style={S.heroAmount('#1d4ed8')}>
              {S.fmt(totalAmount)} <span style={S.heroCurrency}>{cur}</span>
            </Heading>
            {dueDate && <Text style={S.heroNote('#1e3a8a')}>📅 تاريخ الاستحقاق: <strong>{dueDate}</strong></Text>}
          </Section>

          <Text style={S.greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
          {customMessage
            ? <Text style={S.noteBox}>{customMessage}</Text>
            : <Text style={S.text}>
                نرفق لك تفاصيل الفاتورة الصادرة من {S.SITE_NAME}. يمكنك مراجعتها وسدادها مباشرة
                من حسابك عبر المحفظة الرقمية أو التحويل البنكي.
              </Text>}

          {list.length > 0 && (
            <Section style={S.card}>
              <Text style={S.cardTitle}>📄 بنود الفاتورة</Text>
              <table style={S.tbl} cellPadding={0} cellSpacing={0}>
                <tbody>
                  {list.map((it, i) => (
                    <tr key={i} style={i % 2 === 0 ? S.trAlt : undefined}>
                      <td style={S.tdLabel}>{it.item_name || '—'} × {it.quantity ?? 1}</td>
                      <td style={S.tdValue}>{S.fmt(it.total_price)} {cur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          <Section style={S.card}>
            <Text style={S.cardTitle}>💰 ملخص المبالغ</Text>
            <table style={S.tbl} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr style={S.trAlt}>
                  <td style={S.tdLabel}>المجموع الفرعي</td>
                  <td style={S.tdValue}>{S.fmt(subtotal)} {cur}</td>
                </tr>
                {Number(taxAmount ?? 0) > 0 && (
                  <tr>
                    <td style={S.tdLabel}>ضريبة القيمة المضافة</td>
                    <td style={S.tdValue}>{S.fmt(taxAmount)} {cur}</td>
                  </tr>
                )}
                {Number(discountAmount ?? 0) > 0 && (
                  <tr style={S.trAlt}>
                    <td style={S.tdLabel}>الخصم</td>
                    <td style={{ ...S.tdValue, color: '#16a34a' }}>− {S.fmt(discountAmount)} {cur}</td>
                  </tr>
                )}
                <tr>
                  <td style={S.tdLabel}>تاريخ الإصدار</td>
                  <td style={S.tdValue}>{issueDate || '—'}</td>
                </tr>
                <tr style={S.trTotal}>
                  <td style={S.tdTotalLabel}>المتبقي للسداد</td>
                  <td style={S.tdTotalValue}>{S.fmt(remainingAmount ?? totalAmount)} {cur}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section style={S.btnSection}>
            <Button style={S.btnPrimary} href={invoiceUrl || `${S.SITE_URL}/invoices`}>
              عرض الفاتورة والدفع
            </Button>
            <Text style={{ margin: '12px 0 0', fontSize: '12px' }}>
              <a href={`${S.SITE_URL}/invoices`} style={S.linkSecondary}>📁 كل فواتيري</a>
            </Text>
          </Section>

          <Hr style={S.divider} />
          <Section style={S.footerBox}>
            <Text style={S.footerSecure}>🔒 معاملاتك محمية بأعلى معايير الأمان</Text>
            <Text style={S.footerText}>{S.SITE_NAME} — خدمات أكاديمية وبحثية موثوقة</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: E,
  subject: (d: Record<string, any>) => `🧾 فاتورة ${d.invoiceNumber || ''} من ${S.SITE_NAME}`,
  displayName: 'إصدار فاتورة جديدة',
  previewData: {
    customerName: 'محمد أحمد',
    invoiceNumber: 'INV-2026-0142',
    issueDate: '2026-09-17',
    dueDate: '2026-09-30',
    subtotal: 1500,
    taxAmount: 225,
    discountAmount: 0,
    totalAmount: 1725,
    remainingAmount: 1725,
    currency: 'SAR',
    items: [
      { item_name: 'ترجمة أكاديمية متخصصة', quantity: 1, unit_price: 900, total_price: 900 },
      { item_name: 'تدقيق لغوي', quantity: 2, unit_price: 300, total_price: 600 },
    ],
    invoiceUrl: 'https://fekrahedu.com/invoices',
  },
} satisfies TemplateEntry
