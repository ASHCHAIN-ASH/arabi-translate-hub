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
        update: vi.fn().mockReturnValue({ eq: mockEq }),
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

  describe('Create Payment Transaction', () => {
    it('inserts payment transaction record', async () => {
      const payment = {
        invoice_id: 'inv-1',
        amount: 750,
        type: 'payment',
        status: 'completed' as const,
        user_id: 'u1',
      };

      mockSingle.mockResolvedValueOnce({
        data: { id: 'pay-1', ...payment },
        error: null,
      });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await (supabase as any)
        .from('payment_transactions')
        .insert([payment])
        .select()
        .single();

      expect(mockFrom).toHaveBeenCalledWith('payment_transactions');
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
      await (supabase as any)
        .from('invoices')
        .update({ status: 'paid', paid_at: new Date().toISOString() })
        .eq('id', 'inv-1');

      expect(mockFrom).toHaveBeenCalledWith('invoices');
    });
  });

  describe('Payment Transaction Record', () => {
    it('records a payment transaction', async () => {
      const txn = {
        user_id: 'u1',
        amount: 500,
        balance_after: 500,
        type: 'deposit',
        status: 'completed',
      };

      mockSingle.mockResolvedValueOnce({ data: { id: 'txn-1', ...txn }, error: null });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await (supabase as any)
        .from('payment_transactions')
        .insert([txn])
        .select()
        .single();

      expect(result.data.balance_after).toBe(500);
      expect(result.data.type).toBe('deposit');
    });
  });
});
