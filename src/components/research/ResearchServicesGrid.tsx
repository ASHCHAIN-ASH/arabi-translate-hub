import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, FileText, BarChart3, CheckCircle, Layout, 
  GraduationCap, Clock, Star, ArrowRight 
} from 'lucide-react';

const services = [
  {
    id: "thesis-titles",
    title: "اقتراح عناوين رسائل ماجستير ودكتوراه",
    description: "ابتكار عناوين مميزة وقابلة للتطبيق مع خطة بحثية مبدئية شاملة",
    icon: <GraduationCap className="h-8 w-8" />,
    gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    href: "/research/thesis-titles",
    stats: "2000+ عنوان مقترح",
    features: ["عناوين مبتكرة", "خطة أولية", "مراجعة متخصصة", "توجيه أكاديمي"],
    duration: "3-5 أيام"
  },
  {
    id: "research-plan",
    title: "المساعدة في كتابة خطة البحث",
    description: "إعداد خطط بحثية متكاملة تشمل المنهجية العلمية وتصميم البحث",
    icon: <FileText className="h-8 w-8" />,
    gradient: "bg-gradient-to-br from-orange-500 to-red-500",
    href: "/research/research-plan",
    stats: "1500+ خطة بحثية",
    features: ["منهجية علمية", "تصميم متكامل", "مراجعة أكاديمية", "ضمان الجودة"],
    duration: "7-10 أيام"
  },
  {
    id: "theoretical-framework",
    title: "كتابة الإطار النظري والأدبيات",
    description: "بناء إطار نظري قوي ومتماسك يربط النظريات بمشكلة البحث",
    icon: <BookOpen className="h-8 w-8" />,
    gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    href: "/research/theoretical-framework",
    stats: "800+ إطار نظري",
    features: ["مراجعة أدبية", "ربط نظري", "تحليل شامل", "مصادر حديثة"],
    duration: "10-14 يوم"
  },
  {
    id: "statistical-analysis",
    title: "التحليل الإحصائي ومناقشة النتائج",
    description: "تحليل إحصائي متقدم للبيانات باستخدام أحدث البرامج الإحصائية",
    icon: <BarChart3 className="h-8 w-8" />,
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
    href: "/research/statistical-analysis",
    stats: "1200+ تحليل إحصائي",
    features: ["SPSS & R", "تحليل متقدم", "مناقشة علمية", "رسوم بيانية"],
    duration: "5-8 أيام"
  },
  {
    id: "language-review",
    title: "التدقيق اللغوي والمراجعة الأكاديمية",
    description: "مراجعة لغوية شاملة على يد خبراء متخصصين",
    icon: <CheckCircle className="h-8 w-8" />,
    gradient: "bg-gradient-to-br from-teal-500 to-cyan-600",
    href: "/research/language-review",
    stats: "3000+ مراجعة لغوية",
    features: ["تدقيق شامل", "تحسين أسلوبي", "مراجعة نهائية", "ضمان الجودة"],
    duration: "3-5 أيام"
  },
  {
    id: "formatting",
    title: "تنسيق الرسائل العلمية الاحترافي",
    description: "تنسيق احترافي متكامل للرسائل العلمية وفقاً للمعايير الدولية",
    icon: <Layout className="h-8 w-8" />,
    gradient: "bg-gradient-to-br from-rose-500 to-pink-600",
    href: "/research/formatting",
    stats: "2500+ رسالة منسقة",
    features: ["معايير دولية", "تصميم أنيق", "تنسيق شامل", "جاهز للطباعة"],
    duration: "2-4 أيام"
  }
];

export const ResearchServicesGrid = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4 px-4 sm:px-6 py-1.5 sm:py-2 text-base sm:text-lg">
            🎯 خدماتنا المتخصصة
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent px-4 drop-shadow-lg">
            ✨ رحلة النجاح الأكاديمي تبدأ من هنا ✨
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            مجموعة شاملة من الخدمات البحثية المصممة خصيصاً لضمان تفوقكم الأكاديمي وتحقيق أهدافكم العلمية
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
                {/* Header with Gradient */}
                <div className={`${service.gradient} p-4 sm:p-5 md:p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="p-2 sm:p-3 bg-white/20 rounded-lg backdrop-blur-sm"
                      >
                        {service.icon}
                      </motion.div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {service.duration}
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl font-bold leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                  {/* Statistics */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{service.stats}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">المميزات الرئيسية:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                          <span className="line-clamp-1">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-300 group"
                      onClick={() => window.location.href = service.href}
                    >
                      <span>اطلب الخدمة الآن</span>
                      <ArrowRight className="h-4 w-4 mr-2 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};