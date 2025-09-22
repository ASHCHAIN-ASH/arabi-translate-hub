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
  Monitor,
  Award,
  Shield,
  Zap,
  TrendingUp,
  MessageCircle,
  Play
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" dir="rtl">
      <Header />
      
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/10" />
          
          {/* Animated Background Shapes */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
          />
          
          <motion.div 
            animate={{ 
              rotate: -360,
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              rotate: { duration: 40, repeat: Infinity, ease: "linear" },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 7, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -bottom-32 -left-32 w-72 h-72 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl"
          />

          <motion.div 
            animate={{ 
              x: [0, 20, 0],
              rotate: 180,
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-secondary/15 to-accent/15 rounded-full blur-2xl"
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full mb-8 border border-primary/20 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Award className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                خدمات ترجمة معتمدة دولياً
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Shield className="w-6 h-6 text-green-500" />
              </motion.div>
            </motion.div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent"
              >
                حلول الترجمة
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mt-2"
              >
                الاحترافية
              </motion.span>
            </h1>
            
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-6">
                نربط بين الثقافات واللغات بخدmات ترجمة متطورة تلبي احتياجات الشركات والأفراد
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
                {[
                  { number: "500+", label: "مشروع مكتمل", icon: TrendingUp },
                  { number: "50+", label: "لغة مدعومة", icon: Globe },
                  { number: "24/7", label: "دعم متواصل", icon: MessageCircle },
                  { number: "99%", label: "رضا العملاء", icon: Star }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                    className="text-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-2"
                    >
                      <stat.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div className="text-2xl md:text-3xl font-bold text-primary">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 font-semibold"
                  onClick={() => navigate('/submit-order')}
                >
                  <Zap className="w-6 h-6 ml-3" />
                  احصل على عرض فوري
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="mr-2"
                  >
                    ←
                  </motion.div>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary/30 hover:border-primary bg-transparent hover:bg-primary/5 text-primary px-12 py-6 text-xl rounded-2xl backdrop-blur-sm font-semibold"
                >
                  <Play className="w-6 h-6 ml-3" />
                  شاهد أعمالنا
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl backdrop-blur-sm border border-primary/10 flex items-center justify-center"
        >
          <Languages className="w-8 h-8 text-primary" />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-2xl backdrop-blur-sm border border-secondary/10 flex items-center justify-center"
        >
          <Globe className="w-8 h-8 text-secondary" />
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full mb-6 border border-primary/10"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-primary">خدماتنا المتميزة</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              اختر الخدمة المناسبة لاحتياجاتك
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نوفر مجموعة شاملة من خدمات الترجمة المتخصصة لجميع المجالات والصناعات
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            {/* Enhanced Tab Navigation */}
            <div className="flex justify-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card/60 backdrop-blur-xl border border-border/30 p-3 rounded-3xl shadow-2xl"
              >
                <TabsList className="grid grid-cols-auto bg-transparent p-0 gap-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <TabsTrigger 
                      value="all" 
                      className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:bg-muted/50 px-8 py-4 text-base font-medium"
                    >
                      <Globe className="h-5 w-5 ml-2" />
                      جميع الخدمات
                    </TabsTrigger>
                  </motion.div>
                  
                  {categories.map((category, index) => {
                    const IconComponent = getIconComponent(category.icon);
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }}
                      >
                        <TabsTrigger 
                          value={category.id}
                          className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 hover:bg-muted/50 px-8 py-4 text-base font-medium"
                        >
                          <IconComponent className="h-5 w-5 ml-2" />
                          {category.name_ar}
                        </TabsTrigger>
                      </motion.div>
                    );
                  })}
                </TabsList>
              </motion.div>
            </div>

            {/* All Services Tab Content */}
            <AnimatePresence mode="wait">
              <TabsContent value="all" className="space-y-20">
                {categories.map((category, categoryIndex) => {
                  const categoryServices = services.filter(s => s.category_id === category.id);
                  if (categoryServices.length === 0) return null;

                  const IconComponent = getIconComponent(category.icon);
                  
                  return (
                    <motion.div 
                      key={category.id} 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.3, duration: 0.8 }}
                      className="space-y-12"
                    >
                      {/* Category Header */}
                      <div className="text-center">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: categoryIndex * 0.3 + 0.2, duration: 0.6 }}
                          className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-12"
                        >
                          <div className="relative group">
                            <motion.div 
                              whileHover={{ scale: 1.15, rotate: 10 }}
                              className="p-6 rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-2xl relative overflow-hidden"
                            >
                              <IconComponent className="h-12 w-12 relative z-10" />
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                            
                            {/* Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                          </div>
                          
                          <div className="text-center lg:text-right space-y-4">
                            <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 bg-clip-text text-transparent">
                              {category.name_ar}
                            </h3>
                            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                              {category.description_ar}
                            </p>
                            
                            {/* Category Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                              <Badge variant="secondary" className="px-4 py-2 text-sm">
                                <Clock className="w-4 h-4 ml-1" />
                                تسليم سريع
                              </Badge>
                              <Badge variant="secondary" className="px-4 py-2 text-sm">
                                <Shield className="w-4 h-4 ml-1" />
                                جودة معتمدة
                              </Badge>
                              <Badge variant="secondary" className="px-4 py-2 text-sm">
                                <Star className="w-4 h-4 ml-1" />
                                خبراء متخصصون
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Services Grid */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: categoryIndex * 0.3 + 0.4, duration: 0.8 }}
                        className="grid sm:grid-cols-2 xl:grid-cols-3 gap-10"
                      >
                        {categoryServices.map((service, serviceIndex) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30, rotateX: 15 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ 
                              delay: categoryIndex * 0.3 + serviceIndex * 0.15 + 0.6, 
                              duration: 0.6,
                              ease: "easeOut"
                            }}
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
      whileHover={{ y: -12, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group h-full"
    >
      <Card className="overflow-hidden bg-card/70 backdrop-blur-xl border border-border/30 shadow-2xl hover:shadow-4xl transition-all duration-700 h-full relative">
        {/* Premium Card Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        
        <div className="relative bg-card rounded-2xl h-full">
          {/* Enhanced Image Section */}
          <div className="relative h-64 overflow-hidden rounded-t-2xl">
            <motion.img
              whileHover={{ scale: 1.15, rotate: 2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              src={serviceImage}
              alt={service.name_ar}
              className="w-full h-full object-cover"
            />
            
            {/* Multi-layer Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Enhanced Category Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute top-6 right-6"
            >
              <Badge className="bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-md text-primary-foreground border-0 px-4 py-2 text-sm font-medium shadow-2xl">
                {category.name_ar}
              </Badge>
            </motion.div>

            {/* Premium Quality Stars */}
            <div className="absolute bottom-6 right-6 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1 + 0.5, duration: 0.4, ease: "easeOut" }}
                >
                  <Star className="h-4 w-4 text-yellow-400 fill-current drop-shadow-lg" />
                </motion.div>
              ))}
            </div>

            {/* Service Type Indicator */}
            <div className="absolute bottom-6 left-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30"
              >
                <FileText className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>
          
          {/* Enhanced Content Section */}
          <div className="p-8 space-y-6">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                {service.name_ar}
              </CardTitle>
              <CardDescription className="text-muted-foreground line-clamp-3 leading-relaxed text-base mt-3">
                {service.description_ar}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0 space-y-6">
              {/* Enhanced Features */}
              {service.features_ar && service.features_ar.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h4 className="font-bold text-foreground flex items-center gap-3 text-lg">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="h-5 w-5 text-primary" />
                    </motion.div>
                    المميزات الأساسية:
                  </h4>
                  <ul className="space-y-3">
                    {service.features_ar.slice(0, 3).map((feature, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3 text-muted-foreground group/item hover:text-foreground transition-colors duration-200"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="mt-0.5"
                        >
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 group-hover/item:text-green-400" />
                        </motion.div>
                        <span className="leading-relaxed text-base">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
              
              {/* Enhanced Delivery & Service Info */}
              <div className="space-y-4">
                {/* Delivery Time Card */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-2xl border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="h-5 w-5 text-primary" />
                    </motion.div>
                    <span className="font-semibold text-base">التسليم خلال {service.delivery_time_days} أيام</span>
                  </div>
                  {service.rush_delivery_available && (
                    <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 hover:from-orange-200 hover:to-orange-100 border-orange-200 font-medium">
                      <Zap className="w-3 h-3 ml-1" />
                      تسليم عاجل
                    </Badge>
                  )}
                </div>

                {/* Quality Assurance */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl border border-green-200/30">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">ضمان الجودة والمراجعة المجانية</span>
                </div>
              </div>
              
              {/* Enhanced Action Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
              >
                <Button 
                  className="w-full bg-gradient-to-r from-primary via-secondary to-primary hover:from-primary/90 hover:via-secondary/90 hover:to-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-500 py-7 text-lg font-semibold rounded-2xl relative overflow-hidden group/btn"
                  onClick={() => navigate('/submit-order')}
                >
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                  
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowLeft className="h-6 w-6 ml-3" />
                  </motion.div>
                  احصل على عرض سعر مخصص
                  
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="mr-3 text-xl"
                  >
                    ←
                  </motion.div>
                </Button>
              </motion.div>
            </CardContent>
          </div>

          {/* Premium Hover Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl" />
          
          {/* Corner Accent */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-2xl" />
        </div>
      </Card>
    </motion.div>
  );
}