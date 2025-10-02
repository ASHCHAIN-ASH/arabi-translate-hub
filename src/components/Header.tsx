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
  FileText,
  MapIcon
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
    { name: 'رحلة الباحث', href: '/research/journey', icon: MapIcon, description: 'خارطة شاملة لمراحل البحث من البداية حتى النشر' },
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
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* الشعار محسن للجوال */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center min-w-0">
              <motion.div 
                className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 ml-2 sm:ml-3 flex-shrink-0"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg flex items-center justify-center border border-white/30">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border border-white flex items-center justify-center">
                  <span className="text-white text-[8px] sm:text-xs font-bold">M</span>
                </div>
              </motion.div>
              <div className="text-right min-w-0 flex-1">
                <h1 className="text-sm sm:text-base lg:text-2xl font-arabic-formal font-bold text-slate-800 leading-tight truncate">
                  <span className="hidden sm:inline">وكالة ماستر إيدو باث</span>
                  <span className="sm:hidden">ماستر إيدو باث</span>
                </h1>
                <p className="text-[10px] sm:text-xs lg:text-sm font-tajawal font-medium text-blue-600 truncate hidden sm:block">
                  MasterEduPath Agency
                </p>
              </div>
            </Link>
          </motion.div>

          {/* القائمة الرئيسية - شاشات كبيرة */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigation.map((item, index) => (
              <motion.div key={item.name} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1, duration: 0.3 }}>
                <Link to={item.href} className={`relative font-medium flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive(item.href) ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-primary/5'}`}>
                  <span>{item.name}</span>
                  <item.icon className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
            
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium px-4 py-2 flex items-center gap-2 rounded-lg">
                  <span>خدماتنا</span>
                  <Briefcase className="h-4 w-4" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-96 bg-white/95 backdrop-blur-xl border shadow-2xl rounded-xl overflow-hidden" align="end">
                <div className="p-4">
                  {servicesDropdown.map((service) => (
                    <DropdownMenuItem key={service.name} asChild>
                      <Link to={service.href} className="w-full cursor-pointer hover:bg-primary/10 flex items-center gap-4 p-4 rounded-xl transition-all duration-300 mb-2">
                        <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center">
                          <service.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 text-right">
                          <div className="font-semibold text-base mb-1">{service.name}</div>
                          <div className="text-sm text-muted-foreground">{service.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* أزرار الجوال */}
          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md" asChild>
              <Link to="/order-now" className="flex items-center gap-1 whitespace-nowrap">
                <span>اطلب الآن</span>
                <ArrowLeft className="h-3 w-3" />
              </Link>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-1.5 sm:p-2 rounded-lg">
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80 bg-white/95 backdrop-blur-xl" dir="rtl">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="flex items-center justify-end mb-4 pb-4 border-b">
                    <div className="text-right ml-3">
                      <span className="font-arabic-formal font-bold text-lg text-slate-800">ماستر إيدو باث</span>
                      <p className="text-xs text-blue-600">MasterEduPath</p>
                    </div>
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {navigation.map((item) => (
                      <Link key={item.name} to={item.href} className={`py-3 px-3 rounded-lg flex items-center gap-3 transition-all ${isActive(item.href) ? 'text-primary bg-primary/10' : 'hover:bg-primary/5'}`} onClick={() => setIsOpen(false)}>
                        <item.icon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 border-t">
                    <div className="mb-2 px-3">
                      <span className="text-xs font-semibold text-muted-foreground">خدماتنا</span>
                    </div>
                    <div className="space-y-1">
                      {servicesDropdown.map((service) => (
                        <Link key={service.name} to={service.href} className="py-2.5 px-3 rounded-lg flex items-center gap-3 hover:bg-primary/5" onClick={() => setIsOpen(false)}>
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <service.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-sm">{service.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80" asChild>
                      <Link to="/order-now" className="flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                        <span>اطلب خدمتك الآن</span>
                        <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;