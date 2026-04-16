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
  Search, ArrowLeft, ShoppingCart, Sparkles, ArrowRight,
  Zap, TrendingUp, Award, Shield, ChevronLeft, Eye
} from 'lucide-react';

// Category images
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

// Map category icon names to images (fallback order)
const categoryImages: Record<string, string> = {
  Languages: translationImg,
  BookOpen: researchImg,
  GraduationCap: editingImg,
  Microscope: statisticsImg,
  FileText: publishingImg,
  CheckCircle: editingImg,
  Users: studentImg,
};

// Fallback order for categories by index
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
  'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
  'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800',
  'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
  'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
  'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800',
];

const ClientServices = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const features = [
    { icon: Shield, label: 'سرية تامة' },
    { icon: Zap, label: 'تنفيذ سريع' },
    { icon: Award, label: 'جودة مضمونة' },
    { icon: TrendingUp, label: 'أسعار منافسة' },
  ];

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

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-blue-700 dark:from-primary/80 dark:to-blue-900 p-6 sm:p-10 text-white"
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
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
              اكتشف خدماتنا واطلب
              <br />
              <span className="text-blue-200">مباشرة من لوحتك</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-lg mx-auto mb-6">
              اختر الخدمة المناسبة وأنشئ طلبك بخطوات بسيطة — فريقنا جاهز لخدمتك
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium border border-white/10">
                  <f.icon className="w-3.5 h-3.5" />
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث في الخدمات..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-12 h-12 rounded-2xl border-2 text-base shadow-sm bg-card"
            />
          </div>
        </motion.div>

        {/* View Modes */}
        <AnimatePresence mode="wait">
          {!selectedCategory && !searchQuery.trim() ? (
            /* ── Categories Grid ── */
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-xl font-bold mb-5">الأقسام الرئيسية</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, i) => {
                  const count = getServiceCount(cat.id);
                  const img = getCatImage(cat, i);
                  const gradient = categoryGradients[i % categoryGradients.length];
                  const bg = categoryBgs[i % categoryBgs.length];

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card
                        className={`cursor-pointer overflow-hidden border-2 ${bg} hover:shadow-xl transition-all duration-300 group`}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        <CardContent className="p-0">
                          {/* Image Area */}
                          <div className="relative h-32 sm:h-36 flex items-center justify-center overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                            <motion.img
                              src={img}
                              alt={cat.name_ar || cat.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
                              loading="lazy"
                              width={96}
                              height={96}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            />
                          </div>
                          {/* Info */}
                          <div className="p-4 pt-2 text-center space-y-2">
                            <h3 className="font-bold text-sm sm:text-base">{cat.name_ar || cat.name}</h3>
                            {cat.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{cat.description}</p>
                            )}
                            <div className="flex items-center justify-center gap-2">
                              <Badge variant="secondary" className="text-xs">{count} خدمة</Badge>
                              <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ── Services List ── */
            <motion.div
              key="services"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Back button */}
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
                return (
                  <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-muted/30 border">
                    <img src={img} alt="" className="w-14 h-14 object-contain" loading="lazy" width={56} height={56} />
                    <div>
                      <h2 className="text-xl font-bold">{cat.name_ar || cat.name}</h2>
                      {cat.description && <p className="text-sm text-muted-foreground">{cat.description}</p>}
                    </div>
                    <Badge variant="secondary" className="mr-auto">{filteredServices.length} خدمة</Badge>
                  </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service, i) => {
                    const catIdx = categories.findIndex(c => c.id === service.category_id);
                    const gradient = categoryGradients[Math.max(catIdx, 0) % categoryGradients.length];

                    return (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Card
                          className="group h-full border hover:border-primary/30 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
                          onClick={() => navigate(`/client-services/${service.id}`)}
                        >
                          <div className={`h-1.5 bg-gradient-to-r ${gradient} opacity-50 group-hover:opacity-100 transition-opacity`} />
                          <CardContent className="p-5 flex flex-col h-full">
                            <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {service.name_ar || service.name}
                            </h3>
                            {service.description && (
                              <p className="text-xs text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1">{service.description}</p>
                            )}
                            <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-1 text-xs text-primary"
                                onClick={(e) => { e.stopPropagation(); navigate(`/client-services/${service.id}`); }}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                التفاصيل
                              </Button>
                              <Button
                                size="sm"
                                className={`h-8 text-xs gap-1.5 rounded-full bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0 shadow-md px-4`}
                                onClick={(e) => { e.stopPropagation(); navigate(`/orders/new?service=${service.id}`); }}
                              >
                                <ShoppingCart className="w-3 h-3" />
                                اطلب
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
