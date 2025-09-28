import React from 'react';
import Header from "@/components/Header";
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
    </div>
  );
};

export default ResearchServices;