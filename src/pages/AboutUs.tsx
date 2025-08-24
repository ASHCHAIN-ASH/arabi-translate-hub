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
  Crown
} from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "د. أحمد محمد الأستاذ",
      role: "المدير التنفيذي والمؤسس",
      specialization: "أستاذ الترجمة واللسانيات",
      experience: "15+ سنة",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "خبير في الترجمة القانونية والطبية مع دكتوراه في اللسانيات التطبيقية"
    },
    {
      name: "د. فاطمة العلي",
      role: "مديرة الأبحاث الأكاديمية",
      specialization: "البحث العلمي والنشر الأكاديمي",
      experience: "12+ سنة",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      description: "متخصصة في البحوث الطبية والعلمية مع خبرة واسعة في النشر الدولي"
    },
    {
      name: "أ. سارة الحسن",
      role: "مديرة الجودة والمراجعة",
      specialization: "ضمان الجودة والتدقيق",
      experience: "10+ سنوات",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "خبيرة في مراجعة الترجمات وضمان أعلى معايير الجودة"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "المصداقية والثقة",
      description: "نلتزم بأعلى معايير الشفافية والمصداقية في جميع خدماتنا",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Star,
      title: "التميز والجودة",
      description: "نسعى للتميز في كل عمل نقوم به ونحرص على تقديم أفضل جودة",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Heart,
      title: "العمل بروح الفريق",
      description: "نؤمن بقوة العمل الجماعي والتعاون لتحقيق أهدافنا المشتركة",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: TrendingUp,
      title: "التطوير المستمر",
      description: "نحرص على التطوير والتحديث المستمر لخدماتنا ومهاراتنا",
      color: "text-green-500",
      bgColor: "bg-green-50"
    }
  ];

  const achievements = [
    {
      number: "5000+",
      title: "مشروع مكتمل",
      description: "بنجاح وجودة عالية"
    },
    {
      number: "98%",
      title: "نسبة الرضا",
      description: "من عملائنا الكرام"
    },
    {
      number: "50+",
      title: "لغة متاحة",
      description: "للترجمة والخدمات"
    },
    {
      number: "24/7",
      title: "دعم فني",
      description: "متواصل على مدار الساعة"
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
              مركز <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">الخبراء</span> للترجمة الاحترافية
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              رائدون في مجال الترجمة الاحترافية والخدمات الأكاديمية منذ أكثر من عقد من الزمن
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
                    أن نكون المرجع الأول في العالم العربي لخدمات الترجمة الاحترافية والخدمات الأكاديمية، ونساهم في تطوير البحث العلمي والثقافي من خلال تقديم حلول متطورة وموثوقة تلبي احتياجات عملائنا المتنوعة.
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
                    تقديم خدمات ترجمة وأكاديمية متميزة تتسم بالدقة والجودة العالية، مع الالتزام بالمواعيد المحددة والمعايير المهنية العالمية، لنساعد عملاءنا على تحقيق أهدافهم الأكاديمية والمهنية بنجاح.
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

      {/* قسم فريق العمل */}
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
              فريق <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">الخبراء</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نخبة من الخبراء والمتخصصين في مختلف المجالات الأكاديمية والترجمة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-6 border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-background to-muted/10 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0 text-center">
                    <motion.div
                      className="relative mb-4 group-hover:scale-105 transition-transform duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/20"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <div className="mb-3">
                      <Badge variant="secondary" className="mb-2">
                        {member.role}
                      </Badge>
                      <p className="text-sm text-primary font-medium">{member.specialization}</p>
                      <p className="text-xs text-muted-foreground mt-1">{member.experience}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الدعوة للعمل */}
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