import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageThemeProvider from "./components/PageThemeProvider";
import { TenantProvider } from "@/components/TenantProvider";
import { MultiTenantAuthProvider } from "@/components/MultiTenantAuthProvider";
import MultiTenantProtectedRoute from "@/components/MultiTenantProtectedRoute";
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
import MultiTenantLogin from "./pages/auth/MultiTenantLogin";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Unauthorized from "./pages/Unauthorized";

// Client Pages
import ClientDashboard from "./pages/client/Dashboard";
import Orders from "./pages/client/Orders";
import OrderNew from "./pages/client/OrderNew";
import OrderDetails from "./pages/client/OrderDetails";
import ClientInvoices from "./pages/client/Invoices";
import ClientTickets from "./pages/client/Tickets";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTickets from "./pages/admin/AdminTickets";

import ThesisTitles from "./pages/research/ThesisTitles";
import ResearchPlan from "./pages/research/ResearchPlan";
import TheoreticalFrameworkPage from "./pages/research/TheoreticalFrameworkPage";
import TheoreticalFramework from "./pages/research/TheoreticalFramework";
import StatisticalAnalysis from "./pages/research/StatisticalAnalysis";
import LanguageReview from "./pages/research/LanguageReview";
import Formatting from "./pages/research/Formatting";
import PlagiarismCheck from "./pages/research/PlagiarismCheck";
import AdmissionServices from "./pages/research/AdmissionServices";
import References from "./pages/research/References";
import ResearchTools from "./pages/research/ResearchTools";
import TextTranslation from "./pages/services/TextTranslation";
import DocumentTranslation from "./pages/services/DocumentTranslation";
import AudioTranslation from "./pages/services/AudioTranslation";
import WebsiteTranslation from "./pages/services/WebsiteTranslation";
import VideoTranslation from "./pages/services/VideoTranslation";
import CustomServices from "./pages/services/CustomServices";
import ResearchEvaluation from "./pages/research/ResearchEvaluation";
import Publication from "./pages/research/Publication";
import AcademicConsultation from "./pages/research/AcademicConsultation";
import TrainingCourses from "./pages/research/TrainingCourses";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ColorShowcase from "./pages/ColorShowcase";
import OrderTracking from "./pages/OrderTracking";
import SubmitOrder from "./pages/SubmitOrder";
import ContractManagement from "./pages/ContractManagement";
import ClientContractApproval from "./pages/ClientContractApproval";
import AccountingDashboard from "./pages/admin/AccountingDashboard";
import EsignManagement from "./pages/admin/EsignManagement";
import WhatsappManagement from "./pages/admin/WhatsappManagement";
import EsignPortal from "./pages/EsignPortal";
import ContractRequest from "./pages/ContractRequest";

import ClientContracts from "./pages/ClientContracts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TenantProvider>
          <MultiTenantAuthProvider>
            <PageThemeProvider>
          <Routes>
            {/* Public Routes */}
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
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/submit-order" element={<SubmitOrder />} />
            <Route path="/color-showcase" element={<ColorShowcase />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<MultiTenantLogin />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Client Dashboard Routes */}
            <Route path="/dashboard" element={
              <MultiTenantProtectedRoute requiredRole="client">
                <ClientDashboard />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/orders" element={
              <MultiTenantProtectedRoute requiredRole="client">
                <Orders />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/orders/new" element={
              <MultiTenantProtectedRoute requiredRole="client">
                <OrderNew />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <MultiTenantProtectedRoute requiredRole="client">
                <OrderDetails />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/billing/invoices" element={
              <MultiTenantProtectedRoute requiredRole="client">
                <ClientInvoices />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/support/tickets" element={
              <MultiTenantProtectedRoute requiredRole="client">
                <ClientTickets />
              </MultiTenantProtectedRoute>
            } />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={
              <MultiTenantProtectedRoute adminOnly>
                <AdminDashboard />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <MultiTenantProtectedRoute adminOnly>
                <AdminServices />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <MultiTenantProtectedRoute adminOnly>
                <AdminOrders />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/admin/invoices" element={
              <MultiTenantProtectedRoute adminOnly>
                <AdminInvoices />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/admin/transactions" element={
              <MultiTenantProtectedRoute adminOnly>
                <AdminTransactions />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <MultiTenantProtectedRoute adminOnly>
                <AdminUsers />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/admin/tickets" element={
              <MultiTenantProtectedRoute adminOnly>
                <AdminTickets />
              </MultiTenantProtectedRoute>
            } />
            
            {/* Research Routes */}
            <Route path="/research/thesis-titles" element={<ThesisTitles />} />
            <Route path="/research/research-plan" element={<ResearchPlan />} />
            <Route path="/research/theoretical-framework" element={<TheoreticalFrameworkPage />} />
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
            
            {/* Service Routes */}
            <Route path="/services/text-translation" element={<TextTranslation />} />
            <Route path="/services/document-translation" element={<DocumentTranslation />} />
            <Route path="/services/audio-translation" element={<AudioTranslation />} />
            <Route path="/services/website-translation" element={<WebsiteTranslation />} />
            <Route path="/services/video-translation" element={<VideoTranslation />} />
            <Route path="/services/custom-services" element={<CustomServices />} />
            
            {/* Protected Client Routes */}
            <Route path="/contract-request" element={
              <MultiTenantProtectedRoute requiredRole="client">
                <ContractRequest />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/client/contracts" element={
              <MultiTenantProtectedRoute requiredRole="client">
                <ClientContracts />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/contract-approval" element={
              <MultiTenantProtectedRoute requiredRole="client">
                <ClientContractApproval />
              </MultiTenantProtectedRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/contracts" element={
              <MultiTenantProtectedRoute adminOnly>
                <ContractManagement />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/admin/accounting" element={
              <MultiTenantProtectedRoute adminOnly>
                <AccountingDashboard />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/admin/esign" element={
              <MultiTenantProtectedRoute adminOnly>
                <EsignManagement />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/admin/whatsapp" element={
              <MultiTenantProtectedRoute adminOnly>
                <WhatsappManagement />
              </MultiTenantProtectedRoute>
            } />
            <Route path="/esign/:token" element={<EsignPortal />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </PageThemeProvider>
          </MultiTenantAuthProvider>
        </TenantProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
