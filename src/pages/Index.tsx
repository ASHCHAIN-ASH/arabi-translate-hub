import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import TranslationStudio from "@/components/TranslationStudio";
import AnimatedBackground from "@/components/AnimatedBackground";
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
  Rocket,
  Building2,
  TrendingUp,
  Briefcase,
  Settings,
  Target,
  Lightbulb
} from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const stats = [
    { icon: Building2, number: "500+", label: "شركة عالمية", gradient: "from-primary to-primary-dark" },
    { icon: Globe, number: "150+", label: "لغة احترافية", gradient: "from-secondary to-warning" },
    { icon: TrendingUp, number: "10M+", label: "كلمة مترجمة", gradient: "from-accent to-accent-light" },
    { icon: Award, number: "99.9%", label: "دقة مضمونة", gradient: "from-yellow-400 to-yellow-600" }
  ];

  const features = [
    {
      icon: Briefcase,
      title: "للشركات العالمية",
      description: "حلول ترجمة متطورة للمؤسسات الكبرى والشركات متعددة الجنسيات",
      gradient: "from-primary to-primary-dark",
      shadowColor: "shadow-primary"
    },
    {
      icon: Shield,
      title: "أمان مؤسسي",
      description: "معايير الأمان العالمية مع شهادات ISO وحماية البيانات الحساسة",
      gradient: "from-accent to-accent-light",
      shadowColor: "shadow-success"
    },
    {
      icon: Settings,
      title: "تقنية متقدمة",
      description: "ذكاء اصطناعي متطور مع مراجعة بشرية من خبراء معتمدين",
      gradient: "from-purple-500 to-indigo-500",
      shadowColor: "shadow-medium"
    },
    {
      icon: Target,
      title: "دقة استثنائية",
      description: "ضمان جودة 99.9% مع التزام صارم بالمواعيد النهائية",
      gradient: "from-secondary to-warning",
      shadowColor: "shadow-secondary"
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
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* الخلفية المتحركة والديناميكية */}
        <AnimatedBackground />
        
        {/* طبقة إضافية للتحكم في الشفافية */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-secondary/50 to-accent/60" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div 
            className="max-w-6xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Building2 className="h-12 w-12 text-white/80" />
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-md px-4 py-2 text-lg">
                <Sparkles className="h-5 w-5 ml-2 text-yellow-300" />
                الحل الأمثل للشركات العالمية
              </Badge>
              
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Lightbulb className="h-12 w-12 text-white/80" />
                <motion.div
                  className="absolute inset-0 bg-yellow-300/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-8xl font-arabic-title font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
                transition={{ duration: 0.2 }}
              >
                مركز الخبراء
              </motion.span>
              <br />
              <motion.span
                className="text-white/90 text-4xl md:text-5xl lg:text-6xl block mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                للحلول التقنية المتقدمة
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/95 font-light leading-relaxed max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              شريكك الاستراتيجي في التوسع العالمي. نقدم حلول ترجمة مؤسسية متكاملة 
              بتقنيات الذكاء الاصطناعي المتطورة وفريق من الخبراء المعتمدين دولياً.
              <br />
              <span className="text-white/80 text-lg">
                أكثر من 150 لغة • خدمة 24/7 • ضمان الجودة المطلقة
              </span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/95 shadow-2xl px-10 py-6 text-xl font-bold rounded-2xl"
                >
                  <Rocket className="h-6 w-6 mr-3" />
                  ابدأ مشروعك الآن
                  <ArrowLeft className="h-6 w-6 mr-3" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/60 text-white hover:bg-white/15 px-10 py-6 text-xl backdrop-blur-md rounded-2xl"
                >
                  <PlayCircle className="h-6 w-6 ml-3" />
                  جولة تفاعلية
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* إحصائيات متحركة */}
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="cursor-pointer"
                >
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-center hover:bg-white/10 transition-all duration-300 group overflow-hidden relative">
                    <CardContent className="p-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="relative mb-4"
                      >
                        <IconComponent className={`h-10 w-10 text-white mx-auto`} />
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-30 rounded-full blur-sm`} />
                      </motion.div>
                      <motion.div 
                        className="text-3xl md:text-4xl font-bold text-white mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 + index * 0.2 }}
                      >
                        {stat.number}
                      </motion.div>
                      <div className="text-white/90 text-sm font-medium">{stat.label}</div>
                    </CardContent>
                    
                    {/* تأثير الضوء المتحرك */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
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

      {/* المزايا الرئيسية للشركات */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
        {/* خلفية هندسية متحركة */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
             backgroundImage: `
               linear-gradient(45deg, hsl(var(--primary)) 1px, transparent 1px),
               linear-gradient(-45deg, hsl(var(--accent)) 1px, transparent 1px)
             `,
            backgroundSize: '60px 60px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-arabic-title font-bold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              لماذا تثق بنا <span className="text-gradient-secondary">الشركات الرائدة؟</span>
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              حلول متطورة ومخصصة للمؤسسات الكبرى والشركات متعددة الجنسيات
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="cursor-pointer group"
                >
                  <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-muted/30 hover:shadow-2xl transition-all duration-500 h-full">
                    {/* تأثير التدرج المتحرك */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <CardContent className="p-8 space-y-6 relative z-10">
                      <motion.div 
                        className="flex items-center gap-4 mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div 
                          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                          whileHover={{ 
                            rotate: [0, -5, 5, -5, 0],
                            scale: 1.1
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent className="h-10 w-10 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-arabic-title font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {feature.title}
                          </h3>
                        </div>
                      </motion.div>
                      
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {feature.description}
                      </p>
                      
                      {/* مؤشر التفاعل */}
                      <motion.div
                        className="flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -10 }}
                        whileInView={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>اعرف المزيد</span>
                        <ArrowLeft className="h-4 w-4" />
                      </motion.div>
                    </CardContent>
                    
                    {/* تأثير الإضاءة المتحركة */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
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