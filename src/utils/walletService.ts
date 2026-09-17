import { supabase } from '@/data/legacy/client';
import { recordInvoicePayment } from '@/utils/invoicePaymentService';

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
  balance_before?: number | null;
  balance_after: number;
  description: string | null;
  reference_type: string | null;
  reference_id: string | null;
  created_by: string | null;
  created_at: string;
  metadata?: any;
  receipt_number?: string | null;
  gateway_ref?: string | null;
  masked_account?: string | null;
  fee_amount?: number;
  vat_amount?: number;
  currency?: string;
  payment_method?: string | null;
  signature_hash?: string | null;
  reconciled?: boolean;
  reconciled_at?: string | null;
  signed_at?: string;
  receipt_pdf_path?: string | null;
  receipt_generated_at?: string | null;
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
    receipt_path?: string;
  }): Promise<TopupRequest> {
    const { data, error } = await supabase
      .from('wallet_topup_requests' as any)
      .insert(payload as any)
      .select()
      .single();
    if (error) throw error;
    return data as any;
  },

  // Upload bank-transfer receipt to private storage with REAL upload progress.
  // Uses a signed upload URL + XHR so we can read xhr.upload.onprogress events.
  // Falls back to the standard SDK upload (with smooth simulated progress) if
  // signed-URL creation isn't available.
  async uploadReceipt(
    userId: string,
    file: File,
    onProgress?: (pct: number) => void,
  ): Promise<string> {
    // Validate first to surface clear errors
    if (!file) throw new Error('لم يتم اختيار ملف للرفع');
    if (file.size === 0) throw new Error('الملف فارغ، يرجى اختيار ملف صالح');
    if (file.size > 5 * 1024 * 1024) throw new Error('حجم الملف يتجاوز 5 ميجابايت');

    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    onProgress?.(1);

    // Try real-progress path via signed upload URL
    try {
      const { data: signed, error: signErr } = await supabase.storage
        .from('wallet-receipts')
        .createSignedUploadUrl(path);

      if (signErr || !signed?.signedUrl) {
        throw signErr || new Error('تعذّر إنشاء رابط الرفع');
      }

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signed.signedUrl, true);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
        xhr.setRequestHeader('x-upsert', 'false');
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable && onProgress) {
            const pct = Math.max(1, Math.min(99, Math.round((evt.loaded / evt.total) * 100)));
            onProgress(pct);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            onProgress?.(100);
            resolve();
          } else {
            const msg =
              xhr.status === 413
                ? 'حجم الملف كبير جدًا — تجاوز الحد المسموح به'
                : xhr.status === 401 || xhr.status === 403
                  ? 'صلاحيات الرفع منتهية أو غير كافية، أعد تسجيل الدخول وحاول مجددًا'
                  : xhr.status === 0
                    ? 'انقطع الاتصال أثناء الرفع، تحقق من الإنترنت'
                    : `فشل الرفع (رمز ${xhr.status})${xhr.statusText ? ': ' + xhr.statusText : ''}`;
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error('فشل الاتصال بخادم التخزين أثناء رفع الإيصال'));
        xhr.onabort = () => reject(new Error('تم إلغاء عملية الرفع'));
        xhr.ontimeout = () => reject(new Error('انتهت مهلة الرفع، حاول مرة أخرى'));
        xhr.send(file);
      });

      return path;
    } catch (signedErr: any) {
      // Fallback: standard SDK upload with smooth simulated progress
      let timer: ReturnType<typeof setInterval> | null = null;
      if (onProgress) {
        let pct = 5;
        onProgress(pct);
        timer = setInterval(() => {
          pct = Math.min(90, pct + Math.max(2, Math.round((90 - pct) * 0.12)));
          onProgress(pct);
        }, 180);
      }
      try {
        const { error } = await supabase.storage
          .from('wallet-receipts')
          .upload(path, file, { cacheControl: '3600', upsert: false });
        if (error) {
          const msg = (error as any)?.message || '';
          if (/exceeded|too large|413/i.test(msg)) {
            throw new Error('حجم الملف يتجاوز الحد المسموح');
          }
          if (/Unauthorized|JWT|401|403/i.test(msg)) {
            throw new Error('صلاحيات الرفع غير كافية، أعد تسجيل الدخول');
          }
          if (/duplicate|already exists/i.test(msg)) {
            throw new Error('ملف بنفس الاسم موجود مسبقًا، حاول مجددًا');
          }
          throw new Error(`فشل رفع الإيصال: ${msg || 'سبب غير معروف'}`);
        }
        onProgress?.(100);
        return path;
      } finally {
        if (timer) clearInterval(timer);
      }
    }
  },

  async getReceiptSignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from('wallet-receipts')
      .createSignedUrl(path, expiresIn);
    if (error) return null;
    return data?.signedUrl || null;
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

  // Pay an invoice using wallet balance. DB trigger handles deduction + status update.
  async payInvoiceFromWallet(args: {
    invoice_id: string;
    user_id: string;
    amount: number;
    invoice_number?: string;
  }): Promise<void> {
    const w = await WalletService.getMyWallet(args.user_id);
    if (!w) throw new Error('لم يتم العثور على محفظتك');
    if ((w.balance || 0) < args.amount) {
      throw new Error(`الرصيد غير كافٍ. رصيدك الحالي: ${WalletService.formatCurrency(w.balance)}`);
    }

    const payment = await recordInvoicePayment({
      invoice_id: args.invoice_id,
      payment_method: 'wallet',
      payment_date: new Date().toISOString().split('T')[0],
      notes: `دفع من المحفظة الرقمية${args.invoice_number ? ' - فاتورة ' + args.invoice_number : ''}`,
    });

    // Send banking-style payment receipt email (non-blocking).
    try {
      const newBalance = (w.balance || 0) - args.amount;
      const [{ data: profile }, { data: authUser }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', args.user_id).maybeSingle(),
        supabase.auth.getUser(),
      ]);
      const recipientEmail = authUser?.user?.email;
      if (recipientEmail) {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fekrahedu.com';
        await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'wallet-invoice-payment',
            recipientEmail,
            idempotencyKey: `wallet-pay-${payment.payment_id || args.invoice_id}`,
            templateData: {
              customerName: profile?.full_name || authUser?.user?.email?.split('@')[0] || 'العميل',
              invoiceNumber: args.invoice_number || '—',
              amount: WalletService.formatCurrency(args.amount).replace(' ر.س', ''),
              newBalance: WalletService.formatCurrency(newBalance).replace(' ر.س', ''),
              paidAt: new Date().toLocaleString('ar-SA'),
              transactionId: (payment.payment_id || '').toString().slice(0, 8),
              invoiceUrl: `${origin}/invoices`,
              walletUrl: `${origin}/wallet`,
            },
          },
        });
      }
    } catch (mailErr) {
      console.warn('wallet-invoice-payment email failed:', mailErr);
    }
  },

  formatCurrency(n: number, currency = 'SAR') {
    return `${Number(n || 0).toLocaleString('ar-SA', { maximumFractionDigits: 2 })} ${currency === 'SAR' ? 'ر.س' : currency}`;
  },
};
