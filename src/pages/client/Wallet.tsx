import React, { useEffect, useMemo, useState } from 'react';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Wallet as WalletIcon, Plus, ArrowDownToLine, ArrowUpFromLine, TrendingUp,
  TrendingDown, Sparkles, Receipt, RefreshCw, History, CreditCard, Eye, EyeOff,
  Gift, Zap, Copy, Check, Shield, Clock,
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

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

// Bonus tiers — encourage larger top-ups
const getBonus = (amt: number) => {
  if (amt >= 5000) return { pct: 15, label: 'بونص 15%' };
  if (amt >= 2500) return { pct: 10, label: 'بونص 10%' };
  if (amt >= 1000) return { pct: 5, label: 'بونص 5%' };
  if (amt >= 500) return { pct: 2, label: 'بونص 2%' };
  return { pct: 0, label: '' };
};

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'تحويل بنكي', icon: '🏦' },
  { value: 'stc_pay', label: 'STC Pay', icon: '📱' },
  { value: 'mada', label: 'مدى', icon: '💳' },
  { value: 'cash', label: 'نقدي', icon: '💵' },
];

const BANK_INFO = {
  bank: 'البنك الأهلي السعودي',
  iban: 'SA00 0000 0000 0000 0000 0000',
  beneficiary: 'وكالة ماستر إيدو باث',
};

const ClientWallet: React.FC = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletT | null>(null);
  const [txs, setTxs] = useState<WalletTransaction[]>([]);
  const [topups, setTopups] = useState<TopupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [topupOpen, setTopupOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

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

  const submitTopup = async () => {
    if (!user?.id) return;
    if (!amount || amount <= 0) return toast.error('يرجى إدخال مبلغ صحيح');
    setSubmitting(true);
    try {
      await WalletService.createTopupRequest({
        user_id: user.id, amount, payment_method: method,
        reference_number: reference || undefined, notes: notes || undefined,
      });
      toast.success('تم إرسال طلب الشحن بانتظار موافقة الإدارة', {
        description: bonus.pct > 0 ? `🎁 ستحصل على ${bonus.label} عند الموافقة!` : undefined,
      });
      setTopupOpen(false); setAmount(0); setReference(''); setNotes(''); load();
    } catch (e: any) {
      toast.error('فشل إرسال الطلب', { description: e.message });
    } finally { setSubmitting(false); }
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
    ? `M0,100 L${polylinePath.replaceAll(' ', ' L')} L100,100 Z` : '';

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
  const lastTopup = topups.find((t) => t.status === 'approved');

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

              <Dialog open={topupOpen} onOpenChange={setTopupOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-white text-violet-700 hover:bg-white/90 rounded-xl font-bold shadow-lg gap-1.5">
                    <Plus className="w-4 h-4" /> شحن الرصيد
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl" className="max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-600" /> شحن المحفظة
                    </DialogTitle>
                  </DialogHeader>

                  {/* Bonus tiers banner */}
                  <div className="rounded-xl bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-200 p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-black text-amber-900">عروض الشحن — كلما زاد المبلغ زاد البونص</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                      <div className="bg-white rounded-lg p-1.5"><div className="text-amber-700">500+</div><div className="text-muted-foreground">2%</div></div>
                      <div className="bg-white rounded-lg p-1.5"><div className="text-amber-700">1000+</div><div className="text-muted-foreground">5%</div></div>
                      <div className="bg-white rounded-lg p-1.5"><div className="text-amber-700">2500+</div><div className="text-muted-foreground">10%</div></div>
                      <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-lg p-1.5"><div>5000+</div><div>15% 🎁</div></div>
                    </div>
                  </div>

                  <div className="space-y-3 py-1">
                    <div>
                      <Label className="text-xs">المبلغ (ر.س)</Label>
                      <Input type="number" min={1} value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="أدخل المبلغ" className="text-lg font-bold mt-1" />
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {QUICK_AMOUNTS.map((q) => (
                          <button key={q} type="button" onClick={() => setAmount(q)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                              amount === q ? 'bg-violet-600 text-white border-violet-600 shadow-md scale-105' : 'bg-muted hover:bg-muted/80 border-border'
                            }`}>{q}</button>
                        ))}
                      </div>
                      {bonus.pct > 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 flex items-center gap-2 bg-gradient-to-l from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-2">
                          <Gift className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-800">
                            🎁 ستحصل على {bonus.label} = +{WalletService.formatCurrency(amount * bonus.pct / 100)} مكافأة
                          </span>
                        </motion.div>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs">طريقة الدفع</Label>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        {PAYMENT_METHODS.map((m) => (
                          <button key={m.value} type="button" onClick={() => setMethod(m.value)}
                            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold border transition-all ${
                              method === m.value ? 'bg-violet-50 border-violet-500 text-violet-700' : 'bg-muted/50 border-border hover:bg-muted'
                            }`}>
                            <span>{m.icon}</span>{m.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {method === 'bank_transfer' && (
                      <div className="rounded-lg bg-muted/40 border border-border p-2.5 space-y-1.5 text-xs">
                        <div className="font-bold text-muted-foreground mb-1">حوّل على الحساب التالي:</div>
                        <div className="flex items-center justify-between gap-2"><span>{BANK_INFO.bank}</span></div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono">{BANK_INFO.iban}</span>
                          <button onClick={() => copy(BANK_INFO.iban, 'iban')} className="text-violet-600 hover:bg-violet-50 p-1 rounded">
                            {copied === 'iban' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-muted-foreground">المستفيد: {BANK_INFO.beneficiary}</div>
                      </div>
                    )}

                    <div>
                      <Label className="text-xs">رقم الحوالة / المرجع (اختياري)</Label>
                      <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="رقم العملية" className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">ملاحظات (اختياري)</Label>
                      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1" />
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 rounded-lg p-2">
                      <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      معاملاتك آمنة ومشفّرة • سيتم مراجعة الطلب خلال 24 ساعة
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setTopupOpen(false)}>إلغاء</Button>
                    <Button onClick={submitTopup} disabled={submitting} className="bg-gradient-to-l from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                      {submitting ? 'جارٍ الإرسال...' : <><Zap className="w-4 h-4 ml-1" />إرسال الطلب</>}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                <p className="text-[10px] text-amber-700/80">اختر مبلغًا واحصل على بونص فوري</p>
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
                  <div className="divide-y divide-border">
                    {txs.map((t, i) => {
                      const isIn = t.type === 'deposit' || t.type === 'refund';
                      const TxIcon = isIn ? TrendingUp : TrendingDown;
                      return (
                        <motion.div key={t.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(i * 0.025, 0.3) }}
                          className="flex items-center gap-2.5 p-3 hover:bg-muted/30 transition-colors">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isIn ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            <TxIcon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold truncate">{t.description || TX_TYPE_LABELS[t.type]}</span>
                              <Badge variant="outline" className={`text-[9px] py-0 px-1.5 ${TX_TYPE_COLORS[t.type]}`}>
                                {TX_TYPE_LABELS[t.type]}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(t.created_at).toLocaleString('ar-SA')}</p>
                          </div>
                          <div className="text-end shrink-0">
                            <div className={`text-sm font-black ${isIn ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isIn ? '+' : '−'} {WalletService.formatCurrency(t.amount)}
                            </div>
                            <p className="text-[10px] text-muted-foreground">رصيد: {WalletService.formatCurrency(t.balance_after)}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
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
                  <div className="divide-y divide-border">
                    {topups.map((r, i) => (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default ClientWallet;
