import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Star, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useCompetitions } from '@/hooks/useCompetitions';

interface LeaderboardProps {
  competitionId: string;
  limit?: number;
}

interface LeaderboardEntry {
  id: string;
  user_id: string;
  score: number;
  rank: number;
  status: string;
  submission_date: string;
  votes?: { count: number }[];
}

const CompetitionLeaderboard: React.FC<LeaderboardProps> = ({ 
  competitionId, 
  limit = 10 
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchLeaderboard } = useCompetitions();

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await fetchLeaderboard(competitionId, limit);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (competitionId) {
      loadLeaderboard();
    }
  }, [competitionId, limit, fetchLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Trophy className="h-5 w-5 text-amber-600" />;
      default: return <Star className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300';
      case 2: return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
      case 3: return 'bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300';
      default: return 'bg-white border-gray-200';
    }
  };

  const getInitials = (userId: string) => {
    // Generate initials from user ID (in a real app, you'd use actual user names)
    return `U${userId.slice(0, 2).toUpperCase()}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            لوحة المتصدرين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leaderboard.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            لوحة المتصدرين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد نتائج بعد</p>
            <p className="text-sm">سيتم عرض النتائج بعد تقييم المشاركات</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxScore = Math.max(...leaderboard.map(entry => entry.score));

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          لوحة المتصدرين - أفضل {limit} مشاركين
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`flex items-center gap-4 p-4 rounded-lg border ${getRankColor(entry.rank)} transition-all duration-200 hover:shadow-md`}
            >
              {/* Rank Icon */}
              <div className="flex items-center justify-center w-8 h-8">
                {entry.rank <= 3 ? (
                  getRankIcon(entry.rank)
                ) : (
                  <span className="font-bold text-gray-600">#{entry.rank}</span>
                )}
              </div>

              {/* User Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-white font-semibold">
                  {getInitials(entry.user_id)}
                </AvatarFallback>
              </Avatar>

              {/* User Info & Progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800 truncate">
                    مشارك {entry.user_id.slice(-6)}
                  </span>
                  <Badge 
                    variant={entry.status === 'evaluated' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {entry.status === 'evaluated' ? 'مُقيّم' : 'قيد المراجعة'}
                  </Badge>
                </div>
                
                {/* Score Progress Bar */}
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(entry.score / maxScore) * 100} 
                    className="flex-1 h-2"
                  />
                  <span className="text-xs text-gray-500 min-w-0">
                    {entry.score.toFixed(1)} نقطة
                  </span>
                </div>
              </div>

              {/* Vote Count (if available) */}
              {entry.votes && entry.votes.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{entry.votes[0].count} تصويت</span>
                </div>
              )}

              {/* Submission Date */}
              <div className="text-xs text-gray-400 text-right">
                <div>أرسل في</div>
                <div>{new Date(entry.submission_date).toLocaleDateString('ar-SA')}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{leaderboard.length}</div>
              <div className="text-xs text-gray-600">مشاركين</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / leaderboard.length).toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">متوسط النقاط</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-600">
                {maxScore.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">أعلى نقاط</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitionLeaderboard;