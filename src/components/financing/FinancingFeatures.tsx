import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap, ShieldCheck, BadgePercent, Wallet, Clock3, FileCheck2,
  Receipt, Calculator, BadgeCheck, Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import customerImg from '@/assets/financing-customer.jpg';
import shieldsImg from '@/assets/financing-trust-shields.jpg';

const FEATURES = [
  {
    icon: BadgePercent,
    title: 'بدون أي فوائد ربوية',
    desc: 'تمويل متوافق ١٠٠٪ مع الشريعة — تسدد المبلغ الأصلي فقط، APR 0%.',
    accent: 'from-emerald-500/20 to-teal-500/10',
    iconBg: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Zap,
    title: 'موافقة فورية ذكية',
    desc: 'محرك تقييم ائتماني فوري يصدر قراره خلال دقائق، ويُكمل خلال 24 ساعة.',
    accent: 'from-amber-500/20 to-orange-500/10',
    iconBg: 'from-amber-500 to-orange-600',
  },
  {
    icon: Wallet,
    title: 'رصيد فوري في محفظتك',
    desc: 'بعد الموافقة، يُضاف الرصيد لمحفظتك داخل المنصة لاستخدامه فورًا.',
    accent: 'from-violet-500/20 to-fuchsia-500/10',
    iconBg: 'from-violet-500 to-fuchsia-600',
  },
  {
    icon: ShieldCheck,
    title: 'عقد رقمي موثّق',
    desc: 'توقيع إلكتروني نظامي بنفس حجّية التوقيع اليدوي — سند تنفيذي عند التأخر.',
    accent: 'from-sky-500/20 to-blue-500/10',
    iconBg: 'from-sky-500 to-blue-600',
  },
  {
    icon: Calculator,
    title: 'أقساط مرنة حتى 36 شهر',
    desc: '6 أو 12 أو 36 شهرًا حسب مبلغ التمويل، بأقساط شهرية ثابتة لا تتغير.',
    accent: 'from-rose-500/20 to-pink-500/10',
    iconBg: 'from-rose-500 to-pink-600',
  },
  {
    icon: Clock3,
    title: 'تذكيرات ذكية قبل الاستحقاق',
    desc: 'ننبّهك بالواتساب والإيميل قبل كل قسط، ومهلة سماح 24 ساعة بعد الاستحقاق.',
    accent: 'from-cyan-500/20 to-teal-500/10',
    iconBg: 'from-cyan-500 to-teal-600',
  },
];

const STEPS = [
  { i: 1, t: 'قدّم الطلب', d: 'وثّق هويتك ومستنداتك في 3 دقائق', icon: FileCheck2 },
  { i: 2, t: 'تقييم ائتماني فوري', d: 'محرك ذكي يفحص أهليتك وقدرتك على السداد', icon: Sparkles },
  { i: 3, t: 'وقّع العقد رقميًا', d: 'عقد نظامي بقوة السند التنفيذي', icon: BadgeCheck },
  { i: 4, t: 'ادفع الدفعة الأولى', d: '25% من المبلغ عبر تحويل بنكي أو بطاقة', icon: Receipt },
  { i: 5, t: 'استلم الرصيد فورًا', d: 'يُضاف لمحفظتك واستخدمه على خدمات المنصة', icon: Wallet },
];

const FinancingFeatures: React.FC = () => {
  return (
    <section id="financing-how-it-works" dir="rtl" className="space-y-8 sm:space-y-12">
      {/* Section heading */}
      <div className="space-y-3 text-center max-w-2xl mx-auto px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 ring-1 ring-primary/20 text-[11px] sm:text-xs font-bold text-primary uppercase tracking-widest">
          <Sparkles className="h-3 w-3" />
          لماذا Fekrah PayLater؟
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
          تمويل تعليمي بمعايير{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, hsl(220 80% 35%), hsl(280 70% 50%), hsl(190 80% 45%))' }}
          >
            البنوك العالمية
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          نظام تمويل داخلي مستقل صُمّم خصيصًا للطلاب والباحثين، يحاكي تجربة Tabby و Tamara و Klarna —
          لكن بدون فوائد، وبضمانات نظامية صارمة.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
          >
            <Card className="group relative overflow-hidden p-5 sm:p-6 border-border/60 hover:border-primary/40 hover:shadow-xl transition-all h-full rounded-2xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div
                  className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br ${f.iconBg} text-white flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform`}
                >
                  <f.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-1.5">{f.title}</h3>
                <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Banner with customer image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden border-0 rounded-3xl shadow-xl">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, hsl(220 70% 18%) 0%, hsl(260 60% 28%) 60%, hsl(190 70% 35%) 100%)',
            }}
          />
          <div className="relative grid md:grid-cols-2 gap-0 min-h-[280px]">
            {/* Image side */}
            <div
              className="hidden md:block bg-cover bg-center"
              style={{
                backgroundImage: `url(${customerImg})`,
                maskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)',
              }}
              aria-hidden
            />
            {/* Content side */}
            <div className="p-6 sm:p-8 md:p-10 text-white flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 ring-1 ring-amber-300/40 text-[10px] sm:text-xs font-bold text-amber-200 uppercase tracking-wider w-fit mb-3">
                <Sparkles className="h-3 w-3" />
                مصمّم للطلاب والباحثين
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 leading-tight">
                ما يوقفك عن إكمال رسالتك؟ نحن نموّلها.
              </h3>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed mb-4">
                خدمات الترجمة الأكاديمية، التدقيق اللغوي، نشر الأبحاث، وتحليل البيانات —
                كلها قابلة للتقسيط الآن. ابدأ رحلتك العلمية بدون قلق مالي.
              </p>
              <div className="flex flex-wrap gap-3 text-[11px] sm:text-xs">
                {['ترجمة أكاديمية', 'نشر سكوبس', 'تحليل بيانات', 'تدقيق لغوي'].map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-white/10 ring-1 ring-white/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* How it works — 5 steps */}
      <div className="space-y-5">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black mb-2">كيف يعمل التمويل؟</h2>
          <p className="text-sm text-muted-foreground">5 خطوات بسيطة من الطلب إلى تفعيل الرصيد</p>
        </div>
        <div className="relative">
          {/* Progress line — desktop only */}
          <div
            aria-hidden
            className="hidden md:block absolute top-7 right-[10%] left-[10%] h-0.5 bg-gradient-to-l from-primary/10 via-primary/40 to-primary/10"
          />
          <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 130 }}
                className="text-center"
              >
                <div className="relative mx-auto h-14 w-14 sm:h-16 sm:w-16 mb-3">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'linear-gradient(135deg, hsl(220 80% 35%), hsl(260 70% 50%), hsl(190 80% 45%))',
                    }}
                  />
                  <div className="absolute inset-[3px] rounded-full bg-background flex items-center justify-center">
                    <s.icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center ring-2 ring-background shadow-md">
                    {s.i}
                  </div>
                </div>
                <h4 className="font-bold text-sm sm:text-base mb-1">{s.t}</h4>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug px-1">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust shields banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden border-0 rounded-3xl shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${shieldsImg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/95 via-slate-900/90 to-slate-950/95" />
          <div className="relative p-6 sm:p-8 md:p-10 text-white text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3">
              حماية بمعايير المؤسسات المالية
            </h3>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed mb-6">
              تشفير TLS 1.3 · تحقّق ثنائي · توقيع رقمي SHA-256 · سجلّات أدلّة موثّقة بـ Hash · امتثال كامل لأنظمة المملكة
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
              {[
                'متوافق مع نظام المعاملات الإلكترونية',
                'لائحة حماية المستهلك',
                'نظام التنفيذ السعودي',
                'مبادئ الإقراض المسؤول',
              ].map((c) => (
                <span
                  key={c}
                  className="px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-md"
                >
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

export default FinancingFeatures;
