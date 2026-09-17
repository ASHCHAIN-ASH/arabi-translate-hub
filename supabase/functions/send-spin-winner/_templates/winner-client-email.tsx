import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
  Link,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WinnerClientEmailProps {
  name: string
  prize: string
}

export const WinnerClientEmail = ({
  name,
  prize,
}: WinnerClientEmailProps) => (
  <Html dir="rtl">
    <Head>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </Head>
    <Preview>🎉 مبروك! لقد فزت في مسابقة دوران العجلة</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with gradient */}
        <Section style={header}>
          <div style={headerContent}>
            <Text style={logoText}>مسار الخبراء للتعليم</Text>
            <Text style={headerSubtitle}>FekrahEdu</Text>
          </div>
        </Section>

        {/* Winner Banner */}
        <Section style={winnerBanner} className="animate-fade-in">
          <Text style={winnerIcon}>🎉</Text>
          <Heading style={winnerTitle}>مبروك الفوز!</Heading>
          <Text style={winnerSubtitle}>أنت من الفائزين المحظوظين</Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Text style={greeting}>
            عزيزي/عزيزتي <strong>{name}</strong>
          </Text>
          
          <Text style={text}>
            نهنئك بفوزك في مسابقة دوران العجلة! 🎊
          </Text>

          {/* Prize Card */}
          <Section style={prizeCard} className="animate-pulse">
            <Text style={prizeLabel}>🎁 جائزتك</Text>
            <Text style={prizeText}>{prize}</Text>
          </Section>

          <Text style={text}>
            <strong>خطوات استلام الجائزة:</strong>
          </Text>

          <Section style={stepsSection}>
            <div style={step}>
              <Text style={stepNumber}>1️⃣</Text>
              <Text style={stepText}>سيتم التواصل معك خلال 24 ساعة</Text>
            </div>
            <div style={step}>
              <Text style={stepNumber}>2️⃣</Text>
              <Text style={stepText}>تأكيد بياناتك والجائزة</Text>
            </div>
            <div style={step}>
              <Text style={stepNumber}>3️⃣</Text>
              <Text style={stepText}>استلام الجائزة</Text>
            </div>
          </Section>

          <Section style={infoBox}>
            <Text style={infoText}>
              💡 <strong>ملاحظة:</strong> يُرجى الاحتفاظ بهذا البريد كإثبات للفوز
            </Text>
          </Section>

          {/* Contact Section */}
          <Section style={contactSection}>
            <Text style={contactTitle}>📞 للاستفسارات</Text>
            <Text style={contactInfo}>📧 info@fekrahedu.com</Text>
            <Text style={contactInfo}>📱 966559600824+</Text>
            <Text style={contactInfo}>🌐 www.fekrahedu.com</Text>
          </Section>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerTitle}>مسار الخبراء للتعليم</Text>
          <Text style={footerText}>
            نحن معكم لتحقيق أحلامكم الأكاديمية
          </Text>
          
          {/* Social Media Links */}
          <Section style={socialSection}>
            <Link href="#" style={socialLink}>Facebook</Link>
            <Text style={socialDivider}>•</Text>
            <Link href="#" style={socialLink}>Instagram</Link>
            <Text style={socialDivider}>•</Text>
            <Link href="#" style={socialLink}>LinkedIn</Link>
            <Text style={socialDivider}>•</Text>
            <Link href="#" style={socialLink}>Twitter</Link>
          </Section>

          <Text style={copyright}>
            © 2025 مسار الخبراء للتعليم - جميع الحقوق محفوظة
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WinnerClientEmail

// Styles
const main = {
  backgroundColor: '#f5f7fa',
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  direction: 'rtl' as const,
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginBottom: '64px',
  maxWidth: '600px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

const header = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '40px 20px',
  textAlign: 'center' as const,
  borderRadius: '0',
}

const headerContent = {
  textAlign: 'center' as const,
}

const logoText = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  textAlign: 'center' as const,
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
}

const headerSubtitle = {
  color: '#e0e7ff',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
  letterSpacing: '2px',
}

const winnerBanner = {
  backgroundColor: '#fef3c7',
  padding: '30px 20px',
  textAlign: 'center' as const,
  borderBottom: '4px solid #f59e0b',
}

const winnerIcon = {
  fontSize: '64px',
  margin: '0 0 10px',
  textAlign: 'center' as const,
}

const winnerTitle = {
  color: '#92400e',
  fontSize: '36px',
  fontWeight: 'bold',
  margin: '0 0 10px',
  textAlign: 'center' as const,
}

const winnerSubtitle = {
  color: '#b45309',
  fontSize: '18px',
  margin: '0',
  textAlign: 'center' as const,
}

const content = {
  padding: '40px 30px',
}

const greeting = {
  color: '#1f2937',
  fontSize: '20px',
  lineHeight: '1.6',
  margin: '0 0 20px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '16px 0',
}

const prizeCard = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '30px',
  borderRadius: '12px',
  margin: '30px 0',
  textAlign: 'center' as const,
  boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
}

const prizeLabel = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 15px',
  textAlign: 'center' as const,
}

const prizeText = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
}

const stepsSection = {
  margin: '30px 0',
}

const step = {
  display: 'flex',
  alignItems: 'flex-start',
  margin: '15px 0',
  padding: '15px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  borderRight: '4px solid #667eea',
}

const stepNumber = {
  fontSize: '24px',
  margin: '0 10px 0 0',
  minWidth: '40px',
}

const stepText = {
  color: '#374151',
  fontSize: '16px',
  margin: '5px 0 0',
  lineHeight: '1.6',
}

const infoBox = {
  backgroundColor: '#dbeafe',
  padding: '20px',
  borderRadius: '8px',
  border: '2px solid #3b82f6',
  margin: '30px 0',
}

const infoText = {
  color: '#1e40af',
  fontSize: '15px',
  margin: '0',
  lineHeight: '1.6',
}

const contactSection = {
  backgroundColor: '#f9fafb',
  padding: '25px',
  borderRadius: '10px',
  margin: '30px 0',
  border: '1px solid #e5e7eb',
}

const contactTitle = {
  color: '#667eea',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 15px',
}

const contactInfo = {
  color: '#4b5563',
  fontSize: '15px',
  margin: '8px 0',
  lineHeight: '1.6',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '0',
}

const footer = {
  textAlign: 'center' as const,
  padding: '30px 20px',
  backgroundColor: '#f9fafb',
}

const footerTitle = {
  color: '#667eea',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 20px',
}

const socialSection = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '20px 0',
  flexWrap: 'wrap' as const,
}

const socialLink = {
  color: '#667eea',
  fontSize: '14px',
  textDecoration: 'none',
  margin: '0 8px',
  fontWeight: '500',
}

const socialDivider = {
  color: '#d1d5db',
  margin: '0 5px',
  fontSize: '14px',
}

const copyright = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '20px 0 0',
  lineHeight: '1.6',
}
