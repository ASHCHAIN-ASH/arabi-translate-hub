import { motion, useReducedMotion } from "framer-motion";
import { Flag, Sparkles } from "lucide-react";

type Phrase = {
  text: string;
  highlight?: boolean;
};

const PHRASES: Phrase[] = [
  { text: "دام عزّك يا وطن", highlight: true },
  { text: "كل عام والمملكة العربية السعودية بخير" },
  { text: "فخرٌ لا ينتهي.. ووطنٌ يستحق المزيد" },
  { text: "عرض اليوم الوطني: خصم 20% على جميع خدمات FekrahEdu", highlight: true },
  { text: "نعتز بلغتنا.. ونبني的未来" },
  { text: "رؤيةٌ طموحة وجيلٌ يصنع المستقبل" },
  { text: "التعليم رسالة.. ونحن نبنيها معك" },
  { text: "كل عام وأنتم رمز العطاء", highlight: true },
];

const Diamond = () => (
  <span
    aria-hidden="true"
    className="mx-1 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-saudi-gold/80"
  />
);

const PhraseGroup = () => (
  <div className="flex shrink-0 items-center gap-3 pl-3" aria-hidden="true">
    {PHRASES.map((phrase, index) => (
      <span key={index} className="flex items-center gap-3">
        <span
          className={`whitespace-nowrap text-[12px] font-bold sm:text-[13px] ${
            phrase.highlight ? "text-saudi-gold" : "text-saudi-white"
          }`}
        >
          {phrase.text}
        </span>
        <Diamond />
      </span>
    ))}
  </div>
);

const NationalDayMarquee = ({ className = "" }: { className?: string }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div
      dir="rtl"
      className={`national-marquee relative flex items-stretch overflow-hidden rounded-2xl border border-saudi-gold/40 bg-gradient-to-l from-saudi-green via-[hsl(120_45%_16%)] to-[hsl(120_60%_9%)] shadow-soft ${className}`}
    >
      {/* نقشة خلفية خفيفة */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      {/* لمعة متحركة */}
      <div
        aria-hidden="true"
        className="national-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-l from-transparent via-white/25 to-transparent"
      />

      {/* شارة ثابتة يمينًا */}
      <div className="relative z-10 flex shrink-0 items-center gap-2 bg-saudi-gold px-3 py-2.5 text-saudi-green">
        <motion.span
          animate={reduceMotion ? undefined : { rotate: [0, -14, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="flex"
          aria-hidden="true"
        >
          <Flag className="h-4 w-4" />
        </motion.span>
        <span className="whitespace-nowrap text-[11px] font-black sm:text-xs">
          اليوم الوطني السعودي
        </span>
      </div>

      {/* الشريط المتحرك */}
      <div className="relative flex-1 overflow-hidden py-2.5">
        <span className="sr-only">
          بمناسبة اليوم الوطني السعودي: خصم 20% على جميع خدمات FekrahEdu باستثناء
          رسوم النشر في المجلات العلمية.
        </span>
        {reduceMotion ? (
          <div className="px-4 text-center text-[12px] font-bold text-saudi-white sm:text-[13px]">
            دام عزّك يا وطن — عرض اليوم الوطني: خصم 20% على جميع خدمات FekrahEdu
          </div>
        ) : (
          <div className="national-marquee-track flex w-max">
            <PhraseGroup />
            <PhraseGroup />
          </div>
        )}
      </div>

      {/* شارة الخصم يسارًا */}
      <div className="relative z-10 hidden shrink-0 items-center gap-1.5 border-r border-saudi-gold/30 bg-black/25 px-3 py-2.5 text-saudi-gold sm:flex">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="whitespace-nowrap text-[11px] font-black">خصم 20%</span>
      </div>
    </div>
  );
};

export default NationalDayMarquee;
