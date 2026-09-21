import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AdmissionClientEmailProps {
  fullName: string
  applicationNumber: string
}

export const AdmissionClientEmail = ({
  fullName,
  applicationNumber,
}: AdmissionClientEmailProps) => (
  <Html lang="ar" dir="rtl">
    <Head><style>{rtlCss}</style></Head>
    <Preview>تأكيد استلام طلب القبول الجامعي</Preview>
    <Body dir="rtl" style={main}>
      <Container dir="rtl" align="right" style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={h1}>FekrahEdu</Heading>
          <Text style={headerSubtitle}>
            شريكك المتخصص للحصول على القبول الجامعي
          </Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h2}>عزيزي/عزيزتي {fullName}</Heading>
          
          <Text style={text}>
            نشكركم على تقديم طلب الحصول على خدمات القبول الجامعي من خلال FekrahEdu.
          </Text>

          <Section style={applicationBox}>
            <Text style={applicationTitle}>تفاصيل الطلب</Text>
            <Text style={applicationNumber}>رقم الطلب: <strong>{applicationNumber}</strong></Text>
            <Text style={applicationStatus}>الحالة: <strong>قيد المراجعة</strong></Text>
          </Section>

          <Text style={text}>
            <strong>الخطوات التالية:</strong>
          </Text>
          
          <Section style={stepsSection}>
            <Text style={stepText}>١. سيقوم فريقنا الأكاديمي المتخصص بمراجعة طلبكم خلال 24 ساعة</Text>
            <Text style={stepText}>٢. سيتم التواصل معكم لتأكيد البيانات والمتطلبات الإضافية</Text>
            <Text style={stepText}>٣. سيتم إرسال عرض الأسعار التفصيلي بعد مراجعة الطلب</Text>
            <Text style={stepText}>٤. بعد الموافقة، سنبدأ العمل على إجراءات القبول فوراً</Text>
          </Section>

          <Text style={importantNote}>
            <strong>تنبيه مهم:</strong> خدمات القبول الجامعي مدفوعة الأجر. سيتم إرسال عرض الأسعار التفصيلي بعد مراجعة طلبكم والتأكد من صحة المعلومات.
          </Text>

          <Section style={contactSection}>
            <Text style={contactTitle}>للاستفسارات والمتابعة</Text>
            <Text style={contactInfo}>📧 البريد الإلكتروني: info@fekrahedu.com</Text>
            <Text style={contactInfo}>📱 الهاتف: 966559600824+</Text>
            <Text style={contactInfo}>📍 الموقع: المملكة العربية السعودية</Text>
          </Section>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            مع تحيات فريق FekrahEdu
          </Text>
          <Text style={footerSubtext}>
            نحن معكم لتحقيق أحلامكم الأكاديمية
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default AdmissionClientEmail

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  direction: 'rtl' as const,
  textAlign: 'right' as const,
}

const container = {
  direction: 'rtl' as const,
  textAlign: 'right' as const,
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const rtlCss = `
  html, body, table, tbody, tr, td, th, div, section, p, h1, h2, h3, a, span { direction: rtl !important; }
  body, table, td, th, p, h1, h2, h3 { font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif !important; }
  td, th, p, h1, h2, h3 { text-align: right; }
  table { border-spacing: 0; }
`

const header = {
  backgroundColor: '#1e40af',
  padding: '30px 20px',
  textAlign: 'center' as const,
  borderRadius: '8px 8px 0 0',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textAlign: 'center' as const,
}

const headerSubtitle = {
  color: '#e0e7ff',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
}

const content = {
  padding: '30px 20px',
}

const h2 = {
  color: '#1e40af',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
}

const applicationBox = {
  backgroundColor: '#f3f4f6',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '2px solid #1e40af',
}

const applicationTitle = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const applicationNumber = {
  color: '#374151',
  fontSize: '16px',
  margin: '8px 0',
}

const applicationStatus = {
  color: '#059669',
  fontSize: '16px',
  margin: '8px 0',
}

const stepsSection = {
  margin: '20px 0',
}

const stepText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '10px 0',
  paddingRight: '10px',
}

const importantNote = {
  backgroundColor: '#fef3cd',
  color: '#92400e',
  fontSize: '14px',
  padding: '15px',
  borderRadius: '6px',
  border: '1px solid #f59e0b',
  margin: '20px 0',
}

const contactSection = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  margin: '30px 0',
}

const contactTitle = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px',
}

const contactInfo = {
  color: '#374151',
  fontSize: '15px',
  margin: '8px 0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
}

const footer = {
  textAlign: 'center' as const,
  padding: '20px',
}

const footerText = {
  color: '#1e40af',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '10px 0',
}

const footerSubtext = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '5px 0',
}