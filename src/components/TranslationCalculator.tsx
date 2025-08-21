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

  const countWords = useCallback((content: string) => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
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
    const count = countWords(value);
    setWordCount(count);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // محاكاة قراءة محتوى الملف
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const count = countWords(content);
        setWordCount(count);
      };
      reader.readAsText(selectedFile);
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
            />
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label
                  htmlFor="file-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-md cursor-pointer transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  رفع ملف
                </Label>
              </div>
              
              {file && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{file.name}</span>
                </div>
              )}
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{wordCount.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">كلمة</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-emerald">${price.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">السعر الإجمالي</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  <Clock className="h-5 w-5 inline ml-1" />
                  {deliveryTime}
                </div>
                <div className="text-sm text-muted-foreground">مدة التسليم</div>
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