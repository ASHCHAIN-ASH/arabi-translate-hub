import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Zap, Sparkles, Brain, Share2, BookOpen, Sun, GraduationCap, Lock } from 'lucide-react';
import { DailyChallenge, ChallengeSubmission, ChallengeAcademyService } from '@/utils/challengeAcademyService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, any> = {
  Brain, Share2, BookOpen, Sun, GraduationCap, Zap, Sparkles,
};

const DIFF_BADGE: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-rose-100 text-rose-700 border-rose-200',
};
const DIFF_LABEL: Record<string, string> = {
  easy: 'سهل', medium: 'متوسط', hard: 'صعب',
};

interface Props {
  challenge: DailyChallenge;
  submission?: ChallengeSubmission;
  userId: string;
  onComplete: () => void;
}

export const ChallengeCard: React.FC<Props> = ({ challenge, submission, userId, onComplete }) => {
  const [selected, setSelected] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(submission ? {
    is_correct: submission.is_correct,
    xp_awarded: submission.xp_awarded,
    correct_answer: challenge.correct_answer,
    explanation: challenge.explanation_ar,
  } : null);
  const { toast } = useToast();

  const Icon = ICON_MAP[challenge.icon || 'Zap'] || Zap;
  const isDone = !!result;

  const handleSubmit = async (answer: string) => {
    if (submitting || isDone) return;
    setSubmitting(true);
    try {
      const res = await ChallengeAcademyService.submitChallenge(userId, challenge.id, answer);
      if (!res.success) {
        toast({ title: 'خطأ', description: res.error, variant: 'destructive' });
        return;
      }
      setResult(res);
      if (res.is_correct) {
        toast({
          title: `🎉 إجابة صحيحة! +${res.xp_awarded} XP`,
          description: `سلسلتك: ${res.current_streak} يوم متتالي 🔥`,
        });
      } else {
        toast({
          title: 'إجابة غير صحيحة',
          description: `الإجابة الصحيحة: ${res.correct_answer}. حصلت على ${res.xp_awarded} XP محاولة.`,
          variant: 'destructive',
        });
      }
      await ChallengeAcademyService.checkAndUnlockAchievements(userId);
      onComplete();
    } catch (e: any) {
      toast({ title: 'تعذر الإرسال', description: e?.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isDone ? { y: -2 } : {}}
    >
      <Card className={cn(
        'relative overflow-hidden border-2 transition-all',
        isDone && result?.is_correct && 'border-emerald-300 bg-emerald-50/30',
        isDone && !result?.is_correct && 'border-rose-200 bg-rose-50/20',
        !isDone && 'border-border hover:border-primary/40 hover:shadow-lg'
      )}>
        {isDone && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-yellow-400 to-pink-400" />
        )}

        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md',
              isDone
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
            )}>
              {isDone ? <CheckCircle2 className="w-6 h-6 text-white" /> : <Icon className="w-6 h-6 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant="outline" className={DIFF_BADGE[challenge.difficulty]}>
                  {DIFF_LABEL[challenge.difficulty]}
                </Badge>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                  <Zap className="w-3 h-3 ml-1" /> {challenge.xp_reward} XP
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {challenge.type === 'quiz' ? 'سؤال' : 'مهمة'}
                </Badge>
              </div>
              <h3 className="font-black text-base leading-tight">{challenge.title_ar}</h3>
              {challenge.description_ar && (
                <p className="text-xs text-muted-foreground mt-1">{challenge.description_ar}</p>
              )}
            </div>
          </div>

          {challenge.type === 'quiz' && challenge.question_ar && (
            <div className="space-y-3">
              <p className="font-semibold text-sm bg-muted/50 rounded-lg p-3 border border-border">
                {challenge.question_ar}
              </p>
              <div className="grid gap-2">
                {(challenge.options || []).map((opt) => {
                  const isSelected = selected === opt;
                  const isCorrectAns = isDone && opt === result?.correct_answer;
                  const isWrongPicked = isDone && submission?.answer === opt && !result?.is_correct;
                  return (
                    <button
                      key={opt}
                      disabled={isDone || submitting}
                      onClick={() => { setSelected(opt); handleSubmit(opt); }}
                      className={cn(
                        'text-right p-3 rounded-lg border-2 font-semibold text-sm transition-all',
                        !isDone && 'hover:border-primary hover:bg-primary/5 cursor-pointer',
                        !isDone && isSelected && 'border-primary bg-primary/5',
                        isDone && 'cursor-default',
                        isCorrectAns && 'border-emerald-500 bg-emerald-50 text-emerald-900',
                        isWrongPicked && 'border-rose-500 bg-rose-50 text-rose-900',
                        isDone && !isCorrectAns && !isWrongPicked && 'opacity-50',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {isCorrectAns && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {isWrongPicked && <XCircle className="w-5 h-5 text-rose-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {challenge.type === 'task' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                أكمل المهمة واضغط الزر للحصول على نقاط XP.
              </p>
              <Button
                disabled={isDone || submitting}
                onClick={() => handleSubmit('completed')}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isDone ? (
                  <><CheckCircle2 className="w-4 h-4 ml-2" /> مكتملة</>
                ) : submitting ? 'جارٍ التأكيد...' : (
                  <><Sparkles className="w-4 h-4 ml-2" /> تم — احصل على {challenge.xp_reward} XP</>
                )}
              </Button>
            </div>
          )}

          <AnimatePresence>
            {isDone && result?.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-900"
              >
                💡 <strong>توضيح:</strong> {result.explanation}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};
