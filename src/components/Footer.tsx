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
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden" dir="rtl">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-500 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-green-500 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 bg-gradient-to-r from-primary/20 to-blue-600/20 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6"
            >
              <Building2 className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 font-arabic-title">وكالة MasterEduPath للحلول التعليمية المتقدمة</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">شريكك الموثوق للحصول على أفضل الحلول التعليمية والتقنية المتقدمة في المملكة العربية السعودية</p>
          </motion.div>
          {/* Company Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center group hover:bg-white/20 transition-all duration-300"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </motion.div>
              <h4 className="font-bold text-lg mb-2">موقعنا</h4>
              <p className="text-sm opacity-90">جدة، المملكة العربية السعودية</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center group hover:bg-white/20 transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="h-12 w-12 mx-auto mb-4 text-green-400 group-hover:text-green-300 transition-colors" />
              </motion.div>
              <h4 className="font-bold text-lg mb-2">ساعات العمل الرسمية</h4>
              <p className="text-sm opacity-90">الأحد - الخميس</p>
              <p className="text-lg font-semibold text-green-400">10:00 ص - 7:00 م</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center group hover:bg-white/20 transition-all duration-300"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Headphones className="h-12 w-12 mx-auto mb-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </motion.div>
              <h4 className="font-bold text-lg mb-2">خدمة العملاء</h4>
              <p className="text-lg font-semibold text-purple-400">متاحة 24/7</p>
              <p className="text-sm opacity-90">على مدار الساعة طوال أيام الأسبوع</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* معلومات الشركة */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center"
              >
                <Globe className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-arabic-title font-bold">MasterEduPath | ماستر إيدو باث</h3>
                <p className="text-sm text-white/70">وكالة الحلول التعليمية المتقدمة | Advanced Educational Solutions Agency</p>
              </div>
            </div>
            
            <p className="text-white/80 text-sm leading-relaxed">
              نحن الشريك الموثوق لأكثر من 10,000 عميل في جميع أنحاء المملكة. نقدم خدمات ترجمة احترافية 
              بأكثر من 100 لغة مع ضمان الجودة والسرعة.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <Award className="h-6 w-6 mx-auto mb-1 text-yellow-400 animate-pulse" />
                <p className="text-xs text-white/80">ISO معتمد</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <Shield className="h-6 w-6 mx-auto mb-1 text-green-400 animate-pulse" />
                <p className="text-xs text-white/80">أمان تام</p>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-lg">
                <Users className="h-6 w-6 mx-auto mb-1 text-blue-400 animate-pulse" />
                <p className="text-xs text-white/80">128 خبير ومترجم معتمد</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { Icon: Facebook, color: "hover:text-blue-400" },
                { Icon: Twitter, color: "hover:text-sky-400" },
                { Icon: Instagram, color: "hover:text-pink-400" },
                { Icon: Linkedin, color: "hover:text-blue-600" }
              ].map(({ Icon, color }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 ${color} transition-all duration-300`}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* روابط سريعة */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 animate-pulse" />
              روابط سريعة
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'خدماتنا', icon: Zap, href: '/services' },
                { name: 'الأسعار', icon: Star, href: '/pricing' },
                { name: 'عن الشركة', icon: Building2, href: '/about-us' },
                { name: 'المدونة', icon: Globe },
                { name: 'الأسئلة الشائعة', icon: Users },
                { name: 'سياسة الخصوصية', icon: Shield, href: '/privacy-policy' },
                { name: 'إدارة', icon: Users, href: '/admin/orders', admin: true }
              ].map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href={link.href || "#"} 
                    className={`text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 group ${link.admin ? 'text-white/40 hover:text-white/60' : ''}`}
                  >
                    <link.icon className="h-4 w-4 group-hover:text-primary transition-colors" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* خدماتنا */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
              خدماتنا المتخصصة
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'الترجمة القانونية', badge: 'الأكثر طلباً' },
                { name: 'الترجمة الطبية', badge: 'معتمد' },
                { name: 'الترجمة التقنية', badge: 'متخصص' },
                { name: 'ترجمة الأعمال', badge: 'سريع' },
                { name: 'الترجمة الأكاديمية', badge: 'دقيق' },
                { name: 'ترجمة الوسائط', badge: 'جديد' }
              ].map((service) => (
                <motion.li 
                  key={service.name}
                  whileHover={{ x: 10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a 
                    href="#" 
                    className="text-white/70 hover:text-white transition-colors text-sm flex items-center justify-between group"
                  >
                    <span>{service.name}</span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {service.badge}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* معلومات التواصل */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Headphones className="h-5 w-5 text-green-400 animate-pulse" />
              تواصل معنا
            </h4>
            
            <div className="space-y-4">
              {[
                { Icon: Phone, text: "0500776343", subtext: "اتصل بنا الآن", color: "text-green-400" },
                { Icon: Mail, text: "info@masteredupath.com", subtext: "راسلنا عبر البريد", color: "text-blue-400" },
                { Icon: MapPin, text: "جدة، المملكة العربية السعودية", subtext: "موقعنا الرئيسي", color: "text-red-400" }
              ].map(({ Icon, text, subtext, color }, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <motion.div
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <Icon className={`h-5 w-5 ${color} group-hover:scale-110 transition-transform`} />
                  </motion.div>
                  <div>
                    <p className="text-sm font-medium text-white">{text}</p>
                    <p className="text-xs text-white/60">{subtext}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="space-y-3 p-4 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-lg border border-white/10">
              <h5 className="font-medium text-white flex items-center gap-2">
                <Timer className="h-4 w-4 text-yellow-400 animate-spin" />
                اشترك في نشرتنا الإخبارية
              </h5>
              <p className="text-xs text-white/70">احصل على آخر العروض والأخبار</p>
              <div className="flex gap-2">
                <Input 
                  placeholder="البريد الإلكتروني" 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                />
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/80 hover:to-blue-600/80 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  اشترك
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* خط الفصل وحقوق الطبع */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="border-t border-white/20 mt-16 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.p 
              whileHover={{ scale: 1.05 }}
              className="text-white/60 text-sm text-center md:text-right flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <Globe className="h-4 w-4" />
              </motion.div>
              © {currentYear} وكالة ماستر إيدو باث - للحلول التعليمية المتقدمة. جميع الحقوق محفوظة.
            </motion.p>
            
            <div className="flex items-center gap-6 text-sm">
              {[
                { name: 'شروط الاستخدام', href: '/terms' },
                { name: 'سياسة الخصوصية', href: '/privacy' },
                { name: 'دعم العملاء', href: '#' }
              ].map((link, index) => (
                <motion.a 
                  key={link.name}
                  href={link.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-white/70 hover:text-white transition-colors relative group"
                >
                  {link.name}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Bottom Brand Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-full border border-white/10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Award className="h-5 w-5 text-yellow-400" />
              </motion.div>
              <span className="text-sm font-medium text-white">الشريك الموثوق لأكثر من 10,000 عميل</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;