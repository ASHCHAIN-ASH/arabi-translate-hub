import { supabase } from '@/data/legacy/client';
import { InvoiceEmailService } from '@/utils/invoiceEmailService';

export type InvoiceStatus = 'draft' | 'pending' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id?: string;
  invoice_id?: string;
  item_name: string;
  description?: string | null;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  discount_amount?: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  order_id: string | null;
  user_id: string | null;
  customer_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  issue_date: string;
  due_date: string | null;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  currency: string;
  status: InvoiceStatus;
  tax_enabled?: boolean;
  tax_rate?: number;
  tax_inclusive?: boolean;
  is_guest?: boolean;
  notes: string | null;
  terms: string | null;
  paid_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoicePayment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  reference_number: string | null;
  status: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface InvoiceTimelineEntry {
  id: string;
  invoice_id: string;
  action_type: string;
  action_label: string;
  action_description: string | null;
  actor_user_id: string | null;
  metadata: any;
  created_at: string;
}

export interface CreateInvoiceInput {
  order_id?: string | null;
  user_id?: string | null;
  customer_id?: string | null;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  issue_date: string;
  due_date?: string | null;
  items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'total_price'>[];
  discount_amount?: number;
  tax_amount?: number;
  notes?: string;
  terms?: string;
  currency?: string;
  status?: InvoiceStatus;
  tax_enabled?: boolean;
  tax_rate?: number;
  tax_inclusive?: boolean;
  is_guest?: boolean;
}

export const DEFAULT_VAT_RATE = 15;

export interface TaxSettings {
  taxEnabled: boolean;
  taxRate: number;
  taxInclusive: boolean;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  taxableBase: number;
  tax: number;
  total: number;
}

const round2 = (n: number) => Math.round((Number(n) || 0) * 100) / 100;

/** يحسب الإجماليات مع/بدون ضريبة القيمة المضافة (شاملة أو مضافة). */
export const computeInvoiceTotals = (
  itemsTotal: number,
  discount: number,
  tax: TaxSettings,
): InvoiceTotals => {
  const subtotal = round2(itemsTotal);
  const safeDiscount = Math.min(Math.max(round2(discount), 0), subtotal);
  const base = round2(subtotal - safeDiscount);

  if (!tax.taxEnabled || !tax.taxRate) {
    return { subtotal, discount: safeDiscount, taxableBase: base, tax: 0, total: base };
  }

  const rate = Number(tax.taxRate) / 100;
  if (tax.taxInclusive) {
    const net = round2(base / (1 + rate));
    return { subtotal, discount: safeDiscount, taxableBase: net, tax: round2(base - net), total: base };
  }
  const taxValue = round2(base * rate);
  return { subtotal, discount: safeDiscount, taxableBase: base, tax: taxValue, total: round2(base + taxValue) };
};

const computeItemTotal = (item: { quantity: number; unit_price: number; discount_amount?: number; discount_percentage?: number }) => {
  const gross = item.quantity * item.unit_price;
  const discount = item.discount_amount ?? (gross * (item.discount_percentage ?? 0)) / 100;
  return Math.max(0, gross - discount);
};

export const InvoiceService = {
  computeItemTotal,

  async list(): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Invoice[];
  },

  async listForUser(userId: string): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Invoice[];
  },

  async get(id: string): Promise<Invoice> {
    const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
    if (error) throw error;
    return data as unknown as Invoice;
  },

  async getItems(invoiceId: string): Promise<InvoiceItem[]> {
    const { data, error } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as InvoiceItem[];
  },

  async getPayments(invoiceId: string): Promise<InvoicePayment[]> {
    const { data, error } = await supabase
      .from('invoice_payments' as any)
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('payment_date', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as InvoicePayment[];
  },

  async getTimeline(invoiceId: string): Promise<InvoiceTimelineEntry[]> {
    const { data, error } = await supabase
      .from('invoice_timeline' as any)
      .select('*')
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as InvoiceTimelineEntry[];
  },

  async create(input: CreateInvoiceInput): Promise<Invoice> {
    const items = input.items.map((it) => ({ ...it, total_price: computeItemTotal(it) }));
    const itemsTotal = items.reduce((s, it) => s + it.total_price, 0);
    const taxSettings: TaxSettings = {
      taxEnabled: input.tax_enabled ?? false,
      taxRate: input.tax_rate ?? DEFAULT_VAT_RATE,
      taxInclusive: input.tax_inclusive ?? false,
    };
    const totals = computeInvoiceTotals(itemsTotal, input.discount_amount ?? 0, taxSettings);
    const subtotal = totals.subtotal;
    const discount = totals.discount;
    const tax = totals.tax;
    const total = totals.total;


    const { data: inv, error } = await supabase
      .from('invoices')
      .insert({
        order_id: input.order_id ?? null,
        user_id: input.user_id ?? null,
        customer_id: input.customer_id ?? null,
        customer_name: input.customer_name,
        customer_email: input.customer_email ?? null,
        customer_phone: input.customer_phone ?? null,
        issue_date: input.issue_date,
        due_date: input.due_date ?? null,
        subtotal,
        discount_amount: discount,
        tax_amount: tax,
        total_amount: total,
        notes: input.notes ?? null,
        terms: input.terms ?? null,
        currency: input.currency ?? 'SAR',
        status: input.status ?? 'pending',
        tax_enabled: taxSettings.taxEnabled,
        tax_rate: taxSettings.taxRate,
        tax_inclusive: taxSettings.taxInclusive,
        is_guest: input.is_guest ?? !input.user_id,
      } as any)
      .select()
      .single();
    if (error) throw error;

    if (items.length) {
      const { error: itemsErr } = await supabase
        .from('invoice_items')
        .insert(items.map((it) => ({ ...it, invoice_id: inv.id })));
      if (itemsErr) throw itemsErr;
    }

    const created = inv as unknown as Invoice;

    // Automatic lifecycle email: notify the customer that an invoice was issued.
    if (created.customer_email && created.status !== 'draft') {
      InvoiceEmailService.sendQuietly({ invoiceId: created.id, event: 'issued' });
    }

    return created;
  },

  async update(id: string, patch: Partial<Invoice> & { items?: Omit<InvoiceItem, 'id' | 'invoice_id' | 'total_price'>[] }): Promise<void> {
    const { items, ...invoicePatch } = patch as any;

    if (items) {
      const recomputed = items.map((it: any) => ({ ...it, total_price: computeItemTotal(it) }));
      const itemsTotal = recomputed.reduce((s: number, it: any) => s + it.total_price, 0);
      const totals = computeInvoiceTotals(itemsTotal, invoicePatch.discount_amount ?? 0, {
        taxEnabled: invoicePatch.tax_enabled ?? false,
        taxRate: invoicePatch.tax_rate ?? DEFAULT_VAT_RATE,
        taxInclusive: invoicePatch.tax_inclusive ?? false,
      });
      invoicePatch.subtotal = totals.subtotal;
      invoicePatch.discount_amount = totals.discount;
      invoicePatch.tax_amount = totals.tax;
      invoicePatch.total_amount = totals.total;


      await supabase.from('invoice_items').delete().eq('invoice_id', id);
      await supabase.from('invoice_items').insert(recomputed.map((it: any) => ({ ...it, invoice_id: id })));
    }

    const { error } = await supabase.from('invoices').update(invoicePatch).eq('id', id);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
  },

  async addPayment(input: { invoice_id: string; amount: number; payment_method: string; payment_date: string; reference_number?: string; notes?: string }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('invoice_payments' as any).insert({
      invoice_id: input.invoice_id,
      amount: input.amount,
      payment_method: input.payment_method,
      payment_date: input.payment_date,
      reference_number: input.reference_number ?? null,
      notes: input.notes ?? null,
      created_by: user?.id ?? null,
    });
    if (error) throw error;

    // Automatic lifecycle email: payment receipt (and a final receipt when settled).
    try {
      const invoice = await this.get(input.invoice_id);
      if (invoice.customer_email) {
        InvoiceEmailService.sendQuietly({
          invoiceId: invoice.id,
          event: 'payment_received',
          amountPaid: input.amount,
          paymentMethod: input.payment_method,
          paymentDate: input.payment_date,
          referenceNumber: input.reference_number ?? null,
        });
        if (Number(invoice.remaining_amount ?? 0) <= 0 || invoice.status === 'paid') {
          InvoiceEmailService.sendQuietly({ invoiceId: invoice.id, event: 'paid' });
        }
      }
    } catch (e) {
      console.warn('invoice payment email skipped', e);
    }
  },

  async markSent(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'sent', sent_at: new Date().toISOString() } as any)
      .eq('id', id);
    if (error) throw error;
    await supabase.from('invoice_timeline' as any).insert({
      invoice_id: id,
      action_type: 'sent',
      action_label: 'إرسال للعميل',
      action_description: 'تم تحديد الفاتورة كمرسلة للعميل',
    });
  },

  formatCurrency(amount: number | null | undefined, currency = 'SAR'): string {
    const v = Number(amount ?? 0);
    const symbol = currency === 'SAR' ? 'ر.س' : currency;
    return `${v.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${symbol}`;
  },

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      draft: 'مسودة',
      pending: 'بانتظار الإرسال',
      sent: 'مرسلة',
      partially_paid: 'مدفوعة جزئياً',
      paid: 'مدفوعة',
      overdue: 'متأخرة',
      cancelled: 'ملغاة',
    };
    return map[status] ?? status;
  },

  statusColor(status: string): string {
    const map: Record<string, string> = {
      draft: 'bg-muted text-muted-foreground border-border',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      sent: 'bg-blue-100 text-blue-800 border-blue-200',
      partially_paid: 'bg-orange-100 text-orange-800 border-orange-200',
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-slate-200 text-slate-700 border-slate-300',
    };
    return map[status] ?? 'bg-muted text-muted-foreground';
  },
};
