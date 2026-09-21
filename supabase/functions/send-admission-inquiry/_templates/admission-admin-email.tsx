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

interface AdmissionAdminEmailProps {
  fullName: string
  email: string
  phone: string
  nationality: string
  currentEducation: string
  desiredField: string
  desiredUniversity: string
  gpa?: string
  englishLevel: string
  additionalInfo?: string
  hasScholarship: boolean
  applicationNumber: string
}

export const AdmissionAdminEmail = ({
  fullName,
  email,
  phone,
  nationality,
  currentEducation,
  desiredField,
  desiredUniversity,
  gpa,
  englishLevel,
  additionalInfo,
  hasScholarship,
  applicationNumber,
}: AdmissionAdminEmailProps) => (
  <Html lang="ar" dir="rtl">
    <Head><style>{rtlCss}</style></Head>
    <Preview>طلب قبول جامعي جديد - FekrahEdu</Preview>
    <Body dir="rtl" style={main}>
      <Container dir="rtl" align="right" style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={h1}>FekrahEdu</Heading>
          <Text style={headerSubtitle}>
            طلب قبول جامعي جديد
          </Text>
        </Section>

        {/* Application Details */}
        <Section style={content}>
          <Section style={applicationBox}>
            <Text style={applicationTitle}>تفاصيل الطلب</Text>
            <Text style={applicationNumber}>رقم الطلب: <strong>{applicationNumber}</strong></Text>
            <Text style={applicationDate}>تاريخ التقديم: <strong>{new Date().toLocaleDateString('ar-SA')}</strong></Text>
          </Section>

          <Heading style={h2}>المعلومات الشخصية</Heading>
          <Section style={infoSection}>
            <Row>
              <Column style={labelColumn}><Text style={label}>الاسم الكامل:</Text></Column>
              <Column style={valueColumn}><Text style={value}>{fullName}</Text></Column>
            </Row>
            <Row>
              <Column style={labelColumn}><Text style={label}>البريد الإلكتروني:</Text></Column>
              <Column style={valueColumn}><Text style={value}>{email}</Text></Column>
            </Row>
            <Row>
              <Column style={labelColumn}><Text style={label}>رقم الهاتف:</Text></Column>
              <Column style={valueColumn}><Text style={value}>{phone}</Text></Column>
            </Row>
            <Row>
              <Column style={labelColumn}><Text style={label}>الجنسية:</Text></Column>
              <Column style={valueColumn}><Text style={value}>{nationality}</Text></Column>
            </Row>
          </Section>

          <Heading style={h2}>المعلومات الأكاديمية</Heading>
          <Section style={infoSection}>
            <Row>
              <Column style={labelColumn}><Text style={label}>المستوى التعليمي الحالي:</Text></Column>
              <Column style={valueColumn}><Text style={value}>{currentEducation}</Text></Column>
            </Row>
            <Row>
              <Column style={labelColumn}><Text style={label}>التخصص المرغوب:</Text></Column>
              <Column style={valueColumn}><Text style={value}>{desiredField}</Text></Column>
            </Row>
            <Row>
              <Column style={labelColumn}><Text style={label}>الجامعة المرغوبة:</Text></Column>
              <Column style={valueColumn}><Text style={value}>{desiredUniversity}</Text></Column>
            </Row>
            {gpa && (
              <Row>
                <Column style={labelColumn}><Text style={label}>المعدل التراكمي:</Text></Column>
                <Column style={valueColumn}><Text style={value}>{gpa}</Text></Column>
              </Row>
            )}
            <Row>
              <Column style={labelColumn}><Text style={label}>مستوى اللغة الإنجليزية:</Text></Column>
              <Column style={valueColumn}><Text style={value}>{englishLevel}</Text></Column>
            </Row>
            <Row>
              <Column style={labelColumn}><Text style={label}>يرغب في منحة دراسية:</Text></Column>
              <Column style={valueColumn}><Text style={value}>{hasScholarship ? 'نعم' : 'لا'}</Text></Column>
            </Row>
          </Section>

          {additionalInfo && (
            <>
              <Heading style={h2}>معلومات إضافية</Heading>
              <Section style={additionalSection}>
                <Text style={additionalText}>{additionalInfo}</Text>
              </Section>
            </>
          )}

          <Section style={actionSection}>
            <Text style={actionTitle}>الإجراءات المطلوبة:</Text>
            <Text style={actionText}>١. مراجعة البيانات المقدمة</Text>
            <Text style={actionText}>٢. التواصل مع العميل لتأكيد المعلومات</Text>
            <Text style={actionText}>٣. إعداد عرض الأسعار المناسب</Text>
            <Text style={actionText}>٤. إرسال عرض الأسعار للعميل</Text>
          </Section>

          <Section style={contactSection}>
            <Text style={contactTitle}>معلومات التواصل مع العميل</Text>
            <Text style={contactInfo}>📧 البريد الإلكتروني: {email}</Text>
            <Text style={contactInfo}>📱 الهاتف: {phone}</Text>
          </Section>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            نظام إدارة طلبات القبول - FekrahEdu
          </Text>
          <Text style={footerSubtext}>
            تم إرسال هذا الإشعار تلقائياً من النظام
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default AdmissionAdminEmail

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
  maxWidth: '700px',
}

const rtlCss = `
  html, body, table, tbody, tr, td, th, div, section, p, h1, h2, h3, a, span { direction: rtl !important; }
  body, table, td, th, p, h1, h2, h3 { font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif !important; }
  td, th, p, h1, h2, h3 { text-align: right; }
  table { border-spacing: 0; }
`

const header = {
  backgroundColor: '#dc2626',
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
  color: '#fecaca',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
}

const content = {
  padding: '30px 20px',
}

const h2 = {
  color: '#dc2626',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '25px 0 15px',
  borderBottom: '2px solid #dc2626',
  paddingBottom: '8px',
}

const applicationBox = {
  backgroundColor: '#fee2e2',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '2px solid #dc2626',
}

const applicationTitle = {
  color: '#dc2626',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const applicationNumber = {
  color: '#374151',
  fontSize: '16px',
  margin: '8px 0',
}

const applicationDate = {
  color: '#374151',
  fontSize: '16px',
  margin: '8px 0',
}

const infoSection = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  margin: '15px 0',
}

const labelColumn = {
  width: '35%',
  verticalAlign: 'top' as const,
}

const valueColumn = {
  width: '65%',
  verticalAlign: 'top' as const,
}

const label = {
  color: '#4b5563',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '8px 0',
}

const value = {
  color: '#111827',
  fontSize: '14px',
  margin: '8px 0',
}

const additionalSection = {
  backgroundColor: '#f3f4f6',
  padding: '20px',
  borderRadius: '8px',
  margin: '15px 0',
}

const additionalText = {
  color: '#374151',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
}

const actionSection = {
  backgroundColor: '#eff6ff',
  padding: '20px',
  borderRadius: '8px',
  margin: '25px 0',
  border: '1px solid #3b82f6',
}

const actionTitle = {
  color: '#1d4ed8',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 15px',
}

const actionText = {
  color: '#374151',
  fontSize: '14px',
  margin: '8px 0',
  paddingRight: '10px',
}

const contactSection = {
  backgroundColor: '#f0fdf4',
  padding: '20px',
  borderRadius: '8px',
  margin: '25px 0',
  border: '1px solid #16a34a',
}

const contactTitle = {
  color: '#15803d',
  fontSize: '16px',
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
  color: '#dc2626',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '10px 0',
}

const footerSubtext = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '5px 0',
}