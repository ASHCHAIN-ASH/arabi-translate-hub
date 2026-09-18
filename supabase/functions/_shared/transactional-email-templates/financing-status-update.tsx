/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr, Button, Row, Column,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { HEAD_CSS } from './_head.ts'

const SITE_NAME = 'FekrahEdu PayLater'
const BRAND_COLOR = '#0f5132'
const ACCENT = '#198754'

interface FinancingStatusEmailProps {
  event?: string
  applicantName?: string
  ref?: string
  totalAmount?: string
  downPayment?: string
  monthlyInstallment?: string
  durationMonths?: string | number
  remainingAmount?: string
  rejectionReason?: string
  contractPdfUrl?: string
  installmentNumber?: string | number
  installmentAmount?: string
  installmentDueDate?: string
  daysOverdue?: string | number
  receiptAmount?: string
}

const EVENT_META: Record<string, { title: string; emoji: string; intro: string; team: string }> = {
  submitted: { emoji: '✅', title: 'تم استلام طلب التمويل', intro: 'استلمنا طلبك بنجاح وبدأت المراجعة.', team: 'فريق المتابعة' },
  documents_pending: { emoji: '📄', title: 'مستندات مطلوبة', intro: 'يلزم استكمال بعض المستندات لإكمال طلبك.', team: 'فريق المتابعة' },
  under_review: { emoji: '🔍', title: 'طلبك قيد المراجعة', intro: 'يقوم فريق الائتمان بمراجعة طلبك حالياً.', team: 'فريق المتابعة' },
  contract_pending_signature: { emoji: '✍️', title: 'العقد جاهز للتوقيع', intro: 'تمت الموافقة المبدئية — يُرجى مراجعة وتوقيع العقد.', team: 'فريق الائتمان' },
  waiting_down_payment: { emoji: '💳', title: 'بانتظار سداد الدفعة الأولى', intro: 'العقد موقّع — تبقّى سداد الدفعة الأولى لتفعيل التمويل.', team: 'فريق التمويل' },
  approved: { emoji: '🎉', title: 'تمت الموافقة على طلبك', intro: 'مبروك! تمت الموافقة على طلب التمويل الخاص بك.', team: 'فريق الائتمان' },
  active: { emoji: '🚀', title: 'تم تفعيل التمويل', intro: 'تم استلام الدفعة الأولى وإضافة مبلغ التمويل لمحفظتك.', team: 'فريق التمويل' },
  rejected: { emoji: '❌', title: 'تعذّر اعتماد الطلب', intro: 'نأسف لإبلاغك بعدم اعتماد طلبك في الوقت الحالي.', team: 'فريق الائتمان' },
  cancelled: { emoji: '🛑', title: 'تم إلغاء الطلب', intro: 'تم إلغاء طلب التمويل بناءً على طلبك أو حسب السياسة.', team: 'فريق الائتمان' },
  installment_reminder: { emoji: '🔔', title: 'تذكير بقسط مستحق', intro: 'لديك قسط شهري قادم — يرجى التأكد من توفر الرصيد.', team: 'فريق التمويل' },
  installment_overdue: { emoji: '⚠️', title: 'قسط متأخر السداد', intro: 'تأخّر سداد أحد الأقساط — يرجى المبادرة بالسداد لتجنّب الرسوم.', team: 'فريق التمويل' },
  down_payment_received: { emoji: '💰', title: 'تم استلام الدفعة الأولى', intro: 'استلمنا دفعتك الأولى وسيتم تفعيل التمويل خلال دقائق.', team: 'فريق التمويل' },
  status_update: { emoji: 'ℹ️', title: 'تحديث على طلب التمويل', intro: 'تم تحديث حالة طلبك.', team: 'فريق المتابعة' },
}

const FinancingStatusEmail = (props: FinancingStatusEmailProps) => {
  const event = props.event || 'status_update'
  const meta = EVENT_META[event] || EVENT_META.status_update
  const name = props.applicantName?.split(' ')[0] || 'عميلنا الكريم'

  return (
    <Html lang="ar" dir="rtl">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{HEAD_CSS}</style>
      </Head>
      <Preview>{`${meta.emoji} ${meta.title} — ${SITE_NAME}`}</Preview>
      <Body dir="rtl" style={main}>
        <Container dir="rtl" className="fk-shell" style={container}>
          <Section style={header}>
            <Heading style={brand}>{SITE_NAME}</Heading>
          </Section>

          <Section style={hero}>
            <Text style={emoji}>{meta.emoji}</Text>
            <Heading style={h1}>{meta.title}</Heading>
            <Text style={greeting}>أهلاً {name}،</Text>
            <Text style={text}>{meta.intro}</Text>
          </Section>

          {props.ref && (
            <Section style={card}>
              <Row>
                <Column><Text style={label}>رقم الطلب</Text></Column>
                <Column align="right"><Text style={value}>#{props.ref}</Text></Column>
              </Row>
              {props.totalAmount && (
                <Row><Column><Text style={label}>إجمالي التمويل</Text></Column>
                <Column align="right"><Text style={value}>{props.totalAmount} ر.س</Text></Column></Row>
              )}
              {props.downPayment && (
                <Row><Column><Text style={label}>الدفعة الأولى</Text></Column>
                <Column align="right"><Text style={value}>{props.downPayment} ر.س</Text></Column></Row>
              )}
              {props.monthlyInstallment && (
                <Row><Column><Text style={label}>القسط الشهري</Text></Column>
                <Column align="right"><Text style={value}>{props.monthlyInstallment} ر.س</Text></Column></Row>
              )}
              {props.durationMonths && (
                <Row><Column><Text style={label}>مدة التمويل</Text></Column>
                <Column align="right"><Text style={value}>{props.durationMonths} شهر</Text></Column></Row>
              )}
              {props.remainingAmount && (
                <Row><Column><Text style={label}>المتبقي للسداد</Text></Column>
                <Column align="right"><Text style={value}>{props.remainingAmount} ر.س</Text></Column></Row>
              )}
              {props.installmentNumber && (
                <Row><Column><Text style={label}>رقم القسط</Text></Column>
                <Column align="right"><Text style={value}>{props.installmentNumber}</Text></Column></Row>
              )}
              {props.installmentAmount && (
                <Row><Column><Text style={label}>قيمة القسط</Text></Column>
                <Column align="right"><Text style={value}>{props.installmentAmount} ر.س</Text></Column></Row>
              )}
              {props.installmentDueDate && (
                <Row><Column><Text style={label}>تاريخ الاستحقاق</Text></Column>
                <Column align="right"><Text style={value}>{props.installmentDueDate}</Text></Column></Row>
              )}
              {props.daysOverdue && (
                <Row><Column><Text style={label}>أيام التأخير</Text></Column>
                <Column align="right"><Text style={{ ...value, color: '#dc3545' }}>{props.daysOverdue} يوم</Text></Column></Row>
              )}
              {props.receiptAmount && (
                <Row><Column><Text style={label}>المبلغ المستلم</Text></Column>
                <Column align="right"><Text style={value}>{props.receiptAmount} ر.س</Text></Column></Row>
              )}
            </Section>
          )}

          {props.rejectionReason && (
            <Section style={alertBox}>
              <Text style={{ ...text, margin: 0 }}><strong>سبب عدم الاعتماد:</strong> {props.rejectionReason}</Text>
            </Section>
          )}

          {props.contractPdfUrl && (
            <Section style={{ textAlign: 'center', margin: '20px 0' }}>
              <Button className="fk-btn" href={props.contractPdfUrl} style={button}>📄 تحميل العقد للمراجعة</Button>
            </Section>
          )}

          <Hr style={hr} />
          <Text style={footerText}>✍️ {meta.team}</Text>
          <Text style={footerSmall}>☎️ للاستفسار: 920 000 000 — 📱 تابع طلبك من تطبيق المنصة</Text>
          <Text style={footerSmall}>🔒 لا تشارك هذه الرسالة مع أي طرف آخر.</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: FinancingStatusEmail,
  subject: (data: Record<string, any>) => {
    const meta = EVENT_META[data?.event || 'status_update'] || EVENT_META.status_update
    return `${meta.emoji} ${meta.title} — ${SITE_NAME}`
  },
  displayName: 'تحديث حالة التمويل',
  previewData: {
    event: 'approved',
    applicantName: 'محمد العتيبي',
    ref: 'A1B2C3D4',
    totalAmount: '15,000',
    downPayment: '3,000',
    monthlyInstallment: '1,000',
    durationMonths: 12,
    remainingAmount: '12,000',
  },
} satisfies TemplateEntry

const main = { direction: 'rtl' as const, textAlign: 'right' as const, backgroundColor: '#ffffff', fontFamily: '"IBM Plex Sans Arabic", Arial, sans-serif', margin: 0, padding: 0 }
const container = { direction: 'rtl' as const, textAlign: 'right' as const, maxWidth: '560px', margin: '0 auto', padding: '0', border: '1px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden' as const, boxSizing: 'border-box' as const }
const header = { backgroundColor: BRAND_COLOR, padding: '24px', textAlign: 'center' as const }
const brand = { color: '#ffffff', fontSize: '20px', fontWeight: 'bold', margin: 0 }
const hero = { padding: '32px 24px 16px', textAlign: 'center' as const }
const emoji = { fontSize: '48px', margin: '0 0 8px', lineHeight: 1 }
const h1 = { fontSize: '22px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px' }
const greeting = { fontSize: '15px', color: '#374151', margin: '0 0 8px' }
const text = { fontSize: '14px', color: '#4b5563', lineHeight: 1.7, margin: '0 0 12px' }
const card = { backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px 20px', margin: '16px 24px' }
const label = { fontSize: '13px', color: '#6b7280', margin: '6px 0' }
const value = { fontSize: '14px', color: '#111827', fontWeight: 600, margin: '6px 0' }
const alertBox = { backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', margin: '16px 24px' }
const button = { backgroundColor: ACCENT, color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '24px' }
const footerText = { fontSize: '13px', color: '#374151', textAlign: 'center' as const, margin: '4px 24px', fontWeight: 600 }
const footerSmall = { fontSize: '12px', color: '#9ca3af', textAlign: 'center' as const, margin: '4px 24px' }
