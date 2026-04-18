import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  RefreshCw,
  GraduationCap,
  Minimize2,
  Maximize2,
  Copy,
  Loader2,
  Wand2,
  Crown,
  Zap,
} from "lucide-react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Operation = 'correct' | 'rephrase' | 'academic' | 'shorten' | 'expand';
type Mode = 'standard' | 'pro';

const OPERATIONS: Array<{
  id: Operation;
  title: string;
  description: string;
  icon: typeof CheckCircle2;
  color: string;
}> = [
  { id: 'correct', title: 'تصحيح لغوي', description: 'تصحيح الإملاء والنحو والترقيم', icon: CheckCircle2, color: 'text-emerald-600' },
  { id: 'rephrase', title: 'إعادة صياغة', description: 'صياغة جديدة بنفس المعنى', icon: RefreshCw, color: 'text-blue-600' },
  { id: 'academic', title: 'رفع أكاديمي', description: 'أسلوب رصين للنشر العلمي', icon: GraduationCap, color: 'text-purple-600' },
  { id: 'shorten', title: 'اختصار ذكي', description: 'تقليل الحجم مع حفظ المعنى', icon: Minimize2, color: 'text-orange-600' },
  { id: 'expand', title: 'توسيع وإثراء', description: 'إضافة تفاصيل وأمثلة', icon: Maximize2, color: 'text-pink-600' },
];

const SmartEditor = () => {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [operation, setOperation] = useState<Operation>('correct');
  const [mode, setMode] = useState<Mode>('standard');
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<{ charged: number; was_free: boolean; quota_left: number } | null>(null);

  const maxLength = mode === 'pro' ? 20000 : 5000;
  const price = mode === 'pro' ? 7 : 2;

  const handleProcess = async () => {
    if (text.trim().length < 10) {
      toast.error('النص قصير جداً (10 أحرف على الأقل)');
      return;
    }
    if (text.length > maxLength) {
      toast.error(`النص يتجاوز الحد الأقصى (${maxLength} حرف)`);
      return;
    }

    setLoading(true);
    setOutput('');
    setMeta(null);

    try {
      const { data, error } = await supabase.functions.invoke('smart-editor', {
        body: { text, operation, mode },
      });

      if (error) {
        const msg = (error as any)?.context?.error || error.message || 'فشل المعالجة';
        toast.error(msg);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setOutput(data.output);
      setMeta({
        charged: data.charged || 0,
        was_free: data.was_free,
        quota_left: data.free_quota_remaining ?? 0,
      });

      if (data.was_free) {
        toast.success(`✨ تمت المعالجة مجاناً! تبقى ${data.free_quota_remaining} استخدام مجاني اليوم`);
      } else {
        toast.success(`✨ تمت المعالجة - تم خصم ${data.charged} ر.س`);
      }
    } catch (e: any) {
      toast.error(e?.message || 'خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success('تم النسخ');
  };

  const selectedOp = OPERATIONS.find(o => o.id === operation)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5" dir="rtl">
      <Header />

      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Wand2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">مدعوم بالذكاء الاصطناعي</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent mb-3">
              المحرر الذكي
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تصحيح، صياغة، ورفع نصوصك الأكاديمية بضغطة زر
            </p>
          </motion.div>

          {/* Mode Selector */}
          <Card className="mb-6 border-2 border-primary/10">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg mb-1">اختر مستوى المعالجة</h3>
                  <p className="text-sm text-muted-foreground">
                    {mode === 'standard'
                      ? '⚡ سريع ومناسب للنصوص اليومية - 3 استخدامات مجانية يومياً'
                      : '👑 جودة عالية للنصوص الطويلة والأبحاث المعقدة'}
                  </p>
                </div>
                <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
                  <TabsList className="grid grid-cols-2 w-full md:w-[300px]">
                    <TabsTrigger value="standard" className="gap-2">
                      <Zap className="h-4 w-4" />
                      قياسي (2 ر.س)
                    </TabsTrigger>
                    <TabsTrigger value="pro" className="gap-2">
                      <Crown className="h-4 w-4" />
                      متقدم (7 ر.س)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Operations */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {OPERATIONS.map((op) => {
              const Icon = op.icon;
              const isSelected = operation === op.id;
              return (
                <motion.button
                  key={op.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOperation(op.id)}
                  className={`p-4 rounded-xl border-2 text-right transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-primary' : op.color}`} />
                  <div className="font-bold text-sm mb-1">{op.title}</div>
                  <div className="text-xs text-muted-foreground">{op.description}</div>
                </motion.button>
              );
            })}
          </div>

          {/* Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">النص الأصلي</CardTitle>
                  <Badge variant="outline">
                    {text.length} / {maxLength}
                  </Badge>
                </div>
                <CardDescription>الصق نصك هنا</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="اكتب أو الصق النص الذي تريد معالجته..."
                  className="min-h-[300px] resize-none text-base leading-relaxed"
                  maxLength={maxLength}
                />
                <Button
                  onClick={handleProcess}
                  disabled={loading || text.trim().length < 10}
                  size="lg"
                  className="w-full mt-4 bg-gradient-to-l from-primary to-secondary"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      تنفيذ: {selectedOp.title} ({price} ر.س)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    النتيجة
                  </CardTitle>
                  {output && (
                    <Button size="sm" variant="outline" onClick={handleCopy} className="gap-2">
                      <Copy className="h-4 w-4" />
                      نسخ
                    </Button>
                  )}
                </div>
                {meta && (
                  <CardDescription className="flex flex-wrap gap-2 mt-2">
                    {meta.was_free ? (
                      <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-300">
                        مجاناً ✨ (تبقى {meta.quota_left})
                      </Badge>
                    ) : (
                      <Badge variant="secondary">خُصم {meta.charged} ر.س</Badge>
                    )}
                    <Badge variant="outline">{output.length} حرف</Badge>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="min-h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p>الذكاء الاصطناعي يعمل على نصك...</p>
                  </div>
                ) : output ? (
                  <div className="min-h-[300px] p-4 rounded-lg bg-muted/30 border whitespace-pre-wrap text-base leading-relaxed">
                    {output}
                  </div>
                ) : (
                  <div className="min-h-[300px] flex flex-col items-center justify-center text-muted-foreground text-center">
                    <Wand2 className="h-12 w-12 mb-3 opacity-30" />
                    <p>ستظهر النتيجة هنا بعد التنفيذ</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info */}
          <Card className="mt-6 bg-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                نصائح للحصول على أفضل نتيجة
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc pr-5">
                <li>استخدم النمط <strong>القياسي</strong> للنصوص القصيرة والمراجعات السريعة</li>
                <li>استخدم النمط <strong>المتقدم</strong> للأبحاث الطويلة والمحتوى الذي يحتاج دقة عالية</li>
                <li>اختر "رفع أكاديمي" لتحويل النص إلى أسلوب يصلح للنشر في المجلات المحكمة</li>
                <li>3 استخدامات مجانية يومياً للنمط القياسي</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SmartEditor;
