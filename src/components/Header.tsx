import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Globe, 
  GraduationCap, 
  BookOpen, 
  ChevronDown, 
  Languages, 
  Home,
  Users,
  Phone,
  Briefcase,
  Microscope,
  X,
  ArrowLeft,
  FileText
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'من نحن', href: '/about-us', icon: Users },
    { name: 'تواصل معنا', href: '/contact', icon: Phone },
  ];

  const servicesDropdown = [
    { name: 'خدمات الترجمة', href: '/translation-services', icon: Languages, description: 'ترجمة النصوص والوثائق بدقة عالية' },
    { name: 'خدمات الأبحاث والكتابة', href: '/research-services', icon: Microscope, description: 'كتابة وتحليل الأبحاث العلمية والأكاديمية' },
    { name: 'النشر في المجلات المعتمدة', href: '/research/journal-publication', icon: FileText, description: 'خدمات النشر في المجلات العلمية المحكمة والمعتمدة دولياً' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-border/50 shadow-lg" 
      dir="rtl"
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* الشعار المحسن */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center group">
              <motion.div 
                className="relative w-16 h-16 ml-4"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center border-2 border-white/30 group-hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex flex-col items-center justify-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <GraduationCap className="h-8 w-8 text-white mb-1" />
                    </motion.div>
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 text-white/90" />
                      <Globe className="h-3 w-3 text-white/90 -mr-0.5" />
                    </div>
                  </div>
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-white text-xs font-bold">M</span>
                </motion.div>
              </motion.div>
              <div className="text-right">
                <motion.h1 
                  className="text-2xl lg:text-3xl font-arabic-formal font-bold text-slate-800 dark:text-white leading-tight tracking-wide group-hover:text-primary transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  وكالة ماستر إيدو باث
                </motion.h1>
                <motion.p 
                  className="text-sm lg:text-base font-tajawal font-semibold text-blue-600 dark:text-blue-400 tracking-wider"
                  whileHover={{ scale: 1.02 }}
                >
                  MasterEduPath Agency
                </motion.p>
              </div>
            </Link>
          </motion.div>

          {/* القائمة الرئيسية المحسنة - شاشات كبيرة */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link
                  to={item.href}
                  className={`relative font-medium flex items-center gap-2 flex-row-reverse px-4 py-2 rounded-lg transition-all duration-300 group ${
                    isActive(item.href) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className="h-4 w-4 relative z-10" />
                  </motion.div>
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
            
            {/* قائمة الخدمات المنسدلة المحسنة */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: navigation.length * 0.1, duration: 0.3 }}
            >
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`font-medium px-4 py-2 h-auto flex items-center gap-2 rounded-lg transition-all duration-300 group relative ${
                      isDropdownOpen ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <span>خدماتنا</span>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Briefcase className="h-4 w-4" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <DropdownMenuContent 
                      className="w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-border/50 shadow-2xl z-50 rounded-xl overflow-hidden" 
                      align="end"
                      side="bottom"
                      sideOffset={8}
                      asChild
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4">
                          {servicesDropdown.map((service, index) => (
                            <DropdownMenuItem key={service.name} asChild>
                              <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05, duration: 0.2 }}
                              >
                                <Link
                                  to={service.href}
                                  className="w-full cursor-pointer hover:bg-primary/10 focus:bg-primary/10 flex items-center gap-4 p-4 rounded-xl flex-row-reverse transition-all duration-300 group mb-2 last:mb-0"
                                  onClick={() => setIsDropdownOpen(false)}
                                >
                                  <motion.div 
                                    className="flex-shrink-0 w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <service.icon className="h-6 w-6 text-primary" />
                                  </motion.div>
                                  <div className="flex-1 text-right">
                                    <div className="font-semibold text-base text-foreground group-hover:text-primary transition-colors duration-300 mb-1">{service.name}</div>
                                    <div className="text-sm text-muted-foreground leading-relaxed">{service.description}</div>
                                  </div>
                                  <motion.div
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    whileHover={{ x: -5 }}
                                  >
                                    <ArrowLeft className="h-5 w-5 text-primary" />
                                  </motion.div>
                                </Link>
                              </motion.div>
                            </DropdownMenuItem>
                          ))}
                        </div>
                      </motion.div>
                    </DropdownMenuContent>
                  )}
                </AnimatePresence>
              </DropdownMenu>
            </motion.div>
          </nav>

          {/* أزرار الإجراءات المحسنة */}
          <motion.div 
            className="hidden lg:flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8 py-3 rounded-xl" 
                asChild
              >
                <Link to="/submit-order" className="flex items-center gap-2">
                  <span>اطلب الآن</span>
                  <motion.div
                    animate={{ x: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* زر القائمة المحسن للهواتف */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" className="lg:hidden relative p-2 rounded-xl hover:bg-primary/10 transition-colors duration-300">
                  <AnimatePresence mode="wait">
                    {isOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-border/50 shadow-2xl" 
              dir="rtl"
            >
              <motion.div 
                className="flex flex-col space-y-6 mt-8 px-2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* الشعار المحسن */}
                <motion.div 
                  className="flex items-center justify-end mb-6 border-b border-border/50 pb-6"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="text-right ml-4">
                    <span className="font-arabic-formal font-bold text-xl text-slate-800 dark:text-white leading-tight tracking-wide block">وكالة ماستر إيدو باث</span>
                    <p className="text-sm font-tajawal font-medium text-blue-600 dark:text-blue-400 tracking-wide">MasterEduPath Agency</p>
                  </div>
                  <motion.div 
                    className="relative w-14 h-14"
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center border border-white/20">
                      <div className="flex flex-col items-center justify-center">
                        <GraduationCap className="h-7 w-7 text-white mb-0.5" />
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 text-white/90" />
                          <Globe className="h-3 w-3 text-white/90 -mr-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border border-white shadow-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                  </motion.div>
                </motion.div>
                
                {/* عناصر التنقل المحسنة */}
                <div className="space-y-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        to={item.href}
                        className={`transition-all duration-300 py-4 px-4 rounded-xl flex items-center gap-4 group ${
                          isActive(item.href)
                            ? 'text-primary bg-primary/10 shadow-sm'
                            : 'text-foreground hover:text-primary hover:bg-primary/5'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                        </motion.div>
                        <span className="font-semibold flex-1 text-right">{item.name}</span>
                        {isActive(item.href) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-primary rounded-full"
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                {/* قائمة الخدمات المحسنة للهواتف */}
                <motion.div 
                  className="border-t border-border/50 pt-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <motion.button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="w-full flex items-center justify-between gap-4 py-4 px-4 rounded-xl text-right hover:text-primary hover:bg-primary/5 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: isServicesOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="h-4 w-4 text-primary" />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Briefcase className="h-5 w-5 text-primary" />
                      </motion.div>
                    </div>
                    <span className="font-semibold text-foreground">خدماتنا</span>
                  </motion.button>
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div 
                        className="mt-3 space-y-3 pr-4"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {servicesDropdown.map((service, index) => (
                          <motion.div
                            key={service.name}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                          >
                            <Link
                              to={service.href}
                              className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 py-4 px-3 rounded-xl block group"
                              onClick={() => {
                                setIsOpen(false);
                                setIsServicesOpen(false);
                              }}
                            >
                              <div className="flex items-start gap-4 flex-row-reverse">
                                <motion.div 
                                  className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300"
                                  whileHover={{ scale: 1.1, rotate: 5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <service.icon className="h-5 w-5 text-primary" />
                                </motion.div>
                                <div className="flex-1 text-right">
                                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300 mb-1">{service.name}</div>
                                  <div className="text-xs text-muted-foreground leading-relaxed">{service.description}</div>
                                </div>
                                <motion.div
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  whileHover={{ x: -3 }}
                                >
                                  <ArrowLeft className="h-4 w-4 text-primary" />
                                </motion.div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                
                {/* أزرار الإجراءات المحسنة */}
                <motion.div 
                  className="flex flex-col space-y-4 mt-8 border-t border-border/50 pt-6"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold py-4 rounded-xl" 
                      asChild
                    >
                      <Link to="/submit-order" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2">
                        <span>اطلب الآن</span>
                        <motion.div
                          animate={{ x: [0, -3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </motion.div>
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;