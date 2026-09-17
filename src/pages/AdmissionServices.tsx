import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, ArrowLeft, Handshake, Sparkles, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ADMISSION_URL = "https://fekrah-global.com/";
const COUNTDOWN_SECONDS = 7;

const partnerPillars = [
  { icon: Handshake, label: "شراكات موثوقة" },
  { icon: Globe, label: "جامعات حول العالم" },
  { icon: ShieldCheck, label: "رحلة دراسية آمنة" },
];

const AdmissionServices = () => {
  const reduceMotion = useReducedMotion();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      window.location.href = ADMISSION_URL;
    }
  }, [secondsLeft]);

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <main className="flex-1 relative overflow-hidden flex items-center justify-center">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-accent/5" />
          <motion.div
            className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/15 blur-3xl"
            animate={reduceMotion ? undefined : { scale: [1, 1.25, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-accent/15 blur-3xl"
            animate={reduceMotion ? undefined : { scale: [1.2, 1, 1.2], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          {/* نقاط مدارية */}
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-2 h-2 rounded-full bg-secondary/60"
              style={{ top: `${15 + i * 12}%`, right: `${10 + (i % 3) * 35}%` }}
              animate={reduceMotion ? undefined : { y: [0, -18, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center max-w-3xl">
          {/* الأيقونة الرئيسية */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
            className="mx-auto mb-8 w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30"
          >
            <GraduationCap className="w-12 h-12 text-primary-foreground" />
            <motion.span
              className="absolute -top-2 -left-2"
              animate={reduceMotion ? undefined : { rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-secondary" />
            </motion.span>
          </motion.div>

          {/* شارة */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary mb-6"
          >
            <Handshake className="w-4 h-4" />
            القبول الجامعي
          </motion.span>

          {/* المحتوى */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-snug mb-6"
          >
            رحلتك الدراسية تبدأ من هنا
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="text-lg sm:text-xl leading-relaxed text-muted-foreground mb-10"
          >
            في «فكرة»، نحرص على بناء شراكات موثوقة مع الجهات والخدمات التي يحتاجها الطالب طوال رحلته الدراسية. نوفّر لك حلولاً متكاملة تسهّل كل مرحلة، من البداية حتى تحقيق أهدافك الأكاديمية، لأن راحتك وثقتك هما أساس ما نقدّمه.
          </motion.p>

          {/* الركائز */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            {partnerPillars.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                <Icon className="w-4 h-4 text-secondary" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* التحويل إلى موقع القبول */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.05, type: "spring", stiffness: 140, damping: 12 }}
            className="space-y-4"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-2xl shadow-xl shadow-primary/25 gap-2"
              onClick={() => (window.location.href = ADMISSION_URL)}
            >
              الانتقال إلى منصة القبول الجامعي
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                سيتم تحويلك تلقائيًا إلى موقع القبول خلال{" "}
                <span className="font-bold text-primary tabular-nums">{secondsLeft}</span>{" "}
                ثوانٍ
              </p>
              {/* شريط التقدم */}
              <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-l from-primary to-secondary"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(secondsLeft / COUNTDOWN_SECONDS) * 100}%` }}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdmissionServices;
