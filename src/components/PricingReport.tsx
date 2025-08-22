import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileSpreadsheet, 
  Receipt, 
  Calculator,
  Percent,
  DollarSign,
  Clock,
  Award,
  Shield
} from "lucide-react";

interface PricingDetails {
  baseRate: number;
  billableWords: number;
  baseTotal: number;
  discounts: {
    duplicateIntra: number;
    duplicateInter: number;
    volumeDiscount: number;
  };
  additionalFees: {
    ocr: number;
    urgency: number;
    formatting: number;
    certification: number;
  };
  minimumCharge: number;
  finalTotal: number;
  urgencyDetails: {
    level: string;
    multiplier: number;
    deliveryTime: string;
  };
}

interface PricingReportProps {
  pricingData: PricingDetails;
  wordCount: number;
  translationType: string;
  fromLang: string;
  toLang: string;
}

const PricingReport = ({ 
  pricingData, 
  wordCount, 
  translationType, 
  fromLang, 
  toLang 
}: PricingReportProps) => {
  const totalDiscount = useMemo(() => {
    return pricingData.discounts.duplicateIntra + 
           pricingData.discounts.duplicateInter + 
           pricingData.discounts.volumeDiscount;
  }, [pricingData.discounts]);

  const totalAdditionalFees = useMemo(() => {
    return pricingData.additionalFees.ocr + 
           pricingData.additionalFees.urgency + 
           pricingData.additionalFees.formatting + 
           pricingData.additionalFees.certification;
  }, [pricingData.additionalFees]);

  const exportToPDF = () => {
    // إنشاء وثيقة PDF للتقرير
    console.log("تصدير التقرير كـ PDF");
  };

  const exportToExcel = () => {
    // إنشاء ملف Excel للتقرير
    console.log("تصدير التقرير كـ Excel");
  };

  return (
    <div className="space-y-6">
      {/* معلومات المشروع */}
      <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-emerald-500/5 border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Receipt className="h-6 w-6 text-primary" />
            تقرير التسعير التفصيلي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">نوع الترجمة</div>
              <Badge variant="secondary" className="text-sm">
                {translationType === 'legal-translation' ? 'ترجمة قانونية' : 'ترجمة عامة'}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">اتجاه الترجمة</div>
              <div className="text-sm font-medium">
                {fromLang === 'ar' ? 'العربية' : 'الإنجليزية'} → {toLang === 'ar' ? 'العربية' : 'الإنجليزية'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">مستوى السرعة</div>
              <Badge 
                variant="outline" 
                className={`text-sm ${pricingData.urgencyDetails.multiplier > 1 ? 'border-orange-500 text-orange-600' : 'border-green-500 text-green-600'}`}
              >
                <Clock className="h-3 w-3 mr-1" />
                {pricingData.urgencyDetails.deliveryTime}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ملخص التسعير الرئيسي */}
      <Card className="bg-gradient-card border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Calculator className="h-5 w-5 text-primary" />
            ملخص التسعير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* الحساب الأساسي */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">عدد الكلمات القابلة للفوترة</span>
              <span className="font-bold text-lg">{pricingData.billableWords.toLocaleString()} كلمة</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">السعر لكل كلمة</span>
              <span className="font-bold text-lg">{pricingData.baseRate.toFixed(3)} ر.س</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">المجموع الأساسي</span>
              <span className="font-bold text-primary">{pricingData.baseTotal.toFixed(2)} ر.س</span>
            </div>
          </div>

          {/* الخصومات */}
          {totalDiscount > 0 && (
            <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl">
              <h4 className="font-bold text-green-800 dark:text-green-200 flex items-center gap-2">
                <Percent className="h-4 w-4" />
                الخصومات المطبقة
              </h4>
              
              {pricingData.discounts.duplicateIntra > 0 && (
                <div className="flex justify-between text-sm">
                  <span>خصم التكرار الداخلي (30%)</span>
                  <span className="font-medium text-green-600">-{pricingData.discounts.duplicateIntra.toFixed(2)} ر.س</span>
                </div>
              )}
              
              {pricingData.discounts.duplicateInter > 0 && (
                <div className="flex justify-between text-sm">
                  <span>خصم التكرار بين الملفات (20%)</span>
                  <span className="font-medium text-green-600">-{pricingData.discounts.duplicateInter.toFixed(2)} ر.س</span>
                </div>
              )}
              
              {pricingData.discounts.volumeDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>خصم الكمية الكبيرة</span>
                  <span className="font-medium text-green-600">-{pricingData.discounts.volumeDiscount.toFixed(2)} ر.س</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-bold text-green-700 dark:text-green-300">
                <span>إجمالي الخصومات</span>
                <span>-{totalDiscount.toFixed(2)} ر.س</span>
              </div>
            </div>
          )}

          {/* الرسوم الإضافية */}
          {totalAdditionalFees > 0 && (
            <div className="space-y-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
              <h4 className="font-bold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                الرسوم الإضافية
              </h4>
              
              {pricingData.additionalFees.ocr > 0 && (
                <div className="flex justify-between text-sm">
                  <span>رسوم OCR للصفحات المصورة</span>
                  <span className="font-medium text-orange-600">+{pricingData.additionalFees.ocr.toFixed(2)} ر.س</span>
                </div>
              )}
              
              {pricingData.additionalFees.urgency > 0 && (
                <div className="flex justify-between text-sm">
                  <span>رسوم الاستعجال (×{pricingData.urgencyDetails.multiplier})</span>
                  <span className="font-medium text-orange-600">+{pricingData.additionalFees.urgency.toFixed(2)} ر.س</span>
                </div>
              )}
              
              {pricingData.additionalFees.formatting > 0 && (
                <div className="flex justify-between text-sm">
                  <span>رسوم التنسيق والتصميم</span>
                  <span className="font-medium text-orange-600">+{pricingData.additionalFees.formatting.toFixed(2)} ر.س</span>
                </div>
              )}
              
              {pricingData.additionalFees.certification > 0 && (
                <div className="flex justify-between text-sm">
                  <span>رسوم الاعتماد والتوثيق</span>
                  <span className="font-medium text-orange-600">+{pricingData.additionalFees.certification.toFixed(2)} ر.س</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-bold text-orange-700 dark:text-orange-300">
                <span>إجمالي الرسوم الإضافية</span>
                <span>+{totalAdditionalFees.toFixed(2)} ر.س</span>
              </div>
            </div>
          )}

          {/* الحد الأدنى للطلب */}
          {pricingData.finalTotal < pricingData.minimumCharge && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
                <Shield className="h-4 w-4" />
                <span className="font-bold text-sm">الحد الأدنى للطلب</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>المجموع المحسوب</span>
                <span>{(pricingData.baseTotal - totalDiscount + totalAdditionalFees).toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>الحد الأدنى المطلوب</span>
                <span className="font-bold">{pricingData.minimumCharge.toFixed(2)} ر.س</span>
              </div>
            </div>
          )}

          {/* المجموع النهائي */}
          <Separator />
          
          <div className="bg-gradient-to-r from-primary/10 to-emerald-500/10 p-6 rounded-xl border-2 border-primary/20">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold text-primary">المجموع النهائي</div>
                <div className="text-sm text-muted-foreground">شامل جميع الرسوم والخصومات</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{pricingData.finalTotal.toFixed(2)} ر.س</div>
                <div className="text-sm text-muted-foreground">شامل الضريبة</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ضمانات الجودة */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-4">
          <h4 className="font-bold text-emerald-800 dark:text-emerald-200 mb-3 flex items-center gap-2">
            <Award className="h-4 w-4" />
            ضمانات الجودة المشمولة
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <Shield className="h-3 w-3" />
                <span>ترجمة معتمدة ومراجعة قانونياً</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <Award className="h-3 w-3" />
                <span>ضمان دقة 100% أو إعادة المال</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <Clock className="h-3 w-3" />
                <span>التزام تام بمواعيد التسليم</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <Shield className="h-3 w-3" />
                <span>سرية تامة وحماية البيانات</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أزرار التصدير */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={exportToPDF}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
        >
          <Download className="h-4 w-4 ml-2" />
          تصدير كـ PDF
        </Button>
        
        <Button 
          onClick={exportToExcel}
          variant="outline"
          className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
        >
          <FileSpreadsheet className="h-4 w-4 ml-2" />
          تصدير كـ Excel
        </Button>
      </div>

      {/* ملاحظة هامة */}
      <div className="p-4 bg-muted/30 rounded-xl text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          هذا التقرير تم إنشاؤه تلقائياً بناءً على تحليل متقدم للملفات المرفوعة. 
          السعر النهائي قد يخضع لمراجعة إضافية حسب تعقيد المحتوى ومتطلبات التخصص.
          صالح لمدة 30 يوماً من تاريخ الإصدار.
        </p>
      </div>
    </div>
  );
};

export default PricingReport;