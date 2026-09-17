import { motion } from "framer-motion";
import { Target, BookOpen, FileEdit, BarChart3, BookMarked, CheckCircle2, Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const journeySteps = [
  {
    id: 1,
    icon: Target,
    title: "اختيار موضوع البحث",
    titleEn: "Topic Selection",
    description: "تحديد موضوع بحثي دقيق ومبتكر يتماشى مع اهتماماتك الأكاديمية وأهداف دراستك.",
    color: "from-primary to-primary-dark",
    emoji: "🎯"
  },
  {
    id: 2,
    icon: BookOpen,
    title: "مراجعة الأدبيات",
    titleEn: "Literature Review",
    description: "استعراض شامل للدراسات والأبحاث السابقة لبناء إطار نظري قوي ومحكم.",
    color: "from-secondary to-primary",
    emoji: "📚"
  },
  {
    id: 3,
    icon: FileEdit,
    title: "كتابة المقترح البحثي",
    titleEn: "Research Proposal",
    description: "إعداد مقترح بحثي متكامل يشمل المشكلة، الأهداف، المنهجية، والخطة الزمنية.",
    color: "from-accent to-secondary",
    emoji: "📝"
  },
  {
    id: 4,
    icon: BarChart3,
    title: "جمع البيانات والتحليل",
    titleEn: "Data Collection & Analysis",
    description: "جمع البيانات الميدانية أو المكتبية وتحليلها باستخدام الأدوات الإحصائية المناسبة.",
    color: "from-primary-light to-accent",
    emoji: "📊"
  },
  {
    id: 5,
    icon: BookMarked,
    title: "كتابة البحث النهائي",
    titleEn: "Final Writing",
    description: "صياغة البحث بشكل أكاديمي محكم يتضمن جميع الفصول والمراجع حسب المعايير العالمية.",
    color: "from-secondary-light to-primary",
    emoji: "📖"
  },
  {
    id: 6,
    icon: CheckCircle2,
    title: "التدقيق اللغوي والمراجعة",
    titleEn: "Proofreading & Review",
    description: "مراجعة شاملة للبحث لغويًا وأكاديميًا لضمان جودة عالية وخلو من الأخطاء.",
    color: "from-accent-light to-secondary-light",
    emoji: "✅"
  },
  {
    id: 7,
    icon: Globe,
    title: "النشر في المجلات الدولية",
    titleEn: "International Publishing",
    description: "اختيار المجلة المناسبة وتقديم البحث للنشر في قواعد بيانات عالمية معتمدة.",
    color: "from-primary to-accent",
    emoji: "🌍"
  }
];

const ResearchJourney = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <>
      <SEO
        title="رحلة الباحث | FekrahEdu"
        description="استكشف خطوات رحلة الباحث الأكاديمي من اختيار الموضوع حتى النشر الدولي مع خدمات FekrahEdu"
        keywords="رحلة الباحث، خطوات البحث الأكاديمي، منهجية البحث، النشر الدولي، خدمات بحثية"
      />
      
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        
        <Breadcrumb
          items={[
            { label: "خدماتنا", href: "/services" },
            { label: "رحلة الباحث" }
          ]}
        />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDEyYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2em0wIDEyYzMuMzE0IDAgNi0yLjY4NiA2LTZzLTIuNjg2LTYtNi02LTYgMi42ODYtNiA2IDIuNjg2IDYgNiA2ek0xMiAxOGMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMCAxMmMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnptMCAxMmMzLjMxNCAwIDYtMi42ODYgNi02cy0yLjY4Ni02LTYtNi02IDIuNjg2LTYgNiAyLjY4NiA2IDYgNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                رحلة الباحث
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-2 font-light">
                Research Journey Map
              </p>
              <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mt-6">
                خارطة طريق شاملة ترافقك من بداية رحلتك البحثية حتى نشر بحثك عالميًا
              </p>
            </motion.div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              {/* Timeline Line - Desktop */}
              <div className="hidden lg:block absolute right-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent transform translate-x-1/2"></div>

              {journeySteps.map((step, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={step.id}
                    variants={itemVariants}
                    className={`relative mb-12 lg:mb-20 ${
                      isEven ? 'lg:pr-[52%]' : 'lg:pl-[52%]'
                    }`}
                  >
                    {/* Timeline Node - Desktop */}
                    <div className="hidden lg:block absolute right-1/2 top-8 w-12 h-12 transform translate-x-1/2">
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg border-4 border-background`}>
                        <span className="text-2xl">{step.emoji}</span>
                      </div>
                    </div>

                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex items-start gap-4">
                          {/* Mobile Icon */}
                          <div className={`lg:hidden flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
                            <step.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                          </div>

                          <div className="flex-1">
                            {/* Step Number */}
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${step.color} text-white font-bold text-lg mb-3 shadow-md`}>
                              {step.id}
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                              {step.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 font-light">
                              {step.titleEn}
                            </p>

                            {/* Description */}
                            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                              {step.description}
                            </p>
                          </div>

                          {/* Desktop Icon */}
                          <div className={`hidden lg:flex flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} items-center justify-center shadow-lg`}>
                            <step.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                      كيف يمكننا مساعدتك في رحلتك البحثية؟
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                      نوفر لك الدعم في كل مرحلة من مراحل رحلتك البحثية، من اختيار الموضوع حتى النشر العالمي. فريقنا من الخبراء الأكاديميين جاهز لمساعدتك في تحقيق أهدافك البحثية.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Button 
                        asChild
                        size="lg"
                        className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Link to="/order-now">
                          اطلب الخدمة الآن
                        </Link>
                      </Button>
                      
                      <Button 
                        asChild
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 py-6 border-2 hover:border-primary transition-all duration-300"
                      >
                        <Link to="/contact-us">
                          تحدث مع مستشار
                        </Link>
                      </Button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-4">
                        استكشف خدماتنا البحثية الشاملة
                      </p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        <Link to="/research/academic-writing-service" className="text-sm text-primary hover:text-primary-dark transition-colors underline">
                          الكتابة الأكاديمية
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link to="/research/statistical-spss-service" className="text-sm text-primary hover:text-primary-dark transition-colors underline">
                          التحليل الإحصائي
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link to="/research/proofreading-service" className="text-sm text-primary hover:text-primary-dark transition-colors underline">
                          التدقيق اللغوي
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link to="/research/journal-publication" className="text-sm text-primary hover:text-primary-dark transition-colors underline">
                          النشر الدولي
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ResearchJourney;
