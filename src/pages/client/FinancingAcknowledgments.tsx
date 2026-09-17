import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileSignature,
  ShieldCheck,
  Clock3,
  Gavel,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Download,
} from 'lucide-react';
import { downloadAcknowledgmentPdf } from '@/lib/financingAckPdf';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AcknowledgmentDialog, { type AcknowledgmentClause } from '@/components/financing/AcknowledgmentDialog';
import {
  FINANCING_ACK_TITLES_AR,
  FINANCING_MISSION_AR,
  type FinancingAcknowledgmentType,
} from '@/lib/financing';
import { cn } from '@/lib/utils';

interface AckCardConfig {
  key: FinancingAcknowledgmentType;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  accent: 'primary' | 'amber' | 'rose' | 'emerald';
  prologue: string;
  clauses: AcknowledgmentClause[];
  ctaLabel: string;
}

const ACK_CARDS: AckCardConfig[] = [
  {
    key: 'request',
    title: FINANCING_ACK_TITLES_AR.request,
    subtitle: 'تأكيد صحة بيانات طلب التمويل قبل إرساله للتقييم الائتماني',
    Icon: FileSignature,
    accent: 'primary',
    prologue:
      'هذه البيانات هي الأساس الذي يُبنى عليه القرار الائتماني. أي معلومة غير دقيقة قد تؤدي لرفض الطلب أو إلغائه لاحقاً وفق نظام مكافحة الاحتيال المالي السعودي.',
    ctaLabel: 'أُقرّ بصحة بياناتي',
    clauses: [
      { id: 'r1', text: 'أُقرّ بأن جميع البيانات الشخصية المُدخلة (الاسم، الهوية، الجوال، البريد) صحيحة ومطابقة لهويتي الوطنية.' },
      { id: 'r2', text: 'أُقرّ بأن بيانات الدخل والوضع المالي المُصرَّح بها صحيحة ولم يتم المبالغة فيها بأي شكل.' },
      { id: 'r3', text: 'أعلم أن المنصة قد تتحقق من هذه البيانات لدى الجهات الرسمية وشركة سمة (SIMAH).' },
      { id: 'r4', critical: true, text: 'أُقرّ بأن أي تزوير أو إخفاء لمعلومات يُعرّضني للمساءلة الجزائية وفق الأنظمة المعمول بها.' },
    ],
  },
  {
    key: 'documentation',
    title: FINANCING_ACK_TITLES_AR.documentation,
    subtitle: 'إقرار توثيق المستندات الداعمة للطلب وصحة محتواها',
    Icon: ShieldCheck,
    accent: 'emerald',
    prologue:
      'المستندات التي ترفعها (الهوية، كشوف الحساب، إثبات الدخل) تُعتبر جزءاً لا يتجزأ من ملف التمويل، وأي تلاعب فيها يُبطل العقد فوراً.',
    ctaLabel: 'أُقرّ بصحة المستندات',
    clauses: [
      { id: 'd1', text: 'أُقرّ بأن جميع المستندات المرفوعة أصلية وصادرة من الجهات الرسمية المختصة.' },
      { id: 'd2', text: 'أُقرّ بأنني لم أُجرِ أي تعديل أو معالجة رقمية على هذه المستندات.' },
      { id: 'd3', text: 'أوافق على احتفاظ المنصة بنسخ مشفّرة من هذه المستندات وفق نظام حماية البيانات السعودي (PDPL).' },
      { id: 'd4', critical: true, text: 'أُقرّ بأن أي تزوير في المستندات يُعدّ جريمة موجبة للملاحقة الجزائية وإلغاء العقد فوراً.' },
    ],
  },
  {
    key: 'no_delay',
    title: FINANCING_ACK_TITLES_AR.no_delay,
    subtitle: 'إقرار صريح بالالتزام بمواعيد السداد ضمن مهلة الـ 24 ساعة',
    Icon: Clock3,
    accent: 'amber',
    prologue: FINANCING_MISSION_AR,
    ctaLabel: 'أُقرّ بالالتزام بالسداد',
    clauses: [
      { id: 'n1', text: 'أُدرك أن مهلة السماح للسداد هي 24 ساعة فقط من تاريخ استحقاق كل قسط، ولا تُمنح أي مهلة إضافية.' },
      { id: 'n2', text: 'أُدرك أنه لا توجد دفعات تأخير مالية إضافية — والإجراءات تنتقل مباشرةً للتصعيد القانوني.' },
      { id: 'n3', critical: true, text: 'أُدرك أن تجاوز مهلة الـ 24 ساعة يُفعّل تلقائياً مسار الإحالة لمحكمة التنفيذ السعودية واستحقاق كامل المبلغ المتبقي دفعة واحدة.' },
      { id: 'n4', critical: true, text: 'أتعهّد بسداد جميع الأقساط في مواعيدها المحدّدة احتراماً للثقة الممنوحة لي من المنصة لدعم رحلتي التعليمية.' },
    ],
  },
  {
    key: 'execution_deed',
    title: FINANCING_ACK_TITLES_AR.execution_deed,
    subtitle: 'إقرار رسمي بأن العقد يُعدّ سنداً تنفيذياً واجب التنفيذ',
    Icon: Gavel,
    accent: 'rose',
    prologue:
      'هذا أهم إقرار في النظام — تأكيدك بأن عقد التمويل بعد توقيعه إلكترونياً يُصبح سنداً تنفيذياً مباشراً يُنفَّذ أمام محكمة التنفيذ السعودية دون الحاجة لاستصدار حكم قضائي مسبق وفق نظام التنفيذ السعودي (المرسوم الملكي م/53).',
    ctaLabel: 'أُقرّ بقوة العقد التنفيذية',
    clauses: [
      { id: 'e1', text: 'أُقرّ بأنني قرأت كامل بنود عقد التمويل وفهمت آثاره القانونية بصورة تامة.' },
      { id: 'e2', critical: true, text: 'أُقرّ صراحةً بأن هذا العقد يُعدّ سنداً تنفيذياً واجب التنفيذ أمام محكمة التنفيذ السعودية وفق نظام التنفيذ (م/53).' },
      { id: 'e3', critical: true, text: 'أُقرّ بحق الممول في استخراج صيغة تنفيذية من العقد وإحالته للجهات القضائية مباشرة عند التعثّر دون الحاجة لحكم قضائي مسبق.' },
      { id: 'e4', critical: true, text: 'أُدرك أن التعثّر يُفعّل كامل عقوبات نظام التنفيذ بما فيها منع السفر، الحجز على الحسابات، إيقاف الخدمات الحكومية، والإفصاح القسري عن الأصول.' },
      { id: 'e5', text: 'أُقرّ بأن أتعاب المحاماة (5,000 ر.س) تُضاف تلقائياً إلى مديونيتي عند إحالة الملف لمكتب المحاماة المتعاقد.' },
      { id: 'e6', critical: true, text: 'أُقرّ بعلمي وموافقتي على أنه سيتم خلال 24 إلى 48 ساعة من اعتماد الطلب إصدار «سند تنفيذي» رسمي عبر منصة «نافذ» الحكومية وإرساله إليّ للتوقيع الإلكتروني الموثّق، ويُعدّ توقيعي عليه عبر نافذ إقراراً نهائياً ملزماً وواجب التنفيذ وفق نظام التنفيذ السعودي (م/53).' },
    ],
  },
];

const FinancingAcknowledgments: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('app');
  const focus = searchParams.get('focus') as FinancingAcknowledgmentType | null;

  const [openKey, setOpenKey] = useState<FinancingAcknowledgmentType | null>(null);
  const [completed, setCompleted] = useState<Set<FinancingAcknowledgmentType>>(new Set());
  const [profileName, setProfileName] = useState<string>('');

  useEffect(() => {
    document.title = 'الإقرارات الرقمية — FekrahEdu PayLater';
  }, []);

  // فتح الإقرار المطلوب فقط إذا لم يكن موقّعاً مسبقاً
  useEffect(() => {
    if (focus && !completed.has(focus)) setOpenKey(focus);
  }, [focus, completed]);

  // تحميل بيانات المستخدم + الإقرارات الموقّعة سابقاً (لمنع إعادة التوقيع)
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const [{ data: prof }, { data: acks }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
        applicationId
          ? supabase
              .from('financing_acknowledgments' as any)
              .select('ack_type')
              .eq('application_id', applicationId)
              .eq('user_id', user.id)
          : Promise.resolve({ data: [] as any[] }),
      ]);
      if ((prof as any)?.full_name) setProfileName((prof as any).full_name);
      if (Array.isArray(acks)) {
        setCompleted(new Set((acks as any[]).map((r) => r.ack_type)));
      }
    })();
  }, [user?.id, applicationId]);

  // بصمة SHA-256 للدليل القانوني
  const buildEvidenceHash = async (data: Record<string, unknown>) => {
    const json = JSON.stringify(data);
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(json));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleConfirm = async (
    key: FinancingAcknowledgmentType,
    payload: { fullName: string; signedAt: string; clauses: string[] },
  ) => {
    // حماية مزدوجة: لا نسمح بإعادة التوقيع
    if (completed.has(key)) {
      toast({
        title: 'تم توثيق هذا الإقرار مسبقاً',
        description: 'لا يمكن إعادة توقيع إقرار سبق توثيقه — السجل محفوظ بصفة دائمة.',
        variant: 'destructive',
      });
      setOpenKey(null);
      throw new Error('already_signed');
    }

    if (!applicationId) {
      toast({
        title: 'تعذّر التوثيق',
        description: 'رقم طلب التمويل مفقود.',
        variant: 'destructive',
      });
      throw new Error('no_application_id');
    }

    const evidence = {
      ack_type: key,
      ack_title: FINANCING_ACK_TITLES_AR[key],
      signer_name: payload.fullName,
      signed_at: payload.signedAt,
      accepted_clauses: payload.clauses,
      application_id: applicationId,
      user_id: user?.id,
      user_agent: navigator.userAgent,
    };
    const evidence_sha256 = await buildEvidenceHash(evidence);

    // إدراج رسمي في الجدول الدائم — UNIQUE constraint يمنع التكرار من الخادم
    const { error } = await supabase.from('financing_acknowledgments' as any).insert({
      application_id: applicationId,
      user_id: user?.id,
      ack_type: key,
      ack_title: FINANCING_ACK_TITLES_AR[key],
      signer_name: payload.fullName,
      accepted_clauses: payload.clauses,
      signature_text: payload.fullName,
      signed_at: payload.signedAt,
      user_agent: navigator.userAgent,
      evidence_sha256,
    } as any);

    if (error) {
      // 23505 = unique_violation → سُجِّل من قبل
      if ((error as any).code === '23505') {
        setCompleted((prev) => new Set(prev).add(key));
        toast({
          title: 'هذا الإقرار موثَّق مسبقاً',
          description: 'لا يمكن إعادة التوقيع.',
          variant: 'destructive',
        });
        setOpenKey(null);
        throw error;
      }
      console.error('[acknowledgments] insert failed:', error);
      toast({
        title: 'تعذّر حفظ الإقرار',
        description: 'يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
      throw error;
    }

    // سجل audit (إضافي، غير حاجب)
    supabase
      .from('audit_logs')
      .insert({
        user_id: user?.id ?? null,
        action: `financing_acknowledgment:${key}`,
        table_name: 'financing_acknowledgments',
        record_id: applicationId,
        new_data: { ...evidence, evidence_sha256 } as any,
      } as any)
      .then(() => {});

    // إشعار واتساب فوري (غير حاجب)
    supabase.functions
      .invoke('financing-whatsapp-notify', {
        body: {
          application_id: applicationId,
          event: 'status_update',
          extra: {
            new_status: 'acknowledgment_signed',
            status_label: `تم توثيق إقرار: ${FINANCING_ACK_TITLES_AR[key]}`,
          },
        },
      })
      .catch((e) => console.warn('[whatsapp ack notify] failed:', e));

    setCompleted((prev) => new Set(prev).add(key));
    toast({
      title: 'تم توثيق الإقرار رقمياً ✓',
      description: `${FINANCING_ACK_TITLES_AR[key]} — مغلق بصفة نهائية`,
    });
  };

  const allDone = ACK_CARDS.every((c) => completed.has(c.key));

  return (
    <ClientLayout>
      <div dir="rtl" className="space-y-6 max-w-5xl mx-auto animate-fade-in">
        <Link
          to={applicationId ? `/financing/${applicationId}` : '/financing'}
          className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowRight className="h-4 w-4 rotate-180" /> رجوع إلى التمويل
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, hsl(217 91% 18%) 0%, hsl(217 91% 28%) 35%, hsl(199 89% 38%) 100%)',
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl"
            />
            <div className="relative p-6 md:p-10 text-white">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-xl flex items-center justify-center ring-1 ring-white/30"
                >
                  <Lock className="h-7 w-7" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/70 mb-1">
                    <Sparkles className="h-3 w-3" /> نظام الإقرارات الرقمية الصارم
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold">
                    إقراراتك الرسمية قبل تفعيل التمويل
                  </h1>
                </div>
              </div>
              <p className="text-sm md:text-base text-white/90 max-w-3xl leading-relaxed">
                هذه الإقرارات الأربعة جزء لا يتجزأ من العقد التمويلي. كل إقرار يُوثَّق بختم رقمي،
                وطابع زمني، وبصمة جهازك، ويُحفَظ في سجلٍّ قانوني دائم بحجّية كاملة وفق نظام
                التعاملات الإلكترونية السعودي (م/18).
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {ACK_CARDS.map((c, i) => (
                  <motion.div
                    key={c.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={cn(
                      'rounded-xl bg-white/10 backdrop-blur-xl ring-1 p-3 transition',
                      completed.has(c.key) ? 'ring-emerald-300/60 bg-emerald-400/15' : 'ring-white/20',
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-white/80 mb-1">
                      <c.Icon className="h-3.5 w-3.5" />
                      الإقرار {i + 1}
                    </div>
                    <div className="text-xs font-semibold leading-tight">{c.title}</div>
                    {completed.has(c.key) && (
                      <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" /> موثَّق
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACK_CARDS.map((c, idx) => {
            const done = completed.has(c.key);
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.07 }}
              >
                <Card
                  className={cn(
                    'p-5 h-full transition-all hover:shadow-xl border-2',
                    done ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border hover:border-primary/40',
                  )}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ring-1',
                        done
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/40'
                          : 'bg-primary/10 text-primary ring-primary/30',
                      )}
                    >
                      <c.Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px]">
                          الإقرار {idx + 1}
                        </Badge>
                        {done && (
                          <Badge className="bg-emerald-500 text-white text-[10px] gap-1">
                            <CheckCircle2 className="h-3 w-3" /> موثَّق
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-bold text-sm md:text-base leading-tight">{c.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    {c.subtitle}
                  </p>
                  <Button
                    onClick={() => !done && setOpenKey(c.key)}
                    variant={done ? 'outline' : 'default'}
                    className="w-full font-semibold gap-2"
                    size="sm"
                    disabled={done}
                  >
                    {done ? <Lock className="h-4 w-4" /> : <c.Icon className="h-4 w-4" />}
                    {done ? 'موثَّق نهائياً — لا يمكن إعادة التوقيع' : 'بدء الإقرار والتوقيع'}
                  </Button>
                  {done && applicationId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2 gap-2 text-primary hover:bg-primary/10"
                      onClick={async () => {
                        try {
                          await downloadAcknowledgmentPdf({
                            applicationId,
                            ackType: c.key,
                            userId: user?.id,
                          });
                        } catch (e: any) {
                          toast({
                            title: 'تعذّر تنزيل الإقرار',
                            description: e?.message || 'حدث خطأ أثناء توليد الـ PDF',
                            variant: 'destructive',
                          });
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                      تنزيل الإقرار PDF
                    </Button>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-5 border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-emerald-50/30 dark:from-emerald-950/30 dark:to-transparent">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold mb-0.5">اكتمل توثيق جميع الإقرارات ✓</h3>
                  <p className="text-xs text-muted-foreground">
                    يمكنك الآن متابعة مسار التمويل وتوقيع العقد الرئيسي.
                  </p>
                </div>
                <Button
                  onClick={() =>
                    navigate(applicationId ? `/financing/${applicationId}` : '/financing')
                  }
                  className="font-semibold"
                >
                  متابعة
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Dialog */}
      {ACK_CARDS.map((c) => (
        <AcknowledgmentDialog
          key={c.key}
          open={openKey === c.key}
          onClose={() => setOpenKey(null)}
          onConfirm={(p) => handleConfirm(c.key, p)}
          title={c.title}
          subtitle={c.subtitle}
          Icon={c.Icon}
          accent={c.accent}
          prologue={c.prologue}
          clauses={c.clauses}
          ctaLabel={c.ctaLabel}
          defaultFullName={profileName}
        />
      ))}
    </ClientLayout>
  );
};

export default FinancingAcknowledgments;
