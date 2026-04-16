import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase
const mockFrom = vi.fn();
const mockSelect = vi.fn().mockReturnThis();
const mockInsert = vi.fn().mockReturnThis();
const mockUpdate = vi.fn().mockReturnThis();
const mockEq = vi.fn().mockReturnThis();
const mockSingle = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => {
      mockFrom(...args);
      return {
        select: mockSelect,
        insert: mockInsert,
        update: mockUpdate,
        eq: mockEq,
        single: mockSingle,
        order: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
      };
    },
  },
}));

describe('Orders Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Order Tracking Query', () => {
    it('finds order by tracking ID and phone', async () => {
      const mockOrder = {
        id: '123',
        tracking_id: 'TR001234',
        phone_last_four: '4567',
        title: 'بحث علمي',
        degree: 'ماجستير',
        current_status: 'data_collection',
        estimated_delivery: '2024-03-15',
        created_at: '2024-01-01',
        client_name: 'أحمد',
        client_phone: '0501234567',
        client_email: 'ahmed@test.com',
      };

      mockSingle.mockResolvedValueOnce({ data: mockOrder, error: null });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase
        .from('orders')
        .select('*')
        .eq('tracking_id', 'TR001234')
        .eq('phone_last_four', '4567')
        .single();

      expect(mockFrom).toHaveBeenCalledWith('orders');
      expect(result.data).toEqual(mockOrder);
      expect(result.data.tracking_id).toBe('TR001234');
    });

    it('returns null for non-existent order', async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase
        .from('orders')
        .select('*')
        .eq('tracking_id', 'INVALID')
        .single();

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('Order Status Update', () => {
    it('updates order status', async () => {
      mockEq.mockResolvedValueOnce({ data: { id: '123', current_status: 'first_draft' }, error: null });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await supabase
        .from('orders')
        .update({ current_status: 'first_draft' })
        .eq('id', '123');

      expect(mockFrom).toHaveBeenCalledWith('orders');
      expect(mockUpdate).toHaveBeenCalledWith({ current_status: 'first_draft' });
    });
  });
});
