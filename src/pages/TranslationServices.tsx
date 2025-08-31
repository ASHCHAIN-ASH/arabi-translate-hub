import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Languages, 
  GraduationCap, 
  Users, 
  Search,
  Clock,
  CheckCircle,
  Star,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  features_ar?: string[];
  features_en?: string[];
  delivery_time_days: number;
  rush_delivery_available: boolean;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  show_to_clients: boolean;
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    Languages,
    GraduationCap,
    Users,
    Search
  };
  return icons[iconName] || Languages;
};

export default function TranslationServices() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (categoriesError) throw categoriesError;

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .eq('show_to_clients', true)
        .order('sort_order');

      if (servicesError) throw servicesError;

      setCategories(categoriesData || []);
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir="rtl">
      <Header />
      
      <section className="relative overflow-hidden py-20 px-6">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            خدماتنا الاحترافية
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            نقدم مجموعة متكاملة من الخدمات الأكاديمية والمهنية بأعلى معايير الجودة والدقة
          </p>
        </div>
      </section>

      <section className="container mx-auto p-6 pb-20">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-auto bg-white/50 backdrop-blur-sm border border-white/20 p-1 rounded-2xl">
              <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                جميع الخدمات
              </TabsTrigger>
              {categories.map(category => {
                const IconComponent = getIconComponent(category.icon);
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <IconComponent className="h-4 w-4 ml-2" />
                    {category.name_ar}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-12">
            {categories.map(category => {
              const categoryServices = services.filter(s => s.category_id === category.id);
              if (categoryServices.length === 0) return null;

              const IconComponent = getIconComponent(category.icon);
              
              return (
                <div key={category.id} className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div 
                        className="p-3 rounded-2xl text-white shadow-lg"
                        style={{ backgroundColor: category.color }}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{category.name_ar}</h2>
                        <p className="text-gray-600">{category.description_ar}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.map(service => (
                      <ServiceCard key={service.id} service={service} category={category} />
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .filter(service => service.category_id === category.id)
                  .map(service => (
                    <ServiceCard key={service.id} service={service} category={category} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <Footer />
    </div>
  );
}

function ServiceCard({ service, category }: { service: Service; category: ServiceCategory }) {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      {service.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.image_url}
            alt={service.name_ar}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Badge 
              style={{ backgroundColor: category.color }}
              className="text-white border-0"
            >
              {category.name_ar}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
          {service.name_ar}
        </CardTitle>
        <CardDescription className="mt-2 text-gray-600 line-clamp-2">
          {service.description_ar}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {service.features_ar && service.features_ar.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">المميزات:</h4>
            <ul className="space-y-1">
              {service.features_ar.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>التسليم: {service.delivery_time_days} أيام</span>
          </div>
          {service.rush_delivery_available && (
            <Badge variant="outline" className="text-xs">
              تسليم عاجل متاح
            </Badge>
          )}
        </div>
        
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => navigate('/submit-order')}
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          اطلب الخدمة
        </Button>
      </CardContent>
    </Card>
  );
}