import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Loader2, Sparkles, FolderTree, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { QuestionBankService, type QCategory, type QSubject, type QQuestion, type Difficulty } from '@/services/questionBankService';

export default function AdminQuestionBank() {
  const [categories, setCategories] = useState<QCategory[]>([]);
  const [subjects, setSubjects] = useState<QSubject[]>([]);
  const [questions, setQuestions] = useState<QQuestion[]>([]);
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // نماذج
  const [catOpen, setCatOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [subOpen, setSubOpen] = useState(false);
  const [subForm, setSubForm] = useState({ category_id: '', name_ar: '' });
  const [qOpen, setQOpen] = useState(false);
  const [qForm, setQForm] = useState({
    subject_id: '', question_text: '', explanation: '', difficulty: 'medium' as Difficulty,
    choices: [{ text: '', correct: true }, { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }],
  });
  const [genOpen, setGenOpen] = useState(false);
  const [genForm, setGenForm] = useState({ subject_id: '', count: 10, difficulty: 'medium' as Difficulty });

  const refresh = async () => {
    setLoading(true);
    try {
      const [cats, subs, qs] = await Promise.all([
        QuestionBankService.listCategories(),
        QuestionBankService.listSubjects(),
        QuestionBankService.adminListAll({ subjectId: filterSubject !== 'all' ? filterSubject : undefined }),
      ]);
      setCategories(cats); setSubjects(subs); setQuestions(qs);
    } catch (e: any) { toast.error('تعذّر التحميل'); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, [filterSubject]);

  const submitCategory = async () => {
    if (!catName.trim()) return;
    setBusy(true);
    try { await QuestionBankService.adminCreateCategory({ name_ar: catName.trim() }); toast.success('تمت الإضافة'); setCatOpen(false); setCatName(''); refresh(); }
    catch (e: any) { toast.error(e?.message); } finally { setBusy(false); }
  };

  const submitSubject = async () => {
    if (!subForm.category_id || !subForm.name_ar.trim()) return;
    setBusy(true);
    try { await QuestionBankService.adminCreateSubject(subForm); toast.success('تمت الإضافة'); setSubOpen(false); setSubForm({ category_id: '', name_ar: '' }); refresh(); }
    catch (e: any) { toast.error(e?.message); } finally { setBusy(false); }
  };

  const submitQuestion = async () => {
    if (!qForm.subject_id || !qForm.question_text.trim()) { toast.error('املأ الحقول الأساسية'); return; }
    if (!qForm.choices.some((c) => c.correct)) { toast.error('اختر إجابة صحيحة'); return; }
    if (qForm.choices.filter((c) => c.text.trim()).length < 2) { toast.error('أدخل خيارين على الأقل'); return; }
    setBusy(true);
    try {
      await QuestionBankService.adminCreateQuestion({
        subject_id: qForm.subject_id, question_text: qForm.question_text, explanation: qForm.explanation,
        difficulty: qForm.difficulty,
        choices: qForm.choices.filter((c) => c.text.trim()).map((c) => ({ choice_text: c.text, is_correct: c.correct })),
      });
      toast.success('تمت إضافة السؤال');
      setQOpen(false);
      setQForm({ subject_id: '', question_text: '', explanation: '', difficulty: 'medium', choices: [{ text: '', correct: true }, { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }] });
      refresh();
    } catch (e: any) { toast.error(e?.message); } finally { setBusy(false); }
  };

  const handleGenerate = async () => {
    if (!genForm.subject_id) { toast.error('اختر مادة'); return; }
    setBusy(true);
    try {
      const r = await QuestionBankService.adminGenerateQuestions(genForm.subject_id, genForm.count, genForm.difficulty);
      if (r?.success) { toast.success(`تم توليد ${r.inserted} سؤال`); setGenOpen(false); refresh(); }
      else toast.error('تعذّر التوليد');
    } catch (e: any) { toast.error(e?.message || 'فشل التوليد'); }
    finally { setBusy(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try { await QuestionBankService.adminDeleteQuestion(id); toast.success('تم الحذف'); refresh(); }
    catch (e: any) { toast.error(e?.message); }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-7 h-7" /> إدارة بنك الأسئلة</h1>
        <div className="flex gap-2 flex-wrap">
          <Dialog open={catOpen} onOpenChange={setCatOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm"><FolderTree className="w-4 h-4 ml-1" /> تصنيف</Button></DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader><DialogTitle>تصنيف جديد</DialogTitle></DialogHeader>
              <Input placeholder="اسم التصنيف (مثال: الطب)" value={catName} onChange={(e) => setCatName(e.target.value)} />
              <DialogFooter><Button onClick={submitCategory} disabled={busy}>إضافة</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={subOpen} onOpenChange={setSubOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm"><Plus className="w-4 h-4 ml-1" /> مادة</Button></DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader><DialogTitle>مادة جديدة</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={subForm.category_id} onValueChange={(v) => setSubForm({ ...subForm, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر التصنيف" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name_ar}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="اسم المادة" value={subForm.name_ar} onChange={(e) => setSubForm({ ...subForm, name_ar: e.target.value })} />
              </div>
              <DialogFooter><Button onClick={submitSubject} disabled={busy}>إضافة</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={genOpen} onOpenChange={setGenOpen}>
            <DialogTrigger asChild><Button variant="secondary" size="sm"><Sparkles className="w-4 h-4 ml-1" /> توليد بـAI</Button></DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader><DialogTitle>توليد أسئلة بالذكاء الاصطناعي</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={genForm.subject_id} onValueChange={(v) => setGenForm({ ...genForm, subject_id: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر المادة" /></SelectTrigger>
                  <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name_ar}</SelectItem>)}</SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs text-muted-foreground">العدد</label>
                    <Input type="number" min={1} max={20} value={genForm.count} onChange={(e) => setGenForm({ ...genForm, count: Number(e.target.value) || 10 })} /></div>
                  <div><label className="text-xs text-muted-foreground">الصعوبة</label>
                    <Select value={genForm.difficulty} onValueChange={(v) => setGenForm({ ...genForm, difficulty: v as Difficulty })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="easy">سهل</SelectItem><SelectItem value="medium">متوسط</SelectItem><SelectItem value="hard">صعب</SelectItem></SelectContent>
                    </Select></div>
                </div>
                <p className="text-xs text-muted-foreground">سيتم توليد الأسئلة عبر Lovable AI ومراجعتها قبل النشر.</p>
              </div>
              <DialogFooter><Button onClick={handleGenerate} disabled={busy}>{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'توليد'}</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={qOpen} onOpenChange={setQOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 ml-1" /> سؤال</Button></DialogTrigger>
            <DialogContent dir="rtl" className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>سؤال جديد</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={qForm.subject_id} onValueChange={(v) => setQForm({ ...qForm, subject_id: v })}>
                  <SelectTrigger><SelectValue placeholder="المادة" /></SelectTrigger>
                  <SelectContent>{subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name_ar}</SelectItem>)}</SelectContent>
                </Select>
                <Textarea placeholder="نص السؤال" value={qForm.question_text} onChange={(e) => setQForm({ ...qForm, question_text: e.target.value })} rows={3} />
                <Select value={qForm.difficulty} onValueChange={(v) => setQForm({ ...qForm, difficulty: v as Difficulty })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="easy">سهل</SelectItem><SelectItem value="medium">متوسط</SelectItem><SelectItem value="hard">صعب</SelectItem></SelectContent>
                </Select>
                <div className="space-y-2">
                  <label className="text-xs font-medium">الخيارات (حدّد الإجابة الصحيحة)</label>
                  {qForm.choices.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="radio" name="correct" checked={c.correct} onChange={() => {
                        const newChoices = qForm.choices.map((x, j) => ({ ...x, correct: j === i }));
                        setQForm({ ...qForm, choices: newChoices });
                      }} />
                      <Input placeholder={`الخيار ${i + 1}`} value={c.text} onChange={(e) => {
                        const newChoices = [...qForm.choices]; newChoices[i] = { ...newChoices[i], text: e.target.value };
                        setQForm({ ...qForm, choices: newChoices });
                      }} />
                    </div>
                  ))}
                </div>
                <Textarea placeholder="الشرح (اختياري)" value={qForm.explanation} onChange={(e) => setQForm({ ...qForm, explanation: e.target.value })} rows={2} />
              </div>
              <DialogFooter><Button onClick={submitQuestion} disabled={busy}>إضافة السؤال</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">الأسئلة ({questions.length})</CardTitle>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل المواد</SelectItem>
                {subjects.map((s) => <SelectItem key={s.id} value={s.id}>{s.name_ar}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          : questions.length === 0 ? <p className="text-center text-muted-foreground py-8">لا توجد أسئلة بعد</p>
          : (
            <div className="space-y-2">
              {questions.map((q) => (
                <div key={q.id} className="border rounded-lg p-3 flex items-start justify-between gap-3 hover:bg-muted/40">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{q.question_text}</p>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      <Badge variant="outline" className="text-xs">{q.difficulty}</Badge>
                      <Badge variant="secondary" className="text-xs">{q.choices.length} خيارات</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(q.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
