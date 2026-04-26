import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Sparkles, ShieldCheck, Clock, ArrowLeft,
  CheckCircle2, FileSignature, Smartphone, Calculator,
  Info, Coins, CalendarClock, Percent, Star, Quote,
  GraduationCap, Heart, TrendingUp, Zap, Award, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  computeFinancingPreview,
  FINANCING_MIN_AMOUNT,
  FINANCING_TIERS,
  FINANCING_DEFAULT_DOWN_PAYMENT_PCT,
  FINANCING_LEGAL_FEES_SAR,
  FINANCING_GRACE_PERIOD_HOURS,
} from '@/lib/financing';

import paylaterCard from '@/assets/master-paylater-card.jpg';
import studentSuccess from '@/assets/financing-student-success.jpg';
import graduateSuccess from '@/assets/financing-graduate-success.jpg';
import handshakeTrust from '@/assets/financing-handshake-trust.jpg';
import researcherWorking from '@/assets/financing-researcher-working.jpg';
import signingContract from '@/assets/financing-signing-contract.jpg';

/**
 * قسم Master PayLater للصفحة الرئيسية — نسخة موسّعة
 * - واقعي · تشجيعي · تفاعلي · بصور حقيقية
 */

const fmt = (n: number) => Math.round(n).toLocaleString('ar-SA');

// ─── عداد رقمي متحرك ───
const AnimatedNumber: React.FC<{ value: number; suffix?: string; className?: string }> = ({
  value, suffix = '', className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (n) => fmt(n) + suffix);
  useEffect(() => {
    if (inView) {
      const c = animate(mv, value, { duration: 1.6, ease: 'easeOut' });
      return c.stop;
    }
  }, [inView, value, mv]);
  return <motion.span ref={ref} className={className}>{rounded}</motion.span>;
};

const STEPS = [
  {
    n: 1,
    icon: Smartphone,
    title: 'قدّم طلبك من جوالك',
    desc: 'املأ بياناتك وارفع المستندات في أقل من 3 دقائق — تجربة سلسة بالكامل.',
    img: studentSuccess,
    badge: 'الخطوة 1 — التقديم',
    color: 'from-amber-500 to-orange-500',
  },
  {
    n: 2,
    icon: FileSignature,
    title: 'وقّع العقد إلكترونياً',
    desc: 'عقد رقمي موثّق وفق نظام التعاملات الإلكترونية السعودي.',
    img: signingContract,
    badge: 'الخطوة 2 — التوقيع',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    n: 3,
    icon: Wallet,
    title: 'رصيدك جاهز للاستخدام',
    desc: 'فور الموافقة يُضاف مبلغ التمويل إلى محفظتك واستخدمه لحظياً.',
    img: graduateSuccess,
    badge: 'الخطوة 3 — التفعيل',
    color: 'from-emerald-500 to-teal-500',
  },
];

const TESTIMONIALS = [
  {
    name: 'أحمد المطيري',
    role: 'باحث ماجستير · جامعة الملك سعود',
    text: 'موّلت تحرير وترجمة رسالتي بالكامل بدون قلق مالي. خلال 24 ساعة كان الرصيد في محفظتي.',
    img: studentSuccess,
    rating: 5,
  },
  {
    name: 'منيرة العبدالله',
    role: 'طالبة دكتوراه · جامعة الإمام',
    text: 'بدون فوائد فعلاً، وأقساط ميسّرة على مدى سنة. ساعدوني أكمل أبحاثي بكل راحة.',
    img: graduateSuccess,
    rating: 5,
  },
  {
    name: 'د. خالد الزهراني',
    role: 'باحث دكتوراه · جامعة أم القرى',
    text: 'تجربة احترافية جداً، عقد إلكتروني واضح وتمويل وصلني نفس اليوم. أنصح كل باحث.',
    img: researcherWorking,
    rating: 5,
  },
];

const HomeFinancingSection: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(15000);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const preview = useMemo(() => computeFinancingPreview(amount), [amount]);
  const { monthly, duration: months, downPayment, remaining } = preview;
  const eligible = amount >= FINANCING_MIN_AMOUNT;
  const downPct = Math.round(FINANCING_DEFAULT_DOWN_PAYMENT_PCT * 100);

  // Auto rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial((p) => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      dir="rtl"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, hsl(220 70% 10%) 0%, hsl(245 65% 16%) 45%, hsl(195 75% 20%) 100%)',
      }}
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, white 0.5px, transparent 0.5px), radial-gradient(circle at 70% 70%, white 0.5px, transparent 0.5px)',
            backgroundSize: '40px 40px, 60px 60px',
          }}
        />
      </div>
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-cyan-400/10 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -bottom-32 -left-32 w-[520px] h-[520px] rounded-full bg-amber-400/10 blur-3xl"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
        >
          <Badge className="mb-4 bg-amber-400/15 text-amber-200 border-amber-300/30 px-4 py-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 ml-1" />
            Master PayLater · ممكّنك أكاديمياً
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            لا تؤجّل حلمك الأكاديمي
            <span className="block text-transparent bg-clip-text bg-gradient-to-l from-amber-300 via-yellow-200 to-amber-400 mt-2">
              ادرس الآن · ادفع على راحتك
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed">
            رصيد تمويلي يُضاف فوراً لمحفظتك تستخدمه في الترجمة، التحرير، النشر، وكل خدمة أكاديمية —
            <strong className="text-amber-300"> بدون فوائد</strong>، بموافقة فورية أو خلال 24 ساعة.
          </p>

          {/* شريط ثقة بأرقام متحركة */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-2xl mx-auto">
            {[
              { v: 2400, s: '+', l: 'باحث استفاد', icon: Users, color: 'text-amber-300' },
              { v: 98, s: '%', l: 'موافقة', icon: CheckCircle2, color: 'text-emerald-300' },
              { v: 24, s: 'س', l: 'وقت الموافقة', icon: Clock, color: 'text-cyan-300' },
              { v: 0, s: '%', l: 'APR — بدون فوائد', icon: Heart, color: 'text-rose-300' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 backdrop-blur"
              >
                <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
                <div className={`text-xl sm:text-2xl font-black tabular-nums ${s.color}`}>
                  <AnimatedNumber value={s.v} suffix={s.s} />
                </div>
                <div className="text-[10px] sm:text-[11px] text-white/70 mt-0.5">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* صف رئيسي: بطاقة + حاسبة */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-14 lg:mb-20">
          {/* البطاقة المرئية مع صورة طالب حقيقي */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative space-y-4"
          >
            {/* البطاقة */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              <img
                src={paylaterCard}
                alt="بطاقة Master PayLater للتمويل الأكاديمي"
                className="w-full h-full object-cover aspect-[16/10] group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                width={1024}
                height={640}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span className="text-[11px] sm:text-xs text-emerald-200 font-semibold">
                    موثّق وفق نظام التعاملات الإلكترونية السعودي
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black mb-1">حتى 100,000 ر.س</div>
                <div className="text-xs sm:text-sm text-white/85">
                  رصيد داخلي قابل للاستخدام في كل خدمات المنصة الأكاديمية
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-amber-400 text-slate-900 text-xs font-black shadow-lg"
              >
                APR 0%
              </motion.div>
            </div>

            {/* صورة طالب ناجح + اقتباس عائم */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[16/10]">
              <img
                src={researcherWorking}
                alt="باحث سعودي يستخدم تمويل Master PayLater"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                width={1024}
                height={640}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 p-5 sm:p-7 flex flex-col justify-center max-w-[60%]">
                <Quote className="w-6 h-6 text-amber-300 mb-2" />
                <p className="text-white text-sm sm:text-base font-semibold leading-relaxed mb-3">
                  «استكملت ترجمة ونشر بحثي بدون أي ضغط مالي — فعلاً غيّر مسيرتي.»
                </p>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <div className="text-[11px] text-white/80">د. سلطان · باحث دكتوراه</div>
              </div>
            </div>
          </motion.div>

          {/* الحاسبة التفاعلية */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Card className="p-5 sm:p-7 bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-slate-900">جرّب القسط فوراً</div>
                  <div className="text-[11px] text-slate-500">
                    حاسبة تفاعلية — التغيير لحظي بدون انتظار
                  </div>
                </div>
                <Badge className="ms-auto bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">
                  <Zap className="w-3 h-3 ml-0.5" />
                  مباشر
                </Badge>
              </div>

              {/* مبلغ التمويل */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    مبلغ التمويل المطلوب
                  </label>
                  <motion.span
                    key={amount}
                    initial={{ scale: 1.15, color: '#f59e0b' }}
                    animate={{ scale: 1, color: '#0f172a' }}
                    className="text-lg font-black tabular-nums"
                  >
                    {fmt(amount)} ر.س
                  </motion.span>
                </div>
                <Slider
                  value={[amount]}
                  onValueChange={(v) => setAmount(v[0])}
                  min={FINANCING_MIN_AMOUNT}
                  max={100000}
                  step={500}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
                  <span>{fmt(FINANCING_MIN_AMOUNT)} ر.س</span>
                  <span>100,000 ر.س</span>
                </div>

                {/* أزرار اقتراح سريعة */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[5000, 10000, 25000, 50000, 100000].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(v)}
                      className={`text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full font-semibold transition-all tabular-nums ${
                        amount === v
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {fmt(v)}
                    </button>
                  ))}
                </div>

                {!eligible && (
                  <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                    <Info className="w-3 h-3 shrink-0" />
                    الحد الأدنى للتمويل {fmt(FINANCING_MIN_AMOUNT)} ر.س.
                  </div>
                )}
              </div>

              {/* مدة السداد */}
              <div className="rounded-xl bg-gradient-to-l from-indigo-50 to-blue-50 ring-1 ring-indigo-100 px-3 py-2.5 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarClock className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-700">
                    مدة السداد التلقائية
                  </span>
                </div>
                <span className="text-sm font-black text-indigo-700 tabular-nums">
                  {preview.tierLabel}
                </span>
              </div>

              {/* تفصيل التسعير */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-xl bg-white ring-1 ring-slate-200 p-3">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
                    <Coins className="w-3 h-3" /> دفعة مقدّمة ({downPct}%)
                  </div>
                  <div className="text-sm font-black text-slate-900 tabular-nums">
                    {fmt(downPayment)} ر.س
                  </div>
                </div>
                <div className="rounded-xl bg-white ring-1 ring-slate-200 p-3">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
                    <Wallet className="w-3 h-3" /> المتبقي على أقساط
                  </div>
                  <div className="text-sm font-black text-slate-900 tabular-nums">
                    {fmt(remaining)} ر.س
                  </div>
                </div>
              </div>

              {/* نتيجة القسط */}
              <motion.div
                key={`${amount}-${months}`}
                initial={{ scale: 0.96, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-xl mb-4 relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <div className="relative">
                  <div className="text-xs text-white/80 mb-1">قسطك الشهري فقط</div>
                  <div className="text-3xl sm:text-4xl font-black tabular-nums leading-none mb-2">
                    {fmt(monthly)}{' '}
                    <span className="text-base font-bold">ر.س / شهر</span>
                  </div>
                  <div className="text-[11px] text-white/85 mb-2 tabular-nums">
                    × {months} شهرًا = {fmt(remaining)} ر.س (بعد الدفعة المقدّمة)
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-200 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    بدون فوائد · بدون رسوم خفية · APR 0%
                  </div>
                </div>
              </motion.div>

              {/* سياسة مختصرة */}
              <details className="rounded-xl bg-slate-50 ring-1 ring-slate-200 p-3 mb-4 group">
                <summary className="cursor-pointer text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-indigo-600" />
                  نموذج التسعير والسياسة الكاملة
                </summary>
                <div className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed mt-2">
                  <div>• APR <strong className="text-emerald-700">0%</strong> — تسدد المبلغ الأصلي فقط.</div>
                  <div>• دفعة مقدّمة إلزامية: <strong>{downPct}%</strong> قبل التفعيل.</div>
                  <div>• شرائح المدة:
                    {' '}{FINANCING_TIERS.map((t, i) => (
                      <span key={i} className="tabular-nums">
                        {i > 0 ? '، ' : ''}{fmt(t.min)}–{fmt(t.max)} ← {t.months}ش
                      </span>
                    ))}.
                  </div>
                  <div>• مهلة سماح <strong className="tabular-nums">{FINANCING_GRACE_PERIOD_HOURS} ساعة</strong> بعد الاستحقاق.</div>
                  <div>• عند التعثر تُضاف أتعاب محاماة قدرها <strong className="tabular-nums">{fmt(FINANCING_LEGAL_FEES_SAR)} ر.س</strong>.</div>
                </div>
              </details>

              <Button
                onClick={() => navigate('/financing/new')}
                disabled={!eligible}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30 rounded-xl disabled:opacity-60"
              >
                ابدأ تمويلك الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <p className="text-[11px] text-center text-slate-500 mt-3">
                التقديم ≤ 3 دقائق · موافقة فورية أو خلال 24 ساعة
              </p>
            </Card>
          </motion.div>
        </div>

        {/* خطوات التفعيل بصور حقيقية */}
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
              ٣ خطوات بسيطة · رحلة موثوقة
            </h3>
            <p className="text-sm sm:text-base text-white/75">
              من التقديم إلى استلام رصيدك في محفظتك — تجربة سلسة بالكامل
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 aspect-[4/5]">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    width={1024}
                    height={1280}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

                  <div className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${s.color} text-white flex items-center justify-center font-black text-lg shadow-2xl ring-2 ring-white/20`}>
                    {s.n}
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 text-slate-900 text-[11px] font-bold flex items-center gap-1 backdrop-blur shadow">
                    <s.icon className="w-3 h-3" />
                    {s.badge}
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                    <h4 className="text-lg sm:text-xl font-black mb-1.5">{s.title}</h4>
                    <p className="text-xs sm:text-sm text-white/85 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* قسم آراء عملاء حقيقيين */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-emerald-400/15 text-emerald-200 border-emerald-300/30">
              <Heart className="w-3 h-3 ml-1" /> قصص نجاح حقيقية
            </Badge>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2">
              باحثون ساعدناهم على إكمال مسيرتهم
            </h3>
            <p className="text-sm sm:text-base text-white/75">
              آلاف الباحثين والطلاب اعتمدوا علينا — اقرأ تجاربهم
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                animate={activeTestimonial === i ? { scale: 1.03 } : { scale: 1 }}
                className={`relative rounded-2xl bg-white/5 backdrop-blur-xl ring-1 transition-all p-5 ${
                  activeTestimonial === i
                    ? 'ring-amber-300/50 shadow-2xl shadow-amber-500/10'
                    : 'ring-white/10'
                }`}
              >
                <Quote className="absolute top-4 left-4 w-8 h-8 text-amber-300/20" />
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-300/40"
                    loading="lazy"
                    width={48}
                    height={48}
                  />
                  <div>
                    <div className="text-sm font-black text-white">{t.name}</div>
                    <div className="text-[10px] text-white/60">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  ))}
                </div>
                <p className="text-sm text-white/85 leading-relaxed">«{t.text}»</p>
              </motion.div>
            ))}
          </div>

          {/* المؤشرات */}
          <div className="flex justify-center gap-1.5 mt-5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-1.5 rounded-full transition-all ${
                  activeTestimonial === i ? 'w-8 bg-amber-300' : 'w-1.5 bg-white/30'
                }`}
                aria-label={`عرض شهادة ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA نهائي مع صورة ثقة */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-2xl"
        >
          <img
            src={handshakeTrust}
            alt="ثقة وشراكة Master PayLater"
            className="w-full h-64 sm:h-80 object-cover"
            loading="lazy"
            width={1280}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/95 via-slate-950/80 to-slate-950/50 flex items-center">
            <div className="w-full px-6 sm:px-10 py-6 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-300" />
                  <span className="text-xs sm:text-sm font-bold text-amber-200">
                    شريكك الموثوق في رحلتك الأكاديمية
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 leading-tight">
                  جاهز تبدأ مشروعك الأكاديمي اليوم؟
                </h3>
                <p className="text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
                  انضم لـ <strong className="text-amber-300 tabular-nums">2,400+</strong> باحث وطالب
                  استفادوا من تمويل Master PayLater — لا تدع الميزانية تعرقل طموحك.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => navigate('/financing/new')}
                  size="lg"
                  className="h-14 px-8 text-base font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-500 hover:to-yellow-400 text-slate-900 shadow-2xl shadow-amber-500/40 rounded-xl"
                >
                  <GraduationCap className="w-5 h-5 ml-2" />
                  قدّم طلبك الآن — مجاناً
                </Button>
                <div className="flex items-center justify-center gap-3 text-[11px] text-white/70">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-300" /> آمن
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-300" /> فوري
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-cyan-300" /> بدون فوائد
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFinancingSection;
