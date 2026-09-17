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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WalletService, type Wallet as WalletT } from '@/utils/walletService';
import { BANK_INFO } from './Wallet';
import { cn } from '@/lib/utils';
import MoyasarCardForm from '@/components/payments/MoyasarCardForm';

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
  const [showSuccess, setShowSuccess] = useState(false);
  // Temporary local order number (shown before submission, persists for the session)
  const [orderRef] = useState<string>(
    () => `TOP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
  );
  const [dragOver, setDragOver] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    WalletService.getMyWallet(user.id).then(setWallet).catch(() => {});
  }, [user?.id]);

  // Build/cleanup an object URL preview for the receipt file (images only).
  useEffect(() => {
    if (!receiptFile || !receiptFile.type.startsWith('image/')) {
      setReceiptPreview(null);
      return;
    }
    const url = URL.createObjectURL(receiptFile);
    setReceiptPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [receiptFile]);

  const handleFile = (f?: File | null) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error('الحجم الأقصى 5 ميجابايت');
    const ok = f.type.startsWith('image/') || f.type === 'application/pdf';
    if (!ok) return toast.error('الصيغة غير مدعومة. JPG / PNG / PDF فقط');
    setReceiptFile(f);
    toast.success('تم اختيار الإيصال', { description: f.name });
  };

  useEffect(() => { setShowCardForm(false); }, [amount, method]);

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
    toast.success('تم نسخ رقم الآيبان بنجاح ✓', {
      description: 'يمكنك الآن لصقه في تطبيق البنك لإتمام التحويل',
    });
    setTimeout(() => setCopied(null), 1800);
  };

  const payInstant = () => {
    if (!amount || amount <= 0) return toast.error('يرجى إدخال مبلغ صحيح');
    setShowCardForm(true);
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
      const created = await WalletService.createTopupRequest({
        user_id: user.id,
        amount,
        payment_method: 'bank_transfer',
        reference_number: reference || undefined,
        notes: notes || undefined,
        receipt_path,
      });

      // Notify the review team with full request summary (amount, method, id, receipt link)
      try {
        const { supabase } = await import('@/data/legacy/client');
        let receipt_url: string | undefined;
        try {
          const { data: signed } = await supabase.storage
            .from('wallet-receipts')
            .createSignedUrl(receipt_path, 60 * 60 * 24 * 7); // 7 days
          receipt_url = signed?.signedUrl;
        } catch { /* non-blocking */ }

        await supabase.functions.invoke('send-topup-notification', {
          body: {
            request_id: (created as any)?.id || crypto.randomUUID(),
            amount,
            payment_method: 'bank_transfer',
            reference_number: reference || undefined,
            notes: notes || undefined,
            client_name: (user as any)?.user_metadata?.full_name || (user as any)?.email,
            client_email: (user as any)?.email,
            client_phone: (user as any)?.user_metadata?.phone || (user as any)?.phone,
            receipt_url,
          },
        });
      } catch (notifyErr) {
        console.warn('Topup notification failed (non-blocking):', notifyErr);
      }

      setUploadStage('done');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/wallet');
      }, 5000);
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
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="space-y-3"
                >
                  {/* === BANK CARD (visual, premium) === */}
                  <motion.div
                    initial={{ opacity: 0, rotateX: -8 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white shadow-2xl shadow-amber-900/20"
                    style={{
                      background:
                        'linear-gradient(135deg, hsl(220 70% 18%) 0%, hsl(215 60% 28%) 55%, hsl(35 85% 45%) 130%)',
                    }}
                  >
                    {/* shimmer */}
                    <motion.div
                      animate={{ x: ['-150%', '150%'] }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none"
                    />
                    {/* mesh dots */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage:
                          'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '14px 14px',
                      }}
                    />

                    <div className="relative flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg"
                        >
                          <Building2 className="w-5 h-5" />
                        </motion.div>
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-widest opacity-80">
                            تحويل بنكي مباشر
                          </div>
                          <div className="text-sm sm:text-base font-black truncate">
                            {BANK_INFO.bank}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-white/20 backdrop-blur border-white/30 text-white text-[10px] gap-1">
                        <BadgeCheck className="w-3 h-3" /> معتمد
                      </Badge>
                    </div>

                    {/* IBAN */}
                    <div className="relative mt-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase tracking-widest opacity-80">
                          رقم الآيبان (IBAN)
                        </span>
                        <span dir="ltr" className="text-[9px] font-mono opacity-70 tabular-nums">
                          {BANK_INFO.iban.length} chars
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-2.5">
                        <div
                          dir="ltr"
                          className="font-mono text-[13px] sm:text-[15px] font-bold tracking-[0.06em] select-all truncate text-left flex-1 tabular-nums"
                          style={{ fontVariantNumeric: 'tabular-nums', unicodeBidi: 'isolate' }}
                        >
                          {BANK_INFO.iban.replace(/(.{4})/g, '$1 ').trim()}
                        </div>
                        <TooltipProvider delayDuration={150}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => copy(BANK_INFO.iban, 'iban')}
                                aria-label="نسخ رقم الآيبان"
                                className="shrink-0 flex items-center gap-1 text-[10px] font-black bg-white/15 hover:bg-white/25 border border-white/25 px-2.5 py-1.5 rounded-lg transition"
                              >
                                <AnimatePresence mode="wait" initial={false}>
                                  {copied === 'iban' ? (
                                    <motion.span
                                      key="ok"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="flex items-center gap-1"
                                    >
                                      <Check className="w-3 h-3" /> نُسخ
                                    </motion.span>
                                  ) : (
                                    <motion.span
                                      key="copy"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="flex items-center gap-1"
                                    >
                                      <Copy className="w-3 h-3" /> نسخ
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </motion.button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="font-bold">
                              {copied === 'iban' ? 'تم النسخ ✓' : 'نسخ رقم الآيبان إلى الحافظة'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    {/* Beneficiary + amount hint */}
                    <div className="relative mt-3 grid grid-cols-2 gap-2">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2">
                        <div className="text-[9px] uppercase tracking-widest opacity-80">
                          المستفيد
                        </div>
                        <div className="text-[11px] sm:text-xs font-black truncate mt-0.5">
                          {BANK_INFO.beneficiary}
                        </div>
                      </div>
                      <button
                        onClick={() => copy(BANK_INFO.beneficiary, 'ben')}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 text-right hover:bg-white/15 transition"
                      >
                        <div className="text-[9px] uppercase tracking-widest opacity-80">
                          المبلغ
                        </div>
                        <div className="text-[11px] sm:text-xs font-black mt-0.5 tabular-nums">
                          {amount > 0 ? amount.toLocaleString('ar-SA') + ' ر.س' : '— —'}
                        </div>
                      </button>
                    </div>
                  </motion.div>

                  {/* === STEP TIMELINE === */}
                  <Card className="overflow-hidden border-border/60 shadow-sm">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-2 relative">
                        {[
                          { id: 1, icon: Banknote, label: 'حوّل المبلغ', done: true },
                          { id: 2, icon: CloudUpload, label: 'ارفع الإيصال', done: !!receiptFile },
                          { id: 3, icon: Send, label: 'إرسال الطلب للمراجعة', done: uploadStage === 'done' },
                        ].map((s, i) => {
                          const Icon = s.icon;
                          return (
                            <div key={s.id} className="flex flex-col items-center text-center relative">
                              {i < 2 && (
                                <div className="absolute top-4 left-[-50%] right-[50%] h-0.5 bg-border" />
                              )}
                              <motion.div
                                animate={s.done ? { scale: [1, 1.15, 1] } : {}}
                                transition={{ duration: 0.4 }}
                                className={cn(
                                  'relative w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors z-10',
                                  s.done
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                    : 'bg-card border-border text-muted-foreground',
                                )}
                              >
                                {s.done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                              </motion.div>
                              <div
                                className={cn(
                                  'text-[10px] sm:text-[11px] font-bold mt-1.5',
                                  s.done ? 'text-foreground' : 'text-muted-foreground',
                                )}
                              >
                                {s.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* === RECEIPT UPLOAD (drag-n-drop + live preview) === */}
                  <Card className="overflow-hidden border-border/60 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-black flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-primary" />
                          إيصال التحويل البنكي
                          <span className="text-destructive">*</span>
                        </Label>
                        <span className="text-[10px] text-muted-foreground font-bold">
                          JPG · PNG · PDF • 5MB
                        </span>
                      </div>

                      <AnimatePresence mode="wait">
                        {!receiptFile ? (
                          <motion.label
                            key="dropzone"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOver(false);
                              handleFile(e.dataTransfer.files?.[0]);
                            }}
                            className={cn(
                              'relative cursor-pointer flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all bg-gradient-to-br text-center overflow-hidden',
                              dragOver
                                ? 'border-primary bg-primary/10 scale-[1.01] shadow-lg shadow-primary/10'
                                : 'border-primary/35 from-primary/5 to-transparent hover:border-primary/60 hover:bg-primary/5',
                            )}
                          >
                            <motion.div
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30"
                            >
                              <CloudUpload className="w-7 h-7 text-primary-foreground" />
                            </motion.div>
                            <div className="space-y-0.5">
                              <div className="text-sm font-black text-foreground">
                                {dragOver ? 'أفلت الملف هنا' : 'اسحب الإيصال هنا أو اضغط للاختيار'}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                سيُرسل للأدمن فوراً ويُراجع خلال 24 ساعة
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Badge variant="outline" className="text-[9px] gap-1 font-bold">
                                <ImageIcon className="w-2.5 h-2.5" /> صورة
                              </Badge>
                              <Badge variant="outline" className="text-[9px] gap-1 font-bold">
                                <FileImage className="w-2.5 h-2.5" /> PDF
                              </Badge>
                            </div>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              hidden
                              onChange={(e) => handleFile(e.target.files?.[0])}
                            />
                          </motion.label>
                        ) : (
                          <motion.div
                            key="preview"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent overflow-hidden"
                          >
                            {/* preview area */}
                            <div className="relative aspect-[16/9] bg-muted/30 flex items-center justify-center overflow-hidden">
                              {receiptPreview ? (
                                <motion.img
                                  initial={{ scale: 1.1, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  src={receiptPreview}
                                  alt="معاينة الإيصال"
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                  <FileImage className="w-12 h-12" />
                                  <span className="text-xs font-bold">ملف PDF</span>
                                </div>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setReceiptFile(null)}
                                disabled={submitting}
                                className="absolute top-2 left-2 w-8 h-8 rounded-full bg-background/90 backdrop-blur border border-border shadow-md hover:bg-destructive hover:text-destructive-foreground transition flex items-center justify-center disabled:opacity-50"
                                aria-label="إزالة"
                              >
                                <X className="w-4 h-4" />
                              </motion.button>
                              <Badge className="absolute bottom-2 right-2 bg-emerald-500 hover:bg-emerald-500 text-white gap-1 text-[10px] font-bold shadow-md">
                                <FileCheck2 className="w-3 h-3" /> جاهز
                              </Badge>
                            </div>

                            {/* file meta */}
                            <div className="p-3 flex items-center gap-3 bg-card">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                <FileImage className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-black truncate">{receiptFile.name}</div>
                                <div className="text-[10px] text-muted-foreground">
                                  {(receiptFile.size / 1024).toFixed(0)} KB
                                </div>
                              </div>
                              <label className="shrink-0 cursor-pointer text-[10px] font-bold text-primary hover:bg-primary/10 px-2.5 py-1.5 rounded-md transition border border-primary/30">
                                تغيير
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  hidden
                                  onChange={(e) => handleFile(e.target.files?.[0])}
                                />
                              </label>
                            </div>

                            {/* upload progress (shown while submitting) */}
                            <AnimatePresence>
                              {uploadStage !== 'idle' && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="border-t bg-muted/20 px-3 py-2.5"
                                >
                                  <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                                    <span className="flex items-center gap-1.5 text-foreground">
                                      {uploadStage === 'done' ? (
                                        <>
                                          <Check className="w-3 h-3 text-emerald-500" />
                                          تم استلام طلبك بنجاح
                                        </>
                                      ) : uploadStage === 'saving' ? (
                                        <>
                                          <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                          جارٍ حفظ الطلب وإشعار فريق المراجعة...
                                        </>
                                      ) : (
                                        <>
                                          <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                          رفع الإيصال...
                                        </>
                                      )}
                                    </span>
                                    <span className="tabular-nums text-primary">
                                      {uploadStage === 'done' ? 100 : uploadPct}%
                                    </span>
                                  </div>
                                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                      animate={{ width: `${uploadStage === 'done' ? 100 : uploadPct}%` }}
                                      transition={{ duration: 0.3 }}
                                      className={cn(
                                        'h-full rounded-full bg-gradient-to-l',
                                        uploadStage === 'done'
                                          ? 'from-emerald-500 to-emerald-400'
                                          : 'from-primary to-primary/70',
                                      )}
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* extra fields */}
                      <div className="grid sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <Label className="text-[11px] font-bold flex items-center gap-1">
                            <Hash className="w-3 h-3 text-primary" /> رقم العملية
                            <span className="text-muted-foreground font-normal">(اختياري)</span>
                          </Label>
                          <Input
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                            placeholder="مثال: REF-1029384"
                            className="mt-1 h-10 font-mono"
                          />
                        </div>
                        <div>
                          <Label className="text-[11px] font-bold flex items-center gap-1">
                            <Info className="w-3 h-3 text-primary" /> ملاحظات
                            <span className="text-muted-foreground font-normal">(اختياري)</span>
                          </Label>
                          <Input
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="أي تفاصيل إضافية..."
                            className="mt-1 h-10"
                          />
                        </div>
                      </div>

                      {/* security note */}
                      <div className="flex items-start gap-2 text-[10px] text-muted-foreground bg-primary/5 border border-primary/15 rounded-xl p-2.5">
                        <Shield className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                        <span>
                          إيصالك مرفوع في تخزين خاص ومُشفّر • يصل الأدمن إشعار فوري بالطلب • سيُضاف الرصيد كاملاً مع البونص فور الموافقة.
                        </span>
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

                  {/* === ملخص الطلب قبل الإرسال === */}
                  {amount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/5 via-card to-card p-3.5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                            <Receipt className="w-3.5 h-3.5 text-primary" />
                          </div>
                          <span className="text-xs font-black text-foreground">ملخص الطلب</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold gap-1 border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/10">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          قبل الإشعار للمراجعة
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {/* المبلغ */}
                        <div className="rounded-xl bg-muted/40 border border-border/60 px-2.5 py-2">
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold mb-1">
                            <Banknote className="w-3 h-3" />
                            المبلغ
                          </div>
                          <div className="text-[13px] font-black text-foreground tabular-nums truncate">
                            {amount.toLocaleString('ar-SA')} ر.س
                          </div>
                        </div>

                        {/* طريقة الدفع */}
                        <div className="rounded-xl bg-muted/40 border border-border/60 px-2.5 py-2">
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold mb-1">
                            {method === 'instant' ? <Zap className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                            طريقة الدفع
                          </div>
                          <div className="text-[12px] font-black text-foreground truncate">
                            {method === 'instant' ? 'بطاقة فورية' : 'تحويل بنكي'}
                          </div>
                        </div>

                        {/* رقم الطلب */}
                        <div className="rounded-xl bg-muted/40 border border-border/60 px-2.5 py-2">
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold mb-1">
                            <Hash className="w-3 h-3" />
                            رقم الطلب
                          </div>
                          <div dir="ltr" className="text-[11px] font-mono font-black text-foreground truncate text-right">
                            {orderRef}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground bg-muted/30 rounded-lg px-2.5 py-1.5">
                        <Info className="w-3 h-3 mt-0.5 shrink-0 text-primary" />
                        <span>راجع التفاصيل أعلاه قبل الإرسال — سيتم إشعار فريق المراجعة فور التأكيد.</span>
                      </div>
                    </motion.div>
                  )}

                  {/* نموذج الدفع الفوري بالبطاقة (مضمّن داخل الصفحة) */}
                  <AnimatePresence>
                    {method === 'instant' && showCardForm && amount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-2xl border border-primary/20 bg-card p-4"
                      >
                        <MoyasarCardForm
                          purpose="wallet_topup"
                          amount={amount}
                          note="شحن المحفظة بالبطاقة"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action button */}
                  <motion.div
                    whileHover={amount > 0 && !submitting ? { scale: 1.01 } : {}}
                    whileTap={amount > 0 && !submitting ? { scale: 0.99 } : {}}
                    className={cn(method === 'instant' && showCardForm && 'hidden')}
                  >
                    <Button
                      onClick={method === 'instant' ? payInstant : submitManual}
                      disabled={!amount || amount <= 0 || submitting || (method === 'manual' && !receiptFile)}
                      aria-busy={submitting}
                      aria-disabled={submitting}
                      className={cn(
                        'w-full h-13 sm:h-14 font-black text-sm sm:text-base gap-2 shadow-lg shadow-primary/20 bg-gradient-to-l from-primary to-primary/85 hover:opacity-95 transition-all',
                        submitting && 'cursor-not-allowed opacity-90',
                      )}
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                          />
                          <span className="truncate">
                            {method === 'manual'
                              ? uploadStage === 'uploading'
                                ? `جارٍ رفع الإيصال... ${uploadPct}%`
                                : uploadStage === 'saving'
                                  ? 'جارٍ حفظ الطلب وإشعار فريق المراجعة...'
                                  : uploadStage === 'done'
                                    ? 'تم الإرسال بنجاح ✓'
                                    : 'جارٍ التجهيز...'
                              : 'جارٍ تحويلك إلى بوابة الدفع...'}
                          </span>
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
                          إرسال الطلب للمراجعة
                          <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    {/* Live waiting indicator under the button */}
                    <AnimatePresence>
                      {submitting && method === 'manual' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                          aria-live="polite"
                          role="status"
                        >
                          <div className="mt-2 rounded-xl border border-primary/25 bg-primary/5 p-3 space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="flex items-center gap-1.5 text-foreground">
                                <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                {uploadStage === 'uploading'
                                  ? 'يتم رفع الإيصال إلى الخادم'
                                  : uploadStage === 'saving'
                                    ? 'يتم حفظ الطلب وإرسال إشعار للمراجعة'
                                    : 'تجهيز الطلب...'}
                              </span>
                              <span className="tabular-nums text-primary">
                                {uploadStage === 'uploading' ? `${uploadPct}%` : ''}
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div
                                animate={{
                                  width:
                                    uploadStage === 'uploading'
                                      ? `${uploadPct}%`
                                      : uploadStage === 'saving'
                                        ? '95%'
                                        : '100%',
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-full bg-gradient-to-l from-primary to-primary/70"
                              />
                            </div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              يرجى عدم إغلاق الصفحة حتى اكتمال الإرسال — الزر معطّل لمنع التكرار.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

      {/* === Centered Success Modal (5s auto-dismiss) === */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            key="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-emerald-500/30 bg-card shadow-2xl"
              dir="rtl"
            >
              {/* Animated gradient header */}
              <div className="relative h-32 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 overflow-hidden">
                {/* Floating orbs */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: -120, opacity: [0, 1, 0] }}
                    transition={{ duration: 2.5, delay: i * 0.25, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute w-2.5 h-2.5 rounded-full bg-white/40"
                    style={{ left: `${10 + i * 15}%` }}
                  />
                ))}
                {/* Shimmer */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                />

                {/* Check circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
                    className="relative w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-emerald-400/40"
                    />
                    <motion.svg
                      viewBox="0 0 24 24"
                      className="w-10 h-10 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <motion.path
                        d="M5 13l4 4L19 7"
                        className="text-emerald-600"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                      />
                    </motion.svg>
                  </motion.div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 text-center space-y-3">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl font-black text-foreground"
                >
                  تم إرسال طلب الشحن بنجاح
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-muted-foreground leading-relaxed"
                >
                  طلبك قيد المراجعة من فريق الإدارة، وسيتم إضافة الرصيد إلى محفظتك فور الاعتماد.
                </motion.p>

                {bonus.pct > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring', stiffness: 220 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm font-bold"
                  >
                    <Gift className="w-4 h-4" />
                    🎁 سيُضاف بونص {bonus.pct}% عند الموافقة
                  </motion.div>
                )}

                {/* Amount badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-2 pt-2"
                >
                  <Badge variant="secondary" className="font-black text-base px-3 py-1 tabular-nums">
                    {amount.toLocaleString('ar-SA')} ر.س
                  </Badge>
                </motion.div>

                {/* 5s progress bar */}
                <div className="pt-3">
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      className="h-full bg-gradient-to-l from-emerald-500 to-teal-500"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    سيتم تحويلك إلى المحفظة خلال لحظات...
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ClientLayout>
  );
};

export default WalletTopup;
