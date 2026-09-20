import {
  Atom, BriefcaseBusiness, Gavel, Globe2, GraduationCap, Stethoscope, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { journals } from "@/data/journals";
import coverMedical from "@/assets/journals/cat-medical.jpg";
import coverEngineering from "@/assets/journals/cat-engineering.jpg";
import coverEducation from "@/assets/journals/cat-education.jpg";
import coverBusiness from "@/assets/journals/cat-business.jpg";
import coverLaw from "@/assets/journals/cat-law.jpg";
import coverScience from "@/assets/journals/cat-science.jpg";
import coverMulti from "@/assets/journals/cat-multi.jpg";

export interface CategoryVisual {
  icon: LucideIcon;
  iconClass: string;
  panelClass: string;
  badgeClass: string;
  gradientClass: string;
  cover: string;
  slug: string;
  description: string;
}

export const DEFAULT_CATEGORY = "متعددة التخصصات";

export const categoryVisuals: Record<string, CategoryVisual> = {
  "الطب والصحة": {
    icon: Stethoscope, iconClass: "text-destructive",
    panelClass: "bg-destructive/10 border-destructive/20",
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
    gradientClass: "from-destructive/15 via-destructive/5 to-transparent",
    slug: "medical-health", cover: coverMedical,
    description: "مجلات الطب السريري والصحة العامة والتمريض والعلوم الحيوية الطبية.",
  },
  "الهندسة والتقنية": {
    icon: Zap, iconClass: "text-primary",
    panelClass: "bg-primary/10 border-primary/20",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    gradientClass: "from-primary/15 via-primary/5 to-transparent",
    slug: "engineering-technology", cover: coverEngineering,
    description: "مجلات الهندسة بفروعها وعلوم الحاسب والذكاء الاصطناعي والتقنيات الحديثة.",
  },
  "التربية والعلوم الإنسانية": {
    icon: GraduationCap, iconClass: "text-secondary",
    panelClass: "bg-secondary/10 border-secondary/20",
    badgeClass: "bg-secondary/10 text-secondary border-secondary/20",
    gradientClass: "from-secondary/15 via-secondary/5 to-transparent",
    slug: "education-humanities", cover: coverEducation,
    description: "مجلات التربية والمناهج وعلم النفس واللغات والدراسات الإنسانية.",
  },
  "الإدارة والاقتصاد": {
    icon: BriefcaseBusiness, iconClass: "text-success",
    panelClass: "bg-success/10 border-success/20",
    badgeClass: "bg-success/10 text-success border-success/20",
    gradientClass: "from-success/15 via-success/5 to-transparent",
    slug: "business-economics", cover: coverBusiness,
    description: "مجلات إدارة الأعمال والمحاسبة والتمويل والاقتصاد والتسويق.",
  },
  "القانون والسياسات": {
    icon: Gavel, iconClass: "text-warning",
    panelClass: "bg-warning/10 border-warning/20",
    badgeClass: "bg-warning/10 text-warning border-warning/20",
    gradientClass: "from-warning/15 via-warning/5 to-transparent",
    slug: "law-policy", cover: coverLaw,
    description: "مجلات القانون والأنظمة والدراسات السياسية والسياسات العامة.",
  },
  "العلوم الطبيعية": {
    icon: Atom, iconClass: "text-accent",
    panelClass: "bg-accent/10 border-accent/20",
    badgeClass: "bg-accent/10 text-accent border-accent/20",
    gradientClass: "from-accent/15 via-accent/5 to-transparent",
    slug: "natural-sciences", cover: coverScience,
    description: "مجلات الفيزياء والكيمياء والرياضيات والأحياء وعلوم البيئة.",
  },
  [DEFAULT_CATEGORY]: {
    icon: Globe2, iconClass: "text-primary",
    panelClass: "bg-primary/10 border-primary/20",
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    gradientClass: "from-primary/15 via-accent/5 to-transparent",
    slug: "multidisciplinary", cover: coverMulti,
    description: "مجلات تقبل أبحاثًا من تخصصات متعددة ضمن نطاق واسع.",
  },
};

export const getVisual = (category: string): CategoryVisual =>
  categoryVisuals[category] || categoryVisuals[DEFAULT_CATEGORY];

export interface CategorySummary {
  name: string;
  slug: string;
  count: number;
  visual: CategoryVisual;
}

export const categorySummaries: CategorySummary[] = Object.keys(categoryVisuals)
  .map((name) => ({
    name,
    slug: categoryVisuals[name].slug,
    count: journals.filter((journal) => journal.category === name).length,
    visual: categoryVisuals[name],
  }))
  .filter((item) => item.count > 0)
  .sort((a, b) => b.count - a.count);

export const categoryBySlug = (slug?: string): CategorySummary | undefined =>
  categorySummaries.find((item) => item.slug === slug);
