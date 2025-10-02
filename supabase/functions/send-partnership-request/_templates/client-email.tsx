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
  Button,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ClientEmailProps {
  institutionName: string;
  contactPerson: string;
  selectedPackage: string;
}

export const ClientEmail = ({
  institutionName,
  contactPerson,
  selectedPackage,
}: ClientEmailProps) => {
  const packageNames: Record<string, string> = {
    starter: 'الباقة الأساسية',
    professional: 'الباقة الاحترافية',
    enterprise: 'باقة المؤسسات',
    custom: 'باقة مخصصة',
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
      <Preview>شكراً لاهتمامك بالشراكة المؤسسية مع Master Edu Path - سنتواصل معك خلال 24 ساعة</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <table style={{ width: '100%', textAlign: 'center' }}>
              <tr>
                <td>
                  <div style={logoBox}>
                    <span style={logoIcon}>🎓</span>
                    <Heading style={logoText}>Master Edu Path</Heading>
                    <Text style={tagline}>✨ التميز الأكاديمي شراكتنا معكم ✨</Text>
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
                  <Heading style={h1}>
                    🌟 مرحباً {contactPerson}
                  </Heading>
                  
                  <Text style={text}>
                    نشكركم على اهتمامكم بالشراكة المؤسسية معنا. يسعدنا استلام طلبكم للانضمام إلى شبكة شركائنا الأكاديميين المتميزين.
                  </Text>

                  {/* Info Box */}
                  <table style={infoBox}>
                    <tr>
                      <td style={{ padding: '20px' }}>
                        <Heading style={h2}>📋 تفاصيل طلبكم</Heading>
                        <Hr style={innerDivider} />
                        <table style={{ width: '100%', marginTop: '15px' }}>
                          <tr>
                            <td style={labelCell}>
                              <span style={labelIcon}>🏛️</span> المؤسسة:
                            </td>
                            <td style={valueCell}>{institutionName}</td>
                          </tr>
                          <tr>
                            <td style={labelCell}>
                              <span style={labelIcon}>📦</span> الباقة المختارة:
                            </td>
                            <td style={valueCell}>
                              <strong>{packageNames[selectedPackage] || 'باقة مخصصة'}</strong>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Success Message */}
                  <table style={successBox}>
                    <tr>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <span style={{ fontSize: '32px' }}>✅</span>
                        <Text style={successText}>
                          تم استلام طلبكم بنجاح!
                        </Text>
                        <Text style={successSubtext}>
                          سيقوم فريقنا المتخصص بمراجعة طلبكم والتواصل معكم خلال <strong>24 ساعة</strong> كحد أقصى
                        </Text>
                      </td>
                    </tr>
                  </table>

                  {/* Benefits */}
                  <table style={benefitsBox}>
                    <tr>
                      <td style={{ padding: '20px' }}>
                        <Heading style={h2}>🎁 مزايا الشراكة معنا</Heading>
                        <Hr style={innerDivider} />
                        <table style={{ width: '100%', marginTop: '15px' }}>
                          <tr>
                            <td style={benefitItem}>
                              <span style={checkmark}>✓</span>
                              <span style={benefitText}>خصم <strong>50%</strong> على جميع الخدمات الأكاديمية</span>
                            </td>
                          </tr>
                          <tr>
                            <td style={benefitItem}>
                              <span style={checkmark}>✓</span>
                              <span style={benefitText}>دعم فني عبر واتساب متوفر <strong>24/7</strong></span>
                            </td>
                          </tr>
                          <tr>
                            <td style={benefitItem}>
                              <span style={checkmark}>✓</span>
                              <span style={benefitText}>مدير حساب مخصص لمؤسستكم</span>
                            </td>
                          </tr>
                          <tr>
                            <td style={benefitItem}>
                              <span style={checkmark}>✓</span>
                              <span style={benefitText}>أولوية في التسليم والمراجعة</span>
                            </td>
                          </tr>
                          <tr>
                            <td style={benefitItem}>
                              <span style={checkmark}>✓</span>
                              <span style={benefitText}>تقارير دورية عن الأداء والجودة</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Contact Information */}
                  <table style={contactBox}>
                    <tr>
                      <td style={{ padding: '25px' }}>
                        <Heading style={h2}>📞 معلومات التواصل</Heading>
                        <Hr style={innerDivider} />
                        <table style={{ width: '100%', marginTop: '15px' }}>
                          <tr>
                            <td style={contactRow}>
                              <span style={contactIcon}>📧</span>
                              <div style={contactInfo}>
                                <Text style={contactLabel}>البريد الإلكتروني:</Text>
                                <Link href="mailto:info@masteredupath.com" style={contactLink}>
                                  info@masteredupath.com
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={contactRow}>
                              <span style={contactIcon}>💬</span>
                              <div style={contactInfo}>
                                <Text style={contactLabel}>واتساب (متوفر 24 ساعة):</Text>
                                <Link href="https://wa.me/966XXXXXXXXX" style={contactLink}>
                                  +966 XX XXX XXXX
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={contactRow}>
                              <span style={contactIcon}>☎️</span>
                              <div style={contactInfo}>
                                <Text style={contactLabel}>الهاتف:</Text>
                                <Text style={contactValue}>+966 XX XXX XXXX</Text>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={contactRow}>
                              <span style={contactIcon}>🌐</span>
                              <div style={contactInfo}>
                                <Text style={contactLabel}>الموقع الإلكتروني:</Text>
                                <Link href="https://masteredupath.com" style={contactLink}>
                                  www.masteredupath.com
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* CTA Buttons */}
                  <table style={{ width: '100%', marginTop: '30px' }}>
                    <tr>
                      <td style={{ textAlign: 'center', padding: '10px' }}>
                        <Link href="https://wa.me/966XXXXXXXXX" style={whatsappButton}>
                          💬 تواصل معنا عبر واتساب
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center', padding: '10px' }}>
                        <Link href="https://masteredupath.com" style={websiteButton}>
                          🌐 زيارة الموقع الإلكتروني
                        </Link>
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
                    شكراً لثقتكم بنا، ونتطلع للتعاون معكم
                  </Text>
                  <Text style={footerBrand}>
                    <strong>🎓 فريق Master Edu Path</strong>
                  </Text>
                  <Text style={footerSmall}>
                    هذه رسالة تلقائية، للتواصل استخدم معلومات الاتصال أعلاه
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

export default ClientEmail;

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

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 20px',
};

const logoBox = {
  textAlign: 'center' as const,
};

const logoIcon = {
  fontSize: '48px',
  display: 'block',
  marginBottom: '10px',
};

const logoText = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '10px 0',
  textAlign: 'center' as const,
  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const tagline = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '5px 0 0',
  opacity: 0.95,
  textAlign: 'center' as const,
};

const content = {
  padding: '35px 25px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '26px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'right' as const,
  borderRight: '4px solid #667eea',
  paddingRight: '15px',
};

const h2 = {
  color: '#667eea',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textAlign: 'right' as const,
};

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 20px',
  textAlign: 'right' as const,
};

const infoBox = {
  width: '100%',
  backgroundColor: '#f0f4ff',
  borderRadius: '10px',
  margin: '25px 0',
  border: '3px solid #667eea',
  boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
};

const innerDivider = {
  borderColor: '#667eea',
  margin: '10px 0',
  opacity: 0.3,
};

const labelCell = {
  color: '#667eea',
  fontSize: '15px',
  fontWeight: 'bold',
  padding: '12px 15px 12px 0',
  textAlign: 'right' as const,
  width: '45%',
  verticalAlign: 'middle' as const,
};

const labelIcon = {
  marginLeft: '8px',
  fontSize: '18px',
};

const valueCell = {
  color: '#1a1a1a',
  fontSize: '15px',
  padding: '12px 0',
  textAlign: 'right' as const,
  verticalAlign: 'middle' as const,
};

const successBox = {
  width: '100%',
  backgroundColor: '#d4edda',
  borderRadius: '10px',
  margin: '25px 0',
  border: '2px solid #28a745',
};

const successText = {
  color: '#155724',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '10px 0 5px',
  textAlign: 'center' as const,
};

const successSubtext = {
  color: '#155724',
  fontSize: '14px',
  margin: '5px 0 0',
  textAlign: 'center' as const,
};

const benefitsBox = {
  width: '100%',
  backgroundColor: '#e8f5e9',
  borderRadius: '10px',
  margin: '25px 0',
  border: '2px solid #4caf50',
};

const benefitItem = {
  padding: '10px 0',
  textAlign: 'right' as const,
};

const checkmark = {
  color: '#4caf50',
  fontSize: '22px',
  fontWeight: 'bold',
  marginLeft: '12px',
  verticalAlign: 'middle' as const,
};

const benefitText = {
  color: '#1a1a1a',
  fontSize: '15px',
  verticalAlign: 'middle' as const,
};

const contactBox = {
  width: '100%',
  backgroundColor: '#fff8e1',
  borderRadius: '10px',
  margin: '25px 0',
  border: '2px solid #ffc107',
};

const contactRow = {
  padding: '12px 0',
  borderBottom: '1px solid #ffe082',
  display: 'flex',
  alignItems: 'center',
};

const contactIcon = {
  fontSize: '28px',
  marginLeft: '15px',
  minWidth: '35px',
};

const contactInfo = {
  flex: 1,
  textAlign: 'right' as const,
};

const contactLabel = {
  color: '#666666',
  fontSize: '13px',
  margin: '0 0 3px',
  textAlign: 'right' as const,
};

const contactLink = {
  color: '#667eea',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  margin: '0',
};

const contactValue = {
  color: '#1a1a1a',
  fontSize: '15px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'right' as const,
};

const whatsappButton = {
  display: 'inline-block',
  backgroundColor: '#25D366',
  color: '#ffffff',
  padding: '14px 35px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
  transition: 'transform 0.2s',
};

const websiteButton = {
  display: 'inline-block',
  backgroundColor: '#667eea',
  color: '#ffffff',
  padding: '14px 35px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  boxShadow: '0 4px 12px rgba(102,126,234,0.3)',
  transition: 'transform 0.2s',
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