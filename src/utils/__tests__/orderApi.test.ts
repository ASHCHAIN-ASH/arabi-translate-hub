import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the supabaseOrderService
vi.mock('@/utils/supabaseOrderService', () => ({
  searchOrderByTracking: vi.fn(),
}));

import { searchOrder } from '@/utils/orderApi';
import { searchOrderByTracking } from '@/utils/supabaseOrderService';

describe('orderApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns order with timeline when found', async () => {
    const mockOrder = {
      id: '123',
      trackingId: 'TR001234',
      phoneLastFour: '4567',
      title: 'بحث تجريبي',
      degree: 'ماجستير',
      currentStatus: 'data_collection',
      progress: 40,
      estimatedDelivery: '2024-03-15',
      createdAt: '2024-01-01',
    };

    (searchOrderByTracking as any).mockResolvedValue(mockOrder);

    const result = await searchOrder('TR001234', '4567');

    expect(result.trackingId).toBe('TR001234');
    expect(result.timeline).toBeDefined();
    expect(result.timeline.length).toBe(9);
    // data_collection means first 4 steps should be completed
    expect(result.timeline[0].completed).toBe(true); // received
    expect(result.timeline[3].completed).toBe(true); // data_collection
    expect(result.timeline[4].completed).toBe(false); // statistical_analysis
  });

  it('throws error when order not found', async () => {
    (searchOrderByTracking as any).mockResolvedValue(null);

    await expect(searchOrder('INVALID', '0000')).rejects.toThrow('لم يتم العثور');
  });
});
