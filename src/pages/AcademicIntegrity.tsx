import { motion } from "framer-motion";
import { 
  Shield, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  TrendingUp,
  Scale,
  Heart,
  FileCheck,
  GraduationCap,
  Building2,
  Globe,
  Target,
  Sparkles
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AcademicIntegrity = () => {
  const navigate = useNavigate();

  const principles = [
    {
      icon: Shield,
      title: "الأمانة العلمية",
      description: "نلتزم بأعلى معايير الأمانة العلمية في جميع أعمالنا البحثية والأكاديمية، مع ضمان عدم الانتحال أو التزوير",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Scale,
      title: "العدالة والنزاهة",
      description: "نحرص على تطبيق مبادئ العدالة والنزاهة في التعامل مع جميع العملاء والباحثين دون تمييز",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Award,
      title: "الجودة والتميز",
      description: "نسعى دائماً لتقديم أعلى مستويات الجودة والتميز في جميع خدماتنا الأكاديمية والبحثية",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Heart,
      title: "المسؤولية الأخلاقية",
      description: "نتحمل مسؤوليتنا الأخلاقية تجاه المجتمع الأكاديمي ونلتزم بالمعايير الأخلاقية العالمية",
      color: "from-red-500 to-red-600"
    },
    {
      icon: FileCheck,
      title: "التوثيق الدقيق",
      description: "نضمن توثيق جميع المصادر والمراجع بدقة وفقاً للمعايير الأكاديمية المعترف بها عالمياً",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Users,
      title: "احترام الحقوق الفكرية",
      description: "نحترم حقوق الملكية الفكرية لجميع الباحثين والمؤلفين ونلتزم بقوانين حماية حقوق النشر",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const commitments = [
    {
      icon: CheckCircle2,
      title: "الالتزام بالأصالة",
      points: [
        "فحص شامل للانتحال باستخدام أحدث الأدوات",
        "ضمان أصالة المحتوى بنسبة 100%",
        "تقديم تقارير مفصلة عن الأصالة",
        "مراجعة دقيقة من قبل خبراء متخصصين"
      ]
    },
    {
      icon: BookOpen,
      title: "المعايير الأكاديمية",
      points: [
        "الالتزام بمعايير APA, MLA, Harvard وغيرها",
        "اتباع إرشادات الجامعات والمجلات العلمية",
        "تطبيق أفضل الممارسات الأكاديمية العالمية",
        "التحديث المستمر للمعايير والإجراءات"
      ]
    },
    {
      icon: TrendingUp,
      title: "التطوير المستمر",
      points: [
        "تدريب مستمر لفريق العمل على أحدث المعايير",
        "تحديث الأدوات والتقنيات بشكل دوري",
        "متابعة التطورات في المجال الأكاديمي",
        "تحسين الجودة والكفاءة باستمرار"
      ]
    }
  ];

  const globalStandards = [
    {
      organization: "UNESCO",
      logo: Globe,
      description: "نلتزم بمعايير منظمة اليونسكو للأخلاقيات الأكاديمية والبحث العلمي",
      color: "text-blue-500"
    },
    {
      organization: "Committee on Publication Ethics",
      logo: FileCheck,
      description: "نتبع إرشادات لجنة أخلاقيات النشر (COPE) في جميع عمليات النشر والبحث",
      color: "text-green-500"
    },
    {
      organization: "International Association of Universities",
      logo: Building2,
      description: "نطبق معايير الاتحاد الدولي للجامعات في التعليم العالي والبحث",
      color: "text-purple-500"
    },
    {
      organization: "World Association of Medical Editors",
      logo: GraduationCap,
      description: "نلتزم بمعايير الجمعية العالمية لمحرري المجلات الطبية (WAME)",
      color: "text-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              x: [0, -50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
              <span className="text-sm font-bold text-primary">التزامنا بالنزاهة</span>
            </motion.div>

            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              النزاهة الأكاديمية
            </motion.h1>

            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              نلتزم بأعلى معايير النزاهة الأكاديمية والأمانة العلمية في جميع خدماتنا، 
              مع التركيز على الجودة والأصالة واحترام الحقوق الفكرية وفقاً للمعايير العالمية
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-l from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl"
                onClick={() => navigate('/contact-us')}
              >
                <Target className="ml-2 h-5 w-5" />
                تواصل معنا
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg font-bold rounded-xl border-2"
                onClick={() => navigate('/about-us')}
              >
                <BookOpen className="ml-2 h-5 w-5" />
                تعرف علينا
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              مبادئنا الأساسية
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نؤمن بأهمية النزاهة الأكاديمية كركيزة أساسية لنجاح العمل البحثي والأكاديمي
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, index) => {
              const IconComponent = principle.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${principle.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                        <IconComponent className="h-7 w-7 text-white" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{principle.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {principle.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitments Section */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              التزاماتنا تجاهك
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نضع معايير صارمة لضمان أعلى مستويات النزاهة والجودة الأكاديمية
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {commitments.map((commitment, index) => {
              const IconComponent = commitment.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold">{commitment.title}</h3>
                      </div>
                      <ul className="space-y-3">
                        {commitment.points.map((point, idx) => (
                          <motion.li 
                            key={idx}
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            viewport={{ once: true }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{point}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Standards Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              المعايير العالمية التي نلتزم بها
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نحرص على تطبيق أفضل المعايير الأكاديمية العالمية في جميع أعمالنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {globalStandards.map((standard, index) => {
              const LogoIcon = standard.logo;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 border-2`}>
                          <LogoIcon className={`h-8 w-8 ${standard.color}`} strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{standard.organization}</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {standard.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Shield className="h-16 w-16 mx-auto mb-6 text-white/90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ابدأ رحلتك الأكاديمية معنا
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              انضم إلى آلاف الباحثين والطلاب الذين اختاروا النزاهة والجودة في أعمالهم الأكاديمية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-bold rounded-xl shadow-xl"
                onClick={() => navigate('/contact-us')}
              >
                تواصل معنا الآن
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold rounded-xl"
                onClick={() => navigate('/research-services')}
              >
                استكشف الخدمات
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AcademicIntegrity;
