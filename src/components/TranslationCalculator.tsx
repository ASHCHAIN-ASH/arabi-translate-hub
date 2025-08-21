import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calculator } from "lucide-react";
import WordCounter from "./WordCounter";
import FileUploader from "./FileUploader";
import PriceCalculator from "./PriceCalculator";
import { useWordCounter } from "@/hooks/useWordCounter";

interface TranslationCalculatorProps {
  translationType: string;
}

const TranslationCalculator = ({ translationType }: TranslationCalculatorProps) => {
  const [fromLang, setFromLang] = useState("");
  const [toLang, setToLang] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { text, fileContent, wordDetails, handleTextChange, handleFileContent, clearAll } = useWordCounter();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-primary">
              <Calculator className="h-8 w-8" />
              حاسبة تكلفة الترجمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {/* اختيار اللغات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-semibold">الترجمة من</Label>
                <Select value={fromLang} onValueChange={setFromLang}>
                  <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary">
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
              
              <div className="space-y-3">
                <Label className="text-base font-semibold">الترجمة إلى</Label>
                <Select value={toLang} onValueChange={setToLang}>
                  <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary">
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

            {/* إدخال النص */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">النص المراد ترجمته</Label>
              <Textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="اكتب النص هنا للحصول على حساب دقيق..."
                className="min-h-[150px] resize-none border-2 border-primary/20 focus:border-primary text-base leading-relaxed"
                disabled={isProcessing}
              />
            </div>

            {/* رفع الملفات */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">أو ارفع ملف</Label>
              <FileUploader
                onFileProcess={handleFileContent}
                isProcessing={isProcessing}
                onProcessingChange={setIsProcessing}
              />
            </div>

            {/* السرعة المطلوبة */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">سرعة التسليم</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger className="h-12 border-2 border-primary/20 focus:border-primary">
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

            {/* عرض إحصائيات الكلمات */}
            <WordCounter wordDetails={wordDetails} isProcessing={isProcessing} />

            {/* حاسبة السعر */}
            <PriceCalculator
              wordCount={wordDetails.total}
              translationType={translationType}
              urgency={urgency}
              fromLang={fromLang}
              toLang={toLang}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranslationCalculator;