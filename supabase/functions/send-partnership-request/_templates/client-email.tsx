import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
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
    <Html dir="rtl">
      <Head />
      <Preview>شكراً لاهتمامك بالشراكة المؤسسية معنا</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <div style={logoContainer}>
              <Heading style={logoText}>🎓 Master Edu Path</Heading>
              <Text style={tagline}>التميز الأكاديمي شراكتنا معكم</Text>
            </div>
          </Section>

          <Hr style={divider} />

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>
              أهلاً وسهلاً {contactPerson}
            </Heading>

            <Text style={text}>
              نشكركم على اهتمامكم بالشراكة المؤسسية مع <strong>Master Edu Path</strong>
            </Text>

            <Section style={infoBox}>
              <Heading style={h2}>تفاصيل طلبكم</Heading>
              <table style={infoTable}>
                <tr>
                  <td style={labelCell}>المؤسسة:</td>
                  <td style={valueCell}>{institutionName}</td>
                </tr>
                <tr>
                  <td style={labelCell}>الباقة المختارة:</td>
                  <td style={valueCell}>{packageNames[selectedPackage]}</td>
                </tr>
              </table>
            </Section>

            <Text style={text}>
              لقد استلمنا طلبكم بنجاح وسيقوم فريقنا المتخصص بمراجعته والتواصل معكم خلال <strong>24 ساعة</strong> كحد أقصى.
            </Text>

            {/* Features Section */}
            <Section style={featuresBox}>
              <Heading style={h2}>ما يميز شراكتنا:</Heading>
              <table style={{ width: '100%', marginTop: '16px' }}>
                <tr>
                  <td style={featureItem}>
                    <span style={checkmark}>✓</span>
                    <span style={featureText}>خصم 50% على جميع الخدمات</span>
                  </td>
                </tr>
                <tr>
                  <td style={featureItem}>
                    <span style={checkmark}>✓</span>
                    <span style={featureText}>دعم فني على مدار الساعة</span>
                  </td>
                </tr>
                <tr>
                  <td style={featureItem}>
                    <span style={checkmark}>✓</span>
                    <span style={featureText}>مدير حساب مخصص</span>
                  </td>
                </tr>
                <tr>
                  <td style={featureItem}>
                    <span style={checkmark}>✓</span>
                    <span style={featureText}>خدمات أكاديمية متميزة</span>
                  </td>
                </tr>
              </table>
            </Section>

            <Text style={text}>
              إذا كان لديكم أي استفسارات عاجلة، يمكنكم التواصل معنا عبر:
            </Text>

            <Section style={contactBox}>
              <Text style={contactText}>
                📧 البريد الإلكتروني: info@masteredupath.com
              </Text>
              <Text style={contactText}>
                📱 واتساب: متوفر على مدار 24 ساعة
              </Text>
              <Text style={contactText}>
                ☎️ الهاتف: +966 XX XXX XXXX
              </Text>
            </Section>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              شكراً لثقتكم بنا، ونتطلع للتعاون معكم
            </Text>
            <Text style={footerText}>
              <strong>فريق Master Edu Path</strong>
            </Text>
            <Text style={footerSmall}>
              هذه رسالة تلقائية، يرجى عدم الرد عليها مباشرة
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ClientEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
};

const header = {
  padding: '30px 30px 20px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const logoContainer = {
  textAlign: 'center' as const,
};

const logoText = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  textAlign: 'center' as const,
};

const tagline = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  opacity: 0.9,
  textAlign: 'center' as const,
};

const content = {
  padding: '30px',
};

const h1 = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'right' as const,
};

const h2 = {
  color: '#667eea',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px',
  textAlign: 'right' as const,
};

const text = {
  color: '#555555',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  textAlign: 'right' as const,
};

const infoBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
  border: '2px solid #667eea',
};

const infoTable = {
  width: '100%',
  marginTop: '12px',
};

const labelCell = {
  color: '#667eea',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '8px 12px 8px 0',
  textAlign: 'right' as const,
  width: '40%',
};

const valueCell = {
  color: '#333333',
  fontSize: '14px',
  padding: '8px 0',
  textAlign: 'right' as const,
};

const featuresBox = {
  backgroundColor: '#e8eaf6',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const featureItem = {
  padding: '8px 0',
  textAlign: 'right' as const,
};

const checkmark = {
  color: '#4caf50',
  fontSize: '18px',
  fontWeight: 'bold',
  marginLeft: '8px',
};

const featureText = {
  color: '#333333',
  fontSize: '14px',
};

const contactBox = {
  backgroundColor: '#fff3cd',
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 0',
  border: '1px solid #ffc107',
};

const contactText = {
  color: '#333333',
  fontSize: '14px',
  margin: '6px 0',
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
  textAlign: 'center' as const,
};

const footerSmall = {
  color: '#999999',
  fontSize: '12px',
  margin: '12px 0 0',
  textAlign: 'center' as const,
};