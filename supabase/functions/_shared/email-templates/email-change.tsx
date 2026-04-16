/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>تأكيد تغيير البريد الإلكتروني - Master Edu Path</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logo}>Master Edu Path</Text>
        <Heading style={h1}>تأكيد تغيير البريد الإلكتروني</Heading>
        <Text style={text}>
          لقد طلبت تغيير بريدك الإلكتروني من <strong>{email}</strong> إلى <strong>{newEmail}</strong>.
        </Text>
        <Text style={text}>
          اضغط على الزر أدناه لتأكيد هذا التغيير:
        </Text>
        <Button style={button} href={confirmationUrl}>
          تأكيد تغيير البريد
        </Button>
        <Text style={footer}>
          إذا لم تطلب هذا التغيير، يرجى تأمين حسابك فوراً.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', Arial, sans-serif" }
const container = { padding: '30px 25px', direction: 'rtl' as const, textAlign: 'right' as const }
const logo = { fontSize: '20px', fontWeight: 'bold' as const, color: '#3644DB', margin: '0 0 24px', textAlign: 'center' as const }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#0a0f1e', margin: '0 0 20px', textAlign: 'center' as const }
const text = { fontSize: '15px', color: '#555555', lineHeight: '1.8', margin: '0 0 20px' }
const button = {
  backgroundColor: '#3644DB',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  borderRadius: '8px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'block' as const,
  textAlign: 'center' as const,
  margin: '0 auto 20px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0', textAlign: 'center' as const }
