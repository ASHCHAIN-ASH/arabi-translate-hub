import * as React from 'npm:react@18.3.1'
import { Heading, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, DataTable, S, card, cardTitle, heroBox, heroLabel, heroValue, SITE_NAME, SITE_URL } from './_brand.tsx'

interface Props {
  customerName?: string
  customerEmail?: string
  prize?: string
  claimCode?: string
  wonAt?: string
  nextEligibleAt?: string
  deviceId?: string
}

const E = ({ customerName, customerEmail, prize, claimCode, wonAt, nextEligibleAt, deviceId }: Props) => (
  <BrandEmail
    preview={`فائز جديد في عجلة الجوائز — ${prize ?? ''}`}
    accent="violet"
    tagline="إشعار إداري · عجلة الجوائز"
    badge="فائز جديد"
    cta={{ label: 'فتح لوحة الإدارة', url: `${SITE_URL}/adminfekrah` }}
    footerNote="يرجى التواصل مع الفائز خلال 24 ساعة لتفعيل الخدمة."
  >
    <Heading style={S.title} className="fk-title">فائز جديد في عجلة الجوائز 🎯</Heading>
    <Text style={S.text}>
      سجّل النظام فوزًا جديدًا في عجلة جوائز {SITE_NAME}، وأُرسلت رسالة التهنئة للفائز تلقائيًا.
    </Text>

    <Section style={heroBox('violet')}>
      <Text style={heroLabel('violet')}>الجائزة</Text>
      <Text style={heroValue('violet')} className="fk-hero">{prize || '—'}</Text>
    </Section>

    <Section style={card}>
      <Text style={cardTitle}>بيانات الفائز</Text>
      <DataTable rows={[
        ['الاسم', customerName],
        ['البريد الإلكتروني', customerEmail],
        ['رمز المطالبة', claimCode],
        ['تاريخ الفوز', wonAt],
        ['المحاولة القادمة', nextEligibleAt],
        ['معرّف الجهاز', deviceId],
      ]} />
    </Section>
  </BrandEmail>
)

export const template: TemplateEntry = {
  component: E,
  subject: (d) => `🎊 فائز جديد في عجلة الجوائز — ${d.prize ?? ''}`,
  displayName: 'فوز بجائزة العجلة (الإدارة)',
  previewData: {
    customerName: 'أحمد',
    customerEmail: 'user@example.com',
    prize: 'بوستر بحثي مجانًا',
    claimCode: 'SPIN-4F2A9C',
    wonAt: '2026-09-17',
    nextEligibleAt: '2026-10-17',
  },
}
export default E
