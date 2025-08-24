import React, { useState, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useToast } from './ui/use-toast';
import { 
  FileText, 
  Image, 
  FileSpreadsheet, 
  Calculator,
  Upload,
  Eye,
  Download,
  Clock,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FileAnalysis {
  name: string;
  size: number;
  type: string;
  wordCount: number;
  characterCount: number;
  pageCount: number;
  extractedText: string;
}

interface PricingCalculation {
  basePrice: number;
  urgencyMultiplier: number;
  finalPrice: number;
  estimatedDelivery: string;
}

const TranslationPricingForm = () => {
  const [serviceType, setServiceType] = useState('translation');
  const [langPair, setLangPair] = useState('ar-en');
  const [urgency, setUrgency] = useState('normal');
  const [notes, setNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileAnalysis, setFileAnalysis] = useState<FileAnalysis | null>(null);
  const [pricing, setPricing] = useState<PricingCalculation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const serviceOptions = [
    { value: 'translation', label: 'ترجمة' },
    { value: 'proofreading', label: 'تدقيق لغوي' },
    { value: 'formatting', label: 'تنسيق أكاديمي' },
    { value: 'summarization', label: 'تلخيص' },
  ];

  const langPairOptions = [
    { value: 'ar-en', label: 'عربي → إنجليزي' },
    { value: 'en-ar', label: 'إنجليزي → عربي' },
    { value: 'ar-ar', label: 'عربي → عربي (تدقيق/تنسيق)' },
    { value: 'en-en', label: 'إنجليزي → إنجليزي (تدقيق/تنسيق)' },
  ];

  const urgencyOptions = [
    { value: 'normal', label: 'عادي', multiplier: 1 },
    { value: 'fast', label: 'سريع (+25%)', multiplier: 1.25 },
    { value: 'express', label: 'مستعجل (+50%)', multiplier: 1.5 },
  ];

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check if PDF.js is loaded
      if (typeof window !== 'undefined' && !(window as any).pdfjsLib) {
        reject(new Error('مكتبة PDF.js غير محملة. يرجى المحاولة مرة أخرى.'));
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = async function() {
        try {
          const typedarray = new Uint8Array(this.result as ArrayBuffer);
          const pdfjsLib = (window as any).pdfjsLib;
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const textItems = textContent.items.map((item: any) => item.str);
            fullText += textItems.join(' ') + '\n';
          }
          
          resolve(fullText);
        } catch (error) {
          reject(new Error('فشل في قراءة ملف PDF. تأكد من أن الملف سليم.'));
        }
      };
      fileReader.onerror = () => reject(new Error('فشل في قراءة الملف'));
      fileReader.readAsArrayBuffer(file);
    });
  };

  const extractTextFromImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check if Tesseract is loaded
      if (typeof window !== 'undefined' && !(window as any).Tesseract) {
        reject(new Error('مكتبة Tesseract غير محملة. يرجى المحاولة مرة أخرى.'));
        return;
      }

      const Tesseract = (window as any).Tesseract;
      Tesseract.recognize(file, 'ara+eng', {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProcessingProgress(Math.round(m.progress * 100));
          }
        }
      }).then(({ data: { text } }: any) => {
        resolve(text);
      }).catch(() => {
        reject(new Error('فشل في قراءة النص من الصورة. تأكد من وضوح النص في الصورة.'));
      });
    });
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check if Mammoth is loaded
      if (typeof window !== 'undefined' && !(window as any).mammoth) {
        reject(new Error('مكتبة Mammoth غير محملة. يرجى المحاولة مرة أخرى.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const mammoth = (window as any).mammoth;
        mammoth.extractRawText({ arrayBuffer })
          .then((result: any) => resolve(result.value))
          .catch(() => reject(new Error('فشل في قراءة ملف Word. تأكد من أن الملف سليم.')));
      };
      reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
      reader.readAsArrayBuffer(file);
    });
  };

  const analyzeFile = async (file: File): Promise<FileAnalysis> => {
    let extractedText = '';
    
    try {
      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type.startsWith('image/')) {
        extractedText = await extractTextFromImage(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        extractedText = await extractTextFromDOCX(file);
      } else if (file.type === 'text/plain') {
        extractedText = await file.text();
      } else {
        // Fallback for unsupported file types
        throw new Error(`نوع الملف غير مدعوم: ${file.type}. يرجى استخدام ملفات PDF أو DOCX أو TXT أو صور.`);
      }
    } catch (error) {
      // If library extraction fails, provide a fallback message
      console.error('File processing error:', error);
      throw error;
    }

    // Ensure we have some text to work with
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('لم يتم العثور على نص في الملف. تأكد من أن الملف يحتوي على نص قابل للقراءة.');
    }

    const wordCount = extractedText.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = extractedText.length;
    const pageCount = Math.ceil(wordCount / 250); // تقدير عدد الصفحات

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      wordCount,
      characterCount,
      pageCount,
      extractedText
    };
  };

  const calculatePricing = (analysis: FileAnalysis): PricingCalculation => {
    const baseRates = {
      translation: 0.05, // 5 قروش لكل كلمة
      proofreading: 0.02, // 2 قروش لكل كلمة
      formatting: 0.01, // 1 قرش لكل كلمة
      summarization: 0.03, // 3 قروش لكل كلمة
    };

    const basePrice = analysis.wordCount * baseRates[serviceType as keyof typeof baseRates];
    const urgencyMultiplier = urgencyOptions.find(opt => opt.value === urgency)?.multiplier || 1;
    const finalPrice = basePrice * urgencyMultiplier;

    const deliveryDays = {
      normal: Math.ceil(analysis.wordCount / 1000) + 1,
      fast: Math.ceil(analysis.wordCount / 1500) + 1,
      express: Math.ceil(analysis.wordCount / 2000) + 1,
    };

    const estimatedDelivery = `${deliveryDays[urgency as keyof typeof deliveryDays]} أيام`;

    return {
      basePrice,
      urgencyMultiplier,
      finalPrice,
      estimatedDelivery
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // التحقق من حجم الملف (25MB)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "الملف كبير جداً",
        description: "يجب أن يكون حجم الملف أقل من 25 ميجابايت",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const analysis = await analyzeFile(file);
      const pricingCalc = calculatePricing(analysis);
      
      setFileAnalysis(analysis);
      setPricing(pricingCalc);
      
      toast({
        title: "تم تحليل الملف بنجاح",
        description: `تم استخراج ${analysis.wordCount} كلمة من الملف`,
      });
    } catch (error) {
      toast({
        title: "خطأ في تحليل الملف",
        description: "تعذر معالجة الملف. تأكد من صحة تنسيق الملف.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleSubmit = () => {
    if (!fileAnalysis) {
      toast({
        title: "يرجى رفع ملف",
        description: "يجب رفع ملف للحصول على تسعير دقيق",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "تم إرسال الطلب",
      description: "سيتم التواصل معك قريباً لتأكيد التفاصيل",
    });
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (fileType === 'application/pdf') return <FileText className="h-6 w-6" />;
    if (fileType.includes('spreadsheet')) return <FileSpreadsheet className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-soft border-0 bg-gradient-card">
          <CardContent className="p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-arabic-title font-bold mb-4">
                تسعير فوري وطلب خدمة الترجمة ✍️
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  يدعم PDF و DOCX و TXT و الصور
                </Badge>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  قراءة نص PDF مباشرةً
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">
                  OCR تلقائي للمسح الضوئي (AR/EN)
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label className="font-bold">نوع الخدمة</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">اللغة المصدر → الهدف</Label>
                <Select value={langPair} onValueChange={setLangPair}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {langPairOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">سرعة التنفيذ</Label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <Label className="font-bold">رفع الملف</Label>
                <div className="relative">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.tiff,.bmp"
                    onChange={handleFileUpload}
                    className="file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-3 file:py-1 bg-muted/50"
                  />
                  {uploadedFile && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      {getFileIcon(uploadedFile.type)}
                      <span>{uploadedFile.name}</span>
                      <span>({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  الحد الأقصى 25MB — يدعم PDF, DOCX, TXT, والصور
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="font-bold">ملاحظات إضافية</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="اذكر أي طلبات خاصة بالتنسيق، الأسلوب، المراجع، إلخ."
                  className="min-h-[100px] bg-muted/50"
                />
              </div>
            </div>

            {isProcessing && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="h-4 w-4 animate-pulse" />
                  <span className="text-sm">جاري معالجة الملف...</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>
            )}

            {fileAnalysis && pricing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border/50"
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  تحليل الملف والتسعير
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-background/50 rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">عدد الكلمات</div>
                    <div className="text-xl font-bold text-primary">{fileAnalysis.wordCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">عدد الأحرف</div>
                    <div className="text-xl font-bold text-accent">{fileAnalysis.characterCount.toLocaleString()}</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">الصفحات المقدرة</div>
                    <div className="text-xl font-bold text-green-600">{fileAnalysis.pageCount}</div>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">وقت التسليم</div>
                    <div className="text-lg font-bold text-orange-600 flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4" />
                      {pricing.estimatedDelivery}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">التكلفة الإجمالية</div>
                      <div className="text-2xl font-bold text-primary flex items-center gap-1">
                        <DollarSign className="h-6 w-6" />
                        {pricing.finalPrice.toFixed(2)} ج.م
                      </div>
                      {pricing.urgencyMultiplier > 1 && (
                        <div className="text-xs text-muted-foreground">
                          السعر الأساسي: {pricing.basePrice.toFixed(2)} ج.م × {pricing.urgencyMultiplier}
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={handleSubmit}
                      className="bg-gradient-primary text-primary-foreground"
                    >
                      اطلب الخدمة الآن
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {!fileAnalysis && (
              <div className="flex justify-center">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-dashed border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
                >
                  <Upload className="h-5 w-5 ml-2" />
                  ارفع ملفك للحصول على تسعير فوري
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default TranslationPricingForm;