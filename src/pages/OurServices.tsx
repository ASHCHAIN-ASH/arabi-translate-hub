import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Languages, BookOpen, GraduationCap, Microscope, FileText, CheckCircle,
  ArrowLeft, RefreshCw, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface Category {
  id: string;
  name_ar: string | null;
  icon: string | null;
  description: string | null;
  sort_order: number | null;
}

interface ServiceItem {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  unit: string | null;
  category_id: string | null;
}

const categoryIcons: Record<string, React.ElementType> = {
  Languages, BookOpen, GraduationCap, Microscope, FileText, CheckCircle,
};

const categoryColors: Record<number, string> = {
  1: 'from-blue-600 to-indigo-600',
  2: 'from-emerald-600 to-teal-600',
  3: 'from-purple-600 to-pink-600',
  4: 'from-amber-600 to-orange-600',
  5: 'from-rose-600 to-red-600',
  6: 'from-cyan-600 to-blue-600',
};

const categoryBgColors: Record<number, string> = {
  1: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
  2: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
  3: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
  4: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
  5: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800',
  6: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800',
};

const unitLabels: Record<string, string> = {
  page: 'لكل صفحة',
  hour: 'لكل ساعة',
  project: 'للمشروع',
};

const OurServices = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catsRes, svcRes] = await Promise.all([
        supabase.from('service_categories').select('id, name_ar, icon, description, sort_order').order('sort_order'),
        supabase.from('services').select('id, name, name_ar, description, unit, category_id').eq('is_active', true),
      ]);
      if (catsRes.error) throw catsRes.error;
      if (svcRes.error) throw svcRes.error;
      setCategories(catsRes.data || []);
      setServices(svcRes.data || []);
    } catch (e) {
      console.error('Error loading services:', e);
    } finally {
      setLoading(false);
    }
  };

  const getServicesByCategory = (categoryId: string) => {
    return services.filter(s => s.category_id === categoryId);
  };

  return (
    <>
      <SEO
        title="خدماتنا - ماستر إيدو باث"
        description="تعرف على جميع خدماتنا الأكاديمية والبحثية: الترجمة، الكتابة الأكاديمية، الاستشارات، التحليل الإحصائي، النشر العلمي، والتدقيق اللغوي."
      />
      <Header />
      <main className="min-h-screen" dir="rtl">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 me-1.5" />
                أكثر من 32 خدمة متخصصة
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                خدماتنا المتخصصة
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                نقدم مجموعة شاملة من الخدمات الأكاديمية والبحثية والترجمة بأعلى معايير الجودة
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Sections */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-16">
                {categories.map((category, index) => {
                  const Icon = categoryIcons[category.icon || ''] || Languages;
                  const catServices = getServicesByCategory(category.id);
                  const colorIdx = (category.sort_order || index + 1);
                  const gradient = categoryColors[colorIdx] || categoryColors[1];
                  const bgColor = categoryBgColors[colorIdx] || categoryBgColors[1];

                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {/* Category Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{category.name_ar}</h2>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <Badge variant="outline" className="ms-auto">
                          {catServices.length} خدمة
                        </Badge>
                      </div>

                      {/* Services Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {catServices.map((service, sIdx) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: sIdx * 0.05 }}
                          >
                            <Card className={`h-full border transition-all hover:shadow-md hover:-translate-y-0.5 ${bgColor}`}>
                              <CardContent className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 opacity-80`}>
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <h3 className="font-semibold text-sm leading-snug pt-1">
                                    {service.name_ar || service.name}
                                  </h3>
                                </div>
                                {service.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                    {service.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between mt-auto">
                                  <span className="text-xs text-muted-foreground">
                                    {unitLabels[service.unit || 'project'] || service.unit}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 text-center"
            >
              <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <CardContent className="py-10 px-6">
                  <h3 className="text-2xl font-bold mb-3">هل تحتاج إلى خدمة؟</h3>
                  <p className="text-muted-foreground mb-6">
                    أنشئ طلبك الآن واحصل على أفضل خدمة أكاديمية متخصصة
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" onClick={() => navigate('/orders/new')}>
                      اطلب الآن
                      <ArrowLeft className="w-4 h-4 ms-2" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => navigate('/contact')}>
                      تواصل معنا
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default OurServices;
