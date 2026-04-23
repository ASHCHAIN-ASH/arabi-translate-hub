import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Swords, Loader2, ArrowLeft, RotateCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BattleQuiz1v1Service, type BQ1v1Match } from '@/utils/battleQuiz1v1Service';
import { useAuth } from '@/components/SimpleAuthProvider';

const BattleQuiz1v1Result: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState<BQ1v1Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) return;
    let attempts = 0;
    const tick = async () => {
      attempts += 1;
      const m = await BattleQuiz1v1Service.getMatch(matchId);
      setMatch(m);
      if (m && m.status === 'active') {
        // try to finalize on idle/completion
        await BattleQuiz1v1Service.finalize(matchId);
        const m2 = await BattleQuiz1v1Service.getMatch(matchId);
        setMatch(m2);
      }
      setLoading(false);
      if (m && m.status === 'active' && attempts < 30) {
        setTimeout(tick, 2000);
      }
    };
    tick();
  }, [matchId]);

  if (loading) return <ClientLayout><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></ClientLayout>;
  if (!match || !user) {
    return (
      <ClientLayout>
        <div className="p-6 max-w-lg mx-auto" dir="rtl">
          <Card className="p-6 text-center">لم يتم العثور على المباراة</Card>
        </div>
      </ClientLayout>
    );
  }

  const isA = match.player_a_id === user.id;
  const myScore = isA ? match.player_a_score : match.player_b_score;
  const oppScore = isA ? match.player_b_score : match.player_a_score;
  const myCorrect = isA ? match.player_a_correct : match.player_b_correct;
  const oppCorrect = isA ? match.player_b_correct : match.player_a_correct;
  const myTime = isA ? match.player_a_time_ms : match.player_b_time_ms;
  const oppTime = isA ? match.player_b_time_ms : match.player_a_time_ms;
  const won = match.winner_id === user.id;
  const draw = match.winner_id === null && match.status === 'completed';
  const delta = isA ? match.rating_delta : -match.rating_delta;

  const headline = match.status === 'active' ? 'بانتظار الخصم...'
    : match.status === 'expired' ? 'انتهت المهلة'
    : draw ? 'تعادل!'
    : won ? '🏆 فوز!' : '😞 خسارة';

  const headlineColor = won ? 'from-emerald-500 to-green-700'
    : draw ? 'from-slate-500 to-slate-700'
    : 'from-rose-500 to-red-700';

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 max-w-2xl mx-auto space-y-4" dir="rtl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/battle-quiz/1v1')} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </Button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className={`rounded-3xl p-8 text-center text-white bg-gradient-to-br ${headlineColor} shadow-xl`}
        >
          <Trophy className="w-14 h-14 mx-auto mb-2 opacity-90" />
          <h1 className="text-3xl font-extrabold">{headline}</h1>
          {match.status !== 'active' && (
            <div className="mt-3 inline-flex items-center gap-1 bg-white/15 rounded-full px-3 py-1 text-sm font-bold">
              {delta > 0 ? <TrendingUp className="w-4 h-4" /> : delta < 0 ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              {delta > 0 ? `+${delta}` : delta} نقطة Elo
            </div>
          )}
        </motion.div>

        <Card className="p-5">
          <div className="grid grid-cols-3 items-center gap-2 text-center">
            <div>
              <div className="text-xs text-muted-foreground">أنت</div>
              <div className="text-3xl font-extrabold">{myScore}</div>
              <div className="text-xs text-muted-foreground">{myCorrect} صحيح</div>
              <div className="text-[10px] text-muted-foreground mt-1">{(myTime / 1000).toFixed(1)}s</div>
            </div>
            <div>
              <Swords className="w-8 h-8 mx-auto text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">الخصم</div>
              <div className="text-3xl font-extrabold">{oppScore}</div>
              <div className="text-xs text-muted-foreground">{oppCorrect} صحيح</div>
              <div className="text-[10px] text-muted-foreground mt-1">{(oppTime / 1000).toFixed(1)}s</div>
            </div>
          </div>
          {match.status === 'abandoned' && (
            <Badge variant="outline" className="mt-3 mx-auto block w-fit">انسحب أحد اللاعبين</Badge>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => navigate('/battle-quiz/1v1')} className="gap-2">
            <RotateCw className="w-4 h-4" /> مباراة جديدة
          </Button>
          <Button variant="outline" onClick={() => navigate('/battle-quiz/1v1/leaderboard')} className="gap-2">
            <Trophy className="w-4 h-4" /> الترتيب
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
};

export default BattleQuiz1v1Result;
