import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import AcademicHeroSection from "@/components/AcademicHeroSection";
import AcademicFeatures from "@/components/AcademicFeatures";
import AcademicStats from "@/components/AcademicStats";
import ServiceSteps from "@/components/ServiceSteps";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* القسم الرئيسي الأكاديمي الجديد */}
      <AcademicHeroSection />

      {/* قسم المميزات الأكاديمية */}
      <AcademicFeatures />

      {/* قسم الإحصائيات الأكاديمية */}
      <AcademicStats />

      {/* قسم مراحل تنفيذ الخدمة */}
      <ServiceSteps />

      {/* قسم الخدمات */}
      <ServicesSection />

      {/* دعوة للعمل النهائية */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-arabic-formal font-bold"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              هل أنت مستعد للبدء؟
            </motion.h2>
            <motion.p 
              className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              انضم إلى آلاف العملاء الذين يثقون في خدماتنا. احصل على خدمة تعليمية احترافية الآن!
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-slate-800 hover:bg-gray-100 shadow-xl px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300"
              >
                احصل على استشارة مجانية
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300"
              >
                تواصل مع فريق الخبراء
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;