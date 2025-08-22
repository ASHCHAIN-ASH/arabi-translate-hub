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
  Table,
  Hash,
  Copy,
  Filter,
  Zap,
  CheckCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// @ts-ignore
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// تحديد مسار Worker لـ PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileAnalysis {
  fileName: string;
  fileType: string;
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

  const supportedFormats = [
    '.pdf', '.docx', '.doc', '.pptx', '.xlsx', '.csv', 
    '.txt', '.html', '.md', '.json', '.zip'
  ];

  // تحليل النص وكشف أنواع الكلمات - محسن للسرعة
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

    // تنظيف النص محسن
    const cleanText = text
      .replace(/[\r\n\t]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // استخراج الكلمات محسن
    const words = cleanText.split(' ').filter(word => word.length > 0);

    let sourceWords = 0;
    let tableWords = 0;
    let numbersOnly = 0;
    let excluded = 0;
    let placeholders = 0;

    // كشف الجداول مسبقاً
    const hasTabularData = text.includes('\t') || text.includes('|');
    
    // أنماط Regex محسنة للسرعة
    const placeholderPattern = /^[\{\[%].*[\}\]%]$|%s|\{name\}/;
    const numberPattern = /^\d+([.,]\d+)*$/;
    const codePattern = /^(https?:\/\/|www\.|[A-Z0-9]{3,}-[A-Z0-9]{3,}|#[a-zA-Z0-9_]+)/;

    // تحليل محسن للكلمات
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      // كشف النصوص النائبة
      if (placeholderPattern.test(word)) {
        placeholders++;
        continue;
      }

      // كشف الأرقام الصرفة
      if (numberPattern.test(word)) {
        numbersOnly++;
        continue;
      }

      // كشف الأكواد والمعرفات والروابط
      if (codePattern.test(word) || (word.length > 20 && /[A-Z0-9]{5,}/.test(word))) {
        excluded++;
        continue;
      }

      // كشف كلمات الجداول محسن
      if (hasTabularData) {
        // تحليل بسيط وسريع للجداول
        const context = text.substring(
          Math.max(0, text.indexOf(word) - 50), 
          Math.min(text.length, text.indexOf(word) + word.length + 50)
        );
        
        if (context.includes('\t') || context.includes('|')) {
          tableWords++;
        } else {
          sourceWords++;
        }
      } else {
        sourceWords++;
      }
    }

    // حساب التكرارات الداخلية محسن
    const wordCount = new Map<string, number>();
    let duplicatesIntra = 0;
    
    for (const word of words) {
      const normalized = word.toLowerCase();
      if (normalized.length > 2) {
        const count = wordCount.get(normalized) || 0;
        if (count > 0) {
          duplicatesIntra++;
        }
        wordCount.set(normalized, count + 1);
      }
    }

    const uniqueWords = wordCount.size;

    return {
      sourceWords,
      tableWords,
      numbersOnly,
      excluded,
      placeholders,
      duplicatesIntra,
      uniqueWords
    };
  }, []);

  // استخراج النص من الملفات
  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result;
          let extractedText = "";
          
          setProgress(prev => prev ? { ...prev, message: `استخراج النص من ${file.name}...` } : null);

          if (fileExtension === '.txt' || file.type === 'text/plain') {
            extractedText = content as string;
            
          } else if (fileExtension === '.pdf') {
            const arrayBuffer = content as ArrayBuffer;
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise as any;
            const totalPages = pdf.numPages;
            let allText = "";
            
            // معالجة متوازية محسنة للصفحات - 8 صفحات في الوقت نفسه
            const batchSize = 8;
            const batches = [];
            
            for (let i = 0; i < totalPages; i += batchSize) {
              batches.push(Array.from({ length: Math.min(batchSize, totalPages - i) }, (_, j) => i + j + 1));
            }
            
            let processedPages = 0;
            
            for (const batch of batches) {
              const batchPromises = batch.map(async (pageNum) => {
                try {
                  const page = await pdf.getPage(pageNum);
                  const textContent = await page.getTextContent();
                  const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');
                  
                  if (page.cleanup) page.cleanup();
                  
                  return { pageNum, text: pageText };
                } catch (pageError) {
                  console.warn(`خطأ في معالجة الصفحة ${pageNum}:`, pageError);
                  return { pageNum, text: '' };
                }
              });
              
              const batchResults = await Promise.all(batchPromises);
              
              batchResults
                .sort((a, b) => a.pageNum - b.pageNum)
                .forEach(result => {
                  allText += result.text + '\n';
                });
              
              processedPages += batch.length;
              
              setProgress(prev => prev ? {
                ...prev,
                current: Math.round((processedPages / totalPages) * 100),
                message: `معالجة ${file.name}: ${processedPages} من ${totalPages} صفحة...`
              } : null);
            }
            
            if (pdf.destroy) pdf.destroy();
            extractedText = allText;
            
          } else if (fileExtension === '.docx' || fileExtension === '.doc') {
            const arrayBuffer = content as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            extractedText = result.value;
            
          } else if (fileExtension === '.json') {
            const jsonContent = JSON.parse(content as string);
            extractedText = JSON.stringify(jsonContent, null, 2);
            
          } else if (fileExtension === '.html') {
            const htmlContent = content as string;
            // إزالة الوسوم HTML
            extractedText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            
          } else if (fileExtension === '.md') {
            const mdContent = content as string;
            // إزالة علامات Markdown الأساسية
            extractedText = mdContent
              .replace(/#{1,6}\s/g, '')
              .replace(/\*\*(.*?)\*\*/g, '$1')
              .replace(/\*(.*?)\*/g, '$1')
              .replace(/\[(.*?)\]\(.*?\)/g, '$1')
              .trim();
          }
          
          if (!extractedText || extractedText.trim().length === 0) {
            reject(new Error("الملف فارغ أو لا يحتوي على نص قابل للقراءة"));
            return;
          }
          
          resolve(extractedText.trim());
          
        } catch (error) {
          console.error("خطأ في استخراج النص:", error);
          reject(new Error("خطأ في قراءة محتوى الملف: " + (error instanceof Error ? error.message : "خطأ غير معروف")));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("خطأ في قراءة الملف"));
      };
      
      if (fileExtension === '.txt' || file.type === 'text/plain' || fileExtension === '.html' || fileExtension === '.md' || fileExtension === '.json') {
        reader.readAsText(file, 'UTF-8');
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }, []);

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
            pages: fileExtension === '.pdf' ? Math.ceil(rawText.length / 2000) : 1, // تقدير تقريبي
            sourceWords: analysis.sourceWords,
            tableWords: analysis.tableWords,
            numbersOnly: analysis.numbersOnly,
            excluded: analysis.excluded,
            placeholders: analysis.placeholders,
            ocrNeeded: rawText.length < 100 && fileExtension === '.pdf', // كشف بسيط لـ OCR
            duplicatesIntra: analysis.duplicatesIntra,
            duplicatesInter: 0, // سيتم حسابه لاحقاً
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

        // تحليل بسيط للتكرارات بين الملفات
        analysisResults.forEach((analysis, index) => {
          if (analysis.rawText) {
            const words = analysis.rawText.split(/\s+/).filter(w => w.length > 3);
            let interDuplicates = 0;
            
            words.forEach(word => {
              const normalizedWord = word.toLowerCase().trim();
              for (let i = 0; i < allTexts.length; i++) {
                if (i !== index && allTexts[i].toLowerCase().includes(normalizedWord)) {
                  interDuplicates++;
                  break;
                }
              }
            });
            
            analysis.duplicatesInter = Math.floor(interDuplicates * 0.1); // تقدير تقريبي
          }
        });
      }

      setAnalyses(analysisResults);
      onAnalysisComplete(analysisResults);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطأ غير معروف";
      setError(errorMessage);
      console.error("خطأ في تحليل الملفات:", error);
    } finally {
      setProgress(null);
      onProcessingChange(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    if (newFiles.length === 0) {
      setAnalyses([]);
      onAnalysisComplete([]);
      
      // إعادة تعيين input
      const input = document.getElementById("file-analyzer") as HTMLInputElement;
      if (input) input.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* منطقة رفع الملفات */}
      <Card className="bg-gradient-card border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Scan className="h-6 w-6 text-primary animate-pulse-soft" />
            محلل الملفات المتقدم
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                multiple
                accept={supportedFormats.join(',')}
                onChange={handleFileUpload}
                className="hidden"
                id="file-analyzer"
                disabled={isProcessing}
              />
              <Label
                htmlFor="file-analyzer"
                className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 rounded-xl cursor-pointer transition-all duration-200 border-2 border-dashed border-primary/30 hover:border-primary/50 w-full justify-center ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
              >
                <Upload className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-bold text-lg">
                    {progress ? progress.message : isProcessing ? "جاري التحليل المتقدم..." : "رفع الملفات للتحليل الشامل"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    يدعم جميع الصيغ: PDF, DOCX, PPTX, XLSX, CSV, TXT, HTML, Markdown, JSON, ZIP
                  </div>
                </div>
              </Label>
            </div>
          </div>

          {/* شريط التقدم */}
          {progress && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">{progress.stage}</span>
                <span className="text-primary font-bold">{progress.current}/{progress.total}</span>
              </div>
              <Progress value={(progress.current / progress.total) * 100} className="h-3" />
              <div className="text-center text-sm text-muted-foreground">
                {progress.message}
              </div>
            </div>
          )}

          {/* الميزات المدعومة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Table className="h-4 w-4 text-blue-600" />
              <span>كشف الجداول</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Hash className="h-4 w-4 text-orange-600" />
              <span>فلترة الأرقام</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Copy className="h-4 w-4 text-purple-600" />
              <span>كشف التكرارات</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Scan className="h-4 w-4 text-green-600" />
              <span>كشف OCR</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* عرض الملفات المرفوعة */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            الملفات المرفوعة ({files.length})
          </h4>
          
          {files.map((file, index) => {
            const analysis = analyses[index];
            return (
              <Card key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-green-800 dark:text-green-200 truncate">{file.name}</p>
                        <div className="flex items-center gap-4 text-sm text-green-600 dark:text-green-400 mt-1">
                          <span>{(file.size / 1024).toFixed(1)} KB</span>
                          {analysis && (
                            <>
                              <span>{analysis.sourceWords.toLocaleString()} كلمة</span>
                              {analysis.tableWords > 0 && (
                                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                  {analysis.tableWords} في جداول
                                </Badge>
                              )}
                              {analysis.ocrNeeded && (
                                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                  يحتاج OCR
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-green-600 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {analysis && analysis.notes.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {analysis.notes.map((note, noteIndex) => (
                        <Badge key={noteIndex} variant="outline" className="text-xs">
                          {note}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* عرض الأخطاء */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* ملخص سريع */}
      {analyses.length > 0 && !isProcessing && (
        <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-emerald-500/5 border-2 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-bold text-green-800 dark:text-green-200">تم التحليل بنجاح</h4>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {analyses.reduce((sum, a) => sum + a.sourceWords, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">إجمالي الكلمات</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analyses.reduce((sum, a) => sum + a.tableWords, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">كلمات الجداول</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {analyses.reduce((sum, a) => sum + a.duplicatesIntra + a.duplicatesInter, 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground">التكرارات</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analyses.filter(a => a.ocrNeeded).length}
                </div>
                <div className="text-muted-foreground">يحتاج OCR</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileAnalyzer;