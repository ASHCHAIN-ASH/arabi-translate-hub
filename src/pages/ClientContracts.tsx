import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import ClientLayout from "@/components/client/ClientLayout";
import { useAuth } from "@/components/SimpleAuthProvider";
import { useToast } from "@/hooks/use-toast";
import {
  FileText, Search, Eye, Calendar, ShieldCheck, Building2, Download,
  AlertTriangle, Clock, CheckCircle2, XCircle, FileSignature, Loader2,
  ArrowUpDown, Sparkles, TrendingUp, Wallet,
} from "lucide-react";
import {
  listContracts, ContractRow, STATUS_LABELS, STATUS_COLORS,
  downloadContractPdf,
} from "@/utils/supabaseContractService";
import { PARENT_COMPANY } from "@/utils/contractTemplates";

type TabKey = "all" | "pending" | "signed" | "expired";
type SortKey = "newest" | "oldest" | "amount_desc" | "amount_asc";

const PENDING_STATUSES = new Set(["pending_signature", "draft"]);
const SIGNED_STATUSES = new Set(["signed", "active", "completed"]);
const EXPIRED_STATUSES = new Set(["expired", "cancelled"]);

const ClientContracts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<ContractRow[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabKey>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        setLoading(true);
        const list = await listContracts();
        if (mounted) setContracts(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user?.id]);

  const stats = useMemo(() => {
    const pending = contracts.filter(c => PENDING_STATUSES.has(c.status));
    const signed = contracts.filter(c => SIGNED_STATUSES.has(c.status));
    const expired = contracts.filter(c => EXPIRED_STATUSES.has(c.status));
    const signedValue = signed.reduce((s, c) => s + Number(c.total_amount || 0), 0);
    const pendingValue = pending.reduce((s, c) => s + Number(c.total_amount || 0), 0);
    return {
      total: contracts.length,
      pending: pending.length,
      signed: signed.length,
      expired: expired.length,
      signedValue,
      pendingValue,
    };
  }, [contracts]);

  const filtered = useMemo(() => {
    let list = contracts;
    if (tab === "pending") list = list.filter(c => PENDING_STATUSES.has(c.status));
    else if (tab === "signed") list = list.filter(c => SIGNED_STATUSES.has(c.status));
    else if (tab === "expired") list = list.filter(c => EXPIRED_STATUSES.has(c.status));

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(c =>
        c.contract_number.toLowerCase().includes(q) ||
        (c.title || "").toLowerCase().includes(q) ||
        (c.service_name || "").toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sort === "newest") sorted.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    else if (sort === "oldest") sorted.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
    else if (sort === "amount_desc") sorted.sort((a, b) => Number(b.total_amount || 0) - Number(a.total_amount || 0));
    else if (sort === "amount_asc") sorted.sort((a, b) => Number(a.total_amount || 0) - Number(b.total_amount || 0));
    return sorted;
  }, [contracts, tab, search, sort]);

  async function handleDownload(c: ContractRow) {
    setDownloadingId(c.id);
    try {
      await downloadContractPdf(c.id);
      toast({
        title: "✓ نافذة الحفظ مفتوحة",
        description: 'اختر "حفظ كـ PDF" من قائمة الطباعة',
      });
    } catch (e: any) {
      toast({ title: "تعذّر تحميل العقد", description: e.message, variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  }

  const fmtCurrency = (n: number) => `${Number(n || 0).toLocaleString("ar-SA")} ر.س`;
  const fmtDate = (d?: string | null) => d ? new Date(d).toLocaleDateString("ar-SA") : "—";

  return (
    <ClientLayout>
      <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shadow-md shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">عقودي</h1>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">جميع عقود خدماتك مع {PARENT_COMPANY.platformName}</span>
              </p>
            </div>
          </div>

          {/* Pending banner */}
          {stats.pending > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-amber-400/60 bg-gradient-to-l from-amber-500/15 via-amber-500/5 to-transparent p-4 sm:p-5"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow animate-pulse">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="font-bold text-amber-900 dark:text-amber-200">
                    لديك {stats.pending} عقد {stats.pending === 1 ? "" : ""} بانتظار توقيعك
                  </p>
                  <p className="text-xs sm:text-sm text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                    قيمة العقود المعلقة: {fmtCurrency(stats.pendingValue)} — يُرجى المراجعة والتوقيع لاستكمال خدماتك
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setTab("pending")}
                  className="bg-amber-500 hover:bg-amber-600 text-white border-0"
                >
                  <FileSignature className="h-4 w-4 ml-2" />
                  عرضها الآن
                </Button>
              </div>
            </motion.div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              icon={<FileText className="h-5 w-5" />}
              label="إجمالي العقود"
              value={String(stats.total)}
              tone="default"
            />
            <KpiCard
              icon={<Clock className="h-5 w-5" />}
              label="بانتظار التوقيع"
              value={String(stats.pending)}
              tone="amber"
              hint={stats.pending > 0 ? fmtCurrency(stats.pendingValue) : undefined}
            />
            <KpiCard
              icon={<ShieldCheck className="h-5 w-5" />}
              label="عقود موقّعة"
              value={String(stats.signed)}
              tone="emerald"
            />
            <KpiCard
              icon={<Wallet className="h-5 w-5" />}
              label="قيمة العقود الموقّعة"
              value={fmtCurrency(stats.signedValue)}
              tone="primary"
              compact
            />
          </div>

          {/* Tabs + filters */}
          <Card className="shadow-sm">
            <CardContent className="p-3 sm:p-4 space-y-3">
              <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)}>
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                  <TabsTrigger value="all" className="gap-2">
                    الكل
                    <Badge variant="secondary" className="h-5 px-1.5">{stats.total}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="gap-2 relative">
                    بانتظار التوقيع
                    {stats.pending > 0 && (
                      <Badge className="h-5 px-1.5 bg-amber-500 hover:bg-amber-500 text-white border-0">
                        {stats.pending}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="signed" className="gap-2">
                    موقّعة
                    <Badge variant="secondary" className="h-5 px-1.5">{stats.signed}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="expired" className="gap-2">
                    منتهية / ملغاة
                    <Badge variant="secondary" className="h-5 px-1.5">{stats.expired}</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث برقم العقد، العنوان أو اسم الخدمة…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-10"
                  />
                </div>
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <ArrowUpDown className="h-4 w-4 ml-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث أولاً</SelectItem>
                    <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                    <SelectItem value="amount_desc">الأعلى قيمة</SelectItem>
                    <SelectItem value="amount_asc">الأقل قيمة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* List */}
          {loading ? (
            <Card>
              <CardContent className="text-center py-16">
                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-sm text-muted-foreground">جاري تحميل العقود...</p>
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-semibold mb-1">
                  {search ? "لا توجد نتائج مطابقة" : "لا توجد عقود في هذا التبويب"}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {search
                    ? "جرّب كلمة بحث أخرى أو غيّر التبويب"
                    : "ستظهر عقودك هنا تلقائياً عند قبول عرض السعر لأي خدمة"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {filtered.map((c, i) => (
                <ContractCard
                  key={c.id}
                  contract={c}
                  index={i}
                  downloading={downloadingId === c.id}
                  onDownload={() => handleDownload(c)}
                  fmtCurrency={fmtCurrency}
                  fmtDate={fmtDate}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </ClientLayout>
  );
};

// ============= KPI Card =============
function KpiCard({
  icon, label, value, tone = "default", hint, compact,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "default" | "amber" | "emerald" | "primary";
  hint?: string;
  compact?: boolean;
}) {
  const tones: Record<string, string> = {
    default: "bg-muted text-foreground",
    amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    primary: "bg-primary/10 text-primary border-primary/30",
  };
  return (
    <Card className={`border ${tone !== "default" ? tones[tone] : ""}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${tones[tone]}`}>
            {icon}
          </div>
          <p className="text-xs text-muted-foreground truncate">{label}</p>
        </div>
        <p className={`font-bold tabular-nums ${compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl"}`}>
          {value}
        </p>
        {hint && <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{hint}</p>}
      </CardContent>
    </Card>
  );
}

// ============= Contract Card =============
function ContractCard({
  contract: c, index, downloading, onDownload, fmtCurrency, fmtDate,
}: {
  contract: ContractRow;
  index: number;
  downloading: boolean;
  onDownload: () => void;
  fmtCurrency: (n: number) => string;
  fmtDate: (d?: string | null) => string;
}) {
  const isPending = PENDING_STATUSES.has(c.status);
  const isSigned = SIGNED_STATUSES.has(c.status);
  const isExpired = EXPIRED_STATUSES.has(c.status);

  const accent = isPending
    ? "border-amber-500/40 bg-gradient-to-l from-amber-500/5 to-transparent"
    : isSigned
    ? "border-emerald-500/30 bg-gradient-to-l from-emerald-500/5 to-transparent"
    : isExpired
    ? "border-muted bg-muted/20 opacity-80"
    : "border-border";

  const statusIcon = isPending ? <Clock className="h-3.5 w-3.5" />
    : isSigned ? <CheckCircle2 className="h-3.5 w-3.5" />
    : <XCircle className="h-3.5 w-3.5" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className={`transition-all hover:shadow-lg border-2 ${accent}`}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-4">

            {/* Left accent column */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-2 pl-4 border-l">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-sm ${
                isPending ? "bg-amber-500 text-white"
                : isSigned ? "bg-emerald-600 text-white"
                : "bg-muted text-muted-foreground"
              }`}>
                {isPending ? <FileSignature className="h-6 w-6" />
                  : isSigned ? <ShieldCheck className="h-6 w-6" />
                  : <FileText className="h-6 w-6" />}
              </div>
              <p className="text-[10px] text-muted-foreground font-mono">
                {fmtDate(c.created_at)}
              </p>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="font-mono text-[11px] bg-background">
                  #{c.contract_number}
                </Badge>
                <Badge className={`${STATUS_COLORS[c.status]} text-[11px] gap-1`}>
                  {statusIcon}
                  {STATUS_LABELS[c.status]}
                </Badge>
                {isPending && (
                  <Badge className="bg-amber-500 hover:bg-amber-500 text-white border-0 text-[10px] gap-1 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    يتطلب إجراءك
                  </Badge>
                )}
              </div>

              <div>
                <h3 className="font-bold text-base sm:text-lg leading-snug line-clamp-2">
                  {c.title}
                </h3>
                {c.service_name && (
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {c.service_name}
                  </p>
                )}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] sm:text-xs">
                <Stat
                  icon={<Wallet className="h-3.5 w-3.5" />}
                  label="القيمة"
                  value={fmtCurrency(Number(c.total_amount || 0))}
                />
                <Stat
                  icon={<Calendar className="h-3.5 w-3.5" />}
                  label="التحرير"
                  value={fmtDate(c.created_at)}
                />
                {c.signed_at ? (
                  <Stat
                    icon={<ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
                    label="التوقيع"
                    value={fmtDate(c.signed_at)}
                    tone="emerald"
                  />
                ) : c.expires_at ? (
                  <Stat
                    icon={<Clock className="h-3.5 w-3.5 text-amber-600" />}
                    label="ينتهي في"
                    value={fmtDate(c.expires_at)}
                    tone="amber"
                  />
                ) : (
                  <Stat
                    icon={<TrendingUp className="h-3.5 w-3.5" />}
                    label="آخر تحديث"
                    value={fmtDate(c.updated_at)}
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex lg:flex-col gap-2 lg:min-w-[170px] lg:justify-center lg:border-r lg:pr-4">
              <Button
                asChild
                size="sm"
                variant={isPending ? "default" : "outline"}
                className={`w-full ${isPending ? "bg-amber-500 hover:bg-amber-600 text-white border-0" : ""}`}
              >
                <Link to={`/client/contracts/${c.id}`}>
                  {isPending ? (
                    <><FileSignature className="h-4 w-4 ml-2" /> راجع ووقّع</>
                  ) : (
                    <><Eye className="h-4 w-4 ml-2" /> عرض العقد</>
                  )}
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onDownload}
                disabled={downloading}
                className="w-full"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 ml-2" />
                )}
                تحميل PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Stat({
  icon, label, value, tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "emerald" | "amber";
}) {
  const toneCls = tone === "emerald"
    ? "border-emerald-500/30 bg-emerald-500/5"
    : tone === "amber"
    ? "border-amber-500/30 bg-amber-500/5"
    : "border-border bg-muted/30";
  return (
    <div className={`rounded-lg border px-2.5 py-1.5 ${toneCls}`}>
      <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="font-semibold text-foreground truncate">{value}</p>
    </div>
  );
}

export default ClientContracts;
