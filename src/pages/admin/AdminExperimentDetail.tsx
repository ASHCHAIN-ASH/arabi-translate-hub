import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExperimentDetail, callLifecycle } from '@/hooks/useAdminExperiments';
import { ArrowRight, Play, Pause, CheckCircle2, Archive, Trophy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from 'recharts';

const fmtPct = (n: number | null | undefined) => n == null ? '—' : `${(Number(n) * 100).toFixed(2)}%`;
const fmtNum = (n: number | null | undefined) => n == null ? '—' : Number(n).toLocaleString('ar');

export default function AdminExperimentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { experiment, variants, results, auditLogs, loading, reload } = useExperimentDetail(id);
  const [busy, setBusy] = useState(false);

  if (loading || !experiment) {
    return <div dir="rtl" className="container mx-auto p-6"><Card><CardContent className="p-12 text-center">جارِ التحميل...</CardContent></Card></div>;
  }

  const variantResults: any[] = results?.variants ?? [];
  const leaderId: string | null = results?.leader_variant_id ?? null;
  const totalAssigned = variantResults.reduce((s, v) => s + Number(v.assigned || 0), 0);
  const totalConv = variantResults.reduce((s, v) => s + Number(v.conversions || 0), 0);
  const overallRate = totalAssigned ? totalConv / totalAssigned : 0;

  // Auto-suggest winner: enough sample + leader has >5% lift + confidence > 90%
  const minSample = experiment.min_sample_size ?? 100;
  const leaderRow = variantResults.find((v) => v.variant_id === leaderId);
  const controlRow = variantResults.find((v) => v.is_control);
  const enough = (leaderRow?.assigned ?? 0) >= minSample && (controlRow?.assigned ?? 0) >= minSample;
  const lift = leaderRow?.lift_pct ?? null;
  const confidence = leaderRow?.confidence_pct ?? null;
  const suggestWinner = enough && leaderId && leaderId !== controlRow?.variant_id
    && lift != null && lift >= 5 && confidence != null && confidence >= 90;

  const action = async (act: 'launch' | 'pause' | 'complete' | 'archive', opts?: any) => {
    setBusy(true);
    try {
      const { error } = await callLifecycle(act, experiment.id, opts) as any;
      if (error) throw error;
      toast.success('تم بنجاح');
      reload();
    } catch (e: any) {
      toast.error(e?.message ?? 'فشل التنفيذ');
    } finally { setBusy(false); }
  };

  return (
    <div dir="rtl" className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" onClick={() => navigate('/adminmaster/experiments')} className="gap-1 mb-2">
            <ArrowRight className="h-4 w-4" /> رجوع للقائمة
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {experiment.name}
            <Badge variant="outline">{experiment.status}</Badge>
          </h1>
          <p className="text-sm text-muted-foreground font-mono">{experiment.experiment_key}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {experiment.status === 'draft' && <Button onClick={() => action('launch')} disabled={busy} className="gap-1"><Play className="h-4 w-4" /> إطلاق</Button>}
          {experiment.status === 'running' && <Button variant="outline" onClick={() => action('pause')} disabled={busy} className="gap-1"><Pause className="h-4 w-4" /> إيقاف مؤقت</Button>}
          {experiment.status === 'paused' && <Button onClick={() => action('launch')} disabled={busy} className="gap-1"><Play className="h-4 w-4" /> استئناف</Button>}
          {(experiment.status === 'running' || experiment.status === 'paused') && (
            <Button variant="outline" onClick={() => action('complete')} disabled={busy} className="gap-1"><CheckCircle2 className="h-4 w-4" /> إنهاء بدون فائز</Button>
          )}
          {experiment.status === 'completed' && (
            <Button variant="outline" onClick={() => action('archive')} disabled={busy} className="gap-1"><Archive className="h-4 w-4" /> أرشفة</Button>
          )}
        </div>
      </div>

      {/* Suggested winner banner */}
      {suggestWinner && experiment.status !== 'completed' && (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <div className="font-semibold">النظام يقترح فائزًا: {leaderRow?.name}</div>
                <div className="text-sm text-muted-foreground">
                  رفع +{lift?.toFixed(1)}% بثقة {confidence?.toFixed(1)}% — حجم العينة كافٍ.
                </div>
              </div>
            </div>
            <Button onClick={() => action('complete', { winner_variant_id: leaderId, note: 'auto-suggested winner' })} disabled={busy} className="gap-1">
              <Trophy className="h-4 w-4" /> اعتماد كفائز
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">إجمالي المعيّنين</div><div className="text-2xl font-bold mt-1">{fmtNum(totalAssigned)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">إجمالي التحويلات</div><div className="text-2xl font-bold mt-1">{fmtNum(totalConv)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">معدل التحويل</div><div className="text-2xl font-bold mt-1">{fmtPct(overallRate)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">المقياس الأساسي</div><div className="text-sm font-semibold mt-2">{experiment.primary_metric}</div></CardContent></Card>
      </div>

      {/* Variants comparison */}
      <Card>
        <CardHeader><CardTitle>مقارنة النسخ</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground border-b">
                <tr className="text-right">
                  <th className="p-2">النسخة</th>
                  <th className="p-2">المعيّنون</th>
                  <th className="p-2">المشاهدات</th>
                  <th className="p-2">التحويلات</th>
                  <th className="p-2">معدل التحويل</th>
                  <th className="p-2">Lift</th>
                  <th className="p-2">الثقة</th>
                  <th className="p-2">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {variantResults.map((v) => {
                  const isWinner = experiment.winner_variant_id === v.variant_id;
                  const isLeader = !isWinner && v.variant_id === leaderId && !v.is_control;
                  return (
                    <tr key={v.variant_id} className="border-b last:border-0">
                      <td className="p-2 font-medium">
                        {v.name} {v.is_control && <Badge variant="outline" className="ml-1 text-xs">Control</Badge>}
                      </td>
                      <td className="p-2">{fmtNum(v.assigned)}</td>
                      <td className="p-2">{fmtNum(v.views)}</td>
                      <td className="p-2">{fmtNum(v.conversions)}</td>
                      <td className="p-2 font-semibold">{fmtPct(v.conversion_rate)}</td>
                      <td className="p-2">{v.lift_pct == null ? '—' : <span className={v.lift_pct >= 0 ? 'text-emerald-600' : 'text-destructive'}>{v.lift_pct >= 0 ? '+' : ''}{v.lift_pct.toFixed(1)}%</span>}</td>
                      <td className="p-2">{v.confidence_pct == null ? '—' : `${v.confidence_pct.toFixed(0)}%`}</td>
                      <td className="p-2">
                        {isWinner && <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 gap-1"><Trophy className="h-3 w-3" /> فائز</Badge>}
                        {isLeader && <Badge className="bg-primary/15 text-primary">يتقدّم</Badge>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {variantResults.length > 0 && (
            <div className="h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={variantResults.map((v) => ({ name: v.name, rate: Number((v.conversion_rate * 100).toFixed(2)) }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(v: any) => `${v}%`} />
                  <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                    {variantResults.map((v, i) => (
                      <Cell key={i} fill={v.variant_id === leaderId ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Manual winner selection */}
          {(experiment.status === 'running' || experiment.status === 'paused') && (
            <div className="mt-6 border-t pt-4">
              <div className="text-sm font-semibold mb-2">اختيار فائز يدويًا</div>
              <div className="flex gap-2 flex-wrap">
                {variants.map((v) => (
                  <Button key={v.id} variant="outline" size="sm" disabled={busy}
                    onClick={() => action('complete', { winner_variant_id: v.id, note: 'manual selection' })}>
                    <Trophy className="h-3 w-3 ml-1" /> {v.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit */}
      <Card>
        <CardHeader><CardTitle className="text-base">سجل الإجراءات</CardTitle></CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا يوجد سجل حتى الآن.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {auditLogs.map((l: any) => (
                <li key={l.id} className="flex justify-between border-b last:border-0 pb-2">
                  <span><Badge variant="outline" className="ml-2">{l.action_type}</Badge>{l.note ?? ''}</span>
                  <span className="text-muted-foreground text-xs">{new Date(l.created_at).toLocaleString('ar')}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
