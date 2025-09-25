import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Calculator, Zap } from "lucide-react";

interface PriceCalculatorProps {
  wordCount: number;
  translationType: string;
  urgency: string;
  fromLang: string;
  toLang: string;
}

const PriceCalculator = ({ wordCount, translationType, urgency, fromLang, toLang }: PriceCalculatorProps) => {
  const basePrice = {
    "legal": 0.19,        // 95 ريال لكل 500 كلمة = 0.19 ريال لكل كلمة
    "medical": 0.20,      // 100 ريال لكل 500 كلمة
    "technical": 0.18,    // 90 ريال لكل 500 كلمة
    "business": 0.15,     // 75 ريال لكل 500 كلمة
    "academic": 0.17,     // 85 ريال لكل 500 كلمة
    "literary": 0.21,     // 105 ريال لكل 500 كلمة
    "media": 0.14,        // 70 ريال لكل 500 كلمة
    "live": 0.30          // 150 ريال لكل 500 كلمة
  };

  const urgencyOptions = [
    { value: "normal", label: "عادي (3-5 أيام)", multiplier: 1, icon: Clock },
    { value: "urgent", label: "عاجل (24-48 ساعة)", multiplier: 1.5, icon: Zap },
    { value: "express", label: "فوري (12-24 ساعة)", multiplier: 2, icon: Zap }
  ];

  const { price, priceDetails } = useMemo(() => {
    if (wordCount === 0) return { price: 0, priceDetails: null };
    
    const typeKey = translationType.split('-')[0] as keyof typeof basePrice;
    const pricePerWord = basePrice[typeKey] || 0.15;
    const urgencyOption = urgencyOptions.find(opt => opt.value === urgency);
    const urgencyMultiplier = urgencyOption?.multiplier || 1;
    
    const baseTotal = wordCount * pricePerWord;
    const finalPrice = baseTotal * urgencyMultiplier;
    
    return {
      price: finalPrice,
      priceDetails: {
        pricePerWord,
        urgencyMultiplier,
        baseTotal,
        urgencyOption
      }
    };
  }, [wordCount, translationType, urgency]);

  if (wordCount === 0) return null;

  const deliveryTime = priceDetails?.urgencyOption?.label.split('(')[1].split(')')[0];
  const UrgencyIcon = priceDetails?.urgencyOption?.icon || Clock;

  return (
    <div className="space-y-6">
      {/* عرض السعر الرئيسي */}
      <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-emerald-500/5 border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* إجمالي الكلمات */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">
                {wordCount.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground font-medium">إجمالي الكلمات</div>
              <Badge variant="outline" className="text-xs">
                تم العد بدقة
              </Badge>
            </div>
            
            {/* السعر الإجمالي */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-green-600">
                {price.toFixed(2)} ر.س
              </div>
              <div className="text-sm text-muted-foreground font-medium">السعر الإجمالي</div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                شامل الضريبة
              </Badge>
            </div>
            
            {/* مدة التسليم */}
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-accent flex items-center justify-center gap-2">
                <UrgencyIcon className="h-6 w-6" />
                {deliveryTime}
              </div>
              <div className="text-sm text-muted-foreground font-medium">مدة التسليم</div>
              <Badge 
                variant="outline" 
                className={`text-xs ${priceDetails?.urgencyMultiplier > 1 ? 'border-orange-500 text-orange-600' : 'border-green-500 text-green-600'}`}
              >
                {priceDetails?.urgencyMultiplier === 1 ? 'سعر عادي' : `إضافة ${((priceDetails?.urgencyMultiplier || 1) - 1) * 100}%`}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل الحساب */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-4 w-4 text-blue-600" />
            <h4 className="font-bold text-sm text-blue-800 dark:text-blue-200">تفاصيل الحساب</h4>
          </div>
          
          <div className="space-y-2 text-xs text-blue-700 dark:text-blue-300">
            <div className="flex justify-between">
              <span>السعر الأساسي لكل كلمة:</span>
              <span className="font-medium">{priceDetails?.pricePerWord.toFixed(3)} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>عدد الكلمات:</span>
              <span className="font-medium">{wordCount.toLocaleString()} كلمة</span>
            </div>
            <div className="flex justify-between">
              <span>المجموع الأساسي:</span>
              <span className="font-medium">{priceDetails?.baseTotal.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span>معامل السرعة:</span>
              <span className="font-medium">×{priceDetails?.urgencyMultiplier}</span>
            </div>
            <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>المجموع النهائي:</span>
                <span className="text-green-600">{price.toFixed(2)} ر.س</span>
              </div>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-800 dark:text-blue-200 text-xs">
            <strong>ملاحظة:</strong> الترجمة القانونية: ر.س 95 لكل 500 كلمة • الأسعار شاملة الضريبة
          </div>
        </CardContent>
      </Card>

      {/* أزرار الإجراءات */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200 h-12"
          disabled={!fromLang || !toLang || wordCount === 0}
        >
          <DollarSign className="h-5 w-5 ml-2" />
          طلب عرض سعر ({price.toFixed(0)} ر.س)
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 h-12"
          disabled={!fromLang || !toLang || wordCount === 0}
        >
          <Zap className="h-5 w-5 ml-2" />
          بدء الترجمة الآن
        </Button>
      </div>

      {/* معلومات إضافية */}
      <div className="text-center space-y-3">
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            ترجمة معتمدة
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            ابتداءً من ر.س 70/500 كلمة
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            سرية تامة
          </Badge>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            ضمان الجودة
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          الأسعار بالريال السعودي شاملة الضريبة • الترجمة القانونية: ر.س 95 لكل 500 كلمة • 
          السعر النهائي قد يختلف حسب تعقيد المحتوى • خصم خاص للكميات الكبيرة
        </p>
      </div>
    </div>
  );
};

export default PriceCalculator;