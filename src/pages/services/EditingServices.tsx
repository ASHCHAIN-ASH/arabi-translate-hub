import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Edit3, FileCheck, BookOpen, Languages, FileEdit, CheckCheck,
  Users, Clock, Award, Zap, ArrowLeft, Sparkles
} from 'lucide-react';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

const EditingServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Languages className="w-8 h-8" />,
      title: "التدقيق اللغوي",
      description: "تدقيق شامل للإملاء والنحو والصرف مع تصحيح الأخطاء اللغوية",
      path: "/services/editing/language-proofreading",
      gradient: "from-blue-500 to-cyan-500",
      features: ["تصحيح إملائي", "مراجعة نحوية", "تدقيق الصرف", "ضبط علامات الترقيم"]
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "المراجعة الأكاديمية",
      description: "مراجعة علمية متخصصة للأبحاث والرسائل الأكاديمية",
      path: "/services/editing/academic-review",
      gradient: "from-purple-500 to-pink-500",
      features: ["مراجعة منهجية", "تحسين البنية", "ضبط المراجع", "تقييم علمي"]
    },
    {
      icon: <Edit3 className="w-8 h-8" />,
      title: "التحرير التنموي",
      description: "تحرير شامل لتحسين المحتوى والبنية والأسلوب العام",
      path: "/services/editing/developmental-editing",
      gradient: "from-green-500 to-emerald-500",
      features: ["تحسين البنية", "تطوير الأفكار", "تعزيز الأسلوب", "إعادة هيكلة"]
    },
    {
      icon: <FileEdit className="w-8 h-8" />,
      title: "التحرير التقني",
      description: "تحرير متخصص للمحتوى التقني والوثائق الفنية",
      path: "/services/editing/technical-editing",
      gradient: "from-orange-500 to-red-500",
      features: ["دقة تقنية", "توحيد المصطلحات", "مراجعة البيانات", "تنسيق فني"]
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "مراجعة الأسلوب",
      description: "تحسين الأسلوب الكتابي والتدفق اللغوي للنص",
      path: "/services/editing/style-review",
      gradient: "from-indigo-500 to-purple-500",
      features: ["تحسين التدفق", "توحيد الأسلوب", "تعزيز الوضوح", "صقل اللغة"]
    },
    {
      icon: <CheckCheck className="w-8 h-8" />,
      title: "التدقيق النهائي",
      description: "مراجعة نهائية شاملة قبل النشر أو التسليم",
      path: "/services/editing/final-proofreading",
      gradient: "from-teal-500 to-cyan-500",
      features: ["فحص شامل", "مراجعة نهائية", "ضمان الجودة", "جاهز للنشر"]
    }
  ];

  const features = [
    { 
      icon: <Users className="w-6 h-6" />, 
      title: "محررون معتمدون", 
      description: "فريق من المحررين المحترفين مع خبرة 10+ سنوات" 
    },
    { 
      icon: <Clock className="w-6 h-6" />, 
      title: "تسليم سريع", 
      description: "إنجاز دقيق في المواعيد المحددة مع خيارات عاجلة" 
    },
    { 
      icon: <Award className="w-6 h-6" />, 
      title: "جودة مضمونة", 
      description: "معايير عالمية في التحرير مع ضمان رضا العملاء" 
    },
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: "أدوات متقدمة", 
      description: "استخدام أحدث برامج التدقيق والمراجعة اللغوية" 
    }
  ];

  const stats = [
    { number: "15000+", label: "نص تم مراجعته" },
    { number: "98%", label: "معدل رضا العملاء" },
    { number: "50+", label: "محرر محترف" },
    { number: "24/7", label: "دعم فني" }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 text-lg px-6 py-3" variant="secondary">
              <Sparkles className="w-5 h-5 ml-2" />
              خدمات التحرير والمراجعة الاحترافية
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-accent bg-clip-text text-transparent leading-tight">
              دقة لغوية لا تُضاهى
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              نقدم خدمات التحرير والمراجعة اللغوية بأعلى معايير الجودة العالمية لضمان تميز نصوصكم وأبحاثكم
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-10 py-6 shadow-lg hover:shadow-xl"
              >
                <Edit3 className="w-5 h-5 ml-2" />
                استكشف الخدمات
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-6"
                onClick={() => navigate('/pricing')}
              >
                عرض الأسعار
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              خدمات التحرير والمراجعة المتخصصة
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              نوفر مجموعة شاملة من خدمات التحرير اللغوي والمراجعة الأكاديمية لجميع أنواع النصوص والمحتوى
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card 
                  className="h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl cursor-pointer group"
                  onClick={() => navigate(service.path)}
                >
                  <CardHeader>
                    <div className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {service.icon}
                    </div>
                    <CardTitle className="text-2xl text-center mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-center text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <div className={`w-2 h-2 bg-gradient-to-r ${service.gradient} rounded-full ml-3`}></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full group-hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(service.path);
                      }}
                    >
                      اطلب الخدمة
                      <ArrowLeft className="w-4 h-4 mr-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-muted/30 to-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">لماذا نحن الأفضل؟</h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              ما يميز خدمات التحرير والمراجعة لدينا عن الآخرين
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-accent/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-32 h-32 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-20 w-40 h-40 bg-accent/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              جاهز لتحسين نصوصك؟
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              دع خبراءنا المعتمدين يقومون بمراجعة وتحرير نصوصكم لضمان أعلى مستوى من الجودة والاحترافية
            </p>
            <Button 
              size="lg" 
              className="text-lg px-12 py-6 shadow-xl hover:shadow-2xl"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              ابدأ الآن مع خدماتنا
              <Sparkles className="w-5 h-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EditingServices;
