import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, BookMarked, FolderTree, Globe2, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { journals } from "@/data/journals";
import { categorySummaries } from "@/components/journals/journalVisuals";
import bannerImage from "@/assets/journal-publishing-banner.jpg";

const WHATSAPP_URL = "https://wa.me/966593799355?text=" + encodeURIComponent("مرحبًا، أود الاستفسار عن خدمة النشر في المجلات العلمية واختيار المجلة المناسبة.");

const Counter = ({ target, reduceMotion }: { target: number; reduceMotion: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const duration = 1200;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, target]);

  return <span ref={ref}>{value.toLocaleString("ar-SA")}</span>;
};

const JournalsStatsBanner = () => {
  const reduceMotion = useReducedMotion();
  const totalJournals = journals.length;
  const totalCategories = categorySummaries.length;
  const issnCount = journals.filter((journal) => Boolean(journal.issn)).length;

  const stats = [
    { icon: BookMarked, value: totalJournals, label: "مجلة علمية" },
    { icon: FolderTree, value: totalCategories, label: "تخصصات رئيسية" },
    { icon: Globe2, value: issnCount, label: "مجلة برقم ISSN" },
  ];

  return (
    <section className="relative py-8 sm:py-10">
      <div className="container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-elegant"
        >
          <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(220px,0.4fr)]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Headset className="h-3.5 w-3.5" />
                دعم فوري لاختيار المجلة المناسبة
              </div>
              <h2 className="text-xl font-bold leading-snug text-foreground sm:text-2xl">
                دليلك الشامل للنشر العلمي
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                استعرض المجلات حسب التخصص، وقارن الناشرين، وتواصل معنا مباشرة لمساعدتك في اختيار الأنسب لبحثك.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.12 }}
                      className="rounded-xl border border-border bg-background/70 p-3 text-center"
                    >
                      <Icon className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="mt-1 text-lg font-extrabold tabular-nums text-foreground sm:text-2xl">
                        <Counter target={stat.value} reduceMotion={Boolean(reduceMotion)} />+
                      </p>
                      <p className="text-[11px] text-muted-foreground sm:text-xs">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <motion.div whileHover={reduceMotion ? undefined : { scale: 1.03 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
                  <Button asChild size="lg" className="gap-2 shadow-primary">
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      استفسر الآن — 0593799355
                      <ArrowUpLeft className="h-4 w-4" />
                    </a>
                  </Button>
                </motion.div>
                <span className="text-xs text-muted-foreground">رد سريع عبر واتساب خلال اليوم</span>
              </div>
            </div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative hidden overflow-hidden rounded-xl lg:block"
            >
              <img
                src={bannerImage}
                alt="دليل النشر في المجلات العلمية"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" aria-hidden="true" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JournalsStatsBanner;
