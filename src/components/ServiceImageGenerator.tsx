import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { RunwareService, GenerateImageParams } from "@/services/runware";
import { Download, Loader2, Wand2 } from "lucide-react";

interface ServiceImageGeneratorProps {
  onImagesGenerated?: (images: string[]) => void;
}

const ServiceImageGenerator = ({ onImagesGenerated }: ServiceImageGeneratorProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [currentService, setCurrentService] = useState("");

  const servicePrompts = [
    {
      name: "ترجمة النصوص",
      prompt: "Professional translation office, modern workspace with translators working on documents, multiple language dictionaries, computer screens showing different languages, Arabic and English texts visible, professional lighting, realistic photography style, ultra high resolution"
    },
    {
      name: "ترجمة المستندات", 
      prompt: "Modern office setting with professional document translation, business people reviewing translated official documents, PDF files on computer screens, professional translators with certificates on wall, clean modern office interior, realistic photography, ultra high resolution"
    },
    {
      name: "الترجمة الصوتية",
      prompt: "Professional audio translation studio, person wearing headphones speaking into microphone, sound waves visualization on computer screen, multiple language flags, modern recording equipment, professional audio booth, realistic photography style, ultra high resolution"
    },
    {
      name: "ترجمة المواقع",
      prompt: "Web developer translating website, multiple computer screens showing websites in different languages, modern tech office, responsive design layouts, Arabic and English website interfaces, professional web development workspace, realistic photography, ultra high resolution"
    },
    {
      name: "ترجمة الفيديو",
      prompt: "Video translation and subtitling studio, professional video editor working on subtitle translation, multiple monitors showing video content with subtitles, professional video editing setup, film production environment, realistic photography style, ultra high resolution"
    },
    {
      name: "خدمات مخصصة",
      prompt: "Corporate boardroom meeting with international business team, professional consultation for custom translation services, diverse group of business professionals, modern conference room, translation contracts and documents on table, realistic photography, ultra high resolution"
    }
  ];

  const generateServiceImages = async () => {
    if (!apiKey.trim()) {
      toast.error("الرجاء إدخال مفتاح API أولاً");
      return;
    }

    setIsGenerating(true);
    const runware = new RunwareService(apiKey);
    const newImages: string[] = [];

    try {
      for (const service of servicePrompts) {
        setCurrentService(service.name);
        
        const params: GenerateImageParams = {
          positivePrompt: service.prompt,
          model: "runware:100@1",
          width: 1024,
          height: 768,
          numberResults: 1,
          outputFormat: "WEBP",
          CFGScale: 7,
          scheduler: "FlowMatchEulerDiscreteScheduler",
          strength: 0.8
        };

        const result = await runware.generateImage(params);
        newImages.push(result.imageURL);
        
        toast.success(`تم توليد صورة ${service.name}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // تأخير بسيط
      }

      setGeneratedImages(newImages);
      onImagesGenerated?.(newImages);
      toast.success("تم توليد جميع الصور بنجاح!");
      
    } catch (error) {
      console.error("Error generating images:", error);
      toast.error("حدث خطأ في توليد الصور: " + (error as Error).message);
    } finally {
      setIsGenerating(false);
      setCurrentService("");
    }
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `service-${index + 1}.webp`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("تم تحميل الصورة!");
    } catch (error) {
      toast.error("فشل في تحميل الصورة");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          مولد صور الخدمات الاحترافية
        </CardTitle>
        <p className="text-muted-foreground">
          أدخل مفتاح Runware API لتوليد صور احترافية لجميع الخدمات
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">مفتاح Runware API</label>
          <Input
            type="password"
            placeholder="أدخل مفتاح API من runware.ai"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="text-left"
          />
          <p className="text-xs text-muted-foreground">
            احصل على مفتاح API من{" "}
            <a href="https://runware.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              runware.ai
            </a>
          </p>
        </div>

        <Button 
          onClick={generateServiceImages}
          disabled={isGenerating || !apiKey.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
              توليد الصور... ({currentService})
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 ml-2" />
              توليد صور جميع الخدمات (6 صور)
            </>
          )}
        </Button>

        {generatedImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الصور المُولدة:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Service ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => downloadImage(imageUrl, index)}
                      >
                        <Download className="h-4 w-4 ml-1" />
                        تحميل
                      </Button>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {servicePrompts[index]?.name}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceImageGenerator;