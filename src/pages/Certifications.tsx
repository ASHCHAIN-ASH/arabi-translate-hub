import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Award, 
  Shield, 
  Globe, 
  BookOpen, 
  FileCheck, 
  Crown,
  Star,
  CheckCircle,
  Building,
  Users,
  Trophy,
  Zap,
  ArrowRight,
  Download,
  ExternalLink,
  Verified
} from "lucide-react";

const Certifications = () => {
  const certifications = [
    {
      title: "شهادة ISO 9001:2015",
      issuer: "المنظمة الدولية للمعايير",
      year: "2023",
      description: "نظام إدارة الجودة المعتمد دولياً لضمان أعلى معايير الخدمة",
      badge: "معتمد",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      icon: Shield,
      category: "جودة وإدارة"
    },
    {
      title: "عضوية جمعية المترجمين العرب",
      issuer: "الجمعية العربية للمترجمين",
      year: "2022",
      description: "عضوية فعالة في أكبر جمعية للمترجمين في العالم العربي",
      badge: "عضوية فعالة",
      color: "text-green-500",
      bgColor: "bg-green-50",
      icon: Users,
      category: "مهنية"
    },
    {
      title: "شهادة ATA المعتمدة",
      issuer: "American Translators Association",
      year: "2023",
      description: "شهادة معتمدة من جمعية المترجمين الأمريكية للترجمة المتخصصة",
      badge: "معتمد دولياً",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      icon: Globe,
      category: "اعتماد دولي"
    },
    {
      title: "شهادة CAT Tools المتقدمة",
      issuer: "SDL Trados Studio",
      year: "2023",
      description: "خبرة متقدمة في استخدام أحدث تقنيات الترجمة بمساعدة الحاسوب",
      badge: "متقدم",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      icon: Zap,
      category: "تقنية"
    },
    {
      title: "اعتماد الترجمة القانونية",
      issuer: "المجلس الأعلى للقضاء",
      year: "2022",
      description: "ترخيص رسمي لممارسة الترجمة القانونية المعتمدة",
      badge: "مرخص رسمياً",
      color: "text-red-500",
      bgColor: "bg-red-50",
      icon: Building,
      category: "قانونية"
    },
    {
      title: "شهادة الترجمة الطبية",
      issuer: "منظمة الصحة العالمية",
      year: "2023",
      description: "تخصص معتمد في ترجمة النصوص والأبحاث الطبية والعلمية",
      badge: "متخصص",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      icon: BookOpen,
      category: "طبية وعلمية"
    }
  ];

  const accreditations = [
    {
      title: "الاعتماد الأكاديمي",
      organization: "وزارة التعليم العالي",
      description: "معتمد رسمياً لتقديم الخدمات الأكاديمية والبحثية",
      icon: FileCheck,
      status: "فعال"
    },
    {
      title: "عضوية غرفة التجارة",
      organization: "غرفة التجارة والصناعة",
      description: "عضوية فعالة في غرفة التجارة لضمان الشفافية والمهنية",
      icon: Building,
      status: "فعال"
    },
    {
      title: "ترخيص مزاولة المهنة",
      organization: "وزارة التجارة والاستثمار",
      description: "ترخيص رسمي لممارسة أنشطة الترجمة والخدمات الاستشارية",
      icon: Verified,
      status: "ساري"
    }
  ];

  const awards = [
    {
      title: "جائزة التميز في الترجمة",
      year: "2023",
      issuer: "المؤتمر العربي للترجمة",
      description: "تقديراً للإنجازات المتميزة في مجال الترجمة الأكاديمية"
    },
    {
      title: "شهادة تقدير للجودة",
      year: "2022",
      issuer: "اتحاد الجامعات العربية",
      description: "تقديراً للمساهمة في تطوير البحث العلمي العربي"
    },
    {
      title: "جائزة أفضل خدمة عملاء",
      year: "2023",
      issuer: "منتدى الأعمال العربي",
      description: "تقديراً لتميز الخدمة ورضا العملاء"
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
            className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
              rotate: [360, 180, 0]
            }}
            transition={{
              duration: 15,
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
                <Award className="h-5 w-5 ml-2" />
                الشهادات والاعتمادات
                <Trophy className="h-5 w-5 mr-2" />
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-arabic-title font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">مؤهلاتنا</span> وشهاداتنا المعتمدة
            </motion.h1>

            <motion.p
              className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              نفخر بحصولنا على أرفع الشهادات والاعتمادات المحلية والدولية التي تؤكد جودة خدماتنا ومهنيتنا
            </motion.p>

            <motion.div
              className="w-32 h-1 bg-gradient-primary mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>
        </div>
      </section>

      {/* قسم الشهادات المهنية */}
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
              الشهادات <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">المهنية</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              شهادات واعتمادات من أرقى المؤسسات المحلية والدولية في مجال الترجمة والخدمات الأكاديمية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-background to-muted/10 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div
                        className={`w-12 h-12 ${cert.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        <cert.icon className={`h-6 w-6 ${cert.color}`} />
                      </motion.div>
                      <Badge variant="secondary" className="text-xs">
                        {cert.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">{cert.title}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{cert.issuer}</p>
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`text-xs ${cert.color} bg-opacity-20`}>
                        {cert.badge}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{cert.year}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {cert.description}
                    </p>
                    
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" className="text-xs flex-1">
                        <Download className="h-3 w-3 ml-1" />
                        تحميل
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs flex-1">
                        <ExternalLink className="h-3 w-3 ml-1" />
                        التحقق
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الاعتمادات الرسمية */}
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
              الاعتمادات <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">الرسمية</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              تراخيص واعتمادات رسمية من الجهات الحكومية والمؤسسات المعتمدة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {accreditations.map((accred, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-6 text-center border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0">
                    <motion.div
                      className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <accred.icon className="h-8 w-8 text-primary" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-2">{accred.title}</h3>
                    <p className="text-sm text-primary font-medium mb-2">{accred.organization}</p>
                    <Badge className="bg-green-100 text-green-700 mb-3">
                      <CheckCircle className="h-3 w-3 ml-1" />
                      {accred.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {accred.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الجوائز والتقديرات */}
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
              الجوائز <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">والتقديرات</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              جوائز وشهادات تقدير حصلنا عليها تقديراً لتميزنا وإبداعنا في العمل
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 border-2 border-transparent hover:border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-transparent shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0 text-center">
                    <motion.div
                      className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Trophy className="h-8 w-8 text-yellow-600" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold mb-2">{award.title}</h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-600">{award.year}</span>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-primary font-medium mb-2">{award.issuer}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {award.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الضمانات والمصداقية */}
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
              ضماناتنا <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">للجودة</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "ضمان الجودة",
                description: "نضمن أعلى معايير الجودة في جميع خدماتنا",
                color: "text-blue-500",
                bgColor: "bg-blue-50"
              },
              {
                icon: CheckCircle,
                title: "الالتزام بالمواعيد",
                description: "نلتزم بتسليم العمل في الوقت المحدد دون تأخير",
                color: "text-green-500",
                bgColor: "bg-green-50"
              },
              {
                icon: Crown,
                title: "خدمة متميزة",
                description: "نقدم خدمة عملاء متميزة على مدار الساعة",
                color: "text-purple-500",
                bgColor: "bg-purple-50"
              },
              {
                icon: Verified,
                title: "المصداقية",
                description: "نتعامل بشفافية ومصداقية مع جميع عملائنا",
                color: "text-orange-500",
                bgColor: "bg-orange-50"
              }
            ].map((guarantee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full text-center border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-background to-muted/10 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-0">
                    <motion.div
                      className={`w-12 h-12 ${guarantee.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <guarantee.icon className={`h-6 w-6 ${guarantee.color}`} />
                    </motion.div>
                    <h3 className="text-lg font-bold mb-3">{guarantee.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {guarantee.description}
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
              ثق في <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">خبرتنا المعتمدة</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              مع هذه الشهادات والاعتمادات، نضمن لك خدمة احترافية تلبي أعلى المعايير الدولية
            </p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Button size="lg" className="bg-gradient-primary text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                ابدأ مشروعك معنا
                <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300">
                تواصل مع فريق الخبراء
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Certifications;