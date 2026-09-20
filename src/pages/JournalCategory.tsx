import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ChevronLeft, LibraryBig, Search, ShieldCheck, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JournalCard from "@/components/journals/JournalCard";
import { categoryBySlug, categorySummaries } from "@/components/journals/journalVisuals";
import { journals } from "@/data/journals";

const PAGE_SIZE = 12;
const normalize = (value: string) => value.toLocaleLowerCase("ar").replace(/[()\s-]/g, "");

const JournalCategory = () => {
  const { slug } = useParams();
  const reduceMotion = useReducedMotion();
  const summary = categoryBySlug(slug);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!summary) return [];
    const term = normalize(query);
    return journals.filter((journal) => {
      if (journal.category !== summary.name) return false;
      if (!term) return true;
      const searchable = normalize([journal.name, journal.nameAr, journal.issn, journal.publisher, ...(journal.subjects || [])].filter(Boolean).join(" "));
      return searchable.includes(term);
    });
  }, [query, summary]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => setPage(1), [query, slug]);
  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);

  if (!summary) return <Navigate to="/journals" replace />;

  const Icon = summary.visual.icon;
  const others = categorySummaries.filter((item) => item.slug !== summary.slug);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO
        title={`مجلات ${summary.name} | دليل المجلات العلمية | FekrahEdu`}
        description={`${summary.visual.description} تصفح ${summary.count} مجلة ضمن قسم ${summary.name} مع روابط المواقع الرسمية وأرقام ISSN.`}
        url={`https://fekrahedu.com/journals/${summary.slug}`}
      />
      <Header />
      <main className="overflow-hidden">
        <section className={`relative border-b border-border bg-gradient-to-bl py-14 sm:py-16 ${summary.visual.gradientClass}`}>
          <div className="pointer-events-none absolute inset-0 academic-grid opacity-40" aria-hidden="true" />
          <div className="container relative mx-auto px-4">
            <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="مسار التصفح">
              <Link to="/journals" className="transition-colors hover:text-primary">دليل المجلات</Link>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="font-semibold text-foreground">{summary.name}</span>
            </nav>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border ${summary.visual.panelClass}`}>
                  <Icon className={`h-8 w-8 ${summary.visual.iconClass}`} aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold leading-[1.4] text-foreground sm:text-4xl">مجلات {summary.name}</h1>
                  <p className="mt-3 max-w-2xl text-base leading-8 text-muted-foreground">{summary.visual.description}</p>
                </div>
              </div>
              <div className="shrink-0 rounded-lg border border-primary/20 bg-background/80 px-6 py-4 text-center shadow-soft">
                <span className="block text-3xl font-bold text-primary">{summary.count.toLocaleString("ar-SA")}</span>
                <span className="text-sm text-muted-foreground">مجلة في هذا القسم</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" aria-hidden="true" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث داخل هذا القسم"
                  className="h-12 border-primary/20 bg-background pr-10"
                  aria-label={`البحث في مجلات ${summary.name}`}
                />
              </div>
              <div className="flex items-center gap-3">
                {query && <Button variant="ghost" className="h-12 gap-2" onClick={() => setQuery("")}><X className="h-4 w-4" />مسح</Button>}
                <p className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary" aria-live="polite">
                  {filtered.length.toLocaleString("ar-SA")} نتيجة
                </p>
              </div>
            </div>

            {visible.length ? (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {visible.map((journal, index) => <JournalCard key={journal.id} journal={journal} index={index} />)}
                </div>
                {pageCount > 1 && (
                  <nav className="mt-12 flex flex-wrap items-center justify-center gap-3" aria-label="صفحات القسم">
                    <Button variant="outline" disabled={page === 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>السابق</Button>
                    <span className="rounded-full bg-primary/10 px-5 py-2 text-sm font-semibold text-primary">
                      صفحة {page.toLocaleString("ar-SA")} من {pageCount.toLocaleString("ar-SA")}
                    </span>
                    <Button variant="outline" disabled={page === pageCount} onClick={() => setPage((v) => Math.min(pageCount, v + 1))}>التالي</Button>
                  </nav>
                )}
              </>
            ) : (
              <div className="mx-auto max-w-xl rounded-lg border border-dashed border-primary/30 bg-primary/5 px-6 py-14 text-center">
                <Search className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold">لا توجد نتائج مطابقة</h2>
                <p className="mt-2 text-muted-foreground">جرّب كلمة بحث أخرى داخل هذا القسم.</p>
                <Button variant="outline" className="mt-5" onClick={() => setQuery("")}>عرض كل مجلات القسم</Button>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-center gap-2 text-primary">
              <LibraryBig className="h-5 w-5" aria-hidden="true" />
              <h2 className="text-xl font-bold text-foreground">تصفح أقسامًا أخرى</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => {
                const OtherIcon = item.visual.icon;
                return (
                  <motion.div key={item.slug} whileHover={reduceMotion ? undefined : { y: -5 }}>
                    <Link
                      to={`/journals/${item.slug}`}
                      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-soft transition-colors hover:border-primary/30"
                    >
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border ${item.visual.panelClass}`}>
                        <OtherIcon className={`h-6 w-6 ${item.visual.iconClass}`} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-foreground">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.count.toLocaleString("ar-SA")} مجلة</span>
                      </span>
                      <ChevronLeft className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-l from-primary to-secondary py-12 text-primary-foreground">
          <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-right">
            <div>
              <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                <span className="font-semibold">تحقّق قبل التقديم</span>
              </div>
              <h2 className="text-2xl font-bold">هل تحتاج مساعدة في اختيار المجلة المناسبة؟</h2>
              <p className="mt-2 max-w-2xl leading-7 text-primary-foreground/80">
                نراجع موضوع بحثك ونطاق المجلة ومتطلبات التقديم قبل إرسال العمل.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 gap-2 bg-background text-foreground hover:bg-muted">
              <Link to="/order-now">اطلب خدمة النشر <ArrowLeft className="h-4 w-4" aria-hidden="true" /></Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JournalCategory;
