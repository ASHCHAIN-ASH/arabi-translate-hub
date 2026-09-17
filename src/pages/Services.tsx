import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/data/legacy/client";
import Header from "@/components/Header";

import { 
  Languages, 
  GraduationCap, 
  Users, 
  Search,
  Clock,
  Star,
  ArrowLeft,
  Filter,
  ShoppingCart,
  User,
  FileText,
  Edit3,
  CheckCheck,
  FileCheck,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Footer from '@/components/Footer';
interface ServiceCategory {
  [key: string]: any;
  id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

interface Service {
  [key: string]: any;
  id: string;
  category_id: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  features_ar: string[];
  features_en: string[];
  unit_type: string;
  min_units: number;
  max_units?: number;
  base_price?: number;
  price_per_unit?: number;
  delivery_time_days: number;
  rush_delivery_available: boolean;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  show_to_clients: boolean;
  service_categories?: {
    id: string;
    name_ar: string;
    name_en: string;
    icon: string;
    color: string;
  };
}

const Services = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, selectedCategory, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const { data: categoriesData, error: categoriesError } = await (supabase
        .from('service_categories') as any)
        .select('*')
        .order('sort_order', { ascending: true });

      const { data: servicesData, error: servicesError } = await (supabase
        .from('services') as any)
        .select('*')
        .eq('is_active', true);

      if (categoriesError) throw categoriesError;
      if (servicesError) throw servicesError;

      setCategories((categoriesData || []) as ServiceCategory[]);
      setServices((servicesData || []) as any);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل الخدمات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category_id === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name_ar.toLowerCase().includes(query) ||
        service.name_en.toLowerCase().includes(query) ||
        service.description_ar?.toLowerCase().includes(query) ||
        service.description_en?.toLowerCase().includes(query)
      );
    }

    setFilteredServices(filtered);
  };

  const getIcon = (iconName: string) => {
    const icons: any = {
      Languages,
      GraduationCap,
      Users,
      Search,
      FileText,
      Edit3
    };
    const Icon = icons[iconName] || Languages;
    return <Icon className="w-6 h-6" />;
  };

  const getServicesByCategory = (categoryId: string) => {
    return filteredServices.filter(service => service.category_id === categoryId);
  };

  const handleOrderService = async (service: Service) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'يجب تسجيل الدخول',
        description: 'يرجى تسجيل الدخول لطلب الخدمة',
      });
      navigate('/auth', { state: { redirectTo: '/services' } });
      return;
    }
    navigate('/order-now', { state: { selectedService: service } });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              خدماتنا المتميزة
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              اكتشف مجموعة شاملة من الخدمات الأكاديمية والترجمة المتخصصة المصممة لتلبية احتياجاتك
            </p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="ابحث في الخدمات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-12 py-3 text-lg rounded-xl border-2 focus:border-primary"
                dir="rtl"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-input bg-background rounded-xl text-base focus:border-primary"
              >
                <option value="all">جميع الأقسام</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_ar}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-8">
            {/* Loading skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  className="h-40 bg-muted animate-pulse rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div 
                  key={i} 
                  className="h-80 bg-muted animate-pulse rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Categories Overview */}
            {selectedCategory === 'all' && (
              <motion.div 
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">أقسام الخدمات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card 
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30 bg-gradient-to-br from-background to-background/50"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <motion.div 
                            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg"
                            style={{ backgroundColor: category.color }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {getIcon(category.icon)}
                          </motion.div>
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                            {category.name_ar}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            {category.description_ar}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 px-3 py-1"
                          >
                            {getServicesByCategory(category.id).length} خدمة
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Services Display */}
            {selectedCategory !== 'all' ? (
              <div className="space-y-8">
                {/* Category Header */}
                {(() => {
                  const category = categories.find(cat => cat.id === selectedCategory);
                  if (!category) return null;
                  
                  return (
                    <motion.div 
                      className="flex items-center gap-4 mb-8"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCategory('all')}
                        className="flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        العودة لجميع الأقسام
                      </Button>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                          style={{ backgroundColor: category.color }}
                        >
                          {getIcon(category.icon)}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">{category.name_ar}</h2>
                          <p className="text-muted-foreground">{category.description_ar}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Services Grid */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {filteredServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ServiceCard service={service} onOrderService={handleOrderService} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : (
              /* All Services by Categories */
              <div className="space-y-16">
                {categories.map((category, categoryIndex) => {
                  const categoryServices = getServicesByCategory(category.id);
                  if (categoryServices.length === 0) return null;

                  return (
                    <motion.div 
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                            style={{ backgroundColor: category.color }}
                          >
                            {getIcon(category.icon)}
                          </div>
                          <div>
                            <h2 className="text-3xl font-bold">{category.name_ar}</h2>
                            <p className="text-muted-foreground">{category.description_ar}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                        >
                          عرض الكل
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categoryServices.slice(0, 3).map((service, index) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                          >
                            <ServiceCard service={service} onOrderService={handleOrderService} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {filteredServices.length === 0 && !loading && (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Search className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">لا توجد خدمات</h3>
                <p className="text-muted-foreground text-lg mb-6">
                  {searchQuery ? 'لم نجد خدمات تطابق بحثك' : 'لا توجد خدمات في هذا القسم'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button 
                    variant="outline" 
                    className="px-8 py-3"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    مسح الفلاتر
                  </Button>
                )}
              </motion.div>
            )}
          </>
        )}

            {/* خدمات التحرير والمراجعة المتخصصة */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
                <CardContent className="p-10">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Edit3 className="w-12 h-12" />
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-right">
                      <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        خدمات التحرير والمراجعة الاحترافية
                      </h2>
                      <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                        نوفر مجموعة شاملة من خدمات التحرير اللغوي والمراجعة الأكاديمية بأعلى معايير الجودة العالمية
                      </p>
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                          <CheckCheck className="w-4 h-4 ml-2" />
                          التدقيق اللغوي
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                          <FileCheck className="w-4 h-4 ml-2" />
                          المراجعة الأكاديمية
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                          <BookOpen className="w-4 h-4 ml-2" />
                          التحرير التنموي
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-sm">
                          <Sparkles className="w-4 h-4 ml-2" />
                          مراجعة الأسلوب
                        </Badge>
                      </div>
                      <Button
                        size="lg"
                        onClick={() => navigate('/services/editing-services')}
                        className="px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                      >
                        استكشف خدمات التحرير
                        <ArrowLeft className="w-5 h-5 mr-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Call to Action */}
        <motion.div 
          className="mt-20 text-center bg-gradient-to-r from-primary/5 to-purple-600/5 rounded-3xl p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">هل تحتاج مساعدة في اختيار الخدمة المناسبة؟</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            فريقنا المتخصص جاهز لمساعدتك في اختيار الخدمة الأنسب لاحتياجاتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={() => navigate('/login')}
            >
              <User className="w-5 h-5 ml-2" />
              تسجيل الدخول
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
              onClick={() => navigate('/register')}
            >
              إنشاء حساب جديد
            </Button>
          </div>
        </motion.div>
      </div>

      
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service, onOrderService }: { service: Service; onOrderService: (service: Service) => void }) => {
  return (
    <Card className="hover:shadow-xl transition-all duration-500 group h-full bg-gradient-to-br from-background to-background/50 border-2 hover:border-primary/20">
      <CardContent className="p-0">
        {/* Service Image */}
        {service.image_url && (
          <div className="relative overflow-hidden rounded-t-2xl">
            <img 
              src={service.image_url} 
              alt={service.name_ar}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 right-4">
              <Badge 
                variant="secondary" 
                className="bg-white/90 text-foreground backdrop-blur-sm"
              >
                {service.service_categories?.name_ar}
              </Badge>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Service Header */}
          <div className="flex items-start gap-3 mb-4">
            {!service.image_url && (
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg"
                style={{ backgroundColor: service.service_categories?.color || '#3B82F6' }}
              >
                <Languages className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                {service.name_ar}
              </h3>
              <p className="text-sm text-muted-foreground">{service.name_en}</p>
            </div>
          </div>

          {/* Service Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
            {service.description_ar}
          </p>

          {/* Service Features */}
          {service.features_ar && service.features_ar.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                المميزات:
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.features_ar.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs py-1 px-3">
                    {feature}
                  </Badge>
                ))}
                {service.features_ar.length > 3 && (
                  <Badge variant="outline" className="text-xs py-1 px-3">
                    +{service.features_ar.length - 3} المزيد
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Service Info */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                مدة التسليم:
              </span>
              <span className="font-medium">{service.delivery_time_days} يوم</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">نوع الوحدة:</span>
              <span className="font-medium">{service.unit_type}</span>
            </div>

            {service.base_price && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">السعر الأساسي:</span>
                <span className="font-bold text-lg text-primary">{service.base_price} ر.س</span>
              </div>
            )}
          </div>

          {/* Order Button */}
          <Button 
            className="w-full py-3 text-base font-medium group-hover:shadow-lg transition-all"
            onClick={() => onOrderService(service)}
          >
            <ShoppingCart className="w-5 h-5 ml-2" />
            طلب الخدمة
          </Button>
              <Footer />
    </div>
      </CardContent>
    </Card>
  );
};

export default Services;