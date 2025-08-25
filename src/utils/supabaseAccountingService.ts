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

// Mock data - Supabase accounting tables not configured yet
console.warn('Supabase accounting tables not configured, using mock data for accounting');

// خدمات دليل الحسابات
export const getAllAccounts = async (): Promise<LedgerAccount[]> => {
  // Using mock data - accounting tables not configured yet
  return [];
};

export const getAccountsByType = async (type: AccountType): Promise<LedgerAccount[]> => {
  const allAccounts = await getAllAccounts();
  return allAccounts.filter(account => account.type === type);
};

export const createAccount = async (accountData: Omit<LedgerAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  // Mock implementation - return a fake ID
  return 'mock-account-id-' + Date.now();
};

// خدمات قيود اليومية
export const createJournalEntry = async (
  entryData: Omit<JournalEntry, 'id' | 'createdAt'>
): Promise<string> => {
  // Mock implementation - return a fake ID
  return 'mock-entry-id-' + Date.now();
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
  // Mock implementation - return a fake ID
  return 'mock-invoice-entry-' + Date.now();
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
  // Mock implementation - return a fake ID
  return 'mock-payment-entry-' + Date.now();
};

// تقرير ميزان المراجعة
export const getTrialBalance = async (
  fromDate: string,
  toDate: string
): Promise<TrialBalance[]> => {
  // Mock implementation - return empty array
  return [];
};

// تقرير دفتر الأستاذ العام
export const getGeneralLedger = async (
  accountId: string,
  fromDate: string,
  toDate: string
): Promise<GLEntry[]> => {
  // Mock implementation - return empty array
  return [];
};

// ملخص الضريبة
export const getTaxSummary = async (
  fromDate: string,
  toDate: string
): Promise<TaxSummary[]> => {
  // Mock implementation - return empty array
  return [];
};

// خدمات معدلات الضريبة
export const getAllTaxRates = async (): Promise<TaxRate[]> => {
  // Mock implementation - return default tax rate
  return [
    {
      id: 'mock-tax-1',
      name: 'ضريبة القيمة المضافة',
      ratePercent: 15,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

export const getDefaultTaxRate = async (): Promise<TaxRate | null> => {
  const taxRates = await getAllTaxRates();
  return taxRates.find(rate => rate.isDefault) || null;
};

// خدمات المزامنة
export const syncWithProvider = async (provider: string): Promise<void> => {
  // Mock implementation - do nothing
  console.log(`Mock sync with ${provider} completed`);
};