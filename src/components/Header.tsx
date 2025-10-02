import { Button } from "@/components/ui/button";
import { 
  Menu, 
  GraduationCap, 
  Home,
  Users,
  Phone,
  BookOpen,
  CheckCircle2,
  BarChart3,
  FileSignature,
  Monitor,
  FileSearch,
  MessagesSquare,
  Newspaper,
  Languages,
  School,
  Library,
  X,
  ChevronDown,
  ArrowLeft,
  HelpCircle,
  Mail
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "./TopBar";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'من نحن', href: '/about-us', icon: Users },
    { name: 'الأسئلة الشائعة', href: '/faq', icon: HelpCircle },
    { name: 'تواصل معنا', href: '/contact', icon: Phone },
  ];

  const servicesMenu = [
    { 
      name: 'كتابة الأبحاث الجامعية', 
      href: '/research-services', 
      icon: BookOpen,
      description: 'إعداد الرسائل والأطروحات العلمية بمعايير أكاديمية عالية'
    },
    { 
      name: 'التدقيق اللغوي والمراجعة', 
      href: '/services/editing-services', 
      icon: CheckCircle2,
      description: 'مراجعة لغوية دقيقة وتدقيق شامل للنصوص الأكاديمية'
    },
    { 
      name: 'التحليل الإحصائي SPSS', 
      href: '/research/statistical-spss-service', 
      icon: BarChart3,
      description: 'تحليل البيانات الإحصائية باستخدام أحدث البرامج'
    },
    { 
      name: 'إعداد خطة البحث', 
      href: '/research/proposal-service', 
      icon: FileSignature,
      description: 'صياغة مقترحات البحث وخطط الدراسة العلمية'
    },
    { 
      name: 'عروض PowerPoint أكاديمية', 
      href: '/research/powerpoint-service', 
      icon: Monitor,
      description: 'تصميم عروض تقديمية احترافية للأبحاث والمشاريع'
    },
    { 
      name: 'مراجعات ما قبل النشر', 
      href: '/research/proofreading-service', 
      icon: FileSearch,
      description: 'مراجعة شاملة قبل النشر في المجلات العلمية'
    },
    { 
      name: 'الاستشارات الأكاديمية', 
      href: '/research/consultation-service', 
      icon: MessagesSquare,
      description: 'استشارات متخصصة في البحث العلمي والنشر الأكاديمي'
    },
    { 
      name: 'النشر في المجلات', 
      href: '/research/journal-publication', 
      icon: Newspaper,
      description: 'خدمات النشر في المجلات العلمية المحكمة دولياً'
    },
    { 
      name: 'الترجمة الأكاديمية المعتمدة', 
      href: '/translation-services', 
      icon: Languages,
      description: 'ترجمة معتمدة للأبحاث والوثائق الأكاديمية'
    },
    { 
      name: 'التدريب وورش العمل', 
      href: '/research/training-courses', 
      icon: GraduationCap,
      description: 'دورات تدريبية في البحث العلمي والنشر الأكاديمي'
    },
    { 
      name: 'القبول الجامعي والمنح', 
      href: '/admission-services', 
      icon: School,
      description: 'مساعدة في القبول الجامعي والحصول على المنح الدراسية'
    },
    { 
      name: 'مركز الموارد', 
      href: '/research/research-tools', 
      icon: Library,
      description: 'مكتبة شاملة من الأدوات والموارد البحثية'
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <TopBar />
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-border/50 shadow-soft transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
        dir="rtl"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center gap-3">
                <motion.div 
                  className={`relative flex-shrink-0 transition-all duration-300 ${
                    isScrolled ? 'w-12 h-12' : 'w-14 h-14'
                  }`}
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary rounded-xl shadow-primary flex items-center justify-center border border-white/30">
                    <GraduationCap className={`text-primary-foreground transition-all duration-300 ${
                      isScrolled ? 'h-6 w-6' : 'h-7 w-7'
                    }`} />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-saudi-gold to-national-day-accent rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">M</span>
                  </div>
                </motion.div>
                <div className="text-right hidden sm:block">
                  <h1 className={`font-bold text-primary leading-tight transition-all duration-300 ${
                    isScrolled ? 'text-base' : 'text-lg lg:text-xl'
                  }`}>
                    وكالة ماستر إيدو باث
                  </h1>
                  <p className={`font-medium text-muted-foreground transition-all duration-300 ${
                    isScrolled ? 'text-xs' : 'text-sm'
                  }`}>
                    MasterEduPath Agency
                  </p>
                </div>
              </Link>
            </motion.div>

            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative font-medium flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                    isActive(item.href) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span>{item.name}</span>
                  <item.icon className="h-5 w-5" />
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isActive(item.href) && (
                    <span className="absolute bottom-0 right-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
                  )}
                </Link>
              ))}
              
              <div 
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                <button
                  className="font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <span>خدماتنا</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-[800px] bg-white/98 backdrop-blur-xl border border-border rounded-xl shadow-strong p-6"
                    >
                      <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                        {servicesMenu.map((service) => (
                          <Link
                            key={service.name}
                            to={service.href}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-all duration-200 group"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors duration-200">
                              <service.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 text-right">
                              <div className="font-semibold text-sm mb-1 text-foreground group-hover:text-primary transition-colors duration-200">
                                {service.name}
                              </div>
                              <div className="text-xs text-muted-foreground leading-relaxed">
                                {service.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Link 
                          to="/services" 
                          className="text-sm text-primary hover:text-primary-dark font-medium flex items-center justify-center gap-2 transition-colors duration-200"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          <span>عرض جميع الخدمات</span>
                          <ArrowLeft className="h-4 w-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                size={isScrolled ? "sm" : "default"}
                className="bg-gradient-to-r from-primary via-primary-dark to-primary text-primary-foreground hover:shadow-primary transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link to="/order-now" className="flex items-center gap-2">
                  <span className="hidden sm:inline">اطلب الآن</span>
                  <span className="sm:hidden">طلب</span>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] sm:w-96 bg-white/98 backdrop-blur-xl p-0" dir="rtl">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-primary rounded-xl flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-base text-primary">ماستر إيدو باث</span>
                          <p className="text-xs text-muted-foreground">MasterEduPath</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                        aria-label="إغلاق"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="space-y-1">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                              isActive(item.href)
                                ? 'text-primary bg-primary/10'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <button
                          onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-all duration-200"
                        >
                          <span className="font-semibold">خدماتنا</span>
                          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isMobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-1 mt-2 pr-4">
                                {servicesMenu.map((service) => (
                                  <Link
                                    key={service.name}
                                    to={service.href}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-all duration-200"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <service.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium">{service.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="p-6 border-t space-y-3">
                      <Button 
                        className="w-full bg-gradient-to-r from-primary via-primary-dark to-primary" 
                        asChild
                      >
                        <Link to="/order-now" onClick={() => setIsOpen(false)}>
                          <span>اطلب خدمتك الآن</span>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                        </Link>
                      </Button>
                      
                      <div className="flex items-center justify-center gap-4 pt-2">
                        <a 
                          href="https://wa.me/966500776343" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors duration-200"
                          aria-label="واتساب"
                        >
                          <Phone className="h-5 w-5" />
                        </a>
                        <a 
                          href="mailto:info@masteredupath.com"
                          className="text-muted-foreground hover:text-primary transition-colors duration-200"
                          aria-label="بريد إلكتروني"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;