import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { AssessmentService, AssessmentQuestion, Assessment } from '@/utils/assessmentService';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';

export default function AssessmentStart() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        // 1) Same-assessment block
        const todayAttemptId = await AssessmentService.getTodayAttemptId(id, user?.id ?? null);
        if (todayAttemptId) {
          toast.info('لقد أكملت اختبار اليوم — هذه نتيجتك');
          navigate(`/challenge-academy/assessments/${id}/result?attempt=${todayAttemptId}`, { replace: true });
          return;
        }

        // 2) Daily quota across ALL specializations (one per 24h)
        const quota = await AssessmentService.getDailyQuotaStatus(user?.id ?? null);
        if (quota && quota.assessment_id !== id) {
          const next = new Date(quota.next_available_at);
          const hoursLeft = Math.max(1, Math.ceil((next.getTime() - Date.now()) / 3600000));
          toast.info(`أنهيت اليوم اختبار "${quota.assessment_title}". يمكنك اختيار تخصص آخر بعد ${hoursLeft} ساعة.`);
          navigate(`/challenge-academy/assessments/${quota.assessment_id}/result?attempt=${quota.attempt_id}`, { replace: true });
          return;
        }

        // 3) Load assessment + daily questions
        const [a, qs] = await Promise.all([
          AssessmentService.getById(id),
          AssessmentService.getDailyQuestions(id, 10),
        ]);
        if (!a) { toast.error('الاختبار غير موجود'); navigate('/challenge-academy/assessments'); return; }
        if (!qs || qs.length === 0) {
          toast.error('لا توجد أسئلة متاحة لهذا التخصص حالياً');
          navigate('/challenge-academy/assessments', { replace: true });
          return;
        }
        setAssessment(a);
        setQuestions(qs);
        setSecondsLeft(a.time_limit_seconds);
        const att = await AssessmentService.createAttempt(a.id, user?.id ?? null);
        setAttemptId(att.id);
        startedAt.current = Date.now();
      } catch (e: any) {
        toast.error('تعذر بدء الاختبار: ' + (e?.message || ''));
      } finally { setLoading(false); }
    })();
  }, [id, user?.id, navigate]);

  // Countdown
  useEffect(() => {
    if (!assessment || submitting) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(t); handleSubmit(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessment, submitting]);

  const total = questions.length;
  const progress = useMemo(() => (total ? ((current + 1) / total) * 100 : 0), [current, total]);
  const q = questions[current];
  const answered = q ? !!answers[q.id] : false;

  const handleSelect = (oid: string) => {
    if (!q) return;
    setAnswers((p) => ({ ...p, [q.id]: oid }));
  };

  const handleNext = () => {
    if (current < total - 1) setCurrent((c) => c + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    try {
      const payload = questions.map((qq) => ({
        question_id: qq.id,
        selected_option_id: answers[qq.id] ?? null,
      }));
      const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
      const res = await AssessmentService.submit(attemptId, payload, elapsed);
      if (!res.success) { toast.error('فشل الإرسال'); setSubmitting(false); return; }
      navigate(`/challenge-academy/assessments/${id}/result?attempt=${attemptId}`);
    } catch (e: any) {
      toast.error('فشل الإرسال: ' + (e?.message || ''));
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }
  if (!assessment || total === 0) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
          <p className="text-muted-foreground">لا توجد أسئلة في هذا الاختبار.</p>
        </div>
      </ClientLayout>
    );
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const lowTime = secondsLeft <= 30;

  return (
    <ClientLayout>
    <div className="min-h-screen bg-background py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground">{assessment.title}</p>
            <p className="text-sm font-semibold">السؤال {current + 1} من {total}</p>
          </div>
          <Badge variant={lowTime ? 'destructive' : 'secondary'} className="gap-1.5 text-sm py-1.5 px-3">
            <Clock className="w-4 h-4" />
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 mb-6" />

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.18 }}
          >
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px]">
                    {q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-relaxed">{q.question_text}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={answers[q.id] || ''} onValueChange={handleSelect} className="gap-3">
                  {q.options.map((opt) => {
                    const selected = answers[q.id] === opt.id;
                    return (
                      <Label
                        key={opt.id}
                        htmlFor={opt.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={opt.id} id={opt.id} />
                        <span className="text-base">{opt.option_text}</span>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Footer Nav */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0 || submitting}
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            السابق
          </Button>
          <Button onClick={handleNext} disabled={!answered || submitting} className="min-w-32">
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : current === total - 1 ? (
              'إنهاء وإرسال'
            ) : (
              <>التالي<ArrowLeft className="w-4 h-4 mr-2" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
    </ClientLayout>
  );
}
