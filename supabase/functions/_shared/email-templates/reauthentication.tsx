/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>رمز التحقق - Master Edu Path</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={logo}>Master Edu Path</Text>
        <Heading style={h1}>تأكيد الهوية</Heading>
        <Text style={text}>استخدم الرمز أدناه لتأكيد هويتك:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          هذا الرمز صالح لفترة محدودة. إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد بأمان.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', Arial, sans-serif" }
const container = { padding: '30px 25px', direction: 'rtl' as const, textAlign: 'right' as const }
const logo = { fontSize: '20px', fontWeight: 'bold' as const, color: '#3644DB', margin: '0 0 24px', textAlign: 'center' as const }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#0a0f1e', margin: '0 0 20px', textAlign: 'center' as const }
const text = { fontSize: '15px', color: '#555555', lineHeight: '1.8', margin: '0 0 20px' }
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#3644DB',
  margin: '0 0 30px',
  textAlign: 'center' as const,
  letterSpacing: '6px',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0', textAlign: 'center' as const }
