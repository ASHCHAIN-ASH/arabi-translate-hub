import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ResearchHeroSection } from "@/components/research/ResearchHeroSection";
import { ResearchServicesGrid } from "@/components/research/ResearchServicesGrid";
import { ResearchProcess } from "@/components/research/ResearchProcess";

const ResearchServices = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ResearchHeroSection />
      <ResearchServicesGrid />
      <ResearchProcess />
      <Footer />
    </div>
  );
};

export default ResearchServices;