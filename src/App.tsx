import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageThemeProvider from "./components/PageThemeProvider";
import { SimpleAuthProvider } from "@/components/SimpleAuthProvider";
import SimpleProtectedRoute from "@/components/SimpleProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import ContentProtection from "@/components/ContentProtection";
import SimpleLogin from "./pages/SimpleLogin";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminLogin from "./pages/auth/AdminLogin";
import JournalPublication from "./pages/research/JournalPublication";
import AcademicExpertise from "./pages/academic/AcademicExpertise";
import ScientificMethodology from "./pages/academic/ScientificMethodology";
import MultilingualTranslation from "./pages/academic/MultilingualTranslation";
import QualityAssurance from "./pages/academic/QualityAssurance";
import PrivacySecurity from "./pages/academic/PrivacySecurity";
import TimelineCommitment from "./pages/academic/TimelineCommitment";
import OrderNow from "./pages/OrderNow";
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
import AcademicResearch from "./pages/research/AcademicResearch";
import ScientificResearch from "./pages/research/ScientificResearch";
import BusinessResearch from "./pages/research/BusinessResearch";
import SocialResearch from "./pages/research/SocialResearch";
import LegalResearch from "./pages/research/LegalResearch";
import MedicalResearch from "./pages/research/MedicalResearch";
import AboutUs from "./pages/AboutUs";
import AcademicCompetitions from "./pages/AcademicCompetitions";
import Unauthorized from "./pages/Unauthorized";
import MasterMembership from "./pages/MasterMembership";
import FAQ from "./pages/FAQ";
import SuccessStories from "./pages/SuccessStories";
import ClientGuide from "./pages/ClientGuide";

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
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminServiceOrders from "./pages/admin/AdminServiceOrders";
import EmailNotifications from "./pages/admin/EmailNotifications";
import AddUser from "./pages/admin/AddUser";
import AdminWorkingHours from "./pages/admin/AdminWorkingHours";
import ContractsSystem from "./pages/admin/ContractsSystem";

import ThesisTitles from "./pages/research/ThesisTitles";
import AnnotatedPublishing from './pages/research/AnnotatedPublishing';
import ResearchPlan from "./pages/research/ResearchPlan";
import TheoreticalFrameworkPage from "./pages/research/TheoreticalFrameworkPage";
import TheoreticalFramework from "./pages/research/TheoreticalFramework";
import StatisticalAnalysis from "./pages/research/StatisticalAnalysis";
import LanguageReview from "./pages/research/LanguageReview";
import Formatting from "./pages/research/Formatting";
import PlagiarismCheck from "./pages/research/PlagiarismCheck";
import AdmissionServices from "./pages/AdmissionServices";
import References from "./pages/research/References";
import GlobalPeerReview from "./pages/research/GlobalPeerReview";
import AiMethodologyReview from "./pages/research/AiMethodologyReview";
import SmartEditor from "./pages/research/SmartEditor";
import ResearchTools from "./pages/research/ResearchTools";
import TextTranslation from "./pages/services/TextTranslation";
import DocumentTranslation from "./pages/services/DocumentTranslation";
import AudioTranslation from "./pages/services/AudioTranslation";
import WebsiteTranslation from "./pages/services/WebsiteTranslation";
import VideoTranslation from "./pages/services/VideoTranslation";
import CustomServices from "./pages/services/CustomServices";
import TranslationServicesDetail from "./pages/services/TranslationServices";
import EditingServices from "./pages/services/EditingServices";
import LanguageProofreading from "./pages/services/editing/LanguageProofreading";
import AcademicReview from "./pages/services/editing/AcademicReview";
import DevelopmentalEditing from "./pages/services/editing/DevelopmentalEditing";
import TechnicalEditing from "./pages/services/editing/TechnicalEditing";
import StyleReview from "./pages/services/editing/StyleReview";
import FinalProofreading from "./pages/services/editing/FinalProofreading";
import AcademicWritingServices from "./pages/services/AcademicWritingServices";
import ConsultationServices from "./pages/services/ConsultationServices";
import StatisticalAnalysisServices from "./pages/services/StatisticalAnalysisServices";
import PublishingServices from "./pages/services/PublishingServices";
import Services from "./pages/Services";
import ResearchEvaluation from "./pages/research/ResearchEvaluation";
import Publication from "./pages/research/Publication";
import AcademicConsultation from "./pages/research/AcademicConsultation";
import TrainingCourses from "./pages/research/TrainingCourses";
import ResearchServicesHub from "./pages/research/ResearchServicesHub";
import AcademicWritingService from "./pages/research/AcademicWritingService";
import ProofreadingService from "./pages/research/ProofreadingService";
import StatisticalSpssService from "./pages/research/StatisticalSpssService";
import ProposalService from "./pages/research/ProposalService";
import PowerPointService from "./pages/research/PowerPointService";
import PaperReviewService from "./pages/research/PaperReviewService";
import ConsultationService from "./pages/research/ConsultationService";
import ResearchJourney from "./pages/research/ResearchJourney";
import OrderForm from "./components/OrderForm";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ColorShowcase from "./pages/ColorShowcase";
import Pricing from "./pages/Pricing";
import OrderTracking from "./pages/OrderTracking";
import SubmitOrder from "./pages/SubmitOrder";
import NotFound from "./pages/NotFound";
import IntellectualProperty from "./pages/IntellectualProperty";
import AcademicIntegrity from "./pages/AcademicIntegrity";
import LicenseRequest from "./pages/LicenseRequest";
import Careers from "./pages/Careers";
import ContactUs from "./pages/ContactUs";
import PaymentMethods from "./pages/PaymentMethods";
import Universities from "./pages/Universities";
import JournalsDirectory from "./pages/JournalsDirectory";
import AgencyUpdates from "./pages/AgencyUpdates";
import Announcements from "./pages/updates/Announcements";
import Achievements from "./pages/updates/Achievements";
import Partnerships from "./pages/updates/Partnerships";
import InstitutionalPartnerships from "./pages/InstitutionalPartnerships";
import ContractManagement from "./pages/ContractManagement";
import Footer from "./components/Footer";
import BackToTopButton from "./components/BackToTopButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SimpleAuthProvider>
          <PageThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/order-now" element={<OrderNow />} />
            <Route path="/services" element={<Services />} />
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
            <Route path="/research/academic" element={<AcademicResearch />} />
            <Route path="/research/scientific" element={<ScientificResearch />} />
            <Route path="/research/business" element={<BusinessResearch />} />
            <Route path="/research/social" element={<SocialResearch />} />
            <Route path="/research/legal" element={<LegalResearch />} />
            <Route path="/research/medical" element={<MedicalResearch />} />
            
            {/* Research Services Hub */}
            <Route path="/research/services-hub" element={<ResearchServicesHub />} />
            <Route path="/research/academic-writing-service" element={<AcademicWritingService />} />
            <Route path="/research/proofreading-service" element={<ProofreadingService />} />
            <Route path="/research/statistical-spss-service" element={<StatisticalSpssService />} />
            <Route path="/research/proposal-service" element={<ProposalService />} />
            <Route path="/research/powerpoint-service" element={<PowerPointService />} />
            <Route path="/research/paper-review-service" element={<PaperReviewService />} />
            <Route path="/research/consultation-service" element={<ConsultationService />} />
            <Route path="/research/journey" element={<ResearchJourney />} />
            
            <Route path="/about-us" element={<AboutUs />} />
             <Route path="/terms-of-service" element={<TermsOfService />} />
             <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/master-membership" element={<MasterMembership />} />
             <Route path="/faq" element={<FAQ />} />
             <Route path="/academic-competitions" element={<AcademicCompetitions />} />
             <Route path="/client-guide" element={<ClientGuide />} />
             <Route path="/order-tracking" element={<OrderTracking />} />
             <Route path="/submit-order" element={<OrderForm />} />
             <Route path="/color-showcase" element={<ColorShowcase />} />
             <Route path="/pricing" element={<Pricing />} />
            <Route path="/intellectual-property" element={<IntellectualProperty />} />
            <Route path="/academic-integrity" element={<AcademicIntegrity />} />
            <Route path="/updates" element={<AgencyUpdates />} />
            <Route path="/agency-updates" element={<AgencyUpdates />} />
            <Route path="/updates/announcements" element={<Announcements />} />
            <Route path="/updates/achievements" element={<Achievements />} />
            <Route path="/updates/partnerships" element={<Partnerships />} />
           <Route path="/institutional-partnerships" element={<InstitutionalPartnerships />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/journals" element={<JournalsDirectory />} />
            <Route path="/contract-management" element={<ContractManagement />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/license-request" element={<LicenseRequest />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/adminmaster/login" element={<AdminLogin />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Client Dashboard Routes */}
            <Route path="/dashboard" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientDashboard />
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
            <Route path="/invoices" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientInvoices />
              </SimpleProtectedRoute>
            } />
            <Route path="/support/tickets" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientTickets />
              </SimpleProtectedRoute>
            } />
            
            {/* Admin Dashboard Routes - Hidden Path */}
            <Route path="/adminmaster" element={
              <SimpleProtectedRoute adminOnly>
                <AdminDashboard />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/contracts" element={
              <SimpleProtectedRoute adminOnly>
                <ContractsSystem />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/services" element={
              <SimpleProtectedRoute adminOnly>
                <AdminServices />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/service-orders" element={
              <SimpleProtectedRoute adminOnly>
                <AdminServiceOrders />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/orders" element={
              <SimpleProtectedRoute adminOnly>
                <AdminOrders />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/invoices" element={
              <SimpleProtectedRoute adminOnly>
                <AdminInvoices />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/transactions" element={
              <SimpleProtectedRoute adminOnly>
                <AdminTransactions />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/users" element={
              <SimpleProtectedRoute adminOnly>
                <AdminUsers />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/customers" element={
              <SimpleProtectedRoute adminOnly>
                <AdminCustomers />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/add-user" element={
              <SimpleProtectedRoute adminOnly>
                <AddUser />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/tickets" element={
              <SimpleProtectedRoute adminOnly>
                <AdminTickets />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/email-notifications" element={
              <SimpleProtectedRoute adminOnly>
                <EmailNotifications />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/working-hours" element={
              <SimpleProtectedRoute adminOnly>
                <AdminWorkingHours />
              </SimpleProtectedRoute>
            } />
            
            {/* Academic Pages */}
            <Route path="/academic/expertise" element={<AcademicExpertise />} />
            <Route path="/academic/methodology" element={<ScientificMethodology />} />
            <Route path="/academic/translation" element={<AcademicTranslation />} />
            <Route path="/academic/quality" element={<QualityAssurance />} />
            <Route path="/academic/security" element={<PrivacySecurity />} />
            <Route path="/academic/timeline" element={<TimelineCommitment />} />

            {/* Research Routes */}
            <Route path="/research/thesis-titles" element={<ThesisTitles />} />
            <Route path="/research/research-plan" element={<ResearchPlan />} />
            <Route path="/research/theoretical-framework" element={<TheoreticalFrameworkPage />} />
            <Route path="/research/statistical-analysis" element={<StatisticalAnalysis />} />
            <Route path="/research/language-review" element={<LanguageReview />} />
            <Route path="/research/formatting" element={<Formatting />} />
            <Route path="/research/plagiarism-check" element={<PlagiarismCheck />} />
            <Route path="/research/admission-services" element={<AdmissionServices />} />
            <Route path="/admission-services" element={<AdmissionServices />} />
            <Route path="/research/references" element={<References />} />
            <Route path="/research/research-tools" element={<ResearchTools />} />
            <Route path="/research/research-evaluation" element={<ResearchEvaluation />} />
            <Route path="/research/publication" element={<Publication />} />
            <Route path="/research/journal-publication" element={<JournalPublication />} />
          <Route path="/research/global-peer-review" element={<GlobalPeerReview />} />
          <Route path="/research/ai-methodology-review" element={<AiMethodologyReview />} />
        <Route path="/research/smart-editor" element={<SmartEditor />} />
        <Route path="/research/annotated-publishing" element={<AnnotatedPublishing />} />
            <Route path="/research/academic-consultation" element={<AcademicConsultation />} />
            <Route path="/research/training-courses" element={<TrainingCourses />} />
            
            {/* Service Routes */}
            <Route path="/services/text-translation" element={<TextTranslation />} />
            <Route path="/services/document-translation" element={<DocumentTranslation />} />
            <Route path="/services/audio-translation" element={<AudioTranslation />} />
            <Route path="/services/website-translation" element={<WebsiteTranslation />} />
            <Route path="/services/video-translation" element={<VideoTranslation />} />
            <Route path="/services/custom-services" element={<CustomServices />} />
            
            {/* Professional Service Detail Routes */}
            <Route path="/services/translation-services" element={<TranslationServicesDetail />} />
            <Route path="/services/editing-services" element={<EditingServices />} />
            <Route path="/services/academic-writing" element={<AcademicWritingServices />} />
            <Route path="/services/consultation-services" element={<ConsultationServices />} />
            <Route path="/services/statistical-analysis" element={<StatisticalAnalysisServices />} />
            <Route path="/services/publishing-services" element={<PublishingServices />} />
            
            {/* Editing Service Detail Routes */}
            <Route path="/services/editing/language-proofreading" element={<LanguageProofreading />} />
            <Route path="/services/editing/academic-review" element={<AcademicReview />} />
            <Route path="/services/editing/developmental-editing" element={<DevelopmentalEditing />} />
            <Route path="/services/editing/technical-editing" element={<TechnicalEditing />} />
            <Route path="/services/editing/style-review" element={<StyleReview />} />
            <Route path="/services/editing/final-proofreading" element={<FinalProofreading />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <BackToTopButton />
          </PageThemeProvider>
        </SimpleAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;