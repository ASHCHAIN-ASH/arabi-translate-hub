import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, GraduationCap } from "lucide-react";
import graduates from "@/assets/home-graduates-group.jpg";
import researcherFemale from "@/assets/home-hero-researcher-female.jpg";
import collab from "@/assets/home-students-collaboration.jpg";
import researcherMale from "@/assets/home-testimonial-researcher-male.jpg";

interface Story {
  image: string;
  name: string;
  role: string;
  university: string;
  quote: string;
  achievement: string;
  rating: number;
}

const stories: Story[] = [
  {
    image: graduates,
    name: "د. عبدالله المطيري",
    role: "خريج دكتوراه - علوم إدارية",
    university: "جامعة الملك سعود",
    quote: "بفضل فريق ماستر إيدو باث، أنهيت أطروحتي خلال 8 أشهر فقط، وحصلت على درجة امتياز مع مرتبة الشرف.",
    achievement: "🎓 امتياز مع مرتبة الشرف",
    rating: 5,
  },
  {
    image: researcherFemale,
    name: "أ. نوف العتيبي",
    role: "باحثة ماجستير - تربية",
    university: "جامعة الملك عبدالعزيز",
    quote: "خدمة التحليل الإحصائي SPSS كانت دقيقة جداً، والمراجعة المنهجية وفّرت علي شهور من العمل.",
    achievement: "📊 نشر بحث في Scopus",
    rating: 5,
  },
  {
    image: collab,
    name: "فريق بحثي - 6 باحثين",
    role: "مشروع بحث جماعي",
    university: "جامعة الملك فهد للبترول والمعادن",
    quote: "نسّقنا معهم على بحث مشترك، الالتزام بالمواعيد والجودة كان فوق التوقعات. شركاء حقيقيين للنجاح.",
    achievement: "🏆 جائزة أفضل بحث",
    rating: 5,
  },
  {
    image: researcherMale,
    name: "م. فهد الحربي",
    role: "باحث - تحليل بيانات",
    university: "جامعة الإمام محمد بن سعود",
    quote: "التحليل الإحصائي المتقدم والرسوم البيانية احترافية جداً، استخدمتها في عرضي أمام لجنة المناقشة.",
    achievement: "✨ مناقشة ناجحة",
    rating: 5,
  },
];

const SuccessStoriesCarousel = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % stories.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + stories.length) % stories.length);
  };

  const current = stories[index];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 relative overflow-hidden" dir="rtl">
      {/* خلفية زخرفية */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* العنوان */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs sm:text-sm font-medium mb-4">
            <GraduationCap className="h-4 w-4 text-amber-400" />
            قصص نجاح حقيقية
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            باحثون وطلاب{" "}
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">
              غيّروا مسارهم معنا
            </span>
          </h2>
          <p className="text-base sm:text-lg text-blue-100/80 max-w-2xl mx-auto">
            من فكرة بحثية إلى نشر علمي محكم — رحلة نجاح موثقة
          </p>
        </motion.div>

        {/* الكاروسيل */}
        <div className="max-w-6xl mx-auto relative">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 80 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="grid grid-cols-1 lg:grid-cols-5 gap-0"
              >
                {/* الصورة */}
                <div className="lg:col-span-2 relative h-64 sm:h-80 lg:h-auto min-h-[320px] overflow-hidden">
                  <motion.img
                    src={current.image}
                    alt={current.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 6, ease: "easeOut" }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent lg:bg-gradient-to-l" />
                  {/* شارة الإنجاز */}
                  <motion.div
                    className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-slate-900 text-xs sm:text-sm font-bold shadow-xl"
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  >
                    {current.achievement}
                  </motion.div>
                </div>

                {/* المحتوى */}
                <div className="lg:col-span-3 p-6 sm:p-8 lg:p-12 flex flex-col justify-center text-white">
                  {/* النجوم */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                      >
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>

                  <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-amber-400/40 mb-3" />

                  <p className="text-base sm:text-lg lg:text-xl leading-relaxed mb-5 sm:mb-6 text-blue-50">
                    {current.quote}
                  </p>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-lg sm:text-xl font-bold mb-1">{current.name}</p>
                    <p className="text-sm text-blue-200/80 mb-1">{current.role}</p>
                    <p className="text-xs text-amber-300/90 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {current.university}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* أزرار التنقل */}
            <button
              onClick={() => go(-1)}
              className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 z-10"
              aria-label="السابق"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110 z-10"
              aria-label="التالي"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* مؤشرات */}
          <div className="flex justify-center gap-2 mt-6">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-amber-400" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`الذهاب للقصة ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesCarousel;
