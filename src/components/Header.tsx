import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Globe, 
  GraduationCap, 
  BookOpen, 
  ChevronDown, 
  Search, 
  Languages, 
  PenTool,
  Home,
  Package,
  Users,
  Phone,
  Mail,
  FileText,
  Briefcase,
  Award,
  Microscope,
  Edit3
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'تتبع الطلب', href: '/order-tracking', icon: Package },
    { name: 'من نحن', href: '/about-us', icon: Users },
    { name: 'تواصل معنا', href: '/contact', icon: Phone },
  ];

  const servicesDropdown = [
    { name: 'خدمات الترجمة', href: '/translation-services', icon: Languages, description: 'ترجمة النصوص والوثائق' },
    { name: 'خدمات الأبحاث والكتابة', href: '/research-services', icon: Microscope, description: 'كتابة وتحليل الأبحاث العلمية' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* الشعار */}
          <div className="flex items-center space-x-reverse space-x-4">
            <div className="flex items-center">
              <div className="relative w-14 h-14 ml-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 rounded-2xl shadow-xl flex items-center justify-center border-2 border-white/20">
                  <div className="flex flex-col items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-white mb-0.5" />
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 text-white/90" />
                      <Globe className="h-3 w-3 text-white/90 -ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-arabic-formal font-bold text-slate-800 dark:text-white leading-tight tracking-wide">وكالة ماستر إيدو باث</h1>
                <p className="text-base font-tajawal font-semibold text-blue-700 dark:text-blue-400 tracking-wider">MasterEduPath Agency</p>
              </div>
            </div>
          </div>

          {/* القائمة الرئيسية - شاشات كبيرة */}
          <nav className="hidden lg:flex items-center space-x-reverse space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            
            {/* قائمة الخدمات المنسدلة */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors duration-200 font-medium px-3 py-2 h-auto flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  خدماتنا
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 bg-background border border-border shadow-xl z-50" align="start">
                <div className="p-2">
                  <div className="text-sm font-semibold text-muted-foreground mb-3 px-2 text-right">خدماتنا المتخصصة</div>
                  {servicesDropdown.map((service) => (
                    <DropdownMenuItem key={service.name} asChild>
                      <Link
                        to={service.href}
                        className="w-full cursor-pointer hover:bg-muted focus:bg-muted flex items-start gap-3 p-3 rounded-lg text-right"
                      >
                        <div className="flex-1 text-right">
                          <div className="font-medium text-sm text-foreground">{service.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{service.description}</div>
                        </div>
                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <service.icon className="h-5 w-5 text-primary" />
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* أزرار الإجراءات */}
          <div className="hidden lg:flex items-center space-x-reverse space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/order-tracking">
                <Search className="h-4 w-4 ml-2" />
                تتبع الطلب
              </Link>
            </Button>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medium" asChild>
              <Link to="/submit-order">
                اطلب الان
              </Link>
            </Button>
          </div>

          {/* زر القائمة للهواتف */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center mb-6">
                  <div className="relative w-12 h-12 ml-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 rounded-xl shadow-lg flex items-center justify-center border border-white/20">
                      <div className="flex flex-col items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-white mb-0.5" />
                        <div className="flex items-center">
                          <BookOpen className="h-2.5 w-2.5 text-white/90" />
                          <Globe className="h-2.5 w-2.5 text-white/90 -ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border border-white shadow-sm flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-arabic-formal font-bold text-lg text-slate-800 dark:text-white leading-tight tracking-wide">وكالة ماستر إيدو باث</span>
                    <p className="text-sm font-tajawal font-medium text-blue-700 dark:text-blue-400 tracking-wide">MasterEduPath Agency</p>
                  </div>
                </div>
                
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-200 py-3 border-b border-muted block flex items-center gap-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
                
                {/* قائمة الخدمات للهواتف */}
                <div className="py-2 border-b border-muted">
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="flex items-center justify-between w-full gap-2 py-2 px-1 text-right hover:text-primary transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">خدماتنا المتخصصة</span>
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <ChevronDown className={`h-4 w-4 text-primary transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isServicesOpen && (
                    <div className="mt-2 space-y-1">
                      {servicesDropdown.map((service) => (
                        <Link
                          key={service.name}
                          to={service.href}
                          className="text-muted-foreground hover:text-primary transition-colors duration-200 py-3 pr-4 block"
                          onClick={() => {
                            setIsOpen(false);
                            setIsServicesOpen(false);
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1 text-right">
                              <div className="font-medium text-sm text-foreground">{service.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">{service.description}</div>
                            </div>
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <service.icon className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 mt-6">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/order-tracking" onClick={() => setIsOpen(false)}>
                      <Search className="h-4 w-4 ml-2" />
                      تتبع الطلب
                    </Link>
                  </Button>
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground" asChild>
                    <Link to="/submit-order" onClick={() => setIsOpen(false)}>
                      اطلب الان
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;