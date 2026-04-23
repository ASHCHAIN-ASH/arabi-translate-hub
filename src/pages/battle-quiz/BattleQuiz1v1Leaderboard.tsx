import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Loader2, Flame, Crown, Medal } from 'lucide-react';
import { BattleQuiz1v1Service, type BQ1v1LeaderboardRow } from '@/utils/battleQuiz1v1Service';
import { useAuth } from '@/components/SimpleAuthProvider';

const rankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-orange-600" />;
  return <span className="text-xs font-bold text-muted-foreground">#{rank}</span>;
};

const BattleQuiz1v1Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rows, setRows] = useState<BQ1v1LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BattleQuiz1v1Service.getLeaderboard(50).then((r) => { setRows(r); setLoading(false); });
  }, []);

  const myRow = rows.find((r) => r.user_id === user?.id);

  // إخفاء أسماء اللاعبين الآخرين لحماية الخصوصية — نعرض اسماً مستعاراً مشتقاً من user_id
  const anonName = (uid: string) => `لاعب #${(uid || '').replace(/-/g, '').slice(0, 4).toUpperCase()}`;
  const displayFor = (r: BQ1v1LeaderboardRow) =>
    r.user_id === user?.id ? r.display_name : anonName(r.user_id);
  const initialFor = (r: BQ1v1LeaderboardRow) =>
    r.user_id === user?.id ? (r.display_name?.charAt(0) || '?') : '🥷';

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 max-w-3xl mx-auto space-y-4" dir="rtl">
        <Button variant="ghost" size="sm" onClick={() => navigate('/battle-quiz/1v1')} className="gap-1">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 text-white shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">🏆 ترتيب أبطال 1v1</h1>
              <p className="text-white/80 text-sm">أعلى 50 لاعباً حسب Elo</p>
            </div>
          </div>
        </motion.div>

        {myRow && (
          <Card className="p-3 border-primary/40 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                {rankIcon(myRow.rank)}
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">ترتيبك</div>
                <div className="font-bold">{myRow.display_name}</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold text-primary">{myRow.rating}</div>
                <div className="text-[10px] text-muted-foreground">
                  {myRow.wins}ف / {myRow.losses}خ
                </div>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
        ) : rows.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted-foreground">
            لا توجد مباريات بعد — كن أول من يصدر القائمة!
          </Card>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => {
              const isMe = r.user_id === user?.id;
              return (
                <Card key={r.user_id} className={`p-3 ${isMe ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                      {rankIcon(r.rank)}
                    </div>
                    {r.avatar_url ? (
                      <img src={r.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {r.display_name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{r.display_name} {isMe && <Badge variant="secondary" className="text-[10px] mr-1">أنت</Badge>}</div>
                      <div className="text-[11px] text-muted-foreground flex gap-2 mt-0.5">
                        <span>{r.wins}ف</span>
                        <span>{r.losses}خ</span>
                        {r.draws > 0 && <span>{r.draws}ت</span>}
                        {r.current_streak > 1 && (
                          <span className="text-orange-600 flex items-center gap-0.5">
                            <Flame className="w-3 h-3" /> {r.current_streak}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-extrabold">{r.rating}</div>
                      <div className="text-[10px] text-muted-foreground">{r.matches_played} مباراة</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default BattleQuiz1v1Leaderboard;
