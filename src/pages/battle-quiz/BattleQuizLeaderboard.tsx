import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Loader2, ArrowLeft, Crown, Medal, Radio } from 'lucide-react';
import {
  BattleQuizService,
  type BattleQuizRoom,
  type BattleQuizLeaderboardRow,
} from '@/utils/battleQuizService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';

const PodiumCard: React.FC<{ row: BattleQuizLeaderboardRow; place: 1 | 2 | 3 }> = ({ row, place }) => {
  const cfg =
    place === 1
      ? { h: 'h-36', grad: 'from-amber-400 to-orange-500', icon: <Crown className="w-6 h-6" />, label: 'الأول' }
      : place === 2
      ? { h: 'h-28', grad: 'from-slate-300 to-slate-500', icon: <Medal className="w-5 h-5" />, label: 'الثاني' }
      : { h: 'h-24', grad: 'from-orange-400 to-rose-500', icon: <Medal className="w-5 h-5" />, label: 'الثالث' };
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: place === 1 ? 0.1 : place === 2 ? 0.2 : 0.3 }}
      className="flex flex-col items-center"
    >
      <Avatar className="w-14 h-14 mb-2 ring-2 ring-background shadow-lg">
        <AvatarImage src={row.avatar_url ?? undefined} />
        <AvatarFallback>{row.display_name?.[0] ?? '?'}</AvatarFallback>
      </Avatar>
      <p className="text-xs font-bold truncate max-w-[90px] text-center">{row.display_name}</p>
      <div
        className={`mt-2 w-full rounded-t-2xl bg-gradient-to-b ${cfg.grad} ${cfg.h} flex flex-col items-center justify-start pt-3 text-white shadow-xl`}
      >
        {cfg.icon}
        <p className="text-[10px] font-bold mt-1 opacity-90">{cfg.label}</p>
        <p className="text-lg font-black tabular-nums mt-1">{row.total_score}</p>
        <p className="text-[10px] opacity-90">نقطة</p>
      </div>
    </motion.div>
  );
};

const BattleQuizLeaderboard: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<BattleQuizRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [rows, setRows] = useState<BattleQuizLeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);

  useEffect(() => {
    BattleQuizService.listRooms().then((rs) => {
      setRooms(rs);
      if (rs[0]) setActiveRoom(rs[0].id);
      else setLoading(false);
    });
  }, []);

  const refresh = (roomId: string) =>
    BattleQuizService.getLeaderboard(roomId).then((r) => setRows(r));

  useEffect(() => {
    if (!activeRoom) return;
    setLoading(true);
    refresh(activeRoom).finally(() => setLoading(false));

    // 🔴 Live updates: refetch when leaderboard rows for this room change
    const channel = supabase
      .channel(`bq-lb-${activeRoom}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'battle_quiz_leaderboards', filter: `room_id=eq.${activeRoom}` },
        () => refresh(activeRoom),
      )
      .subscribe((status) => setLive(status === 'SUBSCRIBED'));

    return () => {
      supabase.removeChannel(channel);
      setLive(false);
    };
  }, [activeRoom]);

  const top3 = useMemo(() => rows.slice(0, 3), [rows]);
  const top10 = useMemo(() => rows.slice(0, 10), [rows]);
  const meRow = useMemo(() => rows.find((r) => r.user_id === user?.id) ?? null, [rows, user]);
  const meInTop10 = !!meRow && meRow.rank <= 10;

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
          {live && (
            <span className="ms-auto inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <Radio className="w-3 h-3 animate-pulse" /> مباشر
            </span>
          )}
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

        {loading ? (
          <Card className="p-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </Card>
        ) : rows.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-30" />
            لا توجد نتائج بعد — كن أول من يلعب!
          </Card>
        ) : (
          <>
            {/* 🏆 Podium */}
            {top3.length > 0 && (
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-amber-500/5 via-background to-purple-500/5 border-2 border-amber-500/20">
                <div className="grid grid-cols-3 gap-3 items-end max-w-md mx-auto">
                  {/* Order: 2 - 1 - 3 */}
                  {top3[1] ? <PodiumCard row={top3[1]} place={2} /> : <div />}
                  {top3[0] ? <PodiumCard row={top3[0]} place={1} /> : <div />}
                  {top3[2] ? <PodiumCard row={top3[2]} place={3} /> : <div />}
                </div>
              </Card>
            )}

            {/* Top 10 list */}
            <Card className="p-4">
              <p className="text-xs font-bold text-muted-foreground mb-3">أفضل 10</p>
              <ol className="space-y-2">
                <AnimatePresence initial={false}>
                  {top10.map((row) => {
                    const isMe = row.user_id === user?.id;
                    return (
                      <motion.li
                        layout
                        key={row.user_id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isMe
                            ? 'bg-primary/10 border-2 border-primary/40 ring-1 ring-primary/20'
                            : row.rank === 1
                            ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30'
                            : row.rank === 2
                            ? 'bg-muted/40 border border-border'
                            : row.rank === 3
                            ? 'bg-orange-500/10 border border-orange-500/20'
                            : 'bg-card border border-border'
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
                          <p className="font-bold text-sm truncate flex items-center gap-1.5">
                            {row.display_name}
                            {isMe && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground">
                                أنت
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {row.total_correct} إجابة · {(row.total_time_ms / 1000).toFixed(1)}ث
                          </p>
                        </div>
                        <div className="text-left shrink-0">
                          <p className="font-extrabold tabular-nums text-amber-600">{row.total_score}</p>
                          <p className="text-[10px] text-muted-foreground">نقطة</p>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ol>
            </Card>

            {/* 📍 Sticky "your rank" if outside Top 10 */}
            {meRow && !meInTop10 && (
              <div className="sticky bottom-3 z-30">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <Card className="p-3 border-2 border-primary/40 bg-primary/10 backdrop-blur-md shadow-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center font-bold bg-primary text-primary-foreground text-sm shrink-0">
                        #{meRow.rank}
                      </span>
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarImage src={meRow.avatar_url ?? undefined} />
                        <AvatarFallback>{meRow.display_name?.[0] ?? '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">ترتيبك</p>
                        <p className="text-xs text-muted-foreground">
                          {meRow.total_correct} إجابة · {(meRow.total_time_ms / 1000).toFixed(1)}ث
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="font-extrabold tabular-nums text-amber-600">{meRow.total_score}</p>
                        <p className="text-[10px] text-muted-foreground">نقطة</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </ClientLayout>
  );
};

export default BattleQuizLeaderboard;
