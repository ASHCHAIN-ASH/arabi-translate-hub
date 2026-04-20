import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Clock, Users } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Stats {
  daily: { date: string; count: number; replied: number }[];
  byForm: { name: string; value: number }[];
  avgResponseMinutes: number;
  total: number;
  totalReplied: number;
}

export const InboxAnalyticsDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: msgs } = await supabase
        .from('inbox_messages')
        .select('id, created_at, form_type, status')
        .gte('created_at', since)
        .limit(1000);
      const { data: rep } = await supabase
        .from('inbox_replies')
        .select('message_id, created_at')
        .gte('created_at', since)
        .limit(1000);
      setData(msgs ?? []);
      setReplies(rep ?? []);
    })();
  }, [open]);

  const stats: Stats = useMemo(() => {
    const dayMap = new Map<string, { count: number; replied: number }>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      dayMap.set(k, { count: 0, replied: 0 });
    }
    data.forEach((m) => {
      const k = m.created_at.slice(0, 10);
      const v = dayMap.get(k);
      if (v) { v.count++; if (m.status === 'replied') v.replied++; }
    });
    const formMap = new Map<string, number>();
    data.forEach((m) => formMap.set(m.form_type, (formMap.get(m.form_type) ?? 0) + 1));

    // Avg response time: first reply per message
    const firstReply = new Map<string, string>();
    [...replies].sort((a, b) => a.created_at.localeCompare(b.created_at))
      .forEach((r) => { if (!firstReply.has(r.message_id)) firstReply.set(r.message_id, r.created_at); });
    let totalMin = 0, n = 0;
    data.forEach((m) => {
      const r = firstReply.get(m.id);
      if (r) { totalMin += (new Date(r).getTime() - new Date(m.created_at).getTime()) / 60000; n++; }
    });

    return {
      daily: Array.from(dayMap, ([date, v]) => ({ date: date.slice(5), ...v })),
      byForm: Array.from(formMap, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6),
      avgResponseMinutes: n ? Math.round(totalMin / n) : 0,
      total: data.length,
      totalReplied: data.filter((m) => m.status === 'replied').length,
    };
  }, [data, replies]);

  const fmtDuration = (min: number) => {
    if (min < 60) return `${min} د`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h} س ${min % 60} د`;
    return `${Math.floor(h / 24)} يوم ${h % 24} س`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <BarChart3 className="w-3.5 h-3.5" />
          التحليلات
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            تحليلات صندوق الوارد · آخر 30 يوماً
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Users, label: 'إجمالي الرسائل', val: stats.total, color: 'text-primary bg-primary/10' },
            { icon: TrendingUp, label: 'تم الرد عليها', val: stats.totalReplied, color: 'text-emerald-600 bg-emerald-500/10' },
            { icon: Clock, label: 'متوسط زمن الرد', val: fmtDuration(stats.avgResponseMinutes), color: 'text-amber-600 bg-amber-500/10' },
            { icon: BarChart3, label: 'معدل الاستجابة', val: stats.total ? `${Math.round(stats.totalReplied / stats.total * 100)}%` : '0%', color: 'text-violet-600 bg-violet-500/10' },
          ].map((s, i) => (
            <Card key={i}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  <div className="font-bold">{s.val}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-2">
          <Card>
            <CardContent className="p-3">
              <div className="text-sm font-semibold mb-2">الرسائل اليومية (14 يوم)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.daily}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="رسائل" />
                  <Line type="monotone" dataKey="replied" stroke="hsl(142 76% 36%)" strokeWidth={2} dot={false} name="تم الرد" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="text-sm font-semibold mb-2">حسب نوع الفورم</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.byForm} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={() => {
            const rows = [['التاريخ', 'العدد', 'تم الرد']].concat(stats.daily.map((d) => [d.date, String(d.count), String(d.replied)]));
            const csv = rows.map((r) => r.join(',')).join('\n');
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `inbox-stats-${new Date().toISOString().slice(0, 10)}.csv`;
            a.click(); URL.revokeObjectURL(url);
          }}>تصدير CSV</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
