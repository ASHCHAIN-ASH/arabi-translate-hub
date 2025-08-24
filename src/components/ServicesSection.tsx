import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Mic, Globe, Video, Calculator, Users } from "lucide-react";
import realTextTranslation from "@/assets/real-text-translation.jpg";
import realDocumentTranslation from "@/assets/real-document-translation.jpg";
import realAudioTranslation from "@/assets/real-audio-translation.jpg";
import realWebsiteTranslation from "@/assets/real-website-translation.jpg";
import realVideoTranslation from "@/assets/real-video-translation.jpg";
import realBusinessServices from "@/assets/real-business-services.jpg";

const ServicesSection = () => {
  const services = [
    {
      title: "ترجمة النصوص",
      description: "ترجمة فورية وسريعة لجميع أنواع النصوص بدقة عالية ومراجعة احترافية",
      icon: FileText,
      image: realTextTranslation,
      features: ["ترجمة فورية", "مراجعة احترافية", "أكثر من 100 لغة", "دقة 99%"],
      href: "/services/text-translation"
    },
    {
      title: "ترجمة المستندات",
      description: "ترجمة ملفات Word, PDF, PowerPoint مع الحفاظ على التنسيق الأصلي",
      icon: FileText,
      image: realDocumentTranslation,
      features: ["حفظ التنسيق", "ملفات متعددة", "تسليم سريع", "سرية تامة"],
      href: "/services/document-translation"
    },
    {
      title: "الترجمة الصوتية",
      description: "تحويل الكلام إلى نص وترجمته مباشرة مع دعم جميع اللهجات",
      icon: Mic,
      image: realAudioTranslation,
      features: ["تحويل صوتي", "ترجمة فورية", "دعم اللهجات", "جودة عالية"],
      href: "/services/audio-translation"
    },
    {
      title: "ترجمة المواقع",
      description: "ترجمة مواقع الويب والصفحات الإلكترونية بالكامل مع الحفاظ على التصميم",
      icon: Globe,
      image: realWebsiteTranslation,
      features: ["ترجمة كاملة", "حفظ التصميم", "SEO محسن", "تحديث مستمر"],
      href: "/services/website-translation"
    },
    {
      title: "ترجمة الفيديو",
      description: "إضافة ترجمة للفيديوهات والأفلام مع خدمات الدبلجة الاحترافية",
      icon: Video,
      image: realVideoTranslation,
      features: ["ترجمة مرئية", "دبلجة صوتية", "توقيت دقيق", "جودة HD"],
      href: "/services/video-translation"
    },
    {
      title: "خدمات مخصصة",
      description: "حلول ترجمة مخصصة للشركات والمؤسسات بأسعار تنافسية",
      icon: Users,
      image: realBusinessServices,
      features: ["حلول مخصصة", "دعم 24/7", "فريق مختص", "أسعار مرنة"],
      href: "/services/custom-services"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950 relative overflow-hidden">
      
      {/* خلفية ديناميكية لقسم الخدمات */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-32 left-32 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-tl from-rose-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold text-foreground mb-4">
            خدماتنا <span className="text-gradient">الاحترافية</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            نقدم مجموعة شاملة من خدمات الترجمة المتطورة لتلبية جميع احتياجاتكم بأعلى معايير الجودة والدقة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className="group hover-lift bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-primary/20 backdrop-blur-sm rounded-full p-3">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-accent-emerald rounded-full ml-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={service.href}>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                    >
                      اطلب الخدمة
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* حاسبة الأسعار */}
        <div className="mt-16 text-center animate-fade-in-up">
          <Card className="max-w-md mx-auto bg-gradient-primary text-primary-foreground border-0 shadow-strong">
            <CardContent className="p-8 text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 animate-float" />
              <h3 className="text-xl font-bold mb-2">احسب تكلفة الترجمة</h3>
              <p className="text-primary-foreground/80 mb-6 text-sm">
                احصل على عرض سعر فوري لمشروع الترجمة الخاص بك
              </p>
              <Button 
                variant="secondary" 
                className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-medium"
              >
                احسب السعر الآن
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;