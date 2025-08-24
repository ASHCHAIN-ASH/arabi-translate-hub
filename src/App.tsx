import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageThemeProvider from "./components/PageThemeProvider";
import Index from "./pages/Index";
import TranslationServices from "./pages/TranslationServices";
import LegalTranslation from "./pages/LegalTranslation";
import BusinessTranslation from "./pages/BusinessTranslation";
import TechnicalTranslation from "./pages/TechnicalTranslation";
import MedicalTranslation from "./pages/MedicalTranslation";
import InstantTranslation from "./pages/InstantTranslation";
import MediaTranslation from "./pages/MediaTranslation";
import LiteraryTranslation from "./pages/LiteraryTranslation";
import AcademicTranslation from "./pages/AcademicTranslation";
import ResearchServices from "./pages/ResearchServices";
import AboutUs from "./pages/AboutUs";

import ThesisTitles from "./pages/research/ThesisTitles";
import ResearchPlan from "./pages/research/ResearchPlan";
import TheoreticalFramework from "./pages/research/TheoreticalFramework";
import StatisticalAnalysis from "./pages/research/StatisticalAnalysis";
import LanguageReview from "./pages/research/LanguageReview";
import Formatting from "./pages/research/Formatting";
import PlagiarismCheck from "./pages/research/PlagiarismCheck";
import AdmissionServices from "./pages/research/AdmissionServices";
import References from "./pages/research/References";
import ResearchTools from "./pages/research/ResearchTools";
import ResearchEvaluation from "./pages/research/ResearchEvaluation";
import Publication from "./pages/research/Publication";
import AcademicConsultation from "./pages/research/AcademicConsultation";
import TrainingCourses from "./pages/research/TrainingCourses";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ColorShowcase from "./pages/ColorShowcase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageThemeProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/translation-services" element={<TranslationServices />} />
          <Route path="/legal-translation" element={<LegalTranslation />} />
          <Route path="/business-translation" element={<BusinessTranslation />} />
          <Route path="/technical-translation" element={<TechnicalTranslation />} />
          <Route path="/medical-translation" element={<MedicalTranslation />} />
          <Route path="/instant-translation" element={<InstantTranslation />} />
          <Route path="/media-translation" element={<MediaTranslation />} />
          <Route path="/literary-translation" element={<LiteraryTranslation />} />
          <Route path="/academic-translation" element={<AcademicTranslation />} />
          <Route path="/research-services" element={<ResearchServices />} />
          <Route path="/about-us" element={<AboutUs />} />
          
          <Route path="/research/thesis-titles" element={<ThesisTitles />} />
          <Route path="/research/research-plan" element={<ResearchPlan />} />
          <Route path="/research/theoretical-framework" element={<TheoreticalFramework />} />
          <Route path="/research/statistical-analysis" element={<StatisticalAnalysis />} />
          <Route path="/research/language-review" element={<LanguageReview />} />
          <Route path="/research/formatting" element={<Formatting />} />
          <Route path="/research/plagiarism-check" element={<PlagiarismCheck />} />
          <Route path="/research/admission-services" element={<AdmissionServices />} />
          <Route path="/research/references" element={<References />} />
          <Route path="/research/research-tools" element={<ResearchTools />} />
          <Route path="/research/research-evaluation" element={<ResearchEvaluation />} />
          <Route path="/research/publication" element={<Publication />} />
          <Route path="/research/academic-consultation" element={<AcademicConsultation />} />
          <Route path="/research/training-courses" element={<TrainingCourses />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/color-showcase" element={<ColorShowcase />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </PageThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
