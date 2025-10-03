import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Eye, Clock, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: "تحقيق إنجاز تاريخي: ترجمة 10 مليون كلمة في شهر واحد",
      date: "2025-03-10",
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      excerpt: "حققت وكالتنا رقماً قياسياً جديداً بترجمة أكثر من 10 مليون كلمة خلال شهر مارس، مع الحفاظ على أعلى معايير الجودة والدقة في جميع المشاريع",
      featured: true,
      views: "3.2K",
      readTime: "4 دقائق"
    },
    {
      id: 2,
      title: "الوصول إلى 100,000 عميل راضٍ حول العالم",
      date: "2025-03-05",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
      excerpt: "نفخر بالإعلان عن تجاوزنا حاجز 100,000 عميل راضٍ من 75 دولة حول العالم، مما يعكس ثقة العملاء في خدماتنا",
      featured: false,
      views: "2.7K",
      readTime: "5 دقائق"
    },
    {
      id: 3,
      title: "فوز المركز الأول في مسابقة أفضل خدمة ترجمة عربية",
      date: "2025-02-28",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
      excerpt: "حصلت MasterEduPath على المركز الأول في مسابقة أفضل خدمة ترجمة عربية لعام 2025، متفوقة على أكثر من 200 منافس",
      featured: false,
      views: "2.1K",
      readTime: "4 دقائق"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <FloatingWhatsAppButton />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-yellow-600 via-yellow-700 to-orange-700 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
            animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-8 flex justify-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-2xl">
                <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              الإنجازات
            </h1>

            <p className="text-base sm:text-lg md:text-xl opacity-95 mb-8 leading-relaxed px-4">
              احتفل معنا بإنجازاتنا وقصص نجاحنا
            </p>

            <Link to="/agency-updates">
              <Button variant="outline" className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm">
                <ArrowLeft className="ml-2 h-5 w-5" />
                العودة لجميع التحديثات
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full group ${
                  achievement.featured ? 'ring-2 ring-yellow-400/40' : ''
                }`}>
                  {achievement.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0 shadow-lg">
                        <Sparkles className="w-3 h-3 ml-1" />
                        مميز
                      </Badge>
                    </div>
                  )}

                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <motion.img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(achievement.date).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 leading-tight line-clamp-2">
                      {achievement.title}
                    </h3>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {achievement.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {achievement.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {achievement.readTime}
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Achievements;
