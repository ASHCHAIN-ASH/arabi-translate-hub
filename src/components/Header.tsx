import { Button } from "@/components/ui/button";
import { 
  Menu, 
  GraduationCap, 
  House,
  Info,
  Phone,
  Grid,
  HelpCircle,
  Send,
  CheckCircle2,
  BookOpen,
  Newspaper,
  Languages,
  X,
  ChevronDown,
  Mail
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import TopBar from "./TopBar";
import MegaServicesPortal from "./MegaServicesPortal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track header height for mega menu positioning
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, [isScrolled]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mega menu is open
  useEffect(() => {
    if (isServicesOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isServicesOpen]);

  // Close mega menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isServicesOpen) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isServicesOpen]);


  const navigation = [
    { name: 'الرئيسية', href: '/', icon: House },
    { name: 'من نحن', href: '/about-us', icon: Info },
    { name: 'الأسئلة الشائعة', href: '/faq', icon: HelpCircle },
    { name: 'تواصل معنا', href: '/contact', icon: Phone },
  ];

  const servicesMenu = [
    { 
      name: 'النشر الأكاديمي', 
      href: '/research/journal-publication', 
      icon: Newspaper,
      description: 'مساعدة في نشر الأبحاث في المجلات العلمية المحكمة'
    },
    { 
      name: 'المراجعة والتدقيق', 
      href: '/services/editing-services', 
      icon: CheckCircle2,
      description: 'مراجعة لغوية ومنهجية متخصصة للأبحاث العلمية'
    },
    { 
      name: 'خدمات البحث العلمي', 
      href: '/research-services', 
      icon: BookOpen,
      description: 'دعم شامل للباحثين في جميع مراحل البحث العلمي'
    },
    { 
      name: 'الترجمة الأكاديمية', 
      href: '/translation-services', 
      icon: Languages,
      description: 'ترجمة احترافية للأبحاث والرسائل العلمية بدقة عالية'
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
                  className={`relative font-medium flex items-center flex-row-reverse gap-2 px-4 py-2 rounded-lg transition-all duration-200 group ${
                    isActive(item.href) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span>{item.name}</span>
                  <item.icon className={`h-5 w-5 transition-transform duration-200 ${
                    isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'
                  }`} />
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
              
              <div className="relative">
                <button
                  data-menu="services"
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  onMouseEnter={() => !isMobile && setIsServicesOpen(true)}
                  aria-haspopup="true"
                  aria-expanded={isServicesOpen}
                  className={`font-semibold flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isServicesOpen 
                      ? 'bg-primary/10 text-primary shadow-sm' 
                      : 'hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">خدماتنا</span>
                  <Grid className={`h-5 w-5 transition-all duration-300 relative z-10 ${
                    isServicesOpen ? 'scale-110 rotate-90' : 'group-hover:scale-110 group-hover:-rotate-6'
                  }`} />
                  <ChevronDown className={`h-4 w-4 transition-all duration-300 relative z-10 ${
                    isServicesOpen ? 'rotate-180 scale-110' : 'group-hover:translate-y-0.5'
                  }`} />
                  <span className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </nav>

            <div className="flex items-center gap-3">
              <Button 
                size={isScrolled ? "sm" : "default"}
                className="bg-gradient-to-r from-primary via-primary-dark to-primary text-primary-foreground hover:shadow-primary transition-all duration-300 hover:scale-105 group"
                asChild
              >
                <Link to="/order-now" className="flex items-center flex-row-reverse gap-2">
                  <span className="hidden sm:inline">اطلب الآن</span>
                  <span className="sm:hidden">طلب</span>
                  <Send className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                </Link>
              </Button>

              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] sm:w-96 bg-white p-0" dir="rtl">
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
                            className={`flex items-center flex-row-reverse gap-3 p-3 rounded-lg transition-all duration-200 group ${
                              isActive(item.href)
                                ? 'text-primary bg-primary/10'
                                : 'hover:bg-muted'
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="font-medium">{item.name}</span>
                            <item.icon className={`h-5 w-5 transition-transform duration-200 ${
                              isActive(item.href) ? 'scale-110' : 'group-hover:scale-110'
                            }`} />
                          </Link>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <button
                          onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-all duration-200 group"
                        >
                          <div className="flex items-center flex-row-reverse gap-3">
                            <span className="font-semibold">خدماتنا</span>
                            <Grid className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                          </div>
                          <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isMobileServicesOpen && (
                          <div className="overflow-hidden">
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
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 border-t space-y-3">
                      <Button 
                        className="w-full bg-gradient-to-r from-primary via-primary-dark to-primary group" 
                        asChild
                      >
                        <Link to="/order-now" onClick={() => setIsOpen(false)} className="flex items-center flex-row-reverse gap-2">
                          <span>اطلب خدمتك الآن</span>
                          <Send className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
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

      {/* Mega Menu via Portal */}
      <MegaServicesPortal
        isOpen={isServicesOpen}
        onClose={() => setIsServicesOpen(false)}
        isMobile={isMobile}
        headerHeight={headerHeight}
        items={servicesMenu}
      />
    </>
  );
};

export default Header;