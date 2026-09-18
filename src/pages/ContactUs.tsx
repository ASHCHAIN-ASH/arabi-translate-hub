import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock3, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from "lucide-react";
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
    value: "+966 55 960 0824",
    detail: "للتواصل السريع مع فريق خدمة العملاء",
    href: "https://wa.me/966593799355",
    label: "ابدأ المحادثة",
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    value: "info@fekrahedu.com",
    detail: "للطلبات والاستفسارات والمراسلات الرسمية",
    href: "mailto:info@fekrahedu.com",
    label: "أرسل بريدًا",
  },
  {
    icon: Phone,
    title: "الهاتف",
    value: "0593799355",
    detail: "للتواصل المباشر خلال أوقات العمل",
    href: "tel:+966593799355",
    label: "اتصل الآن",
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
        <section className="relative isolate min-h-[420px] overflow-hidden bg-primary sm:min-h-[480px]">
          <img
            src={contactHeroBackground}
            alt="مساحة عمل أكاديمية حديثة"
            width="1600"
            height="900"
            fetchPriority="high"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-l from-primary/95 via-primary/85 to-secondary/75" />
          <div className="container-responsive flex min-h-[420px] items-center py-16 sm:min-h-[480px] sm:py-20">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="max-w-3xl text-primary-foreground"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-background/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                فريقنا جاهز لمساعدتك
              </div>
              <h1 className="text-4xl font-bold leading-[1.35] sm:text-5xl lg:text-6xl">تواصل معنا</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/85 sm:text-xl">
                أخبرنا بما تحتاجه، وسيوجّه فريق FekrahEdu استفسارك إلى المختص المناسب.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-primary-foreground/90">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5" />خصوصية لمعلوماتك</span>
                <span className="inline-flex items-center gap-2"><MapPin className="h-5 w-5" />نخدم جميع مناطق المملكة</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border bg-muted/30 py-8 sm:py-10">
          <div className="container-responsive grid gap-4 md:grid-cols-3">
            {CONTACT_METHODS.map((method, index) => (
              <motion.a
                {...reveal}
                transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.06 }}
                key={method.title}
                href={method.href}
                target={method.title === "واتساب" ? "_blank" : undefined}
                rel={method.title === "واتساب" ? "noopener noreferrer" : undefined}
                className="group flex min-h-[150px] items-start gap-4 rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <method.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <strong className="block text-lg text-card-foreground">{method.title}</strong>
                  <span className="mt-1 block break-words font-medium text-primary" dir="ltr">{method.value}</span>
                  <span className="mt-2 block text-sm leading-6 text-muted-foreground">{method.detail}</span>
                  <span className="mt-3 block text-sm font-semibold text-primary">{method.label}</span>
                </span>
              </motion.a>
            ))}
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container-responsive grid items-start gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
            <motion.div {...reveal} transition={{ duration: 0.4 }} className="lg:sticky lg:top-28">
              <span className="text-sm font-bold text-primary">راسل فريقنا</span>
              <h2 className="mt-3 text-3xl font-bold leading-[1.35] text-foreground sm:text-4xl">كيف يمكننا مساعدتك؟</h2>
              <p className="mt-4 max-w-xl leading-8 text-muted-foreground">
                اكتب تفاصيل طلبك بوضوح، وسنراجع رسالتك ونربطك بالقسم المناسب.
              </p>
              <div className="mt-7 space-y-4 border-t border-border pt-6 text-sm text-muted-foreground">
                <p className="flex items-start gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />الرد خلال أوقات العمل الرسمية.</p>
                <p className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />تُستخدم بياناتك للرد على استفسارك فقط.</p>
              </div>
            </motion.div>

            <motion.div {...reveal} transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.08 }} className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-8">
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
