import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  GraduationCap,
  ArrowLeft,
  Handshake,
  Sparkles,
  Globe,
  ShieldCheck,
  BookOpenCheck,
  FileCheck2,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import admissionDesk from "@/assets/admission-acceptance-desk.jpg";
import universityCampus from "@/assets/admission-university-campus.jpg";

const ADMISSION_URL = "https://fekrah-global.com/ar/auth/register";
const COUNTDOWN_SECONDS = 6;

const HEADLINE = "رحلتك الدراسية تبدأ من هنا";
const PARAGRAPH =
  "في «فكرة»، نحرص على بناء شراكات موثوقة مع الجهات والخدمات التي يحتاجها الطالب طوال رحلته الدراسية. نوفّر لك حلولاً متكاملة تسهّل كل مرحلة، من البداية حتى تحقيق أهدافك الأكاديمية، لأن راحتك وثقتك هما أساس ما نقدّمه.";

const partnerPillars = [
  { icon: Handshake, label: "شراكات موثوقة" },
  { icon: Globe, label: "جامعات حول العالم" },
  { icon: ShieldCheck, label: "رحلة دراسية آمنة" },
];

/** خطوات الرحلة بأيقونات متحركة */
const journeySteps = [
  { icon: FileCheck2, label: "تجهيز الملف" },
  { icon: BookOpenCheck, label: "القبول الجامعي" },
  { icon: Plane, label: "بدء الرحلة" },
];

/** هوك كتابة حرفًا بحرف مع مؤشر وامض */
const useTypewriter = (
  text: string,
  { start, speed = 45, reduceMotion }: { start: boolean; speed?: number; reduceMotion: boolean | null }
) => {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setTyped(text.length);
      return;
    }
    if (!start) return;
    if (typed >= text.length) return;
    const t = window.setTimeout(() => setTyped((p) => p + 1), speed);
    return () => window.clearTimeout(t);
  }, [typed, start, text, speed, reduceMotion]);

  return {
    output: text.slice(0, typed),
    done: typed >= text.length,
  };
};

const Caret = () => (
  <motion.span
    aria-hidden="true"
    className="inline-block w-[3px] h-[1em] align-[-0.15em] bg-primary rounded-full ms-1"
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
  />
);

const AdmissionServices = () => {
  const reduceMotion = useReducedMotion();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const countdownStarted = useRef(false);

  // مراحل الكتابة: العنوان ثم الفقرة
  const headline = useTypewriter(HEADLINE, { start: true, speed: 70, reduceMotion });
  const paragraph = useTypewriter(PARAGRAPH, {
    start: headline.done,
    speed: 26,
    reduceMotion,
  });

  // العدّاد يبدأ بعد انتهاء الكتابة فقط
  useEffect(() => {
    if (!paragraph.done || countdownStarted.current) return;
    countdownStarted.current = true;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [paragraph.done]);

  useEffect(() => {
    if (secondsLeft === 0 && countdownStarted.current) {
      window.location.href = ADMISSION_URL;
    }
  }, [secondsLeft]);

  const floatingIcons = useMemo(
    () => [
      { Icon: BookOpenCheck, top: "18%", right: "12%", delay: 0 },
      { Icon: FileCheck2, top: "30%", right: "82%", delay: 0.6 },
      { Icon: Plane, top: "62%", right: "10%", delay: 1.2 },
      { Icon: Globe, top: "70%", right: "80%", delay: 1.8 },
      { Icon: GraduationCap, top: "12%", right: "48%", delay: 2.4 },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Header />

      <main className="flex-1 relative overflow-hidden">
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
          {/* أيقونات عائمة متحركة */}
          {floatingIcons.map(({ Icon, top, right, delay }, i) => (
            <motion.div
              key={i}
              className="absolute w-12 h-12 rounded-2xl bg-card/80 backdrop-blur border border-border shadow-lg flex items-center justify-center"
              style={{ top, right }}
              initial={{ opacity: 0, scale: 0 }}
              animate={
                reduceMotion
                  ? { opacity: 0.6, scale: 1 }
                  : { opacity: [0.35, 0.7, 0.35], scale: 1, y: [0, -14, 0], rotate: [0, 6, -6, 0] }
              }
              transition={{
                opacity: { duration: 4, repeat: Infinity, delay },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
                scale: { type: "spring", stiffness: 160, damping: 12, delay },
              }}
            >
              <Icon className="w-6 h-6 text-primary" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-14 md:py-20 max-w-5xl">
          {/* شارة */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-semibold text-primary">
              <Handshake className="w-4 h-4" />
              القبول الجامعي
            </span>
          </motion.div>

          {/* الأيقونة الرئيسية */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 14 }}
            className="relative mx-auto mb-8 w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30"
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <GraduationCap className="w-12 h-12 text-primary-foreground" />
            </motion.div>
            <motion.span
              className="absolute -top-2 -left-2"
              animate={reduceMotion ? undefined : { rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-secondary" />
            </motion.span>
          </motion.div>

          {/* العنوان — يُكتب حرفًا بحرف */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-snug mb-6 text-center min-h-[3.5rem]">
            {headline.output}
            {!headline.done && <Caret />}
          </h1>

          {/* الفقرة — تُكتب حرفًا بحرف بعد العنوان */}
          <p className="text-lg sm:text-xl leading-relaxed text-muted-foreground mb-10 text-center max-w-3xl mx-auto min-h-[7rem]">
            {paragraph.output}
            {headline.done && !paragraph.done && <Caret />}
          </p>

          {/* صور حقيقية للقبول الجامعي */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 max-w-4xl mx-auto">
            {[
              { src: admissionDesk, alt: "خطاب قبول جامعي وقبعة تخرج على مكتب دراسي" },
              { src: universityCampus, alt: "حرم جامعي عريق ببرج ساعة ومساحات خضراء" },
            ].map((img, i) => (
              <motion.figure
                key={img.src}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.6, ease: "easeOut" }}
                whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
                className="relative rounded-3xl overflow-hidden border border-border shadow-xl shadow-primary/10 group"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="w-full h-56 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </motion.figure>
            ))}
          </div>

          {/* خطوات الرحلة بأيقونات متحركة */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12" dir="rtl">
            {journeySteps.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center gap-2 sm:gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.25, type: "spring", stiffness: 180, damping: 12 }}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-card border border-border shadow-md flex items-center justify-center"
                    animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                  >
                    <Icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <span className="text-xs sm:text-sm font-medium text-foreground">{label}</span>
                </motion.div>
                {i < journeySteps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.75 + i * 0.25, duration: 0.4 }}
                    className="w-8 sm:w-14 h-0.5 bg-gradient-to-l from-primary/60 to-secondary/60 rounded-full origin-right"
                  />
                )}
              </div>
            ))}
          </div>

          {/* الركائز */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {partnerPillars.map(({ icon: Icon, label }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                <Icon className="w-4 h-4 text-secondary" />
                {label}
              </motion.span>
            ))}
          </div>

          {/* التحويل إلى موقع القبول */}
          <AnimatePresence>
            {paragraph.done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 12 }}
                className="space-y-4 text-center"
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
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdmissionServices;
