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

interface WinnerAdminEmailProps {
  name: string
  email: string
  prize: string
}

export const WinnerAdminEmail = ({
  name,
  email,
  prize,
}: WinnerAdminEmailProps) => (
  <Html dir="rtl">
    <Head>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </Head>
    <Preview>🎊 فائز جديد في مسابقة دوران العجلة - يتطلب إجراء</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Alert Header */}
        <Section style={alertHeader}>
          <Text style={alertIcon}>⚠️</Text>
          <Heading style={alertTitle}>تنبيه: فائز جديد</Heading>
          <Text style={alertSubtitle}>يتطلب المتابعة والتواصل</Text>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h1}>🎉 فائز جديد في مسابقة العجلة</Heading>
          
          <Text style={urgentText}>
            تم تسجيل فائز جديد في مسابقة دوران العجلة. يُرجى التواصل معه في أقرب وقت ممكن.
          </Text>

          {/* Winner Details Card */}
          <Section style={winnerCard} className="animate-fade-in">
            <Text style={cardTitle}>📋 بيانات الفائز</Text>
            
            <div style={detailRow}>
              <Text style={detailLabel}>👤 الاسم الكامل:</Text>
              <Text style={detailValue}>{name}</Text>
            </div>

            <Hr style={divider} />

            <div style={detailRow}>
              <Text style={detailLabel}>📧 البريد الإلكتروني:</Text>
              <Text style={detailValue}>{email}</Text>
            </div>

            <Hr style={divider} />

            <div style={detailRow}>
              <Text style={detailLabel}>🎁 الجائزة:</Text>
              <Text style={prizeValue}>{prize}</Text>
            </div>
          </Section>

          {/* Action Items */}
          <Section style={actionSection}>
            <Text style={actionTitle}>✅ الإجراءات المطلوبة</Text>
            
            <div style={actionItem}>
              <Text style={actionNumber}>1</Text>
              <Text style={actionText}>التواصل مع الفائز خلال 24 ساعة</Text>
            </div>

            <div style={actionItem}>
              <Text style={actionNumber}>2</Text>
              <Text style={actionText}>تأكيد البيانات والجائزة</Text>
            </div>

            <div style={actionItem}>
              <Text style={actionNumber}>3</Text>
              <Text style={actionText}>تسليم الجائزة وتوثيق العملية</Text>
            </div>

            <div style={actionItem}>
              <Text style={actionNumber}>4</Text>
              <Text style={actionText}>تحديث سجل المسابقة</Text>
            </div>
          </Section>

          {/* Quick Actions */}
          <Section style={quickActions}>
            <Text style={quickActionsTitle}>⚡ إجراءات سريعة</Text>
            
            <Link 
              href={`mailto:${email}`}
              style={actionButton}
            >
              📧 إرسال بريد للفائز
            </Link>

            <Link 
              href={`https://wa.me/966501234567?text=مرحباً ${name}، تهانينا بالفوز في مسابقة دوران العجلة`}
              style={actionButton}
            >
              💬 التواصل عبر واتساب
            </Link>
          </Section>

          {/* Important Note */}
          <Section style={noteBox}>
            <Text style={noteIcon}>💡</Text>
            <Text style={noteText}>
              <strong>ملاحظة هامة:</strong> تم إرسال بريد تأكيد للفائز. يُرجى المتابعة السريعة لضمان رضا العميل وتعزيز سمعة المسابقة.
            </Text>
          </Section>

          {/* Timestamp */}
          <Section style={timestampSection}>
            <Text style={timestampText}>
              🕐 وقت الفوز: {new Date().toLocaleString('ar-SA', { 
                timeZone: 'Asia/Riyadh',
                dateStyle: 'full',
                timeStyle: 'short'
              })}
            </Text>
          </Section>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerTitle}>نظام إدارة المسابقات</Text>
          <Text style={footerText}>مسار الخبراء للتعليم</Text>
          <Text style={footerSubtext}>
            هذا البريد مرسل تلقائياً من نظام إدارة المسابقات
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WinnerAdminEmail

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
  maxWidth: '650px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

const alertHeader = {
  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const alertIcon = {
  fontSize: '48px',
  margin: '0 0 10px',
  textAlign: 'center' as const,
  animation: 'pulse 2s infinite',
}

const alertTitle = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  textAlign: 'center' as const,
  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
}

const alertSubtitle = {
  color: '#fef2f2',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
}

const content = {
  padding: '40px 30px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 20px',
}

const urgentText = {
  color: '#dc2626',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '0 0 30px',
  padding: '15px',
  backgroundColor: '#fef2f2',
  borderRight: '4px solid #dc2626',
  borderRadius: '6px',
  fontWeight: '500',
}

const winnerCard = {
  backgroundColor: '#f9fafb',
  padding: '30px',
  borderRadius: '12px',
  margin: '30px 0',
  border: '2px solid #e5e7eb',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
}

const cardTitle = {
  color: '#667eea',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px',
}

const detailRow = {
  margin: '15px 0',
}

const detailLabel = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 5px',
  fontWeight: '600',
}

const detailValue = {
  color: '#1f2937',
  fontSize: '16px',
  margin: '0',
  fontWeight: 'normal',
}

const prizeValue = {
  color: '#667eea',
  fontSize: '18px',
  margin: '0',
  fontWeight: 'bold',
}

const divider = {
  borderColor: '#e5e7eb',
  margin: '15px 0',
}

const actionSection = {
  backgroundColor: '#dbeafe',
  padding: '25px',
  borderRadius: '10px',
  margin: '30px 0',
  border: '2px solid #3b82f6',
}

const actionTitle = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px',
}

const actionItem = {
  display: 'flex',
  alignItems: 'flex-start',
  margin: '12px 0',
  padding: '12px',
  backgroundColor: '#ffffff',
  borderRadius: '6px',
}

const actionNumber = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '6px 12px',
  borderRadius: '50%',
  minWidth: '32px',
  textAlign: 'center' as const,
  margin: '0 10px 0 0',
}

const actionText = {
  color: '#374151',
  fontSize: '15px',
  margin: '5px 0 0',
  lineHeight: '1.6',
}

const quickActions = {
  margin: '30px 0',
  textAlign: 'center' as const,
}

const quickActionsTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
}

const actionButton = {
  display: 'inline-block',
  backgroundColor: '#667eea',
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '15px',
  margin: '8px',
  boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
}

const noteBox = {
  backgroundColor: '#fef3c7',
  padding: '20px',
  borderRadius: '8px',
  border: '2px solid #f59e0b',
  margin: '30px 0',
  display: 'flex',
  alignItems: 'flex-start',
}

const noteIcon = {
  fontSize: '24px',
  margin: '0 10px 0 0',
}

const noteText = {
  color: '#92400e',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
  flex: '1',
}

const timestampSection = {
  backgroundColor: '#f9fafb',
  padding: '15px',
  borderRadius: '6px',
  margin: '20px 0 0',
  textAlign: 'center' as const,
}

const timestampText = {
  color: '#6b7280',
  fontSize: '13px',
  margin: '0',
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
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const footerText = {
  color: '#374151',
  fontSize: '16px',
  margin: '0 0 8px',
  fontWeight: '500',
}

const footerSubtext = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
  lineHeight: '1.6',
}
