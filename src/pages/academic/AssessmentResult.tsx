import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Share2, Trophy, Sparkles, Loader2, LogIn, Target, RefreshCw } from 'lucide-react';
import { AssessmentService, AssessmentAttempt, Assessment, levelLabel, skillLabel } from '@/utils/assessmentService';
import { useAuth } from '@/components/SimpleAuthProvider';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { buildPublicUrl } from '@/lib/publicUrl';

export default function AssessmentResult() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const attemptId = params.get('attempt');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  const reload = async () => {
    if (!attemptId || !id) return;
    const [att, a] = await Promise.all([
      AssessmentService.getAttempt(attemptId),
      AssessmentService.getById(id),
    ]);
    setAttempt(att);
    setAssessment(a);
  };

  useEffect(() => {
    (async () => {
      try {
        // Try linking anon → user if just signed in
        if (user?.id) await AssessmentService.linkAnonymousAttempts().catch(() => {});
        await reload();
      } finally { setLoading(false); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId, id, user?.id]);

  const lvl = useMemo(() => levelLabel(attempt?.level_result), [attempt]);
  const isOwnerLoggedIn = !!user?.id && attempt?.user_id === user.id;
  const needsLoginToSee = !user?.id && !attempt?.user_id; // anon attempt → ask login to unlock perks

  const handleShare = async () => {
    if (!attempt || !assessment) return;
    const url = buildPublicUrl('/challenge-academy/assessments');
    const text = `🎯 حصلت على ${attempt.total_score}% في "${assessment.title}" (${lvl.label} ${lvl.emoji}) — جرّب الاختبار:`;
    const fullText = `${text} ${url}`;
    setSharing(true);
    try {
      let shared = false;
      // Try Web Share API (works on mobile + secure contexts, often blocked in iframes)
      const canShare = typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function' && window.self === window.top;
      if (canShare) {
        try {
          await (navigator as any).share({ title: assessment.title, text, url });
          shared = true;
        } catch (err: any) {
          if (err?.name === 'AbortError') { setSharing(false); return; }
          // fall through to clipboard
        }
      }
      if (!shared) {
        try {
          await navigator.clipboard.writeText(fullText);
        } catch {
          // Last-resort fallback for restricted contexts
          const ta = document.createElement('textarea');
          ta.value = fullText;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch {}
          document.body.removeChild(ta);
        }
        toast.success('تم نسخ نتيجتك — الصقها في أي مكان لمشاركتها 🎉');
      }
      if (isOwnerLoggedIn && attempt.share_xp_awarded === 0) {
        const r = await AssessmentService.awardShareXp(attempt.id);
        if (r.success && r.xp_awarded) {
          toast.success(`+${r.xp_awarded} XP على المشاركة! 🎉`);
          await reload();
        }
      }
    } catch (e) {
      console.error('share failed', e);
      toast.error('تعذّرت المشاركة، حاول مرة أخرى');
    } finally {
      setSharing(false);
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
  if (!attempt || !assessment) {
    return (
      <ClientLayout>
        <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
          <p className="text-muted-foreground">النتيجة غير متاحة.</p>
        </div>
      </ClientLayout>
    );
  }

  const score = attempt.total_score;
  const skills = Object.entries(attempt.skill_breakdown || {});

  return (
    <ClientLayout>
    <div className="min-h-screen bg-background py-10 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero Score */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden border-2">
            <div className={`h-2 ${lvl.color}`} />
            <CardContent className="pt-8 pb-6 text-center">
              <div className="text-5xl mb-2">{lvl.emoji}</div>
              <p className="text-sm text-muted-foreground mb-2">{assessment.title}</p>
              <div className="text-6xl md:text-7xl font-bold tracking-tight mb-3">{score}%</div>
              <Badge className={`${lvl.color} text-white text-base px-4 py-1.5`}>مستوى {lvl.label}</Badge>
              <p className="text-sm text-muted-foreground mt-4">
                {attempt.correct_count} من {attempt.total_questions} إجابة صحيحة
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Login prompt for anonymous */}
        {needsLoginToSee && (
          <Card className="border-primary/40 bg-primary/5">
            <CardContent className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold text-sm">سجّل لتفتح كامل التحليل وتربح {assessment.xp_completion} XP</p>
                  <p className="text-xs text-muted-foreground">سيتم ربط هذه النتيجة بحسابك تلقائيًا.</p>
                </div>
              </div>
              <Button asChild>
                <Link to={`/login?redirect=/challenge-academy/assessments/${id}/result?attempt=${attemptId}`}>
                  <LogIn className="w-4 h-4 ml-2" /> سجّل الدخول
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" /> تحليل المهارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skills.map(([tag, v]) => (
                <div key={tag}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="font-medium">{skillLabel(tag)}</span>
                    <span className="text-muted-foreground">{v.correct}/{v.total} • {v.percent}%</span>
                  </div>
                  <Progress value={v.percent} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-amber-500" /> توصياتنا لك
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            {attempt.level_result === 'beginner' && 'ابدأ بتحديات الأكاديمية اليومية للمستوى السهل، وركّز على المفردات الأساسية والقواعد البسيطة لبناء أساس قوي.'}
            {attempt.level_result === 'intermediate' && 'أنت في مستوى جيد! خصّص وقتًا للمهارات الأضعف لديك (راجع التحليل أعلاه) وجرّب التحديات المتوسطة يوميًا.'}
            {attempt.level_result === 'advanced' && 'مستوى متميز 🏆 — حافظ على التميز عبر تحديات الأكاديمية الصعبة، وشارك إنجازك ليتحدى أصدقاؤك مستواك!'}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-3">
          <Button onClick={handleShare} disabled={sharing} size="lg" className="text-base">
            {sharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Share2 className="w-4 h-4 ml-2" /> 📲 شارك نتيجتي</>}
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/challenge-academy">
              <Trophy className="w-4 h-4 ml-2" /> اذهب لأكاديمية التحدي
            </Link>
          </Button>
        </div>
        <div className="text-center">
          <Button asChild variant="ghost" size="sm">
            <Link to={`/challenge-academy/assessments/${id}/start`}>
              <RefreshCw className="w-3.5 h-3.5 ml-2" /> أعد الاختبار
            </Link>
          </Button>
        </div>

        {isOwnerLoggedIn && attempt.xp_awarded > 0 && (
          <div className="text-center text-sm text-emerald-600 dark:text-emerald-400">
            ✨ كسبت {attempt.xp_awarded} XP من إكمال الاختبار{attempt.share_xp_awarded > 0 ? ` و${attempt.share_xp_awarded} XP إضافية من المشاركة` : ''}.
          </div>
        )}
      </div>
    </div>
    </ClientLayout>
  );
}
