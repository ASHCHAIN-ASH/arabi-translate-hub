import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/data/legacy/client';
import { Plus, Pencil, Trash2, Loader2, Target, Users, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { skillLabel } from '@/utils/assessmentService';

interface Assessment { id: string; slug: string; title: string; description: string | null; category: string; time_limit_seconds: number; xp_completion: number; xp_share: number; cover_emoji: string | null; is_active: boolean; sort_order: number; }
interface Q { id: string; assessment_id: string; question_text: string; difficulty: 'easy' | 'medium' | 'hard'; skill_tag: string; explanation: string | null; order_index: number; options: O[]; }
interface O { id: string; question_id: string; option_text: string; is_correct: boolean; order_index: number; }
interface Stats { attempts: number; completed: number; avg_score: number; }

export default function AdminAssessments() {
  const [list, setList] = useState<Assessment[]>([]);
  const [stats, setStats] = useState<Record<string, Stats>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Assessment | null>(null);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [qOpen, setQOpen] = useState(false);
  const [qEditing, setQEditing] = useState<Q | null>(null);

  const refresh = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('assessments').select('*').order('sort_order');
    setList((data || []) as Assessment[]);
    // Stats
    const ids = (data || []).map((a: any) => a.id);
    const next: Record<string, Stats> = {};
    for (const aid of ids) {
      const { data: atts } = await (supabase as any)
        .from('assessment_attempts').select('status,total_score').eq('assessment_id', aid);
      const completed = (atts || []).filter((x: any) => x.status === 'completed');
      const avg = completed.length ? Math.round(completed.reduce((s: number, r: any) => s + r.total_score, 0) / completed.length) : 0;
      next[aid] = { attempts: (atts || []).length, completed: completed.length, avg_score: avg };
    }
    setStats(next);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const loadQuestions = async (aid: string) => {
    const { data } = await (supabase as any)
      .from('assessment_questions')
      .select('*, options:assessment_options(*)')
      .eq('assessment_id', aid)
      .order('order_index');
    const sorted = ((data || []) as any[]).map((q) => ({ ...q, options: (q.options || []).sort((a: any, b: any) => a.order_index - b.order_index) })) as Q[];
    setQuestions(sorted);
  };

  const toggleExpand = async (aid: string) => {
    if (expandedId === aid) { setExpandedId(null); return; }
    setExpandedId(aid);
    await loadQuestions(aid);
  };

  // ---- Assessment CRUD ----
  const newAssessment = (): Assessment => ({
    id: '', slug: '', title: '', description: '', category: 'general',
    time_limit_seconds: 420, xp_completion: 50, xp_share: 25, cover_emoji: '🎯',
    is_active: true, sort_order: list.length,
  });

  const saveAssessment = async () => {
    if (!editing) return;
    if (!editing.title || !editing.slug) { toast.error('العنوان والمعرّف مطلوبان'); return; }
    const payload: any = { ...editing };
    delete payload.id;
    if (editing.id) {
      const { error } = await (supabase as any).from('assessments').update(payload).eq('id', editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await (supabase as any).from('assessments').insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success('تم الحفظ');
    setOpen(false); setEditing(null); await refresh();
  };

  const deleteAssessment = async (id: string) => {
    if (!confirm('حذف الاختبار وكل أسئلته ومحاولاته؟')) return;
    const { error } = await (supabase as any).from('assessments').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('تم الحذف');
    await refresh();
  };

  // ---- Question CRUD ----
  const newQuestion = (aid: string): Q => ({
    id: '', assessment_id: aid, question_text: '', difficulty: 'medium', skill_tag: 'general', explanation: '',
    order_index: questions.length + 1,
    options: [
      { id: '', question_id: '', option_text: '', is_correct: true, order_index: 1 },
      { id: '', question_id: '', option_text: '', is_correct: false, order_index: 2 },
      { id: '', question_id: '', option_text: '', is_correct: false, order_index: 3 },
      { id: '', question_id: '', option_text: '', is_correct: false, order_index: 4 },
    ],
  });

  const saveQuestion = async () => {
    if (!qEditing) return;
    if (!qEditing.question_text.trim()) { toast.error('نص السؤال مطلوب'); return; }
    const valid = qEditing.options.filter((o) => o.option_text.trim());
    if (valid.length < 2) { toast.error('خيارين على الأقل'); return; }
    if (!valid.some((o) => o.is_correct)) { toast.error('حدّد إجابة صحيحة واحدة على الأقل'); return; }

    let qid = qEditing.id;
    if (qid) {
      await (supabase as any).from('assessment_questions').update({
        question_text: qEditing.question_text, difficulty: qEditing.difficulty,
        skill_tag: qEditing.skill_tag, explanation: qEditing.explanation, order_index: qEditing.order_index,
      }).eq('id', qid);
      await (supabase as any).from('assessment_options').delete().eq('question_id', qid);
    } else {
      const { data, error } = await (supabase as any).from('assessment_questions').insert({
        assessment_id: qEditing.assessment_id,
        question_text: qEditing.question_text, difficulty: qEditing.difficulty,
        skill_tag: qEditing.skill_tag, explanation: qEditing.explanation, order_index: qEditing.order_index,
      }).select('id').single();
      if (error) return toast.error(error.message);
      qid = data.id;
    }
    const insOpts = valid.map((o, idx) => ({
      question_id: qid, option_text: o.option_text, is_correct: o.is_correct, order_index: idx + 1,
    }));
    await (supabase as any).from('assessment_options').insert(insOpts);
    toast.success('تم حفظ السؤال');
    setQOpen(false); setQEditing(null);
    if (expandedId) await loadQuestions(expandedId);
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm('حذف السؤال؟')) return;
    await (supabase as any).from('assessment_questions').delete().eq('id', id);
    if (expandedId) await loadQuestions(expandedId);
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6" dir="rtl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Target className="w-6 h-6 text-primary" /> اختبارات تحديد المستوى</h1>
            <p className="text-sm text-muted-foreground">أنشئ اختبارات قصيرة وادر أسئلتها وقياس أداء الطلاب.</p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(newAssessment())}><Plus className="w-4 h-4 ml-2" /> اختبار جديد</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl" dir="rtl">
              <DialogHeader><DialogTitle>{editing?.id ? 'تعديل اختبار' : 'اختبار جديد'}</DialogTitle></DialogHeader>
              {editing && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2"><Label>العنوان</Label>
                    <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                  </div>
                  <div><Label>المعرّف (slug)</Label>
                    <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="english-level" />
                  </div>
                  <div><Label>الفئة</Label>
                    <Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                  </div>
                  <div className="md:col-span-2"><Label>الوصف</Label>
                    <Textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                  </div>
                  <div><Label>الإيموجي</Label>
                    <Input value={editing.cover_emoji ?? ''} onChange={(e) => setEditing({ ...editing, cover_emoji: e.target.value })} />
                  </div>
                  <div><Label>الحد الزمني (ثانية)</Label>
                    <Input type="number" value={editing.time_limit_seconds} onChange={(e) => setEditing({ ...editing, time_limit_seconds: +e.target.value })} />
                  </div>
                  <div><Label>XP الإكمال</Label>
                    <Input type="number" value={editing.xp_completion} onChange={(e) => setEditing({ ...editing, xp_completion: +e.target.value })} />
                  </div>
                  <div><Label>XP المشاركة</Label>
                    <Input type="number" value={editing.xp_share} onChange={(e) => setEditing({ ...editing, xp_share: +e.target.value })} />
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                    <Label>نشط</Label>
                  </div>
                </div>
              )}
              <DialogFooter><Button onClick={saveAssessment}>حفظ</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>
        ) : list.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">لا توجد اختبارات بعد.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {list.map((a) => {
              const s = stats[a.id] || { attempts: 0, completed: 0, avg_score: 0 };
              const expanded = expandedId === a.id;
              return (
                <Card key={a.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{a.cover_emoji || '🎯'}</span>
                        <div>
                          <CardTitle className="text-lg">{a.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <Badge variant="outline" className="text-[10px]">{a.slug}</Badge>
                            <Badge variant="secondary" className="text-[10px]">{a.category}</Badge>
                            <Badge variant={a.is_active ? 'default' : 'outline'} className="text-[10px]">{a.is_active ? 'نشط' : 'متوقف'}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground border rounded-lg px-3 py-1.5">
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {s.attempts}</span>
                          <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> {s.completed} مكتمل</span>
                          <span>متوسط: {s.avg_score}%</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => toggleExpand(a.id)}>
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteAssessment(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  {expanded && (
                    <CardContent className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">الأسئلة ({questions.length})</h3>
                        <Button size="sm" onClick={() => { setQEditing(newQuestion(a.id)); setQOpen(true); }}>
                          <Plus className="w-3.5 h-3.5 ml-1" /> سؤال
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {questions.map((q) => (
                          <div key={q.id} className="border rounded-lg p-3 flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <Badge variant="outline" className="text-[10px]">{q.difficulty === 'easy' ? 'سهل' : q.difficulty === 'medium' ? 'متوسط' : 'صعب'}</Badge>
                                <Badge variant="secondary" className="text-[10px]">{skillLabel(q.skill_tag)}</Badge>
                                <span className="text-xs text-muted-foreground">#{q.order_index}</span>
                              </div>
                              <p className="text-sm font-medium">{q.question_text}</p>
                              <div className="text-xs text-muted-foreground mt-1.5">
                                {q.options.length} خيارات • الصحيحة: {q.options.find((o) => o.is_correct)?.option_text || '—'}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => { setQEditing({ ...q, options: q.options.length ? q.options : newQuestion(a.id).options }); setQOpen(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => deleteQuestion(q.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                            </div>
                          </div>
                        ))}
                        {questions.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">لا أسئلة بعد.</p>}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Question Dialog */}
        <Dialog open={qOpen} onOpenChange={(v) => { setQOpen(v); if (!v) setQEditing(null); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader><DialogTitle>{qEditing?.id ? 'تعديل سؤال' : 'سؤال جديد'}</DialogTitle></DialogHeader>
            {qEditing && (
              <div className="space-y-4">
                <div><Label>نص السؤال</Label>
                  <Textarea value={qEditing.question_text} onChange={(e) => setQEditing({ ...qEditing, question_text: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>الصعوبة</Label>
                    <Select value={qEditing.difficulty} onValueChange={(v: any) => setQEditing({ ...qEditing, difficulty: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">سهل</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="hard">صعب</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>المهارة</Label>
                    <Select value={qEditing.skill_tag} onValueChange={(v) => setQEditing({ ...qEditing, skill_tag: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grammar">القواعد</SelectItem>
                        <SelectItem value="vocabulary">المفردات</SelectItem>
                        <SelectItem value="reading">الفهم القرائي</SelectItem>
                        <SelectItem value="listening">الاستماع</SelectItem>
                        <SelectItem value="writing">الكتابة</SelectItem>
                        <SelectItem value="general">عام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>ترتيب</Label>
                    <Input type="number" value={qEditing.order_index} onChange={(e) => setQEditing({ ...qEditing, order_index: +e.target.value })} />
                  </div>
                </div>
                <div><Label>التفسير (اختياري)</Label>
                  <Textarea value={qEditing.explanation ?? ''} onChange={(e) => setQEditing({ ...qEditing, explanation: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-2 block">الخيارات (حدّد الصحيح)</Label>
                  <div className="space-y-2">
                    {qEditing.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Checkbox
                          checked={opt.is_correct}
                          onCheckedChange={(v) => {
                            const next = [...qEditing.options];
                            next.forEach((o, i) => (o.is_correct = i === idx ? !!v : false));
                            setQEditing({ ...qEditing, options: next });
                          }}
                        />
                        <Input
                          value={opt.option_text}
                          onChange={(e) => {
                            const next = [...qEditing.options];
                            next[idx] = { ...next[idx], option_text: e.target.value };
                            setQEditing({ ...qEditing, options: next });
                          }}
                          placeholder={`خيار ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter><Button onClick={saveQuestion}>حفظ السؤال</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
