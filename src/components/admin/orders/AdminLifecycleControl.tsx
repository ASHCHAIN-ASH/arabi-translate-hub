import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/data/legacy/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, ArrowLeftRight, Sparkles } from 'lucide-react';

const LIFECYCLE_STAGES: Array<{ key: string; label: string; emoji: string }> = [
  { key: 'received', label: 'مستلم', emoji: '📥' },
  { key: 'under_review', label: 'قيد المراجعة', emoji: '🔍' },
  { key: 'quote_sent', label: 'إرسال عرض السعر', emoji: '💰' },
  { key: 'quote_accepted', label: 'قبول العرض', emoji: '✅' },
  { key: 'contract_pending', label: 'بانتظار التوقيع', emoji: '📝' },
  { key: 'contract_signed', label: 'توقيع العقد', emoji: '✍️' },
  { key: 'payment_pending', label: 'بانتظار الدفع', emoji: '💳' },
  { key: 'paid', label: 'تم الدفع', emoji: '💵' },
  { key: 'in_progress', label: 'قيد التنفيذ', emoji: '⚡' },
  { key: 'delivered', label: 'تم التسليم', emoji: '📦' },
  { key: 'completed', label: 'مكتمل', emoji: '🎉' },
  { key: 'cancelled', label: 'ملغي', emoji: '❌' },
];

interface Props {
  orderId: string;
  currentStatus: string;
  onChanged?: () => void;
}

export function AdminLifecycleControl({ orderId, currentStatus, onChanged }: Props) {
  const [target, setTarget] = useState<string>('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const currentStage = LIFECYCLE_STAGES.find((s) => s.key === currentStatus);

  const handleTransition = async () => {
    if (!target || target === currentStatus) {
      toast({ title: 'اختر مرحلة جديدة', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await (supabase.rpc as any)('transition_order_lifecycle', {
        _order_id: orderId,
        _to_status: target,
        _note: note || null,
      });
      if (error) throw error;

      toast({
        title: '✅ تم تحديث المرحلة',
        description: 'تم إرسال إشعار بريدي تلقائي للعميل',
      });
      setNote('');
      setTarget('');
      onChanged?.();
    } catch (e: any) {
      toast({
        title: 'خطأ في الانتقال',
        description: e.message || 'انتقال غير مسموح',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          تحكم بمرحلة الطلب
          <Badge variant="secondary" className="mr-auto">
            آمن • State Machine
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <span className="text-xs text-muted-foreground">الحالة الحالية:</span>
          <Badge className="gap-1 text-sm">
            <span>{currentStage?.emoji}</span>
            {currentStage?.label || currentStatus}
          </Badge>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">المرحلة التالية</Label>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="اختر المرحلة..." />
            </SelectTrigger>
            <SelectContent>
              {LIFECYCLE_STAGES.filter((s) => s.key !== currentStatus).map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  <span className="flex items-center gap-2">
                    {s.emoji} {s.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">ملاحظة (اختياري — تُسجَّل في الجدول الزمني)</Label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="مثل: تم إرسال المسودة الأولى للمراجعة"
            rows={2}
            className="bg-background resize-none text-sm"
          />
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleTransition}
            disabled={loading || !target}
            className="w-full gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowLeftRight className="w-4 h-4" />
            )}
            نقل إلى المرحلة الجديدة
          </Button>
        </motion.div>

        <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
          💡 يتم إرسال إيميل احترافي للعميل تلقائيًا • يُسجَّل في الجدول الزمني • محمي بقواعد الانتقال
        </p>
      </CardContent>
    </Card>
  );
}
