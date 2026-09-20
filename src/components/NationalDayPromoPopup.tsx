import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, BadgePercent, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import nationalDayImage from "@/assets/saudi-national-day-banner.jpg";

const STORAGE_KEY = "fekrah-national-day-2026-dismissed";
const SHOW_DELAY_MS = 3500;

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
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="عرض اليوم الوطني السعودي"
          dir="rtl"
        >
          <button
            aria-label="إغلاق العرض"
            onClick={dismiss}
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
          />

          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.92 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-saudi-gold/30 bg-card shadow-elegant"
          >
            <button
              onClick={dismiss}
              aria-label="إغلاق"
              className="absolute left-3 top-3 z-10 rounded-full bg-saudi-green/70 p-1.5 text-saudi-white backdrop-blur transition-colors hover:bg-saudi-green"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative h-44 sm:h-52">
              <img
                src={nationalDayImage}
                alt="احتفالات اليوم الوطني السعودي"
                className="h-full w-full object-cover"
                width={1024}
                height={640}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" aria-hidden="true" />
              <motion.div
                animate={reduceMotion ? undefined : { rotate: [0, -8, 8, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 2.5 }}
                className="absolute bottom-3 right-4 flex h-12 w-12 items-center justify-center rounded-xl bg-saudi-green shadow-lg ring-1 ring-saudi-gold/50"
              >
                <BadgePercent className="h-6 w-6 text-saudi-gold" />
              </motion.div>
            </div>

            <div className="p-5 pt-2 text-center sm:p-6 sm:pt-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-saudi-green/10 px-3 py-1 text-xs font-bold text-saudi-green">
                <Sparkles className="h-3.5 w-3.5" />
                بمناسبة اليوم الوطني السعودي
              </div>

              <h2 className="mt-3 text-2xl font-extrabold leading-snug text-foreground sm:text-3xl">
                دام عزّك يا وطن
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                نحتفل معكم بمسيرة وطنٍ شامخ، ونشارككم الفرحة بخصم{" "}
                <span className="font-extrabold text-saudi-green">20%</span> على جميع خدمات FekrahEdu الأكاديمية.
              </p>

              <p className="mt-3 rounded-xl border border-border bg-muted/50 px-3 py-2 text-[11px] leading-5 text-muted-foreground">
                يشمل العرض جميع الخدمات عدا رسوم النشر في المجلات العلمية.
              </p>

              <motion.div whileHover={reduceMotion ? undefined : { scale: 1.03 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }} className="mt-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full gap-2 bg-saudi-green font-bold text-saudi-white shadow-md hover:bg-saudi-green/90"
                >
                  <Link to="/order-now" onClick={dismiss}>
                    اطلب خدمتك الآن
                    <ArrowUpLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NationalDayPromoPopup;
