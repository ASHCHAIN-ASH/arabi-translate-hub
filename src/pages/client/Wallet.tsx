import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Wallet as WalletIcon, Plus, ArrowDownToLine, ArrowUpFromLine, TrendingUp,
  TrendingDown, Sparkles, Receipt, RefreshCw, History, CreditCard, Eye, EyeOff,
  Gift, Zap, Copy, Check, Shield, Clock, Upload, FileImage, X, Building2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  WalletService, type Wallet as WalletT, type WalletTransaction, type TopupRequest,
  TX_TYPE_LABELS, TX_TYPE_COLORS, TOPUP_STATUS_LABELS, TOPUP_STATUS_COLORS,
} from '@/utils/walletService';
import { TransactionItem } from '@/components/wallet/TransactionItem';

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

// كاش باك موحّد: 2% للدفع بالبطاقة و3% للتحويل البنكي — على أي مبلغ
export const CARD_CASHBACK_PCT = 2;
export const BANK_CASHBACK_PCT = 3;

const getBonus = (_amt: number) => ({ pct: CARD_CASHBACK_PCT, label: `كاش باك ${CARD_CASHBACK_PCT}%` });

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'تحويل بنكي', icon: '🏦' },
  { value: 'stc_pay', label: 'STC Pay', icon: '📱' },
  { value: 'mada', label: 'مدى', icon: '💳' },
  { value: 'cash', label: 'نقدي', icon: '💵' },
];

export const BANK_INFO = {
  bank: 'Alawwal Bank — البنك الأول',
  iban: 'SA5345000000262359391004',
  ibanFormatted: 'SA53 4500 0000 0262 3593 9100 4',
  beneficiary: 'شركة علي صالح الشهري القابضة',
};

const ClientWallet: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletT | null>(null);
  const [txs, setTxs] = useState<WalletTransaction[]>([]);
  const [topups, setTopups] = useState<TopupRequest[]>([]);
  const [txPage, setTxPage] = useState(1);
  const [topupsPage, setTopupsPage] = useState(1);
  const PAGE_SIZE = 10;
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [topupOpen, setTopupOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [w, t, r] = await Promise.all([
        WalletService.getMyWallet(user.id),
        WalletService.getMyTransactions(user.id),
        WalletService.getMyTopupRequests(user.id),
      ]);
      setWallet(w); setTxs(t); setTopups(r);
    } catch (e: any) {
      toast.error('فشل تحميل المحفظة', { description: e.message });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [user?.id]);

  // Realtime — wallet, transactions, top-up requests
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    let channel: any = null;
    import('@/data/legacy/client').then(({ supabase }) => {
      if (cancelled) return;
      channel = supabase
        .channel(`client-wallet-${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` }, () => load())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_transactions', filter: `user_id=eq.${user.id}` }, () => load())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_topup_requests', filter: `user_id=eq.${user.id}` }, () => load())
        .subscribe();
    });
    return () => {
      cancelled = true;
      if (channel) import('@/data/legacy/client').then(({ supabase }) => supabase.removeChannel(channel));
    };
  }, [user?.id]);

  const submitTopup = async () => {
    if (!user?.id) return;
    if (!amount || amount <= 0) return toast.error('يرجى إدخال مبلغ صحيح');
    if (method === 'bank_transfer' && !receiptFile) {
      return toast.error('يرجى إرفاق صورة إيصال التحويل البنكي');
    }
    setSubmitting(true);
    try {
      let receipt_path: string | undefined;
      if (receiptFile) {
        setUploadingReceipt(true);
        receipt_path = await WalletService.uploadReceipt(user.id, receiptFile);
        setUploadingReceipt(false);
      }
      await WalletService.createTopupRequest({
        user_id: user.id, amount, payment_method: method,
        reference_number: reference || undefined, notes: notes || undefined,
        receipt_path,
      });
      toast.success('تم إرسال طلب الشحن بانتظار موافقة الإدارة', {
        description: bonus.pct > 0 ? `🎁 ستحصل على ${bonus.label} عند الموافقة!` : undefined,
      });
      setTopupOpen(false); setAmount(0); setReference(''); setNotes(''); setReceiptFile(null); load();
    } catch (e: any) {
      toast.error('فشل إرسال الطلب', { description: e.message });
    } finally { setSubmitting(false); setUploadingReceipt(false); }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('تم النسخ');
    setTimeout(() => setCopied(null), 1500);
  };

  const chartPoints = useMemo(() => {
    if (txs.length === 0) return [];
    const ordered = [...txs].reverse();
    const max = Math.max(...ordered.map((t) => t.balance_after), 1);
    const min = Math.min(...ordered.map((t) => t.balance_after), 0);
    const range = max - min || 1;
    return ordered.map((t, i) => ({
      x: (i / Math.max(ordered.length - 1, 1)) * 100,
      y: 100 - ((t.balance_after - min) / range) * 100,
    }));
  }, [txs]);

  const polylinePath = chartPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPath = chartPoints.length
    ? `M0,100 L${polylinePath.split(' ').join(' L')} L100,100 Z` : '';

  const bonus = getBonus(amount);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  const balance = wallet?.balance || 0;
  const deposited = wallet?.total_deposited || 0;
  const spent = wallet?.total_spent || 0;
  const pendingTopups = topups.filter((t) => t.status === 'pending');
  // آخر شحن فعلي = أحدث معاملة إيداع في المحفظة (يشمل بوابة الدفع + الشحن اليدوي)
  const lastDepositTx = txs.find((t) => t.type === 'deposit');
  const lastTopup = lastDepositTx
    ? { amount: Number(lastDepositTx.amount) }
    : topups.find((t) => t.status === 'approved');

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-5 space-y-4 max-w-6xl mx-auto" dir="rtl">
        {/* ===== Hero — Compact ===== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-2xl text-white shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600" />
          <motion.div animate={{ x: [0, 30, 0], y: [0, -15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-16 -right-16 w-56 h-56 bg-pink-400/40 rounded-full blur-3xl" />
          <motion.div animate={{ x: [0, -20, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-16 -left-16 w-56 h-56 bg-cyan-400/30 rounded-full blur-3xl" />

          <div className="relative z-10 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 180, delay: 0.15 }}
                  className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center ring-1 ring-white/30 shadow-lg">
                  <WalletIcon className="w-5 h-5" />
                </motion.div>
                <div>
                  <p className="text-white/75 text-[10px] font-bold tracking-wider uppercase">محفظتي الرقمية</p>
                  <h1 className="text-base sm:text-lg font-black mt-0.5">رصيدك المتاح</h1>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="icon" variant="ghost" onClick={() => setShowBalance((v) => !v)}
                  className="bg-white/15 hover:bg-white/25 text-white rounded-lg backdrop-blur-md border border-white/20 h-8 w-8">
                  {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={load}
                  className="bg-white/15 hover:bg-white/25 text-white rounded-lg backdrop-blur-md border border-white/20 h-8 w-8">
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 flex-wrap">
              <div>
                <AnimatePresence mode="wait">
                  <motion.div key={showBalance ? 'show' : 'hide'}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                    className="text-3xl sm:text-4xl font-black tracking-tight">
                    {showBalance ? WalletService.formatCurrency(balance, wallet?.currency) : '••••••'}
                  </motion.div>
                </AnimatePresence>
                {pendingTopups.length > 0 && (
                  <p className="text-[11px] text-white/85 mt-1.5 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
                    <Clock className="w-3 h-3" />
                    {pendingTopups.length} طلب قيد المراجعة
                  </p>
                )}
              </div>

              <Button onClick={() => navigate('/wallet/topup')}
                size="sm" className="bg-white text-violet-700 hover:bg-white/90 rounded-xl font-bold shadow-lg gap-1.5">
                <Plus className="w-4 h-4" /> شحن الرصيد
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ===== Stats — Compact 3-col ===== */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: 'الإيداعات', value: deposited, icon: ArrowDownToLine, color: 'emerald' },
            { label: 'المصروفات', value: spent, icon: ArrowUpFromLine, color: 'rose' },
            { label: 'الحركات', value: txs.length, icon: History, color: 'blue', isCount: true },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -2 }}>
              <Card className="border border-border/60 hover:border-violet-300 hover:shadow-md transition-all">
                <CardContent className="p-3 sm:p-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground">{s.label}</span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-${s.color}-100 text-${s.color}-600`}>
                      <s.icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className={`text-sm sm:text-lg font-black tracking-tight text-${s.color}-700`}>
                    {s.isCount ? s.value : WalletService.formatCurrency(s.value as number, wallet?.currency)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ===== Quick top-up shortcuts ===== */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-l from-amber-50 via-orange-50 to-rose-50 border border-amber-200/60 p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-900">شحن سريع</h3>
                <p className="text-[10px] text-amber-700/80">اختر مبلغًا واحصل على كاش باك فوري</p>
              </div>
            </div>
            {lastTopup && (
              <Badge variant="outline" className="text-[10px] bg-white">آخر شحن: {WalletService.formatCurrency(lastTopup.amount)}</Badge>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
            {QUICK_AMOUNTS.map((q) => {
              const b = getBonus(q);
              return (
                <button key={q} onClick={() => { setAmount(q); setTopupOpen(true); }}
                  className="group relative bg-white hover:bg-violet-50 border border-amber-200 hover:border-violet-400 rounded-xl p-2 transition-all hover:scale-105 hover:shadow-md">
                  <div className="text-xs sm:text-sm font-black text-violet-700">{q}</div>
                  <div className="text-[9px] text-muted-foreground">ر.س</div>
                  {b.pct > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                      +{b.pct}%
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ===== Chart ===== */}
        {chartPoints.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl bg-card border border-border/60 p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-violet-600" /> تطور الرصيد
              </h3>
              <Badge variant="outline" className="text-[10px]">{chartPoints.length} نقطة</Badge>
            </div>
            <div className="relative h-28 sm:h-32 w-full">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="walletAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(262 80% 60%)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="hsl(262 80% 60%)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path d={areaPath} fill="url(#walletAreaGrad)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
                <motion.polyline points={polylinePath} fill="none" stroke="hsl(262 80% 60%)"
                  strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeInOut' }}
                  vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* ===== Tabs ===== */}
        <Tabs defaultValue="tx" dir="rtl">
          <TabsList className="grid grid-cols-2 w-full sm:w-80 h-9">
            <TabsTrigger value="tx" className="gap-1.5 text-xs"><History className="w-3.5 h-3.5" /> سجل الحركات</TabsTrigger>
            <TabsTrigger value="topups" className="gap-1.5 text-xs"><Receipt className="w-3.5 h-3.5" /> طلبات الشحن</TabsTrigger>
          </TabsList>

          <TabsContent value="tx" className="mt-3">
            <Card className="border border-border/60">
              <CardContent className="p-0">
                {txs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">لا توجد حركات بعد</p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-border p-2 space-y-2">
                      {txs
                        .slice((txPage - 1) * PAGE_SIZE, txPage * PAGE_SIZE)
                        .map((t, i) => (
                          <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: Math.min(i * 0.025, 0.2) }}
                          >
                            <TransactionItem tx={t} />
                          </motion.div>
                        ))}
                    </div>
                    <Pagination
                      page={txPage}
                      total={txs.length}
                      pageSize={PAGE_SIZE}
                      onChange={setTxPage}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topups" className="mt-3">
            <Card className="border border-border/60">
              <CardContent className="p-0">
                {topups.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">لا توجد طلبات شحن بعد</p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-border">
                      {topups
                        .slice((topupsPage - 1) * PAGE_SIZE, topupsPage * PAGE_SIZE)
                        .map((r, i) => (
                          <motion.div key={r.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                            className="flex items-center gap-2.5 p-3 hover:bg-muted/30 transition-colors">
                            <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-bold">{WalletService.formatCurrency(r.amount)}</span>
                                <Badge className={`text-[9px] py-0 px-1.5 border ${TOPUP_STATUS_COLORS[r.status]}`}>
                                  {TOPUP_STATUS_LABELS[r.status]}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {r.payment_method} • {new Date(r.created_at).toLocaleString('ar-SA')}
                              </p>
                              {r.admin_notes && <p className="text-[10px] text-muted-foreground mt-1 italic">📝 {r.admin_notes}</p>}
                            </div>
                          </motion.div>
                        ))}
                    </div>
                    <Pagination
                      page={topupsPage}
                      total={topups.length}
                      pageSize={PAGE_SIZE}
                      onChange={setTopupsPage}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

// === Pagination component ===
interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ page, total, pageSize, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build page numbers (compact: 1 … current-1, current, current+1 … last)
  const pages: (number | 'gap')[] = [];
  const add = (n: number) => { if (!pages.includes(n)) pages.push(n); };
  add(1);
  if (page - 1 > 2) pages.push('gap');
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) add(i);
  if (page + 1 < totalPages - 1) pages.push('gap');
  if (totalPages > 1) add(totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 border-t bg-muted/20" dir="rtl">
      <p className="text-[11px] text-muted-foreground">
        عرض <span className="font-bold text-foreground">{from}</span>–<span className="font-bold text-foreground">{to}</span> من <span className="font-bold text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline" size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="السابق"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
        {pages.map((p, idx) =>
          p === 'gap' ? (
            <span key={`g-${idx}`} className="px-1 text-muted-foreground text-xs">…</span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              size="sm"
              className="h-7 min-w-7 px-2 text-xs"
              onClick={() => onChange(p)}
            >
              {p}
            </Button>
          )
        )}
        <Button
          variant="outline" size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="التالي"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default ClientWallet;
