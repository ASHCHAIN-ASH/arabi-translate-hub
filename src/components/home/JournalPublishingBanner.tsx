import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, BookOpenCheck, FileCheck2, LibraryBig, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import journalPublishingImage from "@/assets/journal-publishing-banner.jpg";

export function JournalPublishingBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-background py-7 sm:py-9" dir="rtl" aria-labelledby="journal-banner-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="group relative grid overflow-hidden rounded-lg border border-primary/20 bg-deep-violet shadow-strong md:min-h-[255px] md:grid-cols-[minmax(0,1.08fr)_minmax(300px,.92fr)]"
        >
          <div className="absolute inset-0 academic-grid opacity-10" aria-hidden="true" />

          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="mb-3 flex w-fit items-center gap-2 rounded-full border border-deep-violet-foreground/20 bg-deep-violet-foreground/10 px-3 py-1.5 text-xs font-semibold text-deep-violet-foreground backdrop-blur-sm">
              <motion.span animate={reduceMotion ? undefined : { rotate: [0, 180, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="h-3.5 w-3.5 text-accent-light" />
              </motion.span>
              بوابتك إلى النشر العلمي
            </div>

            <h2 id="journal-banner-title" className="text-2xl font-bold leading-[1.45] text-deep-violet-foreground sm:text-3xl">
              انشر بحثك في المجلة المناسبة
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-deep-violet-foreground/80 sm:text-base">
              استكشف دليلًا منظمًا للمجلات العلمية، وابحث حسب تخصصك للوصول إلى المواقع الرسمية ومتطلبات النشر.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-deep-violet-foreground/85">
              <span className="flex items-center gap-1.5"><BookOpenCheck className="h-4 w-4 text-accent-light" />مجلات متعددة التخصصات</span>
              <span className="flex items-center gap-1.5"><FileCheck2 className="h-4 w-4 text-secondary-light" />روابط رسمية مباشرة</span>
            </div>

            <motion.div className="mt-5 w-full sm:w-fit" whileHover={reduceMotion ? undefined : { scale: 1.035 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
              <Button asChild size="lg" className="group/button w-full gap-2 bg-background text-foreground shadow-medium hover:bg-muted sm:w-auto">
                <Link to="/journals">تصفّح دليل المجلات <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover/button:-translate-x-1" /></Link>
              </Button>
            </motion.div>
          </div>

          <div className="relative z-10 order-first min-h-[175px] overflow-hidden border-b border-deep-violet-foreground/15 md:order-none md:min-h-full md:border-b-0 md:border-r">
            <img src={journalPublishingImage} alt="مجلة علمية مفتوحة في مكتبة أكاديمية" loading="lazy" width={1280} height={720} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-violet/45 via-transparent to-transparent md:bg-gradient-to-r md:from-deep-violet/45 md:via-transparent md:to-transparent" aria-hidden="true" />
            <div className="absolute bottom-4 right-4 flex gap-2 md:bottom-5 md:right-5" aria-hidden="true">
              <motion.div animate={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 5, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }} className="flex h-11 w-11 items-center justify-center rounded-lg border border-background/30 bg-background/85 text-primary shadow-medium backdrop-blur-md"><FileCheck2 className="h-5 w-5" /></motion.div>
              <motion.div animate={reduceMotion ? undefined : { y: [0, 7, 0], rotate: [0, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: .4 }} className="flex h-11 w-11 items-center justify-center rounded-lg border border-background/30 bg-background/85 text-secondary shadow-medium backdrop-blur-md"><LibraryBig className="h-5 w-5" /></motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
