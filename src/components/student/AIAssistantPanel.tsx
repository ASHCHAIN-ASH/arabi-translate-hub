import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Plus, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { StudentProfile, StudentEvent, StudentTask } from '@/hooks/useStudentDashboard';

type Suggestion = { title: string; xp: number };

export default function AIAssistantPanel({
  profile, events, tasks, onAdd,
}: {
  profile: StudentProfile | null;
  events: StudentEvent[];
  tasks: StudentTask[];
  onAdd: (title: string, xp: number) => Promise<void> | void;
}) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [adding, setAdding] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('student-ai-assistant', {
        body: { profile, events, tasks },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const list: Suggestion[] = ((data as any)?.suggestions || []).slice(0, 5);
      setItems(list);
      if (list.length === 0) toast.info('لم نجد اقتراحات الآن');
    } catch (e: any) {
      toast.error(e?.message || 'تعذّر جلب الاقتراحات');
    } finally {
      setLoading(false);
    }
  };

  const addOne = async (s: Suggestion) => {
    setAdding(s.title);
    try {
      await onAdd(s.title, s.xp);
      setItems(prev => prev.filter(x => x.title !== s.title));
      toast.success('تمت إضافة المهمة');
    } finally {
      setAdding(null);
    }
  };

  return (
    <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-violet-500/10 via-cyan-500/10 to-fuchsia-500/10 backdrop-blur-xl">
      <div className="pointer-events-none absolute -top-16 -right-10 h-44 w-44 rounded-full bg-violet-500/20 blur-3xl" />
      <CardContent className="relative p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/50">المساعد الذكي</p>
              <p className="text-base font-bold text-white">اقتراحات يومية</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={fetchSuggestions}
            disabled={loading}
            className="bg-white/10 text-white hover:bg-white/20"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="me-1 h-4 w-4" /> اقترح</>}
          </Button>
        </div>

        {items.length === 0 && !loading && (
          <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-white/55">
            اضغط "اقترح" ليقترح المساعد مهامًا مناسبة لك.
          </p>
        )}

        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((s, i) => (
              <motion.div
                key={s.title}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-2 rounded-xl bg-white/5 p-3 ring-1 ring-white/10"
              >
                <span className="line-clamp-2 text-sm text-white/90">{s.title}</span>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Badge className="border-0 bg-violet-500/20 text-violet-200">+{s.xp}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={adding === s.title}
                    onClick={() => addOne(s)}
                    className="text-cyan-300 hover:bg-white/10 hover:text-cyan-200"
                  >
                    {adding === s.title ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
