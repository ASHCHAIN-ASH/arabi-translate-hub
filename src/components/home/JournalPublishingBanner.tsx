import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { ArrowLeft, BookOpenCheck, ExternalLink, FileCheck2, LibraryBig, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import journalPublishingImage from "@/assets/journal-publishing-banner.jpg";

export function JournalPublishingBanner() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const imageX = useSpring(useTransform(pointerX, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 20 });
  const imageY = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 20 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section className="bg-background py-8 sm:py-12" dir="rtl" aria-labelledby="journal-banner-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          className="group relative isolate grid overflow-hidden overflow-hidden rounded-lg border border-primary/25 bg-deep-violet shadow-strong lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,.98fr)]"
        >
          <div className="absolute inset-0 academic-grid opacity-10" aria-hidden="true" />
          <motion.div
            aria-hidden="true"
            className="absolute -right-24 -top-28 h-72 w-72 rounded-full border border-deep-violet-foreground/10"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-9 lg:min-h-[420px] lg:p-12">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 22 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-4 flex w-fit items-center gap-2 border-r-2 border-accent-light pr-3 text-xs font-bold text-accent-light sm:text-sm"
            >
              <Sparkles className="h-4 w-4" />
              بوابتك إلى النشر العلمي
            </motion.div>

            <h2 id="journal-banner-title" className="max-w-2xl text-3xl font-bold leading-[1.35] text-deep-violet-foreground sm:text-4xl lg:text-5xl">
              بحثك يستحق أن يصل إلى
              <span className="block text-accent-light">المجلة المناسبة.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-deep-violet-foreground/75 sm:text-base">
              استكشف دليلًا منظمًا للمجلات العلمية، وابحث حسب تخصصك للوصول إلى المواقع الرسمية ومتطلبات النشر.
            </p>

            <div className="mt-6 grid max-w-xl grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { icon: Search, label: "بحث حسب التخصص" },
                { icon: BookOpenCheck, label: "مجلات متنوعة" },
                { icon: ExternalLink, label: "مصادر رسمية" },
              ].map(({ icon: Icon, label }, index) => (
                <motion.div
                  key={label}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.28 + index * 0.08, duration: 0.4 }}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  className="flex min-h-11 items-center gap-2 rounded-md border border-deep-violet-foreground/15 bg-deep-violet-foreground/5 px-3 text-xs font-semibold text-deep-violet-foreground/85 backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4 flex-shrink-0 text-secondary-light" />
                  {label}
                </motion.div>
              ))}
            </div>

            <motion.div className="mt-7 w-full sm:w-fit" whileHover={reduceMotion ? undefined : { scale: 1.03 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
              <Button asChild size="lg" className="group/button w-full gap-3 bg-background text-foreground shadow-medium hover:bg-muted sm:w-auto">
                <Link to="/journals">استكشف دليل المجلات <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-x-1.5" /></Link>
              </Button>
            </motion.div>
          </div>

          <div className="relative order-first min-h-[240px] sm:min-h-[290px] overflow-hidden border-b border-deep-violet-foreground/15 lg:order-none lg:min-h-full lg:border-b-0 lg:border-r">
            <motion.img
              src={journalPublishingImage}
              alt="مجلة علمية مفتوحة في مكتبة أكاديمية"
              loading="lazy"
              width={1280}
              height={720}
              style={reduceMotion ? undefined : { x: imageX, y: imageY }}
              className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-violet via-deep-violet/20 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:via-deep-violet/15 lg:to-deep-violet/85" aria-hidden="true" />

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-4 top-5 w-[min(15rem,calc(100%-2rem))] rounded-md border border-background/25 bg-background/90 p-4 text-foreground shadow-strong backdrop-blur-md sm:left-7 sm:top-8"
            >
              <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold text-primary">فهرس المجلات</span>
                <LibraryBig className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2" aria-hidden="true">
                <div className="h-2 w-full rounded-full bg-muted" />
                <div className="h-2 w-4/5 rounded-full bg-muted" />
                <div className="h-2 w-2/3 rounded-full bg-primary/20" />
              </div>
            </motion.div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 7, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.35 }}
              className="absolute bottom-5 right-4 flex items-center gap-3 rounded-md border border-background/25 bg-background/90 px-4 py-3 text-foreground shadow-strong backdrop-blur-md sm:bottom-8 sm:right-7"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">وجهتك المختارة</p>
                <p className="text-xs font-bold">رابط رسمي موثوق</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
