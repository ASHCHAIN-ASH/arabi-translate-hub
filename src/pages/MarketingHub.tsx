import { useEffect, useMemo, useState } from "react";
// (no helmet — set document.title via effect)
import {
  Download,
  Share2,
  LinkIcon,
  Copy,
  Instagram,
  Twitter,
  FileText,
  Image as ImageIcon,
  Users,
  MousePointerClick,
  Sparkles,
  Wallet,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/SimpleAuthProvider";
import { useMyMarketingReferral } from "@/hooks/useMarketingReferral";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { renderCaption, copyToClipboard } from "@/utils/referralLink";
import ReferralAnalytics from "@/components/marketing/ReferralAnalytics";
import QuickShareButtons from "@/components/marketing/QuickShareButtons";
import AICopyGenerator from "@/components/marketing/AICopyGenerator";

// ---------------- Types ----------------
type Platform = "instagram" | "story" | "twitter" | "brochure";

interface MarketingAsset {
  id: string;
  title: string;
  image_url: string | null;
  platform: Platform;
  service_type: string;
  caption_template: string | null;
  is_active: boolean;
  created_at: string;
}

const TABS: {
  key: Platform;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "instagram", label: "إنستغرام", icon: Instagram },
  { key: "story", label: "ستوريز", icon: ImageIcon },
  { key: "twitter", label: "تويتر / X", icon: Twitter },
  { key: "brochure", label: "البروشورات", icon: FileText },
];

// ---------------- Helpers ----------------
// caption rendering moved to @/utils/referralLink (renderCaption)

async function downloadImage(url: string, filename: string) {
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
    // Fallback: open in new tab
    window.open(url, "_blank", "noopener");
  }
}

// ---------------- Stat card ----------------
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <Card className="p-4 sm:p-5 flex items-center gap-4 border-border/60 bg-card/80 backdrop-blur-sm hover:shadow-md transition-shadow">
      <div
        className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${accent}`}
      >
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
        <div className="text-2xl font-bold text-foreground tabular-nums">
          {value}
        </div>
      </div>
    </Card>
  );
}

// ---------------- Asset card ----------------
function AssetCard({
  asset,
  shareUrl,
  onCopyLink,
  onCopyCaption,
  onShare,
  onDownload,
}: {
  asset: MarketingAsset;
  shareUrl: string;
  onCopyLink: () => void;
  onCopyCaption: () => void;
  onShare: () => void;
  onDownload: () => void;
}) {
  // Cache-bust so freshly re-uploaded banners refresh in the browser
  const cacheBustedSrc = asset.image_url
    ? `${asset.image_url}${asset.image_url.includes("?") ? "&" : "?"}v=2`
    : null;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm flex flex-col animate-fade-in transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.35)] hover:border-primary/40">
      {/* Animated gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.15),transparent_60%)]" />

      <div className="relative aspect-[4/5] bg-muted overflow-hidden">
        {cacheBustedSrc ? (
          <>
            <img
              src={cacheBustedSrc}
              alt={asset.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            {/* Shine sweep on hover */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {/* Bottom gradient overlay for legibility */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        <Badge
          variant="secondary"
          className="absolute top-3 start-3 bg-background/80 backdrop-blur-md text-xs border border-border/50 shadow-sm"
        >
          {asset.service_type}
        </Badge>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
          {asset.title}
        </h3>

        {/* Quick share row (WhatsApp / Twitter / Telegram + image actions) */}
        <QuickShareButtons
          text={renderCaption(asset.caption_template, shareUrl)}
          shareUrl={shareUrl}
          imageUrl={asset.image_url}
          filename={`${asset.title.replace(/[^\p{L}\p{N}_-]+/gu, "_")}.${
            (asset.image_url?.split(".").pop()?.split("?")[0] || "jpg")
          }`}
          withImageActions={false}
        />

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button
            size="sm"
            variant="default"
            className="h-9 gap-1.5 text-xs"
            onClick={onDownload}
          >
            <Download className="h-3.5 w-3.5" />
            تحميل
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-9 gap-1.5 text-xs"
            onClick={onShare}
          >
            <Share2 className="h-3.5 w-3.5" />
            مشاركة
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9 gap-1.5 text-xs"
            onClick={onCopyLink}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            نسخ الرابط
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-9 gap-1.5 text-xs"
            onClick={onCopyCaption}
          >
            <Copy className="h-3.5 w-3.5" />
            نسخ النص
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ---------------- Page ----------------
export default function MarketingHub() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { code, shareUrl, stats, loading: refLoading } = useMyMarketingReferral();

  const [assets, setAssets] = useState<MarketingAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [activeTab, setActiveTab] = useState<Platform>("instagram");
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    document.title = "مركز التسويق – بنرات وروابط الإحالة";
  }, []);

  // Load active assets
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingAssets(true);
      const { data, error } = await (supabase as any)
        .from("marketing_assets")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (error) {
        console.warn("[marketing-hub] load assets:", error.message);
        setAssets([]);
      } else {
        setAssets((data || []) as MarketingAsset[]);
      }
      setLoadingAssets(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Load wallet balance (best-effort; gracefully skip if table missing)
  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        const { data } = await (supabase as any)
          .from("user_wallets")
          .select("balance")
          .eq("user_id", user.id)
          .maybeSingle();
        if (alive && data) setWalletBalance(Number(data.balance) || 0);
      } catch {
        /* no-op */
      }
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  const grouped = useMemo(() => {
    const map: Record<Platform, MarketingAsset[]> = {
      instagram: [],
      story: [],
      twitter: [],
      brochure: [],
    };
    for (const a of assets) {
      if (map[a.platform]) map[a.platform].push(a);
    }
    return map;
  }, [assets]);

  const totalClicks = stats?.total_clicks ?? 0;
  const totalCustomers = (stats?.total_signups ?? 0) + (stats?.total_orders ?? 0);

  // ---------------- Actions ----------------
  const handleCopy = async (text: string, label: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      toast({ title: "✅ تم النسخ", description: label });
    } else {
      toast({
        title: "تعذر النسخ",
        description: "حاول يدوياً",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (asset: MarketingAsset) => {
    const text = renderCaption(asset.caption_template, shareUrl);
    if (navigator.share) {
      try {
        await navigator.share({
          title: asset.title,
          text,
          url: shareUrl || undefined,
        });
        return;
      } catch {
        // user cancelled or unsupported – fall through
      }
    }
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank", "noopener");
  };

  const handleDownload = (asset: MarketingAsset) => {
    if (!asset.image_url) {
      toast({ title: "لا يوجد ملف للتحميل", variant: "destructive" });
      return;
    }
    const safeTitle = asset.title.replace(/[^\p{L}\p{N}_-]+/gu, "_");
    const ext = asset.image_url.split(".").pop()?.split("?")[0] || "jpg";
    downloadImage(asset.image_url, `${safeTitle}.${ext}`);
  };

  const renderGrid = (items: MarketingAsset[]) => {
    if (loadingAssets) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[4/5] w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }
    if (!items.length) {
      return (
        <Card className="p-12 text-center text-muted-foreground border-dashed">
          <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
          <p className="font-medium">لا توجد عناصر بعد في هذا التصنيف</p>
          <p className="text-sm mt-1">سيتم إضافة محتوى جديد قريباً</p>
        </Card>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            shareUrl={shareUrl}
            onCopyLink={() => handleCopy(shareUrl, "تم نسخ رابط الإحالة")}
            onCopyCaption={() =>
              handleCopy(
                renderCaption(asset.caption_template, shareUrl),
                "تم نسخ النص الجاهز",
              )
            }
            onShare={() => handleShare(asset)}
            onDownload={() => handleDownload(asset)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* SEO */}

      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10 max-w-7xl">
        {/* Hero / Stats */}
        <section className="mb-6 sm:mb-10">
          <div className="mb-5 sm:mb-7">
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
              مركز التسويق
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              شارك بنراتنا ومحتوانا الجاهز ـ كل تحميل ومشاركة بكوداً يحمل رابطك الخاص.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={Wallet}
              label="رصيدك"
              value={
                refLoading
                  ? "—"
                  : walletBalance !== null
                  ? `${walletBalance.toLocaleString("ar-SA")} ر.س`
                  : "—"
              }
              accent="bg-gradient-to-br from-primary to-primary/70"
            />
            <StatCard
              icon={Users}
              label="عدد العملاء"
              value={refLoading ? "—" : totalCustomers.toLocaleString("ar-SA")}
              accent="bg-gradient-to-br from-emerald-500 to-emerald-700"
            />
            <StatCard
              icon={MousePointerClick}
              label="عدد النقرات"
              value={refLoading ? "—" : totalClicks.toLocaleString("ar-SA")}
              accent="bg-gradient-to-br from-amber-500 to-orange-600"
            />
          </div>

          {/* Ref code chip */}
          {code ? (
            <Card className="mt-4 sm:mt-5 p-3 sm:p-4 flex flex-wrap items-center gap-3 bg-gradient-to-l from-primary/5 to-transparent border-primary/20">
              <Badge className="text-sm font-mono tracking-wider px-3 py-1">
                {code}
              </Badge>
              <span className="text-sm text-muted-foreground truncate flex-1 min-w-0">
                {shareUrl}
              </span>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => handleCopy(shareUrl, "تم نسخ رابط الإحالة")}
              >
                <Copy className="h-3.5 w-3.5" />
                نسخ
              </Button>
            </Card>
          ) : !user ? (
            <Card className="mt-4 sm:mt-5 p-4 text-center text-sm text-muted-foreground">
              سجّل دخولك للحصول على رابط إحالة خاص بك وكسب العمولات.
            </Card>
          ) : null}
        </section>

        {/* Analytics */}
        {user && code && (
          <section className="mb-6 sm:mb-10">
            <ReferralAnalytics
              userId={user.id}
              refCode={code}
              totals={{
                total_clicks: stats?.total_clicks ?? 0,
                total_signups: stats?.total_signups ?? 0,
                total_orders: stats?.total_orders ?? 0,
              }}
            />
          </section>
        )}

        {/* AI Copy Generator */}
        <section className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 dark:from-violet-950/30 dark:via-fuchsia-950/30 dark:to-pink-950/30">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-fuchsia-500" />
              ولّد نص تسويقي بالذكاء الاصطناعي
            </h3>
            <p className="text-xs text-muted-foreground">
              اختر الخدمة والمنصة، واحصل على نص جاهز يحتوي رابط إحالتك.
            </p>
          </div>
          <AICopyGenerator refCode={code} />
        </section>

        {/* Tabs */}
        <section>
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as Platform)}
          >
            <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex h-auto p-1 mb-5 sm:mb-6">
              {TABS.map(({ key, label, icon: Icon }) => {
                const count = grouped[key].length;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex flex-col sm:flex-row gap-1 sm:gap-2 py-2 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                    {count > 0 && (
                      <span className="text-[10px] sm:text-xs opacity-70 tabular-nums">
                        ({count})
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {TABS.map(({ key }) => (
              <TabsContent key={key} value={key} className="mt-0">
                {renderGrid(grouped[key])}
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
}
