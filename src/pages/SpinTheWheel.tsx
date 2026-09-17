import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, Gift, Sparkles, Trophy, Clock, ShieldCheck, Mail } from "lucide-react";
import { supabase } from "@/data/legacy/client";

interface Segment {
  text: string;
  short: string;
  color: string;
  accent: string;
}

const SEGMENTS: Segment[] = [
  { text: "سيرة ذاتية ATS مجانًا",            short: "سيرة ATS",   color: "hsl(43 74% 52%)", accent: "hsl(43 74% 38%)" },
  { text: "بوستر بحثي مجانًا",                 short: "بوستر بحثي", color: "hsl(220 40% 22%)", accent: "hsl(220 40% 14%)" },
  { text: "تصميم شعار خاص بك مجانًا",          short: "تصميم شعار", color: "hsl(38 85% 58%)", accent: "hsl(38 85% 42%)" },
  { text: "شرح تفاعلي لبحثك بالذكاء الاصطناعي", short: "شرح تفاعلي", color: "hsl(220 35% 30%)", accent: "hsl(220 40% 18%)" },
  { text: "مراجعة بحثك بالذكاء الاصطناعي مجانًا", short: "مراجعة ذكية", color: "hsl(45 90% 60%)", accent: "hsl(45 90% 45%)" },
  { text: "فحص صلاحية الاستبيان مجانًا",        short: "فحص استبيان", color: "hsl(220 45% 18%)", accent: "hsl(220 50% 10%)" },
  { text: "متابعة نشر بحثك مع فكرة مجانًا",     short: "متابعة نشر", color: "hsl(40 80% 55%)", accent: "hsl(40 80% 40%)" },
  { text: "تجهيز ملفات IRB مجانًا",             short: "ملفات IRB",  color: "hsl(220 38% 26%)", accent: "hsl(220 45% 15%)" },
];

/** فترة التهدئة الموثّقة: محاولة واحدة لكل مشارك كل 30 يومًا */
const COOLDOWN_DAYS = 30;

const pad = (n: number) => String(n).padStart(2, "0");

const SpinTheWheel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(420);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [wonPrize, setWonPrize] = useState("");
  const [claimCode, setClaimCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nextEligibleAt, setNextEligibleAt] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  const isLocked = !!nextEligibleAt && !!remaining;

  // Responsive canvas size — based on viewport, not just container
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Cap by viewport width AND height to avoid overflow on short screens
      const maxByWidth = vw < 640 ? vw - 48 : vw < 1024 ? Math.min(vw - 80, 440) : 500;
      const maxByHeight = vh * 0.6;
      const next = Math.max(260, Math.min(maxByWidth, maxByHeight, 520));
      setSize(Math.round(next));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => { checkEligibility(); }, []);

  // العدّ التنازلي الحيّ حتى موعد المحاولة القادمة
  useEffect(() => {
    if (!nextEligibleAt) { setRemaining(null); return; }
    const tick = () => {
      const diff = new Date(nextEligibleAt).getTime() - Date.now();
      if (diff <= 0) { setNextEligibleAt(null); setRemaining(null); return; }
      setRemaining({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [nextEligibleAt]);

  const getUserIdentifier = () => {
    let id = localStorage.getItem("spin_user_id");
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("spin_user_id", id);
    }
    return id;
  };

  const checkEligibility = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("send-spin-winner", {
        body: { action: "check", userIdentifier: getUserIdentifier() },
      });
      if (error) throw error;
      if (data && data.eligible === false && data.nextEligibleAt) {
        setNextEligibleAt(data.nextEligibleAt);
      } else {
        setNextEligibleAt(null);
      }
    } catch (e) { console.error(e); }
    finally { setIsChecking(false); }
  };

  const nextDateLabel = nextEligibleAt
    ? new Date(nextEligibleAt).toLocaleDateString("ar", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "";



  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== size * dpr) {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2;
    const radius = cx - 12;
    const arc = (2 * Math.PI) / SEGMENTS.length;

    ctx.clearRect(0, 0, size, size);

    // Outer gold ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, 2 * Math.PI);
    const ring = ctx.createLinearGradient(0, 0, size, size);
    ring.addColorStop(0, "hsl(43 74% 60%)");
    ring.addColorStop(0.5, "hsl(45 90% 70%)");
    ring.addColorStop(1, "hsl(38 70% 45%)");
    ctx.fillStyle = ring;
    ctx.fill();

    SEGMENTS.forEach((seg, i) => {
      const a0 = angle + i * arc;
      const a1 = a0 + arc;

      // Slice
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, a0, a1);
      ctx.closePath();
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
      grad.addColorStop(0, seg.color);
      grad.addColorStop(1, seg.accent);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "hsl(45 80% 75%)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Text — tangential, short label, wrapped to 2 lines and shrunk to fit the slice
      ctx.save();
      ctx.translate(cx, cy);
      const mid = a0 + arc / 2;
      ctx.rotate(mid + Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1;

      const label = seg.short || seg.text;
      const words = label.split(" ");
      const lines: string[] =
        words.length > 1
          ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")]
          : [label];

      // Available tangential width at the text radius (chord of the slice), with padding
      const textRadius = radius * 0.66;
      const maxWidth = 2 * textRadius * Math.sin(arc / 2) * 0.82;

      let fontSize = Math.max(11, Math.round(size * 0.042));
      const fits = () => {
        ctx.font = `700 ${fontSize}px "IBM Plex Sans Arabic", "Tajawal", system-ui, sans-serif`;
        return lines.every((l) => ctx.measureText(l).width <= maxWidth);
      };
      while (fontSize > 9 && !fits()) fontSize -= 1;
      ctx.font = `700 ${fontSize}px "IBM Plex Sans Arabic", "Tajawal", system-ui, sans-serif`;

      const lineHeight = fontSize * 1.25;
      const startY = -textRadius - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, li) => ctx.fillText(line, 0, startY + li * lineHeight));
      ctx.restore();

    });

    // Inner hub
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.09, 0, 2 * Math.PI);
    const hub = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, size * 0.09);
    hub.addColorStop(0, "#fff");
    hub.addColorStop(1, "hsl(45 50% 85%)");
    ctx.fillStyle = hub;
    ctx.fill();
    ctx.strokeStyle = "hsl(43 74% 45%)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center icon dot
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.025, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(220 40% 20%)";
    ctx.fill();
  }, [size]);

  useEffect(() => { drawWheel(startAngle); }, [startAngle, drawWheel]);

  const spinWheel = () => {
    if (isSpinning) return;
    if (isLocked) {
      toast({
        title: "محاولتك الشهرية مُستخدمة",
        description: `يمكنك اللف مرة أخرى في ${nextDateLabel}`,
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    const spinRotations = Math.random() * 5 + 10;
    const totalAngle = spinRotations * 2 * Math.PI;
    const duration = 4500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const cur = totalAngle * ease;
      setStartAngle(cur % (2 * Math.PI));
      if (progress < 1) requestAnimationFrame(animate);
      else finishSpin(cur);
    };
    requestAnimationFrame(animate);
  };

  const finishSpin = (finalAngle: number) => {
    const arc = (2 * Math.PI) / SEGMENTS.length;
    // Pointer is at top (angle = -PI/2). Find which slice is under it.
    const pointer = (3 * Math.PI) / 2;
    const norm = ((pointer - (finalAngle % (2 * Math.PI))) + 2 * Math.PI) % (2 * Math.PI);
    const idx = Math.floor(norm / arc) % SEGMENTS.length;
    const prize = SEGMENTS[idx].text;
    setWonPrize(prize);
    setClaimCode("");
    setEmailSent(false);
    setShowResult(true);

    setIsSpinning(false);
    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3");
      audio.play().catch(() => {});
    } catch {}
    toast({ title: "🎉 تهانينا!", description: `لقد ربحت: ${prize}` });
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText(claimCode || wonPrize);
    toast({ title: "تم النسخ!", description: "تم نسخ رمز المطالبة إلى الحافظة" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userIdentifier = getUserIdentifier();
      const { data, error } = await supabase.functions.invoke("send-spin-winner", {
        body: { name, email, prize: wonPrize, userIdentifier },
      });
      if (error) throw error;
      if (data?.error) {
        if (data.nextEligibleAt) setNextEligibleAt(data.nextEligibleAt);
        toast({ title: "تعذّر تسجيل الفوز", description: data.error, variant: "destructive" });
        return;
      }
      if (data?.nextEligibleAt) setNextEligibleAt(data.nextEligibleAt);
      if (data?.claimCode) setClaimCode(data.claimCode);
      setEmailSent(true);
      toast({
        title: "وصلت جائزتك إلى بريدك ✉️",
        description: "افتح بريدك الإلكتروني (وصندوق الرسائل غير المرغوبة) لمشاهدة رمز المطالبة",
      });
    } catch (e) {
      console.error(e);
      toast({ title: "حدث خطأ", description: "حاول مرة أخرى لاحقاً", variant: "destructive" });
    } finally { setIsSubmitting(false); }
  };


  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(45 60% 96%) 0%, hsl(220 30% 96%) 60%, hsl(220 35% 92%) 100%)",
      }}
      dir="rtl"
    >
      <Header />
      <FloatingWhatsAppButton />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(220_40%_20%)] text-[hsl(45_90%_70%)] text-xs sm:text-sm font-semibold mb-4 shadow-md">
              <Sparkles className="w-4 h-4" />
              عرض حصري · محاولة واحدة كل 30 يومًا
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-[1.45] sm:leading-[1.4]"
                style={{ color: "hsl(220 45% 18%)" }}>
              <span className="block">لف العجلة الذهبية</span>
              <span className="block pb-2" style={{
                background: "linear-gradient(90deg, hsl(43 74% 45%), hsl(45 90% 60%))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>واربح فوراً</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              جوائز وخدمات أكاديمية مجانية من «فكرة» بانتظارك عند لف العجلة
            </p>
          </motion.div>

          {/* Wheel + Side panel */}
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 sm:gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
            {/* Wheel */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 90 }}
              className="relative mx-auto w-full max-w-[520px]"
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-full blur-3xl opacity-40 -z-10"
                   style={{ background: "radial-gradient(circle, hsl(45 90% 65% / 0.6), transparent 70%)" }} />

              {/* Pointer */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-1 z-20">
                <motion.div
                  animate={isSpinning ? { rotate: [-8, 8, -8] } : { rotate: 0 }}
                  transition={{ duration: 0.15, repeat: isSpinning ? Infinity : 0 }}
                  className="w-0 h-0 drop-shadow-lg"
                  style={{
                    borderLeft: "16px solid transparent",
                    borderRight: "16px solid transparent",
                    borderTop: "26px solid hsl(0 75% 50%)",
                  }}
                />
              </div>

              <canvas ref={canvasRef} style={{ width: size, height: size }} className="block mx-auto" />

              {/* Center spin button */}
              <button
                onClick={spinWheel}
                disabled={isSpinning || isLocked || isChecking}
                aria-label="ابدأ الدوران"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full font-bold text-white shadow-2xl transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                style={{
                  width: size * 0.18,
                  height: size * 0.18,
                  background: isLocked
                    ? "linear-gradient(135deg, hsl(220 10% 50%), hsl(220 10% 35%))"
                    : "linear-gradient(135deg, hsl(43 74% 50%), hsl(38 80% 40%))",
                  fontSize: Math.max(11, size * 0.032),
                }}
              >
                {isSpinning ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className="w-5 h-5" />
                  </motion.span>
                ) : isLocked ? `${remaining!.d}ي` : "SPIN"}
              </button>

            </motion.div>

            {/* Side panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div
                className="rounded-2xl p-6 shadow-xl border"
                style={{
                  background: "linear-gradient(135deg, hsl(220 45% 18%), hsl(220 50% 12%))",
                  borderColor: "hsl(45 60% 50% / 0.3)",
                }}
              >
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2"
                    style={{ color: "hsl(45 90% 70%)" }}>
                  <Gift className="w-5 h-5" /> الجوائز المتاحة
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {SEGMENTS.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-white"
                      style={{ background: "hsl(220 30% 25% / 0.6)" }}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }} />
                      <span className="truncate">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* العدّ التنازلي الموثّق حتى المحاولة القادمة */}
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-5 border-2 shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, hsl(45 80% 96%), hsl(45 60% 90%))",
                    borderColor: "hsl(43 74% 55%)",
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-3 text-sm font-bold"
                       style={{ color: "hsl(220 45% 18%)" }}>
                    <Clock className="w-4 h-4" /> محاولتك القادمة بعد
                  </div>
                  <div className="grid grid-cols-4 gap-2" dir="ltr">
                    {[
                      { v: remaining!.d, l: "يوم" },
                      { v: remaining!.h, l: "ساعة" },
                      { v: remaining!.m, l: "دقيقة" },
                      { v: remaining!.s, l: "ثانية" },
                    ].map((u, i) => (
                      <div key={i} className="rounded-xl py-2 text-center border shadow-sm"
                           style={{ background: "hsl(220 45% 18%)", borderColor: "hsl(43 74% 55% / 0.5)" }}>
                        <div className="text-xl sm:text-2xl font-extrabold tabular-nums"
                             style={{ color: "hsl(45 90% 70%)" }}>{pad(u.v)}</div>
                        <div className="text-[10px] sm:text-xs text-white/70">{u.l}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs mt-3" style={{ color: "hsl(220 30% 35%)" }}>
                    تاريخ الاستحقاق: <span className="font-bold">{nextDateLabel}</span>
                  </p>
                </motion.div>
              )}

              <Button
                onClick={spinWheel}
                disabled={isSpinning || isLocked || isChecking}
                size="lg"
                className="w-full text-base sm:text-lg py-6 font-bold shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: isLocked
                    ? "hsl(220 10% 60%)"
                    : "linear-gradient(135deg, hsl(43 74% 50%), hsl(38 85% 55%))",
                  color: "hsl(220 50% 12%)",
                }}
              >
                {isChecking ? "جاري التحميل..."
                  : isSpinning ? <><Sparkles className="w-5 h-5 ml-2 animate-spin" /> جاري الدوران...</>
                  : isLocked ? <><Clock className="w-5 h-5 ml-2" /> محاولتك القادمة بعد {remaining!.d} يومًا</>
                  : <><Gift className="w-5 h-5 ml-2" /> ابدأ الدوران الآن</>}
              </Button>

              <div className="flex items-start justify-center gap-2 text-xs sm:text-sm text-muted-foreground text-center">
                <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  محاولة مجانية واحدة لكل مشارك كل {COOLDOWN_DAYS} يومًا · تصلك الجائزة على بريدك الإلكتروني فورًا
                </span>
              </div>

            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Trophy, title: "جوائز حقيقية", desc: "سيرة ATS · بوستر بحثي · تصميم شعار" },
              { icon: Gift, title: "خدمات مجانية", desc: "مراجعة بحثك وفحص الاستبيان بالذكاء الاصطناعي" },
              { icon: Sparkles, title: "دعم مستمر", desc: "متابعة النشر وتجهيز ملفات IRB" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="rounded-xl p-5 sm:p-6 text-center border bg-card/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all"
                style={{ borderColor: "hsl(45 60% 75% / 0.5)" }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                     style={{ background: "linear-gradient(135deg, hsl(45 90% 90%), hsl(45 80% 75%))" }}>
                  <item.icon className="w-6 h-6" style={{ color: "hsl(220 45% 20%)" }} />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: "hsl(220 45% 18%)" }}>
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent
          className="w-[calc(100vw-2rem)] sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-2xl"
          dir="rtl"
        >
          <DialogHeader>
            <DialogTitle className="text-center text-xl sm:text-2xl">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: "hsl(43 90% 50%)" }} />
                <span style={{
                  background: "linear-gradient(90deg, hsl(43 74% 45%), hsl(220 45% 25%))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  تهانينا! 🎉
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <div
                className="rounded-xl p-4 sm:p-6 text-center border-2"
                style={{
                  background: "linear-gradient(135deg, hsl(45 80% 95%), hsl(45 60% 88%))",
                  borderColor: "hsl(43 74% 55%)",
                }}
              >
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">لقد ربحت:</p>
                <p className="text-2xl sm:text-3xl font-extrabold break-words" style={{ color: "hsl(220 45% 18%)" }}>{wonPrize}</p>
              </div>

              {emailSent ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl p-4 text-center border-2"
                       style={{ background: "hsl(150 60% 96%)", borderColor: "hsl(150 50% 45%)" }}>
                    <div className="flex items-center justify-center gap-2 font-bold mb-1"
                         style={{ color: "hsl(150 60% 24%)" }}>
                      <Mail className="w-5 h-5" /> أُرسلت جائزتك إلى بريدك
                    </div>
                    <p className="text-xs text-muted-foreground break-all">{email}</p>
                  </div>

                  {claimCode && (
                    <div className="rounded-xl p-4 text-center border-2 border-dashed"
                         style={{ borderColor: "hsl(43 74% 55%)", background: "hsl(45 80% 97%)" }}>
                      <p className="text-xs text-muted-foreground mb-1">رمز المطالبة</p>
                      <p className="text-xl font-extrabold tracking-widest" dir="ltr"
                         style={{ color: "hsl(220 45% 18%)" }}>{claimCode}</p>
                    </div>
                  )}

                  <Button onClick={copyCoupon} variant="outline" className="w-full">
                    <Copy className="w-4 h-4 ml-2" /> نسخ رمز المطالبة
                  </Button>

                  {nextEligibleAt && (
                    <p className="text-center text-xs text-muted-foreground">
                      محاولتك القادمة متاحة في <span className="font-bold">{nextDateLabel}</span> (بعد {COOLDOWN_DAYS} يومًا)
                    </p>
                  )}

                  <Button className="w-full" onClick={() => setShowResult(false)}>إغلاق</Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs text-muted-foreground text-center">
                    أدخل بياناتك لتصلك الجائزة ورمز المطالبة على بريدك الإلكتروني.
                  </p>
                  <div>
                    <Label htmlFor="name">الاسم</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="أدخل اسمك" required />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="أدخل بريدك الإلكتروني" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full font-bold"
                    style={{
                      background: "linear-gradient(135deg, hsl(43 74% 50%), hsl(38 85% 55%))",
                      color: "hsl(220 50% 12%)",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "جاري الإرسال..." : <><Mail className="w-4 h-4 ml-2" /> أرسل الجائزة إلى بريدي</>}
                  </Button>
                </form>
              )}

            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SpinTheWheel;
