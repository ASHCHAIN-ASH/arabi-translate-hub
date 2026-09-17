import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BarChart3, BookOpenCheck, BrainCircuit, Languages, Network, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const systems = [
  { id: "research", label: "البحث الذكي", detail: "استكشاف المراجع وبناء المسار البحثي", icon: ScanSearch, x: 50, y: 12 },
  { id: "analysis", label: "تحليل البيانات", detail: "قراءة النتائج واستخراج المؤشرات", icon: BarChart3, x: 84, y: 31 },
  { id: "publishing", label: "النشر العلمي", detail: "تهيئة البحث لمتطلبات المجلات", icon: BookOpenCheck, x: 79, y: 72 },
  { id: "review", label: "التدقيق الأكاديمي", detail: "مراجعة لغوية ومنهجية متكاملة", icon: BrainCircuit, x: 21, y: 72 },
  { id: "translation", label: "الترجمة المتخصصة", detail: "نقل علمي دقيق يحافظ على المصطلحات", icon: Languages, x: 16, y: 31 },
] as const;

const connections = [
  { x1: 50, y1: 12, x2: 84, y2: 31 },
  { x1: 84, y1: 31, x2: 79, y2: 72 },
  { x1: 79, y1: 72, x2: 21, y2: 72 },
  { x1: 21, y1: 72, x2: 16, y2: 31 },
  { x1: 16, y1: 31, x2: 50, y2: 12 },
];

export function InteractiveAcademicSystems() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<(typeof systems)[number]["id"]>("research");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const active = systems.find((system) => system.id === activeId) ?? systems[0];
  const ActiveIcon = active.icon;

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -5,
      y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 5,
    });
  };

  return (
    <motion.div
      className="absolute inset-0 z-10 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-2xl sm:rounded-[2rem]"
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 140, damping: 22 }}
      style={{ transformPerspective: 900 }}
      aria-label="منظومة FekrahEdu الأكاديمية التفاعلية"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:32px_32px]" />

      <motion.div
        className="absolute inset-[10%] rounded-full border border-primary/15"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 36, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-[20%] rounded-full border border-dashed border-accent/25"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      />

      <svg className="pointer-events-none absolute inset-0 h-full w-full text-primary/25" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {systems.map((system) => (
          <motion.line
            key={`center-${system.id}`}
            x1="50" y1="45" x2={system.x} y2={system.y}
            stroke="currentColor" strokeWidth="0.45" strokeDasharray="2 2" vectorEffect="non-scaling-stroke"
            animate={reduceMotion ? undefined : { strokeDashoffset: [0, -8] }}
            transition={{ duration: 2.4, ease: "linear", repeat: Infinity }}
          />
        ))}
        {connections.map((line, index) => (
          <line key={index} {...line} stroke="currentColor" strokeWidth="0.28" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>

      {systems.map((system, index) => {
        const Icon = system.icon;
        const selected = system.id === activeId;
        return (
          <motion.div
            key={system.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${system.x}%`, top: `${system.y}%` }}
            animate={reduceMotion ? undefined : { y: [0, index % 2 ? -5 : 5, 0] }}
            transition={{ duration: 3.4 + index * 0.25, ease: "easeInOut", repeat: Infinity }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant={selected ? "default" : "outline"}
                  aria-pressed={selected}
                  aria-label={system.label}
                  onClick={() => setActiveId(system.id)}
                  className={cn(
                    "relative h-12 w-12 rounded-full border-2 shadow-lg sm:h-14 sm:w-14",
                    selected ? "border-primary-foreground/30 shadow-primary" : "border-border bg-background/90 backdrop-blur-md",
                  )}
                >
                  {selected && (
                    <motion.span
                      className="absolute -inset-2 rounded-full border border-primary/40"
                      animate={reduceMotion ? undefined : { scale: [0.9, 1.25], opacity: [0.7, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  )}
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{system.label}</TooltipContent>
            </Tooltip>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute left-1/2 top-[45%] z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/25 bg-background/90 p-3 shadow-2xl backdrop-blur-xl sm:h-40 sm:w-40"
        animate={reduceMotion ? undefined : { scale: [1, 1.025, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reduceMotion ? undefined : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.85 }}
            className="text-center"
          >
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-12 sm:w-12">
              <ActiveIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <p className="text-xs font-bold text-foreground sm:text-sm">{active.label}</p>
            <p className="mt-1 hidden text-[10px] leading-4 text-muted-foreground sm:block">{active.detail}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="absolute bottom-4 left-4 right-4 z-20 rounded-lg border border-border bg-background/90 px-3 py-2 shadow-lg backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:px-4 sm:py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <Network className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 text-right">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-bold text-foreground sm:text-sm">منظومة أكاديمية مترابطة</p>
              <span className="flex items-center gap-1 text-[10px] font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> متصلة
              </span>
            </div>
            <p className="truncate text-[10px] text-muted-foreground sm:text-xs">اختر أي نظام لاستكشاف دوره</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}