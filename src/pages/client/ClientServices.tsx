import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Sparkles, ArrowRight,
  Zap, TrendingUp, Award, Shield, ChevronLeft, Eye,
  Languages, BookOpen, PenTool, Printer, BarChart3, GraduationCap,
  FileText, Mic, Globe, Video, CheckCircle, Star,
  Clock, Layers, Target, Lightbulb, Users, ArrowLeft, Info
} from 'lucide-react';

import translationImg from '@/assets/categories/translation.png';
import researchImg from '@/assets/categories/research.png';
import editingImg from '@/assets/categories/editing.png';
import publishingImg from '@/assets/categories/publishing.png';
import statisticsImg from '@/assets/categories/statistics.png';
import studentImg from '@/assets/categories/student.png';

interface ServiceCategory {
  id: string;
  name_ar: string | null;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number | null;
}

interface Service {
  id: string;
  category_id: string | null;
  name_ar: string | null;
  name: string;
  description: string | null;
  unit: string | null;
  is_active: boolean | null;
}

const categoryImages: Record<string, string> = {
  Languages: translationImg,
  BookOpen: researchImg,
  GraduationCap: editingImg,
  Microscope: statisticsImg,
  FileText: publishingImg,
  CheckCircle: editingImg,
  Users: studentImg,
};

const categoryImagesByIndex: string[] = [
  translationImg, researchImg, editingImg, publishingImg, statisticsImg, studentImg,
];

const categoryGradients = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-cyan-500 to-blue-600',
];

const categoryBgs = [
  'bg-blue-50/60 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40',
  'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40',
  'bg-violet-50/60 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/40',
  'bg-amber-50/60 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40',
  'bg-rose-50/60 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40',
  'bg-cyan-50/60 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900/40',
];

const categoryTextColors = [
  'text-blue-600 dark:text-blue-400',
  'text-emerald-600 dark:text-emerald-400',
  'text-violet-600 dark:text-violet-400',
  'text-amber-600 dark:text-amber-400',
  'text-rose-600 dark:text-rose-400',
  'text-cyan-600 dark:text-cyan-400',
];

const categoryIconBgs = [
  'bg-blue-100 dark:bg-blue-900/40',
  'bg-emerald-100 dark:bg-emerald-900/40',
  'bg-violet-100 dark:bg-violet-900/40',
  'bg-amber-100 dark:bg-amber-900/40',
  'bg-rose-100 dark:bg-rose-900/40',
  'bg-cyan-100 dark:bg-cyan-900/40',
];

// Rich descriptions + use-cases per category (Arabic-first, by keyword match)
type CategoryGuide = {
  tagline: string;
  highlights: string[];
  useCases: string[];
  delivery: string;
};

function getCategoryGuide(cat: ServiceCategory): CategoryGuide {
  const name = ((cat.name_ar || '') + ' ' + cat.name).toLowerCase();

  if (name.includes('ترجم') || name.includes('translat') || name.includes('لغ')) {
    return {
      tagline: 'ترجمة احترافية بأيدي مختصين بكل لغة',
      highlights: ['مترجمون معتمدون', 'مراجعة لغوية شاملة', 'تسليم سريع'],
      useCases: ['ترجمة أبحاث ومقالات', 'وثائق رسمية', 'مواقع وتطبيقات'],
      delivery: 'تسليم خلال 24–72 ساعة',
    };
  }
  if (name.includes('بحث') || name.includes('research') || name.includes('أكاديم')) {
    return {
      tagline: 'دعم بحثي متكامل من الفكرة حتى النشر',
      highlights: ['منهجية علمية', 'مصادر موثوقة', 'تدقيق أكاديمي'],
      useCases: ['خطط بحثية', 'أوراق علمية', 'رسائل ماجستير ودكتوراه'],
      delivery: 'تسليم على مراحل مع متابعة دقيقة',
    };
  }
  if (name.includes('نشر') || name.includes('publish')) {
    return {
      tagline: 'نشر أبحاثك في مجلات معتمدة (Scopus / ISI)',
      highlights: ['اختيار المجلة المناسبة', 'إعداد الملف للنشر', 'متابعة المراجعين'],
      useCases: ['نشر في Scopus', 'نشر في ISI', 'مجلات محلية محكّمة'],
      delivery: 'تسليم متابعة كاملة حتى القبول',
    };
  }
  if (name.includes('تدقيق') || name.includes('مراجع') || name.includes('editing')) {
    return {
      tagline: 'تدقيق ومراجعة لغوية وأكاديمية دقيقة',
      highlights: ['تصحيح لغوي', 'تحسين الأسلوب', 'فحص الانتحال'],
      useCases: ['مراجعة رسائل', 'تدقيق أبحاث', 'تحسين المسودات'],
      delivery: 'مراجعة على مرحلتين',
    };
  }
  if (name.includes('إحصا') || name.includes('تحليل') || name.includes('statist')) {
    return {
      tagline: 'تحليل إحصائي متقدم بأدوات احترافية',
      highlights: ['SPSS / R / Python', 'تفسير النتائج', 'رسوم بيانية احترافية'],
      useCases: ['تحليل استبانات', 'دراسات كمية', 'نمذجة وتنبؤ'],
      delivery: 'تقرير تحليلي مفصّل',
    };
  }
  if (name.includes('طالب') || name.includes('student') || name.includes('تعليم')) {
    return {
      tagline: 'حلول تعليمية متكاملة لطلاب الجامعات',
      highlights: ['دعم أكاديمي', 'حلول واجبات', 'استشارات دراسية'],
      useCases: ['مساعدة في الواجبات', 'تحضير عروض', 'إعداد ملخصات'],
      delivery: 'دعم سريع ومرن',
    };
  }
  return {
    tagline: cat.description || 'خدمات احترافية بأعلى جودة',
    highlights: ['جودة مضمونة', 'سرية تامة', 'دعم متواصل'],
    useCases: ['حلول مخصصة', 'تنفيذ احترافي', 'استشارات متخصصة'],
    delivery: 'تسليم مرن حسب المتطلبات',
  };
}

// Service icon pool based on name keywords
const serviceIconMap: { keywords: string[]; icon: React.ElementType }[] = [
  { keywords: ['ترجمة نص', 'نصوص', 'text'], icon: FileText },
  { keywords: ['صوت', 'audio', 'صوتي'], icon: Mic },
  { keywords: ['فيديو', 'video', 'مرئي'], icon: Video },
  { keywords: ['موقع', 'website', 'ويب'], icon: Globe },
  { keywords: ['مستند', 'document', 'وثائق', 'ملف'], icon: FileText },
  { keywords: ['بحث', 'research', 'أكاديم'], icon: BookOpen },
  { keywords: ['تحرير', 'editing', 'تدقيق', 'مراجعة'], icon: PenTool },
  { keywords: ['نشر', 'publish', 'طباعة'], icon: Printer },
  { keywords: ['إحصا', 'statist', 'تحليل', 'spss'], icon: BarChart3 },
  { keywords: ['طالب', 'student', 'تعليم', 'واجب'], icon: GraduationCap },
  { keywords: ['ترجمة', 'translat', 'لغ'], icon: Languages },
  { keywords: ['استشار', 'consult'], icon: Lightbulb },
  { keywords: ['تنسيق', 'format'], icon: Layers },
  { keywords: ['عنوان', 'خطة', 'plan'], icon: Target },
];

function getServiceIcon(service: Service): React.ElementType {
  const name = ((service.name_ar || '') + ' ' + service.name + ' ' + (service.description || '')).toLowerCase();
  for (const entry of serviceIconMap) {
    if (entry.keywords.some(k => name.includes(k))) return entry.icon;
  }
  return FileText;
}

// Quick feature badges for services
function getServiceFeatures(service: Service): string[] {
  const name = ((service.name_ar || '') + ' ' + service.name + ' ' + (service.description || '')).toLowerCase();
  const features: string[] = [];
  if (name.includes('ترجمة') || name.includes('translat')) features.push('متعدد اللغات');
  if (name.includes('بحث') || name.includes('أكاديم')) features.push('أكاديمي');
  if (name.includes('تدقيق') || name.includes('مراجعة')) features.push('مراجعة دقيقة');
  if (name.includes('إحصا') || name.includes('تحليل')) features.push('تحليل متقدم');
  if (features.length === 0) features.push('احترافي');
  features.push('سرية تامة');
  return features.slice(0, 3);
}

const ClientServices = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCatId, setActiveCatId] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [catsRes, svcsRes] = await Promise.all([
        supabase.from('service_categories').select('*').order('sort_order'),
        supabase.from('services').select('*').eq('is_active', true),
      ]);
      if (catsRes.error) throw catsRes.error;
      if (svcsRes.error) throw svcsRes.error;
      setCategories(catsRes.data || []);
      setServices(svcsRes.data || []);
    } catch (e) {
      console.error('Error loading services:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    let list = services;
    if (selectedCategory) list = list.filter(s => s.category_id === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        (s.name_ar || '').toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [services, selectedCategory, searchQuery]);

  const getServiceCount = (catId: string) => services.filter(s => s.category_id === catId).length;
  const getCatImage = (cat: ServiceCategory, index: number) =>
    categoryImages[cat.icon || ''] || categoryImagesByIndex[index % categoryImagesByIndex.length];

  const heroFeatures = [
    { icon: Shield, label: 'سرية تامة' },
    { icon: Zap, label: 'تنفيذ سريع' },
    { icon: Award, label: 'جودة مضمونة' },
    { icon: TrendingUp, label: 'أسعار منافسة' },
  ];

  // Aggregate platform stats for hero ribbon
  const totalServices = services.length;
  const totalCategories = categories.length;

  if (loading) {
    return (
      <ClientLayout>
        <div className="p-6" dir="rtl">
          <div className="space-y-6">
            <div className="h-48 bg-muted animate-pulse rounded-3xl" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-6xl mx-auto" dir="rtl">

        {/* Hero — Banking style: clean, layered, informative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-blue-700 dark:from-primary/85 dark:to-blue-900 p-6 sm:p-10 text-white shadow-xl"
        >
          {/* Decorative orbs */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="text-center md:text-right max-w-2xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-5"
              >
                <Sparkles className="h-4 w-4" />
                خدمات أكاديمية متكاملة
              </motion.div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 leading-tight">
                خدماتنا — مصممة لتنجح
                <br />
                <span className="text-blue-200">في كل خطوة من رحلتك الأكاديمية</span>
              </h1>
              <p className="text-white/85 text-sm sm:text-base max-w-lg mb-6 mx-auto md:mx-0">
                اختر القسم المناسب، استكشف ما يناسبك، وأنشئ طلبك مباشرة من لوحتك — بفريق محترف وتسليم موثوق.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {heroFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium border border-white/10">
                    <f.icon className="w-3.5 h-3.5" />
                    {f.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats card — banking aesthetic */}
            <div className="hidden md:grid grid-cols-2 gap-3 min-w-[220px]">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                <div className="text-2xl font-black">{totalCategories}</div>
                <div className="text-[11px] text-white/80 mt-1">قسم رئيسي</div>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                <div className="text-2xl font-black">{totalServices}</div>
                <div className="text-[11px] text-white/80 mt-1">خدمة متاحة</div>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                <div className="text-2xl font-black">24/7</div>
                <div className="text-[11px] text-white/80 mt-1">دعم مستمر</div>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                <div className="text-2xl font-black">100%</div>
                <div className="text-[11px] text-white/80 mt-1">ضمان الجودة</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث في الخدمات... (مثال: ترجمة، تحليل إحصائي، نشر)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-12 h-12 rounded-2xl border-2 text-base shadow-sm bg-card"
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedCategory && !searchQuery.trim() ? (
            /* ── Categories — Interactive Banking-style Cards ── */
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-end justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">الأقسام الرئيسية</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    مرر فوق أي قسم لاكتشاف الخدمات المتوفرة وتفاصيلها
                  </p>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 border-primary/30 text-primary bg-primary/5">
                  <Layers className="w-3.5 h-3.5" />
                  {totalCategories} أقسام
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((cat, i) => {
                  const count = getServiceCount(cat.id);
                  const img = getCatImage(cat, i);
                  const gradient = categoryGradients[i % categoryGradients.length];
                  const bg = categoryBgs[i % categoryBgs.length];
                  const textColor = categoryTextColors[i % categoryTextColors.length];
                  const iconBg = categoryIconBgs[i % categoryIconBgs.length];
                  const guide = getCategoryGuide(cat);
                  const isActive = activeCatId === cat.id;
                  const previewServices = services.filter(s => s.category_id === cat.id).slice(0, 3);

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -6 }}
                      onHoverStart={() => setActiveCatId(cat.id)}
                      onHoverEnd={() => setActiveCatId(null)}
                      onClick={() => setActiveCatId(prev => prev === cat.id ? null : cat.id)}
                    >
                      <Card
                        className={`relative cursor-pointer overflow-hidden border-2 ${bg} hover:shadow-2xl transition-all duration-500 group h-full`}
                      >
                        {/* Top gradient strip */}
                        <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

                        {/* Glow on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 pointer-events-none`} />

                        <CardContent className="p-0 relative">
                          {/* Header section with image */}
                          <div className="relative px-5 pt-5 pb-3 flex items-start gap-4">
                            <motion.div
                              className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center shrink-0 shadow-sm`}
                              whileHover={{ rotate: 6, scale: 1.05 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              <img
                                src={img}
                                alt={cat.name_ar || cat.name}
                                className="w-12 h-12 object-contain drop-shadow"
                                loading="lazy"
                                width={48}
                                height={48}
                              />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-base sm:text-lg leading-tight">
                                {cat.name_ar || cat.name}
                              </h3>
                              <p className={`text-xs font-medium mt-1 ${textColor} line-clamp-2`}>
                                {guide.tagline}
                              </p>
                            </div>
                          </div>

                          {/* Quick highlights */}
                          <div className="px-5 pb-3">
                            <div className="flex flex-wrap gap-1.5">
                              {guide.highlights.slice(0, 3).map((h, hi) => (
                                <span
                                  key={hi}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-card/80 border border-border/60 text-[11px] font-medium text-foreground/80"
                                >
                                  <CheckCircle className={`w-3 h-3 ${textColor}`} />
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Expandable detailed panel */}
                          <AnimatePresence initial={false}>
                            {isActive && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 py-3 border-t border-border/50 bg-card/40 backdrop-blur-sm space-y-3">
                                  {/* Use cases */}
                                  <div>
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wide">
                                      <Target className="w-3 h-3" />
                                      مناسب لـ
                                    </div>
                                    <ul className="space-y-1">
                                      {guide.useCases.map((u, ui) => (
                                        <li key={ui} className="flex items-start gap-1.5 text-xs text-foreground/80">
                                          <ChevronLeft className={`w-3 h-3 mt-0.5 shrink-0 ${textColor}`} />
                                          <span>{u}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Sample services preview */}
                                  {previewServices.length > 0 && (
                                    <div>
                                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-wide">
                                        <Sparkles className="w-3 h-3" />
                                        أمثلة على الخدمات
                                      </div>
                                      <div className="space-y-1">
                                        {previewServices.map((s) => {
                                          const Icon = getServiceIcon(s);
                                          return (
                                            <div
                                              key={s.id}
                                              className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg bg-background/60 border border-border/40"
                                            >
                                              <Icon className={`w-3.5 h-3.5 ${textColor} shrink-0`} />
                                              <span className="truncate">{s.name_ar || s.name}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Delivery */}
                                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-background/40 rounded-lg px-2.5 py-1.5">
                                    <Clock className="w-3 h-3" />
                                    {guide.delivery}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Footer action bar */}
                          <div className="border-t border-border/50 px-5 py-3 flex items-center justify-between bg-card/60">
                            <Badge variant="secondary" className="gap-1 text-xs font-bold">
                              <Layers className="w-3 h-3" />
                              {count} خدمة
                            </Badge>
                            <Button
                              size="sm"
                              className={`h-8 gap-1.5 text-xs rounded-full bg-gradient-to-r ${gradient} text-white border-0 shadow-md hover:shadow-lg transition-all`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCategory(cat.id);
                              }}
                            >
                              استكشف
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Helper hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
              >
                <Info className="w-3.5 h-3.5" />
                انقر على أي قسم لاستعراض جميع الخدمات أو مرر فوقه لمعاينة سريعة
              </motion.div>
            </motion.div>
          ) : (
            /* ── Enhanced Services List ── */
            <motion.div
              key="services"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {selectedCategory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
                  className="gap-2 text-muted-foreground hover:text-foreground mb-4"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة للأقسام الرئيسية
                </Button>
              )}

              {/* Category header */}
              {selectedCategory && (() => {
                const catIdx = categories.findIndex(c => c.id === selectedCategory);
                const cat = categories[catIdx];
                if (!cat) return null;
                const img = getCatImage(cat, catIdx);
                const gradient = categoryGradients[catIdx % categoryGradients.length];
                const guide = getCategoryGuide(cat);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradient} p-6 mb-6 text-white shadow-lg`}
                  >
                    <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-20 -translate-y-20 blur-2xl" />
                    <div className="relative flex items-center gap-5">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                        <img src={img} alt="" className="w-10 h-10 object-contain" loading="lazy" width={40} height={40} />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl sm:text-2xl font-black">{cat.name_ar || cat.name}</h2>
                        <p className="text-white/85 text-sm mt-1">{guide.tagline}</p>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30 text-sm shrink-0">
                        {filteredServices.length} خدمة
                      </Badge>
                    </div>
                  </motion.div>
                );
              })()}

              {filteredServices.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">لا توجد نتائج</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {searchQuery ? 'لم نجد خدمات تطابق بحثك' : 'لا توجد خدمات في هذا القسم'}
                  </p>
                  <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                    مسح الفلاتر
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredServices.map((service, i) => {
                    const catIdx = categories.findIndex(c => c.id === service.category_id);
                    const safeIdx = Math.max(catIdx, 0) % categoryGradients.length;
                    const gradient = categoryGradients[safeIdx];
                    const textColor = categoryTextColors[safeIdx];
                    const iconBg = categoryIconBgs[safeIdx];
                    const IconComp = getServiceIcon(service);
                    const features = getServiceFeatures(service);

                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -4 }}
                      >
                        <Card
                          className="group h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden bg-card"
                          onClick={() => navigate(`/client-services/${service.id}`)}
                        >
                          {/* Top gradient strip */}
                          <div className={`h-1 bg-gradient-to-r ${gradient}`} />

                          <CardContent className="p-0">
                            <div className="p-5 pb-4">
                              {/* Icon + Title Row */}
                              <div className="flex items-start gap-4 mb-3">
                                <motion.div
                                  className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
                                  whileHover={{ rotate: 10, scale: 1.1 }}
                                  transition={{ type: 'spring', stiffness: 300 }}
                                >
                                  <IconComp className={`w-6 h-6 ${textColor}`} />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                    {service.name_ar || service.name}
                                  </h3>
                                  {service.unit && (
                                    <span className="text-xs text-muted-foreground mt-0.5 inline-block">
                                      الوحدة: {service.unit}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              {service.description && (
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                                  {service.description}
                                </p>
                              )}

                              {/* Feature badges */}
                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {features.map((f, fi) => (
                                  <span
                                    key={fi}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted/60 rounded-full text-[11px] font-medium text-muted-foreground"
                                  >
                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Bottom actions bar */}
                            <div className="border-t border-border/50 px-5 py-3 flex items-center justify-between bg-muted/20">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1.5 text-xs text-muted-foreground hover:text-primary"
                                onClick={(e) => { e.stopPropagation(); navigate(`/client-services/${service.id}`); }}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                عرض التفاصيل
                              </Button>
                              <Button
                                size="sm"
                                className={`h-9 text-xs gap-1.5 rounded-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0 shadow-md px-5`}
                                onClick={(e) => { e.stopPropagation(); navigate(`/orders/new?service=${service.id}`); }}
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                اطلب الآن
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClientLayout>
  );
};

export default ClientServices;
