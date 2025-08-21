import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TranslationCalculator from "@/components/TranslationCalculator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Scale, 
  FileText, 
  Award, 
  Shield, 
  Clock, 
  Users,
  CheckCircle,
  Star
} from "lucide-react";

const LegalTranslation = () => {
  const services = [
    "ترجمة العقود التجارية",
    "ترجمة الوثائق القانونية",
    "ترجمة شهادات الميلاد والوفاة",
    "ترجمة الشهادات الأكاديمية",
    "ترجمة براءات الاختراع",
    "ترجمة المذكرات القانونية",
    "ترجمة قوانين الشركات",
    "ترجمة وثائق المحاكم"
  ];

  const features = [
    {
      icon: Award,
      title: "مترجمون معتمدون",
      description: "فريق من المترجمين المعتمدين في القانون"
    },
    {
      icon: Shield,
      title: "سرية تامة",
      description: "حماية كاملة لجميع الوثائق القانونية"
    },
    {
      icon: Clock,
      title: "تسليم سريع",
      description: "التزام بالمواعيد المحددة للتسليم"
    },
    {
      icon: CheckCircle,
      title: "دقة 100%",
      description: "مراجعة دقيقة لضمان الصحة القانونية"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* قسم Hero */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Scale className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-arabic-title font-bold mb-4">
              خدمات <span className="text-gradient">الترجمة القانونية</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نقدم خدمات ترجمة قانونية متخصصة ومعتمدة لجميع أنواع الوثائق والعقود القانونية 
              بأعلى معايير الدقة والسرية
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge className="bg-primary/10 text-primary">ترجمة معتمدة</Badge>
              <Badge className="bg-primary/10 text-primary">مراجعة قانونية</Badge>
              <Badge className="bg-primary/10 text-primary">سرية تامة</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* الخدمات المتاحة */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-arabic-title font-bold mb-4">
              الخدمات <span className="text-gradient">المتخصصة</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 shadow-soft animate-fade-in-up"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-bold mb-2">{service}</h3>
                  <div className="flex justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* المميزات */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-arabic-title font-bold mb-4">
              لماذا نحن <span className="text-gradient">الأفضل؟</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover-lift bg-gradient-card border-0 shadow-soft">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* حاسبة الترجمة */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-arabic-title font-bold mb-4">
              احسب تكلفة <span className="text-gradient">ترجمتك</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              احصل على عرض سعر فوري ودقيق لمشروع الترجمة القانونية الخاص بك
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <TranslationCalculator translationType="legal-translation" />
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Users className="h-12 w-12 mx-auto animate-float" />
            <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold">
              هل تحتاج لاستشارة قانونية؟
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              تواصل مع فريق الخبراء المتخصصين للحصول على استشارة مجانية حول مشروع الترجمة القانونية
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-strong px-8 py-4 text-lg"
              >
                استشارة مجانية
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                تواصل مع الخبراء
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalTranslation;