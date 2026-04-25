import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Wallet,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  Calculator,
  ArrowLeft,
  TrendingUp,
  FileSignature,
  CreditCard,
  Lock,
  Gavel,
  ScrollText,
  Quote,
  Building2,
  Banknote,
  Percent,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  computeFinancingPreview,
  FINANCING_MIN_AMOUNT,
  FINANCING_TIERS,
} from '@/lib/financing';
import heroImg from '@/assets/master-paylater-hero.jpg';
import cardImg from '@/assets/master-paylater-card.jpg';

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);

const FEATURES = [
  { icon: Percent, title: 'بدون فوائد · APR 0%', desc: 'تسدد المبلغ الأصلي فقط — لا فوائد ربوية ولا رسوم خفية.' },
  { icon: Zap, title: 'موافقة فورية', desc: 'تقييم ائتماني ذكي خلال ثوانٍ ونتيجة الأهلية مباشرة على شاشتك.' },
  { icon: Award, title: 'متوافق شرعاً', desc: 'صياغة العقد بإشراف مستشار شرعي ومتوافق مع نظام التعاملات الإلكترونية.' },
  { icon: ShieldCheck, title: 'أمان بنكي', desc: 'تشفير SSL 256-bit وحماية بيانات وفق معايير SAMA و PDPL السعودية.' },
  { icon: Wallet, title: 'أقساط مرنة', desc: 'من 6 أشهر إلى 3 سنوات — اختر ما يناسب دخلك ومبلغ التمويل.' },
  { icon: ScrollText, title: 'عقد رقمي موثّق', desc: 'توقيع إلكتروني بحجّية كاملة + سجل تدقيق + سند تنفيذي عند الحاجة.' },
];

const HOW_STEPS = [
  { icon: FileSignature, title: 'املأ الطلب', desc: 'بيانات شخصية ومهنية + المبلغ المطلوب — أقل من 5 دقائق.' },
  { icon: Calculator, title: 'تقييم ائتماني', desc: 'محرّك تقييم ذكي يحسب أهليتك فورياً وفق سياسة الإقراض.' },
  { icon: ScrollText, title: 'وقّع العقد', desc: 'مراجعة البنود وتوقيع رقمي بحجية قانونية كاملة.' },
  { icon: CreditCard, title: 'ادفع الدفعة الأولى', desc: 'ادفع 25% فقط من المبلغ لتفعيل التمويل واستلام رصيدك.' },
  { icon: Sparkles, title: 'استمتع برصيدك', desc: 'استخدم الرصيد فوراً وقسّط الباقي شهرياً بدون فوائد.' },
];

const COMPARISON = [
  { feature: 'معدل الفائدة (APR)', mp: '0%', bank: '8% — 18%', other: '15% — 36%' },
  { feature: 'وقت الموافقة', mp: 'فوري', bank: '3 — 7 أيام', other: 'ساعات' },
  { feature: 'الدفعة الأولى', mp: '25%', bank: '20% — 30%', other: '0% — 25%' },
  { feature: 'أقصى مبلغ', mp: '100,000 ر.س', bank: '500,000+ ر.س', other: '5,000 — 30,000' },
  { feature: 'رسوم تأخير', mp: 'محدودة وعادلة', bank: 'مرتفعة', other: 'مرتفعة جداً' },
  { feature: 'التزام بالشريعة', mp: '✓ متوافق', bank: 'متفاوت', other: 'غالباً ربوي' },
  { feature: 'كفيل', mp: 'اختياري', bank: 'إلزامي غالباً', other: 'غير مطلوب' },
];

const TESTIMONIALS = [
  { name: 'محمد العتيبي', role: 'موظف حكومي · الرياض', text: 'حصلت على رصيد 15,000 ر.س لأطروحتي خلال يومين بدون أي فوائد. تجربة بنكية حقيقية.', stars: 5 },
  { name: 'سارة القحطاني', role: 'باحثة دكتوراه · جدة', text: 'العقد شفاف 100% وكل بند موضح. التطبيق سهل والأقساط مرنة جداً.', stars: 5 },
  { name: 'عبدالله الشمري', role: 'مهندس · الدمام', text: 'أفضل من أي شركة تقسيط جربتها. صفر فوائد وفعلاً تحترم وقتي.', stars: 5 },
];

const FAQ = [
  { q: 'هل التمويل بدون فوائد فعلاً؟', a: 'نعم — APR 0%. تسدد المبلغ الأصلي فقط. لا فوائد ربوية ولا رسوم إدارية مخفية. النموذج المالي يعتمد على رسوم خدمات اختيارية وأرباح المنصة من الخدمات الأخرى.' },
  { q: 'ما الحد الأدنى والأقصى للتمويل؟', a: `الحد الأدنى ${fmt(FINANCING_MIN_AMOUNT)} ر.س والحد الأقصى 100,000 ر.س لكل طلب نشط.` },
  { q: 'كم تستغرق الموافقة؟', a: 'التقييم الائتماني فوري. في حال اكتمال البيانات والمستندات، يتم تفعيل التمويل خلال 24 ساعة من توقيع العقد.' },
  { q: 'هل أحتاج كفيل؟', a: 'الكفيل اختياري للمبالغ الصغيرة، ومُوصى به للمبالغ فوق 25,000 ر.س لتعزيز فرص الموافقة وتحسين الشروط.' },
  { q: 'ماذا لو تأخرت في السداد؟', a: 'هناك مهلة سماح 24 ساعة بعد تاريخ الاستحقاق. بعدها تبدأ إجراءات تذكير ودية، ثم رسوم تأخير محدودة، وفي الحالات القصوى يُفعّل السند التنفيذي.' },
  { q: 'هل يمكن السداد المبكر؟', a: 'نعم — يمكنك سداد كامل المبلغ المتبقي في أي وقت بدون أي رسوم إضافية أو غرامات.' },
  { q: 'هل التمويل متوافق شرعاً؟', a: 'نعم. الصياغة معتمدة من مستشار شرعي وتعتمد على بيع التورّق المنظّم بدون فوائد أو زيادة على المبلغ الأصلي.' },
  { q: 'كيف يتم حماية بياناتي؟', a: 'تشفير SSL 256-bit، تخزين آمن وفق معايير SAMA و PDPL السعودية، ولا تتم مشاركة بياناتك مع أي طرف ثالث بدون إذنك الصريح.' },
];

const TERMS = [
  { icon: Wallet, title: 'الحد والمدة', text: `من ${fmt(FINANCING_MIN_AMOUNT)} إلى 100,000 ر.س — مدد 6 / 12 / 36 شهراً حسب المبلغ.` },
  { icon: Percent, title: 'بدون فوائد', text: 'APR 0% — تسديد المبلغ الأصلي فقط بدون أي زيادة.' },
  { icon: CreditCard, title: 'الدفعة الأولى', text: '25% من إجمالي المبلغ تُدفع لتفعيل العقد واستلام الرصيد.' },
  { icon: Clock, title: 'مهلة السماح', text: '24 ساعة بعد تاريخ استحقاق القسط قبل تطبيق إجراءات التأخير.' },
  { icon: Gavel, title: 'السند التنفيذي', text: 'العقد يُعدّ سنداً تنفيذياً وفق نظام التنفيذ السعودي عند التعثّر.' },
  { icon: Lock, title: 'حماية البيانات', text: 'تشفير بنكي SSL 256-bit · توافق كامل مع نظام PDPL.' },
  { icon: ScrollText, title: 'العقد الرقمي', text: 'توقيع إلكتروني بحجّية قانونية + سجل تدقيق كامل.' },
  { icon: ShieldCheck, title: 'الأهلية', text: 'سعودي/مقيم نظامي · دخل ثابت قابل للإثبات · سجل ائتماني سليم.' },
];

const MasterPayLater: React.FC = () => {
  const [calcAmount, setCalcAmount] = useState<number>(15000);
  const preview = useMemo(() => computeFinancingPreview(calcAmount), [calcAmount]);

  return (
    <main dir="rtl" className="min-h-screen bg-background">
      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-40" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, hsl(222 47% 8% / 0.95) 0%, hsl(217 91% 22% / 0.92) 50%, hsl(263 70% 28% / 0.95) 100%)',
            }}
          />
        </div>
        <motion.div
          className="absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-cyan-400/25 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-32 -left-32 h-[32rem] w-[32rem] rounded-full bg-violet-500/25 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, delay: 1 }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/20 px-4 py-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold tracking-wide">Master PayLater · بدون فوائد</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5"
              >
                تمويل ذكي
                <span className="block bg-gradient-to-l from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  بصفر فوائد
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-white/85 leading-relaxed mb-8 max-w-xl"
              >
                احصل على رصيد يصل إلى <strong className="text-cyan-200">100,000 ر.س</strong> وقسّطه على 36 شهراً
                بدون أي فوائد ربوية. تقييم ائتماني فوري، عقد رقمي موثّق، وأمان بنكي كامل.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold shadow-2xl h-12 px-6">
                  <Link to="/financing/new">
                    ابدأ طلب التمويل
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 hover:text-white h-12 px-6">
                  <a href="#calculator">احسب قسطك</a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md"
              >
                {[
                  { v: '0%', l: 'فوائد' },
                  { v: '24س', l: 'تفعيل' },
                  { v: '100K', l: 'حد أعلى' },
                ].map((s, i) => (
                  <div key={i} className="rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/15 p-3 text-center">
                    <div className="text-2xl font-extrabold tabular-nums bg-gradient-to-l from-cyan-200 to-violet-200 bg-clip-text text-transparent">{s.v}</div>
                    <div className="text-[11px] text-white/70 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Card image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <img
                  src={cardImg}
                  alt="بطاقة Master PayLater"
                  className="w-full h-auto rounded-3xl shadow-2xl ring-1 ring-white/20"
                  loading="eager"
                  width={1280}
                  height={1024}
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-400/20 via-transparent to-violet-500/20 mix-blend-overlay" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== TRUST BAR ==================== */}
      <section className="bg-gradient-to-l from-muted/40 via-background to-muted/40 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-muted-foreground">
            {[
              { icon: ShieldCheck, t: 'مرخّص ومتوافق مع SAMA' },
              { icon: Lock, t: 'تشفير SSL 256-bit' },
              { icon: Award, t: 'متوافق شرعاً' },
              { icon: Gavel, t: 'سند تنفيذي معتمد' },
              { icon: Star, t: '+10K عميل راضٍ' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <b.icon className="h-4 w-4 text-primary" />
                <span className="font-semibold">{b.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            <Sparkles className="h-3 w-3 ml-1" /> لماذا Master PayLater
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">تجربة بنكية بمعايير عالمية</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            6 مزايا تميّزنا عن أي شركة تمويل أو تقسيط في السوق السعودي.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full p-6 hover:shadow-xl hover:-translate-y-1 transition-all border-border/60 group bg-gradient-to-br from-card to-muted/20">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ring-1 ring-primary/20">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== CALCULATOR ==================== */}
      <section id="calculator" className="py-16 sm:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              <Calculator className="h-3 w-3 ml-1" /> حاسبة فورية
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">احسب قسطك الشهري</h2>
            <p className="text-muted-foreground">أدخل المبلغ المطلوب وشاهد التفاصيل فوراً — بدون فوائد.</p>
          </div>

          <Card className="p-6 sm:p-8 shadow-2xl border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
              <div className="lg:col-span-2">
                <label className="text-sm font-bold flex items-center gap-2 mb-3">
                  <Wallet className="h-4 w-4 text-primary" /> مبلغ التمويل المطلوب
                </label>
                <div className="relative mb-4">
                  <Input
                    type="number"
                    min={FINANCING_MIN_AMOUNT}
                    max={100000}
                    step={500}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                    className="h-14 text-2xl font-bold pl-16 tabular-nums bg-background"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">ر.س</span>
                </div>
                <input
                  type="range"
                  min={FINANCING_MIN_AMOUNT}
                  max={100000}
                  step={500}
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5 tabular-nums">
                  <span>{fmt(FINANCING_MIN_AMOUNT)}</span>
                  <span>100,000</span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[5000, 15000, 50000].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setCalcAmount(q)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold ring-1 transition ${
                        calcAmount === q ? 'bg-primary text-primary-foreground ring-primary' : 'bg-background ring-border hover:ring-primary/50'
                      }`}
                    >
                      {fmt(q)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 ring-1 ring-cyan-500/20">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">الدفعة الأولى</div>
                    <div className="text-2xl font-extrabold tabular-nums text-cyan-600 dark:text-cyan-300">{fmt(preview.downPayment)}</div>
                    <div className="text-[10px] text-muted-foreground">ر.س — 25%</div>
                  </div>
                  <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-500/10 to-violet-500/5 ring-1 ring-violet-500/20">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">القسط الشهري</div>
                    <div className="text-2xl font-extrabold tabular-nums text-violet-600 dark:text-violet-300">{fmt(preview.monthly)}</div>
                    <div className="text-[10px] text-muted-foreground">ر.س × {preview.duration} شهر</div>
                  </div>
                </div>

                <div className="rounded-2xl p-4 bg-gradient-to-l from-emerald-500/15 via-emerald-500/5 to-transparent ring-1 ring-emerald-500/30 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-muted-foreground">إجمالي ما ستدفعه</div>
                    <div className="font-extrabold tabular-nums text-base sm:text-lg">{fmt(preview.total)} ر.س</div>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 text-[10px] gap-1 shrink-0">
                    <Sparkles className="h-3 w-3" /> APR 0%
                  </Badge>
                </div>

                <Button asChild size="lg" className="w-full bg-gradient-to-l from-primary to-accent text-primary-foreground hover:opacity-95 font-bold shadow-lg h-12">
                  <Link to={`/financing/new?amount=${calcAmount}`}>
                    تقدّم بهذا المبلغ
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FINANCING_TIERS.map((t) => {
                const active = calcAmount >= t.min && calcAmount <= t.max;
                return (
                  <div
                    key={t.label}
                    className={`rounded-xl p-3 ring-1 transition-all ${
                      active ? 'bg-primary/10 ring-primary shadow-sm' : 'bg-muted/30 ring-border/40'
                    }`}
                  >
                    <div className="text-[10px] text-muted-foreground mb-0.5 tabular-nums">{fmt(t.min)} — {fmt(t.max)} ر.س</div>
                    <div className={`text-sm font-bold ${active ? 'text-primary' : 'text-foreground'}`}>{t.label}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            <TrendingUp className="h-3 w-3 ml-1" /> 5 خطوات
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">من الطلب إلى الرصيد في يوم</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">عملية مبسّطة وشفافة من البداية للنهاية.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {HOW_STEPS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <Card className="h-full p-5 text-center border-border/60 hover:border-primary/40 transition-all">
                <div className="relative inline-flex">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                    <s.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-background ring-2 ring-primary text-primary text-xs font-extrabold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-bold text-base mt-4 mb-1.5">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== COMPARISON ==================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              <Banknote className="h-3 w-3 ml-1" /> مقارنة شفّافة
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">لماذا نحن الخيار الأذكى؟</h2>
            <p className="text-muted-foreground">قارن بنفسك بين Master PayLater والبنوك التقليدية وشركات التقسيط.</p>
          </motion.div>

          <Card className="overflow-hidden shadow-2xl border-primary/20">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-gradient-to-l from-primary to-accent text-primary-foreground">
                    <th className="text-right p-4 font-bold text-xs sm:text-sm">المميّزة</th>
                    <th className="p-4 font-bold text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        Master PayLater
                      </div>
                    </th>
                    <th className="p-4 font-bold text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-90">
                        <Building2 className="h-4 w-4" />
                        البنوك التقليدية
                      </div>
                    </th>
                    <th className="p-4 font-bold text-center">
                      <div className="flex items-center justify-center gap-1.5 opacity-90">
                        <CreditCard className="h-4 w-4" />
                        شركات التقسيط
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={i} className={`border-t border-border/50 ${i % 2 === 0 ? 'bg-card' : 'bg-muted/20'}`}>
                      <td className="p-4 font-semibold text-xs sm:text-sm">{row.feature}</td>
                      <td className="p-4 text-center font-bold text-primary text-sm">{row.mp}</td>
                      <td className="p-4 text-center text-muted-foreground text-sm">{row.bank}</td>
                      <td className="p-4 text-center text-muted-foreground text-sm">{row.other}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            بيانات تقريبية بناءً على متوسط السوق السعودي 2025
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            <Star className="h-3 w-3 ml-1" /> آراء عملائنا
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3">عملاء سعداء بتجربة حقيقية</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-bold">4.9 / 5</span>
            <span className="text-xs text-muted-foreground">من +2,400 تقييم</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full p-6 border-border/60 hover:shadow-xl transition-all relative overflow-hidden group">
                <Quote className="absolute -top-2 -right-2 h-20 w-20 text-primary/5 group-hover:text-primary/10 transition" />
                <div className="relative">
                  <div className="flex mb-3">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-5 text-foreground/90">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-extrabold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-[11px] text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== TERMS ==================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-muted/30 via-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              <Gavel className="h-3 w-3 ml-1" /> الشروط والقوانين
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">شروط واضحة وقانونية</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">كل بند موضّح بدون كلمات مبهمة — نلتزم بأعلى معايير الشفافية البنكية.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TERMS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full p-5 border-border/60 hover:border-primary/40 hover:shadow-lg transition-all">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center mb-3">
                    <t.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">{t.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
            <ScrollText className="h-3 w-3 ml-1" /> أسئلة شائعة
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">كل ما تحتاج معرفته</h2>
        </motion.div>

        <Card className="p-2 sm:p-4 shadow-lg border-border/60">
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="border-border/40">
                <AccordionTrigger className="text-right hover:no-underline font-bold text-sm sm:text-base px-3">
                  <span className="flex items-center gap-3">
                    <span className="h-6 w-6 shrink-0 rounded-md bg-primary/10 ring-1 ring-primary/20 text-primary text-xs font-extrabold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {item.q}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pr-9">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, hsl(222 47% 12%) 0%, hsl(217 91% 24%) 50%, hsl(263 70% 30%) 100%)',
          }}
        />
        <motion.div
          className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-violet-500/30 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/20 px-4 py-1.5 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span className="text-xs font-bold">جاهز للبدء؟</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              ابدأ تمويلك الذكي اليوم
              <span className="block bg-gradient-to-l from-cyan-300 to-violet-300 bg-clip-text text-transparent mt-1">
                بدون فوائد · بدون تعقيد
              </span>
            </h2>
            <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto mb-8">
              5 دقائق لإكمال الطلب. تقييم فوري. تفعيل خلال 24 ساعة.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-bold shadow-2xl h-12 px-8 text-base">
                <Link to="/financing/new">
                  ابدأ طلبك الآن
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20 hover:text-white h-12 px-6">
                <Link to="/financing">لوحة التمويل</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/70">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> بدون فوائد</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> موافقة فورية</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> متوافق شرعاً</span>
              <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-rose-300" /> لا رسوم خفية</span>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default MasterPayLater;
