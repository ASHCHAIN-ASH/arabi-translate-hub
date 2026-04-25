import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wallet, Banknote, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MIN_WITHDRAWAL = 100;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  availableBalance: number;
  onSuccess?: () => void;
}

export default function WithdrawDialog({ open, onOpenChange, availableBalance, onSuccess }: Props) {
  const [amount, setAmount] = useState<string>('');
  const [bankName, setBankName] = useState('');
  const [holderName, setHolderName] = useState('');
  const [iban, setIban] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setAmount(''); setBankName(''); setHolderName(''); setIban(''); setNotes('');
  };

  const handleSubmit = async () => {
    const numAmount = Number(amount);
    if (!Number.isFinite(numAmount) || numAmount < MIN_WITHDRAWAL) {
      toast.error(`الحد الأدنى للسحب ${MIN_WITHDRAWAL} ر.س`);
      return;
    }
    if (numAmount > availableBalance) {
      toast.error('المبلغ يتجاوز رصيد أرباح العمولات المتاحة');
      return;
    }
    if (!bankName.trim() || !holderName.trim() || !iban.trim()) {
      toast.error('الرجاء تعبئة كل الحقول البنكية');
      return;
    }
    const cleanIban = iban.replace(/\s+/g, '').toUpperCase();
    if (!/^SA\d{22}$/.test(cleanIban)) {
      toast.error('رقم الآيبان غير صالح (يجب أن يبدأ بـ SA ويتكون من 24 خانة)');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('request_withdrawal' as any, {
        _amount: numAmount,
        _bank_name: bankName.trim(),
        _account_holder_name: holderName.trim(),
        _iban: cleanIban,
        _notes: notes.trim() || null,
      });
      if (error) throw error;
      const ok = (data as any)?.success !== false;
      if (!ok) {
        toast.error((data as any)?.error || 'تعذّر إنشاء الطلب');
        return;
      }
      toast.success('تم إرسال طلب السحب بنجاح ✓ سيتم مراجعته خلال 1-3 أيام عمل');
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (e: any) {
      toast.error(e?.message || 'حدث خطأ');
    } finally {
      setSubmitting(false);
    }
  };

  const canWithdraw = availableBalance >= MIN_WITHDRAWAL;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-primary" />
            سحب الأرباح
          </DialogTitle>
          <DialogDescription>
            اطلب تحويل أرباح إحالاتك (العمولات فقط) إلى حسابك البنكي
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-l from-primary/10 to-transparent border rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">أرباح العمولات المتاحة</span>
            </div>
            <span className="text-lg font-black">{availableBalance.toLocaleString('ar-SA')} ر.س</span>
          </div>

          {!canWithdraw && (
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription className="text-xs">
                الحد الأدنى للسحب {MIN_WITHDRAWAL} ر.س. يلزم {(MIN_WITHDRAWAL - availableBalance).toLocaleString('ar-SA')} ر.س إضافية من أرباح العمولات.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="amount">المبلغ (ر.س)</Label>
            <Input
              id="amount"
              type="number"
              min={MIN_WITHDRAWAL}
              max={availableBalance}
              placeholder={`الحد الأدنى ${MIN_WITHDRAWAL}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!canWithdraw || submitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bank">اسم البنك</Label>
            <Input id="bank" placeholder="مثال: الراجحي" value={bankName} onChange={(e) => setBankName(e.target.value)} disabled={submitting} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="holder">اسم صاحب الحساب</Label>
            <Input id="holder" placeholder="الاسم الرباعي كما في الحساب" value={holderName} onChange={(e) => setHolderName(e.target.value)} disabled={submitting} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="iban">رقم الآيبان (IBAN)</Label>
            <Input
              id="iban"
              dir="ltr"
              placeholder="SA0000000000000000000000"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="font-mono"
              disabled={submitting}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <Textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} disabled={submitting} />
          </div>

          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription className="text-xs leading-relaxed">
              يُسحب من أرباح العمولات فقط (لا يشمل رصيد المحفظة الأساسي مثل الإيداعات والاستردادات). يُخصم المبلغ فور إرسال الطلب، ويُعاد تلقائياً عند الرفض. مدة المعالجة: 1-3 أيام عمل.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit} disabled={!canWithdraw || submitting}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin ms-2" />}
            إرسال الطلب
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
