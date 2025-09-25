import Header from "@/components/Header";
import ServicesShowcase from "@/components/ServicesShowcase";
import AcademicHeroSection from "@/components/AcademicHeroSection";
import AcademicFeatures from "@/components/AcademicFeatures";
import AcademicStats from "@/components/AcademicStats";
import ServiceSteps from "@/components/ServiceSteps";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <WorkingHoursBannerRTL />
      
      <Header />
      
      {/* القسم الرئيسي الأكاديمي الجديد */}
      <AcademicHeroSection />

      {/* قسم المميزات الأكاديمية */}
      <AcademicFeatures />

      {/* قسم الإحصائيات الأكاديمية */}
      <AcademicStats />

      {/* قسم مراحل تنفيذ الخدمة */}
      <ServiceSteps />

      {/* قسم مزايا الخدمات */}
      <ServicesShowcase />

      {/* دعوة للعمل النهائية - بألوان اليوم الوطني */}
      <section className="py-16 lg:py-20 bg-gradient-national text-white relative overflow-hidden">
        <div className="absolute inset-0 saudi-flag-wave opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl sm:text-4xl animate-national-pride">🇸🇦</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-arabic-title font-bold golden-text">
                هل أنت مستعد للبدء؟
              </h2>
              <div className="text-3xl sm:text-4xl animate-national-pride">👑</div>
            </motion.div>
            <motion.p 
              className="text-lg sm:text-xl text-white leading-relaxed max-w-3xl mx-auto font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              🌟 انضم إلى آلاف العملاء الذين يثقون في خدماتنا 🌟<br/>
              <span className="golden-text font-bold">احصل على خدمة تعليمية احترافية بمعايير سعودية عالية!</span>
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
                className="w-full sm:w-auto bg-white text-green-800 hover:bg-green-50 shadow-xl px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300 national-day-card border-2 border-green-700"
                onClick={() => navigate('/services')}
              >
                🎯 تصفح خدماتنا المميزة
              </Button>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-white text-green-800 hover:bg-green-50 shadow-xl px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300 national-day-card border-2 border-green-700"
                onClick={() => navigate('/login')}
              >
                👤 تسجيل دخول العملاء
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2 border-yellow-400 text-yellow-100 bg-yellow-600/20 hover:bg-yellow-600/30 px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300 golden-shine"
                onClick={() => navigate('/register')}
              >
                ✨ إنشاء حساب جديد
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;