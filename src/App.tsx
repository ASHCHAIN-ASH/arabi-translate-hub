import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageThemeProvider from "./components/PageThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TenantGuard } from "@/components/TenantGuard";
import { TenantBadge } from "@/components/TenantBadge";
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
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
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
        <TenantGuard>
          <AuthProvider>
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
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Client Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute requiredRole="client">
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/orders/new" element={
              <ProtectedRoute requiredRole="client">
                <OrderNew />
              </ProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <ProtectedRoute requiredRole="client">
                <OrderDetails />
              </ProtectedRoute>
            } />
            <Route path="/billing/invoices" element={
              <ProtectedRoute requiredRole="client">
                <ClientInvoices />
              </ProtectedRoute>
            } />
            <Route path="/support/tickets" element={
              <ProtectedRoute requiredRole="client">
                <ClientTickets />
              </ProtectedRoute>
            } />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <TenantBadge />
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <ProtectedRoute requiredRole="admin">
                <AdminServices />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute requiredRole="admin">
                <AdminOrders />
              </ProtectedRoute>
            } />
            <Route path="/admin/invoices" element={
              <ProtectedRoute requiredRole="admin">
                <AdminInvoices />
              </ProtectedRoute>
            } />
            <Route path="/admin/transactions" element={
              <ProtectedRoute requiredRole="admin">
                <AdminTransactions />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/tickets" element={
              <ProtectedRoute requiredRole="admin">
                <AdminTickets />
              </ProtectedRoute>
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
              <ProtectedRoute requiredRole="client">
                <ContractRequest />
              </ProtectedRoute>
            } />
            <Route path="/client/contracts" element={
              <ProtectedRoute requiredRole="client">
                <ClientContracts />
              </ProtectedRoute>
            } />
            <Route path="/contract-approval" element={
              <ProtectedRoute requiredRole="client">
                <ClientContractApproval />
              </ProtectedRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/contracts" element={
              <ProtectedRoute requiredRole="admin">
                <ContractManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/accounting" element={
              <ProtectedRoute requiredRole="admin">
                <AccountingDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/esign" element={
              <ProtectedRoute requiredRole="admin">
                <EsignManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/whatsapp" element={
              <ProtectedRoute requiredRole="admin">
                <WhatsappManagement />
              </ProtectedRoute>
            } />
            <Route path="/esign/:token" element={<EsignPortal />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
            </PageThemeProvider>
          </AuthProvider>
        </TenantGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
