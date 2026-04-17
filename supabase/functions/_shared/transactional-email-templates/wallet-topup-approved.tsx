import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'مسار الماستر'

interface Props {
  customerName?: string
  amount?: string
  newBalance?: string
  requestId?: string
  approvedAt?: string
  paymentMethod?: string
  walletUrl?: string
}

const E = ({ customerName, amount, newBalance, requestId, approvedAt, paymentMethod, walletUrl }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>✅ تم إيداع {amount} ر.س في محفظتك بنجاح — {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={bankHeader}>
          <Row>
            <Column>
              <Text style={bankBrand}>🏦 {SITE_NAME}</Text>
              <Text style={bankTagline}>إشعار إيداع رسمي</Text>
            </Column>
            <Column align="left">
              <Text style={bankBadge}>✓ مكتمل</Text>
            </Column>
          </Row>
        </Section>

        <Section style={statusBanner}>
          <Text style={statusIcon}>✅</Text>
          <Heading style={statusTitle}>تم إيداع المبلغ بنجاح</Heading>
          <Text style={statusSubtitle}>تمت معالجة طلب الشحن واعتماده من قبل الإدارة المالية</Text>
        </Section>

        {/* Big amount display */}
        <Section style={amountHero}>
          <Text style={amountLabel}>المبلغ المُودع</Text>
          <Text style={amountBig}>+ {amount || '0'} <span style={amountCurrency}>ر.س</span></Text>
          {newBalance && (
            <Text style={balanceAfter}>
              💼 الرصيد الحالي: <strong>{newBalance} ر.س</strong>
            </Text>
          )}
        </Section>

        <Text style={greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
        <Text style={text}>
          يسعدنا إخبارك بأنه قد تم اعتماد طلب شحن محفظتك وإيداع المبلغ بنجاح. يمكنك الآن استخدام رصيدك
          لدفع الفواتير وطلب الخدمات الأكاديمية.
        </Text>

        <Section style={receiptCard}>
          <Text style={receiptTitle}>📄 إيصال العملية</Text>

          <table style={tbl} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr style={trAlt}>
                <td style={tdLabel}>نوع العملية</td>
                <td style={tdValue}>إيداع - شحن محفظة</td>
              </tr>
              <tr>
                <td style={tdLabel}>رقم العملية</td>
                <td style={{ ...tdValue, fontFamily: 'monospace' }}>#{requestId || '—'}</td>
              </tr>
              <tr style={trAlt}>
                <td style={tdLabel}>تاريخ الاعتماد</td>
                <td style={tdValue}>{approvedAt || new Date().toLocaleDateString('ar-SA')}</td>
              </tr>
              <tr>
                <td style={tdLabel}>طريقة الدفع</td>
                <td style={tdValue}>{paymentMethod || 'تحويل بنكي'}</td>
              </tr>
              <tr style={trAlt}>
                <td style={tdLabel}>الحالة</td>
                <td style={{ ...tdValue, color: '#059669' }}>✓ مكتملة</td>
              </tr>
              <tr style={trTotal}>
                <td style={tdTotalLabel}>إجمالي المبلغ المُودع</td>
                <td style={tdTotalValue}>{amount || '0'} ر.س</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section style={featuresBox}>
          <Text style={featuresTitle}>✨ ماذا يمكنك فعله الآن؟</Text>
          <table style={tbl} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td style={featIcon}>💳</td>
                <td style={featText}>دفع فواتيرك المستحقة فورياً من رصيدك</td>
              </tr>
              <tr>
                <td style={featIcon}>📚</td>
                <td style={featText}>طلب خدمات أكاديمية جديدة بسهولة</td>
              </tr>
              <tr>
                <td style={featIcon}>📊</td>
                <td style={featText}>متابعة جميع حركاتك المالية لحظياً</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section style={btnSection}>
          <Button style={btnPrimary} href={walletUrl || 'https://masteredupath.com/wallet'}>
            عرض المحفظة والرصيد
          </Button>
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
  subject: '✅ تم إيداع المبلغ في محفظتك بنجاح',
  displayName: 'موافقة على شحن المحفظة',
  previewData: {
    customerName: 'محمد أحمد',
    amount: '1,500',
    newBalance: '3,750',
    requestId: 'a1b2c3d4',
    approvedAt: new Date().toLocaleDateString('ar-SA'),
    paymentMethod: 'تحويل بنكي',
    walletUrl: 'https://masteredupath.com/wallet',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#f1f5f9', fontFamily: "'IBM Plex Sans Arabic', Arial, sans-serif", margin: 0, padding: '20px 0' }
const container = { padding: '0', maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' as const, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }

const bankHeader = { background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: '24px 28px', color: '#fff' }
const bankBrand = { fontSize: '20px', fontWeight: '800' as const, color: '#fff', margin: 0 }
const bankTagline = { fontSize: '12px', color: '#a7f3d0', margin: '4px 0 0' }
const bankBadge = { display: 'inline-block' as const, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '11px', fontWeight: '700' as const, padding: '6px 12px', borderRadius: '20px', margin: 0 }

const statusBanner = { backgroundColor: '#ecfdf5', borderBottom: '3px solid #10b981', padding: '24px 28px', textAlign: 'center' as const }
const statusIcon = { fontSize: '46px', margin: 0, lineHeight: 1 }
const statusTitle = { fontSize: '22px', fontWeight: '800' as const, color: '#064e3b', margin: '8px 0 4px' }
const statusSubtitle = { fontSize: '13px', color: '#047857', margin: 0 }

const amountHero = { margin: '24px 28px', padding: '24px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '2px solid #10b981', borderRadius: '14px', textAlign: 'center' as const }
const amountLabel = { fontSize: '12px', color: '#065f46', fontWeight: '700' as const, margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '1px' }
const amountBig = { fontSize: '40px', fontWeight: '900' as const, color: '#059669', margin: 0, lineHeight: 1 }
const amountCurrency = { fontSize: '20px', fontWeight: '700' as const }
const balanceAfter = { fontSize: '13px', color: '#065f46', margin: '12px 0 0' }

const greeting = { fontSize: '15px', color: '#1e293b', fontWeight: '700' as const, margin: '0 28px 8px', textAlign: 'right' as const }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.8', margin: '0 28px 20px', textAlign: 'right' as const }

const receiptCard = { margin: '16px 28px', padding: '20px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px' }
const receiptTitle = { fontSize: '14px', fontWeight: '800' as const, color: '#1e293b', margin: '0 0 14px', textAlign: 'right' as const }

const tbl = { width: '100%', borderCollapse: 'collapse' as const }
const trAlt = { backgroundColor: '#ffffff' }
const trTotal = { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
const tdLabel = { padding: '10px 12px', fontSize: '13px', color: '#64748b', textAlign: 'right' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '600' as const }
const tdValue = { padding: '10px 12px', fontSize: '13px', color: '#0f172a', textAlign: 'left' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '700' as const }
const tdTotalLabel = { padding: '14px 12px', fontSize: '14px', color: '#fff', textAlign: 'right' as const, fontWeight: '700' as const }
const tdTotalValue = { padding: '14px 12px', fontSize: '18px', color: '#fff', textAlign: 'left' as const, fontWeight: '900' as const }

const featuresBox = { margin: '16px 28px', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }
const featuresTitle = { fontSize: '13px', fontWeight: '800' as const, color: '#065f46', margin: '0 0 10px', textAlign: 'right' as const }
const featIcon = { width: '32px', padding: '6px', fontSize: '18px', textAlign: 'center' as const, verticalAlign: 'top' as const }
const featText = { padding: '8px', fontSize: '13px', color: '#065f46', textAlign: 'right' as const, lineHeight: '1.6' }

const btnSection = { textAlign: 'center' as const, padding: '8px 28px 24px' }
const btnPrimary = { background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', padding: '14px 36px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' as const, textDecoration: 'none', display: 'inline-block' as const }

const divider = { borderColor: '#e5e7eb', margin: '0' }
const footerBox = { padding: '20px 28px', backgroundColor: '#f8fafc', textAlign: 'center' as const }
const footerSecure = { fontSize: '11px', color: '#10b981', fontWeight: '700' as const, margin: '0 0 6px' }
const footer = { fontSize: '11px', color: '#94a3b8', margin: 0 }
