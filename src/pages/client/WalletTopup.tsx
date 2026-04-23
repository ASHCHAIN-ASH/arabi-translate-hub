import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Sparkles, Gift, Zap, CreditCard, Building2, Copy, Check, Upload,
  FileImage, X, Shield, ArrowLeft, Wallet as WalletIcon, ChevronRight,
  TrendingUp, Lock, BadgeCheck, Banknote, Receipt, Info, Plus,
  Image as ImageIcon, Loader2, CloudUpload, FileCheck2, Send, Hash,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WalletService, type Wallet as WalletT } from '@/utils/walletService';
import { BANK_INFO } from './Wallet';
import { cn } from '@/lib/utils';

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

const BONUS_TIERS = [
  { min: 500, pct: 2, label: '+500', color: 'from-sky-500/15 to-sky-500/5', accent: 'text-sky-600 dark:text-sky-400' },
  { min: 1000, pct: 5, label: '+1,000', color: 'from-violet-500/15 to-violet-500/5', accent: 'text-violet-600 dark:text-violet-400' },
  { min: 2500, pct: 10, label: '+2,500', color: 'from-amber-500/15 to-amber-500/5', accent: 'text-amber-600 dark:text-amber-400' },
  { min: 5000, pct: 15, label: '+5,000', color: 'from-emerald-500/20 to-emerald-500/5', accent: 'text-emerald-600 dark:text-emerald-400' },
];

const getBonus = (amt: number) => {
  const tier = [...BONUS_TIERS].reverse().find((t) => amt >= t.min);
  return tier ? { pct: tier.pct, label: `بونص ${tier.pct}%` } : { pct: 0, label: '' };
};

const WalletTopup: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletT | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [method, setMethod] = useState<'instant' | 'manual'>('instant');
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'saving' | 'done'>('idle');
  const [uploadPct, setUploadPct] = useState(0);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    WalletService.getMyWallet(user.id).then(setWallet).catch(() => {});
  }, [user?.id]);

  const bonus = useMemo(() => getBonus(amount), [amount]);
  const bonusAmount = useMemo(() => Math.round((amount * bonus.pct) / 100), [amount, bonus.pct]);
  const totalReceived = amount + bonusAmount;
  const newBalance = (wallet?.balance || 0) + totalReceived;

  // progress to next tier (for the live progress bar)
  const nextTier = useMemo(
    () => BONUS_TIERS.find((t) => amount < t.min),
    [amount],
  );
  const progressPct = useMemo(() => {
    if (!nextTier) return 100;
    return Math.min(100, Math.round((amount / nextTier.min) * 100));
  }, [amount, nextTier]);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success('تم النسخ');
    setTimeout(() => setCopied(null), 1500);
  };

  const payInstant = async () => {
    if (!amount || amount <= 0) return toast.error('يرجى إدخال مبلغ صحيح');
    setSubmitting(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { purpose: 'wallet_topup', amount, note: 'شحن المحفظة بالبطاقة' },
      });
      if (error) throw error;
      if (!data?.checkout_url) throw new Error('لم يتم استلام رابط الدفع');
      window.location.href = data.checkout_url;
    } catch (e: any) {
      toast.error('فشل بدء عملية الدفع', { description: e.message });
      setSubmitting(false);
    }
  };

  const submitManual = async () => {
    if (!user?.id) return;
    if (!amount || amount <= 0) return toast.error('يرجى إدخال مبلغ صحيح');
    if (!receiptFile) return toast.error('يرجى إرفاق صورة إيصال التحويل البنكي');
    setSubmitting(true);
    setUploadStage('uploading');
    setUploadPct(0);
    try {
      const receipt_path = await WalletService.uploadReceipt(
        user.id,
        receiptFile,
        (p) => setUploadPct(p),
      );
      setUploadStage('saving');
      await WalletService.createTopupRequest({
        user_id: user.id,
        amount,
        payment_method: 'bank_transfer',
        reference_number: reference || undefined,
        notes: notes || undefined,
        receipt_path,
      });
      setUploadStage('done');
      toast.success('تم إرسال طلب الشحن بانتظار موافقة الإدارة', {
        description: bonus.pct > 0 ? `🎁 ستحصل على ${bonus.label} عند الموافقة!` : undefined,
      });
      setTimeout(() => navigate('/wallet'), 900);
    } catch (e: any) {
      setUploadStage('idle');
      toast.error('فشل إرسال الطلب', { description: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-6 space-y-5" dir="rtl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <button
            onClick={() => navigate('/wallet')}
            className="hover:text-foreground transition flex items-center gap-1.5 hover:bg-muted/60 px-2 py-1 rounded-md"
          >
            <WalletIcon className="w-3.5 h-3.5" /> محفظتي
          </button>
          <ChevronRight className="w-3 h-3 rotate-180" />
          <span className="text-foreground font-bold">شحن الرصيد</span>
        </nav>

        {/* HERO — premium banking card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary to-primary/70 text-primary-foreground shadow-2xl shadow-primary/20"
        >
          {/* decorative orbs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-accent/30 blur-3xl pointer-events-none"
          />

          <div className="relative p-5 sm:p-7 grid sm:grid-cols-[1fr_auto] gap-4 sm:gap-6 items-start">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <div>
                  <h1 className="text-xl sm:text-3xl font-black leading-tight">شحن المحفظة الذكية</h1>
                  <p className="text-primary-foreground/80 text-xs sm:text-sm">تجربة شحن لحظية وآمنة بمعايير بنكية</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge className="bg-white/15 hover:bg-white/20 backdrop-blur border-white/20 text-primary-foreground gap-1 text-[10px] sm:text-xs">
                  <Lock className="w-3 h-3" /> SSL مشفّر
                </Badge>
                <Badge className="bg-white/15 hover:bg-white/20 backdrop-blur border-white/20 text-primary-foreground gap-1 text-[10px] sm:text-xs">
                  <BadgeCheck className="w-3 h-3" /> معتمد من ساما
                </Badge>
                <Badge className="bg-white/15 hover:bg-white/20 backdrop-blur border-white/20 text-primary-foreground gap-1 text-[10px] sm:text-xs">
                  <Zap className="w-3 h-3" /> فوري
                </Badge>
              </div>
            </div>

            {wallet && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white/12 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/20 shadow-xl min-w-[180px]"
              >
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider opacity-90 mb-1">
                  <WalletIcon className="w-3 h-3" /> رصيدك الحالي
                </div>
                <div className="text-xl sm:text-2xl font-black whitespace-nowrap">
                  {WalletService.formatCurrency(wallet.balance, wallet.currency)}
                </div>
                <AnimatePresence>
                  {amount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 pt-2 border-t border-white/20"
                    >
                      <div className="text-[10px] opacity-90 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> بعد الشحن
                      </div>
                      <div className="text-sm sm:text-base font-bold whitespace-nowrap">
                        {WalletService.formatCurrency(newBalance, wallet.currency)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* GRID: amount + summary */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-5">
          {/* LEFT — Amount + tiers */}
          <div className="space-y-4">
            {/* Bonus tiers — interactive progress */}
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: bonus.pct > 0 ? [0, -10, 10, 0] : 0 }}
                      transition={{ duration: 0.6 }}
                      className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md shadow-amber-500/30"
                    >
                      <Gift className="w-4 h-4 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-sm font-black">برنامج المكافآت</h2>
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground">كلما زاد المبلغ زاد البونص</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {bonus.pct > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white gap-1 font-black">
                          <Sparkles className="w-3 h-3" /> {bonus.label}
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Live progress bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
                    <span>التقدم نحو الشريحة التالية</span>
                    <span className="font-bold text-foreground">
                      {nextTier ? `${amount.toLocaleString('ar-SA')} / ${nextTier.min.toLocaleString('ar-SA')}` : '🏆 أعلى شريحة'}
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-l from-emerald-500 via-amber-400 to-primary rounded-full"
                    />
                  </div>
                </div>

                {/* Tier chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BONUS_TIERS.map((t) => {
                    const reached = amount >= t.min;
                    return (
                      <motion.button
                        key={t.min}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setAmount(t.min)}
                        className={cn(
                          'relative rounded-xl p-2.5 border text-center transition-all overflow-hidden bg-gradient-to-br',
                          t.color,
                          reached
                            ? 'border-primary/40 shadow-md shadow-primary/10 ring-1 ring-primary/20'
                            : 'border-border/60 opacity-80 hover:opacity-100',
                        )}
                      >
                        {reached && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                        <div className={cn('text-sm font-black', t.accent)}>{t.label}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 font-bold">{t.pct}% بونص</div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Amount input */}
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-black flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-primary" />
                    المبلغ المراد شحنه
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-bold">بالريال السعودي</span>
                </div>

                <div className="relative">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0"
                    className="text-3xl sm:text-5xl font-black h-20 sm:h-24 text-center bg-gradient-to-br from-muted/40 to-muted/10 border-2 border-dashed border-primary/30 focus-visible:border-primary focus-visible:bg-card transition-all tracking-tight"
                  />
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="text-base sm:text-lg font-black text-muted-foreground">ر.س</span>
                  </div>
                  <AnimatePresence>
                    {amount > 0 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={() => setAmount(0)}
                        className="absolute inset-y-0 right-4 flex items-center text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick chips */}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {QUICK_AMOUNTS.map((q, i) => (
                    <motion.button
                      key={q}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setAmount(q)}
                      className={cn(
                        'px-3.5 py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1',
                        amount === q
                          ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30'
                          : 'bg-muted/60 hover:bg-muted border-border/60',
                      )}
                    >
                      <Plus className="w-3 h-3" />
                      {q.toLocaleString('ar-SA')}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Method picker */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'instant' as const,
                  icon: Zap,
                  title: 'دفع فوري بالبطاقة',
                  sub: 'مدى • فيزا • ماستر • Apple Pay',
                  badge: 'فوري ⚡',
                  gradient: 'from-primary/10 to-primary/0',
                  iconBg: 'bg-primary',
                },
                {
                  id: 'manual' as const,
                  icon: Building2,
                  title: 'تحويل بنكي',
                  sub: 'يتم التفعيل خلال 24 ساعة',
                  badge: 'يدوي',
                  gradient: 'from-amber-500/10 to-amber-500/0',
                  iconBg: 'bg-amber-500',
                },
              ].map((m) => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <motion.button
                    key={m.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      'relative text-right rounded-2xl border-2 p-4 transition-all overflow-hidden bg-gradient-to-br',
                      m.gradient,
                      active
                        ? 'border-primary shadow-lg shadow-primary/15 ring-2 ring-primary/20'
                        : 'border-border/60 hover:border-primary/40 bg-card',
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="method-check"
                        className="absolute top-3 left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md"
                      >
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </motion.div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shadow-md text-white shrink-0', m.iconBg)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-black truncate">{m.title}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{m.sub}</div>
                        <Badge variant="secondary" className="mt-1.5 text-[10px] font-bold">
                          {m.badge}
                        </Badge>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Method content */}
            <AnimatePresence mode="wait">
              {method === 'manual' && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <Card className="overflow-hidden border-border/60 shadow-sm">
                    <div className="bg-gradient-to-l from-amber-500 to-amber-600 px-4 py-3 flex items-center gap-2 text-white">
                      <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] opacity-90">حوّل للحساب البنكي التالي</div>
                        <div className="text-xs sm:text-sm font-black truncate">{BANK_INFO.bank}</div>
                      </div>
                      <Badge className="bg-white/20 backdrop-blur border-white/30 text-white shrink-0 text-[10px]">
                        معتمد ✓
                      </Badge>
                    </div>
                    <CardContent className="p-3 space-y-2.5 bg-muted/20">
                      <div className="rounded-xl bg-card border p-3">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">رقم الآيبان (IBAN)</span>
                          <button
                            onClick={() => copy(BANK_INFO.iban, 'iban')}
                            className="flex items-center gap-1 text-[10px] font-bold text-primary hover:bg-primary/10 px-2 py-1 rounded-md transition shrink-0"
                          >
                            {copied === 'iban' ? (
                              <><Check className="w-3 h-3" /> تم النسخ</>
                            ) : (
                              <><Copy className="w-3 h-3" /> نسخ</>
                            )}
                          </button>
                        </div>
                        <div className="font-mono text-sm sm:text-base font-black tracking-wider text-foreground select-all break-all">
                          {BANK_INFO.ibanFormatted}
                        </div>
                      </div>

                      <div className="rounded-xl bg-card border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">اسم المستفيد</div>
                            <div className="text-xs sm:text-sm font-bold text-foreground truncate">{BANK_INFO.beneficiary}</div>
                          </div>
                          <button
                            onClick={() => copy(BANK_INFO.beneficiary, 'ben')}
                            className="shrink-0 text-primary hover:bg-primary/10 p-2 rounded-md transition"
                          >
                            {copied === 'ben' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Receipt upload */}
                      <div>
                        <Label className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1 mb-1.5">
                          <Receipt className="w-3 h-3" /> إيصال التحويل <span className="text-destructive">*</span>
                        </Label>
                        {!receiptFile ? (
                          <motion.label
                            whileHover={{ scale: 1.01 }}
                            className="cursor-pointer flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-primary/40 rounded-xl p-5 hover:bg-primary/5 transition bg-card text-center"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Upload className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xs font-black text-primary">ارفع صورة الإيصال</span>
                            <span className="text-[10px] text-muted-foreground">JPG · PNG · PDF • أقصى 5MB</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              hidden
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                if (f.size > 5 * 1024 * 1024) return toast.error('الحجم الأقصى 5 ميجابايت');
                                setReceiptFile(f);
                              }}
                            />
                          </motion.label>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl p-2.5"
                          >
                            <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold truncate">{receiptFile.name}</div>
                              <div className="text-[10px] text-muted-foreground">{(receiptFile.size / 1024).toFixed(0)} KB · جاهز للإرسال</div>
                            </div>
                            <button
                              onClick={() => setReceiptFile(null)}
                              className="text-destructive hover:bg-destructive/10 p-1.5 rounded shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        )}
                      </div>

                      <div>
                        <Label className="text-[11px] font-bold">رقم الحوالة (اختياري)</Label>
                        <Input
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          placeholder="رقم العملية المرجعي"
                          className="mt-1 h-10"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-bold">ملاحظات (اختياري)</Label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2}
                          className="mt-1"
                          placeholder="أي تفاصيل إضافية..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT — Live Summary */}
          <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden border-border/60 shadow-lg bg-gradient-to-br from-card via-card to-muted/20">
                <CardContent className="p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-primary" />
                      ملخص العملية
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-bold gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      مباشر
                    </Badge>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">المبلغ المُدخل</span>
                      <motion.span
                        key={amount}
                        initial={{ scale: 1.1, color: 'hsl(var(--primary))' }}
                        animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                        className="font-black tabular-nums"
                      >
                        {WalletService.formatCurrency(amount)}
                      </motion.span>
                    </div>

                    <AnimatePresence>
                      {bonusAmount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between items-center text-emerald-600 dark:text-emerald-400"
                        >
                          <span className="flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5" />
                            بونص ({bonus.pct}%)
                          </span>
                          <span className="font-black tabular-nums">+{WalletService.formatCurrency(bonusAmount)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="border-t border-dashed border-border my-2" />

                    <div className="flex justify-between items-center bg-primary/5 -mx-2 px-3 py-2.5 rounded-xl">
                      <span className="text-xs font-bold text-muted-foreground">إجمالي الإضافة</span>
                      <motion.span
                        key={totalReceived}
                        initial={{ scale: 1.15 }}
                        animate={{ scale: 1 }}
                        className="text-base sm:text-lg font-black text-primary tabular-nums"
                      >
                        {WalletService.formatCurrency(totalReceived)}
                      </motion.span>
                    </div>

                    {wallet && (
                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-muted-foreground">رصيدك بعد الشحن</span>
                        <span className="font-black tabular-nums">
                          {WalletService.formatCurrency(newBalance, wallet.currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action button */}
                  <motion.div whileHover={amount > 0 ? { scale: 1.01 } : {}} whileTap={amount > 0 ? { scale: 0.99 } : {}}>
                    <Button
                      onClick={method === 'instant' ? payInstant : submitManual}
                      disabled={!amount || amount <= 0 || submitting || (method === 'manual' && !receiptFile)}
                      className="w-full h-13 sm:h-14 font-black text-sm sm:text-base gap-2 shadow-lg shadow-primary/20 bg-gradient-to-l from-primary to-primary/85 hover:opacity-95"
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          />
                          جارٍ المعالجة...
                        </>
                      ) : method === 'instant' ? (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span className="truncate">ادفع الآن</span>
                          <ArrowLeft className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          إرسال طلب الشحن
                          <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <div className="flex items-start gap-2 text-[10px] text-muted-foreground bg-muted/40 rounded-lg p-2.5">
                    <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>
                      {method === 'instant'
                        ? 'يُضاف الرصيد لمحفظتك خلال ثوانٍ بعد إتمام الدفع عبر بوابة دفع آمنة معتمدة من ساما.'
                        : 'سيتم مراجعة طلبك خلال 24 ساعة عمل وإضافة الرصيد فور التحقق من الإيصال.'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Shield, label: 'حماية كاملة', sub: 'PCI-DSS' },
                { icon: Lock, label: 'تشفير 256-bit', sub: 'TLS' },
                { icon: BadgeCheck, label: 'موثوق', sub: 'ساما' },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <motion.div
                    key={t.label}
                    whileHover={{ y: -2 }}
                    className="bg-card border border-border/60 rounded-xl p-2.5 text-center"
                  >
                    <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-[10px] font-black">{t.label}</div>
                    <div className="text-[9px] text-muted-foreground">{t.sub}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default WalletTopup;
