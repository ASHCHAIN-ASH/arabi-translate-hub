import React from 'react';
import Header from "@/components/Header";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  FileText,
  Globe,
  Video,
  Headphones,
  Clock,
  Languages,
  Scale,
  Stethoscope,
  Monitor,
  GraduationCap,
  ArrowLeft,
  Star,
  Award,
  Shield,
  Zap,
  CheckCircle,
  TrendingUp,
  Users,
  MessageCircle,
  Play,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import unique service images
import documentTranslationImg from "@/assets/document-translation-service.jpg";
import textTranslationImg from "@/assets/text-translation-service.jpg";
import audioTranslationImg from "@/assets/audio-translation-service.jpg";
import videoTranslationImg from "@/assets/video-translation-service.jpg";
import websiteTranslationImg from "@/assets/real-website-translation.jpg";
import legalTranslationImg from "@/assets/legal-translation-service.jpg";
import medicalTranslationImg from "@/assets/medical-translation-service.jpg";
import technicalTranslationImg from "@/assets/technical-translation-service.jpg";
import academicTranslationImg from "@/assets/academic-translation-service.jpg";

import Footer from '@/components/Footer';
// Translation services data
const translationServices = [
  {
    id: 'document-translation',
    title: 'ترجمة المستندات',
    description: 'ترجمة احترافية لجميع أنواع المستندات الرسمية والتجارية',
    icon: FileText,
    image: documentTranslationImg,
    route: '/services/document-translation',
    features: ['ترجمة معتمدة', 'مراجعة لغوية', 'تسليم سريع', 'خصوصية مضمونة'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'text-translation',
    title: 'ترجمة النصوص',
    description: 'ترجمة نصوص عامة ومتخصصة بدقة عالية',
    icon: Languages,
    image: textTranslationImg,
    route: '/services/text-translation',
    features: ['ترجمة فورية', 'أكثر من 100 لغة', 'مترجمون محترفون', 'أسعار تنافسية'],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'website-translation',
    title: 'ترجمة المواقع الإلكترونية',
    description: 'حلول ترجمة شاملة للمواقع الإلكترونية والمحتوى الرقمي',
    icon: Globe,
    image: websiteTranslationImg,
    route: '/services/website-translation',
    features: ['ترجمة CMS', 'تحسين SEO', 'اختبار الجودة', 'دعم تقني'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'video-translation',
    title: 'ترجمة الفيديوهات',
    description: 'ترجمة وتعليق صوتي للفيديوهات والمحتوى المرئي',
    icon: Video,
    image: videoTranslationImg,
    route: '/services/video-translation',
    features: ['ترجمة الترقيم', 'تعليق صوتي', 'تزامن مثالي', 'جودة عالية'],
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'audio-translation',
    title: 'الترجمة الصوتية',
    description: 'ترجمة المحتوى الصوتي والبودكاست والمقابلات',
    icon: Headphones,
    image: audioTranslationImg,
    route: '/services/audio-translation',
    features: ['تفريغ صوتي', 'ترجمة دقيقة', 'تسليم سريع', 'أسعار مناسبة'],
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'legal-translation',
    title: 'الترجمة القانونية',
    description: 'ترجمة متخصصة للوثائق القانونية والعقود',
    icon: Scale,
    image: legalTranslationImg,
    route: '/legal-translation',
    features: ['مترجمون قانونيون', 'سرية تامة', 'دقة قانونية', 'ترجمة معتمدة'],
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'medical-translation',
    title: 'الترجمة الطبية',
    description: 'ترجمة التقارير الطبية والأبحاث العلمية',
    icon: Stethoscope,
    image: medicalTranslationImg,
    route: '/medical-translation',
    features: ['مصطلحات طبية دقيقة', 'مترجمون متخصصون', 'مراجعة علمية', 'معايير دولية'],
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'technical-translation',
    title: 'الترجمة التقنية',
    description: 'ترجمة المحتوى التقني والدليل الفني',
    icon: Monitor,
    image: technicalTranslationImg,
    route: '/technical-translation',
    features: ['مصطلحات تقنية', 'خبرة تكنولوجية', 'دقة تقنية', 'تحديث مستمر'],
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'academic-translation',
    title: 'الترجمة الأكاديمية',
    description: 'ترجمة الأبحاث الأكاديمية والرسائل العلمية',
    icon: GraduationCap,
    image: academicTranslationImg,
    route: '/academic-translation',
    features: ['مراجع أكاديمية', 'منهجية علمية', 'خبراء أكاديميون', 'نشر علمي'],
    color: 'from-pink-500 to-pink-600'
  }
];

export default function TranslationServices() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/10" />
          
          {/* Animated Shapes */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
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
        </div>

        {/* Content */}
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full mb-8 border border-primary/20 backdrop-blur-sm"
            >
              <Award className="w-6 h-6 text-primary" />
              <span className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                خدمات ترجمة معتمدة عالمياً
              </span>
              <Shield className="w-6 h-6 text-green-500" />
            </motion.div>
            
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="block bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent"
              >
                خدمات الترجمة
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mt-2"
              >
                الشاملة
              </motion.span>
            </h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed"
            >
              نقدّم حلول ترجمة متخصصة تلبي احتياجات مختلف القطاعات
              <br />
              <span className="text-lg text-primary font-semibold">مع الالتزام بالدقة اللغوية، وسلامة المعنى، وأعلى معايير الجودة المهنية.</span>
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
            >
              {[
                { number: "1000+", label: "مشروع منجز", icon: TrendingUp },
                { number: "80+", label: "لغة مدعومة", icon: Languages },
                { number: "24/7", label: "دعم فني", icon: MessageCircle },
                { number: "99.9%", label: "رضا العملاء", icon: Star }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
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
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 font-semibold"
                onClick={() => navigate('/order-now')}
              >
                <Zap className="w-6 h-6 ml-3" />
                احصل على عرض سعر
              </Button>
              
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
        </div>
      </section>

      {/* Services Grid */}
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
              <span className="text-lg font-semibold text-primary">خدماتنا المتخصصة</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              اختر نوع الترجمة المناسب لك
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نوفر مجموعة شاملة من خدمات الترجمة المتخصصة لتلبية جميع احتياجاتك
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {translationServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group h-full"
              >
                <Card className="overflow-hidden bg-card/80 backdrop-blur-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 h-full relative">
                  {/* Premium Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                  
                  <div className="relative bg-card rounded-2xl h-full">
                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden rounded-t-2xl">
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      
                      {/* Icon Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color} text-white shadow-lg`}>
                          <service.icon className="w-6 h-6" />
                        </div>
                      </div>
                      
                      {/* Quality Stars */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <CardHeader className="p-0">
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="p-0 space-y-4">
                        {/* Features */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground text-sm">المميزات الرئيسية:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {service.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* CTA Button */}
                        <Button 
                          className={`w-full bg-gradient-to-r ${service.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 py-3 text-sm font-medium rounded-xl`}
                          onClick={() => navigate(service.route)}
                        >
                          <ArrowLeft className="h-4 w-4 ml-2" />
                          اطلب الخدمة
                        </Button>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Why Choose Us Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-24 text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              لماذا تختارنا؟
            </h3>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Award,
                  title: "جودة معتمدة",
                  desc: "شهادات جودة دولية معتمدة"
                },
                {
                  icon: Clock,
                  title: "تسليم سريع",
                  desc: "التزام بالمواعيد المحددة"
                },
                {
                  icon: Users,
                  title: "فريق محترف",
                  desc: "مترجمون معتمدون ومتخصصون"
                },
                {
                  icon: Shield,
                  title: "سرية تامة",
                  desc: "حماية كاملة لبياناتك"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30"
                >
                  <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      
          <Footer />
    </div>
  );
}