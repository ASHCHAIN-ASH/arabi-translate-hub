import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, CheckCircle2, Clock3, Mail, MapPin, MessageCircle, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/data/legacy/client";
import { sendToInbox } from "@/utils/inboxService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import contactHeroBackground from "@/assets/contact-hero-background.jpg";

const SERVICES = [
  "الترجمة الأكاديمية",
  "الترجمة القانونية",
  "الترجمة الطبية",
  "الترجمة التجارية",
  "خدمات البحث العلمي",
  "الاستشارات الأكاديمية",
  "التحرير والمراجعة",
  "النشر العلمي",
  "خدمة أخرى",
];

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    title: "واتساب",
    value: "0593799355",
    detail: "للاستفسارات والمراسلات الرسمية مع فريق خدمة العملاء",
    href: "https://wa.me/966593799355",
    label: "ابدأ المحادثة",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    value: "info@fekrahedu.com",
    detail: "للمستندات والمراسلات الأكاديمية الرسمية",
    href: "mailto:info@fekrahedu.com",
    label: "أرسل بريدًا",
  },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  serviceType: "",
};

const ContactUs = () => {
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const updateField = (field: keyof typeof INITIAL_FORM, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        title: "أكمل الحقول المطلوبة",
        description: "الاسم والبريد الإلكتروني ومحتوى الرسالة مطلوبة.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await sendToInbox({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        formType: "contact",
        sourcePage: "/contact",
      });

      const { error } = await supabase.functions.invoke("send-contact-message", {
        body: formData,
      });
      if (error) console.warn("Contact notification failed", error);

      toast({
        title: "وصلتنا رسالتك",
        description: "شكرًا لتواصلك، سيجيبك فريقنا في أقرب وقت.",
      });
      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: "تعذّر إرسال الرسالة",
        description: "حاول مرة أخرى، أو تواصل معنا مباشرة عبر واتساب.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const reveal = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.2 } };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO
        title="تواصل معنا | FekrahEdu"
        description="تواصل مع فريق FekrahEdu للاستفسار عن خدمات الترجمة والبحث العلمي والحلول الأكاديمية."
        keywords="تواصل FekrahEdu, خدمات أكاديمية, ترجمة, بحث علمي"
        url="https://fekrahedu.com/contact"
        type="website"
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "تواصل معنا | FekrahEdu",
          url: "https://fekrahedu.com/contact",
          mainEntity: {
            "@type": "Organization",
            name: "FekrahEdu",
            telephone: "+966593799355",
            email: "info@fekrahedu.com",
            address: { "@type": "PostalAddress", addressCountry: "SA" },
          },
        }}
      />
      <Header />

      <main>
        <section className="relative isolate min-h-[500px] overflow-hidden bg-primary sm:min-h-[560px]">
          <img
            src={contactHeroBackground}
            alt="مساحة عمل أكاديمية حديثة"
            width="1600"
            height="900"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover motion-safe:animate-[scale-in_1.2s_ease-out]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-l from-primary via-primary/90 to-secondary/60" />
          <motion.div
            aria-hidden="true"
            initial={reduceMotion ? undefined : { x: "35%" }}
            animate={reduceMotion ? undefined : { x: "-35%" }}
            transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            className="absolute inset-y-0 left-1/3 -z-10 w-px bg-primary-foreground/20"
          />
          <div className="container-responsive grid min-h-[500px] items-center gap-10 py-16 sm:min-h-[560px] sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="max-w-3xl text-primary-foreground"
            >
              <div className="mb-6 inline-flex items-center gap-2 border border-primary-foreground/25 bg-background/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                تواصل مباشر مع الفريق المختص
              </div>
              <h1 className="text-4xl font-bold leading-[1.35] sm:text-5xl lg:text-6xl">فكرتك الأكاديمية<br />تبدأ من رسالة</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-primary-foreground/85 sm:text-lg">
                شاركنا تفاصيل طلبك، وسيتولى فريق FekrahEdu توجيهه إلى المختص المناسب ومتابعته بعناية.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-primary-foreground/90">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5" />خصوصية كاملة لمعلوماتك</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-5 w-5" />خدمة تغطي جميع مناطق المملكة</span>
              </div>
            </motion.div>
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, x: -30 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="hidden border-r border-primary-foreground/25 pr-7 text-primary-foreground lg:block"
            >
              <p className="text-sm font-semibold text-primary-foreground/70">مسار رسالتك</p>
              <div className="mt-6 space-y-6">
                {["أرسل تفاصيل استفسارك", "نراجع الطلب بعناية", "يتواصل معك المختص"].map((step, index) => (
                  <div key={step} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary-foreground/30 bg-background/10 text-sm font-bold">{index + 1}</span>
                    <span className="font-semibold">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative z-10 border-b border-border bg-muted/30 pb-10 sm:pb-14">
          <div className="container-responsive -mt-8 grid gap-4 md:grid-cols-2">
            {CONTACT_METHODS.map((method, index) => (
              <motion.a
                {...reveal}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.06 }}
                key={method.title}
                href={method.href}
                target={method.title === "واتساب" ? "_blank" : undefined}
                rel={method.title === "واتساب" ? "noopener noreferrer" : undefined}
                className="group relative flex min-h-[172px] items-start gap-5 overflow-hidden rounded-lg border border-border bg-card p-6 shadow-medium transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:scale-105">
                  <method.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <strong className="block text-xl text-card-foreground">{method.title}</strong>
                  <span className="mt-1 block break-words text-lg font-bold text-primary" dir="ltr">{method.value}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted-foreground">{method.detail}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">{method.label}<ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" /></span>
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container-responsive grid items-start gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
            <motion.div {...reveal} transition={{ duration: 0.4 }} className="lg:sticky lg:top-28">
              <span className="inline-flex items-center gap-2 text-sm font-bold text-primary"><span className="h-px w-8 bg-primary" />راسل فريقنا</span>
              <h2 className="mt-4 text-3xl font-bold leading-[1.45] text-foreground sm:text-4xl">نستمع لتفاصيلك،<br />ونبدأ من حيث تحتاج</h2>
              <p className="mt-4 max-w-xl leading-8 text-muted-foreground">
                اكتب تفاصيل طلبك بوضوح، وسنراجع رسالتك ونربطك بالقسم المناسب.
              </p>
              <div className="mt-8 space-y-4 border-t border-border pt-6 text-sm text-muted-foreground">
                <p className="flex items-start gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />متابعة منظّمة خلال أوقات العمل الرسمية.</p>
                <p className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />تُستخدم بياناتك للرد على استفسارك فقط.</p>
                <p className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />توجيه مباشر إلى القسم الأكاديمي المختص.</p>
              </div>
            </motion.div>

            <motion.div {...reveal} transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.08 }} className="relative overflow-hidden rounded-lg border border-border bg-card p-5 shadow-medium sm:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-primary" />
              <div className="mb-7 border-b border-border pb-5">
                <p className="text-sm font-bold text-primary">نموذج التواصل</p>
                <h3 className="mt-1 text-2xl font-bold text-foreground">أرسل رسالتك إلى الفريق</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold">الاسم الكامل <span className="text-destructive">*</span></label>
                    <Input id="contact-name" autoComplete="name" value={formData.name} onChange={(event) => updateField("name", event.target.value)} placeholder="اكتب اسمك الكامل" className="h-12" required />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold">البريد الإلكتروني <span className="text-destructive">*</span></label>
                    <Input id="contact-email" type="email" inputMode="email" autoComplete="email" dir="ltr" value={formData.email} onChange={(event) => updateField("email", event.target.value)} placeholder="name@example.com" className="h-12 text-right" required />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold">رقم الهاتف</label>
                    <Input id="contact-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="05xxxxxxxx" className="h-12 text-right" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold">نوع الخدمة</label>
                    <Select value={formData.serviceType} onValueChange={(value) => updateField("serviceType", value)}>
                      <SelectTrigger className="h-12 text-right"><SelectValue placeholder="اختر الخدمة" /></SelectTrigger>
                      <SelectContent dir="rtl">
                        {SERVICES.map((service) => <SelectItem key={service} value={service}>{service}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold">موضوع الرسالة</label>
                  <Input id="contact-subject" value={formData.subject} onChange={(event) => updateField("subject", event.target.value)} placeholder="اكتب موضوعًا مختصرًا" className="h-12" />
                </div>

                <div>
                  <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">تفاصيل الرسالة <span className="text-destructive">*</span></label>
                  <Textarea id="contact-message" value={formData.message} onChange={(event) => updateField("message", event.target.value)} placeholder="اكتب تفاصيل طلبك أو استفسارك" className="min-h-36 resize-y" required />
                </div>

                <Button type="submit" size="lg" className="h-12 w-full gap-2 sm:w-auto sm:min-w-44" disabled={loading}>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {loading ? "جارٍ الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
