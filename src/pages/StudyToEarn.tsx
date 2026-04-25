import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Target, Sparkles, Trophy, RotateCcw, ArrowLeft, PlayCircle, Flame, Lock, CheckCircle2 } from "lucide-react";

/**
 * Study-to-Earn — Viral Landing Page
 * - Dark cinematic hero with particles + glow
 * - Gate experience: 3-stage micro challenge (focus, speed, commitment)
 * - Inline result + CTA, no long forms, no distractions
 */

type Stage = "intro" | "focus" | "speed" | "commitment" | "result";

const SEOHead = () => {
  useEffect(() => {
    document.title = "Study-to-Earn | هل تستحق أن تُدفع لك مقابل المذاكرة؟";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "اختبر تركيزك وسرعتك والتزامك في 30 ثانية. ليس الجميع يستحق الدخول إلى نظام Study-to-Earn."
    );
    let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canon) {
      canon = document.createElement("link");
      canon.rel = "canonical";
      document.head.appendChild(canon);
    }
    canon.href = window.location.origin + "/study-to-earn";
  }, []);
  return null;
};

// ---------- Particles background ----------
const Particles = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 10,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* radial glow */}
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/30 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-secondary/20 blur-[160px]" />
      <div className="absolute top-1/3 left-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[140px]" />
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-secondary/60 shadow-[0_0_12px_hsl(var(--secondary))]"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -40, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: d.duration, repeat: Infinity, delay: d.delay, ease: "easeInOut" }}
        />
      ))}
      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--secondary)/.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)/.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

// ---------- Stage 1: Focus countdown ----------
const FocusStage = ({ onPass, onFail }: { onPass: () => void; onFail: () => void }) => {
  const [count, setCount] = useState(3);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startedAt = useRef<number | null>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c > 0 ? c - 1 : 0)), 700);
    return () => clearInterval(t);
  }, []);

  const start = () => {
    setHolding(true);
    startedAt.current = performance.now();
    const tick = () => {
      if (!startedAt.current) return;
      const elapsed = performance.now() - startedAt.current;
      const p = Math.min(100, (elapsed / 3000) * 100);
      setProgress(p);
      if (p >= 100) {
        onPass();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };
  const release = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (progress < 100) {
      onFail();
    }
  };

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs text-secondary">
        <Brain className="h-3.5 w-3.5" /> المرحلة 1 — التركيز
      </div>
      <h3 className="mt-6 text-2xl md:text-3xl font-bold text-white">
        اضغط مطوّلًا لمدة 3 ثوانٍ بدون أن ترفع إصبعك
      </h3>
      <p className="mt-3 text-white/60">إثبات بسيط أن تركيزك حاضر.</p>

      <div className="mt-10 flex flex-col items-center gap-6">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="text-7xl font-black text-secondary drop-shadow-[0_0_30px_hsl(var(--secondary)/0.6)]"
          >
            {count}
          </motion.div>
        ) : (
          <>
            <button
              onMouseDown={start}
              onTouchStart={start}
              onMouseUp={release}
              onMouseLeave={() => holding && release()}
              onTouchEnd={release}
              className="relative h-40 w-40 select-none rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-[0_0_50px_hsl(var(--primary)/0.6)] transition-transform active:scale-95"
            >
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                {holding ? `${Math.round(progress)}%` : "اضغط هنا"}
              </span>
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="hsl(var(--secondary)/0.2)" strokeWidth="4" />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="4"
                  strokeDasharray={`${(progress / 100) * 289} 289`}
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <p className="text-xs text-white/50">إن رفعت إصبعك قبل اكتمال الدائرة، تفشل المرحلة.</p>
          </>
        )}
      </div>
    </div>
  );
};

// ---------- Stage 2: Speed pick ----------
const SpeedStage = ({ onPass, onFail }: { onPass: () => void; onFail: () => void }) => {
  const target = useMemo(() => 1 + Math.floor(Math.random() * 9), []);
  const [timeLeft, setTimeLeft] = useState(5);
  const buttons = useMemo(() => {
    const set = new Set<number>([target]);
    while (set.size < 6) set.add(1 + Math.floor(Math.random() * 9));
    return Array.from(set).sort(() => Math.random() - 0.5);
  }, [target]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFail();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onFail]);

  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary-foreground">
        <Zap className="h-3.5 w-3.5" /> المرحلة 2 — السرعة
      </div>
      <h3 className="mt-6 text-2xl md:text-3xl font-bold text-white">
        اضغط الرقم <span className="text-secondary">{target}</span> قبل انتهاء الوقت
      </h3>
      <div className="mt-2 text-sm text-white/60">الوقت المتبقي: <span className="font-bold text-secondary">{timeLeft}s</span></div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
        {buttons.map((n) => (
          <motion.button
            key={n}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (n === target ? onPass() : onFail())}
            className="aspect-square rounded-2xl border border-white/10 bg-white/5 text-3xl font-black text-white backdrop-blur transition-colors hover:border-secondary/50 hover:bg-secondary/10"
          >
            {n}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// ---------- Stage 3: Commitment ----------
const CommitmentStage = ({ onPass, onFail }: { onPass: () => void; onFail: () => void }) => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs text-white">
        <Target className="h-3.5 w-3.5" /> المرحلة 3 — الالتزام
      </div>
      <h3 className="mt-6 text-2xl md:text-3xl font-bold text-white">
        هل أنت مستعد للمذاكرة 30 دقيقة يوميًا بدون استثناء؟
      </h3>
      <p className="mt-3 text-white/60">إجابتك تحدّد إن كنت تستحق الدخول.</p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onPass}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-secondary to-secondary/70 px-8 py-4 font-bold text-secondary-foreground shadow-[0_0_40px_hsl(var(--secondary)/0.5)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Flame className="h-5 w-5" /> نعم، أنا ملتزم
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onFail}
          className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-medium text-white/70 backdrop-blur hover:bg-white/10"
        >
          لست متأكدًا بعد
        </motion.button>
      </div>
    </div>
  );
};

// ---------- Result ----------
const ResultStage = ({ passed, onRetry }: { passed: boolean; onRetry: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      {passed ? (
        <>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary shadow-[0_0_60px_hsl(var(--secondary)/0.7)]"
          >
            <Trophy className="h-14 w-14 text-white" />
          </motion.div>
          <h3 className="mt-8 text-3xl md:text-4xl font-black text-white">
            تم قبولك في النظام ✨
          </h3>
          <p className="mt-3 text-white/70 max-w-md mx-auto">
            أنت من القلّة التي تستحق أن تُدفع لها مقابل المذاكرة. الخطوة التالية تنتظرك.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/spin-the-wheel">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-secondary via-secondary to-primary px-8 py-6 text-base font-bold text-secondary-foreground shadow-[0_0_50px_hsl(var(--secondary)/0.6)] hover:shadow-[0_0_70px_hsl(var(--secondary)/0.8)]"
                >
                  🚀 ابدأ التحدي الآن
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" /> أعد التحدي
            </button>
          </div>

          {/* confetti dots */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-2 w-2 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: "40%",
                  background: i % 2 ? "hsl(var(--secondary))" : "hsl(var(--primary))",
                }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{ y: 400, opacity: 0, rotate: 360 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur"
          >
            <Lock className="h-14 w-14 text-white/60" />
          </motion.div>
          <h3 className="mt-8 text-3xl md:text-4xl font-black text-white">
            أنت لست جاهز بعد…
          </h3>
          <p className="mt-3 text-white/60 max-w-md mx-auto">
            لا بأس. القمم لا تُفتح إلا لمن يصرّ. حاول مرة أخرى عندما تكون مستعدًا فعلًا.
          </p>
          <button
            onClick={onRetry}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-4 font-bold text-white backdrop-blur hover:bg-white/20"
          >
            <RotateCcw className="h-5 w-5" /> حاول مرة أخرى
          </button>
        </>
      )}
    </motion.div>
  );
};

// ---------- Main page ----------
const StudyToEarn = () => {
  const [stage, setStage] = useState<Stage>("intro");
  const [passed, setPassed] = useState(false);
  const gateRef = useRef<HTMLDivElement>(null);

  const startGate = () => {
    setStage("focus");
    setTimeout(() => gateRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const reset = () => {
    setStage("intro");
    setPassed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finish = (didPass: boolean) => {
    setPassed(didPass);
    setStage("result");
  };

  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-[#070815] text-white">
      <SEOHead />
      <Particles />

      {/* HERO */}
      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-medium text-secondary backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" /> Study-to-Earn — ليس الجميع يستحق الدخول
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-8 text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
          >
            هل تستحق أن{" "}
            <span className="bg-gradient-to-r from-secondary via-yellow-300 to-secondary bg-clip-text text-transparent drop-shadow-[0_0_40px_hsl(var(--secondary)/0.5)]">
              تُدفع لك
            </span>{" "}
            مقابل المذاكرة؟
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-white/70"
          >
            لا تحتاج تسجيلًا. لا تحتاج فورمًا طويلًا. كل ما تحتاجه هو 30 ثانية لتُثبت أنك تستحق الدخول.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button
                onClick={startGate}
                size="lg"
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-secondary to-yellow-400 px-10 py-7 text-lg font-black text-secondary-foreground shadow-[0_0_50px_hsl(var(--secondary)/0.6)] hover:shadow-[0_0_80px_hsl(var(--secondary)/0.9)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  🔥 اختبر نفسك الآن
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Button>
            </motion.div>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 font-medium text-white/80 backdrop-blur hover:bg-white/10"
            >
              <PlayCircle className="h-5 w-5" /> شاهد كيف يعمل
            </a>
          </motion.div>

          {/* social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-white/50"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["bg-secondary", "bg-primary", "bg-accent"].map((c, i) => (
                  <div key={i} className={`h-6 w-6 rounded-full ${c} ring-2 ring-[#070815]`} />
                ))}
              </div>
              <span>+1,200 طالب اجتازوا التحدي</span>
            </div>
            <div className="hidden sm:block h-1 w-1 rounded-full bg-white/30" />
            <div>معدل النجاح: <span className="text-secondary font-bold">37%</span></div>
          </motion.div>
        </div>
      </section>

      {/* GATE */}
      <section ref={gateRef} className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            {stage !== "intro" && (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 backdrop-blur-xl shadow-[0_0_80px_hsl(var(--primary)/0.2)]"
              >
                <div className="absolute inset-x-0 -top-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-secondary to-transparent" />

                {stage === "focus" && (
                  <FocusStage onPass={() => setStage("speed")} onFail={() => finish(false)} />
                )}
                {stage === "speed" && (
                  <SpeedStage onPass={() => setStage("commitment")} onFail={() => finish(false)} />
                )}
                {stage === "commitment" && (
                  <CommitmentStage onPass={() => finish(true)} onFail={() => finish(false)} />
                )}
                {stage === "result" && <ResultStage passed={passed} onRetry={reset} />}

                {/* progress dots */}
                {stage !== "result" && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {(["focus", "speed", "commitment"] as Stage[]).map((s, i) => {
                      const order = ["focus", "speed", "commitment"];
                      const current = order.indexOf(stage);
                      const active = i <= current;
                      return (
                        <div
                          key={s}
                          className={`h-1.5 rounded-full transition-all ${
                            active ? "w-10 bg-secondary" : "w-6 bg-white/15"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black">كيف يعمل النظام؟</h2>
            <p className="mt-3 text-white/60">ثلاث خطوات. بدون تعقيد.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Brain, title: "اختبر نفسك", desc: "30 ثانية فقط لإثبات تركيزك وسرعتك والتزامك.", color: "from-primary to-accent" },
              { icon: CheckCircle2, title: "ادخل النظام", desc: "إن نجحت، نفتح لك بوابة التحديات اليومية.", color: "from-secondary to-yellow-400" },
              { icon: Trophy, title: "ذاكر واربح", desc: "كل دقيقة مذاكرة تتحول إلى نقاط ومكافآت حقيقية.", color: "from-primary to-secondary" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} shadow-lg`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4 text-2xl font-bold">{step.title}</div>
                <p className="mt-2 text-sm text-white/60">{step.desc}</p>
                <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-secondary/10 blur-2xl transition-all group-hover:bg-secondary/30" />
              </motion.div>
            ))}
          </div>

          {stage === "intro" && (
            <div className="mt-14 text-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Button
                  onClick={startGate}
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-secondary to-yellow-400 px-10 py-6 text-base font-black text-secondary-foreground shadow-[0_0_40px_hsl(var(--secondary)/0.5)]"
                >
                  🔥 ابدأ الاختبار الآن
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudyToEarn;
