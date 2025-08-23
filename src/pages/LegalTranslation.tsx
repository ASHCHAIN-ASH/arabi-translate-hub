import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUploader from "@/components/FileUploader";
import AdvancedFileAnalyzer from "@/components/AdvancedFileAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scale, 
  FileText, 
  Award, 
  Shield, 
  Clock, 
  Users,
  CheckCircle,
  Star,
  Calculator,
  Zap,
  Globe,
  Sparkles,
  TrendingUp,
  Target,
  Layers,
  BookOpen,
  Building2,
  Gavel,
  ArrowLeft,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  PlayCircle
} from "lucide-react";
import { motion } from "framer-motion";
import legalOfficeBg from "@/assets/legal-office-bg.jpg";

const LegalTranslation = () => {
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileAnalyses, setFileAnalyses] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [fromLanguage, setFromLanguage] = useState("ar");
  const [toLanguage, setToLanguage] = useState("en");
  const [urgency, setUrgency] = useState<'standard' | 'fast' | 'urgent' | 'express'>('standard');
  const [qualityLevel, setQualityLevel] = useState<'standard' | 'premium' | 'expert'>('premium');

  const services = [
    { 
      title: "ترجمة العقود التجارية", 
      icon: FileText, 
      desc: "عقود البيع والشراء والتوريد بدقة قانونية عالية",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      title: "ترجمة الوثائق القضائية", 
      icon: Gavel, 
      desc: "المرافعات والأحكام القضائية والتقارير",
      color: "from-red-500 to-red-600", 
      bgColor: "bg-red-50"
    },
    { 
      title: "ترجمة الشهادات الرسمية", 
      icon: Award, 
      desc: "شهادات الميلاد والزواج والوفاة",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    { 
      title: "ترجمة الشهادات الأكاديمية", 
      icon: BookOpen, 
      desc: "الدبلومات والشهادات الجامعية",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      title: "ترجمة براءات الاختراع", 
      icon: Sparkles, 
      desc: "الملكية الفكرية والاختراعات التقنية",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50"
    },
    { 
      title: "ترجمة قوانين الشركات", 
      icon: Building2, 
      desc: "اللوائح والنظم الداخلية للشركات",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50"
    },
    { 
      title: "ترجمة وثائق المحاكم", 
      icon: Scale, 
      desc: "الأحكام والقرارات القضائية النهائية",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50"
    },
    { 
      title: "ترجمة المذكرات القانونية", 
      icon: MessageSquare, 
      desc: "المذكرات والتقارير القانونية المتخصصة",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50"
    }
  ];

  const features = [
    { 
      icon: Award, 
      title: "مترجمون معتمدون", 
      desc: "فريق من المترجمين المعتمدين والمتخصصين في القانون",
      color: "from-amber-500 to-orange-500"
    },
    { 
      icon: Shield, 
      title: "سرية تامة", 
      desc: "حماية كاملة وسرية مطلقة لجميع الوثائق القانونية",
      color: "from-emerald-500 to-green-500"
    },
    { 
      icon: Clock, 
      title: "تسليم سريع", 
      desc: "التزام صارم بالمواعيد المحددة مع ضمان الجودة",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      icon: CheckCircle, 
      title: "دقة 100%", 
      desc: "مراجعة دقيقة متعددة المستويات لضمان الصحة القانونية",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const stats = [
    { number: "5000+", label: "وثيقة قانونية مترجمة", icon: FileText },
    { number: "98%", label: "رضا العملاء", icon: Star },
    { number: "24/7", label: "دعم فني متواصل", icon: Clock },
    { number: "15+", label: "لغة متاحة", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section - تصميم جديد مشرق وتفاعلي */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 opacity-30">
          <motion.div 
            className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity 
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2], 
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity 
            }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/15 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
            animate={{ 
              rotate: 360 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* أيقونة رئيسية متحركة */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-primary/30 rounded-full blur-2xl"
                  animate={{ 
                    scale: [1, 1.5, 1], 
                    opacity: [0.5, 0.8, 0.5] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                />
                <div className="relative bg-gradient-to-br from-primary to-primary-dark p-8 rounded-full shadow-primary">
                  <Scale className="h-16 w-16 text-primary-foreground" />
                </div>
              </motion.div>
            </motion.div>
            
            {/* العنوان الرئيسي */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-7xl font-arabic-title font-bold mb-6 text-foreground leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              خدمات <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">الترجمة القانونية</span> المعتمدة
            </motion.h1>
            
            {/* الوصف */}
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              نقدم خدمات ترجمة قانونية احترافية معتمدة مع أحدث التقنيات في حساب الكلمات 
              والتسعير الشفاف لجميع أنواع الوثائق القانونية والرسمية
            </motion.p>
            
            {/* شارات المزايا */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { icon: Shield, text: "ترجمة معتمدة ومضمونة", color: "bg-green-100 text-green-800 border-green-200" },
                { icon: Award, text: "مترجمون قانونيون خبراء", color: "bg-blue-100 text-blue-800 border-blue-200" },
                { icon: Clock, text: "تسليم سريع ودقيق", color: "bg-orange-100 text-orange-800 border-orange-200" },
                { icon: CheckCircle, text: "دقة 100% مضمونة", color: "bg-purple-100 text-purple-800 border-purple-200" }
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge className={`${badge.color} border px-4 py-2 text-sm font-semibold`}>
                    <badge.icon className="h-4 w-4 ml-2" />
                    {badge.text}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
            
            {/* أزرار العمل */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-primary text-primary-foreground shadow-primary px-8 py-4 text-lg font-bold rounded-xl"
                >
                  <Calculator className="h-5 w-5 ml-2" />
                  احسب تكلفة الترجمة الآن
                  <ArrowLeft className="h-5 w-5 mr-2" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-bold rounded-xl"
                >
                  <PlayCircle className="h-5 w-5 ml-2" />
                  شاهد نماذج أعمالنا
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* قسم الإحصائيات */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary-dark to-accent text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl mb-4 inline-block"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon className="h-8 w-8 mx-auto" />
                </motion.div>
                <motion.div
                  className="text-3xl lg:text-4xl font-bold mb-2"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الخدمات - تصميم تفاعلي جديد */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold text-foreground mb-6">
              خدماتنا <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">القانونية المتخصصة</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نقدم ترجمة احترافية لجميع أنواع الوثائق القانونية مع ضمان الدقة والسرية التامة
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group cursor-pointer"
                >
                  <Card className={`h-full bg-background border-0 shadow-soft hover:shadow-strong transition-all duration-500 overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <CardContent className="p-6 text-center relative z-10">
                      <motion.div 
                        className={`${service.bgColor} p-4 rounded-2xl mb-4 inline-block group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <IconComponent className={`h-8 w-8 bg-gradient-to-r ${service.color} bg-clip-text text-transparent`} />
                      </motion.div>
                      
                      <h3 className="text-lg font-bold text-foreground mb-3 font-arabic-title group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {service.desc}
                      </p>
                      
                      <motion.div
                        className="flex items-center justify-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -10 }}
                        whileInView={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-sm">اعرف المزيد</span>
                        <ArrowLeft className="h-4 w-4" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* قسم المزايا - تصميم محسن */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold text-foreground mb-6">
              لماذا نحن <span className="text-gradient-secondary bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">الخيار الأفضل؟</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نجمع بين الخبرة القانونية والتقنية المتقدمة لضمان أفضل خدمة ترجمة
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="group"
                >
                  <Card className="text-center h-full bg-gradient-card border-0 shadow-soft hover:shadow-strong transition-all duration-500">
                    <CardContent className="p-8">
                      <motion.div 
                        className={`bg-gradient-to-r ${feature.color} p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <IconComponent className="h-10 w-10 text-white" />
                      </motion.div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-4 font-arabic-title group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

                {/* حاسبة التكلفة التفاعلية */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold text-foreground mb-6">
              <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">حاسبة التكلفة</span> الذكية
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              احسب تكلفة ترجمة وثائقك القانونية بدقة وشفافية كاملة - ارفع ملفاتك أو أدخل عدد الكلمات يدوياً
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-6xl mx-auto bg-background border-0 shadow-strong overflow-hidden">
              {/* رأس البطاقة */}
              <div className="bg-gradient-primary text-primary-foreground p-6">
                <div className="flex items-center justify-center gap-4">
                  <motion.div 
                    className="bg-white/20 p-3 rounded-2xl backdrop-blur-md"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Calculator className="h-6 w-6" />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="text-xl font-arabic-title font-bold">
                      حاسبة التكلفة الذكية مع رفع الملفات
                    </h3>
                    <p className="text-primary-foreground/80 mt-1 text-sm">
                      احسب تكلفة مشروع الترجمة بدقة عالية
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* رفع الملفات */}
                  <div className="xl:col-span-2 space-y-6">
                     <div>
                       <Label className="text-lg font-bold text-foreground mb-4 block">رفع الملفات للتحليل الذكي</Label>
                       <FileUploader
                         onFilesSelected={setSelectedFiles}
                         onProcessingChange={setIsAnalyzing}
                         maxFiles={5}
                         acceptedTypes={['.doc', '.docx', '.pdf', '.txt']}
                       />
                       
                        <AdvancedFileAnalyzer
                          files={selectedFiles}
                          onAnalysisComplete={setFileAnalyses}
                          isProcessing={isAnalyzing}
                        />
                     </div>
                    
                    {/* أو إدخال يدوي */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-muted-foreground/20"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-background text-muted-foreground font-medium">أو أدخل الكلمات يدوياً</span>
                      </div>
                    </div>
                    
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold">
              هل أنت مستعد للبدء؟
            </h2>
            
            <p className="text-xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto">
              تواصل معنا الآن واحصل على ترجمة قانونية احترافية تضمن حقوقك وتحمي مصالحك
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-strong px-8 py-4 text-lg font-bold"
                >
                  <Phone className="h-5 w-5 ml-2" />
                  تواصل معنا الآن
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg font-bold"
                >
                  <Mail className="h-5 w-5 ml-2" />
                  أرسل استفسارك
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalTranslation;