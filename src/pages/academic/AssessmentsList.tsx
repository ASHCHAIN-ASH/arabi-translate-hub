import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles, Trophy, ArrowLeft, CheckCircle2, RefreshCw } from 'lucide-react';
import { AssessmentService, Assessment } from '@/utils/assessmentService';
import { useAuth } from '@/components/SimpleAuthProvider';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';

export default function AssessmentsList() {
  const { user } = useAuth();
  const [items, setItems] = useState<Assessment[]>([]);
  const [todayMap, setTodayMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await AssessmentService.listActive();
        setItems(list);
        const entries = await Promise.all(
          list.map(async (a) => [a.id, await AssessmentService.getTodayAttemptId(a.id, user?.id ?? null)] as const)
        );
        const map: Record<string, string> = {};
        entries.forEach(([id, att]) => { if (att) map[id] = att; });
        setTodayMap(map);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  return (
    <ClientLayout>
    <div className="min-h-screen bg-background py-10 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">🎯 اختبارات تحديد المستوى</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-3">
              اكتشف مستواك خلال دقائق، احصل على تحليل لمهاراتك، واربح XP مع كل اختبار.
            </p>
            <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
              <RefreshCw className="w-3 h-3" />
              أسئلة جديدة كل يوم — محاولة واحدة يوميًا
            </Badge>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">لا توجد اختبارات متاحة حاليًا.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {items.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group hover:shadow-lg hover:border-primary/40 transition-all h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{a.cover_emoji || '🎯'}</div>
                        <div>
                          <CardTitle className="text-lg">{a.title}</CardTitle>
                          <Badge variant="secondary" className="mt-2 text-xs">{a.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {a.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{a.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{Math.round(a.time_limit_seconds / 60)} دقائق</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        <span>+{a.xp_completion} XP</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span>تحليل المهارات</span>
                      </div>
                    </div>
                    {todayMap[a.id] ? (
                      <Button asChild variant="secondary" className="w-full">
                        <Link to={`/challenge-academy/assessments/${a.id}/result?attempt=${todayMap[a.id]}`}>
                          <CheckCircle2 className="w-4 h-4 ml-2" />
                          عرض نتيجة اليوم
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full group-hover:bg-primary/90">
                        <Link to={`/challenge-academy/assessments/${a.id}/start`}>
                          ابدأ الاختبار
                          <ArrowLeft className="w-4 h-4 mr-2" />
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
    </ClientLayout>
  );
}
