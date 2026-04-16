import { supabase } from '@/integrations/supabase/client';
import type {
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
// Chart of Accounts — Real DB
// ==============================

export const getAllAccounts = async (): Promise<LedgerAccount[]> => {
  const { data, error } = await (supabase as any)
    .from('ledger_accounts')
    .select('*')
    .eq('is_active', true)
    .order('code');

  if (error) {
    console.error('Error fetching ledger accounts:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    nameEn: row.name_en,
    type: row.account_type as AccountType,
    parentId: row.parent_id,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const getAccountsByType = async (type: AccountType): Promise<LedgerAccount[]> => {
  const all = await getAllAccounts();
  return all.filter(a => a.type === type);
};

export const createAccount = async (
  accountData: Omit<LedgerAccount, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const { data, error } = await (supabase as any)
    .from('ledger_accounts')
    .insert({
      code: accountData.code,
      name: accountData.name,
      name_en: accountData.nameEn,
      account_type: accountData.type,
      parent_id: accountData.parentId,
      is_active: accountData.isActive,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

// ==============================
// Journal Entries — Immutable after posting
// ==============================

export const createJournalEntry = async (
  entryData: Omit<JournalEntry, 'id' | 'createdAt'>
): Promise<string> => {
  // Validate double-entry balance
  const totalDebit = entryData.lines.reduce((s, l) => s + l.debitAmount, 0);
  const totalCredit = entryData.lines.reduce((s, l) => s + l.creditAmount, 0);
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(`Debits (${totalDebit}) must equal credits (${totalCredit})`);
  }

  const { data: header, error: hErr } = await (supabase as any)
    .from('ledger_entries')
    .insert({
      entry_number: '',
      entry_date: entryData.entryDate,
      reference: entryData.reference,
      reference_type: entryData.referenceId ? 'manual' : null,
      reference_id: entryData.referenceId,
      memo: entryData.memo,
      is_posted: false,
    })
    .select()
    .single();

  if (hErr) throw hErr;

  const lineRows = entryData.lines.map(l => ({
    entry_id: header.id,
    account_id: l.accountId,
    debit_amount: l.debitAmount,
    credit_amount: l.creditAmount,
    description: null,
    client_id: l.customerId,
    invoice_id: l.invoiceId,
    contract_id: l.contractId,
  }));

  const { error: lErr } = await (supabase as any)
    .from('ledger_lines')
    .insert(lineRows);

  if (lErr) throw lErr;
  return header.id;
};

export const createInvoiceJournalEntry = async (invoiceData: {
  invoiceId: string;
  customerId: string;
  totalAmount: number;
  taxAmount: number;
  netAmount: number;
  invoiceDate: string;
}): Promise<string> => {
  const accounts = await getAllAccounts();
  const arAccount = accounts.find(a => a.code === '1100');
  const revenueAccount = accounts.find(a => a.code === '4000');
  const vatAccount = accounts.find(a => a.code === '2100');

  if (!arAccount || !revenueAccount || !vatAccount) {
    throw new Error('Required accounts not found in chart of accounts');
  }

  const entry: Omit<JournalEntry, 'id' | 'createdAt'> = {
    entryNumber: '',
    entryDate: invoiceData.invoiceDate,
    reference: 'فاتورة',
    referenceId: invoiceData.invoiceId,
    memo: `قيد فاتورة ${invoiceData.invoiceId.substring(0, 8)}`,
    lines: [
      { id: '', entryId: '', accountId: arAccount.id, debitAmount: invoiceData.totalAmount, creditAmount: 0, currency: 'SAR', customerId: invoiceData.customerId, invoiceId: invoiceData.invoiceId },
      { id: '', entryId: '', accountId: revenueAccount.id, debitAmount: 0, creditAmount: invoiceData.netAmount, currency: 'SAR', invoiceId: invoiceData.invoiceId },
      { id: '', entryId: '', accountId: vatAccount.id, debitAmount: 0, creditAmount: invoiceData.taxAmount, currency: 'SAR', invoiceId: invoiceData.invoiceId },
    ],
  };

  const entryId = await createJournalEntry(entry);
  // Auto-post invoice entries
  await postJournalEntry(entryId);
  return entryId;
};

export const createPaymentJournalEntry = async (paymentData: {
  paymentId: string;
  customerId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  feeAmount?: number;
}): Promise<string> => {
  const accounts = await getAllAccounts();
  const cashAccount = accounts.find(a => a.code === '1000');
  const arAccount = accounts.find(a => a.code === '1100');

  if (!cashAccount || !arAccount) {
    throw new Error('Required accounts not found');
  }

  const entry: Omit<JournalEntry, 'id' | 'createdAt'> = {
    entryNumber: '',
    entryDate: paymentData.paymentDate,
    reference: 'دفعة',
    referenceId: paymentData.paymentId,
    memo: `تحصيل دفعة - ${paymentData.paymentMethod}`,
    lines: [
      { id: '', entryId: '', accountId: cashAccount.id, debitAmount: paymentData.amount, creditAmount: 0, currency: 'SAR', customerId: paymentData.customerId },
      { id: '', entryId: '', accountId: arAccount.id, debitAmount: 0, creditAmount: paymentData.amount, currency: 'SAR', customerId: paymentData.customerId },
    ],
  };

  const entryId = await createJournalEntry(entry);
  await postJournalEntry(entryId);
  return entryId;
};

const postJournalEntry = async (entryId: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from('ledger_entries')
    .update({ is_posted: true, posted_at: new Date().toISOString() })
    .eq('id', entryId)
    .eq('is_posted', false);

  if (error) throw error;
};

// ==============================
// Trial Balance — Real DB via RPC
// ==============================

export const getTrialBalance = async (fromDate: string, toDate: string): Promise<TrialBalance[]> => {
  const { data, error } = await (supabase as any).rpc('get_trial_balance', {
    p_from_date: fromDate,
    p_to_date: toDate,
  });

  if (error) {
    console.error('Trial balance error, falling back to invoice-based:', error);
    return getTrialBalanceFallback(fromDate, toDate);
  }

  return (data || []).map((row: any) => ({
    accountCode: row.account_code,
    accountName: row.account_name,
    debitTotal: Number(row.debit_total),
    creditTotal: Number(row.credit_total),
    balance: Number(row.balance),
  }));
};

// Fallback: derive from invoices/payments if ledger tables not yet migrated
const getTrialBalanceFallback = async (fromDate: string, toDate: string): Promise<TrialBalance[]> => {
  const { data: invoices } = await supabase
    .from('business_invoices')
    .select('subtotal, vat_amount, total, status')
    .gte('issue_date', fromDate)
    .lte('issue_date', toDate);

  const { data: payments } = await supabase
    .from('business_payments')
    .select('amount, status')
    .gte('payment_date', fromDate)
    .lte('payment_date', toDate);

  const totalRevenue = (invoices || []).reduce((s, i) => s + (i.subtotal || 0), 0);
  const totalVat = (invoices || []).reduce((s, i) => s + (i.vat_amount || 0), 0);
  const totalInvoiced = (invoices || []).reduce((s, i) => s + (i.total || 0), 0);
  const totalPaid = (payments || []).filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);

  return [
    { accountCode: '1000', accountName: 'النقدية / البنك', debitTotal: totalPaid, creditTotal: 0, balance: totalPaid },
    { accountCode: '1100', accountName: 'الذمم المدينة', debitTotal: Math.max(totalInvoiced - totalPaid, 0), creditTotal: 0, balance: totalInvoiced - totalPaid },
    { accountCode: '2100', accountName: 'ضريبة القيمة المضافة', debitTotal: 0, creditTotal: totalVat, balance: -totalVat },
    { accountCode: '4000', accountName: 'إيرادات الخدمات', debitTotal: 0, creditTotal: totalRevenue, balance: -totalRevenue },
  ];
};

// ==============================
// General Ledger
// ==============================

export const getGeneralLedger = async (accountId: string, fromDate: string, toDate: string): Promise<GLEntry[]> => {
  const { data, error } = await (supabase as any)
    .from('ledger_lines')
    .select('*, ledger_entries!inner(*)')
    .eq('account_id', accountId)
    .eq('ledger_entries.is_posted', true)
    .gte('ledger_entries.entry_date', fromDate)
    .lte('ledger_entries.entry_date', toDate)
    .order('created_at');

  if (error) {
    console.error('GL query error:', error);
    return [];
  }

  let balance = 0;
  return (data || []).map((row: any) => {
    balance += Number(row.debit_amount) - Number(row.credit_amount);
    return {
      date: row.ledger_entries.entry_date,
      entryNumber: row.ledger_entries.entry_number,
      reference: row.ledger_entries.reference,
      memo: row.description || row.ledger_entries.memo,
      debitAmount: Number(row.debit_amount),
      creditAmount: Number(row.credit_amount),
      balance,
    };
  });
};

// ==============================
// Tax Summary
// ==============================

export const getTaxSummary = async (fromDate: string, toDate: string): Promise<TaxSummary[]> => {
  const { data: invoices } = await supabase
    .from('business_invoices')
    .select('subtotal, vat_amount, vat_rate, issue_date')
    .gte('issue_date', fromDate)
    .lte('issue_date', toDate);

  if (!invoices) return [];

  const quarters = new Map<string, { taxableSales: number; taxAmount: number; taxRate: number }>();
  invoices.forEach(inv => {
    const d = new Date(inv.issue_date || '');
    const q = `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`;
    const ex = quarters.get(q) || { taxableSales: 0, taxAmount: 0, taxRate: inv.vat_rate || 15 };
    ex.taxableSales += inv.subtotal || 0;
    ex.taxAmount += inv.vat_amount || 0;
    quarters.set(q, ex);
  });

  return Array.from(quarters.entries()).map(([period, d]) => ({ period, ...d }));
};

// ==============================
// Tax Rates — Real DB
// ==============================

export const getAllTaxRates = async (): Promise<TaxRate[]> => {
  const { data, error } = await (supabase as any)
    .from('tax_rates')
    .select('*')
    .order('created_at');

  if (error) {
    return [{
      id: 'vat-sa-15', name: 'ضريبة القيمة المضافة', ratePercent: 15,
      isDefault: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }];
  }

  return (data || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    ratePercent: Number(r.rate_percent),
    isDefault: r.is_default,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
};

export const getDefaultTaxRate = async (): Promise<TaxRate | null> => {
  const rates = await getAllTaxRates();
  return rates.find(r => r.isDefault) || null;
};

// ==============================
// Sync (placeholder)
// ==============================

export const syncWithProvider = async (provider: string): Promise<void> => {
  console.log(`Sync with ${provider} — not implemented`);
};
