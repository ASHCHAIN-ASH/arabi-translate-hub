import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// @ts-ignore
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// تحديد مسار Worker لـ PDF.js - حل جذري للخطأ
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// تسجيل للتأكد من التكوين
console.log('PDF.js Worker configured:', pdfjsLib.GlobalWorkerOptions.workerSrc);
console.log('PDF.js version:', pdfjsLib.version);

interface FileUploaderProps {
  onFileProcess: (content: string, fileName: string) => void;
  isProcessing: boolean;
  onProcessingChange: (processing: boolean) => void;
}

interface ProcessingProgress {
  current: number;
  total: number;
  message: string;
}

const FileUploader = ({ onFileProcess, isProcessing, onProcessingChange }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [progress, setProgress] = useState<ProcessingProgress | null>(null);

  const countWords = useCallback((text: string): number => {
    if (!text || text.trim().length === 0) return 0;
    
    // تنظيف النص وإزالة المسافات الزائدة
    const cleanText = text.trim().replace(/\s+/g, ' ');
    
    // حساب الكلمات بطريقة محسنة
    const words = cleanText.split(/\s+/).filter(word => {
      // تجاهل الكلمات الفارغة والرموز المفردة
      return word.length > 0 && word.trim().length > 0;
    });
    
    return words.length;
  }, []);

  const extractTextFromFile = useCallback(async (file: File): Promise<string> => {
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target?.result;
          let extractedText = "";
          
          if (fileExtension === '.txt' || file.type === 'text/plain') {
            // معالجة الملفات النصية
            extractedText = content as string;
            
          } else if (fileExtension === '.pdf') {
            // معالجة ملفات PDF مع تحسينات الأداء
            const arrayBuffer = content as ArrayBuffer;
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            
            // تعيين مهلة زمنية للمعالجة
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error("انتهت مهلة معالجة PDF. الملف كبير جداً أو معقد.")), 30000);
            });
            
            const pdf = await Promise.race([loadingTask.promise, timeoutPromise]) as any;
            const maxPages = Math.min(pdf.numPages, 10); // معالجة أقصى 10 صفحات
            let allText = "";
            
            for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
              setProgress({ 
                current: Math.round((pageNum / maxPages) * 100), 
                total: 100, 
                message: `معالجة صفحة ${pageNum} من ${maxPages}...` 
              });
              
              try {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                  .map((item: any) => item.str)
                  .join(' ');
                
                allText += pageText + '\n';
                
                // تنظيف الذاكرة
                if (page.cleanup) page.cleanup();
                
                // السماح للواجهة بالتحديث
                await new Promise(resolve => setTimeout(resolve, 10));
              } catch (pageError) {
                console.warn(`خطأ في معالجة الصفحة ${pageNum}:`, pageError);
                continue;
              }
            }
            
            // تنظيف موارد PDF
            if (pdf.destroy) pdf.destroy();
            
            if (maxPages < pdf.numPages) {
              console.log(`تم معالجة ${maxPages} صفحة من أصل ${pdf.numPages} صفحة لتحسين الأداء`);
            }
            
            extractedText = allText;
            
          } else if (fileExtension === '.docx') {
            // معالجة ملفات Word الحديثة
            const arrayBuffer = content as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            extractedText = result.value;
            
          } else if (fileExtension === '.doc') {
            // ملفات Word القديمة - محاولة قراءة النص الخام
            try {
              const result = await mammoth.extractRawText({ arrayBuffer: content as ArrayBuffer });
              extractedText = result.value;
            } catch {
              // في حالة فشل mammoth مع ملفات .doc القديمة
              throw new Error("ملفات .doc القديمة غير مدعومة بالكامل. يرجى تحويل الملف إلى .docx أو .txt");
            }
          }
          
          if (!extractedText || extractedText.trim().length === 0) {
            reject(new Error("الملف فارغ أو لا يحتوي على نص قابل للقراءة"));
            return;
          }
          
          // تنظيف المحتوى
          const cleanContent = extractedText
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\t/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          resolve(cleanContent);
          
        } catch (error) {
          console.error("خطأ في استخراج النص:", error);
          reject(new Error("خطأ في قراءة محتوى الملف: " + (error instanceof Error ? error.message : "خطأ غير معروف")));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("خطأ في قراءة الملف"));
      };
      
      // اختيار طريقة القراءة المناسبة حسب نوع الملف
      if (fileExtension === '.txt' || file.type === 'text/plain') {
        reader.readAsText(file, 'UTF-8');
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    setError("");
    setFile(selectedFile);
    onProcessingChange(true);
    
    try {
      // التحقق من نوع الملف
      const allowedTypes = [
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf'
      ];
      
      const allowedExtensions = ['.txt', '.doc', '.docx', '.pdf'];
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
        throw new Error("نوع الملف غير مدعوم. يرجى رفع ملفات: TXT, DOC, DOCX, PDF");
      }
      
      // التحقق من حجم الملف (حد أقصى 1000 ميجا)
      if (selectedFile.size > 1000 * 1024 * 1024) {
        throw new Error("حجم الملف كبير جداً. الحد الأقصى 1000 ميجابايت");
      }
      
      // استخراج النص من جميع أنواع الملفات
      const content = await extractTextFromFile(selectedFile);
      onFileProcess(content, selectedFile.name);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطأ غير معروف";
      setError(errorMessage);
      console.error("خطأ في معالجة الملف:", error);
    } finally {
      setProgress(null);
      onProcessingChange(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError("");
    setProgress(null);
    onFileProcess("", "");
    
    // إعادة تعيين input
    const input = document.getElementById("file-upload") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept=".txt,.doc,.docx,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isProcessing}
          />
          <Label
            htmlFor="file-upload"
            className={`inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 rounded-xl cursor-pointer transition-all duration-200 border-2 border-dashed border-primary/30 hover:border-primary/50 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
          >
            <Upload className="h-5 w-5 text-primary" />
            <span className="font-medium">
              {progress ? progress.message : isProcessing ? "جاري المعالجة..." : "رفع ملف للترجمة"}
            </span>
            <Badge variant="outline" className="text-xs">
              TXT, DOC, DOCX, PDF
            </Badge>
          </Label>
        </div>
      </div>
      
      {/* مؤشر التقدم */}
      {progress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{progress.message}</span>
            <span>{progress.current}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.current}%` }}
            />
          </div>
        </div>
      )}
      
      {/* عرض الملف المرفوع */}
      {file && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">{file.name}</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-green-600 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* عرض الأخطاء */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* معلومات مفيدة */}
      <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/30 rounded-lg">
        <p>• ملفات TXT و DOCX و DOC يتم حساب كلماتها بدقة كاملة</p>
        <p>• ملفات PDF يتم معالجة أول 10 صفحات لتحسين الأداء</p>
        <p>• الحد الأقصى لحجم الملف: 1000 ميجابايت</p>
      </div>
    </div>
  );
};

export default FileUploader;