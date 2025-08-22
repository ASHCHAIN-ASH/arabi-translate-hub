import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import TranslationStudio from "@/components/TranslationStudio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Users, 
  Globe, 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowLeft,
  PlayCircle,
  Award,
  Sparkles,
  Rocket
} from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-translation.jpg";

const Index = () => {
  const stats = [
    { icon: Users, number: "50,000+", label: "عميل راض" },
    { icon: Globe, number: "100+", label: "لغة مدعومة" },
    { icon: CheckCircle, number: "1M+", label: "كلمة مترجمة" },
    { icon: Award, number: "99%", label: "دقة الترجمة" }
  ];

  const features = [
    {
      icon: Zap,
      title: "ترجمة فورية",
      description: "احصل على ترجمة دقيقة في ثوان معدودة"
    },
    {
      icon: Shield,
      title: "أمان وخصوصية",
      description: "نضمن حماية بياناتك وسرية مستنداتك"
    },
    {
      icon: Clock,
      title: "متاح 24/7",
      description: "خدمة ترجمة متاحة طوال الوقت"
    },
    {
      icon: Star,
      title: "جودة احترافية",
      description: "ترجمة بجودة عالية ومراجعة من خبراء"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مدير شركة",
      rating: 5,
      text: "خدمة ممتازة وسريعة، ترجمة دقيقة وفي الوقت المحدد. أنصح بها بشدة.",
      avatar: "👨‍💼"
    },
    {
      name: "فاطمة علي",
      role: "محامية",
      rating: 5,
      text: "استخدمت الموقع لترجمة وثائق قانونية، النتيجة كانت احترافية جداً.",
      avatar: "👩‍💼"
    },
    {
      name: "محمد العتيبي",
      role: "أكاديمي",
      rating: 5,
      text: "أفضل منصة ترجمة استخدمتها، سهولة في الاستخدام ودقة في النتائج.",
      avatar: "👨‍🎓"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* قسم Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* صورة الخلفية */}
        <div className="absolute inset-0">
          <img 
            src={heroImage}
            alt="منصة الترجمة الاحترافية"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Star className="h-4 w-4 ml-2 text-yellow-400" />
              المنصة الأولى للترجمة في المنطقة
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-arabic-title font-bold leading-tight">
              مركز <span className="text-primary-glow">الخبراء</span>
              <br />
              للترجمة الاحترافية
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
              نقدم خدمات ترجمة احترافية شاملة بأكثر من 100 لغة عالمية.
              فريق من المترجمين المعتمدين والمتخصصين في جميع المجالات لضمان أعلى جودة ودقة.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-strong px-8 py-4 text-lg font-medium"
              >
                اطلب خدمة الترجمة
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <PlayCircle className="h-5 w-5 ml-2" />
                شاهد العرض التوضيحي
              </Button>
            </div>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center animate-fade-in-up" 
                     style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-4">
                    <IconComponent className="h-6 w-6 text-primary-glow mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* أنواع الترجمات */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold mb-4">
              أنواع <span className="text-gradient">الترجمات</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نقدم جميع أنواع خدمات الترجمة المتخصصة لتلبية احتياجاتكم المختلفة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "الترجمة القانونية", 
                desc: "ترجمة العقود والوثائق القانونية", 
                icon: "⚖️",
                route: "/legal-translation",
                color: "from-blue-500 to-blue-600"
              },
              { 
                title: "الترجمة الطبية", 
                desc: "ترجمة التقارير والأبحاث الطبية", 
                icon: "🏥",
                route: "/medical-translation",
                color: "from-green-500 to-green-600"
              },
              { 
                title: "الترجمة التقنية", 
                desc: "ترجمة المستندات التقنية والهندسية", 
                icon: "⚙️",
                route: "/technical-translation",
                color: "from-purple-500 to-purple-600"
              },
              { 
                title: "الترجمة التجارية", 
                desc: "ترجمة المراسلات والتقارير التجارية", 
                icon: "💼",
                route: "/business-translation",
                color: "from-orange-500 to-orange-600"
              },
              { 
                title: "الترجمة الأكاديمية", 
                desc: "ترجمة الأبحاث والرسائل العلمية", 
                icon: "🎓",
                route: "/academic-translation",
                color: "from-indigo-500 to-indigo-600"
              },
              { 
                title: "الترجمة الأدبية", 
                desc: "ترجمة الكتب والنصوص الأدبية", 
                icon: "📚",
                route: "/literary-translation",
                color: "from-pink-500 to-pink-600"
              },
              { 
                title: "الترجمة الإعلامية", 
                desc: "ترجمة المقالات والأخبار", 
                icon: "📰",
                route: "/media-translation",
                color: "from-red-500 to-red-600"
              },
              { 
                title: "الترجمة الفورية", 
                desc: "ترجمة فورية للمؤتمرات والاجتماعات", 
                icon: "🎤",
                route: "/live-translation",
                color: "from-teal-500 to-teal-600"
              }
            ].map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer"
              >
                <Card className="group text-center hover-lift bg-gradient-card shadow-soft border-0 overflow-hidden relative h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-all duration-500`} />
                  <CardContent className="p-6 space-y-4 relative z-10 h-full flex flex-col justify-between">
                    <div className="relative">
                      <motion.div 
                        className="text-6xl mb-4"
                        whileHover={{ 
                          scale: 1.2, 
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        {type.icon}
                      </motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          className="w-20 h-20 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0, 0.5, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">{type.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{type.desc}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 hover:shadow-lg transform group-hover:scale-105"
                      onClick={() => window.location.href = type.route}
                    >
                      <span className="flex items-center gap-2">
                        المزيد
                        <motion.div
                          initial={{ x: 0 }}
                          whileHover={{ x: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </motion.div>
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* المزايا الرئيسية */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold mb-4">
              لماذا تختار <span className="text-gradient">مركز الخبراء؟</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="cursor-pointer"
                >
                  <Card className="text-center hover-lift bg-gradient-card shadow-soft border-0 h-full">
                    <CardContent className="p-6 space-y-4">
                      <motion.div 
                        className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                        whileHover={{ 
                          rotate: 360,
                          scale: 1.1,
                          transition: { duration: 0.5 }
                        }}
                      >
                        <IconComponent className="h-8 w-8 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* قسم الخدمات */}
      <ServicesSection />

      {/* استوديو الترجمة التفاعلي */}
      <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-accent/5 relative overflow-hidden">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/2 right-20 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse delay-500" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>
              <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold">
                استوديو <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">الترجمة</span> التفاعلي
              </h2>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="h-8 w-8 text-accent" />
              </motion.div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              تجربة ترجمة ثورية مع تحليل ذكي للملفات، حساب دقيق للتكاليف، ومعاينة فورية للنتائج.
              <br />
              <span className="text-primary font-medium">اسحب، أفلت، وشاهد السحر يحدث!</span>
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <TranslationStudio />
          </motion.div>
        </div>
      </section>

      {/* آراء العملاء */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold mb-4">
              ماذا يقول <span className="text-gradient">عملاؤنا</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 shadow-soft animate-fade-in-up"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* دعوة للعمل النهائية */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold">
              هل أنت مستعد للبدء؟
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              انضم إلى آلاف العملاء الذين يثقون في خدماتنا. احصل على ترجمة احترافية الآن!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-strong px-8 py-4 text-lg"
              >
                احصل على عرض سعر
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                تواصل مع فريق المبيعات
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;