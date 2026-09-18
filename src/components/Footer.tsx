import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Clock,
  Headphones,
  Building2,
  Award,
  Shield,
  Users,
  Star,
  Zap,
  Timer,
  HelpCircle,
  TrendingUp,
  DollarSign,
  UserPlus,
  Briefcase,
  Trophy,
  Search,
  Crown,
  GraduationCap,
  Calculator,
  Newspaper
} from "lucide-react";
const fekrahLogoUrl = "/fekrah-logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="defer-render bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden" dir="rtl">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-10 right-10 w-24 h-24 bg-primary/20 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-16 h-16 bg-blue-500/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-green-500/20 rounded-full"></div>
      </div>

      {/* Company Header Section */}
      <div className="relative z-10 bg-gradient-to-r from-primary/10 to-blue-600/10 py-8 md:py-12 border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 md:mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full mb-4 md:mb-6">
              <Building2 className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 font-arabic-title">وكالة FekrahEdu للحلول التعليمية المتقدمة</h2>
            <p className="text-base md:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">شريكك الموثوق للحصول على أفضل الحلول التعليمية والتقنية المتقدمة في المملكة العربية السعودية</p>
          </motion.div>
          
          {/* Company Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              <MapPin className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-3 text-blue-400" />
              <h4 className="font-semibold text-base md:text-lg mb-2">موقعنا</h4>
              <p className="text-sm opacity-90">جدة، المملكة العربية السعودية</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              <Clock className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-3 text-green-400" />
              <h4 className="font-semibold text-base md:text-lg mb-2">ساعات العمل الرسمية</h4>
              <p className="text-sm opacity-90 mb-1">الأحد - الخميس</p>
              <p className="text-sm md:text-base font-semibold text-green-400">9:00 ص - 5:00 م</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center hover:bg-white/10 transition-all duration-300 border border-white/10"
            >
              <Headphones className="h-8 w-8 md:h-10 md:w-10 mx-auto mb-3 text-purple-400" />
              <h4 className="font-semibold text-base md:text-lg mb-2">خدمة العملاء</h4>
              <p className="text-sm md:text-base font-semibold text-purple-400 mb-1">متاحة 24/7</p>
              <p className="text-sm opacity-90">على مدار الساعة طوال أيام الأسبوع</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-8">
          
          {/* معلومات الشركة */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2 lg:col-span-1 space-y-6"
          >
            <div className="flex items-center gap-3 justify-start mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                <img src={fekrahLogoUrl} alt="شعار FekrahEdu" className="w-full h-full object-contain" loading="lazy" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-bold font-arabic-title">FekrahEdu</h3>
                <p className="text-sm text-white/70">وكالة الحلول التعليمية المتقدمة</p>
              </div>
            </div>
            
            <p className="text-white/80 text-sm leading-relaxed text-right mb-6">
              نحن الشريك الموثوق لأكثر من 10,000 عميل في جميع أنحاء المملكة. 
              نقدم خدمات ترجمة احترافية بأكثر من 100 لغة مع ضمان الجودة والسرعة.
            </p>

            {/* Social Media */}
            <div className="flex gap-3 justify-start">
              {[
                { Icon: Facebook, color: "hover:text-blue-400", href: "https://facebook.com/fekrahedu", label: "فيسبوك" },
                { Icon: Twitter, color: "hover:text-sky-400", href: "https://twitter.com/fekrahedu", label: "تويتر" },
                { Icon: Instagram, color: "hover:text-pink-400", href: "https://instagram.com/fekrahedu", label: "انستغرام" },
                { Icon: Linkedin, color: "hover:text-blue-600", href: "https://linkedin.com/company/fekrahedu", label: "لينكدإن" }
              ].map(({ Icon, color, href, label }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/70 ${color} transition-all duration-300 border border-white/10 flex items-center justify-center hover:scale-110`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* خدماتنا الأساسية */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-4 md:space-y-6"
          >
            <h4 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
              خدماتنا الأساسية
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {[
                { name: 'خدمات الترجمة', href: '/translation-services' },
                { name: 'البحث العلمي', href: '/research-services' },
                { name: 'النشر في المجلات', href: '/research/journal-publication' },
                { name: 'التحليل الإحصائي', href: '/services/statistical-analysis-services' },
                { name: 'الاستشارات التعليمية', href: '/services/consultation-services' }
              ].map((service) => (
                <li key={service.name}>
                  <a 
                    href={service.href} 
                    className="text-white/70 hover:text-white transition-colors text-sm md:text-base block hover:translate-x-1 transition-transform duration-200"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* روابط سريعة */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="space-y-4 md:space-y-6"
          >
            <h4 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
              روابط سريعة
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {[
                { name: 'عن الشركة', href: '/about-us' },
                { name: 'الأسعار', href: '/pricing' },
                { name: 'عضوية FekrahEdu', href: '/fekrahedu-membership' },
                { name: 'المسابقات', href: '/academic-competitions' },
                { name: 'الأسئلة الشائعة', href: '/faq' },
                { name: 'اتصل بنا', href: '/contact-us' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-white/70 hover:text-white transition-colors text-sm md:text-base block hover:translate-x-1 transition-transform duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>


          {/* الجامعات والمؤسسات التعليمية */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4 md:space-y-6"
          >
            <h4 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
              الجامعات والمؤسسات
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {[
                { name: 'دليل الجامعات', href: '/universities', icon: Building2 },
                { name: 'القبول بالجامعات', href: '/admission-services', icon: GraduationCap },
                { name: 'دليل المجلات العلمية', href: '/journals', icon: Award },
                
                { name: 'الوظائف', href: '/careers', icon: Briefcase },
                { name: 'طرق الدفع', href: '/payment-methods', icon: DollarSign }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-white/70 hover:text-white transition-colors text-sm md:text-base flex items-center gap-2 hover:translate-x-1 transition-transform duration-200"
                  >
                    <link.icon className="h-3 w-3 md:h-4 md:w-4 text-green-400" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
           </motion.div>

           {/* النشر في المجلات */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.25, duration: 0.5 }}
             className="space-y-4 md:space-y-6"
           >
              <h4 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />
                النشر في المجلات
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {[
                  { name: 'المراجعة التعاونية العالمية', href: '/research/global-peer-review', icon: Users },
                  { name: 'مراجعة منهجية بالذكاء الاصطناعي', href: '/research/ai-methodology-review', icon: Trophy },
                  { name: 'المحرر الذكي - توصيات النشر', href: '/research/smart-editor', icon: Award },
                  { name: 'النشر المشروح', href: '/research/annotated-publishing', icon: Award }
                ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-white/70 hover:text-white transition-colors text-sm md:text-base flex items-center gap-2 hover:translate-x-1 transition-transform duration-200"
                  >
                    <link.icon className="h-3 w-3 md:h-4 md:w-4 text-orange-400" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
           </motion.div>

            {/* الحقوق والسياسات */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.25, duration: 0.5 }}
             className="space-y-4 md:space-y-6"
           >
             <h4 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
               <Shield className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
               الحقوق والسياسات
             </h4>
             <ul className="space-y-2 md:space-y-3">
               {[
                 { name: 'النزاهة الأكاديمية', href: '/academic-integrity', icon: Award },
                 { name: 'الملكية الفكرية', href: '/intellectual-property', icon: Shield },
                 { name: 'سياسة الخصوصية', href: '/privacy-policy', icon: Shield },
                 { name: 'شروط الاستخدام', href: '/terms-of-service', icon: HelpCircle },
                 { name: 'حماية البيانات', href: '/privacy-policy#data-protection', icon: Shield },
                 { name: 'اتفاقية الخدمة', href: '/terms-of-service#service-agreement', icon: Award }
               ].map((link) => (
                 <li key={link.name}>
                   <a 
                     href={link.href} 
                     className="text-white/70 hover:text-white transition-colors text-sm md:text-base flex items-center gap-2 hover:translate-x-1 transition-transform duration-200"
                   >
                     <link.icon className="h-3 w-3 md:h-4 md:w-4 text-purple-400" />
                     {link.name}
                   </a>
                 </li>
               ))}
             </ul>
            </motion.div>

        </div>


      </div>

      {/* خط الفصل وحقوق الطبع */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="border-t border-white/20 mt-12 md:mt-16 pt-6 md:pt-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6">
            <div className="flex-1 max-w-lg">
              <div className="space-y-2">
                <p className="text-white/60 text-sm text-center lg:text-right flex items-center gap-2 flex-wrap">
                  <Globe className="h-4 w-4 flex-shrink-0" />
                  <span>© {currentYear} FekrahEdu - للحلول التعليمية المتقدمة. جميع الحقوق محفوظة.</span>
                </p>
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 md:p-3">
                  <p className="text-xs md:text-sm text-red-400 font-semibold flex items-center gap-2 mb-1">
                    <Shield className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    إشعار الملكية الفكرية
                  </p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    هذا المحتوى محمي بموجب قوانين حقوق الطبع والنشر والملكية الفكرية. 
                    أي استخدام غير مصرح به يعرض المخالف للمساءلة القانونية.
                    للاستفسار عن الحقوق والتراخيص، يرجى التواصل معنا.
                  </p>
                </div>
              </div>
            </div>
            
            
            {/* شعار اليوم الوطني في الفوتر */}
            <div className="flex items-center gap-2 md:gap-3 mt-2 lg:mt-0 mx-auto lg:mx-0">
              <div className="relative flex-shrink-0">
                <img 
                  src="/assets/national-day-logo-original.webp" 
                  alt="عزنا بطبعنا - اليوم الوطني السعودي ٩٥"
                  className="h-8 w-auto md:h-10 drop-shadow-lg opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="text-right min-w-0">
                <p className="text-xs text-white/70 font-medium whitespace-nowrap">
                  🇸🇦 فخورون بوطننا الغالي
                </p>
                <p className="text-xs text-yellow-400 font-bold whitespace-nowrap">
                  عزنا بطبعنا - اليوم الوطني ٩٥
                </p>
              </div>
            </div>
          </div>

          {/* Contact Icons Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/10"
          >
            <div className="text-center mb-6">
              <h4 className="text-lg md:text-xl font-bold text-white flex items-center justify-center gap-2 mb-2">
                <Headphones className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                تواصل معنا
              </h4>
              <p className="text-sm text-white/70">نحن هنا لخدمتكم على مدار الساعة</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              {[
                { Icon: Phone, text: "0593799355", subtext: "اتصل بنا الآن", color: "text-green-400", bgColor: "bg-green-400/10", borderColor: "border-green-400/20" },
                { Icon: Mail, text: "info@fekrahedu.com", subtext: "راسلنا عبر البريد", color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400/20" },
                { Icon: MapPin, text: "جدة، المملكة العربية السعودية", subtext: "موقعنا الرئيسي", color: "text-red-400", bgColor: "bg-red-400/10", borderColor: "border-red-400/20" }
              ].map(({ Icon, text, subtext, color, bgColor, borderColor }, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center text-center p-4 md:p-6 ${bgColor} rounded-xl hover:bg-opacity-20 transition-all duration-300 cursor-pointer border ${borderColor} group hover:border-opacity-40 hover:scale-105`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 ${bgColor} rounded-full mb-3 flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 md:h-7 md:w-7 ${color}`} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm md:text-base font-medium text-white">{text}</p>
                    <p className="text-xs md:text-sm text-white/60">{subtext}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Brand Strip */}
          <div className="mt-6 md:mt-8 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 md:gap-4 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-full border border-white/10">
              <Award className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 flex-shrink-0" />
              <span className="text-xs md:text-sm font-medium text-white">الشريك الموثوق لأكثر من 10,000 عميل</span>
              <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-current flex-shrink-0" />
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;