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
      
      {/* شعار اليوم الوطني السعودي المحسن */}
      <div className="relative overflow-hidden bg-gradient-national py-6 sm:py-8 md:py-10">
        {/* خلفية متحركة بألوان العلم */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-green-400 opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-yellow-400 via-transparent to-transparent opacity-30"></div>
          <div className="saudi-flag-wave absolute inset-0 opacity-20"></div>
        </div>
        
        {/* تأثيرات ضوئية متحركة */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-green-300/20 rounded-full blur-2xl animate-national-pride"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-20">
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* شعار عزنا بطبعنا */}
            <motion.div
              className="relative"
              animate={{ 
                scale: [1, 1.05, 1],
                filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img 
                src="/national-day-logo.webp" 
                alt="عزنا بطبعنا - اليوم الوطني السعودي ٩٥"
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto mx-auto drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-golden-shine"></div>
            </motion.div>
            
            {/* نص اليوم الوطني */}
            <motion.div 
              className="space-y-2 sm:space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white font-arabic-title leading-tight"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 30px rgba(255,255,255,0.8)", 
                    "0 0 20px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🇸🇦 اليوم الوطني السعودي ٩٥ 🇸🇦
              </motion.h1>
              
              <motion.div
                className="flex items-center justify-center gap-2 sm:gap-4"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full"></div>
                <motion.span 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-100 golden-text font-arabic-title px-3 sm:px-4"
                  animate={{
                    scale: [1, 1.1, 1],
                    color: ["#fef3c7", "#fbbf24", "#fef3c7"]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  عزنا بطبعنا
                </motion.span>
                <div className="h-1 w-8 sm:w-12 bg-gradient-to-l from-yellow-400 to-yellow-300 rounded-full"></div>
              </motion.div>
            </motion.div>
            
            {/* نص فرعي */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-white/95 font-medium max-w-2xl mx-auto leading-relaxed font-arabic-body px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              💚 نحتفل بوطننا الغالي ونفخر بتراثنا وإنجازاتنا العظيمة 💚
              <br />
              <span className="text-yellow-200 font-bold text-sm sm:text-base">🏛️ رؤية ٢٠٣٠ تقودنا نحو مستقبل مشرق ومزدهر 🏛️</span>
            </motion.p>
            
            {/* أيقونات متحركة */}
            <motion.div 
              className="flex items-center justify-center gap-4 sm:gap-6 mt-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {['🌟', '🎊', '🎉', '👑', '🕌'].map((emoji, i) => (
                <motion.div
                  key={i}
                  className="text-2xl sm:text-3xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2 + i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3,
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* تأثير الذهب المتحرك */}
        <div className="absolute bottom-0 left-0 right-0 h-2">
          <div className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 animate-golden-shine"></div>
        </div>
        
        {/* نجوم متناثرة */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white text-xs sm:text-sm opacity-60"
              style={{
                left: `${10 + i * 8}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.9, 0.3],
                scale: [0.8, 1.3, 0.8],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
        
        {/* خط زخرفي سفلي */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
          <div className="h-0.5 bg-gradient-to-r from-green-600 via-white to-green-600 mt-1"></div>
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