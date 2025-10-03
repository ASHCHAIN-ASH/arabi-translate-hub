import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { 
  FileText, BookOpen, GraduationCap, ClipboardCheck, 
  CheckCircle, Shield, RefreshCw, BookMarked, 
  Presentation, FlaskConical, Library, ChevronLeft
} from "lucide-react";

const AcademicServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: FileText,
      title: "كتابة المقالات",
      description: "كتابة مقالات أكاديمية احترافية بأعلى معايير الجودة والدقة العلمية",
      color: "from-blue-500 to-blue-600",
      link: "/services/academic-writing-services"
    },
    {
      icon: BookOpen,
      title: "كتابة الأبحاث",
      description: "إعداد أبحاث علمية متكاملة بمنهجية صحيحة ومصادر موثوقة",
      color: "from-indigo-500 to-indigo-600",
      link: "/research-services"
    },
    {
      icon: GraduationCap,
      title: "الأطروحات",
      description: "مساعدة شاملة في كتابة رسائل الماجستير والدكتوراه",
      color: "from-purple-500 to-purple-600",
      link: "/research-services"
    },
    {
      icon: ClipboardCheck,
      title: "الواجبات",
      description: "حل الواجبات الدراسية والتكليفات الأكاديمية باحترافية",
      color: "from-pink-500 to-pink-600",
      link: "/order-now"
    },
    {
      icon: CheckCircle,
      title: "التدقيق والتحرير",
      description: "مراجعة لغوية ومنهجية دقيقة للأبحاث والرسائل العلمية",
      color: "from-emerald-500 to-emerald-600",
      link: "/services/editing-services"
    },
    {
      icon: Shield,
      title: "فاحص الانتحال",
      description: "فحص شامل للأبحاث للتأكد من الأصالة والالتزام بحقوق الملكية الفكرية",
      color: "from-red-500 to-red-600",
      link: "/research/plagiarism-check"
    },
    {
      icon: RefreshCw,
      title: "إعادة الصياغة",
      description: "إعادة صياغة النصوص الأكاديمية بلغة علمية احترافية",
      color: "from-cyan-500 to-cyan-600",
      link: "/services/editing-services"
    },
    {
      icon: BookMarked,
      title: "توليد المراجع",
      description: "إنشاء قائمة المراجع والاستشهادات وفقاً لأنماط التوثيق المختلفة",
      color: "from-amber-500 to-amber-600",
      link: "/research/references"
    },
    {
      icon: Presentation,
      title: "العروض التقديمية",
      description: "تصميم عروض تقديمية احترافية للأبحاث والمشاريع الأكاديمية",
      color: "from-violet-500 to-violet-600",
      link: "/research/powerpoint-service"
    },
    {
      icon: FlaskConical,
      title: "تقارير معملية",
      description: "إعداد تقارير معملية علمية دقيقة بتحليل شامل للنتائج",
      color: "from-teal-500 to-teal-600",
      link: "/research-services"
    },
    {
      icon: Library,
      title: "مراجعة الأدبيات",
      description: "مراجعة شاملة للأدبيات السابقة وتلخيص الدراسات ذات الصلة",
      color: "from-orange-500 to-orange-600",
      link: "/research/research-evaluation"
    },
    {
      icon: BookOpen,
      title: "الإطار النظري",
      description: "بناء إطار نظري متكامل للبحث العلمي مع الأسس النظرية القوية",
      color: "from-rose-500 to-rose-600",
      link: "/research/theoretical-framework"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SEO 
        title="خدماتنا الأكاديمية | MasterEduPath"
        description="مجموعة شاملة من الخدمات الأكاديمية المتخصصة: كتابة المقالات، الأبحاث، الأطروحات، التدقيق، فاحص الانتحال، والمزيد"
        keywords="خدمات أكاديمية, كتابة أبحاث, تدقيق لغوي, فاحص انتحال, عروض تقديمية, مراجعة أدبيات"
      />
      
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 right-[10%] w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 left-[10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-l from-blue-600/10 to-purple-600/10 rounded-full mb-6 border border-blue-200/50"
            >
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
                خدمات أكاديمية متكاملة
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-slate-800 dark:text-white">خدماتنا </span>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                الأكاديمية
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              نقدم مجموعة شاملة من الخدمات الأكاديمية المتخصصة لدعم رحلتك التعليمية والبحثية بأعلى معايير الجودة العالمية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="group h-full"
                >
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Card 
                      className="h-full flex flex-col cursor-pointer overflow-hidden border-2 border-border/50 hover:border-primary/50 bg-gradient-to-br from-card to-card/80 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl"
                      onClick={() => navigate(service.link)}
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        {/* Icon */}
                        <motion.div
                          className="mb-5"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                            <IconComponent className="h-8 w-8 text-white" strokeWidth={2} />
                          </div>
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors min-h-[3rem] flex items-center">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-grow">
                          {service.description}
                        </p>

                        {/* CTA */}
                        <motion.div
                          whileHover={{ x: -4 }}
                          transition={{ duration: 0.2 }}
                          className="inline-flex items-center gap-2 text-primary font-semibold text-sm mt-auto"
                        >
                          <span>تعرف أكثر</span>
                          <ChevronLeft className="h-4 w-4" />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AcademicServices;