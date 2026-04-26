import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Sparkles, ShieldCheck, Clock, ArrowLeft,
  CheckCircle2, FileSignature, Smartphone, Calculator,
  Info, Coins, CalendarClock, Percent,
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
import happyFamily from '@/assets/financing-happy-family.jpg';
import signingContract from '@/assets/financing-signing-contract.jpg';
import realCustomer from '@/assets/financing-real-customer.jpg';
import trustShields from '@/assets/financing-trust-shields.jpg';

/**
 * قسم Master PayLater للصفحة الرئيسية
 * - حاسبة قسط فورية تفاعلية
 * - 3 صور واقعية (تقديم، توقيع، استخدام)
 * - APR 0% — رصيد داخلي يُضاف للمحفظة
 */

const fmt = (n: number) => Math.round(n).toLocaleString('ar-SA');

const STEPS = [
  {
    n: 1,
    icon: Smartphone,
    title: 'قدّم طلبك من جوالك',
    desc: 'املأ بياناتك وارفع المستندات في أقل من 3 دقائق.',
    img: realCustomer,
    badge: 'الخطوة 1',
  },
  {
    n: 2,
    icon: FileSignature,
    title: 'وقّع العقد إلكترونياً',
    desc: 'عقد رقمي موثّق وفق نظام التعاملات الإلكترونية السعودي.',
    img: signingContract,
    badge: 'الخطوة 2',
  },
  {
    n: 3,
    icon: Wallet,
    title: 'رصيدك جاهز للاستخدام',
    desc: 'فور الموافقة يُضاف مبلغ التمويل إلى محفظتك على المنصة.',
    img: happyFamily,
    badge: 'الخطوة 3',
  },
];

const HomeFinancingSection: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(3000);
  const [months, setMonths] = useState<number>(6);

  const monthly = useMemo(() => amount / months, [amount, months]);

  return (
    <section
      dir="rtl"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, hsl(220 70% 12%) 0%, hsl(245 65% 18%) 45%, hsl(195 75% 22%) 100%)',
      }}
    >
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, white 0.5px, transparent 0.5px), radial-gradient(circle at 70% 70%, white 0.5px, transparent 0.5px)',
            backgroundSize: '40px 40px, 60px 60px',
          }}
        />
      </div>
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <Badge className="mb-4 bg-amber-400/15 text-amber-200 border-amber-300/30 px-4 py-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 ml-1" />
            جديد — Master PayLater
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            ادرس الآن، وادفع على دفعات
            <span className="block text-transparent bg-clip-text bg-gradient-to-l from-amber-300 via-yellow-200 to-amber-400 mt-2">
              بدون أي فوائد · APR 0%
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/75 leading-relaxed">
            احصل على رصيد تمويلي يُضاف فوراً إلى محفظتك واستخدمه في أي خدمة أكاديمية —
            بدون تأخير، بدون فوائد، وبموافقة فورية أو خلال 24 ساعة.
          </p>
        </motion.div>

        {/* صف رئيسي: بطاقة + حاسبة */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {/* البطاقة المرئية */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
              <img
                src={paylaterCard}
                alt="بطاقة Master PayLater للتمويل الأكاديمي"
                className="w-full h-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span className="text-[11px] sm:text-xs text-emerald-200 font-semibold">
                    موثّق وفق نظام التعاملات الإلكترونية السعودي
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black mb-1">حتى 5,000 ر.س</div>
                <div className="text-xs sm:text-sm text-white/80">
                  رصيد داخلي قابل للاستخدام في كل خدمات المنصة
                </div>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-xs font-black text-slate-900 shadow-lg">
                APR 0%
              </div>
            </div>

            {/* مميزات سريعة */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
              {[
                { icon: Clock, label: 'موافقة فورية' },
                { icon: Wallet, label: 'رصيد للمحفظة' },
                { icon: ShieldCheck, label: 'بدون فوائد' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 text-center backdrop-blur"
                >
                  <f.icon className="w-4 h-4 mx-auto mb-1 text-cyan-300" />
                  <div className="text-[11px] sm:text-xs font-semibold text-white/90">
                    {f.label}
                  </div>
                </div>
              ))}
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">جرّب القسط فوراً</div>
                  <div className="text-[11px] text-slate-500">
                    حاسبة تفاعلية — التغيير لحظي
                  </div>
                </div>
              </div>

              {/* مبلغ التمويل */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    مبلغ التمويل
                  </label>
                  <span className="text-base font-black text-slate-900 tabular-nums">
                    {fmt(amount)} ر.س
                  </span>
                </div>
                <Slider
                  value={[amount]}
                  onValueChange={(v) => setAmount(v[0])}
                  min={500}
                  max={5000}
                  step={100}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
                  <span>500 ر.س</span>
                  <span>5,000 ر.س</span>
                </div>
              </div>

              {/* مدة السداد */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">
                    مدة السداد
                  </label>
                  <span className="text-base font-black text-slate-900 tabular-nums">
                    {months} أشهر
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 6, 9, 12].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMonths(m)}
                      className={`py-2 rounded-xl text-sm font-bold transition-all ${
                        months === m
                          ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-lg scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* نتيجة القسط */}
              <motion.div
                key={`${amount}-${months}`}
                initial={{ scale: 0.96, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white shadow-xl mb-5"
              >
                <div className="text-xs text-white/80 mb-1">قسطك الشهري</div>
                <div className="text-3xl sm:text-4xl font-black tabular-nums leading-none mb-2">
                  {fmt(monthly)}{' '}
                  <span className="text-base font-bold">ر.س / شهر</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-200 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  بدون فوائد · بدون رسوم خفية · APR 0%
                </div>
              </motion.div>

              <Button
                onClick={() => navigate('/financing/new')}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30 rounded-xl"
              >
                تقديم طلب التمويل الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <p className="text-[11px] text-center text-slate-500 mt-3">
                التقديم لا يستغرق أكثر من 3 دقائق · موافقة فورية أو خلال 24 ساعة
              </p>
            </Card>
          </motion.div>
        </div>

        {/* خطوات التفعيل بصور حقيقية */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              ٣ خطوات فقط للحصول على التمويل
            </h3>
            <p className="text-sm text-white/70">
              تجربة سلسة من البداية للنهاية — رحلة موثقة وآمنة
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
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 aspect-[4/5]">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />

                  {/* رقم الخطوة + الـ badge */}
                  <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 text-slate-900 flex items-center justify-center font-black text-lg shadow-lg">
                    {s.n}
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold flex items-center gap-1 backdrop-blur">
                    <s.icon className="w-3 h-3" />
                    {s.badge}
                  </div>

                  {/* المحتوى */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                    <h4 className="text-lg sm:text-xl font-black mb-1.5">{s.title}</h4>
                    <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* شريط ثقة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-xl relative"
        >
          <img
            src={trustShields}
            alt="رموز الثقة والحماية"
            className="w-full h-32 sm:h-40 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/95 flex items-center">
            <div className="w-full px-5 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-white">
              {[
                { v: 'APR 0%', l: 'بدون فوائد' },
                { v: '5,000', l: 'حد أقصى ر.س' },
                { v: '12', l: 'مدة قصوى (شهر)' },
                { v: '24س', l: 'موافقة قصوى' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums">
                    {s.v}
                  </div>
                  <div className="text-[11px] sm:text-xs text-white/75 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFinancingSection;
