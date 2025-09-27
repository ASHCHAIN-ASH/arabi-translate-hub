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

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <WorkingHoursBannerRTL />
      
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