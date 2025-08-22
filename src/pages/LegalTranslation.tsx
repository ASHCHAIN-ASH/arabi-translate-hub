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
    <div className="min-h-screen relative" dir="rtl">
      <AnimatedBackground />
      <Header />
      
      {/* Hero Section مع خلفية مكتب قانوني */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${legalOfficeBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-emerald-500/20" />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/20 p-6 rounded-full backdrop-blur-sm">
                <Scale className="h-16 w-16 text-primary animate-float" />
              </div>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-arabic-title font-bold mb-6">
              نظام <span className="text-gradient">حساب الكلمات</span> المتقدم
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              طوّر نظامًا لحساب عدد الكلمات من ملفات المستخدمين بهدف الترجمة، مع تسعير تلقائي ودعم تقارير تفصيلية
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Badge className="bg-primary/20 text-primary px-4 py-2 text-lg backdrop-blur-sm">
                <Scan className="h-4 w-4 mr-2" />
                تحليل متقدم للملفات
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-600 px-4 py-2 text-lg backdrop-blur-sm">
                <Calculator className="h-4 w-4 mr-2" />
                تسعير تلقائي
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-600 px-4 py-2 text-lg backdrop-blur-sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                تقارير تفصيلية
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* النظام المتقدم */}
      <section className="py-16 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-card border-0 shadow-strong backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-arabic-title flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-primary animate-pulse-soft" />
                نظام حساب الكلمات الاحترافي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted/50">
                  <TabsTrigger value="analyzer" className="gap-2">
                    <Scan className="h-4 w-4" />
                    تحليل الملفات
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="gap-2">
                    <Calculator className="h-4 w-4" />
                    التسعير
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    التقارير
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="analyzer" className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-base font-semibold">سعر الترجمة (ريال/كلمة)</Label>
                        <Input
                          type="number"
                          step="0.001"
                          value={priceRate}
                          onChange={(e) => setPriceRate(parseFloat(e.target.value) || 0.19)}
                          className="h-12 border-2 border-primary/20"
                          placeholder="0.190"
                        />
                      </div>
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

                <TabsContent value="reports" className="space-y-6">
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">تقارير تفصيلية</h3>
                    <p className="text-muted-foreground mb-6">
                      تقارير JSON مفصلة وجداول تفاعلية مع إمكانية التصدير
                    </p>
                    <div className="flex justify-center gap-4">
                      <Button className="gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        تصدير Excel
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        تصدير PDF
                      </Button>
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