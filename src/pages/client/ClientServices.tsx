import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { 
  Languages, 
  GraduationCap, 
  Users, 
  Search,
  Clock,
  Star,
  ArrowLeft,
  Filter
} from 'lucide-react';

interface ServiceCategory {
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

const ClientServices = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, selectedCategory, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      // Load services with categories (only show to clients)
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          service_categories (
            id,
            name_ar,
            name_en,
            icon,
            color
          )
        `)
        .eq('is_active', true)
        .eq('show_to_clients', true)
        .order('sort_order', { ascending: true });

      if (categoriesError) throw categoriesError;
      if (servicesError) throw servicesError;

      setCategories(categoriesData || []);
      setServices((servicesData || []) as Service[]);
    } catch (error) {
      console.error('Error loading data:', error);
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
      Search
    };
    const Icon = icons[iconName] || Languages;
    return <Icon className="w-6 h-6" />;
  };

  const getServicesByCategory = (categoryId: string) => {
    return filteredServices.filter(service => service.category_id === categoryId);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">خدماتنا</h1>
            <p className="text-lg text-muted-foreground">
              اكتشف مجموعة شاملة من الخدمات الأكاديمية والترجمة المتخصصة
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="ابحث في الخدمات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
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
        </div>

        {loading ? (
          <div className="space-y-8">
            {/* Categories Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
            
            {/* Services Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Categories Overview */}
            {selectedCategory === 'all' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground mb-6">أقسام الخدمات</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categories.map((category) => (
                    <Card 
                      key={category.id} 
                      className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-primary/20"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div 
                          className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: category.color }}
                        >
                          {getIcon(category.icon)}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{category.name_ar}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {category.description_ar}
                        </p>
                        <Badge variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {getServicesByCategory(category.id).length} خدمة
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Services by Category */}
            {selectedCategory !== 'all' ? (
              <div className="space-y-8">
                {/* Category Header */}
                {(() => {
                  const category = categories.find(cat => cat.id === selectedCategory);
                  if (!category) return null;
                  
                  return (
                    <div className="flex items-center gap-4 mb-8">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCategory('all')}
                        className="flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        العودة لجميع الأقسام
                      </Button>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {getIcon(category.icon)}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{category.name_ar}</h2>
                          <p className="text-muted-foreground">{category.description_ar}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            ) : (
              /* All Services by Categories */
              <div className="space-y-12">
                {categories.map((category) => {
                  const categoryServices = getServicesByCategory(category.id);
                  if (categoryServices.length === 0) return null;

                  return (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                            style={{ backgroundColor: category.color }}
                          >
                            {getIcon(category.icon)}
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">{category.name_ar}</h2>
                            <p className="text-muted-foreground">{category.description_ar}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center gap-2"
                        >
                          عرض الكل
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryServices.slice(0, 3).map((service) => (
                          <ServiceCard key={service.id} service={service} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {filteredServices.length === 0 && !loading && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">لا توجد خدمات</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'لم نجد خدمات تطابق بحثك' : 'لا توجد خدمات في هذا القسم'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    مسح الفلاتر
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 group h-full">
      <CardContent className="p-0">
        {/* Service Image */}
        {service.image_url && (
          <div className="relative overflow-hidden rounded-t-lg">
            <img 
              src={service.image_url} 
              alt={service.name_ar}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <Badge 
                variant="secondary" 
                className="bg-white/90 text-foreground"
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
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: service.service_categories?.color || '#3B82F6' }}
              >
                <Languages className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                {service.name_ar}
              </h3>
              <p className="text-sm text-muted-foreground">{service.name_en}</p>
            </div>
          </div>

          {/* Service Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {service.description_ar}
          </p>

          {/* Service Features */}
          {service.features_ar && service.features_ar.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">المميزات:</h4>
              <div className="flex flex-wrap gap-1">
                {service.features_ar.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {service.features_ar.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{service.features_ar.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Service Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Clock className="w-3 h-3" />
                <span>مدة التسليم</span>
              </div>
              <p className="font-medium">{service.delivery_time_days} أيام</p>
            </div>
            <div>
              <div className="flex items-center gap-1 text-muted-foreground mb-1">
                <Star className="w-3 h-3" />
                <span>الحد الأدنى</span>
              </div>
              <p className="font-medium">{service.min_units} {service.unit_type}</p>
            </div>
          </div>

          {/* Rush Delivery Badge */}
          {service.rush_delivery_available && (
            <div className="mb-4">
              <Badge variant="outline" className="text-primary border-primary">
                تسليم سريع متاح
              </Badge>
            </div>
          )}

          {/* Action Button */}
          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            طلب الخدمة
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientServices;