import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import PageThemeProvider from "./components/PageThemeProvider";
import { SimpleAuthProvider } from "@/components/SimpleAuthProvider";
import SimpleProtectedRoute from "@/components/SimpleProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import RouteIndexingGuard from "@/components/RouteIndexingGuard";
import ContentProtection from "@/components/ContentProtection";
import LoginWelcomeOverlay from "@/components/LoginWelcomeOverlay";
import ReferralTracker from "@/components/marketing/ReferralTracker";
import DeferredGlobalFeatures from "@/components/DeferredGlobalFeatures";

const SimpleLogin = lazy(() => import("./pages/SimpleLogin"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const AuthConfirm = lazy(() => import("./pages/auth/AuthConfirm"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));
const JournalPublication = lazy(() => import("./pages/research/JournalPublication"));
const AcademicExpertise = lazy(() => import("./pages/academic/AcademicExpertise"));
const ScientificMethodology = lazy(() => import("./pages/academic/ScientificMethodology"));
const MultilingualTranslation = lazy(() => import("./pages/academic/MultilingualTranslation"));
const QualityAssurance = lazy(() => import("./pages/academic/QualityAssurance"));
const PrivacySecurity = lazy(() => import("./pages/academic/PrivacySecurity"));
const TimelineCommitment = lazy(() => import("./pages/academic/TimelineCommitment"));
const OrderNow = lazy(() => import("./pages/OrderNow"));
const Index = lazy(() => import("./pages/Index"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const PaymentReturn = lazy(() => import("./pages/PaymentReturn"));
const ContractSignByToken = lazy(() => import("./pages/ContractSignByToken"));

const TranslationServices = lazy(() => import("./pages/TranslationServices"));
const LegalTranslation = lazy(() => import("./pages/LegalTranslation"));
const BusinessTranslation = lazy(() => import("./pages/BusinessTranslation"));
const TechnicalTranslation = lazy(() => import("./pages/TechnicalTranslation"));
const MedicalTranslation = lazy(() => import("./pages/MedicalTranslation"));
const InstantTranslation = lazy(() => import("./pages/InstantTranslation"));
const MediaTranslation = lazy(() => import("./pages/MediaTranslation"));
const LiteraryTranslation = lazy(() => import("./pages/LiteraryTranslation"));
const AcademicTranslation = lazy(() => import("./pages/AcademicTranslation"));
const ResearchServices = lazy(() => import("./pages/ResearchServices"));
const AcademicResearch = lazy(() => import("./pages/research/AcademicResearch"));
const ScientificResearch = lazy(() => import("./pages/research/ScientificResearch"));
const BusinessResearch = lazy(() => import("./pages/research/BusinessResearch"));
const SocialResearch = lazy(() => import("./pages/research/SocialResearch"));
const LegalResearch = lazy(() => import("./pages/research/LegalResearch"));
const MedicalResearch = lazy(() => import("./pages/research/MedicalResearch"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const AcademicCompetitions = lazy(() => import("./pages/AcademicCompetitions"));
const SpinTheWheel = lazy(() => import("./pages/SpinTheWheel"));
const StudyToEarn = lazy(() => import("./pages/StudyToEarn"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const FekrahEduMembership = lazy(() => import("./pages/FekrahEduMembership"));
const FAQ = lazy(() => import("./pages/FAQ"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const ClientGuide = lazy(() => import("./pages/ClientGuide"));

// Client Pages
const ClientDashboard = lazy(() => import("./pages/client/Dashboard"));
const ClientServices = lazy(() => import("./pages/client/ClientServices"));
const ServiceDetail = lazy(() => import("./pages/client/ServiceDetail"));
const Orders = lazy(() => import("./pages/client/Orders"));
const OrderNew = lazy(() => import("./pages/client/OrderNew"));
const OrderDetails = lazy(() => import("./pages/client/OrderDetails"));
const OrderEdit = lazy(() => import("./pages/client/OrderEdit"));
const ClientInvoices = lazy(() => import("./pages/client/Invoices"));
const ClientTickets = lazy(() => import("./pages/client/Tickets"));
const ClientTicketDetails = lazy(() => import("./pages/client/TicketDetails"));
const NewTicket = lazy(() => import("./pages/client/NewTicket"));
const ClientWallet = lazy(() => import("./pages/client/Wallet"));
const WalletTopup = lazy(() => import("./pages/client/WalletTopup"));
const InvoicePayment = lazy(() => import("./pages/client/InvoicePayment"));
const GroupOrders = lazy(() => import("./pages/client/GroupOrders"));
const GroupOrderNew = lazy(() => import("./pages/client/GroupOrderNew"));
const GroupOrderDetails = lazy(() => import("./pages/client/GroupOrderDetails"));
const GroupOrderJoin = lazy(() => import("./pages/client/GroupOrderJoin"));
const MembershipPage = lazy(() => import("./pages/client/MembershipPage"));
const ReferralsPage = lazy(() => import("./pages/client/ReferralsPage"));


const AdminMemberships = lazy(() => import("./pages/admin/AdminMemberships"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminReferrals = lazy(() => import("./pages/admin/AdminReferrals"));

// Admin Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const FinancingAdmin = lazy(() => import("./pages/admin/FinancingAdmin"));
const FinancingAdminDetails = lazy(() => import("./pages/admin/FinancingAdminDetails"));
const FinancingAuditTrail = lazy(() => import("./pages/admin/FinancingAuditTrail"));
const VerifyContract = lazy(() => import("./pages/VerifyContract"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminInvoices = lazy(() => import("./pages/admin/AdminInvoices"));
const AdminInvoiceDetails = lazy(() => import("./pages/admin/AdminInvoiceDetails"));
const AdminTransactions = lazy(() => import("./pages/admin/AdminTransactions"));
const AdminFinancial = lazy(() => import("./pages/admin/AdminFinancial"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCustomerDetails = lazy(() => import("./pages/admin/AdminCustomerDetails"));
const AdminCustomerEmail = lazy(() => import("./pages/admin/AdminCustomerEmail"));
const AdminTickets = lazy(() => import("./pages/admin/AdminTickets"));
const AdminTicketDetails = lazy(() => import("./pages/admin/AdminTicketDetails"));
const AdminServiceOrders = lazy(() => import("./pages/admin/AdminServiceOrders"));
const AdminServiceOrderDetails = lazy(() => import("./pages/admin/AdminServiceOrderDetails"));
const EmailNotifications = lazy(() => import("./pages/admin/EmailNotifications"));
const AdminInbox = lazy(() => import("./pages/admin/AdminInbox"));
const AdminChat = lazy(() => import("./pages/admin/AdminChat"));
const AddUser = lazy(() => import("./pages/admin/AddUser"));
const AdminWorkingHours = lazy(() => import("./pages/admin/AdminWorkingHours"));
const AdminChangelog = lazy(() => import("./pages/admin/AdminChangelog"));
const AdminWallets = lazy(() => import("./pages/admin/AdminWallets"));
const AdminWithdrawals = lazy(() => import("./pages/admin/AdminWithdrawals"));
const AdminPayments = lazy(() => import("./pages/admin/AdminPayments"));

const AdminGrowthAnalytics = lazy(() => import("./pages/admin/AdminGrowthAnalytics"));
const AdminGrowthAutomation = lazy(() => import("./pages/admin/AdminGrowthAutomation"));
const AdminGrowthAutomationRules = lazy(() => import("./pages/admin/AdminGrowthAutomationRules"));
const AdminExperiments = lazy(() => import("./pages/admin/AdminExperiments"));
const AdminExperimentDetail = lazy(() => import("./pages/admin/AdminExperimentDetail"));
const AdminAssessments = lazy(() => import("./pages/admin/AdminAssessments"));


const AssessmentsList = lazy(() => import("./pages/academic/AssessmentsList"));
const LegacyStudentRedirect = lazy(() => import("./pages/LegacyStudentRedirect"));
const AssessmentStart = lazy(() => import("./pages/academic/AssessmentStart"));
const AssessmentResult = lazy(() => import("./pages/academic/AssessmentResult"));
const ContractsSystem = lazy(() => import("./pages/admin/ContractsSystem"));
const AdminContractDetails = lazy(() => import("./pages/admin/AdminContractDetails"));
const ContractsAnalytics = lazy(() => import("./pages/admin/ContractsAnalytics"));

const WhatsappInboxPage = lazy(() => import("./pages/admin/whatsapp/WhatsappInboxPage"));
const WhatsappCampaignsPage = lazy(() => import("./pages/admin/whatsapp/WhatsappCampaignsPage"));
const WhatsappAnalyticsPage = lazy(() => import("./pages/admin/whatsapp/WhatsappAnalyticsPage"));

const ClientContracts = lazy(() => import("./pages/ClientContracts"));
const ClientResearchPublication = lazy(() => import("./pages/client/ResearchPublication"));
const AdminResearchPublications = lazy(() => import("./pages/admin/AdminResearchPublications"));
const AdminResearchContracts = lazy(() => import("./pages/admin/AdminResearchContracts"));
const AdminResearchContractDetails = lazy(() => import("./pages/admin/AdminResearchContractDetails"));
const AdminResearchPublicationDetails = lazy(() => import("./pages/admin/AdminResearchPublicationDetails"));
const ClientContractView = lazy(() => import("./pages/ClientContractView"));
const FinancingComingSoon = lazy(() => import("./pages/FinancingComingSoon"));
const FinancingNew = lazy(() => import("./pages/client/FinancingNew"));
const FinancingDetails = lazy(() => import("./pages/client/FinancingDetails"));
const FinancingAcknowledgments = lazy(() => import("./pages/client/FinancingAcknowledgments"));
const DownPaymentStatus = lazy(() => import("./pages/client/DownPaymentStatus"));

const ThesisTitles = lazy(() => import("./pages/research/ThesisTitles"));
const AnnotatedPublishing = lazy(() => import("./pages/research/AnnotatedPublishing"));
const ResearchPlan = lazy(() => import("./pages/research/ResearchPlan"));
const TheoreticalFrameworkPage = lazy(() => import("./pages/research/TheoreticalFrameworkPage"));
const TheoreticalFramework = lazy(() => import("./pages/research/TheoreticalFramework"));
const StatisticalAnalysis = lazy(() => import("./pages/research/StatisticalAnalysis"));
const LanguageReview = lazy(() => import("./pages/research/LanguageReview"));
const Formatting = lazy(() => import("./pages/research/Formatting"));
const PlagiarismCheck = lazy(() => import("./pages/research/PlagiarismCheck"));
const AdmissionServices = lazy(() => import("./pages/AdmissionServices"));
const References = lazy(() => import("./pages/research/References"));
const GlobalPeerReview = lazy(() => import("./pages/research/GlobalPeerReview"));
const AiMethodologyReview = lazy(() => import("./pages/research/AiMethodologyReview"));
const SmartEditor = lazy(() => import("./pages/research/SmartEditor"));
const Workspace = lazy(() => import("./pages/workspace/Workspace"));
const ResearchTools = lazy(() => import("./pages/research/ResearchTools"));
const TextTranslation = lazy(() => import("./pages/services/TextTranslation"));
const DocumentTranslation = lazy(() => import("./pages/services/DocumentTranslation"));
const AudioTranslation = lazy(() => import("./pages/services/AudioTranslation"));
const WebsiteTranslation = lazy(() => import("./pages/services/WebsiteTranslation"));
const VideoTranslation = lazy(() => import("./pages/services/VideoTranslation"));
const CustomServices = lazy(() => import("./pages/services/CustomServices"));
const TranslationServicesDetail = lazy(() => import("./pages/services/TranslationServices"));
const EditingServices = lazy(() => import("./pages/services/EditingServices"));
const LanguageProofreading = lazy(() => import("./pages/services/editing/LanguageProofreading"));
const AcademicReview = lazy(() => import("./pages/services/editing/AcademicReview"));
const DevelopmentalEditing = lazy(() => import("./pages/services/editing/DevelopmentalEditing"));
const TechnicalEditing = lazy(() => import("./pages/services/editing/TechnicalEditing"));
const StyleReview = lazy(() => import("./pages/services/editing/StyleReview"));
const FinalProofreading = lazy(() => import("./pages/services/editing/FinalProofreading"));
const AcademicWritingServices = lazy(() => import("./pages/services/AcademicWritingServices"));
const ConsultationServices = lazy(() => import("./pages/services/ConsultationServices"));
const StatisticalAnalysisServices = lazy(() => import("./pages/services/StatisticalAnalysisServices"));
const PublishingServices = lazy(() => import("./pages/services/PublishingServices"));
const Services = lazy(() => import("./pages/Services"));
const ResearchEvaluation = lazy(() => import("./pages/research/ResearchEvaluation"));
const Publication = lazy(() => import("./pages/research/Publication"));
const AcademicConsultation = lazy(() => import("./pages/research/AcademicConsultation"));
const TrainingCourses = lazy(() => import("./pages/research/TrainingCourses"));
const ResearchServicesHub = lazy(() => import("./pages/research/ResearchServicesHub"));
const AcademicWritingService = lazy(() => import("./pages/research/AcademicWritingService"));
const ProofreadingService = lazy(() => import("./pages/research/ProofreadingService"));
const StatisticalSpssService = lazy(() => import("./pages/research/StatisticalSpssService"));
const ProposalService = lazy(() => import("./pages/research/ProposalService"));
const PowerPointService = lazy(() => import("./pages/research/PowerPointService"));
const PaperReviewService = lazy(() => import("./pages/research/PaperReviewService"));
const ConsultationService = lazy(() => import("./pages/research/ConsultationService"));
const OtherStudentServices = lazy(() => import("./pages/research/OtherStudentServices"));
const BookSummarization = lazy(() => import("./pages/research/BookSummarization"));
const AssignmentExecution = lazy(() => import("./pages/research/AssignmentExecution"));
const EbookCreation = lazy(() => import("./pages/research/EbookCreation"));
const ResearchProposalService = lazy(() => import("./pages/research/ResearchProposalService"));
const ReferencesProvision = lazy(() => import("./pages/research/ReferencesProvision"));
const HomeworkAssistance = lazy(() => import("./pages/research/HomeworkAssistance"));
const ResearchJourney = lazy(() => import("./pages/research/ResearchJourney"));
const OrderForm = lazy(() => import("./components/OrderForm"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const ColorShowcase = lazy(() => import("./pages/ColorShowcase"));
const ThemePreview = lazy(() => import("./pages/ThemePreview"));
const Pricing = lazy(() => import("./pages/Pricing"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const SubmitOrder = lazy(() => import("./pages/SubmitOrder"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const IntellectualProperty = lazy(() => import("./pages/IntellectualProperty"));
const AcademicIntegrity = lazy(() => import("./pages/AcademicIntegrity"));
const LicenseRequest = lazy(() => import("./pages/LicenseRequest"));
const Careers = lazy(() => import("./pages/Careers"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const PaymentMethods = lazy(() => import("./pages/PaymentMethods"));
const Universities = lazy(() => import("./pages/Universities"));
const JournalsDirectory = lazy(() => import("./pages/JournalsDirectory"));
const JournalCategory = lazy(() => import("./pages/JournalCategory"));
const InstitutionalPartnerships = lazy(() => import("./pages/InstitutionalPartnerships"));
import BackToTopButton from "./components/BackToTopButton";

const queryClient = new QueryClient();

const LegacyContractRedirect = () => {
  const { id } = useParams();

  return <Navigate to={id ? `/client/contracts/${id}` : "/client/contracts"} replace />;
};

const LegacyAdminPathRedirect = () => {
  const params = useParams();
  const rest = params["*"] ?? "";

  return <Navigate to={`/adminfekrah${rest ? `/${rest}` : ""}`} replace />;
};



const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <RouteIndexingGuard />
        <SimpleAuthProvider>
          <ReferralTracker />
          <LoginWelcomeOverlay />
          <DeferredGlobalFeatures />
          <PageThemeProvider>
          <Suspense fallback={<div className="min-h-[55vh] bg-background" aria-label="جارٍ تحميل الصفحة" />} >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/verify/contract/:token" element={<VerifyContract />} />
            <Route path="/theme-preview" element={<ThemePreview />} />
            
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
              <Route path="/fekrahedu-membership" element={<FekrahEduMembership />} />
              <Route path="/master-membership" element={<Navigate to="/fekrahedu-membership" replace />} />
             <Route path="/faq" element={<FAQ />} />
             <Route path="/academic-competitions" element={<AcademicCompetitions />} />
             <Route path="/spin-the-wheel" element={<SpinTheWheel />} />
             <Route path="/study-to-earn" element={<StudyToEarn />} />
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
            <Route path="/journals/:slug" element={<JournalCategory />} />
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
            <Route path="/auth/confirm" element={<AuthConfirm />} />
            <Route path="/adminfekrah/login" element={<AdminLogin />} />
            <Route path="/adminmaster/*" element={<LegacyAdminPathRedirect />} />
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
            <Route path="/adminfekrah" element={
              <SimpleProtectedRoute adminOnly>
                <AdminDashboard />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/financing" element={
              <SimpleProtectedRoute adminOnly>
                <FinancingAdmin />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/financing/audit" element={
              <SimpleProtectedRoute adminOnly>
                <FinancingAuditTrail />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/financing/:id" element={
              <SimpleProtectedRoute adminOnly>
                <FinancingAdminDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/contracts" element={
              <SimpleProtectedRoute adminOnly>
                <ContractsSystem />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/contracts/analytics" element={
              <SimpleProtectedRoute adminOnly>
                <ContractsAnalytics />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/contracts/:id" element={
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
            <Route path="/fekrahedu-paylater" element={<Navigate to="/financing" replace />} />
            <Route path="/master-paylater" element={<Navigate to="/financing" replace />} />
            <Route path="/financing" element={
              <SimpleProtectedRoute requiredRole="client">
                <FinancingComingSoon />
              </SimpleProtectedRoute>
            } />
            <Route path="/financing/new" element={
              <SimpleProtectedRoute requiredRole="client">
                <FinancingNew />
              </SimpleProtectedRoute>
            } />
            <Route path="/financing/:id" element={
              <SimpleProtectedRoute requiredRole="client">
                <FinancingDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/financing/acknowledgments" element={
              <SimpleProtectedRoute requiredRole="client">
                <FinancingAcknowledgments />
              </SimpleProtectedRoute>
            } />
            <Route path="/financing/down-payments" element={
              <SimpleProtectedRoute requiredRole="client">
                <DownPaymentStatus />
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
            <Route path="/adminfekrah/research" element={
              <SimpleProtectedRoute adminOnly>
                <AdminResearchPublications />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/research/contracts" element={
              <SimpleProtectedRoute adminOnly>
                <AdminResearchContracts />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/research/contracts/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminResearchContractDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/research/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminResearchPublicationDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/services" element={
              <SimpleProtectedRoute adminOnly>
                <AdminServices />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/service-orders" element={
              <SimpleProtectedRoute adminOnly>
                <AdminServiceOrders />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/service-orders/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminServiceOrderDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/orders" element={
              <SimpleProtectedRoute adminOnly>
                <AdminOrders />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/invoices" element={
              <SimpleProtectedRoute adminOnly>
                <AdminInvoices />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/invoices/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminInvoiceDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/transactions" element={
              <SimpleProtectedRoute adminOnly>
                <AdminTransactions />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/financial" element={
              <SimpleProtectedRoute adminOnly>
                <AdminFinancial />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/users" element={
              <SimpleProtectedRoute adminOnly>
                <AdminUsers />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/customers" element={
              <SimpleProtectedRoute adminOnly>
                <AdminCustomers />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/customers/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminCustomerDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/customers/:id/email" element={
              <SimpleProtectedRoute adminOnly>
                <AdminCustomerEmail />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/add-user" element={
              <SimpleProtectedRoute adminOnly>
                <AddUser />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/tickets" element={
              <SimpleProtectedRoute adminOnly>
                <AdminTickets />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/tickets/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminTicketDetails />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/inbox" element={
              <SimpleProtectedRoute adminOnly>
                <AdminInbox />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/email-notifications" element={
              <SimpleProtectedRoute adminOnly>
                <EmailNotifications />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/chat" element={
              <SimpleProtectedRoute adminOnly>
                <AdminChat />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/working-hours" element={
              <SimpleProtectedRoute adminOnly>
                <AdminWorkingHours />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/changelog" element={
              <SimpleProtectedRoute adminOnly>
                <AdminChangelog />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/wallets" element={
              <SimpleProtectedRoute adminOnly>
                <AdminWallets />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/withdrawals" element={
              <SimpleProtectedRoute adminOnly>
                <AdminWithdrawals />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/payments" element={
              <SimpleProtectedRoute adminOnly>
                <AdminPayments />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/memberships" element={
              <SimpleProtectedRoute adminOnly>
                <AdminMemberships />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/blog" element={
              <SimpleProtectedRoute adminOnly>
                <AdminBlog />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/referrals" element={
              <SimpleProtectedRoute adminOnly>
                <AdminReferrals />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/growth" element={
              <SimpleProtectedRoute adminOnly>
                <AdminGrowthAnalytics />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/growth/automation" element={
              <SimpleProtectedRoute adminOnly>
                <AdminGrowthAutomation />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/growth/automation/rules" element={
              <SimpleProtectedRoute adminOnly>
                <AdminGrowthAutomationRules />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/experiments" element={
              <SimpleProtectedRoute adminOnly>
                <AdminExperiments />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/experiments/:id" element={
              <SimpleProtectedRoute adminOnly>
                <AdminExperimentDetail />
              </SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/assessments" element={
              <SimpleProtectedRoute adminOnly>
                <AdminAssessments />
              </SimpleProtectedRoute>
            } />
            <Route path="/assessments" element={<AssessmentsList />} />
            <Route path="/assessments/:id/start" element={<AssessmentStart />} />
            <Route path="/assessments/:id/result" element={<AssessmentResult />} />
            <Route path="/adminfekrah/whatsapp" element={<Navigate to="/adminfekrah/whatsapp/inbox" replace />} />
            <Route path="/adminfekrah/whatsapp/inbox" element={
              <SimpleProtectedRoute adminOnly><WhatsappInboxPage /></SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/whatsapp/campaigns" element={
              <SimpleProtectedRoute adminOnly><WhatsappCampaignsPage /></SimpleProtectedRoute>
            } />
            <Route path="/adminfekrah/whatsapp/analytics" element={
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
        {/* Legacy: قسم الطالب القديم (محذوف) — إعادة توجيه ذكية مع إشعار */}
        <Route path="/student" element={<LegacyStudentRedirect />} />
        <Route path="/student/*" element={<LegacyStudentRedirect />} />
        <Route path="/adminfekrah/student-activity" element={<LegacyStudentRedirect />} />
        <Route path="/adminfekrah/student-wallets" element={<LegacyStudentRedirect />} />
        <Route path="/adminfekrah/reward-redemptions" element={<LegacyStudentRedirect />} />
        <Route path="/adminfekrah/reward-rules" element={<LegacyStudentRedirect />} />
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
          </Suspense>
          <BackToTopButton />
          </PageThemeProvider>
        </SimpleAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
