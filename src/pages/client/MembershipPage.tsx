import { useState } from 'react';
import ClientLayout from '@/components/client/ClientLayout';
import { useMembershipPlans, useUserMembership, MembershipPlan } from '@/hooks/useMembership';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MembershipBadge } from '@/components/membership/MembershipBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from 'react-router-dom';
import { ReferralService } from '@/utils/referralService';
import MembershipDashboard from '@/components/membership/MembershipDashboard';
import { useMembershipStats } from '@/hooks/useMembershipStats';
import {
  Crown, Check, Wallet, Receipt, Sparkles, Calendar, TrendingUp, Zap, Shield,
  Gift, HeadphonesIcon, Star, Award, ArrowLeft, Info, HelpCircle, Rocket,
  Clock, Users, BadgeCheck, Flame, Diamond, ArrowRight, CheckCircle2, Quote,
} from 'lucide-react';
import { supabase } from '@/data/legacy/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// === Visual identity per tier — bold, distinctive, banking-luxury ===
const TIER_VISUALS: Record<string, {
  icon: any;
  headerBg: string;
  iconBox: string;
  accent: string;
  ring: string;
  badge: string;
  borderTop: string;
  tagline: string;
  bestFor: string;
}> = {
  silver: {
    icon: Sparkles,
    headerBg: 'bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800',
    iconBox: 'bg-white/15 backdrop-blur ring-1 ring-white/20',
    accent: 'text-slate-700 dark:text-slate-300',
    ring: 'ring-slate-400',
    badge: 'bg-slate-600',
    borderTop: 'from-slate-400 via-slate-500 to-slate-600',
    tagline: 'البداية المثالية',
    bestFor: 'للطلاب والمبتدئين الذين يريدون تجربة المزايا',
  },
  gold: {
    icon: Crown,
    headerBg: 'bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600',
    iconBox: 'bg-white/20 backdrop-blur ring-1 ring-white/30',
    accent: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-500',
    badge: 'bg-gradient-to-r from-amber-500 to-orange-500',
    borderTop: 'from-amber-400 via-yellow-400 to-amber-500',
    tagline: 'الخيار الأذكى والأكثر توفيراً',
    bestFor: 'للأعضاء النشطين الذين يطلبون خدمات بانتظام',
  },
  platinum: {
    icon: Diamond,
    headerBg: 'bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900',
    iconBox: 'bg-white/15 backdrop-blur ring-1 ring-white/20',
    accent: 'text-indigo-700 dark:text-indigo-300',
    ring: 'ring-indigo-500',
    badge: 'bg-gradient-to-r from-indigo-600 to-purple-600',
    borderTop: 'from-indigo-500 via-purple-500 to-indigo-600',
    tagline: 'التجربة الفاخرة الكاملة',
    bestFor: 'للمحترفين والباحثين الذين يريدون أقصى المزايا',
  },
};

// === Detailed feature explanations (tooltips) ===
const FEATURE_EXPLANATIONS: { match: (t: string) => boolean; title: string; explain: string; icon: any; color: string }[] = [
  { match: (t) => t.includes('خصم'), title: 'خصم تلقائي دائم', explain: 'يُطبَّق على كل فاتورة جديدة تلقائياً دون الحاجة لكود — ترى الخصم مباشرة عند الدفع.', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
  { match: (t) => t.includes('كاش'), title: 'كاش باك فوري', explain: 'مبلغ نقدي يُضاف إلى محفظتك عند تفعيل العضوية، يمكنك صرفه على أي خدمة أو فاتورة.', icon: Gift, color: 'text-emerald-600 bg-emerald-50' },
  { match: (t) => t.includes('أولوية'), title: 'أولوية في التنفيذ', explain: 'طلباتك تُعالج قبل الطلبات العادية مع تخصيص أسرع للفريق المختص.', icon: Rocket, color: 'text-orange-600 bg-orange-50' },
  { match: (t) => t.includes('شارة'), title: 'شارة عضوية مميزة', explain: 'تظهر بجانب اسمك في كل مكان داخل المنصة لتعكس مستوى عضويتك.', icon: BadgeCheck, color: 'text-purple-600 bg-purple-50' },
  { match: (t) => t.includes('VIP') || t.includes('vip'), title: 'مزايا VIP الحصرية', explain: 'وصول لخدمات مخصصة لكبار الأعضاء مثل الاستشارات الشخصية والمحتوى المغلق.', icon: Crown, color: 'text-amber-600 bg-amber-50' },
  { match: (t) => t.includes('مدير') || t.includes('حساب'), title: 'مدير حساب مخصص', explain: 'شخص واحد محدد يتولى متابعة طلباتك واستفساراتك بشكل شخصي ومستمر.', icon: Users, color: 'text-indigo-600 bg-indigo-50' },
  { match: (t) => t.includes('دعم'), title: 'دعم فني متقدم', explain: 'استجابة أسرع وقنوات تواصل إضافية مع فريق الدعم على مدار الساعة.', icon: HeadphonesIcon, color: 'text-teal-600 bg-teal-50' },
];

function getFeatureMeta(text: string) {
  const found = FEATURE_EXPLANATIONS.find((f) => f.match(text));
  return found ?? { title: 'ميزة عضوية', explain: 'ميزة حصرية ضمن باقتك.', icon: Check, color: 'text-emerald-600 bg-emerald-50' };
}

const FAQS = [
  {
    q: 'كيف يعمل الخصم التلقائي؟',
    a: 'بمجرد تفعيل عضويتك، يُطبَّق الخصم تلقائياً على جميع الطلبات والفواتير الجديدة دون الحاجة لإدخال أي كود. الخصم يظهر في صفحة الدفع مباشرة.',
  },
  {
    q: 'متى يُضاف الكاش باك إلى محفظتي؟',
    a: 'يُضاف مبلغ الكاش باك دفعة واحدة فور تفعيل العضوية من قِبل الإدارة. يمكنك استخدامه لاحقاً لدفع أي فاتورة أو خدمة.',
  },
  {
    q: 'ما الفرق بين الدفع بالمحفظة والفاتورة؟',
    a: 'المحفظة تخصم المبلغ فوراً وتُفعّل عضويتك خلال ساعات. الفاتورة تتطلب تحويلاً بنكياً ثم مراجعة من الإدارة قبل التفعيل.',
  },
  {
    q: 'هل يمكنني الترقية لباقة أعلى لاحقاً؟',
    a: 'نعم، يمكنك التواصل مع الدعم الفني لترقية باقتك في أي وقت مع احتساب الفرق فقط.',
  },
  {
    q: 'ماذا يحدث عند انتهاء العضوية؟',
    a: 'سنُرسل لك تنبيهات قبل الانتهاء بـ 30 و 7 و 1 يوم. بعد الانتهاء يمكنك التجديد بسهولة من نفس الصفحة.',
  },
];

export default function MembershipPage() {
  const { user } = useAuth();
  const { plans, loading } = useMembershipPlans();
  const { membership, reload } = useUserMembership();
  const { stats, loading: statsLoading } = useMembershipStats();
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'invoice'>('wallet');
  const [submitting, setSubmitting] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!selectedPlan || !user) return;
    setSubmitting(true);
    try {
      if (paymentMethod === 'wallet') {
        const { data: wallet } = await supabase.from('wallets').select('balance').eq('user_id', user.id).maybeSingle();
        if (!wallet || Number(wallet.balance) < selectedPlan.price) {
          toast.error('رصيد المحفظة غير كافٍ. يرجى شحن المحفظة أو اختيار الدفع بالفاتورة');
          setSubmitting(false);
          return;
        }
      }
      // Resolve pending referral code (captured during ?ref= signup)
      const pendingCode = ReferralService.readPendingCode();
      let referredBy: string | null = null;
      if (pendingCode) {
        const r = await ReferralService.resolveReferrer(pendingCode);
        if (r && r.user_id !== user.id) referredBy = r.user_id;
      }

      const { error } = await supabase.from('user_memberships' as any).insert({
        user_id: user.id,
        plan_id: selectedPlan.id,
        status: 'pending',
        payment_method: paymentMethod,
        amount_paid: 0,
        referred_by: referredBy,
        referral_code_used: pendingCode || null,
      } as any);
      if (error) throw error;
      if (referredBy) ReferralService.clearPendingCode();
      toast.success('تم إرسال طلب الاشتراك بنجاح. ستصلك إشعارات عند المراجعة.');
      setSelectedPlan(null);
      reload();
    } catch (e: any) {
      toast.error(e.message || 'حدث خطأ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto p-2 md:p-4 space-y-8 pb-12" dir="rtl">
        {/* === Hero with animated background === */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 md:p-10"
        >
          {/* Animated decorative blobs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl"
          />

          <div className="relative text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg"
            >
              <Crown className="w-4 h-4" />
              <span>عضويات FekrahEdu</span>
              <Sparkles className="w-4 h-4" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-black bg-gradient-to-l from-primary via-primary to-amber-500 bg-clip-text text-transparent"
            >
              ارتقِ بتجربتك الأكاديمية
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
            >
              اختر باقة العضوية المناسبة لك واستمتع بخصومات حصرية، كاش باك مباشر، وأولوية في تنفيذ طلباتك
            </motion.p>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3 md:gap-6 pt-4"
            >
              {[
                { icon: Zap, label: 'خصم فوري', value: 'حتى 40%' },
                { icon: Gift, label: 'كاش باك', value: 'حتى 1500 ر.س' },
                { icon: Shield, label: 'ضمان الجودة', value: '100%' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-3 px-4 py-2 bg-card/80 backdrop-blur border rounded-full shadow-sm"
                >
                  <stat.icon className="w-4 h-4 text-primary" />
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground leading-none">{stat.label}</p>
                    <p className="text-sm font-bold leading-tight">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* === Live Membership Dashboard (real benefits, realtime data) === */}
        <MembershipDashboard
          membership={membership}
          stats={stats}
          loading={statsLoading}
        />

        {/* === How it works (3 steps) === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black flex items-center justify-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              كيف يعمل النظام؟
            </h2>
            <p className="text-sm text-muted-foreground">3 خطوات بسيطة للاستفادة من عضويتك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Crown, title: 'اختر باقتك', desc: 'تصفّح الباقات الثلاث واختر ما يناسب احتياجاتك السنوية', color: 'from-blue-500 to-cyan-500' },
              { icon: Wallet, title: 'ادفع بسهولة', desc: 'استخدم محفظتك الرقمية أو اطلب فاتورة بنكية', color: 'from-amber-500 to-orange-500' },
              { icon: Rocket, title: 'استمتع بالمزايا', desc: 'خصومات تلقائية وكاش باك فوري على محفظتك', color: 'from-emerald-500 to-teal-500' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
              >
                <Card className="relative overflow-hidden h-full group">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${step.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                  <CardContent className="relative p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <step.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-4xl font-black text-muted-foreground/20">0{i + 1}</span>
                    </div>
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* === Plans Grid (the star) === */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-black">اختر باقتك المثالية</h2>
            <p className="text-sm text-muted-foreground">جميع الباقات اشتراك سنوي • يمكنك الترقية في أي وقت</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6 pt-4">
            {plans.map((plan, idx) => {
              const visual = TIER_VISUALS[plan.code] || TIER_VISUALS.silver;
              const Icon = visual.icon;
              const isPopular = plan.code === 'gold';
              const isCurrent = membership?.plan_id === plan.id;
              const isHovered = hoveredPlan === plan.id;
              const isPlatinum = plan.code === 'platinum';

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, type: 'spring', stiffness: 80 }}
                  onHoverStart={() => setHoveredPlan(plan.id)}
                  onHoverEnd={() => setHoveredPlan(null)}
                  whileHover={{ y: -8 }}
                  className={isPopular ? 'md:-mt-4 md:mb-4' : ''}
                >
                  <Card className={`
                    relative overflow-hidden h-full transition-all duration-500 bg-card
                    shadow-lg hover:shadow-2xl
                    ${isPopular ? `ring-2 ${visual.ring} scale-100 md:scale-[1.03]` : 'ring-1 ring-border'}
                    ${isHovered ? 'ring-2 ring-primary/60' : ''}
                  `}>
                    {/* Decorative top stripe */}
                    <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-l ${visual.borderTop} z-20`} />

                    {/* Popular badge */}
                    {isPopular && (
                      <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-1.5 left-1/2 -translate-x-1/2 z-20"
                      >
                        <div className={`${visual.badge} text-white text-xs font-bold px-4 py-1.5 rounded-b-xl shadow-xl flex items-center gap-1.5`}>
                          <Flame className="w-3 h-3" />
                          الأكثر شعبية
                          <Sparkles className="w-3 h-3" />
                        </div>
                      </motion.div>
                    )}

                    {/* Current badge */}
                    {isCurrent && (
                      <div className="absolute top-3 right-3 z-20">
                        <Badge className="bg-emerald-500 text-white shadow-md">
                          <BadgeCheck className="w-3 h-3 ml-1" />
                          باقتك الحالية
                        </Badge>
                      </div>
                    )}

                    {/* Colored Header — high contrast, always white text */}
                    <div className={`relative ${visual.headerBg} text-white p-6 pt-8 overflow-hidden`}>
                      {/* Decorative blobs */}
                      <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />

                      <div className="relative">
                        {/* Animated icon */}
                        <motion.div
                          animate={isHovered ? { rotate: [0, -10, 10, 0], scale: 1.1 } : { rotate: 0, scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className="mb-4"
                        >
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${visual.iconBox} shadow-lg`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                        </motion.div>

                        <h3 className="text-2xl font-black mb-1 text-white drop-shadow">{plan.name_ar}</h3>
                        <p className="text-xs text-white/70 mb-2">{plan.name_en}</p>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 backdrop-blur rounded-full text-[11px] font-semibold ring-1 ring-white/20">
                          <Star className="w-3 h-3" />
                          {visual.tagline}
                        </div>

                        {/* Price */}
                        <div className="mt-5 flex items-baseline gap-1.5">
                          <motion.span
                            key={plan.id}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1 + 0.3, type: 'spring' }}
                            className="text-5xl font-black text-white drop-shadow-lg"
                          >
                            {plan.price.toLocaleString()}
                          </motion.span>
                          <span className="text-sm text-white/90">ر.س</span>
                          <span className="text-xs text-white/60">/ سنة</span>
                        </div>
                        <p className="text-[11px] mt-1 text-white/70">
                          ≈ {Math.round(plan.price / 12).toLocaleString()} ر.س / شهر
                        </p>
                      </div>
                    </div>

                    <CardContent className="p-5 space-y-4">
                      {/* "Best for" hint */}
                      <div className="flex items-start gap-2 p-2.5 bg-muted/40 rounded-lg border-r-2 border-primary/40">
                        <Info className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          <span className="font-bold text-foreground">مناسبة:</span> {visual.bestFor}
                        </p>
                      </div>

                      {/* Discount + Cashback highlights with tooltips */}
                      <TooltipProvider delayDuration={150}>
                        <div className="grid grid-cols-2 gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                whileHover={{ scale: 1.04, y: -2 }}
                                className="relative p-3 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl text-center overflow-hidden cursor-help"
                              >
                                <TrendingUp className="absolute -top-2 -right-2 w-12 h-12 text-primary/10" />
                                <p className="text-2xl font-black text-primary relative">{plan.discount_percentage}%</p>
                                <p className="text-[10px] text-muted-foreground relative font-semibold">خصم دائم</p>
                                <HelpCircle className="absolute top-1 left-1 w-3 h-3 text-primary/40" />
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[220px] text-right">
                              يُطبَّق هذا الخصم تلقائياً على <strong>كل فاتورة</strong> طوال فترة عضويتك دون الحاجة لكود.
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                whileHover={{ scale: 1.04, y: -2 }}
                                className="relative p-3 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl text-center overflow-hidden cursor-help"
                              >
                                <Gift className="absolute -top-2 -right-2 w-12 h-12 text-emerald-500/10" />
                                <p className="text-2xl font-black text-emerald-600 relative">{plan.cashback_amount}</p>
                                <p className="text-[10px] text-muted-foreground relative font-semibold">كاش باك فوري</p>
                                <HelpCircle className="absolute top-1 left-1 w-3 h-3 text-emerald-500/40" />
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[220px] text-right">
                              مبلغ نقدي يُضاف إلى محفظتك <strong>فور تفعيل العضوية</strong> ويمكنك صرفه على أي خدمة.
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Benefits with rich tooltips */}
                        <div className="pt-1">
                          <p className="text-[11px] font-bold text-muted-foreground mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ما الذي ستحصل عليه:
                          </p>
                          <ul className="space-y-2">
                            {plan.benefits.map((b, i) => {
                              const meta = getFeatureMeta(b);
                              const FIcon = meta.icon;
                              return (
                                <Tooltip key={i}>
                                  <TooltipTrigger asChild>
                                    <motion.li
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.1 + i * 0.05 + 0.4 }}
                                      className="flex items-start gap-2.5 text-sm group cursor-help p-1.5 rounded-md hover:bg-muted/50 transition-colors"
                                    >
                                      <div className={`w-7 h-7 rounded-lg ${meta.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                        <FIcon className="w-3.5 h-3.5" />
                                      </div>
                                      <span className="leading-relaxed flex-1">{b}</span>
                                      <HelpCircle className="w-3 h-3 text-muted-foreground/40 mt-1 shrink-0 group-hover:text-primary transition-colors" />
                                    </motion.li>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-[260px] text-right">
                                    <div className="font-bold mb-1">{meta.title}</div>
                                    <p className="text-xs leading-relaxed opacity-90">{meta.explain}</p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </ul>
                        </div>
                      </TooltipProvider>

                      {/* CTA Button */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-2">
                        <Button
                          className={`w-full h-11 font-bold text-base group ${
                            isPopular ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white border-0 shadow-lg' : ''
                          }`}
                          disabled={isCurrent}
                          variant={isPopular ? 'default' : 'outline'}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          {isCurrent ? (
                            <>
                              <BadgeCheck className="w-4 h-4 ml-2" />
                              باقتك الحالية
                            </>
                          ) : (
                            <>
                              اشترك الآن
                              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>
                        {!isCurrent && (
                          <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3" />
                            دفع آمن • تفعيل خلال ساعات
                          </p>
                        )}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* === Comparison Table === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black">قارن بين الباقات</h2>
            <p className="text-sm text-muted-foreground">جدول شامل لمساعدتك في الاختيار</p>
          </div>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-right p-4 font-bold">الميزة</th>
                    {plans.map((p) => (
                      <th key={p.id} className="text-center p-4 font-bold">
                        <div className="flex flex-col items-center gap-1">
                          <span className={TIER_VISUALS[p.code]?.accent || ''}>{p.name_ar}</span>
                          <span className="text-xs font-normal text-muted-foreground">{p.price.toLocaleString()} ر.س</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'نسبة الخصم على الطلبات', getValue: (p: MembershipPlan) => `${p.discount_percentage}%` },
                    { label: 'مبلغ الكاش باك', getValue: (p: MembershipPlan) => `${p.cashback_amount} ر.س` },
                    { label: 'مدة الاشتراك', getValue: (p: MembershipPlan) => `${p.duration_months} شهر` },
                    { label: 'أولوية تنفيذ الطلبات', getValue: (p: MembershipPlan) => p.priority_level >= 3 ? 'قصوى' : p.priority_level >= 2 ? 'عالية' : 'عادية' },
                    { label: 'شارة مميزة', getValue: () => '✓' },
                    { label: 'دعم فني مخصص', getValue: (p: MembershipPlan) => p.code === 'platinum' ? 'VIP 24/7' : p.code === 'gold' ? 'مميز' : 'عادي' },
                  ].map((row, i) => (
                    <tr key={i} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium">{row.label}</td>
                      {plans.map((p) => (
                        <td key={p.id} className="text-center p-4 font-bold">
                          {row.getValue(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.section>

        {/* === FAQ === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              الأسئلة الشائعة
            </h2>
            <p className="text-sm text-muted-foreground">إجابات على الأسئلة الأكثر تكراراً</p>
          </div>
          <Card>
            <CardContent className="p-2 md:p-4">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0">
                    <AccordionTrigger className="text-right hover:no-underline font-bold py-4">
                      <span className="flex items-center gap-3 text-right">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0">
                          {i + 1}
                        </span>
                        {faq.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pr-10">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.section>

        {/* === CTA Footer === */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-amber-500 p-8 text-center text-primary-foreground"
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          />
          <Crown className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h3 className="text-2xl md:text-3xl font-black mb-2">جاهز للارتقاء بتجربتك؟</h3>
          <p className="text-sm opacity-90 mb-4">انضم لآلاف الأعضاء واحصل على أفضل الأسعار والمزايا</p>
          <Button
            size="lg"
            variant="secondary"
            className="font-bold"
            onClick={() => document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            تصفح الباقات الآن
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </motion.div>

        {/* === Subscribe Dialog === */}
        <Dialog open={!!selectedPlan} onOpenChange={(o) => !o && setSelectedPlan(null)}>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Crown className="w-5 h-5 text-primary" />
                اشتراك في {selectedPlan?.name_ar}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 rounded-xl space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">المبلغ المستحق</span>
                  <span className="text-2xl font-black text-primary">{selectedPlan?.price.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-primary/10">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> المدة</span>
                  <span className="font-bold">12 شهراً</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Gift className="w-3.5 h-3.5" /> كاش باك فوري</span>
                  <span className="font-bold text-emerald-600">+{selectedPlan?.cashback_amount} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> خصم دائم</span>
                  <span className="font-bold text-primary">{selectedPlan?.discount_percentage}%</span>
                </div>
              </motion.div>

              <div>
                <Label className="mb-3 block font-bold text-sm">اختر طريقة الدفع</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)} className="space-y-2">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('wallet')}
                  >
                    <RadioGroupItem value="wallet" id="wallet" />
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-primary" />
                    </div>
                    <Label htmlFor="wallet" className="cursor-pointer flex-1">
                      <p className="font-bold">المحفظة الرقمية</p>
                      <p className="text-xs text-muted-foreground">تفعيل فوري خلال ساعات</p>
                    </Label>
                    <Badge variant="secondary" className="text-[10px]">الأسرع</Badge>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'invoice' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('invoice')}
                  >
                    <RadioGroupItem value="invoice" id="invoice" />
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-amber-600" />
                    </div>
                    <Label htmlFor="invoice" className="cursor-pointer flex-1">
                      <p className="font-bold">فاتورة بنكية</p>
                      <p className="text-xs text-muted-foreground">تحويل بنكي + مراجعة</p>
                    </Label>
                  </motion.div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>إلغاء</Button>
              <Button onClick={handleSubscribe} disabled={submitting} className="min-w-[140px]">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    جارٍ الإرسال...
                  </span>
                ) : (
                  <>
                    <Check className="w-4 h-4 ml-2" />
                    تأكيد الاشتراك
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* === Referral Cross-sell Banner === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="relative overflow-hidden border-2 border-dashed border-primary/30 bg-gradient-to-l from-primary/5 via-transparent to-amber-500/5">
            <CardContent className="p-6 grid md:grid-cols-[auto_1fr_auto] gap-5 items-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shrink-0"
              >
                <Gift className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h3 className="font-black text-lg md:text-xl flex items-center gap-2">
                  ادعُ أصدقاءك واربح عمولات!
                  <Badge className="bg-amber-500 text-white text-[10px]">جديد</Badge>
                </h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  احصل على عمولة تصل إلى <strong className="text-primary">20%</strong> فوراً في محفظتك عند اشتراك صديقك في أي باقة عضوية.
                </p>
              </div>
              <Link to="/referrals" className="shrink-0">
                <Button size="lg" className="gap-2 w-full md:w-auto">
                  افتح برنامج الإحالات
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* === Why Members Love Us (Testimonials) === */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black flex items-center justify-center gap-2">
              <Quote className="w-5 h-5 text-primary" />
              ماذا يقول أعضاؤنا؟
            </h2>
            <p className="text-sm text-muted-foreground">تجارب حقيقية من أعضاء استفادوا من عضوياتنا</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: 'د. محمد العتيبي', role: 'دكتوراه إدارة', text: 'العضوية الذهبية وفّرت عليّ آلاف الريالات في أبحاثي. الخصم الفوري + الكاش باك = صفقة لا تُفوّت.', tier: 'gold', stars: 5 },
              { name: 'أ. سارة القحطاني', role: 'ماجستير تربية', text: 'أولوية تنفيذ الطلبات هي الأهم بالنسبة لي. العضوية البلاتينية أنقذتني في مواعيد التسليم الضيقة.', tier: 'platinum', stars: 5 },
              { name: 'م. عبدالله الزهراني', role: 'باحث', text: 'الدعم الفني المخصص استثنائي. كل ما طلبت مساعدة، رد فوري واحترافي. تستحق كل ريال.', tier: 'gold', stars: 5 },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full relative overflow-hidden">
                  <Quote className="absolute top-3 left-3 w-12 h-12 text-primary/5" />
                  <CardContent className="p-5 space-y-3 relative">
                    <div className="flex gap-0.5">
                      {[...Array(t.stars)].map((_, s) => (
                        <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">"{t.text}"</p>
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold leading-tight">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        <Crown className="w-3 h-3 ml-1" />
                        {t.tier === 'platinum' ? 'بلاتينيوم' : 'ذهبية'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* === Trust Badges === */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { icon: Shield, label: 'دفع آمن', sub: 'مشفّر 100%' },
            { icon: CheckCircle2, label: 'ضمان الجودة', sub: 'استرداد كامل' },
            { icon: Zap, label: 'تفعيل سريع', sub: 'خلال ساعات' },
            { icon: HeadphonesIcon, label: 'دعم متواصل', sub: '7 أيام/أسبوع' },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{b.label}</p>
                <p className="text-[10px] text-muted-foreground">{b.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </ClientLayout>
  );
}

