// لوحة إحصائيات حملات الواتساب بالرسوم البيانية
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Users, CheckCircle2, XCircle, Eye, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CampaignStat {
  id: string;
  name: string;
  status: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  read_count: number;
  reply_count: number;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  sent: "hsl(142 76% 45%)",
  failed: "hsl(0 84% 60%)",
  read: "hsl(217 91% 60%)",
  reply: "hsl(280 65% 60%)",
};

export function CampaignAnalytics() {
  const [stats, setStats] = useState<CampaignStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("whatsapp_campaigns")
        .select("id, name, status, total_recipients, sent_count, failed_count, read_count, reply_count, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      setStats((data as CampaignStat[]) || []);
      setLoading(false);
    })();
  }, []);

  const totals = stats.reduce(
    (acc, s) => ({
      total: acc.total + (s.total_recipients || 0),
      sent: acc.sent + (s.sent_count || 0),
      failed: acc.failed + (s.failed_count || 0),
      read: acc.read + (s.read_count || 0),
      reply: acc.reply + (s.reply_count || 0),
    }),
    { total: 0, sent: 0, failed: 0, read: 0, reply: 0 },
  );

  const successRate = totals.total > 0 ? Math.round((totals.sent / totals.total) * 100) : 0;
  const readRate = totals.sent > 0 ? Math.round((totals.read / totals.sent) * 100) : 0;
  const replyRate = totals.sent > 0 ? Math.round((totals.reply / totals.sent) * 100) : 0;

  const pieData = [
    { name: "تم الإرسال", value: totals.sent, color: STATUS_COLORS.sent },
    { name: "فشل", value: totals.failed, color: STATUS_COLORS.failed },
    { name: "قُرئت", value: totals.read, color: STATUS_COLORS.read },
    { name: "ردّ عليها", value: totals.reply, color: STATUS_COLORS.reply },
  ].filter((d) => d.value > 0);

  const barData = stats.slice(0, 10).reverse().map((s) => ({
    name: s.name.length > 14 ? s.name.slice(0, 14) + "…" : s.name,
    تم: s.sent_count,
    فشل: s.failed_count,
    قُرئ: s.read_count,
  }));

  const cards = [
    { label: "إجمالي المستلمين", value: totals.total, icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "تم الإرسال", value: totals.sent, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
    { label: "فشل", value: totals.failed, icon: XCircle, color: "from-red-500 to-red-600" },
    { label: "نسبة القراءة", value: `${readRate}%`, icon: Eye, color: "from-indigo-500 to-indigo-600" },
    { label: "نسبة الرد", value: `${replyRate}%`, icon: MessageCircle, color: "from-purple-500 to-purple-600" },
    { label: "نسبة النجاح", value: `${successRate}%`, icon: TrendingUp, color: "from-amber-500 to-amber-600" },
  ];

  if (loading) return <div className="text-center py-12 text-muted-foreground">جاري التحميل...</div>;
  if (!stats.length) return <div className="text-center py-12 text-muted-foreground">لا توجد بيانات حملات بعد</div>;

  return (
    <div className="space-y-4">
      {/* بطاقات KPI */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="overflow-hidden">
              <CardContent className="p-3">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center mb-2`}>
                  <c.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-2xl font-bold">{c.value}</div>
                <div className="text-xs text-muted-foreground">{c.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* رسم شريطي */}
        <Card>
          <CardHeader><CardTitle className="text-base">آخر 10 حملات</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="تم" fill={STATUS_COLORS.sent} radius={[4, 4, 0, 0]} />
                <Bar dataKey="فشل" fill={STATUS_COLORS.failed} radius={[4, 4, 0, 0]} />
                <Bar dataKey="قُرئ" fill={STATUS_COLORS.read} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* رسم دائري */}
        <Card>
          <CardHeader><CardTitle className="text-base">التوزيع الإجمالي</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* قائمة تفصيلية */}
      <Card>
        <CardHeader><CardTitle className="text-base">تفاصيل الحملات</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {stats.map((s) => {
              const sr = s.total_recipients > 0 ? Math.round((s.sent_count / s.total_recipients) * 100) : 0;
              return (
                <div key={s.id} className="p-3 flex items-center gap-3 hover:bg-muted/50 transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{s.name}</span>
                      <Badge variant="outline" className="text-[10px]">{s.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(s.created_at).toLocaleDateString("ar-SA")}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div><div className="font-bold">{s.total_recipients}</div><div className="text-[10px] text-muted-foreground">إجمالي</div></div>
                    <div><div className="font-bold text-emerald-600">{s.sent_count}</div><div className="text-[10px] text-muted-foreground">تم</div></div>
                    <div><div className="font-bold text-destructive">{s.failed_count}</div><div className="text-[10px] text-muted-foreground">فشل</div></div>
                    <div><div className="font-bold text-blue-600">{s.read_count}</div><div className="text-[10px] text-muted-foreground">قُرئ</div></div>
                    <div><div className="font-bold text-primary">{sr}%</div><div className="text-[10px] text-muted-foreground">نجاح</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
