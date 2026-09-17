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
import { template as deadlineReminder } from './deadline-reminder.tsx'
import { template as financingStatusUpdate } from './financing-status-update.tsx'
import { template as invoiceIssued } from './invoice-issued.tsx'
import { template as invoicePaymentReceived } from './invoice-payment-received.tsx'
import { template as invoicePaid } from './invoice-paid.tsx'
import { template as invoiceOverdue } from './invoice-overdue.tsx'
import { template as emailVerification } from './email-verification.tsx'
import { template as passwordReset } from './password-reset.tsx'
import { template as orderReceived } from './order-received.tsx'
import { template as ticketCreated } from './ticket-created.tsx'
import { template as ticketReply } from './ticket-reply.tsx'
import { template as complaintReceived } from './complaint-received.tsx'
import { template as supportReply } from './support-reply.tsx'
import { template as financeNotice } from './finance-notice.tsx'
import { template as spinPrizeWon } from './spin-prize-won.tsx'
import { template as spinPrizeAdmin } from './spin-prize-admin.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'financing-status-update': financingStatusUpdate,
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
  'deadline-reminder': deadlineReminder,
  'invoice-issued': invoiceIssued,
  'invoice-payment-received': invoicePaymentReceived,
  'invoice-paid': invoicePaid,
  'invoice-overdue': invoiceOverdue,
  'email-verification': emailVerification,
  'password-reset': passwordReset,
  'order-received': orderReceived,
  'ticket-created': ticketCreated,
  'ticket-reply': ticketReply,
  'complaint-received': complaintReceived,
  'support-reply': supportReply,
  'finance-notice': financeNotice,
  'spin-prize-won': spinPrizeWon,
  'spin-prize-admin': spinPrizeAdmin,
}
