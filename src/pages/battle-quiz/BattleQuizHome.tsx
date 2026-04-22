import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Swords, Flame, Trophy, Zap, Clock, Target, Loader2, ArrowLeft } from 'lucide-react';
import { BattleQuizService, type BattleQuizRoom } from '@/utils/battleQuizService';

const MODE_META: Record<string, { label: string; color: string; icon: any }> = {
  daily:    { label: 'التحدي اليومي', color: 'from-amber-500 to-orange-600',  icon: Flame  },
  sprint:   { label: 'Sprint',          color: 'from-cyan-500 to-blue-600',     icon: Zap    },
  ranked:   { label: 'Ranked',          color: 'from-fuchsia-500 to-purple-700',icon: Trophy },
  practice: { label: 'تدريب',           color: 'from-emerald-500 to-teal-600',  icon: Target },
};

const BattleQuizHome: React.FC = () => {
  const [rooms, setRooms] = useState<BattleQuizRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BattleQuizService.listRooms().then((r) => { setRooms(r); setLoading(false); });
  }, []);

  const dailyRoom = rooms.find(r => r.mode === 'daily');
  const otherRooms = rooms.filter(r => r.mode !== 'daily');

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 space-y-6 max-w-7xl mx-auto" dir="rtl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-primary via-purple-600 to-fuchsia-700 text-white shadow-xl"
        >
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
              <Swords className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">⚔️ Battle Quiz Arena</h1>
              <p className="text-white/90 text-sm sm:text-base max-w-xl">
                تحديات يومية تنافسية، ترتيب لحظي، ومكافآت XP لكل لاعب يتفوق على نفسه.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Daily challenge */}
        {dailyRoom && <RoomCard room={dailyRoom} featured />}

        {/* Other modes */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> أوضاع اللعب
          </h2>
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : otherRooms.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <Swords className="w-10 h-10 mx-auto mb-2 opacity-30" />
              لا توجد غرف نشطة الآن — عُد قريباً!
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherRooms.map(r => <RoomCard key={r.id} room={r} />)}
            </div>
          )}
        </section>

        <Card className="p-4 bg-muted/30">
          <Link to="/battle-quiz/leaderboard" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <p className="font-bold text-sm">لوحة الصدارة العامة</p>
                <p className="text-xs text-muted-foreground">شاهد أفضل اللاعبين هذا الأسبوع</p>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Card>
      </div>
    </ClientLayout>
  );
};

const RoomCard: React.FC<{ room: BattleQuizRoom; featured?: boolean }> = ({ room, featured }) => {
  const meta = MODE_META[room.mode] || MODE_META.daily;
  const Icon = meta.icon;
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Card className={`relative overflow-hidden ${featured ? 'p-6' : 'p-5'} border-2 hover:border-primary/50 transition-all`}>
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${meta.color}`} />
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-[10px]">{meta.label}</Badge>
              {room.is_reward_eligible && (
                <Badge className="text-[10px] bg-amber-500 hover:bg-amber-500">جوائز</Badge>
              )}
            </div>
            <h3 className="font-bold mt-1 truncate">{room.cover_emoji} {room.title}</h3>
          </div>
        </div>
        {room.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{room.description}</p>}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {room.question_count} سؤال</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {room.time_limit_per_question}ث/سؤال</span>
          <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> +{room.xp_per_correct} XP</span>
        </div>
        <Button asChild className="w-full" size={featured ? 'lg' : 'default'}>
          <Link to={`/battle-quiz/${room.id}/play`}>
            ابدأ الآن <ArrowLeft className="w-4 h-4 mr-2" />
          </Link>
        </Button>
      </Card>
    </motion.div>
  );
};

export default BattleQuizHome;
