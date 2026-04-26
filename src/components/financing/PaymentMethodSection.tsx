import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, ShieldCheck, Lock, Calendar, Hash, User, Mail, Check,
  AlertCircle, Building2, Wallet as WalletIcon, Copy, Upload, FileImage,
  X, Banknote, Receipt, Info,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export type PaymentMethod = 'visa' | 'mada' | 'paypal' | 'bank_transfer' | 'wallet';

export interface PaymentDetails {
  method: PaymentMethod;
  // Card
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  // PayPal
  paypalEmail: string;
  // Bank transfer
  bankReference: string;
  bankSenderName: string;
  bankReceiptFile: File | null;
  bankReceiptName: string;
  // Wallet
  walletConfirmed: boolean;
}

export const emptyPaymentDetails: PaymentDetails = {
  method: 'mada',
  cardNumber: '',
  cardHolder: '',
  expiry: '',
  cvv: '',
  paypalEmail: '',
  bankReference: '',
  bankSenderName: '',
  bankReceiptFile: null,
  bankReceiptName: '',
  walletConfirmed: false,
};

// ===== Bank info (مطابق لـ BANK_INFO في صفحة المحفظة) =====
export const FINANCING_BANK_INFO = {
  bank: 'Alawwal Bank — البنك الأول',
  iban: 'SA5345000000262359391004',
  ibanFormatted: 'SA53 4500 0000 0262 3593 9100 4',
  beneficiary: 'شركة علي صالح الشهري القابضة',
};

// ===== Masks =====
export const maskCardNumber = (raw: string) =>
  raw.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();

export const maskExpiry = (raw: string) => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const maskCVV = (raw: string) => raw.replace(/\D/g, '').slice(0, 4);

// ===== Validation =====
const luhnValid = (digits: string) => {
  if (!digits) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

const isVisa = (digits: string) => /^4\d{12}(\d{3})?(\d{3})?$/.test(digits);
const MADA_BINS = ['446404','440795','440647','421141','474491','588845','968208','588848','410685','432328','428671','428672','428673','484783','486094','486095','486096','489317','489318','489319','493428','504300','508160','524130','532013','535825','539931','543357','549760','554180','555610','558563','585265','588850','589206','604906','636120'];
const isMada = (digits: string) => digits.length >= 6 && MADA_BINS.some((bin) => digits.startsWith(bin));

const isExpiryValid = (mmYY: string) => {
  if (!/^\d{2}\/\d{2}$/.test(mmYY)) return false;
  const [mmStr, yyStr] = mmYY.split('/');
  const mm = parseInt(mmStr, 10);
  const yy = parseInt(yyStr, 10);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;
  if (yy < curYY) return false;
  if (yy === curYY && mm < curMM) return false;
  if (yy > curYY + 15) return false;
  return true;
};

const isEmailValid = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

export const validatePaymentDetails = (
  p: PaymentDetails,
  ctx?: { walletBalance?: number; downPayment?: number },
) => {
  if (p.method === 'paypal') {
    return {
      paypalEmail: isEmailValid(p.paypalEmail),
      ok: isEmailValid(p.paypalEmail),
    };
  }
  if (p.method === 'bank_transfer') {
    const refOK = p.bankReference.trim().length >= 4;
    const senderOK = p.bankSenderName.trim().length >= 3;
    const receiptOK = !!p.bankReceiptFile || p.bankReceiptName.length > 0;
    return {
      bankReference: refOK,
      bankSenderName: senderOK,
      bankReceipt: receiptOK,
      ok: refOK && senderOK && receiptOK,
    };
  }
  if (p.method === 'wallet') {
    const balance = ctx?.walletBalance ?? 0;
    const need = ctx?.downPayment ?? 0;
    const enough = balance >= need;
    return {
      walletEnough: enough,
      walletConfirmed: p.walletConfirmed,
      ok: enough && p.walletConfirmed,
    };
  }
  // card (mada / visa)
  const digits = p.cardNumber.replace(/\s/g, '');
  const cardLenOK = digits.length >= 13 && digits.length <= 19;
  const luhn = luhnValid(digits);
  const brandOK = p.method === 'visa' ? isVisa(digits) : isMada(digits);
  const cardNumberValid = cardLenOK && luhn && brandOK;
  const cardHolderValid = p.cardHolder.trim().length >= 3 && /^[A-Za-z\s\u0600-\u06FF]+$/.test(p.cardHolder.trim());
  const expiryValid = isExpiryValid(p.expiry);
  const cvvValid = /^\d{3,4}$/.test(p.cvv);
  return {
    cardNumber: cardNumberValid,
    cardHolder: cardHolderValid,
    expiry: expiryValid,
    cvv: cvvValid,
    ok: cardNumberValid && cardHolderValid && expiryValid && cvvValid,
  };
};

// ===== UI helpers =====
const FieldShell: React.FC<{
  label: string;
  icon: React.ElementType;
  required?: boolean;
  valid?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, icon: Icon, required, valid, invalid, errorMessage, hint, children }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <Label className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
        <span
          className={cn(
            'h-6 w-6 rounded-lg flex items-center justify-center ring-1 transition-colors',
            invalid ? 'bg-rose-500/10 ring-rose-500/30 text-rose-600'
              : valid ? 'bg-emerald-500/10 ring-emerald-500/30 text-emerald-600'
              : 'bg-muted ring-border text-primary',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span>{label}</span>
        {required && (
          <span className="text-[9px] font-bold text-rose-600 bg-rose-500/10 ring-1 ring-rose-500/30 px-1.5 py-0.5 rounded-md">مطلوب</span>
        )}
      </Label>
      {valid && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
          <Check className="h-3 w-3" /> صحيح
        </motion.span>
      )}
      {invalid && (
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-[10px] font-bold text-rose-600">
          <AlertCircle className="h-3 w-3" /> خطأ
        </motion.span>
      )}
    </div>
    <div
      className={cn(
        'rounded-xl ring-1 transition-all bg-background/80 backdrop-blur-sm',
        invalid ? 'ring-rose-500/40 shadow-[0_0_0_3px_rgba(244,63,94,0.08)]'
          : valid ? 'ring-emerald-500/40 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
          : 'ring-border/60 hover:ring-primary/30 focus-within:ring-primary',
      )}
    >
      {children}
    </div>
    {invalid && errorMessage ? (
      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-medium text-rose-600 mt-1.5 pr-1 flex items-center gap-1">
        <AlertCircle className="h-3 w-3 shrink-0" />
        <span>{errorMessage}</span>
      </motion.p>
    ) : hint ? (
      <p className="text-[10px] text-muted-foreground mt-1 pr-1">{hint}</p>
    ) : null}
  </div>
);

const fmt = (n: number) =>
  new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 2 }).format(Math.round(n * 100) / 100);

interface Props {
  value: PaymentDetails;
  onChange: (v: PaymentDetails) => void;
  amountLabel?: string;
  /** المبلغ الفعلي للدفعة الأولى — يُستخدم للتحقق من رصيد المحفظة */
  downPaymentAmount?: number;
  /** رصيد المحفظة الحالي (إن وجد) */
  walletBalance?: number;
}

const PaymentMethodSection: React.FC<Props> = ({
  value, onChange, amountLabel, downPaymentAmount = 0, walletBalance = 0,
}) => {
  const set = <K extends keyof PaymentDetails>(k: K, v: PaymentDetails[K]) =>
    onChange({ ...value, [k]: v });

  const validation = useMemo(
    () => validatePaymentDetails(value, { walletBalance, downPayment: downPaymentAmount }),
    [value, walletBalance, downPaymentAmount],
  );
  const cardDigits = value.cardNumber.replace(/\s/g, '');

  // ===== Bank receipt preview =====
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  useEffect(() => {
    const f = value.bankReceiptFile;
    if (!f || !f.type.startsWith('image/')) {
      setReceiptPreview(null);
      return;
    }
    const url = URL.createObjectURL(f);
    setReceiptPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value.bankReceiptFile]);

  const handleReceiptFile = (f?: File | null) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error('الحجم الأقصى للإيصال 5 ميجابايت');
      return;
    }
    const ok = f.type.startsWith('image/') || f.type === 'application/pdf';
    if (!ok) {
      toast.error('الصيغة غير مدعومة. JPG / PNG / PDF فقط');
      return;
    }
    onChange({ ...value, bankReceiptFile: f, bankReceiptName: f.name });
  };

  const [copied, setCopied] = useState<string | null>(null);
  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success('تم النسخ');
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error('تعذّر النسخ');
    }
  };

  // الترتيب: المحفظة → مدى → Visa → تحويل بنكي → PayPal
  const tabs: { key: PaymentMethod; label: string; sub: string; gradient: string; icon: React.ElementType }[] = [
    { key: 'wallet',        label: 'المحفظة',     sub: 'دفع فوري من الرصيد', gradient: 'from-primary to-primary/70',    icon: WalletIcon },
    { key: 'mada',          label: 'مدى',         sub: 'البطاقات السعودية',  gradient: 'from-emerald-500 to-teal-600',  icon: CreditCard },
    { key: 'visa',          label: 'Visa',        sub: 'بطاقات الفيزا',      gradient: 'from-sky-500 to-indigo-600',    icon: CreditCard },
    { key: 'bank_transfer', label: 'تحويل بنكي',  sub: 'حوالة + إيصال',      gradient: 'from-slate-600 to-slate-800',   icon: Building2 },
    { key: 'paypal',        label: 'PayPal',      sub: 'دفع إلكتروني دولي',  gradient: 'from-amber-500 to-yellow-600',  icon: Mail },
  ];

  const walletEnough = walletBalance >= downPaymentAmount;

  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-background to-muted/20 p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shadow-md">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold flex items-center gap-2">
              وسيلة دفع الدفعة الأولى
              <Lock className="h-3.5 w-3.5 text-emerald-600" />
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              اختر بوابة الدفع، أو حوّل بنكياً، أو ادفع مباشرة من محفظتك.
            </p>
          </div>
        </div>
        {amountLabel && (
          <div className="rounded-lg bg-primary/10 ring-1 ring-primary/30 px-3 py-1.5 text-[11px] font-bold text-primary">
            الدفعة الأولى: {amountLabel}
          </div>
        )}
      </div>

      {/* Tabs — 5 خيارات */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {tabs.map((t) => {
          const active = value.method === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => set('method', t.key)}
              className={cn(
                'relative rounded-xl p-2.5 text-center ring-1 transition-all overflow-hidden group',
                active
                  ? 'ring-primary/50 bg-gradient-to-br ' + t.gradient + ' text-white shadow-lg scale-[1.02]'
                  : 'ring-border bg-background hover:ring-primary/30',
              )}
            >
              <Icon className={cn('h-4 w-4 mx-auto mb-1', active ? 'opacity-95' : 'text-muted-foreground')} />
              <div className="text-xs font-extrabold">{t.label}</div>
              <div className={cn('text-[9px] mt-0.5', active ? 'opacity-90' : 'text-muted-foreground')}>{t.sub}</div>
              {active && (
                <motion.div
                  layoutId="paymentTabIndicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full bg-white/80"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <AnimatePresence mode="wait">
        {/* ============== WALLET ============== */}
        {value.method === 'wallet' && (
          <motion.div
            key="wallet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <WalletIcon className="h-5 w-5" />
                  <span className="text-sm font-bold opacity-90">رصيد محفظتي</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">فوري</span>
              </div>
              <div className="text-3xl font-extrabold tabular-nums">
                {fmt(walletBalance)} <span className="text-base font-bold opacity-80">ر.س</span>
              </div>
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                <span className="opacity-90">المطلوب خصمه:</span>
                <span className="font-bold">{fmt(downPaymentAmount)} ر.س</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="opacity-90">الرصيد بعد الخصم:</span>
                <span className="font-bold">
                  {fmt(Math.max(0, walletBalance - downPaymentAmount))} ر.س
                </span>
              </div>
            </div>

            {!walletEnough ? (
              <div className="rounded-xl bg-rose-500/5 ring-1 ring-rose-500/30 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                    رصيدك لا يكفي للدفعة الأولى
                  </p>
                  <p className="text-[11px] text-rose-600/90 mt-0.5">
                    تحتاج لإضافة <span className="font-bold tabular-nums">{fmt(downPaymentAmount - walletBalance)} ر.س</span>.
                    اشحن محفظتك أولاً، أو اختر وسيلة دفع أخرى.
                  </p>
                  <a
                    href="/wallet/topup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-[11px] font-bold text-primary hover:underline"
                  >
                    <Banknote className="h-3 w-3" /> شحن المحفظة الآن
                  </a>
                </div>
              </div>
            ) : (
              <label className="flex items-start gap-3 rounded-xl bg-emerald-500/5 ring-1 ring-emerald-500/30 p-3 cursor-pointer hover:bg-emerald-500/10 transition-colors">
                <input
                  type="checkbox"
                  checked={value.walletConfirmed}
                  onChange={(e) => set('walletConfirmed', e.target.checked)}
                  className="mt-1 h-4 w-4 accent-emerald-600"
                />
                <div className="flex-1 text-xs leading-relaxed">
                  <p className="font-bold text-emerald-700 dark:text-emerald-300">
                    أوافق على خصم <span className="tabular-nums">{fmt(downPaymentAmount)} ر.س</span> من محفظتي فور موافقة الإدارة على طلب التمويل.
                  </p>
                  <p className="text-emerald-700/80 dark:text-emerald-300/80 mt-1">
                    عند الموافقة، يتم الخصم تلقائياً وتفعيل التمويل دون الحاجة لخطوات إضافية.
                  </p>
                </div>
              </label>
            )}
          </motion.div>
        )}

        {/* ============== BANK TRANSFER ============== */}
        {value.method === 'bank_transfer' && (
          <motion.div
            key="bank"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* بيانات الحساب البنكي */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span className="text-sm font-bold opacity-90">حوّل إلى الحساب التالي</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">آمن</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 bg-white/10 rounded-lg p-2.5">
                  <div className="min-w-0">
                    <div className="text-[10px] opacity-70">البنك</div>
                    <div className="text-xs font-bold truncate">{FINANCING_BANK_INFO.bank}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white/10 rounded-lg p-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] opacity-70">المستفيد</div>
                    <div className="text-xs font-bold truncate">{FINANCING_BANK_INFO.beneficiary}</div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-white hover:bg-white/20"
                    onClick={() => copyText(FINANCING_BANK_INFO.beneficiary, 'ben')}
                  >
                    {copied === 'ben' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white/10 rounded-lg p-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] opacity-70">رقم الآيبان (IBAN)</div>
                    <div dir="ltr" className="text-xs font-mono font-bold tracking-wider truncate text-right">
                      {FINANCING_BANK_INFO.ibanFormatted}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-white hover:bg-white/20"
                    onClick={() => copyText(FINANCING_BANK_INFO.iban, 'iban')}
                  >
                    {copied === 'iban' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-2 bg-white/10 rounded-lg p-2.5">
                  <div className="min-w-0">
                    <div className="text-[10px] opacity-70">المبلغ المطلوب تحويله</div>
                    <div className="text-base font-extrabold tabular-nums">
                      {fmt(downPaymentAmount)} <span className="text-xs opacity-80">ر.س</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-white hover:bg-white/20"
                    onClick={() => copyText(String(downPaymentAmount), 'amount')}
                  >
                    {copied === 'amount' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 text-[11px] opacity-90 leading-relaxed">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  بعد التحويل، أرفق صورة الإيصال أدناه. سيتم تفعيل التمويل خلال ساعة عمل من مطابقة المبلغ.
                </span>
              </div>
            </div>

            {/* تفاصيل التحويل من العميل */}
            <FieldShell
              label="اسم المُحوِّل (كما يظهر في الحوالة)"
              icon={User}
              required
              valid={validation.bankSenderName}
              invalid={value.bankSenderName.length > 0 && !validation.bankSenderName}
              errorMessage="3 حروف على الأقل"
            >
              <Input
                placeholder="الاسم الكامل في كشف الحساب"
                value={value.bankSenderName}
                onChange={(e) => set('bankSenderName', e.target.value)}
                className="border-0 bg-transparent"
              />
            </FieldShell>

            <FieldShell
              label="الرقم المرجعي للحوالة"
              icon={Hash}
              required
              valid={validation.bankReference}
              invalid={value.bankReference.length > 0 && !validation.bankReference}
              errorMessage="أدخل الرقم المرجعي من تطبيق البنك (4 خانات على الأقل)"
              hint="عادةً يظهر في إشعار الحوالة باسم Reference / مرجع العملية"
            >
              <Input
                placeholder="مثال: TXN-1234567890"
                value={value.bankReference}
                onChange={(e) => set('bankReference', e.target.value)}
                className="border-0 bg-transparent font-mono"
              />
            </FieldShell>

            {/* رفع الإيصال */}
            <div>
              <Label className="text-xs sm:text-sm font-bold flex items-center gap-1.5 mb-1.5">
                <span className={cn(
                  'h-6 w-6 rounded-lg flex items-center justify-center ring-1',
                  validation.bankReceipt
                    ? 'bg-emerald-500/10 ring-emerald-500/30 text-emerald-600'
                    : 'bg-muted ring-border text-primary',
                )}>
                  <Receipt className="h-3.5 w-3.5" />
                </span>
                صورة إيصال التحويل
                <span className="text-[9px] font-bold text-rose-600 bg-rose-500/10 ring-1 ring-rose-500/30 px-1.5 py-0.5 rounded-md">مطلوب</span>
              </Label>

              {!value.bankReceiptFile ? (
                <label
                  htmlFor="bank-receipt-upload"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 hover:bg-muted/50 transition-colors p-5 cursor-pointer"
                >
                  <Upload className="h-7 w-7 text-muted-foreground" />
                  <div className="text-xs font-bold">اضغط لرفع الإيصال</div>
                  <div className="text-[10px] text-muted-foreground">JPG / PNG / PDF — حد أقصى 5MB</div>
                  <input
                    id="bank-receipt-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleReceiptFile(e.target.files?.[0])}
                  />
                </label>
              ) : (
                <div className="rounded-xl ring-1 ring-emerald-500/30 bg-emerald-500/5 p-3 flex items-center gap-3">
                  {receiptPreview ? (
                    <img src={receiptPreview} alt="إيصال" className="h-14 w-14 rounded-lg object-cover ring-1 ring-border" />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-background ring-1 ring-border flex items-center justify-center">
                      <FileImage className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{value.bankReceiptName}</div>
                    <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                      <Check className="h-3 w-3" /> تم رفع الإيصال
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onChange({ ...value, bankReceiptFile: null, bankReceiptName: '' })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ============== CARD (mada / visa) ============== */}
        {(value.method === 'mada' || value.method === 'visa') && (
          <motion.div
            key={value.method}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Card preview */}
            <div className={cn(
              'relative h-36 sm:h-40 rounded-2xl p-4 sm:p-5 text-white overflow-hidden shadow-xl bg-gradient-to-br',
              value.method === 'mada' ? 'from-emerald-600 via-teal-700 to-emerald-900' : 'from-sky-600 via-indigo-700 to-purple-900',
            )}>
              <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-12 -right-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                  <div className="h-7 w-10 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 ring-1 ring-white/30" />
                  <span className="text-xs font-bold opacity-90 uppercase tracking-wider">{value.method === 'mada' ? 'مدى' : 'VISA'}</span>
                </div>
                <div className="font-mono text-base sm:text-xl tracking-widest tabular-nums">
                  {value.cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="flex items-end justify-between text-[10px] sm:text-xs">
                  <div>
                    <div className="opacity-70 text-[9px]">حامل البطاقة</div>
                    <div className="font-bold uppercase truncate max-w-[180px]">{value.cardHolder || 'الاسم على البطاقة'}</div>
                  </div>
                  <div>
                    <div className="opacity-70 text-[9px]">انتهاء</div>
                    <div className="font-bold tabular-nums">{value.expiry || 'MM/YY'}</div>
                  </div>
                </div>
              </div>
            </div>

            <FieldShell
              label="رقم البطاقة"
              icon={CreditCard}
              required
              valid={validation.cardNumber}
              invalid={cardDigits.length >= 6 && !validation.cardNumber}
              errorMessage={
                cardDigits.length < 13 ? 'يجب أن يكون 13–19 رقمًا'
                : !luhnValid(cardDigits) ? 'رقم البطاقة غير صحيح (فشل التحقق)'
                : value.method === 'visa' && !isVisa(cardDigits) ? 'هذه البطاقة لا تنتمي إلى Visa — تأكد من التبويب الصحيح'
                : value.method === 'mada' && !isMada(cardDigits) ? 'هذه البطاقة ليست من شبكة مدى السعودية'
                : undefined
              }
              hint="مثال: 4242 4242 4242 4242"
            >
              <Input
                inputMode="numeric"
                autoComplete="cc-number"
                dir="ltr"
                placeholder="0000 0000 0000 0000"
                value={value.cardNumber}
                onChange={(e) => set('cardNumber', maskCardNumber(e.target.value))}
                className="border-0 bg-transparent font-mono tracking-widest tabular-nums"
              />
            </FieldShell>

            <FieldShell
              label="الاسم على البطاقة"
              icon={User}
              required
              valid={validation.cardHolder}
              invalid={value.cardHolder.length > 0 && !validation.cardHolder}
              errorMessage="3 حروف على الأقل — حروف عربية أو لاتينية فقط"
            >
              <Input
                autoComplete="cc-name"
                placeholder="كما هو مكتوب على البطاقة"
                value={value.cardHolder}
                onChange={(e) => set('cardHolder', e.target.value.toUpperCase())}
                className="border-0 bg-transparent uppercase"
              />
            </FieldShell>

            <div className="grid grid-cols-2 gap-3">
              <FieldShell
                label="تاريخ الانتهاء"
                icon={Calendar}
                required
                valid={validation.expiry}
                invalid={value.expiry.length >= 5 && !validation.expiry}
                errorMessage="تاريخ غير صالح أو منتهٍ"
                hint="MM/YY"
              >
                <Input
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  dir="ltr"
                  placeholder="MM/YY"
                  value={value.expiry}
                  onChange={(e) => set('expiry', maskExpiry(e.target.value))}
                  className="border-0 bg-transparent font-mono tabular-nums text-center"
                />
              </FieldShell>
              <FieldShell
                label="CVV"
                icon={Hash}
                required
                valid={validation.cvv}
                invalid={value.cvv.length > 0 && !validation.cvv}
                errorMessage="3 أرقام (4 لـ Amex)"
                hint="خلف البطاقة"
              >
                <Input
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  dir="ltr"
                  placeholder="•••"
                  value={value.cvv}
                  onChange={(e) => set('cvv', maskCVV(e.target.value))}
                  className="border-0 bg-transparent font-mono text-center tracking-[0.4em]"
                />
              </FieldShell>
            </div>
          </motion.div>
        )}

        {/* ============== PAYPAL ============== */}
        {value.method === 'paypal' && (
          <motion.div
            key="paypal"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <div className="rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 text-white p-5 shadow-xl">
              <div className="text-xs opacity-90">سيتم تحويلك إلى</div>
              <div className="text-2xl font-extrabold mt-1">PayPal</div>
              <p className="text-[11px] opacity-95 mt-2 leading-relaxed">
                بعد موافقة الإدارة على طلبك، سنرسل رابط دفع آمن إلى بريدك المسجّل في PayPal لإكمال الدفعة الأولى.
              </p>
            </div>
            <FieldShell
              label="بريد PayPal"
              icon={Mail}
              required
              valid={validation.paypalEmail}
              invalid={value.paypalEmail.length > 0 && !validation.paypalEmail}
              errorMessage="بريد إلكتروني غير صالح"
              hint="مثال: name@example.com"
            >
              <Input
                type="email"
                dir="ltr"
                placeholder="name@example.com"
                value={value.paypalEmail}
                onChange={(e) => set('paypalEmail', e.target.value)}
                className="border-0 bg-transparent"
              />
            </FieldShell>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security note */}
      <div className="flex items-start gap-2 rounded-lg bg-emerald-500/5 ring-1 ring-emerald-500/20 p-2.5">
        <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <p className="text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
          {value.method === 'wallet'
            ? 'الخصم من المحفظة فوري وآمن، ويتم تسجيله في سجل معاملاتك.'
            : value.method === 'bank_transfer'
            ? 'يتم التحقق من الحوالة يدوياً خلال ساعة عمل، ثم يُفعَّل التمويل تلقائياً.'
            : 'جميع المدفوعات تتم عبر بوابة دفع PCI-DSS مشفرة. لا تُحفظ بيانات بطاقتك على خوادم Master PayLater.'}
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodSection;
