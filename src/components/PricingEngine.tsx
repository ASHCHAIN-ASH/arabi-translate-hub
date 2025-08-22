import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, Percent, FileText } from 'lucide-react';

export interface WordCounts {
  sourceWords: number;
  tableWords: number;
  numbersOnly: number;
  excluded: number;
  placeholders: number;
  duplicatesIntra: number;
  duplicatesInter: number;
  uniqueWords: number;
}

export interface OCRCosts {
  pagesCount: number;
  pricePerPage: number;
  totalOCRCost: number;
}

export interface PricingBreakdown {
  // أساسيات التسعير
  billableWords: number;
  pricePerWord: number;
  basePrice: number;
  
  // الخصومات
  intraDiscount: number;
  interDiscount: number;
  totalDiscounts: number;
  
  // الإضافات
  ocrCosts: OCRCosts;
  rushFee: number;
  formattingFee: number;
  certificationFee: number;
  proofreadingFee: number;
  totalExtras: number;
  
  // الإجمالي
  subtotal: number;
  minimumCharge: number;
  finalTotal: number;
  
  // تفاصيل إضافية
  effectiveRate: number;
  savingsFromDiscounts: number;
}

interface TranslationExtras {
  proofreading: boolean;
  certification: boolean;
  urgentDelivery: boolean;
  formatting: boolean;
}

interface PricingEngineProps {
  wordCounts: WordCounts;
  ocrPages: number;
  translationExtras?: TranslationExtras;
  onPricingCalculated: (pricing: PricingBreakdown) => void;
}

const PricingEngine = ({ 
  wordCounts, 
  ocrPages, 
  translationExtras,
  onPricingCalculated 
}: PricingEngineProps) => {
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);

  // ثوابت التسعير (بالريال السعودي)
  const PRICING_CONSTANTS = {
    PRICE_PER_WORD: 0.20,
    MINIMUM_CHARGE: 150,
    OCR_PRICE_PER_PAGE: 5,
    INTRA_DISCOUNT_RATE: 0.30, // 30%
    INTER_DISCOUNT_RATE: 0.20, // 20%
    RUSH_FEE_MULTIPLIER: 0.50, // 50% إضافي
    FORMATTING_FEE: 50,
    CERTIFICATION_FEE: 100,
    PROOFREADING_MULTIPLIER: 0.25 // 25% إضافي
  };

  // حساب التسعير المفصل
  const calculatePricing = useCallback((): PricingBreakdown => {
    // حساب الكلمات القابلة للفوترة
    const billableWords = wordCounts.sourceWords + wordCounts.tableWords;
    
    // السعر الأساسي
    const basePrice = billableWords * PRICING_CONSTANTS.PRICE_PER_WORD;
    
    // حساب الخصومات
    const intraDiscountAmount = (wordCounts.duplicatesIntra * PRICING_CONSTANTS.PRICE_PER_WORD) * PRICING_CONSTANTS.INTRA_DISCOUNT_RATE;
    const interDiscountAmount = (wordCounts.duplicatesInter * PRICING_CONSTANTS.PRICE_PER_WORD) * PRICING_CONSTANTS.INTER_DISCOUNT_RATE;
    const totalDiscounts = intraDiscountAmount + interDiscountAmount;
    
    // حساب تكاليف OCR
    const ocrCosts: OCRCosts = {
      pagesCount: ocrPages,
      pricePerPage: PRICING_CONSTANTS.OCR_PRICE_PER_PAGE,
      totalOCRCost: ocrPages * PRICING_CONSTANTS.OCR_PRICE_PER_PAGE
    };
    
    // حساب الإضافات
    const rushFee = translationExtras?.urgentDelivery 
      ? (basePrice - totalDiscounts) * PRICING_CONSTANTS.RUSH_FEE_MULTIPLIER 
      : 0;
    
    const formattingFee = translationExtras?.formatting 
      ? PRICING_CONSTANTS.FORMATTING_FEE 
      : 0;
    
    const certificationFee = translationExtras?.certification 
      ? PRICING_CONSTANTS.CERTIFICATION_FEE 
      : 0;
    
    const proofreadingFee = translationExtras?.proofreading 
      ? (basePrice - totalDiscounts) * PRICING_CONSTANTS.PROOFREADING_MULTIPLIER 
      : 0;
    
    const totalExtras = ocrCosts.totalOCRCost + rushFee + formattingFee + certificationFee + proofreadingFee;
    
    // حساب المجموع الفرعي
    const subtotal = basePrice - totalDiscounts + totalExtras;
    
    // تطبيق الحد الأدنى
    const finalTotal = Math.max(subtotal, PRICING_CONSTANTS.MINIMUM_CHARGE);
    
    // حساب السعر الفعال
    const effectiveRate = billableWords > 0 ? finalTotal / billableWords : 0;
    
    return {
      billableWords,
      pricePerWord: PRICING_CONSTANTS.PRICE_PER_WORD,
      basePrice,
      intraDiscount: intraDiscountAmount,
      interDiscount: interDiscountAmount,
      totalDiscounts,
      ocrCosts,
      rushFee,
      formattingFee,
      certificationFee,
      proofreadingFee,
      totalExtras,
      subtotal,
      minimumCharge: PRICING_CONSTANTS.MINIMUM_CHARGE,
      finalTotal,
      effectiveRate,
      savingsFromDiscounts: totalDiscounts
    };
  }, [wordCounts, ocrPages, translationExtras]);

  // تحديث التسعير عند تغيير المدخلات
  useState(() => {
    const newPricing = calculatePricing();
    setPricing(newPricing);
    onPricingCalculated(newPricing);
  });

  if (!pricing) return null;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-right">
            <Calculator className="h-5 w-5 text-primary" />
            تسعير الترجمة المفصل
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            بالريال السعودي
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* الكلمات القابلة للفوترة */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            تحليل الكلمات
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>كلمات المصدر:</span>
              <span className="font-medium">{pricing.billableWords.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>السعر/كلمة:</span>
              <span className="font-medium">{pricing.pricePerWord.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between col-span-2 pt-2 border-t">
              <span className="font-medium">السعر الأساسي:</span>
              <span className="font-bold text-primary">{pricing.basePrice.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* الخصومات */}
        {pricing.totalDiscounts > 0 && (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2 text-green-600">
                <Percent className="h-4 w-4" />
                الخصومات
              </h3>
              <div className="space-y-2 text-sm">
                {pricing.intraDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>خصم التكرارات الداخلية (30%):</span>
                    <span className="font-medium text-green-600">-{pricing.intraDiscount.toFixed(2)} ر.س</span>
                  </div>
                )}
                {pricing.interDiscount > 0 && (
                  <div className="flex justify-between">
                    <span>خصم التكرارات بين الملفات (20%):</span>
                    <span className="font-medium text-green-600">-{pricing.interDiscount.toFixed(2)} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-medium">
                  <span>إجمالي الخصومات:</span>
                  <span className="text-green-600">-{pricing.totalDiscounts.toFixed(2)} ر.س</span>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* الإضافات */}
        {pricing.totalExtras > 0 && (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2 text-orange-600">
                <TrendingUp className="h-4 w-4" />
                الإضافات والخدمات
              </h3>
              <div className="space-y-2 text-sm">
                {pricing.ocrCosts.totalOCRCost > 0 && (
                  <div className="flex justify-between">
                    <span>OCR ({pricing.ocrCosts.pagesCount} صفحة × {pricing.ocrCosts.pricePerPage} ر.س):</span>
                    <span className="font-medium text-orange-600">+{pricing.ocrCosts.totalOCRCost.toFixed(2)} ر.س</span>
                  </div>
                )}
                {pricing.rushFee > 0 && (
                  <div className="flex justify-between">
                    <span>رسوم الاستعجال (50%):</span>
                    <span className="font-medium text-orange-600">+{pricing.rushFee.toFixed(2)} ر.س</span>
                  </div>
                )}
                {pricing.formattingFee > 0 && (
                  <div className="flex justify-between">
                    <span>رسوم التنسيق المتقدم:</span>
                    <span className="font-medium text-orange-600">+{pricing.formattingFee.toFixed(2)} ر.س</span>
                  </div>
                )}
                {pricing.certificationFee > 0 && (
                  <div className="flex justify-between">
                    <span>رسوم التصديق:</span>
                    <span className="font-medium text-orange-600">+{pricing.certificationFee.toFixed(2)} ر.س</span>
                  </div>
                )}
                {pricing.proofreadingFee > 0 && (
                  <div className="flex justify-between">
                    <span>رسوم المراجعة (25%):</span>
                    <span className="font-medium text-orange-600">+{pricing.proofreadingFee.toFixed(2)} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t font-medium">
                  <span>إجمالي الإضافات:</span>
                  <span className="text-orange-600">+{pricing.totalExtras.toFixed(2)} ر.س</span>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* الإجمالي النهائي */}
        <div className="space-y-3 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="font-medium">{pricing.subtotal.toFixed(2)} ر.س</span>
            </div>
            {pricing.finalTotal > pricing.subtotal && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>الحد الأدنى للطلب:</span>
                <span>{pricing.minimumCharge.toFixed(2)} ر.س</span>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">الإجمالي النهائي:</span>
            <span className="text-2xl font-bold text-primary">{pricing.finalTotal.toFixed(2)} ر.س</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="font-medium">{pricing.effectiveRate.toFixed(3)} ر.س</div>
              <div>السعر الفعال/كلمة</div>
            </div>
            {pricing.savingsFromDiscounts > 0 && (
              <div className="text-center">
                <div className="font-medium text-green-600">{pricing.savingsFromDiscounts.toFixed(2)} ر.س</div>
                <div>توفير من الخصومات</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingEngine;