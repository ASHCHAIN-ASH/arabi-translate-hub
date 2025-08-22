import { useState, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface OCRPage {
  pageIndex: number;
  needsOCR: boolean;
  ocrConfidence: number;
  extractedText: string;
  processingTime: number;
}

export interface OCRResult {
  pages: OCRPage[];
  totalPages: number;
  averageConfidence: number;
  lowConfidencePages: number[];
  totalProcessingTime: number;
}

interface OCRProcessorProps {
  onOCRComplete: (result: OCRResult) => void;
  isProcessing: boolean;
  onProcessingChange: (processing: boolean) => void;
}

const OCRProcessor = ({ onOCRComplete, isProcessing, onProcessingChange }: OCRProcessorProps) => {
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    stage: string;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<OCRResult | null>(null);

  // إعداد Tesseract worker مع اللغتين العربية والإنجليزية
  const initializeWorker = useCallback(async () => {
    const worker = await createWorker(['ara', 'eng'], 1, {
      logger: (m: any) => {
        if (m.status === 'recognizing text') {
          setProgress(prev => prev ? {
            ...prev,
            stage: `التعرف على النص... ${Math.round(m.progress * 100)}%`
          } : null);
        }
      }
    });
    
    return worker;
  }, []);

  // تحسين جودة الصورة قبل معالجة OCR
  const preprocessImage = useCallback((canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // تحسين التباين والسطوع
    for (let i = 0; i < data.length; i += 4) {
      // تحويل إلى رمادي
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      
      // تطبيق threshold لتحسين وضوح النص
      const threshold = gray > 128 ? 255 : 0;
      
      data[i] = threshold;     // Red
      data[i + 1] = threshold; // Green  
      data[i + 2] = threshold; // Blue
      // Alpha channel remains unchanged
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }, []);

  // معالجة OCR للصور
  const processImageWithOCR = useCallback(async (
    imageFile: File, 
    pageIndex: number = 0
  ): Promise<OCRPage> => {
    const startTime = Date.now();
    
    try {
      // إنشاء canvas للصورة
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('فشل في إنشاء canvas context');

      // تحميل الصورة
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(imageFile);
      });

      // تحديد أبعاد Canvas
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // تحسين الصورة
      const preprocessedCanvas = preprocessImage(canvas);
      
      // تحويل إلى blob
      const preprocessedBlob = await new Promise<Blob>((resolve, reject) => {
        preprocessedCanvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('فشل في تحويل canvas إلى blob'));
        }, 'image/png');
      });

      // معالجة OCR
      const worker = await initializeWorker();
      
      setProgress({
        current: pageIndex,
        total: 1,
        stage: `معالجة الصفحة ${pageIndex + 1}...`,
        confidence: 0
      });

      const { data } = await worker.recognize(preprocessedBlob);
      
      await worker.terminate();
      
      const processingTime = Date.now() - startTime;
      const confidence = Math.round(data.confidence);

      setProgress(prev => prev ? {
        ...prev,
        confidence,
        stage: `تم الانتهاء - دقة: ${confidence}%`
      } : null);

      // تنظيف URLs
      URL.revokeObjectURL(img.src);

      return {
        pageIndex,
        needsOCR: true,
        ocrConfidence: confidence,
        extractedText: data.text || '',
        processingTime
      };

    } catch (error) {
      console.error(`خطأ في معالجة OCR للصفحة ${pageIndex}:`, error);
      return {
        pageIndex,
        needsOCR: true,
        ocrConfidence: 0,
        extractedText: '',
        processingTime: Date.now() - startTime
      };
    }
  }, [initializeWorker, preprocessImage]);

  // معالجة ملف PDF مع OCR
  const processPDFWithOCR = useCallback(async (pdfFile: File): Promise<OCRResult> => {
    try {
      // هذا مثال مبسط - في التطبيق الحقيقي ستحتاج مكتبة لتحويل PDF إلى صور
      console.log('معالجة PDF مع OCR:', pdfFile.name);
      
      // محاكاة معالجة PDF
      const mockPages: OCRPage[] = [
        {
          pageIndex: 0,
          needsOCR: true,
          ocrConfidence: 85,
          extractedText: 'نص تجريبي من الصفحة الأولى من PDF',
          processingTime: 2000
        }
      ];

      return {
        pages: mockPages,
        totalPages: 1,
        averageConfidence: 85,
        lowConfidencePages: [],
        totalProcessingTime: 2000
      };
    } catch (error) {
      console.error('خطأ في معالجة PDF:', error);
      throw error;
    }
  }, []);

  // معالجة ملفات متعددة
  const processFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setError("");
    onProcessingChange(true);

    try {
      const allPages: OCRPage[] = [];
      let totalProcessingTime = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.name.toLowerCase().split('.').pop();

        setProgress({
          current: i,
          total: files.length,
          stage: `معالجة ${file.name}...`,
          confidence: 0
        });

        if (fileType === 'pdf') {
          const pdfResult = await processPDFWithOCR(file);
          allPages.push(...pdfResult.pages);
          totalProcessingTime += pdfResult.totalProcessingTime;
        } else if (['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp'].includes(fileType || '')) {
          const pageResult = await processImageWithOCR(file, i);
          allPages.push(pageResult);
          totalProcessingTime += pageResult.processingTime;
        }
      }

      // حساب النتائج النهائية
      const totalPages = allPages.length;
      const averageConfidence = allPages.length > 0 
        ? Math.round(allPages.reduce((sum, page) => sum + page.ocrConfidence, 0) / allPages.length)
        : 0;
      
      const lowConfidencePages = allPages
        .filter(page => page.ocrConfidence < 70)
        .map(page => page.pageIndex);

      const finalResult: OCRResult = {
        pages: allPages,
        totalPages,
        averageConfidence,
        lowConfidencePages,
        totalProcessingTime
      };

      setResult(finalResult);
      onOCRComplete(finalResult);

    } catch (error) {
      console.error('خطأ في معالجة OCR:', error);
      setError(error instanceof Error ? error.message : 'حدث خطأ في معالجة OCR');
    } finally {
      onProcessingChange(false);
      setTimeout(() => setProgress(null), 2000);
    }
  }, [processImageWithOCR, processPDFWithOCR, onOCRComplete, onProcessingChange]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-right">
            <Eye className="h-5 w-5 text-primary" />
            معالج OCR المتقدم
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            عربي + انجليزي
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* شريط التقدم */}
        {progress && (
          <div className="space-y-3 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{progress.stage}</span>
              <span className="text-xs text-muted-foreground">
                {progress.current + 1} من {progress.total}
              </span>
            </div>
            <Progress 
              value={((progress.current + 1) / progress.total) * 100} 
              className="h-2"
            />
            {progress.confidence > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">دقة التعرف:</span>
                <Badge 
                  variant={progress.confidence >= 80 ? "default" : progress.confidence >= 60 ? "secondary" : "destructive"}
                  className="text-xs"
                >
                  {progress.confidence}%
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* رسائل الخطأ */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* نتائج OCR */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-medium">نتائج OCR</h3>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <div className="font-bold text-lg text-primary">{result.totalPages}</div>
                <div className="text-xs text-muted-foreground">صفحات معالجة</div>
              </div>
              <div className="text-center p-3 bg-accent/5 rounded-lg">
                <div className="font-bold text-lg text-accent">{result.averageConfidence}%</div>
                <div className="text-xs text-muted-foreground">متوسط الدقة</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-bold text-lg text-green-600">
                  {result.pages.reduce((sum, page) => sum + page.extractedText.split(/\s+/).length, 0)}
                </div>
                <div className="text-xs text-muted-foreground">كلمات مستخرجة</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="font-bold text-lg text-orange-600">{result.lowConfidencePages.length}</div>
                <div className="text-xs text-muted-foreground">صفحات منخفضة الدقة</div>
              </div>
            </div>

            {result.lowConfidencePages.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  تحتاج الصفحات التالية إلى مراجعة يدوية لضمان الدقة: {result.lowConfidencePages.join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OCRProcessor;
