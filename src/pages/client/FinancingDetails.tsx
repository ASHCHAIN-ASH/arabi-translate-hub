import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CreditCard,
  Wallet,
  Building2,
  Upload,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ShieldCheck,
  Copy,
  FileText,
  PenLine,
  Loader2,
  Receipt,
  Sparkles,
  Calendar,
  TrendingUp,
  Gavel,
  Lock,
  ScrollText,
} from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { FINANCING_STATUS_LABELS_AR, FINANCING_DOC_LABELS_AR } from '@/lib/financing';
import { MASTER_PAYLATER_BANK, FINANCING_TEAMS } from '@/lib/financing-bank';

interface FinancingApp {
  id: string;
  user_id: string;
  total_amount: number;
  down_payment: number;
  remaining_amount: number;
  monthly_installment: number;
  duration_months: number;
  status: string;
  created_at: string;
  updated_at: string;
  notes: string | null;
}

interface PaymentReceipt {
  id: string;
  payment_method: 'wallet' | 'bank_transfer';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  bank_name: string | null;
  reference_number: string | null;
  transfer_date: string | null;
  receipt_file_url: string | null;
  reviewer_note: string | null;
  created_at: string;
}

interface DocumentRow {
  id: string;
  document_type: string;
  status: string;
  file_url: string;
  review_note: string | null;
}

interface WalletRow {
  balance: number;
}

interface InstallmentRow {
  id: string;
  month_number: number;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  paid_at: string | null;
  paid_amount: number | null;
}

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);

// التايملاين الكامل لحالات التمويل بطابع شركات التمويل العالمية المرخّصة
const TIMELINE_STAGES = [
  { key: 'submitted', label: 'استلام الطلب', icon: Receipt },
  { key: 'under_review', label: 'التقييم الائتماني', icon: ShieldCheck },
  { key: 'contract_pending_signature', label: 'توقيع العقد', icon: FileText },
  { key: 'waiting_down_payment', label: 'الدفعة الأولى', icon: CreditCard },
  { key: 'active', label: 'تفعيل الرصيد', icon: Sparkles },
  { key: 'execution_deed', label: 'السند التنفيذي', icon: Gavel },
];

const REJECTED_LIKE = ['rejected', 'cancelled'];

const stageReached = (currentStatus: string, stageKey: string): 'done' | 'current' | 'upcoming' => {
  if (REJECTED_LIKE.includes(currentStatus)) return 'upcoming';
  const order = TIMELINE_STAGES.map((s) => s.key);
  // Map equivalent statuses
  const aliases: Record<string, string> = {
    documents_pending: 'submitted',
    approved: 'waiting_down_payment',
    completed: 'active',
    overdue: 'active',
  };
  const effectiveCurr = aliases[currentStatus] ?? currentStatus;
  const effIdx = order.indexOf(effectiveCurr);
  const stageIdx = order.indexOf(stageKey);
  if (effIdx === -1) return 'upcoming';
  if (stageIdx < effIdx) return 'done';
  if (stageIdx === effIdx) return 'current';
  return 'upcoming';
};

const FinancingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [app, setApp] = useState<FinancingApp | null>(null);
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [wallet, setWallet] = useState<WalletRow | null>(null);
  const [installments, setInstallments] = useState<InstallmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<{ id: string; status: string | null; contract_number: string } | null>(null);
  const [creatingContract, setCreatingContract] = useState(false);

  // Payment form state
  const [paymentTab, setPaymentTab] = useState<'wallet' | 'bank_transfer'>('wallet');
  const [bankName, setBankName] = useState('');
  const [refNo, setRefNo] = useState('');
  const [transferDate, setTransferDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [paying, setPaying] = useState(false);

  const load = useCallback(async () => {
    if (!id || !user) return;
    setLoading(true);
    const [appRes, docsRes, receiptsRes, walletRes, contractRes] = await Promise.all([
      supabase.from('financing_applications').select('*').eq('id', id).maybeSingle(),
      supabase.from('financing_documents').select('id,document_type,status,file_url,review_note').eq('application_id', id),
      supabase.from('financing_payment_receipts').select('*').eq('application_id', id).order('created_at', { ascending: false }),
      supabase.from('wallets').select('balance').eq('user_id', user.id).maybeSingle(),
      supabase
        .from('contracts')
        .select('id,status,contract_number,metadata')
        .eq('template_type', 'financing')
        .contains('metadata', { application_id: id })
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    if (appRes.data) setApp(appRes.data as FinancingApp);
    if (docsRes.data) setDocs(docsRes.data as DocumentRow[]);
    if (receiptsRes.data) setReceipts(receiptsRes.data as PaymentReceipt[]);
    if (walletRes.data) setWallet(walletRes.data as WalletRow);
    if (contractRes.data) {
      setContract({
        id: contractRes.data.id,
        status: contractRes.data.status,
        contract_number: contractRes.data.contract_number,
      });
    } else {
      setContract(null);
    }
    setLoading(false);
  }, [id, user]);

  useEffect(() => {
    document.title = 'تفاصيل طلب التمويل — Master PayLater';
    load();
  }, [load]);

  // Realtime: app + receipts
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`financing-detail-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_applications', filter: `id=eq.${id}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_payment_receipts', filter: `application_id=eq.${id}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_documents', filter: `application_id=eq.${id}` }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, load]);

  const downPayment = useMemo(() => Number(app?.down_payment ?? 0), [app]);
  const walletBalance = Number(wallet?.balance ?? 0);
  const walletEnough = walletBalance >= downPayment;

  const hasPendingReceipt = receipts.some((r) => r.status === 'pending');
  const hasApprovedReceipt = receipts.some((r) => r.status === 'approved');

  const canPay = app?.status === 'waiting_down_payment' && !hasPendingReceipt && !hasApprovedReceipt;

  const copyIban = () => {
    navigator.clipboard.writeText(MASTER_PAYLATER_BANK.iban);
    toast({ title: 'تم نسخ رقم الآيبان' });
  };

  const submitWalletPayment = async () => {
    if (!app || !user) return;
    if (!walletEnough) {
      toast({ title: 'الرصيد غير كافٍ', description: `تحتاج ${fmt(downPayment)} ر.س على الأقل في المحفظة`, variant: 'destructive' });
      return;
    }
    setPaying(true);
    try {
      const { error } = await supabase.from('financing_payment_receipts').insert({
        application_id: app.id,
        user_id: user.id,
        payment_method: 'wallet',
        amount: downPayment,
        status: 'pending',
      } as any);
      if (error) throw error;
      toast({
        title: 'تم استلام طلب الدفع من المحفظة ✅',
        description: `${FINANCING_TEAMS.unified} سيراجع العملية ويُفعّل التمويل خلال دقائق.`,
      });
      await load();
    } catch (e: any) {
      toast({ title: 'تعذر إرسال الدفع', description: e?.message ?? 'حدث خطأ', variant: 'destructive' });
    } finally {
      setPaying(false);
    }
  };

  const submitBankTransfer = async () => {
    if (!app || !user) return;
    if (!bankName.trim() || !refNo.trim() || !receiptFile) {
      toast({ title: 'بيانات ناقصة', description: 'أدخل البنك ورقم العملية وارفع إيصال التحويل', variant: 'destructive' });
      return;
    }
    setPaying(true);
    try {
      const ext = receiptFile.name.split('.').pop() || 'jpg';
      const path = `${user.id}/${app.id}/receipt-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('payment-receipts')
        .upload(path, receiptFile, { upsert: false, contentType: receiptFile.type });
      if (upErr) throw upErr;

      const { error } = await supabase.from('financing_payment_receipts').insert({
        application_id: app.id,
        user_id: user.id,
        payment_method: 'bank_transfer',
        amount: downPayment,
        bank_name: bankName.trim(),
        reference_number: refNo.trim(),
        transfer_date: transferDate,
        receipt_file_url: path,
        receipt_file_name: receiptFile.name,
        status: 'pending',
      } as any);
      if (error) throw error;

      toast({
        title: 'تم رفع إيصال التحويل ✅',
        description: `${FINANCING_TEAMS.credit} سيتحقق من الإيصال خلال 24 ساعة.`,
      });
      setBankName('');
      setRefNo('');
      setReceiptFile(null);
      await load();
    } catch (e: any) {
      toast({ title: 'تعذر رفع الإيصال', description: e?.message ?? 'حدث خطأ', variant: 'destructive' });
    } finally {
      setPaying(false);
    }
  };

  // فتح / إنشاء عقد التمويل ثم الانتقال لصفحة التوقيع
  const openOrCreateContract = async () => {
    if (!app || !user) return;
    if (contract?.id) {
      navigate(`/client/contracts/${contract.id}`);
      return;
    }
    setCreatingContract(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name,phone,email')
        .eq('id', user.id)
        .maybeSingle();

      const title = `عقد تمويل Master PayLater — ${app.id.slice(0, 8).toUpperCase()}`;
      // Compute first installment date = today + 30 days
      const firstInstallment = new Date();
      firstInstallment.setDate(firstInstallment.getDate() + 30);
      const firstInstallmentDate = firstInstallment.toISOString().slice(0, 10);
      const content = `عقد تمويل داخلي — Master PayLater — مبلغ التمويل ${fmt(Number(app.total_amount))} ر.س يُضاف للمحفظة الرقمية لشراء خدمات منصة ماستر، يُسدَّد على ${app.duration_months} قسط شهري بقيمة ${fmt(Number(app.monthly_installment))} ر.س. (سيتم توليد العقد التفصيلي تلقائياً)`;

      const { data: created, error } = await supabase
        .from('contracts')
        .insert({
          title,
          content,
          template_type: 'financing',
          status: 'pending_signature',
          user_id: user.id,
          total_amount: app.total_amount,
          currency: 'SAR',
          client_full_name: (profile as any)?.full_name ?? null,
          client_phone: (profile as any)?.phone ?? null,
          client_email: (profile as any)?.email ?? user.email ?? null,
          sent_at: new Date().toISOString(),
          metadata: {
            application_id: app.id,
            source: 'financing',
            down_payment: app.down_payment,
            monthly_installment: app.monthly_installment,
            duration_months: app.duration_months,
            // Block consumed by buildContractContentFromRow → buildFinancingContract
            financing: {
              financedAmount: Number(app.total_amount),
              downPayment: Number(app.down_payment),
              monthlyInstallment: Number(app.monthly_installment),
              durationMonths: app.duration_months,
              firstInstallmentDate,
              applicationId: app.id,
            },
          },
        } as any)
        .select('id,status,contract_number')
        .single();

      if (error) throw error;
      // Regenerate the rich legal content based on template_type + metadata
      try {
        const { generateContractContent } = await import('@/utils/supabaseContractService');
        await generateContractContent(created.id);
      } catch (genErr) {
        console.warn('[FinancingDetails] generateContractContent failed (non-fatal):', genErr);
      }
      setContract({ id: created.id, status: created.status, contract_number: created.contract_number });
      navigate(`/client/contracts/${created.id}`);
    } catch (e: any) {
      // استخراج تفاصيل الخطأ من Supabase / PostgREST لعرضها للمستخدم
      const dbCode: string | undefined = e?.code;
      const dbDetails: string | undefined = e?.details;
      const dbHint: string | undefined = e?.hint;
      const rawMessage: string = e?.message ?? 'حدث خطأ غير معروف';

      // ترجمة الأخطاء الشائعة إلى العربية
      let friendly = rawMessage;
      if (/row-level security|RLS|permission denied/i.test(rawMessage)) {
        friendly = 'لا تملك صلاحية إنشاء العقد لهذا الطلب. تأكد أن الطلب يخصك.';
      } else if (/violates check constraint/i.test(rawMessage)) {
        const m = rawMessage.match(/constraint "([^"]+)"/);
        friendly = `بيانات العقد لا تطابق قواعد قاعدة البيانات${m ? ` (${m[1]})` : ''}.`;
      } else if (/duplicate key|unique constraint/i.test(rawMessage)) {
        friendly = 'يوجد عقد مُنشأ مسبقًا لهذا الطلب. حدّث الصفحة ثم حاول مجددًا.';
      } else if (/foreign key|violates foreign/i.test(rawMessage)) {
        friendly = 'تعذر ربط العقد بطلب التمويل. تأكد من صحة بيانات الطلب.';
      } else if (/network|fetch|Failed to fetch/i.test(rawMessage)) {
        friendly = 'تعذر الاتصال بالخادم. تحقق من الإنترنت ثم حاول مجددًا.';
      }

      const description = [
        friendly,
        dbCode ? `كود الخطأ: ${dbCode}` : null,
        dbDetails ? `التفاصيل: ${dbDetails}` : null,
        dbHint ? `تلميح: ${dbHint}` : null,
      ]
        .filter(Boolean)
        .join(' • ');

      toast({
        title: 'تعذر إنشاء عقد التمويل',
        description,
        variant: 'destructive',
        duration: 9000,
      });

      // طباعة كاملة في وحدة التحكم لتسهيل التشخيص للفريق
      // eslint-disable-next-line no-console
      console.error('[FinancingDetails] openOrCreateContract failed:', {
        message: rawMessage,
        code: dbCode,
        details: dbDetails,
        hint: dbHint,
        raw: e,
      });
    } finally {
      setCreatingContract(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="p-8 text-center text-muted-foreground" dir="rtl">
          <Loader2 className="h-8 w-8 mx-auto animate-spin mb-2" /> جاري تحميل تفاصيل الطلب…
        </div>
      </ClientLayout>
    );
  }

  if (!app) {
    return (
      <ClientLayout>
        <div className="p-8 text-center" dir="rtl">
          <p className="text-muted-foreground mb-4">الطلب غير موجود</p>
          <Button asChild variant="outline">
            <Link to="/financing">رجوع إلى التمويل</Link>
          </Button>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div dir="rtl" className="space-y-5 max-w-5xl mx-auto animate-fade-in">
        {/* Back nav */}
        <Link to="/financing" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 hover-scale">
          <ArrowRight className="h-4 w-4 rotate-180" /> رجوع إلى قائمة التمويل
        </Link>

        {/* Header card with timeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="relative overflow-hidden border-0 shadow-2xl">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, hsl(217 91% 18%) 0%, hsl(199 89% 38%) 100%)',
              }}
            />
            <motion.div
              className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 7, repeat: Infinity }}
            />
            <div className="relative p-6 md:p-8 text-white">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/70 mb-1">رقم الطلب</div>
                  <div className="font-mono text-sm font-bold mb-2">#{app.id.slice(0, 8).toUpperCase()}</div>
                  <div className="text-3xl md:text-4xl font-extrabold tabular-nums">
                    {fmt(app.total_amount)}
                    <span className="text-base font-normal text-white/80 mr-2">ر.س</span>
                  </div>
                </div>
                <Badge className="bg-white/15 text-white ring-1 ring-white/30 border-0 backdrop-blur-xl px-3 py-1.5">
                  {FINANCING_STATUS_LABELS_AR[app.status] ?? app.status}
                </Badge>
              </div>

              {/* Payment plan summary */}
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6">
                <div className="rounded-xl bg-white/10 backdrop-blur-xl p-3 ring-1 ring-white/20">
                  <div className="text-[10px] uppercase tracking-wider text-white/70 mb-1">الدفعة الأولى</div>
                  <div className="font-bold tabular-nums text-sm md:text-base">{fmt(app.down_payment)} ر.س</div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-xl p-3 ring-1 ring-white/20">
                  <div className="text-[10px] uppercase tracking-wider text-white/70 mb-1">القسط الشهري</div>
                  <div className="font-bold tabular-nums text-sm md:text-base">{fmt(app.monthly_installment)} ر.س</div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-xl p-3 ring-1 ring-white/20">
                  <div className="text-[10px] uppercase tracking-wider text-white/70 mb-1">المدة</div>
                  <div className="font-bold tabular-nums text-sm md:text-base">{app.duration_months} شهر</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-xl bg-white/5 backdrop-blur-xl p-4 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-xs text-white/80 mb-3">
                  <TrendingUp className="h-3.5 w-3.5" /> مسار التمويل
                </div>
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
                  {TIMELINE_STAGES.map((stage, idx) => {
                    const state = stageReached(app.status, stage.key);
                    const Icon = stage.icon;
                    return (
                      <React.Fragment key={stage.key}>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 + idx * 0.08 }}
                          className="flex flex-col items-center gap-1 min-w-[60px]"
                        >
                          <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center ring-2 transition-all ${
                              state === 'done'
                                ? 'bg-emerald-400 text-emerald-900 ring-emerald-300/50'
                                : state === 'current'
                                  ? 'bg-amber-300 text-amber-900 ring-amber-200/60 shadow-lg shadow-amber-500/30 animate-pulse'
                                  : 'bg-white/10 text-white/50 ring-white/20'
                            }`}
                          >
                            {state === 'done' ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                          </div>
                          <span className={`text-[10px] text-center leading-tight ${state === 'upcoming' ? 'text-white/40' : 'text-white/90'}`}>
                            {stage.label}
                          </span>
                        </motion.div>
                        {idx < TIMELINE_STAGES.length - 1 && (
                          <div className={`h-0.5 flex-1 min-w-[8px] rounded ${state === 'done' ? 'bg-emerald-400/60' : 'bg-white/15'}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                {REJECTED_LIKE.includes(app.status) && (
                  <div className="mt-3 text-xs text-rose-200 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    هذا الطلب {FINANCING_STATUS_LABELS_AR[app.status]} — تواصل مع {FINANCING_TEAMS.followup} ({FINANCING_TEAMS.contact}) لمعرفة التفاصيل.
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Digital Acknowledgments CTA — visible across active stages */}
        {!REJECTED_LIKE.includes(app.status) && app.status !== 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden border-0 shadow-xl">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.85) 50%, hsl(var(--accent) / 0.9) 100%)',
                }}
              />
              <motion.div
                className="absolute -top-16 -left-16 h-44 w-44 rounded-full bg-white/15 blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <div className="relative p-5 md:p-6 text-primary-foreground flex flex-col md:flex-row md:items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-xl ring-1 ring-white/30 flex items-center justify-center shrink-0">
                  <ScrollText className="h-7 w-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/70 mb-1">
                    <Lock className="h-3 w-3" /> الإقرارات الرقمية الإلزامية
                  </div>
                  <h3 className="font-extrabold text-lg md:text-xl mb-1">
                    أكمل الإقرارات الأربعة لتفعيل التمويل
                  </h3>
                  <p className="text-xs md:text-sm text-white/90 leading-relaxed">
                    إقرار صحة البيانات • توثيق المستندات • الالتزام بعدم التأخير • السند التنفيذي —
                    موثّقة بحجّية كاملة وفق نظام التعاملات الإلكترونية السعودي.
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg shrink-0"
                >
                  <Link to={`/financing/acknowledgments?app=${app.id}`}>
                    <ScrollText className="h-4 w-4 ml-2" />
                    بدء الإقرارات
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Contract signing area — only when contract_pending_signature */}
        <AnimatePresence mode="wait">
          {app.status === 'contract_pending_signature' && (
            <motion.div
              key="contract-sign"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Card className="border-primary/40 bg-gradient-to-br from-primary/10 via-background to-background p-5 md:p-6 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-11 w-11 rounded-xl bg-primary/15 ring-1 ring-primary/40 flex items-center justify-center shrink-0">
                    <PenLine className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-0.5">توقيع عقد التمويل</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      عقدك جاهز للتوقيع رقمياً. اضغط الزر بالأسفل لمراجعة بنود العقد وتوقيعه إلكترونياً بحجية قانونية كاملة.
                    </p>
                  </div>
                  {contract && (
                    <Badge className="bg-primary/15 text-primary ring-1 ring-primary/40 border-0">
                      {contract.contract_number}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    onClick={openOrCreateContract}
                    disabled={creatingContract}
                    className="flex-1 gap-2 shadow-lg"
                  >
                    {creatingContract ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <PenLine className="h-5 w-5" />
                    )}
                    {contract ? 'فتح العقد وتوقيعه رقمياً' : 'إنشاء العقد وبدء التوقيع'}
                  </Button>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground sm:max-w-[40%]">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    موثّق برقم تحقق فريد، طابع زمني، وسجل IP — مطابق لنظام التعاملات الإلكترونية السعودي.
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment area — only when waiting_down_payment */}
        <AnimatePresence mode="wait">
          {app.status === 'waiting_down_payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <Card className="border-amber-500/40 bg-gradient-to-br from-amber-50 to-amber-50/30 dark:from-amber-950/30 dark:to-transparent p-5 md:p-6 shadow-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-11 w-11 rounded-xl bg-amber-500/20 ring-1 ring-amber-500/40 flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-0.5">سداد الدفعة الأولى</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      المبلغ المطلوب: <span className="font-bold tabular-nums text-foreground">{fmt(downPayment)} ر.س</span>
                      {' '}— اختر طريقة الدفع المناسبة
                    </p>
                  </div>
                  {hasPendingReceipt && (
                    <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/40 border-0">
                      <Clock3 className="h-3 w-3 ml-1" /> قيد المراجعة
                    </Badge>
                  )}
                </div>

                {!canPay && (hasPendingReceipt || hasApprovedReceipt) && (
                  <div className="rounded-lg bg-background/60 backdrop-blur p-4 text-sm text-muted-foreground border border-border/40">
                    {hasApprovedReceipt
                      ? `✅ تم تأكيد الدفع. ${FINANCING_TEAMS.funding} يعمل على تفعيل الرصيد.`
                      : `⏳ تم استلام دفعتك. ${FINANCING_TEAMS.credit} يراجعها الآن.`}
                  </div>
                )}

                {canPay && (
                  <Tabs value={paymentTab} onValueChange={(v: any) => setPaymentTab(v)}>
                    <TabsList className="w-full grid grid-cols-2 mb-4">
                      <TabsTrigger value="wallet" className="gap-2">
                        <Wallet className="h-4 w-4" /> المحفظة الرقمية
                      </TabsTrigger>
                      <TabsTrigger value="bank_transfer" className="gap-2">
                        <Building2 className="h-4 w-4" /> تحويل بنكي
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="wallet" className="space-y-4 mt-0">
                      <div className="rounded-xl bg-background/60 backdrop-blur border border-border/40 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs text-muted-foreground">رصيد محفظتك الحالي</div>
                          <Badge variant={walletEnough ? 'default' : 'destructive'} className={walletEnough ? 'bg-emerald-500' : ''}>
                            {walletEnough ? 'كافٍ' : 'غير كافٍ'}
                          </Badge>
                        </div>
                        <div className="text-2xl font-extrabold tabular-nums mb-1">
                          {fmt(walletBalance)} <span className="text-sm font-normal text-muted-foreground">ر.س</span>
                        </div>
                        {!walletEnough && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">
                            تحتاج إضافة {fmt(downPayment - walletBalance)} ر.س. <Link to="/wallet" className="underline font-medium">شحن المحفظة الآن</Link>
                          </p>
                        )}
                      </div>
                      <Button
                        size="lg"
                        className="w-full font-bold shadow-lg hover-scale"
                        disabled={!walletEnough || paying}
                        onClick={submitWalletPayment}
                      >
                        {paying ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Wallet className="h-4 w-4 ml-2" />}
                        ادفع {fmt(downPayment)} ر.س من المحفظة
                      </Button>
                    </TabsContent>

                    <TabsContent value="bank_transfer" className="space-y-4 mt-0">
                      {/* IBAN card */}
                      <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white p-4 ring-1 ring-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[10px] uppercase tracking-widest text-white/60">حساب التحويل الرسمي</div>
                          <Building2 className="h-4 w-4 text-cyan-300" />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between gap-2">
                            <span className="text-white/60">البنك</span>
                            <span className="font-semibold">{MASTER_PAYLATER_BANK.bankName}</span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-white/60">المستفيد</span>
                            <span className="font-semibold text-left">{MASTER_PAYLATER_BANK.beneficiaryName}</span>
                          </div>
                          <div className="flex justify-between items-center gap-2 border-t border-white/10 pt-2">
                            <span className="text-white/60">IBAN</span>
                            <button onClick={copyIban} className="font-mono text-xs bg-white/10 hover:bg-white/20 transition px-2 py-1 rounded flex items-center gap-1.5">
                              {MASTER_PAYLATER_BANK.iban}
                              <Copy className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="bank">البنك المُحوَّل منه *</Label>
                          <Input id="bank" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="مثلاً: الراجحي" />
                        </div>
                        <div>
                          <Label htmlFor="ref">رقم العملية / المرجع *</Label>
                          <Input id="ref" value={refNo} onChange={(e) => setRefNo(e.target.value)} placeholder="مرجع التحويل" />
                        </div>
                        <div>
                          <Label htmlFor="date">تاريخ التحويل</Label>
                          <Input id="date" type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="amount">المبلغ المُحوَّل (ر.س)</Label>
                          <Input id="amount" type="number" value={downPayment} disabled />
                        </div>
                      </div>

                      <div>
                        <Label>إيصال التحويل (صورة أو PDF) *</Label>
                        <label className="block cursor-pointer mt-1">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
                          />
                          <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition py-4 text-sm text-muted-foreground">
                            <Upload className="h-4 w-4" />
                            {receiptFile?.name ?? 'اختر إيصال التحويل'}
                          </div>
                        </label>
                      </div>

                      <Button
                        size="lg"
                        className="w-full font-bold shadow-lg hover-scale"
                        disabled={paying}
                        onClick={submitBankTransfer}
                      >
                        {paying ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Receipt className="h-4 w-4 ml-2" />}
                        إرسال الإيصال للمراجعة
                      </Button>
                    </TabsContent>
                  </Tabs>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Receipts history */}
        {receipts.length > 0 && (
          <Card className="p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" /> سجل عمليات الدفع
            </h3>
            <div className="space-y-2">
              {receipts.map((r) => {
                const tone =
                  r.status === 'approved'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30'
                    : r.status === 'rejected'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/30'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/30';
                return (
                  <div key={r.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border/40 bg-card">
                    <div className="flex items-center gap-3 min-w-0">
                      {r.payment_method === 'wallet' ? (
                        <Wallet className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium">
                          {r.payment_method === 'wallet' ? 'دفع من المحفظة' : `تحويل بنكي${r.bank_name ? ` — ${r.bank_name}` : ''}`}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="tabular-nums">{fmt(Number(r.amount))} ر.س</span>
                          <span>•</span>
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(r.created_at).toLocaleDateString('en-GB')}</span>
                        </div>
                        {r.reviewer_note && (
                          <div className="text-xs text-muted-foreground mt-1">ملاحظة المراجع: {r.reviewer_note}</div>
                        )}
                      </div>
                    </div>
                    <Badge className={`${tone} ring-1 border-0`}>
                      {r.status === 'approved' ? 'مؤكد' : r.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Documents */}
        {docs.length > 0 && (
          <Card className="p-5">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> المستندات المرفوعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-card text-sm">
                  <span>{FINANCING_DOC_LABELS_AR[d.document_type] ?? d.document_type}</span>
                  <Badge variant={d.status === 'approved' ? 'default' : d.status === 'rejected' ? 'destructive' : 'secondary'} className="text-[10px]">
                    {d.status === 'approved' ? 'موافق' : d.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Support */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-xs leading-relaxed text-muted-foreground">
              لأي استفسار حول طلبك، تواصل مع <span className="font-semibold text-foreground">{FINANCING_TEAMS.unified}</span>{' '}
              على الرقم <span className="font-mono font-semibold text-foreground">{FINANCING_TEAMS.contact}</span>.
              ستصلك جميع تحديثات الطلب على واتساب لحظيًا.
            </div>
          </div>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default FinancingDetails;
