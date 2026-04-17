import React, { useEffect, useMemo, useState } from 'react';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Wallet as WalletIcon, Plus, ArrowDownToLine, ArrowUpFromLine, TrendingUp,
  TrendingDown, Sparkles, Receipt, RefreshCw, History, CreditCard, Eye, EyeOff,
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

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500];

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
      toast.success('تم إرسال طلب الشحن بانتظار موافقة الإدارة');
      setTopupOpen(false); setAmount(0); setReference(''); setNotes(''); load();
    } catch (e: any) {
      toast.error('فشل إرسال الطلب', { description: e.message });
    } finally { setSubmitting(false); }
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

  return (
    <ClientLayout>
      <div className="p-3 sm:p-5 lg:p-6 space-y-6" dir="rtl">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600" />
          <motion.div animate={{ x: [0, 40, 0], y: [0, -25, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -right-20 w-72 h-72 bg-pink-400/40 rounded-full blur-3xl" />
          <motion.div animate={{ x: [0, -30, 0], y: [0, 25, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
              <div className="flex items-center gap-3">
                <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 180, delay: 0.2 }}
                  className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center ring-2 ring-white/30 shadow-xl">
                  <WalletIcon className="w-7 h-7" />
                </motion.div>
                <div>
                  <p className="text-white/80 text-xs font-semibold tracking-wider uppercase">محفظتي الرقمية</p>
                  <h1 className="text-2xl sm:text-3xl font-black mt-1">رصيدك المتاح</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setShowBalance((v) => !v)}
                  className="bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur-md border border-white/20">
                  {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={load}
                  className="bg-white/15 hover:bg-white/25 text-white rounded-xl backdrop-blur-md border border-white/20">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <AnimatePresence mode="wait">
                <motion.div key={showBalance ? 'show' : 'hide'}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25 }}
                  className="text-5xl sm:text-6xl font-black tracking-tight">
                  {showBalance ? WalletService.formatCurrency(balance, wallet?.currency) : '••••••'}
                </motion.div>
              </AnimatePresence>
              {pendingTopups.length > 0 && (
                <p className="text-sm text-white/85 mt-2 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  {pendingTopups.length} طلب شحن قيد المراجعة
                </p>
              )}
            </div>

            <Dialog open={topupOpen} onOpenChange={setTopupOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-white text-violet-700 hover:bg-white/90 rounded-2xl font-bold shadow-xl px-6">
                  <Plus className="w-5 h-5 ml-2" /> شحن الرصيد
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl" className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-violet-600" /> طلب شحن المحفظة
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label>المبلغ (ر.س)</Label>
                    <Input type="number" min={1} value={amount || ''} onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="أدخل المبلغ" className="text-lg font-bold" />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {QUICK_AMOUNTS.map((q) => (
                        <button key={q} type="button" onClick={() => setAmount(q)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            amount === q ? 'bg-violet-600 text-white border-violet-600' : 'bg-muted hover:bg-muted/80 border-border'
                          }`}>{q} ر.س</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>طريقة الدفع</Label>
                    <select value={method} onChange={(e) => setMethod(e.target.value)}
                      className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option value="bank_transfer">تحويل بنكي</option>
                      <option value="stc_pay">STC Pay</option>
                      <option value="mada">مدى</option>
                      <option value="cash">نقدي</option>
                    </select>
                  </div>
                  <div>
                    <Label>رقم العملية / المرجع (اختياري)</Label>
                    <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="مثال: رقم الحوالة" />
                  </div>
                  <div>
                    <Label>ملاحظات (اختياري)</Label>
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTopupOpen(false)}>إلغاء</Button>
                  <Button onClick={submitTopup} disabled={submitting} className="bg-violet-600 hover:bg-violet-700">
                    {submitting ? 'جارٍ الإرسال...' : 'إرسال الطلب'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: 'إجمالي الإيداعات', value: deposited, icon: ArrowDownToLine, gradient: 'from-emerald-500 to-teal-500' },
            { label: 'إجمالي المصروفات', value: spent, icon: ArrowUpFromLine, gradient: 'from-rose-500 to-orange-500' },
            { label: 'عدد الحركات', value: txs.length, icon: History, gradient: 'from-blue-500 to-indigo-500', isCount: true },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}>
              <Card className="relative overflow-hidden border-0 shadow-md">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`} />
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/15 rounded-full blur-2xl" />
                <CardContent className="relative p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-white/90">{s.label}</span>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center ring-1 ring-white/30">
                      <s.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black tracking-tight">
                    {s.isCount ? s.value : WalletService.formatCurrency(s.value as number, wallet?.currency)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        {chartPoints.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl bg-card border border-border/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-600" /> تطور الرصيد
              </h3>
              <Badge variant="outline">{chartPoints.length} نقطة</Badge>
            </div>
            <div className="relative h-40 w-full">
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

        {/* Tabs */}
        <Tabs defaultValue="tx">
          <TabsList className="grid grid-cols-2 w-full sm:w-96">
            <TabsTrigger value="tx" className="gap-2"><History className="w-4 h-4" /> سجل الحركات</TabsTrigger>
            <TabsTrigger value="topups" className="gap-2"><Receipt className="w-4 h-4" /> طلبات الشحن</TabsTrigger>
          </TabsList>

          <TabsContent value="tx" className="mt-4">
            <Card className="border border-border/60">
              <CardContent className="p-0">
                {txs.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>لا توجد حركات بعد</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {txs.map((t, i) => {
                      const isIn = t.type === 'deposit' || t.type === 'refund';
                      const TxIcon = isIn ? TrendingUp : TrendingDown;
                      return (
                        <motion.div key={t.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(i * 0.03, 0.4) }}
                          className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isIn ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            <TxIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold">{t.description || TX_TYPE_LABELS[t.type]}</span>
                              <Badge variant="outline" className={`text-[10px] ${TX_TYPE_COLORS[t.type]}`}>
                                {TX_TYPE_LABELS[t.type]}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{new Date(t.created_at).toLocaleString('ar-SA')}</p>
                          </div>
                          <div className="text-end">
                            <div className={`text-base font-black ${isIn ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isIn ? '+' : '−'} {WalletService.formatCurrency(t.amount)}
                            </div>
                            <p className="text-[11px] text-muted-foreground">رصيد: {WalletService.formatCurrency(t.balance_after)}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topups" className="mt-4">
            <Card className="border border-border/60">
              <CardContent className="p-0">
                {topups.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Receipt className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>لا توجد طلبات شحن بعد</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {topups.map((r, i) => (
                      <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
                        <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold">{WalletService.formatCurrency(r.amount)}</span>
                            <Badge className={`text-[10px] border ${TOPUP_STATUS_COLORS[r.status]}`}>
                              {TOPUP_STATUS_LABELS[r.status]}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {r.payment_method} • {new Date(r.created_at).toLocaleString('ar-SA')}
                          </p>
                          {r.admin_notes && <p className="text-[11px] text-muted-foreground mt-1 italic">📝 {r.admin_notes}</p>}
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
