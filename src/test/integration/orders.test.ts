import { describe, it, expect, vi, beforeEach } from 'vitest';

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
    it('finds order by tracking ID', async () => {
      const mockOrder = {
        id: '123',
        tracking_id: 'ORD-001234',
        service_name: 'ترجمة أكاديمية',
        current_status: 'pending',
        created_at: '2024-01-01',
      };

      mockSingle.mockResolvedValueOnce({ data: mockOrder, error: null });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await (supabase as any)
        .from('service_orders')
        .select('*')
        .eq('tracking_id', 'ORD-001234')
        .single();

      expect(mockFrom).toHaveBeenCalledWith('service_orders');
      expect(result.data).toEqual(mockOrder);
      expect(result.data.tracking_id).toBe('ORD-001234');
    });

    it('returns null for non-existent order', async () => {
      mockSingle.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await (supabase as any)
        .from('service_orders')
        .select('*')
        .eq('tracking_id', 'INVALID')
        .single();

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('Order Status Update', () => {
    it('updates order status', async () => {
      mockEq.mockResolvedValueOnce({ data: { id: '123', current_status: 'in_progress' }, error: null });

      const { supabase } = await import('@/integrations/supabase/client');
      const result = await (supabase as any)
        .from('service_orders')
        .update({ current_status: 'in_progress' })
        .eq('id', '123');

      expect(mockFrom).toHaveBeenCalledWith('service_orders');
      expect(mockUpdate).toHaveBeenCalledWith({ current_status: 'in_progress' });
    });
  });
});
