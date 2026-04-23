/**
 * Build share URLs for popular networks. All inputs are URI-encoded safely.
 * `text` should be the final caption (already includes the share URL).
 */
export const ShareLinks = {
  whatsapp(text: string) {
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  },
  twitter(text: string, url?: string) {
    // X/Twitter intent: text + optional url param (clickable preview)
    const u = new URL("https://twitter.com/intent/tweet");
    u.searchParams.set("text", text);
    if (url) u.searchParams.set("url", url);
    return u.toString();
  },
  telegram(text: string, url: string) {
    // Telegram requires a URL for share; text becomes the comment
    const u = new URL("https://t.me/share/url");
    u.searchParams.set("url", url);
    u.searchParams.set("text", text);
    return u.toString();
  },
};

/** Open in a new tab safely. */
export function openShare(url: string) {
  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    /* ignored */
  }
}

/**
 * Try Web Share API (great on mobile). Returns true if it handled the share.
 * Falls back to caller logic when not available or user cancels.
 */
export async function nativeShare(payload: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) return false;
  try {
    await navigator.share(payload);
    return true;
  } catch {
    return false;
  }
}

/**
 * Try sharing an image file via Web Share API (mobile).
 * Falls back to false on unsupported browsers.
 */
export async function nativeShareImage(
  imageUrl: string,
  filename: string,
  text?: string,
): Promise<boolean> {
  if (
    typeof navigator === "undefined" ||
    !navigator.canShare ||
    !navigator.share
  ) {
    return false;
  }
  try {
    const res = await fetch(imageUrl, { mode: "cors" });
    const blob = await res.blob();
    const file = new File([blob], filename, { type: blob.type || "image/jpeg" });
    if (!navigator.canShare({ files: [file] })) return false;
    await navigator.share({ files: [file], text });
    return true;
  } catch {
    return false;
  }
}

/** Trigger an immediate file download. Falls back to opening in a new tab. */
export async function quickDownload(url: string, filename: string) {
  try {
    const res = await fetch(url, { mode: "cors" });
    const blob = await res.blob();
    const a = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    openShare(url);
  }
}
