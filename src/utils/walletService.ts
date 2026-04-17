import { supabase } from '@/integrations/supabase/client';

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  total_deposited: number;
  total_spent: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund' | 'adjustment';
  amount: number;
  balance_after: number;
  description: string | null;
  reference_type: string | null;
  reference_id: string | null;
  created_by: string | null;
  created_at: string;
  metadata?: any;
}

export interface TopupRequest {
  id: string;
  user_id: string;
  wallet_id: string | null;
  amount: number;
  payment_method: string;
  reference_number: string | null;
  notes: string | null;
  receipt_path: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const TX_TYPE_LABELS: Record<string, string> = {
  deposit: 'إيداع',
  withdrawal: 'سحب',
  payment: 'دفع فاتورة',
  refund: 'استرداد',
  adjustment: 'تعديل',
};

export const TX_TYPE_COLORS: Record<string, string> = {
  deposit: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  withdrawal: 'text-orange-600 bg-orange-50 border-orange-200',
  payment: 'text-blue-600 bg-blue-50 border-blue-200',
  refund: 'text-purple-600 bg-purple-50 border-purple-200',
  adjustment: 'text-gray-600 bg-gray-50 border-gray-200',
};

export const TOPUP_STATUS_LABELS: Record<string, string> = {
  pending: 'قيد المراجعة',
  approved: 'تمت الموافقة',
  rejected: 'مرفوض',
};

export const TOPUP_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

export const WalletService = {
  async getMyWallet(userId: string): Promise<Wallet | null> {
    const { data, error } = await supabase
      .from('wallets' as any)
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      // ensure wallet exists
      const { data: created } = await supabase
        .from('wallets' as any)
        .insert({ user_id: userId } as any)
        .select()
        .single();
      return created as any;
    }
    return data as any;
  },

  async getMyTransactions(userId: string, limit = 100): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from('wallet_transactions' as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as any;
  },

  async getMyTopupRequests(userId: string): Promise<TopupRequest[]> {
    const { data, error } = await supabase
      .from('wallet_topup_requests' as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as any;
  },

  async createTopupRequest(payload: {
    user_id: string;
    amount: number;
    payment_method: string;
    reference_number?: string;
    notes?: string;
  }): Promise<TopupRequest> {
    const { data, error } = await supabase
      .from('wallet_topup_requests' as any)
      .insert(payload as any)
      .select()
      .single();
    if (error) throw error;
    return data as any;
  },

  // ===== Admin =====
  async listAllWallets(): Promise<(Wallet & { customer_name?: string; email?: string })[]> {
    const { data: wallets, error } = await supabase
      .from('wallets' as any)
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    if (!wallets) return [];

    const userIds = (wallets as any[]).map((w) => w.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);
    const { data: customers } = await supabase
      .from('customers')
      .select('user_id, email, name')
      .in('user_id', userIds);

    const profMap = new Map((profiles || []).map((p) => [p.id, p.full_name]));
    const custMap = new Map((customers || []).map((c) => [c.user_id, c]));

    return (wallets as any[]).map((w) => ({
      ...w,
      customer_name: custMap.get(w.user_id)?.name || profMap.get(w.user_id) || 'عميل',
      email: custMap.get(w.user_id)?.email || '',
    }));
  },

  async listAllTopupRequests(): Promise<TopupRequest[]> {
    const { data, error } = await supabase
      .from('wallet_topup_requests' as any)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as any;
  },

  async listAllTransactions(limit = 200): Promise<WalletTransaction[]> {
    const { data, error } = await supabase
      .from('wallet_transactions' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []) as any;
  },

  async approveTopup(requestId: string, reviewerId: string, adminNotes?: string) {
    const { error } = await supabase
      .from('wallet_topup_requests' as any)
      .update({
        status: 'approved',
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes,
      } as any)
      .eq('id', requestId);
    if (error) throw error;
  },

  async rejectTopup(requestId: string, reviewerId: string, adminNotes?: string) {
    const { error } = await supabase
      .from('wallet_topup_requests' as any)
      .update({
        status: 'rejected',
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes,
      } as any)
      .eq('id', requestId);
    if (error) throw error;
  },

  async createTransaction(payload: {
    wallet_id: string;
    user_id: string;
    type: 'deposit' | 'withdrawal' | 'adjustment' | 'refund';
    amount: number;
    description: string;
    created_by?: string;
  }) {
    const { error } = await supabase
      .from('wallet_transactions' as any)
      .insert(payload as any);
    if (error) throw error;
  },

  formatCurrency(n: number, currency = 'SAR') {
    return `${Number(n || 0).toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ${currency === 'SAR' ? 'ر.س' : currency}`;
  },
};
