import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Eye, Clock, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Partnerships = () => {
  const partnerships = [
    {
      id: 1,
      title: "شراكة استراتيجية مع أكبر 5 جامعات سعودية",
      date: "2025-03-05",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      excerpt: "وقعت MasterEduPath اتفاقيات شراكة استراتيجية مع خمس من أبرز الجامعات السعودية لتقديم خدمات الترجمة والبحث الأكاديمي المتخصصة",
      featured: true,
      views: "1.8K",
      readTime: "6 دقائق"
    },
    {
      id: 2,
      title: "شراكة مع منظمة اليونسكو للترجمة الثقافية",
      date: "2025-02-25",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
      excerpt: "توقيع اتفاقية تعاون مع اليونسكو لترجمة المحتوى الثقافي والتراثي العربي إلى لغات متعددة",
      featured: false,
      views: "2.3K",
      readTime: "5 دقائق"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      <FloatingWhatsAppButton />

      <section className="relative py-16 md:py-24 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 overflow-hidden">
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
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              الشراكات
            </h1>

            <p className="text-base sm:text-lg md:text-xl opacity-95 mb-8 leading-relaxed px-4">
              شراكاتنا الاستراتيجية مع المؤسسات الرائدة
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

      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {partnerships.map((partnership, index) => (
              <motion.div
                key={partnership.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full group ${
                  partnership.featured ? 'ring-2 ring-purple-400/40' : ''
                }`}>
                  {partnership.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-lg">
                        <Sparkles className="w-3 h-3 ml-1" />
                        مميز
                      </Badge>
                    </div>
                  )}

                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <motion.img
                      src={partnership.image}
                      alt={partnership.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </div>

                  <CardContent className="p-5 sm:p-6">
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(partnership.date).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 leading-tight line-clamp-2">
                      {partnership.title}
                    </h3>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {partnership.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {partnership.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {partnership.readTime}
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

export default Partnerships;
