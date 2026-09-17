import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminExperiments, type ExperimentStatus } from '@/hooks/useAdminExperiments';
import { Beaker, Plus, TrendingUp, Search } from 'lucide-react';
import ExperimentBuilderDialog from '@/components/admin/experiments/ExperimentBuilderDialog';

const statusVariant: Record<ExperimentStatus, { label: string; className: string }> = {
  draft: { label: 'مسودة', className: 'bg-muted text-muted-foreground' },
  running: { label: 'قيد التشغيل', className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
  paused: { label: 'متوقف', className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400' },
  completed: { label: 'مكتمل', className: 'bg-primary/15 text-primary' },
  archived: { label: 'مؤرشف', className: 'bg-muted text-muted-foreground' },
};

const targetAreaLabel: Record<string, string> = {
  challenge_result_screen: 'شاشة نتيجة التحدي',
  referral_page: 'صفحة الإحالات',
  onboarding_flow: 'مسار الترحيب',
  share_cta: 'زر المشاركة',
};

export default function AdminExperiments() {
  const { experiments, loading, reload } = useAdminExperiments();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<string>('all');

  const filtered = experiments.filter((e) => {
    if (status !== 'all' && e.status !== status) return false;
    if (q && !`${e.name} ${e.experiment_key}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div dir="rtl" className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Beaker className="h-8 w-8 text-primary" />
            تجارب A/B
          </h1>
          <p className="text-muted-foreground mt-1">اختبر القرارات قبل تعميمها — وحسّن التحويل بقياس فعلي.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          تجربة جديدة
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث بالاسم أو المفتاح..." className="pr-10" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="draft">مسودة</SelectItem>
              <SelectItem value="running">قيد التشغيل</SelectItem>
              <SelectItem value="paused">متوقف</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="archived">مؤرشف</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => <Card key={i}><CardContent className="p-6 h-24 animate-pulse bg-muted/30" /></Card>)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Beaker className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold">لا توجد تجارب بعد</h3>
            <p className="text-muted-foreground mb-4">ابدأ أول تجربة لتحسين منتجك بناءً على البيانات.</p>
            <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> تجربة جديدة</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((e) => {
            const s = statusVariant[e.status];
            return (
              <Card key={e.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(`/adminfekrah/experiments/${e.id}`)}>
                <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="text-lg">{e.name}</CardTitle>
                      <Badge className={s.className}>{s.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono">{e.experiment_key}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><div className="text-muted-foreground">المنطقة</div><div className="font-medium">{targetAreaLabel[e.target_area]}</div></div>
                  <div><div className="text-muted-foreground">المقياس الأساسي</div><div className="font-medium">{e.primary_metric}</div></div>
                  <div><div className="text-muted-foreground">نسبة المرور</div><div className="font-medium">{e.traffic_allocation_percentage}%</div></div>
                  <div><div className="text-muted-foreground">بدأت في</div><div className="font-medium">{e.start_at ? new Date(e.start_at).toLocaleDateString('ar') : '—'}</div></div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <ExperimentBuilderDialog open={open} onOpenChange={setOpen} onCreated={reload} />
    </div>
  );
}
