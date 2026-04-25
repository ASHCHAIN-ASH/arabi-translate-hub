import React from 'react';
import { motion } from 'framer-motion';
import {
  Scale, FileSignature, Banknote, AlertTriangle, ShieldAlert,
  Gavel, Users, Calendar, Percent, Lock,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const TERMS = [
  {
    icon: Banknote,
    title: 'حدود التمويل',
    items: [
      'الحد الأدنى للتمويل: 2,500 ر.س',
      'الحد الأعلى للتمويل: 100,000 ر.س',
      'الدفعة الأولى: 25% من إجمالي مبلغ التمويل',
      'يُستخدم الرصيد فقط لخدمات منصة ماستر',
    ],
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: Calendar,
    title: 'مدة السداد',
    items: [
      '2,500 — 10,000 ر.س → 6 أشهر',
      '10,001 — 25,000 ر.س → 12 شهرًا',
      '25,001 — 100,000 ر.س → 36 شهرًا',
      'أقساط شهرية متساوية وثابتة لا تتغير',
    ],
    color: 'from-violet-500 to-fuchsia-600',
  },
  {
    icon: Percent,
    title: 'الفوائد والرسوم',
    items: [
      'بدون فوائد ربوية — APR 0%',
      'بدون رسوم خفية أو رسوم إدارية',
      'تسدد المبلغ الأصلي فقط',
      'متوافق ١٠٠٪ مع أحكام الشريعة الإسلامية',
    ],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: FileSignature,
    title: 'العقد والتوقيع',
    items: [
      'عقد نظامي إلكتروني بالتوقيع الرقمي',
      'حجّية كاملة بموجب نظام المعاملات الإلكترونية',
      'يُحفظ بـ Hash SHA-256 وأدلّة موثّقة',
      'يصدر نسخة PDF موقّعة لكلا الطرفين',
    ],
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: AlertTriangle,
    title: 'التأخر في السداد',
    items: [
      'مهلة سماح 24 ساعة بعد تاريخ الاستحقاق',
      'إنذار رسمي عبر الواتساب والإيميل',
      'تجميد الخدمات حتى السداد',
      'إحالة للجهات المختصة عند تكرار التأخر',
    ],
    color: 'from-rose-500 to-red-600',
  },
  {
    icon: Gavel,
    title: 'السند التنفيذي',
    items: [
      'العقد سند تنفيذي بقوة الحكم القضائي',
      'إحالة لمحكمة التنفيذ عند التعثر',
      'أتعاب محاماة 5,000 ر.س عند الإحالة',
      'تُسجّل سجلّات الائتمان لدى سمة',
    ],
    color: 'from-slate-700 to-slate-900',
  },
  {
    icon: Users,
    title: 'الأهلية والكفيل',
    items: [
      'سعودي/مقيم نظامي 18 سنة فأكثر',
      'مصدر دخل ثابت موثّق',
      'كفيل غارم لطلبات +25,000 ر.س',
      'حساب بنكي نشط باسم العميل',
    ],
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Lock,
    title: 'حماية البيانات',
    items: [
      'تشفير TLS 1.3 لجميع البيانات',
      'لا تُشارك بياناتك مع أي طرف ثالث',
      'حق الوصول والحذف وفق نظام حماية البيانات',
      'سجلّات تدقيق دائمة لكل عملية',
    ],
    color: 'from-indigo-500 to-violet-600',
  },
];

const FinancingTerms: React.FC = () => {
  return (
    <section dir="rtl" className="space-y-6 sm:space-y-8">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto space-y-2 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 ring-1 ring-amber-500/30 text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest">
          <Scale className="h-3 w-3" />
          الشروط والأحكام
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
          شروط وقوانين التمويل الداخلي
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          نظام تمويل صارم بضمانات قانونية كاملة — اقرأ الشروط بعناية قبل تقديم الطلب.
        </p>
      </div>

      {/* Important warning banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <Card className="relative overflow-hidden border-0 rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-l from-amber-500/15 via-orange-500/10 to-rose-500/15" />
          <div className="absolute inset-0 ring-1 ring-amber-500/30 rounded-2xl pointer-events-none" />
          <div className="relative p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base mb-1 text-amber-900 dark:text-amber-200">
                إقرار وتعهّد قبل التقديم
              </h3>
              <p className="text-[12px] sm:text-sm text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                التمويل التزام نظامي. بمجرد توقيعك للعقد رقميًا، يصبح ملزِمًا قانونًا بقوة السند
                التنفيذي. الالتزام بمواعيد السداد أمانة، والتأخر يُعرّضك لإجراءات صارمة قد تصل
                إلى محكمة التنفيذ وتسجيل سجلّك الائتماني.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Terms grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TERMS.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: i * 0.05, duration: 0.45 }}
          >
            <Card className="group relative overflow-hidden p-4 sm:p-5 border-border/60 hover:border-primary/40 hover:shadow-lg transition-all h-full rounded-2xl">
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${t.color}`} />
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className={`h-9 w-9 rounded-lg bg-gradient-to-br ${t.color} text-white flex items-center justify-center shadow-md shrink-0`}
                >
                  <t.icon className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm sm:text-[15px] leading-tight">{t.title}</h3>
              </div>
              <ul className="space-y-1.5 text-[12px] sm:text-[13px] text-muted-foreground leading-relaxed">
                {t.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-primary mt-0.5 text-[10px]">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FinancingTerms;
