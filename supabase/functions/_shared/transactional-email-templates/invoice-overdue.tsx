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
  remainingAmount?: string | number
  dueDate?: string
  daysOverdue?: number | string
  currency?: string
  invoiceUrl?: string
}

const E = ({ customerName, invoiceNumber, remainingAmount, dueDate, daysOverdue, currency, invoiceUrl }: Props) => {
  const cur = currency === 'USD' ? '$' : 'ر.س'
  const days = Number(daysOverdue ?? 0)
  const isLate = days > 0
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{HEAD_CSS}</style>
      </Head>
      <Preview>{`${isLate ? 'تذكير بتأخر سداد' : 'تذكير باستحقاق'} الفاتورة ${invoiceNumber ?? ''}`}</Preview>
      <Body dir="rtl" style={S.main}>
        <Container dir="rtl" className="fk-shell" style={S.container}>
          <Section style={S.header}>
            <Row>
              <Column>
                <Img src={LOGO_URL} width="42" height="42" alt="FekrahEdu" style={{ borderRadius: '10px', backgroundColor: '#fff', marginBottom: '8px' }} />
                <Text style={S.brand}>{S.SITE_NAME}</Text>
                <Text style={S.tagline}>تذكير بسداد فاتورة</Text>
              </Column>
              <Column align="right">
                <Text style={S.badge}>{isLate ? '⚠️ متأخرة' : '⏳ تستحق قريباً'}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={S.heroBox('#fffbeb', '#f59e0b')}>
            <Text style={S.heroLabel('#92400e')}>المبلغ المتبقي للسداد</Text>
            <Heading style={S.heroAmount('#b45309')}>
              {S.fmt(remainingAmount)} <span style={S.heroCurrency}>{cur}</span>
            </Heading>
            <Text style={S.heroNote('#92400e')}>
              {isLate
                ? <>تأخر السداد <strong>{days}</strong> يوماً عن تاريخ الاستحقاق</>
                : <>تاريخ الاستحقاق: <strong>{dueDate || '—'}</strong></>}
            </Text>
          </Section>

          <Text style={S.greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
          <Text style={S.text}>
            نذكّرك بأن الفاتورة رقم <strong>{invoiceNumber || '—'}</strong> ما زالت غير مسددة.
            يمكنك إتمام السداد خلال دقائق من حسابك عبر المحفظة الرقمية أو التحويل البنكي.
            إذا كنت قد سددت المبلغ بالفعل، يرجى تجاهل هذه الرسالة.
          </Text>

          <Section style={S.card}>
            <Text style={S.cardTitle}>📄 بيانات الفاتورة</Text>
            <table style={S.tbl} cellPadding={0} cellSpacing={0}>
              <tbody>
                <tr style={S.trAlt}>
                  <td style={S.tdLabel}>رقم الفاتورة</td>
                  <td style={{ ...S.tdValue, fontFamily: 'monospace', color: '#1d4ed8' }}>{invoiceNumber || '—'}</td>
                </tr>
                <tr>
                  <td style={S.tdLabel}>تاريخ الاستحقاق</td>
                  <td style={S.tdValue}>{dueDate || '—'}</td>
                </tr>
                <tr style={S.trTotal}>
                  <td style={S.tdTotalLabel}>المطلوب سداده</td>
                  <td style={S.tdTotalValue}>{S.fmt(remainingAmount)} {cur}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section style={S.btnSection}>
            <Button className="fk-btn" style={S.btnPrimary} href={invoiceUrl || `${S.SITE_URL}/invoices`}>
              سداد الفاتورة الآن
            </Button>
          </Section>

          <Hr style={S.divider} />
          <Section style={S.footerBox}>
            <Text style={S.footerSecure}>🔒 للاستفسار تواصل مع فريق الحسابات</Text>
            <Text style={S.footerText}>{S.SITE_NAME} — خدمات أكاديمية وبحثية موثوقة</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: E,
  subject: (d: Record<string, any>) =>
    Number(d.daysOverdue ?? 0) > 0
      ? `⚠️ تذكير: الفاتورة ${d.invoiceNumber || ''} متأخرة السداد`
      : `⏳ تذكير باستحقاق الفاتورة ${d.invoiceNumber || ''}`,
  displayName: 'تذكير بسداد فاتورة',
  previewData: {
    customerName: 'محمد أحمد',
    invoiceNumber: 'INV-2026-0142',
    remainingAmount: 925,
    dueDate: '2026-09-10',
    daysOverdue: 7,
    currency: 'SAR',
    invoiceUrl: 'https://fekrahedu.com/invoices',
  },
} satisfies TemplateEntry
