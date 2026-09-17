import { Button } from "@/components/ui/button";
const fekrahLogoUrl = "/fekrah-logo.jpg";
import { 
  Menu, GraduationCap, ChevronDown, Languages, Home, Users, Phone, 
  Briefcase, Microscope, ArrowLeft, FileText, MapIcon, LogIn, UserPlus, LogOut, User
} from "lucide-react";
import { useAuth } from "./SimpleAuthProvider";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, userRole, loading: authLoading, signOut } = useAuth();

  const navigation = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'من نحن', href: '/about-us', icon: Users },
    { name: 'تواصل معنا', href: '/contact', icon: Phone },
  ];

  const servicesDropdown = [
    { name: 'خدمات الترجمة', href: '/translation-services', icon: Languages, description: 'ترجمة احترافية للنصوص والوثائق' },
    { name: 'خدمات الأبحاث والكتابة', href: '/research-services', icon: Microscope, description: 'دعم شامل للباحثين الأكاديميين' },
    { name: 'رحلة الباحث', href: '/research/journey', icon: MapIcon, description: 'خارطة شاملة لمراحل البحث' },
    { name: 'النشر في المجلات المعتمدة', href: '/research/journal-publication', icon: FileText, description: 'النشر في المجلات العلمية المحكمة' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className="sticky top-0 z-50 w-full glass border-b border-border/40" 
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 lg:w-11 lg:h-11 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-lg shadow-primary/10 group-hover:shadow-primary/30 transition-shadow duration-300">
              <img
                src={fekrahLogoUrl}
                alt="شعار FekrahEdu"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            <div className="text-right">
              <h1 className="text-sm lg:text-base font-bold text-foreground leading-tight tracking-tight">
                FekrahEdu
              </h1>
              <p className="text-[10px] lg:text-xs text-muted-foreground font-medium hidden sm:block">
                Shaping Your Academic and Career Success
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href) 
                    ? 'text-primary bg-primary/8' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-foreground gap-1.5 px-4">
                  خدماتنا
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 glass border-border/50 shadow-strong rounded-xl p-2" align="end">
                {servicesDropdown.map((service) => (
                  <DropdownMenuItem key={service.name} asChild>
                    <Link to={service.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors">
                      <div className="w-10 h-10 bg-primary/8 rounded-lg flex items-center justify-center flex-shrink-0">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-right flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground">{service.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 truncate">{service.description}</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!authLoading && !user && (
              <>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5" asChild>
                  <Link to="/login">
                    <LogIn className="h-3.5 w-3.5" />
                    تسجيل الدخول
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs font-medium gap-1.5" asChild>
                  <Link to="/register">
                    <UserPlus className="h-3.5 w-3.5" />
                    حساب جديد
                  </Link>
                </Button>
              </>
            )}
            {!authLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs font-medium gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {user.user_metadata?.full_name || 'حسابي'}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 glass border-border/50 rounded-xl p-1">
                  {userRole === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/adminfekrah" className="flex items-center gap-2 text-sm cursor-pointer">
                        <Briefcase className="h-4 w-4" />
                        لوحة التحكم
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/client/dashboard" className="flex items-center gap-2 text-sm cursor-pointer">
                      <User className="h-4 w-4" />
                      حسابي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 text-sm cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-primary/20 shadow-md hover:shadow-primary/30 hover:shadow-lg transition-all duration-200 text-xs sm:text-sm rounded-lg px-4" asChild>
              <Link to="/order-now" className="flex items-center gap-1.5">
                <span>اطلب الآن</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 rounded-lg">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass border-border/40 p-0" dir="rtl">
                <div className="flex flex-col h-full">
                  {/* Mobile header */}
                  <div className="flex items-center gap-3 p-6 border-b border-border/40">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-foreground">FekrahEdu</span>
                      <p className="text-xs text-muted-foreground">FekrahEdu</p>
                    </div>
                  </div>
                  
                  {/* Mobile nav */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                          isActive(item.href) ? 'text-primary bg-primary/8 font-medium' : 'text-foreground hover:bg-muted/50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    ))}

                    <div className="pt-4 pb-2 px-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">خدماتنا</span>
                    </div>
                    {servicesDropdown.map((service) => (
                      <Link
                        key={service.name}
                        to={service.href}
                        className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center flex-shrink-0">
                          <service.icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{service.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Mobile CTA */}
                  <div className="p-4 border-t border-border/40 space-y-2">
                    {!authLoading && !user && (
                      <div className="flex gap-2 mb-2">
                        <Button variant="outline" className="flex-1 text-sm gap-1.5" asChild>
                          <Link to="/login" onClick={() => setIsOpen(false)}>
                            <LogIn className="h-4 w-4" />
                            دخول
                          </Link>
                        </Button>
                        <Button variant="outline" className="flex-1 text-sm gap-1.5" asChild>
                          <Link to="/register" onClick={() => setIsOpen(false)}>
                            <UserPlus className="h-4 w-4" />
                            تسجيل
                          </Link>
                        </Button>
                      </div>
                    )}
                    {!authLoading && user && (
                      <div className="flex gap-2 mb-2">
                        <Button variant="outline" className="flex-1 text-sm gap-1.5" asChild>
                          <Link to="/client/dashboard" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4" />
                            حسابي
                          </Link>
                        </Button>
                        <Button variant="outline" className="flex-1 text-sm gap-1.5 text-destructive" onClick={() => { signOut(); setIsOpen(false); }}>
                          <LogOut className="h-4 w-4" />
                          خروج
                        </Button>
                      </div>
                    )}
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/90 shadow-primary/20 shadow-md" asChild>
                      <Link to="/order-now" className="flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                        اطلب خدمتك الآن
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
    </header>
  );
};

export default Header;
