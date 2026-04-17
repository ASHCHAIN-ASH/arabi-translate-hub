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
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap');
          * { 
            font-family: 'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          body { direction: rtl; text-align: right; }
          .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
          }
        `}</style>
      </Head>
      <Preview>🎉 شكراً لاهتمامك بالشراكة المؤسسية مع Master Edu Path</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Premium Header with Gradient */}
          <Section style={header}>
            <table style={{ width: '100%', textAlign: 'center' }}>
              <tr>
                <td>
                  <div style={logoContainer}>
                    <span style={logoIcon}>🎓</span>
                    <Heading style={logoText}>Master Edu Path</Heading>
                    <Text style={tagline}>شريكك الأكاديمي الموثوق 🌟</Text>
                  </div>
                </td>
              </tr>
            </table>
          </Section>

          {/* Success Banner */}
          <Section style={successBanner}>
            <table style={{ width: '100%' }}>
              <tr>
                <td style={{ textAlign: 'center', padding: '20px' }}>
                  <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>✅</span>
                  <Heading style={successTitle}>تم استلام طلبكم بنجاح!</Heading>
                  <Text style={successSubtext}>
                    سيتواصل معكم فريقنا المتخصص خلال 24 ساعة
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <table style={{ width: '100%', direction: 'rtl' }}>
              <tr>
                <td style={{ textAlign: 'right' }}>
                  
                  {/* Personalized Greeting */}
                  <div style={greetingBox}>
                    <Text style={greetingText}>
                      🙋‍♂️ مرحباً <strong>{contactPerson}</strong>،
                    </Text>
                    <Text style={normalText}>
                      يسعدنا اهتمامكم بالانضمام إلى شبكة شركائنا المتميزين. نحن متحمسون لبدء رحلة التعاون مع <strong>{institutionName}</strong>
                    </Text>
                  </div>

                  {/* Package Details Card */}
                  <table style={packageCard}>
                    <tr>
                      <td style={{ padding: '25px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                          <span style={{ fontSize: '40px' }}>📦</span>
                        </div>
                        <Heading style={cardTitle}>الباقة المختارة</Heading>
                        <div style={packageBadge}>
                          {packageNames[selectedPackage] || 'باقة مخصصة'}
                        </div>
                        <Text style={cardSubtext}>
                          تم حفظ طلبكم وسنقوم بإعداد عرض تفصيلي مخصص لمؤسستكم
                        </Text>
                      </td>
                    </tr>
                  </table>

                  {/* Benefits Grid */}
                  <table style={benefitsSection}>
                    <tr>
                      <td style={{ padding: '25px' }}>
                        <Heading style={sectionTitle}>
                          <span style={{ marginLeft: '10px' }}>🎁</span>
                          مزايا الشراكة الحصرية
                        </Heading>
                        <Hr style={dividerLine} />
                        
                        <table style={{ width: '100%', marginTop: '20px' }}>
                          <tr>
                            <td style={benefitRow}>
                              <div style={benefitIcon}>💰</div>
                              <div style={benefitContent}>
                                <Text style={benefitTitle}>خصم 50%</Text>
                                <Text style={benefitDesc}>على جميع الخدمات الأكاديمية والترجمة</Text>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={benefitRow}>
                              <div style={benefitIcon}>⚡</div>
                              <div style={benefitContent}>
                                <Text style={benefitTitle}>دعم 24/7</Text>
                                <Text style={benefitDesc}>فريق متخصص متوفر على مدار الساعة</Text>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={benefitRow}>
                              <div style={benefitIcon}>👤</div>
                              <div style={benefitContent}>
                                <Text style={benefitTitle}>مدير حساب مخصص</Text>
                                <Text style={benefitDesc}>متابعة شخصية لجميع طلباتكم</Text>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={benefitRow}>
                              <div style={benefitIcon}>🚀</div>
                              <div style={benefitContent}>
                                <Text style={benefitTitle}>أولوية التسليم</Text>
                                <Text style={benefitDesc}>معالجة سريعة لجميع المشاريع</Text>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={benefitRow}>
                              <div style={benefitIcon}>📊</div>
                              <div style={benefitContent}>
                                <Text style={benefitTitle}>تقارير دورية</Text>
                                <Text style={benefitDesc}>تحليل شامل للأداء والجودة</Text>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  {/* Contact Section */}
                  <table style={contactSection}>
                    <tr>
                      <td style={{ padding: '30px' }}>
                        <Heading style={sectionTitle}>
                          <span style={{ marginLeft: '10px' }}>📞</span>
                          تواصل معنا الآن
                        </Heading>
                        <Hr style={dividerLine} />
                        
                        <table style={{ width: '100%', marginTop: '20px' }}>
                          <tr>
                            <td style={contactItem}>
                              <span style={contactIconStyle}>📧</span>
                              <div>
                                <Text style={contactLabel}>البريد الإلكتروني</Text>
                                <Link href="mailto:info@masteredupath.com" style={contactValue}>
                                  info@masteredupath.com
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={contactItem}>
                              <div style={whatsappIconContainer}>
                                <span style={whatsappIcon}>💬</span>
                              </div>
                              <div>
                                <Text style={contactLabel}>واتساب (متوفر 24 ساعة)</Text>
                                <Link href="https://wa.me/966500776343" style={contactValue}>
                                  0500776343
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={contactItem}>
                              <div style={phoneIconContainer}>
                                <span style={phoneIconStyle}>☎️</span>
                              </div>
                              <div>
                                <Text style={contactLabel}>الهاتف</Text>
                                <Text style={contactValuePlain}>
                                  0500776343
                                </Text>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td style={contactItem}>
                              <span style={contactIconStyle}>🌐</span>
                              <div>
                                <Text style={contactLabel}>الموقع الإلكتروني</Text>
                                <Link href="https://masteredupath.com" style={contactValue}>
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
                      <td style={{ textAlign: 'center', padding: '10px 20px' }}>
                        <Link href="https://wa.me/966500776343" style={whatsappButton}>
                          <span style={{ fontSize: '24px', marginLeft: '10px' }}>💬</span>
                          تواصل معنا عبر واتساب
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center', padding: '10px 20px' }}>
                        <Link href="https://masteredupath.com" style={websiteButton}>
                          <span style={{ fontSize: '20px', marginLeft: '10px' }}>🌐</span>
                          زيارة الموقع الإلكتروني
                        </Link>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </Section>

          <Hr style={mainDivider} />

          {/* Premium Footer */}
          <Section style={footer}>
            <table style={{ width: '100%' }}>
              <tr>
                <td style={{ textAlign: 'center' }}>
                  <Text style={footerText}>
                    شكراً لثقتكم بنا 🙏
                  </Text>
                  <Text style={footerBrand}>
                    <strong>🎓 Master Edu Path</strong>
                  </Text>
                  <Text style={footerTagline}>
                    التميز الأكاديمي في خدمتكم
                  </Text>
                  <Hr style={{ borderColor: '#e0e0e0', margin: '20px 0', width: '50%', marginLeft: 'auto', marginRight: 'auto' }} />
                  <Text style={footerSmall}>
                    هذه رسالة تلقائية، للتواصل استخدم معلومات الاتصال أعلاه
                  </Text>
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

// Premium Styles
const main = {
  backgroundColor: '#f8f9fc',
  fontFamily: "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif",
  direction: 'rtl' as const,
  padding: '40px 20px',
};

const container = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
};

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '50px 30px',
  position: 'relative' as const,
};

const logoContainer = {
  textAlign: 'center' as const,
};

const logoIcon = {
  fontSize: '56px',
  display: 'block',
  marginBottom: '15px',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
};

const logoText = {
  color: '#ffffff',
  fontSize: '36px',
  fontWeight: '700',
  margin: '10px 0',
  textAlign: 'center' as const,
  textShadow: '0 3px 6px rgba(0,0,0,0.3)',
  letterSpacing: '0.5px',
};

const tagline = {
  color: '#ffffff',
  fontSize: '18px',
  margin: '10px 0 0',
  opacity: 0.95,
  textAlign: 'center' as const,
  fontWeight: '400',
};

const successBanner = {
  backgroundColor: '#d4edda',
  borderTop: '4px solid #28a745',
  borderBottom: '4px solid #28a745',
};

const successTitle = {
  color: '#155724',
  fontSize: '26px',
  fontWeight: '700',
  margin: '0 0 10px',
  textAlign: 'center' as const,
};

const successSubtext = {
  color: '#155724',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
  fontWeight: '500',
};

const content = {
  padding: '40px 30px',
};

const greetingBox = {
  marginBottom: '30px',
};

const greetingText = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 15px',
  textAlign: 'right' as const,
};

const normalText = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0',
  textAlign: 'right' as const,
};

const packageCard = {
  width: '100%',
  backgroundColor: '#fff8e1',
  borderRadius: '12px',
  margin: '30px 0',
  border: '3px solid #ffc107',
  boxShadow: '0 4px 12px rgba(255,193,7,0.15)',
};

const cardTitle = {
  color: '#1a1a1a',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 15px',
  textAlign: 'center' as const,
};

const packageBadge = {
  backgroundColor: '#ffc107',
  color: '#1a1a1a',
  padding: '12px 30px',
  borderRadius: '50px',
  fontSize: '18px',
  fontWeight: '700',
  display: 'inline-block',
  margin: '0 auto',
  textAlign: 'center' as const,
  boxShadow: '0 4px 12px rgba(255,193,7,0.3)',
};

const cardSubtext = {
  color: '#666',
  fontSize: '14px',
  margin: '15px 0 0',
  textAlign: 'center' as const,
  lineHeight: '22px',
};

const benefitsSection = {
  width: '100%',
  backgroundColor: '#f0f7ff',
  borderRadius: '12px',
  margin: '30px 0',
  border: '2px solid #4299e1',
};

const sectionTitle = {
  color: '#1a1a1a',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 10px',
  textAlign: 'right' as const,
};

const dividerLine = {
  borderColor: 'rgba(0,0,0,0.1)',
  margin: '15px 0',
};

const benefitRow = {
  display: 'flex',
  alignItems: 'flex-start',
  padding: '15px 0',
  flexDirection: 'row-reverse',
  borderBottom: '1px solid rgba(66,153,225,0.15)',
};

const benefitIcon = {
  fontSize: '32px',
  marginLeft: '15px',
  minWidth: '40px',
  textAlign: 'center' as const,
};

const benefitContent = {
  flex: 1,
};

const benefitTitle = {
  color: '#2d3748',
  fontSize: '17px',
  fontWeight: '700',
  margin: '0 0 5px',
  textAlign: 'right' as const,
};

const benefitDesc = {
  color: '#718096',
  fontSize: '14px',
  margin: '0',
  textAlign: 'right' as const,
  lineHeight: '20px',
};

const contactSection = {
  width: '100%',
  backgroundColor: '#fff5f5',
  borderRadius: '12px',
  margin: '30px 0',
  border: '2px solid #fc8181',
};

const contactItem = {
  display: 'flex',
  alignItems: 'center',
  padding: '15px 0',
  borderBottom: '1px solid rgba(252,129,129,0.15)',
  flexDirection: 'row-reverse',
};

const whatsappIconContainer = {
  backgroundColor: '#25D366',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '15px',
  boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
};

const whatsappIcon = {
  fontSize: '28px',
};

const phoneIconContainer = {
  backgroundColor: '#4299e1',
  borderRadius: '50%',
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '15px',
  boxShadow: '0 4px 12px rgba(66,153,225,0.3)',
};

const phoneIconStyle = {
  fontSize: '28px',
};

const contactIconStyle = {
  fontSize: '32px',
  marginRight: '15px',
  minWidth: '40px',
};

const contactLabel = {
  color: '#718096',
  fontSize: '13px',
  margin: '0 0 5px',
  textAlign: 'right' as const,
  fontWeight: '500',
};

const contactValue = {
  color: '#2d3748',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  margin: '0',
};

const contactValuePlain = {
  color: '#2d3748',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'right' as const,
};

const countryCode = {
  display: 'inline-block',
  backgroundColor: '#f0f7ff',
  color: '#2d5aa0',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '700',
  marginLeft: '8px',
  border: '1px solid #bee3f8',
};

const countryCodePlain = {
  display: 'inline-block',
  backgroundColor: '#f0f7ff',
  color: '#2d5aa0',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '700',
  marginLeft: '8px',
  border: '1px solid #bee3f8',
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
  textAlign: 'center' as const,
  border: 'none',
};

const websiteButton = {
  display: 'inline-block',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
  padding: '16px 40px',
  borderRadius: '50px',
  textDecoration: 'none',
  fontSize: '18px',
  fontWeight: '700',
  boxShadow: '0 6px 20px rgba(102,126,234,0.35)',
  transition: 'all 0.3s ease',
  textAlign: 'center' as const,
  border: 'none',
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
  fontSize: '16px',
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

const footerTagline = {
  color: '#718096',
  fontSize: '14px',
  margin: '5px 0',
  textAlign: 'center' as const,
  fontStyle: 'italic',
};

const footerSmall = {
  color: '#a0aec0',
  fontSize: '12px',
  margin: '8px 0',
  textAlign: 'center' as const,
  lineHeight: '18px',
};