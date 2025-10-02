import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Newspaper, 
  TrendingUp, 
  Award, 
  Sparkles, 
  Calendar,
  Eye,
  Share2,
  BookOpen,
  Zap,
  Target,
  Users,
  MessageCircle,
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";

const AgencyUpdates = () => {
  const updates = [
    {
      id: 1,
      title: "إطلاق خدمة المحرر الذكي بالذكاء الاصطناعي",
      description: "نفخر بالإعلان عن إطلاق خدمة المحرر الذكي المدعومة بالذكاء الاصطناعي لمساعدة الباحثين في تحسين أبحاثهم ونشرها في أفضل المجلات العالمية.",
      date: "2025-09-28",
      category: "خدمات جديدة",
      image: "🤖",
      views: 1250,
      featured: true
    },
    {
      id: 2,
      title: "شراكة استراتيجية مع 50 جامعة عالمية",
      description: "نعلن عن توقيع شراكات استراتيجية مع أكثر من 50 جامعة عالمية رائدة لتقديم خدمات ترجمة وبحث علمي حصرية لطلابها وباحثيها.",
      date: "2025-09-15",
      category: "شراكات",
      image: "🤝",
      views: 980,
      featured: true
    },
    {
      id: 3,
      title: "تحديث نظام التسعير والعضويات",
      description: "تم تحديث نظام التسعير ليكون أكثر مرونة وشفافية، مع إضافة خيارات عضوية جديدة توفر خصومات تصل إلى 40%.",
      date: "2025-09-10",
      category: "تحديثات",
      image: "💰",
      views: 750,
      featured: false
    },
    {
      id: 4,
      title: "إنجاز 10,000 مشروع بحثي ناجح",
      description: "احتفالاً بإنجاز 10,000 مشروع بحثي، نقدم عروض خاصة لجميع عملائنا الجدد والحاليين طوال هذا الشهر.",
      date: "2025-09-01",
      category: "إنجازات",
      image: "🎉",
      views: 1400,
      featured: true
    },
    {
      id: 5,
      title: "خدمة الدعم الفني على مدار الساعة",
      description: "نعلن عن توفر خدمة الدعم الفني والاستشاري على مدار الساعة طوال أيام الأسبوع لجميع عملائنا.",
      date: "2025-08-25",
      category: "خدمات",
      image: "💬",
      views: 620,
      featured: false
    },
    {
      id: 6,
      title: "حصول الوكالة على شهادة الآيزو ISO 9001:2015",
      description: "فخورون بالإعلان عن حصولنا على شهادة الآيزو ISO 9001:2015 في إدارة الجودة، مما يعكس التزامنا بأعلى معايير الجودة العالمية.",
      date: "2025-08-15",
      category: "جوائز",
      image: "🏆",
      views: 890,
      featured: false
    }
  ];

  const stats = [
    { icon: BookOpen, value: "10,000+", label: "مشروع منجز", color: "text-blue-400" },
    { icon: Users, value: "5,000+", label: "عميل راضٍ", color: "text-green-400" },
    { icon: Award, value: "98%", label: "معدل الرضا", color: "text-yellow-400" },
    { icon: Target, value: "150+", label: "خبير متخصص", color: "text-purple-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Header />
      <FloatingWhatsAppButton />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10" />
        
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10" dir="rtl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mb-6 shadow-2xl"
            >
              <Newspaper className="h-10 w-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              تحديثات الوكالة
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              تابع آخر الأخبار والتحديثات والإنجازات في وكالة MasterEduPath
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <TrendingUp className="h-4 w-4 ml-2" />
                أحدث الأخبار
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 ml-2" />
                تحديثات حصرية
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Award className="h-4 w-4 ml-2" />
                إنجازات متميزة
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4" dir="rtl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Updates Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className={`h-full bg-white/90 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl group overflow-hidden ${update.featured ? 'ring-2 ring-primary/30' : ''}`}>
                  {update.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                        <Sparkles className="h-3 w-3 ml-1" />
                        مميز
                      </Badge>
                    </div>
                  )}

                  {/* Image/Emoji Section */}
                  <div className="relative h-48 bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="text-8xl"
                    >
                      {update.image}
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <Badge variant="outline" className="gap-1">
                        {update.category}
                      </Badge>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(update.date).toLocaleDateString('ar-SA')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {update.views}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {update.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {update.description}
                    </p>

                    <div className="flex gap-2 pt-4">
                      <Button variant="default" size="sm" className="flex-1 gap-2">
                        <BookOpen className="h-4 w-4" />
                        اقرأ المزيد
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10" />
        <div className="container mx-auto px-4 relative z-10" dir="rtl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-gradient-to-br from-primary to-blue-600 text-white p-8 md:p-12 text-center border-0 shadow-2xl">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6"
              >
                <MessageCircle className="h-8 w-8" />
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                هل لديك استفسار أو تحتاج مساعدة؟
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                فريقنا جاهز لمساعدتك على مدار الساعة. تواصل معنا الآن للحصول على استشارة مجانية
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="gap-2" asChild>
                  <Link to="/contact">
                    <Phone className="h-5 w-5" />
                    تواصل معنا
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30" asChild>
                  <Link to="/order-now">
                    <Zap className="h-5 w-5" />
                    اطلب خدمة الآن
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgencyUpdates;
