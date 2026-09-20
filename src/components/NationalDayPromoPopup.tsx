import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BadgePercent, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "fekrah-national-day-2026-dismissed";
const SHOW_DELAY_MS = 4000;

const NationalDayPromoPopup = () => {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="dialog"
          aria-label="عرض اليوم الوطني"
          dir="rtl"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-5 z-[70] w-[min(92vw,340px)] overflow-hidden rounded-2xl border border-saudi-gold/30 bg-gradient-to-br from-saudi-green via-[hsl(140,70%,22%)] to-saudi-green text-saudi-white shadow-elegant"
        >
          <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-saudi-gold/20 blur-2xl" aria-hidden="true" />
          <button
            onClick={dismiss}
            aria-label="إغلاق العرض"
            className="absolute left-3 top-3 rounded-full p-1.5 text-saudi-white/70 transition-colors hover:bg-saudi-white/10 hover:text-saudi-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-saudi-gold">
              <Sparkles className="h-4 w-4" />
              عرض اليوم الوطني السعودي
            </div>

            <div className="mt-3 flex items-center gap-3">
              <motion.div
                animate={reduceMotion ? undefined : { rotate: [0, -6, 6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3 }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-saudi-white/10 ring-1 ring-saudi-gold/40"
              >
                <BadgePercent className="h-6 w-6 text-saudi-gold" />
              </motion.div>
              <div>
                <p className="text-2xl font-extrabold leading-tight">خصم 20%</p>
                <p className="text-xs text-saudi-white/80">على جميع خدمات FekrahEdu</p>
              </div>
            </div>

            <p className="mt-3 rounded-lg bg-saudi-white/5 p-2 text-[11px] leading-5 text-saudi-white/70">
              يشمل العرض جميع الخدمات عدا رسوم النشر في المجلات العلمية.
            </p>

            <Button
              asChild
              size="sm"
              className="mt-4 w-full gap-2 bg-saudi-gold font-bold text-saudi-green shadow-md hover:bg-saudi-gold/90"
            >
              <Link to="/order-now" onClick={dismiss}>
                اطلب خدمتك الآن
              </Link>
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default NationalDayPromoPopup;
