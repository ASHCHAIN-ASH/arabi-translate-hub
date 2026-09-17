/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  orderName?: string
  reminderType?: '3_days' | '1_day' | '3_hours' | 'overdue'
  deadlineAt?: string
  orderLink?: string
}

const COPY: Record<string, { emoji: string; title: string; body: string; cta: string; upsell: string }> = {
  '3_days': {
    emoji: '⏳', title: 'باقي 3 أيام على تسليم طلبك',
    body: 'نود تذكيرك بأن موعد تسليم طلبك يقترب. خلال 3 أيام سيكون موعد التسليم النهائي.',
    cta: 'متابعة الطلب',
    upsell: 'هل تحتاج تسريع التنفيذ؟ يمكننا تقديم طلبك بشكل عاجل خلال 24 ساعة.',
  },
  '1_day': {
    emoji: '⚡', title: 'باقي 24 ساعة فقط',
    body: 'بقي يوم واحد على موعد تسليم طلبك. تأكد من جاهزيتك لاستلام العمل.',
    cta: 'مراجعة الطلب',
    upsell: 'تريد مراجعة إضافية أو تحسين جودة قبل التسليم؟ تواصل معنا الآن.',
  },
  '3_hours': {
    emoji: '🔥', title: 'باقي 3 ساعات على التسليم',
    body: 'نقترب من الموعد النهائي للتسليم. سيتم التسليم خلال 3 ساعات.',
    cta: 'فتح الطلب',
    upsell: 'لطلب مراجعة عاجلة أو تعديلات في اللحظات الأخيرة، تواصل معنا فوراً.',
  },
  'overdue': {
    emoji: '⚠️', title: 'تم تجاوز الموعد النهائي',
    body: 'نعتذر عن أي تأخير في تسليم طلبك. فريقنا يعمل على إكماله في أقرب وقت ممكن.',
    cta: 'تواصل مع الدعم',
    upsell: 'يمكنك التواصل مع فريق الدعم لإعادة جدولة الموعد أو الحصول على تعويض.',
  },
}

const DeadlineReminderEmail = ({
  name = 'عميلنا الكريم',
  orderName = 'طلبك',
  reminderType = '1_day',
  deadlineAt,
  orderLink = 'https://fekrahedu.com/dashboard',
}: Props) => {
  const c = COPY[reminderType] || COPY['1_day']
  const dl = deadlineAt ? new Date(deadlineAt).toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'short' }) : ''
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>{c.emoji} {c.title} — {orderName}</Preview>
      <Body dir="rtl" style={main}>
        <Container dir="rtl" style={container}>
          <Heading style={h1}>{c.emoji} {c.title}</Heading>
          <Text style={text}>مرحباً {name}،</Text>
          <Text style={text}>{c.body}</Text>
          <Section style={infoBox}>
            <Text style={infoLabel}>الطلب</Text>
            <Text style={infoValue}>{orderName}</Text>
            {dl ? (<><Text style={infoLabel}>موعد التسليم</Text><Text style={infoValue}>{dl}</Text></>) : null}
          </Section>
          <Section style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button href={orderLink} style={button}>{c.cta}</Button>
          </Section>
          <Hr style={hr} />
          <Section style={upsellBox}>
            <Text style={upsellTitle}>💡 خدمة إضافية</Text>
            <Text style={upsellText}>{c.upsell}</Text>
            <Button href="https://fekrahedu.com/services" style={buttonOutline}>استعراض الخدمات</Button>
          </Section>
          <Text style={footer}>FekrahEdu — شريكك في التميز الأكاديمي</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: DeadlineReminderEmail,
  subject: (d: Record<string, any>) => {
    const c = COPY[d?.reminderType] || COPY['1_day']
    return `${c.emoji} ${c.title} — ${d?.orderName ?? 'طلبك'}`
  },
  displayName: 'تذكير بموعد تسليم الطلب',
  previewData: {
    name: 'محمد',
    orderName: 'ترجمة بحث أكاديمي',
    reminderType: '1_day',
    deadlineAt: new Date(Date.now() + 86400000).toISOString(),
    orderLink: 'https://fekrahedu.com/dashboard',
  },
} satisfies TemplateEntry

const main = { direction: 'rtl' as const, textAlign: 'right' as const, backgroundColor: '#ffffff', fontFamily: '"IBM Plex Sans Arabic", Arial, sans-serif' }
const container = { direction: 'rtl' as const, textAlign: 'right' as const, padding: '24px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 16px', textAlign: 'right' as const }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.7', margin: '0 0 12px', textAlign: 'right' as const }
const infoBox = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', margin: '16px 0' }
const infoLabel = { fontSize: '12px', color: '#64748b', margin: '8px 0 2px', textAlign: 'right' as const }
const infoValue = { fontSize: '15px', color: '#0f172a', fontWeight: '600', margin: '0', textAlign: 'right' as const }
const button = { background: '#0f172a', color: '#ffffff', padding: '12px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', display: 'inline-block' }
const buttonOutline = { background: '#ffffff', color: '#0f172a', padding: '10px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', border: '1.5px solid #0f172a', display: 'inline-block' }
const hr = { borderColor: '#e2e8f0', margin: '24px 0' }
const upsellBox = { background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '12px', padding: '16px', textAlign: 'center' as const, margin: '12px 0' }
const upsellTitle = { fontSize: '14px', fontWeight: 'bold', color: '#92400e', margin: '0 0 6px' }
const upsellText = { fontSize: '13px', color: '#78350f', lineHeight: '1.6', margin: '0 0 12px' }
const footer = { fontSize: '11px', color: '#94a3b8', textAlign: 'center' as const, margin: '24px 0 0' }
