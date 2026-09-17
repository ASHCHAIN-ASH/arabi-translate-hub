import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'FekrahEdu'

interface Props {
  customerName?: string
  amount?: string
  requestId?: string
  rejectedAt?: string
  paymentMethod?: string
  reason?: string
  walletUrl?: string
  supportUrl?: string
}

const E = ({ customerName, amount, requestId, rejectedAt, paymentMethod, reason, walletUrl, supportUrl }: Props) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>{`تعذّر اعتماد طلب شحن محفظتك بمبلغ ${amount ?? ''} ر.س — ${SITE_NAME}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={bankHeader}>
          <Row>
            <Column>
              <Text style={bankBrand}>🏦 {SITE_NAME}</Text>
              <Text style={bankTagline}>إشعار حالة طلب</Text>
            </Column>
            <Column align="left">
              <Text style={bankBadge}>غير معتمد</Text>
            </Column>
          </Row>
        </Section>

        <Section style={statusBanner}>
          <Text style={statusIcon}>⚠️</Text>
          <Heading style={statusTitle}>تعذّر اعتماد الطلب</Heading>
          <Text style={statusSubtitle}>لم تتم إضافة المبلغ إلى رصيد محفظتك</Text>
        </Section>

        <Text style={greeting}>عزيزي/عزيزتي {customerName || 'العميل'}،</Text>
        <Text style={text}>
          نأسف لإبلاغك بأنه لم نتمكن من اعتماد طلب شحن محفظتك. لم يتم خصم أي مبلغ من حسابك،
          ويمكنك إعادة تقديم الطلب في أي وقت بعد مراجعة الملاحظات أدناه.
        </Text>

        <Section style={receiptCard}>
          <Text style={receiptTitle}>📄 تفاصيل الطلب المرفوض</Text>

          <table style={tbl} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr style={trAlt}>
                <td style={tdLabel}>رقم العملية</td>
                <td style={{ ...tdValue, fontFamily: 'monospace' }}>#{requestId || '—'}</td>
              </tr>
              <tr>
                <td style={tdLabel}>المبلغ المطلوب</td>
                <td style={tdValue}>{amount || '0'} ر.س</td>
              </tr>
              <tr style={trAlt}>
                <td style={tdLabel}>طريقة الدفع</td>
                <td style={tdValue}>{paymentMethod || 'تحويل بنكي'}</td>
              </tr>
              <tr>
                <td style={tdLabel}>تاريخ المراجعة</td>
                <td style={tdValue}>{rejectedAt || new Date().toLocaleDateString('ar-SA')}</td>
              </tr>
              <tr style={trTotal}>
                <td style={tdTotalLabel}>الحالة النهائية</td>
                <td style={tdTotalValue}>غير معتمد</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {reason && (
          <Section style={reasonBox}>
            <Text style={reasonTitle}>📝 سبب الرفض / ملاحظات الإدارة:</Text>
            <Text style={reasonText}>{reason}</Text>
          </Section>
        )}

        <Section style={solutionsBox}>
          <Text style={solutionsTitle}>💡 خطوات المعالجة المقترحة</Text>
          <table style={tbl} cellPadding={0} cellSpacing={0}>
            <tbody>
              <tr>
                <td style={solIcon}>1️⃣</td>
                <td style={solText}>راجع تفاصيل التحويل وتأكد من إرسال المبلغ بشكل صحيح</td>
              </tr>
              <tr>
                <td style={solIcon}>2️⃣</td>
                <td style={solText}>تأكد من إدخال رقم المرجع/الحوالة بشكل دقيق</td>
              </tr>
              <tr>
                <td style={solIcon}>3️⃣</td>
                <td style={solText}>أعد تقديم الطلب من المحفظة مع البيانات الصحيحة</td>
              </tr>
              <tr>
                <td style={solIcon}>4️⃣</td>
                <td style={solText}>تواصل مع فريق الدعم إذا احتجت أي مساعدة</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section style={btnSection}>
          <Button style={btnPrimary} href={walletUrl || 'https://fekrahedu.com/wallet'}>
            إعادة تقديم الطلب
          </Button>
          <Button style={btnSecondary} href={supportUrl || 'https://fekrahedu.com/support/tickets'}>
            تواصل مع الدعم
          </Button>
        </Section>

        <Hr style={divider} />

        <Section style={footerBox}>
          <Text style={footerSecure}>🔒 لم يتم خصم أي مبلغ من حسابك</Text>
          <Text style={footer}>{SITE_NAME} — نحن هنا لمساعدتك</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: E,
  subject: '⚠️ تعذّر اعتماد طلب شحن المحفظة',
  displayName: 'رفض طلب شحن المحفظة',
  previewData: {
    customerName: 'محمد أحمد',
    amount: '1,500',
    requestId: 'a1b2c3d4',
    rejectedAt: new Date().toLocaleDateString('ar-SA'),
    paymentMethod: 'تحويل بنكي',
    reason: 'لم نتمكن من العثور على الحوالة المرسلة. يرجى التأكد من رقم المرجع.',
    walletUrl: 'https://fekrahedu.com/wallet',
    supportUrl: 'https://fekrahedu.com/support/tickets',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#f1f5f9', fontFamily: "'IBM Plex Sans Arabic', Arial, sans-serif", margin: 0, padding: '20px 0' }
const container = { padding: '0', maxWidth: '620px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' as const, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }

const bankHeader = { background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', padding: '24px 28px', color: '#fff' }
const bankBrand = { fontSize: '20px', fontWeight: '800' as const, color: '#fff', margin: 0 }
const bankTagline = { fontSize: '12px', color: '#fecaca', margin: '4px 0 0' }
const bankBadge = { display: 'inline-block' as const, backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '11px', fontWeight: '700' as const, padding: '6px 12px', borderRadius: '20px', margin: 0 }

const statusBanner = { backgroundColor: '#fef2f2', borderBottom: '3px solid #ef4444', padding: '24px 28px', textAlign: 'center' as const }
const statusIcon = { fontSize: '40px', margin: 0, lineHeight: 1 }
const statusTitle = { fontSize: '20px', fontWeight: '800' as const, color: '#7f1d1d', margin: '8px 0 4px' }
const statusSubtitle = { fontSize: '13px', color: '#991b1b', margin: 0 }

const greeting = { fontSize: '15px', color: '#1e293b', fontWeight: '700' as const, margin: '24px 28px 8px', textAlign: 'right' as const }
const text = { fontSize: '14px', color: '#475569', lineHeight: '1.8', margin: '0 28px 20px', textAlign: 'right' as const }

const receiptCard = { margin: '16px 28px', padding: '20px', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px' }
const receiptTitle = { fontSize: '14px', fontWeight: '800' as const, color: '#1e293b', margin: '0 0 14px', textAlign: 'right' as const }

const tbl = { width: '100%', borderCollapse: 'collapse' as const }
const trAlt = { backgroundColor: '#ffffff' }
const trTotal = { background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)' }
const tdLabel = { padding: '10px 12px', fontSize: '13px', color: '#64748b', textAlign: 'right' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '600' as const }
const tdValue = { padding: '10px 12px', fontSize: '13px', color: '#0f172a', textAlign: 'left' as const, borderBottom: '1px solid #e2e8f0', fontWeight: '700' as const }
const tdTotalLabel = { padding: '14px 12px', fontSize: '14px', color: '#fff', textAlign: 'right' as const, fontWeight: '700' as const }
const tdTotalValue = { padding: '14px 12px', fontSize: '16px', color: '#fff', textAlign: 'left' as const, fontWeight: '900' as const }

const reasonBox = { margin: '0 28px 16px', padding: '16px', backgroundColor: '#fef3c7', borderRight: '4px solid #f59e0b', borderRadius: '8px' }
const reasonTitle = { fontSize: '13px', fontWeight: '800' as const, color: '#78350f', margin: '0 0 6px', textAlign: 'right' as const }
const reasonText = { fontSize: '13px', color: '#78350f', margin: 0, lineHeight: '1.7', textAlign: 'right' as const }

const solutionsBox = { margin: '16px 28px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }
const solutionsTitle = { fontSize: '13px', fontWeight: '800' as const, color: '#1e40af', margin: '0 0 10px', textAlign: 'right' as const }
const solIcon = { width: '32px', padding: '6px', fontSize: '14px', textAlign: 'center' as const, verticalAlign: 'top' as const }
const solText = { padding: '8px', fontSize: '13px', color: '#1e3a8a', textAlign: 'right' as const, lineHeight: '1.6' }

const btnSection = { textAlign: 'center' as const, padding: '8px 28px 24px' }
const btnPrimary = { background: 'linear-gradient(135deg, #1e3a8a, #3730a3)', color: '#fff', padding: '12px 28px', borderRadius: '10px', fontSize: '13px', fontWeight: '700' as const, textDecoration: 'none', display: 'inline-block' as const, margin: '0 4px' }
const btnSecondary = { backgroundColor: '#ffffff', color: '#1e3a8a', padding: '12px 28px', borderRadius: '10px', fontSize: '13px', fontWeight: '700' as const, textDecoration: 'none', display: 'inline-block' as const, border: '2px solid #1e3a8a', margin: '0 4px' }

const divider = { borderColor: '#e5e7eb', margin: '0' }
const footerBox = { padding: '20px 28px', backgroundColor: '#f8fafc', textAlign: 'center' as const }
const footerSecure = { fontSize: '11px', color: '#10b981', fontWeight: '700' as const, margin: '0 0 6px' }
const footer = { fontSize: '11px', color: '#94a3b8', margin: 0 }
