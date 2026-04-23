import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Loader2,
  User,
  CreditCard,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  IdCard,
  FileText,
  Sparkles,
  Lock,
  Wallet,
  TrendingUp,
  Receipt,
  ScrollText,
  AlertTriangle,
  Gavel,
  Building2,
  Landmark,
  GraduationCap,
  Stethoscope,
  Cpu,
  ShoppingBag,
  Hammer,
  Plane,
  HeartHandshake,
  Factory,
  Scale,
  Users,
  UserCheck,
  Zap,
} from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// === Saudi market: employment sectors (banking-style classification) ===
const EMPLOYMENT_SECTORS = [
  { value: 'government', label: 'القطاع الحكومي', icon: Landmark, color: 'text-emerald-600' },
  { value: 'military', label: 'العسكري والأمني', icon: ShieldCheck, color: 'text-emerald-700' },
  { value: 'banking', label: 'البنوك والمالية', icon: Building2, color: 'text-blue-600' },
  { value: 'oil_gas', label: 'النفط والغاز (أرامكو/سابك)', icon: Factory, color: 'text-amber-600' },
  { value: 'tech', label: 'تقنية المعلومات', icon: Cpu, color: 'text-violet-600' },
  { value: 'healthcare', label: 'الصحة والمستشفيات', icon: Stethoscope, color: 'text-rose-600' },
  { value: 'education', label: 'التعليم والجامعات', icon: GraduationCap, color: 'text-indigo-600' },
  { value: 'retail', label: 'التجزئة والتجارة', icon: ShoppingBag, color: 'text-orange-600' },
  { value: 'construction', label: 'المقاولات والبناء', icon: Hammer, color: 'text-yellow-700' },
  { value: 'aviation', label: 'الطيران والنقل', icon: Plane, color: 'text-sky-600' },
  { value: 'hospitality', label: 'الضيافة والسياحة', icon: HeartHandshake, color: 'text-pink-600' },
  { value: 'legal', label: 'القانوني والاستشاري', icon: Scale, color: 'text-slate-700' },
  { value: 'self_employed', label: 'أعمال حرة / مستقل', icon: UserCheck, color: 'text-teal-600' },
  { value: 'private', label: 'القطاع الخاص (آخر)', icon: Briefcase, color: 'text-primary' },
  { value: 'unemployed', label: 'حالياً بدون عمل', icon: Users, color: 'text-muted-foreground' },
] as const;

const SAUDI_CITIES = [
  'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر',
  'الظهران', 'الطائف', 'تبوك', 'بريدة', 'حائل', 'أبها', 'خميس مشيط',
  'جازان', 'نجران', 'الجبيل', 'ينبع', 'الأحساء', 'القطيف', 'عرعر',
  'سكاكا', 'الباحة', 'القصيم', 'الخرج', 'حفر الباطن', 'أخرى',
];

const QUICK_AMOUNTS = [2500, 5000, 10000, 20000, 50000, 100000];
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import {
  FINANCING_DISCLAIMER_AR,
  FINANCING_DOC_LABELS_AR,
  FINANCING_MIN_AMOUNT,
  computeFinancingPreview,
} from '@/lib/financing';
import {
  APPLICANT_CATEGORIES,
  ApplicantCategory,
  calculateCreditScore,
  SECTOR_RISK_MAP,
} from '@/lib/creditScoring';
import { CreditScoreCard } from '@/components/financing/CreditScoreCard';

const formSchema = z.object({
  applicant_full_name: z.string().trim().min(3, 'الاسم الكامل مطلوب').max(120),
  applicant_id_number: z.string().trim().min(8, 'رقم هوية غير صالح').max(20),
  applicant_phone: z.string().trim().min(9, 'رقم جوال غير صالح').max(20),
  applicant_email: z.string().trim().email('بريد غير صالح').max(160),
  employer_name: z.string().trim().min(2, 'جهة العمل مطلوبة').max(120),
  monthly_income: z.coerce.number().min(0, 'الدخل لا يمكن أن يكون سالبًا'),
  monthly_commitments: z.coerce.number().min(0).default(0),
  city: z.string().trim().min(2, 'المدينة مطلوبة').max(60),
  notes: z.string().max(500).optional().nullable(),
});

type DocKey = 'id_front' | 'id_back' | 'bank_statement' | 'proof_of_income';
const REQUIRED_DOCS: DocKey[] = ['id_front', 'id_back', 'bank_statement'];
const OPTIONAL_DOCS: DocKey[] = ['proof_of_income'];

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 2 }).format(n);

const STEPS = [
  { n: 1, label: 'البيانات الشخصية', icon: User, color: 'from-sky-500 to-blue-600' },
  { n: 2, label: 'المستندات الرسمية', icon: FileText, color: 'from-violet-500 to-purple-600' },
  { n: 3, label: 'الإقرار والإرسال', icon: Gavel, color: 'from-emerald-500 to-teal-600' },
] as const;

const FinancingNew: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const initialAmount = Number(params.get('amount') || 0) || FINANCING_MIN_AMOUNT;
  const orderId = params.get('orderId') || undefined;
  const invoiceId = params.get('invoiceId') || undefined;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [form, setForm] = useState({
    applicant_full_name: '',
    applicant_id_number: '',
    applicant_phone: '',
    applicant_email: user?.email ?? '',
    applicant_category: '' as ApplicantCategory | '',
    applicant_age: '' as number | '',
    employment_years: '' as number | '',
    has_guarantor: false,
    employer_sector: '',
    employer_name: '',
    monthly_income: '' as number | '',
    monthly_commitments: '' as number | '',
    city: '',
    notes: '',
  });
  const [files, setFiles] = useState<Partial<Record<DocKey, File>>>({});
  const [agreed, setAgreed] = useState({
    terms: false,
    dataUse: false,
    walletCredit: false,
    noDelay: false,
    executionDeed: false,
  });

  const preview = useMemo(() => computeFinancingPreview(amount), [amount]);

  // ===== التقييم الائتماني التلقائي =====
  const creditScore = useMemo(() => {
    if (!form.applicant_category || !form.monthly_income || Number(form.monthly_income) <= 0) {
      return null;
    }
    return calculateCreditScore({
      category: form.applicant_category as ApplicantCategory,
      monthlyIncome: Number(form.monthly_income) || 0,
      monthlyCommitments: Number(form.monthly_commitments) || 0,
      requestedAmount: amount,
      durationMonths: preview.duration,
      age: form.applicant_age ? Number(form.applicant_age) : undefined,
      employmentYears: form.employment_years ? Number(form.employment_years) : undefined,
      hasGuarantor: form.has_guarantor,
      sectorRisk: form.employer_sector ? SECTOR_RISK_MAP[form.employer_sector] : undefined,
    });
  }, [
    form.applicant_category, form.monthly_income, form.monthly_commitments,
    form.applicant_age, form.employment_years, form.has_guarantor,
    form.employer_sector, amount, preview.duration,
  ]);

  useEffect(() => {
    document.title = 'طلب تمويل جديد — Master PayLater';
  }, []);

  const setField = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const validateStep1 = () => {
    if (amount < FINANCING_MIN_AMOUNT) {
      toast({ title: 'مبلغ غير مؤهل', description: `الحد الأدنى ${fmt(FINANCING_MIN_AMOUNT)} ر.س`, variant: 'destructive' });
      return false;
    }
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: 'بيانات ناقصة', description: parsed.error.issues[0]?.message, variant: 'destructive' });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    for (const d of REQUIRED_DOCS) {
      if (!files[d]) {
        toast({ title: 'مستند مطلوب', description: FINANCING_DOC_LABELS_AR[d], variant: 'destructive' });
        return false;
      }
    }
    return true;
  };

  const validateStep3 = () => {
    if (!agreed.terms || !agreed.dataUse || !agreed.walletCredit || !agreed.noDelay || !agreed.executionDeed) {
      toast({ title: 'الإقرارات مطلوبة', description: 'يرجى تأكيد جميع الإقرارات الخمسة', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;

    setSubmitting(true);
    try {
      const parsed = formSchema.parse(form);
      const { data: app, error: appErr } = await supabase
        .from('financing_applications')
        .insert({
          user_id: user.id,
          order_id: orderId,
          invoice_id: invoiceId,
          total_amount: amount,
          status: 'submitted',
          ...parsed,
        })
        .select('id')
        .single();
      if (appErr || !app) throw appErr ?? new Error('فشل إنشاء الطلب');

      const docRows: Array<{
        application_id: string;
        document_type: DocKey;
        file_url: string;
        file_name: string;
        mime_type: string;
      }> = [];
      for (const dk of [...REQUIRED_DOCS, ...OPTIONAL_DOCS]) {
        const f = files[dk];
        if (!f) continue;
        const ext = f.name.split('.').pop() || 'bin';
        const path = `${user.id}/${app.id}/${dk}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('financing-documents')
          .upload(path, f, { upsert: true, contentType: f.type });
        if (upErr) throw upErr;
        docRows.push({
          application_id: app.id,
          document_type: dk,
          file_url: path,
          file_name: f.name,
          mime_type: f.type,
        });
      }

      if (docRows.length > 0) {
        const { error: docsErr } = await supabase.from('financing_documents').insert(docRows);
        if (docsErr) throw docsErr;
      }

      toast({
        title: '✅ تم استلام طلبك بنجاح',
        description: 'سيبدأ فريق التقييم الائتماني بمراجعة طلبك خلال 24 ساعة.',
      });
      navigate('/financing');
    } catch (e: any) {
      toast({ title: 'حدث خطأ', description: e?.message ?? 'فشل إرسال الطلب', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = ((step - 1) / 2) * 100;

  return (
    <ClientLayout>
      <div dir="rtl" className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            to="/financing"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" /> رجوع للوحة التمويل
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Badge className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground border-0">
              <Sparkles className="ml-1 h-3 w-3" /> Master PayLater
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Lock className="ml-1 h-3 w-3" /> نظام مشفّر · موثّق قانونيًا
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 bg-gradient-to-l from-foreground to-foreground/70 bg-clip-text">
            طلب تمويل جديد
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            تقسيط ذكي على 12 شهرًا برصيد محفظة المنصة — إجراءات سريعة وموثّقة
          </p>
        </motion.div>

        {/* Animated step indicator */}
        <Card className="p-5 border-border/60 bg-gradient-to-br from-card to-muted/20 overflow-hidden relative">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-1/2 -translate-y-1/2 right-6 left-6 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-l from-primary to-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              />
            </div>

            <div className="relative flex items-center justify-between">
              {STEPS.map((s) => {
                const active = step === s.n;
                const done = step > s.n;
                return (
                  <div key={s.n} className="flex flex-col items-center gap-2 z-10">
                    <motion.div
                      animate={
                        active
                          ? { scale: [1, 1.08, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 1.6, repeat: active ? Infinity : 0 }}
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-lg transition-all ${
                        done
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                          : active
                          ? `bg-gradient-to-br ${s.color} text-white ring-4 ring-primary/20`
                          : 'bg-muted text-muted-foreground ring-1 ring-border'
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                    </motion.div>
                    <div className="text-center">
                      <div className={`text-[10px] font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                        الخطوة {s.n}
                      </div>
                      <div className={`text-xs font-bold ${active || done ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {s.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <Card className="p-4 border-primary/30 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm leading-relaxed">{FINANCING_DISCLAIMER_AR}</p>
            </div>
          </Card>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 md:p-7 space-y-6 border-border/60">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">بيانات التمويل والمتقدم</h2>
                    <p className="text-xs text-muted-foreground">جميع الحقول إلزامية لتقييم الأهلية</p>
                  </div>
                </div>

                {/* Amount block — premium with quick presets */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5 ring-1 ring-primary/30 relative overflow-hidden"
                >
                  <motion.div
                    className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <Label htmlFor="amount" className="flex items-center gap-2 text-base font-bold">
                        <Wallet className="h-4 w-4 text-primary" />
                        مبلغ التمويل المطلوب
                      </Label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge className="text-[10px] gap-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">
                          <Sparkles className="h-3 w-3" /> بدون فوائد · APR 0%
                        </Badge>
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <Zap className="h-3 w-3 text-primary" /> اختر مبلغ سريع
                        </Badge>
                      </div>
                    </div>

                    {/* Quick amount chips */}
                    {!orderId && !invoiceId && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {QUICK_AMOUNTS.map((q) => {
                          const active = amount === q;
                          return (
                            <motion.button
                              key={q}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setAmount(q)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ring-1 ${
                                active
                                  ? 'bg-primary text-primary-foreground ring-primary shadow-md'
                                  : 'bg-background text-foreground ring-border hover:ring-primary/50'
                              }`}
                            >
                              {fmt(q)} ر.س
                            </motion.button>
                          );
                        })}
                      </div>
                    )}

                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        min={FINANCING_MIN_AMOUNT}
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        disabled={!!orderId || !!invoiceId}
                        className="h-14 text-2xl font-bold pl-20 bg-background"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                        ر.س
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      الحد الأدنى: {fmt(FINANCING_MIN_AMOUNT)} ر.س · حدّ أعلى: 100,000 ر.س
                    </p>

                    {/* شرائح المدة */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { range: '2,500 — 10,000', months: '6 أشهر', min: 2500, max: 10000 },
                        { range: '10,001 — 25,000', months: 'سنة كاملة', min: 10001, max: 25000 },
                        { range: '25,001 — 100,000', months: '3 سنوات', min: 25001, max: 100000 },
                      ].map((tier, i) => {
                        const active = amount >= tier.min && amount <= tier.max;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`rounded-xl p-3 ring-1 transition-all ${
                              active
                                ? 'bg-primary/10 ring-primary shadow-sm'
                                : 'bg-background/60 ring-border/60'
                            }`}
                          >
                            <div className="text-[10px] text-muted-foreground mb-1">{tier.range} ر.س</div>
                            <div className={`text-xs font-bold ${active ? 'text-primary' : 'text-foreground'}`}>
                              {tier.months}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>

                {/* Personal info grid */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-3">
                    <User className="h-4 w-4" /> البيانات الشخصية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldGroup icon={User} label="الاسم الكامل (كما في الهوية)">
                      <Input
                        value={form.applicant_full_name}
                        onChange={(e) => setField('applicant_full_name', e.target.value)}
                        placeholder="مثال: محمد عبدالله السالم"
                      />
                    </FieldGroup>
                    <FieldGroup icon={IdCard} label="رقم الهوية / الإقامة">
                      <Input
                        value={form.applicant_id_number}
                        onChange={(e) => setField('applicant_id_number', e.target.value)}
                        placeholder="10 أرقام"
                        inputMode="numeric"
                      />
                    </FieldGroup>
                    <FieldGroup icon={Phone} label="رقم الجوال">
                      <Input
                        type="tel"
                        value={form.applicant_phone}
                        onChange={(e) => setField('applicant_phone', e.target.value)}
                        placeholder="9665xxxxxxxx"
                        dir="ltr"
                      />
                    </FieldGroup>
                    <FieldGroup icon={Mail} label="البريد الإلكتروني">
                      <Input
                        type="email"
                        value={form.applicant_email}
                        onChange={(e) => setField('applicant_email', e.target.value)}
                        placeholder="example@email.com"
                        dir="ltr"
                      />
                    </FieldGroup>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-2 mb-3">
                    <Briefcase className="h-4 w-4" /> البيانات المهنية والمالية
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Employment sector — banking-style select with icons */}
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        قطاع جهة العمل
                      </Label>
                      <Select
                        dir="rtl"
                        value={form.employer_sector}
                        onValueChange={(v) => setField('employer_sector', v)}
                      >
                        <SelectTrigger className="h-11 text-right [&>span]:text-right [&>span]:flex-1 [&>span]:mr-0">
                          <SelectValue placeholder="اختر القطاع المهني..." />
                        </SelectTrigger>
                        <SelectContent dir="rtl" className="text-right">
                          {EMPLOYMENT_SECTORS.map((s) => (
                            <SelectItem key={s.value} value={s.value} className="text-right">
                              <div className="flex items-center gap-2 flex-row-reverse justify-start w-full">
                                <s.icon className={`h-4 w-4 ${s.color}`} />
                                <span>{s.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <FieldGroup icon={Briefcase} label="اسم جهة العمل / الشركة">
                      <Input
                        value={form.employer_name}
                        onChange={(e) => setField('employer_name', e.target.value)}
                        placeholder="مثال: أرامكو السعودية"
                      />
                    </FieldGroup>
                    <FieldGroup icon={MapPin} label="المدينة">
                      <Select
                        dir="rtl"
                        value={form.city}
                        onValueChange={(v) => setField('city', v)}
                      >
                        <SelectTrigger className="h-11 text-right [&>span]:text-right [&>span]:flex-1 [&>span]:mr-0">
                          <SelectValue placeholder="اختر المدينة..." />
                        </SelectTrigger>
                        <SelectContent dir="rtl" className="max-h-72 text-right">
                          {SAUDI_CITIES.map((c) => (
                            <SelectItem key={c} value={c} className="text-right">
                              <div className="flex items-center gap-2 flex-row-reverse justify-start w-full">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                {c}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldGroup>
                    <FieldGroup icon={TrendingUp} label="الدخل الشهري (ر.س)">
                      <Input
                        type="number"
                        min={0}
                        value={form.monthly_income}
                        onChange={(e) => setField('monthly_income', e.target.value)}
                        placeholder="0"
                      />
                    </FieldGroup>
                    <FieldGroup icon={Receipt} label="الالتزامات الشهرية (ر.س)">
                      <Input
                        type="number"
                        min={0}
                        value={form.monthly_commitments}
                        onChange={(e) => setField('monthly_commitments', e.target.value)}
                        placeholder="0"
                      />
                    </FieldGroup>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold mb-1.5 block">ملاحظات إضافية (اختياري)</Label>
                      <Textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setField('notes', e.target.value)}
                        placeholder="أي معلومات تساعد في تقييم طلبك..."
                      />
                    </div>
                  </div>
                </div>

                {/* Live preview */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-gradient-to-br from-muted/60 to-muted/20 p-5 ring-1 ring-border"
                >
                  <div className="text-sm font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    الخطة التمويلية المقترحة
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'الإجمالي', value: `${fmt(preview.total)} ر.س`, color: 'text-foreground' },
                      { label: 'الدفعة الأولى (20%)', value: `${fmt(preview.downPayment)} ر.س`, color: 'text-primary' },
                      { label: 'القسط الشهري', value: `${fmt(preview.monthly)} ر.س`, color: 'text-primary' },
                      { label: 'المدة', value: `${preview.duration} شهر`, color: 'text-foreground' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                        className="rounded-xl bg-background p-3 ring-1 ring-border/60 text-center"
                      >
                        <div className="text-[10px] text-muted-foreground mb-1.5 font-medium">{item.label}</div>
                        <div className={`font-bold text-sm ${item.color}`}>{item.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="lg"
                    onClick={() => validateStep1() && setStep(2)}
                    className="bg-gradient-to-l from-primary to-primary/80 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    التالي: المستندات
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 md:p-7 space-y-6 border-border/60">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">المستندات الرسمية المطلوبة</h2>
                    <p className="text-xs text-muted-foreground">PDF أو صور واضحة · مخزّنة بتشفير كامل</p>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-500/10 ring-1 ring-amber-500/30 p-3 flex items-start gap-2">
                  <Lock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                    جميع مستنداتك محمية بتشفير AES-256 ولن يطّلع عليها سوى فريق التقييم الائتماني المعتمد.
                  </p>
                </div>

                <div className="space-y-3">
                  {[...REQUIRED_DOCS, ...OPTIONAL_DOCS].map((dk, idx) => {
                    const uploaded = !!files[dk];
                    const required = REQUIRED_DOCS.includes(dk);
                    return (
                      <motion.div
                        key={dk}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className={`rounded-xl border-2 p-4 transition-all ${
                          uploaded
                            ? 'border-emerald-500/40 bg-emerald-500/5'
                            : 'border-border/60 hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                          <Label className="font-bold text-sm flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {FINANCING_DOC_LABELS_AR[dk]}
                            {required && (
                              <Badge variant="destructive" className="text-[9px] h-4">إلزامي</Badge>
                            )}
                            {!required && (
                              <Badge variant="outline" className="text-[9px] h-4">اختياري</Badge>
                            )}
                          </Label>
                          {uploaded && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> تم الرفع
                            </motion.span>
                          )}
                        </div>
                        <label className="cursor-pointer block">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) setFiles((prev) => ({ ...prev, [dk]: f }));
                            }}
                          />
                          <div
                            className={`flex items-center justify-center gap-2 rounded-lg border-2 border-dashed py-4 text-sm transition-colors ${
                              uploaded
                                ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                                : 'border-border hover:border-primary hover:bg-primary/5 text-muted-foreground'
                            }`}
                          >
                            <Upload className="h-4 w-4" />
                            <span className="font-medium">
                              {files[dk]?.name ?? 'اضغط لرفع الملف (PDF / JPG / PNG)'}
                            </span>
                          </div>
                        </label>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} size="lg">
                    <ArrowRight className="ml-2 h-4 w-4" /> السابق
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => validateStep2() && setStep(3)}
                    className="bg-gradient-to-l from-primary to-primary/80 shadow-lg"
                  >
                    التالي: الإقرارات
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 md:p-7 space-y-6 border-border/60">
                <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                    <Gavel className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">الإقرارات القانونية النهائية</h2>
                    <p className="text-xs text-muted-foreground">إقرارات مُلزِمة قانونيًا — يُرجى القراءة بعناية</p>
                  </div>
                </div>

                {/* Strict warning */}
                <div className="rounded-xl bg-gradient-to-l from-rose-500/10 to-rose-500/5 ring-1 ring-rose-500/30 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 mt-0.5 shrink-0" />
                    <div className="text-xs leading-relaxed">
                      <strong className="text-rose-700 dark:text-rose-300 block mb-1">
                        تنبيه قانوني صارم:
                      </strong>
                      التمويل التزام مالي رسمي. أي تأخير يتجاوز <strong>24 ساعة</strong> عن موعد القسط
                      يُفعّل تلقائيًا مسار الإحالة لمحكمة التنفيذ وفق السند التنفيذي المُوقَّع.
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <AckRow
                    icon={ScrollText}
                    checked={agreed.terms}
                    onChange={(v) => setAgreed((a) => ({ ...a, terms: v }))}
                    title="الموافقة على شروط Master PayLater"
                    text="أوافق على كافة شروط وأحكام Master PayLater وعلى توقيع العقد إلكترونيًا بصفة مُلزِمة بعد موافقة الإدارة."
                  />
                  <AckRow
                    icon={ShieldCheck}
                    checked={agreed.dataUse}
                    onChange={(v) => setAgreed((a) => ({ ...a, dataUse: v }))}
                    title="استخدام البيانات للتقييم الائتماني"
                    text="أوافق على استخدام بياناتي المالية والشخصية لأغراض تقييم الأهلية والتحقق عبر القنوات المعتمدة (واتساب / البريد)."
                  />
                  <AckRow
                    icon={Wallet}
                    checked={agreed.walletCredit}
                    onChange={(v) => setAgreed((a) => ({ ...a, walletCredit: v }))}
                    title="طبيعة الرصيد: داخلي وليس نقديًا"
                    text="أُقرّ بأن التمويل ليس مبلغًا نقديًا، وإنما رصيد داخلي يُضاف إلى محفظتي ويُستخدم فقط في سداد خدمات المنصة."
                    highlight
                  />
                  <AckRow
                    icon={AlertTriangle}
                    checked={agreed.noDelay}
                    onChange={(v) => setAgreed((a) => ({ ...a, noDelay: v }))}
                    title="إقرار بعدم التأخر في السداد"
                    text="أتعهد بسداد الأقساط في مواعيدها وأُقرّ بأن أي تأخير +24 ساعة يستوجب إجراءات صارمة وإحالة للمحكمة التنفيذية."
                    danger
                  />
                  <AckRow
                    icon={Gavel}
                    checked={agreed.executionDeed}
                    onChange={(v) => setAgreed((a) => ({ ...a, executionDeed: v }))}
                    title="الموافقة على إصدار سند تنفيذي"
                    text="أُقرّ وأوافق على إصدار سند تنفيذي بقيمة الأقساط المتبقية يُنفَّذ مباشرة عبر محكمة التنفيذ السعودية عند الإخلال."
                    danger
                  />
                </div>

                {/* Final summary */}
                <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-5 ring-1 ring-primary/30">
                  <div className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-primary" />
                    ملخص الطلب قبل الإرسال
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
                    <SummaryItem label="المبلغ الإجمالي" value={`${fmt(preview.total)} ر.س`} />
                    <SummaryItem label="الدفعة الأولى" value={`${fmt(preview.downPayment)} ر.س`} />
                    <SummaryItem label="القسط الشهري" value={`${fmt(preview.monthly)} ر.س`} primary />
                    <SummaryItem label="المدة" value={`${preview.duration} شهر`} />
                  </div>
                </div>

                <div className="flex justify-between pt-2 flex-wrap gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} disabled={submitting} size="lg">
                    <ArrowRight className="ml-2 h-4 w-4" /> السابق
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    size="lg"
                    className="bg-gradient-to-l from-emerald-600 to-teal-600 shadow-lg hover:shadow-xl text-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإرسال…
                      </>
                    ) : (
                      <>
                        <Sparkles className="ml-2 h-4 w-4" /> إرسال طلب التمويل
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClientLayout>
  );
};

const FieldGroup: React.FC<{
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}> = ({ icon: Icon, label, children }) => (
  <div>
    <Label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      {label}
    </Label>
    {children}
  </div>
);

const AckRow: React.FC<{
  icon: React.ElementType;
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  text: string;
  highlight?: boolean;
  danger?: boolean;
}> = ({ icon: Icon, checked, onChange, title, text, highlight, danger }) => (
  <motion.label
    whileHover={{ scale: 1.005 }}
    className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
      checked
        ? danger
          ? 'border-rose-500/50 bg-rose-500/5'
          : highlight
          ? 'border-primary/50 bg-primary/10'
          : 'border-emerald-500/40 bg-emerald-500/5'
        : danger
        ? 'border-rose-500/20 hover:border-rose-500/40 bg-rose-500/[0.02]'
        : highlight
        ? 'border-primary/30 bg-primary/5'
        : 'border-border/60 hover:border-primary/40 hover:bg-muted/30'
    }`}
  >
    <Checkbox
      checked={checked}
      onCheckedChange={(v) => onChange(!!v)}
      className="mt-1 shrink-0"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <Icon
          className={`h-4 w-4 shrink-0 ${
            danger ? 'text-rose-600 dark:text-rose-400' : highlight ? 'text-primary' : 'text-muted-foreground'
          }`}
        />
        <div className="font-bold text-sm">{title}</div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pr-6">{text}</p>
    </div>
  </motion.label>
);

const SummaryItem: React.FC<{ label: string; value: string; primary?: boolean }> = ({
  label,
  value,
  primary,
}) => (
  <div className="flex items-center justify-between rounded-lg bg-background/70 px-3 py-2 ring-1 ring-border/60">
    <span className="text-muted-foreground text-xs">{label}</span>
    <span className={`font-bold text-sm ${primary ? 'text-primary' : 'text-foreground'}`}>{value}</span>
  </div>
);

export default FinancingNew;
