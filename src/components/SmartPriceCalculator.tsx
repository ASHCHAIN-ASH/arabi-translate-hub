import { useState, useEffect, useMemo } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientInfoForm from "./ClientInfoForm";
import { 
  Calculator, 
  Clock, 
  Zap, 
  Star, 
  TrendingUp, 
  Award,
  FileText,
  Globe,
  Target,
  Sparkles,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Timer,
  Percent
} from "lucide-react";

interface FileAnalysis {
  wordCount: number;
  documentType: 'legal' | 'medical' | 'technical' | 'business' | 'academic' | 'general';
  complexity: 'low' | 'medium' | 'high' | 'expert';
  specialTerms: number;
  formatComplexity: number;
  fileName: string;
}

interface PricingFactors {
  baseRate: number;
  urgencyMultiplier: number;
  complexityMultiplier: number;
  languageMultiplier: number;
  volumeDiscount: number;
  qualityLevel: 'standard' | 'premium' | 'expert';
}

interface SmartPriceCalculatorProps {
  files: FileAnalysis[];
  fromLanguage: string;
  toLanguage: string;
  urgency: 'standard' | 'fast' | 'urgent' | 'express';
  qualityLevel: 'standard' | 'premium' | 'expert';
  onPriceChange: (price: number, details: any) => void;
}

const SmartPriceCalculator = ({
  files,
  fromLanguage = 'ar',
  toLanguage = 'en',
  urgency = 'standard',
  qualityLevel = 'standard',
  onPriceChange
}: SmartPriceCalculatorProps) => {
  console.log('SmartPriceCalculator: Component rendering...', { files, fromLanguage, toLanguage, urgency, qualityLevel });
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [currentStep, setCurrentStep] = useState<'pricing' | 'client-info' | 'success'>('pricing');

  // أسعار القاعدة حسب نوع الوثيقة
  const baseRates = {
    legal: { standard: 0.25, premium: 0.35, expert: 0.50 },
    medical: { standard: 0.30, premium: 0.42, expert: 0.60 },
    technical: { standard: 0.28, premium: 0.38, expert: 0.55 },
    business: { standard: 0.20, premium: 0.28, expert: 0.40 },
    academic: { standard: 0.22, premium: 0.30, expert: 0.45 },
    general: { standard: 0.15, premium: 0.22, expert: 0.35 }
  };

  // عوامل الاستعجال
  const urgencyFactors = {
    standard: { multiplier: 1.0, delivery: "5-7 أيام عمل", icon: Clock },
    fast: { multiplier: 1.3, delivery: "2-3 أيام عمل", icon: Zap },
    urgent: { multiplier: 1.6, delivery: "24-48 ساعة", icon: Timer },
    express: { multiplier: 2.0, delivery: "أقل من 24 ساعة", icon: Sparkles }
  };

  // عوامل اللغة
  const languageFactors: Record<string, number> = {
    'ar-en': 1.0, 'en-ar': 1.0,
    'ar-fr': 1.2, 'fr-ar': 1.2,
    'ar-de': 1.3, 'de-ar': 1.3,
    'ar-es': 1.1, 'es-ar': 1.1,
    'ar-it': 1.2, 'it-ar': 1.2,
    'ar-ru': 1.4, 'ru-ar': 1.4,
    'ar-zh': 1.5, 'zh-ar': 1.5,
    'ar-ja': 1.5, 'ja-ar': 1.5
  };

  // عوامل التعقيد
  const complexityFactors = {
    low: 1.0,
    medium: 1.2,
    high: 1.5,
    expert: 2.0
  };

  // حساب التسعير الذكي
  const pricing = useMemo(() => {
    if (files.length === 0) return null;

    setIsCalculating(true);
    
    const totalWords = files.reduce((sum, file) => sum + file.wordCount, 0);
    const languageKey = `${fromLanguage}-${toLanguage}` as keyof typeof languageFactors;
    
    let calculations = files.map(file => {
      const baseRate = baseRates[file.documentType][qualityLevel];
      const urgencyMult = urgencyFactors[urgency].multiplier;
      const complexityMult = complexityFactors[file.complexity];
      const languageMult = languageFactors[languageKey] || 1.0;
      
      // خصم الكمية
      let volumeDiscount = 0;
      if (totalWords > 10000) volumeDiscount = 0.15;
      else if (totalWords > 5000) volumeDiscount = 0.10;
      else if (totalWords > 2000) volumeDiscount = 0.05;

      const basePrice = file.wordCount * baseRate;
      const adjustedPrice = basePrice * urgencyMult * complexityMult * languageMult;
      const finalPrice = adjustedPrice * (1 - volumeDiscount);

      return {
        fileName: file.fileName,
        wordCount: file.wordCount,
        documentType: file.documentType,
        complexity: file.complexity,
        specialTerms: file.specialTerms,
        baseRate,
        basePrice,
        urgencyMult,
        complexityMult,
        languageMult,
        volumeDiscount,
        adjustedPrice,
        finalPrice
      };
    });

    const totalPrice = calculations.reduce((sum, calc) => sum + calc.finalPrice, 0);
    const averageDiscount = calculations.reduce((sum, calc) => sum + calc.volumeDiscount, 0) / calculations.length;
    
    // تقدير وقت التسليم الدقيق
    const baseHours = totalWords / 300; // 300 كلمة في الساعة
    const complexityTime = calculations.reduce((sum, calc) => {
      return sum + (calc.wordCount * complexityFactors[calc.complexity as keyof typeof complexityFactors] / 300);
    }, 0);
    
    const estimatedHours = Math.ceil(complexityTime / urgencyFactors[urgency].multiplier);
    
    setTimeout(() => setIsCalculating(false), 1500);

    return {
      totalWords,
      totalPrice,
      calculations,
      averageDiscount,
      estimatedHours,
      deliveryTime: urgencyFactors[urgency].delivery,
      breakdown: {
        baseTotal: calculations.reduce((sum, calc) => sum + calc.basePrice, 0),
        urgencyTotal: calculations.reduce((sum, calc) => sum + (calc.adjustedPrice - calc.basePrice), 0),
        discount: calculations.reduce((sum, calc) => sum + (calc.adjustedPrice - calc.finalPrice), 0)
      }
    };
  }, [files, fromLanguage, toLanguage, urgency, qualityLevel]);

  // إشعار تغيير السعر
  useEffect(() => {
    if (pricing && onPriceChange) {
      onPriceChange(pricing.totalPrice, pricing);
    }
  }, [pricing, onPriceChange]);

  if (files.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-0 shadow-soft">
        <CardContent className="p-8 text-center">
          <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            حاسبة التكلفة الذكية
          </h3>
          <p className="text-sm text-muted-foreground">
            قم برفع ملفاتك لحساب التكلفة الدقيقة
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!pricing) {
    return (
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-0 shadow-soft">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            جاري حساب التكلفة...
          </h3>
          <p className="text-sm text-muted-foreground">
            يرجى الانتظار بينما نحلل ملفاتك
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleClientInfoSubmit = (clientInfo: any) => {
    setCurrentStep('success');
    // هنا يمكن إضافة منطق إرسال البيانات إلى الخادم
    console.log('Client Info:', clientInfo);
    console.log('Pricing Details:', pricing);
  };

  const handleBackToPricing = () => {
    setCurrentStep('pricing');
  };

  if (currentStep === 'client-info') {
    return (
      <ClientInfoForm
        pricingDetails={pricing}
        onSubmit={handleClientInfoSubmit}
        onBack={handleBackToPricing}
      />
    );
  }

  if (currentStep === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-soft">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-8 w-8 text-green-600" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              تم إرسال طلبك بنجاح!
            </h2>
            <p className="text-green-700 mb-6">
              سنتواصل معك خلال 24 ساعة لتأكيد التفاصيل وبدء العمل
            </p>
            
            <Button
              onClick={() => setCurrentStep('pricing')}
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
            >
              طلب جديد
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* ملخص التكلفة الرئيسي */}
      <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-0 shadow-strong">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <motion.div
              className="bg-gradient-primary p-4 rounded-full w-fit mx-auto mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <DollarSign className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            
            <AnimatePresence mode="wait">
              {isCalculating ? (
                <motion.div
                  key="calculating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="text-2xl font-bold text-foreground">جاري الحساب...</div>
                  <Progress value={75} className="w-48 mx-auto" />
                  <p className="text-sm text-muted-foreground">تحليل المحتوى والتسعير الذكي</p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="text-4xl lg:text-5xl font-bold text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    ${pricing.totalPrice.toFixed(2)}
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {pricing.totalWords.toLocaleString()} كلمة • {pricing.deliveryTime}
                  </p>
                  
                  {pricing.averageDiscount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-4"
                    >
                      <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
                        <Percent className="h-4 w-4 ml-1" />
                        وفرت {(pricing.averageDiscount * 100).toFixed(0)}% • ${pricing.breakdown.discount.toFixed(2)}
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-xl">
              <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">{files.length}</div>
              <div className="text-sm text-muted-foreground">ملف</div>
            </div>
            
            <div className="text-center p-4 bg-background/50 rounded-xl">
              <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground">{pricing.estimatedHours}ساعة</div>
              <div className="text-sm text-muted-foreground">وقت العمل</div>
            </div>
            
            <div className="text-center p-4 bg-background/50 rounded-xl">
              <Star className="h-6 w-6 text-secondary mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground capitalize">{qualityLevel}</div>
              <div className="text-sm text-muted-foreground">مستوى الجودة</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل التسعير */}
      <Card className="bg-background border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calculator className="h-6 w-6 text-primary" />
            تفاصيل التسعير الذكي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">الملخص</TabsTrigger>
              <TabsTrigger value="breakdown">التفصيل</TabsTrigger>
              <TabsTrigger value="files">الملفات</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">التكلفة الأساسية</span>
                    <span className="font-bold">${pricing.breakdown.baseTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-700">رسوم الاستعجال</span>
                    <span className="font-bold text-orange-700">+${pricing.breakdown.urgencyTotal.toFixed(2)}</span>
                  </div>
                  
                  {pricing.breakdown.discount > 0 && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-700">خصم الكمية</span>
                      <span className="font-bold text-green-700">-${pricing.breakdown.discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 rounded-xl">
                  <h4 className="font-bold text-foreground mb-3">معلومات التسليم</h4>
                   <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       {(() => {
                         const IconComponent = urgencyFactors[urgency].icon;
                         return <IconComponent className="h-4 w-4 text-primary" />;
                       })()}
                       <span className="text-sm">{pricing.deliveryTime}</span>
                     </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-accent" />
                      <span className="text-sm">دقة مضمونة 99.5%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-secondary" />
                      <span className="text-sm">مراجعة متخصصة</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-4 mt-6">
              <div className="space-y-3">
                {pricing.calculations.map((calc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-border rounded-xl bg-gradient-to-r from-background to-muted/30"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-semibold text-foreground">{calc.fileName}</h5>
                        <p className="text-xs text-muted-foreground">
                          {calc.documentType} • {calc.complexity} • {calc.wordCount} كلمة
                        </p>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        ${calc.finalPrice.toFixed(2)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>السعر الأساسي: ${calc.basePrice.toFixed(2)}</div>
                      <div>معامل اللغة: ×{calc.languageMult}</div>
                      <div>معامل التعقيد: ×{calc.complexityMult}</div>
                      <div>معامل الاستعجال: ×{calc.urgencyMult}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="files" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl"
                  >
                    <h5 className="font-semibold text-foreground mb-2">{file.fileName}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>عدد الكلمات:</span>
                        <span className="font-medium">{file.wordCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>نوع الوثيقة:</span>
                        <Badge variant="outline" className="text-xs">{file.documentType}</Badge>
                      </div>
                       <div className="flex justify-between">
                         <span>التعقيد:</span>
                         <Badge 
                           variant="outline" 
                           className={`text-xs ${
                             file.complexity === 'expert' ? 'border-red-200 text-red-700' :
                             file.complexity === 'high' ? 'border-orange-200 text-orange-700' :
                             file.complexity === 'medium' ? 'border-yellow-200 text-yellow-700' :
                             'border-green-200 text-green-700'
                           }`}
                         >
                           {file.complexity}
                         </Badge>
                       </div>
                      <div className="flex justify-between">
                        <span>المصطلحات المتخصصة:</span>
                        <span className="font-medium">{file.specialTerms}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-border">
            <Button 
              className="flex-1 bg-gradient-primary text-primary-foreground shadow-primary"
              size="lg"
              onClick={() => setCurrentStep('client-info')}
            >
              <CheckCircle className="h-5 w-5 ml-2" />
              طلب الترجمة الآن
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => setCurrentStep('client-info')}
            >
              <FileText className="h-5 w-5 ml-2" />
              طلب عرض سعر مفصل
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SmartPriceCalculator;