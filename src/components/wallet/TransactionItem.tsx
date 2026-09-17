import React from 'react';
import {
  ArrowDownToLine, ArrowUpFromLine, ShoppingCart, RefreshCw, Settings2,
  ShieldCheck, Hash, Calendar, Landmark, CreditCard, Smartphone, Banknote,
  Download, Copy, Check, FileText, Receipt as ReceiptIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/data/legacy/client';
import type { WalletTransaction } from '@/utils/walletService';

const TYPE_META: Record<string, { label: string; icon: any; color: string; sign: '+' | '-' | '' }> = {
  deposit: { label: 'إيداع', icon: ArrowDownToLine, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', sign: '+' },
  withdrawal: { label: 'سحب', icon: ArrowUpFromLine, color: 'text-rose-600 bg-rose-50 border-rose-200', sign: '-' },
  payment: { label: 'دفع خدمة', icon: ShoppingCart, color: 'text-blue-600 bg-blue-50 border-blue-200', sign: '-' },
  refund: { label: 'استرجاع', icon: RefreshCw, color: 'text-amber-600 bg-amber-50 border-amber-200', sign: '+' },
  adjustment: { label: 'تسوية', icon: Settings2, color: 'text-slate-600 bg-slate-50 border-slate-200', sign: '' },
};

const METHOD_META: Record<string, { label: string; icon: any }> = {
  bank_transfer: { label: 'تحويل بنكي', icon: Landmark },
  mada: { label: 'مدى', icon: CreditCard },
  visa: { label: 'فيزا', icon: CreditCard },
  mastercard: { label: 'ماستركارد', icon: CreditCard },
  stc_pay: { label: 'STC Pay', icon: Smartphone },
  apple_pay: { label: 'Apple Pay', icon: Smartphone },
  cash: { label: 'نقدي', icon: Banknote },
  wallet: { label: 'المحفظة', icon: ReceiptIcon },
};

const fmtMoney = (n: number, c = 'SAR') =>
  new Intl.NumberFormat('ar-SA', { style: 'currency', currency: c, minimumFractionDigits: 2 }).format(n || 0);

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat('ar-SA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(d));

interface Props {
  tx: WalletTransaction;
  variant?: 'row' | 'card';
}

export const TransactionItem: React.FC<Props> = ({ tx, variant = 'row' }) => {
  const meta = TYPE_META[tx.type] || TYPE_META.adjustment;
  const Icon = meta.icon;
  const method = tx.payment_method ? METHOD_META[tx.payment_method] : null;
  const MethodIcon = method?.icon;
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  const copyReceipt = () => {
    if (!tx.receipt_number) return;
    navigator.clipboard.writeText(tx.receipt_number);
    setCopied(true);
    toast.success('تم نسخ رقم السند');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = async () => {
    setDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-receipt-pdf', {
        body: { transaction_id: tx.id },
      });
      if (error || !data?.success) throw new Error(data?.error || error?.message || 'تعذر التوليد');
      const { signedUrl } = data;
      window.open(signedUrl, '_blank');
      toast.success('تم فتح الإيصال');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card
          className="p-4 hover:shadow-md transition cursor-pointer border-r-4"
          style={{ borderRightColor: meta.color.includes('emerald') ? '#10b981' : meta.color.includes('rose') ? '#f43f5e' : meta.color.includes('blue') ? '#3b82f6' : meta.color.includes('amber') ? '#f59e0b' : '#64748b' }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${meta.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-800">{meta.label}</span>
                  {tx.reconciled && (
                    <Badge variant="outline" className="border-emerald-300 text-emerald-700 bg-emerald-50 gap-1 text-[10px]">
                      <ShieldCheck className="w-3 h-3" /> مطابقة بنكية
                    </Badge>
                  )}
                  {method && MethodIcon && (
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <MethodIcon className="w-3 h-3" /> {method.label}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <Hash className="w-3 h-3" />
                  <span className="font-mono">{tx.receipt_number || tx.id.slice(0, 8)}</span>
                  <span>•</span>
                  <Calendar className="w-3 h-3" />
                  <span>{fmtDate(tx.created_at)}</span>
                </div>
                {tx.description && (
                  <div className="text-xs text-slate-600 mt-1 truncate">{tx.description}</div>
                )}
              </div>
            </div>
            <div className="text-left shrink-0">
              <div className={`text-lg font-bold ${meta.sign === '+' ? 'text-emerald-600' : meta.sign === '-' ? 'text-rose-600' : 'text-slate-700'}`}>
                {meta.sign}{fmtMoney(Math.abs(Number(tx.amount)), tx.currency || 'SAR')}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">الرصيد: {fmtMoney(Number(tx.balance_after), tx.currency || 'SAR')}</div>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-lg" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ReceiptIcon className="w-5 h-5 text-blue-600" />
            تفاصيل المعاملة الرسمية
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* رأس بنكي */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full -translate-x-12 -translate-y-12" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Hash className="w-3 h-3" /> رقم السند
                </div>
                <button onClick={copyReceipt} className="text-slate-300 hover:text-white">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="font-mono text-lg font-bold">{tx.receipt_number || '—'}</div>
              <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> ختم زمني: {tx.signed_at ? fmtDate(tx.signed_at) : fmtDate(tx.created_at)}
              </div>
            </div>
          </div>

          {/* المبلغ */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 border">
              <div className="text-xs text-slate-500 mb-1">المبلغ</div>
              <div className={`text-xl font-bold ${meta.sign === '+' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {meta.sign}{fmtMoney(Math.abs(Number(tx.amount)), tx.currency || 'SAR')}
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 border">
              <div className="text-xs text-slate-500 mb-1">النوع</div>
              <div className="font-bold flex items-center gap-2"><Icon className="w-4 h-4" /> {meta.label}</div>
            </div>
          </div>

          {/* الأرصدة */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-xs text-blue-700 mb-1">الرصيد قبل</div>
              <div className="font-bold text-slate-800">
                {tx.balance_before != null ? fmtMoney(Number(tx.balance_before), tx.currency || 'SAR') : '—'}
              </div>
            </div>
            <div>
              <div className="text-xs text-blue-700 mb-1">الرصيد بعد</div>
              <div className="font-bold text-slate-800">{fmtMoney(Number(tx.balance_after), tx.currency || 'SAR')}</div>
            </div>
          </div>

          {/* تفاصيل */}
          <div className="space-y-2 text-sm">
            {method && (
              <Row label="طريقة الدفع" value={method.label} icon={MethodIcon} />
            )}
            {tx.gateway_ref && <Row label="رقم العملية لدى المزود" value={tx.gateway_ref} mono />}
            {tx.masked_account && <Row label="الحساب/البطاقة" value={tx.masked_account} mono />}
            {(tx.fee_amount ?? 0) > 0 && <Row label="الرسوم" value={fmtMoney(Number(tx.fee_amount), tx.currency || 'SAR')} />}
            {(tx.vat_amount ?? 0) > 0 && <Row label="ضريبة القيمة المضافة (15%)" value={fmtMoney(Number(tx.vat_amount), tx.currency || 'SAR')} />}
            {tx.description && <Row label="الوصف" value={tx.description} />}
            {tx.reference_type && tx.reference_id && (
              <Row label="المرجع" value={`${tx.reference_type} • ${tx.reference_id.slice(0, 8)}`} mono />
            )}
          </div>

          {/* التوقيع الرقمي */}
          {tx.signature_hash && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-bold">توقيع رقمي SHA-256</span>
              </div>
              <div className="font-mono text-[10px] text-slate-600 break-all leading-relaxed">
                {tx.signature_hash}
              </div>
              <div className="text-[10px] text-emerald-700 mt-2">
                هذا التوقيع يثبت عدم التلاعب بأي حقل من حقول المعاملة.
              </div>
            </div>
          )}

          {/* الحالة */}
          <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
            <span className="text-xs text-slate-500">الحالة</span>
            {tx.reconciled ? (
              <Badge className="bg-emerald-600">
                <ShieldCheck className="w-3 h-3 ml-1" /> مطابقة ومقفلة
              </Badge>
            ) : (
              <Badge variant="outline">قيد المطابقة البنكية</Badge>
            )}
          </div>

          <Button
            onClick={downloadReceipt}
            disabled={downloading}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {downloading ? (
              <>جاري التوليد...</>
            ) : (
              <><Download className="w-4 h-4 ml-2" /> تحميل الإيصال الرسمي PDF</>
            )}
          </Button>
          <p className="text-[10px] text-center text-slate-500 flex items-center justify-center gap-1">
            <FileText className="w-3 h-3" /> إيصال رسمي مختوم رقمياً، صالح للتقديم البنكي والمحاسبي
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row: React.FC<{ label: string; value: string; mono?: boolean; icon?: any }> = ({ label, value, mono, icon: Icon }) => (
  <div className="flex items-start justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
    <span className="text-slate-500 text-xs flex items-center gap-1">
      {Icon && <Icon className="w-3 h-3" />} {label}
    </span>
    <span className={`text-slate-800 font-medium text-sm text-left ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
  </div>
);
