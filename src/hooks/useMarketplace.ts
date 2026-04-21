import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  MarketplaceService,
  MarketplaceItem,
  MarketplacePurchase,
  DiscountCoupon,
  UnlockedFeature,
} from '@/utils/marketplaceService';

export const useMarketplace = (userId?: string) => {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [purchases, setPurchases] = useState<MarketplacePurchase[]>([]);
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [features, setFeatures] = useState<UnlockedFeature[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const [it, pu, co, fe] = await Promise.all([
        MarketplaceService.listItems(),
        userId ? MarketplaceService.listMyPurchases(userId) : Promise.resolve([]),
        userId ? MarketplaceService.listMyCoupons(userId) : Promise.resolve([]),
        userId ? MarketplaceService.listMyUnlockedFeatures(userId) : Promise.resolve([]),
      ]);
      setItems(it);
      setPurchases(pu);
      setCoupons(co);
      setFeatures(fe);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime: refresh on user purchases
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`marketplace-${userId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'marketplace_purchases', filter: `user_id=eq.${userId}` },
        () => refresh())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_discount_coupons', filter: `user_id=eq.${userId}` },
        () => refresh())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_unlocked_features', filter: `user_id=eq.${userId}` },
        () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId, refresh]);

  return { items, purchases, coupons, features, loading, refresh };
};
