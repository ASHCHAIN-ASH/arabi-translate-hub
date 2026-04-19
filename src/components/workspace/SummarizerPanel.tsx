import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Copy, Save, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  text: string;
  setText: (v: string) => void;
  output: string;
  setOutput: (v: string) => void;
  onSaveToNotes?: (content: string, title: string) => void;
  onSendToStudy?: (content: string) => void;
}

export default function SummarizerPanel({ text, setText, output, setOutput, onSaveToNotes, onSendToStudy }: Props) {
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (text.trim().length < 50) return toast.error('النص قصير جداً (50 حرف على الأقل)');
    setLoading(true);
    setOutput('');
    try {
      // نستخدم smart-editor مع operation=shorten كأساس للتلخيص
      const { data, error } = await supabase.functions.invoke('smart-editor', {
        body: { text, operation: 'shorten', mode: text.length > 5000 ? 'pro' : 'standard' },
      });
      if (error) {
        toast.error((error as any)?.context?.error || error.message);
        return;
      }
      if (data?.error) return toast.error(data.error);
      setOutput(data.output);
      toast.success(data.was_free ? `مجاناً ✨` : `خُصم ${data.charged} ر.س`);
    } catch (e: any) {
      toast.error(e?.message || 'خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> النص</h3>
          <Badge variant="outline">{text.length} حرف</Badge>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="الصق المقال أو الفصل أو المحاضرة هنا..."
          className="min-h-[320px] resize-none text-base leading-relaxed"
          maxLength={20000}
        />
        <Button onClick={run} disabled={loading || text.trim().length < 50} className="w-full mt-3 bg-gradient-to-l from-primary to-secondary">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> جاري التلخيص...</> : <><Sparkles className="h-4 w-4" /> تلخيص ذكي</>}
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          * يتم احتساب الرسوم تلقائياً (مجاني × 3 يومياً)
        </p>
      </Card>

      <Card className="p-4 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> الملخّص</h3>
          {output && (
            <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success('تم النسخ'); }}>
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
        {loading ? (
          <div className="min-h-[320px] flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-sm">يتم تحليل النص...</p>
          </div>
        ) : output ? (
          <>
            <div className="min-h-[320px] p-3 rounded-md bg-muted/30 border whitespace-pre-wrap text-base leading-relaxed">
              {output}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {onSendToStudy && (
                <Button size="sm" variant="outline" onClick={() => { onSendToStudy(output); toast.success('أُرسل للدراسة'); }}>
                  ↪ توليد بطاقات دراسة
                </Button>
              )}
              {onSaveToNotes && (
                <Button size="sm" variant="outline" onClick={() => { onSaveToNotes(output, 'ملخّص'); toast.success('حُفظ'); }}>
                  <Save className="h-3 w-3" /> حفظ
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="min-h-[320px] flex items-center justify-center text-muted-foreground text-sm text-center">
            سيظهر الملخّص هنا<br />
            <span className="text-xs opacity-60">مع نقاط رئيسية مستخرجة</span>
          </div>
        )}
      </Card>
    </div>
  );
}
