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
import FinancingNewHero from '@/components/financing/FinancingNewHero';
import FinancingStepper from '@/components/financing/FinancingStepper';
import FinancingLiveSummary from '@/components/financing/FinancingLiveSummary';
import AnimatedField from '@/components/financing/AnimatedField';
import SectionHeader from '@/components/financing/SectionHeader';
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
  applicant_id_number: z.string().trim().regex(/^[12]\d{9}$/, 'رقم هوية سعودي غير صالح (10 أرقام يبدأ بـ 1 أو 2)'),
  applicant_phone: z.string().trim().regex(/^(05|9665|\+9665)\d{8}$/, 'جوال سعودي غير صالح'),
  applicant_email: z.string().trim().email('بريد غير صالح').max(160),
  employer_name: z.string().trim().max(120).optional().nullable(),
  monthly_income: z.coerce.number().min(0, 'الدخل لا يمكن أن يكون سالبًا'),
  monthly_commitments: z.coerce.number().min(0).default(0),
  city: z.string().trim().min(2, 'المدينة مطلوبة').max(60),
  notes: z.string().max(500).optional().nullable(),
});

// === صلة قرابة الكفيل ===
const GUARANTOR_RELATIONS = [
  { value: 'father', label: 'والد', icon: '👨' },
  { value: 'mother', label: 'والدة', icon: '👩' },
  { value: 'brother', label: 'أخ', icon: '🧑' },
  { value: 'sister', label: 'أخت', icon: '👩‍🦰' },
  { value: 'spouse', label: 'زوج/ة', icon: '💍' },
  { value: 'relative', label: 'قريب من الدرجة الأولى', icon: '👪' },
  { value: 'employer', label: 'صاحب عمل', icon: '💼' },
  { value: 'friend', label: 'صديق ذو ملاءة', icon: '🤝' },
] as const;

// مخطط صارم للكفيل — يُفعّل فقط عند تفعيل الكفالة
const guarantorSchema = z.object({
  guarantor_full_name: z.string().trim().min(3, 'اسم الكفيل الكامل مطلوب').max(120),
  guarantor_id_number: z.string().trim().regex(/^[12]\d{9}$/, 'رقم هوية الكفيل غير صالح (10 أرقام)'),
  guarantor_phone: z.string().trim().regex(/^(05|9665|\+9665)\d{8}$/, 'جوال الكفيل غير صالح'),
  guarantor_relation: z.string().min(1, 'صلة القرابة مطلوبة'),
  guarantor_employer: z.string().trim().min(2, 'جهة عمل الكفيل مطلوبة').max(120),
  guarantor_monthly_income: z.coerce.number().min(3000, 'الحد الأدنى لدخل الكفيل 3,000 ر.س'),
  guarantor_city: z.string().trim().min(2, 'مدينة الكفيل مطلوبة').max(60),
  guarantor_consent: z.literal(true, { errorMap: () => ({ message: 'موافقة الكفيل إلزامية' }) }),
});

// === المراحل التعليمية للطلاب ===
const STUDENT_LEVELS = [
  { value: 'high_school', label: 'طالب ثانوي', icon: '📚' },
  { value: 'diploma', label: 'دبلوم / كلية تقنية', icon: '🛠️' },
  { value: 'bachelor', label: 'بكالوريوس (جامعة)', icon: '🎓' },
  { value: 'master', label: 'ماجستير', icon: '📖' },
  { value: 'phd', label: 'دكتوراه', icon: '🔬' },
] as const;

// === مصادر دخل المتقاعد ===
const RETIREMENT_SOURCES = [
  { value: 'civil', label: 'تقاعد مدني', icon: '🏛️' },
  { value: 'military', label: 'تقاعد عسكري', icon: '🎖️' },
  { value: 'social_insurance', label: 'تأمينات اجتماعية', icon: '🤝' },
  { value: 'private_pension', label: 'معاش خاص', icon: '💰' },
] as const;

// === أنواع الأعمال الحرة ===
const FREELANCE_TYPES = [
  { value: 'tech_freelance', label: 'تقنية / برمجة', icon: '💻' },
  { value: 'design', label: 'تصميم / محتوى', icon: '🎨' },
  { value: 'consulting', label: 'استشارات', icon: '💡' },
  { value: 'commerce', label: 'تجارة إلكترونية', icon: '🛍️' },
  { value: 'services', label: 'خدمات ميدانية', icon: '🔧' },
  { value: 'other_freelance', label: 'أخرى', icon: '✨' },
] as const;

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
    student_level: '',
    university_name: '',
    student_gpa: '' as number | '',
    retirement_source: '',
    freelance_type: '',
    monthly_income: '' as number | '',
    monthly_commitments: '' as number | '',
    city: '',
    notes: '',
    // === بيانات الكفيل الغارم ===
    guarantor_full_name: '',
    guarantor_id_number: '',
    guarantor_phone: '',
    guarantor_relation: '',
    guarantor_employer: '',
    guarantor_monthly_income: '' as number | '',
    guarantor_city: '',
    guarantor_consent: false,
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

  // === Live field validators (for visual ✓/✗ feedback) ===
  const v = {
    name: form.applicant_full_name.trim().length >= 3,
    nameInvalid: form.applicant_full_name.length > 0 && form.applicant_full_name.trim().length < 3,
    id: /^[12]\d{9}$/.test(form.applicant_id_number.trim()),
    idInvalid: form.applicant_id_number.length > 0 && !/^[12]\d{9}$/.test(form.applicant_id_number.trim()),
    phone: /^(05|9665|\+9665)\d{8}$/.test(form.applicant_phone.trim()),
    phoneInvalid: form.applicant_phone.length > 0 && !/^(05|9665|\+9665)\d{8}$/.test(form.applicant_phone.trim()),
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.applicant_email.trim()),
    emailInvalid: form.applicant_email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.applicant_email.trim()),
    income: Number(form.monthly_income) > 0,
    city: form.city.trim().length >= 2,
  };

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
    // فحص صارم لبيانات الكفيل عند التفعيل
    if (form.has_guarantor) {
      const gParsed = guarantorSchema.safeParse(form);
      if (!gParsed.success) {
        toast({
          title: 'بيانات الكفيل غير مكتملة',
          description: gParsed.error.issues[0]?.message,
          variant: 'destructive',
        });
        return false;
      }
      // الكفيل يجب أن يكون مختلف عن المتقدم
      if (form.guarantor_id_number === form.applicant_id_number) {
        toast({ title: 'تعارض في البيانات', description: 'لا يمكن أن يكون الكفيل هو نفسه المتقدم', variant: 'destructive' });
        return false;
      }
      if (form.guarantor_phone === form.applicant_phone) {
        toast({ title: 'تعارض في البيانات', description: 'جوال الكفيل يجب أن يختلف عن جوال المتقدم', variant: 'destructive' });
        return false;
      }
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
      const guarantorPayload = form.has_guarantor ? {
        has_guarantor: true,
        guarantor_full_name: form.guarantor_full_name.trim(),
        guarantor_id_number: form.guarantor_id_number.trim(),
        guarantor_phone: form.guarantor_phone.trim(),
        guarantor_relation: form.guarantor_relation,
        guarantor_employer: form.guarantor_employer.trim(),
        guarantor_monthly_income: Number(form.guarantor_monthly_income) || 0,
        guarantor_city: form.guarantor_city.trim(),
        guarantor_consent: form.guarantor_consent,
      } : { has_guarantor: false };
      const { data: app, error: appErr } = await supabase
        .from('financing_applications')
        .insert({
          user_id: user.id,
          order_id: orderId,
          invoice_id: invoiceId,
          total_amount: amount,
          status: 'submitted',
          ...parsed,
          ...guarantorPayload,
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
      <div dir="rtl" className="max-w-7xl mx-auto pb-12">
        {/* Banking-grade Hero */}
        <FinancingNewHero step={step} totalSteps={3} />

        {/* Visual Stepper */}
        <div className="mt-6">
          <FinancingStepper current={step} onJump={(s) => setStep(s as 1 | 2 | 3)} />
        </div>

        {/* Two-column layout: form + sticky summary */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mt-6">
          <div className="space-y-6 min-w-0">
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
                    {/* فئة المتقدم — تحدد المعادلة الائتمانية */}
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-primary" />
                        فئة المتقدم
                        <Badge variant="outline" className="text-[9px] gap-1 mr-1">
                          <Sparkles className="h-2.5 w-2.5 text-primary" /> تقييم تلقائي
                        </Badge>
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                        {APPLICANT_CATEGORIES.map((cat) => {
                          const active = form.applicant_category === cat.value;
                          return (
                            <motion.button
                              key={cat.value}
                              type="button"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setField('applicant_category', cat.value)}
                              className={`rounded-xl p-2.5 text-right ring-1 transition-all ${
                                active
                                  ? 'bg-primary/10 ring-primary shadow-sm'
                                  : 'bg-background ring-border hover:ring-primary/40'
                              }`}
                            >
                              <div className="text-2xl mb-0.5">{cat.icon}</div>
                              <div className={`text-[11px] font-bold ${active ? 'text-primary' : 'text-foreground'}`}>
                                {cat.label}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* === حقول مخصصة حسب فئة المتقدم === */}
                    {(() => {
                      const cat = form.applicant_category;
                      const isEmployed = cat === 'gov_employee' || cat === 'private_employee';
                      const isFreelance = cat === 'self_employed';
                      const isStudent = cat === 'student';
                      const isRetired = cat === 'retired';
                      const isUnemployed = !cat;

                      return (
                        <>
                          {/* === الموظفين (حكومي / خاص) === */}
                          {isEmployed && (
                            <>
                              <div className="md:col-span-2">
                                <Label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                  قطاع جهة العمل
                                </Label>
                                <Select dir="rtl" value={form.employer_sector}
                                  onValueChange={(v) => setField('employer_sector', v)}>
                                  <SelectTrigger className="h-11 flex-row-reverse justify-between text-right [&>span]:text-right [&>span]:flex-1">
                                    <SelectValue placeholder="اختر القطاع المهني..." />
                                  </SelectTrigger>
                                  <SelectContent dir="rtl" className="text-right">
                                    {EMPLOYMENT_SECTORS.filter(s => s.value !== 'unemployed' && s.value !== 'self_employed').map((s) => (
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
                                <Input value={form.employer_name}
                                  onChange={(e) => setField('employer_name', e.target.value)}
                                  placeholder="مثال: أرامكو السعودية" />
                              </FieldGroup>
                              <FieldGroup icon={Briefcase} label="سنوات الخبرة الوظيفية">
                                <Input type="number" min={0} max={50}
                                  value={form.employment_years}
                                  onChange={(e) => setField('employment_years', e.target.value)}
                                  placeholder="مثال: 5" />
                              </FieldGroup>
                            </>
                          )}

                          {/* === أعمال حرة === */}
                          {isFreelance && (
                            <>
                              <div className="md:col-span-2">
                                <Label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                                  <UserCheck className="h-3.5 w-3.5 text-teal-600" />
                                  نوع النشاط الحر
                                </Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {FREELANCE_TYPES.map((t) => {
                                    const active = form.freelance_type === t.value;
                                    return (
                                      <motion.button key={t.value} type="button"
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setField('freelance_type', t.value)}
                                        className={`rounded-xl p-2.5 text-right ring-1 transition-all ${
                                          active ? 'bg-primary/10 ring-primary shadow-sm'
                                          : 'bg-background ring-border hover:ring-primary/40'}`}>
                                        <div className="text-xl mb-0.5">{t.icon}</div>
                                        <div className={`text-[11px] font-bold ${active ? 'text-primary' : 'text-foreground'}`}>{t.label}</div>
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              </div>
                              <FieldGroup icon={Briefcase} label="اسم النشاط / السجل التجاري (اختياري)">
                                <Input value={form.employer_name}
                                  onChange={(e) => setField('employer_name', e.target.value)}
                                  placeholder="مثال: مؤسسة تقنية ..." />
                              </FieldGroup>
                              <FieldGroup icon={Briefcase} label="سنوات ممارسة النشاط">
                                <Input type="number" min={0} max={50}
                                  value={form.employment_years}
                                  onChange={(e) => setField('employment_years', e.target.value)}
                                  placeholder="مثال: 3" />
                              </FieldGroup>
                            </>
                          )}

                          {/* === الطلاب === */}
                          {isStudent && (
                            <>
                              <div className="md:col-span-2">
                                <Label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                                  المرحلة الدراسية
                                </Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                                  {STUDENT_LEVELS.map((lv) => {
                                    const active = form.student_level === lv.value;
                                    return (
                                      <motion.button key={lv.value} type="button"
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setField('student_level', lv.value)}
                                        className={`rounded-xl p-2.5 text-right ring-1 transition-all ${
                                          active ? 'bg-primary/10 ring-primary shadow-sm'
                                          : 'bg-background ring-border hover:ring-primary/40'}`}>
                                        <div className="text-xl mb-0.5">{lv.icon}</div>
                                        <div className={`text-[11px] font-bold ${active ? 'text-primary' : 'text-foreground'}`}>{lv.label}</div>
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              </div>
                              <FieldGroup icon={GraduationCap} label="اسم الجامعة / المؤسسة التعليمية">
                                <Input value={form.university_name}
                                  onChange={(e) => setField('university_name', e.target.value)}
                                  placeholder="مثال: جامعة الملك سعود" />
                              </FieldGroup>
                              <FieldGroup icon={Sparkles} label="المعدل التراكمي (من 5)">
                                <Input type="number" min={0} max={5} step="0.01"
                                  value={form.student_gpa}
                                  onChange={(e) => setField('student_gpa', e.target.value)}
                                  placeholder="مثال: 4.5" />
                              </FieldGroup>
                            </>
                          )}

                          {/* === المتقاعدين === */}
                          {isRetired && (
                            <div className="md:col-span-2">
                              <Label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5">
                                <Landmark className="h-3.5 w-3.5 text-amber-600" />
                                مصدر المعاش التقاعدي
                              </Label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {RETIREMENT_SOURCES.map((r) => {
                                  const active = form.retirement_source === r.value;
                                  return (
                                    <motion.button key={r.value} type="button"
                                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                      onClick={() => setField('retirement_source', r.value)}
                                      className={`rounded-xl p-2.5 text-right ring-1 transition-all ${
                                        active ? 'bg-primary/10 ring-primary shadow-sm'
                                        : 'bg-background ring-border hover:ring-primary/40'}`}>
                                      <div className="text-xl mb-0.5">{r.icon}</div>
                                      <div className={`text-[11px] font-bold ${active ? 'text-primary' : 'text-foreground'}`}>{r.label}</div>
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* === لم يختر فئة بعد === */}
                          {isUnemployed && (
                            <div className="md:col-span-2 rounded-xl border border-dashed bg-muted/20 p-4 text-center">
                              <UserCheck className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                              <div className="text-xs text-muted-foreground">
                                اختر فئتك أعلاه لعرض الحقول المخصصة لك
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {/* === الحقول المشتركة لكل الفئات === */}
                    <FieldGroup icon={MapPin} label="المدينة">
                      <Select dir="rtl" value={form.city} onValueChange={(v) => setField('city', v)}>
                        <SelectTrigger className="h-11 flex-row-reverse justify-between text-right [&>span]:text-right [&>span]:flex-1">
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
                    <FieldGroup icon={User} label="العمر (سنوات)">
                      <Input type="number" min={16} max={75}
                        value={form.applicant_age}
                        onChange={(e) => setField('applicant_age', e.target.value)}
                        placeholder="مثال: 32" />
                    </FieldGroup>
                    <FieldGroup icon={TrendingUp} label={
                      form.applicant_category === 'student' ? 'الدخل / المكافأة الشهرية (ر.س)' :
                      form.applicant_category === 'retired' ? 'المعاش التقاعدي الشهري (ر.س)' :
                      form.applicant_category === 'self_employed' ? 'متوسط الدخل الشهري (ر.س)' :
                      'الدخل الشهري (ر.س)'
                    }>
                      <Input type="number" min={0}
                        value={form.monthly_income}
                        onChange={(e) => setField('monthly_income', e.target.value)}
                        placeholder="0" />
                    </FieldGroup>
                    <FieldGroup icon={Receipt} label="الالتزامات الشهرية (ر.س)">
                      <Input type="number" min={0}
                        value={form.monthly_commitments}
                        onChange={(e) => setField('monthly_commitments', e.target.value)}
                        placeholder="0" />
                    </FieldGroup>

                    {/* === الكفيل الغارم === */}
                    <div className="md:col-span-2">
                      <motion.label
                        whileTap={{ scale: 0.99 }}
                        className={`flex items-start gap-3 rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                          form.has_guarantor
                            ? 'border-emerald-500 bg-emerald-500/5 shadow-md shadow-emerald-500/10'
                            : 'border-border bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <Checkbox
                          checked={form.has_guarantor}
                          onCheckedChange={(v) => setField('has_guarantor', !!v)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-bold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            إضافة كفيل غارم
                            <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                              يرفع السكور +60
                            </span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            الكفيل الغارم يلتزم نظاماً بسداد الأقساط في حال تعذّر سداد المتقدم. مُوصى به للطلاب وأصحاب الأعمال الحرة.
                          </div>
                        </div>
                      </motion.label>
                    </div>

                    {/* === فورم الكفيل (يظهر عند التفعيل) === */}
                    <AnimatePresence>
                      {form.has_guarantor && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="md:col-span-2 overflow-hidden"
                        >
                          <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50 via-background to-background dark:from-emerald-950/20 p-5 space-y-4">
                            {/* رأس البطاقة */}
                            <div className="flex items-start justify-between gap-3 pb-3 border-b border-emerald-500/20">
                              <div className="flex items-center gap-2.5">
                                <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                  <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <div className="font-bold text-sm">بيانات الكفيل الغارم</div>
                                  <div className="text-[11px] text-muted-foreground">جميع الحقول إلزامية ومطابقة للهوية الرسمية</div>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 rounded-full whitespace-nowrap">
                                ⚖️ ملزم نظاماً
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FieldGroup icon={User} label="الاسم الرباعي للكفيل">
                                <Input
                                  value={form.guarantor_full_name}
                                  onChange={(e) => setField('guarantor_full_name', e.target.value)}
                                  placeholder="كما في الهوية الوطنية"
                                  maxLength={120}
                                />
                              </FieldGroup>
                              <FieldGroup icon={IdCard} label="رقم هوية الكفيل">
                                <Input
                                  inputMode="numeric"
                                  value={form.guarantor_id_number}
                                  onChange={(e) => setField('guarantor_id_number', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                  placeholder="10 أرقام (يبدأ بـ 1 أو 2)"
                                  maxLength={10}
                                />
                              </FieldGroup>
                              <FieldGroup icon={Phone} label="جوال الكفيل">
                                <Input
                                  inputMode="tel"
                                  value={form.guarantor_phone}
                                  onChange={(e) => setField('guarantor_phone', e.target.value)}
                                  placeholder="05XXXXXXXX"
                                  maxLength={15}
                                />
                              </FieldGroup>
                              <FieldGroup icon={Users} label="صلة القرابة">
                                <Select
                                  value={form.guarantor_relation}
                                  onValueChange={(v) => setField('guarantor_relation', v)}
                                >
                                  <SelectTrigger className="flex-row-reverse text-right">
                                    <SelectValue placeholder="اختر صلة القرابة" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {GUARANTOR_RELATIONS.map((r) => (
                                      <SelectItem key={r.value} value={r.value}>
                                        <span className="ml-1.5">{r.icon}</span> {r.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FieldGroup>
                              <FieldGroup icon={Briefcase} label="جهة عمل الكفيل">
                                <Input
                                  value={form.guarantor_employer}
                                  onChange={(e) => setField('guarantor_employer', e.target.value)}
                                  placeholder="اسم الجهة / الشركة"
                                  maxLength={120}
                                />
                              </FieldGroup>
                              <FieldGroup icon={TrendingUp} label="الدخل الشهري للكفيل (ر.س)">
                                <Input
                                  type="number"
                                  min={3000}
                                  value={form.guarantor_monthly_income}
                                  onChange={(e) => setField('guarantor_monthly_income', e.target.value)}
                                  placeholder="الحد الأدنى 3,000"
                                />
                              </FieldGroup>
                              <FieldGroup icon={MapPin} label="مدينة الكفيل">
                                <Input
                                  value={form.guarantor_city}
                                  onChange={(e) => setField('guarantor_city', e.target.value)}
                                  placeholder="مثال: الرياض"
                                  maxLength={60}
                                />
                              </FieldGroup>
                            </div>

                            {/* إقرار الكفيل */}
                            <label className="flex items-start gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 cursor-pointer">
                              <Checkbox
                                checked={form.guarantor_consent}
                                onCheckedChange={(v) => setField('guarantor_consent', !!v)}
                                className="mt-0.5"
                              />
                              <div className="text-[12px] leading-relaxed">
                                <span className="font-bold">إقرار الكفيل: </span>
                                أُقرّ بأن الكفيل المذكور قد اطّلع على بنود التمويل ووافق على الكفالة الغارمة، وأتحمّل المسؤولية الكاملة عن صحة بياناته. سيتم التواصل مع الكفيل عبر الجوال لتأكيد الموافقة قبل تفعيل التمويل.
                              </div>
                            </label>

                            <div className="text-[10px] text-muted-foreground bg-muted/40 rounded-lg p-2.5 leading-relaxed">
                              🛡️ <strong>سرية البيانات:</strong> بيانات الكفيل محمية وفق نظام حماية البيانات الشخصية السعودي (PDPL) ولن تُستخدم إلا لأغراض التحقق من الكفالة.
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

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

                {/* بطاقة التقييم الائتماني التلقائي */}
                {creditScore ? (
                  <CreditScoreCard result={creditScore} />
                ) : (
                  <div className="rounded-2xl border border-dashed bg-muted/20 p-5 text-center">
                    <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary/60" />
                    <div className="text-sm font-semibold">سيظهر تقييمك الائتماني فور إكمال البيانات</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      اختر فئتك وأدخل دخلك الشهري للحصول على سكور فوري وفق نموذج SIMAH
                    </div>
                  </div>
                )}

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

          {/* Sticky live summary sidebar */}
          <aside className="lg:block">
            <FinancingLiveSummary
              amount={amount}
              total={preview.total}
              downPayment={preview.downPayment}
              monthly={preview.monthly}
              duration={preview.duration}
              step={step}
            />
          </aside>
        </div>
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
