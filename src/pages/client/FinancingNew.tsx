import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { ArrowRight, CheckCircle2, ShieldCheck, Upload, Loader2 } from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import {
  FINANCING_DISCLAIMER_AR,
  FINANCING_DOC_LABELS_AR,
  FINANCING_MIN_AMOUNT,
  computeFinancingPreview,
} from '@/lib/financing';

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
    employer_name: '',
    monthly_income: '' as number | '',
    monthly_commitments: '' as number | '',
    city: '',
    notes: '',
  });
  const [files, setFiles] = useState<Partial<Record<DocKey, File>>>({});
  const [agreed, setAgreed] = useState({ terms: false, dataUse: false, walletCredit: false });

  const preview = useMemo(() => computeFinancingPreview(amount), [amount]);

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
    if (!agreed.terms || !agreed.dataUse || !agreed.walletCredit) {
      toast({ title: 'الموافقات مطلوبة', description: 'يرجى الموافقة على جميع الشروط', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;

    setSubmitting(true);
    try {
      // 1) Create application
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

      // 2) Upload documents
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
        title: 'تم إرسال الطلب بنجاح',
        description: 'سيتم مراجعة طلبك من الإدارة، وسنعلمك بالتحديثات.',
      });
      navigate('/financing');
    } catch (e: any) {
      toast({ title: 'حدث خطأ', description: e?.message ?? 'فشل إرسال الطلب', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const StepIndicator = (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div
            className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm ring-2 ${
              step === s
                ? 'bg-primary text-primary-foreground ring-primary'
                : step > s
                ? 'bg-primary/20 text-primary ring-primary/30'
                : 'bg-muted text-muted-foreground ring-border'
            }`}
          >
            {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
          </div>
          {s < 3 && <div className={`h-1 w-12 rounded ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <ClientLayout>
      <Helmet>
        <title>طلب تمويل جديد — Master PayLater</title>
      </Helmet>

      <div dir="rtl" className="max-w-3xl mx-auto space-y-6">
        <div>
          <Link to="/financing" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowRight className="h-4 w-4 rotate-180" /> رجوع
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">طلب تمويل جديد</h1>
          <p className="text-sm text-muted-foreground mt-1">Master PayLater — تقسيط على 12 شهرًا برصيد محفظة</p>
        </div>

        {StepIndicator}

        {/* Disclaimer always visible */}
        <Card className="p-4 border-primary/30 bg-primary/5">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <p className="text-sm leading-relaxed">{FINANCING_DISCLAIMER_AR}</p>
          </div>
        </Card>

        {step === 1 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">١. بيانات التمويل</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="amount">مبلغ الطلب (ر.س)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={FINANCING_MIN_AMOUNT}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={!!orderId || !!invoiceId}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  الحد الأدنى للتمويل: {fmt(FINANCING_MIN_AMOUNT)} ر.س
                </p>
              </div>

              <div>
                <Label htmlFor="full_name">الاسم الكامل (كما في الهوية)</Label>
                <Input id="full_name" value={form.applicant_full_name} onChange={(e) => setField('applicant_full_name', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="id_number">رقم الهوية / الإقامة</Label>
                <Input id="id_number" value={form.applicant_id_number} onChange={(e) => setField('applicant_id_number', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">رقم الجوال</Label>
                <Input id="phone" type="tel" value={form.applicant_phone} onChange={(e) => setField('applicant_phone', e.target.value)} placeholder="9665xxxxxxxx" />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input id="email" type="email" value={form.applicant_email} onChange={(e) => setField('applicant_email', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="employer">جهة العمل</Label>
                <Input id="employer" value={form.employer_name} onChange={(e) => setField('employer_name', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="city">المدينة</Label>
                <Input id="city" value={form.city} onChange={(e) => setField('city', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="income">الدخل الشهري (ر.س)</Label>
                <Input id="income" type="number" min={0} value={form.monthly_income} onChange={(e) => setField('monthly_income', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="commit">الالتزامات الشهرية (ر.س)</Label>
                <Input id="commit" type="number" min={0} value={form.monthly_commitments} onChange={(e) => setField('monthly_commitments', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
              </div>
            </div>

            {/* Live preview */}
            <div className="rounded-xl bg-muted/40 p-4">
              <div className="text-sm font-semibold mb-3">ملخص خطة التمويل</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
                <div className="rounded-lg bg-background p-3">
                  <div className="text-muted-foreground mb-1">الإجمالي</div>
                  <div className="font-bold">{fmt(preview.total)} ر.س</div>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <div className="text-muted-foreground mb-1">الدفعة الأولى (20%)</div>
                  <div className="font-bold text-primary">{fmt(preview.downPayment)} ر.س</div>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <div className="text-muted-foreground mb-1">القسط الشهري</div>
                  <div className="font-bold text-primary">{fmt(preview.monthly)} ر.س</div>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <div className="text-muted-foreground mb-1">المدة</div>
                  <div className="font-bold">{preview.duration} شهر</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => validateStep1() && setStep(2)}>التالي: المستندات</Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">٢. المستندات المطلوبة</h2>
            <p className="text-sm text-muted-foreground">
              ارفع المستندات بصيغة PDF أو صورة واضحة. جميع المستندات مخزنة بشكل آمن وخاص.
            </p>

            <div className="space-y-3">
              {[...REQUIRED_DOCS, ...OPTIONAL_DOCS].map((dk) => (
                <div key={dk} className="rounded-lg border border-border/60 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-semibold">
                      {FINANCING_DOC_LABELS_AR[dk]}
                      {REQUIRED_DOCS.includes(dk) && <span className="text-destructive mr-1">*</span>}
                    </Label>
                    {files[dk] && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> تم الرفع
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setFiles((prev) => ({ ...prev, [dk]: f }));
                        }}
                      />
                      <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors py-3 text-sm text-muted-foreground">
                        <Upload className="h-4 w-4" />
                        {files[dk]?.name ?? 'اختر ملفًا للرفع'}
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>السابق</Button>
              <Button onClick={() => validateStep2() && setStep(3)}>التالي: الموافقات</Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-6 space-y-5">
            <h2 className="text-lg font-bold">٣. الموافقات النهائية</h2>

            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-lg border border-border/60 p-4 cursor-pointer hover:bg-muted/30">
                <Checkbox checked={agreed.terms} onCheckedChange={(v) => setAgreed((a) => ({ ...a, terms: !!v }))} />
                <span className="text-sm leading-relaxed">
                  أوافق على شروط وأحكام Master PayLater وعلى توقيع العقد إلكترونيًا بعد موافقة الإدارة.
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-border/60 p-4 cursor-pointer hover:bg-muted/30">
                <Checkbox checked={agreed.dataUse} onCheckedChange={(v) => setAgreed((a) => ({ ...a, dataUse: !!v }))} />
                <span className="text-sm leading-relaxed">
                  أوافق على استخدام بياناتي المالية لأغراض تقييم الأهلية والتحقق عبر واتساب.
                </span>
              </label>
              <label className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 cursor-pointer">
                <Checkbox checked={agreed.walletCredit} onCheckedChange={(v) => setAgreed((a) => ({ ...a, walletCredit: !!v }))} />
                <span className="text-sm leading-relaxed font-medium">
                  أُقرّ بأن التمويل ليس مبلغًا نقديًا، وإنما رصيد داخلي يضاف إلى محفظتي ويُستخدم فقط في سداد خدمات المنصة.
                </span>
              </label>
            </div>

            <div className="rounded-xl bg-muted/40 p-4">
              <div className="text-sm font-semibold mb-3">ملخص الطلب قبل الإرسال</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>المبلغ الإجمالي:</div><div className="font-bold text-left">{fmt(preview.total)} ر.س</div>
                <div>الدفعة الأولى:</div><div className="font-bold text-left">{fmt(preview.downPayment)} ر.س</div>
                <div>القسط الشهري:</div><div className="font-bold text-left">{fmt(preview.monthly)} ر.س</div>
                <div>المدة:</div><div className="font-bold text-left">{preview.duration} شهر</div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)} disabled={submitting}>السابق</Button>
              <Button onClick={handleSubmit} disabled={submitting} size="lg">
                {submitting ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإرسال…</> : 'إرسال طلب التمويل'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
};

export default FinancingNew;
