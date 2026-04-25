import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'مسار الماستر'

interface Props {
  customerName?: string
  amount?: string
  paymentMethod?: string
  referenceNumber?: string
  requestId?: string
  requestedAt?: string
  walletUrl?: string
}

const E = ({ customerName, amount, paymentMethod, referenceNumber, requestId, requestedAt, walletUrl }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>{`تم استلام طلب شحن محفظتك بمبلغ ${amount ?? ''} ر.س — ${SITE_NAME}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Bank-style Header */}
        <Section style={bankHeader}>
          <Row>
            <Column>
              <Text style={bankBrand}>🏦 {SITE_NAME}</Text>
              <Text style={bankTagline}>المحفظة الرقمية</Text>
            </Column>
            <Column align="left">
              <Text style={bankBadge}>إشعار رسمي</Text>
            </Column>
          </Row>
        </Section>

        <Section style={statusBanner}>
          <Text style={statusIcon}>⏳</Text>
          <Heading style={statusTitle}>طلب شحن قيد المراجعة</Heading>
          <Text style={statusSubtitle}>تم استلام طلبك بنجاح وهو الآن قيد المعالجة</Text>
        </Section>

        <Text style={greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
        <Text style={text}>
          نشكر ثقتك بنا. تم استلام طلب شحن محفظتك الرقمية بنجاح وسيتم مراجعته من قبل فريقنا المالي
          خلال <strong>24 ساعة عمل</strong> كحدّ أقصى. ستصلك رسالة بريد إلكتروني فور اعتماد الطلب.
        </Text>

        {/* Bank-style Transaction Receipt Table */}
        <Section style={receiptCard}>
          <Text style={receiptTitle}>📄 تفاصيل العملية</Text>

          <table style={tbl} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr style={trAlt}>
                <td style={tdLabel}>رقم العملية</td>
                <td style={tdValue}>#{requestId || '—'}</td>
              </tr>
              <tr>
                <td style={tdLabel}>تاريخ الطلب</td>
                <td style={tdValue}>{requestedAt || new Date().toLocaleDateString('ar-SA')}</td>
              </tr>
              <tr style={trAlt}>
                <td style={tdLabel}>طريقة الدفع</td>
                <td style={tdValue}>{paymentMethod || 'تحويل بنكي'}</td>
              </tr>
              {referenceNumber && (
                <tr>
                  <td style={tdLabel}>رقم المرجع</td>
                  <td style={{ ...tdValue, fontFamily: 'monospace' }}>{referenceNumber}</td>
                </tr>
              )}
              <tr style={trTotal}>
                <td style={tdTotalLabel}>المبلغ المطلوب شحنه</td>
                <td style={tdTotalValue}>{amount || '0'} ر.س</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* Status timeline */}
        <Section style={timelineBox}>
          <Text style={timelineTitle}>مراحل المعالجة:</Text>
          <table style={tbl} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td style={stepDoneIcon}>✓</td>
                <td style={stepDoneText}>استلام الطلب</td>
              </tr>
              <tr>
                <td style={stepCurrentIcon}>◐</td>
                <td style={stepCurrentText}>مراجعة من الإدارة المالية</td>
              </tr>
              <tr>
                <td style={stepPendingIcon}>○</td>
                <td style={stepPendingText}>إيداع المبلغ في محفظتك</td>
              </tr>
              <tr>
                <td style={stepPendingIcon}>○</td>
                <td style={stepPendingText}>إشعار التأكيد عبر البريد</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section style={btnSection}>
          <Button style={btnPrimary} href={walletUrl || 'https://masteredupath.com/wallet'}>
            متابعة الطلب من المحفظة
          </Button>
        </Section>

        <Section style={infoNote}>
          <Text style={infoNoteText}>
            💡 <strong>ملاحظة مهمة:</strong> لن يتم إضافة المبلغ إلى رصيدك حتى يتم اعتماد الطلب من قبل
            الإدارة المالية. سيتم إشعارك فور اكتمال المعالجة.
          </Text>
        </Section>

        <Hr style={divider} />

        <Section style={footerBox}>
          <Text style={footerSecure}>🔒 معاملاتك محمية بأعلى معايير الأمان</Text>
          <Text style={footer}>{SITE_NAME} — خدمات أكاديمية ومالية موثوقة</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: E,
  subject: '⏳ طلب شحن المحفظة قيد المراجعة',
  displayName: 'طلب شحن محفظة (مستلم)',
  previewData: {
    customerName: 'محمد أحمد',
    amount: '1,500',
    paymentMethod: 'تحويل بنكي',
    referenceNumber: 'TRX-2024-001',
    requestId: 'a1b2c3d4',
    requestedAt: new Date().toLocaleDateString('ar-SA'),
    walletUrl: 'https://masteredupath.com/wallet',
  },
} satisfies TemplateEntry

// ===== Bank-inspired styles =====
const main = { backgroundColor: '#f1f5f9', fontFamily: "'IBM Plex Sans Arabic', Arial, sans-serif", margin: 0, padding: '20px 0' }
const container = { padding: '0', maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' as const, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }

const bankHeader = { background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)', padding: '24px 28px', color: '#fff' }
const bankBrand = { fontSize: '20px', fontWeight: '800' as const, color: '#fff', margin: 0 }
const bankTagline = { fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0' }
const bankBadge = { display: 'inline-block' as const, backgroundColor: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: '11px', fontWeight: '700' as const, padding: '6px 12px', borderRadius: '20px', margin: 0 }

const statusBanner = { backgroundColor: '#fffbeb', borderBottom: '3px solid #f59e0b', padding: '24px 28px', textAlign: 'center' as const }
const statusIcon = { fontSize: '40px', margin: 0, lineHeight: 1 }
const statusTitle = { fontSize: '20px', fontWeight: '800' as const, color: '#78350f', margin: '8px 0 4px' }
const statusSubtitle = { fontSize: '13px', color: '#92400e', margin: 0 }

const greeting = { fontSize: '15px', color: '#1e293b', fontWeight: '700' as const, margin: '24px 28px 8px', textAlign: 'right' as const }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.8', margin: '0 28px 20px', textAlign: 'right' as const }

const receiptCard = { margin: '16px 28px', padding: '20px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px' }
const receiptTitle = { fontSize: '14px', fontWeight: '800' as const, color: '#1e293b', margin: '0 0 14px', textAlign: 'right' as const }

const tbl = { width: '100%', borderCollapse: 'collapse' as const }
const trAlt = { backgroundColor: '#ffffff' }
const trTotal = { background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)' }
const tdLabel = { padding: '10px 12px', fontSize: '13px', color: '#64748b', textAlign: 'right' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '600' as const }
const tdValue = { padding: '10px 12px', fontSize: '13px', color: '#0f172a', textAlign: 'left' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '700' as const }
const tdTotalLabel = { padding: '14px 12px', fontSize: '14px', color: '#fff', textAlign: 'right' as const, fontWeight: '700' as const }
const tdTotalValue = { padding: '14px 12px', fontSize: '18px', color: '#fff', textAlign: 'left' as const, fontWeight: '900' as const }

const timelineBox = { margin: '16px 28px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }
const timelineTitle = { fontSize: '13px', fontWeight: '700' as const, color: '#1e40af', margin: '0 0 10px', textAlign: 'right' as const }
const stepDoneIcon = { width: '24px', padding: '4px', fontSize: '14px', color: '#10b981', fontWeight: '900' as const, textAlign: 'center' as const }
const stepDoneText = { padding: '4px 8px', fontSize: '12px', color: '#065f46', textAlign: 'right' as const }
const stepCurrentIcon = { width: '24px', padding: '4px', fontSize: '14px', color: '#f59e0b', fontWeight: '900' as const, textAlign: 'center' as const }
const stepCurrentText = { padding: '4px 8px', fontSize: '12px', color: '#78350f', fontWeight: '700' as const, textAlign: 'right' as const }
const stepPendingIcon = { width: '24px', padding: '4px', fontSize: '14px', color: '#94a3b8', textAlign: 'center' as const }
const stepPendingText = { padding: '4px 8px', fontSize: '12px', color: '#94a3b8', textAlign: 'right' as const }

const btnSection = { textAlign: 'center' as const, padding: '8px 28px 24px' }
const btnPrimary = { background: 'linear-gradient(135deg, #1e3a8a, #3730a3)', color: '#fff', padding: '14px 36px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' as const, textDecoration: 'none', display: 'inline-block' as const }

const infoNote = { margin: '0 28px 24px', padding: '14px', backgroundColor: '#fef3c7', borderRight: '4px solid #f59e0b', borderRadius: '8px' }
const infoNoteText = { fontSize: '12px', color: '#78350f', margin: 0, lineHeight: '1.7', textAlign: 'right' as const }

const divider = { borderColor: '#e5e7eb', margin: '0' }
const footerBox = { padding: '20px 28px', backgroundColor: '#f8fafc', textAlign: 'center' as const }
const footerSecure = { fontSize: '11px', color: '#10b981', fontWeight: '700' as const, margin: '0 0 6px' }
const footer = { fontSize: '11px', color: '#94a3b8', margin: 0 }
