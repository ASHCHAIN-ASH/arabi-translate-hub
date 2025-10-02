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
  Link,
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
    <Html dir="rtl" lang="ar">
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <style>{`
          * { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; }
          body { direction: rtl; text-align: right; }
        `}</style>
      </Head>
      <Preview>🔔 طلب شراكة مؤسسية عاجل من {institutionName} - يتطلب المراجعة الفورية</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Alert Header */}
          <Section style={alertHeader}>
            <table style={{ width: '100%', textAlign: 'center' }}>
              <tr>
                <td>
                  <span style={{ fontSize: '42px', display: 'block', marginBottom: '10px' }}>🚨</span>
                  <Heading style={alertTitle}>طلب شراكة مؤسسية جديد</Heading>
                  <Text style={alertSubtitle}>يتطلب المراجعة والرد خلال 24 ساعة</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Section style={content}>
            <table style={{ width: '100%', direction: 'rtl' }}>
              <tr>
                <td style={{ textAlign: 'right' }}>
                  
                  {/* Institution Details */}
                  <table style={sectionBox}>
                    <tr>
                      <td style={{ padding: '20px' }}>
                        <Heading style={sectionTitle}>
                          🏛️ معلومات المؤسسة
                        </Heading>
                        <Hr style={innerDivider} />
                        <table style={{ width: '100%', marginTop: '15px' }}>
                          <tr>
                            <td style={labelCell}>اسم المؤسسة:</td>
                            <td style={valueCell}><strong>{institutionName}</strong></td>
                          </tr>
                          <tr>
                            <td style={labelCell}>نوع المؤسسة:</td>
                            <td style={valueCell}>{institutionTypes[institutionType]}</td>
                          </tr>
                           <tr>
                            <td style={labelCell}>عدد الموظفين:</td>
                            <td style={valueCell}>{employeesCount}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Contact Person Details */}
                  <table style={sectionBox}>
                    <tr>
                      <td style={{ padding: '20px' }}>
                        <Heading style={sectionTitle}>
                          👤 معلومات الشخص المسؤول
                        </Heading>
                        <Hr style={innerDivider} />
                        <table style={{ width: '100%', marginTop: '15px' }}>
                          <tr>
                            <td style={labelCell}>الاسم:</td>
                            <td style={valueCell}><strong>{contactPerson}</strong></td>
                          </tr>
                          <tr>
                            <td style={labelCell}>المنصب:</td>
                            <td style={valueCell}>{position}</td>
                          </tr>
                          <tr>
                            <td style={labelCell}>
                              <span style={{ marginLeft: '5px' }}>📧</span> البريد الإلكتروني:
                            </td>
                            <td style={valueCell}>
                              <Link href={`mailto:${email}`} style={emailLink}>{email}</Link>
                            </td>
                          </tr>
                          <tr>
                            <td style={labelCell}>
                              <span style={{ marginLeft: '5px' }}>📱</span> رقم الجوال:
                            </td>
                            <td style={valueCell}>
                              <Link href={`https://wa.me/${phone.replace(/\D/g, '')}`} style={phoneLink}>
                                {phone}
                              </Link>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Package & Services */}
                  <table style={packageBox}>
                    <tr>
                      <td style={{ padding: '20px' }}>
                        <Heading style={sectionTitle}>
                          📦 الباقة والخدمات المطلوبة
                        </Heading>
                        <Hr style={innerDivider} />
                        <table style={{ width: '100%', marginTop: '15px' }}>
                          <tr>
                            <td style={labelCell}>الباقة المختارة:</td>
                            <td style={valueCell}>
                              <span style={packageBadge}>{packageNames[selectedPackage]}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style={labelCell}>الخدمات المتوقعة:</td>
                            <td style={valueCell}>{expectedServices}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Additional Notes */}
                  {additionalNotes && (
                    <table style={notesBox}>
                      <tr>
                        <td style={{ padding: '20px' }}>
                          <Heading style={sectionTitle}>
                            📝 ملاحظات إضافية
                          </Heading>
                          <Hr style={innerDivider} />
                          <Text style={notesText}>{additionalNotes}</Text>
                        </td>
                      </tr>
                    </table>
                  )}

                  {/* Action Required */}
                  <table style={actionBox}>
                    <tr>
                      <td style={{ padding: '25px', textAlign: 'center' }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>⚡</span>
                        <Heading style={actionTitle}>إجراء مطلوب</Heading>
                        <Text style={actionText}>
                          يرجى التواصل مع العميل خلال <strong>24 ساعة</strong> لمناقشة تفاصيل الشراكة
                        </Text>
                        <div style={{ marginTop: '20px' }}>
                          <Link href={`mailto:${email}`} style={actionButton}>
                            📧 الرد عبر البريد الإلكتروني
                          </Link>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                          <Link href={`https://wa.me/${phone.replace(/\D/g, '')}`} style={whatsappActionButton}>
                            💬 التواصل عبر واتساب
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </table>

                  {/* Timestamp */}
                  <table style={timestampBox}>
                    <tr>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <Text style={timestampText}>
                          🕐 تاريخ الطلب: {new Date(submittedAt).toLocaleString('ar-SA', {
                            dateStyle: 'full',
                            timeStyle: 'short',
                            timeZone: 'Asia/Riyadh'
                          })}
                        </Text>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <table style={{ width: '100%' }}>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <Text style={footerText}>
                    نظام إدارة الشراكات المؤسسية
                  </Text>
                  <Text style={footerBrand}>
                    <strong>🎓 Master Edu Path</strong>
                  </Text>
                  <Text style={footerSmall}>
                    هذه رسالة تلقائية من نظام إدارة الطلبات
                  </Text>
                  <Hr style={{ borderColor: '#e0e0e0', margin: '15px 0' }} />
                  <Text style={footerSmall}>
                    © 2024 Master Edu Path. جميع الحقوق محفوظة
                  </Text>
                </td>
              </tr>
            </table>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminEmail;

// Styles
const main = {
  backgroundColor: '#f5f5f5',
  fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
  direction: 'rtl' as const,
  padding: '20px 0',
};

const container = {
  margin: '0 auto',
  maxWidth: '650px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
};

const alertHeader = {
  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
  padding: '35px 20px',
};

const alertTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textAlign: 'center' as const,
  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const alertSubtitle = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '0',
  opacity: 0.95,
  textAlign: 'center' as const,
};

const content = {
  padding: '35px 25px',
};

const sectionTitle = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textAlign: 'right' as const,
};

const sectionBox = {
  width: '100%',
  backgroundColor: '#f8f9fa',
  borderRadius: '10px',
  margin: '20px 0',
  border: '2px solid #dee2e6',
};

const packageBox = {
  width: '100%',
  backgroundColor: '#fff3cd',
  borderRadius: '10px',
  margin: '20px 0',
  border: '2px solid #ffc107',
};

const notesBox = {
  width: '100%',
  backgroundColor: '#e7f3ff',
  borderRadius: '10px',
  margin: '20px 0',
  border: '2px solid #2196F3',
};

const actionBox = {
  width: '100%',
  backgroundColor: '#d4edda',
  borderRadius: '10px',
  margin: '25px 0',
  border: '3px solid #28a745',
};

const timestampBox = {
  width: '100%',
  backgroundColor: '#e9ecef',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #ced4da',
};

const innerDivider = {
  borderColor: '#dee2e6',
  margin: '10px 0',
  opacity: 0.5,
};

const labelCell = {
  color: '#6c757d',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '10px 15px 10px 0',
  textAlign: 'right' as const,
  width: '40%',
  verticalAlign: 'top' as const,
};

const valueCell = {
  color: '#1a1a1a',
  fontSize: '15px',
  padding: '10px 0',
  textAlign: 'right' as const,
  verticalAlign: 'top' as const,
};

const emailLink = {
  color: '#0066cc',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const phoneLink = {
  color: '#25D366',
  textDecoration: 'none',
  fontWeight: 'bold',
};

const packageBadge = {
  backgroundColor: '#ffc107',
  color: '#1a1a1a',
  padding: '6px 15px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'inline-block',
};

const notesText = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '15px 0 0',
  textAlign: 'right' as const,
  whiteSpace: 'pre-wrap' as const,
};

const actionTitle = {
  color: '#155724',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textAlign: 'center' as const,
};

const actionText = {
  color: '#155724',
  fontSize: '15px',
  margin: '10px 0',
  textAlign: 'center' as const,
};

const actionButton = {
  display: 'inline-block',
  backgroundColor: '#dc3545',
  color: '#ffffff',
  padding: '14px 30px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(220,53,69,0.3)',
};

const whatsappActionButton = {
  display: 'inline-block',
  backgroundColor: '#25D366',
  color: '#ffffff',
  padding: '14px 30px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
};

const timestampText = {
  color: '#6c757d',
  fontSize: '13px',
  margin: '0',
  textAlign: 'center' as const,
};

const divider = {
  borderColor: '#e0e0e0',
  margin: '0',
};

const footer = {
  padding: '30px 25px',
  backgroundColor: '#f8f9fa',
};

const footerText = {
  color: '#666666',
  fontSize: '15px',
  margin: '5px 0',
  textAlign: 'center' as const,
};

const footerBrand = {
  color: '#1a1a1a',
  fontSize: '16px',
  margin: '8px 0',
  textAlign: 'center' as const,
};

const footerSmall = {
  color: '#999999',
  fontSize: '12px',
  margin: '8px 0',
  textAlign: 'center' as const,
};