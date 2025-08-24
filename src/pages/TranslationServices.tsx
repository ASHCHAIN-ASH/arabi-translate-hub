import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdvancedTranslationForm from "@/components/AdvancedTranslationForm";
import { 
  Scale, 
  Stethoscope, 
  Cog, 
  Briefcase,
  GraduationCap,
  BookOpen,
  Newspaper,
  Radio,
  ArrowLeft,
  Globe,
  Star,
  Users,
  Shield,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

const TranslationServices = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="bg-primary/10 rounded-full p-4">
                <Globe className="h-12 w-12 text-primary" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-arabic-title font-bold mb-6 leading-tight">
              خدمات <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">الترجمة</span> المتخصصة
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              نقدم جميع أنواع خدمات الترجمة المتخصصة لتلبية احتياجاتكم المختلفة بأعلى معايير الجودة والدقة
            </p>
            
            <motion.div
              className="w-32 h-1 bg-gradient-primary mx-auto mt-8 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 128 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>

          {/* أنواع الترجمات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[
              { 
                title: "الترجمة القانونية", 
                desc: "ترجمة العقود والوثائق القانونية", 
                icon: Scale,
                route: "/legal-translation",
                color: "from-blue-500 to-blue-600",
                bgGlow: "bg-blue-500/20"
              },
              { 
                title: "الترجمة الطبية", 
                desc: "ترجمة التقارير والأبحاث الطبية", 
                icon: Stethoscope,
                route: "/medical-translation",
                color: "from-green-500 to-green-600",
                bgGlow: "bg-green-500/20"
              },
              { 
                title: "الترجمة التقنية", 
                desc: "ترجمة المستندات التقنية والهندسية", 
                icon: Cog,
                route: "/technical-translation",
                color: "from-purple-500 to-purple-600",
                bgGlow: "bg-purple-500/20"
              },
              { 
                title: "الترجمة التجارية", 
                desc: "ترجمة المراسلات والتقارير التجارية", 
                icon: Briefcase,
                route: "/business-translation",
                color: "from-orange-500 to-orange-600",
                bgGlow: "bg-orange-500/20"
              },
              { 
                title: "الترجمة الأكاديمية", 
                desc: "ترجمة الأبحاث والرسائل العلمية", 
                icon: GraduationCap,
                route: "/academic-translation",
                color: "from-indigo-500 to-indigo-600",
                bgGlow: "bg-indigo-500/20"
              },
              { 
                title: "الترجمة الأدبية", 
                desc: "ترجمة الكتب والنصوص الأدبية", 
                icon: BookOpen,
                route: "/literary-translation",
                color: "from-pink-500 to-pink-600",
                bgGlow: "bg-pink-500/20"
              },
              { 
                title: "الترجمة الإعلامية", 
                desc: "ترجمة المقالات والأخبار", 
                icon: Newspaper,
                route: "/media-translation",
                color: "from-red-500 to-red-600",
                bgGlow: "bg-red-500/20"
              },
              { 
                title: "الترجمة الفورية", 
                desc: "ترجمة فورية للمؤتمرات والاجتماعات", 
                icon: Radio,
                route: "/instant-translation",
                color: "from-teal-500 to-teal-600",
                bgGlow: "bg-teal-500/20"
              }
            ].map((type, index) => {
              const IconComponent = type.icon;
              return (
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
                    <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-15 transition-all duration-500`} />
                    <CardContent className="p-6 lg:p-8 space-y-4 lg:space-y-6 relative z-10 h-full flex flex-col justify-between">
                      <div className="relative">
                        <motion.div 
                          className="mb-4 flex justify-center relative"
                          whileHover={{ 
                            scale: 1.15,
                            transition: { duration: 0.3 }
                          }}
                        >
                          <div className="relative">
                            <motion.div 
                              className={`w-20 lg:w-24 h-20 lg:h-24 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center shadow-lg`}
                              whileHover={{ 
                                rotate: [0, -5, 5, -5, 0],
                                transition: { duration: 0.5 }
                              }}
                            >
                              <IconComponent className="h-10 lg:h-12 w-10 lg:w-12 text-white" />
                            </motion.div>
                            <motion.div 
                              className={`absolute inset-0 ${type.bgGlow} rounded-2xl blur-xl opacity-0 group-hover:opacity-60`}
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0, 0.4, 0]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            />
                          </div>
                        </motion.div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl lg:text-2xl font-arabic-title font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {type.title}
                        </h3>
                        <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                          {type.desc}
                        </p>
                      </div>
                      <motion.div
                        whileHover={{ x: -5 }}
                        className="mt-4"
                      >
                        <Button 
                          variant="ghost" 
                          className="group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 w-full"
                          onClick={() => window.location.href = type.route}
                        >
                          اعرف المزيد
                          <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mt-16 lg:mt-20"
          >
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 lg:p-12 border border-border/50">
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                {[
                  { icon: Award, text: "جودة معتمدة", color: "text-yellow-500" },
                  { icon: Users, text: "فريق خبير", color: "text-blue-500" },
                  { icon: Shield, text: "سرية تامة", color: "text-green-500" },
                  { icon: Star, text: "خدمة 24/7", color: "text-purple-500" }
                ].map(({ icon: Icon, text, color }, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full"
                  >
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="text-sm font-medium">{text}</span>
                  </motion.div>
                ))}
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold mb-4">
                هل تحتاج مساعدة في اختيار الخدمة المناسبة؟
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                فريق خبرائنا جاهز لمساعدتك في اختيار نوع الترجمة المناسب لاحتياجاتك
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medium px-8 py-6 text-xl font-bold rounded-2xl"
                >
                  تواصل مع خبرائنا الآن
                  <ArrowLeft className="h-6 w-6 mr-3" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* فورم طلب خدمة الترجمة */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AdvancedTranslationForm 
            translationType="general"
            title="احصل على خدمة ترجمة متخصصة"
            description="نقدم جميع أنواع خدمات الترجمة المتخصصة بأعلى معايير الجودة والدقة"
            gradientFrom="primary"
            gradientTo="accent"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TranslationServices;