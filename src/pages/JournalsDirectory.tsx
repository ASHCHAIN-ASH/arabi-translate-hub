import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  Filter,
  Globe2,
  LibraryBig,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
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

function JournalCard({ journal, index }: { journal: JournalRecord; index: number }) {
  const reduceMotion = useReducedMotion();
  const host = useMemo(() => {
    try {
      return new URL(journal.website).hostname.replace(/^www\./, "");
    } catch {
      return journal.website;
    }
  }, [journal.website]);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.035, 0.25) }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-medium"
    >
      <div className="h-1 bg-gradient-to-l from-primary via-secondary to-accent" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-primary/15 bg-primary/5 text-primary">
            <LibraryBig className="h-5 w-5" aria-hidden="true" />
          </div>
          <Badge variant="outline" className="border-border bg-muted/50 text-muted-foreground">
            {sourceLabels[journal.source]}
          </Badge>
        </div>

        <div className="min-h-[7.25rem]">
          {journal.nameAr && (
            <h2 className="mb-1 text-lg font-bold leading-8 text-foreground">{journal.nameAr}</h2>
          )}
          <p dir="ltr" className="text-left text-base font-semibold leading-7 text-foreground">
            {journal.name}
          </p>
          {journal.publisher && (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{journal.publisher}</p>
          )}
        </div>

        <div className="my-5 grid grid-cols-2 gap-2 border-y border-border py-4 text-sm">
          <div>
            <span className="block text-xs text-muted-foreground">التصنيف</span>
            <span className="mt-1 block font-semibold text-foreground">{journal.category}</span>
          </div>
          <div>
            <span className="block text-xs text-muted-foreground">E-ISSN / ISSN</span>
            <span dir="ltr" className="mt-1 block text-right font-mono font-semibold text-foreground">
              {journal.issn || "غير مدوّن"}
            </span>
          </div>
        </div>

        {journal.subjects && journal.subjects.length > 0 && (
          <div className="mb-5 flex min-h-7 flex-wrap gap-1.5">
            {journal.subjects.slice(0, 3).map((subject) => (
              <Badge key={subject} variant="secondary" className="font-normal">
                {subject}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <span dir="ltr" className="min-w-0 truncate text-left text-xs text-muted-foreground" title={host}>
            {host}
          </span>
          <Button asChild size="sm" variant="outline" className="shrink-0 gap-2">
            <a href={journal.website} target="_blank" rel="noopener noreferrer">
              الموقع الرسمي
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

const JournalsDirectory = () => {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<JournalSource | typeof ALL>(ALL);
  const [category, setCategory] = useState(ALL);
  const [issnState, setIssnState] = useState(ALL);
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [...new Set(journals.map((journal) => journal.category))].sort((a, b) => a.localeCompare(b, "ar")),
    [],
  );

  const filteredJournals = useMemo(() => {
    const term = normalize(query);
    return journals.filter((journal) => {
      const searchable = normalize(
        [journal.name, journal.nameAr, journal.issn, journal.publisher, journal.category, ...(journal.subjects || [])]
          .filter(Boolean)
          .join(" "),
      );
      return (
        (!term || searchable.includes(term)) &&
        (source === ALL || journal.source === source) &&
        (category === ALL || journal.category === category) &&
        (issnState === ALL || (issnState === "available" ? Boolean(journal.issn) : !journal.issn))
      );
    });
  }, [category, issnState, query, source]);

  const pageCount = Math.max(1, Math.ceil(filteredJournals.length / PAGE_SIZE));
  const visibleJournals = filteredJournals.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(query || source !== ALL || category !== ALL || issnState !== ALL);

  useEffect(() => setPage(1), [query, source, category, issnState]);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const clearFilters = () => {
    setQuery("");
    setSource(ALL);
    setCategory(ALL);
    setIssnState(ALL);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO
        title="دليل المجلات العلمية | FekrahEdu"
        description="دليل منظم للبحث في المجلات العلمية والوصول إلى مواقعها الرسمية، مع تصفية حسب المجال وتوفر رقم ISSN."
        url="https://fekrahedu.com/journals"
      />
      <Header />

      <main>
        <section className="relative overflow-hidden border-b border-border bg-deep-violet text-deep-violet-foreground">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-accent via-primary-light to-secondary-light" />
          <div className="container relative mx-auto grid min-h-[430px] items-center gap-10 px-4 py-16 lg:grid-cols-[1.2fr_.8fr] lg:py-20">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 border border-deep-violet-foreground/20 bg-deep-violet-foreground/10 px-3 py-2 text-sm font-semibold">
                <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                مرجع بحثي منظم للوصول المباشر
              </div>
              <h1 className="text-4xl font-bold leading-[1.35] sm:text-5xl lg:text-6xl">دليل المجلات العلمية</h1>
              <p className="mt-5 max-w-2xl text-lg leading-9 text-deep-violet-foreground/80">
                ابحث بالاسم أو رقم ISSN، صفِّ النتائج حسب المجال، وانتقل مباشرة إلى الموقع الرسمي للمجلة.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2 bg-background text-foreground hover:bg-muted">
                  <Link to="/research/journal-publication">
                    مساعدة في اختيار المجلة
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-deep-violet-foreground/30 bg-transparent text-deep-violet-foreground hover:bg-deep-violet-foreground/10 hover:text-deep-violet-foreground">
                  <a href="#directory">تصفح الدليل</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="hidden lg:block"
              aria-hidden="true"
            >
              <div className="relative mx-auto h-72 max-w-sm">
                <div className="absolute inset-8 rotate-3 rounded-lg border border-deep-violet-foreground/20 bg-deep-violet-foreground/5" />
                <div className="absolute inset-4 -rotate-2 rounded-lg border border-deep-violet-foreground/20 bg-deep-violet-foreground/10" />
                <div className="absolute inset-0 flex flex-col justify-between rounded-lg border border-deep-violet-foreground/30 bg-deep-violet-foreground/10 p-7 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <LibraryBig className="h-10 w-10" />
                    <Globe2 className="h-7 w-7 text-accent-light" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full rounded-full bg-deep-violet-foreground/20" />
                    <div className="h-2 w-4/5 rounded-full bg-deep-violet-foreground/20" />
                    <div className="h-2 w-3/5 rounded-full bg-deep-violet-foreground/20" />
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <FileCheck2 className="h-4 w-4 text-accent-light" />
                    بيانات مرتبة وروابط مباشرة
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="directory" className="scroll-mt-24 border-b border-border bg-muted/40 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="mb-2 flex items-center gap-2 text-primary">
                  <Filter className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-semibold">البحث والتصفية</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">اعثر على المجلة المناسبة</h2>
              </div>
              <p className="text-sm text-muted-foreground" aria-live="polite">
                عرض {filteredJournals.length.toLocaleString("ar-SA")} نتيجة
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(280px,1.6fr)_repeat(3,minmax(155px,.7fr))_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="ابحث باسم المجلة أو ISSN أو الناشر"
                  className="h-12 bg-background pr-10"
                  aria-label="البحث في دليل المجلات"
                />
              </div>
              <Select value={source} onValueChange={(value) => setSource(value as JournalSource | typeof ALL)}>
                <SelectTrigger className="h-12 bg-background text-right" aria-label="تصفية حسب المصدر">
                  <SelectValue placeholder="كل القوائم" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value={ALL}>كل القوائم</SelectItem>
                  <SelectItem value="existing">القائمة الأساسية</SelectItem>
                  <SelectItem value="uploaded">القائمة المضافة</SelectItem>
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 bg-background text-right" aria-label="تصفية حسب المجال">
                  <SelectValue placeholder="كل المجالات" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value={ALL}>كل المجالات</SelectItem>
                  {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={issnState} onValueChange={setIssnState}>
                <SelectTrigger className="h-12 bg-background text-right" aria-label="تصفية حسب رقم ISSN">
                  <SelectValue placeholder="حالة ISSN" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value={ALL}>جميع سجلات ISSN</SelectItem>
                  <SelectItem value="available">رقم ISSN متوفر</SelectItem>
                  <SelectItem value="missing">غير مدوّن</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button variant="ghost" className="h-12 gap-2" onClick={clearFilters}>
                  <X className="h-4 w-4" aria-hidden="true" />
                  مسح
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            {visibleJournals.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {visibleJournals.map((journal, index) => (
                    <JournalCard key={journal.id} journal={journal} index={index} />
                  ))}
                </div>

                {pageCount > 1 && (
                  <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="صفحات دليل المجلات">
                    <Button variant="outline" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                      السابق
                    </Button>
                    <span className="min-w-28 text-center text-sm font-semibold text-foreground">
                      صفحة {page.toLocaleString("ar-SA")} من {pageCount.toLocaleString("ar-SA")}
                    </span>
                    <Button variant="outline" disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>
                      التالي
                    </Button>
                  </nav>
                )}
              </>
            ) : (
              <div className="mx-auto max-w-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
                <Search className="mx-auto h-9 w-9 text-muted-foreground" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold text-foreground">لا توجد نتائج مطابقة</h2>
                <p className="mt-2 text-muted-foreground">جرّب اسمًا آخر أو امسح خيارات التصفية.</p>
                <Button variant="outline" className="mt-5" onClick={clearFilters}>عرض جميع المجلات</Button>
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-border bg-muted/40 py-12">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-warning/10 text-warning">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">تحقّق قبل إرسال بحثك</h2>
                  <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
                    يعرض الدليل بيانات وروابط مرجعية. تحقّق دائمًا من حالة الفهرسة ونطاق المجلة ورسومها وسياساتها عبر موقعها الرسمي وقواعد البيانات المعتمدة قبل التقديم.
                  </p>
                </div>
              </div>
              <Button asChild className="gap-2">
                <Link to="/research/journal-publication">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  اطلب مراجعة متخصصة
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-deep-violet py-14 text-deep-violet-foreground">
          <div className="container mx-auto flex flex-col items-start justify-between gap-7 px-4 md:flex-row md:items-center">
            <div>
              <span className="text-sm font-semibold text-accent-light">خدمة النشر العلمي</span>
              <h2 className="mt-2 text-3xl font-bold">لست متأكدًا من المجلة المناسبة؟</h2>
              <p className="mt-3 max-w-2xl leading-7 text-deep-violet-foreground/75">
                نراجع تخصص البحث ومتطلبات النشر ونساعدك في تحديد الخيارات الأقرب لموضوعك.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 gap-2 bg-background text-foreground hover:bg-muted">
              <Link to="/order-now">
                اطلب خدمة النشر
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default JournalsDirectory;
