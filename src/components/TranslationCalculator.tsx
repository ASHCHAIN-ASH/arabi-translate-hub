import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Calculator, Clock, DollarSign } from "lucide-react";

interface TranslationCalculatorProps {
  translationType: string;
}

const TranslationCalculator = ({ translationType }: TranslationCalculatorProps) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fromLang, setFromLang] = useState("");
  const [toLang, setToLang] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [wordCount, setWordCount] = useState(0);
  const [price, setPrice] = useState(0);
  const [fileContent, setFileContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [wordDetails, setWordDetails] = useState({
    arabic: 0,
    english: 0,
    numbers: 0,
    others: 0
  });

  const languages = [
    { code: "ar", name: "العربية" },
    { code: "en", name: "الإنجليزية" },
    { code: "fr", name: "الفرنسية" },
    { code: "de", name: "الألمانية" },
    { code: "es", name: "الإسبانية" },
    { code: "it", name: "الإيطالية" },
    { code: "ru", name: "الروسية" },
    { code: "zh", name: "الصينية" },
    { code: "ja", name: "اليابانية" },
    { code: "ko", name: "الكورية" }
  ];

  const urgencyOptions = [
    { value: "normal", label: "عادي (3-5 أيام)", multiplier: 1 },
    { value: "urgent", label: "عاجل (24-48 ساعة)", multiplier: 1.5 },
    { value: "express", label: "فوري (12-24 ساعة)", multiplier: 2 }
  ];

  const basePrice = {
    "legal": 0.12,
    "medical": 0.15,
    "technical": 0.13,
    "business": 0.10,
    "academic": 0.11,
    "literary": 0.14,
    "media": 0.09,
    "live": 0.20
  };

  const countWordsDetailed = useCallback((content: string) => {
    if (!content || content.trim().length === 0) {
      return { total: 0, arabic: 0, english: 0, numbers: 0, others: 0 };
    }
    
    // إزالة المسافات الإضافية والأسطر الفارغة
    const cleanContent = content.trim().replace(/\s+/g, ' ');
    
    // حساب الكلمات العربية والإنجليزية
    const arabicWords = (cleanContent.match(/[\u0600-\u06FF]+/g) || []).length;
    const englishWords = (cleanContent.match(/[a-zA-Z]+/g) || []).length;
    const numberWords = (cleanContent.match(/\d+/g) || []).length;
    
    // الكلمات الأخرى (رموز، علامات ترقيم معقدة)
    const otherWords = cleanContent.split(/\s+/).filter(word => {
      return word.length > 0 && 
             !word.match(/[\u0600-\u06FF]/) && 
             !word.match(/[a-zA-Z]/) && 
             !word.match(/^\d+$/);
    }).length;
    
    const total = arabicWords + englishWords + numberWords + otherWords;
    
    return {
      total,
      arabic: arabicWords,
      english: englishWords,
      numbers: numberWords,
      others: otherWords
    };
  }, []);

  const calculatePrice = useCallback(() => {
    if (wordCount === 0) return;
    
    const typeKey = translationType.split('-')[0] as keyof typeof basePrice;
    const pricePerWord = basePrice[typeKey] || 0.10;
    const urgencyMultiplier = urgencyOptions.find(opt => opt.value === urgency)?.multiplier || 1;
    
    const totalPrice = wordCount * pricePerWord * urgencyMultiplier;
    setPrice(totalPrice);
  }, [wordCount, translationType, urgency]);

  const handleTextChange = (value: string) => {
    setText(value);
    const details = countWordsDetailed(value);
    setWordCount(details.total);
    setWordDetails({
      arabic: details.arabic,
      english: details.english,
      numbers: details.numbers,
      others: details.others
    });
    setFileContent(value);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsProcessing(true);
    
    try {
      let content = "";
      
      // تحديد نوع الملف ومعالجته
      if (selectedFile.type === "text/plain") {
        content = await selectedFile.text();
      } else if (selectedFile.type === "application/pdf") {
        // محاكاة قراءة PDF - في التطبيق الحقيقي نحتاج مكتبة PDF.js
        content = "هذا مثال على محتوى PDF. عدد الكلمات المقدر: " + Math.floor(selectedFile.size / 6) + " كلمة تقريباً.";
      } else if (selectedFile.type.includes("word") || selectedFile.name.endsWith('.docx') || selectedFile.name.endsWith('.doc')) {
        // محاكاة قراءة Word - في التطبيق الحقيقي نحتاج مكتبة mammoth.js
        content = "هذا مثال على محتوى Word. عدد الكلمات المقدر: " + Math.floor(selectedFile.size / 8) + " كلمة تقريباً.";
      } else {
        // محاولة قراءة كنص عادي
        content = await selectedFile.text();
      }
      
      setFileContent(content);
      const details = countWordsDetailed(content);
      setWordCount(details.total);
      setWordDetails({
        arabic: details.arabic,
        english: details.english,
        numbers: details.numbers,
        others: details.others
      });
      setText(""); // مسح النص المكتوب يدوياً
      
    } catch (error) {
      console.error("خطأ في قراءة الملف:", error);
      // تقدير تقريبي بناء على حجم الملف
      const estimatedWords = Math.floor(selectedFile.size / 6);
      setWordCount(estimatedWords);
      setWordDetails({ arabic: 0, english: estimatedWords, numbers: 0, others: 0 });
      setFileContent(`تقدير تقريبي: ${estimatedWords} كلمة بناء على حجم الملف`);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const deliveryTime = urgencyOptions.find(opt => opt.value === urgency)?.label.split('(')[1].split(')')[0];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-arabic-title">
            <Calculator className="h-6 w-6 text-primary" />
            حاسبة تكلفة الترجمة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* اختيار اللغات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الترجمة من</Label>
              <Select value={fromLang} onValueChange={setFromLang}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللغة المصدر" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>الترجمة إلى</Label>
              <Select value={toLang} onValueChange={setToLang}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللغة المطلوبة" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* إدخال النص أو رفع ملف */}
          <div className="space-y-4">
            <Label>النص المراد ترجمته</Label>
            <Textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="اكتب النص هنا أو ارفع ملف..."
              className="min-h-[120px] resize-none"
              disabled={isProcessing}
            />
            
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
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md cursor-pointer transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="h-4 w-4" />
                  {isProcessing ? "جاري المعالجة..." : "رفع ملف"}
                </Label>
              </div>
              
              {file && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{file.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {(file.size / 1024).toFixed(1)} KB
                  </Badge>
                </div>
              )}
            </div>
            
            {/* عرض محتوى الملف */}
            {fileContent && (
              <div className="p-3 bg-muted/30 rounded-md">
                <p className="text-sm text-muted-foreground mb-2">معاينة المحتوى:</p>
                <p className="text-sm max-h-20 overflow-y-auto">
                  {fileContent.substring(0, 200)}
                  {fileContent.length > 200 && "..."}
                </p>
              </div>
            )}
          </div>

          {/* السرعة المطلوبة */}
          <div className="space-y-2">
            <Label>سرعة التسليم</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {urgencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* النتائج */}
          {wordCount > 0 && (
            <div className="space-y-4">
              {/* إحصائيات مفصلة */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{wordDetails.arabic}</div>
                  <div className="text-xs text-muted-foreground">كلمات عربية</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-accent">{wordDetails.english}</div>
                  <div className="text-xs text-muted-foreground">كلمات إنجليزية</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-accent-emerald">{wordDetails.numbers}</div>
                  <div className="text-xs text-muted-foreground">أرقام</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-muted-foreground">{wordDetails.others}</div>
                  <div className="text-xs text-muted-foreground">رموز أخرى</div>
                </div>
              </div>
              
              {/* الإجمالي والسعر */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-card rounded-lg border">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{wordCount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground font-medium">إجمالي الكلمات</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-emerald">${price.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground font-medium">السعر الإجمالي</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent flex items-center justify-center">
                    <Clock className="h-5 w-5 ml-1" />
                    {deliveryTime}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">مدة التسليم</div>
                </div>
              </div>
              
              {/* تفاصيل الحساب */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-sm mb-2 text-blue-800 dark:text-blue-200">تفاصيل الحساب:</h4>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <div>• السعر الأساسي: ${(basePrice[translationType.split('-')[0] as keyof typeof basePrice] || 0.10).toFixed(3)} لكل كلمة</div>
                  <div>• معامل السرعة: {urgencyOptions.find(opt => opt.value === urgency)?.multiplier}x</div>
                  <div>• الحساب: {wordCount} كلمة × ${(basePrice[translationType.split('-')[0] as keyof typeof basePrice] || 0.10).toFixed(3)} × {urgencyOptions.find(opt => opt.value === urgency)?.multiplier} = ${price.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-medium"
              disabled={!fromLang || !toLang || wordCount === 0}
            >
              <DollarSign className="h-4 w-4 ml-2" />
              طلب عرض سعر
            </Button>
            
            <Button 
              variant="outline"
              className="flex-1"
              disabled={!fromLang || !toLang || wordCount === 0}
            >
              بدء الترجمة الآن
            </Button>
          </div>

          {/* معلومات إضافية */}
          <div className="text-center space-y-2">
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">ترجمة معتمدة</Badge>
              <Badge variant="secondary">مراجعة مجانية</Badge>
              <Badge variant="secondary">سرية تامة</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              السعر تقديري وقد يختلف حسب التعقيد والمجال التخصصي
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationCalculator;