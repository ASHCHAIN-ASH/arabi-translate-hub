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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
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

      {/* Services Section - No Services Available */}
      <section className="container mx-auto p-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-12"
        >
          {/* No Services Message */}
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-card/60 backdrop-blur-xl border border-border/30 p-12 rounded-3xl shadow-2xl"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full mb-8"
              >
                <Languages className="w-12 h-12 text-primary" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                قريباً... خدمات ترجمة متطورة
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                نعمل حالياً على تطوير مجموعة متكاملة من خدمات الترجمة الاحترافية
                <br />
                ستكون متاحة قريباً بأعلى معايير الجودة العالمية
              </p>

              {/* Coming Soon Features */}
              <div className="grid md:grid-cols-3 gap-8 mb-10">
                {[
                  {
                    icon: FileText,
                    title: "ترجمة المستندات",
                    desc: "ترجمة احترافية لجميع أنواع المستندات"
                  },
                  {
                    icon: Globe,
                    title: "ترجمة المواقع",
                    desc: "حلول ترجمة متكاملة للمواقع الإلكترونية"
                  },
                  {
                    icon: Video,
                    title: "ترجمة الوسائط",
                    desc: "ترجمة الفيديوهات والمحتوى الصوتي"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border border-border/30"
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                      className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-4"
                    >
                      <feature.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    
                    <h3 className="font-bold text-lg mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Contact CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="space-y-6"
              >
                <p className="text-lg font-medium text-primary">
                  هل لديك مشروع ترجمة؟ تواصل معنا الآن للحصول على استشارة مجانية
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-12 py-6 text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 font-semibold"
                      onClick={() => navigate('/submit-order')}
                    >
                      <MessageCircle className="w-6 h-6 ml-3" />
                      تواصل معنا
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
                      className="border-2 border-primary/30 hover:border-primary bg-transparent hover:bg-primary/5 text-primary px-12 py-6 text-lg rounded-2xl backdrop-blur-sm font-semibold"
                    >
                      <Star className="w-6 h-6 ml-3" />
                      اشترك للتحديثات
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-8 rounded-2xl border border-primary/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4 text-center">
                كن أول من يعلم عند إطلاق خدماتنا
              </h3>
              <p className="text-muted-foreground text-center mb-6">
                اشترك في قائمتنا البريدية للحصول على إشعار فوري عند توفر الخدمات
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  className="flex-1 px-4 py-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-right"
                />
                <Button className="bg-primary hover:bg-primary/90 px-8 py-3 rounded-xl font-medium">
                  اشتراك
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}