import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { JournalRecord } from "@/data/journals";
import { getVisual } from "./journalVisuals";

export default function JournalCard({ journal, index }: { journal: JournalRecord; index: number }) {
  const reduceMotion = useReducedMotion();
  const visual = getVisual(journal.category);
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
          {journal.nameAr && <h3 className="mb-1 text-lg font-bold leading-8 text-foreground">{journal.nameAr}</h3>}
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
