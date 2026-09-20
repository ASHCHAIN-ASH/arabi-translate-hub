import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, Atom, BookOpen, BookOpenCheck, BriefcaseBusiness, CheckCircle2,
  ChevronLeft, ExternalLink, FileCheck2, Filter, Gavel, Globe2, GraduationCap,
  HeartPulse, Languages, LibraryBig, MessageCircle, Microscope, Search, ShieldCheck, Sparkles,
  Stethoscope, X, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { journals, type JournalRecord, type JournalSource } from "@/data/journals";

const PAGE_SIZE = 12;
const ALL = "all";
const normalize = (value: string) => value.toLocaleLowerCase("ar").replace(/[()\s-]/g, "");

const sourceLabels: Record<JournalSource, string> = {
  existing: "القائمة الأساسية",
  uploaded: "القائمة المضافة",
};

const categoryVisuals: Record<string, { icon: LucideIcon; iconClass: string; panelClass: string; badgeClass: string }> = {
  "الطب والصحة": { icon: Stethoscope, iconClass: "text-destructive", panelClass: "bg-destructive/10 border-destructive/20", badgeClass: "bg-destructive/10 text-destructive border-destructive/20" },
  "الهندسة والتقنية": { icon: Zap, iconClass: "text-primary", panelClass: "bg-primary/10 border-primary/20", badgeClass: "bg-primary/10 text-primary border-primary/20" },
  "التربية والعلوم الإنسانية": { icon: GraduationCap, iconClass: "text-secondary", panelClass: "bg-secondary/10 border-secondary/20", badgeClass: "bg-secondary/10 text-secondary border-secondary/20" },
  "الإدارة والاقتصاد": { icon: BriefcaseBusiness, iconClass: "text-success", panelClass: "bg-success/10 border-success/20", badgeClass: "bg-success/10 text-success border-success/20" },
  "القانون والسياسات": { icon: Gavel, iconClass: "text-warning", panelClass: "bg-warning/10 border-warning/20", badgeClass: "bg-warning/10 text-warning border-warning/20" },
  "العلوم الطبيعية": { icon: Atom, iconClass: "text-accent", panelClass: "bg-accent/10 border-accent/20", badgeClass: "bg-accent/10 text-accent border-accent/20" },
  "متعددة التخصصات": { icon: Globe2, iconClass: "text-primary", panelClass: "bg-primary/10 border-primary/20", badgeClass: "bg-primary/10 text-primary border-primary/20" },
};

const featurePanels = [
  { icon: Search, title: "بحث ذكي وسريع", text: "ابحث بالاسم أو الناشر أو رقم ISSN من مكان واحد.", className: "border-primary/20 bg-primary/5 text-primary" },
  { icon: Filter, title: "تصفية حسب المجال", text: "رتّب الخيارات حسب التخصص والقائمة وتوفر رقم ISSN.", className: "border-secondary/20 bg-secondary/5 text-secondary" },
  { icon: ExternalLink, title: "وصول مباشر", text: "انتقل إلى الموقع الرسمي للمجلة لمراجعة أحدث متطلباتها.", className: "border-accent/20 bg-accent/5 text-accent" },
];

function JournalCard({ journal, index }: { journal: JournalRecord; index: number }) {
  const reduceMotion = useReducedMotion();
  const visual = categoryVisuals[journal.category] || categoryVisuals["متعددة التخصصات"];
  const Icon = visual.icon;
  const host = useMemo(() => {
    try { return new URL(journal.website).hostname.replace(/^www\./, ""); }
    catch { return journal.website; }
  }, [journal.website]);

  const whatsappUrl = useMemo(() => {
    const lines = [
      "السلام عليكم، أرغب بالاستفسار عن النشر في هذه المجلة:",
      "",
      journal.nameAr ? `• الاسم بالعربية: ${journal.nameAr}` : "",
      `• اسم المجلة: ${journal.name}`,
      journal.publisher ? `• الناشر: ${journal.publisher}` : "",
      `• المجال: ${journal.category}`,
      `• رقم ISSN: ${journal.issn || "غير مدوّن"}`,
      `• رابط المجلة: ${journal.website}`,
      "",
      "أرجو إفادتي بتفاصيل خدمة النشر والرسوم والمدة.",
    ].filter(Boolean);
    return `https://wa.me/966593799355?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [journal]);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-55px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.045, 0.28) }}
      whileHover={reduceMotion ? undefined : { y: -7 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/80 bg-card shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-primary/30 hover:shadow-strong"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-primary via-secondary to-accent" />
      <div className="absolute -left-10 -top-10 h-28 w-28 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" aria-hidden="true" />
      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <motion.div
            whileHover={reduceMotion ? undefined : { rotate: [0, -8, 8, 0], scale: 1.08 }}
            transition={{ duration: 0.45 }}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border ${visual.panelClass}`}
          >
            <Icon className={`h-7 w-7 ${visual.iconClass}`} aria-hidden="true" />
          </motion.div>
          <Badge variant="outline" className={visual.badgeClass}>{journal.category}</Badge>
        </div>

        <div className="min-h-[7.5rem]">
          {journal.nameAr && <h2 className="mb-1 text-lg font-bold leading-8 text-foreground">{journal.nameAr}</h2>}
          <p dir="ltr" className="text-left text-base font-semibold leading-7 text-foreground">{journal.name}</p>
          {journal.publisher && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{journal.publisher}</p>}
        </div>

        <div className="my-5 grid grid-cols-2 gap-3 rounded-md bg-muted/50 p-3 text-sm">
          <div className="min-w-0">
            <span className="block text-xs text-muted-foreground">المجال</span>
            <span className="mt-1 block truncate font-semibold text-foreground" title={journal.category}>{journal.category}</span>
          </div>
          <div className="border-r border-border pr-3">
            <span className="block text-xs text-muted-foreground">E-ISSN / ISSN</span>
            <span dir="ltr" className="mt-1 block text-right font-mono font-semibold text-foreground">{journal.issn || "غير مدوّن"}</span>
          </div>
        </div>

        {journal.subjects && journal.subjects.length > 0 && (
          <div className="mb-5 flex min-h-7 flex-wrap gap-1.5">
            {journal.subjects.slice(0, 3).map((subject) => <Badge key={subject} variant="secondary" className="font-normal">{subject}</Badge>)}
          </div>
        )}

        <div className="mt-auto space-y-3 border-t border-border pt-4">
          <span dir="ltr" className="block min-w-0 truncate text-left text-xs text-muted-foreground" title={host}>{host}</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button asChild size="sm" className="gap-2 shadow-primary">
              <a href={journal.website} target="_blank" rel="noopener noreferrer">
                زيارة المجلة <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-2 border-success/30 bg-success/5 text-success hover:bg-success/10 hover:text-success">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`استفسار عبر واتساب عن ${journal.nameAr || journal.name}`}>
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> استفسار واتساب
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const JournalsDirectory = () => {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [issnState, setIssnState] = useState(ALL);
  const [page, setPage] = useState(1);

  const categories = useMemo(() => [...new Set(journals.map((journal) => journal.category))].sort((a, b) => a.localeCompare(b, "ar")), []);
  const filteredJournals = useMemo(() => {
    const term = normalize(query);
    return journals.filter((journal) => {
      const searchable = normalize([journal.name, journal.nameAr, journal.issn, journal.publisher, journal.category, ...(journal.subjects || [])].filter(Boolean).join(" "));
      return (!term || searchable.includes(term)) && (category === ALL || journal.category === category) && (issnState === ALL || (issnState === "available" ? Boolean(journal.issn) : !journal.issn));
    });
  }, [category, issnState, query]);

  const pageCount = Math.max(1, Math.ceil(filteredJournals.length / PAGE_SIZE));
  const visibleJournals = filteredJournals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(query || category !== ALL || issnState !== ALL);
  useEffect(() => setPage(1), [query, category, issnState]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  const clearFilters = () => { setQuery(""); setCategory(ALL); setIssnState(ALL); };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO title="دليل المجلات العلمية | FekrahEdu" description="دليل منظم للبحث في المجلات العلمية والوصول إلى مواقعها الرسمية، مع تصفية حسب المجال وتوفر رقم ISSN." url="https://fekrahedu.com/journals" />
      <Header />
      <main className="overflow-hidden">
        <section className="relative border-b border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 academic-grid opacity-40" aria-hidden="true" />
          <motion.div className="pointer-events-none absolute right-[8%] top-16 hidden h-16 w-16 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary md:flex" animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, 4, 0] }} transition={{ duration: 5, repeat: Infinity }} aria-hidden="true"><BookOpen className="h-8 w-8" /></motion.div>
          <motion.div className="pointer-events-none absolute bottom-16 left-[9%] hidden h-14 w-14 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent md:flex" animate={reduceMotion ? undefined : { y: [0, 10, 0], rotate: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity }} aria-hidden="true"><Microscope className="h-7 w-7" /></motion.div>
          <div className="container relative mx-auto px-4 text-center">
            <motion.div initial={reduceMotion ? false : { opacity: 0, scale: .9 }} animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }} className="mx-auto mb-7 flex w-fit items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-primary"><BookOpenCheck className="h-7 w-7" /></div>
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-success text-accent-foreground shadow-accent"><Globe2 className="h-7 w-7" /></div>
            </motion.div>
            <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ delay: .1 }} className="text-4xl font-bold leading-[1.35] text-shimmer sm:text-5xl lg:text-6xl">دليل المجلات العلمية</motion.h1>
            <motion.p initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ delay: .2 }} className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-muted-foreground sm:text-xl">استكشف المجلات العلمية العربية والدولية ضمن دليل حديث ومنظم، وابحث بسهولة حسب التخصص أو الاسم أو رقم ISSN.</motion.p>
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ delay: .3 }} className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="gap-2 shadow-primary"><a href="#directory">استكشف الدليل <ChevronLeft className="h-4 w-4" /></a></Button>
              <Button asChild size="lg" variant="outline" className="gap-2 bg-background/80"><Link to="/research/journal-publication"><Sparkles className="h-4 w-4" />مساعدة في اختيار المجلة</Link></Button>
            </motion.div>
          </div>
        </section>

        <section className="relative z-10 -mt-3 pb-12">
          <div className="container mx-auto grid gap-4 px-4 md:grid-cols-3">
            {featurePanels.map((feature, index) => {
              const Icon = feature.icon;
              return <motion.div key={feature.title} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }} whileHover={reduceMotion ? undefined : { y: -5 }} className={`rounded-lg border p-5 shadow-soft backdrop-blur-sm ${feature.className}`}><div className="flex items-start gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-background/80"><Icon className="h-5 w-5" /></div><div><h2 className="font-bold text-foreground">{feature.title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{feature.text}</p></div></div></motion.div>;
            })}
          </div>
        </section>

        <section id="directory" className="scroll-mt-24 py-8">
          <div className="container mx-auto px-4">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-lg border border-primary/15 bg-card p-4 shadow-medium sm:p-6">
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div><div className="mb-2 flex items-center gap-2 text-primary"><Filter className="h-4 w-4" /><span className="text-sm font-semibold">البحث والتصفية</span></div><h2 className="text-2xl font-bold text-foreground">اعثر على المجلة المناسبة</h2></div>
                <p className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary" aria-live="polite">عرض {filteredJournals.length.toLocaleString("ar-SA")} نتيجة</p>
              </div>
              <div className="grid gap-3 lg:grid-cols-[minmax(280px,1.8fr)_repeat(2,minmax(165px,.8fr))_auto]">
                <div className="relative"><Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث باسم المجلة أو ISSN أو الناشر" className="h-12 border-primary/20 bg-background pr-10" aria-label="البحث في دليل المجلات" /></div>
                <Select value={category} onValueChange={setCategory}><SelectTrigger className="h-12 bg-background text-right" aria-label="تصفية حسب المجال"><SelectValue /></SelectTrigger><SelectContent dir="rtl"><SelectItem value={ALL}>كل المجالات</SelectItem>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
                <Select value={issnState} onValueChange={setIssnState}><SelectTrigger className="h-12 bg-background text-right" aria-label="تصفية حسب رقم ISSN"><SelectValue /></SelectTrigger><SelectContent dir="rtl"><SelectItem value={ALL}>جميع سجلات ISSN</SelectItem><SelectItem value="available">رقم ISSN متوفر</SelectItem><SelectItem value="missing">غير مدوّن</SelectItem></SelectContent></Select>
                {hasFilters && <Button variant="ghost" className="h-12 gap-2" onClick={clearFilters}><X className="h-4 w-4" />مسح</Button>}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-background via-muted/30 to-background py-10 sm:py-14">
          <div className="container mx-auto px-4">
            {visibleJournals.length ? <><div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">{visibleJournals.map((journal, index) => <JournalCard key={journal.id} journal={journal} index={index} />)}</div>{pageCount > 1 && <nav className="mt-12 flex flex-wrap items-center justify-center gap-3" aria-label="صفحات دليل المجلات"><Button variant="outline" disabled={page === 1} onClick={() => setPage(v => Math.max(1, v - 1))}>السابق</Button><span className="rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">صفحة {page.toLocaleString("ar-SA")} من {pageCount.toLocaleString("ar-SA")}</span><Button variant="outline" disabled={page === pageCount} onClick={() => setPage(v => Math.min(pageCount, v + 1))}>التالي</Button></nav>}</> : <div className="mx-auto max-w-xl rounded-lg border border-dashed border-primary/30 bg-primary/5 px-6 py-14 text-center"><Search className="mx-auto h-10 w-10 text-primary" /><h2 className="mt-4 text-xl font-bold">لا توجد نتائج مطابقة</h2><p className="mt-2 text-muted-foreground">جرّب اسمًا آخر أو امسح خيارات التصفية.</p><Button variant="outline" className="mt-5" onClick={clearFilters}>عرض جميع المجلات</Button></div>}
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-5 lg:grid-cols-2">
              <motion.div initial={reduceMotion ? false : { opacity: 0, x: 20 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-lg border border-warning/20 bg-warning/5 p-6 sm:p-8"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning"><ShieldCheck className="h-6 w-6" /></div><div><h2 className="text-xl font-bold">تحقّق قبل إرسال بحثك</h2><p className="mt-2 leading-7 text-muted-foreground">راجع حالة الفهرسة ونطاق المجلة ورسومها وسياساتها من الموقع الرسمي وقواعد البيانات المعتمدة قبل التقديم.</p></div></div></motion.div>
              <motion.div initial={reduceMotion ? false : { opacity: 0, x: -20 }} whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-lg border border-success/20 bg-success/5 p-6 sm:p-8"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success"><CheckCircle2 className="h-6 w-6" /></div><div><h2 className="text-xl font-bold">اختيار أدق لمجال بحثك</h2><p className="mt-2 leading-7 text-muted-foreground">خدمة النشر تساعدك في مراجعة نطاق المجلة ومتطلباتها وتحديد الخيارات المتوافقة مع تخصص البحث.</p></div></div></motion.div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-l from-primary via-secondary to-primary py-16 text-primary-foreground">
          <div className="absolute inset-0 academic-grid opacity-20" aria-hidden="true" />
          <div className="container relative mx-auto flex flex-col items-center justify-between gap-8 px-4 text-center md:flex-row md:text-right"><div><div className="mb-3 flex items-center justify-center gap-2 md:justify-start"><FileCheck2 className="h-5 w-5" /><span className="font-semibold">دعم أكاديمي متخصص</span></div><h2 className="text-3xl font-bold">هل تحتاج مساعدة في اختيار المجلة؟</h2><p className="mt-3 max-w-2xl leading-7 text-primary-foreground/80">نراجع موضوع البحث ونطاق المجلة ومتطلبات التقديم لنساعدك في اتخاذ قرار أوضح.</p></div><Button asChild size="lg" className="shrink-0 gap-2 bg-background text-foreground hover:bg-muted"><Link to="/order-now">اطلب خدمة النشر <ArrowLeft className="h-4 w-4" /></Link></Button></div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JournalsDirectory;
