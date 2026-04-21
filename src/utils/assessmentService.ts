import { supabase } from '@/integrations/supabase/client';

const ANON_KEY = 'mep_anon_id';
export function getAssessmentAnonId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(ANON_KEY);
  if (!id) {
    id = (crypto as any).randomUUID?.() ?? `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(ANON_KEY, id);
  }
  return id;
}

export interface Assessment {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  time_limit_seconds: number;
  xp_completion: number;
  xp_share: number;
  cover_emoji: string | null;
  is_active: boolean;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  skill_tag: string;
  explanation: string | null;
  order_index: number;
  options: AssessmentOption[];
}

export interface AssessmentOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  user_id: string | null;
  anonymous_id: string | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  total_questions: number;
  correct_count: number;
  total_score: number;
  level_result: string | null;
  skill_breakdown: Record<string, { correct: number; total: number; percent: number }>;
  time_spent_seconds: number;
  xp_awarded: number;
  shared_at: string | null;
  share_xp_awarded: number;
  started_at: string;
  completed_at: string | null;
}

export class AssessmentService {
  static async listActive(): Promise<Assessment[]> {
    const { data, error } = await (supabase as any)
      .from('assessments')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return (data || []) as Assessment[];
  }

  static async getById(id: string): Promise<Assessment | null> {
    const { data } = await (supabase as any).from('assessments').select('*').eq('id', id).maybeSingle();
    return (data as Assessment) ?? null;
  }

  static async getQuestions(assessmentId: string): Promise<AssessmentQuestion[]> {
    const { data, error } = await (supabase as any)
      .from('assessment_questions')
      .select('*, options:assessment_options(*)')
      .eq('assessment_id', assessmentId)
      .order('order_index');
    if (error) throw error;
    return ((data || []) as any[]).map((q) => ({
      ...q,
      options: (q.options || []).sort((a: any, b: any) => a.order_index - b.order_index),
    })) as AssessmentQuestion[];
  }

  static async createAttempt(assessmentId: string, userId: string | null): Promise<AssessmentAttempt> {
    const payload: any = { assessment_id: assessmentId };
    if (userId) payload.user_id = userId;
    else payload.anonymous_id = getAssessmentAnonId();
    const { data, error } = await (supabase as any)
      .from('assessment_attempts')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return data as AssessmentAttempt;
  }

  static async getAttempt(id: string): Promise<AssessmentAttempt | null> {
    const { data } = await (supabase as any).from('assessment_attempts').select('*').eq('id', id).maybeSingle();
    return (data as AssessmentAttempt) ?? null;
  }

  static async submit(attemptId: string, answers: Array<{ question_id: string; selected_option_id: string | null }>, timeSpent: number) {
    const { data, error } = await (supabase as any).rpc('submit_assessment_attempt', {
      p_attempt_id: attemptId,
      p_answers: answers,
      p_time_spent: timeSpent,
    });
    if (error) throw error;
    return data as {
      success: boolean;
      score?: number;
      level?: string;
      correct?: number;
      total?: number;
      skill_breakdown?: Record<string, { correct: number; total: number; percent: number }>;
      xp_awarded?: number;
      already_completed?: boolean;
    };
  }

  static async awardShareXp(attemptId: string) {
    const { data, error } = await (supabase as any).rpc('award_assessment_share_xp', {
      p_attempt_id: attemptId,
    });
    if (error) throw error;
    return data as { success: boolean; xp_awarded?: number; already_awarded?: boolean; error?: string };
  }

  static async linkAnonymousAttempts() {
    const anonId = getAssessmentAnonId();
    const { data } = await (supabase as any).rpc('link_anonymous_assessment_attempts', { p_anonymous_id: anonId });
    return (data as number) ?? 0;
  }
}

export const levelLabel = (level: string | null | undefined): { label: string; color: string; emoji: string } => {
  switch (level) {
    case 'beginner': return { label: 'مبتدئ', color: 'bg-blue-500', emoji: '🌱' };
    case 'intermediate': return { label: 'متوسط', color: 'bg-amber-500', emoji: '⭐' };
    case 'advanced': return { label: 'متقدم', color: 'bg-emerald-500', emoji: '🏆' };
    default: return { label: '—', color: 'bg-muted', emoji: '🎯' };
  }
};

export const skillLabel = (tag: string): string => {
  const map: Record<string, string> = {
    grammar: 'القواعد',
    vocabulary: 'المفردات',
    reading: 'الفهم القرائي',
    listening: 'الاستماع',
    writing: 'الكتابة',
    general: 'عام',
  };
  return map[tag] || tag;
};
