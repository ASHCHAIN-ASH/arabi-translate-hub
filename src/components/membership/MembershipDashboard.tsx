import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MembershipBadge } from '@/components/membership/MembershipBadge';
import { Link } from 'react-router-dom';
import {
  Wallet, Gift, TrendingUp, Users, Calendar, Sparkles, ArrowUpRight,
  ShoppingBag, BadgeCheck, Activity, Crown, Zap, ArrowLeft,
} from 'lucide-react';
import type { UserMembership } from '@/hooks/useMembership';
import type { MembershipStats } from '@/hooks/useMembershipStats';

interface Props {
  membership: UserMembership | null;
  stats: MembershipStats;
  loading: boolean;
}

const fmtSAR = (n: number) =>
  new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 }).format(n || 0);

export default function MembershipDashboard({ membership, stats, loading }: Props) {
  const planCode = membership?.plan?.code;
  const isActive = !!membership;

  const benefitCards = [
    {
      key: 'wallet',
      icon: Wallet,
      label: 'رصيد المحفظة',
      value: `${fmtSAR(stats.walletBalance)} ر.س`,
      hint: 'متاح للسحب والإنفاق',
      gradient: 'from-blue-500/15 to-cyan-500/5',
      iconBg: 'bg-blue-500',
      action: { label: 'إدارة المحفظة', to: '/wallet' },
      live: true,
    },
    {
      key: 'cashback',
      icon: Gift,
      label: 'إجمالي الكاش باك',
      value: `${fmtSAR(stats.totalCashback)} ر.س`,
      hint: 'مكافآت العضوية المُضافة',
      gradient: 'from-emerald-500/15 to-teal-500/5',
      iconBg: 'bg-emerald-500',
      live: true,
    },
    {
      key: 'savings',
      icon: TrendingUp,
      label: 'إجمالي وفّرت',
      value: `${fmtSAR(stats.totalSavings)} ر.س`,
      hint: `من خصم ${membership?.plan?.discount_percentage || 0}% على ${stats.ordersCount} طلب`,
      gradient: 'from-amber-500/15 to-orange-500/5',
      iconBg: 'bg-amber-500',
      live: true,
    },
    {
      key: 'referrals',
      icon: Users,
      label: 'عمولات الإحالة',
      value: `${fmtSAR(stats.totalReferralEarnings)} ر.س`,
      hint: `${stats.rewardedReferralsCount} مكافأة من ${stats.referralsCount} إحالة`,
      gradient: 'from-violet-500/15 to-purple-500/5',
      iconBg: 'bg-violet-500',
      action: { label: 'برنامج الإحالة', to: '/referrals' },
      live: true,
    },
  ];

  if (!isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-amber-500/5 p-8 text-center"
      >
        <Crown className="w-12 h-12 mx-auto text-primary/60 mb-3" />
        <h3 className="text-xl font-bold mb-1">لم تشترك في أي عضوية بعد</h3>
        <p className="text-sm text-muted-foreground mb-4">
          اختر باقتك الآن وابدأ بالتوفير على كل طلب
        </p>
        <a href="#plans" className="inline-flex items-center gap-2 text-primary font-bold text-sm">
          استعرض الباقات
          <ArrowLeft className="w-4 h-4" />
        </a>
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* === Hero status card === */}
      <Card className="relative overflow-hidden border-primary/30">
        <div className="absolute inset-0 bg-gradient-to-l from-primary/15 via-amber-500/10 to-transparent" />
        <motion.div
          aria-hidden
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
        />
        <CardContent className="relative p-5 md:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Right: identity */}
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <MembershipBadge
                  code={planCode}
                  nameAr={membership?.plan?.name_ar}
                  size="lg"
                />
              </motion.div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    نشطة الآن
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Activity className="w-3 h-3" />
                    لحظي
                  </Badge>
                </div>
                <h2 className="text-lg md:text-xl font-black">
                  عضوية {membership?.plan?.name_ar}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {stats.daysRemaining !== null
                    ? `متبقي ${stats.daysRemaining} يوم`
                    : 'بدون انتهاء'}
                  {membership?.expires_at && (
                    <span className="text-muted-foreground/70">
                      · حتى {new Date(membership.expires_at).toLocaleDateString('ar-SA')}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Left: KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-5">
              <div className="text-center px-3">
                <p className="text-2xl md:text-3xl font-black text-primary leading-none">
                  {membership?.plan?.discount_percentage || 0}%
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">خصم تلقائي</p>
              </div>
              <div className="text-center px-3 border-x">
                <p className="text-2xl md:text-3xl font-black text-emerald-600 leading-none">
                  {fmtSAR(stats.totalSavings)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">وفّرت ر.س</p>
              </div>
              <div className="text-center px-3 col-span-2 sm:col-span-1">
                <p className="text-2xl md:text-3xl font-black text-amber-600 leading-none">
                  {stats.ordersCount}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">طلب مستفيد</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {stats.daysRemaining !== null && (
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>تقدّم العضوية</span>
                <span>{stats.membershipProgress}%</span>
              </div>
              <Progress value={stats.membershipProgress} className="h-1.5" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* === Live benefit cards grid === */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            مزاياك الفعلية
            <Badge variant="secondary" className="text-[10px] gap-1 font-normal">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              تحديث لحظي
            </Badge>
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {benefitCards.map((b, i) => {
            const Inner = (
              <Card
                key={b.key}
                className={`relative overflow-hidden h-full bg-gradient-to-br ${b.gradient} border hover:shadow-lg transition-all group cursor-default`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl ${b.iconBg} flex items-center justify-center shadow-sm`}
                    >
                      <b.icon className="w-5 h-5 text-white" />
                    </div>
                    {b.live && (
                      <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{b.label}</p>
                    <motion.p
                      key={b.value}
                      initial={{ scale: 0.9, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="text-xl md:text-2xl font-black mt-0.5"
                    >
                      {loading ? '—' : b.value}
                    </motion.p>
                    <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                      {b.hint}
                    </p>
                  </div>
                  {b.action && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-primary group-hover:gap-2 transition-all">
                      {b.action.label}
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            );

            return (
              <motion.div
                key={b.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -3 }}
              >
                {b.action ? (
                  <Link to={b.action.to} className="block h-full">
                    {Inner}
                  </Link>
                ) : (
                  Inner
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* === Quick actions strip === */}
      <Card className="bg-muted/30">
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            مزاياك تُطبَّق تلقائياً على كل طلب جديد
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <Link to="/orders/new">
                <ShoppingBag className="w-3.5 h-3.5 ml-1" />
                طلب جديد
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <Link to="/wallet">
                <Wallet className="w-3.5 h-3.5 ml-1" />
                المحفظة
              </Link>
            </Button>
            <Button asChild size="sm" className="h-8 text-xs">
              <Link to="/referrals">
                <Users className="w-3.5 h-3.5 ml-1" />
                ادعُ صديقًا واربح
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
