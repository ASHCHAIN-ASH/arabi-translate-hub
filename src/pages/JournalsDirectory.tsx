import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft, BookOpen, BookOpenCheck, CheckCircle2, ChevronLeft, ExternalLink, FileCheck2,
  Filter, Globe2, LibraryBig, Microscope, Search, ShieldCheck, Sparkles, X,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import JournalCard from "@/components/journals/JournalCard";
import { categorySummaries } from "@/components/journals/journalVisuals";
import { journals } from "@/data/journals";

const PAGE_SIZE = 12;
const ALL = "all";
const normalize = (value: string) => value.toLocaleLowerCase("ar").replace(/[()\s-]/g, "");

const featurePanels = [
  { icon: Search, title: "بحث ذكي وسريع", text: "ابحث بالاسم أو الناشر أو رقم ISSN من مكان واحد.", className: "border-primary/20 bg-primary/5 text-primary" },
  { icon: Filter, title: "أقسام رئيسية منظمة", text: "لكل تخصص قسم مستقل بصفحته الخاصة بمجلاته.", className: "border-secondary/20 bg-secondary/5 text-secondary" },
  { icon: ExternalLink, title: "وصول مباشر", text: "انتقل إلى الموقع الرسمي للمجلة لمراجعة أحدث متطلباتها.", className: "border-accent/20 bg-accent/5 text-accent" },
];

const JournalsDirectory = () => {
  const reduceMotion = useReducedMotion();
  const totalJournals = journals.length;


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

        <section id="categories" className="scroll-mt-24 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 text-center">
              <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                <LibraryBig className="h-4 w-4" aria-hidden="true" />الأقسام الرئيسية
              </div>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">تصفّح المجلات حسب التخصص</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-8 text-muted-foreground">لكل تخصص صفحة مستقلة تعرض مجلاته مع بحث داخلي وروابط رسمية وزر استفسار مباشر عبر واتساب.</p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categorySummaries.map((item, index) => {
                const CategoryIcon = item.visual.icon;
                return (
                  <motion.div
                    key={item.slug}
                    initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: .4, delay: Math.min(index * .07, .35) }}
                    whileHover={reduceMotion ? undefined : { y: -7 }}
                    className="h-full"
                  >
                    <Link
                      to={`/journals/${item.slug}`}
                      className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-border/80 bg-gradient-to-bl p-6 shadow-soft transition-[box-shadow,border-color] duration-300 hover:border-primary/30 hover:shadow-strong ${item.visual.gradientClass}`}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className={`flex h-14 w-14 items-center justify-center rounded-lg border transition-transform duration-500 group-hover:scale-110 ${item.visual.panelClass}`}>
                          <CategoryIcon className={`h-7 w-7 ${item.visual.iconClass}`} aria-hidden="true" />
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-sm font-bold ${item.visual.badgeClass}`}>{item.count.toLocaleString("ar-SA")} مجلة</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                      <p className="mt-2 flex-1 text-sm leading-7 text-muted-foreground">{item.visual.description}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        تصفّح مجلات القسم
                        <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
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
