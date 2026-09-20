import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeDollarSign,
  Check,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Headphones,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stages = [
  { id: "send", label: "أرسل طلبك", detail: "اختر الخدمة وأرسل تفاصيل طلبك.", icon: Send },
  { id: "review", label: "مراجعة الطلب", detail: "فريق فِكرة يراجع احتياجك ومتطلباتك.", icon: ClipboardCheck },
  { id: "estimate", label: "تقييم السعر والموعد والدفع", detail: "نوضح لك التكلفة والمدة وخيارات الدفع.", icon: BadgeDollarSign },
  { id: "start", label: "بدء التنفيذ", detail: "يبدأ المختصون بتنفيذ طلبك وفق المتطلبات المتفق عليها.", icon: Play },
  { id: "quality", label: "المراجعة والتدقيق", detail: "مراجعة العمل والتأكد من مطابقته للطلب.", icon: ShieldCheck },
  { id: "delivery", label: "التسليم", detail: "يصلك طلبك جاهزًا عبر المنصة.", icon: FileCheck2 },
  { id: "support", label: "الدعم والمتابعة", detail: "نبقى معك لأي استفسار أو تعديل وفق الخدمة وحسب الاتفاق.", icon: Headphones },
] as const;

export function InteractiveAcademicSystems() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = stages[activeIndex] ?? stages[0];
  const ActiveIcon = active.icon;
  const progress = ((activeIndex + 1) / stages.length) * 100;

  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % stages.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="absolute inset-0 z-10 overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-strong sm:rounded-[2rem]"
      aria-label="مراحل تنفيذ طلبك مع فِكرة"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" aria-hidden="true" />
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-primary/10" aria-hidden="true" />
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-primary/10" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-3">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold text-primary sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              تتبّع طلبك لحظة بلحظة
            </div>
            <h2 className="text-lg font-bold leading-snug text-foreground sm:text-2xl">مراحل تنفيذ طلبك مع فِكرة</h2>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-success/25 bg-success/10 px-2.5 py-1.5 text-[10px] font-bold text-success sm:text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            نشط
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-border bg-background/80 p-3 shadow-sm backdrop-blur-sm sm:p-4">
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold sm:text-xs">
            <span className="text-foreground">تقدّم الطلب</span>
            <motion.span key={activeIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary">
              {activeIndex + 1} من {stages.length}
            </motion.span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-primary via-secondary to-success"
              animate={{ width: `${progress}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="relative my-4 grid grid-cols-7 gap-1" role="list" aria-label="المراحل السبع">
          <div className="absolute left-[5%] right-[5%] top-[18px] h-px bg-border sm:top-[22px]" aria-hidden="true" />
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index === activeIndex;
            const isComplete = index < activeIndex;
            return (
              <div key={stage.id} className="relative z-10 flex justify-center" role="listitem">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${index + 1}. ${stage.label}`}
                  aria-pressed={isActive}
                  className={cn(
                    "relative h-9 w-9 rounded-full border bg-background p-0 shadow-sm transition-all sm:h-11 sm:w-11",
                    isComplete && "border-success bg-success text-success-foreground",
                    isActive && "scale-110 border-primary bg-primary text-primary-foreground ring-4 ring-primary/15 shadow-medium",
                    !isActive && !isComplete && "text-muted-foreground hover:border-primary/40 hover:text-primary",
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : <Icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                  {isActive && !reduceMotion && (
                    <motion.span
                      className="absolute -inset-1 rounded-full border border-primary/40"
                      animate={{ scale: [1, 1.22], opacity: [0.7, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.32 }}
            className="relative flex min-h-0 flex-1 items-center gap-4 overflow-hidden rounded-lg border border-primary/15 bg-background p-4 shadow-medium sm:p-5"
          >
            <motion.div
              initial={reduceMotion ? false : { rotate: -12, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-medium sm:h-16 sm:w-16"
            >
              <ActiveIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{activeIndex + 1}</span>
                <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <Clock3 className="h-3 w-3" /> المرحلة الحالية
                </span>
              </div>
              <h3 className="text-sm font-bold leading-snug text-foreground sm:text-lg">{active.label}</h3>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-sm sm:leading-6">{active.detail}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="mt-3 text-center text-[10px] font-semibold text-primary sm:text-xs">
          فِكرة — من طلبك إلى إنجازه، بخطوات واضحة وآمنة.
        </p>
      </div>
    </motion.div>
  );
}