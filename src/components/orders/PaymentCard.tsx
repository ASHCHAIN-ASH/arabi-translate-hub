import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard, Wallet, Upload, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/data/legacy/client';
import { useToast } from '@/hooks/use-toast';
import { recordInvoicePayment } from '@/utils/invoicePaymentService';

interface Invoice {
  id: string;
  invoice_number: string;
  total_amount: number | null;
  paid_amount: number | null;
  status: string | null;
  currency: string | null;
}

interface Props {
  invoice: Invoice;
  userId: string;
  onPaid?: () => void;
}

export const PaymentCard: React.FC<Props> = ({ invoice, userId, onPaid }) => {
  const { toast } = useToast();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const remaining = Number(invoice.total_amount || 0) - Number(invoice.paid_amount || 0);
  const isPaid = invoice.status === 'paid' || remaining <= 0;

  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from('wallets').select('balance').eq('user_id', userId).maybeSingle();
      setWalletBalance(Number(data?.balance || 0));
    })();
  }, [userId]);

  const ensurePaymentOwner = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user || data.user.id !== userId) {
      throw new Error('الدفع متاح فقط من حساب صاحب الطلب');
    }
  };

  const payFromWallet = async () => {
    if (walletBalance < remaining) {
      toast({ title: 'رصيد غير كافٍ', description: 'يرجى شحن المحفظة أولاً', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await ensurePaymentOwner();
      await recordInvoicePayment({
        invoice_id: invoice.id,
        payment_method: 'wallet',
        payment_date: new Date().toISOString().split('T')[0],
        notes: 'دفع من المحفظة',
      });
      toast({ title: '✅ تم الدفع بنجاح', description: 'سيبدأ تنفيذ طلبك الآن' });
      onPaid?.();
    } catch (e: any) {
      toast({ title: 'فشل الدفع', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const payByCard = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          purpose: 'invoice_payment',
          invoice_id: invoice.id,
          amount: remaining,
        },
      });
      if (error) throw error;
      if (!data?.checkout_url) throw new Error('تعذّر إنشاء رابط الدفع');
      window.location.href = data.checkout_url;
    } catch (e: any) {
      toast({ title: 'تعذّر بدء الدفع', description: e.message, variant: 'destructive' });
      setLoading(false);
    }
  };

  const submitBankTransfer = async () => {
    if (!reference.trim()) {
      toast({ title: 'أدخل رقم المرجع', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await ensurePaymentOwner();
      await recordInvoicePayment({
        invoice_id: invoice.id,
        payment_method: 'bank_transfer',
        payment_date: new Date().toISOString().split('T')[0],
        reference_number: reference,
        notes,
      });
      toast({ title: '📨 تم استلام طلب الدفع', description: 'سيتم التحقق من التحويل قريباً' });
      setReference(''); setNotes('');
    } catch (e: any) {
      toast({ title: 'فشل الإرسال', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (isPaid) {
    return (
      <Card className="border-green-500/40 bg-green-500/5">
        <CardContent className="p-4 flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600" />
          <div className="flex-1">
            <p className="font-semibold">تم الدفع بالكامل</p>
            <p className="text-sm text-muted-foreground">فاتورة: {invoice.invoice_number}</p>
          </div>
          <Badge className="bg-green-600">مدفوعة</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              إتمام الدفع
            </CardTitle>
            <CardDescription>فاتورة: {invoice.invoice_number}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-base">
            {remaining.toLocaleString('ar-SA')} {invoice.currency || 'SAR'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" dir="rtl">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="card"><CreditCard className="h-4 w-4 ml-1" /> بطاقة</TabsTrigger>
            <TabsTrigger value="wallet"><Wallet className="h-4 w-4 ml-1" /> المحفظة</TabsTrigger>
            <TabsTrigger value="bank"><Upload className="h-4 w-4 ml-1" /> تحويل بنكي</TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4 mt-4">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-4 w-4 text-primary" />
                دفع آمن ببطاقة مدى / فيزا / ماستركارد / Apple Pay
              </div>
              <p className="text-muted-foreground text-xs">
                ستتحوّل لصفحة دفع آمنة ومشفرة، وسنحدّث حالة فاتورتك تلقائياً عند إتمام العملية.
              </p>
            </div>
            <Button onClick={payByCard} disabled={loading} className="w-full" size="lg">
              {loading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <CreditCard className="h-4 w-4 ml-2" />}
              ادفع {remaining.toLocaleString('ar-SA')} {invoice.currency || 'SAR'} الآن
            </Button>
          </TabsContent>


          <TabsContent value="wallet" className="space-y-4 mt-4">
            <div className="rounded-lg bg-muted/40 p-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">رصيد محفظتك</span>
              <span className="font-bold text-lg">
                {walletBalance.toLocaleString('ar-SA')} {invoice.currency || 'SAR'}
              </span>
            </div>
            {walletBalance < remaining && (
              <p className="text-sm text-destructive">
                ينقصك {(remaining - walletBalance).toLocaleString('ar-SA')} لإتمام الدفع
              </p>
            )}
            <Button onClick={payFromWallet} disabled={loading || walletBalance < remaining} className="w-full" size="lg">
              {loading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Wallet className="h-4 w-4 ml-2" />}
              دفع {remaining.toLocaleString('ar-SA')} من المحفظة
            </Button>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4 mt-4">
            <div className="rounded-lg bg-muted/40 p-4 text-sm space-y-1">
              <p className="font-semibold">حوّل المبلغ إلى:</p>
              <p>البنك: الراجحي — IBAN: SA00 0000 0000 0000 0000 0000</p>
              <p>المستفيد: مسار التميز للخدمات الأكاديمية</p>
            </div>
            <div className="space-y-2">
              <Label>رقم مرجع التحويل</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="مثلاً: TXN123456" />
            </div>
            <div className="space-y-2">
              <Label>ملاحظات (اختياري)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            <Button onClick={submitBankTransfer} disabled={loading} className="w-full" size="lg" variant="secondary">
              {loading ? <Loader2 className="h-4 w-4 ml-2 animate-spin" /> : <Upload className="h-4 w-4 ml-2" />}
              إرسال إثبات التحويل
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
