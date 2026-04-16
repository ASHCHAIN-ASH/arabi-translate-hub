import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase before importing
const mockSelect = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockOrder = vi.fn().mockReturnThis();
const mockInsert = vi.fn().mockReturnThis();
const mockUpdate = vi.fn().mockReturnThis();
const mockSingle = vi.fn();
const mockRpc = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      eq: mockEq,
      order: mockOrder,
      single: mockSingle,
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
    })),
    rpc: mockRpc,
  },
}));

describe('supabaseAccountingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllAccounts', () => {
    it('fetches and maps ledger accounts from DB', async () => {
      const mockData = [
        { id: '1', code: '1000', name: 'النقد', name_en: 'Cash', account_type: 'asset', parent_id: null, is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
      ];

      // Chain: from().select().eq().order() returns { data, error }
      mockOrder.mockResolvedValueOnce({ data: mockData, error: null });

      const { getAllAccounts } = await import('@/utils/supabaseAccountingService');
      const accounts = await getAllAccounts();

      expect(accounts).toHaveLength(1);
      expect(accounts[0].code).toBe('1000');
      expect(accounts[0].name).toBe('النقد');
      expect(accounts[0].type).toBe('asset');
    });

    it('returns empty array on error', async () => {
      mockOrder.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } });

      const { getAllAccounts } = await import('@/utils/supabaseAccountingService');
      const accounts = await getAllAccounts();
      expect(accounts).toEqual([]);
    });
  });

  describe('getTrialBalance', () => {
    it('calls RPC function with date params', async () => {
      const mockResult = [
        { account_code: '1000', account_name: 'Cash', account_type: 'asset', debit_total: 5000, credit_total: 0, balance: 5000 },
      ];
      mockRpc.mockResolvedValueOnce({ data: mockResult, error: null });

      const { getTrialBalance } = await import('@/utils/supabaseAccountingService');
      const result = await getTrialBalance('2024-01-01', '2024-12-31');

      expect(mockRpc).toHaveBeenCalledWith('get_trial_balance', {
        p_from_date: '2024-01-01',
        p_to_date: '2024-12-31',
      });
      expect(result).toHaveLength(1);
      expect(result[0].accountCode).toBe('1000');
      expect(result[0].balance).toBe(5000);
    });
  });

  describe('createJournalEntry', () => {
    it('rejects unbalanced entries', async () => {
      const { createJournalEntry } = await import('@/utils/supabaseAccountingService');

      const unbalancedEntry = {
        entryNumber: '',
        entryDate: '2024-01-01',
        lines: [
          { id: '', entryId: '', accountId: 'a1', debitAmount: 100, creditAmount: 0, currency: 'SAR' },
          { id: '', entryId: '', accountId: 'a2', debitAmount: 0, creditAmount: 50, currency: 'SAR' },
        ],
      };

      await expect(createJournalEntry(unbalancedEntry)).rejects.toThrow('must equal credits');
    });
  });
});
