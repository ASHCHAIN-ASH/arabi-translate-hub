import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useChallengeAcademy } from '@/hooks/useChallengeAcademy';
import { useDailyChallenge } from '@/hooks/useDailyChallenge';
import { StatsHeader } from '@/components/challenge-academy/StatsHeader';
import { ChallengeCard } from '@/components/challenge-academy/ChallengeCard';
import { Leaderboard } from '@/components/challenge-academy/Leaderboard';
import { AchievementsGrid } from '@/components/challenge-academy/AchievementsGrid';
import { DailyChallengeCard } from '@/components/challenge-academy/DailyChallengeCard';
import { ChallengeRunner } from '@/components/challenge-academy/ChallengeRunner';
import { ChallengeResult } from '@/components/challenge-academy/ChallengeResult';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Zap, Trophy, Award, Loader2, Calendar } from 'lucide-react';
import { AttemptSubmitResult } from '@/utils/dailyChallengeService';

const ChallengeAcademy: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const {
    summary, streak, challenges, submissions,
    achievements, userAchievements, loading, refresh,
  } = useChallengeAcademy(userId);
  const daily = useDailyChallenge(userId);

  const [runnerOpen, setRunnerOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [lastResult, setLastResult] = useState<AttemptSubmitResult | null>(null);

  if (!userId) {
    return (
      <ClientLayout>
        <div className="p-6 text-center">يرجى تسجيل الدخول</div>
      </ClientLayout>
    );
  }

  const submissionMap = new Map(submissions.map(s => [s.challenge_id, s]));
  const completedToday = submissions.length;
  const totalToday = challenges.length;

  return (
    <ClientLayout>
      <div className="p-3 sm:p-4 lg:p-6 space-y-5 max-w-7xl mx-auto" dir="rtl">
        {/* Header */}
        <StatsHeader summary={summary} streak={streak} />

        {/* Tabs */}
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto h-auto p-1">
            <TabsTrigger value="daily" className="gap-2 py-2.5">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">التحدي اليومي</span>
              <span className="sm:hidden">اليومي</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="gap-2 py-2.5">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">لوحة الصدارة</span>
              <span className="sm:hidden">الصدارة</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2 py-2.5">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">إنجازاتي</span>
              <span className="sm:hidden">الإنجازات</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-5">
            {/* Timed quiz challenge — hero */}
            {daily.challenge && (
              <DailyChallengeCard
                challenge={daily.challenge}
                bestAttempt={daily.bestAttempt}
                completedToday={daily.completedToday}
                attemptCount={daily.attempts.length}
                onStart={() => setRunnerOpen(true)}
              />
            )}

            {/* Quick challenges (existing) */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">
                    تحديات سريعة {new Date().toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    أكملت {completedToday} من {totalToday} تحدي • +{submissions.reduce((s, x) => s + x.xp_awarded, 0)} XP اليوم
                  </p>
                </div>
              </div>
            </Card>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : challenges.length === 0 ? (
              <Card className="p-10 text-center">
                <Zap className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="font-bold mb-1">لا توجد تحديات سريعة اليوم</p>
                <p className="text-sm text-muted-foreground">عُد غداً لتحديات جديدة!</p>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {challenges.map(c => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    submission={submissionMap.get(c.id)}
                    userId={userId}
                    onComplete={refresh}
                  />
                ))}
              </div>
            )}

            {/* Runner & Result modals */}
            {daily.challenge && (
              <>
                <ChallengeRunner
                  open={runnerOpen}
                  onOpenChange={setRunnerOpen}
                  challengeId={daily.challenge.id}
                  userId={userId}
                  onComplete={(res) => {
                    setLastResult(res);
                    setResultOpen(true);
                    daily.refresh();
                    refresh();
                  }}
                />
                <ChallengeResult
                  open={resultOpen}
                  onOpenChange={setResultOpen}
                  result={lastResult}
                  challengeTitle={daily.challenge.title}
                  onRetry={() => { setResultOpen(false); setTimeout(() => setRunnerOpen(true), 300); }}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard currentUserId={userId} />
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="p-4 sm:p-6">
              <AchievementsGrid achievements={achievements} unlocked={userAchievements} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default ChallengeAcademy;
