import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles, Trophy, ArrowLeft } from 'lucide-react';
import { AssessmentService, Assessment } from '@/utils/assessmentService';
import { motion } from 'framer-motion';
import ClientLayout from '@/components/client/ClientLayout';

export default function AssessmentsList() {
  const [items, setItems] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AssessmentService.listActive()
      .then(setItems)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background py-10 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">🎯 اختبارات تحديد المستوى</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              اكتشف مستواك خلال دقائق، احصل على تحليل لمهاراتك، واربح XP مع كل اختبار.
            </p>
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
                    <Button asChild className="w-full group-hover:bg-primary/90">
                      <Link to={`/challenge-academy/assessments/${a.id}/start`}>
                        ابدأ الاختبار
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
