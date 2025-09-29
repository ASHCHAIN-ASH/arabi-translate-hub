import Header from "@/components/Header";
import ServicesShowcase from "@/components/ServicesShowcase";
import AcademicHeroSection from "@/components/AcademicHeroSection";
import AcademicFeatures from "@/components/AcademicFeatures";
import AcademicStats from "@/components/AcademicStats";
import ServiceSteps from "@/components/ServiceSteps";
import MasterMembershipBanner from "@/components/MasterMembershipBanner";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import { WorkingHoursBannerRTL } from "@/components/WorkingHoursBannerRTL";
import { Bot, Bell } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <WorkingHoursBannerRTL />
      
      {/* Alert Banner for AI Methodology Review */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-l from-blue-600 to-purple-600 text-white py-4 px-4 relative overflow-hidden"
        dir="rtl"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/90 to-purple-600/90" />
        <div className="container mx-auto relative">
          <div className="flex items-center justify-center gap-4 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bell className="h-6 w-6 text-yellow-300" />
            </motion.div>
            <div className="flex-1">
              <p className="text-lg font-semibold mb-1">
                🤖 خدمة جديدة: المراجعة المنهجية بالذكاء الاصطناعي
              </p>
              <p className="text-sm opacity-90">
                قم برفع بحثك واحصل على مراجعة شاملة فورية. سيتم التواصل معك لعرض السعر عبر الواتساب أو البريد الإلكتروني.
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => navigate('/research/ai-methodology-review')}
              >
                <Bot className="ml-2 h-4 w-4" />
                جرب الآن
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      <Header />
      
      {/* القسم الرئيسي الأكاديمي الجديد */}
      <AcademicHeroSection />

      {/* بنر عضوية ماستر */}
      <MasterMembershipBanner />

      {/* قسم المميزات الأكاديمية */}
      <AcademicFeatures />

      {/* قسم الإحصائيات الأكاديمية */}
      <AcademicStats />

      {/* قسم مراحل تنفيذ الخدمة */}
      <ServiceSteps />

      {/* قسم مزايا الخدمات */}
      <ServicesShowcase />

    </div>
  );
};

export default Index;