// تخطيط مشترك لصفحات الواتساب: هيدر فاخر + شريط جانبي ثانوي + Dark Mode مخصص
import { ReactNode, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { MessageSquare, Megaphone, BarChart3, Volume2, VolumeX, Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/adminmaster/whatsapp/inbox", label: "صندوق المحادثات", icon: MessageSquare, color: "from-emerald-500 to-teal-600" },
  { to: "/adminmaster/whatsapp/campaigns", label: "الحملات الإعلانية", icon: Megaphone, color: "from-violet-500 to-purple-600" },
  { to: "/adminmaster/whatsapp/analytics", label: "لوحة الإحصائيات", icon: BarChart3, color: "from-amber-500 to-orange-600" },
];

export default function WhatsappLayout({
  children,
  rightSlot,
}: {
  children: ReactNode;
  rightSlot?: ReactNode;
}) {
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);
  const [soundOn, setSoundOn] = useState<boolean>(() => localStorage.getItem("wa_sound") !== "off");
  const [dark, setDark] = useState<boolean>(() => localStorage.getItem("wa_dark") === "on");
  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      const [{ data: convs }, { data: camps }] = await Promise.all([
        supabase.from("whatsapp_conversations").select("unread_count"),
        supabase.from("whatsapp_campaigns").select("id").in("status", ["scheduled", "running"]),
      ]);
      setUnreadTotal((convs || []).reduce((a: number, c: any) => a + (c.unread_count || 0), 0));
      setActiveCampaigns((camps || []).length);
    };
    load();
    const ch = supabase.channel("wa-layout-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_conversations" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_campaigns" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  useEffect(() => { localStorage.setItem("wa_sound", soundOn ? "on" : "off"); }, [soundOn]);
  useEffect(() => { localStorage.setItem("wa_dark", dark ? "on" : "off"); }, [dark]);

  return (
    <AdminLayout>
      <div
        dir="rtl"
        className={cn(
          "min-h-[calc(100vh-64px)] transition-colors",
          dark ? "bg-[hsl(220_25%_8%)] text-[hsl(220_15%_92%)]" : "bg-gradient-to-br from-slate-50 via-white to-emerald-50/30"
        )}
      >
        <div className="max-w-[1500px] mx-auto p-4 lg:p-6 space-y-5">
          {/* الهيدر الفاخر */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative overflow-hidden rounded-2xl border shadow-sm",
              dark
                ? "bg-gradient-to-br from-[hsl(220_25%_12%)] to-[hsl(160_30%_10%)] border-[hsl(220_15%_20%)]"
                : "bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 border-transparent"
            )}
          >
            {/* زخارف خلفية */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-cyan-300 blur-3xl" />
            </div>

            <div className="relative p-5 lg:p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg"
                >
                  <MessageSquare className="w-7 h-7 text-white" />
                </motion.div>
                <div className="text-white">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">مركز قيادة واتساب</h1>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <p className="text-sm text-white/80 mt-0.5">
                    منصة موحّدة للمحادثات اللحظية والحملات الذكية والتحليلات المتقدمة
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur"
                  onClick={() => setSoundOn(!soundOn)}
                >
                  {soundOn ? <Volume2 className="w-4 h-4 ml-1.5" /> : <VolumeX className="w-4 h-4 ml-1.5" />}
                  {soundOn ? "الصوت مفعّل" : "كتم"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur"
                  onClick={() => setDark(!dark)}
                >
                  {dark ? <Sun className="w-4 h-4 ml-1.5" /> : <Moon className="w-4 h-4 ml-1.5" />}
                  {dark ? "نهاري" : "ليلي"}
                </Button>
              </div>
            </div>

            {/* شريط KPI داخل الهيدر */}
            <div className="relative px-5 lg:px-6 pb-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              <KpiPill label="رسائل غير مقروءة" value={unreadTotal} accent="bg-rose-500" dark={dark} pulse={unreadTotal > 0} />
              <KpiPill label="حملات نشطة" value={activeCampaigns} accent="bg-amber-400" dark={dark} />
              <KpiPill label="الحالة" value="متصل" accent="bg-emerald-400" dark={dark} dot />
              <KpiPill label="آخر تحديث" value={new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })} accent="bg-sky-400" dark={dark} />
            </div>
          </motion.div>

          {/* تخطيط رئيسي: شريط جانبي + المحتوى + slot */}
          <div className={cn("grid gap-4", rightSlot ? "lg:grid-cols-[220px_1fr_320px]" : "lg:grid-cols-[220px_1fr]")}>
            {/* الشريط الجانبي الثانوي */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "rounded-2xl p-3 border h-fit sticky top-4",
                dark ? "bg-[hsl(220_25%_12%)] border-[hsl(220_15%_20%)]" : "bg-white border-slate-200 shadow-sm"
              )}
            >
              <div className={cn("text-[11px] font-semibold uppercase tracking-wider mb-2 px-2", dark ? "text-white/50" : "text-slate-400")}>
                التنقل
              </div>
              <nav className="space-y-1">
                {NAV.map((n) => {
                  const active = location.pathname.startsWith(n.to);
                  return (
                    <NavLink
                      key={n.to}
                      to={n.to}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden group",
                        active
                          ? "text-white shadow-md"
                          : dark
                          ? "text-white/70 hover:text-white hover:bg-white/5"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="wa-nav-active"
                          className={cn("absolute inset-0 bg-gradient-to-r", n.color)}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <n.icon className={cn("w-4 h-4 relative z-10 transition-transform group-hover:scale-110", active && "drop-shadow")} />
                      <span className="relative z-10 flex-1">{n.label}</span>
                      {n.to.endsWith("inbox") && unreadTotal > 0 && (
                        <Badge variant="secondary" className="relative z-10 h-5 px-1.5 text-[10px] bg-white/25 text-white border-none">
                          {unreadTotal}
                        </Badge>
                      )}
                      {n.to.endsWith("campaigns") && activeCampaigns > 0 && (
                        <Badge variant="secondary" className="relative z-10 h-5 px-1.5 text-[10px] bg-white/25 text-white border-none">
                          {activeCampaigns}
                        </Badge>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className={cn("mt-4 pt-3 border-t text-[11px] px-2 leading-relaxed", dark ? "border-white/10 text-white/40" : "border-slate-100 text-slate-400")}>
                💡 اضغط <kbd className={cn("px-1 rounded text-[10px]", dark ? "bg-white/10" : "bg-slate-100")}>Cmd+K</kbd> للبحث السريع
              </div>
            </motion.aside>

            {/* المحتوى */}
            <motion.main
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              data-wa-dark={dark ? "1" : "0"}
              className={cn(
                "rounded-2xl border min-h-[60vh]",
                dark ? "bg-[hsl(220_25%_11%)] border-[hsl(220_15%_20%)] text-[hsl(220_15%_92%)]" : "bg-white border-slate-200 shadow-sm"
              )}
            >
              {children}
            </motion.main>

            {/* لوحة جانبية (للمحادثة المختارة مثلاً) */}
            {rightSlot && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "rounded-2xl border overflow-hidden h-fit sticky top-4",
                  dark ? "bg-[hsl(220_25%_12%)] border-[hsl(220_15%_20%)]" : "bg-white border-slate-200 shadow-sm"
                )}
              >
                {rightSlot}
              </motion.aside>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function KpiPill({
  label, value, accent, dark, pulse, dot,
}: { label: string; value: string | number; accent: string; dark: boolean; pulse?: boolean; dot?: boolean }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3"
    >
      <span className={cn("w-2.5 h-2.5 rounded-full", accent, pulse && "animate-pulse", dot && "shadow-[0_0_10px_currentColor]")} />
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-white/70 truncate">{label}</div>
        <div className="text-white font-bold text-lg leading-tight truncate">{value}</div>
      </div>
    </motion.div>
  );
}
