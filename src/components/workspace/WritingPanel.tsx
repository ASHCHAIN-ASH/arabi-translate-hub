import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Copy, CheckCircle2, RefreshCw, GraduationCap, Minimize2, Maximize2, Crown, Zap, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Operation = 'correct' | 'rephrase' | 'academic' | 'shorten' | 'expand';
type Mode = 'standard' | 'pro';

const OPS: Array<{ id: Operation; title: string; icon: any }> = [
  { id: 'correct', title: 'تصحيح', icon: CheckCircle2 },
  { id: 'rephrase', title: 'إعادة صياغة', icon: RefreshCw },
  { id: 'academic', title: 'رفع أكاديمي', icon: GraduationCap },
  { id: 'shorten', title: 'اختصار', icon: Minimize2 },
  { id: 'expand', title: 'توسيع', icon: Maximize2 },
];

interface Props {
  text: string;
  setText: (v: string) => void;
  output: string;
  setOutput: (v: string) => void;
  onSaveToNotes?: (content: string, title: string) => void;
  onSendToSummarizer?: (content: string) => void;
}

export default function WritingPanel({ text, setText, output, setOutput, onSaveToNotes, onSendToSummarizer }: Props) {
  const [op, setOp] = useState<Operation>('correct');
  const [mode, setMode] = useState<Mode>('standard');
  const [loading, setLoading] = useState(false);
  const max = mode === 'pro' ? 20000 : 5000;

  const run = async () => {
    if (text.trim().length < 10) return toast.error('النص قصير جداً');
    if (text.length > max) return toast.error(`الحد الأقصى ${max} حرف`);
    setLoading(true);
    setOutput('');
    try {
      const { data, error } = await supabase.functions.invoke('smart-editor', {
        body: { text, operation: op, mode },
      });
      if (error) {
        toast.error((error as any)?.context?.error || error.message);
        return;
      }
      if (data?.error) return toast.error(data.error);
      setOutput(data.output);
      toast.success(data.was_free ? `مجاناً ✨ تبقى ${data.free_quota_remaining}` : `خُصم ${data.charged} ر.س`);
    } catch (e: any) {
      toast.error(e?.message || 'خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Input */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> النص الأصلي</h3>
          <Badge variant="outline">{text.length} / {max}</Badge>
        </div>
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="mb-3">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="standard" className="gap-1 text-xs"><Zap className="h-3 w-3" /> قياسي (2 ر.س)</TabsTrigger>
            <TabsTrigger value="pro" className="gap-1 text-xs"><Crown className="h-3 w-3" /> متقدم (7 ر.س)</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="grid grid-cols-5 gap-1 mb-3">
          {OPS.map((o) => {
            const Icon = o.icon;
            const active = op === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setOp(o.id)}
                className={`p-2 rounded-md border text-[11px] flex flex-col items-center gap-1 transition ${active ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40'}`}
              >
                <Icon className="h-4 w-4" />
                {o.title}
              </button>
            );
          })}
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب أو الصق النص هنا..."
          className="min-h-[280px] resize-none text-base leading-relaxed"
          maxLength={max}
        />
        <Button onClick={run} disabled={loading || text.trim().length < 10} className="w-full mt-3 bg-gradient-to-l from-primary to-secondary">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> جاري...</> : <><Sparkles className="h-4 w-4" /> تنفيذ</>}
        </Button>
      </Card>

      {/* Output */}
      <Card className="p-4 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> النتيجة</h3>
          {output && (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success('تم النسخ'); }}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        {loading ? (
          <div className="min-h-[280px] flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-sm">الذكاء الاصطناعي يعمل...</p>
          </div>
        ) : output ? (
          <>
            <div className="min-h-[280px] p-3 rounded-md bg-muted/30 border whitespace-pre-wrap text-base leading-relaxed">
              {output}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {onSendToSummarizer && (
                <Button size="sm" variant="outline" onClick={() => { onSendToSummarizer(output); toast.success('أُرسل للملخّص'); }}>
                  ↪ إرسال للتلخيص
                </Button>
              )}
              {onSaveToNotes && (
                <Button size="sm" variant="outline" onClick={() => { onSaveToNotes(output, 'نص محرّر'); toast.success('حُفظ في الملاحظات'); }}>
                  <Save className="h-3 w-3" /> حفظ كملاحظة
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="min-h-[280px] flex items-center justify-center text-muted-foreground text-sm">
            ستظهر النتيجة هنا
          </div>
        )}
      </Card>
    </div>
  );
}
