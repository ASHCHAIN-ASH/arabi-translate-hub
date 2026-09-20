import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Check,
  GraduationCap,
  MapPinned,
  Plane,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import campusImage from "@/assets/admission-university-campus.jpg";

const destinationLabels = [
  { label: "تركيا", icon: MapPinned },
  { label: "مصر", icon: Building2 },
  { label: "بريطانيا", icon: GraduationCap },
  { label: "ألمانيا", icon: Plane },
];

export function StudyAbroadSlider() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="bg-muted/40 py-8 sm:py-10 lg:py-12"
      aria-label="خدمات الدراسة بالخارج"
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: reduceMotion ? 0 : 0.65, ease: "easeOut" }}
          className="relative mx-auto min-h-[500px] max-w-6xl overflow-hidden rounded-lg border border-primary/20 bg-foreground shadow-strong sm:min-h-[440px] lg:min-h-[420px]"
        >
          <motion.img
            src={campusImage}
            alt="حرم جامعي دولي ضمن خدمات FekrahEdu للدراسة بالخارج"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            initial={reduceMotion ? { scale: 1 } : { scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 1.8, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/75 to-foreground/10 lg:bg-gradient-to-l lg:from-foreground lg:via-foreground/80 lg:to-foreground/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/15 to-transparent" />

          <div className="relative z-10 flex min-h-[500px] items-end p-5 sm:min-h-[440px] sm:p-8 lg:min-h-[420px] lg:items-center lg:p-12">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold text-primary-foreground backdrop-blur-md sm:text-sm">
                <GraduationCap className="h-4 w-4" />
                خدمات الدراسة بالخارج من FekrahEdu
              </div>

              <h2 className="text-2xl font-bold leading-[1.4] text-primary-foreground sm:text-3xl lg:text-4xl">
                قبولك الجامعي بالخارج… صار أسهل مما تتخيل
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-primary-foreground/80 sm:text-base">
                نساعدك في اختيار الجامعة والتخصص، تقييم فرص القبول، تجهيز الطلب ومتابعته حتى استلام القبول.
              </p>

              <div className="mt-5 grid max-w-xl gap-2 sm:grid-cols-3">
                {["خيارات جامعية مناسبة", "متابعة خطوة بخطوة", "عقد واضح وآمن"].map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2 text-xs font-medium text-primary-foreground sm:text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {destinationLabels.map(({ label, icon: DestinationIcon }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-foreground/45 px-2.5 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-md">
                    <DestinationIcon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button size="lg" onClick={() => navigate("/admission-services")} className="w-full sm:w-auto">
                  ابدأ طلبك الآن
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
                <span className="inline-flex items-center gap-1.5 text-xs leading-5 text-primary-foreground/75">
                  <ShieldCheck className="h-4 w-4" />
                  استلم قبولك قبل دفع أتعاب تجهيز الملف وفق الشروط
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}