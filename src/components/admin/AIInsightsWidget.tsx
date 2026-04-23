import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const AIInsightsWidget: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState('');

  const fetchInsights = async () => {
    setLoading(true);
    setStreamText('');
    setInsights([]);

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/admin-ai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          mode: 'insights',
          messages: [{ role: 'user', content: 'حلّل حالة المنصة الآن وأعطني رؤى ذكية' }],
        }),
      });

      if (!resp.ok) {
        let msg = 'تعذر جلب الرؤى';
        try {
          const j = await resp.json();
          if (j?.error) msg = j.error;
        } catch {}
        if (resp.status === 402) msg = '⚠️ الرصيد غير كافٍ — يرجى إضافة رصيد الذكاء الاصطناعي من Settings → Workspace → Usage';
        else if (resp.status === 429) msg = '⚠️ تم تجاوز الحد المسموح، حاول لاحقاً';
        setInsights([msg]);
        return;
      }
      if (!resp.body) throw new Error('فشل الاتصال');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let fullText = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || !line.trim()) continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setStreamText(fullText);
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
      setInsights(lines);
    } catch (e) {
      console.error(e);
      setInsights(['⚠️ تعذر جلب الرؤى، حاول مرة أخرى']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const displayLines = insights.length > 0
    ? insights
    : streamText.split('\n').map(l => l.trim()).filter(l => l.length > 3);

  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl">
      {/* خلفية متدرجة جريئة */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />

      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            رؤى ذكية لحظية
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchInsights}
            disabled={loading}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="space-y-2 min-h-[120px]">
          <AnimatePresence mode="popLayout">
            {displayLines.length === 0 && loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-white/80 text-sm"
              >
                <TrendingUp className="w-4 h-4 animate-pulse" />
                جاري تحليل بيانات المنصة...
              </motion.div>
            )}
            {displayLines.slice(0, 5).map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white text-sm"
              >
                {line.replace(/^[-*•]\s*/, '')}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
