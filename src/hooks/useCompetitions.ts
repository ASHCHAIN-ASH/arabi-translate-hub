import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface Competition {
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
  evaluation_criteria: string[];
  rules?: string;
  image_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
  quiz_duration_minutes?: number;
  submission_format?: string;
  word_limit?: number;
  language_pairs?: string[];
  innovation_category?: string;
  stats?: {
    total_participants: number;
    submitted_count: number;
    average_score: number;
    top_score: number;
  };
  participants?: any[];
  winners?: any[];
  votes?: any[];
}

interface Participant {
  id: string;
  competition_id: string;
  user_id: string;
  status: string;
  registration_date: string;
  submission_date?: string;
  submission_file_url?: string;
  submission_content?: string;
  score?: number;
  rank?: number;
  feedback?: string;
  quiz_answers?: any;
  submission_metadata?: any;
}

export const useCompetitions = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // جلب قائمة المسابقات
  const fetchCompetitions = async (status?: string, type?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('action', 'list-competitions');
      if (status) params.append('status', status);
      if (type) params.append('type', type);

      const { data, error } = await supabase.functions.invoke('competition-management', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) throw error;

      if (data.success) {
        setCompetitions(data.competitions);
      } else {
        throw new Error(data.error || 'Failed to fetch competitions');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'خطأ في جلب المسابقات',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // جلب مسابقة واحدة مع التفاصيل
  const fetchCompetition = async (competitionId: string) => {
    try {
      const params = new URLSearchParams();
      params.append('action', 'get-competition');
      params.append('id', competitionId);

      const response = await fetch(
        `https://ibfcgweykqkzdodrfmci.functions.supabase.co/competition-management?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        return data.competition;
      } else {
        throw new Error(data.error || 'Failed to fetch competition');
      }
    } catch (err: any) {
      toast({
        title: 'خطأ في جلب المسابقة',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // التحقق من صحة المشاركة
  const validateParticipation = async (competitionId: string, userId: string) => {
    try {
      const params = new URLSearchParams();
      params.append('action', 'validate-participation');
      params.append('competition_id', competitionId);
      params.append('user_id', userId);

      const response = await fetch(
        `https://ibfcgweykqkzdodrfmci.functions.supabase.co/competition-management?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      return data.success ? data.validation : { valid: false, message: data.error };
    } catch (err: any) {
      return { valid: false, message: err.message };
    }
  };

  // تسجيل المشاركة
  const registerParticipation = async (competitionId: string, userId: string, metadata = {}) => {
    try {
      const { data, error } = await supabase.functions.invoke('competition-management', {
        body: {
          action: 'register',
          competition_id: competitionId,
          user_id: userId,
          metadata
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'تم التسجيل بنجاح',
          description: 'تم تسجيل مشاركتك في المسابقة بنجاح',
        });
        return data.result;
      } else {
        throw new Error(data.error || 'Failed to register participation');
      }
    } catch (err: any) {
      toast({
        title: 'خطأ في التسجيل',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // إضافة تصويت
  const addVote = async (competitionId: string, participantId: string, voterEmail: string, voteValue = 1) => {
    try {
      const { data, error } = await supabase.functions.invoke('competition-management', {
        body: {
          action: 'vote',
          competition_id: competitionId,
          participant_id: participantId,
          voter_email: voterEmail,
          vote_value: voteValue
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'تم التصويت بنجاح',
          description: 'شكراً لك على مشاركتك في التصويت',
        });
        return data.result;
      } else {
        throw new Error(data.error || 'Failed to add vote');
      }
    } catch (err: any) {
      toast({
        title: 'خطأ في التصويت',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // جلب لوحة الترتيب
  const fetchLeaderboard = async (competitionId: string, limit = 10) => {
    try {
      const params = new URLSearchParams();
      params.append('action', 'leaderboard');
      params.append('competition_id', competitionId);
      params.append('limit', limit.toString());

      const response = await fetch(
        `https://ibfcgweykqkzdodrfmci.functions.supabase.co/competition-management?${params}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        return data.leaderboard;
      } else {
        throw new Error(data.error || 'Failed to fetch leaderboard');
      }
    } catch (err: any) {
      toast({
        title: 'خطأ في جلب الترتيب',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // إرسال المشاركة
  const submitParticipation = async (
    participationId: string,
    submission: {
      content?: string;
      file_url?: string;
      quiz_answers?: any;
      metadata?: any;
    }
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('competition-management', {
        body: {
          action: 'submit',
          participation_id: participationId,
          submission_content: submission.content,
          submission_file_url: submission.file_url,
          quiz_answers: submission.quiz_answers,
          metadata: submission.metadata
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'تم إرسال المشاركة',
          description: 'تم إرسال مشاركتك بنجاح وسيتم تقييمها قريباً',
        });
        return data.submission;
      } else {
        throw new Error(data.error || 'Failed to submit participation');
      }
    } catch (err: any) {
      toast({
        title: 'خطأ في إرسال المشاركة',
        description: err.message,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // إعداد الـ realtime للتحديثات اللحظية
  useEffect(() => {
    const channel = supabase
      .channel('competitions-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'academic_competitions'
        },
        (payload) => {
          console.log('Competition updated:', payload);
          // تحديث البيانات المحلية
          if (payload.eventType === 'INSERT') {
            setCompetitions(prev => [payload.new as Competition, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCompetitions(prev => 
              prev.map(comp => 
                comp.id === payload.new.id ? { ...comp, ...payload.new } : comp
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setCompetitions(prev => 
              prev.filter(comp => comp.id !== payload.old.id)
            );
          }
        }
      )
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public', 
          table: 'competition_participants'
        },
        (payload) => {
          console.log('Participant updated:', payload);
          // إشعار بالتحديثات الجديدة
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'مشارك جديد',
              description: 'انضم مشارك جديد للمسابقة',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // جلب المسابقات عند تحميل الـ hook
  useEffect(() => {
    fetchCompetitions('active');
  }, []);

  return {
    competitions,
    loading,
    error,
    fetchCompetitions,
    fetchCompetition,
    validateParticipation,
    registerParticipation,
    addVote,
    fetchLeaderboard,
    submitParticipation,
    refetch: () => fetchCompetitions('active')
  };
};

export const useCompetitionRealtime = (competitionId: string) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    if (!competitionId) return;

    // إعداد الـ realtime للمسابقة المحددة
    const channel = supabase
      .channel(`competition-${competitionId}`)
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'competition_participants',
          filter: `competition_id=eq.${competitionId}`
        },
        (payload) => {
          console.log('Participant change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setParticipants(prev => [...prev, payload.new as Participant]);
            toast({
              title: 'مشارك جديد',
              description: 'انضم مشارك جديد للمسابقة',
            });
          } else if (payload.eventType === 'UPDATE') {
            setParticipants(prev =>
              prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p)
            );
            
            // إشعار عند تحديث النقاط
            if (payload.new.score && payload.old.score !== payload.new.score) {
              toast({
                title: 'تحديث النقاط',
                description: 'تم تحديث نقاط أحد المشاركين',
              });
            }
          }
        }
      )
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'competition_votes',
          filter: `competition_id=eq.${competitionId}`
        },
        (payload) => {
          console.log('Vote change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setVotes(prev => [...prev, payload.new]);
            toast({
              title: 'تصويت جديد',
              description: 'تم إضافة تصويت جديد',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [competitionId, toast]);

  return {
    participants,
    votes,
    stats
  };
};