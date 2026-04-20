import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Wallet as WalletIcon, TrendingUp, TrendingDown, Search, CheckCircle2, XCircle,
  Plus, Minus, RefreshCw, Users, Receipt, Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/components/SimpleAuthProvider';
import {
  WalletService, type Wallet, type TopupRequest, type WalletTransaction,
  TX_TYPE_LABELS, TX_TYPE_COLORS, TOPUP_STATUS_LABELS, TOPUP_STATUS_COLORS,
} from '@/utils/walletService';
import { TransactionItem } from '@/components/wallet/TransactionItem';

const AdminWallets: React.FC = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<(Wallet & { customer_name?: string; email?: string })[]>([]);
  const [topups, setTopups] = useState<TopupRequest[]>([]);
  const [txs, setTxs] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Adjustment dialog
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [target, setTarget] = useState<Wallet & { customer_name?: string } | null>(null);
  const [adjType, setAdjType] = useState<'deposit' | 'withdrawal' | 'adjustment' | 'refund'>('deposit');
  const [adjAmount, setAdjAmount] = useState<number>(0);
  const [adjDesc, setAdjDesc] = useState('');

  // Reject dialog
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<TopupRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [w, r, t] = await Promise.all([
        WalletService.listAllWallets(),
        WalletService.listAllTopupRequests(),
        WalletService.listAllTransactions(),
      ]);
      setWallets(w); setTopups(r); setTxs(t);
    } catch (e: any) {
      toast.error('فشل التحميل', { description: e.message });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    // Realtime subscription for wallets, topup requests, and transactions
    import('@/integrations/supabase/client').then(({ supabase }) => {
      const channel = supabase
        .channel('admin-wallets-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, () => load())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_topup_requests' }, () => load())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_transactions' }, () => load())
        .subscribe();
      (window as any).__adminWalletsChannel = channel;
    });
    return () => {
      const ch = (window as any).__adminWalletsChannel;
      if (ch) import('@/integrations/supabase/client').then(({ supabase }) => supabase.removeChannel(ch));
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search) return wallets;
    const q = search.toLowerCase();
    return wallets.filter((w) =>
      (w.customer_name || '').toLowerCase().includes(q) ||
      (w.email || '').toLowerCase().includes(q)
    );
  }, [wallets, search]);

  const stats = useMemo(() => {
    const totalBalance = wallets.reduce((s, w) => s + Number(w.balance), 0);
    const totalDeposited = wallets.reduce((s, w) => s + Number(w.total_deposited), 0);
    const totalSpent = wallets.reduce((s, w) => s + Number(w.total_spent), 0);
    const pendingCount = topups.filter((t) => t.status === 'pending').length;
    return { totalBalance, totalDeposited, totalSpent, pendingCount };
  }, [wallets, topups]);

  const openAdjust = (w: Wallet & { customer_name?: string }) => {
    setTarget(w); setAdjType('deposit'); setAdjAmount(0); setAdjDesc('');
    setAdjustOpen(true);
  };

  const submitAdjust = async () => {
    if (!target || !adjAmount || adjAmount <= 0) return toast.error('أدخل مبلغاً صحيحاً');
    if (!adjDesc.trim()) return toast.error('أدخل وصفاً للحركة');
    try {
      await WalletService.createTransaction({
        wallet_id: target.id,
        user_id: target.user_id,
        type: adjType,
        amount: adjAmount,
        description: adjDesc,
        created_by: user?.id,
      });
      toast.success('تم تنفيذ الحركة بنجاح');
      setAdjustOpen(false); load();
    } catch (e: any) {
      toast.error('فشل تنفيذ الحركة', { description: e.message });
    }
  };

  const sendTopupEmail = async (r: TopupRequest, kind: 'approved' | 'rejected', reason?: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      // Resolve recipient email + name from customers/profiles
      const { data: cust } = await supabase
        .from('customers').select('email, name').eq('user_id', r.user_id).maybeSingle();
      const { data: prof } = await supabase
        .from('profiles').select('full_name').eq('id', r.user_id).maybeSingle();
      const { data: walletAfter } = await supabase
        .from('wallets').select('balance').eq('user_id', r.user_id).maybeSingle();

      const recipient = cust?.email;
      if (!recipient) return; // silently skip if no email on file

      const customerName = cust?.name || prof?.full_name || 'العميل';
      const baseUrl = window.location.origin;
      const methodMap: Record<string, string> = {
        bank_transfer: 'تحويل بنكي', stc_pay: 'STC Pay', mada: 'مدى', cash: 'نقدي',
      };

      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: kind === 'approved' ? 'wallet-topup-approved' : 'wallet-topup-rejected',
          recipientEmail: recipient,
          idempotencyKey: `wallet-topup-${kind}-${r.id}`,
          templateData: {
            customerName,
            amount: Number(r.amount).toLocaleString('ar-SA'),
            requestId: r.id.slice(0, 8),
            paymentMethod: methodMap[r.payment_method] || r.payment_method,
            walletUrl: `${baseUrl}/wallet`,
            ...(kind === 'approved'
              ? {
                  newBalance: Number(walletAfter?.balance || 0).toLocaleString('ar-SA'),
                  approvedAt: new Date().toLocaleDateString('ar-SA'),
                }
              : {
                  rejectedAt: new Date().toLocaleDateString('ar-SA'),
                  reason: reason || 'لم يتم تحديد سبب',
                  supportUrl: `${baseUrl}/support/tickets`,
                }),
          },
        },
      });
    } catch (err) {
      console.error('Failed to send wallet email:', err);
    }
  };

  const sendTopupWhatsApp = async (r: TopupRequest, kind: 'approved' | 'rejected', reason?: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { sendWhatsApp } = await import('@/lib/whatsapp');
      const { data: cust } = await supabase
        .from('customers').select('phone, name').eq('user_id', r.user_id).maybeSingle();
      const { data: prof } = await supabase
        .from('profiles').select('full_name, phone').eq('id', r.user_id).maybeSingle();
      const phone = (cust as any)?.phone || (prof as any)?.phone;
      if (!phone) return;

      const name = cust?.name || prof?.full_name || 'عميلنا الكريم';
      const amountNum = Number(r.amount);
      const amount = amountNum.toLocaleString('ar-SA');
      const reqId = r.id.slice(0, 8);
      const refNo = (r as any).reference_number || '—';
      const methodMap: Record<string, string> = {
        bank_transfer: '🏦 تحويل بنكي',
        stc_pay: '📱 STC Pay',
        mada: '💳 مدى',
        cash: '💵 نقدي',
      };
      const method = methodMap[r.payment_method] || r.payment_method;

      let bonusPct = 0;
      if (amountNum >= 5000) bonusPct = 15;
      else if (amountNum >= 2500) bonusPct = 10;
      else if (amountNum >= 1000) bonusPct = 5;
      else if (amountNum >= 500) bonusPct = 2;
      const bonusAmount = Math.round((amountNum * bonusPct) / 100 * 100) / 100;
      const totalCredited = amountNum + bonusAmount;

      const now = new Date();
      const dateStr = now.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
      const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });

      let receiptNo = '—';
      let newBalance = '—';
      if (kind === 'approved') {
        const { data: tx } = await supabase
          .from('wallet_transactions' as any)
          .select('receipt_number')
          .eq('reference_id', r.id)
          .eq('reference_type', 'topup_request')
          .maybeSingle();
        receiptNo = (tx as any)?.receipt_number || '—';
        const { data: w } = await supabase
          .from('wallets').select('balance').eq('user_id', r.user_id).maybeSingle();
        newBalance = Number((w as any)?.balance || 0).toLocaleString('ar-SA');
      }

      const message = kind === 'approved'
        ? [
            `مرحباً ${name} 👋`,
            ``,
            `✅ *تمت الموافقة على طلب شحن محفظتك*`,
            ``,
            `━━━━━━━━━━━━━━`,
            `🧾 *رقم الإيصال:* ${receiptNo}`,
            `🔖 *رقم الطلب:* #${reqId}`,
            refNo !== '—' ? `🏷️ *الرقم المرجعي:* ${refNo}` : null,
            `💳 *طريقة الدفع:* ${method}`,
            `💰 *المبلغ المُودَع:* ${amount} ر.س`,
            bonusAmount > 0
              ? `🎁 *مكافأة بونص ${bonusPct}%:* +${bonusAmount.toLocaleString('ar-SA')} ر.س`
              : `🎁 *مكافأة بونص:* لا يوجد`,
            `💎 *إجمالي المُضاف:* ${totalCredited.toLocaleString('ar-SA')} ر.س`,
            `🏦 *رصيدك الحالي:* ${newBalance} ر.س`,
            `📅 *التاريخ:* ${dateStr}`,
            `⏰ *الوقت:* ${timeStr}`,
            `━━━━━━━━━━━━━━`,
            ``,
            `شكراً لثقتك بنا 🌟`,
            `— MasterEduPath`,
          ].filter(Boolean).join('\n')
        : [
            `مرحباً ${name} 👋`,
            ``,
            `❌ *نأسف، تم رفض طلب شحن محفظتك*`,
            ``,
            `━━━━━━━━━━━━━━`,
            `🔖 *رقم الطلب:* #${reqId}`,
            refNo !== '—' ? `🏷️ *الرقم المرجعي:* ${refNo}` : null,
            `💳 *طريقة الدفع:* ${method}`,
            `💰 *المبلغ:* ${amount} ر.س`,
            `📅 *تاريخ الرفض:* ${dateStr}`,
            `⏰ *الوقت:* ${timeStr}`,
            `📝 *السبب:* ${reason || 'لم يُحدد'}`,
            `━━━━━━━━━━━━━━`,
            ``,
            `للاستفسار، تواصل مع خدمة العملاء عبر تذاكر الدعم.`,
            `— MasterEduPath`,
          ].filter(Boolean).join('\n');

      await sendWhatsApp({
        to: phone,
        message,
        related_entity_type: 'wallet_topup',
        related_entity_id: r.id,
        user_id: r.user_id,
      });
    } catch (err) {
      console.error('Failed to send wallet WhatsApp:', err);
    }
  };

  const approve = async (r: TopupRequest) => {
    try {
      await WalletService.approveTopup(r.id, user!.id);
      toast.success('تمت الموافقة وإضافة الرصيد');
      setTimeout(() => {
        sendTopupEmail(r, 'approved');
        sendTopupWhatsApp(r, 'approved');
      }, 1500);
      load();
    } catch (e: any) { toast.error('فشلت الموافقة', { description: e.message }); }
  };

  const openReject = (r: TopupRequest) => { setRejectTarget(r); setRejectReason(''); setRejectOpen(true); };
  const submitReject = async () => {
    if (!rejectTarget) return;
    try {
      await WalletService.rejectTopup(rejectTarget.id, user!.id, rejectReason);
      toast.success('تم رفض الطلب');
      sendTopupEmail(rejectTarget, 'rejected', rejectReason);
      sendTopupWhatsApp(rejectTarget, 'rejected', rejectReason);
      setRejectOpen(false); load();
    } catch (e: any) { toast.error('فشل الرفض', { description: e.message }); }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6" dir="rtl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg">
                <WalletIcon className="w-6 h-6" />
              </span>
              إدارة المحافظ الرقمية
            </h1>
            <p className="text-sm text-muted-foreground mt-1">إدارة محافظ العملاء، الموافقة على طلبات الشحن، وتعديل الأرصدة</p>
          </div>
          <Button onClick={load} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> تحديث
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'إجمالي الأرصدة', value: WalletService.formatCurrency(stats.totalBalance), icon: WalletIcon, gradient: 'from-violet-500 to-fuchsia-500' },
            { label: 'إجمالي الإيداعات', value: WalletService.formatCurrency(stats.totalDeposited), icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
            { label: 'إجمالي المصروفات', value: WalletService.formatCurrency(stats.totalSpent), icon: TrendingDown, gradient: 'from-rose-500 to-orange-500' },
            { label: 'طلبات شحن قيد المراجعة', value: stats.pendingCount, icon: Clock, gradient: 'from-amber-500 to-yellow-500' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }}>
              <Card className="relative overflow-hidden border-0 shadow-md">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`} />
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/15 rounded-full blur-2xl" />
                <CardContent className="relative p-4 sm:p-5 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-semibold text-white/90">{s.label}</span>
                    <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                      <s.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-2xl font-black">{s.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="topups" dir="rtl">
          <TabsList className="grid grid-cols-3 w-full sm:w-[500px]">
            <TabsTrigger value="topups" className="gap-2">
              <Receipt className="w-4 h-4" />
              طلبات الشحن
              {stats.pendingCount > 0 && (
                <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0">{stats.pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="wallets" className="gap-2"><Users className="w-4 h-4" /> المحافظ</TabsTrigger>
            <TabsTrigger value="tx" className="gap-2"><TrendingUp className="w-4 h-4" /> كل الحركات</TabsTrigger>
          </TabsList>

          {/* Topup requests */}
          <TabsContent value="topups" className="mt-4">
            <Card className="border border-border/60">
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-12 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" /></div>
                ) : topups.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Receipt className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>لا توجد طلبات شحن</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {topups.map((r, i) => {
                      const w = wallets.find((wa) => wa.user_id === r.user_id);
                      return (
                        <motion.div
                          key={r.id}
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(i * 0.04, 0.3) }}
                          className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors flex-wrap"
                        >
                          <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                            <Receipt className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold">{w?.customer_name || 'عميل'}</span>
                              <Badge className={`text-[10px] border ${TOPUP_STATUS_COLORS[r.status]}`}>
                                {TOPUP_STATUS_LABELS[r.status]}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {r.payment_method}
                              {r.reference_number && ` • مرجع: ${r.reference_number}`}
                              {' • '}{new Date(r.created_at).toLocaleString('ar-SA')}
                            </p>
                            {r.notes && <p className="text-xs text-muted-foreground mt-1">💬 {r.notes}</p>}
                            {r.admin_notes && <p className="text-xs text-muted-foreground italic mt-1">📝 {r.admin_notes}</p>}
                          </div>
                          <div className="text-end">
                            <div className="text-lg font-black text-violet-600">
                              {WalletService.formatCurrency(r.amount)}
                            </div>
                          </div>
                          {r.status === 'pending' && (
                            <div className="flex gap-2 w-full sm:w-auto">
                              <Button size="sm" onClick={() => approve(r)} className="bg-emerald-600 hover:bg-emerald-700">
                                <CheckCircle2 className="w-4 h-4 ml-1" /> موافقة
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => openReject(r)} className="border-rose-300 text-rose-700 hover:bg-rose-50">
                                <XCircle className="w-4 h-4 ml-1" /> رفض
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All wallets */}
          <TabsContent value="wallets" className="mt-4 space-y-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم أو البريد..."
                className="pr-10"
              />
            </div>
            <Card className="border border-border/60">
              <CardContent className="p-0">
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <WalletIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>لا توجد محافظ مطابقة</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filtered.map((w, i) => (
                      <motion.div
                        key={w.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        className="flex items-center gap-3 p-4 hover:bg-muted/30 flex-wrap"
                      >
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center font-bold">
                          {(w.customer_name || 'ع').charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">{w.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{w.email}</p>
                        </div>
                        <div className="text-end">
                          <div className="text-lg font-black text-violet-600">{WalletService.formatCurrency(w.balance)}</div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="text-emerald-600">▲ {WalletService.formatCurrency(w.total_deposited)}</span>
                            <span className="text-rose-600">▼ {WalletService.formatCurrency(w.total_spent)}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => openAdjust(w)}>
                          تعديل
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All transactions */}
          <TabsContent value="tx" className="mt-4">
            <Card className="border border-border/60">
              <CardContent className="p-0">
                {txs.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">لا توجد حركات</div>
                ) : (
                  <div className="p-3 space-y-2">
                    {txs.map((t, i) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      >
                        <TransactionItem tx={t} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Adjust dialog */}
        <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader>
              <DialogTitle>تعديل محفظة: {target?.customer_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>نوع الحركة</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { v: 'deposit', label: 'إيداع', icon: Plus, color: 'emerald' },
                    { v: 'withdrawal', label: 'خصم', icon: Minus, color: 'rose' },
                    { v: 'refund', label: 'استرداد', icon: TrendingUp, color: 'purple' },
                    { v: 'adjustment', label: 'تعديل', icon: WalletIcon, color: 'gray' },
                  ].map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => setAdjType(o.v as any)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-bold transition-all ${
                        adjType === o.v ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted'
                      }`}
                    >
                      <o.icon className="w-4 h-4" /> {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>المبلغ</Label>
                <Input type="number" min={0} value={adjAmount || ''} onChange={(e) => setAdjAmount(Number(e.target.value))} />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea value={adjDesc} onChange={(e) => setAdjDesc(e.target.value)} rows={2} placeholder="سبب الحركة..." />
              </div>
              {target && (
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  الرصيد الحالي: <strong>{WalletService.formatCurrency(target.balance)}</strong>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAdjustOpen(false)}>إلغاء</Button>
              <Button onClick={submitAdjust}>تنفيذ</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject dialog */}
        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle>رفض طلب الشحن</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Label>سبب الرفض</Label>
              <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} placeholder="اشرح سبب الرفض للعميل..." />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectOpen(false)}>إلغاء</Button>
              <Button onClick={submitReject} variant="destructive">تأكيد الرفض</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminWallets;
