import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Construction, 
  Brain, 
  FileText, 
  Globe, 
  BookMarked,
  ArrowRight,
  Home,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";

const SmartEditor = () => {
  const features = [
    {
      icon: FileText,
      title: "اقتراح المجلات العلمية",
      description: "تحليل ذكي لاختيار أفضل المجلات العالمية المناسبة"
    },
    {
      icon: Globe,
      title: "المؤتمرات العالمية",
      description: "العثور على المؤتمرات الدولية المرموقة في تخصصك"
    },
    {
      icon: BookMarked,
      title: "المراجع والكتب",
      description: "دليل شامل للمراجع الأساسية والكتب المؤثرة"
    },
    {
      icon: Brain,
      title: "تحليل الاتجاهات",
      description: "رصد الاتجاهات الناشئة والمواضيع الرائجة"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" dir="rtl">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.45, 0.25]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/15 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-2 border-primary/20 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-l from-primary via-secondary to-accent" />
              
              <CardHeader className="text-center pb-4 pt-12 bg-gradient-to-br from-primary/5 to-secondary/5">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mx-auto mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
                    <Construction className="h-24 w-24 text-primary relative z-10 mx-auto" />
                  </div>
                </motion.div>
                
                <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-l from-primary to-secondary bg-clip-text text-transparent mb-4">
                  المحرر الذكي
                </CardTitle>
                
                <CardDescription className="text-2xl font-semibold text-foreground mb-2">
                  صفحة قيد التطوير
                </CardDescription>
                
                <CardDescription className="text-lg max-w-2xl mx-auto leading-relaxed">
                  نعمل حالياً على تطوير خدمة المحرر الذكي لتقديم أفضل تجربة للباحثين في اختيار المجلات والمؤتمرات العلمية
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8 md:p-12">
                {/* Coming Soon Banner */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="bg-gradient-to-l from-primary/10 to-secondary/10 border-2 border-primary/30 rounded-2xl p-8 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-primary mb-3">
                      قريباً... خدمة متقدمة بالذكاء الاصطناعي
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      سيتم تفعيل المحرر الذكي قريباً لمساعدتك في العثور على أفضل المجلات العلمية، 
                      المؤتمرات العالمية، والمراجع الأكاديمية المناسبة لبحثك
                    </p>
                  </div>
                </motion.div>

                {/* Features Grid */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-center text-primary mb-8">
                    الميزات القادمة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * index }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Card className="h-full border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-gradient-to-br from-white to-primary/5">
                          <CardContent className="p-6 text-center">
                            <motion.div
                              animate={{ 
                                y: [0, -8, 0],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ 
                                duration: 4, 
                                repeat: Infinity,
                                delay: index * 0.3
                              }}
                            >
                              <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                            </motion.div>
                            <h4 className="font-bold text-lg mb-2 text-foreground">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Info Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="bg-secondary/5 border border-secondary/20 rounded-xl p-6 mb-8"
                >
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg text-secondary mb-2">
                        هل تحتاج المساعدة الآن؟
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        يمكنك التواصل معنا عبر صفحة الاتصال للحصول على استشارة مخصصة حول خدماتنا البحثية الأخرى
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link to="/research-services" className="flex-1 sm:flex-initial">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-l from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                      استكشف خدماتنا البحثية
                    </Button>
                  </Link>
                  
                  <Link to="/contact" className="flex-1 sm:flex-initial">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full border-2 border-primary hover:bg-primary/5 font-bold"
                    >
                      <Mail className="ml-2 h-5 w-5" />
                      تواصل معنا
                    </Button>
                  </Link>

                  <Link to="/" className="flex-1 sm:flex-initial">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full border-2 border-secondary hover:bg-secondary/5 font-bold"
                    >
                      <Home className="ml-2 h-5 w-5" />
                      العودة للرئيسية
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="border-primary/20 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <p className="text-sm text-muted-foreground">مجلة ومؤتمر في قاعدة البيانات</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-secondary mb-2">99%</div>
                <p className="text-sm text-muted-foreground">دقة في اختيار المجلات المناسبة</p>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">خدمة متاحة على مدار الساعة</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SmartEditor;
