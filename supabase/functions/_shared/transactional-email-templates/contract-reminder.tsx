/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  clientName?: string
  contractNumber?: string
  contractTitle?: string
  hoursPending?: number
  contractUrl?: string
}

const ContractReminderEmail = ({
  clientName = 'عميلنا الكريم',
  contractNumber = '',
  contractTitle = '',
  hoursPending = 48,
  contractUrl = 'https://fekrahedu.com/client/contracts',
}: Props) => (
  <Html lang="ar" dir="rtl">
    <Head />
    <Preview>تذكير: العقد {contractNumber} بانتظار توقيعك</Preview>
    <Body dir="rtl" style={main}>
      <Container dir="rtl" style={container}>
        <Heading style={h1}>⏰ تذكير بتوقيع العقد</Heading>
        <Text style={text}>مرحباً {clientName}،</Text>
        <Text style={text}>
          نود تذكيركم بأن العقد رقم <strong>{contractNumber}</strong>
          {contractTitle ? <> — {contractTitle}</> : null} لا يزال بانتظار توقيعكم منذ أكثر من{' '}
          <strong>{hoursPending} ساعة</strong>.
        </Text>
        <Text style={text}>
          يرجى مراجعة العقد وتوقيعه إلكترونياً للبدء في تنفيذ الخدمة.
        </Text>
        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Button href={contractUrl} style={button}>
            مراجعة العقد وتوقيعه
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          إذا واجهتك أي مشكلة في التوقيع، يرجى التواصل معنا.
          <br />
          فريق FekrahEdu
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = { direction: 'rtl' as const, textAlign: 'right' as const, backgroundColor: '#f6f9fc', fontFamily: '"IBM Plex Sans Arabic", -apple-system, sans-serif' }
const container = { direction: 'rtl' as const, textAlign: 'right' as const, backgroundColor: '#ffffff', margin: '0 auto', padding: '32px', maxWidth: '560px', borderRadius: '12px' }
const h1 = { color: '#1a1a1a', fontSize: '22px', fontWeight: '700', textAlign: 'center' as const, margin: '0 0 16px' }
const text = { color: '#333', fontSize: '15px', lineHeight: '1.7', textAlign: 'right' as const, margin: '12px 0' }
const button = { backgroundColor: '#0ea5e9', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }
const hr = { borderColor: '#e6ebf1', margin: '24px 0' }
const footer = { color: '#8898aa', fontSize: '13px', textAlign: 'center' as const, lineHeight: '1.6' }

export const template: TemplateEntry = {
  component: ContractReminderEmail,
  subject: (d) => `⏰ تذكير: العقد ${d.contractNumber || ''} بانتظار توقيعك`,
  displayName: 'تذكير توقيع العقد',
  previewData: {
    clientName: 'أحمد محمد',
    contractNumber: 'CTR-12345',
    contractTitle: 'عقد خدمة ترجمة',
    hoursPending: 48,
    contractUrl: 'https://fekrahedu.com/client/contracts',
  },
}
