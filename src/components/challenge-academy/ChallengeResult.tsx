import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, RotateCcw, Share2, CheckCircle2, XCircle, Flame, Sparkles, X } from 'lucide-react';
import { AttemptSubmitResult } from '@/utils/dailyChallengeService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: AttemptSubmitResult | null;
  challengeTitle: string;
  onRetry: () => void;
}

export const ChallengeResult: React.FC<Props> = ({
  open, onOpenChange, result, challengeTitle, onRetry,
}) => {
  const { toast } = useToast();

  const tier = useMemo(() => {
    const score = result?.score ?? 0;
    if (result?.is_perfect) return { label: 'مثالي! 🏆', color: 'from-yellow-400 to-amber-500', text: 'بطل اليوم!' };
    if (score >= 80) return { label: 'ممتاز ✨', color: 'from-emerald-500 to-teal-600', text: 'أداء رائع!' };
    if (score >= 60) return { label: 'جيد جداً 👍', color: 'from-blue-500 to-indigo-600', text: 'استمر!' };
    if (score >= 40) return { label: 'جيد 📚', color: 'from-purple-500 to-fuchsia-600', text: 'يمكنك تحسينه!' };
    return { label: 'حاول مجدداً 💪', color: 'from-rose-500 to-pink-600', text: 'لا تستسلم!' };
  }, [result]);

  const handleShare = async () => {
    if (!result) return;
    const text = `🎓 تحدي اليوم في ماستر إيدو باث:\n${tier.label} — ${result.score}%\n${result.correct_count}/${result.total_questions} إجابة صحيحة\n+${result.xp_awarded} XP 🔥\nhttps://masteredupath.com/challenge-academy`;

    // Try Web Share API first (mobile)
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'تحدي اليوم', text });
        return;
      } catch (err: any) {
        // AbortError = user cancelled, don't fallback
        if (err?.name === 'AbortError') return;
        // Otherwise fallback to clipboard
      }
    }

    // Clipboard fallback
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast({ title: '📋 تم نسخ النتيجة!', description: 'الصقها في واتساب أو تويتر لمشاركتها' });
        return;
      }
      throw new Error('clipboard unavailable');
    } catch {
      // Last-resort: legacy execCommand
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast({ title: '📋 تم نسخ النتيجة!', description: 'الصقها في واتساب أو تويتر لمشاركتها' });
      } catch {
        toast({ title: 'تعذر النسخ', description: 'انسخ النص يدوياً', variant: 'destructive' });
      }
    }
  };

  if (!result) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-lg p-0 overflow-hidden gap-0 border-0">
        {/* Banner */}
        <div className={cn('relative bg-gradient-to-br p-6 text-white text-center overflow-hidden', tier.color)}>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="text-7xl mb-2"
          >
            {result.is_perfect ? '🏆' : result.score >= 60 ? '🎉' : '💪'}
          </motion.div>
          <p className="text-sm opacity-90 mb-1">{challengeTitle}</p>
          <h2 className="text-3xl font-black mb-1">{tier.label}</h2>
          <p className="text-sm opacity-90">{tier.text}</p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="mt-4 inline-flex items-baseline gap-1 bg-white/20 backdrop-blur-md px-5 py-2 rounded-2xl"
          >
            <span className="text-5xl font-black">{result.score}</span>
            <span className="text-xl font-bold">%</span>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="p-5 grid grid-cols-3 gap-2 bg-muted/30">
          <StatBox icon={CheckCircle2} label="صحيحة" value={`${result.correct_count}/${result.total_questions}`} color="emerald" />
          <StatBox icon={Zap} label="XP مكتسبة" value={`+${result.xp_awarded}`} color="amber" />
          <StatBox icon={Flame} label="السلسلة" value={`${result.current_streak} يوم`} color="orange" />
        </div>

        {/* Retry warning */}
        {result.is_retry && (
          <div className="px-5 py-2 bg-amber-50 border-y border-amber-200 text-xs text-amber-900 text-center">
            ⚡ هذه إعادة محاولة — النقاط مخفّضة (المحاولة {result.attempt_number})
          </div>
        )}

        {/* Answers review */}
        {result.results && result.results.length > 0 && (
          <div className="max-h-64 overflow-y-auto px-5 py-3 space-y-2 border-b">
            <p className="text-xs font-bold text-muted-foreground mb-2">مراجعة الإجابات</p>
            {result.results.map((r, i) => (
              <div
                key={r.question_id}
                className={cn(
                  'flex items-start gap-2 p-2 rounded-lg text-xs border',
                  r.is_correct ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                )}
              >
                {r.is_correct
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  : <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="font-bold">سؤال {i + 1}</p>
                  {!r.is_correct && (
                    <p className="text-muted-foreground mt-0.5">
                      الإجابة الصحيحة: <span className="font-bold text-foreground">{r.correct_answer}</span>
                    </p>
                  )}
                  {r.explanation && (
                    <p className="text-muted-foreground italic mt-1">💡 {r.explanation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="p-4 grid grid-cols-2 gap-2 bg-card">
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" /> إعادة المحاولة
          </Button>
          <Button
            onClick={handleShare}
            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            <Share2 className="w-4 h-4" /> مشاركة النتيجة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const COLOR_MAP: Record<string, string> = {
  emerald: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-500 to-orange-600',
  orange: 'from-orange-500 to-rose-600',
};

const StatBox: React.FC<{ icon: any; label: string; value: string; color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-card rounded-xl p-3 text-center border border-border">
    <div className={cn('w-9 h-9 rounded-lg mx-auto mb-1.5 bg-gradient-to-br flex items-center justify-center', COLOR_MAP[color])}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <p className="text-[10px] text-muted-foreground">{label}</p>
    <p className="font-black text-sm">{value}</p>
  </div>
);
