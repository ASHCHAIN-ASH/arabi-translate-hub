import React, { Suspense, lazy } from 'react';
import Header from "@/components/Header";
import { ResearchHeroSection } from "@/components/research/ResearchHeroSection";

// Lazy load heavy components for better performance
const ResearchServicesGrid = lazy(() => 
  import("@/components/research/ResearchServicesGrid").then(module => ({ 
    default: module.ResearchServicesGrid 
  }))
);
const ResearchProcess = lazy(() => 
  import("@/components/research/ResearchProcess").then(module => ({ 
    default: module.ResearchProcess 
  }))
);

// Loading component
const LoadingSection = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const ResearchServices = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <ResearchHeroSection />
      
      <Suspense fallback={<LoadingSection />}>
        <ResearchServicesGrid />
      </Suspense>
      
      <Suspense fallback={<LoadingSection />}>
        <ResearchProcess />
      </Suspense>
    </div>
  );
};

export default ResearchServices;