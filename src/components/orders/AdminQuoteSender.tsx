import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/data/legacy/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  tracking_id: string;
  service_name: string | null;
  total_amount: number | null;
  deadline: string | null;
  quote_status: string | null;
  quote_notes: string | null;
  lifecycle_status: string;
}

interface Props {
  order: Order;
  onSent?: () => void;
}

export const AdminQuoteSender: React.FC<Props> = ({ order, onSent }) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>(String(order.total_amount || ''));
  const [deadline, setDeadline] = useState<string>(order.deadline ? order.deadline.split('T')[0] : '');
  const [notes, setNotes] = useState<string>(order.quote_notes || '');
  const [loading, setLoading] = useState(false);

  const isAccepted = order.quote_status === 'accepted';
  const isSent = order.quote_status === 'sent' || order.lifecycle_status === 'quote_sent';

  const sendQuote = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast({ title: 'أدخل سعراً صحيحاً', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('service_orders')
        .update({
          total_amount: amt,
          deadline: deadline || null,
          quote_notes: notes || null,
          quote_status: 'sent',
          quote_sent_at: new Date().toISOString(),
          lifecycle_status: 'quote_sent',
        })
        .eq('id', order.id);
      if (error) throw error;
      toast({ title: '📨 تم إرسال عرض السعر', description: 'سيتم إعلام العميل لحظياً' });
      onSent?.();
    } catch (e: any) {
      toast({ title: 'فشل الإرسال', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (isAccepted) {
    return (
      <Card className="border-green-500/40 bg-green-500/5">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          <div className="flex-1">
            <p className="font-semibold">العميل وافق على العرض</p>
            <p className="text-sm text-muted-foreground">
              المبلغ: {Number(order.total_amount || 0).toLocaleString('ar-SA')} ر.س
            </p>
          </div>
          <Badge className="bg-green-600">مقبول</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {isSent ? 'تعديل عرض السعر' : 'إرسال عرض السعر'}
            </CardTitle>
            <CardDescription>الطلب: {order.tracking_id}</CardDescription>
          </div>
          {isSent && <Badge variant="secondary">مُرسل</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>المبلغ الإجمالي (ر.س)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label>الموعد النهائي</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>ملاحظات العرض (اختياري)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="تفاصيل النطاق، شروط التسليم، إلخ..."
          />
        </div>
        <Button onClick={sendQuote} disabled={loading} className="w-full" size="lg">
          {loading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Send className="h-4 w-4 ml-2" />}
          {isSent ? 'تحديث وإعادة الإرسال' : 'إرسال العرض للعميل'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminQuoteSender;
