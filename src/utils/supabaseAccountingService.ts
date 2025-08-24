import { createClient } from '@supabase/supabase-js';
import { 
  LedgerAccount, 
  JournalEntry, 
  JournalLine, 
  TaxRate, 
  TrialBalance, 
  GLEntry,
  TaxSummary,
  AccountType,
  IntegrationSetting,
  SyncLog
} from '@/types/accounting';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured, using mock data for accounting');
}

// خدمات دليل الحسابات
export const getAllAccounts = async (): Promise<LedgerAccount[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ledger_accounts')
        .select('*')
        .eq('is_active', true)
        .order('code');

      if (error) throw error;
      
      return data.map((row: any) => ({
        id: row.id,
        code: row.code,
        name: row.name,
        nameEn: row.name_en,
        type: row.type,
        parentId: row.parent_id,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
  }
  return [];
};

export const getAccountsByType = async (type: AccountType): Promise<LedgerAccount[]> => {
  const allAccounts = await getAllAccounts();
  return allAccounts.filter(account => account.type === type);
};

export const createAccount = async (accountData: Omit<LedgerAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('ledger_accounts')
        .insert([{
          code: accountData.code,
          name: accountData.name,
          name_en: accountData.nameEn,
          type: accountData.type,
          parent_id: accountData.parentId,
          is_active: accountData.isActive
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }
  throw new Error('Supabase not configured');
};

// خدمات قيود اليومية
export const createJournalEntry = async (
  entryData: Omit<JournalEntry, 'id' | 'createdAt'>
): Promise<string> => {
  if (supabase) {
    try {
      // إنشاء قيد اليومية
      const { data: entryResult, error: entryError } = await supabase
        .from('journal_entries')
        .insert([{
          entry_number: entryData.entryNumber,
          entry_date: entryData.entryDate,
          reference: entryData.reference,
          reference_id: entryData.referenceId,
          memo: entryData.memo,
          created_by: entryData.createdBy
        }])
        .select('id')
        .single();

      if (entryError) throw entryError;

      // إضافة تفاصيل القيد
      const lines = entryData.lines.map(line => ({
        entry_id: entryResult.id,
        account_id: line.accountId,
        debit_amount: line.debitAmount,
        credit_amount: line.creditAmount,
        currency: line.currency,
        customer_id: line.customerId,
        contract_id: line.contractId,
        invoice_id: line.invoiceId
      }));

      const { error: linesError } = await supabase
        .from('journal_lines')
        .insert(lines);

      if (linesError) throw linesError;

      return entryResult.id;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  }
  throw new Error('Supabase not configured');
};

// إنشاء قيد من فاتورة
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
  const entryNumber = `INV-${invoiceData.invoiceId}`;
  
  const lines: Omit<JournalLine, 'id' | 'entryId'>[] = [
    // مدين: حساب العملاء
    {
      accountId: '1120', // الذمم المدينة
      debitAmount: invoiceData.totalAmount,
      creditAmount: 0,
      currency: 'SAR',
      customerId: invoiceData.customerId,
      invoiceId: invoiceData.invoiceId
    },
    // دائن: الإيرادات
    {
      accountId: '4100', // إيرادات الخدمات
      debitAmount: 0,
      creditAmount: invoiceData.netAmount,
      currency: 'SAR',
      customerId: invoiceData.customerId,
      invoiceId: invoiceData.invoiceId
    }
  ];

  // إضافة الضريبة إن وجدت
  if (invoiceData.taxAmount > 0) {
    lines.push({
      accountId: '2120', // الضريبة المستحقة
      debitAmount: 0,
      creditAmount: invoiceData.taxAmount,
      currency: 'SAR',
      customerId: invoiceData.customerId,
      invoiceId: invoiceData.invoiceId
    });
  }

  return await createJournalEntry({
    entryNumber,
    entryDate: invoiceData.invoiceDate,
    reference: 'Invoice',
    referenceId: invoiceData.invoiceId,
    memo: `فاتورة رقم ${invoiceData.invoiceId}`,
    lines: lines as JournalLine[]
  });
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
  const entryNumber = `PAY-${paymentData.paymentId}`;
  
  const lines: Omit<JournalLine, 'id' | 'entryId'>[] = [
    // مدين: النقدية/البنك
    {
      accountId: '1110', // النقدية والبنوك
      debitAmount: paymentData.amount - (paymentData.feeAmount || 0),
      creditAmount: 0,
      currency: 'SAR',
      customerId: paymentData.customerId
    },
    // دائن: حساب العملاء
    {
      accountId: '1120', // الذمم المدينة
      debitAmount: 0,
      creditAmount: paymentData.amount,
      currency: 'SAR',
      customerId: paymentData.customerId
    }
  ];

  // إضافة رسوم بوابة الدفع إن وجدت
  if (paymentData.feeAmount && paymentData.feeAmount > 0) {
    lines.push({
      accountId: '5110', // رسوم بوابات الدفع
      debitAmount: paymentData.feeAmount,
      creditAmount: 0,
      currency: 'SAR',
      customerId: paymentData.customerId
    });
  }

  return await createJournalEntry({
    entryNumber,
    entryDate: paymentData.paymentDate,
    reference: 'Payment',
    referenceId: paymentData.paymentId,
    memo: `دفعة بواسطة ${paymentData.paymentMethod}`,
    lines: lines as JournalLine[]
  });
};

// تقرير ميزان المراجعة
export const getTrialBalance = async (
  fromDate: string,
  toDate: string
): Promise<TrialBalance[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .rpc('get_trial_balance', {
          from_date: fromDate,
          to_date: toDate
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching trial balance:', error);
      return [];
    }
  }
  return [];
};

// تقرير دفتر الأستاذ العام
export const getGeneralLedger = async (
  accountId: string,
  fromDate: string,
  toDate: string
): Promise<GLEntry[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .rpc('get_general_ledger', {
          account_id: accountId,
          from_date: fromDate,
          to_date: toDate
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching general ledger:', error);
      return [];
    }
  }
  return [];
};

// ملخص الضريبة
export const getTaxSummary = async (
  fromDate: string,
  toDate: string
): Promise<TaxSummary[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .rpc('get_tax_summary', {
          from_date: fromDate,
          to_date: toDate
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching tax summary:', error);
      return [];
    }
  }
  return [];
};

// خدمات معدلات الضريبة
export const getAllTaxRates = async (): Promise<TaxRate[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('tax_rates')
        .select('*')
        .order('name');

      if (error) throw error;
      
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        ratePercent: row.rate_percent,
        isDefault: row.is_default,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }));
    } catch (error) {
      console.error('Error fetching tax rates:', error);
      return [];
    }
  }
  return [];
};

export const getDefaultTaxRate = async (): Promise<TaxRate | null> => {
  const taxRates = await getAllTaxRates();
  return taxRates.find(rate => rate.isDefault) || null;
};

// خدمات المزامنة
export const syncWithProvider = async (provider: string): Promise<void> => {
  if (supabase) {
    try {
      // محاكاة مزامنة - في الواقع ستتم المزامنة مع المزود الفعلي
      const { error } = await supabase
        .from('sync_logs')
        .insert([{
          provider,
          entity_type: 'full_sync',
          direction: 'push',
          status: 'success',
          message: 'Mock sync completed successfully'
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error syncing with provider:', error);
      throw error;
    }
  }
};