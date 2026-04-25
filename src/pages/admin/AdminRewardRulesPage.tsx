import React, { useEffect, useState } from 'react';
import { Settings2, AlertCircle, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

interface RewardRule {
  id: string;
  code: string;
  name_ar: string;
  description_ar: string | null;
  source_type: string;
  points_reward: number;
  cash_reward: number;
  daily_limit: number;
  is_active: boolean;
}

export default function AdminRewardRulesPage() {
  const [rules, setRules] = useState<RewardRule[]>([]);
  const [edits, setEdits] = useState<Record<string, Partial<RewardRule>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const { data, error: e } = await (supabase as any)
        .from('reward_rules')
        .select('*')
        .order('source_type');
      if (e) throw e;
      setRules(data || []);
    } catch (e: any) {
      setError(e?.message || 'تعذّر التحميل');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateField = (id: string, field: keyof RewardRule, value: any) => {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const save = async (rule: RewardRule) => {
    const patch = edits[rule.id];
    if (!patch) return;
    setSavingId(rule.id);
    try {
      const { error } = await (supabase as any)
        .from('reward_rules')
        .update(patch)
        .eq('id', rule.id);
      if (error) throw error;
      toast.success('تم الحفظ');
      setEdits(prev => { const n = { ...prev }; delete n[rule.id]; return n; });
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'تعذّر الحفظ');
    } finally {
      setSavingId(null);
    }
  };

  const toggleActive = async (rule: RewardRule, value: boolean) => {
    try {
      const { error } = await (supabase as any)
        .from('reward_rules')
        .update({ is_active: value })
        .eq('id', rule.id);
      if (error) throw error;
      toast.success(value ? 'تم تفعيل القاعدة' : 'تم تعطيل القاعدة');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'تعذّر التحديث');
    }
  };

  return (
    <AdminLayout title="قواعد المكافآت">
      <div dir="rtl" className="space-y-6 p-6">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
              <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">قواعد منح النقاط</h2>
              <p className="text-xs text-muted-foreground">
                تتحكم هذه القواعد في كم نقطة يكسبها الطالب من كل نشاط، والحد اليومي لكل نوع.
              </p>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card><CardContent className="flex items-center gap-2 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" /> {error}
          </CardContent></Card>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {rules.map(rule => {
              const e = edits[rule.id] || {};
              const merged = { ...rule, ...e };
              const dirty = !!edits[rule.id];
              return (
                <Card key={rule.id} className={dirty ? 'ring-2 ring-violet-300' : ''}>
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{rule.code}</code>
                          <Badge variant="outline">{rule.source_type}</Badge>
                        </div>
                        <h3 className="mt-1 font-bold">{rule.name_ar}</h3>
                        {rule.description_ar && (
                          <p className="text-xs text-muted-foreground">{rule.description_ar}</p>
                        )}
                      </div>
                      <Switch
                        checked={merged.is_active}
                        onCheckedChange={(v) => toggleActive(rule, v)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium">نقاط المكافأة</label>
                        <Input
                          type="number" min={0}
                          value={merged.points_reward}
                          onChange={(ev) => updateField(rule.id, 'points_reward', Number(ev.target.value))}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium">الحد اليومي</label>
                        <Input
                          type="number" min={0}
                          value={merged.daily_limit}
                          onChange={(ev) => updateField(rule.id, 'daily_limit', Number(ev.target.value))}
                        />
                        <p className="mt-1 text-[10px] text-muted-foreground">0 = بدون حد</p>
                      </div>
                    </div>

                    {dirty && (
                      <Button
                        onClick={() => save(rule)}
                        disabled={savingId === rule.id}
                        className="w-full bg-violet-600 text-white hover:bg-violet-700"
                      >
                        <Save className="me-2 h-4 w-4" />
                        {savingId === rule.id ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
