import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/data/legacy/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { FileText, CheckCircle2, Clock, XCircle, TrendingUp, DollarSign } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

interface ContractDataPoint {
  status: string | null;
  signed_at: string | null;
  created_at: string;
  total_amount: number | null;
  service_type: string | null;
}

const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

const STATUS_PALETTE: Record<string, string> = {
  signed: "hsl(142 76% 36%)",
  active: "hsl(142 76% 36%)",
  completed: "hsl(173 58% 39%)",
  pending_signature: "hsl(38 92% 50%)",
  draft: "hsl(220 9% 64%)",
  cancelled: "hsl(0 72% 51%)",
  expired: "hsl(0 72% 51%)",
};

const STATUS_LABELS_AR: Record<string, string> = {
  signed: "موقّع",
  active: "نشط",
  completed: "مكتمل",
  pending_signature: "بانتظار التوقيع",
  draft: "مسودة",
  cancelled: "ملغي",
  expired: "منتهي",
};

const ContractsAnalytics: React.FC = () => {
  const [rows, setRows] = useState<ContractDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("contracts")
        .select("status, signed_at, created_at, total_amount, service_type")
        .order("created_at", { ascending: true });
      setRows((data as ContractDataPoint[]) || []);
      setLoading(false);
    })();
  }, []);

  const yearRows = useMemo(
    () => rows.filter(r => new Date(r.created_at).getFullYear() === year),
    [rows, year]
  );

  const monthlySeries = useMemo(() => {
    const acc = MONTHS_AR.map((m, i) => ({
      month: m,
      idx: i,
      created: 0,
      signed: 0,
      pending: 0,
      cancelled: 0,
      revenue: 0,
    }));
    yearRows.forEach(r => {
      const m = new Date(r.created_at).getMonth();
      acc[m].created += 1;
      const s = r.status || "draft";
      if (["signed", "active", "completed"].includes(s)) {
        acc[m].signed += 1;
        acc[m].revenue += Number(r.total_amount || 0);
      } else if (s === "pending_signature") acc[m].pending += 1;
      else if (["cancelled", "expired"].includes(s)) acc[m].cancelled += 1;
    });
    return acc;
  }, [yearRows]);

  const statusBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    yearRows.forEach(r => {
      const s = r.status || "draft";
      map[s] = (map[s] || 0) + 1;
    });
    return Object.entries(map).map(([status, count]) => ({
      status,
      label: STATUS_LABELS_AR[status] || status,
      count,
      fill: STATUS_PALETTE[status] || "hsl(220 9% 64%)",
    }));
  }, [yearRows]);

  const totals = useMemo(() => {
    const total = yearRows.length;
    const signed = yearRows.filter(r => ["signed", "active", "completed"].includes(r.status || "")).length;
    const pending = yearRows.filter(r => r.status === "pending_signature").length;
    const cancelled = yearRows.filter(r => ["cancelled", "expired"].includes(r.status || "")).length;
    const revenue = yearRows
      .filter(r => ["signed", "active", "completed"].includes(r.status || ""))
      .reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
    const conversion = total > 0 ? Math.round((signed / total) * 100) : 0;
    return { total, signed, pending, cancelled, revenue, conversion };
  }, [yearRows]);

  const availableYears = useMemo(() => {
    const ys = new Set<number>();
    rows.forEach(r => ys.add(new Date(r.created_at).getFullYear()));
    ys.add(new Date().getFullYear());
    return Array.from(ys).sort((a, b) => b - a);
  }, [rows]);

  const chartConfig = {
    signed: { label: "موقّع", color: "hsl(142 76% 36%)" },
    pending: { label: "بانتظار التوقيع", color: "hsl(38 92% 50%)" },
    cancelled: { label: "ملغي", color: "hsl(0 72% 51%)" },
    created: { label: "إنشاء", color: "hsl(217 91% 60%)" },
    revenue: { label: "الإيرادات", color: "hsl(142 76% 36%)" },
  };

  return (
    <AdminLayout>
      <div dir="rtl" className="space-y-6 p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-7 w-7 text-primary" />
              إحصائيات العقود
            </h1>
            <p className="text-sm text-muted-foreground mt-1">تحليل شامل للعقود الموقّعة والمعلقة بشكل شهري</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">السنة:</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border rounded-md px-3 py-1.5 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </motion.div>

        {loading ? (
          <Card><CardContent className="py-16 text-center">
            <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full mx-auto" />
          </CardContent></Card>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "إجمالي العقود", value: totals.total, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
                { label: "موقّعة", value: totals.signed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10" },
                { label: "بانتظار التوقيع", value: totals.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-500/10" },
                { label: "ملغية", value: totals.cancelled, icon: XCircle, color: "text-red-600", bg: "bg-red-500/10" },
                { label: "نسبة التحويل", value: `${totals.conversion}%`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-500/10" },
                { label: "الإيرادات (ر.س)", value: totals.revenue.toLocaleString("ar-SA"), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-500/10" },
              ].map((kpi, i) => (
                <motion.div key={kpi.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card className="hover:shadow-md transition">
                    <CardContent className="p-4">
                      <div className={`${kpi.bg} ${kpi.color} h-9 w-9 rounded-lg flex items-center justify-center mb-2`}>
                        <kpi.icon className="h-5 w-5" />
                      </div>
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                      <p className="text-xl font-bold mt-1">{kpi.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Monthly Stacked Bar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">العقود الشهرية حسب الحالة — {year}</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[320px] w-full">
                  <BarChart data={monthlySeries}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="signed" stackId="a" fill="hsl(142 76% 36%)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="pending" stackId="a" fill="hsl(38 92% 50%)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="cancelled" stackId="a" fill="hsl(0 72% 51%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Line */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                    الإيرادات الشهرية (ر.س)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <LineChart data={monthlySeries}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(142 76% 36%)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Status Pie */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">توزيع العقود حسب الحالة</CardTitle>
                </CardHeader>
                <CardContent>
                  {statusBreakdown.length === 0 ? (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
                      لا توجد بيانات لهذا العام
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie data={statusBreakdown} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2} label={(e: any) => `${e.label}: ${e.count}`} labelLine={false}>
                          {statusBreakdown.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Monthly breakdown table */}
            <Card>
              <CardHeader><CardTitle className="text-lg">تفاصيل شهرية</CardTitle></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-right">
                      <tr>
                        <th className="p-3 font-semibold">الشهر</th>
                        <th className="p-3 font-semibold">منشأة</th>
                        <th className="p-3 font-semibold text-emerald-600">موقّعة</th>
                        <th className="p-3 font-semibold text-amber-600">بانتظار</th>
                        <th className="p-3 font-semibold text-red-600">ملغية</th>
                        <th className="p-3 font-semibold">الإيرادات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlySeries.map((m, i) => (
                        <tr key={i} className="border-t hover:bg-muted/30 transition">
                          <td className="p-3 font-medium">{m.month}</td>
                          <td className="p-3">{m.created}</td>
                          <td className="p-3 text-emerald-600 font-semibold">{m.signed}</td>
                          <td className="p-3 text-amber-600 font-semibold">{m.pending}</td>
                          <td className="p-3 text-red-600 font-semibold">{m.cancelled}</td>
                          <td className="p-3 font-mono">{m.revenue.toLocaleString("ar-SA")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContractsAnalytics;