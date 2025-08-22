import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  FileText, 
  X, 
  AlertCircle, 
  Scan,
  CheckCircle,
  FileCheck,
  Calculator
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TranslationExtrasForm from "./TranslationExtrasForm";
import OCRProcessor, { OCRResult } from "./OCRProcessor";
import PricingEngine, { PricingBreakdown, WordCounts } from "./PricingEngine";
import TranslationReport from "./TranslationReport";
// @ts-ignore
import mammoth from "mammoth";
// @ts-ignore  
import * as XLSX from "xlsx";

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
  rawText: string;
  translationExtras?: TranslationExtras;
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

interface AnalysisProgress {
  current: number;
  total: number;
  stage: string;
  message: string;
}

interface FileAnalyzerProps {
  onAnalysisComplete: (analysis: FileAnalysis[]) => void;
  isProcessing: boolean;
  onProcessingChange: (processing: boolean) => void;
}

const FileAnalyzer = ({ onAnalysisComplete, isProcessing, onProcessingChange }: FileAnalyzerProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [analyses, setAnalyses] = useState<FileAnalysis[]>([]);
  const [translationExtras, setTranslationExtras] = useState<TranslationExtras | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [showReport, setShowReport] = useState(false);

  const supportedFormats = [
    '.pdf', '.docx', '.doc', '.txt', '.html', '.md', '.json', 
    '.pptx', '.xlsx', '.csv', '.zip', '.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'
  ];

  // كشف اللغة من النص
  const detectLanguage = useCallback((text: string): string => {
    if (!text || text.trim().length === 0) return "غير محدد";
    
    // أنماط اللغات الشائعة
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    const englishPattern = /[a-zA-Z]/;
    const frenchPattern = /[àâäéèêëïîôùûüÿç]/i;
    const spanishPattern = /[ñáéíóúü]/i;
    const germanPattern = /[äöüß]/i;
    
    const sample = text.substring(0, 1000); // عينة من النص
    
    if (arabicPattern.test(sample)) return "العربية";
    if (frenchPattern.test(sample)) return "الفرنسية";
    if (spanishPattern.test(sample)) return "الإسبانية";  
    if (germanPattern.test(sample)) return "الألمانية";
    if (englishPattern.test(sample)) return "الإنجليزية";
    
    return "غير محدد";
  }, []);

  // تحليل النص محسن للسرعة
  const analyzeText = useCallback((text: string): {
    sourceWords: number;
    tableWords: number;
    numbersOnly: number;
    excluded: number;
    placeholders: number;
    duplicatesIntra: number;
    uniqueWords: number;
  } => {
    if (!text || text.trim().length === 0) {
      return {
        sourceWords: 0,
        tableWords: 0,
        numbersOnly: 0,
        excluded: 0,
        placeholders: 0,
        duplicatesIntra: 0,
        uniqueWords: 0
      };
    }

    // تنظيف النص
    const cleanText = text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // استخراج الكلمات
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);

    let sourceWords = 0;
    let tableWords = 0;
    let numbersOnly = 0;
    let excluded = 0;
    let placeholders = 0;

    // أنماط التحليل
    const placeholderPattern = /^[\{\[%].*[\}\]%]$|%s|\{name\}/;
    const numberPattern = /^\d+([.,]\d+)*$/;
    const codePattern = /^(https?:\/\/|www\.|[A-Z0-9]{3,}-[A-Z0-9]{3,}|#[a-zA-Z0-9_]+)/;
    const hasTabularData = text.includes('\t') || text.includes('|');

    // مجموعة للكلمات الفريدة للترجمة فقط
    const uniqueTranslatableWords = new Set<string>();
    let duplicatesIntra = 0;
    const allWordCounts = new Map<string, number>();

    // تحليل الكلمات
    words.forEach(word => {
      const normalizedWord = word.toLowerCase().replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, '');
      
      if (normalizedWord.length < 2) {
        excluded++;
        return;
      }

      if (placeholderPattern.test(word)) {
        placeholders++;
      } else if (numberPattern.test(word)) {
        numbersOnly++;
      } else if (codePattern.test(word) || (word.length > 20 && /[A-Z0-9]{5,}/.test(word))) {
        excluded++;
      } else {
        // تحديد إذا كانت الكلمة في جدول أم لا
        if (hasTabularData && (text.indexOf(word) > -1)) {
          const wordIndex = cleanText.indexOf(word);
          const context = cleanText.substring(
            Math.max(0, wordIndex - 30), 
            Math.min(cleanText.length, wordIndex + word.length + 30)
          );
          
          if (context.includes('\t') || context.includes('|')) {
            tableWords++;
          } else {
            sourceWords++;
          }
        } else {
          sourceWords++;
        }
        
        // إضافة للكلمات الفريدة
        uniqueTranslatableWords.add(normalizedWord);
      }

      // حساب التكرارات لجميع الكلمات المعالجة
      if (normalizedWord.length > 2 && !placeholderPattern.test(word) && !numberPattern.test(word)) {
        const count = allWordCounts.get(normalizedWord) || 0;
        if (count > 0) {
          duplicatesIntra++;
        }
        allWordCounts.set(normalizedWord, count + 1);
      }
    });

    return {
      sourceWords,
      tableWords,
      numbersOnly,
      excluded,
      placeholders,
      duplicatesIntra,
      uniqueWords: uniqueTranslatableWords.size
    };
  }, []);

  // استخراج النص من PDF - نظام بديل مبسط
  const extractPdfText = useCallback(async (file: File): Promise<string> => {
    console.log('PDF detection:', file.name);
    
    // PDF يحتاج معالجة خاصة - سنضع رسالة واضحة
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("ملف PDF تم اكتشافه - يحتاج معالجة خاصة. يمكنك تحويله إلى DOCX أو TXT لتحليل دقيق.");
      }, 1000);
    });
  }, []);

  // استخراج النص من الملفات المختلفة المحسن
  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    try {
      setProgress(prev => prev ? { ...prev, message: `استخراج النص من ${file.name}...` } : null);

      if (fileExtension === '.txt') {
        const text = await file.text();
        return text;
        
      } else if (fileExtension === '.pdf') {
        return await extractPdfText(file);
        
      } else if (fileExtension === '.docx' || fileExtension === '.doc') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
        
      } else if (fileExtension === '.pptx') {
        // استخراج النصوص من PowerPoint - نسخة مبسطة
        return "محتوى PowerPoint - يحتاج معالجة خاصة للاستخراج الدقيق";
        
      } else if (fileExtension === '.xlsx' || fileExtension === '.csv') {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        let allText = '';
        
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          jsonData.forEach((row: any) => {
            if (Array.isArray(row)) {
              allText += row.join(' ') + '\n';
            }
          });
        });
        
        return allText;
        
      } else if (fileExtension === '.json') {
        const text = await file.text();
        const jsonContent = JSON.parse(text);
        return JSON.stringify(jsonContent, null, 2);
        
      } else if (fileExtension === '.html') {
        const htmlContent = await file.text();
        return htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        
      } else if (fileExtension === '.md') {
        const mdContent = await file.text();
        return mdContent
          .replace(/#{1,6}\s/g, '')
          .replace(/\*\*(.*?)\*\*/g, '$1')
          .replace(/\*(.*?)\*/g, '$1')
          .replace(/\[(.*?)\]\(.*?\)/g, '$1')
          .trim();
          
      } else if (['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp'].includes(fileExtension || '')) {
        // الملفات الصورية تحتاج OCR منفصل
        return `صورة تحتاج معالجة OCR: ${file.name}`;
        
      } else if (fileExtension === '.zip') {
        return "ملف مضغوط - يحتاج استخراج المحتويات أولاً";
      }
      
      throw new Error(`نوع الملف ${fileExtension} غير مدعوم`);
      
    } catch (error) {
      console.error(`خطأ في استخراج النص من ${file.name}:`, error);
      throw error;
    }
  }, [extractPdfText]);

  // معالجة رفع الملفات
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;
    
    setError("");
    setFiles(selectedFiles);
    onProcessingChange(true);
    
    try {
      setProgress({
        current: 0,
        total: selectedFiles.length,
        stage: "بدء التحليل",
        message: "جاري تحضير الملفات للتحليل..."
      });

      const analysisResults: FileAnalysis[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        
        // التحقق من نوع الملف
        if (!supportedFormats.includes(fileExtension)) {
          throw new Error(`نوع الملف ${fileExtension} غير مدعوم`);
        }

        setProgress({
          current: i,
          total: selectedFiles.length,
          stage: "استخراج النص",
          message: `معالجة الملف ${i + 1} من ${selectedFiles.length}: ${file.name}`
        });

        try {
          // استخراج النص
          const rawText = await extractTextFromFile(file);
          
          setProgress({
            current: i,
            total: selectedFiles.length,
            stage: "تحليل المحتوى",
            message: `تحليل متقدم للملف: ${file.name}`
          });

          // تحليل النص
          const analysis = analyzeText(rawText);
          
          // إنشاء تحليل الملف
          const fileAnalysis: FileAnalysis = {
            fileName: file.name,
            fileType: fileExtension.substring(1).toUpperCase(),
            detectedLanguage: detectLanguage(rawText),
            pages: fileExtension === '.pdf' ? Math.ceil(rawText.length / 2000) : 1,
            sourceWords: analysis.sourceWords,
            tableWords: analysis.tableWords,
            numbersOnly: analysis.numbersOnly,
            excluded: analysis.excluded,
            placeholders: analysis.placeholders,
            ocrNeeded: rawText.length < 100 && fileExtension === '.pdf',
            duplicatesIntra: analysis.duplicatesIntra,
            duplicatesInter: 0,
            uniqueWords: analysis.uniqueWords,
            notes: [],
            rawText
          };

          // إضافة ملاحظات
          if (fileAnalysis.ocrNeeded) {
            fileAnalysis.notes.push("يحتاج معالجة OCR");
          }
          if (analysis.duplicatesIntra > analysis.sourceWords * 0.1) {
            fileAnalysis.notes.push("نسبة تكرار عالية");
          }
          if (analysis.tableWords > analysis.sourceWords * 0.3) {
            fileAnalysis.notes.push("يحتوي على جداول كثيرة");
          }

          analysisResults.push(fileAnalysis);
          
        } catch (fileError) {
          console.error(`خطأ في معالجة الملف ${file.name}:`, fileError);
          
          // إضافة ملف فاشل مع معلومات الخطأ
          analysisResults.push({
            fileName: file.name,
            fileType: fileExtension.substring(1).toUpperCase(),
            detectedLanguage: "غير محدد",
            pages: 0,
            sourceWords: 0,
            tableWords: 0,
            numbersOnly: 0,
            excluded: 0,
            placeholders: 0,
            ocrNeeded: false,
            duplicatesIntra: 0,
            duplicatesInter: 0,
            uniqueWords: 0,
            notes: [`خطأ في المعالجة: ${fileError instanceof Error ? fileError.message : 'خطأ غير معروف'}`],
            rawText: ""
          });
        }
      }

      // حساب التكرارات بين الملفات
      const allTexts = analysisResults.map(a => a.rawText).filter(t => t.length > 0);
      if (allTexts.length > 1) {
        setProgress({
          current: selectedFiles.length - 1,
          total: selectedFiles.length,
          stage: "تحليل التكرارات",
          message: "حساب التكرارات بين الملفات..."
        });

        // حساب بسيط للتكرارات بين الملفات
        analysisResults.forEach((analysis, index) => {
          if (analysis.rawText.length === 0) return;
          
          const words = analysis.rawText.toLowerCase().split(/\s+/);
          let interDuplicates = 0;
          
          for (let j = 0; j < allTexts.length; j++) {
            if (j === index) continue;
            
            const otherWords = allTexts[j].toLowerCase().split(/\s+/);
            const commonWords = words.filter(word => 
              word.length > 3 && otherWords.includes(word)
            );
            interDuplicates += commonWords.length;
          }
          
          analysis.duplicatesInter = interDuplicates;
          if (interDuplicates > words.length * 0.1) {
            analysis.notes.push("تشابه مع ملفات أخرى");
          }
        });
      }

      setProgress({
        current: selectedFiles.length,
        total: selectedFiles.length,
        stage: "اكتمل",
        message: "تم إنجاز التحليل بنجاح!"
      });

      setAnalyses(analysisResults);
      onAnalysisComplete(analysisResults);
      
      // حساب التسعير تلقائياً
      const totalWordCounts: WordCounts = {
        sourceWords: analysisResults.reduce((sum, a) => sum + a.sourceWords, 0),
        tableWords: analysisResults.reduce((sum, a) => sum + a.tableWords, 0),
        numbersOnly: analysisResults.reduce((sum, a) => sum + a.numbersOnly, 0),
        excluded: analysisResults.reduce((sum, a) => sum + a.excluded, 0),
        placeholders: analysisResults.reduce((sum, a) => sum + a.placeholders, 0),
        duplicatesIntra: analysisResults.reduce((sum, a) => sum + a.duplicatesIntra, 0),
        duplicatesInter: analysisResults.reduce((sum, a) => sum + a.duplicatesInter, 0),
        uniqueWords: analysisResults.reduce((sum, a) => sum + a.uniqueWords, 0)
      };

    } catch (error) {
      console.error("خطأ في التحليل:", error);
      setError(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
    } finally {
      onProcessingChange(false);
      setTimeout(() => setProgress(null), 2000);
    }
  };

  // حذف ملف
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newAnalyses = [...analyses];
    newAnalyses.splice(index, 1);
    setAnalyses(newAnalyses);
    onAnalysisComplete(newAnalyses);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-right">
            <Scan className="h-5 w-5 text-primary" />
            محلل الملفات المتقدم
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            نظام مبسط
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* منطقة رفع الملفات */}
          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-sm font-medium">
              اختر الملفات للتحليل المتقدم
            </Label>
            <div className="relative">
              <Input
                id="file-upload"
                type="file"
                multiple
                accept={supportedFormats.join(',')}
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isProcessing}
                className="w-full h-20 border-2 border-dashed border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10"
                variant="outline"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">
                    {isProcessing ? "جاري المعالجة..." : "اضغط لاختيار الملفات"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, DOCX, PPTX, XLSX, TXT, HTML, MD, JSON, صور + OCR
                  </span>
                </div>
              </Button>
            </div>
          </div>

        {/* شريط التقدم */}
        {progress && (
          <div className="space-y-2 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{progress.stage}</span>
              <span className="text-xs text-muted-foreground">
                {progress.current} من {progress.total}
              </span>
            </div>
            <Progress 
              value={(progress.current / progress.total) * 100} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">{progress.message}</p>
          </div>
        )}

        {/* رسائل الخطأ */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* قائمة الملفات */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">الملفات المحددة:</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm">{file.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                    disabled={isProcessing}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* نتائج التحليل */}
        {analyses.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-medium">نتائج التحليل</h3>
            </div>
            
            <div className="grid gap-3">
              {analyses.map((analysis, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{analysis.fileName}</span>
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
                        {analysis.detectedLanguage}
                      </Badge>
                    </div>
                    <Badge variant="outline">{analysis.fileType}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                    <div className="text-center">
                      <div className="font-bold text-primary">{analysis.sourceWords.toLocaleString()}</div>
                      <div className="text-muted-foreground">كلمات مصدرية</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-accent">{analysis.tableWords.toLocaleString()}</div>
                      <div className="text-muted-foreground">كلمات جداول</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">{analysis.uniqueWords.toLocaleString()}</div>
                      <div className="text-muted-foreground">كلمات فريدة</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-orange-600">{analysis.numbersOnly.toLocaleString()}</div>
                      <div className="text-muted-foreground">أرقام</div>
                    </div>
                  </div>
                  
                  {analysis.notes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {analysis.notes.map((note, noteIndex) => (
                        <Badge key={noteIndex} variant="secondary" className="text-xs">
                          {note}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* إضافات الترجمة الاختيارية */}
            <TranslationExtrasForm onExtrasChange={setTranslationExtras} />
            
            {/* حساب التسعير */}
            {analyses.length > 0 && (
              <PricingEngine
                wordCounts={{
                  sourceWords: analyses.reduce((sum, a) => sum + a.sourceWords, 0),
                  tableWords: analyses.reduce((sum, a) => sum + a.tableWords, 0),
                  numbersOnly: analyses.reduce((sum, a) => sum + a.numbersOnly, 0),
                  excluded: analyses.reduce((sum, a) => sum + a.excluded, 0),
                  placeholders: analyses.reduce((sum, a) => sum + a.placeholders, 0),
                  duplicatesIntra: analyses.reduce((sum, a) => sum + a.duplicatesIntra, 0),
                  duplicatesInter: analyses.reduce((sum, a) => sum + a.duplicatesInter, 0),
                  uniqueWords: analyses.reduce((sum, a) => sum + a.uniqueWords, 0)
                }}
                ocrPages={ocrResult?.totalPages || 0}
                translationExtras={translationExtras || undefined}
                onPricingCalculated={setPricing}
              />
            )}
            
            {/* إنشاء التقرير المفصل */}
            {analyses.length > 0 && pricing && (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowReport(!showReport)}
                    className="flex items-center gap-2"
                    variant={showReport ? "secondary" : "default"}
                  >
                    <FileCheck className="h-4 w-4" />
                    {showReport ? "إخفاء التقرير المفصل" : "عرض التقرير المفصل"}
                  </Button>
                </div>
                
                {showReport && (
                  <TranslationReport
                    analyses={analyses}
                    pricing={pricing}
                    ocrResult={ocrResult || undefined}
                    translationExtras={translationExtras || undefined}
                    projectName="مشروع ترجمة جديد"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileAnalyzer;