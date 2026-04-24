import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  PenLine,
  Lock,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface AcknowledgmentClause {
  id: string;
  text: string;
  /** يجعل البند يظهر بنبرة تحذيرية حمراء */
  critical?: boolean;
}

interface AcknowledgmentDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { fullName: string; signedAt: string; clauses: string[] }) => Promise<void> | void;
  title: string;
  subtitle?: string;
  /** أيقونة كبيرة في الترويسة (lucide component) */
  Icon?: React.ComponentType<{ className?: string }>;
  /** اللون الأساسي للهيدر — يقبل tailwind class names */
  accent?: 'primary' | 'amber' | 'rose' | 'emerald';
  clauses: AcknowledgmentClause[];
  /** نص الإقرار الإنساني/التحذيري قبل البنود */
  prologue?: string;
  /** نص الزر النهائي */
  ctaLabel?: string;
  /** اسم المستخدم الكامل للتعبئة المسبقة */
  defaultFullName?: string;
}

const ACCENT_MAP = {
  primary: {
    grad: 'from-primary via-primary to-primary/70',
    ring: 'ring-primary/40',
    chip: 'bg-primary/15 text-primary',
    btn: 'bg-primary hover:bg-primary/90 text-primary-foreground',
  },
  amber: {
    grad: 'from-amber-500 via-amber-500 to-orange-500',
    ring: 'ring-amber-500/40',
    chip: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    btn: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  rose: {
    grad: 'from-rose-600 via-rose-600 to-red-600',
    ring: 'ring-rose-500/40',
    chip: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
    btn: 'bg-rose-600 hover:bg-rose-700 text-white',
  },
  emerald: {
    grad: 'from-emerald-600 via-emerald-600 to-teal-600',
    ring: 'ring-emerald-500/40',
    chip: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
} as const;

const AcknowledgmentDialog: React.FC<AcknowledgmentDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  subtitle,
  Icon = ShieldCheck,
  accent = 'primary',
  clauses,
  prologue,
  ctaLabel = 'أقرّ وأوقّع رقمياً',
  defaultFullName = '',
}) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [fullName, setFullName] = useState(defaultFullName);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'read' | 'sign' | 'done'>('read');

  useEffect(() => {
    if (open) {
      setChecked({});
      setFullName(defaultFullName);
      setSubmitting(false);
      setStep('read');
    }
  }, [open, defaultFullName]);

  const a = ACCENT_MAP[accent];
  const allChecked = clauses.every((c) => checked[c.id]);
  const canSign = allChecked && fullName.trim().length >= 4;

  const handleConfirm = async () => {
    if (!canSign) return;
    setSubmitting(true);
    try {
      await onConfirm({
        fullName: fullName.trim(),
        signedAt: new Date().toISOString(),
        clauses: clauses.map((c) => c.text),
      });
      setStep('done');
      setTimeout(() => onClose(), 1800);
    } catch (e) {
      // المُستدعي يتولى عرض الخطأ
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md"
          onClick={() => !submitting && onClose()}
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-border/60 flex flex-col"
          >
            {/* Header */}
            <div className={cn('relative overflow-hidden bg-gradient-to-br text-white', a.grad)}>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-white/15 blur-3xl"
              />
              <motion.div
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-white/10 blur-3xl"
              />
              <button
                onClick={() => !submitting && onClose()}
                disabled={submitting}
                className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition disabled:opacity-50"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="relative p-5 sm:p-6 flex items-start gap-4">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260 }}
                  className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl bg-white/20 backdrop-blur-xl ring-1 ring-white/30 flex items-center justify-center shadow-xl"
                >
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80 mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> نظام الإقرارات الرقمية
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold leading-tight">{title}</h2>
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-white/85 mt-1.5 leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Stepper */}
              <div className="relative px-5 sm:px-6 pb-4 flex items-center gap-2">
                {(['read', 'sign', 'done'] as const).map((s, idx) => {
                  const active = step === s;
                  const done = (step === 'sign' && s === 'read') || (step === 'done' && s !== 'done');
                  const labels = { read: 'قراءة البنود', sign: 'التوقيع', done: 'تم التوثيق' };
                  return (
                    <React.Fragment key={s}>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 transition-all',
                            active
                              ? 'bg-white text-foreground ring-white scale-110 shadow-lg'
                              : done
                                ? 'bg-emerald-400 text-emerald-900 ring-emerald-300'
                                : 'bg-white/15 text-white/70 ring-white/20',
                          )}
                        >
                          {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                        </div>
                        <span className="text-[10px] sm:text-xs text-white/90">{labels[s]}</span>
                      </div>
                      {idx < 2 && <div className="flex-1 h-px bg-white/20" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              <AnimatePresence mode="wait">
                {step === 'done' ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                      className="h-20 w-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4"
                    >
                      <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    </motion.div>
                    <h3 className="text-xl font-extrabold mb-2">تم توثيق الإقرار رقمياً ✓</h3>
                    <p className="text-sm text-muted-foreground">
                      تم تسجيل بصمتك القانونية في سجلّ الإقرارات الرسمي.
                    </p>
                  </motion.div>
                ) : step === 'read' ? (
                  <motion.div
                    key="read"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {prologue && (
                      <div className={cn('rounded-2xl p-4 ring-1', a.chip, a.ring)}>
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                          <p className="text-sm leading-relaxed font-medium">{prologue}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2.5">
                      {clauses.map((c, idx) => (
                        <motion.label
                          key={c.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          htmlFor={`ack-${c.id}`}
                          className={cn(
                            'flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all hover:bg-muted/50',
                            checked[c.id]
                              ? 'border-emerald-500/50 bg-emerald-500/5'
                              : c.critical
                                ? 'border-rose-500/40 bg-rose-500/5'
                                : 'border-border',
                          )}
                        >
                          <Checkbox
                            id={`ack-${c.id}`}
                            checked={!!checked[c.id]}
                            onCheckedChange={(v) =>
                              setChecked((prev) => ({ ...prev, [c.id]: !!v }))
                            }
                            className="mt-0.5"
                          />
                          <span
                            className={cn(
                              'text-xs sm:text-sm leading-relaxed flex-1',
                              c.critical && !checked[c.id] && 'font-semibold',
                            )}
                          >
                            {c.text}
                          </span>
                        </motion.label>
                      ))}
                    </div>

                    <Button
                      type="button"
                      size="lg"
                      disabled={!allChecked}
                      onClick={() => setStep('sign')}
                      className={cn('w-full font-bold gap-2', a.btn)}
                    >
                      <PenLine className="h-4 w-4" />
                      المتابعة إلى التوقيع
                      {!allChecked && (
                        <span className="text-[10px] opacity-80 mr-1">
                          (يجب الموافقة على جميع البنود)
                        </span>
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sign"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="rounded-2xl p-4 bg-muted/40 border border-border/60">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Lock className="h-3.5 w-3.5" /> توقيع رقمي معتمد بنظام التعاملات الإلكترونية
                      </div>
                      <p className="text-xs leading-relaxed">
                        بكتابة اسمك الكامل أدناه فإنك تُقرّ بأن هذا التوقيع له ذات الحجّية القانونية
                        للتوقيع اليدوي وفق المرسوم الملكي م/18، وسيتم ربطه ببصمة جهازك (IP، الطابع
                        الزمني، بصمة المتصفح، رقم الهوية المسجّل في حسابك).
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="ack-name" className="mb-1.5 block">
                        الاسم الرباعي كما في الهوية الوطنية *
                      </Label>
                      <Input
                        id="ack-name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثال: محمد علي عبدالله الشهري"
                        className="font-semibold text-center text-lg tracking-wide h-12"
                        dir="rtl"
                      />
                    </div>

                    {fullName.trim().length >= 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-dashed border-primary/30"
                      >
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                          معاينة التوقيع
                        </div>
                        <div
                          className="text-2xl text-primary"
                          style={{ fontFamily: 'cursive', letterSpacing: '0.05em' }}
                        >
                          {fullName.trim()}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-2 flex items-center gap-2">
                          <span>التاريخ: {new Date().toLocaleString('ar-SA')}</span>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep('read')}
                        disabled={submitting}
                        className="flex-1"
                      >
                        رجوع
                      </Button>
                      <Button
                        type="button"
                        size="lg"
                        disabled={!canSign || submitting}
                        onClick={handleConfirm}
                        className={cn('flex-1 font-bold gap-2', a.btn)}
                      >
                        {submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                        {ctaLabel}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AcknowledgmentDialog;
