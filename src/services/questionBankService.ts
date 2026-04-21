import { supabase } from '@/integrations/supabase/client';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'true_false';

export interface QCategory {
  id: string; name_ar: string; name_en: string | null;
  parent_id: string | null; icon: string | null; sort_order: number;
}
export interface QSubject {
  id: string; category_id: string; name_ar: string; name_en: string | null;
  description: string | null; icon: string | null;
}
export interface QChoice {
  id: string; choice_text: string; is_correct?: boolean; order_index: number;
}
export interface QQuestion {
  id: string; subject_id: string; question_text: string;
  explanation: string | null; question_type: QuestionType; difficulty: Difficulty;
  choices: QChoice[];
}

export class QuestionBankService {
  static async listCategories(): Promise<QCategory[]> {
    const { data, error } = await (supabase as any).from('question_categories').select('*').eq('is_active', true).order('sort_order');
    if (error) throw error;
    return data || [];
  }

  static async listSubjects(categoryId?: string): Promise<QSubject[]> {
    let q = (supabase as any).from('subjects').select('*').eq('is_active', true).order('sort_order');
    if (categoryId) q = q.eq('category_id', categoryId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }

  static async listQuestions(filter: { subjectId?: string; difficulty?: Difficulty; limit?: number } = {}): Promise<QQuestion[]> {
    let q = (supabase as any).from('questions').select('id, subject_id, question_text, explanation, question_type, difficulty, question_choices(id, choice_text, order_index)').eq('is_active', true);
    if (filter.subjectId) q = q.eq('subject_id', filter.subjectId);
    if (filter.difficulty) q = q.eq('difficulty', filter.difficulty);
    q = q.order('created_at', { ascending: false }).limit(filter.limit || 20);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map((r: any) => ({
      ...r,
      choices: (r.question_choices || []).sort((a: any, b: any) => a.order_index - b.order_index),
    }));
  }

  static async submitAnswer(questionId: string, choiceId: string, timeSpentSeconds?: number) {
    const { data, error } = await (supabase as any).rpc('submit_question_answer', {
      p_question_id: questionId, p_choice_id: choiceId, p_time_spent: timeSpentSeconds ?? null,
    });
    if (error) throw error;
    return data as { success: boolean; is_correct?: boolean; correct_choice_id?: string; explanation?: string; xp_awarded?: number; error?: string };
  }

  static async getStats(userId?: string) {
    const { data, error } = await (supabase as any).rpc('get_question_bank_stats', { p_user_id: userId ?? null });
    if (error) throw error;
    return data as { total_attempts: number; correct_count: number; success_rate: number; unique_questions: number; weakest_subjects: any[] };
  }

  // ===== Admin =====
  static async adminListAll(filter: { subjectId?: string } = {}): Promise<QQuestion[]> {
    let q = (supabase as any).from('questions').select('id, subject_id, question_text, explanation, question_type, difficulty, is_active, created_at, question_choices(id, choice_text, is_correct, order_index)');
    if (filter.subjectId) q = q.eq('subject_id', filter.subjectId);
    q = q.order('created_at', { ascending: false }).limit(200);
    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map((r: any) => ({
      ...r,
      choices: (r.question_choices || []).sort((a: any, b: any) => a.order_index - b.order_index),
    }));
  }

  static async adminCreateCategory(payload: { name_ar: string; name_en?: string; parent_id?: string }) {
    const { data, error } = await (supabase as any).from('question_categories').insert(payload).select().single();
    if (error) throw error;
    return data;
  }

  static async adminCreateSubject(payload: { category_id: string; name_ar: string; name_en?: string; description?: string }) {
    const { data, error } = await (supabase as any).from('subjects').insert(payload).select().single();
    if (error) throw error;
    return data;
  }

  static async adminCreateQuestion(payload: {
    subject_id: string; question_text: string; explanation?: string;
    difficulty: Difficulty; choices: { choice_text: string; is_correct: boolean }[];
  }) {
    const { data: q, error: qe } = await (supabase as any).from('questions').insert({
      subject_id: payload.subject_id, question_text: payload.question_text,
      explanation: payload.explanation || null, difficulty: payload.difficulty, question_type: 'mcq',
    }).select('id').single();
    if (qe) throw qe;
    const choicesPayload = payload.choices.map((c, i) => ({
      question_id: q.id, choice_text: c.choice_text, is_correct: c.is_correct, order_index: i,
    }));
    const { error: ce } = await (supabase as any).from('question_choices').insert(choicesPayload);
    if (ce) throw ce;
    return q.id;
  }

  static async adminDeleteQuestion(id: string) {
    const { error } = await (supabase as any).from('questions').delete().eq('id', id);
    if (error) throw error;
  }

  static async adminGenerateQuestions(subjectId: string, count = 10, difficulty: Difficulty = 'medium') {
    const { data, error } = await supabase.functions.invoke('generate-questions', {
      body: { subject_id: subjectId, count, difficulty },
    });
    if (error) throw error;
    return data as { success: boolean; inserted: number; error?: string };
  }
}
