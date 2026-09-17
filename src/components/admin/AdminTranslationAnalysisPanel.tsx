/**
 * AdminTranslationAnalysisPanel
 * Lists translation_file_analyses for a given service order, with inline
 * price approval (approved_price_sar) and admin notes.
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '@/data/legacy/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CheckCircle2, FileSearch, Languages, Hash, Tag, Gauge, Loader2 } from 'lucide-react';

interface Row {
  id: string;
  file_name: string;
  file_type: string;
  word_count: number;
  character_count: number;
  estimated_pages: number;
  detected_language: string;
  domain: string;
  domain_source: string;
  domain_confidence: number;
  estimated_price_sar: number;
  approved_price_sar: number | null;
  approval_status: string;
  confidence_level: string;
  is_fallback: boolean;
  analysis_method: string;
  analysis_notes: string | null;
  text_sample: string | null;
  admin_notes: string | null;
}

const LANG: Record<string, string> = { ar: 'العربية', en: 'الإنجليزية', mixed: 'مختلط', unknown: 'غير محدد' };
const DOMAIN: Record<string, string> = { general: 'عام', academic: 'أكاديمي', legal: 'قانوني', medical: 'طبي', technical: 'تقني' };
const CONF: Record<string, string> = { high: 'مرتفع', medium: 'متوسط', low: 'منخفض' };

const AdminTranslationAnalysisPanel: React.FC<{ serviceOrderId: string }> = ({ serviceOrderId }) => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, { price: string; notes: string }>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('translation_file_analyses' as any)
      .select('*')
      .eq('service_order_id', serviceOrderId)
      .order('created_at', { ascending: true });
    if (error) toast.error('تعذّر تحميل التحليلات');
    setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { if (serviceOrderId) load(); /* eslint-disable-next-line */ }, [serviceOrderId]);

  const approve = async (row: Row) => {
    const draft = drafts[row.id];
    const price = draft?.price ? Number(draft.price) : row.estimated_price_sar;
    const notes = draft?.notes ?? row.admin_notes ?? '';
    const { error } = await supabase
      .from('translation_file_analyses' as any)
      .update({
        approved_price_sar: price,
        approval_status: price === row.estimated_price_sar ? 'approved' : 'adjusted',
        approved_at: new Date().toISOString(),
        admin_notes: notes,
      } as any)
      .eq('id', row.id);
    if (error) return toast.error('فشل اعتماد السعر');
    toast.success('تم اعتماد السعر');
    load();
  };

  if (loading) {
    return <div className="flex items-center gap-2 text-sm text-muted-foreground p-4"><Loader2 className="h-4 w-4 animate-spin" /> جارٍ تحميل تحليل الملفات...</div>;
  }
  if (rows.length === 0) {
    return <div className="text-sm text-muted-foreground p-4">لا توجد تحليلات ملفات ترجمة لهذا الطلب.</div>;
  }

  const totalEstimated = rows.reduce((s, r) => s + Number(r.estimated_price_sar || 0), 0);
  const totalApproved = rows.reduce((s, r) => s + Number(r.approved_price_sar ?? r.estimated_price_sar ?? 0), 0);

  return (
    <div className="space-y-3" dir="rtl">
      <div className="grid grid-cols-2 gap-2">
        <Card><CardContent className="p-3">
          <p className="text-[11px] text-muted-foreground">إجمالي تقديري</p>
          <p className="text-lg font-bold">{totalEstimated.toLocaleString('ar-SA')} ر.س</p>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <p className="text-[11px] text-muted-foreground">إجمالي بعد الاعتماد</p>
          <p className="text-lg font-bold text-primary">{totalApproved.toLocaleString('ar-SA')} ر.س</p>
        </CardContent></Card>
      </div>

      {rows.map((row) => {
        const draft = drafts[row.id] || { price: String(row.approved_price_sar ?? row.estimated_price_sar), notes: row.admin_notes ?? '' };
        return (
          <Card key={row.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileSearch className="h-4 w-4 text-primary" />
                  {row.file_name}
                </CardTitle>
                <Badge variant={row.approval_status === 'approved' ? 'default' : row.approval_status === 'adjusted' ? 'secondary' : 'outline'} className="text-[10px]">
                  {row.approval_status === 'approved' ? 'معتمد' : row.approval_status === 'adjusted' ? 'معدّل' : 'بانتظار الاعتماد'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <Stat icon={Hash} label="كلمات" value={row.word_count.toLocaleString('ar-SA')} />
                <Stat icon={FileSearch} label="صفحات" value={String(row.estimated_pages)} />
                <Stat icon={Languages} label="لغة" value={LANG[row.detected_language] ?? row.detected_language} />
                <Stat icon={Tag} label="مجال" value={`${DOMAIN[row.domain] ?? row.domain} (${row.domain_source})`} />
                <Stat icon={Gauge} label="ثقة" value={`${CONF[row.confidence_level] ?? row.confidence_level}${row.is_fallback ? ' • تقديري' : ''}`} />
                <Stat icon={CheckCircle2} label="طريقة" value={row.analysis_method} />
                <Stat icon={Hash} label="أحرف" value={row.character_count.toLocaleString('ar-SA')} />
                <Stat icon={Tag} label="تقديري" value={`${Number(row.estimated_price_sar).toLocaleString('ar-SA')} ر.س`} />
              </div>

              {row.analysis_notes && (
                <p className="text-[11px] text-muted-foreground border-r-2 border-primary/30 pr-2">{row.analysis_notes}</p>
              )}
              {row.text_sample && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">عينة من النص المستخرج</summary>
                  <p className="mt-1 text-muted-foreground line-clamp-4">{row.text_sample}</p>
                </details>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end pt-2 border-t">
                <div className="sm:col-span-1">
                  <label className="text-[11px] text-muted-foreground">السعر المعتمد (ر.س)</label>
                  <Input
                    type="number" min={0}
                    value={draft.price}
                    onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: { ...draft, price: e.target.value } }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-muted-foreground">ملاحظات الإدارة</label>
                  <Textarea
                    rows={1}
                    value={draft.notes}
                    onChange={(e) => setDrafts((d) => ({ ...d, [row.id]: { ...draft, notes: e.target.value } }))}
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                  <Button size="sm" onClick={() => approve(row)}>
                    <CheckCircle2 className="h-3.5 w-3.5 ml-1" /> اعتماد
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const Stat: React.FC<{ icon: any; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border bg-muted/20 p-2">
    <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Icon className="h-3 w-3" /> {label}</div>
    <p className="text-xs font-bold mt-0.5">{value}</p>
  </div>
);

export default AdminTranslationAnalysisPanel;
