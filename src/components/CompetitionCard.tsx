import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Upload, 
  FileText, 
  ChevronRight, 
  Download, 
  CheckCircle,
  Heart,
  Eye,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/data/legacy/client';

interface CompetitionCardProps {
  competition: {
    id: string;
    title: string;
    description: string;
    category: string;
    type: string;
    status: string;
    difficulty: string;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    max_participants?: number;
    prize_description: string;
    requirements: string[];
    stats?: {
      total_participants: number;
      submitted_count: number;
      average_score: number;
      top_score: number;
    };
  };
  onRegister?: (competitionId: string) => void;
  onView?: (competitionId: string) => void;
}

const getTypeIcon = (type: string) => {
  const icons = {
    research: FileText,
    case_study: Trophy,
    quiz: Clock,
    writing: FileText,
    translation: FileText,
    innovation: Star
  };
  return icons[type as keyof typeof icons] || FileText;
};

const getTypeColor = (type: string) => {
  const colors = {
    research: { text: 'text-blue-500', bg: 'bg-blue-50' },
    case_study: { text: 'text-green-500', bg: 'bg-green-50' },
    quiz: { text: 'text-yellow-500', bg: 'bg-yellow-50' },
    writing: { text: 'text-purple-500', bg: 'bg-purple-50' },
    translation: { text: 'text-indigo-500', bg: 'bg-indigo-50' },
    innovation: { text: 'text-orange-500', bg: 'bg-orange-50' }
  };
  return colors[type as keyof typeof colors] || { text: 'text-gray-500', bg: 'bg-gray-50' };
};

const CompetitionCard: React.FC<CompetitionCardProps> = ({ 
  competition, 
  onRegister, 
  onView 
}) => {
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { toast } = useToast();

  const TypeIcon = getTypeIcon(competition.type);
  const typeColors = getTypeColor(competition.type);

  const daysLeft = Math.ceil(
    (new Date(competition.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const registrationDaysLeft = Math.ceil(
    (new Date(competition.registration_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const participationProgress = competition.max_participants
    ? ((competition.stats?.total_participants || 0) / competition.max_participants) * 100
    : 0;

  const handleRegister = async () => {
    if (!onRegister) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'يجب تسجيل الدخول',
          description: 'يجب تسجيل الدخول أولاً للمشاركة في المسابقة',
          variant: 'destructive'
        });
        return;
      }

      await onRegister(competition.id);
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: 'مبتدئ',
      intermediate: 'متوسط', 
      advanced: 'متقدم'
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'ended': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'جارية',
      upcoming: 'قريبًا',
      ended: 'انتهت',
      cancelled: 'ملغية'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group border-r-4 border-r-primary" dir="rtl">
      <div className="md:flex">
        
        {/* Competition Icon & Status */}
        <div className="md:w-1/6 flex md:flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-white">
          <div className={`w-16 h-16 rounded-full ${typeColors.bg} flex items-center justify-center mb-4`}>
            <TypeIcon className={`h-8 w-8 ${typeColors.text}`} />
          </div>
          <Badge 
            className={`${getStatusColor(competition.status)} text-white whitespace-nowrap`}
          >
            {getStatusLabel(competition.status)}
          </Badge>
        </div>

        {/* Main Content */}
        <CardContent className="md:w-5/6 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            
            {/* Competition Details */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {competition.category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getDifficultyColor(competition.difficulty)}`}
                >
                  {getDifficultyLabel(competition.difficulty)}
                </Badge>
                {daysLeft > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {daysLeft} يوم متبقي
                  </Badge>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {competition.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                {competition.description}
              </p>

              {/* Competition Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>ينتهي: {new Date(competition.end_date).toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    {registrationDaysLeft > 0 
                      ? `${registrationDaysLeft} يوم للتسجيل`
                      : 'انتهت فترة التسجيل'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{competition.stats?.total_participants || 0} مشارك</span>
                </div>
              </div>

              {/* Participation Progress */}
              {competition.max_participants && (
                <div className="mb-4">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">المشاركون</span>
                    <span className="text-gray-800 font-medium">
                      {competition.stats?.total_participants || 0} / {competition.max_participants}
                    </span>
                  </div>
                  <Progress value={participationProgress} className="h-2" />
                </div>
              )}

              {/* Stats */}
              {competition.stats && competition.stats.submitted_count > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">
                      {competition.stats.submitted_count}
                    </div>
                    <div className="text-xs text-blue-500">مشاركة</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(competition.stats.average_score)}
                    </div>
                    <div className="text-xs text-green-500">متوسط النقاط</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="text-lg font-bold text-yellow-600">
                      {Math.round(competition.stats.top_score)}
                    </div>
                    <div className="text-xs text-yellow-500">أعلى نقاط</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-purple-500">مشاهدة</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-800">متطلبات المشاركة:</h4>
                <div className="flex flex-wrap gap-2">
                  {competition.requirements.slice(0, 3).map((req, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {req}
                    </div>
                  ))}
                  {competition.requirements.length > 3 && (
                    <div className="text-xs text-gray-500 px-2 py-1">
                      +{competition.requirements.length - 3} المزيد
                    </div>
                  )}
                </div>
              </div>

              {/* Prize */}
              <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">الجائزة: {competition.prize_description}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 md:w-48">
              {competition.status === 'active' && registrationDaysLeft > 0 && !isRegistered ? (
                <Button 
                  className="w-full group" 
                  size="lg"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  <Upload className="mr-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
                  {loading ? 'جاري التسجيل...' : 'شارك الآن'}
                </Button>
              ) : isRegistered ? (
                <Button variant="default" className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  تم التسجيل
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" size="lg" disabled>
                  {registrationDaysLeft <= 0 ? 'انتهت فترة التسجيل' : 'غير متاح'}
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full group"
                onClick={() => onView?.(competition.id)}
              >
                <FileText className="mr-2 h-4 w-4" />
                تفاصيل أكثر
                <ChevronRight className="ml-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="ghost" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                تحميل الشروط
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default CompetitionCard;