import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Mic, 
  Globe, 
  Video, 
  Users, 
  BookOpen,
  ArrowRight,
  Star,
  CheckCircle,
  Clock,
  Shield,
  Award,
  Zap
} from "lucide-react";

const PremiumServicesSection = () => {
  const premiumServices = [
    {
      title: "ترجمة النصوص الاحترافية",
      description: "ترجمة فورية ودقيقة لجميع أنواع النصوص مع مراجعة من خبراء اللغة",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      features: ["ترجمة فورية", "دقة 99%", "100+ لغة", "مراجعة مزدوجة"],
      price: "من 15 ريال",
      popular: true,
      href: "/services/text-translation"
    },
    {
      title: "ترجمة المستندات الرسمية",
      description: "ترجمة معتمدة للوثائق الرسمية والقانونية مع الحفاظ على التنسيق",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500", 
      features: ["ترجمة معتمدة", "حفظ التنسيق", "سرية تامة", "تسليم سريع"],
      price: "من 25 ريال",
      popular: false,
      href: "/services/document-translation"
    },
    {
      title: "الترجمة الصوتية المتقدمة",
      description: "تحويل الكلام إلى نص وترجمته فورياً مع دعم جميع اللهجات العربية",
      icon: Mic,
      gradient: "from-green-500 to-emerald-500",
      features: ["تحويل صوتي", "دعم اللهجات", "ترجمة فورية", "جودة HD"],
      price: "من 20 ريال",
      popular: false,
      href: "/services/audio-translation"
    },
    {
      title: "ترجمة المواقع الإلكترونية",
      description: "ترجمة شاملة للمواقع مع تحسين محركات البحث وحفظ التصميم",
      icon: Globe,
      gradient: "from-orange-500 to-red-500",
      features: ["ترجمة شاملة", "SEO محسن", "حفظ التصميم", "دعم تقني"],
      price: "من 100 ريال",
      popular: false,
      href: "/services/website-translation"
    },
    {
      title: "ترجمة الفيديو والدبلجة",
      description: "إضافة ترجمة للفيديوهات مع خدمات الدبلجة بأصوات احترافية",
      icon: Video,
      gradient: "from-indigo-500 to-purple-500",
      features: ["ترجمة مرئية", "دبلجة احترافية", "توقيت دقيق", "جودة 4K"],
      price: "من 50 ريال",
      popular: false,
      href: "/services/video-translation"
    },
    {
      title: "خدمات الشركات المخصصة",
      description: "حلول ترجمة شاملة للشركات مع فريق مختص ودعم على مدار الساعة",
      icon: Users,
      gradient: "from-teal-500 to-blue-500",
      features: ["حلول مخصصة", "فريق مختص", "دعم 24/7", "أسعار مؤسسية"],
      price: "عروض خاصة",
      popular: false,
      href: "/services/custom-services"
    }
  ];

  const stats = [
    { icon: Users, number: "50,000+", label: "عميل راضي" },
    { icon: Globe, number: "100+", label: "لغة مدعومة" },
    { icon: Clock, number: "24/7", label: "دعم متواصل" },
    { icon: Award, number: "15+", label: "سنة خبرة" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-pink-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان الرئيسي */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-xl"
            >
              <Zap className="h-10 w-10 text-white" />
            </motion.div>
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-arabic-title font-bold text-foreground mb-6">
            خدماتنا <span className="text-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">المتميزة</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            اكتشف مجموعة شاملة من خدمات الترجمة الاحترافية المصممة لتلبية جميع احتياجاتكم بأعلى معايير الجودة
          </p>
        </motion.div>

        {/* إحصائيات سريعة */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-soft hover:shadow-strong transition-all duration-300 border border-white/20"
              >
                <motion.div
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: index * 0.5 
                  }}
                >
                  <IconComponent className="h-12 w-12 mx-auto mb-3 text-blue-600" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{stat.number}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* شبكة الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {premiumServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover-lift bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-soft hover:shadow-strong transition-all duration-300 overflow-hidden h-full relative">
                  {service.popular && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        الأكثر طلباً
                      </div>
                    </div>
                  )}
                  
                  {/* خلفية متدرجة */}
                  <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${service.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  <CardContent className="p-6 relative z-10">
                    {/* الأيقونة والسعر */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </motion.div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">السعر يبدأ من</p>
                        <p className="text-lg font-bold text-foreground">{service.price}</p>
                      </div>
                    </div>

                    {/* عنوان الخدمة */}
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* المميزات */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: featureIndex * 0.1 }}
                          className="flex items-center text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* زر الطلب */}
                    <Link to={service.href}>
                      <Button 
                        className={`w-full bg-gradient-to-r ${service.gradient} hover:shadow-lg group-hover:scale-105 transition-all duration-300 text-white border-0`}
                      >
                        <span>اطلب الخدمة الآن</span>
                        <ArrowRight className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ضمانات الخدمة */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-0 shadow-medium backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-6 mb-6">
                {[
                  { icon: Shield, text: "ضمان الجودة", color: "text-green-600" },
                  { icon: Clock, text: "تسليم سريع", color: "text-blue-600" },
                  { icon: Award, text: "خبرة 15 سنة", color: "text-purple-600" }
                ].map((guarantee, index) => {
                  const IconComponent = guarantee.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <IconComponent className={`h-8 w-8 ${guarantee.color}`} />
                      <span className="text-sm font-medium text-foreground">{guarantee.text}</span>
                    </motion.div>
                  );
                })}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-foreground">نضمن لك الأفضل دائماً</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                مع ضمان استرداد المال إذا لم تكن راضياً عن جودة الخدمة، ودعم فني متواصل على مدار الساعة
              </p>
              
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                احصل على استشارة مجانية
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumServicesSection;