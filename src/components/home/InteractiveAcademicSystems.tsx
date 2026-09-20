import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BadgeDollarSign,
  ClipboardCheck,
  FileCheck2,
  Headphones,
  Play,
  RotateCw,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const systems = [
  { id: "send", label: "أرسل طلبك", detail: "اختر الخدمة وأرسل تفاصيل طلبك.", icon: Send, tone: "primary" },
  { id: "review", label: "مراجعة الطلب", detail: "فريق فِكرة يراجع احتياجك ومتطلباتك.", icon: ClipboardCheck, tone: "secondary" },
  { id: "estimate", label: "تقييم السعر والموعد والدفع", detail: "نوضح لك التكلفة والمدة وخيارات الدفع.", icon: BadgeDollarSign, tone: "accent" },
  { id: "start", label: "بدء التنفيذ", detail: "يبدأ المختصون بتنفيذ طلبك وفق المتطلبات المتفق عليها.", icon: Play, tone: "warning" },
  { id: "quality", label: "المراجعة والتدقيق", detail: "مراجعة العمل والتأكد من مطابقته للطلب.", icon: ShieldCheck, tone: "success" },
  { id: "delivery", label: "التسليم", detail: "يصلك طلبك جاهزًا عبر المنصة.", icon: FileCheck2, tone: "primary" },
  { id: "support", label: "الدعم والمتابعة", detail: "نبقى معك لأي استفسار أو تعديل وفق الخدمة وحسب الاتفاق.", icon: Headphones, tone: "secondary" },
] as const;

const toneClasses = {
  primary: "bg-primary/10 text-primary border-primary/30",
  secondary: "bg-secondary/10 text-secondary border-secondary/30",
  accent: "bg-accent/15 text-accent-foreground border-accent/40",
  warning: "bg-warning/15 text-warning border-warning/40",
  success: "bg-success/15 text-success border-success/40",
};

export function InteractiveAcademicSystems() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<(typeof systems)[number]["id"]>("send");
  const active = systems.find((system) => system.id === activeId) ?? systems[0];
  const ActiveIcon = active.icon;

  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:rounded-[2rem]"
      aria-label="مراحل تنفيذ طلبك مع فِكرة"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-accent/10" />
      <div className="relative z-10 flex h-full flex-col px-4 py-5 sm:px-6 sm:py-7">
        <div className="text-center">
          <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary sm:text-xs">
            <RotateCw className="h-3.5 w-3.5" />
            مسار واضح وآمن
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-2xl">مراحل تنفيذ طلبك مع فِكرة</h2>
          <p className="mt-1 text-[11px] text-muted-foreground sm:text-sm">من استلام التفاصيل حتى التسليم والدعم</p>
        </div>

        <div className="relative my-4 grid grid-cols-7 gap-1 sm:my-6 sm:gap-2" role="list" aria-label="مراحل تنفيذ الطلب">
          <div className="absolute left-[6%] right-[6%] top-5 h-1 rounded-full bg-muted sm:top-6" aria-hidden="true">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-primary via-accent to-success"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reduceMotion ? 0 : 1.8, ease: "easeOut" }}
            />
          </div>
          {systems.map((system, index) => {
            const Icon = system.icon;
            const selected = system.id === activeId;
            return (
              <div key={system.id} className="relative z-10 min-w-0 text-center" role="listitem">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-pressed={selected}
                  aria-label={`${index + 1}. ${system.label}`}
                  onClick={() => setActiveId(system.id)}
                  className={cn(
                    "mx-auto h-9 w-9 rounded-full border-2 shadow-md transition-all sm:h-12 sm:w-12",
                    toneClasses[system.tone],
                    selected && "scale-110 ring-4 ring-background shadow-xl",
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <span className="mt-2 block text-[8px] font-bold leading-3 text-foreground sm:text-[10px]">{index + 1}</span>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center rounded-lg border border-border bg-background/90 p-4 text-center shadow-lg backdrop-blur-sm sm:p-5"
          >
            <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-lg border sm:h-14 sm:w-14", toneClasses[active.tone])}>
              <ActiveIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <p className="text-sm font-bold text-foreground sm:text-lg">{systems.findIndex((system) => system.id === active.id) + 1}. {active.label}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{active.detail}</p>
          </motion.div>
        </AnimatePresence>

        <p className="mt-3 text-center text-[10px] font-semibold text-primary sm:text-xs">
          فِكرة — من طلبك إلى إنجازه، بخطوات واضحة وآمنة.
        </p>
      </div>
    </div>
  );
}