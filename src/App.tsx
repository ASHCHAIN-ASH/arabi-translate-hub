import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageThemeProvider from "./components/PageThemeProvider";
import { SimpleAuthProvider } from "@/components/SimpleAuthProvider";
import SimpleProtectedRoute from "@/components/SimpleProtectedRoute";
import SimpleLogin from "./pages/SimpleLogin";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
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
import Unauthorized from "./pages/Unauthorized";

// Client Pages
import ClientDashboard from "./pages/client/Dashboard";
import ClientServices from "./pages/client/ClientServices";
import Orders from "./pages/client/Orders";
import OrderNew from "./pages/client/OrderNew";
import OrderDetails from "./pages/client/OrderDetails";
import OrderEdit from "./pages/client/OrderEdit";
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
import EmailNotifications from "./pages/admin/EmailNotifications";

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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SimpleAuthProvider>
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
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Client Dashboard Routes */}
            <Route path="/dashboard" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientDashboard />
              </SimpleProtectedRoute>
            } />
            <Route path="/client/services" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientServices />
              </SimpleProtectedRoute>
            } />
            <Route path="/orders" element={
              <SimpleProtectedRoute requiredRole="client">
                <Orders />
              </SimpleProtectedRoute>
            } />
            <Route path="/orders/new" element={
              <SimpleProtectedRoute requiredRole="client">
                <OrderNew />
              </SimpleProtectedRoute>
            } />
            <Route path="/orders/:id" element={
              <SimpleProtectedRoute requiredRole="client">
                <OrderDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/orders/:id/edit" element={
              <SimpleProtectedRoute requiredRole="client">
                <OrderEdit />
              </SimpleProtectedRoute>
            } />
            <Route path="/billing/invoices" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientInvoices />
              </SimpleProtectedRoute>
            } />
            <Route path="/support/tickets" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientTickets />
              </SimpleProtectedRoute>
            } />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={
              <SimpleProtectedRoute adminOnly>
                <AdminDashboard />
              </SimpleProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <SimpleProtectedRoute adminOnly>
                <AdminServices />
              </SimpleProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <SimpleProtectedRoute adminOnly>
                <AdminOrders />
              </SimpleProtectedRoute>
            } />
            <Route path="/admin/invoices" element={
              <SimpleProtectedRoute adminOnly>
                <AdminInvoices />
              </SimpleProtectedRoute>
            } />
            <Route path="/admin/transactions" element={
              <SimpleProtectedRoute adminOnly>
                <AdminTransactions />
              </SimpleProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <SimpleProtectedRoute adminOnly>
                <AdminUsers />
              </SimpleProtectedRoute>
            } />
            <Route path="/admin/tickets" element={
              <SimpleProtectedRoute adminOnly>
                <AdminTickets />
              </SimpleProtectedRoute>
            } />
            <Route path="/admin/email-notifications" element={
              <SimpleProtectedRoute adminOnly>
                <EmailNotifications />
              </SimpleProtectedRoute>
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
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </PageThemeProvider>
        </SimpleAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;