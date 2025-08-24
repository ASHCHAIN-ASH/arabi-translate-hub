import { Button } from "@/components/ui/button";
import { Menu, User, Globe, Phone, GraduationCap, BookOpen } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'الرئيسية', href: '/' },
    { name: 'خدمات الترجمة', href: '/translation-services' },
    { name: 'خدمات الأبحاث والكتابة', href: '/research-services' },
    { name: 'من نحن', href: '/about-us' },
    { name: 'تواصل معنا', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* الشعار */}
          <div className="flex items-center space-x-reverse space-x-4">
            <div className="flex items-center">
              <div className="relative w-12 h-12 ml-3">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center">
                  <div className="flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-white" />
                    <BookOpen className="h-4 w-4 text-white/80 -ml-1" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <div>
                <h1 className="text-xl font-arabic-title font-bold text-primary leading-tight">وكالة ماستر إيدو باث</h1>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">MasterEduPath Agency</p>
              </div>
            </div>
          </div>

          {/* القائمة الرئيسية - شاشات كبيرة */}
          <nav className="hidden lg:flex items-center space-x-reverse space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* أزرار الإجراءات */}
          <div className="hidden lg:flex items-center space-x-reverse space-x-4">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 ml-2" />
              تسجيل الدخول
            </Button>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medium">
              اطلب خدمة الترجمة
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
                  <div className="relative w-10 h-10 ml-3">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg shadow-lg flex items-center justify-center">
                      <div className="flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-white" />
                        <BookOpen className="h-3 w-3 text-white/80 -ml-1" />
                      </div>
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border border-white shadow-sm"></div>
                  </div>
                  <div>
                    <span className="font-arabic-title font-bold text-lg text-primary">وكالة ماستر إيدو باث</span>
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">MasterEduPath Agency</p>
                  </div>
                </div>
                
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors duration-200 py-2 border-b border-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                
                <div className="flex flex-col space-y-2 mt-6">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 ml-2" />
                    تسجيل الدخول
                  </Button>
                  <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                    اطلب خدمة الترجمة
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