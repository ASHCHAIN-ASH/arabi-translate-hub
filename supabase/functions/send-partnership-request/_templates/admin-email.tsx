import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface AdminEmailProps {
  institutionName: string;
  institutionType: string;
  contactPerson: string;
  email: string;
  phone: string;
  position: string;
  selectedPackage: string;
  employeesCount: string;
  expectedServices: string;
  additionalNotes?: string;
  submittedAt: string;
}

export const AdminEmail = ({
  institutionName,
  institutionType,
  contactPerson,
  email,
  phone,
  position,
  selectedPackage,
  employeesCount,
  expectedServices,
  additionalNotes,
  submittedAt,
}: AdminEmailProps) => {
  const packageNames: Record<string, string> = {
    starter: 'الباقة الأساسية - 5,000 ريال سنوياً',
    professional: 'الباقة الاحترافية - 12,000 ريال سنوياً',
    enterprise: 'باقة المؤسسات - حسب الطلب',
    custom: 'باقة مخصصة - للمناقشة',
  };

  const institutionTypes: Record<string, string> = {
    university: 'جامعة',
    college: 'كلية',
    'educational-office': 'مكتب تعليمي',
    'research-center': 'مركز أبحاث',
    company: 'شركة',
    institute: 'معهد',
    other: 'أخرى',
  };

  return (
    <Html dir="rtl">
      <Head />
      <Preview>طلب شراكة مؤسسية جديد من {institutionName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>🎓 طلب شراكة مؤسسية جديد</Heading>
            <Text style={headerSubtitle}>
              تم استلام طلب شراكة جديد - يتطلب المتابعة خلال 24 ساعة
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Section style={content}>
            {/* Institution Details */}
            <Section style={section}>
              <Heading style={sectionTitle}>📋 معلومات المؤسسة</Heading>
              <table style={detailsTable}>
                <tr>
                  <td style={labelCell}>اسم المؤسسة:</td>
                  <td style={valueCell}><strong>{institutionName}</strong></td>
                </tr>
                <tr>
                  <td style={labelCell}>نوع المؤسسة:</td>
                  <td style={valueCell}>{institutionTypes[institutionType]}</td>
                </tr>
                <tr>
                  <td style={labelCell}>عدد الموظفين/الطلاب:</td>
                  <td style={valueCell}>{employeesCount}</td>
                </tr>
              </table>
            </Section>

            {/* Contact Person Details */}
            <Section style={section}>
              <Heading style={sectionTitle}>👤 معلومات المسؤول</Heading>
              <table style={detailsTable}>
                <tr>
                  <td style={labelCell}>الاسم:</td>
                  <td style={valueCell}><strong>{contactPerson}</strong></td>
                </tr>
                <tr>
                  <td style={labelCell}>المسمى الوظيفي:</td>
                  <td style={valueCell}>{position}</td>
                </tr>
                <tr>
                  <td style={labelCell}>البريد الإلكتروني:</td>
                  <td style={valueCell}>
                    <a href={`mailto:${email}`} style={link}>{email}</a>
                  </td>
                </tr>
                <tr>
                  <td style={labelCell}>رقم الجوال:</td>
                  <td style={valueCell}>
                    <a href={`tel:${phone}`} style={link}>{phone}</a>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Package Details */}
            <Section style={highlightSection}>
              <Heading style={sectionTitle}>✨ تفاصيل الباقة المطلوبة</Heading>
              <Text style={packageText}>
                {packageNames[selectedPackage]}
              </Text>
            </Section>

            {/* Expected Services */}
            <Section style={section}>
              <Heading style={sectionTitle}>📝 الخدمات المتوقعة</Heading>
              <Text style={servicesText}>{expectedServices}</Text>
            </Section>

            {/* Additional Notes */}
            {additionalNotes && (
              <Section style={section}>
                <Heading style={sectionTitle}>📌 ملاحظات إضافية</Heading>
                <Text style={notesText}>{additionalNotes}</Text>
              </Section>
            )}

            {/* Submission Details */}
            <Section style={metaSection}>
              <Text style={metaText}>
                📅 تاريخ الطلب: {new Date(submittedAt).toLocaleString('ar-SA', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              </Text>
            </Section>

            {/* Action Box */}
            <Section style={actionBox}>
              <Heading style={actionTitle}>⚡ الإجراء المطلوب</Heading>
              <Text style={actionText}>
                1. مراجعة التفاصيل أعلاه<br/>
                2. التواصل مع العميل خلال 24 ساعة<br/>
                3. إعداد عرض سعر مخصص<br/>
                4. متابعة الطلب حتى الإتمام
              </Text>
              <Text style={actionText}>
                <strong>رقم الجوال للتواصل المباشر:</strong>{' '}
                <a href={`https://wa.me/${phone.replace(/\D/g, '')}`} style={whatsappLink}>
                  {phone} (واتساب)
                </a>
              </Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              نظام إدارة الشراكات المؤسسية - Master Edu Path
            </Text>
            <Text style={footerSmall}>
              هذه رسالة تلقائية من نظام إدارة الطلبات
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminEmail;

// Styles
const main = {
  backgroundColor: '#f4f4f4',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '700px',
  backgroundColor: '#ffffff',
};

const header = {
  padding: '30px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const headerSubtitle = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  opacity: 0.95,
};

const content = {
  padding: '30px',
};

const section = {
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
};

const highlightSection = {
  marginBottom: '24px',
  padding: '20px',
  backgroundColor: '#e8eaf6',
  borderRadius: '8px',
  border: '2px solid #667eea',
};

const sectionTitle = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
  textAlign: 'right' as const,
};

const detailsTable = {
  width: '100%',
  marginTop: '8px',
};

const labelCell = {
  color: '#666666',
  fontSize: '14px',
  fontWeight: '600',
  padding: '8px 12px 8px 0',
  textAlign: 'right' as const,
  width: '40%',
  verticalAlign: 'top' as const,
};

const valueCell = {
  color: '#333333',
  fontSize: '14px',
  padding: '8px 0',
  textAlign: 'right' as const,
  verticalAlign: 'top' as const,
};

const link = {
  color: '#667eea',
  textDecoration: 'none',
  fontWeight: '600',
};

const whatsappLink = {
  color: '#25D366',
  textDecoration: 'none',
  fontWeight: '600',
};

const packageText = {
  color: '#667eea',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '8px 0 0',
  textAlign: 'right' as const,
};

const servicesText = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0 0',
  textAlign: 'right' as const,
  whiteSpace: 'pre-wrap' as const,
};

const notesText = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0 0',
  textAlign: 'right' as const,
  fontStyle: 'italic',
  whiteSpace: 'pre-wrap' as const,
};

const metaSection = {
  marginTop: '24px',
  padding: '12px',
  backgroundColor: '#fff3cd',
  borderRadius: '6px',
  border: '1px solid #ffc107',
};

const metaText = {
  color: '#856404',
  fontSize: '13px',
  margin: '0',
  textAlign: 'right' as const,
};

const actionBox = {
  marginTop: '24px',
  padding: '20px',
  backgroundColor: '#d4edda',
  borderRadius: '8px',
  border: '2px solid #28a745',
};

const actionTitle = {
  color: '#155724',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
  textAlign: 'right' as const,
};

const actionText = {
  color: '#155724',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
  textAlign: 'right' as const,
};

const divider = {
  borderColor: '#e0e0e0',
  margin: '0',
};

const footer = {
  padding: '20px 30px',
  textAlign: 'center' as const,
  backgroundColor: '#f8f9fa',
};

const footerText = {
  color: '#555555',
  fontSize: '14px',
  margin: '4px 0',
  fontWeight: '600',
};

const footerSmall = {
  color: '#999999',
  fontSize: '12px',
  margin: '8px 0 0',
};