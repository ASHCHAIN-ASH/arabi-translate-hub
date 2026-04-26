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
import FinancingDetailsHero from '@/components/financing/FinancingDetailsHero';
import FinancingJourneyShowcase from '@/components/financing/FinancingJourneyShowcase';
import FinancialDashboard from '@/components/financing/FinancialDashboard';
import InstallmentsPaymentPanel from '@/components/financing/InstallmentsPaymentPanel';
import FinancingTimeline from '@/components/financing/FinancingTimeline';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  auto_debit_enabled?: boolean;
  ai_risk_score?: number | null;
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
  { key: 'execution_deed', label: 'السند التنفيذي', icon: Gavel },
  { key: 'active', label: 'تفعيل الرصيد', icon: Sparkles },
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

  // Live ticking clock for countdown to next installment
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(t);
  }, []);


  const load = useCallback(async () => {
    if (!id || !user) return;
    setLoading(true);
    const [appRes, docsRes, receiptsRes, walletRes, contractRes, instRes] = await Promise.all([
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
      supabase
        .from('financing_installments')
        .select('id,month_number,amount,due_date,status,paid_at,paid_amount')
        .eq('application_id', id)
        .order('month_number', { ascending: true }),
    ]);
    if (appRes.data) setApp(appRes.data as FinancingApp);
    if (docsRes.data) setDocs(docsRes.data as DocumentRow[]);
    if (receiptsRes.data) setReceipts(receiptsRes.data as PaymentReceipt[]);
    if (walletRes.data) setWallet(walletRes.data as WalletRow);
    if (instRes.data) setInstallments(instRes.data as InstallmentRow[]);
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financing_installments', filter: `application_id=eq.${id}` }, () => load())
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
        <div
          dir="rtl"
          aria-busy="true"
          aria-live="polite"
          className="max-w-5xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6"
        >
          {/* Back link skeleton */}
          <Skeleton className="h-4 w-28" />

          {/* Hero header skeleton */}
          <Card className="p-4 sm:p-6 border-border/60">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-7 sm:h-9 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-4 border-t border-border/40">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-lg bg-muted/40 p-2.5 sm:p-3 space-y-1.5">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </Card>

          {/* Stages timeline skeleton — mirrors real horizontal RTL timeline */}
          <Card dir="rtl" className="p-4 sm:p-6 border-border/60">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16 rounded-full" />
            </div>
            <div className="rounded-xl bg-muted/30 ring-1 ring-border/40 p-3 sm:p-4">
              <div
                className="flex items-start justify-between gap-1 overflow-x-auto pb-1 scrollbar-none"
                role="list"
                aria-label="مراحل التمويل (جاري التحميل)"
              >
                {TIMELINE_STAGES.map((stage, idx) => {
                  const state = idx < 2 ? 'done' : idx === 2 ? 'current' : 'upcoming';
                  const StageIcon = stage.icon;
                  const isLast = idx === TIMELINE_STAGES.length - 1;
                  const isCurrent = state === 'current';

                  const circleClass =
                    state === 'done'
                      ? 'bg-emerald-500/20 ring-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                      : isCurrent
                      ? 'bg-primary/15 ring-primary/50 text-primary'
                      : 'bg-muted ring-border/50 text-muted-foreground/40';

                  // Outgoing connector: if previous stage is current, animate it as shimmer
                  const incomingFromCurrent = idx > 0 && idx - 1 === 2; // connector between current and next
                  const connectorBaseClass =
                    state === 'done'
                      ? 'bg-emerald-500/40'
                      : incomingFromCurrent
                      ? 'bg-gradient-to-l from-primary/50 via-primary/20 to-muted-foreground/15 bg-[length:200%_100%] animate-[shimmer-rtl_1.6s_linear_infinite]'
                      : 'bg-muted-foreground/15';

                  return (
                    <React.Fragment key={stage.key}>
                      <div role="listitem" className="flex flex-col items-center gap-1.5 min-w-[56px] sm:min-w-[68px] shrink-0">
                        <div className="relative">
                          {/* Outer glowing halo for current stage */}
                          {isCurrent && (
                            <>
                              <span
                                aria-hidden="true"
                                className="absolute inset-0 rounded-full bg-primary/30 animate-ping"
                              />
                              <span
                                aria-hidden="true"
                                className="absolute -inset-1.5 rounded-full bg-primary/10 blur-md animate-[pulse-soft_2s_ease-in-out_infinite]"
                              />
                            </>
                          )}
                          <div
                            className={`relative h-9 w-9 sm:h-10 sm:w-10 rounded-full ring-2 ${circleClass} flex items-center justify-center transition-all ${
                              isCurrent ? 'shadow-lg shadow-primary/40' : ''
                            }`}
                            style={
                              isCurrent
                                ? {
                                    animation: 'pulse-soft 1.6s ease-in-out infinite',
                                  }
                                : undefined
                            }
                          >
                            <StageIcon
                              className={`h-4 w-4 sm:h-[18px] sm:w-[18px] ${
                                isCurrent ? 'opacity-100' : 'opacity-80'
                              }`}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                        <Skeleton
                          className={`h-2 w-12 sm:w-14 ${
                            state === 'upcoming' ? 'opacity-40' : isCurrent ? 'bg-primary/25' : ''
                          }`}
                        />
                        {isCurrent && (
                          <Skeleton className="h-2 w-8 rounded-full bg-primary/30" />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`relative h-1 flex-1 min-w-[8px] rounded-full mt-[18px] sm:mt-5 overflow-hidden ${connectorBaseClass}`}
                          aria-hidden="true"
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Action panels skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="p-4 sm:p-5 border-border/60 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-9 w-9 rounded-lg" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </Card>
            ))}
          </div>

          <span className="sr-only">جاري تحميل تفاصيل الطلب…</span>
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

  const _nextDueRow = installments.find((i) => i.status !== 'paid');
  const _paidCount = installments.filter((i) => i.status === 'paid').length;

  return (
    <ClientLayout>
      <div dir="rtl" className="space-y-5 max-w-5xl mx-auto animate-fade-in">
        {/* Banking-grade Hero with countdown + repayment progress */}
        <FinancingDetailsHero
          applicationId={app.id}
          totalAmount={app.total_amount}
          downPayment={app.down_payment}
          monthlyInstallment={app.monthly_installment}
          durationMonths={app.duration_months}
          remainingAmount={app.remaining_amount}
          statusLabel={FINANCING_STATUS_LABELS_AR[app.status] ?? app.status}
          statusKey={app.status}
          nextDueDate={_nextDueRow?.due_date}
          paidInstallments={_paidCount}
          totalInstallments={installments.length}
        />

        {/* Interactive timeline of the financing journey */}
        <FinancingTimeline currentStatus={app.status} />

        {/* Financial dashboard — progress, next due, wallet, AI score */}
        <FinancialDashboard
          totalAmount={Number(app.total_amount)}
          remainingAmount={Number(app.remaining_amount)}
          monthlyInstallment={Number(app.monthly_installment)}
          installments={installments as any}
          walletBalance={walletBalance}
          aiRiskScore={app.ai_risk_score ?? null}
        />

        {/* Pay installments from wallet + auto-debit toggle (only when active) */}
        {app.status === 'active' && user && installments.length > 0 && (
          <InstallmentsPaymentPanel
            applicationId={app.id}
            userId={user.id}
            installments={installments as any}
            walletBalance={walletBalance}
            autoDebitEnabled={app.auto_debit_enabled ?? true}
            onPaid={() => load()}
            onAutoDebitToggle={(v) => setApp((prev) => prev ? { ...prev, auto_debit_enabled: v } : prev)}
          />
        )}

        {/* Stages timeline (kept as banking journey strip) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card dir="rtl" className="p-4 sm:p-6 border-border/60 bg-gradient-to-br from-card via-card to-muted/20">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <TrendingUp className="h-4 w-4 text-primary" /> مسار التمويل
              </div>
              <span className="text-[11px] text-muted-foreground">
                {FINANCING_STATUS_LABELS_AR[app.status] ?? app.status}
              </span>
            </div>
            <div className="rounded-xl bg-muted/30 ring-1 ring-border/40 p-3 sm:p-4">
              <div className="flex items-start justify-between gap-1 overflow-x-auto pb-1" role="list" aria-label="مراحل التمويل">
                {TIMELINE_STAGES.map((stage, idx) => {
                  const state = stageReached(app.status, stage.key);
                  const Icon = stage.icon;
                  const isLast = idx === TIMELINE_STAGES.length - 1;
                  const isCurrent = state === 'current';
                  return (
                    <React.Fragment key={stage.key}>
                      <motion.div
                        role="listitem"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + idx * 0.07 }}
                        className="flex flex-col items-center gap-1.5 min-w-[60px] sm:min-w-[72px] shrink-0"
                      >
                        <div className="relative">
                          {isCurrent && (
                            <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                          )}
                          <div
                            className={`relative h-10 w-10 rounded-full ring-2 flex items-center justify-center transition-all ${
                              state === 'done'
                                ? 'bg-emerald-500/20 ring-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                                : isCurrent
                                ? 'bg-primary/15 ring-primary/50 text-primary shadow-lg shadow-primary/30'
                                : 'bg-muted ring-border/50 text-muted-foreground/50'
                            }`}
                          >
                            {state === 'done' ? <CheckCircle2 className="h-[18px] w-[18px]" /> : <Icon className="h-[18px] w-[18px]" />}
                          </div>
                        </div>
                        <span className={`text-[10px] sm:text-[11px] text-center font-semibold leading-tight ${
                          state === 'upcoming' ? 'text-muted-foreground/60' : isCurrent ? 'text-primary' : 'text-foreground'
                        }`}>
                          {stage.label}
                        </span>
                      </motion.div>
                      {!isLast && (
                        <div className={`h-1 flex-1 min-w-[8px] rounded-full mt-5 ${
                          state === 'done' ? 'bg-emerald-500/40' : isCurrent ? 'bg-gradient-to-l from-primary/50 via-primary/20 to-muted-foreground/15' : 'bg-muted-foreground/15'
                        }`} aria-hidden="true" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              {REJECTED_LIKE.includes(app.status) && (
                <div className="mt-3 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  هذا الطلب {FINANCING_STATUS_LABELS_AR[app.status]} — تواصل مع {FINANCING_TEAMS.followup} ({FINANCING_TEAMS.contact}).
                </div>
              )}
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
                  className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg shrink-0 w-full sm:w-auto h-12 sm:h-11 text-base sm:text-sm"
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
                    className="flex-1 gap-2 shadow-lg w-full sm:w-auto h-12 sm:h-11 text-base sm:text-sm font-bold"
                  >
                    {creatingContract ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <PenLine className="h-5 w-5" />
                    )}
                    {contract ? 'فتح العقد وتوقيعه رقمياً' : 'إنشاء العقد وبدء التوقيع'}
                  </Button>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground sm:max-w-[40%]">
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
                    <TabsList className="w-full grid grid-cols-2 mb-4 h-auto">
                      <TabsTrigger value="wallet" className="gap-2 py-2.5 sm:py-2 text-xs sm:text-sm">
                        <Wallet className="h-4 w-4" /> المحفظة الرقمية
                      </TabsTrigger>
                      <TabsTrigger value="bank_transfer" className="gap-2 py-2.5 sm:py-2 text-xs sm:text-sm">
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
                        className="w-full font-bold shadow-lg hover-scale h-12 sm:h-11 text-base sm:text-sm"
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
                        className="w-full font-bold shadow-lg hover-scale h-12 sm:h-11 text-base sm:text-sm"
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

        {/* Installments schedule */}
        {installments.length > 0 && (() => {
          const totalDue = installments.reduce((s, i) => s + Number(i.amount), 0);
          const totalPaid = installments
            .filter((i) => i.status === 'paid')
            .reduce((s, i) => s + Number(i.paid_amount ?? i.amount), 0);
          const remaining = Math.max(0, totalDue - totalPaid);
          const paidCount = installments.filter((i) => i.status === 'paid').length;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const nextDue = installments.find((i) => i.status !== 'paid');
          const progressPct = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;

          return (
            <Card className="p-5 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> جدول السداد الشهري
                </h3>
                <Badge variant="outline" className="text-[11px]">
                  {paidCount} / {installments.length} قسط مدفوع
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                  <div className="text-[10px] text-muted-foreground mb-1">إجمالي السداد</div>
                  <div className="font-bold tabular-nums text-sm">{fmt(totalDue)} ر.س</div>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mb-1">المسدّد</div>
                  <div className="font-bold tabular-nums text-sm text-emerald-700 dark:text-emerald-400">{fmt(totalPaid)} ر.س</div>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  <div className="text-[10px] text-amber-700 dark:text-amber-400 mb-1">المتبقي</div>
                  <div className="font-bold tabular-nums text-sm text-amber-700 dark:text-amber-400">{fmt(remaining)} ر.س</div>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                  <div className="text-[10px] text-muted-foreground mb-1">القسط القادم</div>
                  <div className="font-bold tabular-nums text-sm">
                    {nextDue ? new Date(nextDue.due_date).toLocaleDateString('en-GB') : '—'}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                  <span>تقدم السداد</span>
                  <span className="tabular-nums font-semibold text-foreground">{progressPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* عدّ تنازلي للقسط القادم */}
              {nextDue && (() => {
                const dueMs = new Date(nextDue.due_date).setHours(0, 0, 0, 0);
                const diffMs = dueMs - now;
                const dayMs = 86_400_000;
                const totalDays = Math.floor(Math.abs(diffMs) / dayMs);
                const totalHours = Math.floor((Math.abs(diffMs) % dayMs) / 3_600_000);
                const isOverdueNext = diffMs < 0;
                const isUrgent = !isOverdueNext && diffMs <= 3 * dayMs;
                const tone = isOverdueNext
                  ? { bg: 'from-rose-500/15 via-rose-500/5 to-transparent', ring: 'ring-rose-500/30', text: 'text-rose-700 dark:text-rose-300', label: 'متأخر عن السداد بـ', icon: AlertCircle, pulse: 'animate-pulse' }
                  : isUrgent
                  ? { bg: 'from-amber-500/15 via-amber-500/5 to-transparent', ring: 'ring-amber-500/40', text: 'text-amber-700 dark:text-amber-300', label: 'متبقي على القسط القادم', icon: Clock3, pulse: 'animate-pulse' }
                  : { bg: 'from-primary/15 via-primary/5 to-transparent', ring: 'ring-primary/30', text: 'text-primary', label: 'متبقي على القسط القادم', icon: Calendar, pulse: '' };
                const ToneIcon = tone.icon;
                const dayWord = totalDays === 1 ? 'يوم' : totalDays === 2 ? 'يومان' : totalDays >= 3 && totalDays <= 10 ? 'أيام' : 'يومًا';
                const hourWord = totalHours === 1 ? 'ساعة' : totalHours === 2 ? 'ساعتان' : totalHours >= 3 && totalHours <= 10 ? 'ساعات' : 'ساعة';
                return (
                  <div className={`mb-4 rounded-xl bg-gradient-to-l ${tone.bg} ring-1 ${tone.ring} p-3 sm:p-4`} role="status" aria-live="polite">
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                      <div className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${tone.text}`}>
                        <ToneIcon className={`h-4 w-4 ${tone.pulse}`} aria-hidden="true" />
                        <span>{tone.label}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] sm:text-[11px] tabular-nums border-current">
                        {fmt(Number(nextDue.amount))} ر.س
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div className="rounded-lg bg-background/60 backdrop-blur-sm ring-1 ring-border/40 p-2.5 sm:p-3 text-center">
                        <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${tone.text}`}>{totalDays}</div>
                        <div className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">{dayWord}</div>
                      </div>
                      <div className="rounded-lg bg-background/60 backdrop-blur-sm ring-1 ring-border/40 p-2.5 sm:p-3 text-center">
                        <div className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${tone.text}`}>{totalHours}</div>
                        <div className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">{hourWord}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground mt-2.5">
                      <span>تاريخ الاستحقاق</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {new Date(nextDue.due_date).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {installments.map((i) => {
                  const due = new Date(i.due_date);
                  due.setHours(0, 0, 0, 0);
                  const isPaid = i.status === 'paid';
                  const isOverdue = !isPaid && due < today;
                  const isNext = !isPaid && nextDue?.id === i.id;
                  const tone = isPaid
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : isOverdue
                      ? 'border-rose-500/30 bg-rose-500/5'
                      : isNext
                        ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
                        : 'border-border/40 bg-card';
                  const StatusIcon = isPaid ? CheckCircle2 : isOverdue ? AlertCircle : Clock3;
                  const statusText = isPaid
                    ? `مدفوع${i.paid_at ? ` • ${new Date(i.paid_at).toLocaleDateString('en-GB')}` : ''}`
                    : isOverdue
                      ? 'متأخر'
                      : isNext
                        ? 'القسط القادم'
                        : 'مستحق لاحقاً';
                  const statusTone = isPaid
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isOverdue
                      ? 'text-rose-600 dark:text-rose-400'
                      : isNext
                        ? 'text-primary'
                        : 'text-muted-foreground';

                  return (
                    <div
                      key={i.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${tone} transition-colors`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold tabular-nums ${
                            isPaid
                              ? 'bg-emerald-500 text-white'
                              : isOverdue
                                ? 'bg-rose-500 text-white'
                                : isNext
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {i.month_number}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold">القسط {i.month_number}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            <span className="tabular-nums">{due.toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="font-bold tabular-nums text-sm">{fmt(Number(i.amount))} ر.س</div>
                        <div className={`text-[10px] flex items-center gap-1 ${statusTone}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span>{statusText}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })()}

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

        {/* Journey showcase — صور واقعية */}
        <FinancingJourneyShowcase
          title="تذكير برحلتك"
          subtitle="حيث وصلت في رحلة التمويل وما الذي ينتظرك بعد التفعيل."
        />

        {/* Support */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
            <div className="text-xs leading-relaxed text-muted-foreground space-y-2">
              <p>
                لأي استفسار حول طلبك، تواصل مع{' '}
                <span className="font-semibold text-foreground">{FINANCING_TEAMS.unified}</span>{' '}
                مباشرةً عبر واتساب — ستصلك جميع تحديثات الطلب لحظيًا.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${FINANCING_TEAMS.whatsappPrimary}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30 px-3 py-1.5 font-mono font-semibold tabular-nums transition-colors"
                >
                  <span>واتساب</span>
                  <span dir="ltr">{FINANCING_TEAMS.contact}</span>
                </a>
                <a
                  href={`mailto:${FINANCING_TEAMS.email}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary ring-1 ring-primary/30 px-3 py-1.5 font-semibold transition-colors"
                >
                  {FINANCING_TEAMS.email}
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default FinancingDetails;
