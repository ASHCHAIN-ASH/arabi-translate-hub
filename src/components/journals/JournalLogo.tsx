import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * شعار المجلة من مصدرها الحقيقي (موقع المجلة نفسه).
 * يستخدم خدمة الأيقونات لجلب شعار النطاق، ومع الفشل تظهر أيقونة التخصص.
 */
export default function JournalLogo({
  website,
  icon: Icon,
  iconClass,
  name,
}: {
  website: string;
  icon: LucideIcon;
  iconClass: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  const host = useMemo(() => {
    try {
      return new URL(website).hostname;
    } catch {
      return "";
    }
  }, [website]);

  if (!host || failed) {
    return <Icon className={`h-7 w-7 sm:h-8 sm:w-8 ${iconClass}`} aria-hidden="true" />;
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(host)}`}
      alt={`شعار ${name}`}
      loading="lazy"
      width={64}
      height={64}
      onError={() => setFailed(true)}
      className="h-8 w-8 sm:h-9 sm:w-9 rounded-md object-contain"
    />
  );
}
