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
  Search, ArrowLeft, ShoppingCart, Sparkles, Star, Users, Filter
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

const categoryGradients: Record<number, string> = {
  0: 'from-blue-600 to-indigo-600',
  1: 'from-emerald-600 to-teal-600',
  2: 'from-purple-600 to-pink-600',
  3: 'from-amber-600 to-orange-600',
  4: 'from-rose-600 to-red-600',
  5: 'from-cyan-600 to-blue-600',
};

const ClientServices = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

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
    // Navigate to new order page with pre-selected service
    navigate(`/orders/new?service=${service.id}`);
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="p-6 space-y-6" dir="rtl">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-4 sm:p-6 space-y-6" dir="rtl">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4" />
            خدمات أكاديمية متكاملة
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl font-bold mb-2"
          >
            اطلب خدمتك <span className="text-primary">مباشرة</span>
          </motion.h1>
          <p className="text-muted-foreground text-sm">
            اختر من خدماتنا المتخصصة وأنشئ طلبك بسهولة
          </p>
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث في الخدمات..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </motion.div>

        {/* Category Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
          <Button
            variant={!selectedCategory ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap rounded-full"
            onClick={() => setSelectedCategory(null)}
          >
            جميع الأقسام
          </Button>
          {categories.map(cat => {
            const Icon = categoryIcons[cat.icon || ''] || Languages;
            return (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap rounded-full"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Icon className="w-3.5 h-3.5 me-1" />
                {cat.name_ar || cat.name}
              </Button>
            );
          })}
        </div>

        {/* Back button when category selected */}
        {selectedCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لجميع الأقسام
          </Button>
        )}

        {/* Services by Category */}
        {selectedCategory ? (
          // Single category view
          <div className="space-y-4">
            <ServiceGrid
              services={filteredServices}
              onOrder={handleOrderService}
            />
          </div>
        ) : (
          // All categories view
          <div className="space-y-10">
            {categories.map((category, catIndex) => {
              const categoryServices = getServicesByCategory(category.id);
              if (categoryServices.length === 0) return null;
              const Icon = categoryIcons[category.icon || ''] || Languages;
              const gradient = categoryGradients[catIndex % 6];

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIndex * 0.05 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">{category.name_ar || category.name}</h2>
                        {category.description && (
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {categoryServices.length} خدمة
                    </Badge>
                  </div>

                  {/* Services Grid */}
                  <ServiceGrid
                    services={categoryServices}
                    onOrder={handleOrderService}
                    gradient={gradient}
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-1">لا توجد خدمات</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'لم نجد خدمات تطابق بحثك' : 'لا توجد خدمات في هذا القسم'}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            >
              مسح الفلاتر
            </Button>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

// Service Grid Component
const ServiceGrid = ({
  services,
  onOrder,
  gradient = 'from-blue-600 to-indigo-600',
}: {
  services: Service[];
  onOrder: (service: Service) => void;
  gradient?: string;
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <AnimatePresence mode="popLayout">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, delay: index * 0.03 }}
        >
          <Card className="group h-full hover:shadow-lg transition-all duration-300 border hover:border-primary/30 overflow-hidden">
            {/* Top gradient line */}
            <div className={`h-1 bg-gradient-to-r ${gradient}`} />

            <CardContent className="p-5">
              <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors leading-snug">
                {service.name_ar || service.name}
              </h3>

              {service.description && (
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-[11px] text-muted-foreground/70">
                  السعر يُحدد بعد المراجعة
                </span>
                <Button
                  size="sm"
                  className="h-8 text-xs gap-1.5"
                  onClick={(e) => { e.stopPropagation(); onOrder(service); }}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  اطلب الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

export default ClientServices;
