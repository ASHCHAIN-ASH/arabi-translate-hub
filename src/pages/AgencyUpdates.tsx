import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone,
  Sparkles, 
  TrendingUp, 
  Bell,
  Calendar,
  Award,
  Newspaper,
  Users,
  Target,
  BarChart,
  CheckCircle,
  ArrowLeft,
  Trophy,
  Eye,
  Clock
} from "lucide-react";
import { useState } from "react";

const AgencyUpdates = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const updates = [
    {
      id: 1,
      title: "إطلاق منصة الترجمة الذكية المدعومة بالذكاء الاصطناعي",
      category: "إعلان",
      date: "2025-03-15",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      excerpt: "أعلنت MasterEduPath عن إطلاق منصتها الجديدة للترجمة الذكية التي تجمع بين قوة الذكاء الاصطناعي وخبرة المترجمين البشريين",
      featured: true,
      views: "2.5K",
      readTime: "5 دقائق"
    },
    {
      id: 2,
      title: "تحقيق إنجاز تاريخي: ترجمة 10 مليون كلمة في شهر واحد",
      category: "إنجاز",
      date: "2025-03-10",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      excerpt: "حققت وكالتنا رقماً قياسياً جديداً بترجمة أكثر من 10 مليون كلمة خلال شهر مارس، مع الحفاظ على أعلى معايير الجودة",
      featured: true,
      views: "3.2K",
      readTime: "4 دقائق"
    },
    {
      id: 3,
      title: "شراكة استراتيجية مع أكبر 5 جامعات سعودية",
      category: "شراكة",
      date: "2025-03-05",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      excerpt: "وقعت MasterEduPath اتفاقيات شراكة استراتيجية مع خمس من أبرز الجامعات السعودية لتقديم خدمات الترجمة والبحث الأكاديمي",
      featured: false,
      views: "1.8K",
      readTime: "6 دقائق"
    },
    {
      id: 4,
      title: "حصول الوكالة على شهادة ISO 17100 للجودة",
      category: "جائزة",
      date: "2025-02-28",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
      excerpt: "حصلت وكالتنا على شهادة ISO 17100 الدولية للجودة في خدمات الترجمة، مما يؤكد التزامنا بأعلى معايير الجودة العالمية",
      featured: false,
      views: "2.1K",
      readTime: "3 دقائق"
    },
    {
      id: 5,
      title: "انضمام 50 مترجم معتمد جديد إلى فريقنا",
      category: "فريق",
      date: "2025-02-20",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      excerpt: "نرحب بانضمام 50 مترجماً ومترجمة معتمدين من مختلف التخصصات إلى عائلة MasterEduPath، لتعزيز قدراتنا وتوسيع نطاق خدماتنا",
      featured: false,
      views: "1.5K",
      readTime: "4 دقائق"
    },
    {
      id: 6,
      title: "إطلاق برنامج التدريب المجاني للمترجمين الناشئين",
      category: "برنامج",
      date: "2025-02-15",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      excerpt: "أطلقت MasterEduPath برنامجاً تدريبياً مجانياً لتأهيل المترجمين الناشئين وتطوير مهاراتهم في مجال الترجمة المهنية",
      featured: false,
      views: "2.8K",
      readTime: "5 دقائق"
    }
  ];

  const categories = [
    { label: "الكل", value: "all", count: updates.length, icon: Newspaper },
    { label: "إعلانات", value: "إعلان", count: 1, icon: Megaphone },
    { label: "إنجازات", value: "إنجاز", count: 1, icon: Trophy },
    { label: "شراكات", value: "شراكة", count: 1, icon: Users },
    { label: "جوائز", value: "جائزة", count: 1, icon: Award },
    { label: "الفريق", value: "فريق", count: 1, icon: Users },
    { label: "برامج", value: "برنامج", count: 1, icon: Target }
  ];

  const stats = [
    { number: "250+", label: "تحديث سنوي", icon: Bell, color: "text-blue-600", bgColor: "from-blue-500/10 to-blue-600/20" },
    { number: "98%", label: "معدل التفاعل", icon: TrendingUp, color: "text-green-600", bgColor: "from-green-500/10 to-green-600/20" },
    { number: "50K+", label: "قارئ نشط", icon: Users, color: "text-purple-600", bgColor: "from-purple-500/10 to-purple-600/20" },
    { number: "24/7", label: "تحديثات فورية", icon: Sparkles, color: "text-orange-600", bgColor: "from-orange-500/10 to-orange-600/20" }
  ];

  const filteredUpdates = selectedCategory === "all" 
    ? updates 
    : updates.filter(update => update.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <FloatingWhatsAppButton />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary via-accent to-primary/90 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 60 + 20 + 'px',
                height: Math.random() * 60 + 20 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center text-white max-w-5xl mx-auto"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-8 md:mb-10 flex justify-center"
            >
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-2xl"
                animate={{
                  boxShadow: [
                    "0 0 30px rgba(255,255,255,0.3)",
                    "0 0 60px rgba(255,255,255,0.5)",
                    "0 0 30px rgba(255,255,255,0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Megaphone className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-white" />
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 md:mb-6 leading-tight"
            >
              تحديثات الوكالة
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-95 mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto px-4"
            >
              آخر الأخبار والإنجازات والفعاليات من MasterEduPath - كن على اطلاع دائم بكل جديد
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold shadow-2xl px-8 py-6 text-lg">
                <Bell className="ml-2 h-5 w-5" />
                اشترك في التحديثات
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="relative border-0 shadow-lg hover:shadow-xl bg-card backdrop-blur-sm transition-all h-full overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="relative pt-6 pb-6 text-center">
                    <motion.div
                      className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className={`h-7 w-7 ${stat.color}`} />
                    </motion.div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">{stat.number}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 sm:py-8 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.value
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'bg-card text-foreground hover:bg-card/80 border border-border'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label} ({category.count})
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Updates Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              آخر التحديثات
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              تابع أحدث الأخبار والإنجازات والفعاليات من وكالتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredUpdates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full group ${
                  update.featured ? 'ring-2 ring-primary/40' : ''
                }`}>
                  {/* Featured Badge */}
                  {update.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 shadow-lg">
                        <Sparkles className="w-3 h-3 ml-1" />
                        مميز
                      </Badge>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <motion.img
                      src={update.image}
                      alt={update.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-0">
                        {update.category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 sm:p-6">
                    {/* Date */}
                    <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(update.date).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 leading-tight line-clamp-2">
                      {update.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {update.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {update.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {update.readTime}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="group/btn">
                        اقرأ المزيد
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              تحميل المزيد من التحديثات
              <TrendingUp className="w-5 h-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AgencyUpdates;
