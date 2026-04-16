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
  Languages, BookOpen, GraduationCap, Microscope, FileText, CheckCircle,
  Search, ArrowLeft, ShoppingCart, Sparkles, Users, ArrowRight,
  Zap, TrendingUp, Award, Shield
} from 'lucide-react';

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

const categoryIcons: Record<string, React.ElementType> = {
  Languages, BookOpen, GraduationCap, Microscope, FileText, CheckCircle, Users,
};

const categoryStyles: Record<number, { gradient: string; bg: string; text: string; border: string }> = {
  0: { gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  1: { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  2: { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800' },
  3: { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  4: { gradient: 'from-rose-500 to-red-600', bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
  5: { gradient: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  }
};

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

  const getServicesByCategory = (catId: string) =>
    filteredServices.filter(s => s.category_id === catId);

  const handleOrderService = (service: Service) => {
    navigate(`/orders/new?service=${service.id}`);
  };

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
          {/* Skeleton */}
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <div className="h-6 w-40 bg-muted animate-pulse rounded-full mx-auto" />
              <div className="h-10 w-72 bg-muted animate-pulse rounded mx-auto" />
              <div className="h-4 w-56 bg-muted animate-pulse rounded mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-44 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8" dir="rtl">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-blue-700 dark:from-primary/80 dark:to-blue-900 p-6 sm:p-10 text-white"
        >
          {/* Decorative blobs */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-5"
            >
              <Sparkles className="h-4 w-4" />
              خدمات أكاديمية متكاملة
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 leading-tight"
            >
              اكتشف خدماتنا واطلب
              <br />
              <span className="text-blue-200">مباشرة من لوحتك</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm sm:text-base max-w-lg mx-auto mb-6"
            >
              اختر الخدمة المناسبة وأنشئ طلبك بخطوات بسيطة — فريقنا جاهز لخدمتك
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium border border-white/10"
                >
                  <f.icon className="w-3.5 h-3.5" />
                  {f.label}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Search Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto"
        >
          <div className="relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="ابحث في الخدمات..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-12 h-12 rounded-2xl border-2 text-base shadow-sm focus:shadow-md transition-shadow bg-card"
            />
          </div>
        </motion.div>

        {/* ── Category Filter Chips ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant={!selectedCategory ? 'default' : 'outline'}
              size="sm"
              className="whitespace-nowrap rounded-full h-9 px-5 text-sm font-medium shadow-sm"
              onClick={() => setSelectedCategory(null)}
            >
              ✨ جميع الأقسام
            </Button>
          </motion.div>
          {categories.map((cat, i) => {
            const Icon = categoryIcons[cat.icon || ''] || Languages;
            const isActive = selectedCategory === cat.id;
            return (
              <motion.div key={cat.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={isActive ? 'default' : 'outline'}
                  size="sm"
                  className={`whitespace-nowrap rounded-full h-9 px-4 text-sm font-medium shadow-sm transition-all ${
                    isActive ? '' : 'hover:bg-muted/80'
                  }`}
                  onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                >
                  <Icon className="w-3.5 h-3.5 me-1.5" />
                  {cat.name_ar || cat.name}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Back button ── */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                العودة لجميع الأقسام
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Content ── */}
        {selectedCategory ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <ServiceGrid
              services={filteredServices}
              onOrder={handleOrderService}
              catIndex={categories.findIndex(c => c.id === selectedCategory)}
            />
          </motion.div>
        ) : (
          <div className="space-y-12">
            {categories.map((category, catIndex) => {
              const categoryServices = getServicesByCategory(category.id);
              if (categoryServices.length === 0) return null;
              const Icon = categoryIcons[category.icon || ''] || Languages;
              const style = categoryStyles[catIndex % 6];

              return (
                <motion.section
                  key={category.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
                >
                  {/* Category Header */}
                  <div className={`flex items-center justify-between mb-6 p-4 rounded-2xl ${style.bg} border ${style.border}`}>
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white shadow-lg`}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold">{category.name_ar || category.name}</h2>
                        {category.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`${style.text} border ${style.border} bg-transparent text-xs px-3`}>
                        {categoryServices.length} خدمة
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`${style.text} gap-1 text-xs hidden sm:flex`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        عرض الكل
                        <ArrowLeft className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Services */}
                  <ServiceGrid
                    services={categoryServices}
                    onOrder={handleOrderService}
                    catIndex={catIndex}
                  />
                </motion.section>
              );
            })}
          </div>
        )}

        {/* ── No Results ── */}
        <AnimatePresence>
          {filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <Search className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">لا توجد خدمات</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? 'لم نجد خدمات تطابق بحثك' : 'لا توجد خدمات في هذا القسم'}
              </p>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              >
                مسح الفلاتر
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClientLayout>
  );
};

/* ═══════════════════════════════════════════
   Service Grid Component
   ═══════════════════════════════════════════ */
const ServiceGrid = ({
  services,
  onOrder,
  catIndex = 0,
}: {
  services: Service[];
  onOrder: (service: Service) => void;
  catIndex?: number;
}) => {
  const style = categoryStyles[catIndex % 6];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {services.map((service) => (
        <motion.div
          key={service.id}
          variants={itemVariants}
          layout
        >
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Card className="group h-full border-2 border-transparent hover:border-primary/20 bg-card hover:bg-gradient-to-br hover:from-card hover:to-muted/30 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer"
              onClick={() => onOrder(service)}
            >
              {/* Top accent */}
              <div className={`h-1.5 bg-gradient-to-r ${style.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

              <CardContent className="p-5 flex flex-col h-full">
                {/* Icon circle */}
                <motion.div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-white mb-4 shadow-md group-hover:shadow-lg`}
                  whileHover={{ rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <FileText className="w-5 h-5" />
                </motion.div>

                <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {service.name_ar || service.name}
                </h3>

                {service.description && (
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1">
                    {service.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
                  <span className="text-[10px] text-muted-foreground/60 font-medium">
                    السعر بعد المراجعة
                  </span>
                  <Button
                    size="sm"
                    className={`h-8 text-xs gap-1.5 rounded-full bg-gradient-to-r ${style.gradient} hover:opacity-90 text-white border-0 shadow-md px-4`}
                    onClick={(e) => { e.stopPropagation(); onOrder(service); }}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    اطلب
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ClientServices;
