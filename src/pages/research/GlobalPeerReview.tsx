import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Globe, 
  Award, 
  CheckCircle, 
  Star,
  Clock,
  Shield,
  BookOpen,
  Target,
  TrendingUp
} from "lucide-react";
import Header from "@/components/Header";

const GlobalPeerReview = () => {
  const services = [
    {
      title: "مراجعة الأقران الدولية",
      description: "مراجعة شاملة من خبراء عالميين في مجال تخصصك",
      icon: Users,
      features: ["خبراء من جامعات عالمية", "مراجعة تفصيلية", "تقرير شامل", "توصيات للتحسين"]
    },
    {
      title: "التقييم الأكاديمي المتقدم",
      description: "تقييم عميق لجودة البحث ومنهجيته العلمية",
      icon: Target,
      features: ["تقييم المنهجية", "فحص النتائج", "مراجعة المراجع", "تقييم الأصالة"]
    },
    {
      title: "مراجعة ما قبل النشر",
      description: "تحضير بحثك للنشر في المجلات العلمية المحكمة",
      icon: BookOpen,
      features: ["فحص الجودة", "مراجعة التنسيق", "التحقق من المعايير", "تحسين فرص القبول"]
    },
    {
      title: "الاستشارات البحثية",
      description: "استشارات متخصصة لتطوير وتحسين البحث العلمي",
      icon: TrendingUp,
      features: ["توجيه الباحثين", "تطوير الأفكار", "استراتيجية النشر", "متابعة مستمرة"]
    }
  ];

  const benefits = [
    {
      title: "خبراء عالميون",
      description: "فريق من المراجعين من أفضل الجامعات العالمية",
      icon: Globe
    },
    {
      title: "جودة مضمونة",
      description: "معايير عالية للمراجعة وفقاً للمعايير الدولية",
      icon: Award
    },
    {
      title: "سرعة في التنفيذ",
      description: "إنجاز المراجعة في أسرع وقت ممكن",
      icon: Clock
    },
    {
      title: "سرية تامة",
      description: "حماية كاملة لأبحاثكم وحقوق الملكية الفكرية",
      icon: Shield
    }
  ];

  const process = [
    {
      step: "1",
      title: "تقديم البحث",
      description: "إرسال البحث مع تحديد التخصص والمجال"
    },
    {
      step: "2", 
      title: "اختيار المراجعين",
      description: "تعيين خبراء متخصصين في مجال البحث"
    },
    {
      step: "3",
      title: "عملية المراجعة",
      description: "مراجعة شاملة وتقييم دقيق للبحث"
    },
    {
      step: "4",
      title: "التقرير النهائي",
      description: "استلام تقرير مفصل مع التوصيات"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Users className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic-title">
              المراجعة التعاونية العالمية
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              خدمة مراجعة الأقران من خبراء عالميين لضمان أعلى معايير الجودة العلمية
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <Globe className="w-5 h-5 ml-2" />
                خبراء من 50+ دولة
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <Award className="w-5 h-5 ml-2" />
                مراجعة محكمة
              </Badge>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                <CheckCircle className="w-5 h-5 ml-2" />
                جودة مضمونة
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 font-arabic-title">
              خدمات المراجعة التعاونية
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من خدمات المراجعة العلمية بمشاركة خبراء عالميين
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-800">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="text-slate-600">
                          {service.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 font-arabic-title">
              مميزات خدمتنا
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              نضمن لك أفضل تجربة في المراجعة العلمية مع الحفاظ على أعلى معايير الجودة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 font-arabic-title">
              كيف تعمل الخدمة؟
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              عملية بسيطة ومنظمة لضمان أفضل النتائج
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-arabic-title">
              ابدأ مراجعة بحثك اليوم
            </h2>
            <p className="text-xl mb-8 opacity-90">
              احصل على مراجعة شاملة من خبراء عالميين وحسّن من جودة بحثك العلمي
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 px-8 py-3 text-lg font-semibold"
              >
                <Users className="w-5 h-5 ml-2" />
                طلب المراجعة الآن
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
              >
                تواصل معنا
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default GlobalPeerReview;