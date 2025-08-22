import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Printer,
  Languages,
  Clock,
  Calculator,
  Eye
} from 'lucide-react';
import { PricingBreakdown } from './PricingEngine';
import { OCRResult } from './OCRProcessor';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface FileAnalysis {
  fileName: string;
  fileType: string;
  detectedLanguage: string;
  pages: number;
  sourceWords: number;
  tableWords: number;
  numbersOnly: number;
  excluded: number;
  placeholders: number;
  ocrNeeded: boolean;
  duplicatesIntra: number;
  duplicatesInter: number;
  uniqueWords: number;
  notes: string[];
}

interface TranslationExtras {
  proofreading: boolean;
  certification: boolean;
  urgentDelivery: boolean;
  formatting: boolean;
  clientContact: {
    email: string;
    whatsapp: string;
  };
}

interface TranslationReportProps {
  analyses: FileAnalysis[];
  pricing: PricingBreakdown;
  ocrResult?: OCRResult;
  translationExtras?: TranslationExtras;
  projectName?: string;
}

const TranslationReport = ({ 
  analyses, 
  pricing, 
  ocrResult, 
  translationExtras,
  projectName = "مشروع ترجمة"
}: TranslationReportProps) => {
  const [isExporting, setIsExporting] = useState(false);

  // تصدير التقرير إلى PDF
  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // إعداد الخط العربي (افتراضي)
      pdf.setFont('helvetica');
      
      // العنوان
      pdf.setFontSize(16);
      pdf.text('تقرير تحليل الترجمة', 105, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(`اسم المشروع: ${projectName}`, 20, 35);
      pdf.text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}`, 20, 45);
      
      // ملخص الملفات
      let yPosition = 60;
      pdf.setFontSize(14);
      pdf.text('ملخص الملفات:', 20, yPosition);
      
      yPosition += 10;
      analyses.forEach((analysis, index) => {
        pdf.setFontSize(10);
        pdf.text(`${index + 1}. ${analysis.fileName} (${analysis.fileType})`, 25, yPosition);
        pdf.text(`الكلمات: ${analysis.sourceWords.toLocaleString()}`, 25, yPosition + 5);
        pdf.text(`اللغة: ${analysis.detectedLanguage}`, 100, yPosition + 5);
        yPosition += 15;
      });
      
      // ملخص التسعير
      yPosition += 10;
      pdf.setFontSize(14);
      pdf.text('ملخص التسعير:', 20, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(10);
      pdf.text(`الكلمات القابلة للفوترة: ${pricing.billableWords.toLocaleString()}`, 25, yPosition);
      pdf.text(`السعر الأساسي: ${pricing.basePrice.toFixed(2)} ر.س`, 25, yPosition + 10);
      pdf.text(`الخصومات: ${pricing.totalDiscounts.toFixed(2)} ر.س`, 25, yPosition + 20);
      pdf.text(`الإضافات: ${pricing.totalExtras.toFixed(2)} ر.س`, 25, yPosition + 30);
      
      pdf.setFontSize(12);
      pdf.text(`الإجمالي: ${pricing.finalTotal.toFixed(2)} ر.س`, 25, yPosition + 45);
      
      pdf.save(`${projectName}-تقرير-ترجمة.pdf`);
    } catch (error) {
      console.error('خطأ في تصدير PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // تصدير التقرير إلى Excel
  const exportToExcel = () => {
    setIsExporting(true);
    try {
      const workbook = XLSX.utils.book_new();
      
      // ورقة تحليل الملفات
      const filesData = analyses.map(analysis => ({
        'اسم الملف': analysis.fileName,
        'النوع': analysis.fileType,
        'اللغة المكتشفة': analysis.detectedLanguage,
        'الصفحات': analysis.pages,
        'كلمات المصدر': analysis.sourceWords,
        'كلمات الجداول': analysis.tableWords,
        'الأرقام فقط': analysis.numbersOnly,
        'مستبعد': analysis.excluded,
        'نائبة': analysis.placeholders,
        'يحتاج OCR': analysis.ocrNeeded ? 'نعم' : 'لا',
        'تكرارات داخلية': analysis.duplicatesIntra,
        'تكرارات خارجية': analysis.duplicatesInter,
        'كلمات فريدة': analysis.uniqueWords,
        'ملاحظات': analysis.notes.join(', ')
      }));
      
      const filesSheet = XLSX.utils.json_to_sheet(filesData);
      XLSX.utils.book_append_sheet(workbook, filesSheet, 'تحليل الملفات');
      
      // ورقة التسعير
      const pricingData = [
        { 'البند': 'الكلمات القابلة للفوترة', 'القيمة': pricing.billableWords },
        { 'البند': 'السعر لكل كلمة', 'القيمة': `${pricing.pricePerWord} ر.س` },
        { 'البند': 'السعر الأساسي', 'القيمة': `${pricing.basePrice.toFixed(2)} ر.س` },
        { 'البند': 'خصم التكرارات الداخلية', 'القيمة': `${pricing.intraDiscount.toFixed(2)} ر.س` },
        { 'البند': 'خصم التكرارات الخارجية', 'القيمة': `${pricing.interDiscount.toFixed(2)} ر.س` },
        { 'البند': 'إجمالي الخصومات', 'القيمة': `${pricing.totalDiscounts.toFixed(2)} ر.س` },
        { 'البند': 'تكلفة OCR', 'القيمة': `${pricing.ocrCosts.totalOCRCost.toFixed(2)} ر.س` },
        { 'البند': 'رسوم الاستعجال', 'القيمة': `${pricing.rushFee.toFixed(2)} ر.س` },
        { 'البند': 'رسوم التنسيق', 'القيمة': `${pricing.formattingFee.toFixed(2)} ر.س` },
        { 'البند': 'رسوم التصديق', 'القيمة': `${pricing.certificationFee.toFixed(2)} ر.س` },
        { 'البند': 'رسوم المراجعة', 'القيمة': `${pricing.proofreadingFee.toFixed(2)} ر.س` },
        { 'البند': 'إجمالي الإضافات', 'القيمة': `${pricing.totalExtras.toFixed(2)} ر.س` },
        { 'البند': 'المجموع الفرعي', 'القيمة': `${pricing.subtotal.toFixed(2)} ر.س` },
        { 'البند': 'الحد الأدنى', 'القيمة': `${pricing.minimumCharge.toFixed(2)} ر.س` },
        { 'البند': 'الإجمالي النهائي', 'القيمة': `${pricing.finalTotal.toFixed(2)} ر.س` }
      ];
      
      const pricingSheet = XLSX.utils.json_to_sheet(pricingData);
      XLSX.utils.book_append_sheet(workbook, pricingSheet, 'التسعير المفصل');
      
      XLSX.writeFile(workbook, `${projectName}-تقرير-ترجمة.xlsx`);
    } catch (error) {
      console.error('خطأ في تصدير Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* رأس التقرير */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-right">
              <FileText className="h-5 w-5 text-primary" />
              تقرير تحليل الترجمة المفصل
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={exportToPDF}
                disabled={isExporting}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                PDF
              </Button>
              <Button
                onClick={exportToExcel}
                disabled={isExporting}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Excel
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            تم إنشاؤه في {new Date().toLocaleDateString('ar-SA')} - {new Date().toLocaleTimeString('ar-SA')}
          </div>
        </CardHeader>
      </Card>

      {/* ملخص إحصائي */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">إجمالي الملفات</span>
          </div>
          <div className="text-2xl font-bold text-primary">{analyses.length}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Languages className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">كلمات قابلة للترجمة</span>
          </div>
          <div className="text-2xl font-bold text-accent">{pricing.billableWords.toLocaleString()}</div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">السعر النهائي</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{pricing.finalTotal.toFixed(2)} ر.س</div>
        </Card>
        
        {ocrResult && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">صفحات OCR</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{ocrResult.totalPages}</div>
          </Card>
        )}
      </div>

      {/* جدول تحليل الملفات المفصل */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">تحليل الملفات المفصل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الملف</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">اللغة</TableHead>
                  <TableHead className="text-right">الصفحات</TableHead>
                  <TableHead className="text-right">كلمات المصدر</TableHead>
                  <TableHead className="text-right">كلمات الجداول</TableHead>
                  <TableHead className="text-right">أرقام فقط</TableHead>
                  <TableHead className="text-right">مستبعد</TableHead>
                  <TableHead className="text-right">ملاحظات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.map((analysis, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{analysis.fileName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{analysis.fileType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        {analysis.detectedLanguage}
                      </Badge>
                    </TableCell>
                    <TableCell>{analysis.pages}</TableCell>
                    <TableCell className="font-bold text-primary">
                      {analysis.sourceWords.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-accent">
                      {analysis.tableWords.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-orange-600">
                      {analysis.numbersOnly.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {analysis.excluded.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {analysis.notes.map((note, noteIndex) => (
                          <Badge key={noteIndex} variant="secondary" className="text-xs">
                            {note}
                          </Badge>
                        ))}
                        {analysis.ocrNeeded && (
                          <Badge variant="outline" className="text-xs text-orange-600">
                            يحتاج OCR
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* تفاصيل OCR */}
      {ocrResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right">
              <Eye className="h-5 w-5 text-orange-600" />
              تفاصيل معالجة OCR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="font-bold text-lg text-orange-600">{ocrResult.totalPages}</div>
                <div className="text-xs text-muted-foreground">صفحات معالجة</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-bold text-lg text-green-600">{ocrResult.averageConfidence}%</div>
                <div className="text-xs text-muted-foreground">متوسط الدقة</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-bold text-lg text-blue-600">
                  {ocrResult.pages.reduce((sum, page) => sum + page.extractedText.split(/\s+/).length, 0)}
                </div>
                <div className="text-xs text-muted-foreground">كلمات مستخرجة</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="font-bold text-lg text-red-600">{ocrResult.lowConfidencePages.length}</div>
                <div className="text-xs text-muted-foreground">صفحات تحتاج مراجعة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* معلومات العميل والإضافات */}
      {translationExtras && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">الخدمات الإضافية ومعلومات العميل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">الخدمات المطلوبة:</h4>
                <div className="space-y-1">
                  {translationExtras.proofreading && (
                    <Badge variant="outline" className="mr-1">مراجعة لغوية</Badge>
                  )}
                  {translationExtras.certification && (
                    <Badge variant="outline" className="mr-1">تصديق</Badge>
                  )}
                  {translationExtras.urgentDelivery && (
                    <Badge variant="outline" className="mr-1">تسليم عاجل</Badge>
                  )}
                  {translationExtras.formatting && (
                    <Badge variant="outline" className="mr-1">تنسيق متقدم</Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">معلومات التواصل:</h4>
                <div className="space-y-1 text-sm">
                  {translationExtras.clientContact.email && (
                    <div>البريد الإلكتروني: {translationExtras.clientContact.email}</div>
                  )}
                  {translationExtras.clientContact.whatsapp && (
                    <div>واتساب: {translationExtras.clientContact.whatsapp}</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TranslationReport;