import React from 'react';
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Construction,
  Bot,
  FileText,
  Sparkles,
  ArrowRight,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from '@/components/Footer';

const AiMethodologyReview = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <Header />
      
      <div className="container mx-auto px-4 py-20" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Card */}
          <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-12 text-center relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
              
              <div className="relative z-10">
                {/* Icon Animation */}
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-8 flex justify-center gap-4"
                >
                  <div className="relative">
                    <Construction className="h-24 w-24 text-amber-500" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="h-8 w-8 text-yellow-500" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-l from-amber-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent"
                >
                  صفحة قيد التطوير
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 mb-6"
                >
                  <Bot className="h-6 w-6 text-primary animate-pulse" />
                  <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
                    المراجعة المنهجية بالذكاء الاصطناعي
                  </h2>
                  <FileText className="h-6 w-6 text-secondary animate-pulse" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                >
                  نعمل حالياً على تطوير هذه الخدمة المتقدمة لتوفير تحليل شامل ومراجعة دقيقة للأبحاث العلمية باستخدام أحدث تقنيات الذكاء الاصطناعي
                </motion.p>
              </div>
            </div>

            <CardContent className="p-12">
              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center p-6 rounded-lg bg-primary/5 border border-primary/20"
                >
                  <Bot className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">تحليل ذكي</h3>
                  <p className="text-sm text-muted-foreground">
                    مراجعة شاملة باستخدام الذكاء الاصطناعي المتقدم
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center p-6 rounded-lg bg-secondary/5 border border-secondary/20"
                >
                  <FileText className="h-12 w-12 text-secondary mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">تقارير احترافية</h3>
                  <p className="text-sm text-muted-foreground">
                    تقرير مفصل بصيغة PDF مع التوصيات
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center p-6 rounded-lg bg-accent/5 border border-accent/20"
                >
                  <Clock className="h-12 w-12 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold text-lg mb-2">سرعة الإنجاز</h3>
                  <p className="text-sm text-muted-foreground">
                    نتائج سريعة مع دقة عالية في التحليل
                  </p>
                </motion.div>
              </div>

              {/* Coming Soon Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-l from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-400/50 rounded-xl p-8 text-center mb-8"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8 text-amber-600 animate-pulse" />
                  <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                    قريباً جداً بإذن الله
                  </h3>
                  <Sparkles className="h-8 w-8 text-amber-600 animate-pulse" />
                </div>
                <p className="text-amber-800 dark:text-amber-300 text-lg">
                  سنقوم بإطلاق هذه الخدمة المميزة في أقرب وقت ممكن
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/research-services">
                  <Button size="lg" className="w-full sm:w-auto group">
                    <span>استكشف خدماتنا الأخرى</span>
                    <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    تواصل معنا للاستفسار
                  </Button>
                </Link>
              </motion.div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-muted-foreground mt-8"
          >
            للمزيد من المعلومات أو الاستفسارات، يرجى{" "}
            <Link to="/contact" className="text-primary hover:underline font-semibold">
              التواصل معنا
            </Link>
          </motion.p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AiMethodologyReview;