import { motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpenCheck,
  BriefcaseBusiness,
  GraduationCap,
  Languages,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import translationImage from "@/assets/academic-service-translation.jpg";
import studentsImage from "@/assets/home-students-collaboration.jpg";
import businessImage from "@/assets/real-business-services.jpg";
import admissionImage from "@/assets/university-admission-background.jpg";
import publishingImage from "@/assets/academic-service-publishing.jpg";

const services = [
  {
    title: "خدمات الترجمة",
    description: "ترجمة أكاديمية ومهنية دقيقة للأبحاث والوثائق والمحتوى المتخصص.",
    image: translationImage,
    icon: Languages,
    route: "/translation-services",
    accent: "bg-primary",
    eyebrow: "دقة لغوية",
  },
  {
    title: "خدمات الطلاب",
    description: "دعم دراسي منظم يساعد الطالب في مهامه ومشاريعه ومسيرته الأكاديمية.",
    image: studentsImage,
    icon: GraduationCap,
    route: "/research/other-student-services",
    accent: "bg-success",
    eyebrow: "دعم أكاديمي",
  },
  {
    title: "خدمات الأعمال",
    description: "حلول احترافية للتقارير ودراسات الأعمال والمحتوى المؤسسي المتخصص.",
    image: businessImage,
    icon: BriefcaseBusiness,
    route: "/research/business",
    accent: "bg-secondary",
    eyebrow: "حلول مؤسسية",
  },
  {
    title: "خدمات الدراسة بالخارج",
    subtitle: "الابتعاث",
    description: "إرشاد للقبولات الجامعية وتجهيز ملف التقديم لبدء رحلتك الدولية بثقة.",
    image: admissionImage,
    icon: Plane,
    route: "/admission-services",
    accent: "bg-warning",
    eyebrow: "قبول وابتعاث",
  },
  {
    title: "خدمات النشر العلمي",
    description: "دعم متكامل لتهيئة الأبحاث واختيار المجلات ومتابعة رحلة النشر العلمي.",
    image: publishingImage,
    icon: BookOpenCheck,
    route: "/services/publishing-services",
    accent: "bg-destructive",
    eyebrow: "بحث ونشر",
  },
];

const ServicesShowcase = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="services-heading"
      className="relative overflow-hidden border-y border-border/70 bg-muted/35 py-16 sm:py-20 lg:py-24"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,hsl(var(--border)/.45)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.45)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary shadow-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            منظومة خدمات FekrahEdu
          </div>
          <h2 id="services-heading" className="text-3xl font-black leading-tight text-foreground sm:text-4xl lg:text-5xl">
            نقدم لكم <span className="text-primary">أفضل الخدمات</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            خمسة مسارات متخصصة تجمع احتياجاتك الأكاديمية والمهنية في مكان واحد، بخدمة واضحة ومتابعة منظمة.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isWide = index < 2;

            return (
              <motion.article
                key={service.title}
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`group min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-medium transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-2 hover:border-primary/35 hover:shadow-strong ${
                  isWide ? "lg:col-span-3" : "lg:col-span-2"
                }`}
              >
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate(service.route)}
                  className="flex h-full w-full flex-col items-stretch justify-start whitespace-normal rounded-none p-0 text-right hover:bg-card focus-visible:ring-inset"
                  aria-label={`استكشف ${service.title}`}
                >
                  <div className={`relative w-full overflow-hidden ${isWide ? "aspect-[16/8] sm:aspect-[16/7]" : "aspect-[16/9]"}`}>
                    <img
                      src={service.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                      <span className="rounded-md border border-primary-foreground/25 bg-background/85 px-3 py-1.5 text-xs font-bold text-foreground backdrop-blur-md">
                        {service.eyebrow}
                      </span>
                      <motion.span
                        whileHover={reduceMotion ? undefined : { rotate: -7, scale: 1.08 }}
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md ${service.accent} text-primary-foreground shadow-lg`}
                      >
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </motion.span>
                    </div>
                  </div>

                  <div className="flex w-full flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black leading-snug text-card-foreground sm:text-2xl">
                        {service.title}
                      </h3>
                      {service.subtitle && (
                        <span className="rounded-md border border-warning bg-warning px-3 py-1 text-xs font-black text-foreground shadow-sm">
                          {service.subtitle}
                        </span>
                      )}
                    </div>
                    <p className="mb-6 flex-1 text-sm leading-7 text-muted-foreground sm:text-base">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-2 font-bold text-primary">
                      استكشف الخدمات
                      <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Button>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="mt-10 flex justify-center"
        >
          <Button size="lg" onClick={() => navigate("/services")} className="h-12 px-7 text-base shadow-primary">
            عرض جميع الخدمات
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;