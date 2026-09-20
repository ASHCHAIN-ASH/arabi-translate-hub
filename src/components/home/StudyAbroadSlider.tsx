import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  MapPinned,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import campusImage from "@/assets/admission-university-campus.jpg";
import acceptanceImage from "@/assets/admission-acceptance-desk.jpg";
import globalCampusImage from "@/assets/university-admission-background.jpg";

const slides = [
  {
    eyebrow: "خدمات الدراسة بالخارج",
    title: "قبولك الجامعي بالخارج… صار أسهل مما تتخيل",
    description:
      "نساعدك في الوصول إلى خيارات جامعية مناسبة في تركيا ومصر وبريطانيا وألمانيا وغيرها من الوجهات الدراسية.",
    image: campusImage,
    imageAlt: "حرم جامعي دولي ضمن خدمات FekrahEdu للدراسة بالخارج",
    icon: GraduationCap,
    highlights: ["اختيار الجامعة والتخصص", "تقييم فرص القبول", "خيارات دولية متعددة"],
  },
  {
    eyebrow: "من الاختيار حتى القبول",
    title: "ملفك الجامعي بمتابعة واضحة خطوة بخطوة",
    description:
      "نجهز طلبك، نقدمه للجامعة، ونتابع ملفك معك حتى استلام القبول وفق آلية الخدمة وشروطها.",
    image: acceptanceImage,
    imageAlt: "تجهيز ومراجعة ملف قبول جامعي",
    icon: FileCheck2,
    highlights: ["تجهيز طلب القبول", "متابعة الملف مع الجامعة", "إرشاد دراسي مستمر"],
  },
  {
    eyebrow: "ثقة وأمان مع FekrahEdu",
    title: "لا تحتار بين عشرات الجامعات… اختر الأنسب لك",
    description:
      "استلم قبولك الجامعي قبل دفع أتعاب تجهيز الملف، مع رسوم قبول رمزية مستقلة وآلية تعاقد واضحة.",
    image: globalCampusImage,
    imageAlt: "جامعة دولية وخيارات متنوعة للدراسة بالخارج",
    icon: ShieldCheck,
    highlights: ["عقد واضح يحفظ الحقوق", "قبول موثّق قبل الأتعاب", "دعم ما قبل السفر"],
  },
];

const destinationLabels = [
  { label: "تركيا", icon: MapPinned },
  { label: "مصر", icon: Building2 },
  { label: "بريطانيا", icon: GraduationCap },
  { label: "ألمانيا", icon: Plane },
];

export function StudyAbroadSlider() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reduceMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  const move = (direction: number) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  };

  const activeSlide = slides[activeIndex];
  const ActiveIcon = activeSlide.icon;

  return (
    <section
      className="bg-muted/40 py-8 sm:py-10 lg:py-12"
      aria-label="خدمات الدراسة بالخارج"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative mx-auto max-w-6xl overflow-hidden rounded-lg border border-border bg-card shadow-strong"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeIndex}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, x: -24 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
              className="grid min-h-[450px] lg:min-h-[390px] lg:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="relative order-1 min-h-[220px] overflow-hidden lg:order-2 lg:min-h-full">
                <motion.img
                  key={activeSlide.image}
                  src={activeSlide.image}
                  alt={activeSlide.imageAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  initial={reduceMotion ? { scale: 1 } : { scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 5.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent lg:bg-gradient-to-r lg:from-foreground/65 lg:via-foreground/10 lg:to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2 sm:inset-x-6 sm:bottom-6">
                  {destinationLabels.map(({ label, icon: DestinationIcon }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/35 bg-foreground/55 px-2.5 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-md"
                    >
                      <DestinationIcon className="h-3.5 w-3.5" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="order-2 flex flex-col justify-center px-5 pb-14 pt-5 sm:px-8 sm:pb-14 sm:pt-8 lg:order-1 lg:p-10 xl:p-12">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <ActiveIcon className="h-5 w-5" />
                  </span>
                  {activeSlide.eyebrow}
                </div>

                <h2 className="max-w-2xl text-2xl font-bold leading-[1.45] text-card-foreground sm:text-3xl lg:text-4xl">
                  {activeSlide.title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {activeSlide.description}
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {activeSlide.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 text-xs font-medium text-card-foreground sm:text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button size="lg" onClick={() => navigate("/admission-services")} className="w-full sm:w-auto">
                    ابدأ طلبك الآن
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </Button>
                  <span className="text-xs leading-5 text-muted-foreground">
                    FekrahEdu — خطوتك الأولى نحو الدراسة بالخارج
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 lg:left-auto lg:right-3">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-medium"
              onClick={() => move(-1)}
              aria-label="الشريحة السابقة"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full shadow-medium"
              onClick={() => move(1)}
              aria-label="الشريحة التالية"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-card/85 px-3 py-2 shadow-medium backdrop-blur-md lg:bottom-4 lg:left-auto lg:right-[calc(50%+1rem)] lg:translate-x-0">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-7 bg-primary" : "w-2 bg-muted-foreground/35 hover:bg-muted-foreground/60"
                }`}
                aria-label={`عرض الشريحة ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}