// أنواع البيانات للنظام المحاسبي
export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  type: AccountType;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export interface JournalEntry {
  id: string;
  entryNumber: string;
  entryDate: string;
  reference?: string;
  referenceId?: string;
  memo?: string;
  createdBy?: string;
  createdAt: string;
  lines: JournalLine[];
}

export interface JournalLine {
  id: string;
  entryId: string;
  accountId: string;
  account?: LedgerAccount;
  debitAmount: number;
  creditAmount: number;
  currency: string;
  customerId?: string;
  contractId?: string;
  invoiceId?: string;
}

export interface TaxRate {
  id: string;
  name: string;
  ratePercent: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationSetting {
  id: string;
  provider: IntegrationProvider;
  configJson: Record<string, any>;
  isEnabled: boolean;
  updatedAt: string;
}

export type IntegrationProvider = 'xero' | 'quickbooks' | 'mock';

export interface SyncLog {
  id: string;
  provider: string;
  entityType: string;
  entityId?: string;
  direction: 'push' | 'pull';
  status: 'success' | 'failed';
  message?: string;
  createdAt: string;
}

export interface TrialBalance {
  accountCode: string;
  accountName: string;
  debitTotal: number;
  creditTotal: number;
  balance: number;
}

export interface GLEntry {
  date: string;
  entryNumber: string;
  reference?: string;
  memo?: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
}

export interface TaxSummary {
  taxableSales: number;
  taxAmount: number;
  taxRate: number;
  period: string;
}