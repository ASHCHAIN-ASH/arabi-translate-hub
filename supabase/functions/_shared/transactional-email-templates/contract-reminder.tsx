/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Heading, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { BrandEmail, S, noteBox } from './_brand.tsx'

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
  <BrandEmail
    preview={`تذكير: العقد ${contractNumber} بانتظار توقيعك`}
    accent="amber"
    tagline="إدارة العقود الأكاديمية"
    badge="بانتظار التوقيع"
    cta={{ label: 'مراجعة العقد وتوقيعه', url: contractUrl }}
    footerNote="إذا واجهتك أي مشكلة في التوقيع، يرجى التواصل مع فريقنا."
  >
        <Heading style={S.title}>تذكير بتوقيع العقد ⏰</Heading>
        <Text style={S.greeting}>مرحباً {clientName}،</Text>
        <Text style={S.text}>
          نود تذكيركم بأن العقد رقم <strong>{contractNumber}</strong>
          {contractTitle ? <> — {contractTitle}</> : null} لا يزال بانتظار توقيعكم منذ أكثر من{' '}
          <strong>{hoursPending} ساعة</strong>.
        </Text>
        <Text style={noteBox('amber')}>
          يرجى مراجعة العقد وتوقيعه إلكترونياً للبدء في تنفيذ الخدمة.
        </Text>
  </BrandEmail>
)


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
