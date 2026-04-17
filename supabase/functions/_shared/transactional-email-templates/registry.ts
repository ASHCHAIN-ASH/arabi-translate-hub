/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as quoteNotification } from './quote-notification.tsx'
import { template as orderUpdate } from './order-update.tsx'
import { template as contractSigned } from './contract-signed.tsx'
import { template as contractSignedAdmin } from './contract-signed-admin.tsx'
import { template as contractOtp } from './contract-otp.tsx'
import { template as contractReminder } from './contract-reminder.tsx'
import { template as walletTopupRequested } from './wallet-topup-requested.tsx'
import { template as walletTopupApproved } from './wallet-topup-approved.tsx'
import { template as walletTopupRejected } from './wallet-topup-rejected.tsx'
import { template as walletInvoicePayment } from './wallet-invoice-payment.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'quote-notification': quoteNotification,
  'order-update': orderUpdate,
  'contract-signed': contractSigned,
  'contract-signed-admin': contractSignedAdmin,
  'contract-otp': contractOtp,
  'contract-reminder': contractReminder,
  'wallet-topup-requested': walletTopupRequested,
  'wallet-topup-approved': walletTopupApproved,
  'wallet-topup-rejected': walletTopupRejected,
  'wallet-invoice-payment': walletInvoicePayment,
}
