import { Button } from "@/components/ui/button";
import { Menu, User, Globe, Phone } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'الرئيسية', href: '/' },
    { name: 'خدمات الترجمة', href: '/translation-services' },
    { name: 'الأسعار', href: '/pricing' },
    { name: 'عن الشركة', href: '/about' },
    { name: 'المدونة', href: '/blog' },
    { name: 'تواصل معنا', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* الشعار */}
          <div className="flex items-center space-x-reverse space-x-4">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-primary ml-2" />
              <div>
                <h1 className="text-xl font-arabic-title font-bold text-primary">مركز الخبراء</h1>
                <p className="text-xs text-muted-foreground">للترجمة الاحترافية</p>
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
                  <Globe className="h-6 w-6 text-primary ml-2" />
                  <span className="font-arabic-title font-bold text-lg">مركز الخبراء</span>
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