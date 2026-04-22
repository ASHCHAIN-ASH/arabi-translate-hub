import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import {
  Plus, Pencil, Trash2, Loader2, Swords, ChevronDown, ChevronUp,
  ShieldAlert, Trophy, Clock, CheckCircle2, XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

// ---------- Types ----------
type Mode = 'daily' | 'sprint' | 'ranked' | 'practice';
type RoomStatus = 'draft' | 'scheduled' | 'active' | 'locked' | 'completed' | 'archived';
type Difficulty = 'easy' | 'medium' | 'hard';
type AntiCheat = 'logic' | 'case' | 'scenario' | 'visual_hint' | 'speed';

interface Room {
  id: string;
  title: string;
  description: string | null;
  mode: Mode;
  category: string;
  status: RoomStatus;
  cover_emoji: string | null;
  question_count: number;
  time_limit_per_question: number;
  xp_per_correct: number;
  xp_completion_bonus: number;
  xp_top_bonus: number;
  is_reward_eligible: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

interface Choice {
  id: string;
  question_id: string;
  choice_text: string;
  is_correct: boolean;
  order_index: number;
}
interface Question {
  id: string;
  room_id: string;
  question_text: string;
  difficulty: Difficulty;
  anti_cheat_type: AntiCheat;
  time_limit_seconds: number;
  order_index: number;
  explanation: string | null;
  choices: Choice[];
}

interface FlagRow {
  id: string;
  attempt_id: string | null;
  user_id: string;
  flag_type: string;
  flag_reason: string | null;
  risk_score: number;
  metadata: any;
  created_at: string;
}
interface AttemptRow {
  id: string;
  room_id: string;
  user_id: string;
  status: string;
  score: number;
  correct_count: number;
  total_questions: number;
  total_time_ms: number;
  suspicious_score: number;
  xp_earned: number;
  completed_at: string | null;
  created_at: string;
}

const MODES: { value: Mode; label: string }[] = [
  { value: 'daily', label: 'تحدي يومي' },
  { value: 'sprint', label: 'سبرنت سريع' },
  { value: 'ranked', label: 'تصنيفي' },
  { value: 'practice', label: 'تدريب' },
];
const STATUSES: { value: RoomStatus; label: string }[] = [
  { value: 'draft', label: 'مسودة' },
  { value: 'scheduled', label: 'مجدولة' },
  { value: 'active', label: 'نشطة' },
  { value: 'locked', label: 'مغلقة' },
  { value: 'completed', label: 'مكتملة' },
  { value: 'archived', label: 'مؤرشفة' },
];
const CATEGORIES = ['general', 'academic', 'medical', 'tech', 'marketing', 'legal'];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const ANTICHEATS: AntiCheat[] = ['logic', 'case', 'scenario', 'visual_hint', 'speed'];

// ---------- Component ----------
export default function AdminBattleQuiz() {
  const [tab, setTab] = useState<'rooms' | 'flags'>('rooms');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [roomOpen, setRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [qOpen, setQOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<Question | null>(null);

  const [flags, setFlags] = useState<FlagRow[]>([]);
  const [attempts, setAttempts] = useState<Record<string, AttemptRow>>({});

  // ---- Load rooms ----
  const refresh = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('battle_quiz_rooms')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    setRooms((data || []) as Room[]);
    setLoading(false);
  };

  const loadFlags = async () => {
    const { data, error } = await (supabase as any)
      .from('battle_quiz_flags')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) { toast.error(error.message); return; }
    const rows = (data || []) as FlagRow[];
    setFlags(rows);
    const ids = Array.from(new Set(rows.map(r => r.attempt_id).filter(Boolean))) as string[];
    if (ids.length) {
      const { data: atts } = await (supabase as any)
        .from('battle_quiz_attempts').select('*').in('id', ids);
      const map: Record<string, AttemptRow> = {};
      (atts || []).forEach((a: any) => { map[a.id] = a; });
      setAttempts(map);
    } else {
      setAttempts({});
    }
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => { if (tab === 'flags') loadFlags(); }, [tab]);

  const loadQuestions = async (roomId: string) => {
    const { data, error } = await (supabase as any)
      .from('battle_quiz_questions')
      .select('*, choices:battle_quiz_choices(*)')
      .eq('room_id', roomId)
      .order('order_index');
    if (error) { toast.error(error.message); return; }
    const sorted = ((data || []) as any[]).map((q) => ({
      ...q,
      choices: (q.choices || []).sort((a: any, b: any) => a.order_index - b.order_index),
    })) as Question[];
    setQuestions(sorted);
  };

  const toggleExpand = async (id: string) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    await loadQuestions(id);
  };

  // ---- Room CRUD ----
  const newRoom = (): Room => ({
    id: '',
    title: '',
    description: '',
    mode: 'daily',
    category: 'general',
    status: 'draft',
    cover_emoji: '⚔️',
    question_count: 10,
    time_limit_per_question: 20,
    xp_per_correct: 5,
    xp_completion_bonus: 20,
    xp_top_bonus: 50,
    is_reward_eligible: true,
    starts_at: null,
    ends_at: null,
    created_at: new Date().toISOString(),
  });

  const saveRoom = async () => {
    if (!editingRoom) return;
    if (!editingRoom.title.trim()) { toast.error('العنوان مطلوب'); return; }
    const payload: any = { ...editingRoom };
    delete payload.created_at;
    if (!editingRoom.id) delete payload.id;
    if (editingRoom.id) {
      const { error } = await (supabase as any)
        .from('battle_quiz_rooms').update(payload).eq('id', editingRoom.id);
      if (error) return toast.error(error.message);
    } else {
      delete payload.id;
      const { error } = await (supabase as any).from('battle_quiz_rooms').insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success('تم الحفظ');
    setRoomOpen(false); setEditingRoom(null); await refresh();
  };

  const deleteRoom = async (id: string) => {
    if (!confirm('حذف الغرفة وكل أسئلتها ومحاولاتها؟')) return;
    const { error } = await (supabase as any).from('battle_quiz_rooms').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('تم الحذف'); await refresh();
  };

  // ---- Question CRUD ----
  const newQuestion = (roomId: string): Question => ({
    id: '',
    room_id: roomId,
    question_text: '',
    difficulty: 'medium',
    anti_cheat_type: 'logic',
    time_limit_seconds: 20,
    order_index: questions.length + 1,
    explanation: '',
    choices: [
      { id: '', question_id: '', choice_text: '', is_correct: true, order_index: 1 },
      { id: '', question_id: '', choice_text: '', is_correct: false, order_index: 2 },
      { id: '', question_id: '', choice_text: '', is_correct: false, order_index: 3 },
      { id: '', question_id: '', choice_text: '', is_correct: false, order_index: 4 },
    ],
  });

  const saveQuestion = async () => {
    if (!editingQ) return;
    if (!editingQ.question_text.trim()) { toast.error('نص السؤال مطلوب'); return; }
    const valid = editingQ.choices.filter((c) => c.choice_text.trim());
    if (valid.length < 2) { toast.error('خياران على الأقل'); return; }
    if (!valid.some((c) => c.is_correct)) { toast.error('حدّد إجابة صحيحة'); return; }

    let qid = editingQ.id;
    const qPayload = {
      room_id: editingQ.room_id,
      question_text: editingQ.question_text,
      difficulty: editingQ.difficulty,
      anti_cheat_type: editingQ.anti_cheat_type,
      time_limit_seconds: editingQ.time_limit_seconds,
      order_index: editingQ.order_index,
      explanation: editingQ.explanation || null,
    };

    if (qid) {
      const { error } = await (supabase as any)
        .from('battle_quiz_questions').update(qPayload).eq('id', qid);
      if (error) return toast.error(error.message);
      await (supabase as any).from('battle_quiz_choices').delete().eq('question_id', qid);
    } else {
      const { data, error } = await (supabase as any)
        .from('battle_quiz_questions').insert(qPayload).select().single();
      if (error) return toast.error(error.message);
      qid = data.id;
    }

    const choicesPayload = valid.map((c, i) => ({
      question_id: qid,
      choice_text: c.choice_text,
      is_correct: c.is_correct,
      order_index: i + 1,
    }));
    const { error: cErr } = await (supabase as any)
      .from('battle_quiz_choices').insert(choicesPayload);
    if (cErr) return toast.error(cErr.message);

    toast.success('تم الحفظ');
    setQOpen(false); setEditingQ(null);
    await loadQuestions(editingQ.room_id);
  };

  const deleteQuestion = async (q: Question) => {
    if (!confirm('حذف السؤال؟')) return;
    const { error } = await (supabase as any)
      .from('battle_quiz_questions').delete().eq('id', q.id);
    if (error) return toast.error(error.message);
    toast.success('تم الحذف'); await loadQuestions(q.room_id);
  };

  // ---- Flag actions ----
  const invalidateAttempt = async (attemptId: string) => {
    if (!confirm('إبطال هذه المحاولة وحجب جوائزها؟')) return;
    const { error } = await (supabase as any)
      .from('battle_quiz_attempts')
      .update({ status: 'invalidated', xp_earned: 0, reward_amount: 0 })
      .eq('id', attemptId);
    if (error) return toast.error(error.message);
    toast.success('تم الإبطال'); await loadFlags();
  };
  const approveAttempt = async (attemptId: string) => {
    const { error } = await (supabase as any)
      .from('battle_quiz_attempts').update({ status: 'completed' }).eq('id', attemptId);
    if (error) return toast.error(error.message);
    toast.success('تم اعتماد المحاولة'); await loadFlags();
  };

  const totalQuestions = useMemo(
    () => rooms.reduce((s, r) => s + (r.question_count || 0), 0),
    [rooms],
  );

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Swords className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Battle Quiz Arena</h1>
              <p className="text-sm text-muted-foreground">إدارة الغرف والأسئلة ومراجعة الغش</p>
            </div>
          </div>
          <Button onClick={() => { setEditingRoom(newRoom()); setRoomOpen(true); }}>
            <Plus className="h-4 w-4 ml-2" /> غرفة جديدة
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={<Swords className="h-4 w-4" />} label="إجمالي الغرف" value={rooms.length} />
          <StatCard icon={<Trophy className="h-4 w-4" />} label="نشطة" value={rooms.filter(r => r.status === 'active').length} />
          <StatCard icon={<Clock className="h-4 w-4" />} label="إجمالي الأسئلة المتوقع" value={totalQuestions} />
          <StatCard icon={<ShieldAlert className="h-4 w-4" />} label="بلاغات الغش" value={flags.length} />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="rooms">الغرف والأسئلة</TabsTrigger>
            <TabsTrigger value="flags">المحاولات المشبوهة</TabsTrigger>
          </TabsList>

          {/* ------ ROOMS ------ */}
          <TabsContent value="rooms" className="space-y-3">
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : rooms.length === 0 ? (
              <Card><CardContent className="p-12 text-center text-muted-foreground">لا توجد غرف بعد</CardContent></Card>
            ) : (
              rooms.map((r) => (
                <Card key={r.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{r.cover_emoji || '⚔️'}</div>
                        <div>
                          <CardTitle className="text-lg">{r.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline">{MODES.find(m => m.value === r.mode)?.label}</Badge>
                            <Badge variant="secondary">{r.category}</Badge>
                            <Badge variant={r.status === 'active' ? 'default' : 'outline'}>
                              {STATUSES.find(s => s.value === r.status)?.label}
                            </Badge>
                            {r.is_reward_eligible && <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200">مؤهلة للجوائز</Badge>}
                          </div>
                          {r.description && <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{r.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => toggleExpand(r.id)}>
                          {expandedId === r.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          الأسئلة
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingRoom(r); setRoomOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => deleteRoom(r.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Meta row */}
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-muted-foreground border-t pt-3">
                      <Meta label="عدد الأسئلة" value={r.question_count} />
                      <Meta label="وقت السؤال" value={`${r.time_limit_per_question}ث`} />
                      <Meta label="XP/صحيحة" value={r.xp_per_correct} />
                      <Meta label="XP إنهاء" value={r.xp_completion_bonus} />
                      <Meta label="XP Top" value={r.xp_top_bonus} />
                    </div>

                    {expandedId === r.id && (
                      <div className="mt-4 border-t pt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">الأسئلة ({questions.length})</h4>
                          <Button size="sm" onClick={() => { setEditingQ(newQuestion(r.id)); setQOpen(true); }}>
                            <Plus className="h-4 w-4 ml-1" /> سؤال
                          </Button>
                        </div>
                        {questions.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">لا توجد أسئلة</p>
                        ) : (
                          questions.map((q, i) => (
                            <div key={q.id} className="border rounded-lg p-3 bg-muted/20">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs">#{i + 1}</Badge>
                                    <Badge variant="secondary" className="text-xs">{q.difficulty}</Badge>
                                    <Badge variant="outline" className="text-xs">{q.anti_cheat_type}</Badge>
                                    <span className="text-xs text-muted-foreground">{q.time_limit_seconds}ث</span>
                                  </div>
                                  <p className="text-sm">{q.question_text}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                                    {q.choices.map((c) => (
                                      <div key={c.id} className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${c.is_correct ? 'bg-emerald-500/10 text-emerald-700' : 'bg-background'}`}>
                                        {c.is_correct && <CheckCircle2 className="h-3 w-3" />}
                                        {c.choice_text}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => { setEditingQ(q); setQOpen(true); }}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteQuestion(q)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* ------ FLAGS ------ */}
          <TabsContent value="flags" className="space-y-3">
            {flags.length === 0 ? (
              <Card><CardContent className="p-12 text-center text-muted-foreground">لا توجد بلاغات حتى الآن</CardContent></Card>
            ) : (
              flags.map((f) => {
                const att = f.attempt_id ? attempts[f.attempt_id] : null;
                return (
                  <Card key={f.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-[260px]">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="destructive" className="text-xs">{f.flag_type}</Badge>
                            <Badge variant="outline" className="text-xs">risk: {f.risk_score}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleString('ar')}</span>
                          </div>
                          {f.flag_reason && <p className="text-sm mb-1">{f.flag_reason}</p>}
                          <p className="text-xs text-muted-foreground">المستخدم: <span className="font-mono">{f.user_id.slice(0, 8)}…</span></p>
                          {att && (
                            <div className="mt-2 text-xs grid grid-cols-2 md:grid-cols-4 gap-2">
                              <Meta label="الحالة" value={att.status} />
                              <Meta label="النقاط" value={att.score} />
                              <Meta label="صحيحة" value={`${att.correct_count}/${att.total_questions}`} />
                              <Meta label="الزمن" value={`${(att.total_time_ms / 1000).toFixed(1)}ث`} />
                            </div>
                          )}
                        </div>
                        {f.attempt_id && att?.status !== 'invalidated' && (
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline" onClick={() => approveAttempt(f.attempt_id!)}>
                              <CheckCircle2 className="h-4 w-4 ml-1" /> اعتماد
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => invalidateAttempt(f.attempt_id!)}>
                              <XCircle className="h-4 w-4 ml-1" /> إبطال
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== Room Dialog ===== */}
      <Dialog open={roomOpen} onOpenChange={setRoomOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingRoom?.id ? 'تعديل غرفة' : 'غرفة جديدة'}</DialogTitle>
          </DialogHeader>
          {editingRoom && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="العنوان">
                  <Input value={editingRoom.title} onChange={(e) => setEditingRoom({ ...editingRoom, title: e.target.value })} />
                </Field>
                <Field label="الإيموجي">
                  <Input value={editingRoom.cover_emoji || ''} onChange={(e) => setEditingRoom({ ...editingRoom, cover_emoji: e.target.value })} />
                </Field>
              </div>
              <Field label="الوصف">
                <Textarea rows={2} value={editingRoom.description || ''} onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })} />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="الوضع">
                  <Select value={editingRoom.mode} onValueChange={(v) => setEditingRoom({ ...editingRoom, mode: v as Mode })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{MODES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="الفئة">
                  <Select value={editingRoom.category} onValueChange={(v) => setEditingRoom({ ...editingRoom, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="الحالة">
                  <Select value={editingRoom.status} onValueChange={(v) => setEditingRoom({ ...editingRoom, status: v as RoomStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Field label="عدد الأسئلة">
                  <Input type="number" value={editingRoom.question_count} onChange={(e) => setEditingRoom({ ...editingRoom, question_count: +e.target.value })} />
                </Field>
                <Field label="وقت/سؤال (ث)">
                  <Input type="number" value={editingRoom.time_limit_per_question} onChange={(e) => setEditingRoom({ ...editingRoom, time_limit_per_question: +e.target.value })} />
                </Field>
                <Field label="XP/صحيحة">
                  <Input type="number" value={editingRoom.xp_per_correct} onChange={(e) => setEditingRoom({ ...editingRoom, xp_per_correct: +e.target.value })} />
                </Field>
                <Field label="XP إنهاء">
                  <Input type="number" value={editingRoom.xp_completion_bonus} onChange={(e) => setEditingRoom({ ...editingRoom, xp_completion_bonus: +e.target.value })} />
                </Field>
                <Field label="XP Top">
                  <Input type="number" value={editingRoom.xp_top_bonus} onChange={(e) => setEditingRoom({ ...editingRoom, xp_top_bonus: +e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="بداية (ISO)">
                  <Input type="datetime-local" value={editingRoom.starts_at ? editingRoom.starts_at.slice(0, 16) : ''} onChange={(e) => setEditingRoom({ ...editingRoom, starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                </Field>
                <Field label="نهاية (ISO)">
                  <Input type="datetime-local" value={editingRoom.ends_at ? editingRoom.ends_at.slice(0, 16) : ''} onChange={(e) => setEditingRoom({ ...editingRoom, ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                </Field>
              </div>
              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <Label>مؤهلة للجوائز</Label>
                  <p className="text-xs text-muted-foreground">يحدد إن كانت المحاولات تُحتسب في Leaderboard التنافسي</p>
                </div>
                <Switch checked={editingRoom.is_reward_eligible} onCheckedChange={(v) => setEditingRoom({ ...editingRoom, is_reward_eligible: v })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomOpen(false)}>إلغاء</Button>
            <Button onClick={saveRoom}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Question Dialog ===== */}
      <Dialog open={qOpen} onOpenChange={setQOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingQ?.id ? 'تعديل سؤال' : 'سؤال جديد'}</DialogTitle>
          </DialogHeader>
          {editingQ && (
            <div className="space-y-4">
              <Field label="نص السؤال">
                <Textarea rows={3} value={editingQ.question_text} onChange={(e) => setEditingQ({ ...editingQ, question_text: e.target.value })} />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="الصعوبة">
                  <Select value={editingQ.difficulty} onValueChange={(v) => setEditingQ({ ...editingQ, difficulty: v as Difficulty })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="نوع Anti-Cheat">
                  <Select value={editingQ.anti_cheat_type} onValueChange={(v) => setEditingQ({ ...editingQ, anti_cheat_type: v as AntiCheat })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{ANTICHEATS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
                <Field label="الوقت (ث)">
                  <Input type="number" value={editingQ.time_limit_seconds} onChange={(e) => setEditingQ({ ...editingQ, time_limit_seconds: +e.target.value })} />
                </Field>
              </div>
              <Field label="الشرح (اختياري)">
                <Textarea rows={2} value={editingQ.explanation || ''} onChange={(e) => setEditingQ({ ...editingQ, explanation: e.target.value })} />
              </Field>

              <div className="space-y-2">
                <Label>الخيارات</Label>
                {editingQ.choices.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder={`الخيار ${i + 1}`}
                      value={c.choice_text}
                      onChange={(e) => {
                        const next = [...editingQ.choices];
                        next[i] = { ...c, choice_text: e.target.value };
                        setEditingQ({ ...editingQ, choices: next });
                      }}
                    />
                    <Button
                      type="button"
                      variant={c.is_correct ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const next = editingQ.choices.map((x, idx) => ({ ...x, is_correct: idx === i }));
                        setEditingQ({ ...editingQ, choices: next });
                      }}
                    >
                      {c.is_correct ? '✓ صحيحة' : 'تعيين صحيحة'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setQOpen(false)}>إلغاء</Button>
            <Button onClick={saveQuestion}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

// ---- Helpers ----
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
function Meta({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
