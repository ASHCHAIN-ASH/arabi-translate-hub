import React, { useState, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Languages, 
  GraduationCap, 
  Users, 
  Search,
  Clock,
  CheckCircle,
  Star,
  ArrowLeft,
  Sparkles,
  Globe,
  FileText,
  Video,
  Headphones,
  Monitor
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import real images
import documentTranslationImg from "@/assets/real-document-translation.jpg";
import textTranslationImg from "@/assets/real-text-translation.jpg";
import audioTranslationImg from "@/assets/real-audio-translation.jpg";
import videoTranslationImg from "@/assets/real-video-translation.jpg";
import websiteTranslationImg from "@/assets/real-website-translation.jpg";
import businessServicesImg from "@/assets/real-business-services.jpg";

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
    Search,
    FileText,
    Video,
    Headphones,
    Monitor,
    Globe
  };
  return icons[iconName] || Languages;
};

const getServiceImage = (serviceName: string) => {
  const imageMap: Record<string, string> = {
    'ترجمة المستندات': documentTranslationImg,
    'ترجمة النصوص': textTranslationImg,
    'ترجمة صوتية': audioTranslationImg,
    'ترجمة الفيديو': videoTranslationImg,
    'ترجمة المواقع': websiteTranslationImg,
    'خدمات الأعمال': businessServicesImg,
    'document': documentTranslationImg,
    'text': textTranslationImg,
    'audio': audioTranslationImg,
    'video': videoTranslationImg,
    'website': websiteTranslationImg,
    'business': businessServicesImg
  };
  
  // Try to match by service name or return a default
  const matchedImage = Object.entries(imageMap).find(([key]) => 
    serviceName.includes(key) || key.includes(serviceName.toLowerCase())
  );
  
  return matchedImage ? matchedImage[1] : documentTranslationImg;
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"
          />
          <motion.div 
            animate={{ 
              rotate: -360,
              y: [0, -20, 0]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl"
          />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6 border border-primary/20"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">خدمات احترافية عالمية</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6 leading-tight">
              خدمات الترجمة
              <br />
              <span className="text-3xl md:text-5xl lg:text-6xl">الاحترافية</span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed"
            >
              نقدم مجموعة متكاملة من خدمات الترجمة المتخصصة بأعلى معايير الجودة العالمية
              <br />
              <span className="text-lg text-primary font-semibold">مع فريق من الخبراء المعتمدين</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/submit-order')}
              >
                <ArrowLeft className="w-5 h-5 ml-2" />
                ابدأ مشروعك الآن
              </Button>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>جودة مضمونة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>تسليم سريع</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>خبراء معتمدون</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto p-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="flex justify-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <TabsList className="grid grid-cols-auto bg-card/80 backdrop-blur-lg border border-border/50 p-2 rounded-2xl shadow-lg">
                  <TabsTrigger 
                    value="all" 
                    className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:bg-muted/50 px-6 py-3"
                  >
                    <Globe className="h-4 w-4 ml-2" />
                    جميع الخدمات
                  </TabsTrigger>
                  {categories.map((category, index) => {
                    const IconComponent = getIconComponent(category.icon);
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <TabsTrigger 
                          value={category.id}
                          className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:bg-muted/50 px-6 py-3"
                        >
                          <IconComponent className="h-4 w-4 ml-2" />
                          {category.name_ar}
                        </TabsTrigger>
                      </motion.div>
                    );
                  })}
                </TabsList>
              </motion.div>
            </div>

          <AnimatePresence mode="wait">
            <TabsContent value="all" className="space-y-16">
              {categories.map((category, categoryIndex) => {
                const categoryServices = services.filter(s => s.category_id === category.id);
                if (categoryServices.length === 0) return null;

                const IconComponent = getIconComponent(category.icon);
                
                return (
                  <motion.div 
                    key={category.id} 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.2, duration: 0.6 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: categoryIndex * 0.2 + 0.1, duration: 0.5 }}
                        className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8"
                      >
                        <div className="relative group">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="p-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-xl"
                          >
                            <IconComponent className="h-8 w-8" />
                          </motion.div>
                          <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        
                        <div className="text-center lg:text-right">
                          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-2">
                            {category.name_ar}
                          </h2>
                          <p className="text-lg text-muted-foreground max-w-2xl">
                            {category.description_ar}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: categoryIndex * 0.2 + 0.3, duration: 0.6 }}
                      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                      {categoryServices.map((service, serviceIndex) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: categoryIndex * 0.2 + serviceIndex * 0.1 + 0.4, duration: 0.4 }}
                        >
                          <ServiceCard service={service} category={category} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                );
              })}
            </TabsContent>
          </AnimatePresence>

          {categories.map(category => (
            <AnimatePresence mode="wait" key={category.id}>
              <TabsContent value={category.id} className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {services
                    .filter(service => service.category_id === category.id)
                    .map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <ServiceCard service={service} category={category} />
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          ))}
          </Tabs>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

function ServiceCard({ service, category }: { service: Service; category: ServiceCategory }) {
  const navigate = useNavigate();
  const serviceImage = service.image_url || getServiceImage(service.name_ar);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="group overflow-hidden bg-card/80 backdrop-blur-lg border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={serviceImage}
            alt={service.name_ar}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4"
          >
            <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 px-3 py-1 text-xs font-medium shadow-lg">
              {category.name_ar}
            </Badge>
          </motion.div>

          {/* Quality Indicator */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.5, duration: 0.3 }}
              >
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6 space-y-4">
          <CardHeader className="p-0">
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {service.name_ar}
            </CardTitle>
            <CardDescription className="text-muted-foreground line-clamp-2 leading-relaxed">
              {service.description_ar}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0 space-y-4">
            {/* Features */}
            {service.features_ar && service.features_ar.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  المميزات الرئيسية:
                </h4>
                <ul className="space-y-2">
                  {service.features_ar.slice(0, 3).map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
            
            {/* Delivery Info */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/30">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">التسليم خلال {service.delivery_time_days} أيام</span>
              </div>
              {service.rush_delivery_available && (
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 hover:bg-orange-200">
                  تسليم عاجل
                </Badge>
              )}
            </div>
            
            {/* Action Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 py-6 text-base font-medium rounded-xl"
                onClick={() => navigate('/submit-order')}
              >
                <ArrowLeft className="h-5 w-5 ml-2" />
                اطلب الخدمة الآن
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="mr-2"
                >
                  ←
                </motion.div>
              </Button>
            </motion.div>
          </CardContent>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </Card>
    </motion.div>
  );
}