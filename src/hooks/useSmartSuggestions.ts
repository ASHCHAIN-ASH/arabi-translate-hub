import { useMemo } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Compass, FileText, Brain, BarChart3, Target, BookOpen, Crown,
  Sparkles, Calendar, Wand2, Trophy, Flame,
} from 'lucide-react';
import type { DailyTask, UpcomingOrder } from '@/hooks/useStudentHub';
import type { UserPointsSummary } from '@/utils/gamificationService';

export interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  cta: string;
  priority: number; // higher = more urgent
  tone: 'primary' | 'warning' | 'success' | 'accent' | 'secondary';
  badge?: string;
}

interface Args {
  tasks: DailyTask[];
  upcoming: UpcomingOrder[];
  summary: UserPointsSummary | null;
  isPremium: boolean;
  hasCV?: boolean;
}

const daysUntil = (iso: string | null): number | null => {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

/**
 * Rule-based smart suggestions for the Student Hub.
 * Returns a prioritized list — render top 3-4.
 */
export function useSmartSuggestions({ tasks, upcoming, summary, isPremium, hasCV }: Args): SmartSuggestion[] {
  return useMemo(() => {
    const out: SmartSuggestion[] = [];

    // 1) Urgent deadlines (top priority)
    const urgentOrder = upcoming.find(o => {
      const d = daysUntil(o.deadline);
      return d !== null && d <= 3;
    });
    if (urgentOrder) {
      const d = daysUntil(urgentOrder.deadline);
      out.push({
        id: 'urgent-order',
        title: d! < 0 ? 'طلب متأخر' : `موعد قريب خلال ${d} ${d === 1 ? 'يوم' : 'أيام'}`,
        description: urgentOrder.service_name || 'تابع تقدم طلبك الآن',
        icon: Calendar,
        to: `/orders/${urgentOrder.id}`,
        cta: 'فتح الطلب',
        priority: 100,
        tone: d! < 0 ? 'warning' : 'warning',
        badge: d! < 0 ? 'متأخر' : 'عاجل',
      });
    }

    // 2) Daily login task not completed
    const dailyLogin = tasks.find(t => t.code === 'daily_login' && !t.is_completed);
    if (dailyLogin) {
      out.push({
        id: 'daily-login',
        title: 'احصد نقاط دخولك اليومي',
        description: `+${dailyLogin.points_reward} نقطة بضغطة واحدة`,
        icon: Flame,
        to: '#daily-tasks',
        cta: 'تنفيذ',
        priority: 80,
        tone: 'warning',
      });
    }

    // 3) Incomplete daily tasks
    const incomplete = tasks.filter(t => !t.is_completed && t.code !== 'daily_login');
    if (incomplete.length >= 2) {
      out.push({
        id: 'finish-tasks',
        title: `أكمل ${incomplete.length} مهام لكسب نقاط إضافية`,
        description: 'مهام اليوم تمنحك تقدمًا فوريًا في المستوى',
        icon: Target,
        to: '#daily-tasks',
        cta: 'عرض المهام',
        priority: 60,
        tone: 'primary',
      });
    }

    // 4) Close to next level
    if (summary?.next_level && summary.points_to_next > 0 && summary.points_to_next <= 50) {
      out.push({
        id: 'level-up',
        title: `${summary.points_to_next} نقطة فقط للمستوى التالي`,
        description: `اقترب من مستوى ${summary.next_level.name_ar}`,
        icon: Trophy,
        to: '/student/rewards',
        cta: 'استعرض المكافآت',
        priority: 70,
        tone: 'secondary',
      });
    }

    // 5) New user — guide to tracks
    if (!summary || summary.lifetime_earned < 50) {
      out.push({
        id: 'start-track',
        title: 'ابدأ مسارك التخصصي',
        description: 'اختر مسارًا يناسب تخصصك واكتشف الأدوات المخصصة لك',
        icon: Compass,
        to: '/student/tracks',
        cta: 'استكشف',
        priority: 50,
        tone: 'primary',
        badge: 'موصى',
      });
    }

    // 6) No CV yet
    if (hasCV === false) {
      out.push({
        id: 'create-cv',
        title: 'أنشئ سيرتك الأكاديمية',
        description: '6 قوالب احترافية، عربي/إنجليزي، تصدير PDF',
        icon: FileText,
        to: '/student/academic-cv',
        cta: 'إنشاء CV',
        priority: 40,
        tone: 'accent',
      });
    }

    // 7) Premium upsell (only for active free users)
    if (!isPremium && summary && summary.lifetime_earned >= 100) {
      out.push({
        id: 'upgrade',
        title: 'ارفع حدودك مع البريميوم',
        description: '50 استخدام يومي للأدوات + تحليل متقدم + موارد حصرية',
        icon: Crown,
        to: '/membership',
        cta: 'ترقية',
        priority: 30,
        tone: 'warning',
        badge: 'بريميوم',
      });
    }

    // 8) Discover features (fallback)
    out.push({
      id: 'mind-map',
      title: 'حوّل أبحاثك إلى خرائط ذهنية',
      description: 'الصق نصًا واحصل على خريطة تفاعلية قابلة للتصدير',
      icon: Brain,
      to: '/student/mind-map',
      cta: 'جرب الآن',
      priority: 20,
      tone: 'accent',
    });

    out.push({
      id: 'stats',
      title: 'حلل بياناتك إحصائيًا',
      description: 'T-Test, ANOVA, Correlation — مع تفسير أكاديمي',
      icon: BarChart3,
      to: '/student/statistical-analysis',
      cta: 'ابدأ التحليل',
      priority: 15,
      tone: 'secondary',
    });

    out.push({
      id: 'library',
      title: 'موارد مختارة في المكتبة',
      description: 'قوالب، أدلة، ومراجع لتسريع عملك الأكاديمي',
      icon: BookOpen,
      to: '/student/library',
      cta: 'تصفح',
      priority: 10,
      tone: 'primary',
    });

    return out.sort((a, b) => b.priority - a.priority);
  }, [tasks, upcoming, summary, isPremium, hasCV]);
}
