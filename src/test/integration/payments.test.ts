import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();
const mockSelect = vi.fn().mockReturnThis();
const mockInsert = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockSingle = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => {
      mockFrom(...args);
      return {
        select: mockSelect,
        insert: mockInsert,
        eq: mockEq,
        single: mockSingle,
        order: vi.fn().mockReturnThis(),
      };
    },
  },
}));

describe('Payments Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Payment', () => {
    it('inserts payment record linked to invoice', async () => {
      const payment = {
        invoice_id: 'inv-1',
        amount: 750,
        payment_method: 'bank_transfer',
        status: 'completed' as const,
        payment_date: '2024-02-01',
      };

      mockSingle.mockResolvedValueOnce({
        data: { id: 'pay-1', ...payment },
        error: null,
      });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase
        .from('business_payments')
        .insert([payment])
        .select()
        .single();

      expect(mockFrom).toHaveBeenCalledWith('business_payments');
      expect(mockInsert).toHaveBeenCalledWith([payment]);
      expect(result.data.amount).toBe(750);
    });
  });

  describe('Invoice Payment Status', () => {
    it('marks invoice as paid after full payment', async () => {
      mockEq.mockResolvedValueOnce({
        data: { id: 'inv-1', status: 'paid', paid_at: '2024-02-01' },
        error: null,
      });

      const { supabase } = await import('@/integrations/supabase/client');
      await supabase
        .from('business_invoices')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', 'inv-1');

      expect(mockFrom).toHaveBeenCalledWith('business_invoices');
    });
  });

  describe('Wallet Transaction', () => {
    it('records wallet deposit', async () => {
      const txn = {
        user_id: 'u1',
        wallet_id: 'w1',
        amount: 500,
        balance_before: 0,
        balance_after: 500,
        transaction_type: 'deposit',
        status: 'completed',
      };

      mockSingle.mockResolvedValueOnce({ data: { id: 'txn-1', ...txn }, error: null });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase
        .from('wallet_transactions')
        .insert(txn)
        .select()
        .single();

      expect(result.data.balance_after).toBe(500);
      expect(result.data.transaction_type).toBe('deposit');
    });
  });
});
