import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BarChart3, BookOpenCheck, BrainCircuit, Languages, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const systems = [
  { id: "research", label: "البحث", detail: "تحديد الفكرة وجمع المراجع العلمية الموثوقة", icon: ScanSearch, tone: "primary" },
  { id: "translation", label: "الترجمة", detail: "معالجة المحتوى والمصطلحات بدقة أكاديمية", icon: Languages, tone: "secondary" },
  { id: "analysis", label: "التحليل", detail: "تحليل البيانات واستخراج النتائج والمؤشرات", icon: BarChart3, tone: "accent" },
  { id: "review", label: "التدقيق", detail: "مراجعة اللغة والمنهج والتوثيق العلمي", icon: BrainCircuit, tone: "warning" },
  { id: "publishing", label: "النشر", detail: "تهيئة البحث واختيار المجلة المناسبة للنشر", icon: BookOpenCheck, tone: "success" },
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
  const [activeId, setActiveId] = useState<(typeof systems)[number]["id"]>("research");
  const active = systems.find((system) => system.id === activeId) ?? systems[0];
  const ActiveIcon = active.icon;

  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:rounded-[2rem]"
      aria-label="منظومة FekrahEdu الأكاديمية التفاعلية"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-accent/10" />
      <div className="relative z-10 flex h-full flex-col px-4 py-5 sm:px-6 sm:py-7">
        <div className="text-center">
          <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            منظومة FekrahEdu الأكاديمية
          </div>
          <h2 className="text-lg font-bold text-foreground sm:text-2xl">من الفكرة إلى النشر</h2>
          <p className="mt-1 text-[11px] text-muted-foreground sm:text-sm">مسار واحد يربط جميع مراحل عملك الأكاديمي</p>
        </div>

        <div className="relative my-5 grid grid-cols-5 gap-1 sm:my-8 sm:gap-2" role="list" aria-label="مراحل العمل الأكاديمي">
          <div className="absolute left-[8%] right-[8%] top-6 h-1 rounded-full bg-muted sm:top-7" aria-hidden="true">
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
                    "mx-auto h-12 w-12 rounded-full border-2 shadow-md transition-all sm:h-14 sm:w-14",
                    toneClasses[system.tone],
                    selected && "scale-110 ring-4 ring-background shadow-xl",
                  )}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <span className="mt-2 block text-[9px] font-bold leading-3 text-foreground sm:text-xs">{index + 1}. {system.label}</span>
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
            className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center rounded-lg border border-border bg-background/90 p-4 text-center shadow-lg backdrop-blur-sm sm:p-6"
          >
            <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-lg border sm:h-14 sm:w-14", toneClasses[active.tone])}>
              <ActiveIcon className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <p className="text-sm font-bold text-foreground sm:text-lg">مرحلة {active.label}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{active.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}