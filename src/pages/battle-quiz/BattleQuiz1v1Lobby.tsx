import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Swords, Loader2, Users, X, Trophy, Flame, ArrowLeft, UserPlus, Zap } from 'lucide-react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { BattleQuiz1v1Service } from '@/utils/battleQuiz1v1Service';
import { toast } from 'sonner';
import DailyMissionsCard from '@/components/battle-quiz/DailyMissionsCard';
import FriendInviteDialog from '@/components/battle-quiz/FriendInviteDialog';
import type { BQ1v1Mode } from '@/utils/battleQuiz1v1Extras';

const BattleQuiz1v1Lobby: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);
  const [waitSecs, setWaitSecs] = useState(0);
  const [myRating, setMyRating] = useState<{ rating: number; wins: number; losses: number; matches_played: number } | null>(null);

  const cleanupRef = useRef<(() => void) | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;
    BattleQuiz1v1Service.getMyRating(user.id).then((r) => r && setMyRating(r));
    return () => {
      cleanupRef.current?.();
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [user]);

  const startSearch = async () => {
    if (!user) return;
    setSearching(true);
    setWaitSecs(0);

    cleanupRef.current = BattleQuiz1v1Service.subscribeQueue(user.id, (matchId) => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      navigate(`/battle-quiz/1v1/${matchId}/play`);
    });

    tickRef.current = window.setInterval(() => setWaitSecs((s) => s + 1), 1000);

    const res = await BattleQuiz1v1Service.enqueue('general');
    if (res.error) {
      toast.error(res.error === 'no_active_room' ? 'لا توجد غرفة نشطة حالياً' : 'تعذّر بدء البحث');
      stopSearch(false);
      return;
    }
    if (res.matched && res.match_id) {
      cleanupRef.current?.();
      cleanupRef.current = null;
      navigate(`/battle-quiz/1v1/${res.match_id}/play`);
    }
  };

  const stopSearch = async (cancelOnServer = true) => {
    if (cancelOnServer) await BattleQuiz1v1Service.cancelQueue();
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = null;
    setSearching(false);
    setWaitSecs(0);
  };

  if (!user) {
    return <ClientLayout><div className="p-6 text-center" dir="rtl">يرجى تسجيل الدخول</div></ClientLayout>;
  }

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 max-w-3xl mx-auto space-y-6" dir="rtl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/battle-quiz')} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-800 text-white shadow-xl"
        >
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">⚔️ مواجهة 1 ضد 1</h1>
                <p className="text-white/80 text-sm">طابق خصمًا فوريًا واربح نقاط Elo</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* My rating */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">تصنيفي</div>
              <div className="text-3xl font-extrabold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                {myRating?.rating ?? 1000}
              </div>
            </div>
            <div className="text-left text-sm">
              <div className="flex gap-3">
                <Badge variant="secondary">فوز {myRating?.wins ?? 0}</Badge>
                <Badge variant="outline">خسارة {myRating?.losses ?? 0}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{myRating?.matches_played ?? 0} مباراة</div>
            </div>
          </div>
        </Card>

        {/* Search panel */}
        <Card className="p-6 text-center">
          {!searching ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-10 h-10 text-primary" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">جاهز للمعركة؟</h2>
                <p className="text-sm text-muted-foreground">5 أسئلة، الفائز هو الأعلى نقاطًا (والأسرع عند التعادل).</p>
              </div>
              <Button size="lg" onClick={startSearch} className="gap-2">
                <Swords className="w-5 h-5" /> ابحث عن خصم
              </Button>
              <div className="text-xs text-muted-foreground">
                إذا انسحبت أو غبت 30 ثانية، يفوز خصمك تلقائياً.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="mx-auto w-20 h-20 rounded-full border-4 border-primary border-t-transparent"
              />
              <div>
                <h2 className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" /> جارٍ البحث عن خصم…
                </h2>
                <p className="text-sm text-muted-foreground tabular-nums">
                  زمن الانتظار: {waitSecs}s
                </p>
              </div>
              <Button size="lg" variant="outline" onClick={() => stopSearch(true)} className="gap-2">
                <X className="w-4 h-4" /> إلغاء
              </Button>
            </div>
          )}
        </Card>

        <div className="text-center">
          <Button variant="link" onClick={() => navigate('/battle-quiz/1v1/leaderboard')}>
            <Trophy className="w-4 h-4 ml-1" /> عرض ترتيب أبطال 1v1
          </Button>
        </div>
      </div>
    </ClientLayout>
  );
};

export default BattleQuiz1v1Lobby;
