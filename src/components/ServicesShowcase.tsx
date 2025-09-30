import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Languages, BookOpen, Users, FileText, Microscope,
  GraduationCap, Shield, Clock, Award, Star, CheckCircle,
  ArrowRight, Sparkles, Target, Brain, TrendingUp
} from "lucide-react";
import { UNIFIED_STATS, STATS_LABELS } from "@/constants/academicStats";

const ServicesShowcase = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      id: 1,
      title: "خدمات الترجمة الأكاديمية",
      description: "ترجمة احترافية للأبحاث والرسائل العلمية بدقة عالية وحفاظ على المصطلحات الأكاديمية",
      icon: Languages,
      color: "from-blue-600 to-indigo-600",
      route: "/services/translation-services"
    },
    {
      id: 2,
      title: "الكتابة الأكاديمية المتخصصة",
      description: "كتابة الأبحاث والرسائل والمقالات العلمية وفق المعايير الأكاديمية العالمية",
      icon: BookOpen,
      color: "from-emerald-600 to-teal-600",
      route: "/services/academic-writing"
    },
    {
      id: 3,
      title: "الاستشارات الأكاديمية",
      description: "استشارات متخصصة لطلاب الدراسات العليا والباحثين في جميع المجالات",
      icon: GraduationCap,
      color: "from-purple-600 to-pink-600",
      route: "/services/consultation-services"
    },
    {
      id: 4,
      title: "التحليل الإحصائي المتقدم",
      description: "تحليل البيانات الإحصائية وإعداد التقارير العلمية باستخدام أحدث البرامج",
      icon: Microscope,
      color: "from-amber-600 to-orange-600",
      route: "/services/statistical-analysis"
    },
    {
      id: 5,
      title: "خدمات النشر العلمي",
      description: "مساعدة شاملة في نشر الأبحاث في المجلات العلمية المحكمة المرموقة",
      icon: FileText,
      color: "from-rose-600 to-red-600",
      route: "/services/publishing-services"
    },
    {
      id: 6,
      title: "التدريب والتطوير",
      description: "برامج تدريبية متخصصة لتطوير المهارات البحثية والأكاديمية",
      icon: Users,
      color: "from-cyan-600 to-blue-600",
      route: "/services/consultation-services"
    }
  ];

  const features = [
    { icon: Shield, text: "أمان وسرية تامة", color: "text-blue-600" },
    { icon: Clock, text: "التزام بالمواعيد", color: "text-emerald-600" },
    { icon: Award, text: "جودة مضمونة", color: "text-amber-600" },
    { icon: Star, text: "خدمة متميزة", color: "text-purple-600" }
  ];

  // إحصائيات موحدة - نفس الأرقام في جميع أقسام الموقع
  const stats = [
    { number: `+${UNIFIED_STATS.researchCompleted.toLocaleString()}` , label: STATS_LABELS.researchCompleted, icon: CheckCircle },
    { number: `+${UNIFIED_STATS.expertsCount.toLocaleString()}` , label: STATS_LABELS.expertsCount, icon: Brain },
    { number: `+${UNIFIED_STATS.specializationsCount.toLocaleString()}` , label: STATS_LABELS.specializationsCount, icon: Target },
    { number: `${UNIFIED_STATS.satisfactionRate}%` , label: STATS_LABELS.satisfactionRate, icon: TrendingUp }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
      
      {/* خلفية أكاديمية متطورة */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* شبكة نقاط */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* العنوان */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-200 dark:border-blue-700 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-4 w-4" />
            خدمات أكاديمية متكاملة
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-800 dark:text-white">
            نقدم لكم أفضل{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              الخدمات الأكاديمية
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            مجموعة شاملة من الخدمات المتخصصة لدعم رحلتك الأكاديمية والبحثية بجودة عالمية
          </p>

          {/* المزايا السريعة */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <IconComponent className={`h-4 w-4 ${feature.color}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* شبكة الخدمات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white dark:bg-slate-800 overflow-hidden cursor-pointer"
                  onClick={() => navigate(service.route)}
                >
                  {/* خط علوي متدرج */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.color}`} />
                  
                  {/* خلفية تفاعلية */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <CardContent className="p-8 relative">
                    {/* الأيقونة */}
                    <motion.div 
                      className={`w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        scale: 1.1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="h-10 w-10 text-white" />
                    </motion.div>
                    
                    {/* المحتوى */}
                    <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* زر المزيد */}
                    <Button
                      variant="ghost"
                      className="group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-all p-0 h-auto"
                    >
                      <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                        اعرف المزيد
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>

                    {/* علامة التحقق */}
                    <motion.div 
                      className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* الإحصائيات */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* خلفية متحركة */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, -30, 0] }}
              transition={{ duration: 12, repeat: Infinity, delay: 1 }}
            />
          </div>

          <div className="relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                إنجازاتنا بالأرقام
              </h3>
              <p className="text-lg text-white/90">
                أرقام تعكس التزامنا بالتميز الأكاديمي
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div 
                    key={index}
                    className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.05 }}
                  >
                    <motion.div 
                      className="flex justify-center mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="h-10 w-10 text-white" />
                    </motion.div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-white/80 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
