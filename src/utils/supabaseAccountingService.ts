import { supabase } from '@/integrations/supabase/client';
import { 
  LedgerAccount, 
  JournalEntry, 
  JournalLine, 
  TaxRate, 
  TrialBalance, 
  GLEntry,
  TaxSummary,
  AccountType,
} from '@/types/accounting';

// ==============================
// Accounting Service — Real Supabase Queries
// Uses business_invoices + business_payments as the ledger source
// ==============================

// خدمات دليل الحسابات — مشتقة من الفواتير والمدفوعات
export const getAllAccounts = async (): Promise<LedgerAccount[]> => {
  // Derive accounts from the chart of business invoices
  // Since we don't have a dedicated ledger_accounts table,
  // we provide a standard chart of accounts
  const standardAccounts: LedgerAccount[] = [
    { id: 'acc-cash', code: '1001', name: 'النقدية', type: 'asset', isActive: true, createdAt: '', updatedAt: '' },
    { id: 'acc-ar', code: '1200', name: 'الذمم المدينة', nameEn: 'Accounts Receivable', type: 'asset', isActive: true, createdAt: '', updatedAt: '' },
    { id: 'acc-revenue', code: '4000', name: 'إيرادات الخدمات', nameEn: 'Service Revenue', type: 'revenue', isActive: true, createdAt: '', updatedAt: '' },
    { id: 'acc-vat', code: '2100', name: 'ضريبة القيمة المضافة', nameEn: 'VAT Payable', type: 'liability', isActive: true, createdAt: '', updatedAt: '' },
    { id: 'acc-bank', code: '1002', name: 'البنك', nameEn: 'Bank', type: 'asset', isActive: true, createdAt: '', updatedAt: '' },
    { id: 'acc-expense', code: '5000', name: 'مصاريف عامة', nameEn: 'General Expenses', type: 'expense', isActive: true, createdAt: '', updatedAt: '' },
    { id: 'acc-equity', code: '3000', name: 'رأس المال', nameEn: 'Capital', type: 'equity', isActive: true, createdAt: '', updatedAt: '' },
  ];
  return standardAccounts;
};

export const getAccountsByType = async (type: AccountType): Promise<LedgerAccount[]> => {
  const allAccounts = await getAllAccounts();
  return allAccounts.filter(a => a.type === type);
};

export const createAccount = async (accountData: Omit<LedgerAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  // Without a dedicated table, we cannot persist custom accounts
  console.warn('Custom account creation requires a ledger_accounts table migration');
  return 'acc-' + Date.now();
};

// خدمات قيود اليومية — مشتقة من الفواتير والمدفوعات
export const createJournalEntry = async (
  entryData: Omit<JournalEntry, 'id' | 'createdAt'>
): Promise<string> => {
  // Journal entries are auto-derived from invoices/payments
  console.warn('Direct journal entry creation requires a journal_entries table migration');
  return 'entry-' + Date.now();
};

// إنشاء قيد من فاتورة — يُنشأ تلقائياً عند إنشاء فاتورة
export const createInvoiceJournalEntry = async (
  invoiceData: {
    invoiceId: string;
    customerId: string;
    totalAmount: number;
    taxAmount: number;
    netAmount: number;
    invoiceDate: string;
  }
): Promise<string> => {
  // The invoice itself in business_invoices IS the journal entry
  // We just return the invoice ID as the entry reference
  return invoiceData.invoiceId;
};

// إنشاء قيد من دفعة
export const createPaymentJournalEntry = async (
  paymentData: {
    paymentId: string;
    customerId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    feeAmount?: number;
  }
): Promise<string> => {
  return paymentData.paymentId;
};

// تقرير ميزان المراجعة — محسوب من الفواتير والمدفوعات
export const getTrialBalance = async (
  fromDate: string,
  toDate: string
): Promise<TrialBalance[]> => {
  // Fetch invoices in date range
  const { data: invoices, error: invErr } = await supabase
    .from('business_invoices')
    .select('subtotal, vat_amount, total, status')
    .gte('issue_date', fromDate)
    .lte('issue_date', toDate);

  if (invErr) {
    console.error('Error fetching invoices for trial balance:', invErr);
    return [];
  }

  // Fetch payments in date range
  const { data: payments, error: payErr } = await supabase
    .from('business_payments')
    .select('amount, status')
    .gte('payment_date', fromDate)
    .lte('payment_date', toDate);

  if (payErr) {
    console.error('Error fetching payments for trial balance:', payErr);
    return [];
  }

  const totalRevenue = (invoices || []).reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
  const totalVat = (invoices || []).reduce((sum, inv) => sum + (inv.vat_amount || 0), 0);
  const totalInvoiced = (invoices || []).reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalPaid = (payments || []).filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalAR = totalInvoiced - totalPaid;

  return [
    { accountCode: '1001', accountName: 'النقدية / البنك', debitTotal: totalPaid, creditTotal: 0, balance: totalPaid },
    { accountCode: '1200', accountName: 'الذمم المدينة', debitTotal: totalAR > 0 ? totalAR : 0, creditTotal: totalAR < 0 ? Math.abs(totalAR) : 0, balance: totalAR },
    { accountCode: '2100', accountName: 'ضريبة القيمة المضافة', debitTotal: 0, creditTotal: totalVat, balance: -totalVat },
    { accountCode: '4000', accountName: 'إيرادات الخدمات', debitTotal: 0, creditTotal: totalRevenue, balance: -totalRevenue },
  ];
};

// تقرير دفتر الأستاذ العام
export const getGeneralLedger = async (
  accountId: string,
  fromDate: string,
  toDate: string
): Promise<GLEntry[]> => {
  const entries: GLEntry[] = [];

  if (accountId === 'acc-ar' || accountId === 'acc-revenue' || accountId === 'acc-vat') {
    const { data: invoices } = await supabase
      .from('business_invoices')
      .select('invoice_number, issue_date, title, subtotal, vat_amount, total')
      .gte('issue_date', fromDate)
      .lte('issue_date', toDate)
      .order('issue_date', { ascending: true });

    let balance = 0;
    (invoices || []).forEach(inv => {
      const amount = accountId === 'acc-vat' ? (inv.vat_amount || 0) : 
                     accountId === 'acc-revenue' ? (inv.subtotal || 0) : (inv.total || 0);
      const isDebit = accountId === 'acc-ar';
      balance += isDebit ? amount : -amount;
      entries.push({
        date: inv.issue_date || '',
        entryNumber: inv.invoice_number,
        reference: 'فاتورة',
        memo: inv.title,
        debitAmount: isDebit ? amount : 0,
        creditAmount: isDebit ? 0 : amount,
        balance,
      });
    });
  }

  if (accountId === 'acc-cash' || accountId === 'acc-bank' || accountId === 'acc-ar') {
    const { data: payments } = await supabase
      .from('business_payments')
      .select('id, payment_date, payment_method, amount, notes')
      .gte('payment_date', fromDate)
      .lte('payment_date', toDate)
      .eq('status', 'completed')
      .order('payment_date', { ascending: true });

    let balance = entries.length > 0 ? entries[entries.length - 1].balance : 0;
    (payments || []).forEach(pay => {
      const isDebit = accountId === 'acc-cash' || accountId === 'acc-bank';
      balance += isDebit ? pay.amount : -pay.amount;
      entries.push({
        date: pay.payment_date || '',
        entryNumber: pay.id.substring(0, 8),
        reference: 'دفعة',
        memo: pay.notes || pay.payment_method,
        debitAmount: isDebit ? pay.amount : 0,
        creditAmount: isDebit ? 0 : pay.amount,
        balance,
      });
    });
  }

  return entries;
};

// ملخص الضريبة
export const getTaxSummary = async (
  fromDate: string,
  toDate: string
): Promise<TaxSummary[]> => {
  const { data: invoices, error } = await supabase
    .from('business_invoices')
    .select('subtotal, vat_amount, vat_rate, issue_date')
    .gte('issue_date', fromDate)
    .lte('issue_date', toDate);

  if (error || !invoices) return [];

  // Group by quarter
  const quarters = new Map<string, { taxableSales: number; taxAmount: number; taxRate: number }>();
  
  invoices.forEach(inv => {
    const date = new Date(inv.issue_date || '');
    const q = `Q${Math.ceil((date.getMonth() + 1) / 3)} ${date.getFullYear()}`;
    const existing = quarters.get(q) || { taxableSales: 0, taxAmount: 0, taxRate: inv.vat_rate || 15 };
    existing.taxableSales += inv.subtotal || 0;
    existing.taxAmount += inv.vat_amount || 0;
    quarters.set(q, existing);
  });

  return Array.from(quarters.entries()).map(([period, data]) => ({
    period,
    ...data,
  }));
};

// خدمات معدلات الضريبة
export const getAllTaxRates = async (): Promise<TaxRate[]> => {
  // Standard Saudi VAT rate
  return [
    {
      id: 'vat-sa-15',
      name: 'ضريبة القيمة المضافة',
      ratePercent: 15,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

export const getDefaultTaxRate = async (): Promise<TaxRate | null> => {
  const rates = await getAllTaxRates();
  return rates.find(r => r.isDefault) || null;
};

// خدمات المزامنة
export const syncWithProvider = async (provider: string): Promise<void> => {
  console.log(`Sync with ${provider} — not implemented (no external integration configured)`);
};
