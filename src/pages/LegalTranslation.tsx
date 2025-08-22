import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileAnalyzer from "@/components/FileAnalyzer";
import AdvancedWordCounter from "@/components/AdvancedWordCounter";
import PricingReport from "@/components/PricingReport";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scale, 
  FileText, 
  Award, 
  Shield, 
  Clock, 
  Users,
  CheckCircle,
  Star,
  Calculator,
  Zap,
  Globe,
  Scan,
  BarChart3,
  FileSpreadsheet,
  Sparkles,
  TrendingUp,
  Target,
  Layers,
  BookOpen,
  Building2,
  Gavel
} from "lucide-react";
import legalOfficeBg from "@/assets/legal-office-bg.jpg";

const LegalTranslation = () => {
  const [activeTab, setActiveTab] = useState("analyzer");
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [priceRate, setPriceRate] = useState(0.19);

  const services = [
    { title: "ترجمة العقود التجارية", icon: FileText, desc: "عقود البيع والشراء والتوريد" },
    { title: "ترجمة الوثائق القانونية", icon: Gavel, desc: "المرافعات والأحكام القضائية" },
    { title: "ترجمة شهادات الميلاد", icon: Award, desc: "الشهادات الشخصية والرسمية" },
    { title: "ترجمة الشهادات الأكاديمية", icon: BookOpen, desc: "الدبلومات والشهادات الجامعية" },
    { title: "ترجمة براءات الاختراع", icon: Sparkles, desc: "الملكية الفكرية والاختراعات" },
    { title: "ترجمة قوانين الشركات", icon: Building2, desc: "اللوائح والنظم الداخلية" },
    { title: "ترجمة وثائق المحاكم", icon: Scale, desc: "الأحكام والقرارات القضائية" },
    { title: "ترجمة المذكرات القانونية", icon: FileSpreadsheet, desc: "المذكرات والتقارير القانونية" }
  ];

  const features = [
    { icon: Award, title: "مترجمون معتمدون", desc: "فريق من المترجمين المعتمدين في القانون" },
    { icon: Shield, title: "سرية تامة", desc: "حماية كاملة لجميع الوثائق القانونية" },
    { icon: Clock, title: "تسليم سريع", desc: "التزام بالمواعيد المحددة للتسليم" },
    { icon: CheckCircle, title: "دقة 100%", desc: "مراجعة دقيقة لضمان الصحة القانونية" }
  ];

  const mockAnalysisData = {
    totalWords: analysisData?.reduce((sum: number, file: any) => sum + file.sourceWords, 0) || 0,
    billableWords: analysisData?.reduce((sum: number, file: any) => sum + file.sourceWords - file.excluded, 0) || 0,
    files: analysisData || [],
    duplicates: { intraFile: 150, interFile: 75, totalUnique: 850 },
    exclusions: { headers: 45, footers: 23, pureNumbers: 89, codes: 34, links: 12, placeholders: 67 },
    pricing: {
      baseRate: priceRate,
      duplicateDiscount: { intra: 0.3, inter: 0.2 },
      additionalFees: { ocr: 50, urgency: 0, formatting: 25, certification: 100 },
      minimumCharge: 70,
      finalTotal: 0
    }
  };

  return (
    <div className="min-h-screen relative rtl-container" dir="rtl">
      <AnimatedBackground />
      <Header />
      
      {/* Hero Section - تصميم احترافي مع تأثيرات متقدمة */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${legalOfficeBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-dark/90 to-accent/85" />
        
        {/* تأثيرات بصرية متقدمة */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-primary-light/25 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up max-w-5xl mx-auto">
            {/* أيقونة رئيسية مع تأثيرات */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/30 rounded-full blur-2xl animate-pulse-soft" />
                <div className="relative bg-gradient-to-br from-background/20 to-background/5 backdrop-blur-md p-8 rounded-full border border-background/20 shadow-strong">
                  <Scale className="h-20 w-20 text-background animate-float" />
                </div>
              </div>
            </div>
            
            {/* العنوان الرئيسي */}
            <h1 className="text-6xl lg:text-8xl font-arabic-title font-bold mb-8 text-background leading-tight">
              خدمات <span className="text-secondary">الترجمة القانونية</span> المتخصصة
            </h1>
            
            {/* الوصف */}
            <p className="text-xl lg:text-2xl text-background/90 max-w-4xl mx-auto leading-relaxed mb-12 font-arabic-body">
              نقدم خدمات ترجمة قانونية احترافية معتمدة مع نظام حساب دقيق للكلمات وتسعير شفاف 
              لجميع أنواع الوثائق القانونية والرسمية
            </p>
            
            {/* شارات المزايا */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="bg-background/20 text-background border border-background/30 backdrop-blur-md px-6 py-3 text-lg hover-lift">
                <Shield className="h-5 w-5 ml-2" />
                ترجمة معتمدة ومضمونة
              </Badge>
              <Badge className="bg-secondary/20 text-background border border-secondary/40 backdrop-blur-md px-6 py-3 text-lg hover-lift">
                <Award className="h-5 w-5 ml-2" />
                مترجمون قانونيون خبراء
              </Badge>
              <Badge className="bg-success/20 text-background border border-success/40 backdrop-blur-md px-6 py-3 text-lg hover-lift">
                <Clock className="h-5 w-5 ml-2" />
                تسليم سريع ودقيق
              </Badge>
              <Badge className="bg-accent/20 text-background border border-accent/40 backdrop-blur-md px-6 py-3 text-lg hover-lift">
                <CheckCircle className="h-5 w-5 ml-2" />
                دقة 100% مضمونة
              </Badge>
            </div>
            
            {/* أزرار العمل */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-secondary text-primary hover:bg-secondary-light shadow-secondary px-8 py-4 text-lg font-bold hover-lift"
              >
                <Calculator className="h-5 w-5 ml-2" />
                احسب تكلفة الترجمة الآن
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-background text-background hover:bg-background hover:text-primary backdrop-blur-md px-8 py-4 text-lg font-bold hover-lift"
              >
                <FileText className="h-5 w-5 ml-2" />
                شاهد نماذج أعمالنا
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الخدمات - تصميم جديد */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold text-foreground mb-6">
              خدماتنا <span className="text-gradient">القانونية المتخصصة</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              نقدم ترجمة احترافية لجميع أنواع الوثائق القانونية مع ضمان الدقة والسرية التامة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover-lift bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-500 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-primary p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 font-arabic-title">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* قسم المزايا - تصميم محسن */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold text-foreground mb-6">
              لماذا نحن <span className="text-gradient-secondary">الخيار الأفضل؟</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نجمع بين الخبرة القانونية والتقنية المتقدمة لضمان أفضل خدمة ترجمة
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group text-center hover-lift bg-background border-0 shadow-soft hover:shadow-strong transition-all duration-500">
                <CardContent className="p-8">
                  <div className="bg-gradient-primary p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                    <feature.icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4 font-arabic-title">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* النظام المتقدم - تصميم محسن */}
      <section className="py-20 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-arabic-title font-bold text-foreground mb-6">
              <span className="text-gradient">نظام الحساب</span> الذكي المتطور
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              تقنية متقدمة لحساب الكلمات وتحليل الملفات مع تسعير تلقائي دقيق وتقارير تفصيلية
            </p>
          </div>
          
          <Card className="bg-gradient-card border-0 shadow-strong backdrop-blur-sm overflow-hidden">
            {/* رأس البطاقة المحسن */}
            <div className="relative bg-gradient-primary text-primary-foreground p-8">
              <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
              <div className="relative flex items-center justify-center gap-4">
                <div className="bg-secondary/20 p-4 rounded-2xl backdrop-blur-md">
                  <Sparkles className="h-10 w-10 animate-pulse-soft" />
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-arabic-title font-bold">
                    محرك التحليل الاحترافي
                  </h3>
                  <p className="text-primary-foreground/80 mt-2">
                    معالجة سريعة ومتوازية مع دعم كامل للغة العربية والـ RTL
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* قائمة التبويبات المحسنة */}
                <div className="flex justify-center mb-8">
                  <TabsList className="grid grid-cols-3 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm border border-border/50 p-1 rounded-2xl shadow-soft" dir="rtl">
                    <TabsTrigger 
                      value="analyzer" 
                      className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-primary gap-3 flex-row-reverse px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      <Scan className="h-5 w-5" />
                      <span className="font-bold">تحليل الملفات</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pricing" 
                      className="data-[state=active]:bg-gradient-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-secondary gap-3 flex-row-reverse px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      <Calculator className="h-5 w-5" />
                      <span className="font-bold">التسعير</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="reports" 
                      className="data-[state=active]:bg-gradient-success data-[state=active]:text-success-foreground data-[state=active]:shadow-success gap-3 flex-row-reverse px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span className="font-bold">التقارير</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="analyzer" className="space-y-8" dir="rtl">
                  {/* إعدادات المعالجة المحسنة */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-2xl border border-primary/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-background/60 backdrop-blur-sm border-0 shadow-soft">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="bg-gradient-primary p-2 rounded-lg">
                                <Target className="h-5 w-5 text-primary-foreground" />
                              </div>
                              <Label className="text-lg font-bold text-right">إعدادات التسعير</Label>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-base font-semibold text-right text-muted-foreground">سعر الترجمة (ريال/كلمة)</Label>
                              <Input
                                type="number"
                                step="0.001"
                                value={priceRate}
                                onChange={(e) => setPriceRate(parseFloat(e.target.value) || 0.19)}
                                className="h-14 border-2 border-primary/20 text-right text-lg font-bold rounded-xl focus:border-primary focus:ring-primary shadow-soft"
                                placeholder="0.190"
                                dir="rtl"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-success/10 backdrop-blur-sm border-0 shadow-soft">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="bg-gradient-success p-2 rounded-lg">
                                <Zap className="h-5 w-5 text-success-foreground" />
                              </div>
                              <Label className="text-lg font-bold text-right">وضع المعالجة المتقدم</Label>
                            </div>
                            <div className="bg-gradient-to-r from-success/20 to-success/10 p-4 rounded-xl border border-success/20">
                              <div className="flex items-center justify-between flex-row-reverse">
                                <div className="text-right">
                                  <p className="text-sm font-bold text-success">
                                    معالجة فائقة السرعة والذكاء
                                  </p>
                                  <p className="text-xs text-success/80">
                                    تحليل متوازي بسرعة 12x مع دعم RTL كامل
                                  </p>
                                </div>
                                <div className="bg-success/20 p-3 rounded-full">
                                  <TrendingUp className="h-6 w-6 text-success animate-pulse-soft" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <FileAnalyzer
                    onAnalysisComplete={setAnalysisData}
                    isProcessing={isProcessing}
                    onProcessingChange={setIsProcessing}
                  />
                  
                  {analysisData && (
                    <AdvancedWordCounter 
                      analysisData={mockAnalysisData} 
                      isProcessing={isProcessing} 
                    />
                  )}
                </TabsContent>

                <TabsContent value="pricing" className="space-y-6">
                  {analysisData ? (
                    <PricingReport
                      pricingData={{
                        baseRate: priceRate,
                        billableWords: mockAnalysisData.billableWords,
                        baseTotal: mockAnalysisData.billableWords * priceRate,
                        discounts: { duplicateIntra: 45, duplicateInter: 25, volumeDiscount: 0 },
                        additionalFees: { ocr: 50, urgency: 0, formatting: 25, certification: 100 },
                        minimumCharge: 70,
                        finalTotal: Math.max(mockAnalysisData.billableWords * priceRate + 175 - 70, 70),
                        urgencyDetails: { level: "normal", multiplier: 1, deliveryTime: "3-5 أيام" }
                      }}
                      wordCount={mockAnalysisData.totalWords}
                      translationType="legal-translation"
                      fromLang="ar"
                      toLang="en"
                    />
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">يرجى رفع الملفات أولاً للحصول على تسعير مفصل</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="reports" className="space-y-8">
                  <div className="bg-gradient-to-br from-success/5 to-primary/5 p-8 rounded-2xl border border-success/10">
                    <div className="text-center mb-8">
                      <div className="flex justify-center mb-6">
                        <div className="bg-gradient-success p-6 rounded-2xl shadow-success">
                          <BarChart3 className="h-12 w-12 text-success-foreground" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-arabic-title font-bold mb-4 text-foreground">
                        تقارير <span className="text-gradient-success">تحليلية متقدمة</span>
                      </h3>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                        تقارير JSON تفصيلية وجداول تفاعلية مع إحصائيات شاملة وإمكانية التصدير بصيغ متعددة
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <Card className="text-center hover-lift bg-background border-0 shadow-soft">
                        <CardContent className="p-6">
                          <div className="bg-gradient-primary p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <FileSpreadsheet className="h-8 w-8 text-primary-foreground" />
                          </div>
                          <h4 className="font-bold text-foreground mb-2">تقرير Excel</h4>
                          <p className="text-sm text-muted-foreground mb-4">جداول تفاعلية مع إحصائيات مفصلة</p>
                          <Button size="sm" className="w-full bg-gradient-primary text-primary-foreground hover-lift">
                            تصدير Excel
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="text-center hover-lift bg-background border-0 shadow-soft">
                        <CardContent className="p-6">
                          <div className="bg-gradient-secondary p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-secondary-foreground" />
                          </div>
                          <h4 className="font-bold text-foreground mb-2">تقرير PDF</h4>
                          <p className="text-sm text-muted-foreground mb-4">تقرير احترافي جاهز للطباعة</p>
                          <Button size="sm" variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground hover-lift">
                            تصدير PDF
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="text-center hover-lift bg-background border-0 shadow-soft">
                        <CardContent className="p-6">
                          <div className="bg-gradient-success p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <Layers className="h-8 w-8 text-success-foreground" />
                          </div>
                          <h4 className="font-bold text-foreground mb-2">بيانات JSON</h4>
                          <p className="text-sm text-muted-foreground mb-4">بيانات خام للتحليل المتقدم</p>
                          <Button size="sm" className="w-full bg-gradient-success text-success-foreground hover-lift">
                            تصدير JSON
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalTranslation;