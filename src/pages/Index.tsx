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
      
      {/* شعار اليوم الوطني السعودي */}
      <div className="relative overflow-hidden bg-gradient-national py-4 sm:py-6">
        <div className="absolute inset-0 saudi-flag-wave opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            className="flex items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-2xl sm:text-3xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🇸🇦
            </motion.div>
            <motion.h1 
              className="text-lg sm:text-xl md:text-2xl font-bold golden-text font-arabic-title"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              عزنا بطبعنا - اليوم الوطني السعودي ٩٤
            </motion.h1>
            <motion.div
              className="text-2xl sm:text-3xl"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              🎉
            </motion.div>
          </motion.div>
          <motion.p 
            className="text-sm sm:text-base text-white mt-2 opacity-90 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            فخورون بوطننا العزيز وإنجازاته العظيمة 💚
          </motion.p>
        </div>
        
        {/* تأثير النجوم المتحركة */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-300 text-xs sm:text-sm"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </div>
      
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