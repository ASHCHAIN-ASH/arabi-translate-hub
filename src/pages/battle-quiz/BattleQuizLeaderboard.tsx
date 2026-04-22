import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Loader2, ArrowLeft, Crown, Medal } from 'lucide-react';
import { BattleQuizService, type BattleQuizRoom, type BattleQuizLeaderboardRow } from '@/utils/battleQuizService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BattleQuizLeaderboard: React.FC = () => {
  const [rooms, setRooms] = useState<BattleQuizRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [rows, setRows] = useState<BattleQuizLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BattleQuizService.listRooms().then((rs) => {
      setRooms(rs);
      if (rs[0]) setActiveRoom(rs[0].id);
      else setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!activeRoom) return;
    setLoading(true);
    BattleQuizService.getLeaderboard(activeRoom).then((r) => {
      setRows(r); setLoading(false);
    });
  }, [activeRoom]);

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 max-w-3xl mx-auto space-y-4" dir="rtl">
        <div className="flex items-center gap-3 mb-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/battle-quiz"><ArrowLeft className="w-4 h-4 ml-1" /> رجوع</Link>
          </Button>
          <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" /> لوحة الصدارة
          </h1>
        </div>

        {/* Room tabs */}
        {rooms.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {rooms.map((r) => (
              <Button
                key={r.id}
                variant={activeRoom === r.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveRoom(r.id)}
                className="shrink-0"
              >
                {r.cover_emoji} {r.title}
              </Button>
            ))}
          </div>
        )}

        <Card className="p-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : rows.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
              لا توجد نتائج بعد — كن أول من يلعب!
            </div>
          ) : (
            <ol className="space-y-2">
              {rows.map((row) => (
                <li
                  key={row.user_id}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    row.rank === 1 ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30' :
                    row.rank === 2 ? 'bg-muted/40 border border-border' :
                    row.rank === 3 ? 'bg-orange-500/10 border border-orange-500/20' :
                    'bg-card'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0">
                    {row.rank === 1 ? <Crown className="w-5 h-5 text-amber-500" /> :
                     row.rank === 2 ? <Medal className="w-5 h-5 text-slate-400" /> :
                     row.rank === 3 ? <Medal className="w-5 h-5 text-orange-500" /> :
                     <span className="text-sm text-muted-foreground">#{row.rank}</span>}
                  </div>
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={row.avatar_url ?? undefined} />
                    <AvatarFallback>{row.display_name?.[0] ?? '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{row.display_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.total_correct} إجابة · {(row.total_time_ms / 1000).toFixed(1)}ث
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold tabular-nums text-amber-600">{row.total_score}</p>
                    <p className="text-[10px] text-muted-foreground">نقطة</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </ClientLayout>
  );
};

export default BattleQuizLeaderboard;
