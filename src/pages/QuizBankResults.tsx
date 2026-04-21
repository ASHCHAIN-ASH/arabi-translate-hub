import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Trophy, Target, CheckCircle2, XCircle, Sparkles, BookOpen, TrendingUp, Lightbulb, ArrowLeft, RotateCcw } from 'lucide-react';
import ClientLayout from '@/components/client/ClientLayout';
import { QuestionBankService } from '@/services/questionBankService';
import { cn } from '@/lib/utils';

interface WeakSubject { subject_id: string; subject_name: string; wrong_count: number; total: number; }

export default function QuizBankResults() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    QuestionBankService.getStats()
      .then(setStats)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const grade = useMemo(() => {
    const r = stats?.success_rate ?? 0;
    if (r >= 90) return { label: 'ممتاز', color: 'from-emerald-500 to-teal-500', emoji: '🏆', desc: 'أداء استثنائي!' };
    if (r >= 75) return { label: 'جيد جداً', color: 'from-blue-500 to-cyan-500', emoji: '⭐', desc: 'تفوّق ملحوظ' };
    if (r >= 60) return { label: 'جيد', color: 'from-amber-500 to-orange-500', emoji: '👍', desc: 'استمر في التحسّن' };
    if (r >= 40) return { label: 'مقبول', color: 'from-orange-500 to-rose-500', emoji: '📚', desc: 'تحتاج لمزيد من المراجعة' };
    return { label: 'يحتاج تطوير', color: 'from-rose-500 to-pink-500', emoji: '💪', desc: 'كل بداية صعبة — استمر!' };
  }, [stats]);

  const wrongCount = (stats?.total_attempts || 0) - (stats?.correct_count || 0);
  const wrongRate = stats?.total_attempts ? Math.round((wrongCount / stats.total_attempts) * 100) : 0;

  const recommendations = useMemo(() => {
    const recs: { icon: any; title: string; desc: string; color: string }[] = [];
    if (!stats || stats.total_attempts === 0) {
      recs.push({ icon: BookOpen, title: 'ابدأ رحلتك', desc: 'حلّ أول 10 أسئلة لاكتشاف نقاط قوتك.', color: 'text-primary' });
      return recs;
    }
    const weak: WeakSubject[] = stats.weakest_subjects || [];
    if (weak.length > 0) {
      const top = weak.slice(0, 3).map((w) => w.subject_name).join('، ');
      recs.push({
        icon: Target,
        title: 'ركّز على المواد الأضعف',
        desc: `تخطئ كثيراً في: ${top}. خصّص وقتاً يومياً لمراجعتها وحلّ أسئلة بمستوى "سهل" أولاً.`,
        color: 'text-rose-600',
      });
    }
    if (stats.success_rate < 60) {
      recs.push({
        icon: BookOpen,
        title: 'ارجع للأساسيات',
        desc: 'ابدأ بمستوى "سهل" واقرأ شرح كل إجابة خاطئة بعناية قبل الانتقال للأصعب.',
        color: 'text-amber-600',
      });
    } else if (stats.success_rate < 80) {
      recs.push({
        icon: TrendingUp,
        title: 'تحدَّ نفسك أكثر',
        desc: 'انتقل إلى مستوى "متوسط" و"صعب" لرفع مستواك وكسب XP أكثر.',
        color: 'text-blue-600',
      });
    } else {
      recs.push({
        icon: Trophy,
        title: 'أداء رائع!',
        desc: 'حافظ على المستوى وجرّب المواد الجديدة لتوسيع معرفتك.',
        color: 'text-emerald-600',
      });
    }
    if (stats.total_attempts < 20) {
      recs.push({
        icon: Sparkles,
        title: 'زِد من محاولاتك',
        desc: `أتممت ${stats.total_attempts} محاولة فقط. الهدف اليومي: 10 أسئلة لرفع المهارة بسرعة.`,
        color: 'text-secondary',
      });
    }
    recs.push({
      icon: Lightbulb,
      title: 'نصيحة ذهبية',
      desc: 'اقرأ شرح كل سؤال — حتى الصحيحة منها — لتعميق فهمك وتذكّر المعلومة لفترة أطول.',
      color: 'text-primary',
    });
    return recs;
  }, [stats]);

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container mx-auto p-4 sm:p-6 max-w-5xl space-y-6" dir="rtl">
        {/* Hero with grade */}
        <div className={cn('relative overflow-hidden rounded-2xl p-6 sm:p-10 text-white shadow-xl bg-gradient-to-br', grade.color)}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative text-center space-y-3">
            <div className="text-6xl">{grade.emoji}</div>
            <h1 className="text-3xl sm:text-4xl font-black">{grade.label}</h1>
            <p className="text-white/85">{grade.desc}</p>
            <div className="text-7xl sm:text-8xl font-black tracking-tight">
              {stats?.success_rate ?? 0}<span className="text-3xl">%</span>
            </div>
            <p className="text-sm text-white/75">نسبة الإجابات الصحيحة</p>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card className="border-2 border-emerald-500/20">
            <CardContent className="p-5 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-emerald-600">{stats?.correct_count ?? 0}</p>
              <p className="text-xs font-semibold text-muted-foreground">إجابات صحيحة</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-rose-500/20">
            <CardContent className="p-5 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-rose-600" />
              </div>
              <p className="text-3xl font-black text-rose-600">{wrongCount}</p>
              <p className="text-xs font-semibold text-muted-foreground">إجابات خاطئة</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary/20">
            <CardContent className="p-5 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-black text-primary">{stats?.total_attempts ?? 0}</p>
              <p className="text-xs font-semibold text-muted-foreground">إجمالي المحاولات</p>
            </CardContent>
          </Card>
        </div>

        {/* Visual breakdown bar */}
        {stats?.total_attempts > 0 && (
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> توزيع الإجابات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-emerald-600">صحيحة</span>
                  <span className="font-mono font-bold">{stats.success_rate}%</span>
                </div>
                <Progress value={stats.success_rate} className="h-3 [&>div]:bg-emerald-500" />
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-semibold text-rose-600">خاطئة</span>
                  <span className="font-mono font-bold">{wrongRate}%</span>
                </div>
                <Progress value={wrongRate} className="h-3 [&>div]:bg-rose-500" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weakest subjects */}
        {stats?.weakest_subjects?.length > 0 && (
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-600" /> المواد التي تحتاج تركيزاً
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.weakest_subjects.slice(0, 5).map((w: WeakSubject, i: number) => {
                const errorRate = w.total > 0 ? Math.round((w.wrong_count / w.total) * 100) : 0;
                return (
                  <div key={w.subject_id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{w.subject_name}</p>
                      <p className="text-xs text-muted-foreground">{w.wrong_count} خطأ من {w.total} محاولة</p>
                    </div>
                    <Badge variant="outline" className="border-rose-500/30 text-rose-600 font-mono">
                      {errorRate}%
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" /> توصيات لتحسين مستواك
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border-2 border-border/50 hover:border-primary/30 transition">
                <div className={cn('w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0', rec.color)}>
                  <rec.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1">{rec.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{rec.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-end">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/quiz-bank"><ArrowLeft className="w-4 h-4" /> العودة لبنك الأسئلة</Link>
          </Button>
          <Button asChild size="lg" className="gap-2">
            <Link to="/quiz-bank"><RotateCcw className="w-4 h-4" /> ابدأ جلسة جديدة</Link>
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
}
