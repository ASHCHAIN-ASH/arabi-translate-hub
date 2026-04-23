import { Button } from "@/components/ui/button";
import { Send, Twitter, Download, Image as ImageIcon } from "lucide-react";
import {
  ShareLinks,
  openShare,
  nativeShareImage,
  quickDownload,
} from "@/utils/shareLinks";

interface Props {
  /** Final caption with referral link already injected. */
  text: string;
  /** Canonical share URL with ?ref=. */
  shareUrl: string;
  /** Optional image to share/download. */
  imageUrl?: string | null;
  /** Filename for the downloaded image. */
  filename?: string;
  /** Optional className for the wrapper. */
  className?: string;
  /** Show "تحميل سريع" + "مشاركة الصورة" buttons. */
  withImageActions?: boolean;
  /** Compact pill style vs full grid. */
  compact?: boolean;
}

// Simple inline brand icons (avoid extra deps)
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.52 3.48A11.78 11.78 0 0 0 12.05 0C5.49 0 .15 5.34.15 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.86 11.86 0 0 0 5.74 1.46h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.16-3.43-8.43ZM12.05 21.4h-.01a9.5 9.5 0 0 1-4.84-1.33l-.35-.21-3.74.98 1-3.65-.23-.37a9.46 9.46 0 0 1-1.45-5.02c0-5.24 4.27-9.5 9.51-9.5 2.54 0 4.92.99 6.71 2.78a9.42 9.42 0 0 1 2.78 6.72c0 5.24-4.27 9.6-9.38 9.6Zm5.49-7.12c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0Zm5.4 8.16-1.83 8.62c-.14.61-.5.76-1.01.47l-2.79-2.06-1.35 1.3c-.15.15-.27.27-.56.27l.2-2.83 5.17-4.67c.22-.2-.05-.31-.35-.11l-6.39 4.02-2.75-.86c-.6-.19-.61-.6.13-.89l10.74-4.14c.5-.18.93.12.79.88Z" />
  </svg>
);

export default function QuickShareButtons({
  text,
  shareUrl,
  imageUrl,
  filename,
  className,
  withImageActions = true,
  compact = false,
}: Props) {
  const onWhatsApp = () => openShare(ShareLinks.whatsapp(text));
  const onTwitter = () => openShare(ShareLinks.twitter(text, shareUrl));
  const onTelegram = () => openShare(ShareLinks.telegram(text, shareUrl));

  const onShareImage = async () => {
    if (!imageUrl) return;
    const ok = await nativeShareImage(imageUrl, filename || "share.jpg", text);
    if (!ok) {
      // Fallback: WhatsApp share with the caption (text + link)
      openShare(ShareLinks.whatsapp(text));
    }
  };

  const onDownload = () => {
    if (!imageUrl) return;
    quickDownload(imageUrl, filename || "marketing-asset.jpg");
  };

  const size = compact ? "sm" : "sm";
  const wrap = className ?? "grid grid-cols-3 gap-2";

  return (
    <div className="space-y-2">
      <div className={wrap}>
        <Button
          type="button"
          size={size}
          onClick={onWhatsApp}
          className="h-9 gap-1.5 text-xs bg-[#25D366] hover:bg-[#1ebe57] text-white"
          aria-label="مشاركة عبر واتساب"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          واتساب
        </Button>
        <Button
          type="button"
          size={size}
          onClick={onTwitter}
          className="h-9 gap-1.5 text-xs bg-foreground text-background hover:bg-foreground/90"
          aria-label="مشاركة عبر X / تويتر"
        >
          <Twitter className="h-3.5 w-3.5" />
          تويتر
        </Button>
        <Button
          type="button"
          size={size}
          onClick={onTelegram}
          className="h-9 gap-1.5 text-xs bg-[#229ED9] hover:bg-[#1c8bc0] text-white"
          aria-label="مشاركة عبر تيليجرام"
        >
          <TelegramIcon className="h-3.5 w-3.5" />
          تيليجرام
        </Button>
      </div>

      {withImageActions && imageUrl && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onShareImage}
            className="h-9 gap-1.5 text-xs"
          >
            <ImageIcon className="h-3.5 w-3.5" />
            مشاركة الصورة
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onDownload}
            className="h-9 gap-1.5 text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            تحميل سريع
          </Button>
        </div>
      )}
    </div>
  );
}
