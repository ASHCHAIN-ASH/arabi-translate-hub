import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'FekrahEdu'

interface Props {
  customerName?: string
  invoiceNumber?: string
  amount?: string
  newBalance?: string
  paidAt?: string
  transactionId?: string
  invoiceUrl?: string
  walletUrl?: string
}

const E = ({ customerName, invoiceNumber, amount, newBalance, paidAt, transactionId, invoiceUrl, walletUrl }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>{`💳 تم دفع الفاتورة ${invoiceNumber ?? ''} بمبلغ ${amount ?? ''} ر.س من محفظتك — ${SITE_NAME}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={bankHeader}>
          <Row>
            <Column>
              <Text style={bankBrand}>🏦 {SITE_NAME}</Text>
              <Text style={bankTagline}>إيصال دفع فاتورة من المحفظة</Text>
            </Column>
            <Column align="left">
              <Text style={bankBadge}>✓ مدفوعة</Text>
            </Column>
          </Row>
        </Section>

        <Section style={statusBanner}>
          <Text style={statusIcon}>💳</Text>
          <Heading style={statusTitle}>تم دفع فاتورتك بنجاح</Heading>
          <Text style={statusSubtitle}>تم خصم المبلغ من رصيد محفظتك الرقمية فورياً</Text>
        </Section>

        <Section style={amountHero}>
          <Text style={amountLabel}>المبلغ المخصوم</Text>
          <Text style={amountBig}>− {amount || '0'} <span style={amountCurrency}>ر.س</span></Text>
          {newBalance && (
            <Text style={balanceAfter}>
              💼 رصيدك المتبقي: <strong>{newBalance} ر.س</strong>
            </Text>
          )}
        </Section>

        <Text style={greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
        <Text style={text}>
          نؤكد استلام دفعتك عبر المحفظة الرقمية لـ {SITE_NAME}. تم تسوية الفاتورة بالكامل
          وأصبحت في حالة "مدفوعة". هذا الإيصال هو سند رسمي للعملية.
        </Text>

        <Section style={receiptCard}>
          <Text style={receiptTitle}>📄 تفاصيل العملية</Text>

          <table style={tbl} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr style={trAlt}>
                <td style={tdLabel}>نوع العملية</td>
                <td style={tdValue}>دفع فاتورة من المحفظة</td>
              </tr>
              <tr>
                <td style={tdLabel}>رقم الفاتورة</td>
                <td style={{ ...tdValue, fontFamily: 'monospace', color: '#1d4ed8' }}>{invoiceNumber || '—'}</td>
              </tr>
              <tr style={trAlt}>
                <td style={tdLabel}>رقم العملية</td>
                <td style={{ ...tdValue, fontFamily: 'monospace' }}>#{transactionId || '—'}</td>
              </tr>
              <tr>
                <td style={tdLabel}>تاريخ الدفع</td>
                <td style={tdValue}>{paidAt || new Date().toLocaleString('ar-SA')}</td>
              </tr>
              <tr style={trAlt}>
                <td style={tdLabel}>طريقة الدفع</td>
                <td style={tdValue}>💼 المحفظة الرقمية</td>
              </tr>
              <tr>
                <td style={tdLabel}>الحالة</td>
                <td style={{ ...tdValue, color: '#1d4ed8' }}>✓ مكتملة فوراً</td>
              </tr>
              <tr style={trTotal}>
                <td style={tdTotalLabel}>إجمالي المبلغ المدفوع</td>
                <td style={tdTotalValue}>{amount || '0'} ر.س</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section style={featuresBox}>
          <Text style={featuresTitle}>💡 معلومات مهمة</Text>
          <table style={tbl} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td style={featIcon}>✅</td>
                <td style={featText}>تم تأكيد الدفع تلقائياً وتفعيل الخدمة</td>
              </tr>
              <tr>
                <td style={featIcon}>📥</td>
                <td style={featText}>يمكنك تنزيل الفاتورة المدفوعة من حسابك</td>
              </tr>
              <tr>
                <td style={featIcon}>🔔</td>
                <td style={featText}>احتفظ بهذا الإيصال للرجوع إليه عند الحاجة</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section style={btnSection}>
          <Button style={btnPrimary} href={invoiceUrl || 'https://fekrahedu.com/invoices'}>
            عرض الفاتورة المدفوعة
          </Button>
          <Text style={{ margin: '12px 0 0', fontSize: '12px' }}>
            <a href={walletUrl || 'https://fekrahedu.com/wallet'} style={linkSecondary}>
              💼 عرض حركة المحفظة
            </a>
          </Text>
        </Section>

        <Hr style={divider} />

        <Section style={footerBox}>
          <Text style={footerSecure}>🔒 معاملاتك محمية بأعلى معايير الأمان البنكي</Text>
          <Text style={footer}>{SITE_NAME} — خدمات أكاديمية ومالية موثوقة</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: E,
  subject: (d: Record<string, any>) => `💳 إيصال دفع فاتورة ${d.invoiceNumber || ''} من المحفظة`,
  displayName: 'دفع فاتورة من المحفظة',
  previewData: {
    customerName: 'محمد أحمد',
    invoiceNumber: 'INV-2025-0142',
    amount: '750.00',
    newBalance: '2,250.00',
    paidAt: new Date().toLocaleString('ar-SA'),
    transactionId: 'a1b2c3d4',
    invoiceUrl: 'https://fekrahedu.com/invoices',
    walletUrl: 'https://fekrahedu.com/wallet',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#f1f5f9', fontFamily: "'IBM Plex Sans Arabic', Arial, sans-serif", margin: 0, padding: '20px 0' }
const container = { padding: '0', maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' as const, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }

const bankHeader = { background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', padding: '24px 28px', color: '#fff' }
const bankBrand = { fontSize: '20px', fontWeight: '800' as const, color: '#fff', margin: 0 }
const bankTagline = { fontSize: '12px', color: '#bfdbfe', margin: '4px 0 0' }
const bankBadge = { display: 'inline-block' as const, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '11px', fontWeight: '700' as const, padding: '6px 12px', borderRadius: '20px', margin: 0 }

const statusBanner = { backgroundColor: '#eff6ff', borderBottom: '3px solid #3b82f6', padding: '24px 28px', textAlign: 'center' as const }
const statusIcon = { fontSize: '46px', margin: 0, lineHeight: 1 }
const statusTitle = { fontSize: '22px', fontWeight: '800' as const, color: '#1e3a8a', margin: '8px 0 4px' }
const statusSubtitle = { fontSize: '13px', color: '#1d4ed8', margin: 0 }

const amountHero = { margin: '24px 28px', padding: '24px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '2px solid #3b82f6', borderRadius: '14px', textAlign: 'center' as const }
const amountLabel = { fontSize: '12px', color: '#1e3a8a', fontWeight: '700' as const, margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '1px' }
const amountBig = { fontSize: '40px', fontWeight: '900' as const, color: '#1d4ed8', margin: 0, lineHeight: 1 }
const amountCurrency = { fontSize: '20px', fontWeight: '700' as const }
const balanceAfter = { fontSize: '13px', color: '#1e3a8a', margin: '12px 0 0' }

const greeting = { fontSize: '15px', color: '#1e293b', fontWeight: '700' as const, margin: '0 28px 8px', textAlign: 'right' as const }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.8', margin: '0 28px 20px', textAlign: 'right' as const }

const receiptCard = { margin: '16px 28px', padding: '20px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px' }
const receiptTitle = { fontSize: '14px', fontWeight: '800' as const, color: '#1e293b', margin: '0 0 14px', textAlign: 'right' as const }

const tbl = { width: '100%', borderCollapse: 'collapse' as const }
const trAlt = { backgroundColor: '#ffffff' }
const trTotal = { background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)' }
const tdLabel = { padding: '10px 12px', fontSize: '13px', color: '#64748b', textAlign: 'right' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '600' as const }
const tdValue = { padding: '10px 12px', fontSize: '13px', color: '#0f172a', textAlign: 'left' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '700' as const }
const tdTotalLabel = { padding: '14px 12px', fontSize: '14px', color: '#fff', textAlign: 'right' as const, fontWeight: '700' as const }
const tdTotalValue = { padding: '14px 12px', fontSize: '18px', color: '#fff', textAlign: 'left' as const, fontWeight: '900' as const }

const featuresBox = { margin: '16px 28px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }
const featuresTitle = { fontSize: '13px', fontWeight: '800' as const, color: '#1e3a8a', margin: '0 0 10px', textAlign: 'right' as const }
const featIcon = { width: '32px', padding: '6px', fontSize: '18px', textAlign: 'center' as const, verticalAlign: 'top' as const }
const featText = { padding: '8px', fontSize: '13px', color: '#1e3a8a', textAlign: 'right' as const, lineHeight: '1.6' }

const btnSection = { textAlign: 'center' as const, padding: '8px 28px 24px' }
const btnPrimary = { background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)', color: '#fff', padding: '14px 36px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' as const, textDecoration: 'none', display: 'inline-block' as const }
const linkSecondary = { color: '#1d4ed8', textDecoration: 'none', fontWeight: '700' as const }

const divider = { borderColor: '#e5e7eb', margin: '0' }
const footerBox = { padding: '20px 28px', backgroundColor: '#f8fafc', textAlign: 'center' as const }
const footerSecure = { fontSize: '11px', color: '#3b82f6', fontWeight: '700' as const, margin: '0 0 6px' }
const footer = { fontSize: '11px', color: '#94a3b8', margin: 0 }
