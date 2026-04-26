import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Wallet, Loader2, CheckCircle2, AlertCircle, Zap, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Installment {
  id: string;
  month_number: number;
  amount: number;
  due_date: string;
  status: string;
}

interface InstallmentsPaymentPanelProps {
  applicationId: string;
  userId: string;
  installments: Installment[];
  walletBalance: number;
  autoDebitEnabled: boolean;
  onPaid: () => void;
  onAutoDebitToggle: (enabled: boolean) => void;
}

const fmt = (n: number) => Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });

const InstallmentsPaymentPanel: React.FC<InstallmentsPaymentPanelProps> = ({
  applicationId,
  userId,
  installments,
  walletBalance,
  autoDebitEnabled,
  onPaid,
  onAutoDebitToggle,
}) => {
  const { toast } = useToast();
  const [payingId, setPayingId] = useState<string | null>(null);
  const [togglingAuto, setTogglingAuto] = useState(false);

  const pending = installments
    .filter((i) => i.status !== 'paid')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  const handlePay = async (inst: Installment) => {
    if (walletBalance < inst.amount) {
      toast({
        title: 'رصيد المحفظة غير كافٍ',
        description: `تحتاج ${fmt(inst.amount)} ر.س — رصيدك: ${fmt(walletBalance)} ر.س`,
        variant: 'destructive',
      });
      return;
    }
    setPayingId(inst.id);
    try {
      const { data, error } = await supabase.rpc('pay_installment_from_wallet', {
        p_installment_id: inst.id,
        p_user_id: userId,
      });
      if (error) throw error;
      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        toast({
          title: 'تعذّر السداد',
          description: result.error === 'insufficient_balance' ? 'رصيد غير كافٍ' : (result.error || 'حدث خطأ'),
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: '✅ تم السداد بنجاح',
        description: `سُدِّد قسط ${inst.month_number} بمبلغ ${fmt(inst.amount)} ر.س`,
      });
      onPaid();
    } catch (e: any) {
      toast({ title: 'خطأ', description: e.message, variant: 'destructive' });
    } finally {
      setPayingId(null);
    }
  };

  const handleAutoToggle = async (val: boolean) => {
    setTogglingAuto(true);
    try {
      const { error } = await supabase
        .from('financing_applications')
        .update({ auto_debit_enabled: val })
        .eq('id', applicationId);
      if (error) throw error;
      onAutoDebitToggle(val);
      toast({
        title: val ? '🔁 تم تفعيل الخصم التلقائي' : 'تم إيقاف الخصم التلقائي',
        description: val
          ? 'سيتم خصم القسط من محفظتك تلقائياً عند الاستحقاق'
          : 'يمكنك سداد كل قسط يدوياً من هذه اللوحة',
      });
    } catch (e: any) {
      toast({ title: 'تعذّر التحديث', description: e.message, variant: 'destructive' });
    } finally {
      setTogglingAuto(false);
    }
  };

  if (pending.length === 0) {
    return (
      <Card className="p-6 text-center bg-emerald-500/5 border-emerald-500/20">
        <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
        <p className="font-bold text-emerald-700">كل الأقساط مسدّدة 🎉</p>
      </Card>
    );
  }

  return (
    <Card className="p-5 space-y-4" dir="rtl">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-base font-bold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            سداد الأقساط من المحفظة
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">رصيدك: {fmt(walletBalance)} ر.س</p>
        </div>

        <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2">
          <Zap className={cn('h-4 w-4', autoDebitEnabled ? 'text-amber-500' : 'text-muted-foreground')} />
          <Label htmlFor="auto-debit" className="text-xs cursor-pointer select-none">
            خصم تلقائي
          </Label>
          <Switch
            id="auto-debit"
            checked={autoDebitEnabled}
            onCheckedChange={handleAutoToggle}
            disabled={togglingAuto}
          />
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {pending.slice(0, 6).map((inst, idx) => {
            const dueDate = new Date(inst.due_date);
            const isOverdue = dueDate < new Date() && inst.status !== 'paid';
            const insufficientBalance = walletBalance < inst.amount;
            return (
              <motion.div
                key={inst.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: idx * 0.04 }}
                className={cn(
                  'flex items-center justify-between gap-3 p-3 rounded-lg border',
                  isOverdue ? 'border-rose-300 bg-rose-50 dark:bg-rose-950/20' : 'border-border bg-card',
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                    isOverdue ? 'bg-rose-500 text-white' : 'bg-primary/10 text-primary',
                  )}>
                    {inst.month_number}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">قسط شهر {inst.month_number}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {dueDate.toLocaleDateString('ar-SA')}
                      {isOverdue && (
                        <Badge variant="destructive" className="text-[10px] px-1 py-0 mr-1">متأخر</Badge>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tabular-nums whitespace-nowrap">
                    {fmt(inst.amount)} ر.س
                  </span>
                  <Button
                    size="sm"
                    variant={isOverdue ? 'destructive' : 'default'}
                    onClick={() => handlePay(inst)}
                    disabled={payingId === inst.id || insufficientBalance}
                    className="gap-1"
                  >
                    {payingId === inst.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : insufficientBalance ? (
                      <AlertCircle className="h-3 w-3" />
                    ) : (
                      <Wallet className="h-3 w-3" />
                    )}
                    {insufficientBalance ? 'رصيد غير كافٍ' : 'ادفع الآن'}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {pending.length > 6 && (
        <p className="text-xs text-center text-muted-foreground">+{pending.length - 6} قسط إضافي</p>
      )}
    </Card>
  );
};

export default InstallmentsPaymentPanel;
