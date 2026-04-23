import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Zap, Target, Clock, Share2, RotateCw, ArrowLeft, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ResultData {
  status: 'completed' | 'flagged';
  score: number;
  correct_count: number;
  total_questions: number;
  total_time_ms: number;
  xp_earned: number;
  rank: number;
  is_perfect: boolean;
  room_title?: string;
}

interface FlagSummary {
  total: number;
  byType: Record<string, number>;
  topRisk: number;
}

const BattleQuizResult: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [params] = useSearchParams();
  const attemptId = params.get('attempt');
  const [result, setResult] = useState<ResultData | null>(null);
  const [flags, setFlags] = useState<FlagSummary | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    const raw = sessionStorage.getItem(`bq_result_${attemptId}`);
    if (raw) {
      try { setResult(JSON.parse(raw)); } catch { /* ignore */ }
    }
    // Fetch user-visible flag summary for this attempt
    (async () => {
      const { data } = await (supabase as any)
        .from('battle_quiz_flags')
        .select('flag_type, risk_score')
        .eq('attempt_id', attemptId);
      if (data && data.length) {
        const byType: Record<string, number> = {};
        let topRisk = 0;
        for (const f of data) {
          byType[f.flag_type] = (byType[f.flag_type] || 0) + 1;
          if (f.risk_score > topRisk) topRisk = f.risk_score;
        }
        setFlags({ total: data.length, byType, topRisk });
      }
    })();
  }, [attemptId]);

  const share = async () => {
    const text = `🏆 سجلت ${result?.score} نقطة في Battle Quiz Arena! ترتيبي #${result?.rank}. جرب التحدي:`;
    const url = `${window.location.origin}/battle-quiz`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Battle Quiz', text, url }); } catch { /* canceled */ }
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      toast.success('تم نسخ الرابط');
    }
  };

  if (!result) {
    return (
      <ClientLayout>
        <div className="p-6 max-w-lg mx-auto" dir="rtl">
          <Card className="p-6 text-center">
            <p className="mb-4">لا توجد نتيجة لعرضها.</p>
            <Button asChild><Link to="/battle-quiz">العودة</Link></Button>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  const isFlagged = result.status === 'flagged';
  const accuracy = result.total_questions > 0
    ? Math.round((result.correct_count / result.total_questions) * 100) : 0;

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 max-w-2xl mx-auto" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Card className={`overflow-hidden border-2 ${isFlagged ? 'border-destructive' : 'border-primary/30'}`}>
            {/* Banner */}
            <div className={`p-6 sm:p-8 text-center text-white ${
              isFlagged ? 'bg-gradient-to-br from-red-500 to-rose-700'
                : result.is_perfect ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600'
                : 'bg-gradient-to-br from-primary via-purple-600 to-fuchsia-700'
            }`}>
              {isFlagged ? (
                <>
                  <AlertTriangle className="w-14 h-14 mx-auto mb-3" />
                  <h1 className="text-2xl font-extrabold mb-1">تم وضع المحاولة قيد المراجعة</h1>
                  <p className="text-white/90 text-sm">رصد النظام نشاطاً غير معتاد. لن تُحتسب الجائزة.</p>
                </>
              ) : (
                <>
                  <Trophy className="w-14 h-14 mx-auto mb-3" />
                  <h1 className="text-3xl font-extrabold mb-1">{result.is_perfect ? '🎯 مثالي!' : 'أحسنت!'}</h1>
                  <p className="text-white/90">
                    {result.room_title} — ترتيبك <strong>#{result.rank}</strong>
                  </p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat icon={Zap} label="النقاط" value={result.score} color="text-amber-600" />
              <Stat icon={Target} label="الإجابات" value={`${result.correct_count}/${result.total_questions}`} color="text-emerald-600" />
              <Stat icon={Clock} label="الزمن" value={`${(result.total_time_ms / 1000).toFixed(1)}ث`} color="text-blue-600" />
              <Stat icon={Trophy} label="الدقة" value={`${accuracy}%`} color="text-purple-600" />
            </div>

            {/* XP */}
            {!isFlagged && (
              <div className="px-5 pb-3">
                <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">XP المكتسب</p>
                  <p className="text-3xl font-extrabold text-amber-600">+{result.xp_earned}</p>
                </div>
              </div>
            )}

            {/* 🏅 Earned badges */}
            {!isFlagged && (
              <div className="px-5 pb-5 flex flex-wrap gap-2 justify-center">
                {result.is_perfect && (
                  <motion.span
                    initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md"
                  >
                    🎯 إجابات مثالية
                  </motion.span>
                )}
                {result.rank === 1 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 text-white text-xs font-bold shadow-md"
                  >
                    👑 المركز الأول
                  </motion.span>
                )}
                {result.rank > 1 && result.rank <= 3 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-400 to-slate-600 text-white text-xs font-bold shadow-md"
                  >
                    🏅 المنصة
                  </motion.span>
                )}
                {result.total_time_ms / Math.max(1, result.total_questions) < 4000 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold shadow-md"
                  >
                    ⚡ سريع البرق
                  </motion.span>
                )}
                {accuracy >= 80 && !result.is_perfect && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.25 }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold shadow-md"
                  >
                    🎯 دقة عالية
                  </motion.span>
                )}
              </div>
            )}

            {/* Anti-Cheat summary (visible to user) */}
            {flags && flags.total > 0 && (
              <div className="px-5 pb-5">
                <div className={`rounded-xl border p-3 ${
                  isFlagged
                    ? 'bg-destructive/5 border-destructive/30'
                    : 'bg-amber-500/5 border-amber-500/30'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldAlert className={`w-4 h-4 ${isFlagged ? 'text-destructive' : 'text-amber-600'}`} />
                    <p className="text-sm font-bold">
                      {isFlagged ? 'تنبيهات سلامة المحاولة' : 'ملاحظات سلامة'}
                    </p>
                    <span className="text-xs text-muted-foreground mr-auto">
                      {flags.total} إشارة • أعلى خطر {flags.topRisk}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(flags.byType).map(([t, n]) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-background border">
                        {flagLabel(t)} × {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-5 pt-0 space-y-2">
              {!isFlagged && (
                <Button onClick={share} className="w-full" size="lg">
                  <Share2 className="w-4 h-4 ml-2" /> شارك نتيجتك
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                  <Link to={`/battle-quiz/${roomId}/play`}>
                    <RotateCw className="w-4 h-4 ml-2" /> جولة أخرى
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/battle-quiz/leaderboard">
                    <Trophy className="w-4 h-4 ml-2" /> الترتيب
                  </Link>
                </Button>
              </div>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/battle-quiz">
                  <ArrowLeft className="w-4 h-4 ml-2" /> عودة للأرينا
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
};

const Stat: React.FC<{ icon: any; label: string; value: React.ReactNode; color: string }> = ({ icon: Icon, label, value, color }) => (
  <div className="text-center p-3 rounded-xl bg-muted/40">
    <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
    <p className="text-[11px] text-muted-foreground">{label}</p>
    <p className="font-bold tabular-nums">{value}</p>
  </div>
);

function flagLabel(t: string): string {
  const map: Record<string, string> = {
    tab_blur: 'خروج من النافذة',
    visibility_hidden: 'إخفاء الصفحة',
    copy: 'نسخ',
    paste: 'لصق',
    right_click: 'نقر يمين',
    devtools_suspect: 'أدوات المطور',
    screenshot_attempt: 'لقطة شاشة',
    image_drag: 'سحب صورة',
    too_fast_for_reading: 'إجابة سريعة جداً',
    mechanical_pattern: 'نمط ميكانيكي',
  };
  return map[t] || t;
}

export default BattleQuizResult;
