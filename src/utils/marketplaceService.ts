import { supabase } from '@/integrations/supabase/client';

export type MarketplaceItemType = 'feature_unlock' | 'discount' | 'wallet_credit' | 'badge' | 'bundle';

export interface MarketplaceItem {
  id: string;
  slug: string;
  title_ar: string;
  description_ar: string | null;
  type: MarketplaceItemType;
  category: string;
  xp_cost: number;
  reward_payload: any;
  icon: string | null;
  badge_color: string | null;
  is_active: boolean;
  is_featured: boolean;
  stock: number | null;
  total_purchased: number;
  min_level: number;
  max_per_user: number | null;
  sort_order: number;
}

export interface MarketplacePurchase {
  id: string;
  item_id: string;
  item_slug: string;
  item_type: string;
  xp_spent: number;
  status: string;
  fulfillment_data: any;
  reward_payload: any;
  created_at: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  applies_to: string;
  status: string;
  expires_at: string | null;
  created_at: string;
}

export interface UnlockedFeature {
  id: string;
  feature_key: string;
  source: string;
  payload: any;
  expires_at: string | null;
  created_at: string;
}

export interface PurchaseResult {
  success: boolean;
  error?: string;
  detail?: any;
  purchase_id?: string;
  xp_spent?: number;
  remaining_xp?: number;
  item_type?: string;
  fulfillment?: any;
  required?: number;
  available?: number;
  required_level?: number;
  current_level?: number;
  limit_count?: number;
  limit_xp?: number;
}

const ERROR_LABELS: Record<string, string> = {
  unauthenticated: 'يلزم تسجيل الدخول',
  item_unavailable: 'هذا المنتج غير متاح حالياً',
  out_of_stock: 'نفدت الكمية المتاحة',
  level_too_low: 'مستواك الحالي لا يسمح بشراء هذا المنتج',
  insufficient_xp: 'رصيد XP غير كافٍ',
  max_per_user_reached: 'وصلت الحد الأقصى لشراء هذا المنتج',
  daily_limit_reached: 'وصلت الحد اليومي لهذا النوع',
  xp_deduction_failed: 'تعذّر خصم XP',
  duplicate: 'تم الشراء مسبقاً',
};

const TYPE_LABELS: Record<string, string> = {
  feature_unlock: 'فتح ميزة',
  discount: 'كوبون خصم',
  wallet_credit: 'تحويل رصيد',
  badge: 'شارة',
  bundle: 'باقة',
};

export class MarketplaceService {
  static labelType(t: string) { return TYPE_LABELS[t] || t; }
  static labelError(e: string) { return ERROR_LABELS[e] || e; }

  static async listItems(): Promise<MarketplaceItem[]> {
    const { data, error } = await (supabase as any)
      .from('marketplace_items')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('sort_order', { ascending: true });
    if (error) { console.error(error); return []; }
    return (data || []) as MarketplaceItem[];
  }

  static async listMyPurchases(userId: string): Promise<MarketplacePurchase[]> {
    const { data, error } = await (supabase as any)
      .from('marketplace_purchases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) { console.error(error); return []; }
    return (data || []) as MarketplacePurchase[];
  }

  static async listMyCoupons(userId: string): Promise<DiscountCoupon[]> {
    const { data } = await (supabase as any)
      .from('user_discount_coupons')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return (data || []) as DiscountCoupon[];
  }

  static async listMyUnlockedFeatures(userId: string): Promise<UnlockedFeature[]> {
    const { data } = await (supabase as any)
      .from('user_unlocked_features')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return (data || []) as UnlockedFeature[];
  }

  static async purchase(itemId: string): Promise<PurchaseResult> {
    const { data, error } = await (supabase as any).rpc('purchase_marketplace_item', { p_item_id: itemId });
    if (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
    return data as PurchaseResult;
  }

  static async trackView(itemId: string, anonymousId?: string, variantKey?: string) {
    try {
      await (supabase as any).rpc('track_marketplace_view', {
        p_item_id: itemId,
        p_anonymous_id: anonymousId ?? null,
        p_variant_key: variantKey ?? null,
      });
    } catch (e) {
      // best-effort
    }
  }

  static async getMetrics(days = 30) {
    const { data, error } = await (supabase as any).rpc('get_marketplace_metrics', { p_days: days });
    if (error) throw error;
    return data;
  }
}
