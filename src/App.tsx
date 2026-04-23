import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import PageThemeProvider from "./components/PageThemeProvider";
import { SimpleAuthProvider } from "@/components/SimpleAuthProvider";
import SimpleProtectedRoute from "@/components/SimpleProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import ContentProtection from "@/components/ContentProtection";
import LoginWelcomeOverlay from "@/components/LoginWelcomeOverlay";
import ReferralTracker from "@/components/marketing/ReferralTracker";
import MarketingHub from "@/pages/MarketingHub";
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
import PaymentReturn from "./pages/PaymentReturn";
import ContractSignByToken from "./pages/ContractSignByToken";

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
import SpinTheWheel from "./pages/SpinTheWheel";
import Unauthorized from "./pages/Unauthorized";
import MasterMembership from "./pages/MasterMembership";
import FAQ from "./pages/FAQ";
import SuccessStories from "./pages/SuccessStories";
import ClientGuide from "./pages/ClientGuide";

// Client Pages
import ClientDashboard from "./pages/client/Dashboard";
import ClientServices from "./pages/client/ClientServices";
import ServiceDetail from "./pages/client/ServiceDetail";
import Orders from "./pages/client/Orders";
import OrderNew from "./pages/client/OrderNew";
import OrderDetails from "./pages/client/OrderDetails";
import OrderEdit from "./pages/client/OrderEdit";
import ClientInvoices from "./pages/client/Invoices";
import ClientTickets from "./pages/client/Tickets";
import ClientTicketDetails from "./pages/client/TicketDetails";
import NewTicket from "./pages/client/NewTicket";
import ClientWallet from "./pages/client/Wallet";
import Marketplace from "./pages/client/Marketplace";
import MarketplaceRewards from "./pages/client/MarketplaceRewards";
import WalletTopup from "./pages/client/WalletTopup";
import InvoicePayment from "./pages/client/InvoicePayment";
import GroupOrders from "./pages/client/GroupOrders";
import GroupOrderNew from "./pages/client/GroupOrderNew";
import GroupOrderDetails from "./pages/client/GroupOrderDetails";
import GroupOrderJoin from "./pages/client/GroupOrderJoin";
import MembershipPage from "./pages/client/MembershipPage";
import ReferralsPage from "./pages/client/ReferralsPage";
import RewardsPage from "./pages/client/Rewards";
import ChallengeAcademy from "./pages/client/ChallengeAcademy";
import BattleQuizHome from "./pages/battle-quiz/BattleQuizHome";
import BattleQuizPlay from "./pages/battle-quiz/BattleQuizPlay";
import BattleQuizResult from "./pages/battle-quiz/BattleQuizResult";
import BattleQuizLeaderboard from "./pages/battle-quiz/BattleQuizLeaderboard";
import BattleQuiz1v1Lobby from "./pages/battle-quiz/BattleQuiz1v1Lobby";
import BattleQuiz1v1Play from "./pages/battle-quiz/BattleQuiz1v1Play";
import BattleQuiz1v1Result from "./pages/battle-quiz/BattleQuiz1v1Result";
import BattleQuiz1v1Leaderboard from "./pages/battle-quiz/BattleQuiz1v1Leaderboard";
import BattleQuiz1v1Invite from "./pages/battle-quiz/BattleQuiz1v1Invite";
import StudentHub from "./pages/client/StudentHub";
import MindMapPage from "./pages/client/MindMapPage";
import TracksPage from "./pages/client/TracksPage";
import TrackDetailPage from "./pages/client/TrackDetailPage";
import TrackToolPage from "./pages/client/TrackToolPage";
import AcademicCVPage from "./pages/client/AcademicCVPage";
import StudentStatisticalAnalysis from "./pages/client/StudentStatisticalAnalysis";
import AdminMemberships from "./pages/admin/AdminMemberships";
import AdminReferrals from "./pages/admin/AdminReferrals";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import FinancingAdmin from "./pages/admin/FinancingAdmin";
import AdminServices from "./pages/admin/AdminServices";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminInvoiceDetails from "./pages/admin/AdminInvoiceDetails";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminFinancial from "./pages/admin/AdminFinancial";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminCustomerDetails from "./pages/admin/AdminCustomerDetails";
import AdminCustomerEmail from "./pages/admin/AdminCustomerEmail";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminTicketDetails from "./pages/admin/AdminTicketDetails";
import AdminServiceOrders from "./pages/admin/AdminServiceOrders";
import AdminServiceOrderDetails from "./pages/admin/AdminServiceOrderDetails";
import EmailNotifications from "./pages/admin/EmailNotifications";
import AdminInbox from "./pages/admin/AdminInbox";
import AdminChat from "./pages/admin/AdminChat";
import AddUser from "./pages/admin/AddUser";
import AdminWorkingHours from "./pages/admin/AdminWorkingHours";
import AdminWallets from "./pages/admin/AdminWallets";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminGamification from "./pages/admin/AdminGamification";
import AdminXpConversionReport from "./pages/admin/AdminXpConversionReport";
import AdminMarketplaceFunnel from "./pages/admin/AdminMarketplaceFunnel";
import AdminGrowthAnalytics from "./pages/admin/AdminGrowthAnalytics";
import AdminGrowthAutomation from "./pages/admin/AdminGrowthAutomation";
import AdminGrowthAutomationRules from "./pages/admin/AdminGrowthAutomationRules";
import AdminExperiments from "./pages/admin/AdminExperiments";
import AdminExperimentDetail from "./pages/admin/AdminExperimentDetail";
import AdminAssessments from "./pages/admin/AdminAssessments";
import AdminBattleQuiz from "./pages/admin/AdminBattleQuiz";
import AdminQuestionBank from "./pages/admin/AdminQuestionBank";
import QuizBank from "./pages/QuizBank";
import QuizBankResults from "./pages/QuizBankResults";
import QuizBankBrowse from "./pages/QuizBankBrowse";
import QuizBankSubject from "./pages/QuizBankSubject";
import QuizBankAccount from "./pages/QuizBankAccount";
import AssessmentsList from "./pages/academic/AssessmentsList";
import AssessmentStart from "./pages/academic/AssessmentStart";
import AssessmentResult from "./pages/academic/AssessmentResult";
import ContractsSystem from "./pages/admin/ContractsSystem";
import AdminContractDetails from "./pages/admin/AdminContractDetails";
import ContractsAnalytics from "./pages/admin/ContractsAnalytics";
import AdminStudentResources from "./pages/admin/AdminStudentResources";
import WhatsappInboxPage from "./pages/admin/whatsapp/WhatsappInboxPage";
import WhatsappCampaignsPage from "./pages/admin/whatsapp/WhatsappCampaignsPage";
import WhatsappAnalyticsPage from "./pages/admin/whatsapp/WhatsappAnalyticsPage";
import StudentLibrary from "./pages/client/StudentLibrary";
import ClientContracts from "./pages/ClientContracts";
import ClientResearchPublication from "./pages/client/ResearchPublication";
import AdminResearchPublications from "./pages/admin/AdminResearchPublications";
import AdminResearchContracts from "./pages/admin/AdminResearchContracts";
import AdminResearchContractDetails from "./pages/admin/AdminResearchContractDetails";
import AdminResearchPublicationDetails from "./pages/admin/AdminResearchPublicationDetails";
import ClientContractView from "./pages/ClientContractView";
import FinancingHome from "./pages/client/FinancingHome";
import FinancingNew from "./pages/client/FinancingNew";
import FinancingDetails from "./pages/client/FinancingDetails";

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
import Workspace from "./pages/workspace/Workspace";
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
import OtherStudentServices from "./pages/research/OtherStudentServices";
import BookSummarization from "./pages/research/BookSummarization";
import AssignmentExecution from "./pages/research/AssignmentExecution";
import EbookCreation from "./pages/research/EbookCreation";
import ResearchProposalService from "./pages/research/ResearchProposalService";
import ReferencesProvision from "./pages/research/ReferencesProvision";
import HomeworkAssistance from "./pages/research/HomeworkAssistance";
import ResearchJourney from "./pages/research/ResearchJourney";
import OrderForm from "./components/OrderForm";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ColorShowcase from "./pages/ColorShowcase";
import Pricing from "./pages/Pricing";
import OrderTracking from "./pages/OrderTracking";
import SubmitOrder from "./pages/SubmitOrder";
import NotFound from "./pages/NotFound";
import Unsubscribe from "./pages/Unsubscribe";
import IntellectualProperty from "./pages/IntellectualProperty";
import AcademicIntegrity from "./pages/AcademicIntegrity";
import LicenseRequest from "./pages/LicenseRequest";
import Careers from "./pages/Careers";
import ContactUs from "./pages/ContactUs";
import PaymentMethods from "./pages/PaymentMethods";
import Universities from "./pages/Universities";
import JournalsDirectory from "./pages/JournalsDirectory";
import InstitutionalPartnerships from "./pages/InstitutionalPartnerships";
import Footer from "./components/Footer";
import BackToTopButton from "./components/BackToTopButton";

const queryClient = new QueryClient();

const LegacyContractRedirect = () => {
  const { id } = useParams();

  return <Navigate to={id ? `/client/contracts/${id}` : "/client/contracts"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SimpleAuthProvider>
          <ReferralTracker />
          <LoginWelcomeOverlay />
          <PageThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/marketing-hub" element={<MarketingHub />} />
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
            <Route path="/research/other-student-services" element={<OtherStudentServices />} />
            
            {/* Other Student Services */}
            <Route path="/research/book-summarization" element={<BookSummarization />} />
            <Route path="/research/assignment-execution" element={<AssignmentExecution />} />
            <Route path="/research/ebook-creation" element={<EbookCreation />} />
            <Route path="/research/research-proposal" element={<ResearchProposalService />} />
            <Route path="/research/references-provision" element={<ReferencesProvision />} />
            <Route path="/research/homework-assistance" element={<HomeworkAssistance />} />
            
            <Route path="/research/journey" element={<ResearchJourney />} />
            
            <Route path="/about-us" element={<AboutUs />} />
             <Route path="/terms-of-service" element={<TermsOfService />} />
             <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/master-membership" element={<MasterMembership />} />
             <Route path="/faq" element={<FAQ />} />
             <Route path="/academic-competitions" element={<AcademicCompetitions />} />
             <Route path="/spin-the-wheel" element={<SpinTheWheel />} />
             <Route path="/client-guide" element={<ClientGuide />} />
             <Route path="/order-tracking" element={<OrderTracking />} />
             <Route path="/submit-order" element={<OrderForm />} />
             <Route path="/color-showcase" element={<ColorShowcase />} />
             <Route path="/pricing" element={<Pricing />} />
            <Route path="/intellectual-property" element={<IntellectualProperty />} />
            <Route path="/academic-integrity" element={<AcademicIntegrity />} />
           <Route path="/institutional-partnerships" element={<InstitutionalPartnerships />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/payment/return" element={<PaymentReturn />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/journals" element={<JournalsDirectory />} />
            <Route path="/contract-management" element={<Navigate to="/client/contracts" replace />} />
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
            <Route path="/client/dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientDashboard />
              </SimpleProtectedRoute>
            } />
            <Route path="/client-services" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientServices />
              </SimpleProtectedRoute>
            } />
            <Route path="/client-services/:id" element={
              <SimpleProtectedRoute requiredRole="client">
                <ServiceDetail />
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
            <Route path="/support/tickets/new" element={
              <SimpleProtectedRoute requiredRole="client">
                <NewTicket />
              </SimpleProtectedRoute>
            } />
            <Route path="/support/tickets/:id" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientTicketDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/wallet" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientWallet />
              </SimpleProtectedRoute>
            } />
            <Route path="/marketplace" element={
              <SimpleProtectedRoute requiredRole="client">
                <Marketplace />
              </SimpleProtectedRoute>
            } />
            <Route path="/marketplace/rewards" element={
              <SimpleProtectedRoute requiredRole="client">
                <MarketplaceRewards />
              </SimpleProtectedRoute>
            } />
            <Route path="/wallet/topup" element={
              <SimpleProtectedRoute requiredRole="client">
                <WalletTopup />
              </SimpleProtectedRoute>
            } />
            <Route path="/invoices/:invoiceId/pay" element={
              <SimpleProtectedRoute requiredRole="client">
                <InvoicePayment />
              </SimpleProtectedRoute>
            } />

            {/* Group Orders */}
            <Route path="/group-orders" element={
              <SimpleProtectedRoute requiredRole="client"><GroupOrders /></SimpleProtectedRoute>
            } />
            <Route path="/group-orders/new" element={
              <SimpleProtectedRoute requiredRole="client"><GroupOrderNew /></SimpleProtectedRoute>
            } />
            <Route path="/group-orders/join/:code" element={
              <SimpleProtectedRoute requiredRole="client"><GroupOrderJoin /></SimpleProtectedRoute>
            } />
            <Route path="/group-orders/:id" element={
              <SimpleProtectedRoute requiredRole="client"><GroupOrderDetails /></SimpleProtectedRoute>
            } />
            
            {/* Admin Dashboard Routes - Hidden Path */}
            <Route path="/adminmaster" element={
              <SimpleProtectedRoute adminOnly>
                <AdminDashboard />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/financing" element={
              <SimpleProtectedRoute adminOnly>
                <FinancingAdmin />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/contracts" element={
              <SimpleProtectedRoute adminOnly>
                <ContractsSystem />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/contracts/analytics" element={
              <SimpleProtectedRoute adminOnly>
                <ContractsAnalytics />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/contracts/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminContractDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/contracts" element={
              <LegacyContractRedirect />
            } />
            <Route path="/client/contracts" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientContracts />
              </SimpleProtectedRoute>
            } />
            <Route path="/financing" element={
              <SimpleProtectedRoute requiredRole="client">
                <FinancingHome />
              </SimpleProtectedRoute>
            } />
            <Route path="/financing/new" element={
              <SimpleProtectedRoute requiredRole="client">
                <FinancingNew />
              </SimpleProtectedRoute>
            } />
            <Route path="/contracts/:id" element={
              <LegacyContractRedirect />
            } />
            <Route path="/contracts/sign/:token" element={<ContractSignByToken />} />
            <Route path="/client/contracts/:id" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientContractView />
              </SimpleProtectedRoute>
            } />
            <Route path="/client/research" element={
              <SimpleProtectedRoute requiredRole="client">
                <ClientResearchPublication />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/research" element={
              <SimpleProtectedRoute adminOnly>
                <AdminResearchPublications />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/research/contracts" element={
              <SimpleProtectedRoute adminOnly>
                <AdminResearchContracts />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/research/contracts/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminResearchContractDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/research/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminResearchPublicationDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/services" element={
              <SimpleProtectedRoute adminOnly>
                <AdminServices />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/student-resources" element={
              <SimpleProtectedRoute adminOnly>
                <AdminStudentResources />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/service-orders" element={
              <SimpleProtectedRoute adminOnly>
                <AdminServiceOrders />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/service-orders/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminServiceOrderDetails />
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
            <Route path="/adminmaster/invoices/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminInvoiceDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/transactions" element={
              <SimpleProtectedRoute adminOnly>
                <AdminTransactions />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/financial" element={
              <SimpleProtectedRoute adminOnly>
                <AdminFinancial />
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
            <Route path="/adminmaster/customers/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminCustomerDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/customers/:id/email" element={
              <SimpleProtectedRoute adminOnly>
                <AdminCustomerEmail />
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
            <Route path="/adminmaster/tickets/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminTicketDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/inbox" element={
              <SimpleProtectedRoute adminOnly>
                <AdminInbox />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/email-notifications" element={
              <SimpleProtectedRoute adminOnly>
                <EmailNotifications />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/chat" element={
              <SimpleProtectedRoute adminOnly>
                <AdminChat />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/working-hours" element={
              <SimpleProtectedRoute adminOnly>
                <AdminWorkingHours />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/wallets" element={
              <SimpleProtectedRoute adminOnly>
                <AdminWallets />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/payments" element={
              <SimpleProtectedRoute adminOnly>
                <AdminPayments />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/gamification" element={
              <SimpleProtectedRoute adminOnly>
                <AdminGamification />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/xp-conversion-report" element={
              <SimpleProtectedRoute adminOnly>
                <AdminXpConversionReport />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/marketplace-funnel" element={
              <SimpleProtectedRoute adminOnly>
                <AdminMarketplaceFunnel />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/memberships" element={
              <SimpleProtectedRoute adminOnly>
                <AdminMemberships />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/referrals" element={
              <SimpleProtectedRoute adminOnly>
                <AdminReferrals />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/growth" element={
              <SimpleProtectedRoute adminOnly>
                <AdminGrowthAnalytics />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/growth/automation" element={
              <SimpleProtectedRoute adminOnly>
                <AdminGrowthAutomation />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/growth/automation/rules" element={
              <SimpleProtectedRoute adminOnly>
                <AdminGrowthAutomationRules />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/experiments" element={
              <SimpleProtectedRoute adminOnly>
                <AdminExperiments />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/experiments/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminExperimentDetail />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/assessments" element={
              <SimpleProtectedRoute adminOnly>
                <AdminAssessments />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/battle-quiz" element={
              <SimpleProtectedRoute adminOnly>
                <AdminBattleQuiz />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/question-bank" element={
              <SimpleProtectedRoute adminOnly>
                <AdminQuestionBank />
              </SimpleProtectedRoute>
            } />
            <Route path="/quiz-bank" element={
              <SimpleProtectedRoute requiredRole="client">
                <QuizBank />
              </SimpleProtectedRoute>
            } />
            <Route path="/quiz-bank/browse" element={
              <SimpleProtectedRoute requiredRole="client">
                <QuizBankBrowse />
              </SimpleProtectedRoute>
            } />
            <Route path="/quiz-bank/subject/:id" element={
              <SimpleProtectedRoute requiredRole="client">
                <QuizBankSubject />
              </SimpleProtectedRoute>
            } />
            <Route path="/quiz-bank/account" element={
              <SimpleProtectedRoute requiredRole="client">
                <QuizBankAccount />
              </SimpleProtectedRoute>
            } />
            <Route path="/quiz-bank/results" element={
              <SimpleProtectedRoute requiredRole="client">
                <QuizBankResults />
              </SimpleProtectedRoute>
            } />
            <Route path="/challenge-academy/assessments" element={<AssessmentsList />} />
            <Route path="/challenge-academy/assessments/:id/start" element={<AssessmentStart />} />
            <Route path="/challenge-academy/assessments/:id/result" element={<AssessmentResult />} />
            <Route path="/adminmaster/whatsapp" element={<Navigate to="/adminmaster/whatsapp/inbox" replace />} />
            <Route path="/adminmaster/whatsapp/inbox" element={
              <SimpleProtectedRoute adminOnly><WhatsappInboxPage /></SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/whatsapp/campaigns" element={
              <SimpleProtectedRoute adminOnly><WhatsappCampaignsPage /></SimpleProtectedRoute>
            } />
            <Route path="/adminmaster/whatsapp/analytics" element={
              <SimpleProtectedRoute adminOnly><WhatsappAnalyticsPage /></SimpleProtectedRoute>
            } />
            <Route path="/membership" element={
              <SimpleProtectedRoute>
                <MembershipPage />
              </SimpleProtectedRoute>
            } />
            <Route path="/referrals" element={
              <SimpleProtectedRoute>
                <ReferralsPage />
              </SimpleProtectedRoute>
            } />
            <Route path="/rewards" element={
              <SimpleProtectedRoute requiredRole="client">
                <RewardsPage />
              </SimpleProtectedRoute>
            } />
            <Route path="/challenge-academy" element={
              <SimpleProtectedRoute requiredRole="client">
                <ChallengeAcademy />
              </SimpleProtectedRoute>
            } />
            <Route path="/battle-quiz" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuizHome /></SimpleProtectedRoute>
            } />
            <Route path="/battle-quiz/leaderboard" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuizLeaderboard /></SimpleProtectedRoute>
            } />
            <Route path="/battle-quiz/:roomId/play" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuizPlay /></SimpleProtectedRoute>
            } />
            <Route path="/battle-quiz/:roomId/result" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuizResult /></SimpleProtectedRoute>
            } />
            <Route path="/battle-quiz/1v1" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuiz1v1Lobby /></SimpleProtectedRoute>
            } />
            <Route path="/battle-quiz/1v1/leaderboard" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuiz1v1Leaderboard /></SimpleProtectedRoute>
            } />
            <Route path="/battle-quiz/1v1/:matchId/play" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuiz1v1Play /></SimpleProtectedRoute>
            } />
            <Route path="/battle-quiz/1v1/:matchId/result" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuiz1v1Result /></SimpleProtectedRoute>
            } />
            <Route path="/battle-quiz/1v1/invite/:code" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuiz1v1Invite /></SimpleProtectedRoute>
            } />

            {/* ===== Battle Academy aliases (same components, friendlier URLs) ===== */}
            <Route path="/battle-academy" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuizHome /></SimpleProtectedRoute>
            } />
            <Route path="/battle-academy/leaderboard" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuizLeaderboard /></SimpleProtectedRoute>
            } />
            <Route path="/battle-academy/play/:roomId" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuizPlay /></SimpleProtectedRoute>
            } />
            <Route path="/battle-academy/result/:roomId" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuizResult /></SimpleProtectedRoute>
            } />
            <Route path="/battle-academy/1v1" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuiz1v1Lobby /></SimpleProtectedRoute>
            } />
            <Route path="/battle-academy/1v1/leaderboard" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuiz1v1Leaderboard /></SimpleProtectedRoute>
            } />
            <Route path="/battle-academy/1v1/play/:matchId" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuiz1v1Play /></SimpleProtectedRoute>
            } />
            <Route path="/battle-academy/1v1/result/:matchId" element={
              <SimpleProtectedRoute requiredRole="client"><BattleQuiz1v1Result /></SimpleProtectedRoute>
            } />
            <Route path="/student" element={
              <SimpleProtectedRoute requiredRole="client">
                <StudentHub />
              </SimpleProtectedRoute>
            } />
            <Route path="/student/mind-map" element={
              <SimpleProtectedRoute requiredRole="client">
                <MindMapPage />
              </SimpleProtectedRoute>
            } />
            <Route path="/student/tracks" element={
              <SimpleProtectedRoute requiredRole="client">
                <TracksPage />
              </SimpleProtectedRoute>
            } />
            <Route path="/student/tracks/:slug" element={
              <SimpleProtectedRoute requiredRole="client">
                <TrackDetailPage />
              </SimpleProtectedRoute>
            } />
            <Route path="/student/tracks/:trackSlug/tools/:toolSlug" element={
              <SimpleProtectedRoute requiredRole="client">
                <TrackToolPage />
              </SimpleProtectedRoute>
            } />
            <Route path="/student/academic-cv" element={
              <SimpleProtectedRoute requiredRole="client">
                <AcademicCVPage />
              </SimpleProtectedRoute>
            } />
            <Route path="/student/statistical-analysis" element={
              <SimpleProtectedRoute requiredRole="client">
                <StudentStatisticalAnalysis />
              </SimpleProtectedRoute>
            } />
            <Route path="/student/library" element={
              <SimpleProtectedRoute requiredRole="client">
                <StudentLibrary />
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
        <Route path="/workspace" element={<Workspace />} />
        {/* Redirects: الأدوات القديمة → Workspace الموحد */}
        <Route path="/research/smart-editor" element={<Navigate to="/workspace" replace />} />
        <Route path="/student-hub" element={<Navigate to="/workspace" replace />} />
        {/* النسخة القديمة للمحرر الذكي (احتياطي) */}
        <Route path="/research/smart-editor-legacy" element={<SmartEditor />} />
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
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BackToTopButton />
          </PageThemeProvider>
        </SimpleAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;