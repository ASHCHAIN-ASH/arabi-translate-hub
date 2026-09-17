import { supabase } from '@/data/legacy/client';

export type InvoiceEmailEvent = 'issued' | 'payment_received' | 'paid' | 'overdue';

export interface SendInvoiceEmailInput {
  invoiceId: string;
  event?: InvoiceEmailEvent;
  to?: string;
  cc?: string[];
  subject?: string;
  customMessage?: string;
  amountPaid?: number;
  paymentMethod?: string;
  paymentDate?: string;
  referenceNumber?: string | null;
}

export interface EmailLogEntry {
  id: string;
  message_id: string;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export const EMAIL_STATUS_AR: Record<string, string> = {
  pending: 'قيد الإرسال',
  sent: 'تم الإرسال',
  failed: 'فشل الإرسال',
  dlq: 'فشل نهائي',
  suppressed: 'موقوف (إلغاء اشتراك)',
};

export const EMAIL_TEMPLATE_AR: Record<string, string> = {
  'invoice-issued': 'إصدار فاتورة',
  'invoice-payment-received': 'استلام دفعة',
  'invoice-paid': 'اكتمال السداد',
  'invoice-overdue': 'تذكير بالسداد',
  'wallet-invoice-payment': 'دفع فاتورة من المحفظة',
  'wallet-topup-requested': 'طلب شحن محفظة',
  'wallet-topup-approved': 'اعتماد شحن محفظة',
  'wallet-topup-rejected': 'رفض شحن محفظة',
  'quote-notification': 'عرض سعر',
  'order-update': 'تحديث طلب',
  'contract-signed': 'توقيع عقد',
  'contract-signed-admin': 'إشعار توقيع عقد (إدارة)',
  'contract-otp': 'رمز توقيع العقد',
  'contract-reminder': 'تذكير بتوقيع عقد',
  'deadline-reminder': 'تذكير بموعد تسليم',
  'financing-status-update': 'تحديث حالة تمويل',
};

export const INVOICE_TEMPLATES = [
  'invoice-issued',
  'invoice-payment-received',
  'invoice-paid',
  'invoice-overdue',
  'wallet-invoice-payment',
];

export const InvoiceEmailService = {
  /** Single entry point for every invoice-related email. */
  async send(input: SendInvoiceEmailInput) {
    const { data, error } = await supabase.functions.invoke('send-invoice-email', {
      body: {
        invoice_id: input.invoiceId,
        event: input.event ?? 'issued',
        to: input.to,
        cc: input.cc ?? [],
        subject: input.subject,
        custom_message: input.customMessage,
        amount_paid: input.amountPaid,
        payment_method: input.paymentMethod,
        payment_date: input.paymentDate,
        reference_number: input.referenceNumber ?? null,
      },
    });
    if (error) throw error;
    if (data && (data as any).error) throw new Error((data as any).error);
    return data;
  },

  /** Fire-and-forget variant for automatic lifecycle emails. */
  sendQuietly(input: SendInvoiceEmailInput) {
    this.send(input).catch((e) => console.warn('invoice email skipped', e?.message));
  },

  async logsForInvoice(invoiceId: string): Promise<EmailLogEntry[]> {
    const { data, error } = await supabase
      .from('email_send_log' as any)
      .select('*')
      .eq('metadata->>invoice_id', invoiceId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as EmailLogEntry[];
  },

  async logsForRecipient(email: string, limit = 25): Promise<EmailLogEntry[]> {
    const { data, error } = await supabase
      .from('email_send_log' as any)
      .select('*')
      .ilike('recipient_email', email)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as EmailLogEntry[];
  },

  /** Latest log row per invoice id, for list views. */
  async latestByInvoice(invoiceIds: string[]): Promise<Record<string, EmailLogEntry>> {
    if (!invoiceIds.length) return {};
    const { data, error } = await supabase
      .from('email_send_log' as any)
      .select('*')
      .in('metadata->>invoice_id', invoiceIds)
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) throw error;
    const map: Record<string, EmailLogEntry> = {};
    for (const row of (data ?? []) as unknown as EmailLogEntry[]) {
      const key = row.metadata?.invoice_id;
      if (key && !map[key]) map[key] = row;
    }
    return map;
  },

  async invoiceEmailStats(): Promise<{ sent: number; pending: number; failed: number; suppressed: number }> {
    const { data, error } = await supabase
      .from('email_send_log' as any)
      .select('status, template_name')
      .in('template_name', INVOICE_TEMPLATES)
      .limit(5000);
    if (error) throw error;
    const rows = (data ?? []) as unknown as { status: string }[];
    return {
      sent: rows.filter((r) => r.status === 'sent').length,
      pending: rows.filter((r) => r.status === 'pending').length,
      failed: rows.filter((r) => r.status === 'failed' || r.status === 'dlq').length,
      suppressed: rows.filter((r) => r.status === 'suppressed').length,
    };
  },
};
