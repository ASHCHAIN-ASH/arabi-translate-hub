import { useState } from "react";
import { Sparkles, Loader2, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/data/legacy/client";
import { buildReferralLink, copyToClipboard } from "@/utils/referralLink";

interface AICopyGeneratorProps {
  refCode: string | null | undefined;
  /** Default service type to preselect (optional). */
  defaultServiceType?: string;
  /** Compact button (icon-friendly) for inline placement. */
  variant?: "default" | "inline";
}

const SERVICE_OPTIONS = [
  { value: "ترجمة معتمدة", label: "ترجمة معتمدة" },
  { value: "ترجمة أكاديمية", label: "ترجمة أكاديمية" },
  { value: "أبحاث ورسائل علمية", label: "أبحاث ورسائل علمية" },
  { value: "تدقيق لغوي", label: "تدقيق لغوي" },
  { value: "تنسيق رسائل", label: "تنسيق رسائل" },
  { value: "نشر علمي", label: "نشر علمي" },
  { value: "خدمة عامة", label: "خدمة عامة" },
];

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "إنستغرام" },
  { value: "story", label: "ستوري" },
  { value: "twitter", label: "تويتر / X" },
  { value: "whatsapp", label: "واتساب" },
  { value: "brochure", label: "بروشور" },
];

const TONE_OPTIONS = [
  { value: "حماسي ومحفّز", label: "حماسي" },
  { value: "احترافي ورسمي", label: "احترافي" },
  { value: "ودّي وقريب", label: "ودّي" },
  { value: "فاخر وراقٍ", label: "فاخر" },
];

export default function AICopyGenerator({
  refCode,
  defaultServiceType,
  variant = "default",
}: AICopyGeneratorProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [serviceType, setServiceType] = useState(
    defaultServiceType || SERVICE_OPTIONS[0].value,
  );
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState(TONE_OPTIONS[0].value);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const refLink = buildReferralLink(refCode);

  const generate = async () => {
    if (!refCode) {
      toast({
        title: "سجّل دخولك أولاً",
        description: "نحتاج رابط إحالتك لإدراجه في النص.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-marketing-copy",
        {
          body: {
            service_type: serviceType,
            platform,
            ref_link: refLink,
            tone,
            variants: 2,
          },
        },
      );
      if (error) throw error;
      const list: string[] = Array.isArray(data?.variants)
        ? data.variants
        : data?.text
          ? [data.text]
          : [];
      if (!list.length) throw new Error("لم يتم توليد نص");
      setVariants(list);
    } catch (e: any) {
      const msg =
        e?.message?.includes("429")
          ? "تم تجاوز حد الطلبات، حاول بعد قليل."
          : e?.message?.includes("402")
            ? "نفد رصيد AI. يرجى التعبئة."
            : e?.message || "تعذّر توليد النص";
      toast({ title: "خطأ", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedIndex(index);
      toast({ title: "تم النسخ ✨", description: "النص جاهز للنشر." });
      setTimeout(() => setCopiedIndex(null), 1800);
    } else {
      toast({ title: "فشل النسخ", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size={variant === "inline" ? "sm" : "default"}
          className="gap-2 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white hover:opacity-90"
        >
          <Sparkles className="w-4 h-4" />
          {variant === "inline" ? "اكتب لي" : "✨ اكتب لي نص تسويقي"}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-xl max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-fuchsia-500" />
            مولّد النصوص التسويقية بالذكاء الاصطناعي
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">نوع الخدمة</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">المنصة</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">النبرة</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التوليد...
              </>
            ) : variants.length ? (
              <>
                <RefreshCw className="w-4 h-4" />
                توليد نصوص جديدة
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                توليد النص
              </>
            )}
          </Button>

          {variants.length > 0 && (
            <div className="space-y-3">
              {variants.map((v, i) => (
                <Card key={i} className="p-3 space-y-2 border-fuchsia-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      نسخة {i + 1}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(v, i)}
                      className="h-7 gap-1.5"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-600" />
                          نُسخ
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          نسخ
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={v}
                    readOnly
                    className="min-h-[140px] text-sm leading-relaxed resize-none bg-muted/30"
                    dir="rtl"
                  />
                </Card>
              ))}
            </div>
          )}

          {!refCode && (
            <p className="text-xs text-amber-600 text-center">
              ⚠️ سجّل الدخول لإدراج رابط إحالتك تلقائياً في النصوص.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
