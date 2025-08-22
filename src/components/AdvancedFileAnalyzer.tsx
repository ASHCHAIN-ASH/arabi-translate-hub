import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Languages,
  Calculator,
  Eye,
  Download
} from "lucide-react";
import { textAnalyzer, TextAnalysisResult } from "@/utils/textAnalyzer";
import { fileProcessor, FileProcessingResult } from "@/utils/fileProcessors";
import TranslationExtrasForm from "./TranslationExtrasForm";

interface FileAnalysisResult {
  fileName: string;
  fileType: string;
  analysis: TextAnalysisResult;
  processing: FileProcessingResult;
  notes: string[];
}

interface AnalysisProgress {
  current: number;
  total: number;
  stage: string;
  fileName: string;
  percentage: number;
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

interface AdvancedFileAnalyzerProps {
  onAnalysisComplete?: (results: FileAnalysisResult[]) => void;
}

const AdvancedFileAnalyzer = ({ onAnalysisComplete }: AdvancedFileAnalyzerProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<FileAnalysisResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [error, setError] = useState<string>("");
  const [translationExtras, setTranslationExtras] = useState<TranslationExtras | null>(null);

  const supportedFormats = [
    '.txt', '.md', '.docx', '.doc', '.xlsx', '.xls', '.csv',
    '.pdf', '.html', '.htm', '.json', '.jpg', '.jpeg', '.png',
    '.bmp', '.tiff', '.webp'
  ];

  // معالجة رفع الملفات
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    setError("");
    setIsProcessing(true);
    setResults([]);

    try {
      const analysisResults: FileAnalysisResult[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExtension = file.name.toLowerCase().split('.').pop() || '';

        setProgress({
          current: i,
          total: selectedFiles.length,
          stage: "معالجة الملف",
          fileName: file.name,
          percentage: (i / selectedFiles.length) * 100
        });

        try {
          // معالجة الملف
          const processingResult = await fileProcessor.processFile(file);
          
          setProgress({
            current: i,
            total: selectedFiles.length,
            stage: "تحليل النصوص",
            fileName: file.name,
            percentage: ((i + 0.5) / selectedFiles.length) * 100
          });

          // تحليل النصوص
          const analysisResult = textAnalyzer.analyzeText(processingResult.content);

          // إنشاء الملاحظات
          const notes: string[] = [];
          if (processingResult.metadata.needsOCR) {
            notes.push("يحتاج معالجة OCR");
          }
          if (processingResult.errors.length > 0) {
            notes.push(`أخطاء: ${processingResult.errors.length}`);
          }
          if (analysisResult.duplicatesIntra > analysisResult.sourceWords * 0.2) {
            notes.push("نسبة تكرار عالية");
          }
          if (analysisResult.tableWords > analysisResult.sourceWords * 0.3) {
            notes.push("يحتوي على جداول كثيرة");
          }
          if (analysisResult.billableWords === 0) {
            notes.push("لا توجد كلمات قابلة للترجمة");
          }

          const fileResult: FileAnalysisResult = {
            fileName: file.name,
            fileType: fileExtension.toUpperCase(),
            analysis: analysisResult,
            processing: processingResult,
            notes
          };

          analysisResults.push(fileResult);

        } catch (fileError) {
          console.error(`خطأ في معالجة ${file.name}:`, fileError);
          
          // إضافة ملف فاشل
          analysisResults.push({
            fileName: file.name,
            fileType: (file.name.split('.').pop() || '').toUpperCase(),
            analysis: {
              totalWords: 0,
              sourceWords: 0,
              tableWords: 0,
              numbersOnly: 0,
              excluded: 0,
              placeholders: 0,
              duplicatesIntra: 0,
              uniqueWords: 0,
              detectedLanguage: "غير محدد",
              wordFrequency: new Map(),
              billableWords: 0
            },
            processing: {
              content: '',
              metadata: {
                pages: 0,
                fileSize: file.size,
                processingTime: 0,
                needsOCR: false,
                processingMethod: 'failed'
              },
              errors: [fileError instanceof Error ? fileError.message : 'خطأ غير معروف']
            },
            notes: ['فشل في المعالجة']
          });
        }
      }

      // حساب التكرارات بين الملفات
      if (analysisResults.length > 1) {
        setProgress({
          current: selectedFiles.length,
          total: selectedFiles.length,
          stage: "حساب التكرارات بين الملفات",
          fileName: "جميع الملفات",
          percentage: 95
        });

        const validTexts = analysisResults
          .filter(result => result.processing.content.length > 0)
          .map(result => ({
            fileName: result.fileName,
            content: result.processing.content
          }));

        if (validTexts.length > 1) {
          const multiAnalysis = textAnalyzer.analyzeMultipleTexts(validTexts);
          
          // تحديث النتائج بالتكرارات بين الملفات
          analysisResults.forEach((result, index) => {
            const individualResult = multiAnalysis.individual.find(
              r => r.fileName === result.fileName
            );
            if (individualResult) {
              // نسبة تكرار تقديرية بين الملفات
              const interDuplicates = Math.floor(
                (multiAnalysis.combined.interFileDuplicates / analysisResults.length) * 0.1
              );
              result.analysis = {
                ...result.analysis,
                duplicatesIntra: individualResult.duplicatesIntra + interDuplicates
              };
            }
          });
        }
      }

      setProgress({
        current: selectedFiles.length,
        total: selectedFiles.length,
        stage: "اكتمل التحليل",
        fileName: "جميع الملفات",
        percentage: 100
      });

      setResults(analysisResults);
      onAnalysisComplete?.(analysisResults);

    } catch (error) {
      console.error("خطأ في التحليل:", error);
      setError(error instanceof Error ? error.message : "حدث خطأ في التحليل");
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(null), 2000);
    }
  };

  // حذف ملف
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    
    const newResults = [...results];
    newResults.splice(index, 1);
    setResults(newResults);
    onAnalysisComplete?.(newResults);
  };

  // حساب الإحصائيات الإجمالية
  const totalStats = results.reduce(
    (acc, result) => ({
      totalWords: acc.totalWords + result.analysis.totalWords,
      sourceWords: acc.sourceWords + result.analysis.sourceWords,
      tableWords: acc.tableWords + result.analysis.tableWords,
      billableWords: acc.billableWords + result.analysis.billableWords,
      uniqueWords: acc.uniqueWords + result.analysis.uniqueWords,
      files: acc.files + 1,
      pages: acc.pages + result.processing.metadata.pages
    }),
    { totalWords: 0, sourceWords: 0, tableWords: 0, billableWords: 0, uniqueWords: 0, files: 0, pages: 0 }
  );

  return (
    <div className="space-y-6">
      {/* رأس المحلل */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <BarChart3 className="h-5 w-5 text-primary" />
            محلل الملفات المتقدم للترجمة
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            نظام تحليل متطور للنصوص مع كشف دقيق للكلمات القابلة للفوترة
          </div>
        </CardHeader>
      </Card>

      {/* منطقة رفع الملفات */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label htmlFor="advanced-file-upload" className="text-sm font-medium">
              اختر الملفات للتحليل المتقدم
            </Label>
            <div className="relative">
              <Input
                id="advanced-file-upload"
                type="file"
                multiple
                accept={supportedFormats.join(',')}
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('advanced-file-upload')?.click()}
                disabled={isProcessing}
                className="w-full h-24 border-2 border-dashed border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10"
                variant="outline"
              >
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-primary" />
                  <span className="text-base font-medium">
                    {isProcessing ? "جاري التحليل المتقدم..." : "اختر الملفات للتحليل"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    جميع أنواع الملفات مدعومة + معالجة OCR للصور
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* شريط التقدم */}
      {progress && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{progress.stage}</span>
                <span className="text-xs text-muted-foreground">
                  {progress.current + 1} من {progress.total}
                </span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                معالجة: {progress.fileName}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* الأخطاء */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* إحصائيات إجمالية */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">الملفات</span>
            </div>
            <div className="text-2xl font-bold text-primary">{totalStats.files}</div>
            <div className="text-xs text-muted-foreground">{totalStats.pages} صفحة</div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">كلمات قابلة للفوترة</span>
            </div>
            <div className="text-2xl font-bold text-accent">{totalStats.billableWords.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">من {totalStats.totalWords.toLocaleString()} إجمالي</div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">كلمات فريدة</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{totalStats.uniqueWords.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">بدون تكرار</div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">السعر التقديري</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {(totalStats.billableWords * 0.20).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">ريال سعودي</div>
          </Card>
        </div>
      )}

      {/* جدول النتائج المفصل */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">تحليل مفصل للملفات</CardTitle>
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
                    <TableHead className="text-right">إجمالي الكلمات</TableHead>
                    <TableHead className="text-right">كلمات قابلة للفوترة</TableHead>
                    <TableHead className="text-right">كلمات فريدة</TableHead>
                    <TableHead className="text-right">ملاحظات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {result.fileName}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            disabled={isProcessing}
                            className="h-5 w-5 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{result.fileType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-accent/10 text-accent">
                          {result.analysis.detectedLanguage}
                        </Badge>
                      </TableCell>
                      <TableCell>{result.processing.metadata.pages}</TableCell>
                      <TableCell className="font-bold">
                        {result.analysis.totalWords.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        {result.analysis.billableWords.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-green-600 font-bold">
                        {result.analysis.uniqueWords.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {result.notes.map((note, noteIndex) => (
                            <Badge key={noteIndex} variant="secondary" className="text-xs">
                              {note}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* الإضافات الاختيارية */}
      {results.length > 0 && (
        <TranslationExtrasForm onExtrasChange={setTranslationExtras} />
      )}
    </div>
  );
};

export default AdvancedFileAnalyzer;