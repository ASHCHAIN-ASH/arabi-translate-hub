import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Users, 
  Target, 
  Globe, 
  Award, 
  BookOpen, 
  Lightbulb,
  Heart,
  TrendingUp,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
  Building,
  Zap,
  Crown,
  GraduationCap,
  Brain,
  Rocket,
  Monitor,
  PenTool,
  FileText,
  Search,
  BarChart3,
  Languages,
  Microscope,
  Calculator,
  Puzzle
} from "lucide-react";

const AboutUs = () => {

  const values = [
    {
      icon: Brain,
      title: "الابتكار التعليمي",
      description: "نطور حلول تعليمية مبتكرة تواكب أحدث التطورات التكنولوجية",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: GraduationCap,
      title: "التميز الأكاديمي",
      description: "نسعى لتحقيق أعلى معايير الجودة في التعليم والبحث العلمي",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Rocket,
      title: "التطوير التقني",
      description: "نستخدم أحدث التقنيات لتقديم تجربة تعليمية متقدمة وفعالة",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Lightbulb,
      title: "الإبداع والحلول",
      description: "نقدم حلولاً إبداعية مخصصة تلبي احتياجات كل طالب ومؤسسة",
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ];

  const achievements = [
    {
      number: "10,000+",
      title: "طالب مستفيد",
      description: "من حلولنا التعليمية"
    },
    {
      number: "95%",
      title: "معدل النجاح",
      description: "في تحقيق الأهداف التعليمية"
    },
    {
      number: "200+",
      title: "مؤسسة تعليمية",
      description: "تثق في خدماتنا"
    },
    {
      number: "24/7",
      title: "دعم متواصل",
      description: "لضمان أفضل تجربة تعليمية"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* قسم البطل الرئيسي */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center justify-center mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="bg-primary text-white border-0 px-8 py-3 text-lg font-bold shadow-lg rounded-full">
                <Building className="h-5 w-5 ml-2" />
                من نحن
                <Crown className="h-5 w-5 mr-2" />
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-arabic-title font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              وكالة <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">ماستر إيدو باث</span> للحلول التعليمية المتقدمة
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              نقود التحول الرقمي في التعليم من خلال حلول تعليمية مبتكرة ومتطورة تلبي احتياجات المستقبل
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button size="lg" className="bg-gradient-primary text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                اكتشف خدماتنا
                <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                تواصل معنا الآن
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* قسم رؤيتنا ورسالتنا */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mr-4">رؤيتنا</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    أن نكون الرائدين في تطوير الحلول التعليمية المتقدمة في المنطقة العربية، ونحدث تحولاً جذرياً في مجال التعليم من خلال تقنيات الذكاء الاصطناعي والتعلم التفاعلي لإعداد جيل واعد للمستقبل.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mr-4">رسالتنا</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    تمكين الطلاب والمؤسسات التعليمية من خلال حلول تعليمية مبتكرة ومتطورة، ودعم رحلة التعلم بأدوات وخدمات ذكية تحقق أفضل النتائج وتواكب تطورات العصر الرقمي.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* قسم القيم */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-title font-bold mb-4">
              قيمنا <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">الأساسية</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              القيم التي نؤمن بها ونسعى لتطبيقها في كل جانب من جوانب عملنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-background to-muted/10 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0 text-center">
                    <motion.div
                      className={`w-16 h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <value.icon className={`h-8 w-8 ${value.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الإنجازات */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-title font-bold mb-4">
              إنجازاتنا <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">بالأرقام</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0">
                    <motion.div
                      className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    >
                      {achievement.number}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                    <p className="text-muted-foreground text-sm">{achievement.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الخدمات التعليمية */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-title font-bold mb-4">
              خدماتنا <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">التعليمية</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              مجموعة شاملة من الحلول التعليمية المتقدمة تلبي احتياجات العصر الرقمي
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Monitor,
                title: "التعلم الإلكتروني",
                description: "منصات تعليمية تفاعلية ومحتوى رقمي متطور",
                color: "text-blue-500",
                bgColor: "bg-blue-50"
              },
              {
                icon: PenTool,
                title: "كتابة الأبحاث",
                description: "دعم شامل في إعداد وكتابة البحوث العلمية",
                color: "text-green-500",
                bgColor: "bg-green-50"
              },
              {
                icon: FileText,
                title: "التدقيق اللغوي",
                description: "مراجعة وتحرير النصوص الأكاديمية والعلمية",
                color: "text-purple-500",
                bgColor: "bg-purple-50"
              },
              {
                icon: Search,
                title: "البحث العلمي",
                description: "أدوات وتقنيات متقدمة للبحث والتحليل",
                color: "text-orange-500",
                bgColor: "bg-orange-50"
              },
              {
                icon: BarChart3,
                title: "التحليل الإحصائي",
                description: "تحليل البيانات والإحصائيات بأحدث الطرق",
                color: "text-red-500",
                bgColor: "bg-red-50"
              },
              {
                icon: Languages,
                title: "الترجمة المتخصصة",
                description: "ترجمة دقيقة للنصوص الأكاديمية والعلمية",
                color: "text-indigo-500",
                bgColor: "bg-indigo-50"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-background to-muted/10 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-0">
                    <motion.div
                      className={`w-12 h-12 ${service.bgColor} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <service.icon className={`h-6 w-6 ${service.color}`} />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الدعوة للعمل النهائية */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-arabic-title font-bold mb-6">
              جاهزون لخدمتكم <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">على مدار الساعة</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              انضموا إلى آلاف العملاء الذين وثقوا بخبرتنا وحققوا أهدافهم الأكاديمية والمهنية معنا
            </p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Button size="lg" className="bg-gradient-primary text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                ابدأ مشروعك الآن
                <Zap className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                استشارة مجانية
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;