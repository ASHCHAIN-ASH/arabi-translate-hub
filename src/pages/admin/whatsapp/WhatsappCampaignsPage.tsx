// صفحة الحملات الإعلانية المنفصلة
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import WhatsappLayout from "@/components/admin/whatsapp/WhatsappLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Send, Megaphone, Calendar, Users, TrendingUp, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const EMOJIS = ["😀","😊","🙏","👍","✅","🎉","🌹","💼","📋","🧾","📜","💳","⏳","🔔","📞","🎓","📚","✨","🔥","💡","⭐","❤️","🤝","📩","📎","🚀"];

interface Campaign {
  id: string; name: string; status: string; total_recipients: number;
  sent_count: number; failed_count: number; scheduled_at: string | null;
  created_at: string; message_body: string;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "مسودة", color: "text-slate-700", bg: "bg-slate-500/15 border-slate-500/30" },
  scheduled: { label: "مجدولة", color: "text-amber-700", bg: "bg-amber-500/15 border-amber-500/30" },
  running: { label: "قيد التنفيذ", color: "text-blue-700", bg: "bg-blue-500/15 border-blue-500/30" },
  completed: { label: "مكتملة", color: "text-emerald-700", bg: "bg-emerald-500/15 border-emerald-500/30" },
  failed: { label: "فشلت", color: "text-rose-700", bg: "bg-rose-500/15 border-rose-500/30" },
};

export default function WhatsappCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ name: "", message_body: "", audience_type: "all", scheduled_at: "" });

  const load = async () => {
    const { data } = await supabase.from("whatsapp_campaigns").select("*")
      .order("created_at", { ascending: false }).limit(100);
    setCampaigns((data as Campaign[]) || []);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel("wa-camps")
      .on("postgres_changes", { event: "*", schema: "public", table: "whatsapp_campaigns" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const create = async () => {
    if (!form.name || !form.message_body) return toast.error("الاسم والنص مطلوبان");
    const status = form.scheduled_at ? "scheduled" : "draft";
    const { data, error } = await supabase.from("whatsapp_campaigns").insert({
      name: form.name, message_body: form.message_body,
      audience_filter: { type: form.audience_type }, status,
      scheduled_at: form.scheduled_at || null,
    }).select("id").single();
    if (error) return toast.error(error.message);
    toast.success("تم إنشاء الحملة");
    setDialog(false);
    setForm({ name: "", message_body: "", audience_type: "all", scheduled_at: "" });
    if (data?.id) {
      await supabase.functions.invoke("whatsapp-campaign-send", {
        body: { campaign_id: data.id, action: "build_recipients" },
      });
    }
    load();
  };

  const runNow = async (id: string) => {
    toast.info("بدأ التنفيذ...");
    const { data, error } = await supabase.functions.invoke("whatsapp-campaign-send", { body: { campaign_id: id } });
    if (error || data?.error) return toast.error(data?.error || error?.message || "فشل");
    toast.success("تم التنفيذ");
    load();
  };

  const filtered = campaigns.filter((c) =>
    (statusFilter === "all" || c.status === statusFilter) &&
    (!search || c.name.includes(search) || c.message_body.includes(search))
  );

  const summary = {
    total: campaigns.length,
    completed: campaigns.filter((c) => c.status === "completed").length,
    scheduled: campaigns.filter((c) => c.status === "scheduled").length,
    recipients: campaigns.reduce((a, c) => a + (c.total_recipients || 0), 0),
  };

  return (
    <WhatsappLayout>
      <div className="p-5 lg:p-6 space-y-5">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-violet-600" />
              الحملات الإعلانية
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">أنشئ حملات استهداف ذكية وجدولها بدقة</p>
          </div>
          <Dialog open={dialog} onOpenChange={setDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-md">
                <Plus className="w-4 h-4 ml-1.5" /> حملة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl" className="max-w-2xl">
              <DialogHeader><DialogTitle>إنشاء حملة جديدة</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>اسم الحملة</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="حملة عيد الفطر 2026" />
                </div>
                <div>
                  <Label>نص الرسالة (يدعم {`{{name}}`} و {`{{phone}}`})</Label>
                  <Textarea rows={6} value={form.message_body} onChange={(e) => setForm({ ...form, message_body: e.target.value })}
                    placeholder="مرحباً {{name}} 👋\nعرض حصري لك..." />
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {EMOJIS.slice(0, 16).map((e) => (
                      <button key={e} className="text-lg hover:scale-125 transition" onClick={() => setForm({ ...form, message_body: form.message_body + e })}>{e}</button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>الجمهور المستهدف</Label>
                    <Select value={form.audience_type} onValueChange={(v) => setForm({ ...form, audience_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">كل العملاء</SelectItem>
                        <SelectItem value="customers">العملاء النشطين</SelectItem>
                        <SelectItem value="membership">أصحاب العضويات</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>جدولة (اختياري)</Label>
                    <Input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} />
                  </div>
                </div>
                <Button onClick={create} className="w-full">
                  {form.scheduled_at ? "جدولة الحملة" : "حفظ كمسودة"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* بطاقات ملخص */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الحملات", value: summary.total, icon: Megaphone, color: "from-violet-500 to-purple-600" },
            { label: "المكتملة", value: summary.completed, icon: TrendingUp, color: "from-emerald-500 to-teal-600" },
            { label: "المجدولة", value: summary.scheduled, icon: Calendar, color: "from-amber-500 to-orange-600" },
            { label: "إجمالي المستلمين", value: summary.recipients.toLocaleString("ar-SA"), icon: Users, color: "from-blue-500 to-cyan-600" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="overflow-hidden border hover:shadow-md transition">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={cn("w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow", s.color)}>
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* فلاتر */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث في الحملات..." className="pr-8 h-9" />
          </div>
          {["all", ...Object.keys(STATUS_META)].map((k) => (
            <button key={k} onClick={() => setStatusFilter(k)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition",
                statusFilter === k ? "bg-foreground text-background border-foreground" : "bg-background hover:bg-muted text-muted-foreground"
              )}>
              {k === "all" ? "الكل" : STATUS_META[k]?.label}
            </button>
          ))}
        </div>

        {/* قائمة الحملات */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl">
              <Megaphone className="w-10 h-10 mx-auto mb-2 opacity-30" />
              لا توجد حملات بعد
            </div>
          )}
          <AnimatePresence>
            {filtered.map((c) => {
              const meta = STATUS_META[c.status] || STATUS_META.draft;
              const successRate = c.total_recipients > 0 ? Math.round((c.sent_count / c.total_recipients) * 100) : 0;
              return (
                <motion.div key={c.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="border rounded-xl p-4 hover:shadow-md transition bg-card">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">{c.name}</h3>
                        <span className={cn("text-[11px] px-2 py-0.5 rounded-full border font-medium", meta.bg, meta.color)}>
                          {meta.label}
                        </span>
                        {c.scheduled_at && (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(c.scheduled_at).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{c.message_body}</p>
                    </div>
                    {(c.status === "draft" || c.status === "scheduled") && (
                      <Button size="sm" onClick={() => runNow(c.id)}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                        <Send className="w-3.5 h-3.5 ml-1" /> أرسل الآن
                      </Button>
                    )}
                  </div>
                  {/* شريط تقدم */}
                  {c.total_recipients > 0 && (
                    <div className="mb-2">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${successRate}%` }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <Stat n={c.total_recipients} l="إجمالي" cls="bg-slate-100 text-slate-700" />
                    <Stat n={c.sent_count} l="تم" cls="bg-emerald-50 text-emerald-700" />
                    <Stat n={c.failed_count} l="فشل" cls="bg-rose-50 text-rose-700" />
                    <Stat n={`${successRate}%`} l="نجاح" cls="bg-violet-50 text-violet-700" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </WhatsappLayout>
  );
}

function Stat({ n, l, cls }: { n: any; l: string; cls: string }) {
  return (
    <div className={cn("rounded-lg p-2", cls)}>
      <div className="font-bold text-base">{n}</div>
      <div className="opacity-70 text-[10px]">{l}</div>
    </div>
  );
}
