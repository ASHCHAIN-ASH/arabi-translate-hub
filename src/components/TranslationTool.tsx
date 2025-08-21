import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeftRight, Copy, Volume2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TranslationTool = () => {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("ar");
  const [targetLang, setTargetLang] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast({
        title: "تنبيه",
        description: "يرجى إدخال النص المراد ترجمته",
        variant: "destructive"
      });
      return;
    }

    setIsTranslating(true);
    
    // محاكاة ترجمة (في الإصدار الفعلي ستحتاج لدمج API ترجمة)
    setTimeout(() => {
      setTranslatedText("هذا نص مترجم تجريبي. في الإصدار الفعلي سيتم دمج خدمة ترجمة احترافية مثل Google Translate أو DeepL.");
      setIsTranslating(false);
      toast({
        title: "تمت الترجمة بنجاح",
        description: "تم ترجمة النص بنجاح",
      });
    }, 2000);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ النص إلى الحافظة",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-gradient-card border-0 shadow-medium hover-lift">
        <div className="p-6 space-y-6">
          {/* اختيار اللغات */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">من</label>
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={swapLanguages}
              className="mt-6 hover:bg-primary/10 transition-colors"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">إلى</label>
              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* مناطق النص */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">النص المراد ترجمته</label>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="اكتب أو الصق النص هنا..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="text-xs text-muted-foreground text-left">
                {sourceText.length} حرف
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">الترجمة</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(translatedText)}
                  disabled={!translatedText}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder="ستظهر الترجمة هنا..."
                value={translatedText}
                readOnly
                className="min-h-[200px] resize-none bg-muted/30"
              />
              <div className="text-xs text-muted-foreground text-left">
                {translatedText.length} حرف
              </div>
            </div>
          </div>

          {/* زر الترجمة */}
          <div className="flex justify-center">
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText.trim()}
              className="bg-gradient-primary text-primary-foreground px-8 py-2 shadow-medium hover:shadow-strong transition-all duration-300"
            >
              {isTranslating ? "جار الترجمة..." : "ترجم الآن"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TranslationTool;