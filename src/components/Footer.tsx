import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-foreground to-foreground/90 text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* معلومات الشركة */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-primary-glow ml-3" />
              <div>
                <h3 className="text-xl font-arabic-title font-bold">ترجمان</h3>
                <p className="text-sm text-background/70">منصة الترجمة الاحترافية</p>
              </div>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              منصة ترجمة احترافية تقدم خدمات ترجمة عالية الجودة بأكثر من 100 لغة. 
              نحن ملتزمون بتقديم حلول ترجمة دقيقة وسريعة لعملائنا.
            </p>
            <div className="flex space-x-reverse space-x-4">
              <Button variant="ghost" size="sm" className="hover:bg-background/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-background/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-background/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-background/10">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* روابط سريعة */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-background">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                'خدماتنا',
                'الأسعار',
                'عن الشركة',
                'المدونة',
                'الأسئلة الشائعة',
                'سياسة الخصوصية'
              ].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* خدماتنا */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-background">خدماتنا</h4>
            <ul className="space-y-2">
              {[
                'ترجمة النصوص',
                'ترجمة المستندات',
                'الترجمة الصوتية',
                'ترجمة المواقع',
                'ترجمة الفيديو',
                'خدمات مخصصة'
              ].map((service) => (
                <li key={service}>
                  <a 
                    href="#" 
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* معلومات التواصل والنشرة */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-background">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-background/80">
                <Phone className="h-4 w-4 ml-3 flex-shrink-0" />
                <span>+966 50 123 4567</span>
              </div>
              <div className="flex items-center text-sm text-background/80">
                <Mail className="h-4 w-4 ml-3 flex-shrink-0" />
                <span>info@tarjuman.com</span>
              </div>
              <div className="flex items-center text-sm text-background/80">
                <MapPin className="h-4 w-4 ml-3 flex-shrink-0" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <h5 className="font-medium text-background">اشترك في نشرتنا الإخبارية</h5>
              <div className="flex gap-2">
                <Input 
                  placeholder="البريد الإلكتروني" 
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary-glow text-primary-foreground"
                >
                  اشترك
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* خط الفصل وحقوق الطبع */}
        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm text-center md:text-right">
              © {currentYear} ترجمان. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                شروط الاستخدام
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-background/70 hover:text-background transition-colors">
                دعم العملاء
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;