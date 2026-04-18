import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  ArrowRight, Loader2, Sparkles, Construction, Gift, Crown,
  Copy, Download, Check, Wand2, BookOpen, Stethoscope, ListChecks,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
// PDF: نولّده عبر نافذة طباعة المتصفح لدعم العربية و RTL بشكل كامل
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ClientLayout from '@/components/client/ClientLayout';
import { supabase } from '@/integrations/supabase/client';
import type { TrackTool, Track } from '@/hooks/useTracks';

type ToolKey = 'medical-summarizer' | 'med-terms' | 'case-analyzer' | 'med-quiz';

export default function TrackToolPage() {
  const { trackSlug, toolSlug } = useParams<{ trackSlug: string; toolSlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<TrackTool | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    (async () => {
      if (!trackSlug || !toolSlug) return;
      setLoading(true);
      const { data: t } = await (supabase as any)
        .from('tracks').select('*').eq('slug', trackSlug).maybeSingle();
      if (t) {
        setTrack(t as Track);
        const { data: tl } = await (supabase as any)
          .from('track_tools').select('*')
          .eq('track_id', (t as any).id).eq('slug', toolSlug).eq('is_active', true)
          .maybeSingle();
        setTool(tl as TrackTool);
      }
      setLoading(false);
    })();
  }, [trackSlug, toolSlug]);

  const getIcon = (name?: string) => (Icons as any)[name || ''] || Icons.Sparkles;

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ClientLayout>
    );
  }

  if (!tool || !track) {
    return (
      <ClientLayout>
        <div dir="rtl" className="container mx-auto px-4 py-12 text-center max-w-2xl">
          <Card>
            <CardContent className="p-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
                <Construction className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold">الأداة غير متاحة</h2>
              <p className="text-muted-foreground">
                لم نتمكن من العثور على هذه الأداة، أو ربما تم تعطيلها مؤقتًا.
              </p>
              <Button onClick={() => navigate(`/student/tracks/${trackSlug || ''}`)} className="gap-2">
                <ArrowRight className="w-4 h-4" /> العودة للمسار
              </Button>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  const Icon = getIcon(tool.icon);
  const toolKey = tool.slug as ToolKey;

  return (
    <ClientLayout>
      <div dir="rtl" className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" size="sm" className="mb-6 gap-2" onClick={() => navigate(`/student/tracks/${trackSlug}`)}>
          <ArrowRight className="w-4 h-4" />
          العودة لـ {track.name_ar}
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-l ${(track as any).color || 'from-primary to-primary/70'} p-8 mb-6 text-white shadow-xl`}
        >
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="bg-white/20 text-white border-white/30">{track.name_ar}</Badge>
                {tool.is_premium && (
                  <Badge className="bg-amber-500/90 text-white gap-1">
                    <Crown className="w-3 h-3" /> بريميوم
                  </Badge>
                )}
                {Number(tool.price) === 0 && (
                  <Badge className="bg-emerald-500/90 text-white gap-1">
                    <Gift className="w-3 h-3" /> مجاني
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{tool.name_ar}</h1>
              <p className="text-white/90">{tool.description_ar}</p>
            </div>
          </div>
        </motion.div>

        {toolKey === 'medical-summarizer' && <SummarizerRunner tool={tool} />}
        {toolKey === 'med-terms' && <TermsRunner tool={tool} />}
        {toolKey === 'case-analyzer' && <CaseAnalyzerRunner tool={tool} />}
        {toolKey === 'med-quiz' && <QuizRunner tool={tool} />}
        {!['medical-summarizer','med-terms','case-analyzer','med-quiz'].includes(toolKey) && (
          <Card>
            <CardContent className="p-12 text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold">واجهة الأداة قيد الإعداد</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                هذه الأداة ستكون متاحة قريبًا. جرّب باقي الأدوات في المسار في هذه الأثناء.
              </p>
              <Button onClick={() => navigate(`/student/tracks/${trackSlug}`)} className="gap-2">
                <ArrowRight className="w-4 h-4" /> أدوات المسار
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Shared output panel (markdown + copy + download PDF)
// ────────────────────────────────────────────────────────────────────────────
function ResultPanel({ title, content }: { title: string; content: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({ title: '✅ تم النسخ' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'تعذّر النسخ', variant: 'destructive' });
    }
  };

  const handlePdf = () => {
    try {
      // نستخدم نافذة طباعة المتصفح — تدعم العربية و RTL وأي خط بشكل كامل
      // Markdown → HTML بسيط
      const escapeHtml = (s: string) =>
        s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const mdToHtml = (md: string) => {
        const lines = md.split('\n');
        const out: string[] = [];
        let inList = false;
        const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };
        for (const raw of lines) {
          const line = raw.trimEnd();
          if (/^##\s+/.test(line))      { closeList(); out.push(`<h2>${escapeHtml(line.replace(/^##\s+/, ''))}</h2>`); }
          else if (/^#\s+/.test(line))  { closeList(); out.push(`<h1>${escapeHtml(line.replace(/^#\s+/, ''))}</h1>`); }
          else if (/^[-*]\s+/.test(line)) {
            if (!inList) { out.push('<ul>'); inList = true; }
            out.push(`<li>${escapeHtml(line.replace(/^[-*]\s+/, ''))}</li>`);
          } else if (/^\d+\.\s+/.test(line)) {
            closeList();
            out.push(`<p>${escapeHtml(line)}</p>`);
          } else if (line === '') { closeList(); out.push(''); }
          else { closeList(); out.push(`<p>${escapeHtml(line)}</p>`); }
        }
        closeList();
        return out.join('\n')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>');
      };

      const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  html, body {
    font-family: 'IBM Plex Sans Arabic', system-ui, -apple-system, sans-serif;
    direction: rtl; text-align: right;
    color: #0f172a; background: #fff;
    margin: 0; padding: 0;
  }
  .wrap { padding: 32px 40px; line-height: 1.85; font-size: 13pt; }
  h1.doc-title {
    font-size: 22pt; margin: 0 0 6px; color: #0f172a;
    border-bottom: 3px solid #2563eb; padding-bottom: 10px;
  }
  .meta { color: #64748b; font-size: 10pt; margin-bottom: 24px; }
  h1 { font-size: 18pt; margin: 22px 0 8px; color: #1e3a8a; }
  h2 { font-size: 15pt; margin: 20px 0 8px; color: #1e40af;
       border-right: 4px solid #2563eb; padding-right: 10px; }
  p  { margin: 6px 0; }
  ul { padding-right: 22px; padding-left: 0; margin: 6px 0; }
  li { margin: 4px 0; }
  strong { color: #0f172a; }
  @page { size: A4; margin: 18mm; }
  @media print { .no-print { display: none; } }
  .no-print {
    position: fixed; top: 12px; left: 12px;
    background: #2563eb; color: #fff; border: 0;
    padding: 10px 18px; border-radius: 8px;
    font-family: inherit; font-size: 11pt; cursor: pointer;
  }
</style>
</head>
<body>
<button class="no-print" onclick="window.print()">🖨️ طباعة / حفظ PDF</button>
<div class="wrap">
  <h1 class="doc-title">${escapeHtml(title)}</h1>
  <div class="meta">${new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
  ${mdToHtml(content)}
</div>
<script>
  // ننتظر تحميل الخط ثم نفتح نافذة الطباعة تلقائياً
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => setTimeout(() => window.print(), 300));
  } else {
    setTimeout(() => window.print(), 700);
  }
</script>
</body>
</html>`;

      const w = window.open('', '_blank');
      if (!w) {
        toast({ title: 'فضلاً اسمح بالنوافذ المنبثقة', variant: 'destructive' });
        return;
      }
      w.document.open();
      w.document.write(html);
      w.document.close();
      toast({ title: '📄 جاهز للطباعة / الحفظ كـ PDF' });
    } catch (e) {
      toast({ title: 'تعذّر إنشاء PDF', variant: 'destructive' });
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-bold text-lg">📋 النتيجة</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'تم' : 'نسخ'}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePdf} className="gap-2">
              <Download className="w-4 h-4" /> PDF
            </Button>
          </div>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none rtl text-right leading-relaxed">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tool 1: Summarizer
// ────────────────────────────────────────────────────────────────────────────
function SummarizerRunner({ tool }: { tool: TrackTool }) {
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState('');

  const run = async () => {
    if (text.trim().length < 50) {
      toast({ title: 'النص قصير جداً (50 حرفاً على الأقل)', variant: 'destructive' });
      return;
    }
    setRunning(true);
    setResult('');
    try {
      const { data: rpc, error: rpcErr } = await (supabase as any)
        .rpc('use_track_tool', { _tool_id: tool.id });
      if (rpcErr) throw new Error(rpcErr.message);
      if (!rpc?.ok) throw new Error('تعذّر بدء الاستخدام');

      const { data, error } = await supabase.functions.invoke('medical-summarizer', { body: { text } });
      if (error) throw new Error(error.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult((data as any).summary || '');
      toast({ title: '✅ تم التلخيص بنجاح' });
    } catch (e: any) {
      toast({ title: e?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-6 space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-primary" /> النص الطبي المراد تلخيصه
          </Label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="الصق هنا نص البحث أو المقال الطبي (50 حرفاً على الأقل، حتى 15000 حرف)..."
            className="min-h-[240px] text-base leading-relaxed"
            disabled={running}
          />
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">{text.length.toLocaleString('ar-SA')} حرف</span>
            <Button onClick={run} disabled={running || text.trim().length < 50} size="lg" className="gap-2">
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {running ? 'جاري التلخيص...' : 'لخّص الآن'}
            </Button>
          </div>
        </CardContent>
      </Card>
      {result && <ResultPanel title={`ملخص — ${tool.name_ar}`} content={result} />}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tool 2: Medical Terms
// ────────────────────────────────────────────────────────────────────────────
function TermsRunner({ tool }: { tool: TrackTool }) {
  const { toast } = useToast();
  const [term, setTerm] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState('');

  const run = async () => {
    if (term.trim().length < 2) {
      toast({ title: 'أدخل مصطلحاً صحيحاً', variant: 'destructive' });
      return;
    }
    setRunning(true);
    setResult('');
    try {
      const { data: rpc, error: rpcErr } = await (supabase as any)
        .rpc('use_track_tool', { _tool_id: tool.id });
      if (rpcErr) throw new Error(rpcErr.message);
      if (!rpc?.ok) throw new Error('تعذّر بدء الاستخدام');

      const { data, error } = await supabase.functions.invoke('medical-terms', { body: { term } });
      if (error) throw new Error(error.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult((data as any).explanation || '');
      toast({ title: '✅ تم الشرح بنجاح' });
    } catch (e: any) {
      toast({ title: e?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-6 space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> المصطلح الطبي
          </Label>
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !running) run(); }}
            placeholder="مثال: Hypertension أو ارتفاع ضغط الدم"
            className="text-base h-12"
            disabled={running}
          />
          <div className="flex items-center justify-end">
            <Button onClick={run} disabled={running || term.trim().length < 2} size="lg" className="gap-2">
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {running ? 'جاري الشرح...' : 'اشرح المصطلح'}
            </Button>
          </div>
        </CardContent>
      </Card>
      {result && <ResultPanel title={`شرح — ${term}`} content={result} />}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tool 3: Clinical Case Analyzer
// ────────────────────────────────────────────────────────────────────────────
function CaseAnalyzerRunner({ tool }: { tool: TrackTool }) {
  const { toast } = useToast();
  const [caseText, setCaseText] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'standard' | 'pro'>('standard');

  const proPrice = Number((tool as any)?.metadata?.pro_price ?? 0);
  const standardPrice = Number((tool as any)?.price ?? 0);
  const hasPro = proPrice > 0;

  const run = async () => {
    if (caseText.trim().length < 50) {
      toast({ title: 'وصف الحالة قصير جداً', variant: 'destructive' });
      return;
    }
    setRunning(true);
    setResult('');
    try {
      const { data: rpc, error: rpcErr } = await (supabase as any)
        .rpc('use_track_tool', { _tool_id: tool.id, _mode: mode });
      if (rpcErr) throw new Error(rpcErr.message);
      if (!rpc?.ok) throw new Error('تعذّر بدء الاستخدام');

      const { data, error } = await supabase.functions.invoke('clinical-case-analyzer', { body: { caseText, mode } });
      if (error) throw new Error(error.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      setResult((data as any).analysis || '');
      toast({
        title: mode === 'pro' ? '✅ تم التحليل المتقدم بنجاح' : '✅ تم التحليل بنجاح',
        description: rpc.was_free ? 'استخدمت طلباً مجانياً' : `تم خصم ${rpc.charged} ر.س`,
      });
    } catch (e: any) {
      toast({ title: e?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-6 space-y-4">
          {hasPro && (
            <div className="space-y-2">
              <Label className="text-base font-semibold">اختر مستوى التحليل</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('standard')}
                  className={`text-right p-4 rounded-lg border-2 transition-all ${
                    mode === 'standard'
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50'
                  }`}
                  disabled={running}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">⚡ تحليل قياسي</span>
                    <span className="text-sm font-semibold text-primary">
                      {standardPrice > 0 ? `${standardPrice} ر.س` : 'مجاني'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    سريع ودقيق — مناسب لمعظم الحالات التعليمية الكلاسيكية
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('pro')}
                  className={`text-right p-4 rounded-lg border-2 transition-all ${
                    mode === 'pro'
                      ? 'border-amber-500 bg-amber-500/5 shadow-sm'
                      : 'border-border hover:border-amber-500/50'
                  }`}
                  disabled={running}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1">
                      💎 تحليل متقدم <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">Pro</span>
                    </span>
                    <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                      {proPrice} ر.س
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    تحليل عميق بنموذج متقدم — للحالات المعقدة والأمراض النادرة
                  </p>
                </button>
              </div>
            </div>
          )}

          <Label className="text-base font-semibold flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-primary" /> وصف الحالة السريرية
          </Label>
          <Textarea
            value={caseText}
            onChange={(e) => setCaseText(e.target.value)}
            placeholder="مثال: مريض ذكر، 45 سنة، يشكو من ألم صدري ضاغط منذ ساعتين، يمتد للذراع الأيسر، مع تعرّق وغثيان..."
            className="min-h-[260px] text-base leading-relaxed"
            disabled={running}
          />
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">{caseText.length.toLocaleString('ar-SA')} حرف</span>
            <Button onClick={run} disabled={running || caseText.trim().length < 50} size="lg" className="gap-2">
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {running ? 'جاري التحليل...' : mode === 'pro' ? `حلّل بالوضع المتقدم (${proPrice} ر.س)` : 'حلّل الحالة'}
            </Button>
          </div>
        </CardContent>
      </Card>
      {result && <ResultPanel title={mode === 'pro' ? 'تحليل سريري متقدم 💎' : 'تحليل سريري'} content={result} />}
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Tool 4: Quiz Generator
// ────────────────────────────────────────────────────────────────────────────
type QuizQ = { question: string; options: string[]; correct_index: number; explanation: string };

function QuizRunner({ tool }: { tool: TrackTool }) {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('medium');
  const [running, setRunning] = useState(false);
  const [quiz, setQuiz] = useState<QuizQ[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState(false);

  const run = async () => {
    if (topic.trim().length < 2) {
      toast({ title: 'أدخل موضوعاً للاختبار', variant: 'destructive' });
      return;
    }
    setRunning(true);
    setQuiz([]);
    setAnswers({});
    setRevealed(false);
    try {
      const { data: rpc, error: rpcErr } = await (supabase as any)
        .rpc('use_track_tool', { _tool_id: tool.id });
      if (rpcErr) throw new Error(rpcErr.message);
      if (!rpc?.ok) throw new Error('تعذّر بدء الاستخدام');

      const { data, error } = await supabase.functions.invoke('medical-quiz-generator', {
        body: { topic, count, difficulty },
      });
      if (error) throw new Error(error.message);
      if ((data as any)?.error) throw new Error((data as any).error);
      setQuiz(((data as any).quiz || []) as QuizQ[]);
      toast({ title: '✅ جاهز! ابدأ الاختبار' });
    } catch (e: any) {
      toast({ title: e?.message || 'حدث خطأ', variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  const score = quiz.length === 0 ? 0
    : quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct_index ? 1 : 0), 0);

  return (
    <>
      <Card>
        <CardContent className="p-6 space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-primary" /> موضوع الاختبار
          </Label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="مثال: علم الأدوية – مضادات الالتهاب"
            className="text-base h-12"
            disabled={running}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-2 block">عدد الأسئلة</Label>
              <Select value={String(count)} onValueChange={(v) => setCount(Number(v))} disabled={running}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[3,5,7,10,15].map(n => <SelectItem key={n} value={String(n)}>{n} أسئلة</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-2 block">المستوى</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as any)} disabled={running}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">سهل</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="hard">صعب</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <Button onClick={run} disabled={running || topic.trim().length < 2} size="lg" className="gap-2">
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {running ? 'جاري التوليد...' : 'ولّد الاختبار'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {quiz.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="font-bold text-lg">📝 الاختبار ({quiz.length} أسئلة)</h3>
              {revealed && (
                <Badge className="bg-primary text-primary-foreground text-base px-4 py-1.5">
                  النتيجة: {score} / {quiz.length}
                </Badge>
              )}
            </div>

            {quiz.map((q, i) => (
              <div key={i} className="border rounded-xl p-4 space-y-3">
                <p className="font-semibold leading-relaxed">
                  <span className="text-primary">س{i + 1}.</span> {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, j) => {
                    const selected = answers[i] === j;
                    const isCorrect = j === q.correct_index;
                    const showState = revealed && (selected || isCorrect);
                    return (
                      <button
                        key={j}
                        type="button"
                        disabled={revealed}
                        onClick={() => setAnswers(prev => ({ ...prev, [i]: j }))}
                        className={`w-full text-right p-3 rounded-lg border transition-all ${
                          showState && isCorrect ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300' :
                          showState && selected && !isCorrect ? 'bg-destructive/10 border-destructive text-destructive' :
                          selected ? 'bg-primary/10 border-primary' :
                          'hover:bg-muted border-border'
                        }`}
                      >
                        <span className="font-bold ml-2">{['أ','ب','ج','د'][j]}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {revealed && (
                  <div className="text-sm bg-muted/50 rounded-lg p-3 mt-2">
                    <strong>💡 الشرح: </strong>{q.explanation}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center justify-end gap-2">
              {!revealed ? (
                <Button onClick={() => setRevealed(true)} size="lg" className="gap-2">
                  <Check className="w-4 h-4" /> عرض النتائج
                </Button>
              ) : (
                <Button variant="outline" onClick={() => { setAnswers({}); setRevealed(false); }} className="gap-2">
                  إعادة المحاولة
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
