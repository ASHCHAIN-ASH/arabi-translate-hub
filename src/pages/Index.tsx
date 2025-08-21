import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServicesSection from "@/components/ServicesSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Users, 
  Globe, 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowLeft,
  PlayCircle,
  Award
} from "lucide-react";
import heroImage from "@/assets/hero-translation.jpg";

const Index = () => {
  const stats = [
    { icon: Users, number: "50,000+", label: "عميل راض" },
    { icon: Globe, number: "100+", label: "لغة مدعومة" },
    { icon: CheckCircle, number: "1M+", label: "كلمة مترجمة" },
    { icon: Award, number: "99%", label: "دقة الترجمة" }
  ];

  const features = [
    {
      icon: Zap,
      title: "ترجمة فورية",
      description: "احصل على ترجمة دقيقة في ثوان معدودة"
    },
    {
      icon: Shield,
      title: "أمان وخصوصية",
      description: "نضمن حماية بياناتك وسرية مستنداتك"
    },
    {
      icon: Clock,
      title: "متاح 24/7",
      description: "خدمة ترجمة متاحة طوال الوقت"
    },
    {
      icon: Star,
      title: "جودة احترافية",
      description: "ترجمة بجودة عالية ومراجعة من خبراء"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مدير شركة",
      rating: 5,
      text: "خدمة ممتازة وسريعة، ترجمة دقيقة وفي الوقت المحدد. أنصح بها بشدة.",
      avatar: "👨‍💼"
    },
    {
      name: "فاطمة علي",
      role: "محامية",
      rating: 5,
      text: "استخدمت الموقع لترجمة وثائق قانونية، النتيجة كانت احترافية جداً.",
      avatar: "👩‍💼"
    },
    {
      name: "محمد العتيبي",
      role: "أكاديمي",
      rating: 5,
      text: "أفضل منصة ترجمة استخدمتها، سهولة في الاستخدام ودقة في النتائج.",
      avatar: "👨‍🎓"
    }
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      {/* قسم Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* خلفية متدرجة */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* صورة الخلفية */}
        <div className="absolute inset-0">
          <img 
            src={heroImage}
            alt="منصة الترجمة الاحترافية"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Star className="h-4 w-4 ml-2 text-yellow-400" />
              المنصة الأولى للترجمة في المنطقة
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-arabic-title font-bold leading-tight">
              مركز <span className="text-primary-glow">الخبراء</span>
              <br />
              للترجمة الاحترافية
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto">
              نقدم خدمات ترجمة احترافية شاملة بأكثر من 100 لغة عالمية.
              فريق من المترجمين المعتمدين والمتخصصين في جميع المجالات لضمان أعلى جودة ودقة.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-strong px-8 py-4 text-lg font-medium"
              >
                اطلب خدمة الترجمة
                <ArrowLeft className="h-5 w-5 mr-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <PlayCircle className="h-5 w-5 ml-2" />
                شاهد العرض التوضيحي
              </Button>
            </div>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center animate-fade-in-up" 
                     style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-4">
                    <IconComponent className="h-6 w-6 text-primary-glow mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* أنواع الترجمات */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold mb-4">
              أنواع <span className="text-gradient">الترجمات</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نقدم جميع أنواع خدمات الترجمة المتخصصة لتلبية احتياجاتكم المختلفة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "الترجمة القانونية", desc: "ترجمة العقود والوثائق القانونية", icon: "⚖️" },
              { title: "الترجمة الطبية", desc: "ترجمة التقارير والأبحاث الطبية", icon: "🏥" },
              { title: "الترجمة التقنية", desc: "ترجمة المستندات التقنية والهندسية", icon: "⚙️" },
              { title: "الترجمة التجارية", desc: "ترجمة المراسلات والتقارير التجارية", icon: "💼" },
              { title: "الترجمة الأكاديمية", desc: "ترجمة الأبحاث والرسائل العلمية", icon: "🎓" },
              { title: "الترجمة الأدبية", desc: "ترجمة الكتب والنصوص الأدبية", icon: "📚" },
              { title: "الترجمة الإعلامية", desc: "ترجمة المقالات والأخبار", icon: "📰" },
              { title: "الترجمة الفورية", desc: "ترجمة فورية للمؤتمرات والاجتماعات", icon: "🎤" }
            ].map((type, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card shadow-soft border-0 animate-fade-in-up"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 space-y-4">
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="text-lg font-bold">{type.title}</h3>
                  <p className="text-muted-foreground text-sm">{type.desc}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    اطلب الخدمة
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* المزايا الرئيسية */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold mb-4">
              لماذا تختار <span className="text-gradient">مركز الخبراء؟</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover-lift bg-gradient-card shadow-soft border-0 animate-fade-in-up"
                     style={{ animationDelay: `${index * 0.1}s` }}>
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

      {/* قسم الخدمات */}
      <ServicesSection />

      {/* آراء العملاء */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold mb-4">
              ماذا يقول <span className="text-gradient">عملاؤنا</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift bg-gradient-card border-0 shadow-soft animate-fade-in-up"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* دعوة للعمل النهائية */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-arabic-title font-bold">
              هل أنت مستعد للبدء؟
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed">
              انضم إلى آلاف العملاء الذين يثقون في خدماتنا. احصل على ترجمة احترافية الآن!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 shadow-strong px-8 py-4 text-lg"
              >
                احصل على عرض سعر
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                تواصل مع فريق المبيعات
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;