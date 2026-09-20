import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Building2,
  Check,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  GraduationCap,
  Landmark,
  MapPin,
  Plane,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import admissionDesk from "@/assets/admission-acceptance-desk.jpg";
import universityCampus from "@/assets/admission-university-campus.jpg";

const ADMISSION_URL = "https://fekrah-global.com/ar/auth/register";

const destinations = [
  { title: "الجامعات التركية", description: "متابعة متخصصة للحصول على قبول جامعي في تركيا.", icon: Landmark },
  { title: "الجامعات المصرية", description: "اختيار الجامعة والبرنامج وتجهيز طلب القبول في مصر.", icon: Building2 },
  { title: "الجامعات الأردنية", description: "دعم كامل للتقديم والمتابعة في الجامعات الأردنية.", icon: GraduationCap },
  { title: "دول أخرى", description: "خيارات دولية أخرى تُحدد حسب مؤهلاتك وميزانيتك.", icon: Globe2 },
];

const admissionTypes = [
  "قبول البكالوريوس",
  "قبول الماجستير",
  "قبول الدكتوراه",
  "قبول اللغة والتحضيري",
  "القبول للطلاب المحولين",
  "القبول لمن لديهم فجوة دراسية",
  "القبول للطلاب الحاصلين على معدلات منخفضة",
];

const admissionJourney = [
  "اختيار الجامعة المناسبة حسب المعدل",
  "نصيحة من مختص فكرة لاختيار التخصص المناسب",
  "التحقق من شروط القبول مع مختص فكرة",
  "تجهيز وتقديم طلب القبول ومتابعته حتى صدوره",
  "اختيار أكثر من جامعة لرفع فرص القبول",
];

const additionalServices = [
  "الاستشارة الدراسية",
  "اختيار الدولة المناسبة",
  "اختيار المدينة",
  "اختيار الجامعة",
  "اختيار التخصص",
  "مقارنة تكاليف الدراسة",
  "مقارنة تكاليف المعيشة",
  "متطلبات التأشيرة",
  "السكن الجامعي",
  "التأمين",
  "المواصلات",
  "فتح حساب بنكي عند الحاجة",
  "تجهيز ملف السفر",
  "قائمة المستندات المطلوبة",
  "إرشادات الوصول والاستقرار",
];

const openAdmissionPlatform = (params?: Record<string, string>) => {
  const url = new URL(ADMISSION_URL);
  Object.entries(params ?? {}).forEach(([key, value]) => url.searchParams.set(key, value));
  window.location.href = url.toString();
};

const AdmissionServices = () => {
  const reduceMotion = useReducedMotion();
  const [firstUniversity, setFirstUniversity] = useState("");
  const [secondUniversity, setSecondUniversity] = useState("");
  const canCompare = firstUniversity.trim().length > 1 && secondUniversity.trim().length > 1;

  const requestComparison = () => {
    if (!canCompare) return;
    openAdmissionPlatform({
      service: "university-comparison",
      university_one: firstUniversity.trim(),
      university_two: secondUniversity.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO
        title="خدمات الدراسة بالخارج (ابتعاث) | FekrahEdu"
        description="خطتك للدراسة بالخارج من اختيار الجامعة والتخصص حتى القبول وإرشادات ما بعد القبول، مع خيار الدفع بعد الحصول على القبول."
        keywords="الدراسة بالخارج, ابتعاث, قبول جامعي, جامعات تركيا, جامعات مصر, جامعات الأردن, مقارنة الجامعات"
        url="https://fekrahedu.com/admission-services"
      />
      <Header />

      <main className="overflow-hidden">
        <section className="relative isolate min-h-[670px] border-b border-border">
          <img
            src={universityCampus}
            alt="حرم جامعي دولي ضمن خدمات الدراسة بالخارج"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-l from-foreground/95 via-foreground/80 to-foreground/45" />
          <div className="container mx-auto flex min-h-[670px] items-center px-4 py-20 sm:px-6 lg:px-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl text-primary-foreground"
            >
              <span className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary-foreground/25 bg-background/15 px-4 py-2 text-sm font-bold backdrop-blur-md">
                <Plane className="h-4 w-4" /> خدمات الدراسة بالخارج (ابتعاث)
              </span>
              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                خطتك للدراسة بالخارج من A إلى Z
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-primary-foreground/85 sm:text-xl">
                نساعدك في اختيار الدولة والجامعة والتخصص، وتجهيز الملف والتقديم والمتابعة حتى تحصل على قبولك الجامعي.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => openAdmissionPlatform({ service: "study-abroad" })} className="h-13 gap-2 px-7 text-base">
                  ابدأ طلب الدراسة بالخارج <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" asChild className="h-13 border-primary-foreground/35 bg-background/15 px-7 text-base text-primary-foreground hover:bg-background/25 hover:text-primary-foreground">
                  <a href="#compare">قارن بين جامعتين</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border bg-warning/10 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid items-center gap-6 rounded-lg border-2 border-warning bg-card p-6 shadow-medium md:grid-cols-[auto_1fr_auto] md:p-8"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-warning text-foreground">
                <Banknote className="h-8 w-8" />
              </div>
              <div>
                <p className="mb-1 text-sm font-black text-warning-foreground">عرض يضمن وضوح الالتزام</p>
                <h2 className="text-2xl font-black text-foreground sm:text-3xl">ادفع بعد الحصول على القبول</h2>
                <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
                  يوقّع الطالب عقدًا إلكترونيًا لضمان جدية الطلب، يوضّح الخدمة والمبلغ المستحق وموعد سداده بعد صدور القبول الجامعي والتحقق منه.
                </p>
              </div>
              <Button onClick={() => openAdmissionPlatform({ service: "pay-after-acceptance" })} className="h-12 gap-2 px-6">
                ابدأ ووقّع العقد <FileCheck2 className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="text-sm font-black text-primary">وجهات متعددة، متابعة واحدة</span>
              <h2 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">أين تريد أن تبدأ رحلتك؟</h2>
              <p className="mt-4 leading-8 text-muted-foreground">نراجع فرصك ونرشّح الخيارات الأنسب بدل التقديم العشوائي.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {destinations.map(({ title, description, icon: Icon }, index) => (
                <motion.article
                  key={title}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.07 }}
                  className="rounded-lg border border-border bg-card p-6 shadow-soft transition-transform duration-300 hover:-translate-y-1"
                >
                  <Icon className="h-9 w-9 text-primary" />
                  <h3 className="mt-5 text-xl font-black text-card-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/35 py-16 sm:py-20">
          <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <span className="text-sm font-black text-primary">قبول يناسب حالتك</span>
              <h2 className="mt-3 text-3xl font-black text-foreground">خيارات القبول المتاحة</h2>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {admissionTypes.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="font-bold leading-7 text-card-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-black text-primary">متابعة مع مختص فكرة</span>
              <h2 className="mt-3 text-3xl font-black text-foreground">رحلة القبول خطوة بخطوة</h2>
              <div className="mt-7 space-y-3">
                {admissionJourney.map((item, index) => (
                  <div key={item} className="flex items-center gap-4 border-b border-border bg-background px-4 py-4 last:border-b-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary font-black text-primary-foreground">{index + 1}</span>
                    <span className="font-bold leading-7 text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="compare" className="scroll-mt-24 py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid overflow-hidden rounded-lg border border-border bg-card shadow-strong lg:grid-cols-[0.8fr_1.2fr]">
              <div className="relative min-h-72">
                <img src={admissionDesk} alt="مقارنة خيارات القبول الجامعي" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 to-foreground/15" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-primary-foreground">
                  <Scale className="h-10 w-10" />
                  <h2 className="mt-4 text-3xl font-black">قارن بين جامعتين</h2>
                  <p className="mt-3 leading-7 text-primary-foreground/80">يستلم مختص فكرة طلبك ويقارن الشروط والتخصص والتكلفة والموقع بما يناسبك.</p>
                </div>
              </div>
              <div className="p-6 sm:p-9">
                <p className="mb-6 leading-8 text-muted-foreground">أدخل اسمي الجامعتين، ثم أكمل الطلب في منصة القبول ليجهّز المختص مقارنة موثقة.</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="space-y-2 font-bold text-foreground">
                    <span>الجامعة الأولى</span>
                    <input
                      value={firstUniversity}
                      onChange={(event) => setFirstUniversity(event.target.value)}
                      placeholder="مثال: جامعة إسطنبول"
                      className="h-12 w-full rounded-md border border-input bg-background px-4 font-normal outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25"
                    />
                  </label>
                  <label className="space-y-2 font-bold text-foreground">
                    <span>الجامعة الثانية</span>
                    <input
                      value={secondUniversity}
                      onChange={(event) => setSecondUniversity(event.target.value)}
                      placeholder="مثال: جامعة القاهرة"
                      className="h-12 w-full rounded-md border border-input bg-background px-4 font-normal outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/25"
                    />
                  </label>
                </div>
                <Button onClick={requestComparison} disabled={!canCompare} className="mt-6 h-12 w-full gap-2 sm:w-auto">
                  أرسل طلب المقارنة للمختص <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-muted/35 py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 text-sm font-black text-primary"><Globe2 className="h-4 w-4" /> خدمات إضافية</span>
              <h2 className="mt-3 text-3xl font-black text-foreground sm:text-4xl">كل ما تحتاجه قبل السفر والاستقرار</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {additionalServices.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-4 shadow-soft">
                  <Check className="h-5 w-5 shrink-0 text-success" />
                  <span className="font-bold text-card-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="relative overflow-hidden rounded-lg border-2 border-primary bg-primary p-7 text-primary-foreground shadow-strong sm:p-9">
                <Sparkles className="h-10 w-10" />
                <span className="mt-5 inline-flex rounded-md bg-primary-foreground/15 px-3 py-1 text-xs font-black">الخدمة المميزة المقترحة</span>
                <h2 className="mt-4 text-3xl font-black">باقة القبول الجامعي الكامل</h2>
                <p className="mt-4 text-lg leading-8 text-primary-foreground/85">اختيار الجامعة + تجهيز الملف + التقديم + المتابعة + القبول + إرشادات ما بعد القبول.</p>
                <Button variant="secondary" size="lg" onClick={() => openAdmissionPlatform({ package: "full-admission" })} className="mt-7 gap-2">
                  اطلب الباقة الكاملة <ArrowLeft className="h-5 w-5" />
                </Button>
              </article>

              <article className="rounded-lg border border-border bg-card p-7 shadow-medium sm:p-9">
                <ShieldCheck className="h-10 w-10 text-success" />
                <h2 className="mt-5 text-3xl font-black text-card-foreground">عقد واضح يحفظ حقوق الطرفين</h2>
                <div className="mt-6 space-y-4">
                  {["تحديد الجامعات والخدمات المطلوبة", "توضيح مبلغ الخدمة وموعد استحقاقه", "إثبات صدور القبول والتحقق منه قبل الدفع", "توقيع إلكتروني لضمان الجدية والشفافية"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="font-bold leading-7 text-card-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-foreground py-14 text-primary-foreground">
          <div className="container mx-auto flex flex-col items-center justify-between gap-7 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-right">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-black text-secondary"><Users className="h-4 w-4" /> مختصو فكرة معك في كل مرحلة</span>
              <h2 className="mt-3 text-3xl font-black">ابدأ خطتك للدراسة بالخارج اليوم</h2>
              <p className="mt-3 text-primary-foreground/70">اختر خدماتك ووجهتك، وسنتابع معك حتى الحصول على القبول.</p>
            </div>
            <Button size="lg" onClick={() => openAdmissionPlatform({ service: "study-abroad" })} className="h-13 shrink-0 gap-2 px-8 text-base">
              الانتقال إلى منصة الدراسة بالخارج <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdmissionServices;
