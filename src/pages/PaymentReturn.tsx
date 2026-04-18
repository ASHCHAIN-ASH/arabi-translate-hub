import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Status = 'verifying' | 'succeeded' | 'failed' | 'pending' | 'cancelled';

const PaymentReturn: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('verifying');
  const [message, setMessage] = useState('جارٍ التحقق من حالة الدفع...');
  const [details, setDetails] = useState<any>(null);

  const orderNumber = params.get('order') || params.get('orderNumber') || '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!orderNumber) {
        setStatus('failed');
        setMessage('لم يتم العثور على رقم الطلب');
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { internal_order_number: orderNumber },
        });
        if (cancelled) return;
        if (error) throw error;
        setDetails(data);
        const s = (data?.status || 'pending') as Status;
        setStatus(s);
        if (s === 'succeeded') setMessage('تم استلام دفعتك بنجاح');
        else if (s === 'cancelled') setMessage('تم إلغاء عملية الدفع');
        else if (s === 'failed') setMessage('فشلت عملية الدفع');
        else setMessage('دفعتك قيد المعالجة، سنحدّث الحالة تلقائياً');
      } catch (e: any) {
        if (cancelled) return;
        setStatus('failed');
        setMessage(e?.message || 'تعذّر التحقق من الدفع');
      }
    })();
    return () => { cancelled = true; };
  }, [orderNumber]);

  const Icon =
    status === 'succeeded' ? CheckCircle2
    : status === 'verifying' || status === 'pending' ? Loader2
    : status === 'cancelled' ? Clock
    : XCircle;

  const tone =
    status === 'succeeded' ? 'text-green-600'
    : status === 'verifying' || status === 'pending' ? 'text-primary'
    : status === 'cancelled' ? 'text-amber-600'
    : 'text-destructive';

  const targetLink =
    details?.invoice_id ? `/client/invoices`
    : details?.purpose === 'wallet_topup' ? '/wallet'
    : '/orders';

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-lg border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted/40 flex items-center justify-center">
            <Icon className={`h-9 w-9 ${tone} ${status === 'verifying' ? 'animate-spin' : ''}`} />
          </div>
          <CardTitle className="text-2xl">{message}</CardTitle>
          <CardDescription>
            رقم العملية: <span className="font-mono">{orderNumber || '—'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {details?.amount && (
            <div className="rounded-lg bg-muted/40 p-4 flex justify-between text-sm">
              <span className="text-muted-foreground">المبلغ</span>
              <span className="font-bold">
                {Number(details.amount).toLocaleString('ar-SA')} {details.currency || 'SAR'}
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button asChild className="flex-1">
              <Link to={targetLink}>
                {status === 'succeeded' ? 'متابعة' : 'العودة للوحة التحكم'}
              </Link>
            </Button>
            {status === 'failed' && (
              <Button variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                إعادة المحاولة
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentReturn;
