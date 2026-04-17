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
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap');
          * { 
            font-family: 'Almarai', 'Segoe UI', Tahoma, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          body { direction: rtl; text-align: right; }
        `}</style>
      </Head>
      <Preview>🚨 طلب شراكة مؤسسية عاجل من {institutionName} - يتطلب المراجعة الفورية</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Urgent Alert Header */}
          <Section style={alertHeader}>
            <table style={{ width: '100%', textAlign: 'center' }}>
              <tr>
                <td>
                  <span style={{ fontSize: '56px', display: 'block', marginBottom: '15px', animation: 'pulse 2s infinite' }}>🚨</span>
                  <Heading style={alertTitle}>طلب شراكة مؤسسية عاجل</Heading>
                  <div style={urgencyBadge}>
                    <span style={{ fontSize: '20px', marginLeft: '8px' }}>⏰</span>
                    يتطلب الرد خلال 24 ساعة
                  </div>
                </td>
              </tr>
            </table>
          </Section>

          {/* Quick Summary Card */}
          <Section style={summaryCard}>
            <table style={{ width: '100%' }}>
              <tr>
                <td style={{ padding: '25px', textAlign: 'center' }}>
                  <Heading style={summaryTitle}>ملخص الطلب</Heading>
                  <div style={summaryGrid}>
                    <div style={summaryItem}>
                      <span style={summaryIcon}>🏛️</span>
                      <Text style={summaryLabel}>المؤسسة</Text>
                      <Text style={summaryValue}>{institutionName}</Text>
                    </div>
                    <div style={summaryItem}>
                      <span style={summaryIcon}>👤</span>
                      <Text style={summaryLabel}>المسؤول</Text>
                      <Text style={summaryValue}>{contactPerson}</Text>
                    </div>
                    <div style={summaryItem}>
                      <span style={summaryIcon}>📦</span>
                      <Text style={summaryLabel}>الباقة</Text>
                      <Text style={summaryValue}>{packageNames[selectedPackage]}</Text>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <table style={{ width: '100%', direction: 'rtl' }}>
              <tr>
                <td style={{ textAlign: 'right' }}>
                  
                  {/* Institution Details */}
                  <table style={detailsCard}>
                    <tr>
                      <td style={{ padding: '25px' }}>
                        <div style={cardHeader}>
                          <span style={cardIcon}>🏢</span>
                          <Heading style={cardTitle}>معلومات المؤسسة</Heading>
                        </div>
                        <Hr style={cardDivider} />
                        <table style={detailsTable}>
                          <tr>
                            <td style={detailLabel}>
                              <span style={detailIcon}>🏛️</span>
                              اسم المؤسسة:
                            </td>
                            <td style={detailValue}>
                              <strong>{institutionName}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={detailLabel}>
                              <span style={detailIcon}>🏷️</span>
                              نوع المؤسسة:
                            </td>
                            <td style={detailValue}>{institutionTypes[institutionType]}</td>
                          </tr>
                          <tr>
                            <td style={detailLabel}>
                              <span style={detailIcon}>👥</span>
                              عدد الموظفين:
                            </td>
                            <td style={detailValue}>{employeesCount}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Contact Person Details */}
                  <table style={detailsCard}>
                    <tr>
                      <td style={{ padding: '25px' }}>
                        <div style={cardHeader}>
                          <span style={cardIcon}>👤</span>
                          <Heading style={cardTitle}>معلومات الشخص المسؤول</Heading>
                        </div>
                        <Hr style={cardDivider} />
                        <table style={detailsTable}>
                          <tr>
                            <td style={detailLabel}>
                              <span style={detailIcon}>✍️</span>
                              الاسم:
                            </td>
                            <td style={detailValue}>
                              <strong>{contactPerson}</strong>
                            </td>
                          </tr>
                          <tr>
                            <td style={detailLabel}>
                              <span style={detailIcon}>💼</span>
                              المنصب:
                            </td>
                            <td style={detailValue}>{position}</td>
                          </tr>
                          <tr>
                            <td style={detailLabel}>
                              <span style={detailIcon}>📧</span>
                              البريد الإلكتروني:
                            </td>
                            <td style={detailValue}>
                              <Link href={`mailto:${email}`} style={emailLink}>
                                {email}
                              </Link>
                            </td>
                          </tr>
                          <tr>
                            <td style={detailLabel}>
                              <span style={detailIcon}>📱</span>
                              رقم الجوال:
                            </td>
                            <td style={detailValue}>
                              <div style={phoneNumberContainer}>
                                <span style={saudiFlag}>🇸🇦</span>
                                <Link href={`https://wa.me/${phone.replace(/\D/g, '')}`} style={phoneLink}>
                                  +{phone.replace(/\D/g, '').substring(0, 3)} {phone.replace(/\D/g, '').substring(3)}
                                </Link>
                                <span style={whatsappBadge}>💬 واتساب</span>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Package & Services */}
                  <table style={packageCard}>
                    <tr>
                      <td style={{ padding: '25px' }}>
                        <div style={cardHeader}>
                          <span style={cardIcon}>📦</span>
                          <Heading style={cardTitle}>الباقة والخدمات المطلوبة</Heading>
                        </div>
                        <Hr style={cardDivider} />
                        <div style={packageBadgeContainer}>
                          <div style={packageBadge}>
                            {packageNames[selectedPackage]}
                          </div>
                        </div>
                        <table style={detailsTable}>
                          <tr>
                            <td style={detailLabel}>
                              <span style={detailIcon}>🎯</span>
                              الخدمات المتوقعة:
                            </td>
                            <td style={detailValue}>{expectedServices}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Additional Notes */}
                  {additionalNotes && (
                    <table style={notesCard}>
                      <tr>
                        <td style={{ padding: '25px' }}>
                          <div style={cardHeader}>
                            <span style={cardIcon}>📝</span>
                            <Heading style={cardTitle}>ملاحظات إضافية</Heading>
                          </div>
                          <Hr style={cardDivider} />
                          <Text style={notesText}>{additionalNotes}</Text>
                        </td>
                      </tr>
                    </table>
                  )}

                  {/* Action Required */}
                  <table style={actionCard}>
                    <tr>
                      <td style={{ padding: '30px', textAlign: 'center' }}>
                        <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>⚡</span>
                        <Heading style={actionTitle}>إجراء مطلوب فوراً</Heading>
                        <Text style={actionText}>
                          يرجى التواصل مع العميل خلال <strong style={{ fontSize: '18px' }}>24 ساعة</strong> لمناقشة تفاصيل الشراكة
                        </Text>
                        
                        <div style={{ marginTop: '25px' }}>
                          <Link href={`mailto:${email}`} style={primaryButton}>
                            <span style={{ fontSize: '22px', marginLeft: '10px' }}>📧</span>
                            الرد عبر البريد الإلكتروني
                          </Link>
                        </div>
                        
                        <div style={{ marginTop: '15px' }}>
                          <Link href={`https://wa.me/${phone.replace(/\D/g, '')}`} style={whatsappButton}>
                            <span style={{ fontSize: '24px', marginRight: '10px' }}>💬</span>
                            التواصل عبر واتساب
                            <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.9 }}>
                              🇸🇦 +{phone.replace(/\D/g, '').substring(0, 3)} {phone.replace(/\D/g, '').substring(3)}
                            </div>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  </table>

                  {/* Timestamp */}
                  <table style={timestampCard}>
                    <tr>
                      <td style={{ padding: '20px', textAlign: 'center' }}>
                        <Text style={timestampText}>
                          🕐 <strong>تاريخ الطلب:</strong> {new Date(submittedAt).toLocaleString('ar-SA', {
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

          <Hr style={mainDivider} />

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
                  <Hr style={{ borderColor: '#e0e0e0', margin: '15px 0', width: '50%', marginLeft: 'auto', marginRight: 'auto' }} />
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

// Premium Admin Styles
const main = {
  backgroundColor: '#f8f9fc',
  fontFamily: "'Almarai', 'Segoe UI', Tahoma, Arial, sans-serif",
  direction: 'rtl' as const,
  padding: '40px 20px',
};

const container = {
  margin: '0 auto',
  maxWidth: '700px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
};

const alertHeader = {
  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
  padding: '50px 30px',
  position: 'relative' as const,
};

const alertTitle = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  margin: '15px 0',
  textAlign: 'center' as const,
  textShadow: '0 3px 6px rgba(0,0,0,0.3)',
};

const urgencyBadge = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#ffffff',
  padding: '12px 25px',
  borderRadius: '50px',
  fontSize: '16px',
  fontWeight: '600',
  display: 'inline-block',
  margin: '10px auto 0',
  backdropFilter: 'blur(10px)',
  border: '2px solid rgba(255, 255, 255, 0.3)',
};

const summaryCard = {
  backgroundColor: '#fff3cd',
  borderTop: '4px solid #ffc107',
  borderBottom: '4px solid #ffc107',
};

const summaryTitle = {
  color: '#856404',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const summaryGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '20px',
};

const summaryItem = {
  textAlign: 'center' as const,
  padding: '15px',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '12px',
};

const summaryIcon = {
  fontSize: '36px',
  display: 'block',
  marginBottom: '10px',
};

const summaryLabel = {
  color: '#666',
  fontSize: '13px',
  margin: '5px 0',
  textAlign: 'center' as const,
  fontWeight: '500',
};

const summaryValue = {
  color: '#1a1a1a',
  fontSize: '15px',
  margin: '5px 0',
  textAlign: 'center' as const,
  fontWeight: '700',
};

const content = {
  padding: '40px 30px',
};

const detailsCard = {
  width: '100%',
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  margin: '20px 0',
  border: '2px solid #dee2e6',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const packageCard = {
  width: '100%',
  backgroundColor: '#fff8e1',
  borderRadius: '12px',
  margin: '20px 0',
  border: '3px solid #ffc107',
  boxShadow: '0 4px 12px rgba(255,193,7,0.15)',
};

const notesCard = {
  width: '100%',
  backgroundColor: '#e7f3ff',
  borderRadius: '12px',
  margin: '20px 0',
  border: '2px solid #2196F3',
  boxShadow: '0 2px 8px rgba(33,150,243,0.1)',
};

const actionCard = {
  width: '100%',
  background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
  borderRadius: '12px',
  margin: '30px 0',
  border: '3px solid #28a745',
  boxShadow: '0 6px 20px rgba(40,167,69,0.2)',
};

const timestampCard = {
  width: '100%',
  backgroundColor: '#e9ecef',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #ced4da',
};

const cardHeader = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '15px',
  flexDirection: 'row-reverse',
};

const cardIcon = {
  fontSize: '32px',
  marginRight: '12px',
};

const cardTitle = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'right' as const,
};

const cardDivider = {
  borderColor: 'rgba(0,0,0,0.1)',
  margin: '15px 0',
};

const detailsTable = {
  width: '100%',
  marginTop: '15px',
};

const detailLabel = {
  color: '#6c757d',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 15px 12px 0',
  textAlign: 'right' as const,
  width: '35%',
  verticalAlign: 'top' as const,
};

const detailValue = {
  color: '#1a1a1a',
  fontSize: '15px',
  padding: '12px 0',
  textAlign: 'right' as const,
  verticalAlign: 'top' as const,
  fontWeight: '500',
};

const detailIcon = {
  fontSize: '18px',
  marginRight: '8px',
};

const emailLink = {
  color: '#0066cc',
  textDecoration: 'none',
  fontWeight: '700',
  fontSize: '15px',
};

const phoneLink = {
  color: '#25D366',
  textDecoration: 'none',
  fontWeight: '700',
  fontSize: '16px',
  marginLeft: '8px',
  marginRight: '8px',
};

const phoneNumberContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexDirection: 'row-reverse',
};

const saudiFlag = {
  fontSize: '24px',
  marginRight: '5px',
};

const whatsappBadge = {
  backgroundColor: '#25D366',
  color: '#ffffff',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: '600',
  marginRight: '8px',
};

const packageBadgeContainer = {
  textAlign: 'center' as const,
  margin: '20px 0',
};

const packageBadge = {
  backgroundColor: '#ffc107',
  color: '#1a1a1a',
  padding: '12px 30px',
  borderRadius: '50px',
  fontSize: '16px',
  fontWeight: '700',
  display: 'inline-block',
  boxShadow: '0 4px 12px rgba(255,193,7,0.3)',
};

const notesText = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '26px',
  margin: '15px 0 0',
  textAlign: 'right' as const,
  whiteSpace: 'pre-wrap' as const,
  padding: '15px',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  borderRadius: '8px',
};

const actionTitle = {
  color: '#155724',
  fontSize: '26px',
  fontWeight: '700',
  margin: '0 0 15px',
  textAlign: 'center' as const,
};

const actionText = {
  color: '#155724',
  fontSize: '16px',
  margin: '10px 0',
  textAlign: 'center' as const,
  lineHeight: '26px',
};

const primaryButton = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
  color: '#ffffff',
  padding: '16px 40px',
  borderRadius: '50px',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: '700',
  boxShadow: '0 6px 20px rgba(220,53,69,0.35)',
  transition: 'all 0.3s ease',
  border: 'none',
};

const whatsappButton = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
  color: '#ffffff',
  padding: '16px 40px',
  borderRadius: '50px',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: '700',
  boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
  transition: 'all 0.3s ease',
  border: 'none',
};

const timestampText = {
  color: '#6c757d',
  fontSize: '14px',
  margin: '0',
  textAlign: 'center' as const,
  fontWeight: '500',
};

const mainDivider = {
  borderColor: '#e2e8f0',
  margin: '0',
};

const footer = {
  padding: '40px 30px',
  backgroundColor: '#f8f9fc',
};

const footerText = {
  color: '#4a5568',
  fontSize: '15px',
  margin: '5px 0',
  textAlign: 'center' as const,
  fontWeight: '500',
};

const footerBrand = {
  color: '#1a1a1a',
  fontSize: '20px',
  margin: '10px 0',
  textAlign: 'center' as const,
  fontWeight: '700',
};

const footerSmall = {
  color: '#a0aec0',
  fontSize: '12px',
  margin: '8px 0',
  textAlign: 'center' as const,
  lineHeight: '18px',
};