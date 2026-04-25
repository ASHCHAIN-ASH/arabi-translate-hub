import { useState, useMemo, useEffect, useCallback } from 'react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, Copy, Check, Share2, Users, TrendingUp, Wallet,
  Sparkles, MessageCircle, Mail, Send, Award, Clock, CheckCircle2,
  QrCode, Trophy, Target, Zap, Flame, Crown, ArrowUpRight, Link2,
  BarChart3, Calendar, Star, Rocket, ShieldCheck, Banknote, XCircle,
} from 'lucide-react';
import { useMyReferralCode, useMyReferrals } from '@/hooks/useReferrals';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import WithdrawDialog from '@/components/referrals/WithdrawDialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WithdrawalRow {
  id: string;
  amount: number;
  bank_name: string;
  iban: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  admin_notes: string | null;
  created_at: string;
  paid_at: string | null;
}

interface WalletTxRow {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  reference_type: string | null;
  balance_after: number | null;
  created_at: string;
}

// === Tier system based on referrals ===
const TIERS = [
  { name: 'مبتدئ', min: 0, max: 5, color: 'from-slate-500 to-slate-600', icon: Star, perk: 'عمولة أساسية 10%' },
  { name: 'نشط', min: 5, max: 15, color: 'from-blue-500 to-cyan-500', icon: Zap, perk: 'عمولة 12% + شارة نشط' },
  { name: 'محترف', min: 15, max: 30, color: 'from-purple-500 to-pink-500', icon: Trophy, perk: 'عمولة 15% + بادج VIP' },
  { name: 'سفير', min: 30, max: Infinity, color: 'from-amber-500 to-orange-500', icon: Crown, perk: 'عمولة 20% + مكافآت حصرية' },
];

function getTier(count: number) {
  return TIERS.find(t => count >= t.min && count < t.max) || TIERS[0];
}

function getNextTier(count: number) {
  return TIERS.find(t => t.min > count);
}

export default function ReferralsPage() {
  const { user } = useAuth();
  const { code, shareUrl, loading: codeLoading } = useMyReferralCode();
  const { referrals, stats, loading } = useMyReferrals();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [walletTxs, setWalletTxs] = useState<WalletTxRow[]>([]);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const loadWalletAndWithdrawals = useCallback(async () => {
    if (!user) return;
    const [{ data: wallet }, { data: wRows }, { data: txRows }] = await Promise.all([
      supabase.from('wallets' as any).select('balance').eq('user_id', user.id).maybeSingle(),
      supabase
        .from('withdrawal_requests' as any)
        .select('id, amount, bank_name, iban, status, admin_notes, created_at, paid_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('wallet_transactions' as any)
        .select('id, type, amount, description, reference_type, balance_after, created_at')
        .eq('user_id', user.id)
        .in('reference_type', ['referral_commission', 'withdrawal_request', 'withdrawal_refund'])
        .order('created_at', { ascending: false })
        .limit(50),
    ]);
    setWalletBalance(Number((wallet as any)?.balance || 0));
    setWithdrawals(((wRows as any) || []) as WithdrawalRow[]);
    setWalletTxs(((txRows as any) || []) as WalletTxRow[]);
  }, [user]);

  useEffect(() => { loadWalletAndWithdrawals(); }, [loadWalletAndWithdrawals]);

  // Realtime: تحديث فوري عند أي تغيير في المحفظة أو السحوبات
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('referrals-wallet-' + user.id)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'wallet_transactions', filter: `user_id=eq.${user.id}` },
        () => loadWalletAndWithdrawals())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'wallets', filter: `user_id=eq.${user.id}` },
        () => loadWalletAndWithdrawals())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'withdrawal_requests', filter: `user_id=eq.${user.id}` },
        () => loadWalletAndWithdrawals())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, loadWalletAndWithdrawals]);

  const currentTier = useMemo(() => getTier(stats.rewarded), [stats.rewarded]);
  const nextTier = useMemo(() => getNextTier(stats.rewarded), [stats.rewarded]);
  const tierProgress = useMemo(() => {
    if (!nextTier) return 100;
    const range = nextTier.min - currentTier.min;
    const current = stats.rewarded - currentTier.min;
    return Math.min(100, (current / range) * 100);
  }, [stats.rewarded, currentTier, nextTier]);

  const handleCopy = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }
      else { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
      toast.success('تم النسخ بنجاح ✓');
    } catch {
      toast.error('فشل النسخ');
    }
  };

  const shareText = encodeURIComponent(
    `🎓 انضم إلى منصة Master Edu Path للخدمات الأكاديمية واحصل على مزايا حصرية!\n\nاستخدم رمز الإحالة: ${code || ''}\n${shareUrl}`
  );

  const shareWhatsapp = () => window.open(`https://wa.me/?text=${shareText}`, '_blank');
  const shareTelegram = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`, '_blank');
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank');
  const shareEmail = () => window.location.href = `mailto:?subject=${encodeURIComponent('انضم إلى Master Edu Path')}&body=${shareText}`;
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Master Edu Path', text: decodeURIComponent(shareText), url: shareUrl });
      } catch {}
    } else {
      handleCopy(shareUrl, 'link');
    }
  };

  // QR Code URL via free service
  const qrUrl = shareUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&margin=2`
    : '';

  const Tier = currentTier.icon;

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto p-2 md:p-4 space-y-6 pb-12" dir="rtl">
        {/* === HERO: Premium Animated Banner === */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl"
        >
          {/* Animated decorative elements */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 60, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [60, 0, 60] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-amber-300/20 blur-3xl"
          />
          {/* Sparkle dots */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: `${10 + i * 11}%`, left: `${5 + (i * 13) % 90}%` }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
            />
          ))}

          <div className="relative p-6 md:p-10 grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-xs font-bold border border-white/20"
              >
                <Sparkles className="w-3.5 h-3.5" /> برنامج الإحالات الذكي
              </motion.div>

              <div>
                <h1 className="text-3xl md:text-5xl font-black leading-tight">
                  ادعُ أصدقاءك،
                  <br />
                  <span className="bg-gradient-to-l from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                    اربح بلا حدود
                  </span>
                </h1>
                <p className="text-white/80 mt-3 max-w-lg leading-relaxed">
                  شارك رمز الإحالة الخاص بك واحصل على عمولة تصل إلى <strong className="text-amber-200">20%</strong> فوراً في محفظتك عند اشتراك صديقك في أي باقة عضوية.
                </p>
              </div>

              {/* Quick metrics inline */}
              <div className="flex flex-wrap gap-4 pt-2">
                <InlineMetric value={stats.total} label="إحالة" icon={Users} />
                <InlineMetric value={stats.rewarded} label="نشطة" icon={CheckCircle2} />
                <InlineMetric
                  value={`${stats.totalEarned.toLocaleString('ar-SA')}`}
                  label="ر.س مكتسبة"
                  icon={Wallet}
                  highlight
                />
              </div>
            </div>

            {/* Tier badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden lg:block"
            >
              <div className="relative w-48 h-48">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-white/30"
                />
                <div className={cn(
                  'absolute inset-3 rounded-full bg-gradient-to-br flex flex-col items-center justify-center shadow-2xl',
                  currentTier.color
                )}>
                  <Tier className="w-10 h-10 mb-1" />
                  <p className="text-xs uppercase tracking-wider opacity-90">مستواك</p>
                  <p className="text-xl font-black">{currentTier.name}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* === Tier Progress Bar === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-2">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md', currentTier.color)}>
                    <Tier className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm flex items-center gap-2">
                      مستوى {currentTier.name}
                      <Badge variant="secondary" className="text-[10px]">{currentTier.perk}</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {nextTier
                        ? `${nextTier.min - stats.rewarded} إحالة متبقية للوصول لمستوى ${nextTier.name}`
                        : 'لقد وصلت لأعلى مستوى! 🏆'}
                    </p>
                  </div>
                </div>
                {nextTier && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold">{stats.rewarded}</span>
                    <span className="text-muted-foreground">/ {nextTier.min}</span>
                  </div>
                )}
              </div>
              <div className="relative">
                <Progress value={tierProgress} className="h-3" />
                {nextTier && (
                  <div className="absolute -top-1 left-0 right-0 flex justify-between px-1">
                    {TIERS.slice(0, 4).map((t, i) => {
                      const TIcon = t.icon;
                      return (
                        <div
                          key={i}
                          className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center -mt-0.5 transition-all',
                            stats.rewarded >= t.min
                              ? `bg-gradient-to-br ${t.color} border-white text-white shadow-md`
                              : 'bg-muted border-border'
                          )}
                          title={t.name}
                        >
                          <TIcon className="w-2.5 h-2.5" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* === Wallet Balance + Withdraw CTA === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-l from-primary/5 via-transparent to-emerald-500/5">
            <CardContent className="p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white shadow-lg shrink-0">
                  <Wallet className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">رصيد محفظتك القابل للسحب</p>
                  <p className="text-3xl font-black tracking-tight">
                    {walletBalance.toLocaleString('ar-SA')}
                    <span className="text-base text-muted-foreground font-bold ms-1">ر.س</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    العمولات تُودع تلقائياً عند تفعيل اشتراك المُحال • الحد الأدنى للسحب 100 ر.س
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => setWithdrawDialogOpen(true)}
                disabled={walletBalance < 100}
                className="gap-2 bg-gradient-to-l from-primary to-emerald-600 hover:opacity-90 shadow-md"
              >
                <Banknote className="w-5 h-5" />
                سحب الأرباح
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* === Stats Grid === */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard icon={Users} label="إجمالي الإحالات" value={stats.total} color="from-blue-500 to-indigo-500" delay={0} />
          <StatCard icon={CheckCircle2} label="إحالات مكافأة" value={stats.rewarded} color="from-emerald-500 to-teal-500" delay={0.05} />
          <StatCard icon={Clock} label="بانتظار التفعيل" value={stats.pending} color="from-amber-500 to-orange-500" delay={0.1} />
          <StatCard
            icon={Wallet}
            label="إجمالي العمولات"
            value={`${stats.totalEarned.toLocaleString('ar-SA')} ر.س`}
            color="from-pink-500 to-rose-500"
            delay={0.15}
            highlight
          />
        </div>

        {/* === Share Tools (Code + Link + QR) === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-[1fr_auto] gap-0">
                {/* Left: Code + Link + Share */}
                <div className="p-6 space-y-5">
                  <div>
                    <h3 className="font-black text-xl flex items-center gap-2 mb-1">
                      <Share2 className="w-5 h-5 text-primary" />
                      أدوات المشاركة
                    </h3>
                    <p className="text-xs text-muted-foreground">انسخ، شارك، أو استخدم QR لدعوة أصدقائك</p>
                  </div>

                  {/* Code */}
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                      رمز الإحالة
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-gradient-to-l from-primary/5 to-transparent border-2 border-primary/20 rounded-xl px-4 py-3 text-center">
                        <span className="text-2xl md:text-3xl font-black tracking-[0.4em] text-primary font-mono">
                          {codeLoading ? '...' : (code || '—')}
                        </span>
                      </div>
                      <Button
                        size="lg"
                        onClick={() => code && handleCopy(code, 'code')}
                        disabled={!code}
                        className="h-auto px-5"
                      >
                        <AnimatePresence mode="wait">
                          {copiedCode ? (
                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Check className="h-5 w-5" />
                            </motion.div>
                          ) : (
                            <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              <Copy className="h-5 w-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </div>
                  </div>

                  {/* Link */}
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                      رابط الإحالة المباشر
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          readOnly
                          value={shareUrl}
                          className="text-xs font-mono pr-10 h-12"
                          dir="ltr"
                        />
                      </div>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => shareUrl && handleCopy(shareUrl, 'link')}
                        disabled={!shareUrl}
                        className="h-12 px-5"
                      >
                        {copiedLink ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Share buttons */}
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
                      شارك على
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <ShareButton onClick={shareWhatsapp} disabled={!shareUrl} icon={MessageCircle} label="واتساب" color="bg-emerald-500 hover:bg-emerald-600" />
                      <ShareButton onClick={shareTelegram} disabled={!shareUrl} icon={Send} label="تليجرام" color="bg-sky-500 hover:bg-sky-600" />
                      <ShareButton onClick={shareTwitter} disabled={!shareUrl} icon={Share2} label="تويتر" color="bg-slate-800 hover:bg-slate-900" />
                      <ShareButton onClick={shareEmail} disabled={!shareUrl} icon={Mail} label="البريد" color="bg-rose-500 hover:bg-rose-600" />
                      <ShareButton onClick={nativeShare} disabled={!shareUrl} icon={ArrowUpRight} label="المزيد" color="bg-primary hover:bg-primary/90" />
                    </div>
                  </div>
                </div>

                {/* Right: QR Code */}
                <div className="bg-gradient-to-br from-primary/5 via-transparent to-amber-500/5 p-6 flex flex-col items-center justify-center border-t md:border-t-0 md:border-r min-w-[240px]">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider">QR للمشاركة</span>
                  </div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-3 rounded-2xl shadow-lg border-4 border-primary/10"
                  >
                    {qrUrl ? (
                      <img src={qrUrl} alt="QR Code" className="w-40 h-40" loading="lazy" />
                    ) : (
                      <div className="w-40 h-40 bg-muted animate-pulse rounded" />
                    )}
                  </motion.div>
                  <p className="text-[10px] text-muted-foreground mt-3 text-center">
                    امسح بالكاميرا
                    <br />للوصول السريع
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* === Tabs: How it works / Tiers / Referrals === */}
        <Tabs defaultValue="referrals" dir="rtl" className="space-y-4">
          <TabsList dir="rtl" className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-5 h-auto md:h-12 p-1">
            <TabsTrigger value="referrals" className="gap-1.5 text-sm flex-row-reverse">
              <Award className="h-4 w-4" /> إحالاتي
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-1.5 text-sm flex-row-reverse">
              <Wallet className="h-4 w-4" /> حركات المحفظة
              {walletTxs.length > 0 && (
                <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{walletTxs.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="gap-1.5 text-sm flex-row-reverse">
              <Banknote className="h-4 w-4" /> طلبات السحب
              {withdrawals.filter(w => w.status === 'pending').length > 0 && (
                <Badge variant="secondary" className="text-[9px] h-4 px-1.5">
                  {withdrawals.filter(w => w.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tiers" className="gap-1.5 text-sm flex-row-reverse">
              <Trophy className="h-4 w-4" /> المستويات
            </TabsTrigger>
            <TabsTrigger value="how" className="gap-1.5 text-sm flex-row-reverse">
              <Target className="h-4 w-4" /> كيف يعمل
            </TabsTrigger>
          </TabsList>

          {/* Referrals list */}
          <TabsContent value="referrals" className="mt-0">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    إحالاتي
                    <Badge variant="secondary">{referrals.length}</Badge>
                  </h3>
                  {stats.totalEarned > 0 && (
                    <Badge className="bg-emerald-500 gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +{stats.totalEarned.toLocaleString('ar-SA')} ر.س
                    </Badge>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : referrals.length === 0 ? (
                  <EmptyState shareUrl={shareUrl} onShare={shareWhatsapp} />
                ) : (
                  <div className="space-y-2">
                    {referrals.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 p-3.5 rounded-xl border bg-card hover:bg-accent/30 transition-colors"
                      >
                        <div className={cn(
                          'h-11 w-11 rounded-xl flex items-center justify-center shrink-0',
                          r.status === 'rewarded'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        )}>
                          {r.status === 'rewarded' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate text-sm">{r.referred_name || 'عضو جديد'}</div>
                          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(r.created_at).toLocaleDateString('ar-SA')}
                            {r.plan_name && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-[9px] py-0 h-4">عضوية {r.plan_name}</Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-left shrink-0">
                          <div className={cn(
                            'font-black text-base',
                            r.status === 'rewarded' ? 'text-emerald-600' : 'text-muted-foreground'
                          )}>
                            {r.status === 'rewarded' ? `+${Number(r.commission_amount).toLocaleString('ar-SA')}` : '—'}
                          </div>
                          <Badge
                            variant={r.status === 'rewarded' ? 'default' : 'secondary'}
                            className={cn('text-[9px] mt-0.5', r.status === 'rewarded' && 'bg-emerald-500')}
                          >
                            {r.status === 'rewarded' ? 'تمت المكافأة' : 'بانتظار الاشتراك'}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet transactions (commissions + withdrawals) */}
          <TabsContent value="transactions" className="mt-0">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    حركات المحفظة (عمولات وسحوبات)
                    <Badge variant="secondary">{walletTxs.length}</Badge>
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    الرصيد الحالي: <strong className="text-foreground">{walletBalance.toLocaleString('ar-SA')} ر.س</strong>
                  </div>
                </div>

                {walletTxs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-3">
                      <Wallet className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-bold mb-1">لا توجد حركات بعد</p>
                    <p className="text-sm text-muted-foreground">
                      ستظهر هنا عمولات الإحالة المُودَعة وطلبات السحب فور حدوثها
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {walletTxs.map((t, i) => {
                      const isDeposit = t.type === 'deposit';
                      const isCommission = t.reference_type === 'referral_commission';
                      const isWithdrawHold = t.reference_type === 'withdrawal_request';
                      const isRefund = t.reference_type === 'withdrawal_refund';
                      const meta = isCommission
                        ? { label: 'عمولة إحالة', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200', icon: Gift }
                        : isWithdrawHold
                        ? { label: 'طلب سحب', color: 'bg-amber-500/10 text-amber-700 border-amber-200', icon: Banknote }
                        : isRefund
                        ? { label: 'استرداد سحب', color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: ArrowUpRight }
                        : { label: t.type, color: 'bg-muted text-muted-foreground border-border', icon: Wallet };
                      const MIcon = meta.icon;
                      return (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex items-center gap-3 p-3.5 rounded-xl border bg-card hover:bg-accent/30 transition-colors"
                        >
                          <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border', meta.color)}>
                            <MIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{t.description || meta.label}</div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {new Date(t.created_at).toLocaleString('ar-SA')}
                              {t.balance_after !== null && (
                                <>
                                  <span>•</span>
                                  <span>الرصيد بعد: {Number(t.balance_after).toLocaleString('ar-SA')} ر.س</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="text-left shrink-0">
                            <div className={cn(
                              'font-black text-base',
                              isDeposit ? 'text-emerald-600' : 'text-rose-600'
                            )}>
                              {isDeposit ? '+' : '-'}{Number(t.amount).toLocaleString('ar-SA')} ر.س
                            </div>
                            <Badge variant="outline" className={cn('text-[9px] mt-0.5', meta.color)}>
                              {meta.label}
                            </Badge>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Withdrawals list */}
          <TabsContent value="withdrawals" className="mt-0">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-primary" />
                    سجل طلبات السحب
                    <Badge variant="secondary">{withdrawals.length}</Badge>
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => setWithdrawDialogOpen(true)}
                    disabled={walletBalance < 100}
                    className="gap-1.5"
                  >
                    <Banknote className="w-4 h-4" />
                    طلب سحب جديد
                  </Button>
                </div>

                {withdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-3">
                      <Banknote className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-bold mb-1">لا توجد طلبات سحب بعد</p>
                    <p className="text-sm text-muted-foreground">
                      عند توفر رصيد كافٍ يمكنك طلب سحب أرباحك إلى حسابك البنكي
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {withdrawals.map((w, i) => {
                      const statusMeta: Record<string, { label: string; color: string; icon: any }> = {
                        pending: { label: 'قيد المراجعة', color: 'bg-amber-500/10 text-amber-700 border-amber-200', icon: Clock },
                        approved: { label: 'موافق عليه', color: 'bg-blue-500/10 text-blue-700 border-blue-200', icon: CheckCircle2 },
                        paid: { label: 'تم التحويل', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
                        rejected: { label: 'مرفوض', color: 'bg-red-500/10 text-red-700 border-red-200', icon: XCircle },
                      };
                      const meta = statusMeta[w.status] || statusMeta.pending;
                      const SIcon = meta.icon;
                      return (
                        <motion.div
                          key={w.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-3 p-3.5 rounded-xl border bg-card hover:bg-accent/30 transition-colors"
                        >
                          <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border', meta.color)}>
                            <SIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm">{w.bank_name}</div>
                            <div className="text-[11px] text-muted-foreground font-mono truncate" dir="ltr">{w.iban}</div>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {new Date(w.created_at).toLocaleDateString('ar-SA')}
                            </div>
                            {w.admin_notes && (
                              <div className="text-[11px] text-red-600 mt-1">📝 {w.admin_notes}</div>
                            )}
                          </div>
                          <div className="text-left shrink-0">
                            <div className="font-black text-base">
                              {Number(w.amount).toLocaleString('ar-SA')} ر.س
                            </div>
                            <Badge variant="outline" className={cn('text-[9px] mt-0.5', meta.color)}>
                              {meta.label}
                            </Badge>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tiers */}
          <TabsContent value="tiers" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {TIERS.map((tier, i) => {
                const TIcon = tier.icon;
                const isCurrent = currentTier.name === tier.name;
                const isUnlocked = stats.rewarded >= tier.min;
                return (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className={cn(
                      'relative overflow-hidden h-full transition-all',
                      isCurrent && 'ring-2 ring-primary shadow-xl scale-[1.02]',
                      !isUnlocked && 'opacity-60'
                    )}>
                      {isCurrent && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-primary gap-1 text-[10px]">
                            <Flame className="w-3 h-3" /> مستواك
                          </Badge>
                        </div>
                      )}
                      <div className={cn('h-24 bg-gradient-to-br relative', tier.color)}>
                        <motion.div
                          animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <TIcon className="w-12 h-12 text-white drop-shadow-lg" />
                        </motion.div>
                      </div>
                      <CardContent className="p-4 space-y-2">
                        <h4 className="font-black text-lg">{tier.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {tier.max === Infinity ? `${tier.min}+ إحالة` : `${tier.min} - ${tier.max - 1} إحالة`}
                        </p>
                        <div className="pt-2 border-t">
                          <p className="text-xs flex items-start gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                            <span>{tier.perk}</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* How it works */}
          <TabsContent value="how" className="mt-0">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { num: '01', title: 'شارك رمزك', desc: 'انسخ رابط الإحالة أو رمز QR وأرسله لأصدقائك عبر أي قناة', icon: Share2, color: 'from-blue-500 to-cyan-500' },
                    { num: '02', title: 'يشترك صديقك', desc: 'صديقك يفتح الرابط ويسجل ويختار باقة عضوية مناسبة له', icon: Users, color: 'from-purple-500 to-pink-500' },
                    { num: '03', title: 'تحصل على عمولة', desc: 'فور تفعيل اشتراكه، تُودع العمولة تلقائياً في محفظتك الرقمية', icon: Wallet, color: 'from-emerald-500 to-teal-500' },
                  ].map((step, i) => (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative p-5 rounded-2xl border-2 border-dashed hover:border-primary/40 hover:bg-accent/30 transition-all"
                    >
                      <span className={cn('text-5xl font-black bg-gradient-to-br bg-clip-text text-transparent absolute top-3 left-4 opacity-30', step.color)}>
                        {step.num}
                      </span>
                      <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-md mb-3', step.color)}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-base mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-3 pt-4 border-t">
                  <FeaturePill icon={ShieldCheck} text="عمولة آمنة ومضمونة" />
                  <FeaturePill icon={Zap} text="إيداع فوري بالمحفظة" />
                  <FeaturePill icon={BarChart3} text="تتبع مباشر للإحالات" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <WithdrawDialog
        open={withdrawDialogOpen}
        onOpenChange={setWithdrawDialogOpen}
        availableBalance={walletBalance}
        onSuccess={loadWalletAndWithdrawals}
      />
    </ClientLayout>
  );
}

// === Sub-components ===
function InlineMetric({ value, label, icon: Icon, highlight }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'w-9 h-9 rounded-lg flex items-center justify-center',
        highlight ? 'bg-amber-300/20 text-amber-200' : 'bg-white/10 text-white'
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-lg font-black leading-tight">{value}</p>
        <p className="text-[10px] text-white/70 leading-tight">{label}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, delay, highlight }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
    >
      <Card className={cn('overflow-hidden relative', highlight && 'ring-2 ring-primary/30')}>
        <div className={cn('absolute -top-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-br opacity-10 blur-2xl', color)} />
        <CardContent className="p-4 relative">
          <div className={cn('h-9 w-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white mb-2 shadow-md', color)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="text-xl md:text-2xl font-black">{value}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ShareButton({ onClick, disabled, icon: Icon, label, color }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
        color
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}

function FeaturePill({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40">
      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function EmptyState({ shareUrl, onShare }: { shareUrl: string; onShare: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-10"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-amber-500/20 mb-4"
      >
        <Rocket className="h-10 w-10 text-primary" />
      </motion.div>
      <h4 className="font-black text-lg mb-1">ابدأ رحلتك الآن!</h4>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
        لا توجد إحالات بعد. شارك رمزك مع أصدقائك واربح عمولة على كل اشتراك جديد.
      </p>
      <Button onClick={onShare} disabled={!shareUrl} className="gap-2">
        <MessageCircle className="w-4 h-4" />
        شارك الآن عبر واتساب
      </Button>
    </motion.div>
  );
}
