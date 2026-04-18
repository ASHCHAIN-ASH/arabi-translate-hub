import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';

export interface MembershipPlan {
  id: string;
  code: string;
  name_ar: string;
  name_en: string;
  description: string | null;
  price: number;
  currency: string;
  duration_months: number;
  discount_percentage: number;
  cashback_amount: number;
  priority_level: number;
  badge_color: string | null;
  benefits: string[];
  is_active: boolean;
  sort_order: number;
}

export interface UserMembership {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  payment_method: string | null;
  amount_paid: number;
  starts_at: string | null;
  expires_at: string | null;
  cancelled_at: string | null;
  notes: string | null;
  created_at: string;
  plan?: MembershipPlan;
}

export function useMembershipPlans() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('membership_plans' as any)
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    setPlans(((data as any) || []).map((p: any) => ({ ...p, benefits: Array.isArray(p.benefits) ? p.benefits : [] })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  return { plans, loading, reload: load };
}

export function useUserMembership() {
  const { user } = useAuth();
  const [membership, setMembership] = useState<UserMembership | null>(null);
  const [allMemberships, setAllMemberships] = useState<UserMembership[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) { setMembership(null); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('user_memberships' as any)
      .select('*, plan:membership_plans(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    const list = (data as any) || [];
    setAllMemberships(list);
    const active = list.find((m: any) => m.status === 'active' && (!m.expires_at || new Date(m.expires_at) > new Date()));
    setMembership(active || null);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);
  return { membership, allMemberships, loading, reload: load };
}

export function useMembershipDiscount(): number {
  const { membership } = useUserMembership();
  return membership?.plan?.discount_percentage || 0;
}
