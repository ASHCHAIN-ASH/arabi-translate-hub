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

interface FileUploaderProps {
  onFileProcess: (content: string, fileName: string) => void;
  isProcessing: boolean;
  onProcessingChange: (processing: boolean) => void;
}

const FileUploader = ({ onFileProcess, isProcessing, onProcessingChange }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

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
            // معالجة ملفات PDF باستخدام PDF.js
            const arrayBuffer = content as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // استخدام إصدار متوافق مع المكتبة المثبتة
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.js';
            
            const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
            let fullText = "";
            
            // استخراج النص من كل صفحة
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
              fullText += pageText + ' ';
            }
            
            extractedText = fullText;
            
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
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      const allowedExtensions = ['.txt', '.doc', '.docx', '.pdf'];
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
        throw new Error("نوع الملف غير مدعوم. يرجى رفع ملفات: TXT, DOC, DOCX, PDF");
      }
      
      // التحقق من حجم الملف (حد أقصى 50 ميجا)
      if (selectedFile.size > 50 * 1024 * 1024) {
        throw new Error("حجم الملف كبير جداً. الحد الأقصى 50 ميجابايت");
      }
      
      // استخراج النص من جميع أنواع الملفات
      const content = await extractTextFromFile(selectedFile);
      onFileProcess(content, selectedFile.name);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "خطأ غير معروف";
      setError(errorMessage);
      console.error("خطأ في معالجة الملف:", error);
    } finally {
      onProcessingChange(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError("");
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
              {isProcessing ? "جاري المعالجة..." : "رفع ملف للترجمة"}
            </span>
            <Badge variant="outline" className="text-xs">
              TXT, DOC, DOCX, PDF
            </Badge>
          </Label>
        </div>
      </div>
      
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
        <p>• جميع أنواع الملفات يتم حساب كلماتها بدقة كاملة</p>
        <p>• يتم استخراج النص الفعلي من PDF و Word للحساب الدقيق</p>
        <p>• الحد الأقصى لحجم الملف: 50 ميجابايت</p>
      </div>
    </div>
  );
};

export default FileUploader;